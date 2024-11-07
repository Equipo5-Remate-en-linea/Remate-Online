const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');


(async () => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  errorMessage = false;

  page.once('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept(); 
   });


  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  const { width, height } = await page.viewport();

  if (width > 800) {
    await page.click('#Inicio_sesion'); 
  } else{
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Inicio_sesion');
    await page.click('#Inicio_sesion');
  }

  await page.waitForSelector('#Modal_inicio_sesion'); 

  await page.type('#Email', 'sebastian.castrod@usm.cl'); 
  await page.type('#Contrasena', '123456'); 

  await page.click('#SubmitInicioSesion'); 

  await page.waitForSelector('#Modal_inicio_sesion', { hidden: true, timeout: 5000  });

  try{
    await page.waitForSelector('#Administrar_productos',  { visible: true, timeout: 5000 }); 
    await page.click('#Administrar_productos');
  
    await page.waitForSelector('#producto_de_prueba_eliminar', { visible: true, timeout: 5000 }); 
    await page.click('#producto_de_prueba_eliminar');  

    resultMessage1 = 'Producto eliminado exitosamente'
  } catch{
    errorMessage = true;
    resultMessage1 = 'Fallo al eliminar producto'
  }

  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  fs.writeFileSync(outputPath, resultMessage1);

  console.log(resultMessage1);

  await browser.close();
  process.exit(errorMessage ? 1 : 0);
})();
