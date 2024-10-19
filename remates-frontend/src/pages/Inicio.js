import { useEffect, useState } from 'react';
import '../assets/Productos.css'; // Importar el archivo de estilos CSS


function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Hacer la solicitud al backend para obtener los productos
    fetch('http://localhost:5000/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  return (
    <div className="productos-container">
      <h1>Productos en Remate</h1>
      <div className='margen-container'>
        <div className="productos-grid">
          {productos.length > 0 ? (
            productos.map(producto => (
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
                <p>Precio inicial: ${producto.precioInicial}</p>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Productos;
