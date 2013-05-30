/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

/*
 * This custom controller is to test using selenium sessions (by multiple webdrivers)
 * so that they can interact with each other inside a Arrow test session.
 *
 * The code is mostly copied from lib/controller/locator.js, it includes all the
 * functionalities in locator controller, so please see locator controller doc 
 * for detail usage.
*/

var util = require("util");
var log4js = require("yahoo-arrow").log4js;
var Controller = require("yahoo-arrow").controller;
var WebDriverManager = require("yahoo-arrow").webdrivermanager;

function SessionGroupController(testConfig, testParams, driver) {
    Controller.call(this, testConfig, testParams, driver);

    this.logger = log4js.getLogger("SessionGroupController");
}

util.inherits(SessionGroupController, Controller);

SessionGroupController.prototype.execute = function (callback) {
    var self = this,
        config = this.testConfig,
        params = this.testParams,
        logger = this.logger,
        webdriver,
        locator,
        strategy,
        target,
        stay,
        waitForElement,
        elem,
        page,
        done;

    try {
        // you can create more webdrivers here
        // WebDriverManager need know selenium host, it is passed down in testParams.seleniumHost
        var seleniumHost = self.testParams.seleniumHost || "http://localhost:4444/wd/hub";
        var webdriver_manager = new WebDriverManager(seleniumHost);

        var webdriver1 = webdriver_manager.createWebDriver({browserName: "chrome"});
        var webdriver2 = webdriver_manager.createWebDriver({browserName: "firefox"});

        // then you can do selenium session interaction here
        // ...
        webdriver1.get(params.page1);
        webdriver2.get(params.page2);

        //do some operation on page A
        //webdriver1.by...click();

        //verify on page B
        self.testParams.test = "../test-title.js";
        self.testParams.title= "Google";
        self.driver.executeTest(self.testConfig, self.testParams, function(error, report) {}, webdriver1);

        //do some operation on page B
        //webdriver2.by...click();

        self.testParams.test = "../test-title.js";
        self.testParams.title= "Welcome to Facebook - Log In, Sign Up or Learn More";
        self.driver.executeTest(self.testConfig, self.testParams, function(error, report) {}, webdriver2);


        setTimeout(function () {
                webdriver1.quit();
                webdriver2.quit();
                callback();
            }, 15000
        );
    } catch (e) {
        self.logger.error(e.toString());
        callback(e);
    }
};

module.exports = SessionGroupController;
