const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rutasProductos = require("./routes/rutasProductos");
const rutasUsuarios = require("./routes/rutasUsuarios");
const rutasAutenticacion = require("./routes/rutasAutenticacion");
const rutasCategorias = require("./routes/rutasCategorias");

require("dotenv").config();

const app = express();
app.use(cookieParser());

// Middleware para manejar JSON
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia esto al origen correcto de tu frontend
    credentials: true, // Permite enviar cookies
  })
);

// URL de MongoDB (reemplaza con tu URI)
const MONGO_URL =
  "mongodb+srv://user:gXK7aAZDV6b3kkIQ@bd-remates.apmvv.mongodb.net/remates-app?retryWrites=true&w=majority&appName=BD-Remates";

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

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
