const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  const { width, height } = await page.viewport();
  
  if (width > 800) {
    await page.click('#Inicio_sesion'); // Cambia el selector según tu caso
  } else{
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Inicio_sesion');
    await page.click('#Inicio_sesion');
  }

  await page.waitForSelector('#Modal_inicio_sesion'); // Selector del formulario



  // Encuentra y muestra todos los elementos clicleables
  const clickableElements = await page.evaluate(() => {
    // Obtiene todos los elementos de la página
    const allElements = Array.from(document.querySelectorAll('*'));

    // Filtra los elementos que son clicleables
    const clickable = allElements.filter((element) => {
      const style = window.getComputedStyle(element);
      
      // Verifica si el elemento es visible
      const isVisible = style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      
      // Verifica si está en el viewport
      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                           rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      
      // Verifica si el elemento es interactivo por naturaleza o tiene eventos asignados
      const isNaturallyInteractive = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
      const hasClickEvent = element.onclick !== null || element.hasAttribute('onclick');
      
      return isVisible && isInViewport && (isNaturallyInteractive || hasClickEvent);
    });

    // Devuelve los elementos que son clicleables con su información
    return clickable.map(element => ({
      tag: element.tagName,
      text: element.innerText.trim(),
      id: element.id || null,
      classes: element.className || null
    }));
  });

  // Muestra los elementos clicleables en la consola
  console.log('Elementos clicleables:', clickableElements);

  // await browser.close();
})();
