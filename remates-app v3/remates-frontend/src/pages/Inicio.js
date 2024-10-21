import { Link } from "react-router-dom"; // Importamos Link para la navegación
import { useEffect, useState } from "react";
import Categorias from "../components/Categorias";
import endpoints from "../api/endpoints";
import "../assets/Productos.css"; // Importar el archivo de estilos CSS
import '../assets/inicio_sesion.css'

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState(""); // Estado para el filtro de precio
  const [filtroFecha, setFiltroFecha] = useState(""); // Estado para el filtro de fecha
  const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda por nombre

  useEffect(() => {
    // Hacer la solicitud al backend para obtener los productos de la categoría seleccionada
    const url = categoriaSeleccionada
      ? `${endpoints.productos}?categoria=${categoriaSeleccionada}`
      : endpoints.productos;

    fetch(url)
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) =>
        console.error("Error al obtener los productos:", error)
      );
  }, [categoriaSeleccionada]);

  // Filtrar productos según precio, fecha y búsqueda por nombre
  const filtrarProductos = () => {
    let filtrados = [...productos]; // Copiamos los productos originales

    // Filtrar por precio
    if (filtroPrecio === "menor-mayor") {
      filtrados.sort((a, b) => a.precioInicial - b.precioInicial);
    } else if (filtroPrecio === "mayor-menor") {
      filtrados.sort((a, b) => b.precioInicial - a.precioInicial);
    }

    // Filtrar por fecha
    if (filtroFecha === "mas-reciente") {
      filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (filtroFecha === "mas-antiguo") {
      filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
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
      {!categoriaSeleccionada ? (
        <Categorias onCategoriaSeleccionada={setCategoriaSeleccionada} />
      ) : (
        <>
          <div className="filtros">
            {/* Input de búsqueda por nombre */}
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="buscador"
            />

            <select onChange={(e) => setFiltroPrecio(e.target.value)}>
              <option value="">Filtrar por Precio</option>
              <option value="menor-mayor">Precio: Menor a Mayor</option>
              <option value="mayor-menor">Precio: Mayor a Menor</option>
            </select>

            <select onChange={(e) => setFiltroFecha(e.target.value)}>
              <option value="">Filtrar por Fecha</option>
              <option value="mas-reciente">Fecha: Más Reciente</option>
              <option value="mas-antiguo">Fecha: Más Antiguo</option>
            </select>
          </div>

          <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div className="producto-card" key={producto._id}>
                  <div className="producto-imagen">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} />
                    ) : (
                      <div className="placeholder-imagen">
                        Imagen no disponible
                      </div>
                    )}
                  </div>
                  <h2>{producto.nombre}</h2>
                  <p>{producto.descripcion}</p>
                  <p>Precio inicial: ${producto.precioInicial}</p>
                  <Link to={`/producto/${producto._id}`}>
                    <button className="px-4 py-2 text-white mt-4 rounded-sm color-boton transition">Ver detalles</button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No hay productos disponibles</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Productos;
