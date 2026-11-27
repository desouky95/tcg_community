# Legal remediation plan

Ordered work for Next Pull. Legal review gates marked **Counsel**. Do not treat this as a legal opinion or publish policies from this plan.

| Order | Priority | Work | Owner/evidence | Completion check |
|---|---|---|---|---|
| 1 | Critical | Confirm Egyptian operating entity, seller-of-record, marketplace role, markets, user age policy, payment and fulfillment model. | Business leadership; Egyptian commercial/consumer counsel. | Written scope decisions and legal issue list. |
| 2 | Critical | PDPL readiness: processing inventory, purposes/bases, controller/processor roles, risk classification, required PDPC licences/permits, DPO appointment and processing records under Law 151/2020 and Decree 816/2025. | Privacy owner + counsel; PDPC portal and official Gazette. | Counsel-reviewed applicability matrix, accountable DPO/contact where required, applications/records complete. |
| 3 | Critical | Cross-border/data processor map. Confirm actual database, Spaces, OAuth, email, hosting, monitoring, CDN and courier entities/regions/subprocessors. | Operations/cloud owners + vendors + counsel. | Data flow and contract inventory; required PDPC transfer permits and safeguards documented. |
| 4 | Critical | Consumer terms and sales disclosures aligned to consolidated Law 181/2018, Law 20/2024, Decree 822/2019. Include seller identity, product condition/price/fees, delivery, warranty, remedies, invoices, complaint channel. | Commerce/product + Egyptian consumer counsel. | Legal approves localized pre-sale display and order-confirmation content. |
| 5 | Critical | Returns/refunds/cancellation/late delivery/defect workflow. Map payment method, shipping costs, refund timing, exceptions and used/sealed collectibles. | Commerce/support/accounting + counsel. | Tabletop scenarios pass against counsel-approved current articles; process is operable for InstaPay and other methods. |
| 6 | Critical | Child protection and capacity decision for signup, purchases, messaging and swaps. | Product/safety owner + child/privacy counsel. | Clear permitted audience and age/guardian controls, safety defaults, escalation, and retention rules. |
| 7 | Critical | End-to-end data rights and retention. Cover Adonis, Medusa, CMS, object storage, exports, messages, logs and backups; distinguish legal/accounting retention from deletion. | Engineering + privacy owner + counsel. | Tested staging request/deletion matrix; expiry/backup schedule and auditable vendor handling. |
| 8 | High | Privacy notices and consent UX per touchpoint; direct-marketing controls and proof; cookie/identifier inventory and consent decision. | Product + privacy counsel. | Notices accurately map purpose/recipient/retention/rights; unsubscribe/withdrawal works; no unapproved nonessential tags. |
| 9 | High | UGC, seller and IP controls: marketplace role, seller records, listing condition/authenticity, card-image rights, complaint/takedown and user safety. | Marketplace operations + counsel. | Seller/listing moderation SOP and rights escalation documented; evidence of image permissions/provenance. |
| 10 | High | Security and incident controls: validate DB TLS; remove production OTP plaintext logging; review secrets access, MFA, least privilege, encryption, logs and incident notifications. | Security/engineering + privacy counsel. | Security review evidence; incident contacts, breach decision tree and applicable legal deadlines approved. |
| 11 | Medium | Electronic acceptance evidence: consumer order correction, immediate durable confirmation, accepted terms version and event logs. | Commerce engineering + counsel. | Confirmed contract record is retrievable for guest and registered order; Article 38 version checked. |
| 12 | Medium | Revisit GDPR and foreign laws only upon confirming EU/other market targeting or monitoring. | Business/privacy owner. | Documented territorial assessment; refresh at new market launch. |

## Legal review gates

1. Verify Arabic Official Gazette text and status for PDPL, Decree 816/2025, Consumer Law amendments (including Law 20/2024), and Decree 822/2019.
2. Confirm PDPC transition-window calculation, application requirements and which business categories require licence/permit/DPO.
3. Confirm current cross-border transfer approvals/conditions and child-data requirements.
4. Approve marketplace allocation, seller disclosure, card authenticity/IP process, and consumer return exceptions for collectibles.
5. Approve all consumer-facing notice, terms, consent and marketing language before release.

**No application code was changed as part of this legal assessment.**
