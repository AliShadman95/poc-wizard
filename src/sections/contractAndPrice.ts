import { num, select, text } from '../domain/fields';
import { numberSchema, REQUIRED, stringSchema } from '../domain/rules';
import type { ContractType, Discriminant, FieldDescriptor, SectionDescriptor } from '../domain/types';

/**
 * This Section is the heart of the PoC: a Discriminant and a per-Tenant variation
 * live together here, which is where the two mechanisms could interfere.
 */

const contractType = select(
  'contractType',
  'Tipo di contratto',
  [
    { value: 'sale', label: 'Vendita' },
    { value: 'rent', label: 'Affitto' },
  ],
  stringSchema().required(REQUIRED),
);

/**
 * TOTAL map over ContractType. Adding 'auction' to the union in domain/types.ts
 * breaks compilation here until its Fields are declared: exactly what a `.when()`
 * with an `otherwise` branch would fail to do. See ADR 0003.
 */
const branches: Record<ContractType, FieldDescriptor[]> = {
  sale: [
    num('salePrice', 'Prezzo di vendita (€)', numberSchema().positive('Deve essere maggiore di zero').required(REQUIRED)),
    num('notaryFees', 'Spese notarili stimate (€)', numberSchema().min(0, 'Non può essere negativo')),
  ],
  rent: [
    num('monthlyRent', 'Canone mensile (€)', numberSchema().positive('Deve essere maggiore di zero').required(REQUIRED)),
    num('serviceCharges', 'Spese condominiali mensili (€)', numberSchema().min(0, 'Non può essere negativo')),
    num('depositMonths', 'Mesi di cauzione', numberSchema().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED)),
  ],
};

const discriminant: Discriminant<string> = { field: contractType, branches };

/**
 * TYPE B variation: not the same Field with a different format, but genuinely
 * different Fields. The publisher's tax identifier is the `codiceFiscale` in Italy
 * and the `nif` in Spain: the name, the label and the shape of the schema all change.
 *
 * Both keep their legal names rather than being translated: they are proper nouns
 * of the domain, like IBAN, and renaming them would lose the reference.
 */
const codiceFiscale = text(
  'codiceFiscale',
  'Codice fiscale del proprietario',
  stringSchema()
    .matches(/^[A-Za-z0-9]{16}$/, 'Il codice fiscale è di 16 caratteri alfanumerici')
    .required(REQUIRED),
  { help: '16 caratteri. Es. RSSMRA85M01H501Z' },
);

const nif = text(
  'nif',
  'NIF del proprietario',
  stringSchema()
    .matches(/^\d{8}[A-Za-z]$/, 'Il NIF è composto da 8 cifre seguite da una lettera')
    .required(REQUIRED),
  { help: '8 cifre e una lettera. Es. 12345678Z' },
);

export const contractAndPrice: SectionDescriptor = {
  id: 'contractAndPrice',
  step: 'features',
  title: 'Contratto e prezzo',
  byTenant: {
    IT: { discriminant, fields: [codiceFiscale] },
    ES: { discriminant, fields: [nif] },
  },
};
