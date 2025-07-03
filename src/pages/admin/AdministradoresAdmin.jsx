import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { registrarAdminConAuth } from "../../services/adminFirebase";
import { getAdmins, deleteAdmin } from "../../services/userService"; // agrega esto
import { useAuth } from "../../context/AuthContext";

export default function AdminAdministradores() {
const [admins, setAdmins] = useState([]);
const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
const [showModal, setShowModal] = useState(false);
const { userData } = useAuth();

const cargarAdmins = async () => {
    const data = await getAdmins(); // función Firestore que obtiene usuarios con tipo "admin"
    setAdmins(data);
};

const guardar = async () => {
    try {
    await registrarAdminConAuth(formData);
    setShowModal(false);
    cargarAdmins();
    } catch (error) {
    Swal.fire("Error", error.message, "error");
    }
};

const eliminar = async (id) => {
    const result = await Swal.fire({
    title: "¿Eliminar administrador?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
    await deleteAdmin(id);
    cargarAdmins();
    }
};

useEffect(() => {
    if (userData?.tipo === "superadmin") cargarAdmins();
}, []);

if (userData?.tipo !== "superadmin") return <p>Acceso no autorizado</p>;

return (
    <div className="container mt-4">
    <h3>Administradores</h3>
    <button className="btn btn-primary" onClick={() => setShowModal(true)}>Nuevo Administrador</button>

    <table className="table mt-3">
        <thead>
        <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {admins.map((admin) => (
            <tr key={admin.id}>
            <td>{admin.nombre}</td>
            <td>{admin.email}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(admin.id)}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>

    {showModal && (
        <div className="modal d-block">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header"><h5>Nuevo Administrador</h5></div>
            <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nombre"
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input className="form-control mb-2" placeholder="Contraseña" type="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
            </div>
            </div>
        </div>
        </div>
    )}
    </div>
);
}
