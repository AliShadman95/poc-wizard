import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, PropertyType, StepValues } from '../../domain';

/**
 * Lo schema del mercato SPAGNOLO, scritto per esteso.
 * Gemello duplicato di schema.it.ts. Le differenze reali, leggibili con un diff:
 *   - il código postal ha le prime due cifre fra 01 e 52 (la provincia), il CAP no;
 *   - l'identificativo fiscale è il NIF e non il codice fiscale;
 *   - non esiste la sezione Dati catastali.
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

/** Le prime due cifre del código postal indicano la provincia: da 01 a 52. */
const address = () =>
  Yup.object({
    street: text().required(REQUIRED).label('Calle'),
    streetNumber: text().required(REQUIRED).label('Numero civico'),
    city: text().required(REQUIRED).label('Città'),
    postalCode: text()
      .matches(/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, 'Le prime due cifre devono indicare una provincia (01-52)')
      .required(REQUIRED)
      .label('Código postal'),
  }).label('Indirizzo');

const nif = () =>
  text()
    .matches(/^\d{8}[A-Za-z]$/, 'Il NIF è composto da 8 cifre seguite da una lettera')
    .required(REQUIRED)
    .label('NIF del proprietario');

// --- Contratto e prezzo, una funzione per tipologia -------------------------------

function contractAndPriceApartment(contractType: ContractType | '') {
  if (contractType === 'rent') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
      serviceCharges: number().min(0, 'Non può essere negativo').label('Spese condominiali mensili (€)'),
      depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
      nif: nif(),
    }).label('Contratto e prezzo');
  }
  if (contractType === 'sale') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
      notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
      nif: nif(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    nif: nif(),
  }).label('Contratto e prezzo');
}

function contractAndPriceVilla(contractType: ContractType | '') {
  if (contractType === 'rent') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      monthlyRent: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Canone mensile (€)'),
      serviceCharges: number().min(0, 'Non può essere negativo').label('Spese di manutenzione mensili (€)'),
      depositMonths: number().integer('Deve essere un numero intero').min(0, 'Non può essere negativo').required(REQUIRED).label('Mesi di cauzione'),
      nif: nif(),
    }).label('Contratto e prezzo');
  }
  if (contractType === 'sale') {
    return Yup.object({
      contractType: text().required(REQUIRED).label('Tipo di contratto'),
      salePrice: number().positive('Deve essere maggiore di zero').required(REQUIRED).label('Prezzo di vendita (€)'),
      notaryFees: number().min(0, 'Non può essere negativo').label('Spese notarili stimate (€)'),
      nif: nif(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    nif: nif(),
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
      nif: nif(),
    }).label('Contratto e prezzo');
  }
  return Yup.object({
    contractType: text().oneOf(['sale'], 'Un ufficio si può solo vendere').required(REQUIRED).label('Tipo di contratto'),
    businessLicence: text().matches(/^[A-Za-z0-9/-]{4,20}$/, 'Da 4 a 20 caratteri alfanumerici').required(REQUIRED).label('Numero di licenza commerciale'),
    nif: nif(),
  }).label('Contratto e prezzo');
}

/** Nessuna sezione Dati catastali: è la differenza di forma rispetto all'Italia. */
export function featuresSchemaES(values: StepValues): AnyObjectSchema {
  const propertyType = (values.mainDetails?.propertyType ?? '') as PropertyType | '';
  const contractType = (values.contractAndPrice?.contractType ?? '') as ContractType | '';

  const shape: Record<string, AnyObjectSchema> = {
    mainDetails: mainDetails(),
    address: address(),
  };
  if (propertyType === 'apartment') shape.contractAndPrice = contractAndPriceApartment(contractType);
  if (propertyType === 'villa') shape.contractAndPrice = contractAndPriceVilla(contractType);
  if (propertyType === 'office') shape.contractAndPrice = contractAndPriceOffice(contractType);

  return Yup.object(shape);
}

export const featuresInitialValuesES: StepValues = {
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
    nif: '',
  },
};
