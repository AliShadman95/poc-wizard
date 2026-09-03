import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, StepValues } from '../../domain';

/**
 * The ITALIAN market's schema, written out in full.
 * Its Spanish twin is schema.es.ts: the two files are duplicates on purpose and are meant
 * to be read side by side, so that a diff shows what differs between the markets.
 *
 * The `.label()` calls are not only for messages: the error summary reads labels and order
 * from here via `describe()`, so the order of the fields in this file is the order of the
 * entries in the summary, and must be kept the same as the JSX.
 */

const REQUIRED = 'Campo obbligatorio';

/** An empty numeric input arrives as a string: without this, typeError fires instead of required. */
const number = () =>
  Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Inserisci un numero');

const text = () => Yup.string().trim();

/**
 * Category, group and type are a cascade handled in the UI, so all that is required here
 * is that they are present: the selects cannot offer an incoherent combination.
 */
const mainDetails = () =>
  Yup.object({
    category: text().required(REQUIRED).label('Categoria'),
    group: text().required(REQUIRED).label('Gruppo'),
    propertyType: text().required(REQUIRED).label('Tipologia'),
    areaSqm: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Superficie (m²)'),
    rooms: number().integer('Deve essere un numero intero').min(1, 'Almeno 1').required(REQUIRED).label('Numero di locali'),
    bathrooms: number().integer('Deve essere un numero intero').min(1, 'Almeno 1').required(REQUIRED).label('Numero di bagni'),
  }).label('Dati principali');

/** In Italy the CAP is any five digits. In Spain it is not: see schema.es.ts. */
const address = () =>
  Yup.object({
    street: text().required(REQUIRED).label('Via'),
    streetNumber: text().required(REQUIRED).label('Numero civico'),
    city: text().required(REQUIRED).label('Città'),
    postalCode: text().matches(/^\d{5}$/, 'Il CAP deve essere di 5 cifre').required(REQUIRED).label('CAP'),
  }).label('Indirizzo');

const contract = () =>
  Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    codiceFiscale: text()
      .matches(/^[A-Za-z0-9]{16}$/, 'Il codice fiscale è di 16 caratteri alfanumerici')
      .required(REQUIRED)
      .label('Codice fiscale del proprietario'),
  }).label('Contratto');

/** Sale only. */
const price = () =>
  Yup.object({
    salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
    notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
  }).label('Prezzo');

/** Rental only. */
const rentTerms = () =>
  Yup.object({
    monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
    serviceCharges: number().min(0, 'Non può essere negativo').label('Spese condominiali mensili (€)'),
    depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
  }).label('Canone e condizioni');

/** A section that exists in Italy only. */
const landRegistry = () =>
  Yup.object({
    sheet: text().matches(/^\d{1,4}$/, 'Da 1 a 4 cifre').required(REQUIRED).label('Foglio'),
    parcel: text().matches(/^\d{1,5}$/, 'Da 1 a 5 cifre').required(REQUIRED).label('Particella'),
    subUnit: text().matches(/^\d{0,4}$/, 'Da 1 a 4 cifre').label('Subalterno'),
  }).label('Dati catastali');

/** Sections are added in the same order in which FeaturesStep renders them. */
export function featuresSchemaIT(values: StepValues): AnyObjectSchema {
  const contractType = (values.contract?.contractType ?? '') as ContractType | '';

  const shape: Record<string, AnyObjectSchema> = {
    mainDetails: mainDetails(),
    address: address(),
    contract: contract(),
  };
  if (contractType === 'sale') shape.price = price();
  if (contractType === 'rent') shape.rentTerms = rentTerms();
  shape.landRegistry = landRegistry();

  return Yup.object(shape);
}

export const featuresInitialValuesIT: StepValues = {
  mainDetails: { category: '', group: '', propertyType: '', areaSqm: '', rooms: '', bathrooms: '' },
  address: { street: '', streetNumber: '', city: '', postalCode: '' },
  contract: { contractType: '', codiceFiscale: '' },
  price: { salePrice: '', notaryFees: '' },
  rentTerms: { monthlyRent: '', serviceCharges: '', depositMonths: '' },
  landRegistry: { sheet: '', parcel: '', subUnit: '' },
};
