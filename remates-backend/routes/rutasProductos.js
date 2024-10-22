const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const Producto = require("../models/Producto");

const upload = require("../middleware/createProductMiddleware");

// Crear producto
const crearProducto = async (req, res) => {
  if (!req.file)
    return res.status(400).send({ message: "No hay una imagen subida" });
  const { nombre, precioInicial, descripcion, duracion, categoria } = req.body;
  try {
    const nuevoProducto = new Producto({
      nombre,
      precioInicial,
      descripcion,
      imagen: req.file.filename,
      duracion,
      categoria,
    });
    await nuevoProducto.save();
    res.status(201).send(nuevoProducto);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Ha ocurrido un error al crear el producto" });
  }
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
const eliminarImagen = async (productId) => {
  try {
    const productToDelete = await Producto.findById(productId);
    let filePath = path.join(__dirname, "../images", productToDelete.imagen);
    if (filePath.includes("\\")) filePath = filePath.replace("\\", "/");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return 1; // imagen eliminada
    } else return 0; // imagen no existe
  } catch (error) {
    console.error(error);
    return -1; // error
  }
};
const eliminarProducto = async (req, res) => {
  const productId = req.params.id;
  try {
    const deleteImageFlag = await eliminarImagen(productId);
    if (deleteImageFlag === 1) {
      await Producto.findByIdAndDelete(productId);
      res.status(204).send();
    } else if (deleteImageFlag === 0)
      return res.status(400).send({ message: "La imagen no existe" });
    else
      return res
        .status(500)
        .send({ message: "Ha ocurrido un error al eliminar la imagen" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Ha ocurrido un error al eliminar el producto" });
  }
};

router
  .route("/")
  .post(upload.single("imagen"), crearProducto)
  .get(obtenerProductos);
router.route("/:id").get(obtenerProducto).delete(eliminarProducto);

module.exports = router;
