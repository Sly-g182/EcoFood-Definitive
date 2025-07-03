import { useState, useEffect } from 'react';
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import {doc,setDoc,addDoc,collection,updateDoc,} from 'firebase/firestore';
import { db, secondaryAuth } from '../../services/firebase';

const initialState = {
nombre: '',
rut: '',
direccion: '',
comuna: '',
email: '',
telefono: '',
password: '',
};

export default function EmpresaForm({ empresaEditando, setEmpresaEditando }) {
const [empresa, setEmpresa] = useState(initialState);
const [mensaje, setMensaje] = useState('');

useEffect(() => {
    if (empresaEditando) {
    setEmpresa(empresaEditando);
    }
}, [empresaEditando]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
};

  // Validaciones
const esContraseñaRobusta = (contraseña) => {
    const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(contraseña);
};

const esTelefonoValido = (telefono) => {
    const regex = /^\+569\d{8}$/;
    return regex.test(telefono);
};

const esRutValido = (rut) => {
    const regex = /^(\d{1,2}\.?\d{3}\.?\d{3})\-([\dkK])$/;
    return regex.test(rut);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones solo en nuevo registro (no al editar)
    if (!empresaEditando) {
    if (!esContraseñaRobusta(empresa.password)) {
        return setMensaje(
        '❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'
        );
    }

    if (!esTelefonoValido(empresa.telefono)) {
        return setMensaje(
        '❌ El teléfono debe comenzar con +569 y contener 8 dígitos más (Ej: +56912345678).'
        );
    }

    if (!esRutValido(empresa.rut)) {
        return setMensaje(
        '❌ El RUT ingresado no tiene un formato válido. Usa formato 12345678-9 o 12.345.678-9.'
        );
    }
    }

    try {
    if (empresaEditando) {
        const empresaRef = doc(db, 'empresas', empresaEditando.id);
        await updateDoc(empresaRef, empresa);
        setEmpresaEditando(null);
    } else {
        await addDoc(collection(db, 'empresas'), empresa);

        const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        empresa.email,
        empresa.password
        );

        await sendEmailVerification(cred.user);

        await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre: empresa.nombre,
        rut: empresa.rut,
        direccion: empresa.direccion,
        comuna: empresa.comuna,
        email: empresa.email,
        telefono: empresa.telefono || '',
        tipo: 'empresa',
        });

        await secondaryAuth.signOut();
        setMensaje('✅ Empresa registrada. Revisa tu correo para verificar la cuenta.');
    }

    setEmpresa(initialState);
    } catch (error) {
    console.error('Error al guardar empresa:', error);
    setMensaje(`❌ Error: ${error.message}`);
    }
};

return (
    <form onSubmit={handleSubmit}>
    <input
        name="nombre"
        placeholder="Nombre"
        value={empresa.nombre}
        onChange={handleChange}
        required
    />
    <input
        name="rut"
        placeholder="RUT"
        value={empresa.rut}
        onChange={handleChange}
        required
    />
    <input
        name="direccion"
        placeholder="Dirección"
        value={empresa.direccion}
        onChange={handleChange}
        required
    />
    <input
        name="comuna"
        placeholder="Comuna"
        value={empresa.comuna}
        onChange={handleChange}
        required
    />
    <input
        type="email"
        name="email"
        placeholder="Email"
        value={empresa.email}
        onChange={handleChange}
        required
    />
    <input
        name="telefono"
        placeholder="Teléfono (+569XXXXXXXX)"
        value={empresa.telefono}
        onChange={handleChange}
        required
    />
    <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={empresa.password}
        onChange={handleChange}
        required
    />

    <button type="submit">
        {empresaEditando ? 'Actualizar Empresa' : 'Agregar Empresa'}
    </button>

    {mensaje && <p className="mt-3 text-info">{mensaje}</p>}
    </form>
);
}
