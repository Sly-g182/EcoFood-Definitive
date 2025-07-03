import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Administracion.css';

export default function Administracion() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Cargar administradores
  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const adminsList = [];
      querySnapshot.forEach((docu) => {
        const data = docu.data();
        if (data.tipo === 'admin') {
          adminsList.push({ id: docu.id, ...data });
        }
      });
      setAdmins(adminsList);
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  // Eliminar administrador
  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este administrador?')) {
      await deleteDoc(doc(db, 'usuarios', id));
      setAdmins(admins.filter(admin => admin.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  // Obtener el admin seleccionado
  const selectedAdmin = admins.find(admin => admin.id === selectedId);

  return (
    <div className="admin-bg">
      <div className="admin-container">
        <h1>Administración Principal</h1>
        <p>Desde aquí podrás gestionar a los administradores del sistema.</p>
        {loading ? (
          <p>Cargando administradores...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Principal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr
                  key={admin.id}
                  className={admin.id === selectedId ? 'selected' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedId(admin.id)}
                >
                  <td>{admin.nombre || 'Sin nombre'}</td>
                  <td>{admin.email}</td>
                  <td>{admin.esPrincipal ? 'Sí' : 'No'}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(admin.id);
                      }}
                    >
                      Eliminar
                    </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedAdmin && (
          <div className="alert-info mt-3">
            <strong>Seleccionado:</strong> {selectedAdmin.nombre || 'Sin nombre'} ({selectedAdmin.email})
          </div>
        )}
      </div>
    </div>
  );
}