import { useParams } from "react-router-dom";
import FormEditarProducto from "../components/FormEditarProducto";

export default function EditarProducto() {
  const { id } = useParams();
  return (
    <main className="mx-auto my-8 space-y-">
      <h1 className="text-3xl font-bold">Editar producto</h1>
      <h2 className="text-base font-normal text-center">
        A continuación, actualice los datos que desee del producto
      </h2>
      <FormEditarProducto productId={id} />
    </main>
  );
}
