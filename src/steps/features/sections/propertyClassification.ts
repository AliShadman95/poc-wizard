/**
 * La classificazione dell'immobile: Categoria → Gruppo → Tipologia.
 * Scegliere una categoria decide i gruppi disponibili; scegliere un gruppo decide
 * le tipologie. Sono liste di opzioni per delle `<select>`, non regole di validazione:
 * gli schemi si limitano a esigere che i tre campi siano valorizzati, perché la UI
 * non può produrre una combinazione incoerente (cambiando categoria si azzerano
 * gruppo e tipologia, cambiando gruppo si azzera la tipologia).
 *
 * Oggi la classificazione è la stessa nei due mercati. Se un domani divergesse,
 * questo file si duplica per tenant come già fatto per gli schemi.
 */

export const CATEGORIES = [
  { value: 'residential', label: 'Residenziale' },
  { value: 'shop', label: 'Negozio' },
  { value: 'office', label: 'Ufficio' },
];

export const GROUPS_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  residential: [
    { value: 'homes', label: 'Abitazioni' },
    { value: 'accessory', label: 'Pertinenze' },
  ],
  shop: [
    { value: 'retail', label: 'Locali commerciali' },
    { value: 'catering', label: 'Ristorazione' },
  ],
  office: [{ value: 'offices', label: 'Uffici' }],
};

export const TYPES_BY_GROUP: Record<string, { value: string; label: string }[]> = {
  homes: [
    { value: 'apartment', label: 'Appartamento' },
    { value: 'villa', label: 'Villa' },
    { value: 'terraced', label: 'Villetta a schiera' },
  ],
  accessory: [
    { value: 'garage', label: 'Box / Garage' },
    { value: 'cellar', label: 'Cantina' },
  ],
  retail: [
    { value: 'retailUnit', label: 'Locale commerciale' },
    { value: 'workshop', label: 'Laboratorio' },
  ],
  catering: [
    { value: 'restaurant', label: 'Ristorante' },
    { value: 'bar', label: 'Bar' },
  ],
  offices: [
    { value: 'office', label: 'Ufficio' },
    { value: 'studio', label: 'Studio professionale' },
  ],
};
