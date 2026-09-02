import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, StepValues } from '../../domain';

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

const contract = () =>
  Yup.object({
    contractType: text().required(REQUIRED).label('Tipo di contratto'),
    nif: text()
      .matches(/^\d{8}[A-Za-z]$/, 'Il NIF è composto da 8 cifre seguite da una lettera')
      .required(REQUIRED)
      .label('NIF del proprietario'),
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

/** Nessuna sezione Dati catastali: è la differenza di forma rispetto all'Italia. */
export function featuresSchemaES(values: StepValues): AnyObjectSchema {
  const contractType = (values.contract?.contractType ?? '') as ContractType | '';

  const shape: Record<string, AnyObjectSchema> = {
    mainDetails: mainDetails(),
    address: address(),
    contract: contract(),
  };
  if (contractType === 'sale') shape.price = price();
  if (contractType === 'rent') shape.rentTerms = rentTerms();

  return Yup.object(shape);
}

export const featuresInitialValuesES: StepValues = {
  mainDetails: { category: '', group: '', propertyType: '', areaSqm: '', rooms: '', bathrooms: '' },
  address: { street: '', streetNumber: '', city: '', postalCode: '' },
  contract: { contractType: '', nif: '' },
  price: { salePrice: '', notaryFees: '' },
  rentTerms: { monthlyRent: '', serviceCharges: '', depositMonths: '' },
};
