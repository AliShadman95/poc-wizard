import { useFormikContext } from 'formik';
import type { StepValues } from '../../domain';
import { AddressIT } from './sections/AddressIT';
import { ContractIT } from './sections/ContractIT';
import { LandRegistry } from './sections/LandRegistry';
import { MainDetails } from './sections/MainDetails';
import { RentTerms } from './sections/RentTerms';
import { SalePrice } from './sections/SalePrice';

/**
 * Every section of the Features step for ITALY, in the order they appear on screen —
 * which must stay the same as the order schema.it.ts declares them in, because the error
 * summary follows the schema.
 *
 * There is no `tenant` anywhere below this point: the market was chosen once, in
 * byTenant.tsx, and from here down nothing needs to know which one it is.
 */
export function SectionsIT() {
  const { values } = useFormikContext<StepValues>();
  const contractType = values.contract?.contractType;

  return (
    <>
      <MainDetails />
      <AddressIT />
      <ContractIT />
      {contractType === 'sale' && <SalePrice />}
      {contractType === 'rent' && <RentTerms />}
      <LandRegistry />
    </>
  );
}
