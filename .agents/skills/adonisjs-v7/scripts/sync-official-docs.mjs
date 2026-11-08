#!/usr/bin/env node
/** Download official AdonisJS Markdown for local reference only.
 * Usage: node scripts/sync-official-docs.mjs --list | --all | --only routing,validation
 * Avoid redistributing fetched docs without checking upstream license/terms.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptDir, '..')
const manifest = JSON.parse(await fs.readFile(path.join(scriptDir, 'official-docs-manifest.json'), 'utf8'))
const args = process.argv.slice(2)
const onlyFlag = args.find((arg) => arg.startsWith('--only='))
const onlyIndex = args.indexOf('--only')
const onlyRaw = onlyFlag ? onlyFlag.slice('--only='.length) : (onlyIndex >= 0 ? args[onlyIndex + 1] : null)
const requested = onlyRaw?.split(',').map((x) => x.trim()).filter(Boolean)
const list = args.includes('--list')
const all = args.includes('--all')
const force = args.includes('--force')
const dry = args.includes('--dry-run')
const help = args.includes('--help') || args.includes('-h')

if (help || (!list && !all && !requested)) {
  console.log(`Usage:
  node scripts/sync-official-docs.mjs --list
  node scripts/sync-official-docs.mjs --only routing,validation,lucid
  node scripts/sync-official-docs.mjs --all
Options: --force (overwrite existing), --dry-run, --help`)
  process.exit(help ? 0 : 1)
}
if (list) {
  for (const item of manifest) console.log(`${item.id.padEnd(25)} ${item.url}`)
  process.exit(0)
}
const known = new Map(manifest.map((item) => [item.id, item]))
if (requested) {
  const unknown = requested.filter((id) => !known.has(id))
  if (unknown.length) {
    console.error(`Unknown page IDs: ${unknown.join(', ')}. Use --list.`)
    process.exit(2)
  }
}
const selected = requested ? requested.map((id) => known.get(id)) : manifest
const outputDir = path.join(root, 'references', 'official')
if (!dry) await fs.mkdir(outputDir, { recursive: true })
let success = 0
let errors = 0
for (const item of selected) {
  if (!/^[a-z0-9-]+$/.test(item.id)) throw new Error(`Unsafe page id: ${item.id}`)
  const url = new URL(item.url)
  if (url.protocol !== 'https:' || url.host !== 'docs.adonisjs.com' || !url.pathname.endsWith('.md')) {
    throw new Error(`Unexpected documentation URL: ${url.toString()}`)
  }
  const output = path.join(outputDir, `${item.id}.md`)
  try {
    if (!force && !dry) {
      try { await fs.access(output); console.log(`SKIP ${item.id} (exists; use --force)`); continue }
      catch (error) { if (error.code !== 'ENOENT') throw error }
    }
    if (dry) { console.log(`WOULD GET ${url} -> ${output}`); continue }
    const response = await fetch(url, { headers: { Accept: 'text/markdown, text/plain;q=0.9' }, signal: AbortSignal.timeout(25000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const length = Number(response.headers.get('content-length') || 0)
    if (length > 1024 * 1024) throw new Error('File over 1 MiB limit')
    const raw = await response.text()
    if (Buffer.byteLength(raw, 'utf8') > 1024 * 1024) throw new Error('File over 1 MiB limit')
    if (!raw.trim() || /^\s*<!doctype html/i.test(raw)) throw new Error('Expected nonempty Markdown; got HTML/empty')
    const tmp = `${output}.tmp`
    await fs.writeFile(tmp, raw.endsWith('\n') ? raw : raw + '\n', 'utf8')
    await fs.rename(tmp, output)
    console.log(`SAVED ${item.id} (${Buffer.byteLength(raw)} bytes)`)
    success += 1
  } catch (error) {
    errors += 1
    console.error(`FAILED ${item.id}: ${error.message}`)
  }
}
console.log(`Complete: ${success} downloaded, ${errors} failed, ${selected.length} selected.`)
if (errors) process.exitCode = 1
