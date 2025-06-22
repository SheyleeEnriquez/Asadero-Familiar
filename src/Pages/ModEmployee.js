import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ModEmployee.css';
import successGif from '../Assets/success.gif';

const initialForm = {
  documentNumber: '',
  names: '',
  lastnames: '',
  address: '',
  phoneNumber: '',
  email: '',
  role: '',
  charge: '',
  firebaseUid: '',
  branchId: ''
};

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = 'http://localhost:3010/api/employees';

  // ✅ Obtener todos los empleados al cargar
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data.employees);
      console.log('Empleados obtenidos:', response.data.employees);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Crear o actualizar empleado
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        // 🔄 Aquí puedes agregar lógica PUT cuando la API lo permita
        console.warn('Edición aún no implementada en backend');
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setView('form');
        }, 3000);
      }

      setForm(initialForm);
      fetchEmployees(); // 🔄 Actualiza la lista
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setEditingId(employee.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  return (
    <div className="employee-crud">
      <h2>Gestión de Empleados</h2>

      <div className="top-buttons">
        <button onClick={() => setView('form')}>Agregar Empleado</button>
        <button onClick={() => setView('list')}>Ver Lista de Empleados</button>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <img src={successGif} alt="Empleado registrado" className="success-gif" />
          <p>Empleado registrado con éxito</p>
        </div>
      )}

      {!showSuccess && view === 'form' && (
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-grid">
            <input type="text" name="names" placeholder="Nombres" value={form.names} onChange={handleChange} required />
            <input type="text" name="lastnames" placeholder="Apellidos" value={form.lastnames} onChange={handleChange} required />
            <input type="text" name="documentNumber" placeholder="Cédula" value={form.documentNumber} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} required />
            <input type="tel" name="phoneNumber" placeholder="Teléfono" value={form.phoneNumber} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} required />
            <input type="text" name="firebaseUid" placeholder="Firebase UID" value={form.firebaseUid} onChange={handleChange} required />

            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="" disabled>Rol en el Sistema</option>
              <option value="administrador">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="empleado">Empleado</option>
            </select>

            {form.role === "empleado" && (
              <select name="charge" value={form.charge} onChange={handleChange} required>
                <option value="" disabled>Cargo</option>
                <option value="cocinero">Cocinero</option>
                <option value="ayudante de cocina">Ayudante de cocina</option>
                <option value="mesero">Mesero</option>
                <option value="parrillero">Parrillero</option>
              </select>
            )}

            <input type="text" name="branchId" placeholder="ID de la Sucursal" value={form.branchId} onChange={handleChange} required />
          </div>
          <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
        </form>
      )}

      {!showSuccess && view === 'list' && (
        <div className="table-wrapper">
          {employees.length > 0 ? (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Cédula</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Rol</th>
                  <th>Sucursal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.names}</td>
                    <td>{emp.lastnames}</td>
                    <td>{emp.documentNumber}</td>
                    <td>{emp.address}</td>
                    <td>{emp.phoneNumber}</td>
                    <td>{emp.email}</td>
                    <td>{emp.charge}</td>
                    <td>{emp.role}</td>
                    <td>{emp.branchId}</td>
                    <td>
                      <button onClick={() => handleEdit(emp)} className="btn-edit">Editar</button>
                      <button onClick={() => handleDelete(emp.id)} className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No hay empleados registrados</h3>
              <p>Agrega tu primer empleado usando el botón "Agregar Empleado"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeCRUD;