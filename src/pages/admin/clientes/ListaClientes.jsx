import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerClientes, eliminarCliente } from "./clientesService";

export default function ListaClientes() {
const [clientes, setClientes] = useState([]);

useEffect(() => {
    obtenerClientes().then(setClientes);
}, []);

const handleEliminar = async (id) => {
    if (confirm("¿Deseas eliminar este cliente?")) {
    await eliminarCliente(id);
    setClientes(clientes.filter((c) => c.id !== id));
    }
};

return (
    <div>
    <h2 className="text-xl font-bold mb-4">Clientes Registrados</h2>
    <Link to="/admin/clientes/nuevo" className="btn btn-primary">Agregar Cliente</Link>
    <ul className="mt-4">
        {clientes.map((cliente) => (
        <li key={cliente.id} className="flex justify-between my-2">
            <div>
            {cliente.nombre} - {cliente.email}
            </div>
            <div>
            <Link to={`/admin/clientes/editar/${cliente.id}`} className="mr-2">Editar</Link>
            <button onClick={() => handleEliminar(cliente.id)} className="text-red-600">Eliminar</button>
            </div>
        </li>
        ))}
    </ul>
    </div>
);
}
