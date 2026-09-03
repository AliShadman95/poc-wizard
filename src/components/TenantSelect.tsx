import { TENANTS, type Tenant } from '../domain';

/**
 * A demo instrument, not a product feature: it sits outside the wizard, and changing the
 * tenant clears the draft, because the two markets' fields do not coincide.
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
