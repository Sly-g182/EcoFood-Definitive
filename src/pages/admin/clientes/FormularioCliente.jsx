import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { guardarCliente, obtenerClientePorId } from "./clientesService";

export default function FormularioCliente() {
const [form, setForm] = useState({ nombre: "", email: "" });
const { id } = useParams();
const navigate = useNavigate();

useEffect(() => {
    if (id) {
    obtenerClientePorId(id).then(setForm);
    }
}, [id]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    await guardarCliente(form, id);
    navigate("/admin/clientes");
};

return (
    <form onSubmit={handleSubmit}>
    <label>Nombre</label>
    <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
        minLength={3}
        maxLength={40}
    />
    <label>Email</label>
    <input
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        type="email"
    />
    <button type="submit" className="btn btn-primary">
        {id ? "Actualizar" : "Registrar"}
    </button>
    </form>
);
}
