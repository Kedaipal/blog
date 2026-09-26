/*
 * Data layer + HTML helpers shared by index.html and post.html.
 * Reads published posts from Sanity's public HTTP API (no token needed for a public dataset).
 */
window.Blog = (function () {
  const cfg = window.SANITY_CONFIG || {};
  const live = Boolean(cfg.projectId);

  const IMAGE = `{alt, crop, hotspot, asset->{url, metadata{dimensions}}}`;
  const CARD = `
    title, "slug": slug.current, excerpt, publishedAt, featured, coverText, coverStyle,
    mainImage${IMAGE},
    "category": category->{title, "slug": slug.current},
    "author": author->{name, role, image${IMAGE}},
    "chars": length(pt::text(body))`;

  async function query(groq, params = {}) {
    const host = cfg.useCdn === false ? 'api' : 'apicdn';
    const url = new URL(`https://${cfg.projectId}.${host}.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}`);
    url.searchParams.set('query', groq);
    for (const [k, v] of Object.entries(params)) url.searchParams.set('$' + k, JSON.stringify(v));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    return (await res.json()).result;
  }

  // ---------- Queries ----------

  const demo = () => {
    const d = window.KEDAIPAL_DEMO;
    const withChars = p => ({ ...p, chars: blocksToText(p.body).length });
    return { categories: d.categories, posts: d.posts.map(withChars) };
  };

  async function getIndex() {
    if (!live) return demo();
    return query(`{
      "categories": *[_type == "category"] | order(order asc, title asc){title, "slug": slug.current},
      "posts": *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){${CARD}}
    }`);
  }

  async function getPost(slug) {
    let post, others;
    if (!live) {
      const { posts } = demo();
      post = posts.find(p => p.slug === slug);
      others = posts.filter(p => p.slug !== slug);
    } else {
      const r = await query(`{
        "post": *[_type == "post" && slug.current == $slug][0]{
          ${CARD},
          body[]{..., _type == "image" => ${IMAGE.slice(0, -1)}, caption}}
        },
        "others": *[_type == "post" && slug.current != $slug && publishedAt <= now()] | order(publishedAt desc)[0...12]{${CARD}}
      }`, { slug });
      post = r.post; others = r.others;
    }
    if (!post) return null;
    // Related: same category first, then newest
    const sameCat = p => (p.category?.slug === post.category?.slug ? 0 : 1);
    post.related = [...others].sort((a, b) => sameCat(a) - sameCat(b)).slice(0, 3);
    return post;
  }

  // ---------- Helpers ----------

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const formatDate = iso => iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const readTime = chars => `${Math.max(1, Math.round((chars || 0) / 5 / 200))} min read`;

  const postUrl = slug => `post.html?slug=${encodeURIComponent(slug)}`;

  const initials = name => (name || 'K').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // Sanity image CDN URL, honouring the crop and hotspot set in the Studio
  function imageUrl(img, w, h) {
    const a = img?.asset;
    if (!a?.url) return '';
    const u = new URL(a.url);
    const d = a.metadata?.dimensions;
    const c = img.crop;
    if (c && d) {
      const left = Math.round(c.left * d.width), top = Math.round(c.top * d.height);
      const width = Math.round(d.width * (1 - c.left - c.right)), height = Math.round(d.height * (1 - c.top - c.bottom));
      if (left || top || width !== d.width || height !== d.height) u.searchParams.set('rect', `${left},${top},${width},${height}`);
    }
    u.searchParams.set('w', w);
    if (h) {
      u.searchParams.set('h', h);
      u.searchParams.set('fit', 'crop');
      if (img.hotspot) {
        const cl = c?.left || 0, cr = c?.right || 0, ct = c?.top || 0, cb = c?.bottom || 0;
        u.searchParams.set('crop', 'focalpoint');
        u.searchParams.set('fp-x', ((img.hotspot.x - cl) / (1 - cl - cr)).toFixed(3));
        u.searchParams.set('fp-y', ((img.hotspot.y - ct) / (1 - ct - cb)).toFixed(3));
      }
    }
    u.searchParams.set('auto', 'format');
    u.searchParams.set('q', '80');
    return u.toString();
  }

  function imgTag(img, w, h, { alt = '', eager = false } = {}) {
    const src = imageUrl(img, w, h);
    const src2x = imageUrl(img, w * 2, h && h * 2);
    return `<img src="${esc(src)}" srcset="${esc(src)} 1x, ${esc(src2x)} 2x" alt="${esc(img.alt || alt)}"`
      + ` ${h ? `width="${w}" height="${h}"` : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`;
  }

  // Cover image, or the branded colour block when no image is uploaded.
  // Sizes follow the layout: 16:10 cards (600×375 @1x), 21:9 article banner (900×386 @1x).
  function cover(post, { wide = false, eager = false } = {}) {
    const [w, h] = wide ? [900, 386] : [600, 375];
    if (post.mainImage?.asset) {
      return `<div class="cover">${imgTag(post.mainImage, w, h, { alt: post.title, eager })}</div>`;
    }
    const style = { light: ' cover--light', green: ' cover--green' }[post.coverStyle] || '';
    return `<div class="cover${style}"><span class="cover-mark">${esc(post.coverText || post.title)}</span></div>`;
  }

  function avatar(author) {
    if (author?.image?.asset) return `<span class="avatar">${imgTag(author.image, 72, 72, { alt: author.name })}</span>`;
    return `<span class="avatar">${esc(initials(author?.name))}</span>`;
  }

  function card(post, { excerpt = true } = {}) {
    return `
      <a class="card" href="${postUrl(post.slug)}" data-category="${esc(post.category?.slug)}">
        ${cover(post)}
        <div class="meta">${post.category ? `<span class="tag">${esc(post.category.title)}</span>` : ''}<span>${readTime(post.chars)}</span></div>
        <h3>${esc(post.title)}</h3>
        ${excerpt && post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ''}
      </a>`;
  }

  // ---------- Portable Text → HTML ----------

  function blocksToText(blocks = []) {
    return blocks.map(b => (b._type === 'block' ? b.children.map(c => c.text).join('') : b.text || '')).join(' ');
  }

  function spans(block) {
    const defs = Object.fromEntries((block.markDefs || []).map(d => [d._key, d]));
    return (block.children || []).map(child => {
      let html = esc(child.text).replace(/\n/g, '<br />');
      for (const m of child.marks || []) {
        if (m === 'strong') html = `<strong>${html}</strong>`;
        else if (m === 'em') html = `<em>${html}</em>`;
        else if (m === 'code') html = `<code>${html}</code>`;
        else if (defs[m]?._type === 'link' && /^(https?:|mailto:|tel:|\/|#)/.test(defs[m].href || '')) {
          const ext = /^https?:/.test(defs[m].href) && !defs[m].href.includes('kedaipal.com');
          html = `<a href="${esc(defs[m].href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${html}</a>`;
        }
      }
      return html;
    }).join('');
  }

  function portableText(blocks = []) {
    let out = '', list = null;
    const closeList = () => { if (list) { out += `</${list}>`; list = null; } };
    for (const b of blocks) {
      if (b._type === 'block' && b.listItem) {
        const tag = b.listItem === 'number' ? 'ol' : 'ul';
        if (list !== tag) { closeList(); out += `<${tag}>`; list = tag; }
        out += `<li>${spans(b)}</li>`;
        continue;
      }
      closeList();
      if (b._type === 'block') {
        const tag = { h2: 'h2', h3: 'h3', blockquote: 'blockquote' }[b.style] || 'p';
        const inner = spans(b);
        if (inner.trim()) out += `<${tag}>${inner}</${tag}>`;
      } else if (b._type === 'image' && b.asset) {
        out += `<figure>${imgTag(b, 1344)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      } else if (b._type === 'callout') {
        out += `<div class="callout">${b.label ? `<strong>${esc(b.label)}:</strong> ` : ''}${esc(b.text)}</div>`;
      } else if (b._type === 'divider') {
        out += '<hr />';
      }
    }
    closeList();
    return out;
  }

  return { live, getIndex, getPost, esc, formatDate, readTime, postUrl, cover, avatar, card, portableText };
})();
