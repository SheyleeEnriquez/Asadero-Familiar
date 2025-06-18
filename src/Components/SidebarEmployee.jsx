import React from 'react';
import '../Styles/SidebarEmployee.css';
import logo from '../Assets/logo.png';  // Importa el logo

const SidebarEmployee = ({ onSelect, activeItem, menuItems, className }) => {
  // Iconos para cada tipo de menú
  const getIcon = (id) => {
    switch (id) {
      case 'venta':
        return '🛒';
      case 'stock':
        return '📦';
      default:
        return '📋';
    }
  };

  return (
    <div className={`sidebar-employee ${className || ''}`}>
      <div className="sidebar-header-emp">
        {/* Logo */}
        <div className="logo-wrapper-emp">
          <img src={logo} alt="Logo" />
        </div>
        <h3>Panel Empleado</h3>
      </div>
      <nav className="sidebar-nav-emp">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-item-emp ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <span className="sidebar-icon-emp">{getIcon(item.id)}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarEmployee;
