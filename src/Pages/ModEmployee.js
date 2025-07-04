import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ModEmployee.css';
import successGif from '../Assets/success.gif';
import { auth } from '../config/firebase-config';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from 'firebase/auth';

const initialForm = {
  documentNumber: '',
  names: '',
  lastnames: '',
  address: '',
  phoneNumber: '',
  email: '',
  role: '',
  charge: '',
  branchId: ''
};

const initialErrors = {
  names: '',
  lastnames: '',
  documentNumber: '',
  address: '',
  phoneNumber: '',
  email: '',
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
    case 'branchId':
      if (!value.trim()) {
        error = 'Sucursal es requerida';
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
  branchId: 'Sucursal'
};

const placeholders = {
  names: 'Juan',
  lastnames: 'Pérez',
  documentNumber: '1723456789',
  address: 'Av. Siempre Viva 123',
  phoneNumber: '0998765432',
  email: 'correo@ejemplo.com'
};

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [showSuccess, setShowSuccess] = useState(false);

  const API_EMPLOYEES_URL = 'http://localhost:3010/api/employees';
  const API_BRANCHES_URL = 'http://localhost:3010/api/branches';
  const API_AUTH_URL = 'http://localhost:3050/api';

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchEmployees();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(API_BRANCHES_URL);
      setBranches(response.data.branches);
      console.log('Sucursales obtenidas:', response.data.branches);
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_EMPLOYEES_URL);
      setEmployees(response.data.employees);
      console.log('Empleados obtenidos:', response.data.employees);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Si cambia el rol a Administrador o Supervisor, también se asigna como cargo
    if (name === 'role') {
      if (value === 'Administrador' || value === 'Supervisor') {
        updatedForm.charge = value;
      } else if (value === 'Empleado') {
        updatedForm.charge = ''; // Vacía para que lo seleccione el usuario
      }
    }

    setForm(updatedForm);
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

    if (form.role === 'Administrador' || form.role === 'Supervisor') {
      form.charge = form.role;
    }

    try {
      if (editingId !== null) {
        // Si estás editando un empleado existente
        await axios.put(`${API_EMPLOYEES_URL}/${editingId}`, form);
        console.log('Empleado actualizado con éxito');
        setEditingId(null);
        setForm(initialForm);
        fetchEmployees();
      } else {
        // 1️⃣ Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.documentNumber
        );
        const firebaseUser = userCredential.user;

        // 2️⃣ Asignar displayName
        await updateProfile(firebaseUser, {
          displayName: `${form.names} ${form.lastnames}`
        });

        // 3️⃣ Obtener claims de rol → Backend
        const response = await axios.post(
          `${API_AUTH_URL}/register-role`,
          {
            firebaseUid: firebaseUser.uid,
            role: form.role
          },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`
            },
            validateStatus: () => true // 👈 Forzar que NUNCA lance excepción automática
          }
        );

        console.log('Código de respuesta:', response.status);

        if (response.status !== 201) {
          console.error('Falló asignación de rol, eliminando usuario en Firebase...');
          const seElimino = await axios.delete(
            `${API_AUTH_URL}/delete-account`,
            {
              data: { firebaseUid: firebaseUser.uid },
              headers: {
                Authorization: `Bearer ${adminToken}`
              }
            }
          );

          console.log('Usuario eliminado de Firebase:', seElimino.data);

          throw new Error('Error al asignar el rol. El usuario fue eliminado automáticamente.');
        }

        // 4️⃣ Enviar correo de verificación
        await sendEmailVerification(firebaseUser);

        // 5️⃣ Guardar empleado en BD
        const empleadoConUid = { ...form, firebaseUid: firebaseUser.uid };
        await axios.post(API_EMPLOYEES_URL, empleadoConUid);

        // 6️⃣ Mostrar éxito
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setView('form');
        }, 3000);
      }

      // Reset y refresh
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
        await axios.delete(`${API_EMPLOYEES_URL}/${id}`);
        let firebaseUidDeleted = employees.find(emp => emp.id === id).firebaseUid;
        await axios.delete(
            `${API_AUTH_URL}/delete-account`, 
            {
            data: { firebaseUid: firebaseUidDeleted },
            headers: {
              Authorization: `Bearer ${adminToken}`
            }
            }
          );
        fetchEmployees();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  // Función para obtener el nombre de la sucursal por ID
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : branchId;
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
              (key !== 'charge' || form.role === 'Empleado') &&
              key !== 'role' && key !== 'charge' && key !== 'branchId' ? (
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
                <option value="Administrador">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Empleado">Empleado</option>
              </select>
            </div>

            {form.role === "Empleado" && (
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

            <div className="form-group">
              <label htmlFor="branchId">Sucursal</label>
              <select id="branchId" name="branchId" value={form.branchId} onChange={handleChange} required>
                <option value="" disabled>Seleccione una sucursal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branchId && <div className="input-error">{errors.branchId}</div>}
            </div>
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
                    <td>{getBranchName(emp.branchId)}</td>
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