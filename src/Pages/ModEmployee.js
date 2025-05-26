import React, { useState } from 'react';
import '../Styles/ModEmployee.css';

const initialForm = { id: '', name: '', email: '', role: '' };

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // Update
      setEmployees(employees.map(emp => emp.id === editingId ? form : emp));
      setEditingId(null);
    } else {
      // Create
      setEmployees([...employees, { ...form, id: Date.now().toString() }]);
    }

    setForm(initialForm);
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setEditingId(employee.id);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="employee-crud">
      <h2>Gestión de Empleados</h2>

      <form onSubmit={handleSubmit} className="employee-form">
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
        <input
          type="text"
          name="role"
          placeholder="Cargo"
          value={form.role}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <button onClick={() => handleEdit(emp)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(emp.id)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeCRUD;
