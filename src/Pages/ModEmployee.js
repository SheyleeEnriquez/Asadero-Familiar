import React, { useState } from 'react';
import '../Styles/ModEmployee.css';

const initialForm = { 
  id: '', 
  fullName: '', 
  idCard: '', 
  address: '', 
  phone: '', 
  email: '', 
  position: '', 
  systemRole: '', 
  branch: '' 
};

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
          name="fullName"
          placeholder="Nombre Completo"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idCard"
          placeholder="Identificación"
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
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Cargo"
          value={form.position}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="systemRole"
          placeholder="Rol en el Sistema"
          value={form.systemRole}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Sucursal Asignada"
          value={form.branch}
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
            <th>Nombre Completo</th>
            <th>Identificación</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Cargo</th>
            <th>Rol en el Sistema</th>
            <th>Sucursal Asignada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.fullName}</td>
              <td>{emp.idCard}</td>
              <td>{emp.address}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.systemRole}</td>
              <td>{emp.branch}</td>
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
