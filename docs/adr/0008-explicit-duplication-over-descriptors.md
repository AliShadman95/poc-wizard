# Explicit duplication instead of a descriptor-driven model

Sections, fields, per-tenant variants and conditional relationships were previously
declared as descriptor objects — total maps keyed by a discriminating value, per-tenant
overrides, and a normalisation pass reconciling values after every change. That model is
gone. Each market now has its own validation schema written out in full, and each variant
of a section is its own component named after the case it handles:
`ContractAndPriceApartment`, `ContractAndPriceVilla`, `ContractAndPriceOffice`.

The reason is legibility, and it came from using the thing. Every individual piece of the
descriptor model was defensible, and together they bought real compile-time exhaustiveness.
But no single file answered the question "what is on screen right now, and what is being
validated?" — answering it meant tracing a value through descriptors, a resolver, a lazy
schema and a normalisation pass. The team's judgement was that this cost more, every day,
than the duplication it removed.

## Consequences

- **What is given up, deliberately**: total maps no longer make an omission a compile
  error. Adding a fourth property type or a third market means remembering to touch each
  copy, and nothing will fail the build if one is missed. This is the price of the change,
  accepted knowingly.
- Reading `FeaturesStep.tsx` shows every section that can appear and the condition for
  each; reading `schema.it.ts` shows every rule for Italy. The two files are meant to be
  kept in the same order, since the error summary follows the schema.
- `schema.it.ts` and `schema.es.ts` are near-identical by design. A diff between them is
  the specification of what differs between the markets — previously that information had
  no single place to live.
- Conditional cleanup is no longer automatic. Values from a branch the user left behind
  stay in form state and are removed at the boundary instead, by `cast(..., { stripUnknown:
  true })` in `buildPayload`. The one case where a stale value would be visible on screen —
  arriving at an office with "rent" selected — is handled by three explicit lines in
  `ContractAndPriceOffice`, where a reader will look for it.
- Field labels are written twice: once in the JSX and once as `.label()` in the schema,
  which feeds the error summary. A mismatch shows a different label in the summary than on
  the field; it cannot cause a validation bug.
