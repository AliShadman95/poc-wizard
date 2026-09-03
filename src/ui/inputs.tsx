import { useField } from 'formik';
import type { ReactNode } from 'react';
import { fieldId } from '../domain';

/**
 * Dumb inputs. They know nothing about the domain: the caller passes the path and
 * the label as literals, so reading a section component tells you exactly what it renders.
 */

interface Base {
  section: string;
  name: string;
  label: string;
  help?: string;
}

function Wrapper({ section, name, label, help, children }: Base & { children: (id: string, invalid: boolean) => ReactNode }) {
  const [, meta] = useField(`${section}.${name}`);
  const id = fieldId(section, name);
  const invalid = Boolean(meta.touched && meta.error);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id, invalid)}
      {help && <p className="help">{help}</p>}
      {invalid && (
        <p className="error" id={`${id}-error`}>
          {meta.error}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: Base) {
  const [field] = useField(`${props.section}.${props.name}`);
  return (
    <Wrapper {...props}>
      {(id, invalid) => (
        <input {...field} id={id} type="text" value={(field.value as string) ?? ''} aria-invalid={invalid} />
      )}
    </Wrapper>
  );
}

export function NumberInput(props: Base) {
  const [field] = useField(`${props.section}.${props.name}`);
  return (
    <Wrapper {...props}>
      {(id, invalid) => (
        <input {...field} id={id} type="number" value={(field.value as string) ?? ''} aria-invalid={invalid} />
      )}
    </Wrapper>
  );
}

export function TextareaInput(props: Base) {
  const [field] = useField(`${props.section}.${props.name}`);
  return (
    <Wrapper {...props}>
      {(id, invalid) => (
        <textarea {...field} id={id} rows={3} value={(field.value as string) ?? ''} aria-invalid={invalid} />
      )}
    </Wrapper>
  );
}

/**
 * `onValueChange` exists for one case only: a select that clears another one downstream,
 * as in Categoria -> Gruppo -> Tipologia. The reset itself stays written in the section
 * it concerns, not in here.
 */
export function SelectInput(
  props: Base & { options: { value: string; label: string }[]; onValueChange?: (value: string) => void },
) {
  const [field] = useField(`${props.section}.${props.name}`);
  return (
    <Wrapper {...props}>
      {(id, invalid) => (
        <select
          {...field}
          id={id}
          value={(field.value as string) ?? ''}
          aria-invalid={invalid}
          onChange={(e) => {
            field.onChange(e);
            props.onValueChange?.(e.target.value);
          }}
        >
          <option value="">— seleziona —</option>
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Wrapper>
  );
}

export function RadioInput(props: Base & { options: { value: string; label: string }[] }) {
  const [field, , helpers] = useField(`${props.section}.${props.name}`);
  return (
    <Wrapper {...props}>
      {(id) => (
        <div role="radiogroup">
          {props.options.map((o, i) => (
            <label key={o.value} className="radio">
              <input
                type="radio"
                id={i === 0 ? id : `${id}-${o.value}`}
                name={field.name}
                value={o.value}
                checked={field.value === o.value}
                onBlur={field.onBlur}
                onChange={() => helpers.setValue(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

export function FileInput(props: Base) {
  const [field, , helpers] = useField(`${props.section}.${props.name}`);
  const chosen = (field.value as File[] | undefined) ?? [];
  return (
    <Wrapper {...props}>
      {(id) => (
        <>
          <input
            id={id}
            name={field.name}
            type="file"
            multiple
            onBlur={field.onBlur}
            onChange={(e) => helpers.setValue(Array.from(e.target.files ?? []))}
          />
          {chosen.length > 0 && (
            <ul className="filelist">
              {chosen.map((f) => (
                <li key={f.name}>
                  {f.name} — {(f.size / 1024).toFixed(0)} KB
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Wrapper>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="section">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
