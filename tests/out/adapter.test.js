/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var Path = require('path');
var DebugClient_1 = require('./DebugClient');
suite('Node Debug Adapter', function () {
    var PROJECT_ROOT = Path.join(__dirname, '../../');
    var DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'bin/Release/mono-debug.exe');
    var dc;
    setup(function (done) {
        dc = new DebugClient_1.DebugClient('mono', DEBUG_ADAPTER, 'mono');
        dc.start(done);
    });
    teardown(function (done) {
        dc.stop(done);
    });
    suite('basic', function () {
        test('unknown request should produce error', function (done) {
            dc.send('illegal_request').then(function () {
                done(new Error("does not report error on unknown request"));
            }).catch(function () {
                done();
            });
        });
    });
    suite('initialize', function () {
        test('should produce error for invalid \'pathFormat\'', function (done) {
            dc.initializeRequest({
                adapterID: 'mock',
                linesStartAt1: true,
                columnsStartAt1: true,
                pathFormat: 'url'
            }).then(function (response) {
                done(new Error("does not report error on invalid 'pathFormat' attribute"));
            }).catch(function (err) {
                // error expected
                done();
            });
        });
    });
    suite('launch', function () {
        test('should run program to the end', function () {
            var PROGRAM = Path.join(PROJECT_ROOT, 'tests/data/simple/Program.exe');
            return Promise.all([
                dc.configurationSequence(),
                dc.launch({ program: PROGRAM, externalConsole: false }),
                dc.waitForEvent('terminated')
            ]);
        });
        test('should stop on debugger statement', function () {
            var PROGRAM = Path.join(PROJECT_ROOT, 'tests/data/simple_break/Program.exe');
            var DEBUGGER_LINE = 10;
            return Promise.all([
                dc.configurationSequence(),
                dc.launch({ program: PROGRAM, externalConsole: false }),
                dc.assertStoppedLocation('step', DEBUGGER_LINE)
            ]);
        });
    });
    suite('setBreakpoints', function () {
        var PROGRAM = Path.join(PROJECT_ROOT, 'tests/data/simple/Program.exe');
        var SOURCE = Path.join(PROJECT_ROOT, 'tests/data/simple/Program.cs');
        var BREAKPOINT_LINE = 10;
        test('should stop on a breakpoint', function () {
            return dc.hitBreakpoint({ program: PROGRAM, externalConsole: false }, SOURCE, BREAKPOINT_LINE);
        });
    });
});
//# sourceMappingURL=adapter.test.js.map