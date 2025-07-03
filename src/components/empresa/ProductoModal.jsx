import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ProductoModal({ show, onHide, onSave, productoEditar }) {
    const [producto, setProducto] = useState({
        nombre: "",
        descripcion: "",
        vencimiento: "",
        cantidad: 1,
        precio: 0,
    });

    useEffect(() => {
        if (productoEditar) setProducto(productoEditar);
        else {
            setProducto({
                nombre: "",
                descripcion: "",
                vencimiento: "",
                cantidad: 1,
                precio: 0,
            });
        }
    }, [productoEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = () => {
        const hoy = new Date().toISOString().split("T")[0];
        const cantidadNum = Number(producto.cantidad);
        const precioNum = Number(producto.precio);

        if (producto.vencimiento < hoy) {
            Swal.fire("❌ Error", "La fecha de vencimiento no puede ser anterior a hoy.", "error");
            return;
        }

        if (isNaN(cantidadNum) || cantidadNum < 1) {
            Swal.fire("❌ Error", "La cantidad debe ser mayor a 0.", "error");
            return;
        }

        if (isNaN(precioNum) || precioNum < 0) {
            Swal.fire("❌ Error", "El precio no puede ser negativo.", "error");
            return;
        }

        const productoFinal = {
            ...producto,
            cantidad: cantidadNum,
            precio: precioNum,
        };

        onSave(productoFinal);
        Swal.fire("✅ Producto guardado", "El producto ha sido registrado correctamente.", "success");
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{productoEditar ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="nombre" value={producto.nombre} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control name="descripcion" value={producto.descripcion} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vencimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="vencimiento"
                            value={producto.vencimiento}
                            onChange={handleChange}
                            required
                            onKeyDown={e => e.preventDefault()} // Bloquea escribir con teclado
                            onPaste={e => e.preventDefault()}   // Bloquea pegar texto
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control type="number" name="cantidad" value={producto.cantidad} onChange={handleChange} min={1} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio</Form.Label>
                        <Form.Control type="number" name="precio" value={producto.precio} onChange={handleChange} min={0} step={100} required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
}
