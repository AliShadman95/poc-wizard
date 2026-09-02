import { NumberInput, Section } from '../../../ui/inputs';

/** Compare solo per l'AFFITTO. */
export function RentTerms() {
  return (
    <Section title="Canone e condizioni">
      <NumberInput section="rentTerms" name="monthlyRent" label="Canone mensile (€)" />
      <NumberInput section="rentTerms" name="serviceCharges" label="Spese condominiali mensili (€)" />
      <NumberInput section="rentTerms" name="depositMonths" label="Mesi di cauzione" />
    </Section>
  );
}
