import { Section, SelectInput, TextInput } from '../../../ui/inputs';

/** The Spanish twin of it/Contract. The tax identifier is the NIF, not the codice fiscale. */
export function Contract() {
  return (
    <Section title="Contratto">
      <SelectInput
        section="contract"
        name="contractType"
        label="Tipo di contratto"
        options={[
          { value: 'sale', label: 'Vendita' },
          { value: 'rent', label: 'Affitto' },
        ]}
      />
      <TextInput
        section="contract"
        name="nif"
        label="NIF del proprietario"
        help="8 cifre e una lettera. Es. 12345678Z"
      />
    </Section>
  );
}
