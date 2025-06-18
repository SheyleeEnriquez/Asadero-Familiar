import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import PanelAdmin from '../Pages/PanelAdmin';
import ModEmployee from '../Pages/ModEmployee';
import ModCustomer from '../Pages/ModCustomer';
import Inventory from '../Pages/Inventory';
import Reports from '../Pages/Reports';
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('panel');

  return (
    <div className="admin-dashboard">
      <Sidebar 
        onSelect={setActiveComponent} 
        activeItem={activeComponent}
      />
      <div className="dashboard-content">
        {activeComponent === 'panel' && <PanelAdmin />}
        {activeComponent === 'empleados' && <ModEmployee />}
        {activeComponent === 'clientes' && <ModCustomer />}
        {activeComponent === 'inventario' && <Inventory />}
        {activeComponent === 'reportes' && <Reports />}
      </div>
    </div>
  );
};

export default AdminDashboard;