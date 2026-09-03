import { useFormikContext } from 'formik';
import type { StepValues } from '../../../domain';
import { MainDetails } from '../shared/MainDetails';
import { RentTerms } from '../shared/RentTerms';
import { SalePrice } from '../shared/SalePrice';
import { Address } from './Address';
import { Contract } from './Contract';

/**
 * Every section of the Features step for SPAIN. A deliberate duplicate of it/Sections.tsx:
 * a diff between the two folders is the specification of how the markets differ. Today
 * that is the address, the tax identifier, and the absence of Dati catastali.
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
    </>
  );
}
