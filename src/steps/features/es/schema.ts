import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import type { ContractType, StepValues } from '../../../domain';

/**
 * The SPANISH market's schema, written out in full.
 * A deliberate duplicate of ../it/schema.ts. The real differences, visible in a diff:
 *   - the código postal's first two digits run from 01 to 52 (the province), the CAP's do not;
 *   - the tax identifier is the NIF, not the codice fiscale;
 *   - there is no Dati catastali section.
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

/** The first two digits of the código postal identify the province: 01 to 52. */
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

/** No Dati catastali section: that is the difference in shape from Italy. */
export function featuresSchema(values: StepValues): AnyObjectSchema {
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

export const featuresInitialValues: StepValues = {
  mainDetails: { category: '', group: '', propertyType: '', areaSqm: '', rooms: '', bathrooms: '' },
  address: { street: '', streetNumber: '', city: '', postalCode: '' },
  contract: { contractType: '', nif: '' },
  price: { salePrice: '', notaryFees: '' },
  rentTerms: { monthlyRent: '', serviceCharges: '', depositMonths: '' },
};
