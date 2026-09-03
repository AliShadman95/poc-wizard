import type { Draft, StepId, StepValues, Tenant } from '../../domain';
import { StepShell } from '../../components/StepShell';
import { getFeaturesInitialValues, getFeaturesSchema, getFeaturesSections } from './byTenant';

interface Props {
  tenant: Tenant;
  draft: Draft;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
}

/**
 * The market is resolved once, here. Which sections appear for it is in it/Sections.tsx or
 * es/Sections.tsx; nothing further down takes a `tenant`.
 */
export function FeaturesStep({ tenant, draft, onGo, onPublish }: Props) {
  return (
    <StepShell
      stepId="features"
      tenant={tenant}
      draft={draft}
      initialValues={getFeaturesInitialValues(tenant)}
      buildSchema={getFeaturesSchema(tenant)}
      onGo={onGo}
      onPublish={onPublish}
    >
      {getFeaturesSections(tenant)}
    </StepShell>
  );
}
