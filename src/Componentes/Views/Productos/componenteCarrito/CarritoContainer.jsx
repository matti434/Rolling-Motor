import { useCarritoViewModel } from '../../../../ViewModels/useCarritoViewModel';
import CarritoView from './CarritoView';

const CarritoContainer = () => {
  const viewModel = useCarritoViewModel();
  return <CarritoView {...viewModel} />;
};

export default CarritoContainer;
