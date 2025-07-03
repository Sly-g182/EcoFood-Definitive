import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/**
 * Obtener perfil de empresa desde Firestore por su UID
 * @param {string} uid - ID del usuario autenticado
 * @returns {Promise<object|null>} - Datos de la empresa o null si no existe
 */
export async function obtenerPerfilEmpresa(uid) {
try {
    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
    } else {
    return null;
    }
} catch (error) {
    console.error("Error al obtener perfil de empresa:", error);
    throw error;
}
}

/**
 * Actualizar perfil de empresa (excepto correo y RUT)
 * @param {string} id - ID del documento en Firestore
 * @param {object} datos - Datos a actualizar
 */
export async function actualizarPerfilEmpresa(id, datos) {
try {
    const ref = doc(db, "usuarios", id);
    await updateDoc(ref, datos);
} catch (error) {
    console.error("Error al actualizar perfil de empresa:", error);
    throw error;
}
}
