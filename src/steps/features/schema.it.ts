import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, PropertyType, StepValues } from '../../domain';

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

const mainDetails = () =>
  Yup.object({
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

/** Sezione che esiste solo in Italia. */
const landRegistry = () =>
  Yup.object({
    sheet: text().matches(/^\d{1,4}$/, 'Da 1 a 4 cifre').required(REQUIRED).label('Foglio'),
    parcel: text().matches(/^\d{1,5}$/, 'Da 1 a 5 cifre').required(REQUIRED).label('Particella'),
    subUnit: text().matches(/^\d{0,4}$/, 'Da 1 a 4 cifre').label('Subalterno'),
  }).label('Dati catastali');

const codiceFiscale = () =>
  text()
    .matches(/^[A-Za-z0-9]{16}$/, 'Il codice fiscale è di 16 caratteri alfanumerici')
    .required(REQUIRED)
    .label('Codice fiscale del proprietario');

// --- Contratto e prezzo, una funzione per tipologia -------------------------------

function contractAndPriceApartment(contractType: ContractType | '') {
  if (contractType === 'rent') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
      serviceCharges: number().min(0, 'Non può essere negativo').label('Spese condominiali mensili (€)'),
      depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
      codiceFiscale: codiceFiscale(),
    }).label('Contratto e prezzo');
  }
  if (contractType === 'sale') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
      notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
      codiceFiscale: codiceFiscale(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    codiceFiscale: codiceFiscale(),
  }).label('Contratto e prezzo');
}

function contractAndPriceVilla(contractType: ContractType | '') {
  if (contractType === 'rent') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
      serviceCharges: number().min(0, 'Non può essere negativo').label('Spese di manutenzione mensili (€)'),
      depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
      codiceFiscale: codiceFiscale(),
    }).label('Contratto e prezzo');
  }
  if (contractType === 'sale') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
      notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
      codiceFiscale: codiceFiscale(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    codiceFiscale: codiceFiscale(),
  }).label('Contratto e prezzo');
}

/** Un ufficio si può solo vendere, e richiede la licenza commerciale. */
function contractAndPriceOffice(contractType: ContractType | '') {
  if (contractType === 'sale') {
    return Yup.object({
      contractType: text().oneOf(['sale'], 'Un ufficio si può solo vendere').required(REQUIRED).label('Tipo di contratto'),
      salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
      notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
      businessLicence: text().matches(/^[A-Za-z0-9/-]{4,20}$/, 'Da 4 a 20 caratteri alfanumerici').required(REQUIRED).label('Numero di licenza commerciale'),
      codiceFiscale: codiceFiscale(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().oneOf(['sale'], 'Un ufficio si può solo vendere').required(REQUIRED).label('Tipo di contratto'),
    businessLicence: text().matches(/^[A-Za-z0-9/-]{4,20}$/, 'Da 4 a 20 caratteri alfanumerici').required(REQUIRED).label('Numero di licenza commerciale'),
    codiceFiscale: codiceFiscale(),
  }).label('Contratto e prezzo');
}

/**
 * Le sezioni sono aggiunte nello stesso ordine in cui FeaturesStep le renderizza.
 * Se non è ancora stata scelta una tipologia, la sezione Contratto e prezzo non è
 * a schermo e quindi non è nemmeno nello schema.
 */
export function featuresSchemaIT(values: StepValues): AnyObjectSchema {
  const propertyType = (values.mainDetails?.propertyType ?? '') as PropertyType | '';
  const contractType = (values.contractAndPrice?.contractType ?? '') as ContractType | '';

  const shape: Record<string, AnyObjectSchema> = {
    mainDetails: mainDetails(),
    address: address(),
  };
  if (propertyType === 'apartment') shape.contractAndPrice = contractAndPriceApartment(contractType);
  if (propertyType === 'villa') shape.contractAndPrice = contractAndPriceVilla(contractType);
  if (propertyType === 'office') shape.contractAndPrice = contractAndPriceOffice(contractType);
  shape.landRegistry = landRegistry();

  return Yup.object(shape);
}

export const featuresInitialValuesIT: StepValues = {
  mainDetails: { propertyType: '', areaSqm: '', rooms: '', bathrooms: '' },
  address: { street: '', streetNumber: '', city: '', postalCode: '' },
  contractAndPrice: {
    contractType: '',
    salePrice: '',
    notaryFees: '',
    monthlyRent: '',
    serviceCharges: '',
    depositMonths: '',
    businessLicence: '',
    codiceFiscale: '',
  },
  landRegistry: { sheet: '', parcel: '', subUnit: '' },
};
