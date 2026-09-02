import * as Yup from 'yup';
import { files, sameForAllTenants, textarea } from '../domain/fields';
import { stringSchema } from '../domain/rules';
import type { SectionDescriptor } from '../domain/types';

export const floorPlans: SectionDescriptor = {
  id: 'floorPlans',
  step: 'multimedia',
  title: 'Planimetrie e documenti',
  byTenant: sameForAllTenants({
    fields: [
      files('floorPlan', 'Planimetria', Yup.array().of(Yup.mixed<File>())),
      textarea('notes', 'Note per la redazione', stringSchema().max(300, 'Massimo 300 caratteri')),
    ],
  }),
};
