import { useNavigate } from "react-router-dom";
import endpoints from "../api/endpoints";

export default function ProductAdmin({ product }) {
  // manejar eliminar
  const handleClickDelete = async () => {
    const confirmation = window.confirm(
      "Una vez elimine el producto no podrá recuperarle, ¿Aún así desea eliminarlo?"
    );
    if (!confirmation) return;
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
      <td className="px-4 py-2">
        <div className="flex flex-col gap-3 md:flex-col-reverse">
          <button
            className="text-sm text-red-600 outline outline-none border-none rounded-sm px-2 py-1 hover:bg-red-200 hover:text-red-800 transition"
            onClick={handleClickDelete}
          >
            Eliminar
          </button>
          <button
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