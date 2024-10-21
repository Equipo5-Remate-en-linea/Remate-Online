import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/ProductoDetalle.css";
import endpoints from "../api/endpoints";

const token = localStorage.getItem("token");
console.log("Token obtenido:", token); 
document.cookie = `token=${token}; path=/;`;

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [precioOfertante, setPrecioOfertante] = useState("");

  useEffect(() => {
    fetch(`${endpoints.productos}/${id}`)
      .then((response) => response.json())
      .then((data) => setProducto(data))
      .catch((error) => console.error("Error al obtener el producto:", error));
  }, [id]);

  const handleOferta = () => {
    // const token = localStorage.getItem("token"); // Obtener el token de localStorage

    fetch(`${endpoints.productos}/${id}/oferta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({ precioOfertante: parseFloat(precioOfertante) }),
    })
      .then((response) => response.json())
      .then((data) => setProducto(data))
      .catch((error) => console.error("Error al hacer la oferta:", error));
  };

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className="producto-detalle-container">
      {/* Información del producto */}
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
    {/* Contenedor separado para ofertas */}
    <div className="ofertas-container">
      <h3>Ofertas actuales</h3>
      {producto.ofertas.length === 0 ? (
        <p>No hay ofertas, ¡¡¡sé el primero en ofertar por el producto!!!</p>
      ) : (
        <ul>
          {producto.ofertas
            .sort((a, b) => b.precioOfertante - a.precioOfertante)
            .map((oferta, index) => (
              <li key={index}>Oferta: ${oferta.precioOfertante}</li>
            ))}
        </ul>
      )}
    </div>
      {/* Contenedor separado para el formulario de oferta */}
    <div className="ofertar-container">
      {producto.disponibilidad === "disponible" ? (
        <div className="ofertar">
          <input
            type="number"
            value={precioOfertante}
            onChange={(e) => setPrecioOfertante(e.target.value)}
            placeholder="Introduce tu oferta"
          />
          <button onClick={handleOferta}>Ofertar</button>
        </div>
      ) : (
        <button disabled className="boton-gris">No disponible para ofertas</button>
      )}
    </div>
    </div>
  );
}

export default ProductoDetalle;
