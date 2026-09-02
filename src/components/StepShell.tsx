import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as Yup from 'yup';
import type { AnyObjectSchema } from 'yup';
import { STEPS, stepIndex, type Draft, type StepId, type StepValues } from '../domain';
import { allTouched, summarise, type ErrorEntry } from '../errorSummary';
import { ErrorSummary } from './ErrorSummary';

interface Props {
  stepId: StepId;
  tenant: string;
  draft: Draft;
  initialValues: StepValues;
  /** Built from the current values, because some fields only exist for some choices. */
  buildSchema: (values: StepValues) => AnyObjectSchema;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
  children: ReactNode;
}

/**
 * The chrome every Step shares: the form itself, the stepper, the error summary and the
 * buttons. It holds no domain knowledge — each Step passes its own schema and renders
 * its own sections as children.
 */
export function StepShell({ stepId, tenant, draft, initialValues, buildSchema, onGo, onPublish, children }: Props) {
  const saved = draft[stepId] ?? {};
  const seeded = Object.fromEntries(
    Object.entries(initialValues).map(([section, fields]) => [section, { ...fields, ...(saved[section] ?? {}) }]),
  );

  return (
    <Formik
      key={`${tenant}-${stepId}`}
      initialValues={seeded}
      validationSchema={Yup.lazy((values) => buildSchema(values as StepValues))}
      onSubmit={onPublish}
    >
      <Body stepId={stepId} draft={draft} buildSchema={buildSchema} onGo={onGo} onPublish={onPublish}>
        {children}
      </Body>
    </Formik>
  );
}

function Body({
  stepId,
  draft,
  buildSchema,
  onGo,
  onPublish,
  children,
}: Pick<Props, 'stepId' | 'draft' | 'buildSchema' | 'onGo' | 'onPublish' | 'children'>) {
  const formik = useFormikContext<StepValues>();
  const [summary, setSummary] = useState<ErrorEntry[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSummary([]), [formik.values]);

  const index = stepIndex(stepId);
  const isLast = index === STEPS.length - 1;
  const previous = STEPS[index - 1];
  const next = STEPS[index + 1];

  /**
   * Every way out of a Step goes through here. Moving FORWARD validates first and blocks
   * on failure, so going back, emptying a field and skipping ahead is caught. Moving BACK
   * never validates — an invalid Step would be a trap — but still commits, so edits survive.
   *
   * Deliberately not `isValid`: on a pristine form Formik reports it as `true` because
   * `errors` is still empty. We validate on demand and read the result.
   */
  const attempt = async (target: StepId | 'publish') => {
    if (target === stepId) return;
    const targetIndex = target === 'publish' ? STEPS.length : stepIndex(target);
    if (targetIndex <= index) {
      onGo(formik.values, target as StepId);
      return;
    }

    const errors = await formik.validateForm();
    const schema = buildSchema(formik.values);
    formik.setTouched(allTouched(schema), false);
    const entries = summarise(schema, errors);
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
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            disabled={i > 0 && !draft[STEPS[i - 1].id]}
            aria-current={s.id === stepId ? 'step' : undefined}
            onClick={() => attempt(s.id)}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </nav>

      <Form noValidate>
        <ErrorSummary ref={summaryRef} entries={summary} />
        {children}
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
