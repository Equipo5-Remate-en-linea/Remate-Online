const express = require("express");

const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuarios");

const nodemailer = require('nodemailer');

// Configuración del transporte
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'r1nc0nd3l0lv1d0@gmail.com', // Tu correo electrónico
      pass: 'urno wlrt mieh hqif',      // Tu contraseña o un App Password si tienes 2FA activado
  },
});

function generarMensajeOfertaMisteriosa(nombre_producto) {
  return `
  Estimado/a,

  Tu oferta por el producto ${nombre_producto} ha sido recibida. A partir de ahora, te has unido a una pugna única y reservada para unos pocos.

  El juego ha comenzado. Lo que ocurra de aquí en adelante está en tus manos. No pierdas de vista tu objetivo, y recuerda que las verdaderas oportunidades no esperan.

  Mantente en guardia. Solo aquellos que saben actuar en el momento adecuado se llevan el premio.

  No respondas a este mensaje.

  El equipo.
  `;
}
function obtenerMail(email, nombre_producto) {
  const msg_registro = generarMensajeOfertaMisteriosa(nombre_producto);
  return {
      from: 'r1nc0nd3l0lv1d0@gmail.com',
      to: email,
      subject: 'Notificación Registro de Cuenta',
      text: msg_registro,
  };
}

// Función para enviar correo
function enviarCorreo(email, nombre_producto) {
  let mail = obtenerMail(email, nombre_producto);

  transporter.sendMail(mail, function(error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Correo enviado: ' + info.response);
      }
  });
}
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

// Agregar oferta
const agregarOferta = async (req, res) => {
  try {
    const { id } = req.params; // ID del producto
    const { precioOfertante } = req.body; // Precio de la oferta
    const idCuenta = req.user.id; // ID del usuario (obtenido del token)

    const producto = await Producto.findById(id);
    const usuario = await Usuario.findById(idCuenta);

    if (!producto || producto.disponibilidad !== "disponible") {
      return res.status(400).send("El producto no está disponible para ofertas");
    }

    const nombreProducto = producto.nombre;
    const email = usuario.email;
    
    enviarCorreo(email, nombreProducto);

    // Agregar la nueva oferta
    producto.ofertas.push({ idCuenta, precioOfertante });
    // Ordenar las ofertas de mayor a menor
    producto.ofertas.sort((a, b) => b.precioOfertante - a.precioOfertante);

    await producto.save();
    res.status(200).send(producto);
  } catch (error) {
    res.status(500).send("Error al agregar la oferta");
  }
};

router.route("/").post(crearProducto).get(obtenerProductos);
router.route("/:id").get(obtenerProducto).delete(eliminarProducto);
router.post("/:id/oferta", authenticateToken, agregarOferta);
module.exports = router;