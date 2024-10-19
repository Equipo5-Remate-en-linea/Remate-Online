const verificarToken = (req, res, next) => {
    const token = req.cookies.token; // Accede a la cookie
    console.log(token);

    if (!token) {
        return res.status(403).send('Token no proporcionado');
    }
  
    // Verificar token
    jwt.verify(token.split(' ')[1], 'mi_secreto', (err, decoded) => {
      if (err) {
        return res.status(401).send('Token inválido');
      }
      
      req.userId = decoded.id;  // Guardar el ID del usuario para futuras referencias
      next();                   // Continuar a la siguiente función de la ruta
    });
  };
  
// app.get('/ruta-protegida-1', verificarToken, (req, res) => {
//     res.send('Bienvenido a la ruta protegida 1');
// });

// app.get('/ruta-protegida-2', verificarToken, (req, res) => {
//     res.send('Bienvenido a la ruta protegida 2');
// });
  