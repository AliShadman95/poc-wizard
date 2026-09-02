# Per-Tenant composition through Section Variants

Differences between Tenants are expressed as Variants of Sections — which Fields exist,
what format they accept, what labels they carry — plus the list of Sections enabled for
that Tenant. There is no separate, complete validation schema per Tenant. The alternative
considered (one Yup schema per Tenant) was rejected because the cost grows not with the
number of Tenants but with the product of Fields and Tenants, and above all because two
parallel schemas never state *what* the differences between markets actually are: that
information stays implicit in the diff between two long, nearly identical files.

## Considered Options

- **One schema per Tenant**: ~90 fields duplicated per market, silent drift whenever a Field
  is added and one file is forgotten, and no compile error to catch it.
- **A single schema with conditions on `$tenant` everywhere**: unreadable beyond 2-3 Tenants,
  and it requires passing the context on every call, with phantom behaviour if it is forgotten once.
- **Section Variants** (chosen): the per-Tenant configuration is itself the documentation of
  the differences between markets.

## Consequences

- A Section's position in the Wizard is invariant with respect to the Tenant: presence and
  shape vary, the owning Step never does.
- Typing the configuration as a total map over Tenants makes adding one a compile error until
  its composition is declared, rather than silently inheriting a default.
