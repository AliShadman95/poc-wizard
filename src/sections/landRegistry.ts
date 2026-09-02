import { text } from '../domain/fields';
import { REQUIRED, stringSchema } from '../domain/rules';
import type { SectionDescriptor } from '../domain/types';

/**
 * TYPE C variation: the Section exists in Italy and not in Spain. The absence is
 * declared with `null`, not by omission: adding a Tenant forces an explicit decision
 * for it too. See ADR 0002.
 *
 * Visible effect of the toggle: the "features" Step has 4 Sections in IT and 3 in ES.
 */
export const landRegistry: SectionDescriptor = {
  id: 'landRegistry',
  step: 'features',
  title: 'Dati catastali',
  byTenant: {
    IT: {
      fields: [
        text('sheet', 'Foglio', stringSchema().matches(/^\d{1,4}$/, 'Da 1 a 4 cifre').required(REQUIRED)),
        text('parcel', 'Particella', stringSchema().matches(/^\d{1,5}$/, 'Da 1 a 5 cifre').required(REQUIRED)),
        text('subUnit', 'Subalterno', stringSchema().matches(/^\d{0,4}$/, 'Da 1 a 4 cifre')),
      ],
    },
    ES: null,
  },
};
