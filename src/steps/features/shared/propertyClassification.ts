/**
 * How a property is classified: Category -> Group -> Type.
 * Choosing a category decides the available groups; choosing a group decides the types.
 * These are option lists for `<select>` elements, not validation rules: the schemas only
 * require the three fields to be filled in, because the UI cannot produce an incoherent
 * combination (changing the category clears group and type, changing the group clears
 * the type).
 *
 * Today the classification is the same in both markets. Should it ever diverge, this file
 * gets duplicated per tenant the way the schemas already are.
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
