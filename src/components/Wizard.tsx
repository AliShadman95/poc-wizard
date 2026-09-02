import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { STEPS, isStepId, pathForStep, stepIndex, type Draft, type StepId, type StepValues, type Tenant } from '../domain';
import { buildPayload, serialize } from '../payload';
import { FeaturesStep } from '../steps/features/FeaturesStep';
import { MultimediaStep } from '../steps/multimedia/MultimediaStep';
import { PublicationStep } from '../steps/publication/PublicationStep';
import { TenantSelect } from './TenantSelect';

export function Wizard() {
  const [tenant, setTenant] = useState<Tenant>('IT');
  const [draft, setDraft] = useState<Draft>({});
  const [published, setPublished] = useState<string | null>(null);
  const navigate = useNavigate();

  const changeTenant = (next: Tenant) => {
    setTenant(next);
    setDraft({});
    setPublished(null);
    navigate(pathForStep(STEPS[0].id), { replace: true });
  };

  return (
    <main>
      <h1>Inserimento annuncio</h1>
      <TenantSelect tenant={tenant} onChange={changeTenant} />
      <Routes>
        <Route path="/" element={<Navigate to={pathForStep(STEPS[0].id)} replace />} />
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
  setDraft: (d: Draft) => void;
  published: string | null;
  setPublished: (v: string | null) => void;
}

function StepRoute({ tenant, draft, setDraft, published, setPublished }: StepRouteProps) {
  const { stepId } = useParams();
  const navigate = useNavigate();

  if (!isStepId(stepId)) return <Navigate to="/" replace />;

  /**
   * Senza persistenza, un refresh su uno Step successivo atterrerebbe su un form vuoto
   * scollegato dai precedenti. Si torna al primo Step.
   */
  const index = stepIndex(stepId);
  const previous = STEPS[index - 1];
  if (previous && !draft[previous.id]) return <Navigate to={pathForStep(STEPS[0].id)} replace />;

  /** Si committa uscendo, avanti o indietro, così le modifiche non si perdono. */
  const onGo = (values: StepValues, target: StepId) => {
    setDraft({ ...draft, [stepId]: values });
    navigate(pathForStep(target));
  };

  const onPublish = (values: StepValues) => {
    const updated: Draft = { ...draft, [stepId]: values };
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

  const props = { tenant, draft, onGo, onPublish };
  if (stepId === 'multimedia') return <MultimediaStep {...props} />;
  if (stepId === 'features') return <FeaturesStep {...props} />;
  return <PublicationStep {...props} />;
}
