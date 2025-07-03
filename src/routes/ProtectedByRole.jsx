import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, requirePrincipal = false, children }) {
const { user, rol, cargando } = useAuth();

if (cargando) return <p>Cargando...</p>;

  // Si no hay usuario o el rol no está permitido
if (!user || !allowed.includes(rol)) {
    return <Navigate to="/login" />;
}

  // Si se requiere admin principal y no lo es
if (requirePrincipal && !user.esPrincipal) {
    return <p>No autorizado: se requiere administrador principal.</p>;
}

return children;
}