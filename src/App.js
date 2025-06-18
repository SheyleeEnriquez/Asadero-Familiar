import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Components/AdminDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard'; 
import Supervisor from './Pages/Supervisor';
import ModCustomer from './Pages/ModCustomer';
import ModEmployee from './Pages/ModEmployee';
import Sales from './Pages/Sales';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/supervisor" element={<Supervisor />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/modCustomer" element={<ModCustomer />} />
        <Route path="/modEmployee" element={<ModEmployee />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  