import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Admin.css';
import logo from '../Assets/logo.png';
import cliente from '../Assets/cliente.png';
import empleado from '../Assets/empleado.png';
import stock from '../Assets/stock.png';

const adminOptions = [
  { title: 'Gestionar Clientes', img: cliente, imgAlt: 'cliente', path: '/modCustomer' },
  { title: 'Panel Administrativo', img: empleado, imgAlt: 'Panel' },
  { title: 'Generar Reportes', img: stock, imgAlt: 'Reportes' },
  { title: 'Gestionar Cuenta de Empleados', img: empleado, imgAlt: 'Empleados', path: '/modEmployee' },
  { title: 'Gestionar Inventario', img: stock, imgAlt: 'Inventario' },
];

const AdminPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (title, path) => {
    if (path) {
      navigate(path);
    } else {
      alert(`Ir a ${title.toLowerCase()}`);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <img src={logo} alt="Asadero Familiar Logo" className="logo" />
        <h1 className="admin-title">Bienvenido Administrador
        </h1>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      {/* Contenedor de opciones */}
      <main className="admin-container">
        <div className="admin-grid">
          {adminOptions.map((option, index) => (
            <div key={index} className="admin-card">
              <div className="admin-img-placeholder">
                <img src={option.img} alt={option.imgAlt} className="admin-img" />
              </div>
              <button
                className="admin-btn"
                onClick={() => handleNavigation(option.title, option.path)}
              >
                {option.title}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
