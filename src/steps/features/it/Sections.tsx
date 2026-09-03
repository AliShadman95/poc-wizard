import { useFormikContext } from 'formik';
import type { StepValues } from '../../../domain';
import { MainDetails } from '../shared/MainDetails';
import { RentTerms } from '../shared/RentTerms';
import { SalePrice } from '../shared/SalePrice';
import { Address } from './Address';
import { Contract } from './Contract';
import { LandRegistry } from './LandRegistry';

/**
 * Every section of the Features step for ITALY, in the order they appear on screen —
 * which must stay the same as the order ./schema.ts declares them in, because the error
 * summary follows the schema.
 *
 * There is no `tenant` anywhere below this point: the market was chosen once, in
 * byTenant.tsx, and from here down nothing needs to know which one it is. That is also
 * why nothing in this folder carries a suffix — the path already says which market it is.
 */
export function Sections() {
  const { values } = useFormikContext<StepValues>();
  const contractType = values.contract?.contractType;

  return (
    <>
      <MainDetails />
      <Address />
      <Contract />
      {contractType === 'sale' && <SalePrice />}
      {contractType === 'rent' && <RentTerms />}
      <LandRegistry />
    </>
  );
}
