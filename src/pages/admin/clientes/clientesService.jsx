import { db } from "../../../services/firebase";
import {collection,getDocs,getDoc,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore";

const refClientes = collection(db, "clientes");

export async function obtenerClientes() {
const snapshot = await getDocs(refClientes);
return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function obtenerClientePorId(id) {
const clienteDoc = await getDoc(doc(db, "clientes", id));
return clienteDoc.exists() ? { id: clienteDoc.id, ...clienteDoc.data() } : null;
}

export async function guardarCliente(cliente, id = null) {
if (id) {
    await updateDoc(doc(db, "clientes", id), cliente);
} else {
    await addDoc(refClientes, cliente);
}
}

export async function eliminarCliente(id) {
await deleteDoc(doc(db, "clientes", id));
}
