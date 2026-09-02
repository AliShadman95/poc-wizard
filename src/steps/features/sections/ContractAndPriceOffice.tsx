import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import type { StepValues, Tenant } from '../../../domain';
import { NumberInput, Section, SelectInput, TextInput } from '../../../ui/inputs';
import { CodiceFiscaleField, NifField } from './OwnerTaxId';

/**
 * Contratto e prezzo per un UFFICIO. Due differenze rispetto al residenziale:
 * nella select non compare Affitto, e serve la licenza commerciale.
 */
export function ContractAndPriceOffice({ tenant }: { tenant: Tenant }) {
  const { values, setFieldValue } = useFormikContext<StepValues>();
  const contractType = values.contractAndPrice?.contractType;

  // Chi arriva qui da Appartamento avendo scelto Affitto si porta dietro un valore
  // che per un ufficio non esiste più. Lo azzeriamo all'ingresso, qui e non altrove.
  useEffect(() => {
    if (values.contractAndPrice?.contractType === 'rent') {
      setFieldValue('contractAndPrice.contractType', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section title="Contratto e prezzo">
      <SelectInput
        section="contractAndPrice"
        name="contractType"
        label="Tipo di contratto"
        options={[{ value: 'sale', label: 'Vendita' }]}
        help="Un ufficio si può solo vendere."
      />

      {contractType === 'sale' && (
        <>
          <NumberInput section="contractAndPrice" name="salePrice" label="Prezzo di vendita (€)" />
          <NumberInput section="contractAndPrice" name="notaryFees" label="Spese notarili stimate (€)" />
        </>
      )}

      <TextInput
        section="contractAndPrice"
        name="businessLicence"
        label="Numero di licenza commerciale"
        help="Richiesto solo per gli uffici."
      />

      {tenant === 'IT' ? <CodiceFiscaleField /> : <NifField />}
    </Section>
  );
}
