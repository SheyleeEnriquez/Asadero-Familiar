// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('userToken'); // o tu token de supervisor/empleado
  if (!token) {
    // No hay token → redirige a login
    alert(`Error: Acceso sin token denegado`);
    return <Navigate to="/" replace />;
  }

  // Si hay token → deja pasar
  return children;
};

export default PrivateRoute;
