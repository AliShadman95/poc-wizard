# Validation covers only the current Step

Attempting to move forward validates only the Step on screen, and the Error summary never
contains Fields from other Steps. Every forward move is validated, whether it comes from the
Avanti button, the stepper at the top, or publishing; moving backwards never validates, since
an invalid Step would otherwise become a trap. There is no validation of the whole Draft, not even at
publication. This is a deliberate simplification for the PoC, not an oversight.

## Consequences

- Going back, emptying a required Field and moving forward again is blocked, because the
  forward move revalidates. Moving backwards still commits what the user typed, so edits
  survive; the Draft therefore records what has been VISITED, not what is valid.
- **Accepted risk**: the browser's own back and forward buttons bypass the guarded
  navigation entirely — they neither validate nor commit. Going back with them, editing, then
  going forward with them lands on the next Step without a check; because nothing was
  committed either, the edit is silently discarded and the Draft keeps its last committed
  values. So this path cannot publish an invalid Listing, but it can lose what the user
  typed. Closing it means intercepting history navigation, which is out of scope here.
- Nothing revalidates earlier Steps at publication, so server-side validation remains the
  real safety net in the finished product.
- The Error summary is always scoped to the current Step: reaching one of its entries is a
  scroll with focus inside the page already on screen, with no navigation between Steps.
- Should the gap need closing later, the route is to validate the complete Draft at
  publication; the schema is already a pure function over the data, so the change is local.
