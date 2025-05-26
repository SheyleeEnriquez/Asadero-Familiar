import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Supervisor from './Pages/Supervisor';
import Employee from './Pages/Employee';
import ModCustomer from './Pages/ModCustomer';
import ModEmployee from './Pages/ModEmployee';
import Sales from './Pages/Sales';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/supervisor" element={<Supervisor />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/modCustomer" element={<ModCustomer />} />
        <Route path="/modEmployee" element={<ModEmployee />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  