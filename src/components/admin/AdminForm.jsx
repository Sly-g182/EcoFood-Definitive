import { useState, useEffect } from 'react';
import {createUserWithEmailAndPassword,sendEmailVerification,} from 'firebase/auth';
import { setDoc, updateDoc, doc } from 'firebase/firestore';
import { db, secondaryAuth } from '../../services/firebase';

const initialState = {
nombre: '',
contraseña: '',
email: '',
tipo: 'admin',
esPrincipal: false,
};

export default function AdminForm({ adminEditando, setAdminEditando }) {
const [admin, setAdmin] = useState(initialState);

useEffect(() => {
    if (adminEditando) setAdmin(adminEditando);
}, [adminEditando]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdmin({ ...admin, [name]: type === 'checkbox' ? checked : value });
};

const esContraseñaRobusta = (password) => {
    const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    if (!adminEditando && !esContraseñaRobusta(admin.contraseña)) {
        return alert(
        '❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'
        );
    }

    if (adminEditando) {
        const ref = doc(db, 'usuarios', adminEditando.id);
        await updateDoc(ref, admin);
        setAdminEditando(null);
    } else {
        const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        admin.email,
        admin.contraseña
        );

        await sendEmailVerification(cred.user);

        await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre: admin.nombre,
        email: admin.email,
        tipo: 'admin',
        esPrincipal: admin.esPrincipal || false,
        });

        await secondaryAuth.signOut();
        alert('✅ Admin creado. Revisa tu correo para verificar la cuenta.');
    }

    setAdmin(initialState);
    } catch (error) {
    console.error('Error al registrar admin:', error.message);
    alert('❌ Error: ' + error.message);
    }
};

return (
    <form onSubmit={handleSubmit}>
    <input
        name="nombre"
        placeholder="Nombre"
        value={admin.nombre}
        onChange={handleChange}
        required
    />
    <input
        name="email"
        placeholder="Email"
        type="email"
        value={admin.email}
        onChange={handleChange}
        required
    />
    <input
        type="password"
        name="contraseña"
        placeholder="Contraseña"
        value={admin.contraseña}
        onChange={handleChange}
        required
    />
    <label>
        ¿Es principal?
        <input
        type="checkbox"
        name="esPrincipal"
        checked={admin.esPrincipal}
        onChange={handleChange}
        />
    </label>
    <button type="submit">
        {adminEditando ? 'Actualizar Admin' : 'Agregar Admin'}
    </button>
    </form>
);
}
