import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { StepValues, Tenant } from '../domain/types';
import type { ResolvedStep } from '../wizard/config';
import { collectErrors, type ErrorEntry } from '../wizard/errors';
import { stepSchema } from '../wizard/schema';
import { initialStepValues, touchedForStep } from '../wizard/values';
import { ErrorSummary } from './ErrorSummary';
import { SectionView } from './SectionView';

interface Props {
  tenant: Tenant;
  step: ResolvedStep;
  saved: StepValues | undefined;
  isLast: boolean;
  onConfirm: (values: StepValues) => void;
  onBack: (() => void) | null;
}

export function StepForm({ tenant, step, saved, isLast, onConfirm, onBack }: Props) {
  const initialValues = useMemo(() => initialStepValues(step.sections, saved), [step, saved]);
  const schema = useMemo(() => stepSchema(step.sections), [step]);

  return (
    <Formik
      key={`${tenant}-${step.id}`}
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onConfirm}
    >
      <StepBody step={step} isLast={isLast} onConfirm={onConfirm} onBack={onBack} />
    </Formik>
  );
}

function StepBody({
  step,
  isLast,
  onConfirm,
  onBack,
}: Pick<Props, 'step' | 'isLast' | 'onConfirm' | 'onBack'>) {
  const formik = useFormikContext<StepValues>();
  const [summary, setSummary] = useState<ErrorEntry[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  // The summary describes one specific attempt: as soon as the user edits anything
  // it stops being true, so it disappears rather than going stale.
  useEffect(() => {
    setSummary([]);
  }, [formik.values]);

  /**
   * Deliberately NOT using `isValid`: on a pristine form Formik reports it as `true`
   * because `errors` is still empty, and with `validateOnMount` it would report
   * `false` while showing no error at all. We validate on demand and read the result.
   */
  const handleNext = async () => {
    const errors = await formik.validateForm();
    formik.setTouched(touchedForStep(step.sections, formik.values), false);
    const entries = collectErrors(step.sections, formik.values, errors as Record<string, unknown>);
    setSummary(entries);
    if (entries.length === 0) {
      onConfirm(formik.values);
    } else {
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  return (
    <Form noValidate>
      <ErrorSummary ref={summaryRef} entries={summary} />
      {step.sections.map((section) => (
        <SectionView key={section.id} section={section} />
      ))}
      <div className="actions">
        {onBack && (
          <button type="button" onClick={onBack}>
            Indietro
          </button>
        )}
        <button type="button" onClick={handleNext}>
          {isLast ? 'Pubblica' : 'Avanti'}
        </button>
      </div>
    </Form>
  );
}
