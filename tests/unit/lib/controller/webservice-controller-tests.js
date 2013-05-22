/*
 * Copyright (c) 2012-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('webservice-controller-tests', function (Y, NAME) {

    var path = require('path'),
        arrowRoot = path.join(__dirname, '../../../..'),
        WebServiceController = require(arrowRoot + '/lib/controller/webservice-controller.js'),
        StubDriver = require(arrowRoot + '/tests/unit/stub/driver.js'),
        suite = new Y.Test.Suite(NAME),
        A = Y.Assert;

    suite.add(new Y.Test.Case({
        'test xml output': function () {
            var driver = new StubDriver(),
                self = this,
                executed,
                yc;
            yc = new WebServiceController({}, {}, driver);
            yc.execute(function (errMsg) {
                A.isString(errMsg, 'url has to be defined for webservice-controller');
            });

            // test xml output
            yc = new WebServiceController({}, {url: "http://weather.yahooapis.com/forecastrss?p=94089"}, driver);
            executed = false;
            yc.execute(function (errMsg) {
                self.resume(function () {
                    executed = true;
                });
            });
            self.wait(8000);
            A.isTrue(executed, 'Shall have been executed successfully');
        },

        'test neithor xml nor json output': function () {
            var driver = new StubDriver(),
                self = this,
                executed,
                yc;
            // neither json nor xml
            yc = new WebServiceController({}, {url: "http://www.yahoo.com"}, driver);
            executed = false;
            yc.execute(function (errMsg) {
                self.resume(function () {
                    executed = true;
                    A.isString(errMsg, 'Only json or xml content type is supported');
                });
            });
            self.wait(8000);
            A.isTrue(executed, 'Shall have been executed successfully');
        },

        'test json output': function () {
            var driver = new StubDriver(),
                self = this,
                executed,
                yc;
            // test json output
            yc = new WebServiceController({}, {url: "http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%2248907%22&format=json"}, driver);
            executed = false;
            yc.execute(function (errMsg) {
                self.resume(function () {
                    executed = true;
                });
            });
            self.wait(8000);
            A.isTrue(executed, 'Shall have been executed successfully');
        }
    }));

    Y.Test.Runner.add(suite);
}, '0.0.1', {requires: ['test']});

