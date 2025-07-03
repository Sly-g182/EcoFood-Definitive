import { Routes, Route } from 'react-router-dom';

// Context y Rutas protegidas
import ProtectedRoute from './ProtectedRoute';

// Layouts y páginas públicas
import Home from '../pages/home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RegistroEmpresa from '../pages/RegistroEmpresa';
import RegistroAdmin from '../pages/RegistroAdmin';
import Recuperar from '../pages/Recuperar';

// Páginas admin
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import EmpresasAdmin from '../pages/admin/EmpresasAdmin';
import ClientesAdmin from '../pages/admin/ClientesAdmin';
import AdministradoresAdmin from '../pages/admin/AdministradoresAdmin';
import Administracion from '../pages/Administracion';
import ListaClientes from '../pages/admin/clientes/ListaClientes';
import FormularioCliente from '../pages/admin/clientes/FormularioCliente';

// Páginas empresa
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';
import ProductosEmpresa from '../pages/empresa/ProductosEmpresa';
import SolicitudesEmpresa from '../pages/empresa/SolicitudesEmpresa';

// Páginas cliente
import HomeCliente from '../pages/cliente/HomeCliente';
import VerProductos from '../pages/cliente/VerProductos';
import MisPedidos from '../pages/cliente/MisPedidos';
import EditarPerfil from '../pages/cliente/EditarPerfil';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/registro/empresa" element={
        <ProtectedRoute tipoPermitido="admin">
          <RegistroEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/registro/admin" element={
        <ProtectedRoute tipoPermitido="admin">
          <RegistroAdmin />
        </ProtectedRoute>
      } />
      <Route path="/recuperar" element={<Recuperar />} />

      {/* Rutas admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="empresas" element={<EmpresasAdmin />} />
        <Route path="clientes" element={<ClientesAdmin />} />
        <Route path="administradores" element={<AdministradoresAdmin />} />
        <Route path="administracion" element={<Administracion />} />
        <Route path="clientes/nuevo" element={<FormularioCliente />} />
        <Route path="clientes/editar/:id" element={<FormularioCliente />} />
      </Route>

      {/* Rutas empresa */}
      <Route path="/empresa/perfil" element={
        <ProtectedRoute tipoPermitido="empresa">
          <PerfilEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/empresa/productos" element={
        <ProtectedRoute tipoPermitido="empresa">
          <ProductosEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/empresa/solicitudes" element={
        <ProtectedRoute tipoPermitido="empresa">
          <SolicitudesEmpresa />
        </ProtectedRoute>
      } />

      {/* Rutas cliente */}
      <Route path="/cliente/home" element={
        <ProtectedRoute tipoPermitido="cliente">
          <HomeCliente />
        </ProtectedRoute>
      } />
      <Route path="/cliente/productos" element={
        <ProtectedRoute tipoPermitido="cliente">
          <VerProductos />
        </ProtectedRoute>
      } />
      <Route path="/cliente/pedidos" element={
        <ProtectedRoute tipoPermitido="cliente">
          <MisPedidos />
        </ProtectedRoute>
      } />
      <Route path="/cliente/perfil" element={
        <ProtectedRoute tipoPermitido="cliente">
          <EditarPerfil />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
