import * as Yup from 'yup';
import type { StepValues } from '../../domain';

export const publicationSchema = () =>
  Yup.object({
    visibility: Yup.object({
      visibility: Yup.string()
        .required('Campo obbligatorio')
        .label('Chi può vedere questo annuncio'),
    }).label('Visibilità'),
  });

export const publicationInitialValues: StepValues = {
  visibility: { visibility: '' },
};
