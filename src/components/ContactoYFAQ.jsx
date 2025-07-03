// src/components/ContactoYFAQ.jsx
import React from 'react';

const ContactoYFAQ = () => {
    return (
        <section id="si-tienes-dudas-contactanos" className="py-5 bg-light">
        <div className="container">
            <div className="row text-center">
            <div className="col-md-6 mb-4">
                <h2>¡Contáctanos!</h2>
                <button
                className="btn btn-primary"
                onClick={() => window.location.href = 'contactos.html'}
                >
                Contacto
                </button>
            </div>
            <div className="col-md-6 mb-4">
                <h2>Preguntas Frecuentes</h2>
                <button
                className="btn btn-secondary"
                onClick={() => window.location.href = 'faq.html'}
                >
                Preguntas
                </button>
            </div>
            </div>
        </div>
        </section>
    );
};

export default ContactoYFAQ;
