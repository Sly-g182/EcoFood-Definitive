import { createContext, useContext, useState } from "react";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Agrega este componente:
export function AuthProvider({ children }) {
const [usuario, setUsuario] = useState(null);

  // Puedes agregar aquí lógica de login/logout, etc.

return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
    {children}
    </AuthContext.Provider>
);
}