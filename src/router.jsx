import { Routes, Route } from 'react-router-dom';
import RegistroCliente from './pages/Register';
import Home from './pages/home';
import Login from './pages/Login';
import RegistroEmpresa from './pages/RegistroEmpresa';
import RegistroAdmin from './pages/RegistroAdmin';
import SolicitudesEmpresa from './pages/empresa/SolicitudesEmpresa';
function AppRouter() {
  return (
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/home" element={<Home />} /> {/* Agrega esta línea */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<RegistroCliente />} />
  <Route path="/registro" element={<RegistroCliente />} />
  <Route path="/registro/empresa" element={<RegistroEmpresa />} />
  <Route path="/registro/admin" element={<RegistroAdmin />} />  
</Routes>
  );
}

export default AppRouter;