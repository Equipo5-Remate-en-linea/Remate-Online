const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const Usuario = require("../models/Usuarios");

const login = async (req, res) => {
  const { email, contrasena } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  // Buscar al usuario por su email
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res.json({ estado: false, problema: "Usuario" });
    // return res.status(400).send('Usuario no encontrado');
  }

  // Comparar la contraseña ingresada con la contraseña encriptada
  const esCoincidente = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!esCoincidente) {
    return res.json({ estado: false, problema: "Contrasena" });
    // return res.status(400).send('Contraseña incorrecta');
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      direccion_envio: usuario.direccion_envio,
    },
    jwtSecret, // Clave secreta para firmar el token
    { expiresIn: "24h" }
  );

  try {
    return res.json({ estado: true, problema: "", token: token });
  } catch (error) {
    console.error("Error al establecer la cookie:", error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

router.post("/login", login);

module.exports = router;
