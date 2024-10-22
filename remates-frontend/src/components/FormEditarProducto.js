import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../api/endpoints";

export default function FormEditarProducto({ productId }) {
  // constantes
  const FIELDS_CLASSES = "flex flex-col items-start gap-2";
  const INPUTS_CLASSES = "border border-slate-600 rounded-sm px-2 py-1 w-full";

  // estados
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    imagen: {},
    precioInicial: "",
    duracion: "",
    categoria: "",
  });
  const [categories, setCategories] = useState([]);
  const [invalidInitialValue, setInvalidInitialValue] = useState(false);
  const [invalidAuctionDuration, setInvalidAuctionDuration] = useState(false);
  const [error, setError] = useState(false);
  const [errorByRequired, setErrorByRequired] = useState(false);
  const navigate = useNavigate();

  // resetear producto
  const resetProduct = () =>
    setProduct({
      nombre: "",
      descripcion: "",
      imagen: {},
      precioInicial: "",
      duracion: "",
      categoria: "",
    });

  // manejar el cambio de valor en los inputs de tipo number
  const handleChangeInitialPrice = (e) => {
    setProduct({ ...product, precioInicial: e.target.value });
    if (Number(e.target.value) <= 0) setInvalidInitialValue(true);
    else setInvalidInitialValue(false);
  };

  const handleChangeAuctionDuration = (e) => {
    setProduct({ ...product, duracion: e.target.value });
    if (Number(e.target.value) <= 0) setInvalidAuctionDuration(true);
    else setInvalidAuctionDuration(false);
  };

  // actualizar producto en el backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(product).includes("")) {
      setErrorByRequired(true);
      setTimeout(() => {
        setErrorByRequired(false);
      }, 3000);
      return;
    }
    try {
      await axios.put(`${endpoints.productos}/${productId}`, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/administracion/productos/${productId}/?edited=1`)
    } catch (error) {
      console.log("Ha ocurrido un error al actualizar el producto:", error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  // volver al detalle del producto
  const backToProductDetails = () => {
    resetProduct();
    navigate(`/administracion/productos/${productId}`);
  };

  // cargar datos del producto
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${endpoints.productos}/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  // cargar categorias al select
  const getCategories = async () => {
    try {
      const { data } = await axios.get(endpoints.categorias);
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <form
      className="max-w-max mx-auto px-16 py-8 border rounded space-y-4 shadow-sm"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      {error && (
        <p className="px-4 py-2 bg-red-600 text-white font-bold">
          Error al agregar el producto
        </p>
      )}
      {/* nombre */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="nombre">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ej: Adaptador VGA a HDMI"
          className={INPUTS_CLASSES}
          value={product.nombre}
          onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
        />
      </div>
      {/* descripcion */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="descripcion">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="4"
          placeholder="Ej: Adaptador para cables VGA con salida a HDMI"
          className={INPUTS_CLASSES}
          value={product.descripcion}
          onChange={(e) =>
            setProduct({ ...product, descripcion: e.target.value })
          }
        ></textarea>
      </div>
      {/* imagen */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="image">
          Imagen <span className="font-light">(Opcional)</span>
        </label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept=".png, .jpg, .jpeg"
          className={INPUTS_CLASSES}
          onChange={(e) =>
            setProduct({ ...product, imagen: e.target.files[0] })
          }
        />
        <p className="text-sm font-light">
          De no subir una nueva imagen, se mantendrá la actual
        </p>
      </div>
      {/* valor inicial */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="precioInicial">
          Precio inicial
        </label>
        <input
          type="number"
          id="precioInicial"
          name="precioInicial"
          placeholder="Ej: 12000"
          className={INPUTS_CLASSES}
          value={product.precioInicial}
          onChange={handleChangeInitialPrice}
        />
        {invalidInitialValue && (
          <p className="text-red-600">El valor ingresado no es válido</p>
        )}
      </div>
      {/* duracion del remate */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="duracion">
          Duración del remate <span className="font-light">(En días)</span>
        </label>
        <input
          type="number"
          id="duracion"
          name="duracion"
          placeholder="Ej: 14"
          className={INPUTS_CLASSES}
          value={product.duracion}
          onChange={handleChangeAuctionDuration}
        />
        {invalidAuctionDuration && (
          <p className="text-red-600">El valor ingresado no es válido</p>
        )}
      </div>
      {/* categorias */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="categoria">
          Categoría
        </label>
        <select
          id="categoria"
          htmlFor="categoria"
          className={INPUTS_CLASSES}
          value={product.categoria}
          onChange={(e) =>
            setProduct({ ...product, categoria: e.target.value })
          }
        >
          <option selected disabled>
            Seleccione una categoría
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category.nombre}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      <input
        type="submit"
        value="Actualizar producto"
        className="w-full color-boton text-white px-4 py-2 rounded-sm transition"
      />
      <button
        className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-sm hover:bg-blue-200 hover:text-blue-800 transition"
        onClick={backToProductDetails}
      >
        Volver al detalle
      </button>
      {errorByRequired && (
        <p className="text-red-600">Faltan campos obligatorios</p>
      )}
    </form>
  );
}
