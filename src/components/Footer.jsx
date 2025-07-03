// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-4">
        <div className="container">
            <div className="row">
            <div className="col-md-6">
                <p><strong>Dirección:</strong> Villalobos 221, La Serena</p>
                <p><strong>Email:</strong> ecofood@gmail.com</p>
                <p><strong>Teléfono:</strong> +56 9 4433 1221</p>
            </div>
            <div className="col-md-6">
                <p><strong>Síguenos:</strong></p>
                <a href="#" className="d-block text-white text-decoration-none">Facebook: EcoFood_oficial</a>
                <a href="#" className="d-block text-white text-decoration-none">Instagram: @ecofood_oficial</a>
                <a href="#" className="d-block text-white text-decoration-none">Twitter: @EcoFood_org</a>
            </div>
            </div>
            <div className="text-center mt-3">
            <p>&copy; 2025 EcoFood. Todos los derechos reservados.</p>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
