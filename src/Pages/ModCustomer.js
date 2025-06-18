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

const CustomerCRUD = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = 'http://localhost:3002/api/customers';

  useEffect(() => {
    // Fetch inicial para obtener todos los clientes
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Error al cargar los clientes:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      <h2>Gestión de Clientes</h2>
      <div className="top-buttons">
        <button onClick={() => setView('form')}>Agregar Cliente</button>
        <button onClick={() => setView('list')}>Ver Lista de Clientes</button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="customer-form">
          <input
            type="text"
            name="names"
            placeholder="Nombres"
            value={form.names}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastnames"
            placeholder="Apellidos"
            value={form.lastnames}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="idCard"
            placeholder="Cédula"
            value={form.idCard}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
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
