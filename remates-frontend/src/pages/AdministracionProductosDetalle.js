import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../api/endpoints";
import { formatQuantity } from "../helpers";

export default function AdministracionProductosDetalle() {
  const [product, setProduct] = useState({});

  // volver a productos
  const navigate = useNavigate();

  const backToProducts = () => navigate("/administracion/productos");

  // cargar datos del producto
  const { id } = useParams();

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${endpoints.productos}/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Ha ocurrido un error al obtener el producto:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <main className="max-w-max mx-auto my-8 space-y-4">
      <section className="max-w-max space-y-4 border px-8 py-4 rounded">
        {/* nombre, categoria e imagen */}
        <div className="flex flex-col gap-2 max-w-max md:flex-row-reverse md:items-center md:justify-end">
          <div>
            <h1 className="text-3xl font-bold text-left">{product.nombre}</h1>
            <h2 className="text-xl font-semibold text-left">
              Categoría: {product.categoria}
            </h2>
          </div>
          <img
            src={`${endpoints.images}/${product.imagen}`}
            alt={`Imagen de ${product.nombre}`}
            className="w-36"
          />
        </div>
        {/* descripcion */}
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          <span>{product.descripcion}</span>
        </p>
        {/* precio inicial */}
        <p>
          <span className="font-semibold">Precio inicial:</span>{" "}
          <span>{formatQuantity(product.precioInicial)}</span>
        </p>
        {/* disponibilidad */}
        <p>
          <span className="font-semibold">Disponibilidad:</span>{" "}
          <span>{product.disponibilidad}</span>
        </p>
        {/* botones */}
        {product.disponibilidad === "no disponible" && (
          <div className="flex flex-col gap-3 md:flex-col-reverse">
            <button className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-sm hover:bg-blue-200 hover:text-blue-800 transition">
              Editar
            </button>
            <button className="color-boton text-white px-4 py-2 rounded-sm transition">
              Rematar el producto
            </button>
          </div>
        )}
      </section>
      <button
        className="text-sm w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-sm hover:bg-gray-200 hover:text-gray-800 transition"
        onClick={backToProducts}
      >
        Volver a Productos
      </button>
    </main>
  );
}
