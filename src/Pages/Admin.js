import React from 'react';
import '../Styles/Admin.css';
import logo from '../Assets/logo.png';
import cliente from '../Assets/cliente.png';
import empleado from '../Assets/empleado.png';
import stock from '../Assets/stock.png';


const adminOptions = [
  { title: 'Gestionar Clientes', img: cliente, imgAlt: 'cliente' },
  { title: 'Panel Administrativo', img: empleado, imgAlt: 'Panel' },
  { title: 'Generar Reportes', img: stock, imgAlt: 'Reportes' },
  { title: 'Gestionar Cuenta de Empleados', img: empleado, imgAlt: 'Empleados' },
  { title: 'Gestionar Inventario', img: stock, imgAlt: 'Inventario' },
];


const AdminPage = () => {
  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <img src={logo} alt="Asadero Familiar Logo" className="logo" />
        <h1 className="admin-title">Panel de Administración</h1>
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
                onClick={() => alert(`Ir a ${option.title.toLowerCase()}`)}
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
