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
        page,
        done;

    try {

        var webdriver_builtin  = self.driver.webdriver;

        if (!webdriver_builtin) {
            callback("sessiongroup controller is only supported for the selenium driver");
            return;
        }

        // you can create more webdrivers here
        var webdriver_ext_one = self.driver.createAdditionalWebDriver("one");
        var webdriver_ext_two = self.driver.createAdditionalWebDriver("two");

        // then you can do selenium session interaction here
        // ...
        webdriver_ext_one.get(params.page1);
        webdriver_ext_two.get(params.page2);

        callback();
    } catch (e) {
        self.logger.error(e.toString());
        callback(e);
    }
};

module.exports = SessionGroupController;
