import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function PerfilEmpresa() {
    const { user } = useAuth();
    const [empresa, setEmpresa] = useState(null);
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const obtenerEmpresa = async () => {
                const ref = doc(db, "usuarios", user.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setEmpresa(snap.data());
                }
            };
            obtenerEmpresa();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresa({ ...empresa, [name]: value });
    };

    const guardarCambios = async () => {
        try {
            const ref = doc(db, "usuarios", user.uid);
            await updateDoc(ref, {
                nombre: empresa.nombre,
                direccion: empresa.direccion,
                comuna: empresa.comuna,
                telefono: empresa.telefono,
            });
            Swal.fire("✅ Perfil actualizado", "", "success");
            setEditando(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire("❌ Error al actualizar perfil", error.message, "error");
        }
    };

    if (!empresa) return <p>Cargando perfil...</p>;

    return (
        <div className="container mt-4">
            <h2>Perfil Empresa</h2>
            <div className="mb-3">
                <label>Nombre:</label>
                <input
                    className="form-control"
                    name="nombre"
                    value={empresa.nombre || ""}
                    onChange={handleChange}
                    disabled={!editando}
                />
            </div>
            <div className="mb-3">
                <label>Email:</label>
                <input
                    className="form-control"
                    value={empresa.email || ""}
                    disabled
                />
            </div>
            <div className="mb-3">
                <label>Rut:</label>
                <input
                    className="form-control"
                    value={empresa.rut || ""}
                    disabled
                />
            </div>
            <div className="mb-3">
                <label>Dirección:</label>
                <input
                    className="form-control"
                    name="direccion"
                    value={empresa.direccion || ""}
                    onChange={handleChange}
                    disabled={!editando}
                />
            </div>
            <div className="mb-3">
                <label>Comuna:</label>
                <input
                    className="form-control"
                    name="comuna"
                    value={empresa.comuna || ""}
                    onChange={handleChange}
                    disabled={!editando}
                />
            </div>
            <div className="mb-3">
                <label>Teléfono:</label>
                <input
                    className="form-control"
                    name="telefono"
                    value={empresa.telefono || ""}
                    onChange={handleChange}
                    disabled={!editando}
                />
            </div>

            {!editando ? (
                <button className="btn btn-primary" onClick={() => setEditando(true)}>
                    Editar Perfil
                </button>
            ) : (
                <>
                    <button className="btn btn-success me-2" onClick={guardarCambios}>
                        Guardar Cambios
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditando(false)}>
                        Cancelar
                    </button>
                </>
            )}

            <hr />
            <button
                className="btn btn-outline-dark mt-3"
                onClick={() => navigate("/empresa/productos")}
            >
                Administrar Productos
            </button>
            <button
                className="btn btn-outline-primary mt-3 ms-2"
                onClick={() => navigate("/empresa/solicitudes")}
            >
                Ver Solicitudes
            </button>
        </div>
    );
}
