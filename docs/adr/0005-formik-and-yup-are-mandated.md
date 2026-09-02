# Formik and Yup are mandated, not chosen

The form handling stack is Formik with Yup, by company constraint. We use the current
versions: Yup 1.x and Formik 2.4.x. Recorded because the natural choice today for a form of
this shape — many fields, conditionals, an aggregated error summary — would be React Hook
Form with Zod, and without this note somebody will propose it again every six months.

## Consequences

- There is no automatic de-registration of a field's value when it unmounts, so clearing
  abandoned Fields has to be handled explicitly (see ADR 0003).
- There is no per-Field subscription: every change re-renders the form tree. This is addressed
  with memoised Section components if and when it becomes a measured problem.
- Yup 1.x conditional syntax requires `(schema) => schema` functions: most examples in
  circulation still use the 0.32 form and do not work.
