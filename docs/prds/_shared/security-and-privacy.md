# Security, privacy, and abuse controls

- Hash passwords with the framework-approved adaptive algorithm and store OTP codes as short-lived hashes. Never log credentials, raw OTPs, tokens, full provider payloads, or private contact details.
- Encrypt provider secrets and contact payloads at rest. TLS is mandatory in transit. Mobile tokens use secure OS storage.
- Apply token-bucket limits by IP, account, device, and action. OTP, login, messaging, listing contact, review, report, payment, and export actions have stricter limits.
- Verify provider webhook signatures against the raw body, reject stale timestamps, and deduplicate provider event IDs.
- Scan uploaded media, validate MIME by content, strip metadata, generate safe derivatives, and quarantine failures.
- Record immutable audit events for role, block, moderation, refund, dispute, market, export, and maintenance actions.
- Minimize returned personal data and enforce purpose-based retention. Financial and audit records outlive account deactivation; profile data is anonymized when deletion is legally permitted.
- Detect spam, repeated contact attempts, review manipulation, listing duplication, payment anomalies, and abusive reports. Automated restrictions remain appealable.
