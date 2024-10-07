const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  imagen: { type: String, required: true } // URL de la imagen para la categoría
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;
