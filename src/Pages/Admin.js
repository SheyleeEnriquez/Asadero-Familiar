import React from 'react';
import { Users, Settings, FileBarChart, UserCog, Boxes } from 'lucide-react';

const adminOptions = [
  {
    title: 'Gestionar Clientes',
    icon: <Users size={48} className="text-sky-600" />,
    onClick: () => alert('Ir a gestionar clientes'),
  },
  {
    title: 'Panel Administrativo',
    icon: <Settings size={48} className="text-sky-600" />,
    onClick: () => alert('Ir al panel administrativo'),
  },
  {
    title: 'Generar Reportes',
    icon: <FileBarChart size={48} className="text-sky-600" />,
    onClick: () => alert('Ir a reportes'),
  },
  {
    title: 'Gestionar Cuenta de Empleados',
    icon: <UserCog size={48} className="text-sky-600" />,
    onClick: () => alert('Ir a empleados'),
  },
  {
    title: 'Gestionar Inventario',
    icon: <Boxes size={48} className="text-sky-600" />,
    onClick: () => alert('Ir al inventario'),
  },
];

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <header className="bg-sky-600 text-white py-4 shadow-md">
        <h1 className="text-2xl text-center font-semibold">Panel de Administración</h1>
      </header>

      {/* Contenedor principal */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {adminOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {option.icon}
              <button
                onClick={option.onClick}
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition"
              >
                {option.title}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;