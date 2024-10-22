const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Función asíncrona principal
(async () => {
  // Inicia el navegador en modo visible (headless: false)
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navega a la página de prueba
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  // Haz clic en el botón de "Registro" usando el selector CSS
  const { width, height } = await page.viewport();

  if (width > 768) {
    await page.click('#Registro'); // Cambia el selector según tu caso
  } else{
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Registro');
    await page.click('#Registro');
  }
  // Espera a que el formulario de registro se cargue
  await page.waitForSelector('#Modal_registro'); // Selector del formulario

  // Rellena los campos del formulario de registro
  await page.type('#Direccion_envio', 'miusuario'); // Selector del campo de nombre de usuario
  await page.type('#Email', 'miemail@example.com'); // Selector del campo de email
  await page.type('#Contrasena', 'micontraseña'); // Selector del campo de contraseña
  await page.type('#TryContrasena', 'micontraseña'); // Selector del campo de contraseña

  // Haz clic en el botón para enviar el formulario
  await page.click('#SubmitRegistrarse'); // Selector del botón de enviar

  // Evaluar si el formulario fue enviado correctamente
  const wasSubmitted = await page.evaluate(() => {
    const form = document.querySelector('#Modal_registro');
    return form && form.dataset.submitted === 'true'; // Asegúrate de que haya un mecanismo para indicar si se envió
  });

  let resultMessage = '';
  if (!wasSubmitted) {
    resultMessage = 'El formulario no se envió correctamente debido a una validación fallida.';
  } else {
    resultMessage = 'El formulario se envió correctamente.';
  }

  // Obtén el nombre del archivo actual
  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  // Escribe el resultado en un archivo de texto
  fs.writeFileSync(outputPath, resultMessage);

  console.log(resultMessage);

  // Cierra el navegador
  // await browser.close();
})();