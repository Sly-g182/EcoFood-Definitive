import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../services/pedidoService";

export default function ProductoCard({ producto, recargar }) {
    const { user } = useAuth();
    const [cantidad, setCantidad] = useState(1);

    const solicitar = async () => {
        if (!producto.cantidad || producto.cantidad < 1) {
            Swal.fire("Sin stock", "No hay stock disponible para este producto.", "info");
            return;
        }

        if (cantidad < 1 || cantidad > producto.cantidad) {
            Swal.fire("Cantidad inválida", "Selecciona una cantidad válida.", "warning");
            return;
        }

        const confirm = await Swal.fire({
            title: `¿Solicitar "${producto.nombre}"?`,
            text: `Confirmas solicitar ${cantidad} unidad(es) a ${producto.empresaNombre}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, solicitar",
        });

        if (confirm.isConfirmed) {
            try {
                // --- INICIO DE LA CORRECCIÓN ---
                // Se añaden los campos faltantes para que el pedido se guarde correctamente
                await crearPedido({
                    productoId: producto.id,
                    productoNombre: producto.nombre,
                    empresaId: producto.empresaId,
                    empresaNombre: producto.empresaNombre,
                    clienteId: user.uid,
                    cantidad: cantidad,
                    estado: "pendiente",
                    fecha: new Date(),
                });
                // --- FIN DE LA CORRECCIÓN ---
                Swal.fire("✅ Solicitud enviada", "", "success");
                if (recargar) recargar();
            } catch (error) {
                console.error("Error al solicitar:", error);
                Swal.fire("❌ Error", "No se pudo realizar la solicitud", "error");
            }
        }
    };

    const handleChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > producto.cantidad) value = producto.cantidad;
        setCantidad(value);
    };

    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text">
                    Empresa: <strong>{producto.empresaNombre || 'Desconocida'}</strong>
                </p>
                <p className="card-text">
                    Precio: <strong>${producto.precio === 0 ? 'Gratuito' : producto.precio}</strong>
                </p>
                <p className="card-text">
                    Stock: <strong>{producto.cantidad}</strong>
                </p>
                <div className="d-flex align-items-center mb-2">
                    <input
                        type="number"
                        min={1}
                        max={producto.cantidad}
                        value={cantidad}
                        onChange={handleChange}
                        className="form-control me-2"
                        style={{ width: 80 }}
                        disabled={producto.cantidad < 1}
                    />
                    <button
                        className="btn btn-success"
                        disabled={producto.cantidad < 1}
                        onClick={solicitar}
                    >
                        Solicitar
                    </button>
                </div>
                {producto.cantidad < 1 && (
                    <span className="text-danger">Sin stock</span>
                )}
            </div>
        </div>
    );
}