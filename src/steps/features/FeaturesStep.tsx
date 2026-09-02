import { useFormikContext } from 'formik';
import type { Draft, StepId, StepValues, Tenant } from '../../domain';
import { StepShell } from '../../components/StepShell';
import { AddressES } from './sections/AddressES';
import { AddressIT } from './sections/AddressIT';
import { ContractAndPriceApartment } from './sections/ContractAndPriceApartment';
import { ContractAndPriceOffice } from './sections/ContractAndPriceOffice';
import { ContractAndPriceVilla } from './sections/ContractAndPriceVilla';
import { LandRegistry } from './sections/LandRegistry';
import { MainDetails } from './sections/MainDetails';
import { featuresInitialValuesES, featuresSchemaES } from './schema.es';
import { featuresInitialValuesIT, featuresSchemaIT } from './schema.it';

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
      initialValues={tenant === 'IT' ? featuresInitialValuesIT : featuresInitialValuesES}
      buildSchema={tenant === 'IT' ? featuresSchemaIT : featuresSchemaES}
      onGo={onGo}
      onPublish={onPublish}
    >
      <Sections tenant={tenant} />
    </StepShell>
  );
}

/**
 * Tutto quello che compare in questo Step, in un colpo d'occhio. L'ordine qui è anche
 * l'ordine in cui i due schema dichiarano le sezioni, ed è quindi l'ordine delle voci
 * nel riepilogo errori.
 */
function Sections({ tenant }: { tenant: Tenant }) {
  const { values } = useFormikContext<StepValues>();
  const propertyType = values.mainDetails?.propertyType;

  return (
    <>
      <MainDetails />

      {tenant === 'IT' ? <AddressIT /> : <AddressES />}

      {propertyType === 'apartment' && <ContractAndPriceApartment tenant={tenant} />}
      {propertyType === 'villa' && <ContractAndPriceVilla tenant={tenant} />}
      {propertyType === 'office' && <ContractAndPriceOffice tenant={tenant} />}

      {tenant === 'IT' && <LandRegistry />}
    </>
  );
}
