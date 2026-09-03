import { Section, SelectInput, TextInput } from '../../../ui/inputs';

/**
 * The contract type decides which section appears directly below: Prezzo for a sale,
 * Canone e condizioni for a rental. It does not depend on the classification.
 *
 * The owner's tax identifier lives here. Italy and Spain do not share a field for it —
 * different name, different label, different shape — so each market has its own version
 * of this section rather than one component branching on the tenant.
 */
export function ContractIT() {
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
        name="codiceFiscale"
        label="Codice fiscale del proprietario"
        help="16 caratteri. Es. RSSMRA85M01H501Z"
      />
    </Section>
  );
}
