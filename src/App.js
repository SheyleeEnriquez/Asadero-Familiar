import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard'; 
import Supervisor from './Pages/Supervisor';
import ModCustomer from './Pages/ModCustomer';
import ModEmployee from './Pages/ModEmployee';
import ForgotPassword from './Pages/ForgotPassword';
import Sales from './Pages/Sales';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/olvido-contraseña" element={<ForgotPassword />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute role="Administrador">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route
          path="/supervisor"
          element={
            <PrivateRoute role="Supervisor">
              <Supervisor />
            </PrivateRoute>
          } 
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute role="Empleado">
              <EmployeeDashboard />
            </PrivateRoute>
          
          } 
        />
        <Route path="/modCustomer" element={<ModCustomer />} />
        <Route path="/modEmployee" element={<ModEmployee />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  