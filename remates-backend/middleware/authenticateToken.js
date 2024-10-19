function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401); // Si no hay token, no autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Si hay un error, prohibido
    }
    req.user = user; // Almacenar la información del usuario en la solicitud
    next(); // Pasar al siguiente middleware o ruta
  });
}

module.exports = authenticateToken;
