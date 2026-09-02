import { num, sameForAllTenants, select } from '../domain/fields';
import { numberSchema, REQUIRED, stringSchema } from '../domain/rules';
import type { SectionDescriptor } from '../domain/types';

export const mainDetails: SectionDescriptor = {
  id: 'mainDetails',
  step: 'features',
  title: 'Dati principali',
  byTenant: sameForAllTenants({
    fields: [
      select(
        'propertyType',
        'Tipologia',
        [
          { value: 'apartment', label: 'Appartamento' },
          { value: 'house', label: 'Villa' },
          { value: 'office', label: 'Ufficio' },
        ],
        stringSchema().required(REQUIRED),
      ),
      num('areaSqm', 'Superficie (m²)', numberSchema().positive('Deve essere maggiore di zero').required(REQUIRED)),
      num('rooms', 'Numero di locali', numberSchema().integer('Deve essere un numero intero').min(1, 'Almeno 1').required(REQUIRED)),
      num('bathrooms', 'Numero di bagni', numberSchema().integer('Deve essere un numero intero').min(1, 'Almeno 1').required(REQUIRED)),
    ],
  }),
};
