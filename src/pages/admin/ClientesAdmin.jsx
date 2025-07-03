import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from "../../services/firebase";


const ClientesAdmin = () => {
const [clientes, setClientes] = useState([]);

  // Obtener usuarios tipo cliente
const obtenerClientes = async () => {
    const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
    const querySnapshot = await getDocs(q);
    const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClientes(lista);
};

const eliminarCliente = async (id) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
    await deleteDoc(doc(db, "usuarios", id));
      obtenerClientes(); // Recargar lista
    }
};

useEffect(() => {
    obtenerClientes();
}, []);

return (
    <div className="clientes-admin">
    <h2>Clientes Registrados</h2>
    {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
    ) : (
        <table>
        <thead>
            <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {clientes.map(cliente => (
            <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>
                <button onClick={() => eliminarCliente(cliente.id)} className="btn-eliminar">Eliminar</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
);
};

export default ClientesAdmin;
