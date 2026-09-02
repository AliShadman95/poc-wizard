import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Draft, ResolvedSection, StepId, StepValues, Tenant } from '../domain/types';
import type { ResolvedStep } from '../wizard/config';
import { collectErrors, type ErrorEntry } from '../wizard/errors';
import { normaliseTouched, normaliseValues, sameValues, touchedForStep } from '../wizard/normalise';
import { stepSchema } from '../wizard/schema';
import { initialStepValues } from '../wizard/values';
import { ErrorSummary } from './ErrorSummary';
import { SectionView } from './SectionView';

interface Props {
  tenant: Tenant;
  step: ResolvedStep;
  steps: ResolvedStep[];
  draft: Draft;
  saved: StepValues | undefined;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
}

export function StepForm({ tenant, step, steps, draft, saved, onGo, onPublish }: Props) {
  const initialValues = useMemo(() => initialStepValues(step.sections, saved), [step, saved]);
  const schema = useMemo(() => stepSchema(step.sections), [step]);

  return (
    <Formik
      key={`${tenant}-${step.id}`}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onPublish}
    >
      <>
        <Normaliser sections={step.sections} />
        <StepBody step={step} steps={steps} draft={draft} onGo={onGo} onPublish={onPublish} />
      </>
    </Formik>
  );
}

/**
 * Keeps the Step's values consistent with the descriptors after every change: drops
 * Fields that are no longer active, seeds Fields that just became active, and clears
 * a value that is no longer among its Field's available options. See ADR 0007.
 */
function Normaliser({ sections }: { sections: ResolvedSection[] }) {
  const { values, setValues, touched, setTouched } = useFormikContext<StepValues>();

  useEffect(() => {
    const next = normaliseValues(sections, values);
    if (sameValues(next, values)) return;
    setValues(next);
    setTouched(normaliseTouched(sections, next, touched as Record<string, Record<string, boolean>>), false);
  }, [values, touched, sections, setValues, setTouched]);

  return null;
}

function StepBody({
  step,
  steps,
  draft,
  onGo,
  onPublish,
}: Pick<Props, 'step' | 'steps' | 'draft' | 'onGo' | 'onPublish'>) {
  const formik = useFormikContext<StepValues>();
  const [summary, setSummary] = useState<ErrorEntry[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  // The summary describes one specific attempt: as soon as the user edits anything
  // it stops being true, so it disappears rather than going stale.
  useEffect(() => {
    setSummary([]);
  }, [formik.values]);

  const isLast = step.index === steps.length - 1;
  const previous = steps[step.index - 1];
  const next = steps[step.index + 1];

  /**
   * Every way out of a Step goes through here — the Avanti button, the stepper at the
   * top, and publishing. Moving FORWARD validates first and blocks on failure, which
   * is what stops a user from going back, emptying a Field and skipping ahead again.
   * Moving BACK never validates, otherwise an invalid Step would be a trap; it still
   * commits, so edits are not lost.
   *
   * Deliberately NOT using `isValid`: on a pristine form Formik reports it as `true`
   * because `errors` is still empty, and with `validateOnMount` it would report
   * `false` while showing no error at all. We validate on demand and read the result.
   */
  const attempt = async (target: StepId | 'publish') => {
    if (target === step.id) return;
    const targetIndex = target === 'publish' ? steps.length : steps.findIndex((s) => s.id === target);

    if (targetIndex <= step.index) {
      onGo(formik.values, target as StepId);
      return;
    }

    const errors = await formik.validateForm();
    formik.setTouched(touchedForStep(step.sections, formik.values), false);
    const entries = collectErrors(step.sections, formik.values, errors as Record<string, unknown>);
    setSummary(entries);
    if (entries.length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (target === 'publish') onPublish(formik.values);
    else onGo(formik.values, target);
  };

  return (
    <>
      <nav className="steps">
        {steps.map((s, i) => {
          const reachable = i === 0 || Boolean(draft[steps[i - 1].id]);
          return (
            <button
              key={s.id}
              type="button"
              disabled={!reachable}
              aria-current={s.id === step.id ? 'step' : undefined}
              onClick={() => attempt(s.id)}
            >
              {i + 1}. {s.title}
            </button>
          );
        })}
      </nav>

      <Form noValidate>
        <ErrorSummary ref={summaryRef} entries={summary} />
        {step.sections.map((section) => (
          <SectionView key={section.id} section={section} />
        ))}
        <div className="actions">
          {previous && (
            <button type="button" onClick={() => attempt(previous.id)}>
              Indietro
            </button>
          )}
          <button type="button" onClick={() => attempt(isLast ? 'publish' : next.id)}>
            {isLast ? 'Pubblica' : 'Avanti'}
          </button>
        </div>
      </Form>
    </>
  );
}
