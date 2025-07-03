// src/components/admin/EmpresaList.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import EmpresaForm from './EmpresaForm';

export default function EmpresaList() {
const [empresas, setEmpresas] = useState([]);
const [empresaEditando, setEmpresaEditando] = useState(null);

useEffect(() => {
    const unsub = onSnapshot(collection(db, 'empresas'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmpresas(data);
    });

    return () => unsub();
}, []);

const eliminarEmpresa = async (id) => {
    try {
    await deleteDoc(doc(db, 'empresas', id));
    } catch (error) {
    console.error('Error al eliminar empresa:', error);
    }
};

return (
    <div>
    <EmpresaForm empresaEditando={empresaEditando} setEmpresaEditando={setEmpresaEditando} />
    <h3>Listado de Empresas</h3>
    <ul>
        {empresas.map((emp) => (
        <li key={emp.id}>
            <strong>{emp.nombre}</strong> - {emp.rut} - {emp.email}
            <button onClick={() => setEmpresaEditando(emp)}>Editar</button>
            <button onClick={() => eliminarEmpresa(emp.id)}>Eliminar</button>
        </li>
        ))}
    </ul>
    </div>
);
}
