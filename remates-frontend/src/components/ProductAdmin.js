export default function ProductAdmin({ product }) {
  return (
    <tr className="border-b hover:bg-neutral-50">
      <td className="flex flex-row items-center gap-4 px-4 py-2">
        <img
          src={product.imagen}
          alt={`Imagen de ${product.nombre}`}
          className="w-24"
        />
        <span>{product.nombre}</span>
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col gap-3">
          <button className="text-red-600 outline outline-none border-none rounded-sm px-2 py-1 hover:bg-red-200 hover:text-red-800 transition">
            Eliminar
          </button>
          <button className="color-boton text-white px-2 py-1 rounded-sm transition">
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
}
