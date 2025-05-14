import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Supervisor from './Pages/Supervisor';
import Employee from './Pages/Employee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/supervisor" element={<Supervisor />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  