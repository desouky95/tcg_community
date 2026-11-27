# Technical privacy audit: open questions

Questions requiring product, operations, vendor or counsel evidence. No legal conclusions made.

## Product and user data

- What minimum age applies? Are minors expected to use the collector community, marketplace, or swaps?
- Is account email required, verified, used for transactional messages, or marketing? What does `isVerified` represent?
- Is mobile OTP intentionally disabled in current deployed routes? What currently verifies phone ownership?
- Are profile visibility and collection defaults public, private, or configurable? Which fields appear in search and community APIs?
- Can message, review, and swap content include photos, addresses, phone numbers, or other users’ personal data?
- Do guest users receive order lookup links or access using email/phone? How are those protected?

## Commerce and fulfillment

- Which payment methods are enabled in production? Is InstaPay manual reconciliation only? Are payment proofs/receipts collected?
- Which courier, fulfillment, customer support, accounting and fraud services receive order data?
- What order, invoice, shipping and payment records must be retained, and for how long?
- How are cancellations, returns, disputes and guest requests handled across Medusa and Adonis?

## Providers, location and transfer

- Which cloud host, managed databases, object storage accounts, CDN, email sender, monitoring/logging and support tools are live?
- What are the physical data regions, legal entities, subprocessors and backup regions for each?
- Are vendor DPAs and cross-border transfer safeguards in place where needed? Where are records maintained?
- Is optional Redis/event processing enabled in production; what personal data enters event payloads and how long is it retained?
- Are Google/Facebook OAuth providers enabled? Which profile scopes and claims are requested and stored?

## Retention, rights and security operations

- Does account deletion remove or anonymize related Medusa customers/addresses/orders, conversations, swaps, uploads, logs, search indexes and backups?
- What is the retention/expiry schedule for accounts, inactive users, auth tokens, OTPs, sessions, logs, exports, queue failures and backups?
- Who can access privacy exports? Is archive content encrypted, and is expiry cleanup monitored?
- Are access, correction, objection, restriction and portability requests handled beyond the in-product export/deletion controls?
- What incident response and breach notification process, contact and decision owner are used?
- Are production database connections, storage buckets, admin accounts and logs protected by documented encryption, MFA, least privilege and periodic access review?

## Repository scope questions

- Are deployment-time scripts, infrastructure-as-code, CDN settings or tag managers injecting analytics/cookies absent from app source?
- Is `apps/api/get_otp.ts` development-only and excluded from production artifacts?
- Is Strapi SQLite default overridden in every production environment?
- What operational purposes require the API database TLS certificate verification override in `apps/backend/medusa-config.ts`?
