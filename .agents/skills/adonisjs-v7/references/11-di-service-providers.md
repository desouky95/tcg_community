# Dependency injection and providers

Read for reusable services, provider setup, container bindings and test replacements.

**Official Markdown:** [Dependency injection](https://docs.adonisjs.com/guides/concepts/dependency-injection.md) · [Service providers](https://docs.adonisjs.com/guides/concepts/service-providers.md) · [Container services](https://docs.adonisjs.com/guides/concepts/container-services.md)

## Decide whether DI is necessary

- Keep small, one-off logic close to its owner. Move complex or duplicated domain operations into services where boundaries are clearer.
- Reuse existing services and bindings before adding new interfaces/providers.
- AdonisJS resolves injected classes through its IoC container; inspect `@inject()` patterns and the app's lifecycle first.
- Bind abstractions or singletons only when lifetime, implementation selection, or testing justifies them.
- Providers register/boot application integrations; choose their lifecycle hook deliberately and avoid side effects during import evaluation.

## Design considerations

- Request-scoped data (current user, request ID) should not be cached inside global singletons.
- Avoid circular dependencies. Services should not import HTTP controllers.
- When changing a binding, check tests and app bootstrap, and ensure all consumers resolve the same contract.
- External resources (DB connections, HTTP clients, queues) need appropriate startup and shutdown handling.
- Use the project's established DI conventions; not every service class needs a provider or abstract base class.

## Verification

Test dependency replacement, concurrent requests, provider boot failure and startup/shutdown behavior when relevant.
