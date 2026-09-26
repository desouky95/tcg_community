# Shared UX, localization, and accessibility

English source content and natural Arabic translations are required. Layout, icon direction, data tables, form alignment, navigation, and motion work in RTL. Currency uses market rules and integer minor units; phone input defaults to Egypt without hard-coding it into stored identity.

All interactive controls are keyboard reachable with visible focus. Forms use persistent labels, field-linked errors, summary focus after failure, and disabled/pending semantics. Dialogs manage focus and expose accessible names. Status is never conveyed by color alone. Touch targets are at least 44 by 44 CSS pixels. Reduced-motion preferences disable nonessential movement.

Every data surface defines loading, empty, partial, stale, offline, forbidden, missing, and retryable-error states. Optimistic updates are allowed only for reversible nonfinancial actions. Transactional actions display canonical server state and prevent duplicate submission. Deep links require authorization after resolution and never reveal private resource existence.
