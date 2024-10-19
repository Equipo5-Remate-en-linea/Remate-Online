const express = require("express");

const router = express.Router();

const Producto = require("../models/Producto");

// Crear producto
const crearProducto = async (req, res) => {
  const { nombre, precioInicial, descripcion, imagen, duracion, categoria } =
    req.body;
  const nuevoProducto = new Producto({
    nombre,
    precioInicial,
    descripcion,
    imagen,
    duracion,
    categoria,
  });
  await nuevoProducto.save();
  res.status(201).send(nuevoProducto);
};

// Obtener productos y filtrar por categoría
const obtenerProductos = async (req, res) => {
  const { categoria } = req.query;
  const filtro = categoria ? { categoria } : {};

  try {
    // Obtener productos con o sin filtro de categoría
    const productos = await Producto.find(filtro);
    const ahora = new Date();

    // Actualizar la disponibilidad de los productos
    productos.forEach(async (producto) => {
      if (
        producto.duracion < ahora &&
        producto.disponibilidad === "disponible"
      ) {
        producto.disponibilidad = "no disponible";
        await producto.save(); // Guardar el cambio en la base de datos
      }
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

router.route("/").post(crearProducto).get(obtenerProductos);
router.route("/:id").get(obtenerProducto).delete(eliminarProducto);

module.exports = router;
