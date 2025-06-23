import React, { useEffect, useState } from 'react';
import '../Styles/Panel.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#FF6B35', '#FFB347', '#FFD700', '#A0E7E5', '#B4F8C8'];

const PanelAdmin = () => {
  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    lowInventory: 0,
    sales: [],
    totalSalesAmount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customers = await fetch('http://localhost:3002/api/customers').then(res => res.json());
        const employees = await fetch('http://localhost:3000/api/employees').then(res => res.json());
        const inventory = JSON.parse(localStorage.getItem('inventoryData')) || [];
        const sales = JSON.parse(localStorage.getItem('ventasRegistradas')) || [];

        const lowInventory = inventory.filter(p => parseInt(p.currentStock) <= parseInt(p.minThreshold));

        const groupedSales = sales.reduce((acc, venta) => {
          const date = venta.fecha.split(',')[0];
          const existing = acc.find(v => v.fecha === date);
          if (existing) {
            existing.total += parseFloat(venta.total);
          } else {
            acc.push({ fecha: date, total: parseFloat(venta.total) });
          }
          return acc;
        }, []);

        const totalSalesAmount = sales.reduce((sum, v) => sum + parseFloat(v.total), 0);

        setStats({
          customers: customers.length,
          employees: employees.length,
          lowInventory: lowInventory.length,
          sales: groupedSales,
          totalSalesAmount,
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchStats();
  }, []);

  return (
  <div className="admin-dashboard">
    <div className="panel-admin-wrapper">
      <div className="panel-admin-container">
        <h2 className="dashboard-title">Panel Administrativo</h2>

        <div className="stat-grid">
          <div className="stat-card">👥 Clientes<br /><strong>{stats.customers}</strong></div>
          <div className="stat-card">🧑‍🍳 Empleados<br /><strong>{stats.employees}</strong></div>
          <div className="stat-card">📦 Inventario Crítico<br /><strong>{stats.lowInventory}</strong></div>
          <div className="stat-card">💰 Total Ventas<br /><strong>${stats.totalSalesAmount.toFixed(2)}</strong></div>
        </div>

        <div className="charts-container">
          <div className="chart-box">
            <h3>📊 Ventas por Día (Barras)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.sales}>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#FF6B35" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>🍰 Distribución (Pastel)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="total"
                  data={stats.sales}
                  nameKey="fecha"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.sales.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>📈 Tendencia de Ventas (Línea)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.sales}>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default PanelAdmin;
