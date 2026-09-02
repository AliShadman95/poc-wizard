import * as Yup from 'yup';

/**
 * An empty numeric input arrives as an empty string and Yup casts it to NaN,
 * triggering `typeError` instead of `required`. This transform restores the right
 * message: "field is required", not "must be a number".
 */
export const numberSchema = () =>
  Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Inserisci un numero');

export const stringSchema = () => Yup.string().trim();

export const REQUIRED = 'Campo obbligatorio';
