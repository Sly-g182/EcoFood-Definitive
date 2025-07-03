// src/components/admin/AdminList.jsx
import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import AdminForm from './AdminForm';

export default function AdminList() {
const [admins, setAdmins] = useState([]);
const [adminEditando, setAdminEditando] = useState(null);

useEffect(() => {
    const unsub = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
    const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.tipo === 'admin');
    setAdmins(data);
    });

    return () => unsub();
}, []);

const eliminarAdmin = async (admin) => {
    if (admin.esPrincipal) {
    alert('No se puede eliminar al administrador principal.');
    return;
    }

    try {
    await deleteDoc(doc(db, 'usuarios', admin.id));
    } catch (error) {
    console.error('Error al eliminar admin:', error);
    }
};

return (
    <div>
    <AdminForm adminEditando={adminEditando} setAdminEditando={setAdminEditando} />
    <h3>Listado de Administradores</h3>
    <ul>
        {admins.map((admin) => (
        <li key={admin.id}>
            <strong>{admin.nombre}</strong> - {admin.email}
            {admin.esPrincipal && <span> (Principal)</span>}
            <button onClick={() => setAdminEditando(admin)}>Editar</button>
            <button onClick={() => eliminarAdmin(admin)}>Eliminar</button>
        </li>
        ))}
    </ul>
    </div>
);
}
