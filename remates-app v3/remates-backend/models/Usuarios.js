const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    direccion_envio: { type: String, required: true },
    email: { type: String, required: true },
    contrasena: { type: String, required: true },
    administrador: { type: Boolean, required: true },
});
  
const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;