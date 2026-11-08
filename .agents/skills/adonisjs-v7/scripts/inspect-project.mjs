#!/usr/bin/env node
/** Read-only AdonisJS project audit; no npm install, file changes, or network access. */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(process.argv[2] || process.cwd())
const pkgPath = join(root, 'package.json')

if (!existsSync(pkgPath)) {
  console.error(`No package.json found at ${root}. Pass an AdonisJS project root.`)
  process.exitCode = 2
} else {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    const present = (file) => existsSync(join(root, file))
    const names = ['@adonisjs/core', '@adonisjs/lucid', '@adonisjs/auth', '@adonisjs/bouncer', '@adonisjs/inertia', '@vinejs/vine', '@japa/runner']
    const report = {
      root,
      node: process.version,
      node24OrLater: Number(process.versions.node.split('.')[0]) >= 24,
      adonisjsPackages: Object.fromEntries(names.filter((n) => deps[n]).map((n) => [n, deps[n]])),
      files: Object.fromEntries(['adonisrc.ts', 'start/routes.ts', 'start/kernel.ts', 'tsconfig.json', 'tests/bootstrap.ts', 'providers/api_provider.ts'].map((f) => [f, present(f)])),
      packageScripts: pkg.scripts || {},
      lockfiles: ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lock', 'bun.lockb'].filter(present),
      notes: [
        'Dependency ranges do not prove installed versions; inspect the lockfile/node_modules when available.',
        'This script is read-only and does not verify generated files, configuration correctness or database safety.',
      ],
    }
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    if (!deps['@adonisjs/core']) {
      console.error('Warning: no @adonisjs/core dependency detected.')
      process.exitCode = 1
    }
  } catch (error) {
    console.error(`Cannot inspect project: ${error.message}`)
    process.exitCode = 2
  }
}
