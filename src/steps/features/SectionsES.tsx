import { useFormikContext } from 'formik';
import type { StepValues } from '../../domain';
import { AddressES } from './sections/AddressES';
import { ContractES } from './sections/ContractES';
import { MainDetails } from './sections/MainDetails';
import { RentTerms } from './sections/RentTerms';
import { SalePrice } from './sections/SalePrice';

/**
 * Every section of the Features step for SPAIN. A deliberate duplicate of SectionsIT:
 * a diff between the two is the specification of how the markets' layouts differ.
 * Today that is the address, the tax identifier, and the absence of Dati catastali.
 */
export function SectionsES() {
  const { values } = useFormikContext<StepValues>();
  const contractType = values.contract?.contractType;

  return (
    <>
      <MainDetails />
      <AddressES />
      <ContractES />
      {contractType === 'sale' && <SalePrice />}
      {contractType === 'rent' && <RentTerms />}
    </>
  );
}
