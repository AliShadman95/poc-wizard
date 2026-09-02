import { Section, TextInput } from '../../../ui/inputs';

export function AddressES() {
  return (
    <Section title="Indirizzo">
      <TextInput section="address" name="street" label="Calle" />
      <TextInput section="address" name="streetNumber" label="Numero civico" />
      <TextInput section="address" name="city" label="Città" />
      <TextInput
        section="address"
        name="postalCode"
        label="Código postal"
        help="Cinque cifre, le prime due fra 01 e 52. Es. 28013."
      />
    </Section>
  );
}
