const { Builder, By, until, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const jwt = require('jsonwebtoken'); // Para generar el token JWT

// Función para pausar entre acciones
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function agregarProducto() {
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu'); // Ejecutar en modo visible

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

    try {
        await driver.manage().window().maximize();
        await driver.get('http://localhost:3000/');

        // Genera un token JWT válido
        const payload = { userId: '12345', role: 'user' };
        const secretKey = 'clave_secreta'; 
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
    
        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
          }, 10000); // 10000 es el tiempo máximo de espera en milisegundos

        // Clic en "Productos"
        const productosLink = await driver.wait(until.elementLocated(By.id('Administrar_productos')), 10000);
        await sleep(1000); // Espera 1 segundo
        await productosLink.click();

        // Clic en "Agregar producto"
        const agregarProductoButton = await driver.wait(until.elementLocated(By.id('Agregar_producto')), 10000);
        await sleep(1000); // Espera 1 segundo
        await agregarProductoButton.click();

        // Rellenar el formulario de agregar producto
        const nombreProducto = await driver.wait(until.elementLocated(By.id('nombre_producto')), 10000);
        await nombreProducto.clear();
        await nombreProducto.sendKeys('Prueba Selenium');

        const descripcionProducto = await driver.wait(until.elementLocated(By.id('descripcion_producto')), 10000);
        await descripcionProducto.clear();
        await descripcionProducto.sendKeys('Este es un producto nuevo automatizado por Selenium');

        const precioInicial = await driver.wait(until.elementLocated(By.id('precioInicial')), 10000);
        await precioInicial.clear();
        await precioInicial.sendKeys('10000');

        const duracionRemate = await driver.wait(until.elementLocated(By.id('duracion_remate')), 10000);
        await duracionRemate.clear();
        await duracionRemate.sendKeys('10');

        // Seleccionar categoría
        const categoriaDropdown = await driver.wait(until.elementLocated(By.id('categoria_producto')), 10000);
        await sleep(1000); // Espera 1 segundo
        await categoriaDropdown.click();

        const categoriaOpcion = await driver.wait(until.elementLocated(By.css('option[value="Tecnologia"]')), 10000);
        await sleep(1000); // Espera 1 segundo
        await categoriaOpcion.click();

        // Clic en "Agregar producto"
        const submitButton = await driver.wait(until.elementLocated(By.id('submitAgregarProducto')), 10000);
        await sleep(1000); // Espera 1 segundo
        await submitButton.click();

        console.log('Producto agregado exitosamente.');

        // Cerrar sesión
        const cerrarSesionButton = await driver.wait(until.elementLocated(By.id('Cerrar_sesion')), 10000);
        await sleep(1000); // Espera 1 segundo
        await cerrarSesionButton.click();

        console.log('Sesión cerrada exitosamente.');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();
