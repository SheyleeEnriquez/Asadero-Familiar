import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Inventory.css';

const API_BASE_URL = 'http://localhost:3040/api';

const initialForm = {
  id: '',
  name: '',
  quantity: '',
  minThreshold: ''
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('form');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setApiError('');
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      
      // El backend devuelve { inventory: [...], pagination: {...} }
      if (response.data && Array.isArray(response.data.inventory)) {
        setProducts(response.data.inventory);
      } else {
        console.error('La respuesta no tiene el formato esperado:', response.data);
        setProducts([]);
        setApiError('Error: La respuesta del servidor no tiene el formato esperado');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setApiError('Error al cargar los productos: ' + (error.response?.data?.message || error.message));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un producto
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setApiError('');
      const response = await axios.post(`${API_BASE_URL}/inventory`, productData);
      
      // Asegurar que products sea un array antes de agregar
      const currentProducts = Array.isArray(products) ? products : [];
      setProducts([...currentProducts, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      setApiError('Error al crear el producto: ' + (error.response?.data?.message || error.message));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un producto
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setApiError('');
      const response = await axios.put(`${API_BASE_URL}/inventory/${id}`, productData);
      
      // Asegurar que products sea un array antes de mapear
      const currentProducts = Array.isArray(products) ? products : [];
      setProducts(currentProducts.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      setApiError('Error al actualizar el producto: ' + (error.response?.data?.message || error.message));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setApiError('');
      await axios.delete(`${API_BASE_URL}/inventory/${id}`);
      
      // Asegurar que products sea un array antes de filtrar
      const currentProducts = Array.isArray(products) ? products : [];
      setProducts(currentProducts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setApiError('Error al eliminar el producto: ' + (error.response?.data?.message || error.message));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener productos con stock bajo
  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setApiError('');
      const response = await axios.get(`${API_BASE_URL}/low-stock`);
      
      // Asumir que low-stock también devuelve el mismo formato
      if (response.data && Array.isArray(response.data.inventory)) {
        setProducts(response.data.inventory);
      } else if (Array.isArray(response.data)) {
        // En caso de que low-stock devuelva directamente el array
        setProducts(response.data);
      } else {
        console.error('La respuesta no tiene el formato esperado:', response.data);
        setProducts([]);
        setApiError('Error: La respuesta del servidor no tiene el formato esperado');
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      setApiError('Error al cargar productos con stock bajo: ' + (error.response?.data?.message || error.message));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Solo letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.name.trim())) {
      newErrors.name = 'El nombre solo debe contener letras y espacios';
    }

    if (form.quantity < 0 || form.quantity === '') {
      newErrors.quantity = 'El stock debe ser un número positivo';
    }

    if (form.minThreshold < 0 || form.minThreshold === '') {
      newErrors.minThreshold = 'El umbral mínimo debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const productData = {
        name: form.name,
        quantity: parseInt(form.quantity),
        minThreshold: parseInt(form.minThreshold)
      };

      if (editingId !== null) {
        await updateProduct(editingId, productData);
        setEditingId(null);
      } else {
        await createProduct(productData);
      }

      setForm(initialForm);
      setErrors({});
      setView('list'); // Cambiar a vista de lista después de guardar
    } catch (error) {
      // El error ya se maneja en las funciones de API
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      quantity: product.quantity.toString(),
      minThreshold: product.minThreshold.toString()
    });
    setEditingId(product.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteProduct(id);
    }
  };

  const handleShowLowStock = () => {
    fetchLowStockProducts();
    setView('list');
  };

  const handleShowAllProducts = () => {
    fetchProducts();
    setView('list');
  };

  return (
    <div className="inventory-crud">
      <h2>Gestión de Inventario</h2>

      {/* Mostrar errores de API */}
      {apiError && (
        <div className="api-error" style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {apiError}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="loading" style={{ textAlign: 'center', margin: '20px 0' }}>
          Cargando...
        </div>
      )}

      <div className="top-buttons">
        <button onClick={() => setView('form')} disabled={loading}>
          Agregar Producto
        </button>
        <button onClick={handleShowAllProducts} disabled={loading}>
          Ver Inventario
        </button>
        <button onClick={handleShowLowStock} disabled={loading}>
          Stock Bajo
        </button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="inventory-form">
          <h2>{editingId ? 'Actualizar Producto' : 'Agregar Producto'}</h2>

          <input
            type="text"
            name="name"
            placeholder="Nombre del Producto"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <input
            type="number"
            name="quantity"
            placeholder="Stock Actual"
            value={form.quantity}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.quantity && <p className="error-text">{errors.quantity}</p>}

          <input
            type="number"
            name="minThreshold"
            placeholder="Umbral Mínimo"
            value={form.minThreshold}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.minThreshold && <p className="error-text">{errors.minThreshold}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : (editingId ? 'Actualizar' : 'Agregar')}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
                setErrors({});
              }}
              disabled={loading}
              style={{ marginLeft: '10px' }}
            >
              Cancelar
            </button>
          )}
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
                  const isCritical = parseInt(p.quantity) <= parseInt(p.minThreshold);
                  return (
                    <tr key={p.id} className={isCritical ? 'critical' : ''}>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>{p.minThreshold}</td>
                      <td>
                        {isCritical ? (
                          <span className="text-red">Crítico</span>
                        ) : (
                          <span className="text-green">Normal</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="btn-edit"
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="btn-delete"
                          disabled={loading}
                        >
                          Eliminar
                        </button>
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