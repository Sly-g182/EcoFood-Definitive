import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {JSX.Element} children - El contenido protegido
 * @param {string|string[]=} requiredRole - El rol o roles permitidos (opcional)
 */
export default function ProtectedRoute({ children, requiredRole }) {
const { user, rol, cargando } = useAuth();

if (cargando) {
    return <p className="text-center mt-10">Cargando sesión...</p>;
}

if (!user) {
    return <Navigate to="/login" />;
}

if (requiredRole) {
    const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesPermitidos.includes(rol)) {
    return <Navigate to="/no-autorizado" />;
    }
}

return children;
}
