import { useProductosViewModel } from '../../../../../../ViewModels/useProductosViewModel';
import ListaProductosView from './ListaProductosView';

const ListaProductosContainer = () => {
  const viewModel = useProductosViewModel();
  return <ListaProductosView {...viewModel} />;
};

export default ListaProductosContainer;
