/*jslint nomen: true */
/*global require: true, console: true, __dirname: true */
/*
 * Copyright (c) 2012 Yahoo! Inc.  All rights reserved.
 */

YUI.add('mock-child-process-tests', function (Y, NAME) {

    var path = require("path"),
        mocker = require("../../../../../sharelib/lib/server/mock-child-process");

    var testMockChildProcess = new Y.Test.Case({
        name:'child process mocker functionnal Tests',

        // seems like spawn child_process is not supported in travisCI
        "ignore: test mocked child_process.spawn": function () {
            var mockery = require('mockery');
            var mock_child_process = {
               spawn: mocker.spawn
            };

            mocker.set_istanbul_root("../");
            mocker.set_exclude_pattern("**/temp-for*");
            mockery.registerMock('child_process', mock_child_process);
            mockery.enable({
                useCleanCache: true,
                warnOnReplace: false,
                warnOnUnregistered: false
            });

            var spawn = require("child_process").spawn;
            var cp = spawn(__dirname + "/data/child.js", ["--foo"]);
            var executed = false;
            cp.stdout.pipe(process.stdout, {end: false});
            cp.stderr.pipe(process.stderr, {end: false});
            cp.stdin.end();
            cp.on('exit',function(code){
                Y.Assert.isTrue(!code, 'Should get exit code 0 from child process');
                executed = true;
            });

            this.wait(function () {}, 6000);
            Y.Assert.isTrue(executed, 'Should have successfully executed child process');

            var fs = require("fs");
            var path = require('path');
            var existsSync = path.existsSync || fs.existsSync;
            Y.Assert.isTrue(existsSync(__dirname + "/data/temp-for-coverage-child.js"), 'Should have successfully generated new child.js with header injected');
        }
    });

    Y.Test.Runner.add(testMockChildProcess);

}, '0.0.1', {
    requires:['test']
});
