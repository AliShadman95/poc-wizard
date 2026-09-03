import type { AnyObjectSchema } from 'yup';
import type { StepValues, Tenant } from '../../domain';
import { featuresInitialValuesES, featuresSchemaES } from './schema.es';
import { featuresInitialValuesIT, featuresSchemaIT } from './schema.it';

/**
 * The single place where the tenant is resolved to a schema. The ternary used to be
 * written in FeaturesStep and repeated in payload.ts, so adding a market meant hunting
 * for both.
 *
 * The `switch` without a `default` is not a formality: with a declared return type,
 * adding a tenant to the union makes the function non-exhaustive and TypeScript rejects
 * it. That is the compile-time check ADR 0008 expected to lose, recovered here without
 * bringing back any descriptor.
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
