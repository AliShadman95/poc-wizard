# Step values are normalised after every change

After any change to a Step's values, a single pass rewrites them to match what the
descriptors currently allow: Fields that are no longer active are dropped, Fields that have
just become active are seeded empty, and a value that is no longer among its Field's
available options is cleared — together with the corresponding touched state. The
alternative was a bespoke `onChange` handler on each governing Field, which is what the
code did while the only relationship was a Section's own Discriminant.

## Consequences

- Adding a relationship between Fields costs a declaration and no handler. With
  Discriminants, cross-Section Dependencies and option constraints all in play, the number
  of hand-written handlers would otherwise grow with the number of relationships, and the
  one that gets forgotten fails silently — a stale value reaching the payload.
- The pass runs to a fixed point, because one correction can enable the next: forbidding
  "rent" for an office clears Contract type, which in turn removes that branch's price
  Fields. It terminates because each pass only ever removes Fields or empties values.
- `FieldControl` has no special case for a governing Field: changing one is an ordinary
  `setValue`.
- The cost is an effect that rewrites form state, which is surprising to read. It is
  guarded by an equality check, so it is a no-op unless something genuinely changed; without
  that guard it would loop forever.
