# Ace CLI, generated types and v6 → v7

Read when scaffolding resources, debugging missing aliases and planning upgrades.

**Official Markdown:** [Ace CLI](https://docs.adonisjs.com/guides/ace/introduction.md) · [Creating commands](https://docs.adonisjs.com/guides/ace/creating-commands.md) · [Codegen](https://docs.adonisjs.com/guides/concepts/codegen.md) · [Barrel files](https://docs.adonisjs.com/guides/concepts/barrel-files.md) · [Upgrade guide](https://docs.adonisjs.com/v6-to-v7.md)

## CLI workflow

```sh
node ace --help
node ace list:routes
node ace make:controller articles
node ace make:validator article
node ace make:migration articles
```

Check each command's `--help` in the installed version before adding flags. Ace scaffolding writes files that should be reviewed and customized; don't assume generated code is production-ready.

## Generated code

- `.adonisjs` may include controller barrels, route registries, frontend types and other generated artifacts.
- A missing `#generated/controllers` import often means a generator/hook issue; inspect `adonisrc.ts`, startup/build results and alias configuration before manual fixes.
- Generated database schema types track migrations; don't edit generated output to fake a column that migration lacks.

## Upgrading from v6

- Treat upgrades as a migration project: inspect dependency versions, release notes, v7 upgrade guide and generated code differences.
- Recheck route/controller names, Lucid model schema conventions, validation, auth, serializers, test bootstrap and build/deployment.
- Avoid broad codemods without rollback and a dedicated upgrade branch.
- Write regression tests for authentication, existing API contracts and database behavior before changing version.
- Report incompatible packages and breaking behavior explicitly.
