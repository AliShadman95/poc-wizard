import { forwardRef } from 'react';
import { focusField, type ErrorEntry } from '../errorSummary';

export const ErrorSummary = forwardRef<HTMLDivElement, { entries: ErrorEntry[] }>(
  function ErrorSummary({ entries }, ref) {
    if (entries.length === 0) return null;
    return (
      <div className="summary" role="alert" tabIndex={-1} ref={ref}>
        <strong>
          {entries.length === 1
            ? 'C’è 1 campo da sistemare prima di continuare:'
            : `Ci sono ${entries.length} campi da sistemare prima di continuare:`}
        </strong>
        <ul>
          {entries.map((e) => (
            <li key={e.path}>
              <button type="button" onClick={() => focusField(e.id)}>
                {e.sectionTitle} › {e.label}
              </button>{' '}
              — {e.message}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
