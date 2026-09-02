import type { SectionDescriptor } from '../domain/types';
import { address } from './address';
import { contractAndPrice } from './contractAndPrice';
import { floorPlans } from './floorPlans';
import { landRegistry } from './landRegistry';
import { mainDetails } from './mainDetails';
import { photos } from './photos';
import { visibility } from './visibility';

/**
 * The order of this array is the rendering order within each Step, and also the
 * order of the entries in the Error summary: the list must follow the eye, not the
 * alphabetical order of the keys in `errors`.
 */
export const SECTIONS: SectionDescriptor[] = [
  photos,
  floorPlans,
  mainDetails,
  address,
  contractAndPrice,
  landRegistry,
  visibility,
];
