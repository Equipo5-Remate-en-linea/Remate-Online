const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
