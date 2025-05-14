import React from 'react';
import { UserCog, PackagePlus } from 'lucide-react';

const supervisorOptions = [
  {
    title: 'Gestionar Cuenta de Empleados',
    icon: <UserCog size={48} className="text-indigo-600" />,
    onClick: () => alert('Ir a gestionar cuenta de empleados'),
  },
  {
    title: 'Registrar Stock',
    icon: <PackagePlus size={48} className="text-indigo-600" />,
    onClick: () => alert('Ir a registrar stock'),
  },
];

const SupervisorPage = () => {
  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-md">
        <h1 className="text-2xl text-center font-semibold">Panel del Supervisor</h1>
      </header>

      {/* Contenedor principal */}
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {supervisorOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {option.icon}
              <button
                onClick={option.onClick}
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition"
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

export default SupervisorPage;