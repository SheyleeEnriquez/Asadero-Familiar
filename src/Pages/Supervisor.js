import React from 'react';
import '../Styles/Supervisor.css';
import logo from '../Assets/logo.png';
import empleado from '../Assets/empleado.png';
import ventas from '../Assets/ventas.png';

const supervisorOptions = [
  { title: 'Gestionar Cuenta de Empleados', img: empleado, imgAlt: 'empleado' },
  { title: 'Registrar Stock', img: ventas, imgAlt: 'ventas' },
];

const SupervisorPage = () => {
  return (
    <div className="supervisor-page">
      {/* Header */}
      <header className="supervisor-header">
        <img src={logo} alt="Asadero Familiar Logo" className="logo" />
        <h1 className="supervisor-title">Panel del Supervisor</h1>
      </header>

      {/* Contenedor principal */}
      <main className="supervisor-container">
        <div className="supervisor-grid">
          {supervisorOptions.map((option, index) => (
            <div key={index} className="supervisor-card">
              <div className="supervisor-img-placeholder">
                <img src={option.img} alt={option.imgAlt} className="admin-img" />
              </div>
              <button
                className="supervisor-btn"
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

export default SupervisorPage;
