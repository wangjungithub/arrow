/*
 * Like other tests, this is a YUI test module
 *
 */
YUI.add("test-webdriver-tests", function (Y) {

    var suite = new Y.Test.Suite("Title test of the webdriver");
    suite.add(new Y.Test.Case({

        "test title": function() {
            var self = this;
            var webdriver = require('selenium-webdriver');

            var driver = new webdriver.Builder().
                usingServer('http://localhost:4444/wd/hub').
                withCapabilities({'browserName': 'firefox'}).
                build();

            var driver2 = new webdriver.Builder().
                usingServer('http://localhost:4444/wd/hub').
                withCapabilities({'browserName': 'firefox'}).
                build();

            driver.get('http://www.google.com');
            driver.findElement(webdriver.By.name('q')).sendKeys('webdriver dsafsafasfsdafsa');
            driver.findElement(webdriver.By.name('btnK')).click();

            driver.getTitle().then(function(title) {
                self.resume(function () {
                    Y.Assert.areEqual(title, "Google");
                    driver2.get('http://www.facebook.com');
                    driver2.getTitle().then(function(title) {
                        self.resume(function () {
                            Y.Assert.areEqual(title, "Welcome to Facebook - Log In, Sign Up or Learn More");
                            driver2.quit();
                            driver.quit();
                        });
                    });
                    self.wait(9000);
                });
            });
            self.wait(9000);

/*
            driver2.get('http://www.facebook.com');
            driver2.getTitle().then(function(title) {
                self.resume(function () {
                    Y.Assert.areEqual(title, "Not Facebook");
                });
            });
            self.wait(9000);
            driver.quit();
            driver2.quit();
*/
        }
    }));

    //Never "run" the tests, simply add them to the suite. Arrow takes care of running them
    Y.Test.Runner.add(suite);
}, "0.1", {requires:["test"]});

