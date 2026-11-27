# Technical privacy audit: gaps and risks

Prioritized implementation observations. Status describes repository evidence, not a legal conclusion. Not legal advice.

| Priority | Finding / status | Evidence | Risk / next evidence needed |
|---|---|---|---|
| High | Full retention/deletion coverage unproven. User deletion endpoint anonymizes Adonis identity; commerce/CMS/media/logs/backups propagation not demonstrated. | `apps/api/app/controllers/identity_controller.ts`; `apps/backend/medusa-config.ts`; `apps/cms/config/plugins.ts`. | Orphaned identifiers/orders/media; document cascade, legal holds, backup expiry and processor deletion evidence. |
| High | Age controls absent in inspected account schema/flows. | `apps/api/database/schema.ts` UserSchema; signup UI/API. | Children may create accounts; define eligibility and handling with counsel/product owner. |
| High | Production data location and international transfer safeguards unknown. | Provider URLs and storage/database env configuration only. | Identify actual regions, legal entities, subprocessors and transfer contracts. |
| High | Registration/mobile verification status inconsistent: routes currently point OTP actions to `mobileVerificationDisabled`, while controllers/UI retain OTP paths. | `apps/api/start/routes/v1/auth.routes.ts`; `apps/api/app/controllers/auth_controller.ts`; `apps/public-web` auth UI. | Verification may be unavailable or behavior may differ by deployment. Confirm deployed route revision and intended status. |
| High | Email verification not evidenced for local accounts. | Auth routes/controllers and user schema have no email-verification route/state clearly identified; schema has `isVerified` but this appears general/mobile status. | Wrong-address account access and marketing/contact quality; confirm meaning of `isVerified` and any out-of-repo flow. |
| High | OTP helper prints plaintext code and mobile to stdout if run. | `apps/api/get_otp.ts`. | Log exposure if included/invoked in production; verify entry point, packaging, access and log retention. |
| Medium | Cookie consent and analytics inventory unresolved. No live analytics tag found in sampled source. | Next/Adonis/Medusa cookie config; search of app source. | Consent obligations and third-party browser requests unknown; inspect built HTML, deployment/CDN injection and browser network. |
| Medium | Guest checkout data lifecycle and access controls not fully mapped. | `apps/public-web/src/lib/commerce/checkout-actions.ts`; Medusa standard order/customer records. | Guest data may persist without account control; verify order access, retention, support access and deletion exceptions. |
| Medium | User-generated content has no retention/moderation policy evident in code. | Adonis message/review/swap models/controllers. | Sensitive info, harassment, third-party personal data and trade disputes; establish reporting, moderation, retention and deletion handling. |
| Medium | Shipping processor unknown. | Checkout collects full recipient address/phone and Medusa fulfillment options. | Recipient data disclosure and cross-border routing cannot be assessed without courier list/contracts. |
| Medium | Media upload supports documents/audio/video; no content privacy/metadata lifecycle shown. | `apps/cms/config/plugins.ts`. | Users/admins may upload personal or sensitive data; assess moderation, EXIF removal, public access and deletion. |
| Medium | Export is available and queued with 7-day expiry, but export coverage and archive controls need verification. | `apps/api/app/controllers/identity_controller.ts`, `apps/api/app/jobs/PrivacyExport.ts`, cleanup job. | Incomplete/overbroad export or unauthorized download; review fields, permissions, encryption, storage and cleanup reliability. |
| Medium | CMS defaults to local SQLite when `CMS_DATABASE_CLIENT` absent. | `apps/cms/config/database.ts`. | Misconfigured production may use ephemeral/local storage, weakening availability/retention and backup controls. Confirm deployment overrides. |
| Medium | Medusa DB TLS disables certificate validation. | `apps/backend/medusa-config.ts`: `rejectUnauthorized: false`. | Susceptibility to server impersonation on DB connection; privacy breach risk. Assess whether provider mandates this and use validated TLS. |
| Medium | Medusa session is rolling 30 days and cookie `sameSite: none`. | `apps/backend/medusa-config.ts`. | Long-lived session exposure; cross-site behavior requires HTTPS/Secure configuration verification. |
| Medium | Logging, backups, incident/breach handling and access review are not fully documented in repository evidence. | Configs and source review; no complete retention/incident control evidence found. | Personal data may persist in logs/backups or be accessible too broadly. Gather operational runbooks and provider controls. |
| Low | Privacy/communication preference fields exist but downstream enforcement is not established. | `apps/api/database/schema.ts`; `apps/api/app/controllers/identity_controller.ts`. | Stored choices may not control all messaging, profile exposure or tracking; verify callers and defaults. |

## Recommended evidence collection

1. Deployment inventory and environment names/regions only; do not export secret values.
2. Data retention schedules, backup lifecycle and deletion run logs across systems.
3. Current vendor/courier list, DPAs, subprocessors and transfer documentation.
4. Runtime cookie and network inspection on production-like build; inspect injected tags.
5. Verify OTP route behavior, email verification, export/download authorization and account deletion end-to-end in a non-production environment.
