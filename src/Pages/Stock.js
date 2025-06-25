import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Inventory.css'; 

const API_BASE_URL = 'http://localhost:3040/api';

const RegisterStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [withdrawQuantity, setWithdrawQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      if (response.data && Array.isArray(response.data.inventory)) {
        setProducts(response.data.inventory);
      } else {
        setError('Error al obtener los productos del inventario');
      }
    } catch (err) {
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !withdrawQuantity) {
      setError('Selecciona un producto y una cantidad válida');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      setError('Producto no encontrado');
      return;
    }

    const currentStock = parseInt(product.quantity);
    const withdrawAmount = parseInt(withdrawQuantity);

    if (withdrawAmount <= 0 || withdrawAmount > currentStock) {
      setError(`Cantidad inválida. Stock disponible: ${currentStock}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      // Hacer la actualización del stock
      const updatedProduct = {
        ...product,
        quantity: currentStock - withdrawAmount
      };

      await axios.put(`${API_BASE_URL}/inventory/${product.id}`, updatedProduct);
      setMessage(`Se registró correctamente el retiro de ${withdrawAmount} unidades de "${product.name}".`);
      setWithdrawQuantity('');
      fetchProducts();
    } catch (err) {
      setError('Error al registrar el retiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-crud">
      <h2>Registro de Retiro de Productos</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="api-error">{error}</div>}

      <form onSubmit={handleWithdrawal} className="inventory-form">
        <label htmlFor="product">Seleccionar Producto:</label>
        <select
          id="product"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={loading}
          required
        >
          <option value="">-- Selecciona un producto --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.quantity})
            </option>
          ))}
        </select>

        <label htmlFor="quantity">Cantidad a retirar:</label>
        <input
          type="number"
          id="quantity"
          value={withdrawQuantity}
          onChange={(e) => setWithdrawQuantity(e.target.value)}
          min="1"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Registrar Retiro'}
        </button>
      </form>
    </div>
  );
};

export default RegisterStock;
