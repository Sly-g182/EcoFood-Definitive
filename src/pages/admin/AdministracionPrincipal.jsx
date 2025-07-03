import { useEffect, useState } from 'react';
import { getAdmins, deleteAdmin } from '../../services/userService';
import { registrarAdminConAuth } from '../../services/adminFirebase';
import Swal from 'sweetalert2';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function AdministracionPrincipal() {
const [admins, setAdmins] = useState([]);
const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    id: null
});
const [modoEdicion, setModoEdicion] = useState(false);

const cargarAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
};

const esContraseñaRobusta = (password) => {
    const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!modoEdicion && !esContraseñaRobusta(formData.password)) {
    return Swal.fire(
        'Contraseña débil',
        'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
        'error'
    );
    }

    try {
    if (modoEdicion) {
        const ref = doc(db, 'usuarios', formData.id);
        await updateDoc(ref, {
        nombre: formData.nombre,
        email: formData.email,
        });
        Swal.fire('Actualizado', 'Administrador actualizado correctamente', 'success');
    } else {
        await registrarAdminConAuth(formData);
        Swal.fire('Creado', 'Administrador registrado correctamente', 'success');
    }

    setFormData({ nombre: '', email: '', password: '', id: null });
    setModoEdicion(false);
    cargarAdmins();
    } catch (error) {
    Swal.fire('Error', error.message, 'error');
    }
};

const eliminar = async (id) => {
    const result = await Swal.fire({
    title: '¿Eliminar administrador?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí'
    });
    if (result.isConfirmed) {
    try {
        await deleteAdmin(id);
        Swal.fire('Eliminado', 'Administrador eliminado correctamente', 'success');
        cargarAdmins();
    } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
    }
    }
};

const editar = (admin) => {
    setFormData({
    nombre: admin.nombre,
    email: admin.email,
    password: '',
    id: admin.id
    });
    setModoEdicion(true);
};

useEffect(() => {
    cargarAdmins();
}, []);

return (
    <div className="container mt-4">
    <h2>Administración Principal</h2>

    <form onSubmit={handleSubmit} className="mb-4">
        <input
        className="form-control mb-2"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
        required
        />
        <input
        className="form-control mb-2"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        required
        />
        {!modoEdicion && (
        <input
            className="form-control mb-2"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
        />
        )}
        <button className="btn btn-primary">
        {modoEdicion ? 'Actualizar Admin' : 'Registrar Admin'}
        </button>
        {modoEdicion && (
        <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
            setModoEdicion(false);
            setFormData({ nombre: '', email: '', password: '', id: null });
            }}
        >
            Cancelar
        </button>
        )}
    </form>

    <table className="table">
        <thead>
        <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        {admins.map(admin => (
            <tr key={admin.id}>
            <td>{admin.nombre}</td>
            <td>{admin.email}</td>
            <td>
                <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editar(admin)}
                >
                Editar
                </button>
                <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminar(admin.id)}
                >
                Eliminar
                </button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
}
