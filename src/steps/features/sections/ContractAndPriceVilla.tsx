import { useFormikContext } from 'formik';
import type { StepValues, Tenant } from '../../../domain';
import { NumberInput, Section, SelectInput } from '../../../ui/inputs';
import { CodiceFiscaleField, NifField } from './OwnerTaxId';

/**
 * Contratto e prezzo per una VILLA. Oggi quasi identica all'appartamento: l'unica
 * differenza è che le spese ricorrenti sono di manutenzione e non condominiali.
 * È un duplicato voluto — le due tipologie divergeranno e qui si vede subito dove.
 */
export function ContractAndPriceVilla({ tenant }: { tenant: Tenant }) {
  const { values } = useFormikContext<StepValues>();
  const contractType = values.contractAndPrice?.contractType;

  return (
    <Section title="Contratto e prezzo">
      <SelectInput
        section="contractAndPrice"
        name="contractType"
        label="Tipo di contratto"
        options={[
          { value: 'sale', label: 'Vendita' },
          { value: 'rent', label: 'Affitto' },
        ]}
      />

      {contractType === 'sale' && (
        <>
          <NumberInput section="contractAndPrice" name="salePrice" label="Prezzo di vendita (€)" />
          <NumberInput section="contractAndPrice" name="notaryFees" label="Spese notarili stimate (€)" />
        </>
      )}

      {contractType === 'rent' && (
        <>
          <NumberInput section="contractAndPrice" name="monthlyRent" label="Canone mensile (€)" />
          <NumberInput section="contractAndPrice" name="serviceCharges" label="Spese di manutenzione mensili (€)" />
          <NumberInput section="contractAndPrice" name="depositMonths" label="Mesi di cauzione" />
        </>
      )}

      {tenant === 'IT' ? <CodiceFiscaleField /> : <NifField />}
    </Section>
  );
}
