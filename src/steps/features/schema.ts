import type { AnyObjectSchema } from 'yup';
import type { StepValues, Tenant } from '../../domain';
import { featuresInitialValuesES, featuresSchemaES } from './schema.es';
import { featuresInitialValuesIT, featuresSchemaIT } from './schema.it';

/**
 * L'unico punto in cui si sceglie lo schema in base al tenant. Prima il ternario era
 * scritto in FeaturesStep e ripetuto in payload.ts: aggiungere un mercato voleva dire
 * andarli a cercare.
 *
 * Lo `switch` senza `default` non è una formalità: con un tipo di ritorno dichiarato,
 * aggiungere un tenant alla union rende la funzione non esaustiva e TypeScript la
 * rifiuta. È il controllo a compile-time che l'ADR 0008 aveva messo in conto di
 * perdere, recuperato qui senza reintrodurre alcun descrittore.
 */
export function getFeaturesSchema(tenant: Tenant): (values: StepValues) => AnyObjectSchema {
  switch (tenant) {
    case 'IT':
      return featuresSchemaIT;
    case 'ES':
      return featuresSchemaES;
  }
}

export function getFeaturesInitialValues(tenant: Tenant): StepValues {
  switch (tenant) {
    case 'IT':
      return featuresInitialValuesIT;
    case 'ES':
      return featuresInitialValuesES;
  }
}
