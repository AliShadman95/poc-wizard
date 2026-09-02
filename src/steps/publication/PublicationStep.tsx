import type { Draft, StepId, StepValues, Tenant } from '../../domain';
import { StepShell } from '../../components/StepShell';
import { RadioInput, Section } from '../../ui/inputs';
import { publicationInitialValues, publicationSchema } from './schema';

interface Props {
  tenant: Tenant;
  draft: Draft;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
}

export function PublicationStep({ tenant, draft, onGo, onPublish }: Props) {
  return (
    <StepShell
      stepId="publication"
      tenant={tenant}
      draft={draft}
      initialValues={publicationInitialValues}
      buildSchema={publicationSchema}
      onGo={onGo}
      onPublish={onPublish}
    >
      <Section title="Visibilità">
        <RadioInput
          section="visibility"
          name="visibility"
          label="Chi può vedere questo annuncio"
          options={[
            { value: 'public', label: 'Pubblico — visibile a tutti sul portale' },
            { value: 'agenciesOnly', label: 'Riservato — visibile solo alle agenzie partner' },
          ]}
        />
      </Section>
    </StepShell>
  );
}
