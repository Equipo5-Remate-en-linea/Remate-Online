// librerias
const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
// models
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuarios");
const Log = require("../models/Log");
// middlewares
const authenticateToken = require("../middleware/authenticateToken");
const upload = require("../middleware/createProductMiddleware");
// funciones
const { formatQuantity, addLog } = require("../helpers");

const router = express.Router();

// Configuración del transporte
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "r1nc0nd3l0lv1d0@gmail.com", //correo electrónico
    pass: "urno wlrt mieh hqif",
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

function generarMensajeRetirarOferta(nombre_producto) {
  return `
  Estimado Administrador,

  Un usuario ha solicitado que se retire su oferta para el producto ${nombre_producto}

  ...
  `;
}

function retirarOfertaMensaje(nombre_producto) {
  return `
  Estimado Usuario,

  se ha retirado su oferta para el producto ${nombre_producto} exitosamente, le invitamos a participar en otros productos.
  
  El equipo.
  ...
  `;
}

function obtenerMail(email, nombre_producto) {
  const msg_registro = generarMensajeOfertaMisteriosa(nombre_producto);
  return {
    from: "r1nc0nd3l0lv1d0@gmail.com",
    to: email,
    subject: "Notificación Registro de Cuenta",
    text: msg_registro,
  };
}

function obtenerMail2(email, nombre_producto) {
  const msg_registro = retirarOfertaMensaje(nombre_producto);
  return {
    from: "r1nc0nd3l0lv1d0@gmail.com",
    to: email,
    subject: "Notificación Registro de Cuenta",
    text: msg_registro,
  };
}

// Función para enviar correo
function enviarCorreo(email, nombre_producto) {
  let mail = obtenerMail(email, nombre_producto);

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
}

// Función para enviar correo
function enviarCorreo2(email, nombre_producto) {
  let mail = obtenerMail(email, nombre_producto);

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
}

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
    addLog(`Se ha creado el producto: ${nombre}.`);
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
        producto.expiracion < ahora &&
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

// actualizar
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Producto.findById(id);
    if (!product)
      return res.status(400).send({ message: "El producto no existe" });
    const camposActualizados = [];
    if (req.body.nombre) {
      product.nombre = req.body.nombre;
      camposActualizados.push("nombre");
    }
    if (req.body.descripcion) {
      product.descripcion = req.body.descripcion;
      camposActualizados.push("descripcion");
    }
    if (req.body.precioInicial) {
      product.precioInicial = req.body.precioInicial;
      camposActualizados.push("precio inicial");
    }
    if (req.body.duracion) {
      product.duracion = req.body.duracion;
      camposActualizados.push("duracion");
    }
    if (req.body.categoria) {
      product.categoria = req.body.categoria;
      camposActualizados.push("categoria");
    }
    if (req.body.disponibilidad === "disponible") {
      product.disponibilidad = req.body.disponibilidad;
      const diaExpiracion = new Date();
      diaExpiracion.setDate(diaExpiracion.getDate() - 1 + product.duracion);
      product.expiracion = diaExpiracion;
      camposActualizados.push("disponibilidad");
    }

    if (req.file) {
      const deleteImageFlag = await eliminarImagen(id);
      if (deleteImageFlag >= 0) {
        product.imagen = req.file.filename;
        camposActualizados.push("imagen");
      } else
        return res.status(500).send({
          message: "Ha ocurrido un error al eliminar la imagen antigua",
        });
    }
    await product.save();
    let descripcion = "";
    const totalCamposActualizados = camposActualizados.length;
    if (totalCamposActualizados === 1)
      descripcion += `Se ha actualizado el campo ${camposActualizados[0]} del producto: ${product.nombre}.`;
    else if (totalCamposActualizados > 1) {
      descripcion += "Se han actualiado los campos ";
      for (let i = 0; i < totalCamposActualizados; i++) {
        if (i < totalCamposActualizados - 2)
          descripcion += `${camposActualizados[i]}, `;
        else if (i == totalCamposActualizados - 2)
          descripcion += `${camposActualizados[i]} y `;
        else descripcion += camposActualizados[i] + " ";
      }
      descripcion += `del producto: ${product.nombre}.`;
    }
    addLog(descripcion);
    res.status(200).send(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Ha ocurrido un error al actualizar el producto" });
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
      const product = await Producto.findById(productId);
      await Producto.findByIdAndDelete(productId);
      addLog(`Se ha eliminado el producto: ${product.nombre}.`);
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

// Agregar oferta
const agregarOferta = async (req, res) => {
  try {
    const { id } = req.params; // ID del producto
    const { precioOfertante } = req.body; // Precio de la oferta
    const idCuenta = req.user.id; // ID del usuario (obtenido del token)

    const producto = await Producto.findById(id);
    const usuario = await Usuario.findById(idCuenta);

    if (!producto || producto.disponibilidad !== "disponible") {
      return res
        .status(400)
        .send("El producto no está disponible para ofertas");
    }

    const nombreProducto = producto.nombre;
    const email = usuario.email;

    enviarCorreo(email, nombreProducto);

    // Agregar la nueva oferta
    producto.ofertas.push({ idCuenta, precioOfertante });
    // Ordenar las ofertas de mayor a menor
    producto.ofertas.sort((a, b) => b.precioOfertante - a.precioOfertante);

    await producto.save();
    const descripcion = `El usuario con email "${email}" ha hecho una puja de ${formatQuantity(
      precioOfertante
    )} por el producto: ${producto.nombre}.`;
    const newLog = new Log({ descripcion });
    await newLog.save();
    res.status(200).send(producto);
  } catch (error) {
    res.status(500).send("Error al agregar la oferta");
  }
};

const RetirarOferta = async (req, res) => {
  const productoId = req.params.id;

  // En lugar de usar req.user, vamos a obtener el id y el rol del usuario directamente de algún lugar
  // Por ejemplo, si lo estás pasando como parámetros o en el body de la solicitud.
  const usuarioId = req.body.usuarioId; // Suponiendo que pasas el ID de usuario en el body
  const esAdmin = req.body.esAdmin; // Suponiendo que pasas el rol admin en el body
  const email = req.body.email;

  try {
    const producto = await Producto.findById(productoId);
    if (esAdmin) {
      // Si es admin, eliminamos la oferta mayor
      producto.ofertas.shift(); // Eliminar la oferta mayor
      await producto.save();
      addLog(
        `El administrador con email "${email}" ha retirado la última puja del producto: ${producto.nombre}.`
      );
      return res.json({ success: "Oferta eliminada exitosamente", producto });
    } else {
      // Si no es admin, solo enviar correo
      const nombreProducto = producto.nombre;
      enviarCorreoRetirarOferta("correo_usuario@ejemplo.com", nombreProducto); // Cambiar a correo del usuario
      addLog(
        `El usuario con email "${email}" ha solicitado retirar su oferta por el producto: ${producto.nombre}.`
      );
      return res.json({ success: "Correo de retiro de oferta enviado" });
    }
  } catch (error) {
    console.error("Error al procesar la retirada de oferta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

router.post("/:id/oferta", authenticateToken, agregarOferta);
router.post("/:id/retirar-oferta", RetirarOferta);
router
  .route("/")
  .post(upload.single("imagen"), crearProducto)
  .get(obtenerProductos);
router
  .route("/:id")
  .get(obtenerProducto)
  .put(upload.single("imagen"), actualizarProducto)
  .delete(eliminarProducto);
module.exports = router;
