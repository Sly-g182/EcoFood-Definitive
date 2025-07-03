// src/components/PedidoCard.jsx
import React from 'react';
import Swal from 'sweetalert2';

export default function PedidoCard({ pedido, onCancelar }) {
const {
    productoNombre,
    empresaNombre,
    estado,
    id
} = pedido;

const cancelar = () => {
    Swal.fire({
    title: `¿Cancelar solicitud de ${productoNombre}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar'
    }).then(result => {
    if (result.isConfirmed) {
        onCancelar(id);
    }
    });
};

return (
    <div className="card mb-3">
    <div className="card-body">
        <h5 className="card-title">{productoNombre}</h5>
        <p className="card-text">
        <strong>Empresa:</strong> {empresaNombre}<br />
        <strong>Estado:</strong> {estado}
        </p>
        {estado === 'pendiente' && (
        <button className="btn btn-danger" onClick={cancelar}>Cancelar</button>
        )}
    </div>
    </div>
);
}
