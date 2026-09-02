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
Main details, Address, Contract and price, Land registry, Visibility). A Section's Step is
invariant with respect to the Tenant: what varies is whether the Section is present and
which of its versions is shown, never where it sits.
_Avoid_: Card, block, form, fieldset, panel

**Tenant**:
The country/market that determines which Sections and which filling-in rules apply (e.g. IT,
ES). In this project Tenant and country coincide: there is no separate brand axis. Each
Tenant has its own validation schema, written out in full rather than derived from a shared one.
_Avoid_: Locale, market, country, customer

**Field**:
The individual piece of data requested from the user within a Section, identified by a stable
path of the form `section.field` so that an Error summary can jump to it.
_Avoid_: Input, control

**Property type**:
What is being listed — an apartment, a villa or an office. It decides which version of the
Contract and price Section is shown, and each version is a separate component named after it.
_Avoid_: Category, kind, typology

**Contract type**:
Whether the Listing is a sale or a rental. It decides which price Fields the chosen Contract
and price Section shows. An office can only be sold.
_Avoid_: Mode, contract, transaction

**Draft**:
The partial Listing accumulated as the user moves through the Steps. It records which Steps
have been visited, not which are valid, and it may hold values from choices the user has since
abandoned; those are removed when the payload is built.
_Avoid_: Registry, state, payload, bozza

**Error summary**:
The list of Fields that fail validation in the current Step, shown when the user tries to move
forward. Each entry identifies a Field and allows the user to reach it. It never contains
Fields from other Steps.
_Avoid_: Banner, alert, validation panel
