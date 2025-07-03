import { useEffect, useState } from 'react';
import { obtenerPedidosCliente, cancelarPedido } from '../../services/pedidoService';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function MisPedidos() {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const navigate = useNavigate();

    const cargarPedidos = async () => {
        const pedidosRaw = await obtenerPedidosCliente(user.uid);

        const pedidosDetallados = await Promise.all(pedidosRaw.map(async (pedido) => {
            try {
                const productoRef = doc(db, 'productos', pedido.productoId);
                const productoSnap = await getDoc(productoRef);

                if (!productoSnap.exists()) return null;

                const productoData = productoSnap.data();
                const empresaRef = doc(db, 'usuarios', productoData.empresaId);
                const empresaSnap = await getDoc(empresaRef);

                const empresaNombre = empresaSnap.exists() ? empresaSnap.data().nombre : 'Desconocida';

                return {
                    ...pedido,
                    productoNombre: productoData.nombre,
                    empresaNombre,
                    estado: pedido.estado || 'pendiente'
                };
            } catch (err) {
                console.error('Error cargando pedido:', err);
                return null;
            }
        }));

        // Filtrar nulos por si algún producto fue eliminado
        setPedidos(pedidosDetallados.filter(p => p));
    };

    useEffect(() => {
        if (user?.uid) cargarPedidos();
    }, [user]);

    const cancelar = async (pedidoId) => {
        const confirm = await Swal.fire({
            title: '¿Cancelar solicitud?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });

        if (confirm.isConfirmed) {
            await cancelarPedido(pedidoId);
            Swal.fire('Cancelado', 'Tu solicitud fue cancelada.', 'success');
            cargarPedidos();
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Mis Solicitudes</h2>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    ← Volver
                </button>
            </div>
            {pedidos.length === 0 ? (
                <p>No tienes solicitudes.</p>
            ) : (
                <div className="row">
                    {pedidos.map(p => (
                        <div className="col-md-6 mb-3" key={p.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{p.productoNombre}</h5>
                                    <p className="card-text">
                                        <strong>Cantidad solicitada:</strong> {p.cantidad}<br />
                                        Empresa: {p.empresaNombre}<br />
                                        Estado: {p.estado}
                                    </p>
                                    <button className="btn btn-danger btn-sm" onClick={() => cancelar(p.id)}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}