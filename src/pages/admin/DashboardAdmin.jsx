import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardAdmin() {
const { userData } = useAuth();

return (
    <div style={{ padding: '2rem' }}>
    <h1>Panel de Administración</h1>
    <p>Bienvenido al módulo administrativo de EcoFood.</p>
    <nav style={{ marginTop: '1.5rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/admin/empresas">Gestionar Empresas</Link></li>
        <li><Link to="/admin/clientes">Gestionar Clientes</Link></li>
        {userData?.esPrincipal && (
            <Link to="/admin/administracion">Ir a Administración Principal</Link>
        )}
        </ul>
    </nav>
    </div>
);
}
