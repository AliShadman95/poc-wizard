import * as Yup from 'yup';
import { files, sameForAllTenants } from '../domain/fields';
import type { SectionDescriptor } from '../domain/types';

/**
 * Simulated uploads: the Files stay in memory, no network call.
 * No validation on uploads for now — no minimum count, no maximum, no size limit.
 */
export const photos: SectionDescriptor = {
  id: 'photos',
  step: 'multimedia',
  title: 'Foto',
  byTenant: sameForAllTenants({
    fields: [
      files('images', 'Foto dell\u2019immobile', Yup.array().of(Yup.mixed<File>())),
    ],
  }),
};
