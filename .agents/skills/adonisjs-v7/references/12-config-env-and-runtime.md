# Environment and configuration

Read when adding application settings, API credentials, runtime flags or deployment changes.

**Official Markdown:** [Configuration & Environment](https://docs.adonisjs.com/configuration.md) · [Deployment](https://docs.adonisjs.com/deployment.md)

## Separation of concerns

- `.env` supplies environment-specific values and secrets. Never commit real credentials.
- `start/env.ts` (or the configured env definition) validates and converts environment values before consumers rely on them.
- `config/*.ts` defines application settings and package options; runtime code should read validated config/services, not parse environment variables ad hoc.
- `adonisrc.ts` configures build/generation/providers/tooling rather than application-domain settings.

## Working procedure

1. Determine whether the value is secret, deployment-specific, or a stable product rule.
2. Inspect existing env validation and `.env.example` before adding a new field.
3. Add a validated field with a useful default only when appropriate. Never default a missing production secret to a fake value.
4. Wire through the existing config module; document the deploy-time env requirement.
5. Test missing and malformed values. Avoid secrets in errors or logs.

## Feature flags

- Static deployment flags can come from validated config for small apps.
- User targeting, gradual rollout, auditing and runtime changes may require a real feature-flag service; don't assume `.env` updates live without restarts.
- Name flags by behavior and specify safe fallback; remove expired flags and both unused branches.

## Deployment guardrails

Match build/start commands to the repository, secure `APP_KEY`, validate DB connections and proxy/cookie setup, and ensure migrations run as a separately approved step.
