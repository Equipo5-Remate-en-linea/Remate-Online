const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  
  try{
    let randomNumber = getRandomNumber(0, 3); 
    await page.click('#categoria_'+randomNumber);
    resultMessage1 = 'Categoria seleccionada correctamente';

    try{
      await page.select('#filtro_precio', 'menor-mayor');
      resultMessage2 = 'Filtro aplicado correctamente';
    } catch{
      resultMessage2 = 'Fallo aplicacion filtro';
    }
  } catch{
    resultMessage1 = 'Fallo seleccion de categoria'
  }

  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  fs.writeFileSync(outputPath, resultMessage1);
  fs.appendFileSync(outputPath, '\n');
  fs.appendFileSync(outputPath, resultMessage2);

  console.log(resultMessage1);
  console.log(resultMessage2);

  await browser.close();
})();