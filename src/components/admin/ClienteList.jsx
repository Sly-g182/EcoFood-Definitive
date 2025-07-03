// src/components/admin/ClienteList.jsx
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function ClienteList() {
const [clientes, setClientes] = useState([]);

useEffect(() => {
    const unsub = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
    const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.tipo === 'cliente');
    setClientes(data);
    });

    return () => unsub();
}, []);

const eliminarCliente = async (id) => {
    try {
    await deleteDoc(doc(db, 'usuarios', id));
    } catch (error) {
    console.error('Error al eliminar cliente:', error);
    }
};

return (
    <div>
    {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
    ) : (
        <ul>
        {clientes.map((cliente) => (
            <li key={cliente.id}>
            <strong>{cliente.nombre}</strong> - {cliente.email}
            <button onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
            </li>
        ))}
        </ul>
    )}
    </div>
);
}
