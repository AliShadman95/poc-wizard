import { useField, useFormikContext } from 'formik';
import type { FieldDescriptor, ResolvedSection, StepValues } from '../domain/types';
import { fieldId } from '../wizard/errors';
import { applyDiscriminantChange, pruneTouched } from '../wizard/values';

interface Props {
  section: ResolvedSection;
  field: FieldDescriptor;
}

export function FieldControl({ section, field }: Props) {
  const path = `${section.id}.${field.name}`;
  const [formikField, meta, helpers] = useField(path);
  const formik = useFormikContext<StepValues>();
  const id = fieldId(section.id, field.name);
  const showError = Boolean(meta.touched && meta.error);
  const isDiscriminant = section.shape.discriminant?.field.name === field.name;

  /**
   * Changing the Discriminant is not an ordinary onChange: it rebuilds the Section,
   * clearing the abandoned branch's values and touched state together. See ADR 0003.
   */
  const onDiscriminantChange = (value: string) => {
    formik.setValues({
      ...formik.values,
      [section.id]: applyDiscriminantChange(section.shape, formik.values[section.id] ?? {}, value),
    });
    formik.setTouched(
      {
        ...formik.touched,
        [section.id]: pruneTouched(
          section.shape,
          formik.touched[section.id] as Record<string, boolean> | undefined,
          value,
        ),
      },
      false,
    );
  };

  const common = {
    id,
    name: path,
    onBlur: formikField.onBlur,
    'aria-invalid': showError,
    'aria-describedby': showError ? `${id}-error` : undefined,
  };

  return (
    <div className="field">
      <label htmlFor={id}>{field.label}</label>

      {field.kind === 'select' && (
        <select
          {...common}
          value={(formikField.value as string) ?? ''}
          onChange={(e) =>
            isDiscriminant ? onDiscriminantChange(e.target.value) : helpers.setValue(e.target.value)
          }
        >
          <option value="">— seleziona —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {field.kind === 'radio' && (
        <div role="radiogroup" aria-labelledby={id}>
          {field.options?.map((o, i) => (
            <label key={o.value} className="radio">
              <input
                type="radio"
                id={i === 0 ? id : `${id}-${o.value}`}
                name={path}
                value={o.value}
                checked={formikField.value === o.value}
                onBlur={formikField.onBlur}
                onChange={() =>
                  isDiscriminant ? onDiscriminantChange(o.value) : helpers.setValue(o.value)
                }
              />
              {o.label}
            </label>
          ))}
        </div>
      )}

      {field.kind === 'textarea' && (
        <textarea {...common} rows={3} value={(formikField.value as string) ?? ''} onChange={(e) => helpers.setValue(e.target.value)} />
      )}

      {field.kind === 'files' && (
        <>
          <input
            {...common}
            type="file"
            multiple
            onChange={(e) => helpers.setValue(Array.from(e.target.files ?? []))}
          />
          <FileList value={formikField.value as File[] | undefined} />
        </>
      )}

      {(field.kind === 'text' || field.kind === 'number') && (
        <input
          {...common}
          type={field.kind === 'number' ? 'number' : 'text'}
          value={(formikField.value as string) ?? ''}
          onChange={(e) => helpers.setValue(e.target.value)}
        />
      )}

      {field.help && <p className="help">{field.help}</p>}
      {showError && (
        <p className="error" id={`${id}-error`}>
          {meta.error}
        </p>
      )}
    </div>
  );
}

function FileList({ value }: { value: File[] | undefined }) {
  if (!value?.length) return null;
  return (
    <ul className="filelist">
      {value.map((f) => (
        <li key={f.name}>
          {f.name} — {(f.size / 1024).toFixed(0)} KB
        </li>
      ))}
    </ul>
  );
}
