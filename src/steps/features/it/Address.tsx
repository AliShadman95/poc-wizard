import { Section, TextInput } from '../../../ui/inputs';

export function Address() {
  return (
    <Section title="Indirizzo">
      <TextInput section="address" name="street" label="Via" />
      <TextInput section="address" name="streetNumber" label="Numero civico" />
      <TextInput section="address" name="city" label="Città" />
      <TextInput section="address" name="postalCode" label="CAP" help="Cinque cifre, es. 20121." />
    </Section>
  );
}
