const express = require("express");
const Log = require("../models/Log");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Crear log
const crearLog = async (req, res) => {
  const { realizadoEn, descripcion } = req.body;
  try {
    const nuevoLog = new Log({ realizadoEn, descripcion });
    await nuevoLog.save();
    res.status(201).send(nuevoLog);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Ha ocurrido un error al registrar el log" });
  }
};

// Obtener logs
const obtenerLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).send(logs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al obtener los logs" });
  }
};

router.route("/").post(crearLog).get(obtenerLogs);
module.exports = router;
