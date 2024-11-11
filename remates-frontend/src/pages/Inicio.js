import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Categorias from "../components/Categorias";
import endpoints from "../api/endpoints";
import "../assets/Productos.css";
import '../assets/inicio_sesion.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(endpoints.productos)
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener los productos:", error));
  }, []);

  const filtrarProductos = () => {
    let filtrados = [...productos];

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );
    }

    // Filtrar por precio
    if (filtroPrecio === "menor-mayor") {
      filtrados.sort((a, b) => a.precioInicial - b.precioInicial);
    } else if (filtroPrecio === "mayor-menor") {
      filtrados.sort((a, b) => b.precioInicial - a.precioInicial);
    }

    // Filtrar por fecha
    if (filtroFecha === "mas-reciente") {
      filtrados.sort((a, b) => new Date(b.expiracion) - new Date(a.expiracion));
    } else if (filtroFecha === "mas-antiguo") {
      filtrados.sort((a, b) => new Date(a.expiracion) - new Date(b.expiracion));
    }

    // Filtrar por búsqueda de nombre
    if (busqueda) {
      filtrados = filtrados.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return filtrados;
  };

  const productosFiltrados = filtrarProductos();

  return (
    <div className="productos-container">

      <div className="filtros">
        <input
          id="filtro_nombre"
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />

        <select
          id="filtro_categoria"
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          value={categoriaSeleccionada}
        >
          <option value="">Filtrar por Categoría</option>
          <option value="Tecnologia">Tecnología</option>
          <option value="Ropa">Ropa</option>
          <option value="Figuras">Figuras</option>
          <option value="Libros">Libros</option>
        </select>

        <select id="filtro_precio" onChange={(e) => setFiltroPrecio(e.target.value)}>
          <option value="">Filtrar por Precio</option>
          <option value="menor-mayor">Precio: Menor a Mayor</option>
          <option value="mayor-menor">Precio: Mayor a Menor</option>
        </select>

        <select id="filtro_fecha" onChange={(e) => setFiltroFecha(e.target.value)}>
          <option value="">Filtrar por Fecha de expiración</option>
          <option value="mas-antiguo">Fecha: Más Antiguo</option>
          <option value="mas-reciente">Fecha: Más Reciente</option>
        </select>
      </div>

      <div className="productos-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto, index) => (
            <div className="producto-card" key={producto._id}>
              <div className="producto-imagen">
                {producto.imagen ? (
                  <img src={`${endpoints.images}/${producto.imagen}`} />
                ) : (
                  <div className="placeholder-imagen">Imagen no disponible</div>
                )}
              </div>
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p>Precio inicial: ${producto.precioInicial}</p>
              <p>Estado: {producto.disponibilidad}</p>
              <Link to={`/producto/${producto._id}`}>
                <button
                  id={`producto_${index}`}
                  className="px-4 py-2 text-white mt-4 rounded-sm color-boton transition"
                >
                  Ver detalles
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
}

export default Productos;
