import { useNavigate } from "react-router-dom";
import axios from "axios";
import Disponibilidad from "./Disponibilidad";
import endpoints from "../api/endpoints";

export default function ProductAdmin({
  products,
  product,
  setSuccess,
  setError,
  setProducts,
}) {
  // manejar eliminar
  const updateProducts = () => {
    const updatedProducts = products.filter((p) => p._id !== product._id);
    setProducts(updatedProducts);
  };

  const handleClickDelete = async () => {
    const confirmation = window.confirm(
      "Una vez elimine el producto no podrá recuperarle, ¿Aún así desea eliminarlo?"
    );
    if (!confirmation) return;
    try {
      await axios.delete(`${endpoints.productos}/${product._id}`);
      setSuccess(true);
      updateProducts();
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
  // manejar ver detalles
  const navigate = useNavigate();

  const handleClickViewDetails = () => {
    navigate(`/administracion/productos/${product._id}`);
  };
  return (
    <tr className="border-b hover:bg-neutral-50">
      <td className="flex flex-row items-center gap-4 px-4 py-2">
        <img
          src={`${endpoints.images}/${product.imagen}`}
          alt={`Imagen de ${product.nombre}`}
          className="w-24"
        />
        <span>{product.nombre}</span>
      </td>
      <td>
        <Disponibilidad disponibilidad={product.disponibilidad} center={true} />
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col gap-3 md:flex-col-reverse">
          <button
            id={`${product.nombre.replace(/\s+/g, '_')}_eliminar`}
            className="text-sm text-red-600 outline outline-none border-none rounded-sm px-2 py-1 hover:bg-red-200 hover:text-red-800 transition"
            onClick={handleClickDelete}
          >
            Eliminar
          </button>
          <button
            id={`${product.nombre.replace(/\s+/g, '_')}_detalles`}
            className="text-sm color-boton text-white px-2 py-1 rounded-sm transition"
            onClick={handleClickViewDetails}
          >
            Ver detalles
          </button>
        </div>
      </td>
    </tr>
  );
}
