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
    
    // Crear el producto con duracion como Date
    const nuevoProducto = new Producto({ 
        nombre, 
        precioInicial, 
        descripcion, 
        imagen, 
        duracion: new Date(duracion),  // Aseguramos que la fecha esté en formato Date
        categoria,
        disponibilidad: 'disponible' // Todos los productos son disponibles al inicio
    });
    
    await nuevoProducto.save();
    res.status(201).send(nuevoProducto);
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

// Obtener productos y filtrar por categoría
app.get('/productos', async (req, res) => {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria } : {};

    try {
        // Obtener productos con o sin filtro de categoría
        const productos = await Producto.find(filtro);
        const ahora = new Date();

        // Actualizar la disponibilidad de los productos
        productos.forEach(async (producto) => {
            if (producto.duracion < ahora && producto.disponibilidad === 'disponible') {
                producto.disponibilidad = 'no disponible';
                await producto.save(); // Guardar el cambio en la base de datos
            }
        });

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


// Obtener un producto por ID
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Modelo de Categoría
const Categoria = require('./models/Categoria');

// Ruta para obtener todas las categorías
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});


