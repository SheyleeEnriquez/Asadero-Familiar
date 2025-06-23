import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Sales.css';

const PRODUCTOS_DISPONIBLES = [
  { nombre: 'Salchipapa', precio: 1.25 },
  { nombre: 'Papipollo', precio: 1.75 },
  { nombre: 'Broster', precio: 1.75 },
  { nombre: 'Pollo entero vacío', precio: 10.00 },
  { nombre: 'Medio pollo vacío', precio: 5.00 },
  { nombre: 'Pollo entero completo (arroz, papas, consomé)', precio: 12.00 },
  { nombre: 'Medio pollo completo (arroz, papas, consomé)', precio: 7.00 },
  { nombre: 'Cuarto de pollo', precio: 4.00 },
  { nombre: 'Octavo de pollo', precio: 3.00 },
  { nombre: 'Almuerzo', precio: 2.5 },
  { nombre: 'Porción de papas', precio: 1.00 },
  { nombre: 'Porción de arroz', precio: 1.00 },
  { nombre: 'Salchipapa estudiantil', precio: 0.5 },
];

const RegistroVentas = () => {
  const [productosForm, setProductosForm] = useState([{ nombre: '', cantidad: 1 }]);
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [ventasRegistradas, setVentasRegistradas] = useState([]);
  const [vista, setVista] = useState('agregar');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/customers');
        setClientes(response.data || []);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setClientes([]);
      }
    };
    fetchClientes();
  }, []);

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productosForm];
    if (field === 'cantidad') {
      const cantidad = Math.max(1, parseInt(value) || 1);
      nuevosProductos[index][field] = cantidad;
    } else {
      nuevosProductos[index][field] = value;
    }
    setProductosForm(nuevosProductos);
  };

  const agregarProductoForm = () => {
    setProductosForm([...productosForm, { nombre: '', cantidad: 1 }]);
  };

  const eliminarProductoForm = (index) => {
    if (productosForm.length === 1) return;
    setProductosForm(productosForm.filter((_, i) => i !== index));
  };

  const calcularTotalForm = () => {
    return productosForm.reduce((total, producto) => {
      const prod = PRODUCTOS_DISPONIBLES.find(p => p.nombre === producto.nombre);
      if (prod) {
        return total + (producto.cantidad * prod.precio);
      }
      return total;
    }, 0).toFixed(2);
  };

  const registrarVenta = () => {
    const productosValidos = productosForm.every(p => p.nombre.trim() !== '' && p.cantidad > 0);
    if (!productosValidos) {
      alert('Seleccione un producto válido y cantidad mayor a 0.');
      return;
    }

    const total = calcularTotalForm();
    const datosVenta = {
      id: Date.now(),
      productos: productosForm,
      cliente: cliente.trim() || 'Consumidor final',
      metodoPago,
      total,
      fecha: new Date().toLocaleString()
    };

    setVentasRegistradas([...ventasRegistradas, datosVenta]);
    setProductosForm([{ nombre: '', cantidad: 1 }]);
    setCliente('');
    setMetodoPago('');
    setVista('ver');
  };

  return (
    <div className="registro-ventas-container">
      <h2>Registro y Control de Ventas</h2>

      <div className="top-buttons">
        <button onClick={() => setVista('agregar')} className={vista === 'agregar' ? 'active' : ''}>
          Agregar Venta
        </button>
        <button onClick={() => setVista('ver')} className={vista === 'ver' ? 'active' : ''} disabled={ventasRegistradas.length === 0}>
          Ver Ventas ({ventasRegistradas.length})
        </button>
      </div>

      {vista === 'agregar' && (
        <>
          {productosForm.map((producto, index) => (
            <div key={index} className="producto-item">
              <select
                value={producto.nombre}
                onChange={(e) => handleProductoChange(index, 'nombre', e.target.value)}
              >
                <option value="">Seleccione producto</option>
                {PRODUCTOS_DISPONIBLES.map((p) => (
                  <option key={p.nombre} value={p.nombre}>
                    {p.nombre} (${p.precio.toFixed(2)})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={producto.cantidad}
                onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
              />

              <button
                onClick={() => eliminarProductoForm(index)}
                disabled={productosForm.length === 1}
              >
                X
              </button>
            </div>
          ))}

          <button onClick={agregarProductoForm} style={{ marginTop: '10px' }}>
            + Agregar otro producto
          </button>

          <select
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            style={{ marginTop: '15px' }}
          >
            {clientes.length > 0 ? (
              <>
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </>
            ) : (
              <option value="">No hay clientes registrados</option>
            )}
          </select>

          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            style={{ marginTop: '10px' }}
          >
            <option value="">Seleccione método de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>

          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
            Total: ${calcularTotalForm()}
          </p>

          <button className="btn-registrar2" onClick={registrarVenta}>
            Registrar Venta
          </button>
        </>
      )}

      {vista === 'ver' && (
        <>
          {ventasRegistradas.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No hay ventas registradas.</p>
          ) : (
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Método de Pago</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasRegistradas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.id}</td>
                      <td>{venta.cliente}</td>
                      <td>{venta.metodoPago || 'No especificado'}</td>
                      <td>
                        <ul>
                          {venta.productos.map((p, i) => (
                            <li key={i}>{p.nombre} x {p.cantidad}</li>
                          ))}
                        </ul>
                      </td>
                      <td>${venta.total}</td>
                      <td>{venta.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegistroVentas;
