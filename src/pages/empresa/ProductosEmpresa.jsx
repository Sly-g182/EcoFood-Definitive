import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosEmpresa,
} from "../../services/productoService";
import ProductoModal from "../../components/empresa/ProductoModal";
import ProductoCard from "../../components/empresa/ProductoCard";

export default function ProductosEmpresa() {
    const { user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [orden, setOrden] = useState("nombre-asc");
    const [porPagina, setPorPagina] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);

    const navigate = useNavigate();

    const cargarProductos = async () => {
        if (!user) return;
        const data = await obtenerProductosEmpresa(user.uid);
        setProductos(data);
    };

    useEffect(() => {
        cargarProductos();
    }, [user]);

    const guardarProducto = async (producto) => {
        if (productoEditar) {
            await actualizarProducto(productoEditar.id, producto);
        } else {
            await crearProducto({ ...producto, empresaId: user.uid, estado: "disponible" });
        }
        setMostrarModal(false);
        setProductoEditar(null);
        cargarProductos();
    };

    const eliminar = async (id) => {
        await eliminarProducto(id);
        cargarProductos();
    };

    const filtrarYOrdenar = () => {
        let lista = [...productos];
        const hoy = new Date();

        if (filtroEstado !== "todos") {
            lista = lista.filter((p) => {
                const d = new Date(p.vencimiento);
                const dias = Math.ceil((d - hoy) / (1000 * 60 * 60 * 24));
                if (filtroEstado === "disponible") return dias > 3;
                if (filtroEstado === "porVencer") return dias <= 3 && dias >= 0;
                if (filtroEstado === "vencido") return dias < 0;
                return true;
            });
        }

        if (busqueda) {
            lista = lista.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
        }

        if (orden === "nombre-asc") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        if (orden === "nombre-desc") lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        if (orden === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
        if (orden === "precio-desc") lista.sort((a, b) => b.precio - a.precio);

        return lista;
    };

    const productosFiltrados = filtrarYOrdenar();
    const totalPaginas = Math.ceil(productosFiltrados.length / porPagina);
    const inicio = (paginaActual - 1) * porPagina;
    const productosPagina = productosFiltrados.slice(inicio, inicio + porPagina);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Productos</h2>
                <div>
                    <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Volver
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setMostrarModal(true)}
                    >
                        + Producto
                    </button>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-3">
                    <input className="form-control" placeholder="Buscar" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="disponible">Disponibles</option>
                        <option value="porVencer">Por vencer</option>
                        <option value="vencido">Vencidos</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={orden} onChange={e => setOrden(e.target.value)}>
                        <option value="nombre-asc">Nombre A-Z</option>
                        <option value="nombre-desc">Nombre Z-A</option>
                        <option value="precio-asc">Precio ascendente</option>
                        <option value="precio-desc">Precio descendente</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={porPagina} onChange={e => {
                        setPorPagina(Number(e.target.value));
                        setPaginaActual(1);
                    }}>
                        <option value={5}>5 por página</option>
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                    </select>
                </div>
            </div>

            {productosPagina.map((prod) => (
                <ProductoCard key={prod.id} producto={prod} onEdit={(p) => {
                    setProductoEditar(p);
                    setMostrarModal(true);
                }} onDelete={eliminar} />
            ))}

            <div className="d-flex justify-content-center mt-3">
                {[...Array(totalPaginas)].map((_, i) => (
                    <button key={i} className={`btn btn-sm ${paginaActual === i + 1 ? "btn-primary" : "btn-outline-primary"} mx-1`} onClick={() => setPaginaActual(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>

            <ProductoModal
                show={mostrarModal}
                onHide={() => {
                    setMostrarModal(false);
                    setProductoEditar(null);
                }}
                onSave={guardarProducto}
                productoEditar={productoEditar}
            />
        </div>
    );
}