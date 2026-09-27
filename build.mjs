/*
 * Assembles dist/ — exactly what gets published to blog.kedaipal.com.
 *
 * This is an ALLOW-LIST, deliberately. The blog is a PUBLIC site, so everything
 * copied here is readable by the whole internet. A deny-list ("copy all, skip a
 * few") would publish any newly added folder by default; an allow-list keeps a
 * new folder private until someone names it below. The cost is that a new
 * top-level FILE would 404 until it is listed — a loud, obvious failure, which
 * is the one worth having.
 *
 * Root-level *.html is picked up automatically, so adding a page needs no edit
 * here. Directories stay explicit, because that is where an accidental leak
 * would live.
 *
 * Deliberately NOT published:
 *   studio/    the Sanity Studio. It is a separate app and deploys on its own to
 *              https://kedaipal-blog.sanity.studio via `cd studio && npm run deploy`.
 *   README.md, build.mjs, wrangler.jsonc, package.json — repo plumbing.
 */
import {cpSync, existsSync, mkdirSync, readdirSync, rmSync} from 'node:fs'

/** Directories published as-is. Add new asset folders here. */
const DIRS = ['js', 'assets']

/** Individual files published. Root-level *.html is added automatically below. */
const FILES = ['styles.css']

const OUT = 'dist'

rmSync(OUT, {recursive: true, force: true})
mkdirSync(OUT, {recursive: true})

const pages = readdirSync('.').filter((name) => name.endsWith('.html'))
if (pages.length === 0) {
  console.error('build: no .html files found at the repo root — nothing to publish.')
  process.exit(1)
}

const copied = []
for (const entry of [...pages, ...FILES, ...DIRS]) {
  if (!existsSync(entry)) {
    console.error(`build: "${entry}" is listed in build.mjs but does not exist.`)
    process.exit(1)
  }
  cpSync(entry, `${OUT}/${entry}`, {recursive: true})
  copied.push(entry)
}

console.log(`build: ${OUT}/ ready — ${copied.join(', ')}`)
