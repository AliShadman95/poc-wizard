# Explicit duplication instead of a descriptor-driven model

Sections, fields, per-tenant variants and conditional relationships were previously
declared as descriptor objects — total maps keyed by a discriminating value, per-tenant
overrides, and a normalisation pass reconciling values after every change. That model is
gone. Each market now has its own validation schema written out in full, and each variant
of a section is its own component named after the case it handles: `AddressIT` and
`AddressES` for the two markets, `SalePrice` and `RentTerms` for the two contract types.

The reason is legibility, and it came from using the thing. Every individual piece of the
descriptor model was defensible, and together they bought real compile-time exhaustiveness.
But no single file answered the question "what is on screen right now, and what is being
validated?" — answering it meant tracing a value through descriptors, a resolver, a lazy
schema and a normalisation pass. The team's judgement was that this cost more, every day,
than the duplication it removed.

## Consequences

- **What is given up, deliberately**: total maps no longer make an omission a compile
  error *inside* a schema. Adding a market means writing its schema out in full, and nothing
  checks that every field was carried over. This is the price of the change, accepted knowingly.
- Partially recovered, at the seam: the tenant is resolved to a schema by an exhaustive
  `switch` with a declared return type in `steps/features/schema.ts`. Adding a tenant to the
  union therefore does break the build — verified — pointing at the one file that has to
  choose. It catches "you forgot to wire the new market up", not "you forgot a field in it".
- Reading `FeaturesStep.tsx` shows every section that can appear and the condition for
  each; reading `schema.it.ts` shows every rule for Italy. The two files are meant to be
  kept in the same order, since the error summary follows the schema.
- `schema.it.ts` and `schema.es.ts` are near-identical by design. A diff between them is
  the specification of what differs between the markets — previously that information had
  no single place to live.
- Conditional cleanup is no longer automatic. Values from a branch the user left behind
  stay in form state and are removed at the boundary instead, by `cast(..., { stripUnknown:
  true })` in `buildPayload`: switching from rent to sale leaves the rent figures in state,
  and they simply never reach the payload. The one place a stale value would be visible on
  screen is the Classification cascade, where changing a level explicitly clears the levels
  below it, in `MainDetails` where a reader will look for it.
- Field labels are written twice: once in the JSX and once as `.label()` in the schema,
  which feeds the error summary. A mismatch shows a different label in the summary than on
  the field; it cannot cause a validation bug.
