const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precioInicial: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  duracion: { type: Number, required: true }, // Duración en dias
  expiracion: { type: Date, required: false, default: new Date() },
  ofertas: [{ type: Number }], // Array para las ofertas
  categoria: { type: String, required: true },
});

const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;
