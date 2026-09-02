# Validation covers only the current Step

Attempting to move forward validates only the Step on screen, and the Error summary never
contains Fields from other Steps. There is no validation of the whole Draft, not even at
publication. This is a deliberate simplification for the PoC, not an oversight.

## Consequences

- **Accepted risk**: navigation between completed Steps is free, so a user can go back, empty
  a required Field, move forward again and publish an incomplete Listing. Nothing in the
  frontend catches this. In the finished product the safety net is server-side validation.
- The Error summary is always scoped to the current Step: reaching one of its entries is a
  scroll with focus inside the page already on screen, with no navigation between Steps.
- Should the gap need closing later, the route is to validate the complete Draft at
  publication; the schema is already a pure function over the data, so the change is local.
