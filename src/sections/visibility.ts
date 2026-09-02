import { radio, sameForAllTenants } from '../domain/fields';
import { REQUIRED, stringSchema } from '../domain/rules';
import type { SectionDescriptor } from '../domain/types';

export const visibility: SectionDescriptor = {
  id: 'visibility',
  step: 'publication',
  title: 'Visibilità',
  byTenant: sameForAllTenants({
    fields: [
      radio(
        'visibility',
        'Chi può vedere questo annuncio',
        [
          { value: 'public', label: 'Pubblico — visibile a tutti sul portale' },
          { value: 'agenciesOnly', label: 'Riservato — visibile solo alle agenzie partner' },
        ],
        stringSchema().required(REQUIRED),
      ),
    ],
  }),
};
