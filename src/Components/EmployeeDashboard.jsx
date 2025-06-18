import React, { useState } from 'react';
import Sidebar from '../Components/SidebarEmployee';
import RegisterSale from '../Pages/Sales';
import RegisterStock from '../Pages/Stock';
import '../Styles/EmployeesDashboard.css';

const EmployeeDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('venta'); // Página inicial: Registrar Venta

  return (
    <div className="employee-dashboard">
      <Sidebar 
        onSelect={setActiveComponent} 
        activeItem={activeComponent} 
        menuItems={[
          { id: 'venta', label: 'Registrar Venta' },
          { id: 'stock', label: 'Registrar Stock' }
        ]}
      />
      <div className="dashboard-content">
        {activeComponent === 'venta' && <RegisterSale />}
        {activeComponent === 'stock' && <RegisterStock />}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
