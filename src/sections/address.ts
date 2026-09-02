import { text } from '../domain/fields';
import { REQUIRED, stringSchema } from '../domain/rules';
import type { FieldDescriptor, SectionDescriptor } from '../domain/types';

/**
 * TYPE A variation: same logical Field (`postalCode`), different format and label
 * per market. In Italy the CAP is any five digits; in Spain the first two identify
 * the province and range from 01 to 52 — so "99999" is valid in IT and not in ES.
 * That is the difference to try with the toggle.
 *
 * The labels stay in the market's own language on purpose: "CAP" and "Código postal"
 * are the real names of the thing, and they are what the variation demonstrates.
 */
const shared: FieldDescriptor[] = [
  text('street', 'Via / Calle', stringSchema().required(REQUIRED)),
  text('streetNumber', 'Numero civico', stringSchema().required(REQUIRED)),
  text('city', 'Città', stringSchema().required(REQUIRED)),
];

const italianPostalCode = text(
  'postalCode',
  'CAP',
  stringSchema()
    .matches(/^\d{5}$/, 'Il CAP deve essere di 5 cifre')
    .required(REQUIRED),
  { help: 'Cinque cifre, es. 20121.' },
);

const spanishPostalCode = text(
  'postalCode',
  'Código postal',
  stringSchema()
    .matches(/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, 'Le prime due cifre devono indicare una provincia (01-52)')
    .required(REQUIRED),
  { help: 'Cinque cifre, le prime due fra 01 e 52. Es. 28013.' },
);

export const address: SectionDescriptor = {
  id: 'address',
  step: 'features',
  title: 'Indirizzo',
  byTenant: {
    IT: { fields: [...shared, italianPostalCode] },
    ES: { fields: [...shared, spanishPostalCode] },
  },
};
