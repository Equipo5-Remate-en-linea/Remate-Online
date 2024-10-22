const mongoose = require('mongoose');

const ofertaSchema = new mongoose.Schema({
  idCuenta: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  precioOfertante: { type: Number, required: true },
});

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precioInicial: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  duracion: { type: Number, required: true }, // Duración en dias
  expiracion: { type: Date, required: false, default: new Date() },
  ofertas: [ofertaSchema], // Aquí cambiamos la estructura
  categoria: { type: String, required: true },
  disponibilidad: { type: String, default: 'disponible' }, // Aseguramos que el campo exista
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
