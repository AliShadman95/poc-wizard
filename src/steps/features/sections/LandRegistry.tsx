import { Section, TextInput } from '../../../ui/inputs';

/** Esiste solo in Italia. In Spagna questa sezione non viene proprio renderizzata. */
export function LandRegistry() {
  return (
    <Section title="Dati catastali">
      <TextInput section="landRegistry" name="sheet" label="Foglio" />
      <TextInput section="landRegistry" name="parcel" label="Particella" />
      <TextInput section="landRegistry" name="subUnit" label="Subalterno" />
    </Section>
  );
}
