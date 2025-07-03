import { useState } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        setError('Debes verificar tu correo antes de iniciar sesión.');
        return;
      }

      // Buscar datos del usuario en Firestore
      const ref = doc(db, 'usuarios', userCred.user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const datos = snap.data();

        if (datos.tipo === 'admin' && datos.esPrincipal) {
          navigate('/admin/administracion');
        } else if (datos.tipo === 'admin') {
          navigate('/admin/dashboard');
        } else if (datos.tipo === 'cliente') {
          navigate('/cliente/home');
        } else if (datos.tipo === 'empresa') {
          navigate('/empresa/perfil');
        } else {
          setError('No tienes permisos para acceder.');
        }
      } else {
        setError('Tu cuenta no está registrada correctamente en Firestore.');
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas o error de conexión.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Correo"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Contraseña"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success">Ingresar</button>
      </form>
      <p className="text-danger mt-3">{error}</p>
      <div className="login-links mt-3" style={{ textAlign: "center" }}>
        <a href="/registro" className="me-3">¿No tienes cuenta? Regístrate</a>
        <a href="/recuperar">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  );
}

export default Login;