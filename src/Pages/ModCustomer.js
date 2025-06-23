import React, { useState, useEffect } from 'react';
import '../Styles/ModCustomer.css';
import user from '../Assets/user.gif';

const initialForm = {
  id: '',
  names: '',
  lastnames: '',
  idCard: '',
  address: '',
  phone: '',
  email: ''
};

const initialErrors = {
  names: '',
  lastnames: '',
  idCard: '',
  address: '',
  phone: '',
  email: ''
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

const validateField = (name, value, customers, editingId) => {
  let error = '';
  switch (name) {
    case 'names':
    case 'lastnames':
      if (!value.trim()) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} es requerido`;
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} solo debe contener letras`;
      } else if (value.length < 2) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} debe tener al menos 2 caracteres`;
      } else if (value.length > 50) {
        error = `${name === 'names' ? 'Nombres' : 'Apellidos'} no debe exceder 50 caracteres`;
      }
      break;
    case 'idCard':
      if (!value.trim()) {
        error = 'Cédula es requerida';
      } else if (!/^\d{10}$/.test(value)) {
        error = 'Cédula debe tener exactamente 10 dígitos';
      } else if (!validateEcuadorianID(value)) {
        error = 'Cédula ecuatoriana no válida';
      } else if (customers.find(c => c.idCard === value && c.id !== editingId)) {
        error = 'Ya existe un cliente con esta cédula';
      }
      break;
    case 'address':
      if (!value.trim()) {
        error = 'Dirección es requerida';
      } else if (value.length < 5) {
        error = 'Dirección debe tener al menos 5 caracteres';
      } else if (value.length > 100) {
        error = 'Dirección no debe exceder 100 caracteres';
      }
      break;
    case 'phone':
      const cleanedPhone = value.replace(/[\s\-\(\)]/g, '');
      if (!value.trim()) {
        error = 'Teléfono es requerido';
      } else if (!/^\d{10}$/.test(cleanedPhone)) {
        error = 'Teléfono debe tener exactamente 10 dígitos';
      }
      break;
    case 'email':
      if (!value.trim()) {
        error = 'Correo electrónico es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Formato de correo electrónico no válido';
      } else if (value.length > 100) {
        error = 'Correo electrónico no debe exceder 100 caracteres';
      } else if (customers.find(c => c.email === value && c.id !== editingId)) {
        error = 'Ya existe un cliente con este correo electrónico';
      }
      break;
    default:
      break;
  }
  return error;
};

const CustomerCRUD = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const API_URL = 'http://localhost:3002/api/customers';

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Error al cargar los clientes:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'email' ? value.toLowerCase() : value;
    setForm({ ...form, [name]: processedValue });
    const error = validateField(name, processedValue, customers, editingId);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach(key => {
      if (key !== 'id') {
        const error = validateField(key, form[key], customers, editingId);
        newErrors[key] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) return;

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingId) {
          setCustomers(customers.map((c) => (c.id === editingId ? data : c)));
        } else {
          setCustomers([...customers, data]);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditingId(null);
        setForm(initialForm);
        setErrors(initialErrors);
      })
      .catch((err) => console.error('Error al guardar el cliente:', err));
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => setCustomers(customers.filter((c) => c.id !== id)))
        .catch((err) => console.error('Error al eliminar el cliente:', err));
    }
  };

  return (
    <div className="customer-crud">
      <div className="customer-icon">👤</div>
      <h2 className="main-title">Gestión de Clientes</h2>
      <div className="top-buttons2">
        <button onClick={() => setView('form')} className="btn-custom">Agregar Cliente</button>
        <button onClick={() => setView('list')}>Ver Lista de Clientes</button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="names">Nombres</label>
              <input name="names" placeholder="Ej. Juan" value={form.names} onChange={handleChange} required />
              {errors.names && <div className="input-error">{errors.names}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="lastnames">Apellidos</label>
              <input name="lastnames" placeholder="Ej. Pérez" value={form.lastnames} onChange={handleChange} required />
              {errors.lastnames && <div className="input-error">{errors.lastnames}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idCard">Cédula</label>
              <input name="idCard" placeholder="Ej. 0102030405" value={form.idCard} onChange={handleChange} required />
              {errors.idCard && <div className="input-error">{errors.idCard}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Dirección</label>
              <input name="address" placeholder="Ej. Calle 10 y Av. 5" value={form.address} onChange={handleChange} required />
              {errors.address && <div className="input-error">{errors.address}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input name="phone" placeholder="Ej. 0991234567" value={form.phone} onChange={handleChange} />
              {errors.phone && <div className="input-error">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input name="email" placeholder="Ej. correo@ejemplo.com" value={form.email} onChange={handleChange} required />
              {errors.email && <div className="input-error">{errors.email}</div>}
            </div>
          </div>

          <div className="agregar-container">
            <button className="btn-agregar" type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
          </div>
        </form>
      )}

      {view === 'list' && (
        <div className="table-wrapper">
          {customers.length > 0 ? (
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Cédula</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo Electrónico</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.names}</td>
                    <td>{c.lastnames}</td>
                    <td>{c.idCard}</td>
                    <td>{c.address}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>
                      <button onClick={() => handleEdit(c)} className="btn-edit">Editar</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No hay clientes registrados</h3>
              <p>Agrega tu primer cliente usando el botón "Agregar Cliente"</p>
            </div>
          )}
        </div>
      )}

      {showSuccess && (
        <div className="success-overlay">
          <img src={user} alt="Éxito" className="success-gif" />
          <p>¡Cliente registrado con éxito!</p>
        </div>
      )}
    </div>
  );
};

export default CustomerCRUD;
