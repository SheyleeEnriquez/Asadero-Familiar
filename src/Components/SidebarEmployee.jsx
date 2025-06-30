import React from 'react';
import '../Styles/SidebarEmployee.css';
import logo from '../Assets/logo.png';
import { auth } from '../config/firebase-config';

const SidebarEmployee = ({ onSelect, activeItem, menuItems, className }) => {
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

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('userToken')
    localStorage.removeItem('adminToken');
    window.location.href = '/'; // Redirige a la página principal
  };

  return (
    <div className={`sidebar-employee ${className || ''}`}>
      <div className="sidebar-header-emp">
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

      <div className="logout-container-emp">
        <button className="logout-button-emp" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default SidebarEmployee;
