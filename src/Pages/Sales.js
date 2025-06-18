import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [metodoPago, setMetodoPago] = useState('');
  const [ventasRegistradas, setVentasRegistradas] = useState([]);
  const [vista, setVista] = useState('agregar');
  const navigate = useNavigate();

  // Cambiar producto o cantidad en el formulario
  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productosForm];
    if(field === 'cantidad'){
      const cantidad = Math.max(1, parseInt(value) || 1); // cantidad mínima 1
      nuevosProductos[index][field] = cantidad;
    } else {
      nuevosProductos[index][field] = value;
    }
    setProductosForm(nuevosProductos);
  };

  // Agregar nuevo producto vacío
  const agregarProductoForm = () => {
    setProductosForm([...productosForm, { nombre: '', cantidad: 1 }]);
  };

  // Eliminar producto del formulario
  const eliminarProductoForm = (index) => {
    if(productosForm.length === 1) return; // Siempre debe quedar al menos 1 producto
    const nuevosProductos = productosForm.filter((_, i) => i !== index);
    setProductosForm(nuevosProductos);
  };

  // Calcular total tomando precios de productos quemados
  const calcularTotalForm = () => {
    return productosForm.reduce((total, producto) => {
      const prod = PRODUCTOS_DISPONIBLES.find(p => p.nombre === producto.nombre);
      if(prod){
        return total + (producto.cantidad * prod.precio);
      }
      return total;
    }, 0).toFixed(2);
  };

  // Registrar venta
  const registrarVenta = () => {
    // Validar que todos los productos tengan nombre válido
    const productosValidos = productosForm.every(p => p.nombre.trim() !== '' && p.cantidad > 0);
    if (!productosValidos) {
      alert('Por favor, selecciona un producto válido y cantidad mayor a 0 para todos los productos.');
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
        <button
          onClick={() => setVista('agregar')}
          className={vista === 'agregar' ? 'active' : ''}
        >
          Agregar Venta
        </button>
        <button
          onClick={() => setVista('ver')}
          className={vista === 'ver' ? 'active' : ''}
          disabled={ventasRegistradas.length === 0}
        >
          Ver Ventas ({ventasRegistradas.length})
        </button>
      </div>

      {vista === 'agregar' && (
        <>
          {productosForm.map((producto, index) => (
            <div key={index} className="producto-item" style={{ alignItems: 'center' }}>
              <select
                value={producto.nombre}
                onChange={(e) => handleProductoChange(index, 'nombre', e.target.value)}
                style={{ flex: 3, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
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
                style={{ flex: 1, marginLeft: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />

              <button
                onClick={() => eliminarProductoForm(index)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: productosForm.length === 1 ? 'not-allowed' : 'pointer',
                  opacity: productosForm.length === 1 ? 0.5 : 1,
                }}
                disabled={productosForm.length === 1}
                title={productosForm.length === 1 ? "Debe tener al menos un producto" : "Eliminar producto"}
              >
                X
              </button>
            </div>
          ))}

          <button onClick={agregarProductoForm} style={{ marginTop: '10px', padding: '8px 12px' }}>
            + Agregar otro producto
          </button>

          <input
            type="text"
            placeholder="Nombre del cliente (opcional)"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            style={{ marginTop: '15px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          />

          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="">Seleccione método de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>

          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>Total: ${calcularTotalForm()}</p>

          <button
            className="button"
            onClick={registrarVenta}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Registrar Venta
          </button>
        </>
      )}

      {vista === 'ver' && (
        <>
          {ventasRegistradas.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
              No hay ventas registradas.
            </p>
          ) : (
            <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    <tr key={venta.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td>{venta.id}</td>
                      <td>{venta.cliente}</td>
                      <td>{venta.metodoPago || 'No especificado'}</td>
                      <td style={{ textAlign: 'left' }}>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                          {venta.productos.map((p, i) => (
                            <li key={i}>
                              {p.nombre} x {p.cantidad}
                            </li>
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
