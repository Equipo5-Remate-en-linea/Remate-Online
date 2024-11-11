import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/ProductoDetalle.css";
import endpoints from "../api/endpoints";
import { jwtDecode } from 'jwt-decode';


const token = localStorage.getItem("token");
document.cookie = `token=${token}; path=/;`;



function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [precioOfertante, setPrecioOfertante] = useState("");
  const [error, setError] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);

  const decodedToken = jwtDecode(token);
  const usuarioLogeadoId = decodedToken.id; // El id del usuario
  const emailUsuario = decodedToken.email;  // También puedes obtener el email si lo necesitas
  console.log("ID de usuario logeado:", usuarioLogeadoId);
  console.log("Email del usuario logeado:", emailUsuario);
  

  // Obtener datos del usuario logeado
  useEffect(() => {
    fetch(endpoints.usuarioAdmin, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("es admin?:", data);
        setEsAdmin(data);
      })
      .catch((error) => console.error("Error al obtener datos del usuario:", error));
  }, []);

  useEffect(() => {
    fetch(`${endpoints.productos}/${id}`)
      .then(response => response.json())
      .then(data => setProducto(data))
      .catch(error => console.error("Error al obtener el producto:", error));
  }, [id]);

  const obtenerOfertaMaxima = () => {
    if (producto.ofertas.length === 0) return producto.precioInicial;
    const ofertaMaxima = producto.ofertas[0];
    return ofertaMaxima.precioOfertante;
  };

  const handleOferta = () => {
    const ofertaMaxima = obtenerOfertaMaxima();
    const precio = parseFloat(precioOfertante);

    if (precio <= ofertaMaxima) {
      alert(`El precio a ofertar debe ser mayor a $${ofertaMaxima}`);
      return;
    }

    fetch(`${endpoints.productos}/${id}/oferta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({ precioOfertante: precio }),
    })
      .then(response => response.json())
      .then(data => setProducto(data))
      .catch(error => console.error("Error al hacer la oferta:", error));
  };

  const handleRetirarOferta = () => {
    // Si el usuario no es admin, solo enviamos un correo de retiro de oferta
    if (!esAdmin) {
      alert("Correo de retiro de oferta enviado.");
      return; // Detener la ejecución de la función si no es admin
    }
  
    // Si el usuario es admin, proceder con la eliminación de la oferta
    fetch(`${endpoints.productos}/${id}/retirar-oferta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Asegúrate de que el tipo de contenido sea JSON
      },
      body: JSON.stringify({
        usuarioId: usuarioLogeadoId,  // Aquí pasas el ID del usuario
        esAdmin: esAdmin       // Aquí pasas el rol del usuario
      })
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text); // Si la respuesta no es OK, lanza el error con el texto
          });
        }
        return response.json(); // Si es OK, entonces procesa el JSON
      })
      .then(data => {
        if (data.success) {
          setProducto(data.producto); // Actualizar el producto después de eliminar la oferta
          alert("Oferta mayor retirada exitosamente");
        } else {
          setError(data.error);
        }
      })
      .catch(error => {
        console.error("Error al retirar la oferta:", error);
        alert(error.message); // Muestra el mensaje de error
      });
  };
  

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  const ofertaMaxima = obtenerOfertaMaxima();
  const ofertaMayor = producto.ofertas[0];

  return (
    <div className="producto-detalle-container">
      {/* Información del producto */}
      <div className="producto-imagen">
        <img src={`${endpoints.images}/${producto.imagen}`} />
      </div>
      <div className="producto-info">
        <h1>{producto.nombre}</h1>
        <p>{producto.descripcion}</p>
        <p className="precio-inicial">Precio inicial: ${producto.precioInicial}</p>
        <p>Duración de la oferta: {new Date(producto.expiracion).toLocaleString()}</p>
        <p>Disponibilidad: {producto.disponibilidad}</p>
      </div>

      {/* Contenedor para mostrar la oferta más alta */}
      <div className="ofertas-container">
        <h3>Oferta más alta</h3>
        {ofertaMaxima === producto.precioInicial ? (
          <p>No hay ofertas, ¡sé el primero en ofertar por el producto!</p>
        ) : (
          <p>Oferta más alta: ${ofertaMaxima}</p>
        )}
      </div>

      {/* Contenedor para el formulario de oferta */}
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
        <div className="ofertar-container">
          {/* Mostrar el botón de "Retirar oferta" si es admin */}
          {esAdmin && (
            <button onClick={handleRetirarOferta} className="boton-retirar">
              Retirar oferta
            </button>
          )}
          
          {/* Mostrar el botón de "Retirar mi oferta" si no es admin pero es el ofertante mayor */}
          {!esAdmin && ofertaMayor && ofertaMayor.idCuenta === usuarioLogeadoId && (
            <button onClick={handleRetirarOferta} className="boton-retirar">
              Retirar mi oferta
            </button>
          )}
      </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default ProductoDetalle;
