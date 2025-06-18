import React, { useState } from 'react'; // Asegúrate de importar useState
import Sidebar from '../Components/SidebarEmployee'; // Importa tu componente Sidebar
import RegisterSale from '../Pages/Sales'; // Importa el componente RegisterSale
import RegisterStock from '../Pages/Stock'; // Importa el componente RegisterStock
import '../Styles/SidebarEmployee.css'; // Estilos CSS

const EmployeeDashboardCustom = () => {
  const [activeComponent, setActiveComponent] = useState('venta');

  return (
    <div className="employee-dashboard">
      <Sidebar
        className="sidebar-custom" // Nueva clase
        onSelect={setActiveComponent}
        activeItem={activeComponent}
        menuItems={[
          { id: 'venta', label: 'Registrar Venta' },
          { id: 'stock', label: 'Registrar Stock' },
        ]}
      />
      <div className="dashboard-content">
        {activeComponent === 'venta' && <RegisterSale />}
        {activeComponent === 'stock' && <RegisterStock />}
      </div>
    </div>
  );
};

export default EmployeeDashboardCustom;
