const Log = require("../models/Log");

const obtenerOfertaMasAlta = (objetosOfertas) => {
  let ofertaMasAlta = { precioOfertante: 0 };
  objetosOfertas.forEach((objOferta) => {
    if (objOferta.precioOfertante > ofertaMasAlta.precioOfertante)
      ofertaMasAlta = objOferta;
  });
  return ofertaMasAlta;
};

const formatQuantity = (quantity) =>
  Number(quantity).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });

const addLog = async (descripcion) => {
  const newLog = new Log({ descripcion });
  await newLog.save();
};

module.exports = { obtenerOfertaMasAlta, formatQuantity, addLog };
