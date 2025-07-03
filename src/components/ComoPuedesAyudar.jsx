// src/components/ComoPuedesAyudar.jsx
import React from 'react';

const ComoPuedesAyudar = () => {
    return (
        <section id="como-puedes-ayudar" className="py-5">
        <div className="container">
            <h2 className="mb-4 text-center">¿Cómo Puedes Ayudar?</h2>
            <ul className="list-unstyled">
            <li className="mb-3">
                <strong>Consume responsablemente:</strong> Planifica tus compras y utiliza alimentos de forma eficiente.
                <img
                src="Css/img/consumo-responsable.jpg"
                alt="Consumo Responsable"
                className="img-fluid rounded mt-2"
                />
            </li>
            <li className="mb-3">
                <strong>Difunde conciencia:</strong> Comparte información sobre el impacto del desperdicio alimentario con tu comunidad.
                <img
                src="Css/img/desperdicio.jpg"
                alt="Desperdicio"
                className="img-fluid rounded mt-2"
                />
            </li>
            <li className="mb-3">
                <strong>¡Apoya y compra los productos naturales siempre!</strong>
                <img
                src="Css/img/comidareal.avif"
                alt="Comida real"
                className="img-fluid rounded mt-2"
                />
            </li>
            </ul>
        </div>
        </section>
    );
};

export default ComoPuedesAyudar;
