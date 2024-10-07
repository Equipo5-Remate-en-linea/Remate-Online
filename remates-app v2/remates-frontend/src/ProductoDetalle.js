import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID del producto desde la URL
import './ProductoDetalle.css'; // Asegúrate de importar el CSS

function ProductoDetalle() {
  const { id } = useParams(); // Obtener el ID de la URL
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    // Hacer la solicitud al backend para obtener el producto por su ID
    fetch(`http://localhost:5000/productos/${id}`)
      .then(response => response.json())
      .then(data => setProducto(data))
      .catch(error => console.error('Error al obtener el producto:', error));
  }, [id]);

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className="producto-detalle-container">
      <div className="producto-imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>
      <div className="producto-info">
        <h1>{producto.nombre}</h1>
        <p>{producto.descripcion}</p>
        <p className="precio-inicial">Precio inicial: ${producto.precioInicial}</p>
        <p>Duración de la oferta: {new Date(producto.duracion).toLocaleString()}</p>
        <p>Disponibilidad: {producto.disponibilidad}</p>
      </div>
    </div>
  );
}

export default ProductoDetalle;
