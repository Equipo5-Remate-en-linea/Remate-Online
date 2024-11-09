const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  errorMessage = false;

  // Navega a la página de prueba
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  const { width, height } = await page.viewport();

  if (width > 800) {
    await page.waitForSelector('#Inicio_sesion');
    await page.click('#Inicio_sesion'); 
  } else{
    await page.waitForSelector('#Menu_hamburguesa');
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Inicio_sesion');
    await page.click('#Inicio_sesion');
  }

  await page.waitForSelector('#Modal_inicio_sesion'); 

  await page.type('#Email', 'sebastian.castrod@usm.cl'); 
  await page.type('#Contrasena', '123456'); 

  await page.click('#SubmitInicioSesion'); 

  await page.waitForSelector('#Modal_inicio_sesion', { hidden: true, timeout: 100000  });

  try{
    await page.waitForSelector('#Administrar_productos',  { visible: true, timeout: 100000 }); 
    await page.click('#Administrar_productos'); 
  
    await page.waitForSelector('#Agregar_producto',{ visible: true, timeout: 100000 }); 
    await page.click('#Agregar_producto');
    
    await page.waitForSelector('#Formulario_agregar',{ visible: true, timeout: 100000 });
  
    await page.waitForSelector('#nombre_producto', { visible: true, timeout: 100000 }); 
    await page.type('#nombre_producto', 'producto de prueba');
    
    await page.waitForSelector('#descripcion_producto', { visible: true, timeout: 100000 }); 
    await page.type('#descripcion_producto', 'descripcion de prueba');
    
    const filePath = 'caja.jpg'; 
    const inputUploadHandle = await page.$('#imagen_producto'); 
    await inputUploadHandle.uploadFile(filePath);
  
    await page.waitForSelector('#precioInicial', { visible: true, timeout: 100000 }); 
    await page.type('#precioInicial', '1000');
  
    await page.waitForSelector('#duracion_remate', { visible: true, timeout: 100000 }); 
    await page.type('#duracion_remate', '2');
  
    await page.waitForSelector('#categoria_producto', { visible: true, timeout: 100000 }); 
    await page.select('#categoria_producto', 'tecnologia');
  
    await page.waitForSelector('#submitAgregarProducto', { visible: true, timeout: 100000 }); 
    await page.click('#submitAgregarProducto');  
    resultMessage1 = 'Producto agregado exitosamente'

  } catch (error) {
     errorMessage = true;
    resultMessage1 = 'Fallo al agregar producto ';
    console.error(resultMessage1); 
}
 
  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  fs.writeFileSync(outputPath, resultMessage1);
  fs.appendFileSync(outputPath, '\n');

  console.log(resultMessage1);

  await browser.close();
  process.exit(errorMessage ? 1 : 0);
})();
