import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [rol, setRol] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    console.log("AuthStateChanged:", currentUser);

    if (currentUser && currentUser.emailVerified) {
        // Obtener rol desde Firestore
        const ref = doc(db, "usuarios", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
        const datos = snap.data();
        console.log("Datos Firestore:", datos);
        setRol(datos.rol || datos.tipo || "sin-rol");
        setUser(currentUser);
        } else {
          // Usuario no registrado en colección "usuarios"
        console.log("No existe documento en usuarios para este UID");
        setUser(null);
        setRol(null);
        }
    } else {
        if (currentUser && !currentUser.emailVerified) {
        console.log("Correo no verificado");
        }
        setUser(null);
        setRol(null);
    }
    setLoading(false);
    });

    return () => unsubscribe();
}, []);

if (loading) {
    return <div>Cargando autenticación...</div>;
}

  // Log para ver qué valores se pasan al contexto
console.log("Contexto AuthProvider:", { user, rol });

return (
    <AuthContext.Provider value={{ user, rol, cargando: loading }}>
    {children}
    </AuthContext.Provider>
);
};