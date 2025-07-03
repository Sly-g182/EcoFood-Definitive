import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const obtenerProductos = async (filtros) => {
const ref = collection(db, 'productos');
const snapshot = await getDocs(ref);

let productos = [];

for (let docSnap of snapshot.docs) {
    const prod = docSnap.data();
    prod.id = docSnap.id;

    // Validar estado disponible
    if (prod.estado !== 'disponible') continue;

    // Convertir valores numéricos
    prod.precio = parseFloat(prod.precio);
    prod.cantidad = parseInt(prod.cantidad);

    // Filtro por nombre
    if (
    filtros.nombre &&
    !prod.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
    ) {
    continue;
    }

    // Filtro por estado de producto (gratuito o pago)
    if (filtros.estado === 'gratuito' && prod.precio > 0) continue;
    if (filtros.estado === 'pago' && prod.precio === 0) continue;

    // Filtro por vencimiento
    if (['porVencer', 'vencido'].includes(filtros.estado)) {
    const hoy = new Date();
    const vencimiento = new Date(prod.vencimiento);
      const dias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (filtros.estado === 'porVencer' && (dias > 3 || dias < 0)) continue;
    if (filtros.estado === 'vencido' && dias >= 0) continue;
    }

    // Obtener nombre empresa
    if (prod.empresaId) {
    const empresaRef = doc(db, 'usuarios', prod.empresaId);
    const empresaSnap = await getDoc(empresaRef);
    prod.empresaNombre = empresaSnap.exists() ? empresaSnap.data().nombre : 'Desconocida';
    } else {
    prod.empresaNombre = 'Sin empresa';
    }

    productos.push(prod);
}

  // Ordenar
if (filtros.orden === 'az') {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
} else if (filtros.orden === 'za') {
    productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
} else if (filtros.orden === 'precioAsc') {
    productos.sort((a, b) => a.precio - b.precio);
} else if (filtros.orden === 'precioDesc') {
    productos.sort((a, b) => b.precio - a.precio);
}

return productos.slice(0, filtros.cantidad || 10);
};

