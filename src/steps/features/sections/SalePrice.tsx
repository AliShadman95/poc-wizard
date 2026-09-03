import { NumberInput, Section } from '../../../ui/inputs';

/** Shown for a SALE only. */
export function SalePrice() {
  return (
    <Section title="Prezzo">
      <NumberInput section="price" name="salePrice" label="Prezzo di vendita (€)" />
      <NumberInput section="price" name="notaryFees" label="Spese notarili stimate (€)" />
    </Section>
  );
}
