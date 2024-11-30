const { Builder, By, until, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const jwt = require('jsonwebtoken'); // Para generar el token JWT

// Función para pausar entre acciones
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function rematarProducto() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--disable-gpu'); // Ejecutar en modo visible

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
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
    await emailInput.sendKeys('diego.morella20@gmail.com'); // Ingresa el correo

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

    await driver.wait(
      async () => {
        const readyState = await driver.executeScript('return document.readyState');
        return readyState === 'complete';
      },
      10000 // 10000 es el tiempo máximo de espera en milisegundos
    );

    // Clic en "Productos"
    const productosLink = await driver.wait(
      until.elementLocated(By.id('Administrar_productos')),
      10000
    );
    await sleep(1000); // Espera 1 segundo
    await productosLink.click();

    // Clic en un producto específico (Funko Pop Tanjiro Kamado)
    const productoDetalles = await driver.wait(
      until.elementLocated(By.id('Funko_pop_Tanjiro_Kamado_detalles')),
      10000
    );
    await sleep(1000); // Espera 1 segundo
    await productoDetalles.click();

    // Clic en el botón "Rematar el producto"
    const rematarButton = await driver.wait(
      until.elementLocated(By.id('rematar_producto')),
      10000
    );
    await sleep(1000); // Espera 1 segundo
    await rematarButton.click();

    console.log('Producto rematado exitosamente.');

    // Cierra sesión
    let cerrarSesionButton = await driver.wait(
      until.elementLocated(By.id('Cerrar_sesion')),
      10000
    );
    await sleep(1000); // Espera 1 segundo
    await cerrarSesionButton.click();

    console.log('Sesión cerrada exitosamente.');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  } finally {
    // Finaliza la ejecución y cierra el navegador
    await driver.quit();
  }
})();
