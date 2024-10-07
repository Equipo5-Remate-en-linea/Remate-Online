const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cors());


// URL de MongoDB (reemplaza con tu URI)
const MONGO_URL = "mongodb+srv://user:gXK7aAZDV6b3kkIQ@bd-remates.apmvv.mongodb.net/remates-app?retryWrites=true&w=majority&appName=BD-Remates"

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

mongoose.connection.on('error', err => {
    console.error(`Error de conexión a MongoDB: ${err.message}`);
  });
  

// Modelo de Producto
const Producto = require('./models/Producto');

// Ruta base
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Crear producto
app.post('/productos', async (req, res) => {
    const { nombre, precioInicial, descripcion, imagen, duracion, categoria } = req.body;
    const nuevoProducto = new Producto({ nombre, precioInicial, descripcion, imagen, duracion, categoria });
    await nuevoProducto.save();
    res.status(201).send(nuevoProducto);
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
    const productos = await Producto.find();
    res.send(productos);
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Crear un producto de prueba
// Descomentar todo lo de abajo en caso que se quiera agregar algun producto nuevo
//const productoPrueba = new Producto({
//    nombre: '',
//    precioInicial: 0,
//    descripcion: '',
//    duracion: 30,
//    imagen: 'url',
//});

//productoPrueba.save()
//    .then(() => console.log('Producto de prueba agregado'))
//    .catch(err => console.error('Error al agregar producto', err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

