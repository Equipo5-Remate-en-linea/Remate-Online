import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import endpoints from "../api/endpoints";
import ProductAdmin from "../components/ProductAdmin";

export default function AdministracionProductos() {
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false)
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // redireccionar a agregar
  const handleClick = () => {
    navigate("/administracion/productos/agregar");
  };

  // cargar productos
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

  // setear si se creo un producto
  useEffect(() => {
    if (searchParams.get("added") === '1') {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 3000);
    }
  }, []);
  return (
    <main className="mx-auto my-8">
      <h1 className="text-3xl font-bold">Productos</h1>
      <div className="mx-auto lg:w-2/5 flex flex-col gap-3 items-start">
        {success && (
          <p className="w-full p-2 bg-green-600 text-white font-bold text-center">
            Producto eliminado correctamente
          </p>
        )}
        {error && (
          <p className="w-full p-2 bg-red-600 text-white font-bold text-center">
            Error al eliminar el producto
          </p>
        )}
        {added && (
          <p className="w-full p-2 bg-green-600 text-white font-bold text-center">
            Producto agregado correctamente
          </p>
        )}
        <button
          id="Agregar_producto"
          className="color-boton text-white px-4 py-2 rounded-sm transition"
          onClick={() => handleClick()}
        >
          Agregar producto
        </button>
        <table className="w-full table-auto border-collapse border border-slate-700">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2 text-center">Disponibilidad</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductAdmin
                  key={product._id}
                  products={products}
                  product={product}
                  setSuccess={setSuccess}
                  setError={setError}
                  setProducts={setProducts}
                />
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
