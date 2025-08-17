import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Styles/Sales.css';

const RegistroVentas = () => {
  const [productosForm, setProductosForm] = useState([{ productId: '', quantity: 1 }]);
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [ventasRegistradas, setVentasRegistradas] = useState([]);
  const [vista, setVista] = useState('agregar');
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const employeeIdRef = useRef(null); // referencia en memoria

  // --- Función para obtener el ID del empleado ---
  const fetchIdByEmail = async () => {
    if (employeeIdRef.current) {
      return employeeIdRef.current; // ya lo tenemos en memoria
    }
    try {
      const response = await axios.post('http://localhost:3010/api/employees/by-email', {
        email: localStorage.getItem("employeeEmail")
      });
      console.log("ID del empleado recibido:", response.data);
      setEmployeeId(response.data);
      employeeIdRef.current = response.data; // guardamos en referencia
      return response.data;
    } catch (error) {
      console.error('Error al obtener el ID del empleado:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3020/api/customers');
        setClientes(response.data.customers || []);
        console.log('Clientes obtenidos:', response.data.customers);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setClientes([]);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/products');
        setProductosDisponibles(response.data.products);
        console.log('Productos disponibles:', response.data.products);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setProductosDisponibles([]);
      }
    };

    const fetchOrdenes = async () => {
      try {
        // 1. Obtener órdenes
        const ordersRes = await axios.get('http://localhost:3030/api/orders');
        const orders = ordersRes.data.orders;

        // 2. Obtener clientes
        const customersRes = await axios.get('http://localhost:3020/api/customers');
        const customers = customersRes.data.customers || [];

        const employeesRes = await axios.get('http://localhost:3010/api/employees');
        const employees = employeesRes.data.employees || [];

        // 3. Crear un mapa id → nombre completo
        const customerMap = {};
        customers.forEach(c => {
          customerMap[c.id] = `${c.names} ${c.lastnames}`;
        });

        const employeeMap = {};
        employees.forEach(c => {
          employeeMap[c.id] = `${c.names} ${c.lastnames}`;
        });

        // 4. Agregar campo customerName a cada orden
        const ordersWithNames = orders.map(order => ({
          ...order,
          customerName: customerMap[order.customerId] || 'Cliente desconocido',
          employeeName: employeeMap[order.employeeId] || 'Empleado desconocido'
        }));

        console.log("Ordenes", ordersWithNames)

        // 5. Guardar
        setVentasRegistradas(ordersWithNames);
      } catch (error) {
        console.error('Error al obtener órdenes o clientes:', error);
        setVentasRegistradas([]);
      }
    };


    fetchClientes();
    fetchProductos();
    fetchOrdenes();
    fetchIdByEmail(); // lo pedimos de entrada para tenerlo listo
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
    setProductosForm([...productosForm, { productId: '', quantity: 1 }]);
  };

  const eliminarProductoForm = (index) => {
    if (productosForm.length === 1) return;
    setProductosForm(productosForm.filter((_, i) => i !== index));
  };

  const calcularTotalForm = () => {
    return productosForm.reduce((total, item) => {
      const prod = productosDisponibles.find(p => p.id === item.productId);
      if (prod) {
        return total + item.quantity * parseFloat(prod.price);
      }
      return total;
    }, 0).toFixed(2);
  };

  const registrarVenta = async () => {
  const productosValidos = productosForm.every(p => p.productId && p.quantity > 0);
  if (!productosValidos) {
    alert('Seleccione un producto válido y cantidad mayor a 0.');
    return;
  }

  // aseguramos el ID del empleado
  let empleadoIdFinal = employeeIdRef.current || employeeId;
  if (!empleadoIdFinal) {
    empleadoIdFinal = await fetchIdByEmail();
    if (!empleadoIdFinal) {
      alert('No se pudo obtener el ID del empleado.');
      return;
    }
  }

  console.log("NOOOO", empleadoIdFinal);

  const orderData = {
    employeeId: empleadoIdFinal,
    customerId: cliente.trim() || '2d399ebc-458f-43c9-b6a1-78b6e2bd10ef',
    items: productosForm.map(p => ({
      productId: p.productId,
      quantity: p.quantity
    }))
  };

  console.log("Order data", orderData);

  try {
    await axios.post('http://localhost:3030/api/orders', orderData);
    alert('Venta registrada con éxito');

    // limpiar formulario
    setProductosForm([{ productId: '', quantity: 1 }]);
    setCliente('');
    setMetodoPago('');
    setVista('ver');

    // volver a traer las órdenes con nombres de cliente y empleado
    const ordersRes = await axios.get('http://localhost:3030/api/orders');
    const orders = ordersRes.data.orders;

    const customersRes = await axios.get('http://localhost:3020/api/customers');
    const customers = customersRes.data.customers || [];

    const employeesRes = await axios.get('http://localhost:3010/api/employees');
    const employees = employeesRes.data.employees || [];

    const customerMap = {};
    customers.forEach(c => {
      customerMap[c.id] = `${c.names} ${c.lastnames}`;
    });

    const employeeMap = {};
    employees.forEach(e => {
      employeeMap[e.id] = `${e.names} ${e.lastnames}`;
    });

    const ordersWithNames = orders.map(order => ({
      ...order,
      customerName: customerMap[order.customerId] || 'Cliente desconocido',
      employeeName: employeeMap[order.employeeId] || 'Empleado desconocido'
    }));

    setVentasRegistradas(ordersWithNames);

  } catch (error) {
    console.error('Error al registrar venta:', error);
  }
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
                value={producto.productId}
                onChange={(e) => handleProductoChange(index, 'productId', e.target.value)}
              >
                <option value="">Seleccione producto</option>
                {productosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${parseFloat(p.price).toFixed(2)})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={producto.quantity}
                onChange={(e) => handleProductoChange(index, 'quantity', e.target.value)}
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
                  <option key={c.id} value={c.id}>{c.names} {c.lastnames}</option>
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
                    <th>Empleado</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasRegistradas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.employeeName}</td>
                      <td>{venta.customerName}</td>
                      <td>
                        <ul>
                          {venta.orderDetails.map((p, i) => (
                            <li key={i}>{p.product.name} x {p.quantity}</li>
                          ))}
                        </ul>
                      </td>
                      <td>${parseFloat(venta.total).toFixed(2)}</td>
                      <td>{new Date(venta.createdAt).toLocaleString()}</td>
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
