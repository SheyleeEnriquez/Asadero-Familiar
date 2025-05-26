import React from 'react';
import '../Styles/Employee.css';
import logo from '../Assets/logo.png';
import stock from '../Assets/stock.png';
import ventas from '../Assets/ventas.png';
import { useNavigate } from 'react-router-dom';
 

const employeeOptions = [
  { title: 'Registrar Venta', img: stock, imgAlt: 'ventas',  path: '/Sales'},
  { title: 'Registrar Stock', img: ventas, imgAlt: 'stock' },
];
const EmployeePage = () => {
  const navigate = useNavigate(); // <-- Hook para navegar

  return (
    <div className="employee-page">
      {/* Header */}
      <header className="employee-header">
        <img src={logo} alt="Asadero Familiar Logo" className="logo" />
        <h1 className="employee-title">Panel del Empleado</h1>
      </header>

      {/* Contenedor principal */}
      <main className="employee-container">
        <div className="employee-grid">
          {employeeOptions.map((option, index) => (
            <div key={index} className="employee-card">
              <div className="employee-img-placeholder">
                <img src={option.img} alt={option.imgAlt} className="employee-img" />
              </div>
              <button
                className="employee-btn"
                onClick={() => {
                  if (option.path) {
                    navigate(option.path); // 🔁 Redirección
                  } else {
                    alert(`${option.title} aún no está disponible`);
                  }
                }}
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
export default EmployeePage;