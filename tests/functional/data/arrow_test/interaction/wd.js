var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
   usingServer('http://localhost:4444/wd/hub').
   withCapabilities({'browserName': 'firefox'}).
   build();

driver.get('http://www.google.com');
driver.findElement(webdriver.By.name('q')).sendKeys('webdriver dsafsafasfsdafsa');
driver.findElement(webdriver.By.name('btnK')).click();
/*
driver.wait(function() {
 return driver.getTitle().then(function(title) {
   return title === 'webdriver dsafndsaofdsafafsa - Google Search';
 });
}, 3000);
*/

console.log("Done");
driver.quit();
