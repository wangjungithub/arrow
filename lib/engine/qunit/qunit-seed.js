/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/

/*
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var isCommonJS = typeof window == "undefined" && typeof exports == "object";
var seed = isCommonJS ? require('../interface/engine-seed').containerSeed : window.containerSeed

function qunitSeed(config) {
	this.config = config || {};
	seed.call(this, config);
}

qunitSeed.prototype = Object.create(seed.prototype);

qunitSeed.prototype.generateServerSideSeed = function (cb) {

	QUnit=require('qunit');
	QUnit.init();
	cb();

}
qunitSeed.prototype.generateClientSideSeed = function (cb) {
	this.loadScript("http://code.jquery.com/qunit/qunit-git.js",function(){
		QUnit.init();
		cb();
	})
}

new qunitSeed(ARROW.engineConfig).run();
