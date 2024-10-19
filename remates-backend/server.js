const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(cookieParser());

// Middleware para manejar JSON
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto al origen correcto de tu frontend
    credentials: true // Permite enviar cookies
}));


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
const Usuario = require('./models/Usuarios');

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

// Crear usuario
app.post('/usuarios', async (req, res) => {
    const { direccion_envio, email, contrasena, administrador } = req.body;

    const salt = await bcrypt.genSalt(10); // Genera un "salt"
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({direccion_envio, email, contrasena: contrasenaEncriptada, administrador: false });
    await nuevoUsuario.save();
    res.status(201).send(nuevoUsuario);
});

app.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    
    // Buscar al usuario por su email
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
        return res.json({ estado: false, problema: 'Usuario' });
        // return res.status(400).send('Usuario no encontrado');
    }
    
    // Comparar la contraseña ingresada con la contraseña encriptada
    const esCoincidente = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!esCoincidente) {
        return res.json({ estado: false, problema: 'Contrasena' });
        // return res.status(400).send('Contraseña incorrecta');
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, direccion_envio: usuario.direccion_envio },     
        jwtSecret,                          // Clave secreta para firmar el token
        { expiresIn: '24h' }                  
    );
    
    try{
        return res.json({ estado: true, problema: '', token: token });
    } catch (error) {
        console.error('Error al establecer la cookie:', error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Eliminar producto
app.delete('/usuarios/:id', async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.sendStatus(401); // Si no hay token, no autorizado
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Si hay un error, prohibido
        }
        req.user = user; // Almacenar la información del usuario en la solicitud
        next(); // Pasar al siguiente middleware o ruta
    });
}

app.get('/usuario_administrador', authenticateToken, async (req, res) => {
    try {
        // Buscar el usuario en la base de datos usando su email
        const usuario = await Usuario.findOne({ email: req.user.email });
        
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        return res.send(usuario.administrador);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
});

app.get('/all_usuarios', authenticateToken,async (req, res) => {
    try {
      const usuarios = await Usuario.find(); // Busca todos los usuarios
      res.json(usuarios); // Devuelve los usuarios en formato JSON
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
  });

  app.put('/actualizar_usuario/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Busca el usuario por su ID
        const usuario = await Usuario.findById(id);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Intercambiar el estado de administrador
        usuario.administrador = !usuario.administrador;

        // Guarda los cambios en la base de datos
        await usuario.save();

        // res.json(usuarioActualizado); // Devuelve el usuario actualizado
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
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

