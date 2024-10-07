import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import { useEffect, useState } from 'react';
import './Productos.css';
import Categorias from './Categorias';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState(''); // Estado para el filtro de precio
  const [filtroFecha, setFiltroFecha] = useState(''); // Estado para el filtro de fecha

  useEffect(() => {
    // Hacer la solicitud al backend para obtener los productos de la categoría seleccionada
    const url = categoriaSeleccionada 
      ? `http://localhost:5000/productos?categoria=${categoriaSeleccionada}`
      : 'http://localhost:5000/productos';

    fetch(url)
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, [categoriaSeleccionada]);

  // Filtrar productos según precio y fecha
  const filtrarProductos = () => {
    let filtrados = [...productos]; // Copiamos los productos originales

    // Filtrar por precio
    if (filtroPrecio === 'menor-mayor') {
      filtrados.sort((a, b) => a.precioInicial - b.precioInicial);
    } else if (filtroPrecio === 'mayor-menor') {
      filtrados.sort((a, b) => b.precioInicial - a.precioInicial);
    }

    // Filtrar por fecha
    if (filtroFecha === 'mas-reciente') {
      filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (filtroFecha === 'mas-antiguo') {
      filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
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
          <h1>Productos en {categoriaSeleccionada}</h1>
          
          {/* Filtros */}
          <div className="filtros">
            <select onChange={e => setFiltroPrecio(e.target.value)}>
              <option value="">Filtrar por Precio</option>
              <option value="menor-mayor">Precio: Menor a Mayor</option>
              <option value="mayor-menor">Precio: Mayor a Menor</option>
            </select>
            
            <select onChange={e => setFiltroFecha(e.target.value)}>
              <option value="">Filtrar por Fecha</option>
              <option value="mas-reciente">Fecha: Más Reciente</option>
              <option value="mas-antiguo">Fecha: Más Antiguo</option>
            </select>
          </div>

          <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map(producto => (
                <div className="producto-card" key={producto._id}>
                  <div className="producto-imagen">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} />
                    ) : (
                      <div className="placeholder-imagen">Imagen no disponible</div>
                    )}
                  </div>
                  <h2>{producto.nombre}</h2>
                  <p>{producto.descripcion}</p>
                  <p>Disponibilidad: {producto.disponibilidad}</p>
                  <p>Precio inicial: ${producto.precioInicial}</p>

                  {/* Agregamos el enlace para redirigir a la página de detalles del producto */}
                  <Link to={`/producto/${producto._id}`}>
                    <button>Ver detalles</button>
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
