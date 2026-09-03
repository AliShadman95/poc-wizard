import type { ReactElement } from 'react';
import type { AnyObjectSchema } from 'yup';
import type { StepValues, Tenant } from '../../domain';
import * as ES from './es';
import * as IT from './it';

/**
 * Every choice made on the tenant axis for this Step, gathered in one file. Adding a
 * market means copying a market folder and then letting the compiler list what is missing
 * here.
 *
 * None of these switches has a `default`, and each declares its return type. That makes
 * them exhaustive: adding a tenant to the union stops the build here, three times, until
 * the new market is wired up. It is the compile-time check ADR 0008 expected to lose,
 * recovered at the seam without bringing back any descriptor. It catches a market that
 * was never wired in — not a field missing from its schema.
 */

export function getFeaturesSchema(tenant: Tenant): (values: StepValues) => AnyObjectSchema {
  switch (tenant) {
    case 'IT':
      return IT.featuresSchema;
    case 'ES':
      return ES.featuresSchema;
  }
}

export function getFeaturesInitialValues(tenant: Tenant): StepValues {
  switch (tenant) {
    case 'IT':
      return IT.featuresInitialValues;
    case 'ES':
      return ES.featuresInitialValues;
  }
}

export function getFeaturesSections(tenant: Tenant): ReactElement {
  switch (tenant) {
    case 'IT':
      return <IT.Sections />;
    case 'ES':
      return <ES.Sections />;
  }
}
