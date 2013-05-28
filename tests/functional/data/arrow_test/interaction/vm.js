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
var fs = require('fs');
var vm = require('vm');

function SessionGroupController(testConfig, testParams, driver) {
    Controller.call(this, testConfig, testParams, driver);

    this.logger = log4js.getLogger("SessionGroupController");
}

util.inherits(SessionGroupController, Controller);

SessionGroupController.prototype.execute = function (callback) {
    var self = this,
        config = this.testConfig,
        params = this.testParams,
        logger = this.logger;

    try {
        // run webdirver JS in node VM module
        var contextForRunInContext = vm.createContext({
            require: require,
            module: require('module'),
            console: console,
            window: {},
            document: {},
            YUI: null
        });
        var file = fs.readFileSync(params.webdriverjs, 'utf8');
        vm.runInContext(file, contextForRunInContext);

        setTimeout(callback, 5000);
    } catch (e) {
        self.logger.error(e.toString());
        callback(e);
    }
};

module.exports = SessionGroupController;
