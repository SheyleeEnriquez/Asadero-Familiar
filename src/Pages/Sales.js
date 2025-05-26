import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación
import '../Styles/Sales.css'; 

const RegistroVentas = () => {
  const [productos, setProductos] = useState([{ nombre: '', cantidad: 1 }]);
  const [cliente, setCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const navigate = useNavigate(); // Inicializamos el hook

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = value;
    setProductos(nuevosProductos);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: '', cantidad: 1 }]);
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      return total + (producto.cantidad * 10); // Precio fijo de $10 por unidad
    }, 0);
  };

  const registrarVenta = () => {
    const total = calcularTotal();
    const datosVenta = {
      productos,
      cliente: cliente || 'Consumidor final',
      metodoPago,
      total,
      fecha: new Date().toLocaleString()
    };

    // Aquí podrías enviar los datos a una API/backend
    console.log('Venta registrada:', datosVenta);

    // Redirigir a /sales después de registrar la venta
    navigate('/sales');
  };

  return (
    <div className="registro-ventas-container">
      <h2>Registro y Control de Ventas</h2>

      {productos.map((producto, index) => (
        <div key={index} className="producto-item">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={producto.nombre}
            onChange={(e) => handleProductoChange(index, 'nombre', e.target.value)}
          />
          <input
            type="number"
            min="1"
            value={producto.cantidad}
            onChange={(e) => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
          />
        </div>
      ))}

      <button onClick={agregarProducto}>+ Agregar otro producto</button>

      <input
        type="text"
        placeholder="Nombre del cliente (opcional)"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
        <option value="">Seleccione método de pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Transferencia">Transferencia</option>
      </select>

      <p>Total: ${calcularTotal()}</p>

      <button className="btn-registrar" onClick={registrarVenta}>Registrar Venta</button>
    </div>
  );
};

export default RegistroVentas;
