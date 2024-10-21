import { useEffect, useState } from "react";
import "../assets/Categorias.css"; // Crearás este archivo CSS más adelante
import endpoints from "../api/endpoints";

function Categorias({ onCategoriaSeleccionada }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Obtener las categorías del backend
    fetch(endpoints.categorias)
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  return (
    <div className="categorias-container">
      <h1>Selecciona una Categoría</h1>
      <div className="categorias-grid">
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <div
              key={categoria._id}
              className="categoria-card"
              onClick={() => onCategoriaSeleccionada(categoria.nombre)}
            >
              <img src={categoria.imagen} alt={categoria.nombre} />
              <h2>{categoria.nombre}</h2>
            </div>
          ))
        ) : (
          <p>No hay categorías disponibles</p>
        )}
      </div>
    </div>
  );
}

export default Categorias;
