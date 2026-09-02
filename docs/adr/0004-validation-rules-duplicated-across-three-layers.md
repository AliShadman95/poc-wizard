# Validation rules are duplicated across frontend, BFF and backend

The same filling-in rules are implemented three times: in the frontend, in the
backend-for-frontend and in the backend. There is no shared package and no single spec they
are generated from. This is a constraint imposed by how the teams are organised, not a
technical preference, and it is recorded because a future reader will reasonably wonder why
there is no common source.

## Consequences

- The drift surface is 3 implementations × N Tenants. The only realistic safeguard is that
  the per-market differences be described once in a shared document, from which all three
  layers implement.
- What cannot diverge is the **error contract**: the Field path and the error code, kept
  separate from the translated message. Without it, an error returned by the server cannot be
  mapped onto an entry in the Error summary. The contract is out of scope for the PoC, but
  Field paths are already nested by Section in anticipation of it.
