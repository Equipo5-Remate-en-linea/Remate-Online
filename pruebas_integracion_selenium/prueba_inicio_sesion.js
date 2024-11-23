const { Builder, By, Browser } = require('selenium-webdriver');

(async function helloSelenium() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get('http://localhost:3000');
  await driver.quit();

})();

