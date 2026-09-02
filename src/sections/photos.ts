import * as Yup from 'yup';
import { files, sameForAllTenants } from '../domain/fields';
import type { SectionDescriptor } from '../domain/types';

const MAX_BYTES = 5 * 1024 * 1024;

/** Simulated uploads: the Files stay in memory, no network call. */
export const photos: SectionDescriptor = {
  id: 'photos',
  step: 'multimedia',
  title: 'Foto',
  byTenant: sameForAllTenants({
    fields: [
      files(
        'images',
        'Foto dell’immobile',
        Yup.array()
          .of(Yup.mixed<File>().required())
          .min(3, 'Carica almeno 3 foto')
          .max(20, 'Puoi caricare al massimo 20 foto')
          .test('size', 'Ogni foto deve pesare meno di 5 MB', (value) =>
            !value || value.every((f) => (f as File).size <= MAX_BYTES),
          ),
        { help: 'Da 3 a 20 immagini, massimo 5 MB ciascuna.' },
      ),
    ],
  }),
};
