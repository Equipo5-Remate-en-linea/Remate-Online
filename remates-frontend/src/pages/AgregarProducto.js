import FormAgregarProducto from "../components/FormAgregarProducto";

export default function AgregarProducto() {
  return (
    <main className="mx-auto my-8 space-y-">
      <h1 className="text-3xl font-bold">Agregar producto</h1>
      <h2 className="text-base font-normal text-center">
        A continuación, ingrese los datos del nuevo producto
      </h2>
      <FormAgregarProducto />
    </main>
  );
}
