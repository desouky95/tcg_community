# Atomic PRD document standard

Each scenario file owns exactly one actor goal, query, command, automated trigger, or state transition. Branches stay in the owning PRD unless they invoke another independently authorized command. Every PRD must contain metadata, scope, sequence, experience states, API/interface, backend/data rules, security/operations, acceptance criteria, tests, rollout, and exclusions.

Completion means the document supplies enough behavior and contracts for implementation without inventing product rules. Implementation state is independent: `implemented`, `partial`, `mocked`, `planned`, or `absent`. Product horizon is `current`, `v1`, or `future`.
