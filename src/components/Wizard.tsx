import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { Draft, StepId, StepValues, Tenant } from '../domain/types';
import { isStepId, pathForStep, wizardFor } from '../wizard/config';
import { buildPayload, serialize } from '../wizard/payload';
import { StepForm } from './StepForm';
import { TenantSelect } from './TenantSelect';

export function Wizard() {
  const [tenant, setTenant] = useState<Tenant>('IT');
  const [draft, setDraft] = useState<Draft>({});
  const [published, setPublished] = useState<string | null>(null);
  const navigate = useNavigate();
  const steps = wizardFor(tenant);

  const changeTenant = (next: Tenant) => {
    setTenant(next);
    setDraft({});
    setPublished(null);
    navigate(pathForStep(steps[0].id), { replace: true });
  };

  return (
    <main>
      <h1>Inserimento annuncio</h1>
      <TenantSelect tenant={tenant} onChange={changeTenant} />
      <Routes>
        <Route path="/" element={<Navigate to={pathForStep(steps[0].id)} replace />} />
        <Route
          path="/listing/:stepId"
          element={
            <StepRoute
              tenant={tenant}
              draft={draft}
              setDraft={setDraft}
              published={published}
              setPublished={setPublished}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

interface StepRouteProps {
  tenant: Tenant;
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  published: string | null;
  setPublished: (v: string | null) => void;
}

function StepRoute({ tenant, draft, setDraft, published, setPublished }: StepRouteProps) {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const steps = wizardFor(tenant);

  if (!isStepId(stepId)) return <Navigate to="/" replace />;
  const step = steps.find((s) => s.id === stepId)!;

  /**
   * With no persistence (this PoC saves no draft), a refresh on a later Step would
   * land on an empty form disconnected from the preceding ones. Go back to the first Step.
   */
  const previous = steps[step.index - 1];
  if (previous && !draft[previous.id]) return <Navigate to={pathForStep(steps[0].id)} replace />;

  /**
   * Committing on the way out — forwards or backwards — is what makes the Draft hold
   * what the user last typed. It therefore records what has been VISITED, not what is
   * valid: validity is re-established on every forward move. See ADR 0006.
   */
  const onGo = (values: StepValues, target: StepId) => {
    setDraft({ ...draft, [step.id]: values });
    navigate(pathForStep(target));
  };

  const onPublish = (values: StepValues) => {
    const updated: Draft = { ...draft, [step.id]: values };
    setDraft(updated);
    setPublished(serialize(buildPayload(tenant, updated)));
  };

  if (published) {
    return (
      <section>
        <h2>Annuncio inviato</h2>
        <p>Payload che sarebbe stato spedito al backend:</p>
        <pre>{published}</pre>
      </section>
    );
  }

  return (
    <StepForm
      tenant={tenant}
      step={step}
      steps={steps}
      draft={draft}
      saved={draft[step.id]}
      onGo={onGo}
      onPublish={onPublish}
    />
  );
}
