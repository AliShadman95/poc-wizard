import { useFormikContext } from 'formik';
import type { ResolvedSection, StepValues } from '../domain/types';
import { activeFields } from '../wizard/schema';
import { FieldControl } from './FieldControl';

export function SectionView({ section }: { section: ResolvedSection }) {
  const { values } = useFormikContext<StepValues>();
  const fields = activeFields(section.shape, values[section.id]);

  return (
    <fieldset className="section">
      <legend>{section.title}</legend>
      {fields.map((field) => (
        <FieldControl key={field.name} section={section} field={field} />
      ))}
    </fieldset>
  );
}
