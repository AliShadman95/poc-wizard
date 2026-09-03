import { Section, TextInput } from '../../../ui/inputs';

/** Italy only. In Spain this section is not rendered at all. */
export function LandRegistry() {
  return (
    <Section title="Dati catastali">
      <TextInput section="landRegistry" name="sheet" label="Foglio" />
      <TextInput section="landRegistry" name="parcel" label="Particella" />
      <TextInput section="landRegistry" name="subUnit" label="Subalterno" />
    </Section>
  );
}
