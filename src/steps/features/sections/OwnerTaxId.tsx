import { TextInput } from '../../../ui/inputs';

/** L'identificativo fiscale di chi pubblica: campi diversi, non lo stesso campo con un formato diverso. */

export function CodiceFiscaleField() {
  return (
    <TextInput
      section="contract"
      name="codiceFiscale"
      label="Codice fiscale del proprietario"
      help="16 caratteri. Es. RSSMRA85M01H501Z"
    />
  );
}

export function NifField() {
  return (
    <TextInput
      section="contract"
      name="nif"
      label="NIF del proprietario"
      help="8 cifre e una lettera. Es. 12345678Z"
    />
  );
}
