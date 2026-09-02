import { NumberInput, Section, SelectInput } from '../../../ui/inputs';

/** Uguale nei due mercati. Il valore di Tipologia decide quale sezione Contratto e prezzo compare. */
export function MainDetails() {
  return (
    <Section title="Dati principali">
      <SelectInput
        section="mainDetails"
        name="propertyType"
        label="Tipologia"
        options={[
          { value: 'apartment', label: 'Appartamento' },
          { value: 'villa', label: 'Villa' },
          { value: 'office', label: 'Ufficio' },
        ]}
      />
      <NumberInput section="mainDetails" name="areaSqm" label="Superficie (m²)" />
      <NumberInput section="mainDetails" name="rooms" label="Numero di locali" />
      <NumberInput section="mainDetails" name="bathrooms" label="Numero di bagni" />
    </Section>
  );
}
