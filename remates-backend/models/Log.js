const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  realizadoEn: { type: Date, required: false, default: new Date() },
  descripcion: { type: String, required: true },
});

const Log = mongoose.model("Log", LogSchema);
module.exports = Log;
