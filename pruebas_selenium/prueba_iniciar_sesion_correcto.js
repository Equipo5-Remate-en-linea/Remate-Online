const { Builder, By, until } = require('selenium-webdriver');
const jwt = require('jsonwebtoken'); // Para generar el token JWT

(async function enterOffer() {
  let driver = await env
  .builder()
  .setChromeOptions(options.addArguments('--headless=new'))
  .build();

  try {
    await driver.manage().window().maximize();
    await driver.get('http://localhost:3000/');

    // Genera un token JWT válido
    const payload = { userId: '12345', role: 'user' }; // Ajusta los datos según tu backend
    const secretKey = 'clave_secreta'; // Usa la clave secreta que utiliza tu backend
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Genera el token

    console.log('Token generado:', token);

    // Guarda el token en localStorage
    await driver.executeScript(`localStorage.setItem("token", "${token}");`);

    // Refresca la página para que la aplicación lea el token
    await driver.navigate().refresh();

    let buttonCerrarSesion = await driver.wait(
        until.elementLocated(By.id('Cerrar_sesion')),
        10000 // Tiempo máximo de espera en milisegundos
      );
    await buttonCerrarSesion.click();

    // Realiza el proceso de login (si aplica)
    let button = await driver.wait(
      until.elementLocated(By.id('Inicio_sesion')),
      10000 // Tiempo máximo de espera en milisegundos
    );
    await button.click();

    // Interactúa con el campo de email
    let emailInput = await driver.wait(
      until.elementLocated(By.id('Email')), // Selecciona por id
      10000 // Tiempo máximo de espera
    );
    await emailInput.clear();
    await emailInput.sendKeys('diego.moyano@usm.cl'); // Ingresa el correo

    // Interactúa con el campo de contraseña
    let passInput = await driver.wait(
      until.elementLocated(By.id('Contrasena')), // Selecciona por id
      10000 // Tiempo máximo de espera
    );
    await passInput.clear();
    await passInput.sendKeys('123456'); // Ingresa la contraseña

    // Haz clic en el botón para enviar el formulario de inicio de sesión
    let LogIngButton = await driver.wait(
      until.elementLocated(By.id('SubmitInicioSesion')), // Selecciona por id
      10000
    );
    await LogIngButton.click();
    await driver.sleep(2000); // Pausa para observar el resultado
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    // Cierra el navegador
    await driver.quit();
  }
})();