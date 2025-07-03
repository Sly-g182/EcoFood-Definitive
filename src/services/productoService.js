import { db } from "../services/firebase"; // Asegúrate de que la ruta sea correcta
import {
addDoc,
collection,
deleteDoc,
doc,
getDocs,
query,
updateDoc,
where,
} from "firebase/firestore";

const productosRef = collection(db, "productos");

export async function crearProducto(producto) {
return await addDoc(productosRef, producto);
}

export async function actualizarProducto(id, data) {
return await updateDoc(doc(db, "productos", id), data);
}

export async function eliminarProducto(id) {
return await deleteDoc(doc(db, "productos", id));
}

export async function obtenerProductosEmpresa(empresaId) {
const q = query(productosRef, where("empresaId", "==", empresaId));
const snap = await getDocs(q);
return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
