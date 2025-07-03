import { db } from './firebase';
import {
collection,
query,
where,
getDocs,
addDoc,
doc,
deleteDoc,
Timestamp,
} from 'firebase/firestore';

// Obtener pedidos del cliente
export const obtenerPedidosCliente = async (clienteId) => {
const ref = collection(db, 'pedidos');
const q = query(ref, where('clienteId', '==', clienteId));
const snap = await getDocs(q);
return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Crear nuevo pedido (con validación)
export const solicitarProducto = async (clienteId, producto) => {
const ref = collection(db, 'pedidos');

  // Verificar si ya existe un pedido del mismo producto por el mismo cliente
const q = query(ref, where('clienteId', '==', clienteId), where('productoId', '==', producto.id));
const snap = await getDocs(q);

if (!snap.empty) {
    throw new Error('Ya solicitaste este producto anteriormente.');
}

const nuevoPedido = {
    clienteId,
    productoId: producto.id,
    productoNombre: producto.nombre,
    empresaId: producto.empresaId,
    empresaNombre: producto.empresaNombre,
    estado: 'pendiente',
    fecha: Timestamp.now(),
};

await addDoc(ref, nuevoPedido);
};

// Cancelar pedido
export const cancelarPedido = async (pedidoId) => {
const ref = doc(db, 'pedidos', pedidoId);
await deleteDoc(ref);
};

// NUEVA FUNCIÓN crearPedido (sin validación extra)
export const crearPedido = async (pedido) => {
const ref = collection(db, 'pedidos');
await addDoc(ref, {
    ...pedido,
    fecha: pedido.fecha || Timestamp.now(),
    estado: pedido.estado || 'pendiente',
});
};
