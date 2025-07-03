import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

function Recuperar() {
const [email, setEmail] = useState('');
const [msg, setMsg] = useState('');

const handleSubmit = async e => {
    e.preventDefault();
    try {
    await sendPasswordResetEmail(auth, email);
    setMsg('Correo de recuperación enviado.');
    } catch {
    setMsg('Error al enviar el correo.');
    }
};

return (
    <div className="container mt-4">
    <h2>Recuperar Contraseña</h2>
    <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} required />
        <button className="btn btn-warning">Enviar</button>
    </form>
    <p className="mt-2">{msg}</p>
    </div>
);
}

export default Recuperar;