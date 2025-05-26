import React, { useState } from 'react';
import '../Styles/ModCustomer.css';

const initialForm = { id: '', name: '', email: '' };

const CustomerCRUD = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // Update
      setCustomers(customers.map(c => c.id === editingId ? form : c));
      setEditingId(null);
    } else {
      // Create
      setCustomers([...customers, { ...form, id: Date.now().toString() }]);
    }

    setForm(initialForm);
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer.id);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="customer-crud">
      <h2>Gestión de Clientes</h2>

      <form onSubmit={handleSubmit} className="customer-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => handleEdit(c)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(c.id)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerCRUD;
