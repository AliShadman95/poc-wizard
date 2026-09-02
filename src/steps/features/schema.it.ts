import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, StepValues } from '../../domain';

/**
 * Lo schema del mercato ITALIANO, scritto per esteso.
 * Il gemello spagnolo è in schema.es.ts: i due file sono volutamente duplicati e
 * vanno letti affiancati, così la differenza fra i mercati si vede con un diff.
 *
 * Le `.label()` non servono solo ai messaggi: il riepilogo errori legge etichette e
 * ordine da qui con `describe()`, quindi l'ordine dei campi in questo file è l'ordine
 * delle voci nel riepilogo, e va tenuto uguale a quello del JSX.
 */

const REQUIRED = 'Campo obbligatorio';

/** Un input numerico vuoto arriva come stringa: senza questo scatta typeError invece di required. */
const number = () =>
  Yup.number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Inserisci un numero');

const text = () => Yup.string().trim();

/**
 * Categoria, gruppo e tipologia sono una cascata gestita nella UI: qui basta esigerne
 * la presenza, perché le select non possono offrire una combinazione incoerente.
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

/** In Italia il CAP è cinque cifre qualsiasi. In Spagna no: vedi schema.es.ts. */
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

/** Solo per la vendita. */
const price = () =>
  Yup.object({
    salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
    notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
  }).label('Prezzo');

/** Solo per l'affitto. */
const rentTerms = () =>
  Yup.object({
    monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
    serviceCharges: number().min(0, 'Non può essere negativo').label('Spese condominiali mensili (€)'),
    depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
  }).label('Canone e condizioni');

/** Sezione che esiste solo in Italia. */
const landRegistry = () =>
  Yup.object({
    sheet: text().matches(/^\d{1,4}$/, 'Da 1 a 4 cifre').required(REQUIRED).label('Foglio'),
    parcel: text().matches(/^\d{1,5}$/, 'Da 1 a 5 cifre').required(REQUIRED).label('Particella'),
    subUnit: text().matches(/^\d{0,4}$/, 'Da 1 a 4 cifre').label('Subalterno'),
  }).label('Dati catastali');

/** Le sezioni sono aggiunte nello stesso ordine in cui FeaturesStep le renderizza. */
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
