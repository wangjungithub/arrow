/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/

/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/**
 * this is interface for container seed
 * users can extend other test container/engine if implement this interface
 */

var isCommonJS = typeof window == "undefined" && typeof exports == "object";

function containerSeed(config) {
	this.config = config || {}
	if (!ARROW)ARROW = {};
}

containerSeed.prototype.captureConsoleMessages = function () {

	try {
		if (console) {
			//Making sure we dont redefine console methods
			if (!console.oldLog) {

				//capturing console log
				console.oldLog = console.log;
				console.log = function (line) {
					ARROW.consoleLog += "[LOG] " + line + "\n";
					console.oldLog(line);
				};

				//capturing console info
				console.oldInfo = console.info;
				console.info = function (line) {
					ARROW.consoleLog += "[INFO] " + line + "\n";
					console.oldInfo(line);
				};

				//capturing console warn
				console.oldWarn = console.warn;
				console.warn = function (line) {
					ARROW.consoleLog += "[WARN] " + line + "\n";
					console.oldWarn(line);
				};

				//capturing console debug
				console.oldDebug = console.debug;
				console.debug = function (line) {
					ARROW.consoleLog += "[DEBUG] " + line + "\n";
					console.oldDebug(line);
				};

				//capturing console debug
				console.oldError = console.error;
				console.error = function (line) {
					ARROW.consoleLog += "[ERROR] " + line + "\n";
					console.oldError(line);
				};
			}
		}
	} catch (e) {

	}
}

containerSeed.prototype.loadScript = function (url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";

	if (script.readyState) { // IE
		script.onreadystatechange = function () {
			if (("loaded" === script.readyState) || ("complete" === script.readyState)) {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else { // Others
		script.onload = function () {
			callback();
		};
	}
	script.src = url;
	document.body.appendChild(script);
}

containerSeed.prototype.generateServerSideSeed = function (callback) {
	if (console)console.error("generate Server Side Seed must be implemented by engines");
	callback();
};

containerSeed.prototype.generateClientSideSeed = function (callback) {
	if (console)console.error("generate Client Side Seed must be implemented by engines");
	callback();
};


containerSeed.prototype.run = function () {
	var self = this;
	if (isCommonJS) {
		//server side default we will give a yui seed
		YUI = require("yui").YUI;
		if (ARROW.shareLibServerSeed !== undefined) {
			try {
				require(ARROW.shareLibServerSeed);
			} catch (e) {
				if (console) {
					console.error("share lib server side seed cannot be injected");
				}
			}
		}

		self.generateServerSideSeed(function () {
				ARROW.onSeeded();
			}
		);

	} else {
		// client side seed;
		ARROW.consoleLog = "";
		self.captureConsoleMessages();

		function onyuiready() {
			self.generateClientSideSeed(function () {
					ARROW.onSeeded();
				}
			);
		}

		self.loadScript(ARROW.appSeed, onyuiready);
	}
};
if (isCommonJS) {
	module.exports.containerSeed = containerSeed;
} else {
	window.containerSeed = containerSeed
}