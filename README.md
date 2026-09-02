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
      schema.it.ts              every Italian rule, in full
      schema.es.ts              every Spanish rule, in full — a duplicate on purpose
      FeaturesStep.tsx          which sections appear, and when
      sections/
        MainDetails.tsx
        AddressIT.tsx  AddressES.tsx
        ContractAndPriceApartment.tsx
        ContractAndPriceVilla.tsx
        ContractAndPriceOffice.tsx
        LandRegistry.tsx        Italy only
        OwnerTaxId.tsx          CodiceFiscaleField / NifField
    publication/                schema.ts + PublicationStep.tsx
```

Two files answer almost every question. **[`FeaturesStep.tsx`](./src/steps/features/FeaturesStep.tsx)**
shows every section that can appear and the condition for each. **[`schema.it.ts`](./src/steps/features/schema.it.ts)**
shows every rule for Italy; diffing it against `schema.es.ts` *is* the specification of what
differs between the two markets.

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
2. **A different section per property type** — choose `Appartamento`: you get
   `ContractAndPriceApartment`, sale or rent. Choose `Villa`: `ContractAndPriceVilla`, where
   the recurring costs are maintenance rather than service charges. Choose `Ufficio`:
   `ContractAndPriceOffice`, where `Affitto` is not in the select at all and a business
   licence number is required. The component name tells you which one is on screen.
3. **A stale choice is cleared** — pick `Appartamento` + `Affitto`, fill in the rent, then
   switch to `Ufficio`. The contract type resets, because an office cannot be rented, and the
   rent you typed never reaches the payload.
4. **Blocked forward navigation** — complete *Features*, move on, then come back using the
   stepper. Empty a required field and try to move forward again from the stepper: you are
   blocked with the summary. Moving backwards is never blocked, and keeps what you typed.
5. **Same field, different format** — postal code `99999` is valid in IT and rejected in ES,
   where the first two digits must identify a province (01-52).
6. **Different fields** — *Codice fiscale* in IT, *NIF* in ES.
7. **Different sections** — *Features* has a *Dati catastali* section in IT that does not
   exist in ES.
8. **Payload** — at the end the object that would be sent to the backend is displayed.

## Two places where the code departs from the obvious route

**No `isValid`.** On a pristine form Formik reports `isValid: true` because `errors` is still
empty; with `validateOnMount` it would report `false` while showing no error. Every attempt to
move forward calls `validateForm()` and reads the result — see `StepShell.tsx`.

**A single function produces the payload.** `buildPayload` casts each step through its schema
with `stripUnknown`, which is also what removes values left behind by an abandoned choice.
Spreading the Draft directly would emit numbers as strings and keep the leftovers.

## Known limitations, all deliberate

- Adding a market or a property type means editing each copy, and nothing will fail the build
  if one is missed. That is the accepted cost of ADR 0008.
- Validation covers **only the current Step**, never the whole Draft. See
  [ADR 0006](./docs/adr/0006-validation-scoped-to-current-step.md).
- The browser's own back and forward buttons bypass the guarded navigation: they neither
  validate nor commit, so an edit made on the Step you leave that way is discarded.
- No persistence: refreshing on a later Step returns to the first one.
- Simulated uploads: `File` objects stay in memory, no network call, and no validation at all
  on the file fields.
- "An office cannot be rented" is an example rule chosen to exercise the behaviour, not a
  claim about the real market.
- The `codiceFiscale` and `nif` regexes check shape, not checksums. Both keep their legal
  names rather than being translated: they are proper nouns of the domain, like IBAN.
