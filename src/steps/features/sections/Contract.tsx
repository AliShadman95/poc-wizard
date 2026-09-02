import type { Tenant } from '../../../domain';
import { Section, SelectInput } from '../../../ui/inputs';
import { CodiceFiscaleField, NifField } from './OwnerTaxId';

/**
 * Il tipo di contratto decide quale sezione compare subito sotto: Prezzo per la
 * vendita, Canone e condizioni per l'affitto. Non dipende dalla categoria.
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
