import React, { useState, useEffect } from 'react';
import SidebarEmployee from './SidebarEmployee';
import RegisterSale from '../Pages/Sales';
import RegisterStock from '../Pages/Stock';
import '../Styles/SidebarEmployee.css';
import '../Styles/AdminDashboard.css';

const EmployeeDashboardCustom = () => {
  const [activeComponent, setActiveComponent] = useState('venta');

  useEffect(() => {
    console.log('Componente activo:', activeComponent);
  }, [activeComponent]);

  const renderContent = () => {
    switch(activeComponent) {
      case 'venta':
        return <RegisterSale />;
      case 'stock':
        return <RegisterStock />;
      default:
        return null;
    }
  };

  return (
    <div className="employee-dashboard">
      <SidebarEmployee
        className="sidebar-custom"
        onSelect={setActiveComponent}
        activeItem={activeComponent}
        menuItems={[
          { id: 'venta', label: 'Registrar Venta' },
          { id: 'stock', label: 'Registrar Stock' },
        ]}
      />
      <div className="dashboard-content-emp">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboardCustom;
