# PoC — Listing submission wizard

A three-Step wizard with per-market validation, conditional sections and a clickable error
summary. React 19 + TypeScript, Formik 2.4.9, Yup 1.7.1, React Router 7 (BrowserRouter).

```bash
npm install && npm run dev
```

The domain vocabulary is in [CONTEXT.md](./CONTEXT.md); the decisions and their reasons in
[docs/adr](./docs/adr).

> The code, comments in shared plumbing, and documentation are in English. The strings shown
> on screen are not: they are product copy for the Italian and Spanish markets, and the
> market-specific ones (`CAP` vs `Código postal`, `Codice fiscale` vs `NIF`) are precisely
> what this PoC sets out to demonstrate.

## How it is organised

Everything is explicit. There is no descriptor layer, no schema built from configuration and
no generic renderer: each market has its own schema written out in full, and each version of
a section is a component named after the case it handles.

```
src/
  domain.ts                     steps, tenants, ids — nothing else
  payload.ts                    the one function that builds what goes to the backend
  errorSummary.ts               reads labels and order out of the schema
  ui/inputs.tsx                 dumb inputs; they know nothing about the domain
  components/StepShell.tsx      the chrome every step shares: form, stepper, buttons
  steps/
    multimedia/                 schema.ts + MultimediaStep.tsx
    features/
      byTenant.tsx              every choice made on the tenant axis, in one file
      schema.it.ts              every Italian rule, in full
      schema.es.ts              every Spanish rule, in full — a duplicate on purpose
      SectionsIT.tsx            every section Italy shows, in order
      SectionsES.tsx            every section Spain shows — a duplicate on purpose
      FeaturesStep.tsx          resolves the market, and nothing else
      sections/
        MainDetails.tsx         the Categoria -> Gruppo -> Tipologia cascade
        propertyClassification.ts   the option lists that cascade feeds on
        AddressIT.tsx  AddressES.tsx
        ContractIT.tsx ContractES.tsx   contract type + the owner's tax id
        SalePrice.tsx           only for a sale
        RentTerms.tsx           only for a rental
        LandRegistry.tsx        Italy only
    publication/                schema.ts + PublicationStep.tsx
```

Each market has two files and they answer almost every question:
**[`SectionsIT.tsx`](./src/steps/features/SectionsIT.tsx)** shows every section Italy renders
and in what order, **[`schema.it.ts`](./src/steps/features/schema.it.ts)** every rule it
validates. Diffing them against their `ES` twins *is* the specification of what differs
between the markets. Below `FeaturesStep` no component takes a `tenant`: the market is
resolved once, in [`byTenant.tsx`](./src/steps/features/byTenant.tsx).

`schema.it.ts` and `schema.es.ts` are near-identical, and that is the point. See
[ADR 0008](./docs/adr/0008-explicit-duplication-over-descriptors.md) for what this buys
and what it costs.

## What to try

The **Tenant** `<select>` at the top is a demo instrument, not a feature: changing it clears
the Draft, because the two markets' fields do not coincide.

1. **Error summary** — on *Features* press *Avanti* without filling anything in. The entries
   appear in the order the fields appear on screen, and clicking one moves focus to its field.
   Labels and order come from the schema's own `.label()` calls, read back with `describe()`,
   so there is no second list of fields to keep in step.
2. **A different section per contract type** — choose `Vendita` and a **Prezzo** section
   appears; choose `Affitto` and you get **Canone e condizioni** instead. Two components,
   `SalePrice` and `RentTerms`, and the name tells you which one is on screen.
3. **The classification cascade** — Categoria `Negozio` offers the groups *Locali
   commerciali* and *Ristorazione*; picking *Locali commerciali* offers the types *Locale
   commerciale* and *Laboratorio*. Changing the category clears the two levels below it.
   The cascade affects nothing outside its own section.
4. **Leftovers never reach the payload** — fill in a rent, then switch to `Vendita`. The rent
   figures stay in form state but are stripped when the payload is built.
5. **Blocked forward navigation** — complete *Features*, move on, then come back using the
   stepper. Empty a required field and try to move forward again from the stepper: you are
   blocked with the summary. Moving backwards is never blocked, and keeps what you typed.
6. **Same field, different format** — postal code `99999` is valid in IT and rejected in ES,
   where the first two digits must identify a province (01-52).
7. **Different fields** — *Codice fiscale* in IT, *NIF* in ES.
8. **Different sections** — *Features* has a *Dati catastali* section in IT that does not
   exist in ES.
9. **Payload** — at the end the object that would be sent to the backend is displayed.

## Two places where the code departs from the obvious route

**No `isValid`.** On a pristine form Formik reports `isValid: true` because `errors` is still
empty; with `validateOnMount` it would report `false` while showing no error. Every attempt to
move forward calls `validateForm()` and reads the result — see `StepShell.tsx`.

**A single function produces the payload.** `buildPayload` casts each step through its schema
with `stripUnknown`, which is also what removes values left behind by an abandoned choice.
Spreading the Draft directly would emit numbers as strings and keep the leftovers.

## Known limitations, all deliberate

- Adding a market means writing its schema out in full, and nothing checks that every field
  was carried over — the accepted cost of ADR 0008. The build does break at
  `steps/features/schema.ts`, whose exhaustive `switch` will not compile until the new
  tenant is wired up, so you are at least told where to start.
- The classification cascade is data in `propertyClassification.ts`, shared by both markets
  because nothing says they differ. If one day they do, that file gets duplicated per tenant
  the way the schemas already are.
- Validation covers **only the current Step**, never the whole Draft. See
  [ADR 0006](./docs/adr/0006-validation-scoped-to-current-step.md).
- The browser's own back and forward buttons bypass the guarded navigation: they neither
  validate nor commit, so an edit made on the Step you leave that way is discarded.
- No persistence: refreshing on a later Step returns to the first one.
- Simulated uploads: `File` objects stay in memory, no network call, and no validation at all
  on the file fields.
- The `codiceFiscale` and `nif` regexes check shape, not checksums. Both keep their legal
  names rather than being translated: they are proper nouns of the domain, like IBAN.
