# One form state boundary per Step, Sections as modules

Each Step of the Wizard has a single form state instance covering all the Sections of
that Step. Sections remain first-class units — Field descriptors, validation schema and
component — but they are composable modules, not form state boundaries of their own.
The alternative considered was one instance per Section, rejected because it would have
required hand-orchestrating N asynchronous validations to produce the Error summary, would
have made conditionals across Sections unreachable, and would have had no clear moment at
which to commit to the Draft.

## Consequences

- The validation schema stays defined as a pure function over the data, independent of the
  components, even though it currently only runs against the mounted Step (see ADR 0006).
  The form consumes it; it does not own it.
- Conditionals across Fields in different Sections (and different Steps) remain expressible,
  because every Field lives in the same object.
- We give up the render isolation that separate instances would have provided. If it ever
  becomes a measured problem, the answer is per-Field subscription with memoised Section
  components, not fragmenting the state.
- A Section with a genuinely autonomous lifecycle (saving on its own, repeated N times)
  remains an admitted exception, to be justified case by case.
