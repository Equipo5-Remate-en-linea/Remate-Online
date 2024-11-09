// Importaciones necesarias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const os = require('os');
const hostname = os.hostname();

const rutasProductos = require("./routes/rutasProductos");
const rutasUsuarios = require("./routes/rutasUsuarios");
const rutasAutenticacion = require("./routes/rutasAutenticacion");
const rutasCategorias = require("./routes/rutasCategorias");
const cron = require('node-cron'); // Importa node-cron
const nodemailer = require('nodemailer'); // Importa nodemailer
const Producto = require('./models/Producto'); // Modelo Producto
const Usuario = require('./models/Usuarios'); // Modelo Usuario

require("dotenv").config();
process.env.JWT_SECRET = '28db21e0c0fecaed120721e08e31903227ffa82c78fb4db5a6a70ff20499e8d124bfb313d5fae52f2175868a2e2dffc3efb8631c21cf986ed0826354329e63c5da3ec9885f9b05991a8ec547d38c909483e343911e0ee2fe2d890688005c3434aabe75e93c84b71733d4878671c67b244bfd8d6257b467662c4771f4a6e678feb9d068ca0f54faf0a0bab061a05037fdee3b0e909c2c15191fbcab3802906ebe46d3865e597eb45aa74b7f5086bcd0c3db1d5d3f863a9b79b02bffcf5e702fb45fb4ac84c2c6512c63c49a7ec682a68d2fb843685b29df0bfc13cceb8e614dc94805311369a8d38ae753f27444a371b98a7624e7dad020e8045cf2eac93517af'
const app = express();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
app.use(cookieParser());

// Middleware para manejar JSON
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:7000",
      "http://168.61.72.242:3000", 
    ],
    credentials: true,
  })
);

// URL de MongoDB (reemplaza con tu URI)
const MONGO_URL = "mongodb+srv://user:gXK7aAZDV6b3kkIQ@bd-remates.apmvv.mongodb.net/remates-app?retryWrites=true&w=majority&appName=BD-Remates";

// Conexión a MongoDB usando async/await
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    console.log("BD CONECTADA en", conn.connection.host);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

// Llamamos a la función para conectarnos a la base de datos
connectDB();

mongoose.connection.on("error", (err) => {
  console.error(`Error de conexión a MongoDB: ${err.message}`);
});

// Ruta base
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

// Rutas
app.use("/productos", rutasProductos);
app.use("/usuarios", rutasUsuarios);
app.use("/auth", rutasAutenticacion);
app.use("/categorias", rutasCategorias);
app.use("/images", express.static("images"));

// Configuración de nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'r1nc0nd3l0lv1d0@gmail.com', 
      pass: 'urno wlrt mieh hqif',
  },
});

// Función para enviar correo al ganador
function enviarCorreoGanador(email, producto) {
  const mensaje = `
    Estimado/a,

    ¡Felicidades! Has ganado la subasta del producto ${producto.nombre} con tu oferta más alta.

    Nos pondremos en contacto contigo para gestionar el envío.

    Saludos,
    El equipo de rincon del Olvido.
  `;

  let mail = {
    from: 'r1nc0nd3l0lv1d0@gmail.com',
    to: email,
    subject: 'Has ganado el remate',
    text: mensaje,
  };

  transporter.sendMail(mail, function(error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Correo enviado a: ' + email + "con el producto: " + producto.nombre);
      }
  });
}

// Tarea programada que corre cada minuto para revisar expiraciones
cron.schedule('* * * * *', async () => {
  const now = new Date();
  try {
    // Encuentra productos cuya expiración haya pasado
    const productosExpirados = await Producto.find({
      expiracion: { $lt: now },
      disponibilidad: 'disponible'
    });

    productosExpirados.forEach(async (producto) => {
      // Verifica si hay ofertas
      if (producto.ofertas.length > 0) {
        // Ordena las ofertas y obtiene la más alta
        const ofertaGanadora = producto.ofertas.sort((a, b) => b.precioOfertante - a.precioOfertante)[0];

        if (ofertaGanadora) {
          // Busca el usuario ganador en la base de datos
          const usuarioGanador = await Usuario.findById(ofertaGanadora.idCuenta);

          if (usuarioGanador) {
            // Envía el correo de notificación
            await enviarCorreoGanador(usuarioGanador.email, producto);
          }
        }
      }
      // Cambia el estado del producto para que no siga disponible
      producto.disponibilidad = 'no disponible';
      await producto.save();
    });
  } catch (error) {
    console.error('Error al procesar las expiraciones:', error);
  }
});

// Puerto
const PORT = (hostname === '168.61.72.242' ? 5000 : 6000);
app.listen(PORT,'0.0.0.0',() => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
