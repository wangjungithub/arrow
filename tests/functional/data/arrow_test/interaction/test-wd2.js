/*
 * Like other tests, this is a YUI test module
 *
 */
YUI.add("test-webdriver-tests", function (Y) {

    var suite = new Y.Test.Suite("Title test of the webdriver");
    suite.add(new Y.Test.Case({

        "test title": function() {
            var self = this;
            var controller = require("yahoo-arrow").controller;
            var arrow_driver = new controller(null, null, null);

            var driver = arrow_driver.getWebDriverInstance({browserName: "firefox"});
            var driver2 = arrow_driver.getWebDriverInstance({browserName: "firefox"});

            driver.get('http://www.google.com');
            driver.findElement(driver.By.name('q')).sendKeys('webdriver dsafsafasfsdafsa');
            driver.findElement(driver.By.name('btnK')).click();

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

