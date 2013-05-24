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
        driver,
        page,
        done;

    try {

        driver = params["webdriver"];
        if (driver) {
            webdriver = self.driver.createAdditionalWebDriver(driver);
        } else {
            webdriver = self.driver.webdriver;
        }
        if (!webdriver) {
            callback("sessiongroup controller is only supported for the selenium driver");
            return;
        }

        page = params["page"];
        if (page) {
            webdriver.get(page);
            callback();
        }

        done = function() {
            logger.info("done");
            callback();
        };

        target = params["value"];

        strategy = params["using"];

        if (!strategy) {
            strategy = "css";
        }

        stay = params["stay"];
        if (!stay) {
            stay = false;
        }

        waitForElement = params["waitForElement"];

        locator = webdriver.By[strategy](target);
        function findAndAct() {
            if (!target) {
                callback("\"value\" parameter is required");
                return;
            }
            elem = webdriver.findElement(locator);
            logger.info("Finding element: By " + strategy + " (" + target + ")");
            if (true === params["click"]) {
                if (stay) {
                    elem.click().then(done);
                } else if (waitForElement) {
                    elem.click();
                    webdriver.waitForElementPresent(webdriver.By.css(waitForElement)).then(done);
                } else {
                    elem.click();
                    webdriver.waitForNextPage().then(done);
                }
            } else {
                var sendKeys = params["text"];
                if (sendKeys) {
                    elem.clear();
                    elem.sendKeys(sendKeys).then(done);
                } else {
                    done();
                }
            }
        }

        if (true === params["wait"]) {
            webdriver.waitForElementPresent(locator).then(findAndAct);
        } else if (!page) {
            findAndAct();
        }
    } catch (e) {
        self.logger.error(e.toString());
        callback(e);
    }
};

module.exports = SessionGroupController;
