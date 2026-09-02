import { TENANTS, type Tenant } from '../domain';

/**
 * Strumento di demo, non funzionalità di prodotto: sta fuori dal wizard e cambiare
 * tenant azzera la bozza, perché i campi dei due mercati non coincidono.
 */
export function TenantSelect({ tenant, onChange }: { tenant: Tenant; onChange: (t: Tenant) => void }) {
  return (
    <div>
      <label htmlFor="tenant">Tenant (strumento di demo — cambiarlo azzera la bozza): </label>
      <select
        id="tenant"
        value={tenant}
        onChange={(e) => {
          const next = e.target.value as Tenant;
          if (next === tenant) return;
          if (window.confirm('Cambiare tenant azzera tutti i valori inseriti. Procedere?')) onChange(next);
        }}
      >
        {TENANTS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
