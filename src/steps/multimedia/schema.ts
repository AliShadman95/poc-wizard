import * as Yup from 'yup';
import type { StepValues } from '../../domain';

/** Uploads carry no validation for now: no minimum, no maximum, no size limit. */
export const multimediaSchema = () =>
  Yup.object({
    photos: Yup.object({
      images: Yup.array().of(Yup.mixed<File>()).label('Foto dell’immobile'),
    }).label('Foto'),
    floorPlans: Yup.object({
      floorPlan: Yup.array().of(Yup.mixed<File>()).label('Planimetria'),
      notes: Yup.string().trim().max(300, 'Massimo 300 caratteri').label('Note per la redazione'),
    }).label('Planimetrie e documenti'),
  });

export const multimediaInitialValues: StepValues = {
  photos: { images: [] },
  floorPlans: { floorPlan: [], notes: '' },
};
