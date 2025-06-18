import React, { useState } from 'react';
import '../Styles/Inventory.css';

const initialForm = {
  id: '',
  productName: '',
  currentStock: '',
  minThreshold: ''
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? form : p));
      setEditingId(null);
    } else {
      setProducts([...products, { ...form, id: Date.now().toString() }]);
    }

    setForm(initialForm);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="inventory-crud">
      <h2>Gestión de Inventario</h2>

      <div className="top-buttons">
        <button onClick={() => setView('form')}>Agregar Producto</button>
        <button onClick={() => setView('list')}>Ver Inventario</button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="inventory-form">
  <h2>{editingId ? 'Actualizar Producto' : 'Agregar Producto'}</h2>

  <input
    type="text"
    name="productName"
    placeholder="Nombre del Producto"
    value={form.productName}
    onChange={handleChange}
    required
  />
  <input
    type="number"
    name="currentStock"
    placeholder="Stock Actual"
    value={form.currentStock}
    onChange={handleChange}
    required
  />
  <input
    type="number"
    name="minThreshold"
    placeholder="Umbral Mínimo"
    value={form.minThreshold}
    onChange={handleChange}
    required
  />
  <button type="submit">
    {editingId ? 'Actualizar' : 'Agregar'}
  </button>
</form>

      )}

      {view === 'list' && (
        <div className="table-wrapper">
          {products.length > 0 ? (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Umbral Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isCritical = parseInt(p.currentStock) <= parseInt(p.minThreshold);
                  return (
                    <tr key={p.id} className={isCritical ? 'critical' : ''}>
                      <td>{p.productName}</td>
                      <td>{p.currentStock}</td>
                      <td>{p.minThreshold}</td>
                      <td>
                        {isCritical ? (
                          <span className="text-red">Crítico</span>
                        ) : (
                          <span className="text-green">Normal</span>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEdit(p)} className="btn-edit">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="btn-delete">Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No hay productos registrados</h3>
              <p>Agrega tu primer producto usando el botón "Agregar Producto"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;
