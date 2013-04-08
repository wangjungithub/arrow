/*
 * Copyright (c) 2012-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('engine-jasmine-tests', function (Y, NAME) {

	var jasmine = global.jasmine = {
		getEnv:function(){
			return {
				addReporter:function(item){

				},
				addReporter:function(item){

				},
				execute:function(item){
				}
			}
		},
		ArrowReporter:function(){

		}
	};

	if (!global.ARROW || !global.ARROW.testLibs) {
		global.ARROW = {};
		global.ARROW.onSeeded = function () {
			console.log("seeded");
		}
		global.ARROW.shareLibServerSeed = "server seed";
		global.ARROW.consoleLog = "";
		global.ARROW.testLibs = [__dirname + "/test-data.js"];
		global.ARROW.testfile = __dirname + "/test-data.js";
	}
	if(typeof window !== "undefined") delete window;


	var path = require('path'),
		curDir,
		arrowRoot = path.join(__dirname, '../../../..'),

		suite = new Y.Test.Suite(NAME),
		A = Y.Assert,
		mockery = require("mockery");

	suite.add(new Y.Test.Case({
		'setUp':function () {
			curDir = process.cwd();
			process.chdir(arrowRoot);
			require("module")._cache = {};
			mockery.registerMock('jasmine-node', jasmine);

		},
		'tearDown':function () {
			process.chdir(curDir);
			mockery.deregisterMock('jasmine-node');
		},
		'test new interface seed':function () {
			require(arrowRoot + '/lib/engine/jasmine/jasmine-seed');
		},
		'test new interface runner':function () {
			require(arrowRoot + '/lib/engine/jasmine/jasmine-runner');
		}
	}));

	Y.Test.Runner.add(suite);
}, '0.0.1', {requires:['test']});
