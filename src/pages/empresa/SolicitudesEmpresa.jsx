import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, runTransaction, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function SolicitudesEmpresa() {
    const { user } = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);
    const navigate = useNavigate();

    // --- INICIO DE LA MODIFICACIÓN ---
    const cargarSolicitudes = async () => {
        if (!user) return;
        const pedidosRef = collection(db, "pedidos");
        const q = query(pedidosRef, where("empresaId", "==", user.uid));
        const pedidosSnap = await getDocs(q);

        // Mapear cada pedido y obtener la información del cliente
        const solicitudesConDetalles = await Promise.all(pedidosSnap.docs.map(async (pedidoDoc) => {
            const pedidoData = pedidoDoc.data();
            let clienteNombre = 'Desconocido';

            // Buscar el nombre del cliente usando el clienteId del pedido
            if (pedidoData.clienteId) {
                const clienteRef = doc(db, "usuarios", pedidoData.clienteId);
                const clienteSnap = await getDoc(clienteRef);
                if (clienteSnap.exists()) {
                    clienteNombre = clienteSnap.data().nombre;
                }
            }

            return {
                id: pedidoDoc.id,
                ...pedidoData,
                clienteNombre: clienteNombre // Añadimos el nombre del cliente al objeto
            };
        }));
        
        setSolicitudes(solicitudesConDetalles);
    };
    // --- FIN DE LA MODIFICACIÓN ---

    useEffect(() => {
        if (user?.uid) {
            cargarSolicitudes();
        }
    }, [user]);

    const actualizarEstado = async (solicitud, nuevoEstado) => {
        const pedidoRef = doc(db, "pedidos", solicitud.id);
        
        if (nuevoEstado === "rechazado") {
            await updateDoc(pedidoRef, { estado: "rechazado" });
            Swal.fire("Rechazado", "La solicitud ha sido rechazada.", "success");
            cargarSolicitudes();

            return;
        }

        if (nuevoEstado === "confirmado") {
            const productoRef = doc(db, "productos", solicitud.productoId);
            try {
                await runTransaction(db, async (transaction) => {
                    const productoDoc = await transaction.get(productoRef);
                    if (!productoDoc.exists()) {
                        throw new Error("El producto asociado a este pedido ya no existe.");
                    }
                    const stockActual = productoDoc.data().cantidad;
                    if (stockActual < solicitud.cantidad) {
                        throw new Error(`No hay suficiente stock. Disponible: ${stockActual}, Solicitado: ${solicitud.cantidad}.`);
                    }
                    const nuevoStock = stockActual - solicitud.cantidad;
                    transaction.update(productoRef, { cantidad: nuevoStock });
                    transaction.update(pedidoRef, { estado: "confirmado" });
                });
                Swal.fire("¡Confirmado!", "La solicitud ha sido aprobada y el stock ha sido actualizado.", "success");
            } catch (error) {
                console.error("Error en la transacción: ", error);
                Swal.fire("Error", `No se pudo confirmar la solicitud: ${error.message}`, "error");
            }
            cargarSolicitudes();
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Solicitudes de Productos</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>
            {solicitudes.length === 0 ? (
                <p>No hay solicitudes pendientes.</p>
            ) : (
                <div className="row">
                    {solicitudes.map(s => (
                        <div className="col-md-6 mb-3" key={s.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{s.productoNombre}</h5>
                                    <p className="card-text">
                                        {/* --- CAMBIO EN LA VISUALIZACIÓN --- */}
                                        Cliente: <strong>{s.clienteNombre}</strong><br />
                                        Cantidad: {s.cantidad}<br />
                                        Estado: <span className={`fw-bold text-${s.estado === 'pendiente' ? 'warning' : s.estado === 'confirmado' ? 'success' : 'danger'}`}>{s.estado}</span>
                                    </p>
                                    {s.estado === "pendiente" && (
                                        <>
                                            <button className="btn btn-success me-2" onClick={() => actualizarEstado(s, "confirmado")}>
                                                Confirmar
                                            </button>
                                            <button className="btn btn-danger" onClick={() => actualizarEstado(s, "rechazado")}>
                                                Rechazar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}