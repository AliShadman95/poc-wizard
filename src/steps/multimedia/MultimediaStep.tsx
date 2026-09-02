import type { Draft, StepId, StepValues, Tenant } from '../../domain';
import { StepShell } from '../../components/StepShell';
import { FileInput, Section, TextareaInput } from '../../ui/inputs';
import { multimediaInitialValues, multimediaSchema } from './schema';

interface Props {
  tenant: Tenant;
  draft: Draft;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
}

export function MultimediaStep({ tenant, draft, onGo, onPublish }: Props) {
  return (
    <StepShell
      stepId="multimedia"
      tenant={tenant}
      draft={draft}
      initialValues={multimediaInitialValues}
      buildSchema={multimediaSchema}
      onGo={onGo}
      onPublish={onPublish}
    >
      <Section title="Foto">
        <FileInput section="photos" name="images" label="Foto dell’immobile" />
      </Section>

      <Section title="Planimetrie e documenti">
        <FileInput section="floorPlans" name="floorPlan" label="Planimetria" help="Facoltativa." />
        <TextareaInput section="floorPlans" name="notes" label="Note per la redazione" />
      </Section>
    </StepShell>
  );
}
