import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Disponibilidad from "../components/Disponibilidad";
import endpoints from "../api/endpoints";
import { formatQuantity, displayDate } from "../helpers";

export default function AdministracionProductosDetalle() {
  const [product, setProduct] = useState({});
  const [ofertaMasAlta, setOfertaMasAlta] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [edited, setEdited] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // volver a productos
  const backToProducts = () => navigate("/administracion/productos");

  // pasar a remate
  const passToAuction = async () => {
    try {
      const { data } = await axios.put(`${endpoints.productos}/${id}`, {
        disponibilidad: "disponible",
      });
      setProduct(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  // cargar datos del producto
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${endpoints.productos}/${id}`);
      setProduct(data);
      let ofertaMayor = 0;
      data.ofertas.forEach((oferta) => {
        if (oferta.precioOfertante > ofertaMayor)
          ofertaMayor = oferta.precioOfertante;
      });
      setOfertaMasAlta(ofertaMayor);
    } catch (error) {
      console.error("Ha ocurrido un error al obtener el producto:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  // setear si se edito el producto
  useEffect(() => {
    if (searchParams.get("edited") === '1') {
      setEdited(true);
      setTimeout(() => {
        setEdited(false);
      }, 3000);
    }
  }, []);

  return (
    <main className="max-w-max mx-auto my-8 space-y-4">
      {success && (
        <p className="px-4 py-2 bg-green-600 text-white font-bold">
          El producto ha sido puesto en remate exitosamente
        </p>
      )}
      {error && (
        <p className="px-4 py-2 bg-red-600 text-white font-bold">
          Error al poner en remate el producto
        </p>
      )}
      {edited && (
        <p className="px-4 py-2 bg-green-600 text-white font-bold">
          El producto ha sido actualizado exitosamente
        </p>
      )}
      <section className="max-w-max space-y-4 border px-8 py-4 rounded">
        {/* nombre, categoria, imagen y disponibilidad */}
        <div className="flex flex-col gap-2 max-w-max md:flex-row-reverse md:items-center md:justify-end">
          <div>
            <h1 className="text-3xl font-bold text-left">{product.nombre}</h1>
            <h2 className="text-xl font-semibold text-left text-neutral-500">
              {product.categoria}
            </h2>
            <Disponibilidad
              disponibilidad={product.disponibilidad}
              center={false}
            />
          </div>
          <img
            src={`${endpoints.images}/${product.imagen}`}
            alt={`Imagen de ${product.nombre}`}
            className="w-36"
          />
        </div>
        {/* descripcion */}
        <p className="max-w-2xl">
          <span className="font-semibold">Descripción:</span>{" "}
          <span>{product.descripcion}</span>
        </p>
        {/* precio inicial */}
        <p>
          <span className="font-semibold">Precio inicial:</span>{" "}
          <span>{formatQuantity(product.precioInicial)}</span>
        </p>
        {/* duracion */}
        <p>
          <span className="font-semibold">Duración del remate:</span>{" "}
          <span>{product.duracion} días</span>
        </p>
        {/* botones */}
        {product.disponibilidad === "no disponible" ? (
          <div id='seccion_subastar' className="flex flex-col-reverse gap-3 md:grid md:grid-cols-2">
            <button
              id="rematar_producto"
              className="color-boton text-white px-4 py-2 rounded-sm transition"
              onClick={passToAuction}
            >
              Rematar el producto
            </button>
            <button
              className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-sm hover:bg-blue-200 hover:text-blue-800 transition"
              onClick={() => navigate(`/administracion/productos/editar/${id}`)}
            >
              Editar
            </button>
          </div>
        ) : (
          <>
            {/* fecha de termino */}
            <p>
              <span className="font-semibold">
                Fecha de término del remate:
              </span>{" "}
              <span>{displayDate(product.expiracion)}</span>
            </p>
            {/* fOferta mas alta */}
            <p>
              <span className="font-semibold">Oferta más alta:</span>{" "}
              <span>
                {ofertaMasAlta === 0
                  ? "No se han realizado ofertas por este producto"
                  : formatQuantity(ofertaMasAlta)}
              </span>
            </p>
          </>
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
