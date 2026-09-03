import { useFormikContext } from 'formik';
import type { StepValues } from '../../../domain';
import { NumberInput, Section, SelectInput } from '../../../ui/inputs';
import { CATEGORIES, GROUPS_BY_CATEGORY, TYPES_BY_GROUP } from './propertyClassification';

/**
 * The same in both markets. The three selects at the top are a cascade: the category
 * decides the groups, the group decides the types. Changing a level clears the ones below
 * it, otherwise a type would stay selected that no longer belongs to its group.
 *
 * This choice affects NO other section: the contract type is independent of it.
 */
export function MainDetails() {
  const { values, setFieldValue } = useFormikContext<StepValues>();
  const category = (values.mainDetails?.category as string) ?? '';
  const group = (values.mainDetails?.group as string) ?? '';

  return (
    <Section title="Dati principali">
      <SelectInput
        section="mainDetails"
        name="category"
        label="Categoria"
        options={CATEGORIES}
        onValueChange={() => {
          setFieldValue('mainDetails.group', '');
          setFieldValue('mainDetails.propertyType', '');
        }}
      />
      <SelectInput
        section="mainDetails"
        name="group"
        label="Gruppo"
        options={category ? GROUPS_BY_CATEGORY[category] : []}
        help={category ? undefined : 'Scegli prima una categoria.'}
        onValueChange={() => setFieldValue('mainDetails.propertyType', '')}
      />
      <SelectInput
        section="mainDetails"
        name="propertyType"
        label="Tipologia"
        options={group ? TYPES_BY_GROUP[group] : []}
        help={group ? undefined : 'Scegli prima un gruppo.'}
      />

      <NumberInput section="mainDetails" name="areaSqm" label="Superficie (m²)" />
      <NumberInput section="mainDetails" name="rooms" label="Numero di locali" />
      <NumberInput section="mainDetails" name="bathrooms" label="Numero di bagni" />
    </Section>
  );
}
