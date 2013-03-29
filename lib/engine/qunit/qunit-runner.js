/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/

/*
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var isCommonJS = typeof window == "undefined" && typeof exports == "object";
var runner = isCommonJS ? require('../interface/engine-runner').containerRunner : window.containerRunner

var current_test_assertions = [],
	module = "default",
	report = {
		"passed":0,
		"failed":0,
		"total":0,
		"type":"report",
		"name":"QUnit Test Results",
		"default":{
			"passed":0,
			"failed":0,
			"total":0,
			"type":"testsuite",
			"name":"default"
		}
	};

function qunitRunner(config) {
	this.config = config || {}
	runner.call(this, config);
	this.mocharunner = null;
}

// cross-browser?
qunitRunner.prototype = Object.create(runner.prototype);

qunitRunner.prototype.setClientSideReporter = function (cb) {
	cb();
};

qunitRunner.prototype.setServerSideReporter = function (cb) {
	cb();
};

qunitRunner.prototype.runRunner = function (cb) {

	QUnit.moduleStart(function (context) {
		module = context.name;
		report[module] = {
			"passed":0,
			"failed":0,
			"total":0,
			"type":"testsuite",
			"name":module
		};
	});

	QUnit.testDone(function (result) {
		var name = module + ': ' + result.name,
			i,
			message;

		if (result.failed) {
			console.log('Assertion Failed: ' + name);

			message = "";
			for (i = 0; i < current_test_assertions.length; i += 1) {
				message += current_test_assertions[i] + " ";
			}
			console.log(message);

			report["failed"] += 1;
			report[module]["failed"] += 1;

			report[module][result.name] = {
				"result":"fail",
				"name":result.name,
				"type":"test",
				"message":message
			};
		} else {
			report["passed"] += 1;
			report[module]["passed"] += 1;

			report[module][result.name] = {
				"result":"pass",
				"name":result.name,
				"type":"test",
				"message":"Test passed."
			};
		}

		report["total"] += 1;
		report[module]["total"] += 1;
		current_test_assertions = [];
	});

	QUnit.log(function (details) {
		var response;

		if (details.result) {
			return;
		}

		response = details.message || '';

		if (typeof details.expected !== 'undefined') {
			if (response) {
				response += ', ';
			}

			response += 'expected: ' + details.expected + ', but was: ' + details.actual;
		}

		current_test_assertions.push('Failed assertion: ' + response);
	});

	QUnit.testParams = ARROW.testParams;
	QUnit.start();
	cb();
};


qunitRunner.prototype.collectReport = function (cb) {

	QUnit.done(function (result) {
		console.log('Took ' + result.runtime + 'ms to run ' + result.total + ' tests. ' + result.passed + ' passed, ' + result.failed + ' failed.');
		cb(report);
	});

};

new qunitRunner(ARROW.engineConfig).run();