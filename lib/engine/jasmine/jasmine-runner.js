/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/

/*
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var isCommonJS = typeof window == "undefined" && typeof exports == "object";
var runner = isCommonJS ? require('../interface/engine-runner').containerRunner : window.containerRunner

if(!jasmine && window.jasmine)jasmine = window.jasmine;
(function(jasmine, console) {
	if (!jasmine) {
		throw "jasmine library isn't loaded!";
	}

	var ConsoleReporter = function() {
		if (!console || !console.log) { throw "console isn't present!"; }
		this.status = this.statuses.stopped;
	};

	var proto = ConsoleReporter.prototype;
	proto.statuses = {
		stopped : "stopped",
		running : "running",
		fail    : "fail",
		success : "success"
	};

	proto.reportRunnerStarting = function(runner) {
		this.status = this.statuses.running;
		this.start_time = (new Date()).getTime();
		this.executed_specs = 0;
		this.passed_specs = 0;
		this.log("Starting...");
	};

	proto.reportRunnerResults = function(runner) {
		var failed = this.executed_specs - this.passed_specs;
		var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
		var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");
		var color = (failed > 0)? "red" : "green";
		var dur = (new Date()).getTime() - this.start_time;

		this.log("");
		this.log("Finished");
		this.log("-----------------");
		this.log(spec_str + fail_str + (dur/1000) + "s.", color);

		this.status = (failed > 0)? this.statuses.fail : this.statuses.success;

		/* Print something that signals that testing is over so that headless browsers
		 like PhantomJs know when to terminate. */
		this.log("");
		this.log("ConsoleReporter finished");
		var report = {
			"passed": this.passed_specs,
			"failed": failed,
			"total": this.executed_specs,
			"type": "report",
			"name": "jasmine Test Results"
		};
		ARROW.testReport = JSON.stringify(report);
	};


	proto.reportSpecStarting = function(spec) {
		this.executed_specs++;
	};

	proto.reportSpecResults = function(spec) {
		if (spec.results().passed()) {
			this.passed_specs++;
			return;
		}

		var resultText = spec.suite.description + " : " + spec.description;
		this.log(resultText, "red");

		var items = spec.results().getItems()
		for (var i = 0; i < items.length; i++) {
			var trace = items[i].trace.stack || items[i].trace;
			this.log(trace, "red");
		}
	};

	proto.reportSuiteResults = function(suite) {
		if (!suite.parentSuite) { return; }
		var results = suite.results();
		var failed = results.totalCount - results.passedCount;
		var color = (failed > 0)? "red" : "green";
		this.log(suite.getFullName() + ": " + results.passedCount + " of " + results.totalCount + " passed.", color);
	};

	proto.log = function(str, color) {
		console.log(str);
	};

	jasmine.ConsoleReporter = ConsoleReporter;
})(jasmine, console);


function jasmineRunner(config){
	this.config = config  || {}
	runner.call(this,config);
	this.mocharunner = null;
}

// cross-browser?
jasmineRunner.prototype = Object.create(runner.prototype);

jasmineRunner.prototype.setClientSideReporter = function (cb) {
	jasmine = window.jasmine;
	jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
	cb();
};

jasmineRunner.prototype.setServerSideReporter = function (cb) {
	jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
	cb();
};


jasmineRunner.prototype.runRunner = function (cb) {
	jasmine.getEnv().execute();
	cb();
};

jasmineRunner.prototype.collectReport = function (cb) {
  cb();
};

new jasmineRunner(ARROW.engineConfig).run();