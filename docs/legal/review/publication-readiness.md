# Publication readiness and document inventory

**As of 27 November 2026.** “Ready for Legal Review” means a draft is coherent enough to send for review; it does **not** mean legally approved or ready to publish. Any unresolved TODO or blocker must be resolved before publication. “Blocked” means material evidence or business facts prevent a reliable review/finalization. “Not Applicable” means no separate document/feature is evidenced.

## Customer-facing draft inventory

| Document | Readiness | Publication status | Key blocker |
|---|---|---|---|
| EN Privacy Policy — `docs/legal/policies/en/privacy-policy.md` | Blocked | Not publishable | Operator/contact, actual lawful basis, processor/location list, retention schedule, rights workflow, age policy, PDPC requirements. |
| AR Privacy Policy — `docs/legal/policies/ar/privacy-policy.md` | Blocked | Not publishable | Same, plus legal Arabic review and anonymization wording. |
| EN Cookie Policy — `docs/legal/policies/en/cookie-policy.md` | Blocked | Not publishable | Production runtime cookie/tracking/storage inventory and consent determination. |
| AR Cookie Policy — `docs/legal/policies/ar/cookie-policy.md` | Blocked | Not publishable | Same plus legal Arabic review. |
| EN Refund and Return — `docs/legal/policies/en/refund-return-policy.md` | Ready for Legal Review | Not publishable | Business return procedure/contact; counsel confirmation of Arts. 17/21/40 interactions, costs and item exceptions. |
| AR Refund and Return — `docs/legal/policies/ar/refund-return-policy.md` | Ready for Legal Review | Not publishable | Same plus official Arabic statutory wording review. |
| EN Shipping and Delivery — `docs/legal/policies/en/shipping-delivery-policy.md` | Blocked | Not publishable | Courier, coverage, charges, estimates, support and damage/loss process. |
| AR Shipping and Delivery — `docs/legal/policies/ar/shipping-delivery-policy.md` | Blocked | Not publishable | Same plus legal Arabic review. |
| EN Pre-order — `docs/legal/policies/en/pre-order-policy.md` | Blocked | Not publishable | Confirm purchasable pre-order feature and actual per-listing terms/payment/delay process. |
| AR Pre-order — `docs/legal/policies/ar/pre-order-policy.md` | Blocked | Not publishable | Same plus legal Arabic review. |
| EN Account Deletion and Data Rights — `docs/legal/policies/en/account-deletion-data-rights.md` | Ready for Legal Review | Not publishable | Counsel rights/deadline review; end-to-end data-store deletion/export/contact remain unverified. |
| AR Account Deletion and Data Rights — `docs/legal/policies/ar/account-deletion-data-rights.md` | Ready for Legal Review | Not publishable | Same plus legal Arabic review. |
| EN Acceptable Use — `docs/legal/policies/en/acceptable-use-policy.md` | Blocked | Not publishable | Operator role, reporting/appeal/moderation channels and age safety process. |
| AR Acceptable Use — `docs/legal/policies/ar/acceptable-use-policy.md` | Blocked | Not publishable | Same plus legal Arabic review. |
| EN Community Guidelines — `docs/legal/policies/en/community-guidelines.md` | Blocked | Not publishable | Support/reporting, moderation, escalation and age policy. |
| AR Community Guidelines — `docs/legal/policies/ar/community-guidelines.md` | Blocked | Not publishable | Same plus legal Arabic review. |
| EN Terms and Conditions — `docs/legal/policies/en/terms-and-conditions.md` | Blocked | Not publishable | Operator/seller role, age, acceptance/correction/confirmation mechanism, payment/shipping/returns/swap procedure. |
| AR Terms and Conditions — `docs/legal/policies/ar/terms-and-conditions.md` | Blocked | Not publishable | Same plus Arabic controlling-text and legal translation approval. |

## Internal legal review inventory

| Document | Readiness | Use |
|---|---|---|
| `docs/legal/audit/data-inventory.md` | Ready for Legal Review | Source-based technical personal-data inventory; production unknowns remain. |
| `docs/legal/audit/data-flow.md` | Ready for Legal Review | Data-flow map; actual processors/locations unverified. |
| `docs/legal/audit/third-party-processors.md` | Ready for Legal Review | Processor candidates and evidence gaps; not a verified live vendor list. |
| `docs/legal/audit/privacy-gaps.md` | Ready for Legal Review | Technical privacy gaps; not legal conclusions. |
| `docs/legal/audit/open-questions.md` | Ready for Legal Review | Business and operations questions. |
| `docs/legal/compliance/legal-register.md` | Ready for Legal Review | Egypt-focused legal sources and article anchors; Arabic Gazette prevails. |
| `docs/legal/compliance/requirements-matrix.md` | Ready for Legal Review | Requirement-by-requirement technical mapping; no legal approval. |
| `docs/legal/compliance/gap-analysis.md` | Ready for Legal Review | Prioritized legal/implementation gaps. |
| `docs/legal/compliance/remediation-plan.md` | Ready for Legal Review | Remediation sequence and approval gates. |
| `docs/legal/review/policy-evidence-matrix.md` | Ready for Legal Review | Earlier policy evidence map; update if policy scope changes. |
| `docs/legal/review/commercial-decisions.md` | Ready for Business Review | Unresolved commercial choices; internal only. |
| `docs/legal/review/terms-clause-matrix.md` | Ready for Legal Review | Terms evidence map; should be updated with the expanded Article 17/21 discussion during sign-off. |
| `docs/legal/review/final-audit.md` | Ready for Legal Review | Findings from independent review. |
| `docs/legal/review/legal-approval-checklist.md` | Ready for Legal Review | Counsel sign-off checklist. |
| `docs/legal/review/implementation-backlog.md` | Ready for Business/Engineering Review | Proposed work only; no code changed. |
| `docs/legal/review/bilingual-consistency.md` | Ready for Legal Arabic Review | Parallel-language comparison, not certified translation. |
| This file | Ready for Legal Review | Inventory and publication gate. |

## Not applicable / not evidenced

- Separate digital collectibles/NFT terms: **Not Applicable** on reviewed repository evidence; no such product functionality was established. Reassess before launch.
- GDPR-specific notice or DPA: **Not Applicable on current evidence** because no EU targeting/establishment/monitoring facts are established. Reassess before EU expansion or monitoring.
- Cookie consent control: not a document-only N/A; implementation and applicable Egyptian rule remain unresolved.

## Outstanding publication blockers

1. Complete business identity, legal role and all customer contact details.
2. Counsel-approved Arabic consumer law treatment of Articles 17, 21, 40–41, exceptions and shipping-cost relationship.
3. Actual signup/checkout links, acceptance, correction, order confirmation and accepted-version evidence.
4. Verified processors, regions, couriers, cookie/tracking behavior, retention and privacy rights workflow.
5. Age/guardian decision and user-generated-content/swap moderation responsibilities.
6. Complete commercial details for returns, delivery, payment and any purchasable pre-orders.
7. Line-by-line Egyptian legal review and language precedence. No document is legally approved until the professional reviewer approves the exact version.
