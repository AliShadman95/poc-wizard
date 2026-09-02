import { forwardRef } from 'react';
import type { ErrorEntry } from '../wizard/errors';
import { focusField } from '../wizard/errors';

/**
 * The Error summary is always scoped to the current Step (ADR 0006), so every entry
 * is reachable by scrolling within the page already on screen: no navigating between
 * Steps and no waiting for another form to mount.
 */
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
              <button type="button" onClick={() => focusField(e.fieldId)}>
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
