# Listing submission wizard

A guided three-step flow in which a user fills in and publishes a property listing.
The rules for filling it in vary by country, so the vocabulary carefully separates
what is stable (the structure of the wizard) from what varies (the fields and their rules).

## Language

**Listing**:
The property advertisement the user is creating. It is the complete object produced at the
end of the Wizard.
_Avoid_: Ad, annuncio, post, property

**Wizard**:
The complete flow for filling in a Listing, made of 3 ordered Steps.
_Avoid_: Form (too generic), flow, funnel

**Step**:
One of the Wizard's 3 ordered stages: Multimedia, Features, Publication. A Step contains
several Sections and is the unit the user perceives as a "page". The number, order and
identity of the Steps are fixed and do not vary by Tenant.
_Avoid_: Page, tab, stage, phase

**Section**:
A cohesive, named group of Fields within a Step, with its own domain identity (Photos,
Floor plans and documents, Main details, Address, Contract and price, Land registry,
Visibility). It is the unit of reuse and of variation between Tenants. A Section's Step is
invariant with respect to the Tenant: what varies is whether the Section is present and what
shape it takes, never where it sits.
_Avoid_: Card, block, form, fieldset, panel

**Variant**:
The shape a Section takes for a specific Tenant. Two Variants of the same Section share its
identity but may differ in the Fields present, the formats accepted and the labels shown.
_Avoid_: Override, version, flavour

**Tenant**:
The country/market that determines which Sections and which filling-in rules apply (e.g. IT,
ES). In this project Tenant and country coincide: there is no separate brand axis.
_Avoid_: Locale, market, country, customer

**Field**:
The individual piece of data requested from the user within a Section, identified by a stable
path so that an Error summary can refer to it.
_Avoid_: Input, control

**Discriminant**:
A Field whose value determines which other Fields of its own Section exist and are required
(e.g. Contract type). Not every conditioning Field is a Discriminant: it is one only when its
admissible values form a closed set and each one selects a different set of Fields.
_Avoid_: Trigger, pilot field, switch

**Dependency**:
The same relationship reaching across Sections: a Field in one Section determines which Fields
exist in another Section of the same Step (choosing an office reveals the business licence in
Contract and price). Distinct from a Discriminant because the governing Field is not the
governed Section's to render or clear.
_Avoid_: Cross-field rule, link, reference

**Option constraint**:
A restriction on which of a Field's admissible values remain selectable, given the value of
another Field (an office cannot be offered for rent). It narrows a Field's choices; it does
not decide whether the Field exists.
_Avoid_: Filter, rule, allowed values

**Contract type**:
The Discriminant governing the price Fields. Each of its values (sale, rent, ...) selects a
distinct set of required Fields. The set of values is closed and is expected to grow.
_Avoid_: Mode, contract, category

**Draft**:
The partial Listing accumulated as the user moves through the Steps. It holds only values
consistent with the user's current choices: when a governing Field changes, the Fields of the
abandoned set leave the Draft. It records which Steps have been visited, not which are valid.
_Avoid_: Registry, state, payload, bozza

**Error summary**:
The list of required Fields that are missing, shown when the user tries to move forward. Each
entry identifies a Field and allows the user to reach it.
_Avoid_: Banner, alert, validation panel
