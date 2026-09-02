# Conditional Fields modelled as sets keyed by Discriminant value

Where a Field determines the existence of other Fields, the Variant's descriptor explicitly
declares, for each admissible value of that Field, the set of Fields that depend on it. This
covers three cases with one shape: a Discriminant governing its own Section, a Dependency
reaching into another Section of the same Step, and an option constraint narrowing which
values of a Field stay selectable. Conditional validation, conditional rendering and the clearing of
abandoned values all derive from that single declaration. The natural alternative — one Yup
`.when()` per field plus a hand-written condition in the JSX — was rejected because it keeps
two sources of truth that drift apart, and because it is an *open* structure used to model a
*closed* domain.

## Consequences

- Adding a value to the Discriminant (a third Contract type, say) becomes a compile error,
  instead of silently dropping every Field into the `otherwise` branch and making optional
  what ought to be required.
- Clearing abandoned values happens automatically and covers the value, the touched state and
  any leftover error: without this a stale error survives on an unmounted Field and surfaces
  as an Error summary with unreachable entries.
- Changing Tenant uses the same mechanism one level up: it is a governing change that
  invalidates a set of Fields.
- Cross-Section relationships work at all only because a Step has a single form state
  (ADR 0001): with one form per Section, a Section could not see the Field governing it.
- It avoids the class of bug where a hidden Field keeps its value and reaches the payload,
  producing an incoherent Listing that nonetheless passes validation.
