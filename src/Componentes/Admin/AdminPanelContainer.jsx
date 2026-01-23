import React from 'react';
import { useAdminViewModel } from '../../ViewModels/useAdminViewModel';
import { AdminPanelView } from './AdminPanelView';


const AdminPanelContainer = () => {
  const viewModel = useAdminViewModel();
  return <AdminPanelView {...viewModel} />;
};

export default AdminPanelContainer;
