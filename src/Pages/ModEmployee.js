import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ModEmployee.css';
import successGif from '../Assets/success.gif';

const initialForm = {
  names: '',
  lastnames: '',
  documentNumber: '',
  address: '',
  phoneNumber: '',
  email: '',
  role: '',
  charge: '',
  firebaseUid: '',
  branchId: ''
};

const initialErrors = {
  names: '',
  lastnames: '',
  documentNumber: '',
  address: '',
  phoneNumber: '',
  email: '',
  firebaseUid: '',
  branchId: ''
};

const validateEcuadorianID = (id) => {
  if (id.length !== 10) return false;
  const digits = id.split('').map(Number);
  const provinceCode = parseInt(id.substring(0, 2));
  if (provinceCode < 1 || provinceCode > 24) return false;
  if (digits[2] >= 6) return false;
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let result = digits[i] * coefficients[i];
    if (result >= 10) result -= 9;
    sum += result;
  }
  const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return checkDigit === digits[9];
};

const validateField = (name, value) => {
  let error = '';
  switch (name) {
    case 'names':
    case 'lastnames':
      if (!value.trim()) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} es requerido`;
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} solo debe contener letras`;
      }
      break;
    case 'documentNumber':
      if (!/^\d{10}$/.test(value)) {
        error = 'Cédula debe tener exactamente 10 dígitos';
      } else if (!validateEcuadorianID(value)) {
        error = 'Cédula ecuatoriana no válida';
      }
      break;
    case 'address':
      if (!value.trim()) {
        error = 'Dirección es requerida';
      }
      break;
    case 'phoneNumber':
      if (!/^\d{10}$/.test(value)) {
        error = 'Teléfono debe tener exactamente 10 dígitos';
      }
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Formato de correo electrónico no válido';
      }
      break;
    case 'firebaseUid':
      if (!value.trim()) {
        error = 'Firebase UID es requerido';
      }
      break;
    case 'branchId':
      if (!value.trim()) {
        error = 'ID de sucursal es requerido';
      }
      break;
    default:
      break;
  }
  return error;
};

const fieldLabels = {
  names: 'Nombres',
  lastnames: 'Apellidos',
  documentNumber: 'Cédula',
  address: 'Dirección',
  phoneNumber: 'Teléfono',
  email: 'Correo',
  firebaseUid: 'Firebase UID',
  branchId: 'Sucursal'
};

const placeholders = {
  names: 'Juan',
  lastnames: 'Pérez',
  documentNumber: '1723456789',
  address: 'Av. Siempre Viva 123',
  phoneNumber: '0998765432',
  email: 'correo@ejemplo.com',
  firebaseUid: 'abc123xyz',
  branchId: '001'
};

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = 'http://localhost:3000/api/employees';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;
    Object.entries(form).forEach(([key, value]) => {
      const error = validateField(key, value);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    if (!isValid) return;

    try {
      if (editingId !== null) {
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
      fetchEmployees();
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

      <div className="top-buttons2">
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
            {Object.entries(form).map(([key, value]) => (
              (key !== 'charge' || form.role === 'empleado') &&
              key !== 'role' && key !== 'charge' ? (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{fieldLabels[key]}</label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    placeholder={`Ej. ${placeholders[key]}`}
                    value={value}
                    onChange={handleChange}
                    required
                  />
                  {errors[key] && <div className="input-error">{errors[key]}</div>}
                </div>
              ) : null
            ))}

            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select id="role" name="role" value={form.role} onChange={handleChange} required>
                <option value="" disabled>Rol en el Sistema</option>
                <option value="administrador">Administrador</option>
                <option value="supervisor">Supervisor</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>

            {form.role === "empleado" && (
              <div className="form-group">
                <label htmlFor="charge">Cargo</label>
                <select id="charge" name="charge" value={form.charge} onChange={handleChange} required>
                  <option value="" disabled>Cargo</option>
                  <option value="cocinero">Cocinero</option>
                  <option value="ayudante de cocina">Ayudante de cocina</option>
                  <option value="mesero">Mesero</option>
                  <option value="parrillero">Parrillero</option>
                </select>
              </div>
            )}
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