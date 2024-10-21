const express = require("express");

const router = express.Router();

const Categoria = require("../models/Categoria");

// Obtiene todas las categorias
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

router.get("/", obtenerCategorias);

module.exports = router;
