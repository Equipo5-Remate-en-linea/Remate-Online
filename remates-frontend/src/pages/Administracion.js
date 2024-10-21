import { useState, useEffect } from "react";
import axios from "axios";
import endpoints from "../api/endpoints";
import ProductAdmin from "../components/ProductAdmin";

export default function Administracion() {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(endpoints.productos);
      setProducts(data);
    } catch (error) {
      console.error("Ha ocurrido un error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <main className="mx-auto my-8">
      <h1 className="text-3xl font-bold">Productos</h1>
      <div className="mx-auto lg:w-2/5 flex flex-col gap-3 items-start">
          <button className="color-boton text-white px-4 py-2 rounded-sm transition">
            Agregar producto
          </button>
        <table className="w-full table-auto border-collapse border border-slate-700">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductAdmin key={product._id} product={product} />
              ))
            ) : (
              <tr>
                <td>No hay productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
