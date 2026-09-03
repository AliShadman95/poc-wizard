import type { Tenant } from '../../../domain';
import { Section, SelectInput } from '../../../ui/inputs';
import { CodiceFiscaleField, NifField } from './OwnerTaxId';

/**
 * The contract type decides which section appears directly below: Prezzo for a sale,
 * Canone e condizioni for a rental. It does not depend on the classification.
 */
export function Contract({ tenant }: { tenant: Tenant }) {
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
      {tenant === 'IT' ? <CodiceFiscaleField /> : <NifField />}
    </Section>
  );
}
