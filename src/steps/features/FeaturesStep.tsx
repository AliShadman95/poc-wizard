import { useFormikContext } from 'formik';
import type { Draft, StepId, StepValues, Tenant } from '../../domain';
import { StepShell } from '../../components/StepShell';
import { AddressES } from './sections/AddressES';
import { AddressIT } from './sections/AddressIT';
import { Contract } from './sections/Contract';
import { LandRegistry } from './sections/LandRegistry';
import { MainDetails } from './sections/MainDetails';
import { RentTerms } from './sections/RentTerms';
import { SalePrice } from './sections/SalePrice';
import { getFeaturesInitialValues, getFeaturesSchema } from './schema';

interface Props {
  tenant: Tenant;
  draft: Draft;
  onGo: (values: StepValues, target: StepId) => void;
  onPublish: (values: StepValues) => void;
}

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
      <Sections tenant={tenant} />
    </StepShell>
  );
}

/**
 * Everything that can appear in this Step, at a glance. The order here is also the order
 * in which both schemas declare their sections, and therefore the order of the entries in
 * the error summary.
 */
function Sections({ tenant }: { tenant: Tenant }) {
  const { values } = useFormikContext<StepValues>();
  const contractType = values.contract?.contractType;

  return (
    <>
      <MainDetails />

      {tenant === 'IT' ? <AddressIT /> : <AddressES />}

      <Contract tenant={tenant} />
      {contractType === 'sale' && <SalePrice />}
      {contractType === 'rent' && <RentTerms />}

      {tenant === 'IT' && <LandRegistry />}
    </>
  );
}
