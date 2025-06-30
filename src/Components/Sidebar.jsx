import React from 'react';
import '../Styles/Sidebar.css';
import logo from '../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';

const Sidebar = ({ onSelect, activeItem = 'panel' }) => {
  const menuItems = [
    { id: 'panel', label: 'Panel Administrativo' },
    { id: 'empleados', label: 'Gestionar Empleados' },
    { id: 'clientes', label: 'Gestionar Clientes' },
    { id: 'inventario', label: 'Inventario' },
    { id: 'reportes', label: 'Reportes' }
  ];
    
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('userToken')
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="sidebar">
        <div className="logo-wrapper">
            <img src={logo} alt="Logo" />
        </div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={activeItem === item.id ? 'active' : ''}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;