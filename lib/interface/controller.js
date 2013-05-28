/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var log4js = require("log4js");

function Controller(testConfig, testParams, driver) {
    this.logger = log4js.getLogger("Controller");
    this.testConfig = testConfig;
    this.testParams = testParams;
    this.driver = driver;
}

Controller.prototype.setup = function (callback) {
    callback();
};

Controller.prototype.execute = function (callback) {
    this.logger.fatal("Controllers must implement the execute method");
};

Controller.prototype.getWebDriverInstance = function (capability) {
    var wdAppPath = "../../ext-lib/webdriver";
    delete require.cache[require.resolve(wdAppPath)];
    delete require.cache[require.resolve('../../ext-lib/webdriver/promise.js')];
    delete require.cache[require.resolve('../../ext-lib/webdriver/_base.js')];

    var wd = require(wdAppPath);
    var wdHubHost = "http://localhost:4444/wd/hub";
    var driver = new wd.Builder().
        usingServer(wdHubHost).
        usingSession(null).
        withCapabilities(capability).build();

    driver.By = wd.By;

    // Dummy object to ignore uncaught exception at custom controller level
    driver.listener = function () {

    };
    driver.listener.on = function () {
        this.logger.warn("Please stop using uncaught-exception event handler at custom controller, Arrow automatically handles all uncaught-exceptions.");
    };

    return driver;
};

Controller.prototype.tearDown = function (callback) {
    callback();
};

module.exports = Controller;

