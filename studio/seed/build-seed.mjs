// Turns js/demo-data.js into seed/seed.ndjson for `sanity dataset import`.
// Run with: npm run seed
import {readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import vm from 'node:vm'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
vm.runInThisContext(readFileSync(here('../../js/demo-data.js'), 'utf8'))
const {categories, author, posts} = globalThis.KEDAIPAL_DEMO

const docs = [
  ...categories.map((c) => ({
    _id: `category-${c.slug}`,
    _type: 'category',
    title: c.title,
    slug: {_type: 'slug', current: c.slug},
    order: c.order,
  })),
  {_id: 'author-kedaipal-team', _type: 'author', name: author.name, role: author.role},
  ...posts.map((p) => ({
    _id: `post-${p.slug}`,
    _type: 'post',
    title: p.title,
    slug: {_type: 'slug', current: p.slug},
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    featured: Boolean(p.featured),
    coverText: p.coverText,
    coverStyle: p.coverStyle,
    category: {_type: 'reference', _ref: `category-${p.category.slug}`},
    author: {_type: 'reference', _ref: 'author-kedaipal-team'},
    body: p.body,
  })),
]

writeFileSync(here('seed.ndjson'), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to seed/seed.ndjson`)
