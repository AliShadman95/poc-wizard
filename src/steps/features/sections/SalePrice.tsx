import { NumberInput, Section } from '../../../ui/inputs';

/** Compare solo per la VENDITA. */
export function SalePrice() {
  return (
    <Section title="Prezzo">
      <NumberInput section="price" name="salePrice" label="Prezzo di vendita (€)" />
      <NumberInput section="price" name="notaryFees" label="Spese notarili stimate (€)" />
    </Section>
  );
}
