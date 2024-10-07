const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precioInicial: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  duracion: { type: Date, required: true }, // Fecha y hora de finalización
  ofertas: [{ type: Number }], // Array para las ofertas
  categoria: { type: String, required: true },
  disponibilidad: { type: String, default: 'disponible' } // Por defecto disponible
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;

