const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  errorMessage = false;

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  const { width, height } = await page.viewport();

  if (width > 800) {
    await page.click('#Registro'); 
  } else{
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Registro');
    await page.click('#Registro');
  }

  await page.waitForSelector('#Modal_registro'); 

  await page.type('#Direccion_envio', 'Calle 123, San joaquin'); 
  await page.type('#Email', 'miemail@example.com');
  await page.type('#Contrasena', 'micontraseña'); 
  await page.type('#TryContrasena', 'micontraseña'); 

  await page.click('#SubmitRegistrarse');

  try{
    await page.waitForSelector('#Modal_registro', { hidden: true, timeout: 5000  });
    resultMessage = 'El formulario se envió correctamente';
  } catch{
    errorMessage = true;
    resultMessage = 'Formulario no se envio correctamente, campo invalido'
  }

  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  fs.writeFileSync(outputPath, resultMessage);

  console.log(resultMessage);

  await browser.close();
  process.exit(errorMessage ? 1 : 0);
})();
