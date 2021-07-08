(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    /**
     * Array#filter.
     *
     * @param {Array} arr
     * @param {Function} fn
     * @param {Object=} self
     * @return {Array}
     * @throw TypeError
     */
    
    module.exports = function (arr, fn, self) {
      if (arr.filter) return arr.filter(fn, self);
      if (void 0 === arr || null === arr) throw new TypeError;
      if ('function' != typeof fn) throw new TypeError;
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        if (!hasOwn.call(arr, i)) continue;
        var val = arr[i];
        if (fn.call(self, val, i, arr)) ret.push(val);
      }
      return ret;
    };
    
    var hasOwn = Object.prototype.hasOwnProperty;
    
    },{}],2:[function(require,module,exports){
    (function (global){(function (){
    'use strict';
    
    var objectAssign = require('object-assign');
    
    // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
    // original notice:
    
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    function compare(a, b) {
      if (a === b) {
        return 0;
      }
    
      var x = a.length;
      var y = b.length;
    
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
    
      if (x < y) {
        return -1;
      }
      if (y < x) {
        return 1;
      }
      return 0;
    }
    function isBuffer(b) {
      if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
        return global.Buffer.isBuffer(b);
      }
      return !!(b != null && b._isBuffer);
    }
    
    // based on node assert, original notice:
    // NB: The URL to the CommonJS spec is kept just for tradition.
    //     node-assert has evolved a lot since then, both in API and behavior.
    
    // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
    //
    // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
    //
    // Originally from narwhal.js (http://narwhaljs.org)
    // Copyright (c) 2009 Thomas Robinson <280north.com>
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the 'Software'), to
    // deal in the Software without restriction, including without limitation the
    // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    // sell copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in
    // all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    var util = require('util/');
    var hasOwn = Object.prototype.hasOwnProperty;
    var pSlice = Array.prototype.slice;
    var functionsHaveNames = (function () {
      return function foo() {}.name === 'foo';
    }());
    function pToString (obj) {
      return Object.prototype.toString.call(obj);
    }
    function isView(arrbuf) {
      if (isBuffer(arrbuf)) {
        return false;
      }
      if (typeof global.ArrayBuffer !== 'function') {
        return false;
      }
      if (typeof ArrayBuffer.isView === 'function') {
        return ArrayBuffer.isView(arrbuf);
      }
      if (!arrbuf) {
        return false;
      }
      if (arrbuf instanceof DataView) {
        return true;
      }
      if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
        return true;
      }
      return false;
    }
    // 1. The assert module provides functions that throw
    // AssertionError's when particular conditions are not met. The
    // assert module must conform to the following interface.
    
    var assert = module.exports = ok;
    
    // 2. The AssertionError is defined in assert.
    // new assert.AssertionError({ message: message,
    //                             actual: actual,
    //                             expected: expected })
    
    var regex = /\s*function\s+([^\(\s]*)\s*/;
    // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
    function getName(func) {
      if (!util.isFunction(func)) {
        return;
      }
      if (functionsHaveNames) {
        return func.name;
      }
      var str = func.toString();
      var match = str.match(regex);
      return match && match[1];
    }
    assert.AssertionError = function AssertionError(options) {
      this.name = 'AssertionError';
      this.actual = options.actual;
      this.expected = options.expected;
      this.operator = options.operator;
      if (options.message) {
        this.message = options.message;
        this.generatedMessage = false;
      } else {
        this.message = getMessage(this);
        this.generatedMessage = true;
      }
      var stackStartFunction = options.stackStartFunction || fail;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackStartFunction);
      } else {
        // non v8 browsers so we can have a stacktrace
        var err = new Error();
        if (err.stack) {
          var out = err.stack;
    
          // try to strip useless frames
          var fn_name = getName(stackStartFunction);
          var idx = out.indexOf('\n' + fn_name);
          if (idx >= 0) {
            // once we have located the function frame
            // we need to strip out everything before it (and its line)
            var next_line = out.indexOf('\n', idx + 1);
            out = out.substring(next_line + 1);
          }
    
          this.stack = out;
        }
      }
    };
    
    // assert.AssertionError instanceof Error
    util.inherits(assert.AssertionError, Error);
    
    function truncate(s, n) {
      if (typeof s === 'string') {
        return s.length < n ? s : s.slice(0, n);
      } else {
        return s;
      }
    }
    function inspect(something) {
      if (functionsHaveNames || !util.isFunction(something)) {
        return util.inspect(something);
      }
      var rawname = getName(something);
      var name = rawname ? ': ' + rawname : '';
      return '[Function' +  name + ']';
    }
    function getMessage(self) {
      return truncate(inspect(self.actual), 128) + ' ' +
             self.operator + ' ' +
             truncate(inspect(self.expected), 128);
    }
    
    // At present only the three keys mentioned above are used and
    // understood by the spec. Implementations or sub modules can pass
    // other keys to the AssertionError's constructor - they will be
    // ignored.
    
    // 3. All of the following functions must throw an AssertionError
    // when a corresponding condition is not met, with a message that
    // may be undefined if not provided.  All assertion methods provide
    // both the actual and expected values to the assertion error for
    // display purposes.
    
    function fail(actual, expected, message, operator, stackStartFunction) {
      throw new assert.AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
      });
    }
    
    // EXTENSION! allows for well behaved errors defined elsewhere.
    assert.fail = fail;
    
    // 4. Pure assertion tests whether a value is truthy, as determined
    // by !!guard.
    // assert.ok(guard, message_opt);
    // This statement is equivalent to assert.equal(true, !!guard,
    // message_opt);. To test strictly for the value true, use
    // assert.strictEqual(true, guard, message_opt);.
    
    function ok(value, message) {
      if (!value) fail(value, true, message, '==', assert.ok);
    }
    assert.ok = ok;
    
    // 5. The equality assertion tests shallow, coercive equality with
    // ==.
    // assert.equal(actual, expected, message_opt);
    
    assert.equal = function equal(actual, expected, message) {
      if (actual != expected) fail(actual, expected, message, '==', assert.equal);
    };
    
    // 6. The non-equality assertion tests for whether two objects are not equal
    // with != assert.notEqual(actual, expected, message_opt);
    
    assert.notEqual = function notEqual(actual, expected, message) {
      if (actual == expected) {
        fail(actual, expected, message, '!=', assert.notEqual);
      }
    };
    
    // 7. The equivalence assertion tests a deep equality relation.
    // assert.deepEqual(actual, expected, message_opt);
    
    assert.deepEqual = function deepEqual(actual, expected, message) {
      if (!_deepEqual(actual, expected, false)) {
        fail(actual, expected, message, 'deepEqual', assert.deepEqual);
      }
    };
    
    assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
      if (!_deepEqual(actual, expected, true)) {
        fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
      }
    };
    
    function _deepEqual(actual, expected, strict, memos) {
      // 7.1. All identical values are equivalent, as determined by ===.
      if (actual === expected) {
        return true;
      } else if (isBuffer(actual) && isBuffer(expected)) {
        return compare(actual, expected) === 0;
    
      // 7.2. If the expected value is a Date object, the actual value is
      // equivalent if it is also a Date object that refers to the same time.
      } else if (util.isDate(actual) && util.isDate(expected)) {
        return actual.getTime() === expected.getTime();
    
      // 7.3 If the expected value is a RegExp object, the actual value is
      // equivalent if it is also a RegExp object with the same source and
      // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
      } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
        return actual.source === expected.source &&
               actual.global === expected.global &&
               actual.multiline === expected.multiline &&
               actual.lastIndex === expected.lastIndex &&
               actual.ignoreCase === expected.ignoreCase;
    
      // 7.4. Other pairs that do not both pass typeof value == 'object',
      // equivalence is determined by ==.
      } else if ((actual === null || typeof actual !== 'object') &&
                 (expected === null || typeof expected !== 'object')) {
        return strict ? actual === expected : actual == expected;
    
      // If both values are instances of typed arrays, wrap their underlying
      // ArrayBuffers in a Buffer each to increase performance
      // This optimization requires the arrays to have the same type as checked by
      // Object.prototype.toString (aka pToString). Never perform binary
      // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
      // bit patterns are not identical.
      } else if (isView(actual) && isView(expected) &&
                 pToString(actual) === pToString(expected) &&
                 !(actual instanceof Float32Array ||
                   actual instanceof Float64Array)) {
        return compare(new Uint8Array(actual.buffer),
                       new Uint8Array(expected.buffer)) === 0;
    
      // 7.5 For all other Object pairs, including Array objects, equivalence is
      // determined by having the same number of owned properties (as verified
      // with Object.prototype.hasOwnProperty.call), the same set of keys
      // (although not necessarily the same order), equivalent values for every
      // corresponding key, and an identical 'prototype' property. Note: this
      // accounts for both named and indexed properties on Arrays.
      } else if (isBuffer(actual) !== isBuffer(expected)) {
        return false;
      } else {
        memos = memos || {actual: [], expected: []};
    
        var actualIndex = memos.actual.indexOf(actual);
        if (actualIndex !== -1) {
          if (actualIndex === memos.expected.indexOf(expected)) {
            return true;
          }
        }
    
        memos.actual.push(actual);
        memos.expected.push(expected);
    
        return objEquiv(actual, expected, strict, memos);
      }
    }
    
    function isArguments(object) {
      return Object.prototype.toString.call(object) == '[object Arguments]';
    }
    
    function objEquiv(a, b, strict, actualVisitedObjects) {
      if (a === null || a === undefined || b === null || b === undefined)
        return false;
      // if one is a primitive, the other must be same
      if (util.isPrimitive(a) || util.isPrimitive(b))
        return a === b;
      if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
        return false;
      var aIsArgs = isArguments(a);
      var bIsArgs = isArguments(b);
      if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
        return false;
      if (aIsArgs) {
        a = pSlice.call(a);
        b = pSlice.call(b);
        return _deepEqual(a, b, strict);
      }
      var ka = objectKeys(a);
      var kb = objectKeys(b);
      var key, i;
      // having the same number of owned properties (keys incorporates
      // hasOwnProperty)
      if (ka.length !== kb.length)
        return false;
      //the same set of keys (although not necessarily the same order),
      ka.sort();
      kb.sort();
      //~~~cheap key test
      for (i = ka.length - 1; i >= 0; i--) {
        if (ka[i] !== kb[i])
          return false;
      }
      //equivalent values for every corresponding key, and
      //~~~possibly expensive deep test
      for (i = ka.length - 1; i >= 0; i--) {
        key = ka[i];
        if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
          return false;
      }
      return true;
    }
    
    // 8. The non-equivalence assertion tests for any deep inequality.
    // assert.notDeepEqual(actual, expected, message_opt);
    
    assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
      if (_deepEqual(actual, expected, false)) {
        fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
      }
    };
    
    assert.notDeepStrictEqual = notDeepStrictEqual;
    function notDeepStrictEqual(actual, expected, message) {
      if (_deepEqual(actual, expected, true)) {
        fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
      }
    }
    
    
    // 9. The strict equality assertion tests strict equality, as determined by ===.
    // assert.strictEqual(actual, expected, message_opt);
    
    assert.strictEqual = function strictEqual(actual, expected, message) {
      if (actual !== expected) {
        fail(actual, expected, message, '===', assert.strictEqual);
      }
    };
    
    // 10. The strict non-equality assertion tests for strict inequality, as
    // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
    
    assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
      if (actual === expected) {
        fail(actual, expected, message, '!==', assert.notStrictEqual);
      }
    };
    
    function expectedException(actual, expected) {
      if (!actual || !expected) {
        return false;
      }
    
      if (Object.prototype.toString.call(expected) == '[object RegExp]') {
        return expected.test(actual);
      }
    
      try {
        if (actual instanceof expected) {
          return true;
        }
      } catch (e) {
        // Ignore.  The instanceof check doesn't work for arrow functions.
      }
    
      if (Error.isPrototypeOf(expected)) {
        return false;
      }
    
      return expected.call({}, actual) === true;
    }
    
    function _tryBlock(block) {
      var error;
      try {
        block();
      } catch (e) {
        error = e;
      }
      return error;
    }
    
    function _throws(shouldThrow, block, expected, message) {
      var actual;
    
      if (typeof block !== 'function') {
        throw new TypeError('"block" argument must be a function');
      }
    
      if (typeof expected === 'string') {
        message = expected;
        expected = null;
      }
    
      actual = _tryBlock(block);
    
      message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
                (message ? ' ' + message : '.');
    
      if (shouldThrow && !actual) {
        fail(actual, expected, 'Missing expected exception' + message);
      }
    
      var userProvidedMessage = typeof message === 'string';
      var isUnwantedException = !shouldThrow && util.isError(actual);
      var isUnexpectedException = !shouldThrow && actual && !expected;
    
      if ((isUnwantedException &&
          userProvidedMessage &&
          expectedException(actual, expected)) ||
          isUnexpectedException) {
        fail(actual, expected, 'Got unwanted exception' + message);
      }
    
      if ((shouldThrow && actual && expected &&
          !expectedException(actual, expected)) || (!shouldThrow && actual)) {
        throw actual;
      }
    }
    
    // 11. Expected to throw an error:
    // assert.throws(block, Error_opt, message_opt);
    
    assert.throws = function(block, /*optional*/error, /*optional*/message) {
      _throws(true, block, error, message);
    };
    
    // EXTENSION! This is annoying to write outside this module.
    assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
      _throws(false, block, error, message);
    };
    
    assert.ifError = function(err) { if (err) throw err; };
    
    // Expose a strict only variant of assert
    function strict(value, message) {
      if (!value) fail(value, true, message, '==', strict);
    }
    assert.strict = objectAssign(strict, assert, {
      equal: assert.strictEqual,
      deepEqual: assert.deepStrictEqual,
      notEqual: assert.notStrictEqual,
      notDeepEqual: assert.notDeepStrictEqual
    });
    assert.strict.strict = assert.strict;
    
    var objectKeys = Object.keys || function (obj) {
      var keys = [];
      for (var key in obj) {
        if (hasOwn.call(obj, key)) keys.push(key);
      }
      return keys;
    };
    
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"object-assign":58,"util/":5}],3:[function(require,module,exports){
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }
    
    },{}],4:[function(require,module,exports){
    module.exports = function isBuffer(arg) {
      return arg && typeof arg === 'object'
        && typeof arg.copy === 'function'
        && typeof arg.fill === 'function'
        && typeof arg.readUInt8 === 'function';
    }
    },{}],5:[function(require,module,exports){
    (function (process,global){(function (){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }
    
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };
    
    
    // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      // Allow for deprecating things in the process of starting up.
      if (isUndefined(global.process)) {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
    
      if (process.noDeprecation === true) {
        return fn;
      }
    
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
    
      return deprecated;
    };
    
    
    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || '';
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };
    
    
    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    
    
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };
    
    // Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };
    
    
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
    
      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
               '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }
    
    
    function stylizeNoColor(str, styleType) {
      return str;
    }
    
    
    function arrayToHash(array) {
      var hash = {};
    
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
    
      return hash;
    }
    
    
    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
    
      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
    
      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
    
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
    
      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }
    
      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
    
      var base = '', array = false, braces = ['{', '}'];
    
      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }
    
      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }
    
      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }
    
      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }
    
      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }
    
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
    
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }
    
      ctx.seen.push(value);
    
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
    
      ctx.seen.pop();
    
      return reduceToSingleString(output, base, braces);
    }
    
    
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }
    
    
    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }
    
    
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
        }
      });
      return output;
    }
    
    
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }
    
      return name + ': ' + str;
    }
    
    
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf('\n') >= 0) numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);
    
      if (length > 60) {
        return braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];
      }
    
      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }
    
    
    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    
    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;
    
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    
    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;
    
    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;
    
    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;
    
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;
    
    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;
    
    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;
    
    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;
    
    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;
    
    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;
    
    exports.isBuffer = require('./support/isBuffer');
    
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    
    
    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }
    
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];
    
    // 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }
    
    
    // log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };
    
    
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = require('inherits');
    
    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;
    
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
    }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"./support/isBuffer":4,"_process":60,"inherits":3}],6:[function(require,module,exports){
    (function (global){(function (){
    'use strict';
    
    var filter = require('array-filter');
    
    module.exports = function availableTypedArrays() {
        return filter([
            'BigInt64Array',
            'BigUint64Array',
            'Float32Array',
            'Float64Array',
            'Int16Array',
            'Int32Array',
            'Int8Array',
            'Uint16Array',
            'Uint32Array',
            'Uint8Array',
            'Uint8ClampedArray'
        ], function (typedArray) {
            return typeof global[typedArray] === 'function';
        });
    };
    
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"array-filter":1}],7:[function(require,module,exports){
    
    },{}],8:[function(require,module,exports){
    'use strict';
    
    var GetIntrinsic = require('get-intrinsic');
    
    var callBind = require('./');
    
    var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));
    
    module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
            return callBind(intrinsic);
        }
        return intrinsic;
    };
    
    },{"./":9,"get-intrinsic":47}],9:[function(require,module,exports){
    'use strict';
    
    var bind = require('function-bind');
    var GetIntrinsic = require('get-intrinsic');
    
    var $apply = GetIntrinsic('%Function.prototype.apply%');
    var $call = GetIntrinsic('%Function.prototype.call%');
    var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
    
    var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
    var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
    var $max = GetIntrinsic('%Math.max%');
    
    if ($defineProperty) {
        try {
            $defineProperty({}, 'a', { value: 1 });
        } catch (e) {
            // IE 8 has a broken defineProperty
            $defineProperty = null;
        }
    }
    
    module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
            var desc = $gOPD(func, 'length');
            if (desc.configurable) {
                // original length, plus the receiver, minus any additional arguments (after the receiver)
                $defineProperty(
                    func,
                    'length',
                    { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
                );
            }
        }
        return func;
    };
    
    var applyBind = function applyBind() {
        return $reflectApply(bind, $apply, arguments);
    };
    
    if ($defineProperty) {
        $defineProperty(module.exports, 'apply', { value: applyBind });
    } else {
        module.exports.apply = applyBind;
    }
    
    },{"function-bind":45,"get-intrinsic":47}],10:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    const align = {
        right: alignRight,
        center: alignCenter
    };
    const top = 0;
    const right = 1;
    const bottom = 2;
    const left = 3;
    class UI {
        constructor(opts) {
            var _a;
            this.width = opts.width;
            this.wrap = (_a = opts.wrap) !== null && _a !== void 0 ? _a : true;
            this.rows = [];
        }
        span(...args) {
            const cols = this.div(...args);
            cols.span = true;
        }
        resetOutput() {
            this.rows = [];
        }
        div(...args) {
            if (args.length === 0) {
                this.div('');
            }
            if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === 'string') {
                return this.applyLayoutDSL(args[0]);
            }
            const cols = args.map(arg => {
                if (typeof arg === 'string') {
                    return this.colFromString(arg);
                }
                return arg;
            });
            this.rows.push(cols);
            return cols;
        }
        shouldApplyLayoutDSL(...args) {
            return args.length === 1 && typeof args[0] === 'string' &&
                /[\t\n]/.test(args[0]);
        }
        applyLayoutDSL(str) {
            const rows = str.split('\n').map(row => row.split('\t'));
            let leftColumnWidth = 0;
            // simple heuristic for layout, make sure the
            // second column lines up along the left-hand.
            // don't allow the first column to take up more
            // than 50% of the screen.
            rows.forEach(columns => {
                if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
                    leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
                }
            });
            // generate a table:
            //  replacing ' ' with padding calculations.
            //  using the algorithmically generated width.
            rows.forEach(columns => {
                this.div(...columns.map((r, i) => {
                    return {
                        text: r.trim(),
                        padding: this.measurePadding(r),
                        width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
                    };
                }));
            });
            return this.rows[this.rows.length - 1];
        }
        colFromString(text) {
            return {
                text,
                padding: this.measurePadding(text)
            };
        }
        measurePadding(str) {
            // measure padding without ansi escape codes
            const noAnsi = mixin.stripAnsi(str);
            return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
        }
        toString() {
            const lines = [];
            this.rows.forEach(row => {
                this.rowToString(row, lines);
            });
            // don't display any lines with the
            // hidden flag set.
            return lines
                .filter(line => !line.hidden)
                .map(line => line.text)
                .join('\n');
        }
        rowToString(row, lines) {
            this.rasterize(row).forEach((rrow, r) => {
                let str = '';
                rrow.forEach((col, c) => {
                    const { width } = row[c]; // the width with padding.
                    const wrapWidth = this.negatePadding(row[c]); // the width without padding.
                    let ts = col; // temporary string used during alignment/padding.
                    if (wrapWidth > mixin.stringWidth(col)) {
                        ts += ' '.repeat(wrapWidth - mixin.stringWidth(col));
                    }
                    // align the string within its column.
                    if (row[c].align && row[c].align !== 'left' && this.wrap) {
                        const fn = align[row[c].align];
                        ts = fn(ts, wrapWidth);
                        if (mixin.stringWidth(ts) < wrapWidth) {
                            ts += ' '.repeat((width || 0) - mixin.stringWidth(ts) - 1);
                        }
                    }
                    // apply border and padding to string.
                    const padding = row[c].padding || [0, 0, 0, 0];
                    if (padding[left]) {
                        str += ' '.repeat(padding[left]);
                    }
                    str += addBorder(row[c], ts, '| ');
                    str += ts;
                    str += addBorder(row[c], ts, ' |');
                    if (padding[right]) {
                        str += ' '.repeat(padding[right]);
                    }
                    // if prior row is span, try to render the
                    // current row on the prior line.
                    if (r === 0 && lines.length > 0) {
                        str = this.renderInline(str, lines[lines.length - 1]);
                    }
                });
                // remove trailing whitespace.
                lines.push({
                    text: str.replace(/ +$/, ''),
                    span: row.span
                });
            });
            return lines;
        }
        // if the full 'source' can render in
        // the target line, do so.
        renderInline(source, previousLine) {
            const match = source.match(/^ */);
            const leadingWhitespace = match ? match[0].length : 0;
            const target = previousLine.text;
            const targetTextWidth = mixin.stringWidth(target.trimRight());
            if (!previousLine.span) {
                return source;
            }
            // if we're not applying wrapping logic,
            // just always append to the span.
            if (!this.wrap) {
                previousLine.hidden = true;
                return target + source;
            }
            if (leadingWhitespace < targetTextWidth) {
                return source;
            }
            previousLine.hidden = true;
            return target.trimRight() + ' '.repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
        }
        rasterize(row) {
            const rrows = [];
            const widths = this.columnWidths(row);
            let wrapped;
            // word wrap all columns, and create
            // a data-structure that is easy to rasterize.
            row.forEach((col, c) => {
                // leave room for left and right padding.
                col.width = widths[c];
                if (this.wrap) {
                    wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split('\n');
                }
                else {
                    wrapped = col.text.split('\n');
                }
                if (col.border) {
                    wrapped.unshift('.' + '-'.repeat(this.negatePadding(col) + 2) + '.');
                    wrapped.push("'" + '-'.repeat(this.negatePadding(col) + 2) + "'");
                }
                // add top and bottom padding.
                if (col.padding) {
                    wrapped.unshift(...new Array(col.padding[top] || 0).fill(''));
                    wrapped.push(...new Array(col.padding[bottom] || 0).fill(''));
                }
                wrapped.forEach((str, r) => {
                    if (!rrows[r]) {
                        rrows.push([]);
                    }
                    const rrow = rrows[r];
                    for (let i = 0; i < c; i++) {
                        if (rrow[i] === undefined) {
                            rrow.push('');
                        }
                    }
                    rrow.push(str);
                });
            });
            return rrows;
        }
        negatePadding(col) {
            let wrapWidth = col.width || 0;
            if (col.padding) {
                wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
            }
            if (col.border) {
                wrapWidth -= 4;
            }
            return wrapWidth;
        }
        columnWidths(row) {
            if (!this.wrap) {
                return row.map(col => {
                    return col.width || mixin.stringWidth(col.text);
                });
            }
            let unset = row.length;
            let remainingWidth = this.width;
            // column widths can be set in config.
            const widths = row.map(col => {
                if (col.width) {
                    unset--;
                    remainingWidth -= col.width;
                    return col.width;
                }
                return undefined;
            });
            // any unset widths should be calculated.
            const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
            return widths.map((w, i) => {
                if (w === undefined) {
                    return Math.max(unsetWidth, _minWidth(row[i]));
                }
                return w;
            });
        }
    }
    function addBorder(col, ts, style) {
        if (col.border) {
            if (/[.']-+[.']/.test(ts)) {
                return '';
            }
            if (ts.trim().length !== 0) {
                return style;
            }
            return '  ';
        }
        return '';
    }
    // calculates the minimum width of
    // a column, based on padding preferences.
    function _minWidth(col) {
        const padding = col.padding || [];
        const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
        if (col.border) {
            return minWidth + 4;
        }
        return minWidth;
    }
    function getWindowWidth() {
        /* istanbul ignore next: depends on terminal */
        if (typeof process === 'object' && process.stdout && process.stdout.columns) {
            return process.stdout.columns;
        }
        return 80;
    }
    function alignRight(str, width) {
        str = str.trim();
        const strWidth = mixin.stringWidth(str);
        if (strWidth < width) {
            return ' '.repeat(width - strWidth) + str;
        }
        return str;
    }
    function alignCenter(str, width) {
        str = str.trim();
        const strWidth = mixin.stringWidth(str);
        /* istanbul ignore next */
        if (strWidth >= width) {
            return str;
        }
        return ' '.repeat((width - strWidth) >> 1) + str;
    }
    let mixin;
    function cliui(opts, _mixin) {
        mixin = _mixin;
        return new UI({
            width: (opts === null || opts === void 0 ? void 0 : opts.width) || getWindowWidth(),
            wrap: opts === null || opts === void 0 ? void 0 : opts.wrap
        });
    }
    
    // Bootstrap cliui with CommonJS dependencies:
    const stringWidth = require('string-width');
    const stripAnsi = require('strip-ansi');
    const wrap = require('wrap-ansi');
    function ui(opts) {
        return cliui(opts, {
            stringWidth,
            stripAnsi,
            wrap
        });
    }
    
    module.exports = ui;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":60,"string-width":13,"strip-ansi":14,"wrap-ansi":77}],11:[function(require,module,exports){
    'use strict';
    
    module.exports = ({onlyFirst = false} = {}) => {
        const pattern = [
            '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
            '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
        ].join('|');
    
        return new RegExp(pattern, onlyFirst ? undefined : 'g');
    };
    
    },{}],12:[function(require,module,exports){
    /* eslint-disable yoda */
    'use strict';
    
    const isFullwidthCodePoint = codePoint => {
        if (Number.isNaN(codePoint)) {
            return false;
        }
    
        // Code points are derived from:
        // http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
        if (
            codePoint >= 0x1100 && (
                codePoint <= 0x115F || // Hangul Jamo
                codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
                codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
                // CJK Radicals Supplement .. Enclosed CJK Letters and Months
                (0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
                // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
                (0x3250 <= codePoint && codePoint <= 0x4DBF) ||
                // CJK Unified Ideographs .. Yi Radicals
                (0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
                // Hangul Jamo Extended-A
                (0xA960 <= codePoint && codePoint <= 0xA97C) ||
                // Hangul Syllables
                (0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
                // CJK Compatibility Ideographs
                (0xF900 <= codePoint && codePoint <= 0xFAFF) ||
                // Vertical Forms
                (0xFE10 <= codePoint && codePoint <= 0xFE19) ||
                // CJK Compatibility Forms .. Small Form Variants
                (0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
                // Halfwidth and Fullwidth Forms
                (0xFF01 <= codePoint && codePoint <= 0xFF60) ||
                (0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
                // Kana Supplement
                (0x1B000 <= codePoint && codePoint <= 0x1B001) ||
                // Enclosed Ideographic Supplement
                (0x1F200 <= codePoint && codePoint <= 0x1F251) ||
                // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
                (0x20000 <= codePoint && codePoint <= 0x3FFFD)
            )
        ) {
            return true;
        }
    
        return false;
    };
    
    module.exports = isFullwidthCodePoint;
    module.exports.default = isFullwidthCodePoint;
    
    },{}],13:[function(require,module,exports){
    'use strict';
    const stripAnsi = require('strip-ansi');
    const isFullwidthCodePoint = require('is-fullwidth-code-point');
    const emojiRegex = require('emoji-regex');
    
    const stringWidth = string => {
        if (typeof string !== 'string' || string.length === 0) {
            return 0;
        }
    
        string = stripAnsi(string);
    
        if (string.length === 0) {
            return 0;
        }
    
        string = string.replace(emojiRegex(), '  ');
    
        let width = 0;
    
        for (let i = 0; i < string.length; i++) {
            const code = string.codePointAt(i);
    
            // Ignore control characters
            if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
                continue;
            }
    
            // Ignore combining characters
            if (code >= 0x300 && code <= 0x36F) {
                continue;
            }
    
            // Surrogates
            if (code > 0xFFFF) {
                i++;
            }
    
            width += isFullwidthCodePoint(code) ? 2 : 1;
        }
    
        return width;
    };
    
    module.exports = stringWidth;
    // TODO: remove this in the next major version
    module.exports.default = stringWidth;
    
    },{"emoji-regex":39,"is-fullwidth-code-point":12,"strip-ansi":14}],14:[function(require,module,exports){
    'use strict';
    const ansiRegex = require('ansi-regex');
    
    module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;
    
    },{"ansi-regex":11}],15:[function(require,module,exports){
    /*!
     * cookie
     * Copyright(c) 2012-2014 Roman Shtylman
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     */
    
    'use strict';
    
    /**
     * Module exports.
     * @public
     */
    
    exports.parse = parse;
    exports.serialize = serialize;
    
    /**
     * Module variables.
     * @private
     */
    
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var pairSplitRegExp = /; */;
    
    /**
     * RegExp to match field-content in RFC 7230 sec 3.2
     *
     * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
     * field-vchar   = VCHAR / obs-text
     * obs-text      = %x80-FF
     */
    
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    
    /**
     * Parse a cookie header.
     *
     * Parse the given cookie header string into an object
     * The object has the various cookies as keys(names) => values
     *
     * @param {string} str
     * @param {object} [options]
     * @return {object}
     * @public
     */
    
    function parse(str, options) {
      if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
      }
    
      var obj = {}
      var opt = options || {};
      var pairs = str.split(pairSplitRegExp);
      var dec = opt.decode || decode;
    
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf('=');
    
        // skip things that don't look like key=value
        if (eq_idx < 0) {
          continue;
        }
    
        var key = pair.substr(0, eq_idx).trim()
        var val = pair.substr(++eq_idx, pair.length).trim();
    
        // quoted values
        if ('"' == val[0]) {
          val = val.slice(1, -1);
        }
    
        // only assign once
        if (undefined == obj[key]) {
          obj[key] = tryDecode(val, dec);
        }
      }
    
      return obj;
    }
    
    /**
     * Serialize data into a cookie header.
     *
     * Serialize the a name value pair into a cookie string suitable for
     * http headers. An optional options object specified cookie parameters.
     *
     * serialize('foo', 'bar', { httpOnly: true })
     *   => "foo=bar; httpOnly"
     *
     * @param {string} name
     * @param {string} val
     * @param {object} [options]
     * @return {string}
     * @public
     */
    
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
    
      if (typeof enc !== 'function') {
        throw new TypeError('option encode is invalid');
      }
    
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError('argument name is invalid');
      }
    
      var value = enc(val);
    
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError('argument val is invalid');
      }
    
      var str = name + '=' + value;
    
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
    
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError('option maxAge is invalid')
        }
    
        str += '; Max-Age=' + Math.floor(maxAge);
      }
    
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError('option domain is invalid');
        }
    
        str += '; Domain=' + opt.domain;
      }
    
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError('option path is invalid');
        }
    
        str += '; Path=' + opt.path;
      }
    
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== 'function') {
          throw new TypeError('option expires is invalid');
        }
    
        str += '; Expires=' + opt.expires.toUTCString();
      }
    
      if (opt.httpOnly) {
        str += '; HttpOnly';
      }
    
      if (opt.secure) {
        str += '; Secure';
      }
    
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === 'string'
          ? opt.sameSite.toLowerCase() : opt.sameSite;
    
        switch (sameSite) {
          case true:
            str += '; SameSite=Strict';
            break;
          case 'lax':
            str += '; SameSite=Lax';
            break;
          case 'strict':
            str += '; SameSite=Strict';
            break;
          case 'none':
            str += '; SameSite=None';
            break;
          default:
            throw new TypeError('option sameSite is invalid');
        }
      }
    
      return str;
    }
    
    /**
     * Try decoding a string using a decoding function.
     *
     * @param {string} str
     * @param {function} decode
     * @private
     */
    
    function tryDecode(str, decode) {
      try {
        return decode(str);
      } catch (e) {
        return str;
      }
    }
    
    },{}],16:[function(require,module,exports){
    const util = require('../util')
    const nunjucks = require('nunjucks')
    const querystring = require('query-string')
    const ansibleTemplate = require('../templates/ansible.js')
    function getDataString (request) {
      const parsedQueryString = querystring.parse(request.data, { sort: false })
      const keyCount = Object.keys(parsedQueryString).length
      const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      const singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        return JSON.parse(request.data)
      } else {
        return request.data
      }
    }
    
    const toAnsible = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      var convertedData
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        convertedData = getDataString(request)
      }
      var result = nunjucks.renderString(ansibleTemplate, { request: request, data: convertedData })
      return result
    }
    
    module.exports = toAnsible
    
    },{"../templates/ansible.js":36,"../util":37,"nunjucks":57,"query-string":62}],17:[function(require,module,exports){
    const util = require('../util')
    const jsesc = require('jsesc')
    
    function repr (value) {
      // In context of url parameters, don't accept nulls and such.
      if (!value) {
        return "''"
      } else {
        return "'" + jsesc(value, { quotes: 'single' }) + "'"
      }
    }
    
    const toDart = curlCommand => {
      const r = util.parseCurlCommand(curlCommand)
      let s = ''
    
      if (r.auth || r.isDataBinary) s += "import 'dart:convert';\n"
    
      s +=
        "import 'package:http/http.dart' as http;\n" +
        '\n' +
        'void main() async {\n'
    
      if (r.auth) {
        const splitAuth = r.auth.split(':')
        const uname = splitAuth[0] || ''
        const pword = splitAuth[1] || ''
    
        s +=
          "  var uname = '" + uname + "';\n" +
          "  var pword = '" + pword + "';\n" +
          "  var authn = 'Basic ' + base64Encode(utf8.encode('$uname:$pword'));\n" +
          '\n'
      }
    
      const hasHeaders = r.headers || r.cookies || r.compressed || r.isDataBinary || r.method === 'put'
      if (hasHeaders) {
        s += '  var headers = {\n'
        for (const hname in r.headers) s += "    '" + hname + "': '" + r.headers[hname] + "',\n"
    
        if (r.cookies) {
          const cookiestr = util.serializeCookies(r.cookies)
          s += "    'Cookie': '" + cookiestr + "',\n"
        }
    
        if (r.auth) s += "    'Authorization': authn,\n"
        if (r.compressed) s += "    'Accept-Encoding': 'gzip',\n"
        if (!hasHeaders['Content-Type'] && (r.isDataBinary || r.method === 'put')) {
          s += "    'Content-Type': 'application/x-www-form-urlencoded',\n"
        }
    
        s += '  };\n'
        s += '\n'
      }
    
      const hasQuery = r.query
      if (hasQuery) {
        s += '  var params = {\n'
        for (const paramName in r.query) {
          const rawValue = r.query[paramName]
          let paramValue
          if (Array.isArray(rawValue)) {
            paramValue = '[' + rawValue.map(repr).join(', ') + ']'
          } else {
            paramValue = repr(rawValue)
          }
          s += '    ' + repr(paramName) + ': ' + paramValue + ',\n'
        }
        s += '  };\n'
        /* eslint-disable no-template-curly-in-string */
        s += "  var query = params.entries.map((p) => '${p.key}=${p.value}').join('&');\n"
        s += '\n'
      }
    
      if (r.data === true) {
        r.data = ''
      }
      const hasData = r.data
      if (typeof r.data === 'number') {
        r.data = r.data.toString()
      }
      if (hasData) {
        // escape single quotes if there're not already escaped
        if (r.data.indexOf("'") !== -1 && r.data.indexOf("\\'") === -1) r.data = jsesc(r.data)
    
        if (r.dataArray) {
          s += '  var data = {\n'
          for (let i = 0; i !== r.dataArray.length; ++i) {
            const kv = r.dataArray[i]
            const splitKv = kv.replace(/\\"/g, '"').split('=')
            const key = splitKv[0] || ''
            const val = splitKv[1] || ''
            s += "    '" + key + "': '" + val + "',\n"
          }
          s += '  };\n'
          s += '\n'
        } else if (r.isDataBinary) {
          s += `  var data = utf8.encode('${r.data}');\n\n`
        } else {
          s += `  var data = '${r.data}';\n\n`
        }
      }
    
      if (hasQuery) {
        s += '  var res = await http.' + r.method + "('" + r.urlWithoutQuery + "?$query'"
      } else {
        s += '  var res = await http.' + r.method + "('" + r.url + "'"
      }
    
      if (hasHeaders) s += ', headers: headers'
      else if (r.auth) s += ", headers: {'Authorization': authn}"
      if (hasData) s += ', body: data'
    
      /* eslint-disable no-template-curly-in-string */
      s +=
        ');\n' +
        "  if (res.statusCode != 200) throw Exception('http." + r.method + " error: statusCode= ${res.statusCode}');\n" +
        '  print(res.body);\n' +
        '}'
    
      return s + '\n'
    }
    
    module.exports = toDart
    
    },{"../util":37,"jsesc":56}],18:[function(require,module,exports){
    var util = require('../util')
    var jsesc = require('jsesc')
    var querystring = require('query-string')
    
    require('string.prototype.startswith')
    
    function repr (value) {
      // In context of url parameters, don't accept nulls and such.
      if (!value) {
        return '""'
      } else {
        return `~s|${jsesc(value, { quotes: 'backticks' })}|`
      }
    }
    
    function getCookies (request) {
      if (!request.cookies) {
        return ''
      }
    
      var cookies = []
      for (var cookieName in request.cookies) {
        cookies.push(`${cookieName}=${request.cookies[cookieName]}`)
      }
      return `cookies: [~s|${cookies.join('; ')}|]`
    }
    
    function getOptions (request) {
      var hackneyOptions = []
    
      const auth = getBasicAuth(request)
      if (auth) {
        hackneyOptions.push(auth)
      }
    
      if (request.insecure) {
        hackneyOptions.push(':insecure')
      }
    
      const cookies = getCookies(request)
      if (cookies) {
        hackneyOptions.push(cookies)
      }
    
      var hackneyOptionsString = ''
      if (hackneyOptions.length) {
        hackneyOptionsString = `hackney: [${hackneyOptions.join(', ')}]`
      }
    
      return `[${hackneyOptionsString}]`
    }
    
    function getBasicAuth (request) {
      if (!request.auth) {
        return ''
      }
    
      var splitAuth = request.auth.split(':')
      var user = splitAuth[0] || ''
      var password = splitAuth[1] || ''
    
      return `basic_auth: {${repr(user)}, ${repr(password)}}`
    }
    
    function getQueryDict (request) {
      if (!request.query) {
        return '[]'
      }
      var queryDict = '[\n'
      for (var paramName in request.query) {
        var rawValue = request.query[paramName]
        var paramValue
        if (Array.isArray(rawValue)) {
          paramValue = '[' + rawValue.map(repr).join(', ') + ']'
        } else {
          paramValue = repr(rawValue)
        }
        queryDict += `    {${repr(paramName)}, ${paramValue}},\n`
      }
      queryDict += '  ]'
      return queryDict
    }
    
    function getHeadersDict (request) {
      if (!request.headers) {
        return '[]'
      }
      var dict = '[\n'
      for (var headerName in request.headers) {
        dict += `    {${repr(headerName)}, ${repr(request.headers[headerName])}},\n`
      }
      dict += '  ]'
      return dict
    }
    
    function getBody (request) {
      const formData = getFormDataString(request)
    
      if (formData) {
        return formData
      }
    
      return '""'
    }
    
    function getFormDataString (request) {
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        return getDataString(request)
      }
    
      if (!request.multipartUploads) {
        return ''
      }
    
      var fileArgs = []
      var dataArgs = []
      for (var multipartKey in request.multipartUploads) {
        var multipartValue = request.multipartUploads[multipartKey]
        if (multipartValue.startsWith('@')) {
          var fileName = multipartValue.slice(1)
          fileArgs.push(`    {:file, ~s|${fileName}|}`)
        } else {
          dataArgs.push(`    {${repr(multipartKey)}, ${repr(multipartValue)}}`)
        }
      }
    
      var content = []
      fileArgs = fileArgs.join(',\n')
      if (fileArgs) {
        content.push(fileArgs)
      }
    
      dataArgs = dataArgs.join(',\n')
      if (dataArgs) {
        content.push(dataArgs)
      }
    
      content = content.join(',\n')
      if (content) {
        return `{:multipart, [
    ${content}
    ]}`
      }
    
      return ''
    }
    
    function getDataString (request) {
      if (typeof request.data === 'number') {
        request.data = request.data.toString()
      }
      if (!request.isDataRaw && request.data.startsWith('@')) {
        var filePath = request.data.slice(1)
        if (request.isDataBinary) {
          return `File.read!("${filePath}")`
        } else {
          return `{:file, ~s|${filePath}|}`
        }
      }
    
      var parsedQueryString = querystring.parse(request.data, { sort: false })
      var keyCount = Object.keys(parsedQueryString).length
      var singleKeyOnly =
        keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      var singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        return `~s|${request.data}|`
      } else {
        return getMultipleDataString(request, parsedQueryString)
      }
    }
    
    function getMultipleDataString (request, parsedQueryString) {
      var repeatedKey = false
      for (var key in parsedQueryString) {
        var value = parsedQueryString[key]
        if (Array.isArray(value)) {
          repeatedKey = true
        }
      }
    
      var dataString
      if (repeatedKey) {
        const data = []
        for (key in parsedQueryString) {
          value = parsedQueryString[key]
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              data.push(`    {${repr(key)}, ${repr(value[i])}}`)
            }
          } else {
            data.push(`    {${repr(key)}, ${repr(value)}}`)
          }
        }
        dataString = `[
    ${data.join(',\n')}
      ]`
      } else {
        const data = []
        for (key in parsedQueryString) {
          value = parsedQueryString[key]
          data.push(`    {${repr(key)}, ${repr(value)}}`)
        }
        dataString = `[
    ${data.join(',\n')}
      ]`
      }
    
      return dataString
    }
    
    var toElixir = function (curlCommand) {
      var request = util.parseCurlCommand(curlCommand)
      // curl automatically prepends 'http' if the scheme is missing, but python fails and returns an error
      // we tack it on here to mimic curl
      if (!request.url.match(/https?:/)) {
        request.url = 'http://' + request.url
      }
      if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery
      }
    
      const template = `request = %HTTPoison.Request{
      method: :${request.method},
      url: "${request.urlWithoutQuery}",
      options: ${getOptions(request)},
      headers: ${getHeadersDict(request)},
      params: ${getQueryDict(request)},
      body: ${getBody(request)}
    }
    
    response = HTTPoison.request(request)
    `
    
      return template
    }
    
    module.exports = toElixir
    
    },{"../util":37,"jsesc":56,"query-string":62,"string.prototype.startswith":69}],19:[function(require,module,exports){
    const util = require('../util')
    const jsesc = require('jsesc')
    
    const toGo = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      let goCode = 'package main\n\n'
      goCode += 'import (\n\t"fmt"\n\t"io/ioutil"\n\t"log"\n\t"net/http"\n)\n\n'
      goCode += 'func main() {\n'
      goCode += '\tclient := &http.Client{}\n'
      if (request.data === true) {
        request.data = ''
      }
      if (request.data) {
        if (typeof request.data === 'number') {
          request.data = request.data.toString()
        }
        if (request.data.indexOf("'") > -1) {
          request.data = jsesc(request.data)
        }
        // import strings
        goCode = goCode.replace('\n)', '\n\t"strings"\n)')
        goCode += '\tvar data = strings.NewReader(`' + request.data + '`)\n'
        goCode += '\treq, err := http.NewRequest("' + request.method.toUpperCase() + '", "' + request.url + '", data)\n'
      } else {
        goCode += '\treq, err := http.NewRequest("' + request.method.toUpperCase() + '", "' + request.url + '", nil)\n'
      }
      goCode += '\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n'
      if (request.headers || request.cookies) {
        for (const headerName in request.headers) {
          goCode += '\treq.Header.Set("' + headerName + '", "' + request.headers[headerName] + '")\n'
        }
        if (request.cookies) {
          const cookieString = util.serializeCookies(request.cookies)
          goCode += '\treq.Header.Set("Cookie", "' + cookieString + '")\n'
        }
      }
    
      if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        goCode += '\treq.SetBasicAuth("' + user + '", "' + password + '")\n'
      }
      goCode += '\tresp, err := client.Do(req)\n'
      goCode += '\tif err != nil {\n'
      goCode += '\t\tlog.Fatal(err)\n'
      goCode += '\t}\n'
      goCode += '\tdefer resp.Body.Close()\n'
      goCode += '\tbodyText, err := ioutil.ReadAll(resp.Body)\n'
      goCode += '\tif err != nil {\n'
      goCode += '\t\tlog.Fatal(err)\n'
      goCode += '\t}\n'
      goCode += '\tfmt.Printf("%s\\n", bodyText)\n'
      goCode += '}'
    
      return goCode + '\n'
    }
    
    module.exports = toGo
    
    },{"../util":37,"jsesc":56}],20:[function(require,module,exports){
    const util = require('../util')
    const jsesc = require('jsesc')
    
    const doubleQuotes = str => jsesc(str, { quotes: 'double' })
    
    const toJava = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      let javaCode = ''
    
      if (request.auth) {
        javaCode += 'import javax.xml.bind.DatatypeConverter;\n'
      }
      javaCode += 'import java.io.IOException;\n'
      javaCode += 'import java.io.InputStream;\n'
      if (request.data) {
        javaCode += 'import java.io.OutputStreamWriter;\n'
      }
    
      javaCode += 'import java.net.HttpURLConnection;\n'
    
      javaCode += 'import java.net.URL;\n'
      javaCode += 'import java.util.Scanner;\n'
    
      javaCode += '\nclass Main {\n\n'
    
      javaCode += '\tpublic static void main(String[] args) throws IOException {\n'
      javaCode += '\t\tURL url = new URL("' + request.url + '");\n'
      javaCode += '\t\tHttpURLConnection httpConn = (HttpURLConnection) url.openConnection();\n'
      javaCode += '\t\thttpConn.setRequestMethod("' + request.method.toUpperCase() + '");\n\n'
    
      let gzip = false
      if (request.headers) {
        for (const headerName in request.headers) {
          javaCode += '\t\thttpConn.setRequestProperty("' + headerName + '", "' + doubleQuotes(request.headers[headerName]) + '");\n'
          if (headerName.toLowerCase() === 'accept-encoding') {
            gzip = request.headers[headerName].indexOf('gzip') !== -1
          }
        }
        javaCode += '\n'
      }
    
      if (request.cookies) {
        const cookieString = util.serializeCookies(request.cookies)
        javaCode += '\t\thttpConn.setRequestProperty("Cookie", "' + doubleQuotes(cookieString) + '");\n'
        javaCode += '\n'
      }
    
      if (request.auth) {
        javaCode += '\t\tbyte[] message = ("' + doubleQuotes(request.auth) + '").getBytes("UTF-8");\n'
        javaCode += '\t\tString basicAuth = DatatypeConverter.printBase64Binary(message);\n'
        javaCode += '\t\thttpConn.setRequestProperty("Authorization", "Basic " + basicAuth);\n'
        javaCode += '\n'
      }
    
      if (request.data) {
        if (typeof request.data === 'number') {
          request.data = request.data.toString()
        }
        request.data = doubleQuotes(request.data)
        javaCode += '\t\thttpConn.setDoOutput(true);\n'
        javaCode += '\t\tOutputStreamWriter writer = new OutputStreamWriter(httpConn.getOutputStream());\n'
        javaCode += '\t\twriter.write("' + request.data + '");\n'
        javaCode += '\t\twriter.flush();\n'
        javaCode += '\t\twriter.close();\n'
        javaCode += '\t\thttpConn.getOutputStream().close();\n'
        javaCode += '\n'
      }
    
      javaCode += '\t\tInputStream responseStream = httpConn.getResponseCode() / 100 == 2\n'
      javaCode += '\t\t\t\t? httpConn.getInputStream()\n'
      javaCode += '\t\t\t\t: httpConn.getErrorStream();\n'
      if (gzip) {
        javaCode += '\t\tif ("gzip".equals(httpConn.getContentEncoding())) {\n'
        javaCode += '\t\t\tresponseStream = new GZIPInputStream(responseStream);\n'
        javaCode += '\t\t}\n'
      }
      javaCode += '\t\tScanner s = new Scanner(responseStream).useDelimiter("\\\\A");\n'
      javaCode += '\t\tString response = s.hasNext() ? s.next() : "";\n'
      javaCode += '\t\tSystem.out.println(response);\n'
    
      javaCode += '\t}\n'
      javaCode += '}'
    
      return javaCode + '\n'
    }
    
    module.exports = toJava
    
    },{"../util":37,"jsesc":56}],21:[function(require,module,exports){
    const toJsFetch = require('./fetch')
    
    const toBrowser = curlCommand => {
      const browserCode = toJsFetch(curlCommand)
    
      return browserCode
    }
    
    module.exports = toBrowser
    
    },{"./fetch":22}],22:[function(require,module,exports){
    const util = require('../../util')
    const jsesc = require('jsesc')
    
    const toJsFetch = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
    
      let jsFetchCode = ''
    
      if (request.data === true) {
        request.data = ''
      }
      if (request.data) {
        if (typeof request.data === 'number') {
          request.data = request.data.toString()
        }
        // escape single quotes if there are any in there
        if (request.data.indexOf("'") > -1) {
          request.data = jsesc(request.data)
        }
    
        try {
          JSON.parse(request.data)
    
          if (!request.headers) {
            request.headers = {}
          }
    
          if (!request.headers['Content-Type']) {
            request.headers['Content-Type'] = 'application/json; charset=UTF-8'
          }
    
          request.data = 'JSON.stringify(' + request.data + ')'
        } catch {
          request.data = '\'' + request.data + '\''
        }
      }
    
      jsFetchCode += 'fetch(\'' + request.url + '\''
    
      if (request.method !== 'get' || request.headers || request.cookies || request.auth || request.body) {
        jsFetchCode += ', {\n'
    
        if (request.method !== 'get') {
          jsFetchCode += '    method: \'' + request.method.toUpperCase() + '\''
        }
    
        if (request.headers || request.cookies || request.auth) {
          if (request.method !== 'get') {
            jsFetchCode += ',\n'
          }
          jsFetchCode += '    headers: {\n'
          const headerCount = Object.keys(request.headers || {}).length
          let i = 0
          for (const headerName in request.headers) {
            jsFetchCode += '        \'' + headerName + '\': \'' + request.headers[headerName] + '\''
            if (i < headerCount - 1 || request.cookies || request.auth) {
              jsFetchCode += ',\n'
            }
            i++
          }
          if (request.auth) {
            const splitAuth = request.auth.split(':')
            const user = splitAuth[0] || ''
            const password = splitAuth[1] || ''
            jsFetchCode += '        \'Authorization\': \'Basic \' + btoa(\'' + user + ':' + password + '\')'
          }
          if (request.cookies) {
            const cookieString = util.serializeCookies(request.cookies)
            jsFetchCode += '        \'Cookie\': \'' + cookieString + '\''
          }
    
          jsFetchCode += '\n    }'
        }
    
        if (request.data) {
          jsFetchCode += ',\n    body: ' + request.data
        }
    
        jsFetchCode += '\n}'
      }
    
      jsFetchCode += ');'
    
      return jsFetchCode + '\n'
    }
    
    module.exports = toJsFetch
    
    },{"../../util":37,"jsesc":56}],23:[function(require,module,exports){
    const toJsFetch = require('./fetch')
    
    const toNodeFetch = curlCommand => {
      let nodeFetchCode = 'var fetch = require(\'node-fetch\');\n\n'
      nodeFetchCode += toJsFetch(curlCommand)
    
      return nodeFetchCode
    }
    
    module.exports = toNodeFetch
    
    },{"./fetch":22}],24:[function(require,module,exports){
    const util = require('../../util')
    const jsesc = require('jsesc')
    
    const toNodeRequest = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      let nodeRequestCode = 'var request = require(\'request\');\n\n'
      if (request.headers || request.cookies) {
        nodeRequestCode += 'var headers = {\n'
        const headerCount = Object.keys(request.headers).length
        let i = 0
        for (const headerName in request.headers) {
          nodeRequestCode += '    \'' + headerName + '\': \'' + request.headers[headerName] + '\''
          if (i < headerCount - 1 || request.cookies) {
            nodeRequestCode += ',\n'
          } else {
            nodeRequestCode += '\n'
          }
          i++
        }
        if (request.cookies) {
          const cookieString = util.serializeCookies(request.cookies)
          nodeRequestCode += '    \'Cookie\': \'' + cookieString + '\'\n'
        }
        nodeRequestCode += '};\n\n'
      }
    
      if (request.data === true) {
        request.data = ''
      }
      if (request.data) {
        if (typeof request.data === 'number') {
          request.data = request.data.toString()
        }
        // escape single quotes if there are any in there
        if (request.data.indexOf("'") > -1) {
          request.data = jsesc(request.data)
        }
        nodeRequestCode += 'var dataString = \'' + request.data + '\';\n\n'
      }
    
      nodeRequestCode += 'var options = {\n'
      nodeRequestCode += '    url: \'' + request.url + '\''
      if (request.method !== 'get') {
        nodeRequestCode += ',\n    method: \'' + request.method.toUpperCase() + '\''
      }
    
      if (request.headers || request.cookies) {
        nodeRequestCode += ',\n'
        nodeRequestCode += '    headers: headers'
      }
      if (request.data) {
        nodeRequestCode += ',\n    body: dataString'
      }
    
      if (request.auth) {
        nodeRequestCode += ',\n'
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        nodeRequestCode += '    auth: {\n'
        nodeRequestCode += "        'user': '" + user + "',\n"
        nodeRequestCode += "        'pass': '" + password + "'\n"
        nodeRequestCode += '    }\n'
      } else {
        nodeRequestCode += '\n'
      }
      nodeRequestCode += '};\n\n'
    
      nodeRequestCode += 'function callback(error, response, body) {\n'
      nodeRequestCode += '    if (!error && response.statusCode == 200) {\n'
      nodeRequestCode += '        console.log(body);\n'
      nodeRequestCode += '    }\n'
      nodeRequestCode += '}\n\n'
      nodeRequestCode += 'request(options, callback);'
    
      return nodeRequestCode + '\n'
    }
    
    module.exports = toNodeRequest
    
    },{"../../util":37,"jsesc":56}],25:[function(require,module,exports){
    // Author: ssi-anik (sirajul.islam.anik@gmail.com)
    
    const util = require('../util')
    const querystring = require('query-string')
    const jsesc = require('jsesc')
    
    require('string.prototype.startswith')
    
    function repr (value, isKey) {
      // In context of url parameters, don't accept nulls and such.
      /*
        if ( !value ) {
       return ""
       } else {
       return "'" + jsesc(value, { quotes: 'single' }) + "'"
       } */
      return isKey ? "'" + jsesc(value, { quotes: 'single' }) + "'" : value
    }
    
    function getQueries (request) {
      const queries = {}
      for (const paramName in request.query) {
        const rawValue = request.query[paramName]
        let paramValue
        if (Array.isArray(rawValue)) {
          paramValue = rawValue.map(repr)
        } else {
          paramValue = repr(rawValue)
        }
        queries[repr(paramName)] = paramValue
      }
    
      return queries
    }
    
    function getDataString (request) {
      if (typeof request.data === 'number') {
        request.data = request.data.toString()
      }
    
      /*
        if ( !request.isDataRaw && request.data.startsWith('@') ) {
       var filePath = request.data.slice(1);
       return filePath;
       }
       */
    
      const parsedQueryString = querystring.parse(request.data, { sort: false })
      const keyCount = Object.keys(parsedQueryString).length
      const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      const singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        const data = {}
        data[repr(request.data)] = ''
        return { data: data }
      } else {
        return getMultipleDataString(request, parsedQueryString)
      }
    }
    
    function getMultipleDataString (request, parsedQueryString) {
      const data = {}
    
      for (const key in parsedQueryString) {
        const value = parsedQueryString[key]
        if (Array.isArray(value)) {
          data[repr(key)] = value
        } else {
          data[repr(key)] = repr(value)
        }
      }
    
      return { data: data }
    }
    
    function getFilesString (request) {
      const data = {}
    
      data.files = {}
      data.data = {}
    
      for (const multipartKey in request.multipartUploads) {
        const multipartValue = request.multipartUploads[multipartKey]
        if (multipartValue.startsWith('@')) {
          const fileName = multipartValue.slice(1)
          data.files[repr(multipartKey)] = repr(fileName)
        } else {
          data.data[repr(multipartKey)] = repr(multipartValue)
        }
      }
    
      if (Object.keys(data.files).length === 0) {
        delete data.files
      }
    
      if (Object.keys(data.data).length === 0) {
        delete data.data
      }
    
      return data
    }
    
    const toJsonString = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
    
      const requestJson = {}
    
      // curl automatically prepends 'http' if the scheme is missing, but python fails and returns an error
      // we tack it on here to mimic curl
      if (!request.url.match(/https?:/)) {
        request.url = 'http://' + request.url
      }
      if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery
      }
    
      requestJson.url = request.urlWithoutQuery.replace(/\/$/, '')
      requestJson.raw_url = request.url
      requestJson.method = request.method
    
      if (request.cookies) {
        const cookies = {}
        for (const cookieName in request.cookies) {
          cookies[repr(cookieName)] = repr(request.cookies[cookieName])
        }
    
        requestJson.cookies = cookies
      }
    
      if (request.headers) {
        const headers = {}
        for (const headerName in request.headers) {
          headers[repr(headerName)] = repr(request.headers[headerName])
        }
    
        requestJson.headers = headers
      }
    
      if (request.query) {
        requestJson.queries = getQueries(request)
      }
    
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        Object.assign(requestJson, getDataString(request))
      } else if (request.multipartUploads) {
        Object.assign(requestJson, getFilesString(request))
      }
    
      if (request.insecure) {
        requestJson.insecure = false
      }
    
      if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
    
        requestJson.auth = {
          user: repr(user),
          password: repr(password)
        }
      }
    
      return JSON.stringify(Object.keys(requestJson).length ? requestJson : '{}', null, 4) + '\n'
    }
    
    module.exports = toJsonString
    
    },{"../util":37,"jsesc":56,"query-string":62,"string.prototype.startswith":69}],26:[function(require,module,exports){
    const jsesc = require('jsesc')
    
    const repr = (value) => {
      // In context of url parameters, don't accept nulls and such.
      if (!value) {
        return "''"
      }
    
      return "'" + jsesc(value, { quotes: 'single' }).replace(/\\'/g, "''") + "'"
    }
    
    const setVariableValue = (outputVariable, value, termination) => {
      let result = ''
    
      if (outputVariable) {
        result += outputVariable + ' = '
      }
    
      result += value
      result += typeof termination === 'undefined' || termination === null ? ';' : termination
      return result
    }
    
    const callFunction = (outputVariable, functionName, params, termination) => {
      let functionCall = functionName + '('
      if (Array.isArray(params)) {
        const singleLine = params.map(x => Array.isArray(x) ? x.join(', ') : x).join(', ')
        const indentLevel = 1
        const indent = ' '.repeat(4 * indentLevel)
        const skipToNextLine = '...\n' + indent
        let multiLine = skipToNextLine
        multiLine += params.map(x => Array.isArray(x) ? x.join(', ') : x)
          .join(',' + skipToNextLine)
        multiLine += '...\n'
    
        // Split the params in multiple lines - if one line is not enough
        const combinedSingleLineLength = [outputVariable, functionName, singleLine]
            .map(x => x ? x.length : 0).reduce((x, y) => x + y) +
          (outputVariable ? 3 : 0) + 2 + (termination ? termination.length : 1)
        functionCall += combinedSingleLineLength < 120 ? singleLine : multiLine
      } else {
        functionCall += params
      }
      functionCall += ')'
      return setVariableValue(outputVariable, functionCall, termination)
    }
    
    const addCellArray = (mapping, keysNotToQuote, keyValSeparator, indentLevel, pairs) => {
      const indentUnit = ' '.repeat(4)
      const indent = indentUnit.repeat(indentLevel)
      const indentPrevLevel = indentUnit.repeat(indentLevel - 1)
    
      const entries = Object.entries(mapping)
      if (entries.length === 0) return ''
    
      let response = pairs ? '' : '{'
      if (entries.length === 1) {
        let [key, value] = entries.pop()
        if (keysNotToQuote && !keysNotToQuote.includes(key)) value = `${repr(value)}`
        response += `${repr(key)}${keyValSeparator} ${value}`
      } else {
        if (pairs) response += '...'
        let counter = entries.length
        for (let [key, value] of entries) {
          --counter
          if (keysNotToQuote && !keysNotToQuote.includes(key)) {
            if (typeof value === 'object') {
              value = `[${value.map(repr).join()}]`
            } else {
              value = `${repr(value)}`
            }
          }
          response += `\n${indent}${repr(key)}${keyValSeparator} ${value}`
          if (pairs) {
            if (counter !== 0) response += ','
            response += '...'
          }
        }
        response += `\n${indentPrevLevel}`
      }
      response += pairs ? '' : '}'
      return response
    }
    
    const structify = (obj, indentLevel) => {
      let response = ''
      indentLevel = !indentLevel ? 1 : ++indentLevel
      const indent = ' '.repeat(4 * indentLevel)
      const prevIndent = ' '.repeat(4 * (indentLevel - 1))
    
      if (obj instanceof Array) {
        const list = []
        let listContainsNumbers = true
        for (const k in obj) {
          if (listContainsNumbers && typeof obj[k] !== 'number') {
            listContainsNumbers = false
          }
          const value = structify(obj[k], indentLevel)
          list.push(`${value}`)
        }
        if (listContainsNumbers) {
          const listString = list.join(' ')
          response += `[${listString}]`
        } else {
          list.unshift('{{')
          const listString = list.join(`\n${indent}`)
          response += `${listString}\n${prevIndent}}}`
        }
      } else if (obj instanceof Object) {
        response += 'struct(...'
        let first = true
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            if (!k[0].match(/[a-z]/i)) {
              throw Error('MATLAB structs do not support keys starting with non-alphabet symbols')
            }
            // recursive call to scan property
            if (first) { first = false } else {
              response += ',...'
            }
            response += `\n${indent}`
            response += `'${k}', `
            response += structify(obj[k], indentLevel)
          }
        }
        response += '...'
        response += `\n${prevIndent})`
      } else if (typeof obj === 'number') {
        // not an Object so obj[k] here is a value
        response += `${obj}`
      } else {
        response += `${repr(obj)}`
      }
    
      return response
    }
    
    const containsBody = (request) => {
      return request.data || request.multipartUploads
    }
    
    const prepareQueryString = (request) => {
      let response = null
      if (request.query) {
        const params = addCellArray(request.query, [], '', 1)
        response = setVariableValue('params', params)
      }
      return response
    }
    
    const prepareCookies = (request) => {
      let response = null
      if (request.cookies) {
        const cookies = addCellArray(request.cookies, [], '', 1)
        response = setVariableValue('cookies', cookies)
      }
      return response
    }
    
    const cookieString = 'char(join(join(cookies, \'=\'), \'; \'))'
    const paramsString = 'char(join(join(params, \'=\'), \'&\'))'
    
    module.exports = {
      repr: repr,
      setVariableValue: setVariableValue,
      callFunction: callFunction,
      addCellArray: addCellArray,
      structify: structify,
      containsBody: containsBody,
      prepareQueryString: prepareQueryString,
      prepareCookies: prepareCookies,
      cookieString: cookieString,
      paramsString: paramsString
    }
    
    },{"jsesc":56}],27:[function(require,module,exports){
    const {
      repr, setVariableValue,
      callFunction,
      structify, containsBody,
      prepareQueryString, prepareCookies,
      cookieString
    } = require('./common')
    
    const prepareHeaders = (request) => {
      let response = null
    
      if (request.headers) {
        const headerEntries = Object.entries(request.headers)
    
        // cookies are part of headers
        const headerCount = headerEntries.length + (request.cookies ? 1 : 0)
    
        const headers = []
        let header = headerCount === 1 ? '' : '['
    
        for (const [key, value] of headerEntries) {
          switch (key) {
            case 'Cookie':
              break
            case 'Accept': {
              const accepts = value.split(',')
              if (accepts.length === 1) {
                headers.push(`field.AcceptField(MediaType(${repr(value)}))`)
              } else {
                let acceptheader = 'field.AcceptField(['
                for (const accept of accepts) {
                  acceptheader += `\n        MediaType(${repr(accept.trim())})`
                }
                acceptheader += '\n    ])'
                headers.push(acceptheader)
              }
              break
            }
            default:
              headers.push(`HeaderField(${repr(key)}, ${repr(value)})`)
          }
        }
    
        if (headerCount === 1) {
          header += headers.pop()
        } else {
          header += '\n    ' + headers.join('\n    ')
          if (request.cookies) {
            const cookieFieldParams = callFunction(null, 'cellfun', [
              '@(x) Cookie(x{:})', callFunction(null, 'num2cell', ['cookies', '2'], '')
            ], '')
            header += '\n    ' + callFunction(null, 'field.CookieField', cookieFieldParams, '')
          }
          header += '\n]\''
        }
        response = setVariableValue('header', header)
      }
    
      return response
    }
    
    const prepareURI = (request) => {
      const uriParams = [repr(request.urlWithoutQuery)]
      if (request.query) {
        uriParams.push('QueryParameter(params\')')
      }
      return callFunction('uri', 'URI', uriParams)
    }
    
    const prepareAuth = (request) => {
      let options = []
      let optionsParams = []
      if (request.auth) {
        const [usr, pass] = request.auth.split(':')
        const userfield = `'Username', ${repr(usr)}`
        const passfield = `'Password', ${repr(pass)}`
        const authparams = (usr ? `${userfield}, ` : '') + passfield
        optionsParams.push(repr('Credentials'), 'cred')
        options.push(callFunction('cred', 'Credentials', authparams))
      }
    
      if (request.insecure) {
        optionsParams.push(repr('VerifyServerName'), 'false')
      }
    
      if (optionsParams.length > 0) {
        options.push(callFunction('options', 'HTTPOptions', optionsParams))
      }
    
      return options
    }
    
    const prepareMultipartUploads = (request) => {
      let response = null
      if (request.multipartUploads) {
        const params = []
        for (const [key, value] of Object.entries(request.multipartUploads)) {
          const pair = []
          pair.push(repr(key))
          const fileProvider = prepareDataProvider(value, null, '', 1)
          pair.push(fileProvider)
          params.push(pair)
        }
        response = callFunction('body', 'MultipartFormProvider', params)
      }
    
      return response
    }
    
    const isJsonString = (str) => {
      // Source: https://stackoverflow.com/a/3710226/5625738
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }
    
    const prepareDataProvider = (value, output, termination, indentLevel, isDataBinary, isDataRaw) => {
      if (typeof indentLevel === 'undefined' || indentLevel === null) indentLevel = 0
      if (typeof isDataBinary === 'undefined') isDataBinary = true
      if (!isDataRaw && value[0] === '@') {
        const filename = value.slice(1)
        // >> imformats % for seeing MATLAB supported image formats
        const isImageProvider = new Set(['jpeg', 'jpg', 'png', 'tif', 'gif']).has(filename.split('.')[1])
        const provider = isImageProvider ? 'ImageProvider' : 'FileProvider'
        if (!isDataBinary) {
          return [
            callFunction(output, 'fileread', repr(filename)),
            setVariableValue(`${output}(${output}==13 | ${output}==10)`, '[]')
          ]
        }
        return callFunction(output, provider, repr(filename), termination)
      }
    
      if (value === true) {
        return callFunction(output, 'FileProvider', '', termination)
      }
    
      if (typeof value !== 'number' && isJsonString(value)) {
        const obj = JSON.parse(value)
        // If fail to create a struct for the JSON, then return a string
        try {
          const structure = structify(obj, indentLevel)
          return callFunction(output, 'JSONProvider', structure, termination)
        } catch (e) {
          return callFunction(output, 'StringProvider', repr(value), termination)
        }
      }
    
      if (typeof value === 'number') {
        return callFunction(output, 'FormProvider', repr(value), termination)
      }
      const formValue = value.split('&').map(x => x.split('=').map(x => repr(x)))
      return callFunction(output, 'FormProvider', formValue, termination)
    }
    
    const prepareData = (request) => {
      let response = null
      if (request.dataArray) {
        const data = request.dataArray.map(x => x.split('=').map(x => {
          let ans = repr(x)
          try {
            const jsonData = JSON.parse(x)
            if (typeof jsonData === 'object') {
              ans = callFunction(null, 'JSONProvider', structify(jsonData, 1), '')
            }
          } catch (e) {}
    
          return ans
        }))
    
        response = callFunction('body', 'FormProvider', data)
      } else if (request.data) {
        response = prepareDataProvider(request.data, 'body', ';', 0, !!request.isDataBinary, !!request.isDataRaw)
        if (!response) {
          response = setVariableValue('body', repr(request.data))
        }
      }
      return response
    }
    
    const prepareRequestMessage = (request) => {
      let reqMessage = [repr(request.method)]
      if (request.cookie || request.headers) {
        reqMessage.push('header')
      } else if (request.method === 'get') {
        reqMessage = ''
      }
      if (containsBody(request)) {
        if (reqMessage.length === 1) {
          reqMessage.push('[]')
        }
        reqMessage.push('body')
      }
    
      // list as many params as necessary
      const params = ['uri.EncodedURI']
      if (request.auth || request.insecure) {
        params.push('options')
      }
    
      const response = [callFunction('response', 'RequestMessage', reqMessage,
        callFunction(null, '.send', params)
      )]
    
      return response.join('\n')
    }
    
    const toHTTPInterface = (request) => {
      return [
        '%% HTTP Interface',
        'import matlab.net.*',
        'import matlab.net.http.*',
        (containsBody(request) ? 'import matlab.net.http.io.*' : null),
        '',
        prepareQueryString(request),
        prepareCookies(request),
        prepareHeaders(request),
        prepareURI(request),
        prepareAuth(request),
        prepareMultipartUploads(request),
        prepareData(request),
        prepareRequestMessage(request),
        ''
      ]
    }
    
    module.exports = toHTTPInterface
    
    },{"./common":26}],28:[function(require,module,exports){
    const util = require('../../util')
    const toWebServices = require('./webservices')
    const toHTTPInterface = require('./httpinterface')
    
    // We polyfill the flat function for node 10 which is still the default node version on ubuntu 20.04
    if (!Array.prototype.flat) {
      Object.defineProperty(Array.prototype, 'flat', {
        value: function(depth = 1) {
          return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
          }, []);
        }
      });
    }
    
    const toMATLAB = (curlCommand) => {
      const request = util.parseCurlCommand(curlCommand)
      const lines = toWebServices(request).concat('', toHTTPInterface(request))
      return lines.flat().filter(line => line !== null).join('\n')
    }
    
    module.exports = toMATLAB
    
    },{"../../util":37,"./httpinterface":27,"./webservices":29}],29:[function(require,module,exports){
    const {
      repr, setVariableValue,
      callFunction, addCellArray,
      structify, containsBody,
      prepareQueryString, prepareCookies,
      cookieString, paramsString
    } = require('./common')
    
    const isSupportedByWebServices = (request) => {
      if (!new Set(['get', 'post', 'put', 'delete', 'patch']).has(request.method)) {
        return false
      }
      return !request.multipartUploads && !request.insecure
    }
    
    const parseWebOptions = (request) => {
      const options = {}
    
      // MATLAB uses GET in `webread` and POST in `webwrite` by default
      // thus, it is necessary to set the method for other requests
      if (request.method !== 'get' && request.method !== 'post') {
        options.RequestMethod = request.method
      }
    
      const headers = {}
      if (request.auth) {
        const [username, password] = request.auth.split(':')
        if (username !== '') {
          options.Username = username
          options.Password = password
        } else {
          headers.Authorization = `['Basic ' matlab.net.base64encode(${repr(username + ':' + password)})]`
        }
      }
    
      if (request.headers) {
        for (const [key, value] of Object.entries(request.headers)) {
          switch (key) {
            case 'User-Agent':
              options.UserAgent = value
              break
            case 'Content-Type':
              options.MediaType = value
              break
            case 'Cookie':
              headers.Cookie = value
              break
            case 'Accept':
              switch (value) {
                case 'application/json':
                  options.ContentType = 'json'
                  break
                case 'text/csv':
                  options.ContentType = 'table'
                  break
                case 'text/plain':
                case 'text/html':
                case 'application/javascript':
                case 'application/x-javascript':
                case 'application/x-www-form-urlencoded':
                  options.ContentType = 'text'
                  break
                case 'text/xml':
                case 'application/xml':
                  options.ContentType = 'xmldom'
                  break
                case 'application/octet-stream':
                  options.ContentType = 'binary'
                  break
                default:
                  if (value.startsWith('image/')) {
                    options.ContentType = 'image'
                  } else if (value.startsWith('audio/')) {
                    options.ContentType = 'audio'
                  } else {
                    headers[key] = value
                  }
              }
              break
            default:
              headers[key] = value
          }
        }
      }
    
      if (request.cookies) {
        headers.Cookie = cookieString
      }
    
      if (Object.entries(headers).length > 0) {
        // If key is on the same line as 'weboptions', there is only one parameter
        // otherwise keys are indented by one level in the next line.
        // An extra indentation level is given to the values's new lines in cell array
        const indentLevel = 1 + (Object.keys(options).length === 0 ? 0 : 1)
        options.HeaderFields = addCellArray(headers, ['Authorization', 'Cookie'], '', indentLevel)
      }
    
      return options
    }
    
    const prepareOptions = (request, options) => {
      const lines = []
      if (Object.keys(options).length === 0) {
        return lines
      }
      const pairValues = addCellArray(options, ['HeaderFields'], ',', 1, true)
      lines.push(callFunction('options', 'weboptions', pairValues))
    
      return lines
    }
    
    const prepareBasicURI = (request) => {
      const response = []
      if (request.query) {
        response.push(setVariableValue('baseURI', repr(request.urlWithoutQuery)))
        response.push(setVariableValue('uri', `[baseURI '?' ${paramsString}]`))
      } else {
        response.push(setVariableValue('uri', repr(request.url)))
      }
      return response
    }
    
    const prepareBasicData = (request) => {
      let response = []
      if (request.data) {
        if (typeof request.data === 'boolean') {
          response = setVariableValue('body', repr())
        } else if (request.data[0] === '@') {
          response.push(callFunction('body', 'fileread', repr(request.data.slice(1))))
    
          if (!request.isDataBinary) {
            response.push(setVariableValue('body(body==13 | body==10)', '[]'))
          }
        } else {
          // if the data is in JSON, store it as struct in MATLAB
          // otherwise just keep it as a char vector
          try {
            const jsonData = JSON.parse(request.data)
            if (typeof jsonData === 'object') {
              let jsonText = structify(jsonData)
              if (!jsonText.startsWith('struct')) jsonText = repr(jsonText)
              response = setVariableValue('body', jsonText)
            } else {
              response = setVariableValue('body', repr(request.data))
            }
          } catch (e) {
            response = setVariableValue('body', repr(request.data))
          }
        }
      }
      return response
    }
    
    const prepareWebCall = (request, options) => {
      const lines = []
      const webFunction = containsBody(request) ? 'webwrite' : 'webread'
    
      const params = ['uri']
      if (containsBody(request)) {
        params.push('body')
      }
      if (Object.keys(options).length > 0) {
        params.push('options')
      }
      lines.push(callFunction('response', webFunction, params))
    
      if (request.query) {
        params[0] = 'fullURI'
        lines.push('',
          '% As there is a query, a full URI may be necessary instead.',
          setVariableValue('fullURI', repr(request.url)),
          callFunction('response', webFunction, params)
        )
      }
      return lines
    }
    
    const toWebServices = (request) => {
      let lines = [
        '%% Web Access using Data Import and Export API'
      ]
    
      if (!isSupportedByWebServices(request)) {
        lines.push('% This is not possible with the webread/webwrite API')
        return lines
      }
    
      const options = parseWebOptions(request)
      lines = lines.concat([
        prepareQueryString(request),
        prepareCookies(request),
        prepareBasicURI(request),
        prepareBasicData(request),
        prepareOptions(request, options),
        prepareWebCall(request, options)
      ])
    
      return lines
    }
    
    module.exports = toWebServices
    
    },{"./common":26}],30:[function(require,module,exports){
    const util = require('../util')
    const querystring = require('query-string')
    const jsesc = require('jsesc')
    const quote = str => jsesc(str, { quotes: 'single' })
    
    const toPhp = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
    
      let headerString = false
      if (request.headers) {
        headerString = '$headers = array(\n'
        let i = 0
        const headerCount = Object.keys(request.headers).length
        for (const headerName in request.headers) {
          headerString += "    '" + headerName + "' => '" + quote(request.headers[headerName]) + "'"
          if (i < headerCount - 1) {
            headerString += ',\n'
          }
          i++
        }
        if (request.cookies) {
          const cookieString = quote(util.serializeCookies(request.cookies))
          headerString += ",\n    'Cookie' => '" + cookieString + "'"
        }
        headerString += '\n);'
      } else {
        headerString = '$headers = array();'
      }
    
      let optionsString = false
      if (request.auth) {
        const splitAuth = request.auth.split(':').map(quote)
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        optionsString = "$options = array('auth' => array('" + user + "', '" + password + "'));"
      }
    
      let dataString = false
      if (request.data) {
        if (typeof request.data === 'number') {
          request.data = request.data.toString()
        }
        const parsedQueryString = querystring.parse(request.data, { sort: false })
        dataString = '$data = array(\n'
        const dataCount = Object.keys(parsedQueryString).length
        if (dataCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]) {
          dataString = "$data = '" + quote(request.data) + "';"
        } else {
          let dataIndex = 0
          for (const key in parsedQueryString) {
            const value = parsedQueryString[key]
            dataString += "    '" + key + "' => '" + quote(value) + "'"
            if (dataIndex < dataCount - 1) {
              dataString += ',\n'
            }
            dataIndex++
          }
          dataString += '\n);'
        }
      }
      let requestLine = '$response = Requests::' + request.method + '(\'' + request.url + '\''
      requestLine += ', $headers'
      if (dataString) {
        requestLine += ', $data'
      }
      if (optionsString) {
        requestLine += ', $options'
      }
      requestLine += ');'
    
      let phpCode = '<?php\n'
      phpCode += 'include(\'vendor/rmccue/requests/library/Requests.php\');\n'
      phpCode += 'Requests::register_autoloader();\n'
      phpCode += headerString + '\n'
      if (dataString) {
        phpCode += dataString + '\n'
      }
      if (optionsString) {
        phpCode += optionsString + '\n'
      }
    
      phpCode += requestLine
    
      return phpCode + '\n'
    }
    
    module.exports = toPhp
    
    },{"../util":37,"jsesc":56,"query-string":62}],31:[function(require,module,exports){
    const util = require('../util')
    const jsesc = require('jsesc')
    const querystring = require('query-string')
    
    require('string.prototype.startswith')
    
    function reprWithVariable (value, hasEnvironmentVariable) {
      if (!value) {
        return "''"
      }
    
      if (!hasEnvironmentVariable) {
        return "'" + jsesc(value, { quotes: 'single' }) + "'"
      }
    
      return 'f"' + jsesc(value, { quotes: 'double' }) + '"'
    }
    
    function repr (value) {
      // In context of url parameters, don't accept nulls and such.
      return reprWithVariable(value, false)
    }
    
    function getQueryDict (request) {
      let queryDict = 'params = (\n'
      for (const paramName in request.query) {
        const rawValue = request.query[paramName]
        let paramValue
        if (Array.isArray(rawValue)) {
          paramValue = '[' + rawValue.map(repr).join(', ') + ']'
        } else {
          paramValue = repr(rawValue)
        }
        queryDict += '    (' + repr(paramName) + ', ' + paramValue + '),\n'
      }
      queryDict += ')\n'
      return queryDict
    }
    
    function getDataString (request) {
      if (typeof request.data === 'number') {
        request.data = request.data.toString()
      }
      if (!request.isDataRaw && request.data.startsWith('@')) {
        const filePath = request.data.slice(1)
        if (request.isDataBinary) {
          return 'data = open(\'' + filePath + '\', \'rb\').read()'
        } else {
          return 'data = open(\'' + filePath + '\')'
        }
      }
    
      const parsedQueryString = querystring.parse(request.data, { sort: false })
      const keyCount = Object.keys(parsedQueryString).length
      const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      const singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        return 'data = ' + repr(request.data) + '\n'
      } else {
        return getMultipleDataString(request, parsedQueryString)
      }
    }
    
    function getMultipleDataString (request, parsedQueryString) {
      let repeatedKey = false
      for (const key in parsedQueryString) {
        const value = parsedQueryString[key]
        if (Array.isArray(value)) {
          repeatedKey = true
        }
      }
    
      let dataString
      if (repeatedKey) {
        dataString = 'data = [\n'
        for (const key in parsedQueryString) {
          const value = parsedQueryString[key]
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              dataString += '  (' + repr(key) + ', ' + repr(value[i]) + '),\n'
            }
          } else {
            dataString += '  (' + repr(key) + ', ' + repr(value) + '),\n'
          }
        }
        dataString += ']\n'
      } else {
        dataString = 'data = {\n'
        const elementCount = Object.keys(parsedQueryString).length
        let i = 0
        for (const key in parsedQueryString) {
          const value = parsedQueryString[key]
          dataString += '  ' + repr(key) + ': ' + repr(value)
          if (i === elementCount - 1) {
            dataString += '\n'
          } else {
            dataString += ',\n'
          }
          ++i
        }
        dataString += '}\n'
      }
    
      return dataString
    }
    
    function getFilesString (request) {
      // http://docs.python-requests.org/en/master/user/quickstart/#post-a-multipart-encoded-file
      let filesString = 'files = {\n'
      for (const multipartKey in request.multipartUploads) {
        const multipartValue = request.multipartUploads[multipartKey]
        if (multipartValue.startsWith('@')) {
          const fileName = multipartValue.slice(1)
          filesString += '    ' + repr(multipartKey) + ': (' + repr(fileName) + ', open(' + repr(fileName) + ", 'rb')),\n"
        } else {
          filesString += '    ' + repr(multipartKey) + ': (None, ' + repr(multipartValue) + '),\n'
        }
      }
      filesString += '}\n'
    
      return filesString
    }
    
    // convertVarToStringFormat will convert if inputString to f"..." format
    // if inputString has possible variable as its substring
    function detectEnvVar (inputString) {
      // Using state machine to detect environment variable
      // Each character is an edge, state machine:
      // IN_ENV_VAR: means that currently we are iterating inside a possible environment variable
      // IN_STRING: means that currently we are iterating inside a normal string
      // For example:
      // "Hi my name is $USER_NAME !"
      // '$' --> will move state from IN_STRING to IN_ENV_VAR
      // ' ' --> will move state to IN_STRING, regardless the previous state
    
      const IN_ENV_VAR = 0
      const IN_STRING = 1
    
      // We only care for the unique element
      const detectedVariables = new Set()
      let currState = IN_STRING
      let envVarStartIndex = -1
    
      const whiteSpaceSet = new Set()
      whiteSpaceSet.add(' ')
      whiteSpaceSet.add('\n')
      whiteSpaceSet.add('\t')
    
      const modifiedString = []
      for (const idx in inputString) {
        const currIdx = +idx
        const currChar = inputString[currIdx]
        if (currState === IN_ENV_VAR && whiteSpaceSet.has(currChar)) {
          const newVariable = inputString.substring(envVarStartIndex, currIdx)
    
          if (newVariable !== '') {
            detectedVariables.add(newVariable)
    
            // Change $ -> {
            // Add } after the last variable name
            modifiedString.push('{' + newVariable + '}' + currChar)
          } else {
            modifiedString.push('$' + currChar)
          }
          currState = IN_STRING
          envVarStartIndex = -1
          continue
        }
    
        if (currState === IN_ENV_VAR) {
          // Skip until we actually have the new variable
          continue
        }
    
        // currState === IN_STRING
        if (currChar === '$') {
          currState = IN_ENV_VAR
          envVarStartIndex = currIdx + 1
        } else {
          modifiedString.push(currChar)
        }
      }
    
      if (currState === IN_ENV_VAR) {
        const newVariable = inputString.substring(envVarStartIndex, inputString.length)
    
        if (newVariable !== '') {
          detectedVariables.add(newVariable)
          modifiedString.push('{' + newVariable + '}')
        } else {
          modifiedString.push('$')
        }
      }
    
      return [detectedVariables, modifiedString.join('')]
    }
    
    const toPython = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
    
      // Currently, only assuming that the env-var only used in
      // the value part of cookies, params, or body
      const osVariables = new Set()
    
      let cookieDict
      if (request.cookies) {
        cookieDict = 'cookies = {\n'
        for (const cookieName in request.cookies) {
          const [detectedVars, modifiedString] = detectEnvVar(request.cookies[cookieName])
    
          const hasEnvironmentVariable = detectedVars.size > 0
    
          for (const newVar of detectedVars) {
            osVariables.add(newVar)
          }
    
          cookieDict += '    ' + repr(cookieName) + ': ' + reprWithVariable(modifiedString, hasEnvironmentVariable) + ',\n'
        }
        cookieDict += '}\n'
      }
      let headerDict
      if (request.headers) {
        headerDict = 'headers = {\n'
        for (const headerName in request.headers) {
          const [detectedVars, modifiedString] = detectEnvVar(request.headers[headerName])
    
          const hasVariable = detectedVars.size > 0
    
          for (const newVar of detectedVars) {
            osVariables.add(newVar)
          }
    
          headerDict += '    ' + repr(headerName) + ': ' + reprWithVariable(modifiedString, hasVariable) + ',\n'
        }
        headerDict += '}\n'
      }
    
      let queryDict
      if (request.query) {
        queryDict = getQueryDict(request)
      }
    
      let dataString
      let filesString
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        dataString = getDataString(request)
      } else if (request.multipartUploads) {
        filesString = getFilesString(request)
      }
      // curl automatically prepends 'http' if the scheme is missing, but python fails and returns an error
      // we tack it on here to mimic curl
      if (!request.url.match(/https?:/)) {
        request.url = 'http://' + request.url
      }
      if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery
      }
      let requestLineWithUrlParams = 'response = requests.' + request.method + '(\'' + request.urlWithoutQuery + '\''
      let requestLineWithOriginalUrl = 'response = requests.' + request.method + '(\'' + request.url + '\''
    
      let requestLineBody = ''
      if (request.headers) {
        requestLineBody += ', headers=headers'
      }
      if (request.query) {
        requestLineBody += ', params=params'
      }
      if (request.cookies) {
        requestLineBody += ', cookies=cookies'
      }
      if (typeof request.data === 'string') {
        requestLineBody += ', data=data'
      } else if (request.multipartUploads) {
        requestLineBody += ', files=files'
      }
      if (request.insecure) {
        requestLineBody += ', verify=False'
      }
      if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        requestLineBody += ', auth=(' + repr(user) + ', ' + repr(password) + ')'
      }
      requestLineBody += ')'
    
      requestLineWithOriginalUrl += requestLineBody.replace(', params=params', '')
      requestLineWithUrlParams += requestLineBody
    
      let pythonCode = ''
    
      // Sort import by name
      if (osVariables.size > 0) {
        pythonCode += 'import os\n'
      }
    
      pythonCode += 'import requests\n\n'
    
      if (osVariables.size > 0) {
        for (const osVar of osVariables) {
          const line = `${osVar} = os.getenv('${osVar}')\n`
          pythonCode += line
        }
    
        pythonCode += '\n'
      }
    
      if (cookieDict) {
        pythonCode += cookieDict + '\n'
      }
      if (headerDict) {
        pythonCode += headerDict + '\n'
      }
      if (queryDict) {
        pythonCode += queryDict + '\n'
      }
      if (dataString) {
        pythonCode += dataString + '\n'
      } else if (filesString) {
        pythonCode += filesString + '\n'
      }
      pythonCode += requestLineWithUrlParams
    
      if (request.query) {
        pythonCode += '\n\n' +
                '#NB. Original query string below. It seems impossible to parse and\n' +
                '#reproduce query strings 100% accurately so the one below is given\n' +
                '#in case the reproduced version is not "correct".\n'
        pythonCode += '# ' + requestLineWithOriginalUrl
      }
    
      return pythonCode + '\n'
    }
    
    module.exports = toPython
    
    },{"../util":37,"jsesc":56,"query-string":62,"string.prototype.startswith":69}],32:[function(require,module,exports){
    // Author: Bob Rudis (bob@rud.is)
    
    const util = require('../util')
    const jsesc = require('jsesc')
    const querystring = require('query-string')
    
    require('string.prototype.startswith')
    
    function reprn (value) { // back-tick quote names
      if (!value) {
        return '``'
      } else {
        return '`' + value + '`'
      }
    }
    
    function repr (value) {
      // In context of url parameters, don't accept nulls and such.
      if (!value) {
        return "''"
      } else {
        return "'" + jsesc(value, { quotes: 'single' }) + "'"
      }
    }
    
    function getQueryDict (request) {
      let queryDict = 'params = list(\n'
      queryDict += Object.keys(request.query).map((paramName) => {
        const rawValue = request.query[paramName]
        let paramValue
        if (Array.isArray(rawValue)) {
          paramValue = 'c(' + rawValue.map(repr).join(', ') + ')'
        } else {
          paramValue = repr(rawValue)
        }
        return ('  ' + reprn(paramName) + ' = ' + paramValue)
      }).join(',\n')
      queryDict += '\n)\n'
      return queryDict
    }
    
    function getDataString (request) {
      if (typeof request.data === 'number') {
        request.data = request.data.toString()
      }
      if (!request.isDataRaw && request.data.startsWith('@')) {
        const filePath = request.data.slice(1)
        return 'data = upload_file(\'' + filePath + '\')'
      }
    
      const parsedQueryString = querystring.parse(request.data, { sort: false })
      const keyCount = Object.keys(parsedQueryString).length
      const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      const singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        return 'data = ' + repr(request.data) + '\n'
      } else {
        return getMultipleDataString(request, parsedQueryString)
      }
    }
    
    function getMultipleDataString (request, parsedQueryString) {
      let repeatedKey = false
      for (const key in parsedQueryString) {
        const value = parsedQueryString[key]
        if (Array.isArray(value)) {
          repeatedKey = true
        }
      }
    
      let dataString
      if (repeatedKey) {
        const els = []
        dataString = 'data = list(\n'
        for (const key in parsedQueryString) {
          const value = parsedQueryString[key]
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              els.push('  ' + reprn(key) + ' = ' + repr(value[i]))
            }
          } else {
            els.push('  ' + reprn(key) + ' = ' + repr(value))
          }
        }
        dataString += els.join(',\n')
        dataString += '\n)\n'
      } else {
        dataString = 'data = list(\n'
        dataString += Object.keys(parsedQueryString).map((key) => {
          const value = parsedQueryString[key]
          return ('  ' + reprn(key) + ' = ' + repr(value))
        }).join(',\n')
        dataString += '\n)\n'
      }
    
      return dataString
    }
    
    function getFilesString (request) {
      // http://docs.rstats-requests.org/en/master/user/quickstart/#post-a-multipart-encoded-file
      let filesString = 'files = list(\n'
      filesString += Object.keys(request.multipartUploads).map((multipartKey) => {
        const multipartValue = request.multipartUploads[multipartKey]
        let fileParam
        if (multipartValue.startsWith('@')) {
          const fileName = multipartValue.slice(1)
          // filesString += '    ' + reprn(multipartKey) + ' (' + repr(fileName) + ', upload_file(' + repr(fileName) + '))'
          fileParam = '  ' + reprn(multipartKey) + ' = upload_file(' + repr(fileName) + ')'
        } else {
          fileParam = '  ' + reprn(multipartKey) + ' = ' + repr(multipartValue) + ''
        }
        return (fileParam)
      }).join(',\n')
      filesString += '\n)\n'
    
      return filesString
    }
    
    const torstats = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      let cookieDict
      if (request.cookies) {
        cookieDict = 'cookies = c(\n'
        cookieDict += Object.keys(request.cookies).map(cookieName => '  ' + repr(cookieName) + ' = ' + repr(request.cookies[cookieName])).join(',\n')
        cookieDict += '\n)\n'
      }
      let headerDict
      if (request.headers) {
        const hels = []
        headerDict = 'headers = c(\n'
        for (const headerName in request.headers) {
          hels.push('  ' + reprn(headerName) + ' = ' + repr(request.headers[headerName]))
        }
        headerDict += hels.join(',\n')
        headerDict += '\n)\n'
      }
    
      let queryDict
      if (request.query) {
        queryDict = getQueryDict(request)
      }
    
      let dataString
      let filesString
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        dataString = getDataString(request)
      } else if (request.multipartUploads) {
        filesString = getFilesString(request)
      }
      // curl automatically prepends 'http' if the scheme is missing, but rstats fails and returns an error
      // we tack it on here to mimic curl
      if (!request.url.match(/https?:/)) {
        request.url = 'http://' + request.url
      }
      if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery
      }
      let requestLineWithUrlParams = 'res <- httr::' + request.method.toUpperCase() + '(url = \'' + request.urlWithoutQuery + '\''
      let requestLineWithOriginalUrl = 'res <- httr::' + request.method.toUpperCase() + '(url = \'' + request.url + '\''
    
      let requestLineBody = ''
      if (request.headers) {
        requestLineBody += ', httr::add_headers(.headers=headers)'
      }
      if (request.query) {
        requestLineBody += ', query = params'
      }
      if (request.cookies) {
        requestLineBody += ', httr::set_cookies(.cookies = cookies)'
      }
      if (typeof request.data === 'string') {
        requestLineBody += ', body = data'
      } else if (request.multipartUploads) {
        requestLineBody += ', body = files'
      }
      if (request.insecure) {
        requestLineBody += ', config = httr::config(ssl_verifypeer = FALSE)'
      }
      if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        requestLineBody += ', httr::authenticate(' + repr(user) + ', ' + repr(password) + ')'
      }
      requestLineBody += ')'
    
      requestLineWithOriginalUrl += requestLineBody.replace(', query = params', '')
      requestLineWithUrlParams += requestLineBody
    
      let rstatsCode = ''
      rstatsCode += 'require(httr)\n\n'
      if (cookieDict) {
        rstatsCode += cookieDict + '\n'
      }
      if (headerDict) {
        rstatsCode += headerDict + '\n'
      }
      if (queryDict) {
        rstatsCode += queryDict + '\n'
      }
      if (dataString) {
        rstatsCode += dataString + '\n'
      } else if (filesString) {
        rstatsCode += filesString + '\n'
      }
      rstatsCode += requestLineWithUrlParams
    
      if (request.query) {
        rstatsCode += '\n\n' +
                '#NB. Original query string below. It seems impossible to parse and\n' +
                '#reproduce query strings 100% accurately so the one below is given\n' +
                '#in case the reproduced version is not "correct".\n'
        rstatsCode += '# ' + requestLineWithOriginalUrl
      }
    
      return rstatsCode + '\n'
    }
    
    module.exports = torstats
    
    },{"../util":37,"jsesc":56,"query-string":62,"string.prototype.startswith":69}],33:[function(require,module,exports){
    const util = require('../util')
    const jsesc = require('jsesc')
    
    const INDENTATION = ' '.repeat(4)
    const indent = (line, level = 1) => INDENTATION.repeat(level) + line
    const quote = str => jsesc(str, { quotes: 'double' })
    
    function toRust (curlCommand) {
      const lines = ['extern crate reqwest;']
      const request = util.parseCurlCommand(curlCommand)
    
      const hasHeaders = request.headers || request.cookies
      {
        // Generate imports.
        const imports = [
          { want: 'header', condition: hasHeaders },
          { want: 'multipart', condition: !!request.multipartUploads }
        ].filter(i => i.condition).map(i => i.want)
    
        if (imports.length > 1) {
          lines.push(`use reqwest::{${imports.join(', ')}};`)
        } else if (imports.length) {
          lines.push(`use reqwest::${imports[0]};`)
        }
      }
      lines.push('', 'fn main() -> Result<(), Box<dyn std::error::Error>> {')
    
      if (request.headers || request.cookies) {
        lines.push(indent('let mut headers = header::HeaderMap::new();'))
        for (const headerName in request.headers) {
          const headerValue = quote(request.headers[headerName])
          lines.push(indent(`headers.insert("${headerName}", "${headerValue}".parse().unwrap());`))
        }
    
        if (request.cookies) {
          const cookies = Object.keys(request.cookies)
            .map(key => `${key}=${request.cookies[key]}`)
            .join('; ')
          lines.push(indent(`headers.insert(header::COOKIE, "${quote(cookies)}".parse().unwrap());`))
        }
    
        lines.push('')
      }
    
      if (request.multipartUploads) {
        lines.push(indent('let form = multipart::Form::new()'))
        const parts = Object.keys(request.multipartUploads).map(partType => {
          const partValue = request.multipartUploads[partType]
          switch (partType) {
            case 'image':
            case 'file': {
              const path = partValue.split('@')[1]
              return indent(`.file("${partType}", "${quote(path)}")?`, 2)
            }
            default:
              return indent(`.text("${partType}", "${quote(partValue)}")`, 2)
          }
        })
        parts[parts.length - 1] += ';'
        lines.push(...parts, '')
      }
    
      lines.push(indent('let res = reqwest::Client::new()'))
      lines.push(indent(`.${request.method}("${quote(request.url)}")`, 2))
    
      if (request.auth) {
        const [user, password] = request.auth.split(':', 2).map(quote)
        lines.push(indent(`.basic_auth("${user || ''}", Some("${password || ''}"))`, 2))
      }
    
      if (hasHeaders) {
        lines.push(indent('.headers(headers)', 2))
      }
    
      if (request.multipartUploads) {
        lines.push(indent('.multipart(form)', 2))
      }
    
      if (request.data) {
        if (typeof request.data === 'string' && request.data.indexOf('\n') !== -1) {
          // Use raw strings for multiline content
          lines.push(
            indent('.body(r#"', 2),
            request.data,
            '"#',
            indent(')', 2)
          )
        } else {
          lines.push(indent(`.body("${quote(request.data)}")`, 2))
        }
      }
    
      lines.push(
        indent('.send()?', 2),
        indent('.text()?;', 2),
        indent('println!("{}", res);'),
        '',
        indent('Ok(())'),
        '}'
      )
    
      return lines.join('\n') + '\n'
    }
    
    module.exports = toRust
    
    },{"../util":37,"jsesc":56}],34:[function(require,module,exports){
    const util = require('../util')
    const yaml = require('yamljs')
    const jsesc = require('jsesc')
    const querystring = require('query-string')
    
    function getDataString (request) {
      let mimeType = 'application/json'
      if (typeof request.data === 'number') {
        request.data = request.data.toString()
        mimeType = 'text/plain'
      }
      if (request.data.indexOf("'") > -1) {
        request.data = jsesc(request.data)
      }
      const parsedQueryString = querystring.parse(request.data, { sort: false })
      const keyCount = Object.keys(parsedQueryString).length
      const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]
      const singularData = request.isDataBinary || singleKeyOnly
      if (singularData) {
        return {
          mimeType: mimeType,
          text: JSON.parse(request.data)
        }
      } else {
        for (const paramName in request.headers) {
          if (paramName === 'Content-Type') {
            mimeType = request.headers[paramName]
          }
        }
        return {
          mimeType: mimeType,
          text: request.data
        }
      }
    }
    
    function getQueryList (request) {
      const queryList = []
      for (const paramName in request.query) {
        const rawValue = request.query[paramName]
        queryList.push({ name: paramName, value: rawValue })
      }
      return queryList
    }
    
    const toStrest = curlCommand => {
      const request = util.parseCurlCommand(curlCommand)
      const response = { version: 2 }
      if (request.insecure) {
        response.allowInsecure = true
      }
      if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery
      }
      response.requests = {
        curl_converter: {
          request: {
            url: request.urlWithoutQuery.toString(),
            method: request.method.toUpperCase()
          }
        }
      }
      if (typeof request.data === 'string' || typeof request.data === 'number') {
        response.requests.curl_converter.request.postData = getDataString(request)
      }
    
      if (request.headers) {
        response.requests.curl_converter.request.headers = []
        for (const prop in request.headers) {
          response.requests.curl_converter.request.headers.push({
            name: prop,
            value: request.headers[prop]
          })
        }
        if (request.cookieString) {
          response.requests.curl_converter.request.headers.push({
            name: 'Cookie',
            value: request.cookieString
          })
        }
      }
      if (request.auth) {
        response.requests.curl_converter.auth = {
          basic: {}
        }
        if (request.auth.split(':')[0]) {
          response.requests.curl_converter.auth.basic.username = request.auth.split(':')[0]
        }
        response.requests.curl_converter.auth.basic.password = request.auth.split(':')[1]
      }
    
      let queryList
      if (request.query) {
        queryList = getQueryList(request)
        response.requests.curl_converter.request.queryString = queryList
      }
    
      const yamlString = yaml.stringify(response, 100, 2)
      return yamlString
    }
    
    module.exports = toStrest
    
    },{"../util":37,"jsesc":56,"query-string":62,"yamljs":98}],35:[function(require,module,exports){
    'use strict'
    
    const toAnsible = require('./generators/ansible.js')
    const toDart = require('./generators/dart.js')
    const toElixir = require('./generators/elixir.js')
    const toBrowser = require('./generators/javascript/browser.js')
    const toGo = require('./generators/go.js')
    const toJsonString = require('./generators/json.js')
    const toNodeFetch = require('./generators/javascript/node-fetch.js')
    const toNodeRequest = require('./generators/javascript/node-request.js')
    const toPhp = require('./generators/php.js')
    const toPython = require('./generators/python.js')
    const toR = require('./generators/r.js')
    const toRust = require('./generators/rust')
    const toStrest = require('./generators/strest.js')
    const toMATLAB = require('./generators/matlab/matlab.js')
    const toJava = require('./generators/java.js')
    
    module.exports = {
      toAnsible: toAnsible,
      toBrowser: toBrowser,
      toDart: toDart,
      toGo: toGo,
      toJsonString: toJsonString,
      toNodeFetch: toNodeFetch,
      toNodeRequest: toNodeRequest,
      toPhp: toPhp,
      toPython: toPython,
      toElixir: toElixir,
      toR: toR,
      toRust: toRust,
      toStrest: toStrest,
      toMATLAB: toMATLAB,
      toJava: toJava
    }
    
    },{"./generators/ansible.js":16,"./generators/dart.js":17,"./generators/elixir.js":18,"./generators/go.js":19,"./generators/java.js":20,"./generators/javascript/browser.js":21,"./generators/javascript/node-fetch.js":23,"./generators/javascript/node-request.js":24,"./generators/json.js":25,"./generators/matlab/matlab.js":28,"./generators/php.js":30,"./generators/python.js":31,"./generators/r.js":32,"./generators/rust":33,"./generators/strest.js":34}],36:[function(require,module,exports){
    const ansibleTemplate = `-
      name: '{{ request.urlWithoutQuery }}'
      uri:
        url: '{{ request.url }}'
        method: {{ request.method | upper }}
    {%- if (request.data | isString) or (request.data | isNumber) %}
        body:
          {{ data | dump }}
        {%- if request.data | isNumber %}
        body_format: raw
        {%- else %}
        body_format: json
        {%- endif %}
    {%- endif %}
    {%- if request.headers %}
        headers:
        {%- for key, value in request.headers %}
          {{ key }}: '{{ value }}'
        {%- endfor %}
        {%- if request.cookieString %}
          Cookie: '{{ request.cookieString }}'
        {%- endif %}
    {%- endif %}
    {%- if request.auth %}
        {%- set url_username = request.auth.split(":")[0] %}
        {%- set url_password = request.auth.split(":")[1] %}
        {%- if url_username %}
        url_username: {{ url_username }}
        {%- endif %}
        {%- if url_password %}
        url_password: {{ url_password }}
        {%- endif %}
    {%- endif %}
    {%- if request.insecure %}
        validate_certs: no
    {%- endif %}
      register: result
    `
    
    module.exports = ansibleTemplate
    
    },{}],37:[function(require,module,exports){
    const cookie = require('cookie')
    const yargs = require('yargs')
    const URL = require('url')
    const querystring = require('query-string')
    const nunjucks = require('nunjucks')
    
    const env = nunjucks.configure(['templates/'], { // set folders with templates
      autoescape: false
    })
    env.addFilter('isArr', something => Array.isArray(something))
    env.addFilter('isString', something => typeof something === 'string')
    env.addFilter('isNumber', something => typeof something === 'number')
    
    const parseCurlCommand = curlCommand => {
      // Remove newlines (and from continuations)
      curlCommand = curlCommand.replace(/\\\r|\\\n/g, '')
    
      // Remove extra whitespace
      curlCommand = curlCommand.replace(/\s+/g, ' ')
    
      // yargs parses -XPOST as separate arguments. just prescreen for it.
      curlCommand = curlCommand.replace(/ -XPOST/, ' -X POST')
      curlCommand = curlCommand.replace(/ -XGET/, ' -X GET')
      curlCommand = curlCommand.replace(/ -XPUT/, ' -X PUT')
      curlCommand = curlCommand.replace(/ -XPATCH/, ' -X PATCH')
      curlCommand = curlCommand.replace(/ -XDELETE/, ' -X DELETE')
      // Safari adds `-Xnull` if is unable to determine the request type, it can be ignored
      curlCommand = curlCommand.replace(/ -Xnull/, ' ')
      curlCommand = curlCommand.trim()
    
      // Parse with some understanding of the meanings of flags.  In particular,
      // boolean flags can be trouble if the URL to fetch follows immediately
      // after, since it will be taken as an argument to the flag rather than
      // interpreted as a positional argument.  Someone should add all the flags
      // likely to cause trouble here.
      const parsedArguments = yargs
        .boolean(['I', 'head', 'compressed', 'L', 'k', 'silent', 's'])
        .alias('H', 'header')
        .alias('A', 'user-agent')
        .parse(curlCommand)
    
      let cookieString
      let cookies
      let url = parsedArguments._[1]
    
      // if url argument wasn't where we expected it, try to find it in the other arguments
      if (!url) {
        for (const argName in parsedArguments) {
          if (typeof parsedArguments[argName] === 'string') {
            if (parsedArguments[argName].indexOf('http') === 0 || parsedArguments[argName].indexOf('www.') === 0) {
              url = parsedArguments[argName]
            }
          }
        }
      }
    
      let headers
    
      if (parsedArguments.header) {
        if (!headers) {
          headers = {}
        }
        if (!Array.isArray(parsedArguments.header)) {
          parsedArguments.header = [parsedArguments.header]
        }
        parsedArguments.header.forEach(header => {
          if (header.indexOf('Cookie') !== -1) {
            cookieString = header
          } else {
            const components = header.split(/:(.*)/)
            if (components[1]) {
              headers[components[0]] = components[1].trim()
            }
          }
        })
      }
    
      if (parsedArguments['user-agent']) {
        if (!headers) {
          headers = {}
        }
        headers['User-Agent'] = parsedArguments['user-agent']
      }
    
      if (parsedArguments.b) {
        cookieString = parsedArguments.b
      }
      if (parsedArguments.cookie) {
        cookieString = parsedArguments.cookie
      }
      let multipartUploads
      if (parsedArguments.F) {
        multipartUploads = {}
        if (!Array.isArray(parsedArguments.F)) {
          parsedArguments.F = [parsedArguments.F]
        }
        parsedArguments.F.forEach(multipartArgument => {
          // input looks like key=value. value could be json or a file path prepended with an @
          const splitArguments = multipartArgument.split('=', 2)
          const key = splitArguments[0]
          const value = splitArguments[1]
          multipartUploads[key] = value
        })
      }
      if (cookieString) {
        const cookieParseOptions = {
          decode: function (s) { return s }
        }
        // separate out cookie headers into separate data structure
        // note: cookie is case insensitive
        cookies = cookie.parse(cookieString.replace(/^Cookie: /gi, ''), cookieParseOptions)
      }
      let method
      if (parsedArguments.X === 'POST') {
        method = 'post'
      } else if (parsedArguments.X === 'PUT' ||
        parsedArguments.T) {
        method = 'put'
      } else if (parsedArguments.X === 'PATCH') {
        method = 'patch'
      } else if (parsedArguments.X === 'DELETE') {
        method = 'delete'
      } else if (parsedArguments.X === 'OPTIONS') {
        method = 'options'
      } else if ((parsedArguments.d ||
        parsedArguments.data ||
        parsedArguments['data-ascii'] ||
        parsedArguments['data-binary'] ||
        parsedArguments['data-raw'] ||
        parsedArguments.F ||
        parsedArguments.form) && !((parsedArguments.G || parsedArguments.get))) {
        method = 'post'
      } else if (parsedArguments.I ||
        parsedArguments.head) {
        method = 'head'
      } else {
        method = 'get'
      }
    
      const compressed = !!parsedArguments.compressed
      const urlObject = URL.parse(url) // eslint-disable-line
    
      // if GET request with data, convert data to query string
      // NB: the -G flag does not change the http verb. It just moves the data into the url.
      if (parsedArguments.G || parsedArguments.get) {
        urlObject.query = urlObject.query ? urlObject.query : ''
        const option = 'd' in parsedArguments ? 'd' : 'data' in parsedArguments ? 'data' : null
        if (option) {
          let urlQueryString = ''
    
          if (url.indexOf('?') < 0) {
            url += '?'
          } else {
            urlQueryString += '&'
          }
    
          if (typeof (parsedArguments[option]) === 'object') {
            urlQueryString += parsedArguments[option].join('&')
          } else {
            urlQueryString += parsedArguments[option]
          }
          urlObject.query += urlQueryString
          url += urlQueryString
          delete parsedArguments[option]
        }
      }
      if (urlObject.query && urlObject.query.endsWith('&')) {
        urlObject.query = urlObject.query.slice(0, -1)
      }
      const query = querystring.parse(urlObject.query, { sort: false })
      for (const param in query) {
        if (query[param] === null) {
          query[param] = ''
        }
      }
    
      urlObject.search = null // Clean out the search/query portion.
      const request = {
        url: url,
        urlWithoutQuery: URL.format(urlObject)
      }
      if (compressed) {
        request.compressed = true
      }
    
      if (Object.keys(query).length > 0) {
        request.query = query
      }
      if (headers) {
        request.headers = headers
      }
      request.method = method
    
      if (cookies) {
        request.cookies = cookies
        request.cookieString = cookieString.replace('Cookie: ', '')
      }
      if (multipartUploads) {
        request.multipartUploads = multipartUploads
      }
      if (parsedArguments.data) {
        request.data = parsedArguments.data
      } else if (parsedArguments['data-binary']) {
        request.data = parsedArguments['data-binary']
        request.isDataBinary = true
      } else if (parsedArguments.d) {
        request.data = parsedArguments.d
      } else if (parsedArguments['data-ascii']) {
        request.data = parsedArguments['data-ascii']
      } else if (parsedArguments['data-raw']) {
        request.data = parsedArguments['data-raw']
        request.isDataRaw = true
      }
    
      if (parsedArguments.u) {
        request.auth = parsedArguments.u
      }
      if (parsedArguments.user) {
        request.auth = parsedArguments.user
      }
      if (Array.isArray(request.data)) {
        request.dataArray = request.data
        request.data = request.data.join('&')
      }
    
      if (parsedArguments.k || parsedArguments.insecure) {
        request.insecure = true
      }
      return request
    }
    
    const serializeCookies = cookieDict => {
      let cookieString = ''
      let i = 0
      const cookieCount = Object.keys(cookieDict).length
      for (const cookieName in cookieDict) {
        const cookieValue = cookieDict[cookieName]
        cookieString += cookieName + '=' + cookieValue
        if (i < cookieCount - 1) {
          cookieString += '; '
        }
        i++
      }
      return cookieString
    }
    
    module.exports = {
      parseCurlCommand: parseCurlCommand,
      serializeCookies: serializeCookies
    }
    
    },{"cookie":15,"nunjucks":57,"query-string":62,"url":71,"yargs":101}],38:[function(require,module,exports){
    'use strict';
    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');
    
    function decodeComponents(components, split) {
        try {
            // Try to decode the entire string first
            return decodeURIComponent(components.join(''));
        } catch (err) {
            // Do nothing
        }
    
        if (components.length === 1) {
            return components;
        }
    
        split = split || 1;
    
        // Split the array in 2 parts
        var left = components.slice(0, split);
        var right = components.slice(split);
    
        return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }
    
    function decode(input) {
        try {
            return decodeURIComponent(input);
        } catch (err) {
            var tokens = input.match(singleMatcher);
    
            for (var i = 1; i < tokens.length; i++) {
                input = decodeComponents(tokens, i).join('');
    
                tokens = input.match(singleMatcher);
            }
    
            return input;
        }
    }
    
    function customDecodeURIComponent(input) {
        // Keep track of all the replacements and prefill the map with the `BOM`
        var replaceMap = {
            '%FE%FF': '\uFFFD\uFFFD',
            '%FF%FE': '\uFFFD\uFFFD'
        };
    
        var match = multiMatcher.exec(input);
        while (match) {
            try {
                // Decode as big chunks as possible
                replaceMap[match[0]] = decodeURIComponent(match[0]);
            } catch (err) {
                var result = decode(match[0]);
    
                if (result !== match[0]) {
                    replaceMap[match[0]] = result;
                }
            }
    
            match = multiMatcher.exec(input);
        }
    
        // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
        replaceMap['%C2'] = '\uFFFD';
    
        var entries = Object.keys(replaceMap);
    
        for (var i = 0; i < entries.length; i++) {
            // Replace all decoded components
            var key = entries[i];
            input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
        }
    
        return input;
    }
    
    module.exports = function (encodedURI) {
        if (typeof encodedURI !== 'string') {
            throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
        }
    
        try {
            encodedURI = encodedURI.replace(/\+/g, ' ');
    
            // Try the built in decoder first
            return decodeURIComponent(encodedURI);
        } catch (err) {
            // Fallback to a more advanced decoder
            return customDecodeURIComponent(encodedURI);
        }
    };
    
    },{}],39:[function(require,module,exports){
    "use strict";
    
    module.exports = function () {
      // https://mths.be/emoji
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
    
    },{}],40:[function(require,module,exports){
    'use strict';
    
    var GetIntrinsic = require('get-intrinsic');
    
    var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
    if ($gOPD) {
        try {
            $gOPD([], 'length');
        } catch (e) {
            // IE 8 has a broken gOPD
            $gOPD = null;
        }
    }
    
    module.exports = $gOPD;
    
    },{"get-intrinsic":47}],41:[function(require,module,exports){
    const { dirname, resolve } = require('path');
    const { readdirSync, statSync } = require('fs');
    
    module.exports = function (start, callback) {
        let dir = resolve('.', start);
        let tmp, stats = statSync(dir);
    
        if (!stats.isDirectory()) {
            dir = dirname(dir);
        }
    
        while (true) {
            tmp = callback(dir, readdirSync(dir));
            if (tmp) return resolve(dir, tmp);
            dir = dirname(tmp = dir);
            if (tmp === dir) break;
        }
    }
    
    },{"fs":7,"path":59}],42:[function(require,module,exports){
    'use strict';
    module.exports = function (obj, predicate) {
        var ret = {};
        var keys = Object.keys(obj);
        var isArr = Array.isArray(predicate);
    
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = obj[key];
    
            if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
                ret[key] = val;
            }
        }
    
        return ret;
    };
    
    },{}],43:[function(require,module,exports){
    
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    
    module.exports = function forEach (obj, fn, ctx) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (l === +l) {
            for (var i = 0; i < l; i++) {
                fn.call(ctx, obj[i], i, obj);
            }
        } else {
            for (var k in obj) {
                if (hasOwn.call(obj, k)) {
                    fn.call(ctx, obj[k], k, obj);
                }
            }
        }
    };
    
    
    },{}],44:[function(require,module,exports){
    'use strict';
    
    /* eslint no-invalid-this: 1 */
    
    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = '[object Function]';
    
    module.exports = function bind(that) {
        var target = this;
        if (typeof target !== 'function' || toStr.call(target) !== funcType) {
            throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
    
        var bound;
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );
            }
        };
    
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }
    
        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);
    
        if (target.prototype) {
            var Empty = function Empty() {};
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
    
        return bound;
    };
    
    },{}],45:[function(require,module,exports){
    'use strict';
    
    var implementation = require('./implementation');
    
    module.exports = Function.prototype.bind || implementation;
    
    },{"./implementation":44}],46:[function(require,module,exports){
    "use strict";
    // Call this function in a another function to find out the file from
    // which that function was called from. (Inspects the v8 stack trace)
    //
    // Inspired by http://stackoverflow.com/questions/13227489
    module.exports = function getCallerFile(position) {
        if (position === void 0) { position = 2; }
        if (position >= Error.stackTraceLimit) {
            throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
        }
        var oldPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) { return stack; };
        var stack = new Error().stack;
        Error.prepareStackTrace = oldPrepareStackTrace;
        if (stack !== null && typeof stack === 'object') {
            // stack[0] holds this file
            // stack[1] holds where this function was called
            // stack[2] holds the file we're interested in
            return stack[position] ? stack[position].getFileName() : undefined;
        }
    };
    
    },{}],47:[function(require,module,exports){
    'use strict';
    
    var undefined;
    
    var $SyntaxError = SyntaxError;
    var $Function = Function;
    var $TypeError = TypeError;
    
    // eslint-disable-next-line consistent-return
    var getEvalledConstructor = function (expressionSyntax) {
        try {
            return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
        } catch (e) {}
    };
    
    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
        try {
            $gOPD({}, '');
        } catch (e) {
            $gOPD = null; // this is IE 8, which has a broken gOPD
        }
    }
    
    var throwTypeError = function () {
        throw new $TypeError();
    };
    var ThrowTypeError = $gOPD
        ? (function () {
            try {
                // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
                arguments.callee; // IE 8 does not throw here
                return throwTypeError;
            } catch (calleeThrows) {
                try {
                    // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
                    return $gOPD(arguments, 'callee').get;
                } catch (gOPDthrows) {
                    return throwTypeError;
                }
            }
        }())
        : throwTypeError;
    
    var hasSymbols = require('has-symbols')();
    
    var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto
    
    var needsEval = {};
    
    var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);
    
    var INTRINSICS = {
        '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
        '%Array%': Array,
        '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
        '%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
        '%AsyncFromSyncIteratorPrototype%': undefined,
        '%AsyncFunction%': needsEval,
        '%AsyncGenerator%': needsEval,
        '%AsyncGeneratorFunction%': needsEval,
        '%AsyncIteratorPrototype%': needsEval,
        '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
        '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
        '%Boolean%': Boolean,
        '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
        '%Date%': Date,
        '%decodeURI%': decodeURI,
        '%decodeURIComponent%': decodeURIComponent,
        '%encodeURI%': encodeURI,
        '%encodeURIComponent%': encodeURIComponent,
        '%Error%': Error,
        '%eval%': eval, // eslint-disable-line no-eval
        '%EvalError%': EvalError,
        '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
        '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
        '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
        '%Function%': $Function,
        '%GeneratorFunction%': needsEval,
        '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
        '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
        '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
        '%isFinite%': isFinite,
        '%isNaN%': isNaN,
        '%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
        '%JSON%': typeof JSON === 'object' ? JSON : undefined,
        '%Map%': typeof Map === 'undefined' ? undefined : Map,
        '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
        '%Math%': Math,
        '%Number%': Number,
        '%Object%': Object,
        '%parseFloat%': parseFloat,
        '%parseInt%': parseInt,
        '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
        '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
        '%RangeError%': RangeError,
        '%ReferenceError%': ReferenceError,
        '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
        '%RegExp%': RegExp,
        '%Set%': typeof Set === 'undefined' ? undefined : Set,
        '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
        '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
        '%String%': String,
        '%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
        '%Symbol%': hasSymbols ? Symbol : undefined,
        '%SyntaxError%': $SyntaxError,
        '%ThrowTypeError%': ThrowTypeError,
        '%TypedArray%': TypedArray,
        '%TypeError%': $TypeError,
        '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
        '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
        '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
        '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
        '%URIError%': URIError,
        '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
        '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
        '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
    };
    
    var doEval = function doEval(name) {
        var value;
        if (name === '%AsyncFunction%') {
            value = getEvalledConstructor('async function () {}');
        } else if (name === '%GeneratorFunction%') {
            value = getEvalledConstructor('function* () {}');
        } else if (name === '%AsyncGeneratorFunction%') {
            value = getEvalledConstructor('async function* () {}');
        } else if (name === '%AsyncGenerator%') {
            var fn = doEval('%AsyncGeneratorFunction%');
            if (fn) {
                value = fn.prototype;
            }
        } else if (name === '%AsyncIteratorPrototype%') {
            var gen = doEval('%AsyncGenerator%');
            if (gen) {
                value = getProto(gen.prototype);
            }
        }
    
        INTRINSICS[name] = value;
    
        return value;
    };
    
    var LEGACY_ALIASES = {
        '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
        '%ArrayPrototype%': ['Array', 'prototype'],
        '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
        '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
        '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
        '%ArrayProto_values%': ['Array', 'prototype', 'values'],
        '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
        '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
        '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
        '%BooleanPrototype%': ['Boolean', 'prototype'],
        '%DataViewPrototype%': ['DataView', 'prototype'],
        '%DatePrototype%': ['Date', 'prototype'],
        '%ErrorPrototype%': ['Error', 'prototype'],
        '%EvalErrorPrototype%': ['EvalError', 'prototype'],
        '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
        '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
        '%FunctionPrototype%': ['Function', 'prototype'],
        '%Generator%': ['GeneratorFunction', 'prototype'],
        '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
        '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
        '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
        '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
        '%JSONParse%': ['JSON', 'parse'],
        '%JSONStringify%': ['JSON', 'stringify'],
        '%MapPrototype%': ['Map', 'prototype'],
        '%NumberPrototype%': ['Number', 'prototype'],
        '%ObjectPrototype%': ['Object', 'prototype'],
        '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
        '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
        '%PromisePrototype%': ['Promise', 'prototype'],
        '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
        '%Promise_all%': ['Promise', 'all'],
        '%Promise_reject%': ['Promise', 'reject'],
        '%Promise_resolve%': ['Promise', 'resolve'],
        '%RangeErrorPrototype%': ['RangeError', 'prototype'],
        '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
        '%RegExpPrototype%': ['RegExp', 'prototype'],
        '%SetPrototype%': ['Set', 'prototype'],
        '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
        '%StringPrototype%': ['String', 'prototype'],
        '%SymbolPrototype%': ['Symbol', 'prototype'],
        '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
        '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
        '%TypeErrorPrototype%': ['TypeError', 'prototype'],
        '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
        '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
        '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
        '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
        '%URIErrorPrototype%': ['URIError', 'prototype'],
        '%WeakMapPrototype%': ['WeakMap', 'prototype'],
        '%WeakSetPrototype%': ['WeakSet', 'prototype']
    };
    
    var bind = require('function-bind');
    var hasOwn = require('has');
    var $concat = bind.call(Function.call, Array.prototype.concat);
    var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
    var $replace = bind.call(Function.call, String.prototype.replace);
    var $strSlice = bind.call(Function.call, String.prototype.slice);
    
    /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
    var stringToPath = function stringToPath(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === '%' && last !== '%') {
            throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
        } else if (last === '%' && first !== '%') {
            throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
        }
        var result = [];
        $replace(string, rePropName, function (match, number, quote, subString) {
            result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
        });
        return result;
    };
    /* end adaptation */
    
    var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
            alias = LEGACY_ALIASES[intrinsicName];
            intrinsicName = '%' + alias[0] + '%';
        }
    
        if (hasOwn(INTRINSICS, intrinsicName)) {
            var value = INTRINSICS[intrinsicName];
            if (value === needsEval) {
                value = doEval(intrinsicName);
            }
            if (typeof value === 'undefined' && !allowMissing) {
                throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
            }
    
            return {
                alias: alias,
                name: intrinsicName,
                value: value
            };
        }
    
        throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
    };
    
    module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new $TypeError('intrinsic name must be a non-empty string');
        }
        if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
            throw new $TypeError('"allowMissing" argument must be a boolean');
        }
    
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
    
        var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
    
        var alias = intrinsic.alias;
        if (alias) {
            intrinsicBaseName = alias[0];
            $spliceApply(parts, $concat([0, 1], alias));
        }
    
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
            var part = parts[i];
            var first = $strSlice(part, 0, 1);
            var last = $strSlice(part, -1);
            if (
                (
                    (first === '"' || first === "'" || first === '`')
                    || (last === '"' || last === "'" || last === '`')
                )
                && first !== last
            ) {
                throw new $SyntaxError('property names with quotes must have matching quotes');
            }
            if (part === 'constructor' || !isOwn) {
                skipFurtherCaching = true;
            }
    
            intrinsicBaseName += '.' + part;
            intrinsicRealName = '%' + intrinsicBaseName + '%';
    
            if (hasOwn(INTRINSICS, intrinsicRealName)) {
                value = INTRINSICS[intrinsicRealName];
            } else if (value != null) {
                if (!(part in value)) {
                    if (!allowMissing) {
                        throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                    }
                    return void undefined;
                }
                if ($gOPD && (i + 1) >= parts.length) {
                    var desc = $gOPD(value, part);
                    isOwn = !!desc;
    
                    // By convention, when a data property is converted to an accessor
                    // property to emulate a data property that does not suffer from
                    // the override mistake, that accessor's getter is marked with
                    // an `originalValue` property. Here, when we detect this, we
                    // uphold the illusion by pretending to see that original data
                    // property, i.e., returning the value rather than the getter
                    // itself.
                    if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                        value = desc.get;
                    } else {
                        value = value[part];
                    }
                } else {
                    isOwn = hasOwn(value, part);
                    value = value[part];
                }
    
                if (isOwn && !skipFurtherCaching) {
                    INTRINSICS[intrinsicRealName] = value;
                }
            }
        }
        return value;
    };
    
    },{"function-bind":45,"has":50,"has-symbols":48}],48:[function(require,module,exports){
    'use strict';
    
    var origSymbol = typeof Symbol !== 'undefined' && Symbol;
    var hasSymbolSham = require('./shams');
    
    module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== 'function') { return false; }
        if (typeof Symbol !== 'function') { return false; }
        if (typeof origSymbol('foo') !== 'symbol') { return false; }
        if (typeof Symbol('bar') !== 'symbol') { return false; }
    
        return hasSymbolSham();
    };
    
    },{"./shams":49}],49:[function(require,module,exports){
    'use strict';
    
    /* eslint complexity: [2, 18], max-statements: [2, 33] */
    module.exports = function hasSymbols() {
        if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
        if (typeof Symbol.iterator === 'symbol') { return true; }
    
        var obj = {};
        var sym = Symbol('test');
        var symObj = Object(sym);
        if (typeof sym === 'string') { return false; }
    
        if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
        if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }
    
        // temp disabled per https://github.com/ljharb/object.assign/issues/17
        // if (sym instanceof Symbol) { return false; }
        // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
        // if (!(symObj instanceof Symbol)) { return false; }
    
        // if (typeof Symbol.prototype.toString !== 'function') { return false; }
        // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }
    
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
        if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }
    
        if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }
    
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) { return false; }
    
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }
    
        if (typeof Object.getOwnPropertyDescriptor === 'function') {
            var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
            if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
        }
    
        return true;
    };
    
    },{}],50:[function(require,module,exports){
    'use strict';
    
    var bind = require('function-bind');
    
    module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    
    },{"function-bind":45}],51:[function(require,module,exports){
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          })
        }
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor
          var TempCtor = function () {}
          TempCtor.prototype = superCtor.prototype
          ctor.prototype = new TempCtor()
          ctor.prototype.constructor = ctor
        }
      }
    }
    
    },{}],52:[function(require,module,exports){
    'use strict';
    
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var callBound = require('call-bind/callBound');
    
    var $toString = callBound('Object.prototype.toString');
    
    var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
            return false;
        }
        return $toString(value) === '[object Arguments]';
    };
    
    var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
            return true;
        }
        return value !== null &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            value.length >= 0 &&
            $toString(value) !== '[object Array]' &&
            $toString(value.callee) === '[object Function]';
    };
    
    var supportsStandardArguments = (function () {
        return isStandardArguments(arguments);
    }());
    
    isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests
    
    module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    
    },{"call-bind/callBound":8}],53:[function(require,module,exports){
    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    
    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
    module.exports = function (obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
    }
    
    function isBuffer (obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    }
    
    // For Node v0.10 support. Remove this eventually.
    function isSlowBuffer (obj) {
      return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
    }
    
    },{}],54:[function(require,module,exports){
    'use strict';
    
    var toStr = Object.prototype.toString;
    var fnToStr = Function.prototype.toString;
    var isFnRegex = /^\s*(?:function)?\*/;
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var getProto = Object.getPrototypeOf;
    var getGeneratorFunc = function () { // eslint-disable-line consistent-return
        if (!hasToStringTag) {
            return false;
        }
        try {
            return Function('return function*() {}')();
        } catch (e) {
        }
    };
    var generatorFunc = getGeneratorFunc();
    var GeneratorFunction = getProto && generatorFunc ? getProto(generatorFunc) : false;
    
    module.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== 'function') {
            return false;
        }
        if (isFnRegex.test(fnToStr.call(fn))) {
            return true;
        }
        if (!hasToStringTag) {
            var str = toStr.call(fn);
            return str === '[object GeneratorFunction]';
        }
        return getProto && getProto(fn) === GeneratorFunction;
    };
    
    },{}],55:[function(require,module,exports){
    (function (global){(function (){
    'use strict';
    
    var forEach = require('foreach');
    var availableTypedArrays = require('available-typed-arrays');
    var callBound = require('call-bind/callBound');
    
    var $toString = callBound('Object.prototype.toString');
    var hasSymbols = require('has-symbols')();
    var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';
    
    var typedArrays = availableTypedArrays();
    
    var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    };
    var $slice = callBound('String.prototype.slice');
    var toStrTags = {};
    var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
    var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
    if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function (typedArray) {
            var arr = new global[typedArray]();
            if (!(Symbol.toStringTag in arr)) {
                throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
            }
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
                var superProto = getPrototypeOf(proto);
                descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            toStrTags[typedArray] = descriptor.get;
        });
    }
    
    var tryTypedArrays = function tryAllTypedArrays(value) {
        var anyTrue = false;
        forEach(toStrTags, function (getter, typedArray) {
            if (!anyTrue) {
                try {
                    anyTrue = getter.call(value) === typedArray;
                } catch (e) { /**/ }
            }
        });
        return anyTrue;
    };
    
    module.exports = function isTypedArray(value) {
        if (!value || typeof value !== 'object') { return false; }
        if (!hasToStringTag) {
            var tag = $slice($toString(value), 8, -1);
            return $indexOf(typedArrays, tag) > -1;
        }
        if (!gOPD) { return false; }
        return tryTypedArrays(value);
    };
    
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"available-typed-arrays":6,"call-bind/callBound":8,"es-abstract/helpers/getOwnPropertyDescriptor":40,"foreach":43,"has-symbols":48}],56:[function(require,module,exports){
    (function (Buffer){(function (){
    'use strict';
    
    const object = {};
    const hasOwnProperty = object.hasOwnProperty;
    const forOwn = (object, callback) => {
        for (const key in object) {
            if (hasOwnProperty.call(object, key)) {
                callback(key, object[key]);
            }
        }
    };
    
    const extend = (destination, source) => {
        if (!source) {
            return destination;
        }
        forOwn(source, (key, value) => {
            destination[key] = value;
        });
        return destination;
    };
    
    const forEach = (array, callback) => {
        const length = array.length;
        let index = -1;
        while (++index < length) {
            callback(array[index]);
        }
    };
    
    const toString = object.toString;
    const isArray = Array.isArray;
    const isBuffer = Buffer.isBuffer;
    const isObject = (value) => {
        // This is a very simple check, but it’s good enough for what we need.
        return toString.call(value) == '[object Object]';
    };
    const isString = (value) => {
        return typeof value == 'string' ||
            toString.call(value) == '[object String]';
    };
    const isNumber = (value) => {
        return typeof value == 'number' ||
            toString.call(value) == '[object Number]';
    };
    const isFunction = (value) => {
        return typeof value == 'function';
    };
    const isMap = (value) => {
        return toString.call(value) == '[object Map]';
    };
    const isSet = (value) => {
        return toString.call(value) == '[object Set]';
    };
    
    /*--------------------------------------------------------------------------*/
    
    // https://mathiasbynens.be/notes/javascript-escapes#single
    const singleEscapes = {
        '"': '\\"',
        '\'': '\\\'',
        '\\': '\\\\',
        '\b': '\\b',
        '\f': '\\f',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t'
        // `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
        // '\v': '\\x0B'
    };
    const regexSingleEscape = /["'\\\b\f\n\r\t]/;
    
    const regexDigit = /[0-9]/;
    const regexWhitelist = /[ !#-&\(-\[\]-_a-~]/;
    
    const jsesc = (argument, options) => {
        const increaseIndentation = () => {
            oldIndent = indent;
            ++options.indentLevel;
            indent = options.indent.repeat(options.indentLevel)
        };
        // Handle options
        const defaults = {
            'escapeEverything': false,
            'minimal': false,
            'isScriptContext': false,
            'quotes': 'single',
            'wrap': false,
            'es6': false,
            'json': false,
            'compact': true,
            'lowercaseHex': false,
            'numbers': 'decimal',
            'indent': '\t',
            'indentLevel': 0,
            '__inline1__': false,
            '__inline2__': false
        };
        const json = options && options.json;
        if (json) {
            defaults.quotes = 'double';
            defaults.wrap = true;
        }
        options = extend(defaults, options);
        if (
            options.quotes != 'single' &&
            options.quotes != 'double' &&
            options.quotes != 'backtick'
        ) {
            options.quotes = 'single';
        }
        const quote = options.quotes == 'double' ?
            '"' :
            (options.quotes == 'backtick' ?
                '`' :
                '\''
            );
        const compact = options.compact;
        const lowercaseHex = options.lowercaseHex;
        let indent = options.indent.repeat(options.indentLevel);
        let oldIndent = '';
        const inline1 = options.__inline1__;
        const inline2 = options.__inline2__;
        const newLine = compact ? '' : '\n';
        let result;
        let isEmpty = true;
        const useBinNumbers = options.numbers == 'binary';
        const useOctNumbers = options.numbers == 'octal';
        const useDecNumbers = options.numbers == 'decimal';
        const useHexNumbers = options.numbers == 'hexadecimal';
    
        if (json && argument && isFunction(argument.toJSON)) {
            argument = argument.toJSON();
        }
    
        if (!isString(argument)) {
            if (isMap(argument)) {
                if (argument.size == 0) {
                    return 'new Map()';
                }
                if (!compact) {
                    options.__inline1__ = true;
                    options.__inline2__ = false;
                }
                return 'new Map(' + jsesc(Array.from(argument), options) + ')';
            }
            if (isSet(argument)) {
                if (argument.size == 0) {
                    return 'new Set()';
                }
                return 'new Set(' + jsesc(Array.from(argument), options) + ')';
            }
            if (isBuffer(argument)) {
                if (argument.length == 0) {
                    return 'Buffer.from([])';
                }
                return 'Buffer.from(' + jsesc(Array.from(argument), options) + ')';
            }
            if (isArray(argument)) {
                result = [];
                options.wrap = true;
                if (inline1) {
                    options.__inline1__ = false;
                    options.__inline2__ = true;
                }
                if (!inline2) {
                    increaseIndentation();
                }
                forEach(argument, (value) => {
                    isEmpty = false;
                    if (inline2) {
                        options.__inline2__ = false;
                    }
                    result.push(
                        (compact || inline2 ? '' : indent) +
                        jsesc(value, options)
                    );
                });
                if (isEmpty) {
                    return '[]';
                }
                if (inline2) {
                    return '[' + result.join(', ') + ']';
                }
                return '[' + newLine + result.join(',' + newLine) + newLine +
                    (compact ? '' : oldIndent) + ']';
            } else if (isNumber(argument)) {
                if (json) {
                    // Some number values (e.g. `Infinity`) cannot be represented in JSON.
                    return JSON.stringify(argument);
                }
                if (useDecNumbers) {
                    return String(argument);
                }
                if (useHexNumbers) {
                    let hexadecimal = argument.toString(16);
                    if (!lowercaseHex) {
                        hexadecimal = hexadecimal.toUpperCase();
                    }
                    return '0x' + hexadecimal;
                }
                if (useBinNumbers) {
                    return '0b' + argument.toString(2);
                }
                if (useOctNumbers) {
                    return '0o' + argument.toString(8);
                }
            } else if (!isObject(argument)) {
                if (json) {
                    // For some values (e.g. `undefined`, `function` objects),
                    // `JSON.stringify(value)` returns `undefined` (which isn’t valid
                    // JSON) instead of `'null'`.
                    return JSON.stringify(argument) || 'null';
                }
                return String(argument);
            } else { // it’s an object
                result = [];
                options.wrap = true;
                increaseIndentation();
                forOwn(argument, (key, value) => {
                    isEmpty = false;
                    result.push(
                        (compact ? '' : indent) +
                        jsesc(key, options) + ':' +
                        (compact ? '' : ' ') +
                        jsesc(value, options)
                    );
                });
                if (isEmpty) {
                    return '{}';
                }
                return '{' + newLine + result.join(',' + newLine) + newLine +
                    (compact ? '' : oldIndent) + '}';
            }
        }
    
        const string = argument;
        // Loop over each code unit in the string and escape it
        let index = -1;
        const length = string.length;
        result = '';
        while (++index < length) {
            const character = string.charAt(index);
            if (options.es6) {
                const first = string.charCodeAt(index);
                if ( // check if it’s the start of a surrogate pair
                    first >= 0xD800 && first <= 0xDBFF && // high surrogate
                    length > index + 1 // there is a next code unit
                ) {
                    const second = string.charCodeAt(index + 1);
                    if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
                        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                        const codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                        let hexadecimal = codePoint.toString(16);
                        if (!lowercaseHex) {
                            hexadecimal = hexadecimal.toUpperCase();
                        }
                        result += '\\u{' + hexadecimal + '}';
                        ++index;
                        continue;
                    }
                }
            }
            if (!options.escapeEverything) {
                if (regexWhitelist.test(character)) {
                    // It’s a printable ASCII character that is not `"`, `'` or `\`,
                    // so don’t escape it.
                    result += character;
                    continue;
                }
                if (character == '"') {
                    result += quote == character ? '\\"' : character;
                    continue;
                }
                if (character == '`') {
                    result += quote == character ? '\\`' : character;
                    continue;
                }
                if (character == '\'') {
                    result += quote == character ? '\\\'' : character;
                    continue;
                }
            }
            if (
                character == '\0' &&
                !json &&
                !regexDigit.test(string.charAt(index + 1))
            ) {
                result += '\\0';
                continue;
            }
            if (regexSingleEscape.test(character)) {
                // no need for a `hasOwnProperty` check here
                result += singleEscapes[character];
                continue;
            }
            const charCode = character.charCodeAt(0);
            if (options.minimal && charCode != 0x2028 && charCode != 0x2029) {
                result += character;
                continue;
            }
            let hexadecimal = charCode.toString(16);
            if (!lowercaseHex) {
                hexadecimal = hexadecimal.toUpperCase();
            }
            const longhand = hexadecimal.length > 2 || json;
            const escaped = '\\' + (longhand ? 'u' : 'x') +
                ('0000' + hexadecimal).slice(longhand ? -4 : -2);
            result += escaped;
            continue;
        }
        if (options.wrap) {
            result = quote + result + quote;
        }
        if (quote == '`') {
            result = result.replace(/\$\{/g, '\\\$\{');
        }
        if (options.isScriptContext) {
            // https://mathiasbynens.be/notes/etago
            return result
                .replace(/<\/(script|style)/gi, '<\\/$1')
                .replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--');
        }
        return result;
    };
    
    jsesc.version = '2.5.2';
    
    module.exports = jsesc;
    
    }).call(this)}).call(this,{"isBuffer":require("../is-buffer/index.js")})
    },{"../is-buffer/index.js":53}],57:[function(require,module,exports){
    (function (process,setImmediate){(function (){
    /*! Browser bundle of nunjucks 3.2.3  */
    (function webpackUniversalModuleDefinition(root, factory) {
        if(typeof exports === 'object' && typeof module === 'object')
            module.exports = factory();
        else if(typeof define === 'function' && define.amd)
            define([], factory);
        else if(typeof exports === 'object')
            exports["nunjucks"] = factory();
        else
            root["nunjucks"] = factory();
    })(typeof self !== 'undefined' ? self : this, function() {
    return /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
    /******/ 			return installedModules[moduleId].exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
    /******/ 			i: moduleId,
    /******/ 			l: false,
    /******/ 			exports: {}
    /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
    /******/ 			Object.defineProperty(exports, name, {
    /******/ 				configurable: false,
    /******/ 				enumerable: true,
    /******/ 				get: getter
    /******/ 			});
    /******/ 		}
    /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
    /******/ 			function getDefault() { return module['default']; } :
    /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 11);
    /******/ })
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var ArrayProto = Array.prototype;
    var ObjProto = Object.prototype;
    var escapeMap = {
      '&': '&amp;',
      '"': '&quot;',
      '\'': '&#39;',
      '<': '&lt;',
      '>': '&gt;'
    };
    var escapeRegex = /[&"'<>]/g;
    var exports = module.exports = {};
    
    function hasOwnProp(obj, k) {
      return ObjProto.hasOwnProperty.call(obj, k);
    }
    
    exports.hasOwnProp = hasOwnProp;
    
    function lookupEscape(ch) {
      return escapeMap[ch];
    }
    
    function _prettifyError(path, withInternals, err) {
      if (!err.Update) {
        // not one of ours, cast it
        err = new exports.TemplateError(err);
      }
    
      err.Update(path); // Unless they marked the dev flag, show them a trace from here
    
      if (!withInternals) {
        var old = err;
        err = new Error(old.message);
        err.name = old.name;
      }
    
      return err;
    }
    
    exports._prettifyError = _prettifyError;
    
    function TemplateError(message, lineno, colno) {
      var err;
      var cause;
    
      if (message instanceof Error) {
        cause = message;
        message = cause.name + ": " + cause.message;
      }
    
      if (Object.setPrototypeOf) {
        err = new Error(message);
        Object.setPrototypeOf(err, TemplateError.prototype);
      } else {
        err = this;
        Object.defineProperty(err, 'message', {
          enumerable: false,
          writable: true,
          value: message
        });
      }
    
      Object.defineProperty(err, 'name', {
        value: 'Template render error'
      });
    
      if (Error.captureStackTrace) {
        Error.captureStackTrace(err, this.constructor);
      }
    
      var getStack;
    
      if (cause) {
        var stackDescriptor = Object.getOwnPropertyDescriptor(cause, 'stack');
    
        getStack = stackDescriptor && (stackDescriptor.get || function () {
          return stackDescriptor.value;
        });
    
        if (!getStack) {
          getStack = function getStack() {
            return cause.stack;
          };
        }
      } else {
        var stack = new Error(message).stack;
    
        getStack = function getStack() {
          return stack;
        };
      }
    
      Object.defineProperty(err, 'stack', {
        get: function get() {
          return getStack.call(err);
        }
      });
      Object.defineProperty(err, 'cause', {
        value: cause
      });
      err.lineno = lineno;
      err.colno = colno;
      err.firstUpdate = true;
    
      err.Update = function Update(path) {
        var msg = '(' + (path || 'unknown path') + ')'; // only show lineno + colno next to path of template
        // where error occurred
    
        if (this.firstUpdate) {
          if (this.lineno && this.colno) {
            msg += " [Line " + this.lineno + ", Column " + this.colno + "]";
          } else if (this.lineno) {
            msg += " [Line " + this.lineno + "]";
          }
        }
    
        msg += '\n ';
    
        if (this.firstUpdate) {
          msg += ' ';
        }
    
        this.message = msg + (this.message || '');
        this.firstUpdate = false;
        return this;
      };
    
      return err;
    }
    
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(TemplateError.prototype, Error.prototype);
    } else {
      TemplateError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: TemplateError
        }
      });
    }
    
    exports.TemplateError = TemplateError;
    
    function escape(val) {
      return val.replace(escapeRegex, lookupEscape);
    }
    
    exports.escape = escape;
    
    function isFunction(obj) {
      return ObjProto.toString.call(obj) === '[object Function]';
    }
    
    exports.isFunction = isFunction;
    
    function isArray(obj) {
      return ObjProto.toString.call(obj) === '[object Array]';
    }
    
    exports.isArray = isArray;
    
    function isString(obj) {
      return ObjProto.toString.call(obj) === '[object String]';
    }
    
    exports.isString = isString;
    
    function isObject(obj) {
      return ObjProto.toString.call(obj) === '[object Object]';
    }
    
    exports.isObject = isObject;
    /**
     * @param {string|number} attr
     * @returns {(string|number)[]}
     * @private
     */
    
    function _prepareAttributeParts(attr) {
      if (!attr) {
        return [];
      }
    
      if (typeof attr === 'string') {
        return attr.split('.');
      }
    
      return [attr];
    }
    /**
     * @param {string}   attribute      Attribute value. Dots allowed.
     * @returns {function(Object): *}
     */
    
    
    function getAttrGetter(attribute) {
      var parts = _prepareAttributeParts(attribute);
    
      return function attrGetter(item) {
        var _item = item;
    
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i]; // If item is not an object, and we still got parts to handle, it means
          // that something goes wrong. Just roll out to undefined in that case.
    
          if (hasOwnProp(_item, part)) {
            _item = _item[part];
          } else {
            return undefined;
          }
        }
    
        return _item;
      };
    }
    
    exports.getAttrGetter = getAttrGetter;
    
    function groupBy(obj, val, throwOnUndefined) {
      var result = {};
      var iterator = isFunction(val) ? val : getAttrGetter(val);
    
      for (var i = 0; i < obj.length; i++) {
        var value = obj[i];
        var key = iterator(value, i);
    
        if (key === undefined && throwOnUndefined === true) {
          throw new TypeError("groupby: attribute \"" + val + "\" resolved to undefined");
        }
    
        (result[key] || (result[key] = [])).push(value);
      }
    
      return result;
    }
    
    exports.groupBy = groupBy;
    
    function toArray(obj) {
      return Array.prototype.slice.call(obj);
    }
    
    exports.toArray = toArray;
    
    function without(array) {
      var result = [];
    
      if (!array) {
        return result;
      }
    
      var length = array.length;
      var contains = toArray(arguments).slice(1);
      var index = -1;
    
      while (++index < length) {
        if (indexOf(contains, array[index]) === -1) {
          result.push(array[index]);
        }
      }
    
      return result;
    }
    
    exports.without = without;
    
    function repeat(char_, n) {
      var str = '';
    
      for (var i = 0; i < n; i++) {
        str += char_;
      }
    
      return str;
    }
    
    exports.repeat = repeat;
    
    function each(obj, func, context) {
      if (obj == null) {
        return;
      }
    
      if (ArrayProto.forEach && obj.forEach === ArrayProto.forEach) {
        obj.forEach(func, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          func.call(context, obj[i], i, obj);
        }
      }
    }
    
    exports.each = each;
    
    function map(obj, func) {
      var results = [];
    
      if (obj == null) {
        return results;
      }
    
      if (ArrayProto.map && obj.map === ArrayProto.map) {
        return obj.map(func);
      }
    
      for (var i = 0; i < obj.length; i++) {
        results[results.length] = func(obj[i], i);
      }
    
      if (obj.length === +obj.length) {
        results.length = obj.length;
      }
    
      return results;
    }
    
    exports.map = map;
    
    function asyncIter(arr, iter, cb) {
      var i = -1;
    
      function next() {
        i++;
    
        if (i < arr.length) {
          iter(arr[i], i, next, cb);
        } else {
          cb();
        }
      }
    
      next();
    }
    
    exports.asyncIter = asyncIter;
    
    function asyncFor(obj, iter, cb) {
      var keys = keys_(obj || {});
      var len = keys.length;
      var i = -1;
    
      function next() {
        i++;
        var k = keys[i];
    
        if (i < len) {
          iter(k, obj[k], i, len, next);
        } else {
          cb();
        }
      }
    
      next();
    }
    
    exports.asyncFor = asyncFor;
    
    function indexOf(arr, searchElement, fromIndex) {
      return Array.prototype.indexOf.call(arr || [], searchElement, fromIndex);
    }
    
    exports.indexOf = indexOf;
    
    function keys_(obj) {
      /* eslint-disable no-restricted-syntax */
      var arr = [];
    
      for (var k in obj) {
        if (hasOwnProp(obj, k)) {
          arr.push(k);
        }
      }
    
      return arr;
    }
    
    exports.keys = keys_;
    
    function _entries(obj) {
      return keys_(obj).map(function (k) {
        return [k, obj[k]];
      });
    }
    
    exports._entries = _entries;
    
    function _values(obj) {
      return keys_(obj).map(function (k) {
        return obj[k];
      });
    }
    
    exports._values = _values;
    
    function extend(obj1, obj2) {
      obj1 = obj1 || {};
      keys_(obj2).forEach(function (k) {
        obj1[k] = obj2[k];
      });
      return obj1;
    }
    
    exports._assign = exports.extend = extend;
    
    function inOperator(key, val) {
      if (isArray(val) || isString(val)) {
        return val.indexOf(key) !== -1;
      } else if (isObject(val)) {
        return key in val;
      }
    
      throw new Error('Cannot use "in" operator to search for "' + key + '" in unexpected types.');
    }
    
    exports.inOperator = inOperator;
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
     // A simple class system, more documentation to come
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var EventEmitter = __webpack_require__(16);
    
    var lib = __webpack_require__(0);
    
    function parentWrap(parent, prop) {
      if (typeof parent !== 'function' || typeof prop !== 'function') {
        return prop;
      }
    
      return function wrap() {
        // Save the current parent method
        var tmp = this.parent; // Set parent to the previous method, call, and restore
    
        this.parent = parent;
        var res = prop.apply(this, arguments);
        this.parent = tmp;
        return res;
      };
    }
    
    function extendClass(cls, name, props) {
      props = props || {};
      lib.keys(props).forEach(function (k) {
        props[k] = parentWrap(cls.prototype[k], props[k]);
      });
    
      var subclass = /*#__PURE__*/function (_cls) {
        _inheritsLoose(subclass, _cls);
    
        function subclass() {
          return _cls.apply(this, arguments) || this;
        }
    
        _createClass(subclass, [{
          key: "typename",
          get: function get() {
            return name;
          }
        }]);
    
        return subclass;
      }(cls);
    
      lib._assign(subclass.prototype, props);
    
      return subclass;
    }
    
    var Obj = /*#__PURE__*/function () {
      function Obj() {
        // Unfortunately necessary for backwards compatibility
        this.init.apply(this, arguments);
      }
    
      var _proto = Obj.prototype;
    
      _proto.init = function init() {};
    
      Obj.extend = function extend(name, props) {
        if (typeof name === 'object') {
          props = name;
          name = 'anonymous';
        }
    
        return extendClass(this, name, props);
      };
    
      _createClass(Obj, [{
        key: "typename",
        get: function get() {
          return this.constructor.name;
        }
      }]);
    
      return Obj;
    }();
    
    var EmitterObj = /*#__PURE__*/function (_EventEmitter) {
      _inheritsLoose(EmitterObj, _EventEmitter);
    
      function EmitterObj() {
        var _this2;
    
        var _this;
    
        _this = _EventEmitter.call(this) || this; // Unfortunately necessary for backwards compatibility
    
        (_this2 = _this).init.apply(_this2, arguments);
    
        return _this;
      }
    
      var _proto2 = EmitterObj.prototype;
    
      _proto2.init = function init() {};
    
      EmitterObj.extend = function extend(name, props) {
        if (typeof name === 'object') {
          props = name;
          name = 'anonymous';
        }
    
        return extendClass(this, name, props);
      };
    
      _createClass(EmitterObj, [{
        key: "typename",
        get: function get() {
          return this.constructor.name;
        }
      }]);
    
      return EmitterObj;
    }(EventEmitter);
    
    module.exports = {
      Obj: Obj,
      EmitterObj: EmitterObj
    };
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var lib = __webpack_require__(0);
    
    var arrayFrom = Array.from;
    var supportsIterators = typeof Symbol === 'function' && Symbol.iterator && typeof arrayFrom === 'function'; // Frames keep track of scoping both at compile-time and run-time so
    // we know how to access variables. Block tags can introduce special
    // variables, for example.
    
    var Frame = /*#__PURE__*/function () {
      function Frame(parent, isolateWrites) {
        this.variables = Object.create(null);
        this.parent = parent;
        this.topLevel = false; // if this is true, writes (set) should never propagate upwards past
        // this frame to its parent (though reads may).
    
        this.isolateWrites = isolateWrites;
      }
    
      var _proto = Frame.prototype;
    
      _proto.set = function set(name, val, resolveUp) {
        // Allow variables with dots by automatically creating the
        // nested structure
        var parts = name.split('.');
        var obj = this.variables;
        var frame = this;
    
        if (resolveUp) {
          if (frame = this.resolve(parts[0], true)) {
            frame.set(name, val);
            return;
          }
        }
    
        for (var i = 0; i < parts.length - 1; i++) {
          var id = parts[i];
    
          if (!obj[id]) {
            obj[id] = {};
          }
    
          obj = obj[id];
        }
    
        obj[parts[parts.length - 1]] = val;
      };
    
      _proto.get = function get(name) {
        var val = this.variables[name];
    
        if (val !== undefined) {
          return val;
        }
    
        return null;
      };
    
      _proto.lookup = function lookup(name) {
        var p = this.parent;
        var val = this.variables[name];
    
        if (val !== undefined) {
          return val;
        }
    
        return p && p.lookup(name);
      };
    
      _proto.resolve = function resolve(name, forWrite) {
        var p = forWrite && this.isolateWrites ? undefined : this.parent;
        var val = this.variables[name];
    
        if (val !== undefined) {
          return this;
        }
    
        return p && p.resolve(name);
      };
    
      _proto.push = function push(isolateWrites) {
        return new Frame(this, isolateWrites);
      };
    
      _proto.pop = function pop() {
        return this.parent;
      };
    
      return Frame;
    }();
    
    function makeMacro(argNames, kwargNames, func) {
      return function macro() {
        for (var _len = arguments.length, macroArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          macroArgs[_key] = arguments[_key];
        }
    
        var argCount = numArgs(macroArgs);
        var args;
        var kwargs = getKeywordArgs(macroArgs);
    
        if (argCount > argNames.length) {
          args = macroArgs.slice(0, argNames.length); // Positional arguments that should be passed in as
          // keyword arguments (essentially default values)
    
          macroArgs.slice(args.length, argCount).forEach(function (val, i) {
            if (i < kwargNames.length) {
              kwargs[kwargNames[i]] = val;
            }
          });
          args.push(kwargs);
        } else if (argCount < argNames.length) {
          args = macroArgs.slice(0, argCount);
    
          for (var i = argCount; i < argNames.length; i++) {
            var arg = argNames[i]; // Keyword arguments that should be passed as
            // positional arguments, i.e. the caller explicitly
            // used the name of a positional arg
    
            args.push(kwargs[arg]);
            delete kwargs[arg];
          }
    
          args.push(kwargs);
        } else {
          args = macroArgs;
        }
    
        return func.apply(this, args);
      };
    }
    
    function makeKeywordArgs(obj) {
      obj.__keywords = true;
      return obj;
    }
    
    function isKeywordArgs(obj) {
      return obj && Object.prototype.hasOwnProperty.call(obj, '__keywords');
    }
    
    function getKeywordArgs(args) {
      var len = args.length;
    
      if (len) {
        var lastArg = args[len - 1];
    
        if (isKeywordArgs(lastArg)) {
          return lastArg;
        }
      }
    
      return {};
    }
    
    function numArgs(args) {
      var len = args.length;
    
      if (len === 0) {
        return 0;
      }
    
      var lastArg = args[len - 1];
    
      if (isKeywordArgs(lastArg)) {
        return len - 1;
      } else {
        return len;
      }
    } // A SafeString object indicates that the string should not be
    // autoescaped. This happens magically because autoescaping only
    // occurs on primitive string objects.
    
    
    function SafeString(val) {
      if (typeof val !== 'string') {
        return val;
      }
    
      this.val = val;
      this.length = val.length;
    }
    
    SafeString.prototype = Object.create(String.prototype, {
      length: {
        writable: true,
        configurable: true,
        value: 0
      }
    });
    
    SafeString.prototype.valueOf = function valueOf() {
      return this.val;
    };
    
    SafeString.prototype.toString = function toString() {
      return this.val;
    };
    
    function copySafeness(dest, target) {
      if (dest instanceof SafeString) {
        return new SafeString(target);
      }
    
      return target.toString();
    }
    
    function markSafe(val) {
      var type = typeof val;
    
      if (type === 'string') {
        return new SafeString(val);
      } else if (type !== 'function') {
        return val;
      } else {
        return function wrapSafe(args) {
          var ret = val.apply(this, arguments);
    
          if (typeof ret === 'string') {
            return new SafeString(ret);
          }
    
          return ret;
        };
      }
    }
    
    function suppressValue(val, autoescape) {
      val = val !== undefined && val !== null ? val : '';
    
      if (autoescape && !(val instanceof SafeString)) {
        val = lib.escape(val.toString());
      }
    
      return val;
    }
    
    function ensureDefined(val, lineno, colno) {
      if (val === null || val === undefined) {
        throw new lib.TemplateError('attempted to output null or undefined value', lineno + 1, colno + 1);
      }
    
      return val;
    }
    
    function memberLookup(obj, val) {
      if (obj === undefined || obj === null) {
        return undefined;
      }
    
      if (typeof obj[val] === 'function') {
        return function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
    
          return obj[val].apply(obj, args);
        };
      }
    
      return obj[val];
    }
    
    function callWrap(obj, name, context, args) {
      if (!obj) {
        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
      } else if (typeof obj !== 'function') {
        throw new Error('Unable to call `' + name + '`, which is not a function');
      }
    
      return obj.apply(context, args);
    }
    
    function contextOrFrameLookup(context, frame, name) {
      var val = frame.lookup(name);
      return val !== undefined ? val : context.lookup(name);
    }
    
    function handleError(error, lineno, colno) {
      if (error.lineno) {
        return error;
      } else {
        return new lib.TemplateError(error, lineno, colno);
      }
    }
    
    function asyncEach(arr, dimen, iter, cb) {
      if (lib.isArray(arr)) {
        var len = arr.length;
        lib.asyncIter(arr, function iterCallback(item, i, next) {
          switch (dimen) {
            case 1:
              iter(item, i, len, next);
              break;
    
            case 2:
              iter(item[0], item[1], i, len, next);
              break;
    
            case 3:
              iter(item[0], item[1], item[2], i, len, next);
              break;
    
            default:
              item.push(i, len, next);
              iter.apply(this, item);
          }
        }, cb);
      } else {
        lib.asyncFor(arr, function iterCallback(key, val, i, len, next) {
          iter(key, val, i, len, next);
        }, cb);
      }
    }
    
    function asyncAll(arr, dimen, func, cb) {
      var finished = 0;
      var len;
      var outputArr;
    
      function done(i, output) {
        finished++;
        outputArr[i] = output;
    
        if (finished === len) {
          cb(null, outputArr.join(''));
        }
      }
    
      if (lib.isArray(arr)) {
        len = arr.length;
        outputArr = new Array(len);
    
        if (len === 0) {
          cb(null, '');
        } else {
          for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
    
            switch (dimen) {
              case 1:
                func(item, i, len, done);
                break;
    
              case 2:
                func(item[0], item[1], i, len, done);
                break;
    
              case 3:
                func(item[0], item[1], item[2], i, len, done);
                break;
    
              default:
                item.push(i, len, done);
                func.apply(this, item);
            }
          }
        }
      } else {
        var keys = lib.keys(arr || {});
        len = keys.length;
        outputArr = new Array(len);
    
        if (len === 0) {
          cb(null, '');
        } else {
          for (var _i = 0; _i < keys.length; _i++) {
            var k = keys[_i];
            func(k, arr[k], _i, len, done);
          }
        }
      }
    }
    
    function fromIterator(arr) {
      if (typeof arr !== 'object' || arr === null || lib.isArray(arr)) {
        return arr;
      } else if (supportsIterators && Symbol.iterator in arr) {
        return arrayFrom(arr);
      } else {
        return arr;
      }
    }
    
    module.exports = {
      Frame: Frame,
      makeMacro: makeMacro,
      makeKeywordArgs: makeKeywordArgs,
      numArgs: numArgs,
      suppressValue: suppressValue,
      ensureDefined: ensureDefined,
      memberLookup: memberLookup,
      contextOrFrameLookup: contextOrFrameLookup,
      callWrap: callWrap,
      handleError: handleError,
      isArray: lib.isArray,
      keys: lib.keys,
      SafeString: SafeString,
      copySafeness: copySafeness,
      markSafe: markSafe,
      asyncEach: asyncEach,
      asyncAll: asyncAll,
      inOperator: lib.inOperator,
      fromIterator: fromIterator
    };
    
    /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var _require = __webpack_require__(1),
        Obj = _require.Obj;
    
    function traverseAndCheck(obj, type, results) {
      if (obj instanceof type) {
        results.push(obj);
      }
    
      if (obj instanceof Node) {
        obj.findAll(type, results);
      }
    }
    
    var Node = /*#__PURE__*/function (_Obj) {
      _inheritsLoose(Node, _Obj);
    
      function Node() {
        return _Obj.apply(this, arguments) || this;
      }
    
      var _proto = Node.prototype;
    
      _proto.init = function init(lineno, colno) {
        var _arguments = arguments,
            _this = this;
    
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
    
        this.lineno = lineno;
        this.colno = colno;
        this.fields.forEach(function (field, i) {
          // The first two args are line/col numbers, so offset by 2
          var val = _arguments[i + 2]; // Fields should never be undefined, but null. It makes
          // testing easier to normalize values.
    
          if (val === undefined) {
            val = null;
          }
    
          _this[field] = val;
        });
      };
    
      _proto.findAll = function findAll(type, results) {
        var _this2 = this;
    
        results = results || [];
    
        if (this instanceof NodeList) {
          this.children.forEach(function (child) {
            return traverseAndCheck(child, type, results);
          });
        } else {
          this.fields.forEach(function (field) {
            return traverseAndCheck(_this2[field], type, results);
          });
        }
    
        return results;
      };
    
      _proto.iterFields = function iterFields(func) {
        var _this3 = this;
    
        this.fields.forEach(function (field) {
          func(_this3[field], field);
        });
      };
    
      return Node;
    }(Obj); // Abstract nodes
    
    
    var Value = /*#__PURE__*/function (_Node) {
      _inheritsLoose(Value, _Node);
    
      function Value() {
        return _Node.apply(this, arguments) || this;
      }
    
      _createClass(Value, [{
        key: "typename",
        get: function get() {
          return 'Value';
        }
      }, {
        key: "fields",
        get: function get() {
          return ['value'];
        }
      }]);
    
      return Value;
    }(Node); // Concrete nodes
    
    
    var NodeList = /*#__PURE__*/function (_Node2) {
      _inheritsLoose(NodeList, _Node2);
    
      function NodeList() {
        return _Node2.apply(this, arguments) || this;
      }
    
      var _proto2 = NodeList.prototype;
    
      _proto2.init = function init(lineno, colno, nodes) {
        _Node2.prototype.init.call(this, lineno, colno, nodes || []);
      };
    
      _proto2.addChild = function addChild(node) {
        this.children.push(node);
      };
    
      _createClass(NodeList, [{
        key: "typename",
        get: function get() {
          return 'NodeList';
        }
      }, {
        key: "fields",
        get: function get() {
          return ['children'];
        }
      }]);
    
      return NodeList;
    }(Node);
    
    var Root = NodeList.extend('Root');
    var Literal = Value.extend('Literal');
    var Symbol = Value.extend('Symbol');
    var Group = NodeList.extend('Group');
    var ArrayNode = NodeList.extend('Array');
    var Pair = Node.extend('Pair', {
      fields: ['key', 'value']
    });
    var Dict = NodeList.extend('Dict');
    var LookupVal = Node.extend('LookupVal', {
      fields: ['target', 'val']
    });
    var If = Node.extend('If', {
      fields: ['cond', 'body', 'else_']
    });
    var IfAsync = If.extend('IfAsync');
    var InlineIf = Node.extend('InlineIf', {
      fields: ['cond', 'body', 'else_']
    });
    var For = Node.extend('For', {
      fields: ['arr', 'name', 'body', 'else_']
    });
    var AsyncEach = For.extend('AsyncEach');
    var AsyncAll = For.extend('AsyncAll');
    var Macro = Node.extend('Macro', {
      fields: ['name', 'args', 'body']
    });
    var Caller = Macro.extend('Caller');
    var Import = Node.extend('Import', {
      fields: ['template', 'target', 'withContext']
    });
    
    var FromImport = /*#__PURE__*/function (_Node3) {
      _inheritsLoose(FromImport, _Node3);
    
      function FromImport() {
        return _Node3.apply(this, arguments) || this;
      }
    
      var _proto3 = FromImport.prototype;
    
      _proto3.init = function init(lineno, colno, template, names, withContext) {
        _Node3.prototype.init.call(this, lineno, colno, template, names || new NodeList(), withContext);
      };
    
      _createClass(FromImport, [{
        key: "typename",
        get: function get() {
          return 'FromImport';
        }
      }, {
        key: "fields",
        get: function get() {
          return ['template', 'names', 'withContext'];
        }
      }]);
    
      return FromImport;
    }(Node);
    
    var FunCall = Node.extend('FunCall', {
      fields: ['name', 'args']
    });
    var Filter = FunCall.extend('Filter');
    var FilterAsync = Filter.extend('FilterAsync', {
      fields: ['name', 'args', 'symbol']
    });
    var KeywordArgs = Dict.extend('KeywordArgs');
    var Block = Node.extend('Block', {
      fields: ['name', 'body']
    });
    var Super = Node.extend('Super', {
      fields: ['blockName', 'symbol']
    });
    var TemplateRef = Node.extend('TemplateRef', {
      fields: ['template']
    });
    var Extends = TemplateRef.extend('Extends');
    var Include = Node.extend('Include', {
      fields: ['template', 'ignoreMissing']
    });
    var Set = Node.extend('Set', {
      fields: ['targets', 'value']
    });
    var Switch = Node.extend('Switch', {
      fields: ['expr', 'cases', 'default']
    });
    var Case = Node.extend('Case', {
      fields: ['cond', 'body']
    });
    var Output = NodeList.extend('Output');
    var Capture = Node.extend('Capture', {
      fields: ['body']
    });
    var TemplateData = Literal.extend('TemplateData');
    var UnaryOp = Node.extend('UnaryOp', {
      fields: ['target']
    });
    var BinOp = Node.extend('BinOp', {
      fields: ['left', 'right']
    });
    var In = BinOp.extend('In');
    var Is = BinOp.extend('Is');
    var Or = BinOp.extend('Or');
    var And = BinOp.extend('And');
    var Not = UnaryOp.extend('Not');
    var Add = BinOp.extend('Add');
    var Concat = BinOp.extend('Concat');
    var Sub = BinOp.extend('Sub');
    var Mul = BinOp.extend('Mul');
    var Div = BinOp.extend('Div');
    var FloorDiv = BinOp.extend('FloorDiv');
    var Mod = BinOp.extend('Mod');
    var Pow = BinOp.extend('Pow');
    var Neg = UnaryOp.extend('Neg');
    var Pos = UnaryOp.extend('Pos');
    var Compare = Node.extend('Compare', {
      fields: ['expr', 'ops']
    });
    var CompareOperand = Node.extend('CompareOperand', {
      fields: ['expr', 'type']
    });
    var CallExtension = Node.extend('CallExtension', {
      init: function init(ext, prop, args, contentArgs) {
        this.parent();
        this.extName = ext.__name || ext;
        this.prop = prop;
        this.args = args || new NodeList();
        this.contentArgs = contentArgs || [];
        this.autoescape = ext.autoescape;
      },
      fields: ['extName', 'prop', 'args', 'contentArgs']
    });
    var CallExtensionAsync = CallExtension.extend('CallExtensionAsync'); // This is hacky, but this is just a debugging function anyway
    
    function print(str, indent, inline) {
      var lines = str.split('\n');
      lines.forEach(function (line, i) {
        if (line && (inline && i > 0 || !inline)) {
          process.stdout.write(' '.repeat(indent));
        }
    
        var nl = i === lines.length - 1 ? '' : '\n';
        process.stdout.write("" + line + nl);
      });
    } // Print the AST in a nicely formatted tree format for debuggin
    
    
    function printNodes(node, indent) {
      indent = indent || 0;
      print(node.typename + ': ', indent);
    
      if (node instanceof NodeList) {
        print('\n');
        node.children.forEach(function (n) {
          printNodes(n, indent + 2);
        });
      } else if (node instanceof CallExtension) {
        print(node.extName + "." + node.prop + "\n");
    
        if (node.args) {
          printNodes(node.args, indent + 2);
        }
    
        if (node.contentArgs) {
          node.contentArgs.forEach(function (n) {
            printNodes(n, indent + 2);
          });
        }
      } else {
        var nodes = [];
        var props = null;
        node.iterFields(function (val, fieldName) {
          if (val instanceof Node) {
            nodes.push([fieldName, val]);
          } else {
            props = props || {};
            props[fieldName] = val;
          }
        });
    
        if (props) {
          print(JSON.stringify(props, null, 2) + '\n', null, true);
        } else {
          print('\n');
        }
    
        nodes.forEach(function (_ref) {
          var fieldName = _ref[0],
              n = _ref[1];
          print("[" + fieldName + "] =>", indent + 2);
          printNodes(n, indent + 4);
        });
      }
    }
    
    module.exports = {
      Node: Node,
      Root: Root,
      NodeList: NodeList,
      Value: Value,
      Literal: Literal,
      Symbol: Symbol,
      Group: Group,
      Array: ArrayNode,
      Pair: Pair,
      Dict: Dict,
      Output: Output,
      Capture: Capture,
      TemplateData: TemplateData,
      If: If,
      IfAsync: IfAsync,
      InlineIf: InlineIf,
      For: For,
      AsyncEach: AsyncEach,
      AsyncAll: AsyncAll,
      Macro: Macro,
      Caller: Caller,
      Import: Import,
      FromImport: FromImport,
      FunCall: FunCall,
      Filter: Filter,
      FilterAsync: FilterAsync,
      KeywordArgs: KeywordArgs,
      Block: Block,
      Super: Super,
      Extends: Extends,
      Include: Include,
      Set: Set,
      Switch: Switch,
      Case: Case,
      LookupVal: LookupVal,
      BinOp: BinOp,
      In: In,
      Is: Is,
      Or: Or,
      And: And,
      Not: Not,
      Add: Add,
      Concat: Concat,
      Sub: Sub,
      Mul: Mul,
      Div: Div,
      FloorDiv: FloorDiv,
      Mod: Mod,
      Pow: Pow,
      Neg: Neg,
      Pos: Pos,
      Compare: Compare,
      CompareOperand: CompareOperand,
      CallExtension: CallExtension,
      CallExtensionAsync: CallExtensionAsync,
      printNodes: printNodes
    };
    
    /***/ }),
    /* 4 */
    /***/ (function(module, exports) {
    
    
    
    /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var parser = __webpack_require__(8);
    
    var transformer = __webpack_require__(17);
    
    var nodes = __webpack_require__(3);
    
    var _require = __webpack_require__(0),
        TemplateError = _require.TemplateError;
    
    var _require2 = __webpack_require__(2),
        Frame = _require2.Frame;
    
    var _require3 = __webpack_require__(1),
        Obj = _require3.Obj; // These are all the same for now, but shouldn't be passed straight
    // through
    
    
    var compareOps = {
      '==': '==',
      '===': '===',
      '!=': '!=',
      '!==': '!==',
      '<': '<',
      '>': '>',
      '<=': '<=',
      '>=': '>='
    };
    
    var Compiler = /*#__PURE__*/function (_Obj) {
      _inheritsLoose(Compiler, _Obj);
    
      function Compiler() {
        return _Obj.apply(this, arguments) || this;
      }
    
      var _proto = Compiler.prototype;
    
      _proto.init = function init(templateName, throwOnUndefined) {
        this.templateName = templateName;
        this.codebuf = [];
        this.lastId = 0;
        this.buffer = null;
        this.bufferStack = [];
        this._scopeClosers = '';
        this.inBlock = false;
        this.throwOnUndefined = throwOnUndefined;
      };
    
      _proto.fail = function fail(msg, lineno, colno) {
        if (lineno !== undefined) {
          lineno += 1;
        }
    
        if (colno !== undefined) {
          colno += 1;
        }
    
        throw new TemplateError(msg, lineno, colno);
      };
    
      _proto._pushBuffer = function _pushBuffer() {
        var id = this._tmpid();
    
        this.bufferStack.push(this.buffer);
        this.buffer = id;
    
        this._emit("var " + this.buffer + " = \"\";");
    
        return id;
      };
    
      _proto._popBuffer = function _popBuffer() {
        this.buffer = this.bufferStack.pop();
      };
    
      _proto._emit = function _emit(code) {
        this.codebuf.push(code);
      };
    
      _proto._emitLine = function _emitLine(code) {
        this._emit(code + '\n');
      };
    
      _proto._emitLines = function _emitLines() {
        var _this = this;
    
        for (var _len = arguments.length, lines = new Array(_len), _key = 0; _key < _len; _key++) {
          lines[_key] = arguments[_key];
        }
    
        lines.forEach(function (line) {
          return _this._emitLine(line);
        });
      };
    
      _proto._emitFuncBegin = function _emitFuncBegin(node, name) {
        this.buffer = 'output';
        this._scopeClosers = '';
    
        this._emitLine("function " + name + "(env, context, frame, runtime, cb) {");
    
        this._emitLine("var lineno = " + node.lineno + ";");
    
        this._emitLine("var colno = " + node.colno + ";");
    
        this._emitLine("var " + this.buffer + " = \"\";");
    
        this._emitLine('try {');
      };
    
      _proto._emitFuncEnd = function _emitFuncEnd(noReturn) {
        if (!noReturn) {
          this._emitLine('cb(null, ' + this.buffer + ');');
        }
    
        this._closeScopeLevels();
    
        this._emitLine('} catch (e) {');
    
        this._emitLine('  cb(runtime.handleError(e, lineno, colno));');
    
        this._emitLine('}');
    
        this._emitLine('}');
    
        this.buffer = null;
      };
    
      _proto._addScopeLevel = function _addScopeLevel() {
        this._scopeClosers += '})';
      };
    
      _proto._closeScopeLevels = function _closeScopeLevels() {
        this._emitLine(this._scopeClosers + ';');
    
        this._scopeClosers = '';
      };
    
      _proto._withScopedSyntax = function _withScopedSyntax(func) {
        var _scopeClosers = this._scopeClosers;
        this._scopeClosers = '';
        func.call(this);
    
        this._closeScopeLevels();
    
        this._scopeClosers = _scopeClosers;
      };
    
      _proto._makeCallback = function _makeCallback(res) {
        var err = this._tmpid();
    
        return 'function(' + err + (res ? ',' + res : '') + ') {\n' + 'if(' + err + ') { cb(' + err + '); return; }';
      };
    
      _proto._tmpid = function _tmpid() {
        this.lastId++;
        return 't_' + this.lastId;
      };
    
      _proto._templateName = function _templateName() {
        return this.templateName == null ? 'undefined' : JSON.stringify(this.templateName);
      };
    
      _proto._compileChildren = function _compileChildren(node, frame) {
        var _this2 = this;
    
        node.children.forEach(function (child) {
          _this2.compile(child, frame);
        });
      };
    
      _proto._compileAggregate = function _compileAggregate(node, frame, startChar, endChar) {
        var _this3 = this;
    
        if (startChar) {
          this._emit(startChar);
        }
    
        node.children.forEach(function (child, i) {
          if (i > 0) {
            _this3._emit(',');
          }
    
          _this3.compile(child, frame);
        });
    
        if (endChar) {
          this._emit(endChar);
        }
      };
    
      _proto._compileExpression = function _compileExpression(node, frame) {
        // TODO: I'm not really sure if this type check is worth it or
        // not.
        this.assertType(node, nodes.Literal, nodes.Symbol, nodes.Group, nodes.Array, nodes.Dict, nodes.FunCall, nodes.Caller, nodes.Filter, nodes.LookupVal, nodes.Compare, nodes.InlineIf, nodes.In, nodes.Is, nodes.And, nodes.Or, nodes.Not, nodes.Add, nodes.Concat, nodes.Sub, nodes.Mul, nodes.Div, nodes.FloorDiv, nodes.Mod, nodes.Pow, nodes.Neg, nodes.Pos, nodes.Compare, nodes.NodeList);
        this.compile(node, frame);
      };
    
      _proto.assertType = function assertType(node) {
        for (var _len2 = arguments.length, types = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          types[_key2 - 1] = arguments[_key2];
        }
    
        if (!types.some(function (t) {
          return node instanceof t;
        })) {
          this.fail("assertType: invalid type: " + node.typename, node.lineno, node.colno);
        }
      };
    
      _proto.compileCallExtension = function compileCallExtension(node, frame, async) {
        var _this4 = this;
    
        var args = node.args;
        var contentArgs = node.contentArgs;
        var autoescape = typeof node.autoescape === 'boolean' ? node.autoescape : true;
    
        if (!async) {
          this._emit(this.buffer + " += runtime.suppressValue(");
        }
    
        this._emit("env.getExtension(\"" + node.extName + "\")[\"" + node.prop + "\"](");
    
        this._emit('context');
    
        if (args || contentArgs) {
          this._emit(',');
        }
    
        if (args) {
          if (!(args instanceof nodes.NodeList)) {
            this.fail('compileCallExtension: arguments must be a NodeList, ' + 'use `parser.parseSignature`');
          }
    
          args.children.forEach(function (arg, i) {
            // Tag arguments are passed normally to the call. Note
            // that keyword arguments are turned into a single js
            // object as the last argument, if they exist.
            _this4._compileExpression(arg, frame);
    
            if (i !== args.children.length - 1 || contentArgs.length) {
              _this4._emit(',');
            }
          });
        }
    
        if (contentArgs.length) {
          contentArgs.forEach(function (arg, i) {
            if (i > 0) {
              _this4._emit(',');
            }
    
            if (arg) {
              _this4._emitLine('function(cb) {');
    
              _this4._emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
    
              var id = _this4._pushBuffer();
    
              _this4._withScopedSyntax(function () {
                _this4.compile(arg, frame);
    
                _this4._emitLine("cb(null, " + id + ");");
              });
    
              _this4._popBuffer();
    
              _this4._emitLine("return " + id + ";");
    
              _this4._emitLine('}');
            } else {
              _this4._emit('null');
            }
          });
        }
    
        if (async) {
          var res = this._tmpid();
    
          this._emitLine(', ' + this._makeCallback(res));
    
          this._emitLine(this.buffer + " += runtime.suppressValue(" + res + ", " + autoescape + " && env.opts.autoescape);");
    
          this._addScopeLevel();
        } else {
          this._emit(')');
    
          this._emit(", " + autoescape + " && env.opts.autoescape);\n");
        }
      };
    
      _proto.compileCallExtensionAsync = function compileCallExtensionAsync(node, frame) {
        this.compileCallExtension(node, frame, true);
      };
    
      _proto.compileNodeList = function compileNodeList(node, frame) {
        this._compileChildren(node, frame);
      };
    
      _proto.compileLiteral = function compileLiteral(node) {
        if (typeof node.value === 'string') {
          var val = node.value.replace(/\\/g, '\\\\');
          val = val.replace(/"/g, '\\"');
          val = val.replace(/\n/g, '\\n');
          val = val.replace(/\r/g, '\\r');
          val = val.replace(/\t/g, '\\t');
          val = val.replace(/\u2028/g, "\\u2028");
    
          this._emit("\"" + val + "\"");
        } else if (node.value === null) {
          this._emit('null');
        } else {
          this._emit(node.value.toString());
        }
      };
    
      _proto.compileSymbol = function compileSymbol(node, frame) {
        var name = node.value;
        var v = frame.lookup(name);
    
        if (v) {
          this._emit(v);
        } else {
          this._emit('runtime.contextOrFrameLookup(' + 'context, frame, "' + name + '")');
        }
      };
    
      _proto.compileGroup = function compileGroup(node, frame) {
        this._compileAggregate(node, frame, '(', ')');
      };
    
      _proto.compileArray = function compileArray(node, frame) {
        this._compileAggregate(node, frame, '[', ']');
      };
    
      _proto.compileDict = function compileDict(node, frame) {
        this._compileAggregate(node, frame, '{', '}');
      };
    
      _proto.compilePair = function compilePair(node, frame) {
        var key = node.key;
        var val = node.value;
    
        if (key instanceof nodes.Symbol) {
          key = new nodes.Literal(key.lineno, key.colno, key.value);
        } else if (!(key instanceof nodes.Literal && typeof key.value === 'string')) {
          this.fail('compilePair: Dict keys must be strings or names', key.lineno, key.colno);
        }
    
        this.compile(key, frame);
    
        this._emit(': ');
    
        this._compileExpression(val, frame);
      };
    
      _proto.compileInlineIf = function compileInlineIf(node, frame) {
        this._emit('(');
    
        this.compile(node.cond, frame);
    
        this._emit('?');
    
        this.compile(node.body, frame);
    
        this._emit(':');
    
        if (node.else_ !== null) {
          this.compile(node.else_, frame);
        } else {
          this._emit('""');
        }
    
        this._emit(')');
      };
    
      _proto.compileIn = function compileIn(node, frame) {
        this._emit('runtime.inOperator(');
    
        this.compile(node.left, frame);
    
        this._emit(',');
    
        this.compile(node.right, frame);
    
        this._emit(')');
      };
    
      _proto.compileIs = function compileIs(node, frame) {
        // first, we need to try to get the name of the test function, if it's a
        // callable (i.e., has args) and not a symbol.
        var right = node.right.name ? node.right.name.value // otherwise go with the symbol value
        : node.right.value;
    
        this._emit('env.getTest("' + right + '").call(context, ');
    
        this.compile(node.left, frame); // compile the arguments for the callable if they exist
    
        if (node.right.args) {
          this._emit(',');
    
          this.compile(node.right.args, frame);
        }
    
        this._emit(') === true');
      };
    
      _proto._binOpEmitter = function _binOpEmitter(node, frame, str) {
        this.compile(node.left, frame);
    
        this._emit(str);
    
        this.compile(node.right, frame);
      } // ensure concatenation instead of addition
      // by adding empty string in between
      ;
    
      _proto.compileOr = function compileOr(node, frame) {
        return this._binOpEmitter(node, frame, ' || ');
      };
    
      _proto.compileAnd = function compileAnd(node, frame) {
        return this._binOpEmitter(node, frame, ' && ');
      };
    
      _proto.compileAdd = function compileAdd(node, frame) {
        return this._binOpEmitter(node, frame, ' + ');
      };
    
      _proto.compileConcat = function compileConcat(node, frame) {
        return this._binOpEmitter(node, frame, ' + "" + ');
      };
    
      _proto.compileSub = function compileSub(node, frame) {
        return this._binOpEmitter(node, frame, ' - ');
      };
    
      _proto.compileMul = function compileMul(node, frame) {
        return this._binOpEmitter(node, frame, ' * ');
      };
    
      _proto.compileDiv = function compileDiv(node, frame) {
        return this._binOpEmitter(node, frame, ' / ');
      };
    
      _proto.compileMod = function compileMod(node, frame) {
        return this._binOpEmitter(node, frame, ' % ');
      };
    
      _proto.compileNot = function compileNot(node, frame) {
        this._emit('!');
    
        this.compile(node.target, frame);
      };
    
      _proto.compileFloorDiv = function compileFloorDiv(node, frame) {
        this._emit('Math.floor(');
    
        this.compile(node.left, frame);
    
        this._emit(' / ');
    
        this.compile(node.right, frame);
    
        this._emit(')');
      };
    
      _proto.compilePow = function compilePow(node, frame) {
        this._emit('Math.pow(');
    
        this.compile(node.left, frame);
    
        this._emit(', ');
    
        this.compile(node.right, frame);
    
        this._emit(')');
      };
    
      _proto.compileNeg = function compileNeg(node, frame) {
        this._emit('-');
    
        this.compile(node.target, frame);
      };
    
      _proto.compilePos = function compilePos(node, frame) {
        this._emit('+');
    
        this.compile(node.target, frame);
      };
    
      _proto.compileCompare = function compileCompare(node, frame) {
        var _this5 = this;
    
        this.compile(node.expr, frame);
        node.ops.forEach(function (op) {
          _this5._emit(" " + compareOps[op.type] + " ");
    
          _this5.compile(op.expr, frame);
        });
      };
    
      _proto.compileLookupVal = function compileLookupVal(node, frame) {
        this._emit('runtime.memberLookup((');
    
        this._compileExpression(node.target, frame);
    
        this._emit('),');
    
        this._compileExpression(node.val, frame);
    
        this._emit(')');
      };
    
      _proto._getNodeName = function _getNodeName(node) {
        switch (node.typename) {
          case 'Symbol':
            return node.value;
    
          case 'FunCall':
            return 'the return value of (' + this._getNodeName(node.name) + ')';
    
          case 'LookupVal':
            return this._getNodeName(node.target) + '["' + this._getNodeName(node.val) + '"]';
    
          case 'Literal':
            return node.value.toString();
    
          default:
            return '--expression--';
        }
      };
    
      _proto.compileFunCall = function compileFunCall(node, frame) {
        // Keep track of line/col info at runtime by settings
        // variables within an expression. An expression in javascript
        // like (x, y, z) returns the last value, and x and y can be
        // anything
        this._emit('(lineno = ' + node.lineno + ', colno = ' + node.colno + ', ');
    
        this._emit('runtime.callWrap('); // Compile it as normal.
    
    
        this._compileExpression(node.name, frame); // Output the name of what we're calling so we can get friendly errors
        // if the lookup fails.
    
    
        this._emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');
    
        this._compileAggregate(node.args, frame, '[', '])');
    
        this._emit(')');
      };
    
      _proto.compileFilter = function compileFilter(node, frame) {
        var name = node.name;
        this.assertType(name, nodes.Symbol);
    
        this._emit('env.getFilter("' + name.value + '").call(context, ');
    
        this._compileAggregate(node.args, frame);
    
        this._emit(')');
      };
    
      _proto.compileFilterAsync = function compileFilterAsync(node, frame) {
        var name = node.name;
        var symbol = node.symbol.value;
        this.assertType(name, nodes.Symbol);
        frame.set(symbol, symbol);
    
        this._emit('env.getFilter("' + name.value + '").call(context, ');
    
        this._compileAggregate(node.args, frame);
    
        this._emitLine(', ' + this._makeCallback(symbol));
    
        this._addScopeLevel();
      };
    
      _proto.compileKeywordArgs = function compileKeywordArgs(node, frame) {
        this._emit('runtime.makeKeywordArgs(');
    
        this.compileDict(node, frame);
    
        this._emit(')');
      };
    
      _proto.compileSet = function compileSet(node, frame) {
        var _this6 = this;
    
        var ids = []; // Lookup the variable names for each identifier and create
        // new ones if necessary
    
        node.targets.forEach(function (target) {
          var name = target.value;
          var id = frame.lookup(name);
    
          if (id === null || id === undefined) {
            id = _this6._tmpid(); // Note: This relies on js allowing scope across
            // blocks, in case this is created inside an `if`
    
            _this6._emitLine('var ' + id + ';');
          }
    
          ids.push(id);
        });
    
        if (node.value) {
          this._emit(ids.join(' = ') + ' = ');
    
          this._compileExpression(node.value, frame);
    
          this._emitLine(';');
        } else {
          this._emit(ids.join(' = ') + ' = ');
    
          this.compile(node.body, frame);
    
          this._emitLine(';');
        }
    
        node.targets.forEach(function (target, i) {
          var id = ids[i];
          var name = target.value; // We are running this for every var, but it's very
          // uncommon to assign to multiple vars anyway
    
          _this6._emitLine("frame.set(\"" + name + "\", " + id + ", true);");
    
          _this6._emitLine('if(frame.topLevel) {');
    
          _this6._emitLine("context.setVariable(\"" + name + "\", " + id + ");");
    
          _this6._emitLine('}');
    
          if (name.charAt(0) !== '_') {
            _this6._emitLine('if(frame.topLevel) {');
    
            _this6._emitLine("context.addExport(\"" + name + "\", " + id + ");");
    
            _this6._emitLine('}');
          }
        });
      };
    
      _proto.compileSwitch = function compileSwitch(node, frame) {
        var _this7 = this;
    
        this._emit('switch (');
    
        this.compile(node.expr, frame);
    
        this._emit(') {');
    
        node.cases.forEach(function (c, i) {
          _this7._emit('case ');
    
          _this7.compile(c.cond, frame);
    
          _this7._emit(': ');
    
          _this7.compile(c.body, frame); // preserve fall-throughs
    
    
          if (c.body.children.length) {
            _this7._emitLine('break;');
          }
        });
    
        if (node.default) {
          this._emit('default:');
    
          this.compile(node.default, frame);
        }
    
        this._emit('}');
      };
    
      _proto.compileIf = function compileIf(node, frame, async) {
        var _this8 = this;
    
        this._emit('if(');
    
        this._compileExpression(node.cond, frame);
    
        this._emitLine(') {');
    
        this._withScopedSyntax(function () {
          _this8.compile(node.body, frame);
    
          if (async) {
            _this8._emit('cb()');
          }
        });
    
        if (node.else_) {
          this._emitLine('}\nelse {');
    
          this._withScopedSyntax(function () {
            _this8.compile(node.else_, frame);
    
            if (async) {
              _this8._emit('cb()');
            }
          });
        } else if (async) {
          this._emitLine('}\nelse {');
    
          this._emit('cb()');
        }
    
        this._emitLine('}');
      };
    
      _proto.compileIfAsync = function compileIfAsync(node, frame) {
        this._emit('(function(cb) {');
    
        this.compileIf(node, frame, true);
    
        this._emit('})(' + this._makeCallback());
    
        this._addScopeLevel();
      };
    
      _proto._emitLoopBindings = function _emitLoopBindings(node, arr, i, len) {
        var _this9 = this;
    
        var bindings = [{
          name: 'index',
          val: i + " + 1"
        }, {
          name: 'index0',
          val: i
        }, {
          name: 'revindex',
          val: len + " - " + i
        }, {
          name: 'revindex0',
          val: len + " - " + i + " - 1"
        }, {
          name: 'first',
          val: i + " === 0"
        }, {
          name: 'last',
          val: i + " === " + len + " - 1"
        }, {
          name: 'length',
          val: len
        }];
        bindings.forEach(function (b) {
          _this9._emitLine("frame.set(\"loop." + b.name + "\", " + b.val + ");");
        });
      };
    
      _proto.compileFor = function compileFor(node, frame) {
        var _this10 = this;
    
        // Some of this code is ugly, but it keeps the generated code
        // as fast as possible. ForAsync also shares some of this, but
        // not much.
        var i = this._tmpid();
    
        var len = this._tmpid();
    
        var arr = this._tmpid();
    
        frame = frame.push();
    
        this._emitLine('frame = frame.push();');
    
        this._emit("var " + arr + " = ");
    
        this._compileExpression(node.arr, frame);
    
        this._emitLine(';');
    
        this._emit("if(" + arr + ") {");
    
        this._emitLine(arr + ' = runtime.fromIterator(' + arr + ');'); // If multiple names are passed, we need to bind them
        // appropriately
    
    
        if (node.name instanceof nodes.Array) {
          this._emitLine("var " + i + ";"); // The object could be an arroy or object. Note that the
          // body of the loop is duplicated for each condition, but
          // we are optimizing for speed over size.
    
    
          this._emitLine("if(runtime.isArray(" + arr + ")) {");
    
          this._emitLine("var " + len + " = " + arr + ".length;");
    
          this._emitLine("for(" + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {"); // Bind each declared var
    
    
          node.name.children.forEach(function (child, u) {
            var tid = _this10._tmpid();
    
            _this10._emitLine("var " + tid + " = " + arr + "[" + i + "][" + u + "];");
    
            _this10._emitLine("frame.set(\"" + child + "\", " + arr + "[" + i + "][" + u + "]);");
    
            frame.set(node.name.children[u].value, tid);
          });
    
          this._emitLoopBindings(node, arr, i, len);
    
          this._withScopedSyntax(function () {
            _this10.compile(node.body, frame);
          });
    
          this._emitLine('}');
    
          this._emitLine('} else {'); // Iterate over the key/values of an object
    
    
          var _node$name$children = node.name.children,
              key = _node$name$children[0],
              val = _node$name$children[1];
    
          var k = this._tmpid();
    
          var v = this._tmpid();
    
          frame.set(key.value, k);
          frame.set(val.value, v);
    
          this._emitLine(i + " = -1;");
    
          this._emitLine("var " + len + " = runtime.keys(" + arr + ").length;");
    
          this._emitLine("for(var " + k + " in " + arr + ") {");
    
          this._emitLine(i + "++;");
    
          this._emitLine("var " + v + " = " + arr + "[" + k + "];");
    
          this._emitLine("frame.set(\"" + key.value + "\", " + k + ");");
    
          this._emitLine("frame.set(\"" + val.value + "\", " + v + ");");
    
          this._emitLoopBindings(node, arr, i, len);
    
          this._withScopedSyntax(function () {
            _this10.compile(node.body, frame);
          });
    
          this._emitLine('}');
    
          this._emitLine('}');
        } else {
          // Generate a typical array iteration
          var _v = this._tmpid();
    
          frame.set(node.name.value, _v);
    
          this._emitLine("var " + len + " = " + arr + ".length;");
    
          this._emitLine("for(var " + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {");
    
          this._emitLine("var " + _v + " = " + arr + "[" + i + "];");
    
          this._emitLine("frame.set(\"" + node.name.value + "\", " + _v + ");");
    
          this._emitLoopBindings(node, arr, i, len);
    
          this._withScopedSyntax(function () {
            _this10.compile(node.body, frame);
          });
    
          this._emitLine('}');
        }
    
        this._emitLine('}');
    
        if (node.else_) {
          this._emitLine('if (!' + len + ') {');
    
          this.compile(node.else_, frame);
    
          this._emitLine('}');
        }
    
        this._emitLine('frame = frame.pop();');
      };
    
      _proto._compileAsyncLoop = function _compileAsyncLoop(node, frame, parallel) {
        var _this11 = this;
    
        // This shares some code with the For tag, but not enough to
        // worry about. This iterates across an object asynchronously,
        // but not in parallel.
        var i = this._tmpid();
    
        var len = this._tmpid();
    
        var arr = this._tmpid();
    
        var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
        frame = frame.push();
    
        this._emitLine('frame = frame.push();');
    
        this._emit('var ' + arr + ' = runtime.fromIterator(');
    
        this._compileExpression(node.arr, frame);
    
        this._emitLine(');');
    
        if (node.name instanceof nodes.Array) {
          var arrayLen = node.name.children.length;
    
          this._emit("runtime." + asyncMethod + "(" + arr + ", " + arrayLen + ", function(");
    
          node.name.children.forEach(function (name) {
            _this11._emit(name.value + ",");
          });
    
          this._emit(i + ',' + len + ',next) {');
    
          node.name.children.forEach(function (name) {
            var id = name.value;
            frame.set(id, id);
    
            _this11._emitLine("frame.set(\"" + id + "\", " + id + ");");
          });
        } else {
          var id = node.name.value;
    
          this._emitLine("runtime." + asyncMethod + "(" + arr + ", 1, function(" + id + ", " + i + ", " + len + ",next) {");
    
          this._emitLine('frame.set("' + id + '", ' + id + ');');
    
          frame.set(id, id);
        }
    
        this._emitLoopBindings(node, arr, i, len);
    
        this._withScopedSyntax(function () {
          var buf;
    
          if (parallel) {
            buf = _this11._pushBuffer();
          }
    
          _this11.compile(node.body, frame);
    
          _this11._emitLine('next(' + i + (buf ? ',' + buf : '') + ');');
    
          if (parallel) {
            _this11._popBuffer();
          }
        });
    
        var output = this._tmpid();
    
        this._emitLine('}, ' + this._makeCallback(output));
    
        this._addScopeLevel();
    
        if (parallel) {
          this._emitLine(this.buffer + ' += ' + output + ';');
        }
    
        if (node.else_) {
          this._emitLine('if (!' + arr + '.length) {');
    
          this.compile(node.else_, frame);
    
          this._emitLine('}');
        }
    
        this._emitLine('frame = frame.pop();');
      };
    
      _proto.compileAsyncEach = function compileAsyncEach(node, frame) {
        this._compileAsyncLoop(node, frame);
      };
    
      _proto.compileAsyncAll = function compileAsyncAll(node, frame) {
        this._compileAsyncLoop(node, frame, true);
      };
    
      _proto._compileMacro = function _compileMacro(node, frame) {
        var _this12 = this;
    
        var args = [];
        var kwargs = null;
    
        var funcId = 'macro_' + this._tmpid();
    
        var keepFrame = frame !== undefined; // Type check the definition of the args
    
        node.args.children.forEach(function (arg, i) {
          if (i === node.args.children.length - 1 && arg instanceof nodes.Dict) {
            kwargs = arg;
          } else {
            _this12.assertType(arg, nodes.Symbol);
    
            args.push(arg);
          }
        });
        var realNames = [].concat(args.map(function (n) {
          return "l_" + n.value;
        }), ['kwargs']); // Quoted argument names
    
        var argNames = args.map(function (n) {
          return "\"" + n.value + "\"";
        });
        var kwargNames = (kwargs && kwargs.children || []).map(function (n) {
          return "\"" + n.key.value + "\"";
        }); // We pass a function to makeMacro which destructures the
        // arguments so support setting positional args with keywords
        // args and passing keyword args as positional args
        // (essentially default values). See runtime.js.
    
        var currFrame;
    
        if (keepFrame) {
          currFrame = frame.push(true);
        } else {
          currFrame = new Frame();
        }
    
        this._emitLines("var " + funcId + " = runtime.makeMacro(", "[" + argNames.join(', ') + "], ", "[" + kwargNames.join(', ') + "], ", "function (" + realNames.join(', ') + ") {", 'var callerFrame = frame;', 'frame = ' + (keepFrame ? 'frame.push(true);' : 'new runtime.Frame();'), 'kwargs = kwargs || {};', 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'); // Expose the arguments to the template. Don't need to use
        // random names because the function
        // will create a new run-time scope for us
    
    
        args.forEach(function (arg) {
          _this12._emitLine("frame.set(\"" + arg.value + "\", l_" + arg.value + ");");
    
          currFrame.set(arg.value, "l_" + arg.value);
        }); // Expose the keyword arguments
    
        if (kwargs) {
          kwargs.children.forEach(function (pair) {
            var name = pair.key.value;
    
            _this12._emit("frame.set(\"" + name + "\", ");
    
            _this12._emit("Object.prototype.hasOwnProperty.call(kwargs, \"" + name + "\")");
    
            _this12._emit(" ? kwargs[\"" + name + "\"] : ");
    
            _this12._compileExpression(pair.value, currFrame);
    
            _this12._emit(');');
          });
        }
    
        var bufferId = this._pushBuffer();
    
        this._withScopedSyntax(function () {
          _this12.compile(node.body, currFrame);
        });
    
        this._emitLine('frame = ' + (keepFrame ? 'frame.pop();' : 'callerFrame;'));
    
        this._emitLine("return new runtime.SafeString(" + bufferId + ");");
    
        this._emitLine('});');
    
        this._popBuffer();
    
        return funcId;
      };
    
      _proto.compileMacro = function compileMacro(node, frame) {
        var funcId = this._compileMacro(node); // Expose the macro to the templates
    
    
        var name = node.name.value;
        frame.set(name, funcId);
    
        if (frame.parent) {
          this._emitLine("frame.set(\"" + name + "\", " + funcId + ");");
        } else {
          if (node.name.value.charAt(0) !== '_') {
            this._emitLine("context.addExport(\"" + name + "\");");
          }
    
          this._emitLine("context.setVariable(\"" + name + "\", " + funcId + ");");
        }
      };
    
      _proto.compileCaller = function compileCaller(node, frame) {
        // basically an anonymous "macro expression"
        this._emit('(function (){');
    
        var funcId = this._compileMacro(node, frame);
    
        this._emit("return " + funcId + ";})()");
      };
    
      _proto._compileGetTemplate = function _compileGetTemplate(node, frame, eagerCompile, ignoreMissing) {
        var parentTemplateId = this._tmpid();
    
        var parentName = this._templateName();
    
        var cb = this._makeCallback(parentTemplateId);
    
        var eagerCompileArg = eagerCompile ? 'true' : 'false';
        var ignoreMissingArg = ignoreMissing ? 'true' : 'false';
    
        this._emit('env.getTemplate(');
    
        this._compileExpression(node.template, frame);
    
        this._emitLine(", " + eagerCompileArg + ", " + parentName + ", " + ignoreMissingArg + ", " + cb);
    
        return parentTemplateId;
      };
    
      _proto.compileImport = function compileImport(node, frame) {
        var target = node.target.value;
    
        var id = this._compileGetTemplate(node, frame, false, false);
    
        this._addScopeLevel();
    
        this._emitLine(id + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this._makeCallback(id));
    
        this._addScopeLevel();
    
        frame.set(target, id);
    
        if (frame.parent) {
          this._emitLine("frame.set(\"" + target + "\", " + id + ");");
        } else {
          this._emitLine("context.setVariable(\"" + target + "\", " + id + ");");
        }
      };
    
      _proto.compileFromImport = function compileFromImport(node, frame) {
        var _this13 = this;
    
        var importedId = this._compileGetTemplate(node, frame, false, false);
    
        this._addScopeLevel();
    
        this._emitLine(importedId + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this._makeCallback(importedId));
    
        this._addScopeLevel();
    
        node.names.children.forEach(function (nameNode) {
          var name;
          var alias;
    
          var id = _this13._tmpid();
    
          if (nameNode instanceof nodes.Pair) {
            name = nameNode.key.value;
            alias = nameNode.value.value;
          } else {
            name = nameNode.value;
            alias = name;
          }
    
          _this13._emitLine("if(Object.prototype.hasOwnProperty.call(" + importedId + ", \"" + name + "\")) {");
    
          _this13._emitLine("var " + id + " = " + importedId + "." + name + ";");
    
          _this13._emitLine('} else {');
    
          _this13._emitLine("cb(new Error(\"cannot import '" + name + "'\")); return;");
    
          _this13._emitLine('}');
    
          frame.set(alias, id);
    
          if (frame.parent) {
            _this13._emitLine("frame.set(\"" + alias + "\", " + id + ");");
          } else {
            _this13._emitLine("context.setVariable(\"" + alias + "\", " + id + ");");
          }
        });
      };
    
      _proto.compileBlock = function compileBlock(node) {
        var id = this._tmpid(); // If we are executing outside a block (creating a top-level
        // block), we really don't want to execute its code because it
        // will execute twice: once when the child template runs and
        // again when the parent template runs. Note that blocks
        // within blocks will *always* execute immediately *and*
        // wherever else they are invoked (like used in a parent
        // template). This may have behavioral differences from jinja
        // because blocks can have side effects, but it seems like a
        // waste of performance to always execute huge top-level
        // blocks twice
    
    
        if (!this.inBlock) {
          this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
        }
    
        this._emit("context.getBlock(\"" + node.name.value + "\")");
    
        if (!this.inBlock) {
          this._emit(')');
        }
    
        this._emitLine('(env, context, frame, runtime, ' + this._makeCallback(id));
    
        this._emitLine(this.buffer + " += " + id + ";");
    
        this._addScopeLevel();
      };
    
      _proto.compileSuper = function compileSuper(node, frame) {
        var name = node.blockName.value;
        var id = node.symbol.value;
    
        var cb = this._makeCallback(id);
    
        this._emitLine("context.getSuper(env, \"" + name + "\", b_" + name + ", frame, runtime, " + cb);
    
        this._emitLine(id + " = runtime.markSafe(" + id + ");");
    
        this._addScopeLevel();
    
        frame.set(id, id);
      };
    
      _proto.compileExtends = function compileExtends(node, frame) {
        var k = this._tmpid();
    
        var parentTemplateId = this._compileGetTemplate(node, frame, true, false); // extends is a dynamic tag and can occur within a block like
        // `if`, so if this happens we need to capture the parent
        // template in the top-level scope
    
    
        this._emitLine("parentTemplate = " + parentTemplateId);
    
        this._emitLine("for(var " + k + " in parentTemplate.blocks) {");
    
        this._emitLine("context.addBlock(" + k + ", parentTemplate.blocks[" + k + "]);");
    
        this._emitLine('}');
    
        this._addScopeLevel();
      };
    
      _proto.compileInclude = function compileInclude(node, frame) {
        this._emitLine('var tasks = [];');
    
        this._emitLine('tasks.push(');
    
        this._emitLine('function(callback) {');
    
        var id = this._compileGetTemplate(node, frame, false, node.ignoreMissing);
    
        this._emitLine("callback(null," + id + ");});");
    
        this._emitLine('});');
    
        var id2 = this._tmpid();
    
        this._emitLine('tasks.push(');
    
        this._emitLine('function(template, callback){');
    
        this._emitLine('template.render(context.getVariables(), frame, ' + this._makeCallback(id2));
    
        this._emitLine('callback(null,' + id2 + ');});');
    
        this._emitLine('});');
    
        this._emitLine('tasks.push(');
    
        this._emitLine('function(result, callback){');
    
        this._emitLine(this.buffer + " += result;");
    
        this._emitLine('callback(null);');
    
        this._emitLine('});');
    
        this._emitLine('env.waterfall(tasks, function(){');
    
        this._addScopeLevel();
      };
    
      _proto.compileTemplateData = function compileTemplateData(node, frame) {
        this.compileLiteral(node, frame);
      };
    
      _proto.compileCapture = function compileCapture(node, frame) {
        var _this14 = this;
    
        // we need to temporarily override the current buffer id as 'output'
        // so the set block writes to the capture output instead of the buffer
        var buffer = this.buffer;
        this.buffer = 'output';
    
        this._emitLine('(function() {');
    
        this._emitLine('var output = "";');
    
        this._withScopedSyntax(function () {
          _this14.compile(node.body, frame);
        });
    
        this._emitLine('return output;');
    
        this._emitLine('})()'); // and of course, revert back to the old buffer id
    
    
        this.buffer = buffer;
      };
    
      _proto.compileOutput = function compileOutput(node, frame) {
        var _this15 = this;
    
        var children = node.children;
        children.forEach(function (child) {
          // TemplateData is a special case because it is never
          // autoescaped, so simply output it for optimization
          if (child instanceof nodes.TemplateData) {
            if (child.value) {
              _this15._emit(_this15.buffer + " += ");
    
              _this15.compileLiteral(child, frame);
    
              _this15._emitLine(';');
            }
          } else {
            _this15._emit(_this15.buffer + " += runtime.suppressValue(");
    
            if (_this15.throwOnUndefined) {
              _this15._emit('runtime.ensureDefined(');
            }
    
            _this15.compile(child, frame);
    
            if (_this15.throwOnUndefined) {
              _this15._emit("," + node.lineno + "," + node.colno + ")");
            }
    
            _this15._emit(', env.opts.autoescape);\n');
          }
        });
      };
    
      _proto.compileRoot = function compileRoot(node, frame) {
        var _this16 = this;
    
        if (frame) {
          this.fail('compileRoot: root node can\'t have frame');
        }
    
        frame = new Frame();
    
        this._emitFuncBegin(node, 'root');
    
        this._emitLine('var parentTemplate = null;');
    
        this._compileChildren(node, frame);
    
        this._emitLine('if(parentTemplate) {');
    
        this._emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
    
        this._emitLine('} else {');
    
        this._emitLine("cb(null, " + this.buffer + ");");
    
        this._emitLine('}');
    
        this._emitFuncEnd(true);
    
        this.inBlock = true;
        var blockNames = [];
        var blocks = node.findAll(nodes.Block);
        blocks.forEach(function (block, i) {
          var name = block.name.value;
    
          if (blockNames.indexOf(name) !== -1) {
            throw new Error("Block \"" + name + "\" defined more than once.");
          }
    
          blockNames.push(name);
    
          _this16._emitFuncBegin(block, "b_" + name);
    
          var tmpFrame = new Frame();
    
          _this16._emitLine('var frame = frame.push(true);');
    
          _this16.compile(block.body, tmpFrame);
    
          _this16._emitFuncEnd();
        });
    
        this._emitLine('return {');
    
        blocks.forEach(function (block, i) {
          var blockName = "b_" + block.name.value;
    
          _this16._emitLine(blockName + ": " + blockName + ",");
        });
    
        this._emitLine('root: root\n};');
      };
    
      _proto.compile = function compile(node, frame) {
        var _compile = this['compile' + node.typename];
    
        if (_compile) {
          _compile.call(this, node, frame);
        } else {
          this.fail("compile: Cannot compile node: " + node.typename, node.lineno, node.colno);
        }
      };
    
      _proto.getCode = function getCode() {
        return this.codebuf.join('');
      };
    
      return Compiler;
    }(Obj);
    
    module.exports = {
      compile: function compile(src, asyncFilters, extensions, name, opts) {
        if (opts === void 0) {
          opts = {};
        }
    
        var c = new Compiler(name, opts.throwOnUndefined); // Run the extension preprocessors against the source.
    
        var preprocessors = (extensions || []).map(function (ext) {
          return ext.preprocess;
        }).filter(function (f) {
          return !!f;
        });
        var processedSrc = preprocessors.reduce(function (s, processor) {
          return processor(s);
        }, src);
        c.compile(transformer.transform(parser.parse(processedSrc, extensions, opts), asyncFilters, name));
        return c.getCode();
      },
      Compiler: Compiler
    };
    
    /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var path = __webpack_require__(4);
    
    var _require = __webpack_require__(1),
        EmitterObj = _require.EmitterObj;
    
    module.exports = /*#__PURE__*/function (_EmitterObj) {
      _inheritsLoose(Loader, _EmitterObj);
    
      function Loader() {
        return _EmitterObj.apply(this, arguments) || this;
      }
    
      var _proto = Loader.prototype;
    
      _proto.resolve = function resolve(from, to) {
        return path.resolve(path.dirname(from), to);
      };
    
      _proto.isRelative = function isRelative(filename) {
        return filename.indexOf('./') === 0 || filename.indexOf('../') === 0;
      };
    
      return Loader;
    }(EmitterObj);
    
    /***/ }),
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var asap = __webpack_require__(12);
    
    var _waterfall = __webpack_require__(15);
    
    var lib = __webpack_require__(0);
    
    var compiler = __webpack_require__(5);
    
    var filters = __webpack_require__(18);
    
    var _require = __webpack_require__(10),
        FileSystemLoader = _require.FileSystemLoader,
        WebLoader = _require.WebLoader,
        PrecompiledLoader = _require.PrecompiledLoader;
    
    var tests = __webpack_require__(20);
    
    var globals = __webpack_require__(21);
    
    var _require2 = __webpack_require__(1),
        Obj = _require2.Obj,
        EmitterObj = _require2.EmitterObj;
    
    var globalRuntime = __webpack_require__(2);
    
    var handleError = globalRuntime.handleError,
        Frame = globalRuntime.Frame;
    
    var expressApp = __webpack_require__(22); // If the user is using the async API, *always* call it
    // asynchronously even if the template was synchronous.
    
    
    function callbackAsap(cb, err, res) {
      asap(function () {
        cb(err, res);
      });
    }
    /**
     * A no-op template, for use with {% include ignore missing %}
     */
    
    
    var noopTmplSrc = {
      type: 'code',
      obj: {
        root: function root(env, context, frame, runtime, cb) {
          try {
            cb(null, '');
          } catch (e) {
            cb(handleError(e, null, null));
          }
        }
      }
    };
    
    var Environment = /*#__PURE__*/function (_EmitterObj) {
      _inheritsLoose(Environment, _EmitterObj);
    
      function Environment() {
        return _EmitterObj.apply(this, arguments) || this;
      }
    
      var _proto = Environment.prototype;
    
      _proto.init = function init(loaders, opts) {
        var _this = this;
    
        // The dev flag determines the trace that'll be shown on errors.
        // If set to true, returns the full trace from the error point,
        // otherwise will return trace starting from Template.render
        // (the full trace from within nunjucks may confuse developers using
        //  the library)
        // defaults to false
        opts = this.opts = opts || {};
        this.opts.dev = !!opts.dev; // The autoescape flag sets global autoescaping. If true,
        // every string variable will be escaped by default.
        // If false, strings can be manually escaped using the `escape` filter.
        // defaults to true
    
        this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true; // If true, this will make the system throw errors if trying
        // to output a null or undefined value
    
        this.opts.throwOnUndefined = !!opts.throwOnUndefined;
        this.opts.trimBlocks = !!opts.trimBlocks;
        this.opts.lstripBlocks = !!opts.lstripBlocks;
        this.loaders = [];
    
        if (!loaders) {
          // The filesystem loader is only available server-side
          if (FileSystemLoader) {
            this.loaders = [new FileSystemLoader('views')];
          } else if (WebLoader) {
            this.loaders = [new WebLoader('/views')];
          }
        } else {
          this.loaders = lib.isArray(loaders) ? loaders : [loaders];
        } // It's easy to use precompiled templates: just include them
        // before you configure nunjucks and this will automatically
        // pick it up and use it
    
    
        if (typeof window !== 'undefined' && window.nunjucksPrecompiled) {
          this.loaders.unshift(new PrecompiledLoader(window.nunjucksPrecompiled));
        }
    
        this._initLoaders();
    
        this.globals = globals();
        this.filters = {};
        this.tests = {};
        this.asyncFilters = [];
        this.extensions = {};
        this.extensionsList = [];
    
        lib._entries(filters).forEach(function (_ref) {
          var name = _ref[0],
              filter = _ref[1];
          return _this.addFilter(name, filter);
        });
    
        lib._entries(tests).forEach(function (_ref2) {
          var name = _ref2[0],
              test = _ref2[1];
          return _this.addTest(name, test);
        });
      };
    
      _proto._initLoaders = function _initLoaders() {
        var _this2 = this;
    
        this.loaders.forEach(function (loader) {
          // Caching and cache busting
          loader.cache = {};
    
          if (typeof loader.on === 'function') {
            loader.on('update', function (name, fullname) {
              loader.cache[name] = null;
    
              _this2.emit('update', name, fullname, loader);
            });
            loader.on('load', function (name, source) {
              _this2.emit('load', name, source, loader);
            });
          }
        });
      };
    
      _proto.invalidateCache = function invalidateCache() {
        this.loaders.forEach(function (loader) {
          loader.cache = {};
        });
      };
    
      _proto.addExtension = function addExtension(name, extension) {
        extension.__name = name;
        this.extensions[name] = extension;
        this.extensionsList.push(extension);
        return this;
      };
    
      _proto.removeExtension = function removeExtension(name) {
        var extension = this.getExtension(name);
    
        if (!extension) {
          return;
        }
    
        this.extensionsList = lib.without(this.extensionsList, extension);
        delete this.extensions[name];
      };
    
      _proto.getExtension = function getExtension(name) {
        return this.extensions[name];
      };
    
      _proto.hasExtension = function hasExtension(name) {
        return !!this.extensions[name];
      };
    
      _proto.addGlobal = function addGlobal(name, value) {
        this.globals[name] = value;
        return this;
      };
    
      _proto.getGlobal = function getGlobal(name) {
        if (typeof this.globals[name] === 'undefined') {
          throw new Error('global not found: ' + name);
        }
    
        return this.globals[name];
      };
    
      _proto.addFilter = function addFilter(name, func, async) {
        var wrapped = func;
    
        if (async) {
          this.asyncFilters.push(name);
        }
    
        this.filters[name] = wrapped;
        return this;
      };
    
      _proto.getFilter = function getFilter(name) {
        if (!this.filters[name]) {
          throw new Error('filter not found: ' + name);
        }
    
        return this.filters[name];
      };
    
      _proto.addTest = function addTest(name, func) {
        this.tests[name] = func;
        return this;
      };
    
      _proto.getTest = function getTest(name) {
        if (!this.tests[name]) {
          throw new Error('test not found: ' + name);
        }
    
        return this.tests[name];
      };
    
      _proto.resolveTemplate = function resolveTemplate(loader, parentName, filename) {
        var isRelative = loader.isRelative && parentName ? loader.isRelative(filename) : false;
        return isRelative && loader.resolve ? loader.resolve(parentName, filename) : filename;
      };
    
      _proto.getTemplate = function getTemplate(name, eagerCompile, parentName, ignoreMissing, cb) {
        var _this3 = this;
    
        var that = this;
        var tmpl = null;
    
        if (name && name.raw) {
          // this fixes autoescape for templates referenced in symbols
          name = name.raw;
        }
    
        if (lib.isFunction(parentName)) {
          cb = parentName;
          parentName = null;
          eagerCompile = eagerCompile || false;
        }
    
        if (lib.isFunction(eagerCompile)) {
          cb = eagerCompile;
          eagerCompile = false;
        }
    
        if (name instanceof Template) {
          tmpl = name;
        } else if (typeof name !== 'string') {
          throw new Error('template names must be a string: ' + name);
        } else {
          for (var i = 0; i < this.loaders.length; i++) {
            var loader = this.loaders[i];
            tmpl = loader.cache[this.resolveTemplate(loader, parentName, name)];
    
            if (tmpl) {
              break;
            }
          }
        }
    
        if (tmpl) {
          if (eagerCompile) {
            tmpl.compile();
          }
    
          if (cb) {
            cb(null, tmpl);
            return undefined;
          } else {
            return tmpl;
          }
        }
    
        var syncResult;
    
        var createTemplate = function createTemplate(err, info) {
          if (!info && !err && !ignoreMissing) {
            err = new Error('template not found: ' + name);
          }
    
          if (err) {
            if (cb) {
              cb(err);
              return;
            } else {
              throw err;
            }
          }
    
          var newTmpl;
    
          if (!info) {
            newTmpl = new Template(noopTmplSrc, _this3, '', eagerCompile);
          } else {
            newTmpl = new Template(info.src, _this3, info.path, eagerCompile);
    
            if (!info.noCache) {
              info.loader.cache[name] = newTmpl;
            }
          }
    
          if (cb) {
            cb(null, newTmpl);
          } else {
            syncResult = newTmpl;
          }
        };
    
        lib.asyncIter(this.loaders, function (loader, i, next, done) {
          function handle(err, src) {
            if (err) {
              done(err);
            } else if (src) {
              src.loader = loader;
              done(null, src);
            } else {
              next();
            }
          } // Resolve name relative to parentName
    
    
          name = that.resolveTemplate(loader, parentName, name);
    
          if (loader.async) {
            loader.getSource(name, handle);
          } else {
            handle(null, loader.getSource(name));
          }
        }, createTemplate);
        return syncResult;
      };
    
      _proto.express = function express(app) {
        return expressApp(this, app);
      };
    
      _proto.render = function render(name, ctx, cb) {
        if (lib.isFunction(ctx)) {
          cb = ctx;
          ctx = null;
        } // We support a synchronous API to make it easier to migrate
        // existing code to async. This works because if you don't do
        // anything async work, the whole thing is actually run
        // synchronously.
    
    
        var syncResult = null;
        this.getTemplate(name, function (err, tmpl) {
          if (err && cb) {
            callbackAsap(cb, err);
          } else if (err) {
            throw err;
          } else {
            syncResult = tmpl.render(ctx, cb);
          }
        });
        return syncResult;
      };
    
      _proto.renderString = function renderString(src, ctx, opts, cb) {
        if (lib.isFunction(opts)) {
          cb = opts;
          opts = {};
        }
    
        opts = opts || {};
        var tmpl = new Template(src, this, opts.path);
        return tmpl.render(ctx, cb);
      };
    
      _proto.waterfall = function waterfall(tasks, callback, forceAsync) {
        return _waterfall(tasks, callback, forceAsync);
      };
    
      return Environment;
    }(EmitterObj);
    
    var Context = /*#__PURE__*/function (_Obj) {
      _inheritsLoose(Context, _Obj);
    
      function Context() {
        return _Obj.apply(this, arguments) || this;
      }
    
      var _proto2 = Context.prototype;
    
      _proto2.init = function init(ctx, blocks, env) {
        var _this4 = this;
    
        // Has to be tied to an environment so we can tap into its globals.
        this.env = env || new Environment(); // Make a duplicate of ctx
    
        this.ctx = lib.extend({}, ctx);
        this.blocks = {};
        this.exported = [];
        lib.keys(blocks).forEach(function (name) {
          _this4.addBlock(name, blocks[name]);
        });
      };
    
      _proto2.lookup = function lookup(name) {
        // This is one of the most called functions, so optimize for
        // the typical case where the name isn't in the globals
        if (name in this.env.globals && !(name in this.ctx)) {
          return this.env.globals[name];
        } else {
          return this.ctx[name];
        }
      };
    
      _proto2.setVariable = function setVariable(name, val) {
        this.ctx[name] = val;
      };
    
      _proto2.getVariables = function getVariables() {
        return this.ctx;
      };
    
      _proto2.addBlock = function addBlock(name, block) {
        this.blocks[name] = this.blocks[name] || [];
        this.blocks[name].push(block);
        return this;
      };
    
      _proto2.getBlock = function getBlock(name) {
        if (!this.blocks[name]) {
          throw new Error('unknown block "' + name + '"');
        }
    
        return this.blocks[name][0];
      };
    
      _proto2.getSuper = function getSuper(env, name, block, frame, runtime, cb) {
        var idx = lib.indexOf(this.blocks[name] || [], block);
        var blk = this.blocks[name][idx + 1];
        var context = this;
    
        if (idx === -1 || !blk) {
          throw new Error('no super block available for "' + name + '"');
        }
    
        blk(env, context, frame, runtime, cb);
      };
    
      _proto2.addExport = function addExport(name) {
        this.exported.push(name);
      };
    
      _proto2.getExported = function getExported() {
        var _this5 = this;
    
        var exported = {};
        this.exported.forEach(function (name) {
          exported[name] = _this5.ctx[name];
        });
        return exported;
      };
    
      return Context;
    }(Obj);
    
    var Template = /*#__PURE__*/function (_Obj2) {
      _inheritsLoose(Template, _Obj2);
    
      function Template() {
        return _Obj2.apply(this, arguments) || this;
      }
    
      var _proto3 = Template.prototype;
    
      _proto3.init = function init(src, env, path, eagerCompile) {
        this.env = env || new Environment();
    
        if (lib.isObject(src)) {
          switch (src.type) {
            case 'code':
              this.tmplProps = src.obj;
              break;
    
            case 'string':
              this.tmplStr = src.obj;
              break;
    
            default:
              throw new Error("Unexpected template object type " + src.type + "; expected 'code', or 'string'");
          }
        } else if (lib.isString(src)) {
          this.tmplStr = src;
        } else {
          throw new Error('src must be a string or an object describing the source');
        }
    
        this.path = path;
    
        if (eagerCompile) {
          try {
            this._compile();
          } catch (err) {
            throw lib._prettifyError(this.path, this.env.opts.dev, err);
          }
        } else {
          this.compiled = false;
        }
      };
    
      _proto3.render = function render(ctx, parentFrame, cb) {
        var _this6 = this;
    
        if (typeof ctx === 'function') {
          cb = ctx;
          ctx = {};
        } else if (typeof parentFrame === 'function') {
          cb = parentFrame;
          parentFrame = null;
        } // If there is a parent frame, we are being called from internal
        // code of another template, and the internal system
        // depends on the sync/async nature of the parent template
        // to be inherited, so force an async callback
    
    
        var forceAsync = !parentFrame; // Catch compile errors for async rendering
    
        try {
          this.compile();
        } catch (e) {
          var err = lib._prettifyError(this.path, this.env.opts.dev, e);
    
          if (cb) {
            return callbackAsap(cb, err);
          } else {
            throw err;
          }
        }
    
        var context = new Context(ctx || {}, this.blocks, this.env);
        var frame = parentFrame ? parentFrame.push(true) : new Frame();
        frame.topLevel = true;
        var syncResult = null;
        var didError = false;
        this.rootRenderFunc(this.env, context, frame, globalRuntime, function (err, res) {
          // TODO: this is actually a bug in the compiled template (because waterfall
          // tasks are both not passing errors up the chain of callbacks AND are not
          // causing a return from the top-most render function). But fixing that
          // will require a more substantial change to the compiler.
          if (didError && cb && typeof res !== 'undefined') {
            // prevent multiple calls to cb
            return;
          }
    
          if (err) {
            err = lib._prettifyError(_this6.path, _this6.env.opts.dev, err);
            didError = true;
          }
    
          if (cb) {
            if (forceAsync) {
              callbackAsap(cb, err, res);
            } else {
              cb(err, res);
            }
          } else {
            if (err) {
              throw err;
            }
    
            syncResult = res;
          }
        });
        return syncResult;
      };
    
      _proto3.getExported = function getExported(ctx, parentFrame, cb) {
        // eslint-disable-line consistent-return
        if (typeof ctx === 'function') {
          cb = ctx;
          ctx = {};
        }
    
        if (typeof parentFrame === 'function') {
          cb = parentFrame;
          parentFrame = null;
        } // Catch compile errors for async rendering
    
    
        try {
          this.compile();
        } catch (e) {
          if (cb) {
            return cb(e);
          } else {
            throw e;
          }
        }
    
        var frame = parentFrame ? parentFrame.push() : new Frame();
        frame.topLevel = true; // Run the rootRenderFunc to populate the context with exported vars
    
        var context = new Context(ctx || {}, this.blocks, this.env);
        this.rootRenderFunc(this.env, context, frame, globalRuntime, function (err) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, context.getExported());
          }
        });
      };
    
      _proto3.compile = function compile() {
        if (!this.compiled) {
          this._compile();
        }
      };
    
      _proto3._compile = function _compile() {
        var props;
    
        if (this.tmplProps) {
          props = this.tmplProps;
        } else {
          var source = compiler.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts);
          var func = new Function(source); // eslint-disable-line no-new-func
    
          props = func();
        }
    
        this.blocks = this._getBlocks(props);
        this.rootRenderFunc = props.root;
        this.compiled = true;
      };
    
      _proto3._getBlocks = function _getBlocks(props) {
        var blocks = {};
        lib.keys(props).forEach(function (k) {
          if (k.slice(0, 2) === 'b_') {
            blocks[k.slice(2)] = props[k];
          }
        });
        return blocks;
      };
    
      return Template;
    }(Obj);
    
    module.exports = {
      Environment: Environment,
      Template: Template
    };
    
    /***/ }),
    /* 8 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var lexer = __webpack_require__(9);
    
    var nodes = __webpack_require__(3);
    
    var Obj = __webpack_require__(1).Obj;
    
    var lib = __webpack_require__(0);
    
    var Parser = /*#__PURE__*/function (_Obj) {
      _inheritsLoose(Parser, _Obj);
    
      function Parser() {
        return _Obj.apply(this, arguments) || this;
      }
    
      var _proto = Parser.prototype;
    
      _proto.init = function init(tokens) {
        this.tokens = tokens;
        this.peeked = null;
        this.breakOnBlocks = null;
        this.dropLeadingWhitespace = false;
        this.extensions = [];
      };
    
      _proto.nextToken = function nextToken(withWhitespace) {
        var tok;
    
        if (this.peeked) {
          if (!withWhitespace && this.peeked.type === lexer.TOKEN_WHITESPACE) {
            this.peeked = null;
          } else {
            tok = this.peeked;
            this.peeked = null;
            return tok;
          }
        }
    
        tok = this.tokens.nextToken();
    
        if (!withWhitespace) {
          while (tok && tok.type === lexer.TOKEN_WHITESPACE) {
            tok = this.tokens.nextToken();
          }
        }
    
        return tok;
      };
    
      _proto.peekToken = function peekToken() {
        this.peeked = this.peeked || this.nextToken();
        return this.peeked;
      };
    
      _proto.pushToken = function pushToken(tok) {
        if (this.peeked) {
          throw new Error('pushToken: can only push one token on between reads');
        }
    
        this.peeked = tok;
      };
    
      _proto.error = function error(msg, lineno, colno) {
        if (lineno === undefined || colno === undefined) {
          var tok = this.peekToken() || {};
          lineno = tok.lineno;
          colno = tok.colno;
        }
    
        if (lineno !== undefined) {
          lineno += 1;
        }
    
        if (colno !== undefined) {
          colno += 1;
        }
    
        return new lib.TemplateError(msg, lineno, colno);
      };
    
      _proto.fail = function fail(msg, lineno, colno) {
        throw this.error(msg, lineno, colno);
      };
    
      _proto.skip = function skip(type) {
        var tok = this.nextToken();
    
        if (!tok || tok.type !== type) {
          this.pushToken(tok);
          return false;
        }
    
        return true;
      };
    
      _proto.expect = function expect(type) {
        var tok = this.nextToken();
    
        if (tok.type !== type) {
          this.fail('expected ' + type + ', got ' + tok.type, tok.lineno, tok.colno);
        }
    
        return tok;
      };
    
      _proto.skipValue = function skipValue(type, val) {
        var tok = this.nextToken();
    
        if (!tok || tok.type !== type || tok.value !== val) {
          this.pushToken(tok);
          return false;
        }
    
        return true;
      };
    
      _proto.skipSymbol = function skipSymbol(val) {
        return this.skipValue(lexer.TOKEN_SYMBOL, val);
      };
    
      _proto.advanceAfterBlockEnd = function advanceAfterBlockEnd(name) {
        var tok;
    
        if (!name) {
          tok = this.peekToken();
    
          if (!tok) {
            this.fail('unexpected end of file');
          }
    
          if (tok.type !== lexer.TOKEN_SYMBOL) {
            this.fail('advanceAfterBlockEnd: expected symbol token or ' + 'explicit name to be passed');
          }
    
          name = this.nextToken().value;
        }
    
        tok = this.nextToken();
    
        if (tok && tok.type === lexer.TOKEN_BLOCK_END) {
          if (tok.value.charAt(0) === '-') {
            this.dropLeadingWhitespace = true;
          }
        } else {
          this.fail('expected block end in ' + name + ' statement');
        }
    
        return tok;
      };
    
      _proto.advanceAfterVariableEnd = function advanceAfterVariableEnd() {
        var tok = this.nextToken();
    
        if (tok && tok.type === lexer.TOKEN_VARIABLE_END) {
          this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.VARIABLE_END.length - 1) === '-';
        } else {
          this.pushToken(tok);
          this.fail('expected variable end');
        }
      };
    
      _proto.parseFor = function parseFor() {
        var forTok = this.peekToken();
        var node;
        var endBlock;
    
        if (this.skipSymbol('for')) {
          node = new nodes.For(forTok.lineno, forTok.colno);
          endBlock = 'endfor';
        } else if (this.skipSymbol('asyncEach')) {
          node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
          endBlock = 'endeach';
        } else if (this.skipSymbol('asyncAll')) {
          node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
          endBlock = 'endall';
        } else {
          this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
        }
    
        node.name = this.parsePrimary();
    
        if (!(node.name instanceof nodes.Symbol)) {
          this.fail('parseFor: variable name expected for loop');
        }
    
        var type = this.peekToken().type;
    
        if (type === lexer.TOKEN_COMMA) {
          // key/value iteration
          var key = node.name;
          node.name = new nodes.Array(key.lineno, key.colno);
          node.name.addChild(key);
    
          while (this.skip(lexer.TOKEN_COMMA)) {
            var prim = this.parsePrimary();
            node.name.addChild(prim);
          }
        }
    
        if (!this.skipSymbol('in')) {
          this.fail('parseFor: expected "in" keyword for loop', forTok.lineno, forTok.colno);
        }
    
        node.arr = this.parseExpression();
        this.advanceAfterBlockEnd(forTok.value);
        node.body = this.parseUntilBlocks(endBlock, 'else');
    
        if (this.skipSymbol('else')) {
          this.advanceAfterBlockEnd('else');
          node.else_ = this.parseUntilBlocks(endBlock);
        }
    
        this.advanceAfterBlockEnd();
        return node;
      };
    
      _proto.parseMacro = function parseMacro() {
        var macroTok = this.peekToken();
    
        if (!this.skipSymbol('macro')) {
          this.fail('expected macro');
        }
    
        var name = this.parsePrimary(true);
        var args = this.parseSignature();
        var node = new nodes.Macro(macroTok.lineno, macroTok.colno, name, args);
        this.advanceAfterBlockEnd(macroTok.value);
        node.body = this.parseUntilBlocks('endmacro');
        this.advanceAfterBlockEnd();
        return node;
      };
    
      _proto.parseCall = function parseCall() {
        // a call block is parsed as a normal FunCall, but with an added
        // 'caller' kwarg which is a Caller node.
        var callTok = this.peekToken();
    
        if (!this.skipSymbol('call')) {
          this.fail('expected call');
        }
    
        var callerArgs = this.parseSignature(true) || new nodes.NodeList();
        var macroCall = this.parsePrimary();
        this.advanceAfterBlockEnd(callTok.value);
        var body = this.parseUntilBlocks('endcall');
        this.advanceAfterBlockEnd();
        var callerName = new nodes.Symbol(callTok.lineno, callTok.colno, 'caller');
        var callerNode = new nodes.Caller(callTok.lineno, callTok.colno, callerName, callerArgs, body); // add the additional caller kwarg, adding kwargs if necessary
    
        var args = macroCall.args.children;
    
        if (!(args[args.length - 1] instanceof nodes.KeywordArgs)) {
          args.push(new nodes.KeywordArgs());
        }
    
        var kwargs = args[args.length - 1];
        kwargs.addChild(new nodes.Pair(callTok.lineno, callTok.colno, callerName, callerNode));
        return new nodes.Output(callTok.lineno, callTok.colno, [macroCall]);
      };
    
      _proto.parseWithContext = function parseWithContext() {
        var tok = this.peekToken();
        var withContext = null;
    
        if (this.skipSymbol('with')) {
          withContext = true;
        } else if (this.skipSymbol('without')) {
          withContext = false;
        }
    
        if (withContext !== null) {
          if (!this.skipSymbol('context')) {
            this.fail('parseFrom: expected context after with/without', tok.lineno, tok.colno);
          }
        }
    
        return withContext;
      };
    
      _proto.parseImport = function parseImport() {
        var importTok = this.peekToken();
    
        if (!this.skipSymbol('import')) {
          this.fail('parseImport: expected import', importTok.lineno, importTok.colno);
        }
    
        var template = this.parseExpression();
    
        if (!this.skipSymbol('as')) {
          this.fail('parseImport: expected "as" keyword', importTok.lineno, importTok.colno);
        }
    
        var target = this.parseExpression();
        var withContext = this.parseWithContext();
        var node = new nodes.Import(importTok.lineno, importTok.colno, template, target, withContext);
        this.advanceAfterBlockEnd(importTok.value);
        return node;
      };
    
      _proto.parseFrom = function parseFrom() {
        var fromTok = this.peekToken();
    
        if (!this.skipSymbol('from')) {
          this.fail('parseFrom: expected from');
        }
    
        var template = this.parseExpression();
    
        if (!this.skipSymbol('import')) {
          this.fail('parseFrom: expected import', fromTok.lineno, fromTok.colno);
        }
    
        var names = new nodes.NodeList();
        var withContext;
    
        while (1) {
          // eslint-disable-line no-constant-condition
          var nextTok = this.peekToken();
    
          if (nextTok.type === lexer.TOKEN_BLOCK_END) {
            if (!names.children.length) {
              this.fail('parseFrom: Expected at least one import name', fromTok.lineno, fromTok.colno);
            } // Since we are manually advancing past the block end,
            // need to keep track of whitespace control (normally
            // this is done in `advanceAfterBlockEnd`
    
    
            if (nextTok.value.charAt(0) === '-') {
              this.dropLeadingWhitespace = true;
            }
    
            this.nextToken();
            break;
          }
    
          if (names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
            this.fail('parseFrom: expected comma', fromTok.lineno, fromTok.colno);
          }
    
          var name = this.parsePrimary();
    
          if (name.value.charAt(0) === '_') {
            this.fail('parseFrom: names starting with an underscore cannot be imported', name.lineno, name.colno);
          }
    
          if (this.skipSymbol('as')) {
            var alias = this.parsePrimary();
            names.addChild(new nodes.Pair(name.lineno, name.colno, name, alias));
          } else {
            names.addChild(name);
          }
    
          withContext = this.parseWithContext();
        }
    
        return new nodes.FromImport(fromTok.lineno, fromTok.colno, template, names, withContext);
      };
    
      _proto.parseBlock = function parseBlock() {
        var tag = this.peekToken();
    
        if (!this.skipSymbol('block')) {
          this.fail('parseBlock: expected block', tag.lineno, tag.colno);
        }
    
        var node = new nodes.Block(tag.lineno, tag.colno);
        node.name = this.parsePrimary();
    
        if (!(node.name instanceof nodes.Symbol)) {
          this.fail('parseBlock: variable name expected', tag.lineno, tag.colno);
        }
    
        this.advanceAfterBlockEnd(tag.value);
        node.body = this.parseUntilBlocks('endblock');
        this.skipSymbol('endblock');
        this.skipSymbol(node.name.value);
        var tok = this.peekToken();
    
        if (!tok) {
          this.fail('parseBlock: expected endblock, got end of file');
        }
    
        this.advanceAfterBlockEnd(tok.value);
        return node;
      };
    
      _proto.parseExtends = function parseExtends() {
        var tagName = 'extends';
        var tag = this.peekToken();
    
        if (!this.skipSymbol(tagName)) {
          this.fail('parseTemplateRef: expected ' + tagName);
        }
    
        var node = new nodes.Extends(tag.lineno, tag.colno);
        node.template = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);
        return node;
      };
    
      _proto.parseInclude = function parseInclude() {
        var tagName = 'include';
        var tag = this.peekToken();
    
        if (!this.skipSymbol(tagName)) {
          this.fail('parseInclude: expected ' + tagName);
        }
    
        var node = new nodes.Include(tag.lineno, tag.colno);
        node.template = this.parseExpression();
    
        if (this.skipSymbol('ignore') && this.skipSymbol('missing')) {
          node.ignoreMissing = true;
        }
    
        this.advanceAfterBlockEnd(tag.value);
        return node;
      };
    
      _proto.parseIf = function parseIf() {
        var tag = this.peekToken();
        var node;
    
        if (this.skipSymbol('if') || this.skipSymbol('elif') || this.skipSymbol('elseif')) {
          node = new nodes.If(tag.lineno, tag.colno);
        } else if (this.skipSymbol('ifAsync')) {
          node = new nodes.IfAsync(tag.lineno, tag.colno);
        } else {
          this.fail('parseIf: expected if, elif, or elseif', tag.lineno, tag.colno);
        }
    
        node.cond = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);
        node.body = this.parseUntilBlocks('elif', 'elseif', 'else', 'endif');
        var tok = this.peekToken();
    
        switch (tok && tok.value) {
          case 'elseif':
          case 'elif':
            node.else_ = this.parseIf();
            break;
    
          case 'else':
            this.advanceAfterBlockEnd();
            node.else_ = this.parseUntilBlocks('endif');
            this.advanceAfterBlockEnd();
            break;
    
          case 'endif':
            node.else_ = null;
            this.advanceAfterBlockEnd();
            break;
    
          default:
            this.fail('parseIf: expected elif, else, or endif, got end of file');
        }
    
        return node;
      };
    
      _proto.parseSet = function parseSet() {
        var tag = this.peekToken();
    
        if (!this.skipSymbol('set')) {
          this.fail('parseSet: expected set', tag.lineno, tag.colno);
        }
    
        var node = new nodes.Set(tag.lineno, tag.colno, []);
        var target;
    
        while (target = this.parsePrimary()) {
          node.targets.push(target);
    
          if (!this.skip(lexer.TOKEN_COMMA)) {
            break;
          }
        }
    
        if (!this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
          if (!this.skip(lexer.TOKEN_BLOCK_END)) {
            this.fail('parseSet: expected = or block end in set tag', tag.lineno, tag.colno);
          } else {
            node.body = new nodes.Capture(tag.lineno, tag.colno, this.parseUntilBlocks('endset'));
            node.value = null;
            this.advanceAfterBlockEnd();
          }
        } else {
          node.value = this.parseExpression();
          this.advanceAfterBlockEnd(tag.value);
        }
    
        return node;
      };
    
      _proto.parseSwitch = function parseSwitch() {
        /*
         * Store the tag names in variables in case someone ever wants to
         * customize this.
         */
        var switchStart = 'switch';
        var switchEnd = 'endswitch';
        var caseStart = 'case';
        var caseDefault = 'default'; // Get the switch tag.
    
        var tag = this.peekToken(); // fail early if we get some unexpected tag.
    
        if (!this.skipSymbol(switchStart) && !this.skipSymbol(caseStart) && !this.skipSymbol(caseDefault)) {
          this.fail('parseSwitch: expected "switch," "case" or "default"', tag.lineno, tag.colno);
        } // parse the switch expression
    
    
        var expr = this.parseExpression(); // advance until a start of a case, a default case or an endswitch.
    
        this.advanceAfterBlockEnd(switchStart);
        this.parseUntilBlocks(caseStart, caseDefault, switchEnd); // this is the first case. it could also be an endswitch, we'll check.
    
        var tok = this.peekToken(); // create new variables for our cases and default case.
    
        var cases = [];
        var defaultCase; // while we're dealing with new cases nodes...
    
        do {
          // skip the start symbol and get the case expression
          this.skipSymbol(caseStart);
          var cond = this.parseExpression();
          this.advanceAfterBlockEnd(switchStart); // get the body of the case node and add it to the array of cases.
    
          var body = this.parseUntilBlocks(caseStart, caseDefault, switchEnd);
          cases.push(new nodes.Case(tok.line, tok.col, cond, body)); // get our next case
    
          tok = this.peekToken();
        } while (tok && tok.value === caseStart); // we either have a default case or a switch end.
    
    
        switch (tok.value) {
          case caseDefault:
            this.advanceAfterBlockEnd();
            defaultCase = this.parseUntilBlocks(switchEnd);
            this.advanceAfterBlockEnd();
            break;
    
          case switchEnd:
            this.advanceAfterBlockEnd();
            break;
    
          default:
            // otherwise bail because EOF
            this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
        } // and return the switch node.
    
    
        return new nodes.Switch(tag.lineno, tag.colno, expr, cases, defaultCase);
      };
    
      _proto.parseStatement = function parseStatement() {
        var tok = this.peekToken();
        var node;
    
        if (tok.type !== lexer.TOKEN_SYMBOL) {
          this.fail('tag name expected', tok.lineno, tok.colno);
        }
    
        if (this.breakOnBlocks && lib.indexOf(this.breakOnBlocks, tok.value) !== -1) {
          return null;
        }
    
        switch (tok.value) {
          case 'raw':
            return this.parseRaw();
    
          case 'verbatim':
            return this.parseRaw('verbatim');
    
          case 'if':
          case 'ifAsync':
            return this.parseIf();
    
          case 'for':
          case 'asyncEach':
          case 'asyncAll':
            return this.parseFor();
    
          case 'block':
            return this.parseBlock();
    
          case 'extends':
            return this.parseExtends();
    
          case 'include':
            return this.parseInclude();
    
          case 'set':
            return this.parseSet();
    
          case 'macro':
            return this.parseMacro();
    
          case 'call':
            return this.parseCall();
    
          case 'import':
            return this.parseImport();
    
          case 'from':
            return this.parseFrom();
    
          case 'filter':
            return this.parseFilterStatement();
    
          case 'switch':
            return this.parseSwitch();
    
          default:
            if (this.extensions.length) {
              for (var i = 0; i < this.extensions.length; i++) {
                var ext = this.extensions[i];
    
                if (lib.indexOf(ext.tags || [], tok.value) !== -1) {
                  return ext.parse(this, nodes, lexer);
                }
              }
            }
    
            this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
        }
    
        return node;
      };
    
      _proto.parseRaw = function parseRaw(tagName) {
        tagName = tagName || 'raw';
        var endTagName = 'end' + tagName; // Look for upcoming raw blocks (ignore all other kinds of blocks)
    
        var rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}');
        var rawLevel = 1;
        var str = '';
        var matches = null; // Skip opening raw token
        // Keep this token to track line and column numbers
    
        var begun = this.advanceAfterBlockEnd(); // Exit when there's nothing to match
        // or when we've found the matching "endraw" block
    
        while ((matches = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
          var all = matches[0];
          var pre = matches[1];
          var blockName = matches[2]; // Adjust rawlevel
    
          if (blockName === tagName) {
            rawLevel += 1;
          } else if (blockName === endTagName) {
            rawLevel -= 1;
          } // Add to str
    
    
          if (rawLevel === 0) {
            // We want to exclude the last "endraw"
            str += pre; // Move tokenizer to beginning of endraw block
    
            this.tokens.backN(all.length - pre.length);
          } else {
            str += all;
          }
        }
    
        return new nodes.Output(begun.lineno, begun.colno, [new nodes.TemplateData(begun.lineno, begun.colno, str)]);
      };
    
      _proto.parsePostfix = function parsePostfix(node) {
        var lookup;
        var tok = this.peekToken();
    
        while (tok) {
          if (tok.type === lexer.TOKEN_LEFT_PAREN) {
            // Function call
            node = new nodes.FunCall(tok.lineno, tok.colno, node, this.parseSignature());
          } else if (tok.type === lexer.TOKEN_LEFT_BRACKET) {
            // Reference
            lookup = this.parseAggregate();
    
            if (lookup.children.length > 1) {
              this.fail('invalid index');
            }
    
            node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup.children[0]);
          } else if (tok.type === lexer.TOKEN_OPERATOR && tok.value === '.') {
            // Reference
            this.nextToken();
            var val = this.nextToken();
    
            if (val.type !== lexer.TOKEN_SYMBOL) {
              this.fail('expected name as lookup value, got ' + val.value, val.lineno, val.colno);
            } // Make a literal string because it's not a variable
            // reference
    
    
            lookup = new nodes.Literal(val.lineno, val.colno, val.value);
            node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup);
          } else {
            break;
          }
    
          tok = this.peekToken();
        }
    
        return node;
      };
    
      _proto.parseExpression = function parseExpression() {
        var node = this.parseInlineIf();
        return node;
      };
    
      _proto.parseInlineIf = function parseInlineIf() {
        var node = this.parseOr();
    
        if (this.skipSymbol('if')) {
          var condNode = this.parseOr();
          var bodyNode = node;
          node = new nodes.InlineIf(node.lineno, node.colno);
          node.body = bodyNode;
          node.cond = condNode;
    
          if (this.skipSymbol('else')) {
            node.else_ = this.parseOr();
          } else {
            node.else_ = null;
          }
        }
    
        return node;
      };
    
      _proto.parseOr = function parseOr() {
        var node = this.parseAnd();
    
        while (this.skipSymbol('or')) {
          var node2 = this.parseAnd();
          node = new nodes.Or(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseAnd = function parseAnd() {
        var node = this.parseNot();
    
        while (this.skipSymbol('and')) {
          var node2 = this.parseNot();
          node = new nodes.And(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseNot = function parseNot() {
        var tok = this.peekToken();
    
        if (this.skipSymbol('not')) {
          return new nodes.Not(tok.lineno, tok.colno, this.parseNot());
        }
    
        return this.parseIn();
      };
    
      _proto.parseIn = function parseIn() {
        var node = this.parseIs();
    
        while (1) {
          // eslint-disable-line no-constant-condition
          // check if the next token is 'not'
          var tok = this.nextToken();
    
          if (!tok) {
            break;
          }
    
          var invert = tok.type === lexer.TOKEN_SYMBOL && tok.value === 'not'; // if it wasn't 'not', put it back
    
          if (!invert) {
            this.pushToken(tok);
          }
    
          if (this.skipSymbol('in')) {
            var node2 = this.parseIs();
            node = new nodes.In(node.lineno, node.colno, node, node2);
    
            if (invert) {
              node = new nodes.Not(node.lineno, node.colno, node);
            }
          } else {
            // if we'd found a 'not' but this wasn't an 'in', put back the 'not'
            if (invert) {
              this.pushToken(tok);
            }
    
            break;
          }
        }
    
        return node;
      } // I put this right after "in" in the operator precedence stack. That can
      // obviously be changed to be closer to Jinja.
      ;
    
      _proto.parseIs = function parseIs() {
        var node = this.parseCompare(); // look for an is
    
        if (this.skipSymbol('is')) {
          // look for a not
          var not = this.skipSymbol('not'); // get the next node
    
          var node2 = this.parseCompare(); // create an Is node using the next node and the info from our Is node.
    
          node = new nodes.Is(node.lineno, node.colno, node, node2); // if we have a Not, create a Not node from our Is node.
    
          if (not) {
            node = new nodes.Not(node.lineno, node.colno, node);
          }
        } // return the node.
    
    
        return node;
      };
    
      _proto.parseCompare = function parseCompare() {
        var compareOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
        var expr = this.parseConcat();
        var ops = [];
    
        while (1) {
          // eslint-disable-line no-constant-condition
          var tok = this.nextToken();
    
          if (!tok) {
            break;
          } else if (compareOps.indexOf(tok.value) !== -1) {
            ops.push(new nodes.CompareOperand(tok.lineno, tok.colno, this.parseConcat(), tok.value));
          } else {
            this.pushToken(tok);
            break;
          }
        }
    
        if (ops.length) {
          return new nodes.Compare(ops[0].lineno, ops[0].colno, expr, ops);
        } else {
          return expr;
        }
      } // finds the '~' for string concatenation
      ;
    
      _proto.parseConcat = function parseConcat() {
        var node = this.parseAdd();
    
        while (this.skipValue(lexer.TOKEN_TILDE, '~')) {
          var node2 = this.parseAdd();
          node = new nodes.Concat(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseAdd = function parseAdd() {
        var node = this.parseSub();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
          var node2 = this.parseSub();
          node = new nodes.Add(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseSub = function parseSub() {
        var node = this.parseMul();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
          var node2 = this.parseMul();
          node = new nodes.Sub(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseMul = function parseMul() {
        var node = this.parseDiv();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '*')) {
          var node2 = this.parseDiv();
          node = new nodes.Mul(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseDiv = function parseDiv() {
        var node = this.parseFloorDiv();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '/')) {
          var node2 = this.parseFloorDiv();
          node = new nodes.Div(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseFloorDiv = function parseFloorDiv() {
        var node = this.parseMod();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '//')) {
          var node2 = this.parseMod();
          node = new nodes.FloorDiv(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseMod = function parseMod() {
        var node = this.parsePow();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '%')) {
          var node2 = this.parsePow();
          node = new nodes.Mod(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parsePow = function parsePow() {
        var node = this.parseUnary();
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '**')) {
          var node2 = this.parseUnary();
          node = new nodes.Pow(node.lineno, node.colno, node, node2);
        }
    
        return node;
      };
    
      _proto.parseUnary = function parseUnary(noFilters) {
        var tok = this.peekToken();
        var node;
    
        if (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
          node = new nodes.Neg(tok.lineno, tok.colno, this.parseUnary(true));
        } else if (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
          node = new nodes.Pos(tok.lineno, tok.colno, this.parseUnary(true));
        } else {
          node = this.parsePrimary();
        }
    
        if (!noFilters) {
          node = this.parseFilter(node);
        }
    
        return node;
      };
    
      _proto.parsePrimary = function parsePrimary(noPostfix) {
        var tok = this.nextToken();
        var val;
        var node = null;
    
        if (!tok) {
          this.fail('expected expression, got end of file');
        } else if (tok.type === lexer.TOKEN_STRING) {
          val = tok.value;
        } else if (tok.type === lexer.TOKEN_INT) {
          val = parseInt(tok.value, 10);
        } else if (tok.type === lexer.TOKEN_FLOAT) {
          val = parseFloat(tok.value);
        } else if (tok.type === lexer.TOKEN_BOOLEAN) {
          if (tok.value === 'true') {
            val = true;
          } else if (tok.value === 'false') {
            val = false;
          } else {
            this.fail('invalid boolean: ' + tok.value, tok.lineno, tok.colno);
          }
        } else if (tok.type === lexer.TOKEN_NONE) {
          val = null;
        } else if (tok.type === lexer.TOKEN_REGEX) {
          val = new RegExp(tok.value.body, tok.value.flags);
        }
    
        if (val !== undefined) {
          node = new nodes.Literal(tok.lineno, tok.colno, val);
        } else if (tok.type === lexer.TOKEN_SYMBOL) {
          node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);
        } else {
          // See if it's an aggregate type, we need to push the
          // current delimiter token back on
          this.pushToken(tok);
          node = this.parseAggregate();
        }
    
        if (!noPostfix) {
          node = this.parsePostfix(node);
        }
    
        if (node) {
          return node;
        } else {
          throw this.error("unexpected token: " + tok.value, tok.lineno, tok.colno);
        }
      };
    
      _proto.parseFilterName = function parseFilterName() {
        var tok = this.expect(lexer.TOKEN_SYMBOL);
        var name = tok.value;
    
        while (this.skipValue(lexer.TOKEN_OPERATOR, '.')) {
          name += '.' + this.expect(lexer.TOKEN_SYMBOL).value;
        }
    
        return new nodes.Symbol(tok.lineno, tok.colno, name);
      };
    
      _proto.parseFilterArgs = function parseFilterArgs(node) {
        if (this.peekToken().type === lexer.TOKEN_LEFT_PAREN) {
          // Get a FunCall node and add the parameters to the
          // filter
          var call = this.parsePostfix(node);
          return call.args.children;
        }
    
        return [];
      };
    
      _proto.parseFilter = function parseFilter(node) {
        while (this.skip(lexer.TOKEN_PIPE)) {
          var name = this.parseFilterName();
          node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [node].concat(this.parseFilterArgs(node))));
        }
    
        return node;
      };
    
      _proto.parseFilterStatement = function parseFilterStatement() {
        var filterTok = this.peekToken();
    
        if (!this.skipSymbol('filter')) {
          this.fail('parseFilterStatement: expected filter');
        }
    
        var name = this.parseFilterName();
        var args = this.parseFilterArgs(name);
        this.advanceAfterBlockEnd(filterTok.value);
        var body = new nodes.Capture(name.lineno, name.colno, this.parseUntilBlocks('endfilter'));
        this.advanceAfterBlockEnd();
        var node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [body].concat(args)));
        return new nodes.Output(name.lineno, name.colno, [node]);
      };
    
      _proto.parseAggregate = function parseAggregate() {
        var tok = this.nextToken();
        var node;
    
        switch (tok.type) {
          case lexer.TOKEN_LEFT_PAREN:
            node = new nodes.Group(tok.lineno, tok.colno);
            break;
    
          case lexer.TOKEN_LEFT_BRACKET:
            node = new nodes.Array(tok.lineno, tok.colno);
            break;
    
          case lexer.TOKEN_LEFT_CURLY:
            node = new nodes.Dict(tok.lineno, tok.colno);
            break;
    
          default:
            return null;
        }
    
        while (1) {
          // eslint-disable-line no-constant-condition
          var type = this.peekToken().type;
    
          if (type === lexer.TOKEN_RIGHT_PAREN || type === lexer.TOKEN_RIGHT_BRACKET || type === lexer.TOKEN_RIGHT_CURLY) {
            this.nextToken();
            break;
          }
    
          if (node.children.length > 0) {
            if (!this.skip(lexer.TOKEN_COMMA)) {
              this.fail('parseAggregate: expected comma after expression', tok.lineno, tok.colno);
            }
          }
    
          if (node instanceof nodes.Dict) {
            // TODO: check for errors
            var key = this.parsePrimary(); // We expect a key/value pair for dicts, separated by a
            // colon
    
            if (!this.skip(lexer.TOKEN_COLON)) {
              this.fail('parseAggregate: expected colon after dict key', tok.lineno, tok.colno);
            } // TODO: check for errors
    
    
            var value = this.parseExpression();
            node.addChild(new nodes.Pair(key.lineno, key.colno, key, value));
          } else {
            // TODO: check for errors
            var expr = this.parseExpression();
            node.addChild(expr);
          }
        }
    
        return node;
      };
    
      _proto.parseSignature = function parseSignature(tolerant, noParens) {
        var tok = this.peekToken();
    
        if (!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
          if (tolerant) {
            return null;
          } else {
            this.fail('expected arguments', tok.lineno, tok.colno);
          }
        }
    
        if (tok.type === lexer.TOKEN_LEFT_PAREN) {
          tok = this.nextToken();
        }
    
        var args = new nodes.NodeList(tok.lineno, tok.colno);
        var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
        var checkComma = false;
    
        while (1) {
          // eslint-disable-line no-constant-condition
          tok = this.peekToken();
    
          if (!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
            this.nextToken();
            break;
          } else if (noParens && tok.type === lexer.TOKEN_BLOCK_END) {
            break;
          }
    
          if (checkComma && !this.skip(lexer.TOKEN_COMMA)) {
            this.fail('parseSignature: expected comma after expression', tok.lineno, tok.colno);
          } else {
            var arg = this.parseExpression();
    
            if (this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
              kwargs.addChild(new nodes.Pair(arg.lineno, arg.colno, arg, this.parseExpression()));
            } else {
              args.addChild(arg);
            }
          }
    
          checkComma = true;
        }
    
        if (kwargs.children.length) {
          args.addChild(kwargs);
        }
    
        return args;
      };
    
      _proto.parseUntilBlocks = function parseUntilBlocks() {
        var prev = this.breakOnBlocks;
    
        for (var _len = arguments.length, blockNames = new Array(_len), _key = 0; _key < _len; _key++) {
          blockNames[_key] = arguments[_key];
        }
    
        this.breakOnBlocks = blockNames;
        var ret = this.parse();
        this.breakOnBlocks = prev;
        return ret;
      };
    
      _proto.parseNodes = function parseNodes() {
        var tok;
        var buf = [];
    
        while (tok = this.nextToken()) {
          if (tok.type === lexer.TOKEN_DATA) {
            var data = tok.value;
            var nextToken = this.peekToken();
            var nextVal = nextToken && nextToken.value; // If the last token has "-" we need to trim the
            // leading whitespace of the data. This is marked with
            // the `dropLeadingWhitespace` variable.
    
            if (this.dropLeadingWhitespace) {
              // TODO: this could be optimized (don't use regex)
              data = data.replace(/^\s*/, '');
              this.dropLeadingWhitespace = false;
            } // Same for the succeeding block start token
    
    
            if (nextToken && (nextToken.type === lexer.TOKEN_BLOCK_START && nextVal.charAt(nextVal.length - 1) === '-' || nextToken.type === lexer.TOKEN_VARIABLE_START && nextVal.charAt(this.tokens.tags.VARIABLE_START.length) === '-' || nextToken.type === lexer.TOKEN_COMMENT && nextVal.charAt(this.tokens.tags.COMMENT_START.length) === '-')) {
              // TODO: this could be optimized (don't use regex)
              data = data.replace(/\s*$/, '');
            }
    
            buf.push(new nodes.Output(tok.lineno, tok.colno, [new nodes.TemplateData(tok.lineno, tok.colno, data)]));
          } else if (tok.type === lexer.TOKEN_BLOCK_START) {
            this.dropLeadingWhitespace = false;
            var n = this.parseStatement();
    
            if (!n) {
              break;
            }
    
            buf.push(n);
          } else if (tok.type === lexer.TOKEN_VARIABLE_START) {
            var e = this.parseExpression();
            this.dropLeadingWhitespace = false;
            this.advanceAfterVariableEnd();
            buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
          } else if (tok.type === lexer.TOKEN_COMMENT) {
            this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.COMMENT_END.length - 1) === '-';
          } else {
            // Ignore comments, otherwise this should be an error
            this.fail('Unexpected token at top-level: ' + tok.type, tok.lineno, tok.colno);
          }
        }
    
        return buf;
      };
    
      _proto.parse = function parse() {
        return new nodes.NodeList(0, 0, this.parseNodes());
      };
    
      _proto.parseAsRoot = function parseAsRoot() {
        return new nodes.Root(0, 0, this.parseNodes());
      };
    
      return Parser;
    }(Obj); // var util = require('util');
    // var l = lexer.lex('{%- if x -%}\n hello {% endif %}');
    // var t;
    // while((t = l.nextToken())) {
    //     console.log(util.inspect(t));
    // }
    // var p = new Parser(lexer.lex('hello {% filter title %}' +
    //                              'Hello madam how are you' +
    //                              '{% endfilter %}'));
    // var n = p.parseAsRoot();
    // nodes.printNodes(n);
    
    
    module.exports = {
      parse: function parse(src, extensions, opts) {
        var p = new Parser(lexer.lex(src, opts));
    
        if (extensions !== undefined) {
          p.extensions = extensions;
        }
    
        return p.parseAsRoot();
      },
      Parser: Parser
    };
    
    /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var lib = __webpack_require__(0);
    
    var whitespaceChars = " \n\t\r\xA0";
    var delimChars = '()[]{}%*-+~/#,:|.<>=!';
    var intChars = '0123456789';
    var BLOCK_START = '{%';
    var BLOCK_END = '%}';
    var VARIABLE_START = '{{';
    var VARIABLE_END = '}}';
    var COMMENT_START = '{#';
    var COMMENT_END = '#}';
    var TOKEN_STRING = 'string';
    var TOKEN_WHITESPACE = 'whitespace';
    var TOKEN_DATA = 'data';
    var TOKEN_BLOCK_START = 'block-start';
    var TOKEN_BLOCK_END = 'block-end';
    var TOKEN_VARIABLE_START = 'variable-start';
    var TOKEN_VARIABLE_END = 'variable-end';
    var TOKEN_COMMENT = 'comment';
    var TOKEN_LEFT_PAREN = 'left-paren';
    var TOKEN_RIGHT_PAREN = 'right-paren';
    var TOKEN_LEFT_BRACKET = 'left-bracket';
    var TOKEN_RIGHT_BRACKET = 'right-bracket';
    var TOKEN_LEFT_CURLY = 'left-curly';
    var TOKEN_RIGHT_CURLY = 'right-curly';
    var TOKEN_OPERATOR = 'operator';
    var TOKEN_COMMA = 'comma';
    var TOKEN_COLON = 'colon';
    var TOKEN_TILDE = 'tilde';
    var TOKEN_PIPE = 'pipe';
    var TOKEN_INT = 'int';
    var TOKEN_FLOAT = 'float';
    var TOKEN_BOOLEAN = 'boolean';
    var TOKEN_NONE = 'none';
    var TOKEN_SYMBOL = 'symbol';
    var TOKEN_SPECIAL = 'special';
    var TOKEN_REGEX = 'regex';
    
    function token(type, value, lineno, colno) {
      return {
        type: type,
        value: value,
        lineno: lineno,
        colno: colno
      };
    }
    
    var Tokenizer = /*#__PURE__*/function () {
      function Tokenizer(str, opts) {
        this.str = str;
        this.index = 0;
        this.len = str.length;
        this.lineno = 0;
        this.colno = 0;
        this.in_code = false;
        opts = opts || {};
        var tags = opts.tags || {};
        this.tags = {
          BLOCK_START: tags.blockStart || BLOCK_START,
          BLOCK_END: tags.blockEnd || BLOCK_END,
          VARIABLE_START: tags.variableStart || VARIABLE_START,
          VARIABLE_END: tags.variableEnd || VARIABLE_END,
          COMMENT_START: tags.commentStart || COMMENT_START,
          COMMENT_END: tags.commentEnd || COMMENT_END
        };
        this.trimBlocks = !!opts.trimBlocks;
        this.lstripBlocks = !!opts.lstripBlocks;
      }
    
      var _proto = Tokenizer.prototype;
    
      _proto.nextToken = function nextToken() {
        var lineno = this.lineno;
        var colno = this.colno;
        var tok;
    
        if (this.in_code) {
          // Otherwise, if we are in a block parse it as code
          var cur = this.current();
    
          if (this.isFinished()) {
            // We have nothing else to parse
            return null;
          } else if (cur === '"' || cur === '\'') {
            // We've hit a string
            return token(TOKEN_STRING, this._parseString(cur), lineno, colno);
          } else if (tok = this._extract(whitespaceChars)) {
            // We hit some whitespace
            return token(TOKEN_WHITESPACE, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.BLOCK_END)) || (tok = this._extractString('-' + this.tags.BLOCK_END))) {
            // Special check for the block end tag
            //
            // It is a requirement that start and end tags are composed of
            // delimiter characters (%{}[] etc), and our code always
            // breaks on delimiters so we can assume the token parsing
            // doesn't consume these elsewhere
            this.in_code = false;
    
            if (this.trimBlocks) {
              cur = this.current();
    
              if (cur === '\n') {
                // Skip newline
                this.forward();
              } else if (cur === '\r') {
                // Skip CRLF newline
                this.forward();
                cur = this.current();
    
                if (cur === '\n') {
                  this.forward();
                } else {
                  // Was not a CRLF, so go back
                  this.back();
                }
              }
            }
    
            return token(TOKEN_BLOCK_END, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.VARIABLE_END)) || (tok = this._extractString('-' + this.tags.VARIABLE_END))) {
            // Special check for variable end tag (see above)
            this.in_code = false;
            return token(TOKEN_VARIABLE_END, tok, lineno, colno);
          } else if (cur === 'r' && this.str.charAt(this.index + 1) === '/') {
            // Skip past 'r/'.
            this.forwardN(2); // Extract until the end of the regex -- / ends it, \/ does not.
    
            var regexBody = '';
    
            while (!this.isFinished()) {
              if (this.current() === '/' && this.previous() !== '\\') {
                this.forward();
                break;
              } else {
                regexBody += this.current();
                this.forward();
              }
            } // Check for flags.
            // The possible flags are according to https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
    
    
            var POSSIBLE_FLAGS = ['g', 'i', 'm', 'y'];
            var regexFlags = '';
    
            while (!this.isFinished()) {
              var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
    
              if (isCurrentAFlag) {
                regexFlags += this.current();
                this.forward();
              } else {
                break;
              }
            }
    
            return token(TOKEN_REGEX, {
              body: regexBody,
              flags: regexFlags
            }, lineno, colno);
          } else if (delimChars.indexOf(cur) !== -1) {
            // We've hit a delimiter (a special char like a bracket)
            this.forward();
            var complexOps = ['==', '===', '!=', '!==', '<=', '>=', '//', '**'];
            var curComplex = cur + this.current();
            var type;
    
            if (lib.indexOf(complexOps, curComplex) !== -1) {
              this.forward();
              cur = curComplex; // See if this is a strict equality/inequality comparator
    
              if (lib.indexOf(complexOps, curComplex + this.current()) !== -1) {
                cur = curComplex + this.current();
                this.forward();
              }
            }
    
            switch (cur) {
              case '(':
                type = TOKEN_LEFT_PAREN;
                break;
    
              case ')':
                type = TOKEN_RIGHT_PAREN;
                break;
    
              case '[':
                type = TOKEN_LEFT_BRACKET;
                break;
    
              case ']':
                type = TOKEN_RIGHT_BRACKET;
                break;
    
              case '{':
                type = TOKEN_LEFT_CURLY;
                break;
    
              case '}':
                type = TOKEN_RIGHT_CURLY;
                break;
    
              case ',':
                type = TOKEN_COMMA;
                break;
    
              case ':':
                type = TOKEN_COLON;
                break;
    
              case '~':
                type = TOKEN_TILDE;
                break;
    
              case '|':
                type = TOKEN_PIPE;
                break;
    
              default:
                type = TOKEN_OPERATOR;
            }
    
            return token(type, cur, lineno, colno);
          } else {
            // We are not at whitespace or a delimiter, so extract the
            // text and parse it
            tok = this._extractUntil(whitespaceChars + delimChars);
    
            if (tok.match(/^[-+]?[0-9]+$/)) {
              if (this.current() === '.') {
                this.forward();
    
                var dec = this._extract(intChars);
    
                return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
              } else {
                return token(TOKEN_INT, tok, lineno, colno);
              }
            } else if (tok.match(/^(true|false)$/)) {
              return token(TOKEN_BOOLEAN, tok, lineno, colno);
            } else if (tok === 'none') {
              return token(TOKEN_NONE, tok, lineno, colno);
              /*
               * Added to make the test `null is null` evaluate truthily.
               * Otherwise, Nunjucks will look up null in the context and
               * return `undefined`, which is not what we want. This *may* have
               * consequences is someone is using null in their templates as a
               * variable.
               */
            } else if (tok === 'null') {
              return token(TOKEN_NONE, tok, lineno, colno);
            } else if (tok) {
              return token(TOKEN_SYMBOL, tok, lineno, colno);
            } else {
              throw new Error('Unexpected value while parsing: ' + tok);
            }
          }
        } else {
          // Parse out the template text, breaking on tag
          // delimiters because we need to look for block/variable start
          // tags (don't use the full delimChars for optimization)
          var beginChars = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
    
          if (this.isFinished()) {
            return null;
          } else if ((tok = this._extractString(this.tags.BLOCK_START + '-')) || (tok = this._extractString(this.tags.BLOCK_START))) {
            this.in_code = true;
            return token(TOKEN_BLOCK_START, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.VARIABLE_START + '-')) || (tok = this._extractString(this.tags.VARIABLE_START))) {
            this.in_code = true;
            return token(TOKEN_VARIABLE_START, tok, lineno, colno);
          } else {
            tok = '';
            var data;
            var inComment = false;
    
            if (this._matches(this.tags.COMMENT_START)) {
              inComment = true;
              tok = this._extractString(this.tags.COMMENT_START);
            } // Continually consume text, breaking on the tag delimiter
            // characters and checking to see if it's a start tag.
            //
            // We could hit the end of the template in the middle of
            // our looping, so check for the null return value from
            // _extractUntil
    
    
            while ((data = this._extractUntil(beginChars)) !== null) {
              tok += data;
    
              if ((this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !inComment) {
                if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= tok.length) {
                  var lastLine = tok.slice(-this.colno);
    
                  if (/^\s+$/.test(lastLine)) {
                    // Remove block leading whitespace from beginning of the string
                    tok = tok.slice(0, -this.colno);
    
                    if (!tok.length) {
                      // All data removed, collapse to avoid unnecessary nodes
                      // by returning next token (block start)
                      return this.nextToken();
                    }
                  }
                } // If it is a start tag, stop looping
    
    
                break;
              } else if (this._matches(this.tags.COMMENT_END)) {
                if (!inComment) {
                  throw new Error('unexpected end of comment');
                }
    
                tok += this._extractString(this.tags.COMMENT_END);
                break;
              } else {
                // It does not match any tag, so add the character and
                // carry on
                tok += this.current();
                this.forward();
              }
            }
    
            if (data === null && inComment) {
              throw new Error('expected end of comment, got end of file');
            }
    
            return token(inComment ? TOKEN_COMMENT : TOKEN_DATA, tok, lineno, colno);
          }
        }
      };
    
      _proto._parseString = function _parseString(delimiter) {
        this.forward();
        var str = '';
    
        while (!this.isFinished() && this.current() !== delimiter) {
          var cur = this.current();
    
          if (cur === '\\') {
            this.forward();
    
            switch (this.current()) {
              case 'n':
                str += '\n';
                break;
    
              case 't':
                str += '\t';
                break;
    
              case 'r':
                str += '\r';
                break;
    
              default:
                str += this.current();
            }
    
            this.forward();
          } else {
            str += cur;
            this.forward();
          }
        }
    
        this.forward();
        return str;
      };
    
      _proto._matches = function _matches(str) {
        if (this.index + str.length > this.len) {
          return null;
        }
    
        var m = this.str.slice(this.index, this.index + str.length);
        return m === str;
      };
    
      _proto._extractString = function _extractString(str) {
        if (this._matches(str)) {
          this.forwardN(str.length);
          return str;
        }
    
        return null;
      };
    
      _proto._extractUntil = function _extractUntil(charString) {
        // Extract all non-matching chars, with the default matching set
        // to everything
        return this._extractMatching(true, charString || '');
      };
    
      _proto._extract = function _extract(charString) {
        // Extract all matching chars (no default, so charString must be
        // explicit)
        return this._extractMatching(false, charString);
      };
    
      _proto._extractMatching = function _extractMatching(breakOnMatch, charString) {
        // Pull out characters until a breaking char is hit.
        // If breakOnMatch is false, a non-matching char stops it.
        // If breakOnMatch is true, a matching char stops it.
        if (this.isFinished()) {
          return null;
        }
    
        var first = charString.indexOf(this.current()); // Only proceed if the first character doesn't meet our condition
    
        if (breakOnMatch && first === -1 || !breakOnMatch && first !== -1) {
          var t = this.current();
          this.forward(); // And pull out all the chars one at a time until we hit a
          // breaking char
    
          var idx = charString.indexOf(this.current());
    
          while ((breakOnMatch && idx === -1 || !breakOnMatch && idx !== -1) && !this.isFinished()) {
            t += this.current();
            this.forward();
            idx = charString.indexOf(this.current());
          }
    
          return t;
        }
    
        return '';
      };
    
      _proto._extractRegex = function _extractRegex(regex) {
        var matches = this.currentStr().match(regex);
    
        if (!matches) {
          return null;
        } // Move forward whatever was matched
    
    
        this.forwardN(matches[0].length);
        return matches;
      };
    
      _proto.isFinished = function isFinished() {
        return this.index >= this.len;
      };
    
      _proto.forwardN = function forwardN(n) {
        for (var i = 0; i < n; i++) {
          this.forward();
        }
      };
    
      _proto.forward = function forward() {
        this.index++;
    
        if (this.previous() === '\n') {
          this.lineno++;
          this.colno = 0;
        } else {
          this.colno++;
        }
      };
    
      _proto.backN = function backN(n) {
        for (var i = 0; i < n; i++) {
          this.back();
        }
      };
    
      _proto.back = function back() {
        this.index--;
    
        if (this.current() === '\n') {
          this.lineno--;
          var idx = this.src.lastIndexOf('\n', this.index - 1);
    
          if (idx === -1) {
            this.colno = this.index;
          } else {
            this.colno = this.index - idx;
          }
        } else {
          this.colno--;
        }
      } // current returns current character
      ;
    
      _proto.current = function current() {
        if (!this.isFinished()) {
          return this.str.charAt(this.index);
        }
    
        return '';
      } // currentStr returns what's left of the unparsed string
      ;
    
      _proto.currentStr = function currentStr() {
        if (!this.isFinished()) {
          return this.str.substr(this.index);
        }
    
        return '';
      };
    
      _proto.previous = function previous() {
        return this.str.charAt(this.index - 1);
      };
    
      return Tokenizer;
    }();
    
    module.exports = {
      lex: function lex(src, opts) {
        return new Tokenizer(src, opts);
      },
      TOKEN_STRING: TOKEN_STRING,
      TOKEN_WHITESPACE: TOKEN_WHITESPACE,
      TOKEN_DATA: TOKEN_DATA,
      TOKEN_BLOCK_START: TOKEN_BLOCK_START,
      TOKEN_BLOCK_END: TOKEN_BLOCK_END,
      TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
      TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
      TOKEN_COMMENT: TOKEN_COMMENT,
      TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
      TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
      TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
      TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
      TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
      TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
      TOKEN_OPERATOR: TOKEN_OPERATOR,
      TOKEN_COMMA: TOKEN_COMMA,
      TOKEN_COLON: TOKEN_COLON,
      TOKEN_TILDE: TOKEN_TILDE,
      TOKEN_PIPE: TOKEN_PIPE,
      TOKEN_INT: TOKEN_INT,
      TOKEN_FLOAT: TOKEN_FLOAT,
      TOKEN_BOOLEAN: TOKEN_BOOLEAN,
      TOKEN_NONE: TOKEN_NONE,
      TOKEN_SYMBOL: TOKEN_SYMBOL,
      TOKEN_SPECIAL: TOKEN_SPECIAL,
      TOKEN_REGEX: TOKEN_REGEX
    };
    
    /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var Loader = __webpack_require__(6);
    
    var _require = __webpack_require__(19),
        PrecompiledLoader = _require.PrecompiledLoader;
    
    var WebLoader = /*#__PURE__*/function (_Loader) {
      _inheritsLoose(WebLoader, _Loader);
    
      function WebLoader(baseURL, opts) {
        var _this;
    
        _this = _Loader.call(this) || this;
        _this.baseURL = baseURL || '.';
        opts = opts || {}; // By default, the cache is turned off because there's no way
        // to "watch" templates over HTTP, so they are re-downloaded
        // and compiled each time. (Remember, PRECOMPILE YOUR
        // TEMPLATES in production!)
    
        _this.useCache = !!opts.useCache; // We default `async` to false so that the simple synchronous
        // API can be used when you aren't doing anything async in
        // your templates (which is most of the time). This performs a
        // sync ajax request, but that's ok because it should *only*
        // happen in development. PRECOMPILE YOUR TEMPLATES.
    
        _this.async = !!opts.async;
        return _this;
      }
    
      var _proto = WebLoader.prototype;
    
      _proto.resolve = function resolve(from, to) {
        throw new Error('relative templates not support in the browser yet');
      };
    
      _proto.getSource = function getSource(name, cb) {
        var _this2 = this;
    
        var useCache = this.useCache;
        var result;
        this.fetch(this.baseURL + '/' + name, function (err, src) {
          if (err) {
            if (cb) {
              cb(err.content);
            } else if (err.status === 404) {
              result = null;
            } else {
              throw err.content;
            }
          } else {
            result = {
              src: src,
              path: name,
              noCache: !useCache
            };
    
            _this2.emit('load', name, result);
    
            if (cb) {
              cb(null, result);
            }
          }
        }); // if this WebLoader isn't running asynchronously, the
        // fetch above would actually run sync and we'll have a
        // result here
    
        return result;
      };
    
      _proto.fetch = function fetch(url, cb) {
        // Only in the browser please
        if (typeof window === 'undefined') {
          throw new Error('WebLoader can only by used in a browser');
        }
    
        var ajax = new XMLHttpRequest();
        var loading = true;
    
        ajax.onreadystatechange = function () {
          if (ajax.readyState === 4 && loading) {
            loading = false;
    
            if (ajax.status === 0 || ajax.status === 200) {
              cb(null, ajax.responseText);
            } else {
              cb({
                status: ajax.status,
                content: ajax.responseText
              });
            }
          }
        };
    
        url += (url.indexOf('?') === -1 ? '?' : '&') + 's=' + new Date().getTime();
        ajax.open('GET', url, this.async);
        ajax.send();
      };
    
      return WebLoader;
    }(Loader);
    
    module.exports = {
      WebLoader: WebLoader,
      PrecompiledLoader: PrecompiledLoader
    };
    
    /***/ }),
    /* 11 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var lib = __webpack_require__(0);
    
    var _require = __webpack_require__(7),
        Environment = _require.Environment,
        Template = _require.Template;
    
    var Loader = __webpack_require__(6);
    
    var loaders = __webpack_require__(10);
    
    var precompile = __webpack_require__(23);
    
    var compiler = __webpack_require__(5);
    
    var parser = __webpack_require__(8);
    
    var lexer = __webpack_require__(9);
    
    var runtime = __webpack_require__(2);
    
    var nodes = __webpack_require__(3);
    
    var installJinjaCompat = __webpack_require__(25); // A single instance of an environment, since this is so commonly used
    
    
    var e;
    
    function configure(templatesPath, opts) {
      opts = opts || {};
    
      if (lib.isObject(templatesPath)) {
        opts = templatesPath;
        templatesPath = null;
      }
    
      var TemplateLoader;
    
      if (loaders.FileSystemLoader) {
        TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
          watch: opts.watch,
          noCache: opts.noCache
        });
      } else if (loaders.WebLoader) {
        TemplateLoader = new loaders.WebLoader(templatesPath, {
          useCache: opts.web && opts.web.useCache,
          async: opts.web && opts.web.async
        });
      }
    
      e = new Environment(TemplateLoader, opts);
    
      if (opts && opts.express) {
        e.express(opts.express);
      }
    
      return e;
    }
    
    module.exports = {
      Environment: Environment,
      Template: Template,
      Loader: Loader,
      FileSystemLoader: loaders.FileSystemLoader,
      NodeResolveLoader: loaders.NodeResolveLoader,
      PrecompiledLoader: loaders.PrecompiledLoader,
      WebLoader: loaders.WebLoader,
      compiler: compiler,
      parser: parser,
      lexer: lexer,
      runtime: runtime,
      lib: lib,
      nodes: nodes,
      installJinjaCompat: installJinjaCompat,
      configure: configure,
      reset: function reset() {
        e = undefined;
      },
      compile: function compile(src, env, path, eagerCompile) {
        if (!e) {
          configure();
        }
    
        return new Template(src, env, path, eagerCompile);
      },
      render: function render(name, ctx, cb) {
        if (!e) {
          configure();
        }
    
        return e.render(name, ctx, cb);
      },
      renderString: function renderString(src, ctx, cb) {
        if (!e) {
          configure();
        }
    
        return e.renderString(src, ctx, cb);
      },
      precompile: precompile ? precompile.precompile : undefined,
      precompileString: precompile ? precompile.precompileString : undefined
    };
    
    /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    // rawAsap provides everything we need except exception management.
    var rawAsap = __webpack_require__(13);
    // RawTasks are recycled to reduce GC churn.
    var freeTasks = [];
    // We queue errors to ensure they are thrown in right order (FIFO).
    // Array-as-queue is good enough here, since we are just dealing with exceptions.
    var pendingErrors = [];
    var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
    
    function throwFirstError() {
        if (pendingErrors.length) {
            throw pendingErrors.shift();
        }
    }
    
    /**
     * Calls a task as soon as possible after returning, in its own event, with priority
     * over other events like animation, reflow, and repaint. An error thrown from an
     * event will not interrupt, nor even substantially slow down the processing of
     * other events, but will be rather postponed to a lower priority event.
     * @param {{call}} task A callable object, typically a function that takes no
     * arguments.
     */
    module.exports = asap;
    function asap(task) {
        var rawTask;
        if (freeTasks.length) {
            rawTask = freeTasks.pop();
        } else {
            rawTask = new RawTask();
        }
        rawTask.task = task;
        rawAsap(rawTask);
    }
    
    // We wrap tasks with recyclable task objects.  A task object implements
    // `call`, just like a function.
    function RawTask() {
        this.task = null;
    }
    
    // The sole purpose of wrapping the task is to catch the exception and recycle
    // the task object after its single use.
    RawTask.prototype.call = function () {
        try {
            this.task.call();
        } catch (error) {
            if (asap.onerror) {
                // This hook exists purely for testing purposes.
                // Its name will be periodically randomized to break any code that
                // depends on its existence.
                asap.onerror(error);
            } else {
                // In a web browser, exceptions are not fatal. However, to avoid
                // slowing down the queue of pending tasks, we rethrow the error in a
                // lower priority turn.
                pendingErrors.push(error);
                requestErrorThrow();
            }
        } finally {
            this.task = null;
            freeTasks[freeTasks.length] = this;
        }
    };
    
    
    /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {
    
    // Use the fastest means possible to execute a task in its own turn, with
    // priority over other events including IO, animation, reflow, and redraw
    // events in browsers.
    //
    // An exception thrown by a task will permanently interrupt the processing of
    // subsequent tasks. The higher level `asap` function ensures that if an
    // exception is thrown by a task, that the task queue will continue flushing as
    // soon as possible, but if you use `rawAsap` directly, you are responsible to
    // either ensure that no exceptions are thrown from your task, or to manually
    // call `rawAsap.requestFlush` if an exception is thrown.
    module.exports = rawAsap;
    function rawAsap(task) {
        if (!queue.length) {
            requestFlush();
            flushing = true;
        }
        // Equivalent to push, but avoids a function call.
        queue[queue.length] = task;
    }
    
    var queue = [];
    // Once a flush has been requested, no further calls to `requestFlush` are
    // necessary until the next `flush` completes.
    var flushing = false;
    // `requestFlush` is an implementation-specific method that attempts to kick
    // off a `flush` event as quickly as possible. `flush` will attempt to exhaust
    // the event queue before yielding to the browser's own event loop.
    var requestFlush;
    // The position of the next task to execute in the task queue. This is
    // preserved between calls to `flush` so that it can be resumed if
    // a task throws an exception.
    var index = 0;
    // If a task schedules additional tasks recursively, the task queue can grow
    // unbounded. To prevent memory exhaustion, the task queue will periodically
    // truncate already-completed tasks.
    var capacity = 1024;
    
    // The flush function processes all tasks that have been scheduled with
    // `rawAsap` unless and until one of those tasks throws an exception.
    // If a task throws an exception, `flush` ensures that its state will remain
    // consistent and will resume where it left off when called again.
    // However, `flush` does not make any arrangements to be called again if an
    // exception is thrown.
    function flush() {
        while (index < queue.length) {
            var currentIndex = index;
            // Advance the index before calling the task. This ensures that we will
            // begin flushing on the next task the task throws an error.
            index = index + 1;
            queue[currentIndex].call();
            // Prevent leaking memory for long chains of recursive calls to `asap`.
            // If we call `asap` within tasks scheduled by `asap`, the queue will
            // grow, but to avoid an O(n) walk for every task we execute, we don't
            // shift tasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 tasks off the queue.
            if (index > capacity) {
                // Manually shift all values starting at the index back to the
                // beginning of the queue.
                for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                    queue[scan] = queue[scan + index];
                }
                queue.length -= index;
                index = 0;
            }
        }
        queue.length = 0;
        index = 0;
        flushing = false;
    }
    
    // `requestFlush` is implemented using a strategy based on data collected from
    // every available SauceLabs Selenium web driver worker at time of writing.
    // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
    
    // Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
    // have WebKitMutationObserver but not un-prefixed MutationObserver.
    // Must use `global` or `self` instead of `window` to work in both frames and web
    // workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
    
    /* globals self */
    var scope = typeof global !== "undefined" ? global : self;
    var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
    
    // MutationObservers are desirable because they have high priority and work
    // reliably everywhere they are implemented.
    // They are implemented in all modern browsers.
    //
    // - Android 4-4.3
    // - Chrome 26-34
    // - Firefox 14-29
    // - Internet Explorer 11
    // - iPad Safari 6-7.1
    // - iPhone Safari 7-7.1
    // - Safari 6-7
    if (typeof BrowserMutationObserver === "function") {
        requestFlush = makeRequestCallFromMutationObserver(flush);
    
    // MessageChannels are desirable because they give direct access to the HTML
    // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
    // 11-12, and in web workers in many engines.
    // Although message channels yield to any queued rendering and IO tasks, they
    // would be better than imposing the 4ms delay of timers.
    // However, they do not work reliably in Internet Explorer or Safari.
    
    // Internet Explorer 10 is the only browser that has setImmediate but does
    // not have MutationObservers.
    // Although setImmediate yields to the browser's renderer, it would be
    // preferrable to falling back to setTimeout since it does not have
    // the minimum 4ms penalty.
    // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
    // Desktop to a lesser extent) that renders both setImmediate and
    // MessageChannel useless for the purposes of ASAP.
    // https://github.com/kriskowal/q/issues/396
    
    // Timers are implemented universally.
    // We fall back to timers in workers in most engines, and in foreground
    // contexts in the following browsers.
    // However, note that even this simple case requires nuances to operate in a
    // broad spectrum of browsers.
    //
    // - Firefox 3-13
    // - Internet Explorer 6-9
    // - iPad Safari 4.3
    // - Lynx 2.8.7
    } else {
        requestFlush = makeRequestCallFromTimer(flush);
    }
    
    // `requestFlush` requests that the high priority event queue be flushed as
    // soon as possible.
    // This is useful to prevent an error thrown in a task from stalling the event
    // queue if the exception handled by Node.js’s
    // `process.on("uncaughtException")` or by a domain.
    rawAsap.requestFlush = requestFlush;
    
    // To request a high priority event, we induce a mutation observer by toggling
    // the text of a text node between "1" and "-1".
    function makeRequestCallFromMutationObserver(callback) {
        var toggle = 1;
        var observer = new BrowserMutationObserver(callback);
        var node = document.createTextNode("");
        observer.observe(node, {characterData: true});
        return function requestCall() {
            toggle = -toggle;
            node.data = toggle;
        };
    }
    
    // The message channel technique was discovered by Malte Ubl and was the
    // original foundation for this library.
    // http://www.nonblocking.io/2011/06/windownexttick.html
    
    // Safari 6.0.5 (at least) intermittently fails to create message ports on a
    // page's first load. Thankfully, this version of Safari supports
    // MutationObservers, so we don't need to fall back in that case.
    
    // function makeRequestCallFromMessageChannel(callback) {
    //     var channel = new MessageChannel();
    //     channel.port1.onmessage = callback;
    //     return function requestCall() {
    //         channel.port2.postMessage(0);
    //     };
    // }
    
    // For reasons explained above, we are also unable to use `setImmediate`
    // under any circumstances.
    // Even if we were, there is another bug in Internet Explorer 10.
    // It is not sufficient to assign `setImmediate` to `requestFlush` because
    // `setImmediate` must be called *by name* and therefore must be wrapped in a
    // closure.
    // Never forget.
    
    // function makeRequestCallFromSetImmediate(callback) {
    //     return function requestCall() {
    //         setImmediate(callback);
    //     };
    // }
    
    // Safari 6.0 has a problem where timers will get lost while the user is
    // scrolling. This problem does not impact ASAP because Safari 6.0 supports
    // mutation observers, so that implementation is used instead.
    // However, if we ever elect to use timers in Safari, the prevalent work-around
    // is to add a scroll event listener that calls for a flush.
    
    // `setTimeout` does not call the passed callback if the delay is less than
    // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
    // even then.
    
    function makeRequestCallFromTimer(callback) {
        return function requestCall() {
            // We dispatch a timeout with a specified delay of 0 for engines that
            // can reliably accommodate that request. This will usually be snapped
            // to a 4 milisecond delay, but once we're flushing, there's no delay
            // between events.
            var timeoutHandle = setTimeout(handleTimer, 0);
            // However, since this timer gets frequently dropped in Firefox
            // workers, we enlist an interval handle that will try to fire
            // an event 20 times per second until it succeeds.
            var intervalHandle = setInterval(handleTimer, 50);
    
            function handleTimer() {
                // Whichever timer succeeds will cancel both timers and
                // execute the callback.
                clearTimeout(timeoutHandle);
                clearInterval(intervalHandle);
                callback();
            }
        };
    }
    
    // This is for `asap.js` only.
    // Its name will be periodically randomized to break any code that depends on
    // its existence.
    rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
    
    // ASAP was originally a nextTick shim included in Q. This was factored out
    // into this ASAP package. It was later adapted to RSVP which made further
    // amendments. These decisions, particularly to marginalize MessageChannel and
    // to capture the MutationObserver implementation in a closure, were integrated
    // back into ASAP proper.
    // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js
    
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))
    
    /***/ }),
    /* 14 */
    /***/ (function(module, exports) {
    
    var g;
    
    // This works in non-strict mode
    g = (function() {
        return this;
    })();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1,eval)("this");
    } catch(e) {
        // This works if the window reference is available
        if(typeof window === "object")
            g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    
    /***/ }),
    /* 15 */
    /***/ (function(module, exports, __webpack_require__) {
    
    var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// MIT license (by Elan Shanker).
    (function(globals) {
      'use strict';
    
      var executeSync = function(){
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === 'function'){
          args[0].apply(null, args.splice(1));
        }
      };
    
      var executeAsync = function(fn){
        if (typeof setImmediate === 'function') {
          setImmediate(fn);
        } else if (typeof process !== 'undefined' && process.nextTick) {
          process.nextTick(fn);
        } else {
          setTimeout(fn, 0);
        }
      };
    
      var makeIterator = function (tasks) {
        var makeCallback = function (index) {
          var fn = function () {
            if (tasks.length) {
              tasks[index].apply(null, arguments);
            }
            return fn.next();
          };
          fn.next = function () {
            return (index < tasks.length - 1) ? makeCallback(index + 1): null;
          };
          return fn;
        };
        return makeCallback(0);
      };
      
      var _isArray = Array.isArray || function(maybeArray){
        return Object.prototype.toString.call(maybeArray) === '[object Array]';
      };
    
      var waterfall = function (tasks, callback, forceAsync) {
        var nextTick = forceAsync ? executeAsync : executeSync;
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
          return callback();
        }
        var wrapIterator = function (iterator) {
          return function (err) {
            if (err) {
              callback.apply(null, arguments);
              callback = function () {};
            } else {
              var args = Array.prototype.slice.call(arguments, 1);
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(callback);
              }
              nextTick(function () {
                iterator.apply(null, args);
              });
            }
          };
        };
        wrapIterator(makeIterator(tasks))();
      };
    
      if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
          return waterfall;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // RequireJS
      } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = waterfall; // CommonJS
      } else {
        globals.waterfall = waterfall; // <script>
      }
    })(this);
    
    
    /***/ }),
    /* 16 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    
    
    var R = typeof Reflect === 'object' ? Reflect : null
    var ReflectApply = R && typeof R.apply === 'function'
      ? R.apply
      : function ReflectApply(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      }
    
    var ReflectOwnKeys
    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target)
          .concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    
    var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    }
    
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    
    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;
    
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined;
    
    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    var defaultMaxListeners = 10;
    
    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    
    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }
        defaultMaxListeners = arg;
      }
    });
    
    EventEmitter.init = function() {
    
      if (this._events === undefined ||
          this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }
    
      this._maxListeners = this._maxListeners || undefined;
    };
    
    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }
      this._maxListeners = n;
      return this;
    };
    
    function _getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = (type === 'error');
    
      var events = this._events;
      if (events !== undefined)
        doError = (doError && events.error === undefined);
      else if (!doError)
        return false;
    
      // If there is no 'error' event listener then throw.
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }
    
      var handler = events[type];
    
      if (handler === undefined)
        return false;
    
      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
    
      return true;
    };
    
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
    
      checkListener(listener);
    
      events = target._events;
      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);
    
          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }
    
      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] =
            prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
    
        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + String(type) + ' listeners ' +
                              'added. Use emitter.setMaxListeners() to ' +
                              'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
    
      return target;
    }
    
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    
    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };
    
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    
    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    
    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          checkListener(listener);
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };
    
    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;
    
          checkListener(listener);
    
          events = this._events;
          if (events === undefined)
            return this;
    
          list = events[type];
          if (list === undefined)
            return this;
    
          if (list === listener || list.listener === listener) {
            if (--this._eventsCount === 0)
              this._events = Object.create(null);
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;
    
            for (i = list.length - 1; i >= 0; i--) {
              if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }
    
            if (position < 0)
              return this;
    
            if (position === 0)
              list.shift();
            else {
              spliceOne(list, position);
            }
    
            if (list.length === 1)
              events[type] = list[0];
    
            if (events.removeListener !== undefined)
              this.emit('removeListener', type, originalListener || listener);
          }
    
          return this;
        };
    
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    
    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events, i;
    
          events = this._events;
          if (events === undefined)
            return this;
    
          // not listening for removeListener, no need to emit
          if (events.removeListener === undefined) {
            if (arguments.length === 0) {
              this._events = Object.create(null);
              this._eventsCount = 0;
            } else if (events[type] !== undefined) {
              if (--this._eventsCount === 0)
                this._events = Object.create(null);
              else
                delete events[type];
            }
            return this;
          }
    
          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            var key;
            for (i = 0; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = Object.create(null);
            this._eventsCount = 0;
            return this;
          }
    
          listeners = events[type];
    
          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners !== undefined) {
            // LIFO order
            for (i = listeners.length - 1; i >= 0; i--) {
              this.removeListener(type, listeners[i]);
            }
          }
    
          return this;
        };
    
    function _listeners(target, type, unwrap) {
      var events = target._events;
    
      if (events === undefined)
        return [];
    
      var evlistener = events[type];
      if (evlistener === undefined)
        return [];
    
      if (typeof evlistener === 'function')
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    
      return unwrap ?
        unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
    
      if (events !== undefined) {
        var evlistener = events[type];
    
        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }
    
      return 0;
    }
    
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    
    function once(emitter, name) {
      return new Promise(function (resolve, reject) {
        function eventListener() {
          if (errorListener !== undefined) {
            emitter.removeListener('error', errorListener);
          }
          resolve([].slice.call(arguments));
        };
        var errorListener;
    
        // Adding an error listener is not optional because
        // if an error is thrown on an event emitter we cannot
        // guarantee that the actual event we are waiting will
        // be fired. The result could be a silent way to create
        // memory or file descriptor leaks, which is something
        // we should avoid.
        if (name !== 'error') {
          errorListener = function errorListener(err) {
            emitter.removeListener(name, eventListener);
            reject(err);
          };
    
          emitter.once('error', errorListener);
        }
    
        emitter.once(name, eventListener);
      });
    }
    
    
    /***/ }),
    /* 17 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var nodes = __webpack_require__(3);
    
    var lib = __webpack_require__(0);
    
    var sym = 0;
    
    function gensym() {
      return 'hole_' + sym++;
    } // copy-on-write version of map
    
    
    function mapCOW(arr, func) {
      var res = null;
    
      for (var i = 0; i < arr.length; i++) {
        var item = func(arr[i]);
    
        if (item !== arr[i]) {
          if (!res) {
            res = arr.slice();
          }
    
          res[i] = item;
        }
      }
    
      return res || arr;
    }
    
    function walk(ast, func, depthFirst) {
      if (!(ast instanceof nodes.Node)) {
        return ast;
      }
    
      if (!depthFirst) {
        var astT = func(ast);
    
        if (astT && astT !== ast) {
          return astT;
        }
      }
    
      if (ast instanceof nodes.NodeList) {
        var children = mapCOW(ast.children, function (node) {
          return walk(node, func, depthFirst);
        });
    
        if (children !== ast.children) {
          ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
        }
      } else if (ast instanceof nodes.CallExtension) {
        var args = walk(ast.args, func, depthFirst);
        var contentArgs = mapCOW(ast.contentArgs, function (node) {
          return walk(node, func, depthFirst);
        });
    
        if (args !== ast.args || contentArgs !== ast.contentArgs) {
          ast = new nodes[ast.typename](ast.extName, ast.prop, args, contentArgs);
        }
      } else {
        var props = ast.fields.map(function (field) {
          return ast[field];
        });
        var propsT = mapCOW(props, function (prop) {
          return walk(prop, func, depthFirst);
        });
    
        if (propsT !== props) {
          ast = new nodes[ast.typename](ast.lineno, ast.colno);
          propsT.forEach(function (prop, i) {
            ast[ast.fields[i]] = prop;
          });
        }
      }
    
      return depthFirst ? func(ast) || ast : ast;
    }
    
    function depthWalk(ast, func) {
      return walk(ast, func, true);
    }
    
    function _liftFilters(node, asyncFilters, prop) {
      var children = [];
      var walked = depthWalk(prop ? node[prop] : node, function (descNode) {
        var symbol;
    
        if (descNode instanceof nodes.Block) {
          return descNode;
        } else if (descNode instanceof nodes.Filter && lib.indexOf(asyncFilters, descNode.name.value) !== -1 || descNode instanceof nodes.CallExtensionAsync) {
          symbol = new nodes.Symbol(descNode.lineno, descNode.colno, gensym());
          children.push(new nodes.FilterAsync(descNode.lineno, descNode.colno, descNode.name, descNode.args, symbol));
        }
    
        return symbol;
      });
    
      if (prop) {
        node[prop] = walked;
      } else {
        node = walked;
      }
    
      if (children.length) {
        children.push(node);
        return new nodes.NodeList(node.lineno, node.colno, children);
      } else {
        return node;
      }
    }
    
    function liftFilters(ast, asyncFilters) {
      return depthWalk(ast, function (node) {
        if (node instanceof nodes.Output) {
          return _liftFilters(node, asyncFilters);
        } else if (node instanceof nodes.Set) {
          return _liftFilters(node, asyncFilters, 'value');
        } else if (node instanceof nodes.For) {
          return _liftFilters(node, asyncFilters, 'arr');
        } else if (node instanceof nodes.If) {
          return _liftFilters(node, asyncFilters, 'cond');
        } else if (node instanceof nodes.CallExtension) {
          return _liftFilters(node, asyncFilters, 'args');
        } else {
          return undefined;
        }
      });
    }
    
    function liftSuper(ast) {
      return walk(ast, function (blockNode) {
        if (!(blockNode instanceof nodes.Block)) {
          return;
        }
    
        var hasSuper = false;
        var symbol = gensym();
        blockNode.body = walk(blockNode.body, function (node) {
          // eslint-disable-line consistent-return
          if (node instanceof nodes.FunCall && node.name.value === 'super') {
            hasSuper = true;
            return new nodes.Symbol(node.lineno, node.colno, symbol);
          }
        });
    
        if (hasSuper) {
          blockNode.body.children.unshift(new nodes.Super(0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)));
        }
      });
    }
    
    function convertStatements(ast) {
      return depthWalk(ast, function (node) {
        if (!(node instanceof nodes.If) && !(node instanceof nodes.For)) {
          return undefined;
        }
    
        var async = false;
        walk(node, function (child) {
          if (child instanceof nodes.FilterAsync || child instanceof nodes.IfAsync || child instanceof nodes.AsyncEach || child instanceof nodes.AsyncAll || child instanceof nodes.CallExtensionAsync) {
            async = true; // Stop iterating by returning the node
    
            return child;
          }
    
          return undefined;
        });
    
        if (async) {
          if (node instanceof nodes.If) {
            return new nodes.IfAsync(node.lineno, node.colno, node.cond, node.body, node.else_);
          } else if (node instanceof nodes.For && !(node instanceof nodes.AsyncAll)) {
            return new nodes.AsyncEach(node.lineno, node.colno, node.arr, node.name, node.body, node.else_);
          }
        }
    
        return undefined;
      });
    }
    
    function cps(ast, asyncFilters) {
      return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
    }
    
    function transform(ast, asyncFilters) {
      return cps(ast, asyncFilters || []);
    } // var parser = require('./parser');
    // var src = 'hello {% foo %}{% endfoo %} end';
    // var ast = transform(parser.parse(src, [new FooExtension()]), ['bar']);
    // nodes.printNodes(ast);
    
    
    module.exports = {
      transform: transform
    };
    
    /***/ }),
    /* 18 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var lib = __webpack_require__(0);
    
    var r = __webpack_require__(2);
    
    var exports = module.exports = {};
    
    function normalize(value, defaultValue) {
      if (value === null || value === undefined || value === false) {
        return defaultValue;
      }
    
      return value;
    }
    
    exports.abs = Math.abs;
    
    function isNaN(num) {
      return num !== num; // eslint-disable-line no-self-compare
    }
    
    function batch(arr, linecount, fillWith) {
      var i;
      var res = [];
      var tmp = [];
    
      for (i = 0; i < arr.length; i++) {
        if (i % linecount === 0 && tmp.length) {
          res.push(tmp);
          tmp = [];
        }
    
        tmp.push(arr[i]);
      }
    
      if (tmp.length) {
        if (fillWith) {
          for (i = tmp.length; i < linecount; i++) {
            tmp.push(fillWith);
          }
        }
    
        res.push(tmp);
      }
    
      return res;
    }
    
    exports.batch = batch;
    
    function capitalize(str) {
      str = normalize(str, '');
      var ret = str.toLowerCase();
      return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
    }
    
    exports.capitalize = capitalize;
    
    function center(str, width) {
      str = normalize(str, '');
      width = width || 80;
    
      if (str.length >= width) {
        return str;
      }
    
      var spaces = width - str.length;
      var pre = lib.repeat(' ', spaces / 2 - spaces % 2);
      var post = lib.repeat(' ', spaces / 2);
      return r.copySafeness(str, pre + str + post);
    }
    
    exports.center = center;
    
    function default_(val, def, bool) {
      if (bool) {
        return val || def;
      } else {
        return val !== undefined ? val : def;
      }
    } // TODO: it is confusing to export something called 'default'
    
    
    exports['default'] = default_; // eslint-disable-line dot-notation
    
    function dictsort(val, caseSensitive, by) {
      if (!lib.isObject(val)) {
        throw new lib.TemplateError('dictsort filter: val must be an object');
      }
    
      var array = []; // deliberately include properties from the object's prototype
    
      for (var k in val) {
        // eslint-disable-line guard-for-in, no-restricted-syntax
        array.push([k, val[k]]);
      }
    
      var si;
    
      if (by === undefined || by === 'key') {
        si = 0;
      } else if (by === 'value') {
        si = 1;
      } else {
        throw new lib.TemplateError('dictsort filter: You can only sort by either key or value');
      }
    
      array.sort(function (t1, t2) {
        var a = t1[si];
        var b = t2[si];
    
        if (!caseSensitive) {
          if (lib.isString(a)) {
            a = a.toUpperCase();
          }
    
          if (lib.isString(b)) {
            b = b.toUpperCase();
          }
        }
    
        return a > b ? 1 : a === b ? 0 : -1; // eslint-disable-line no-nested-ternary
      });
      return array;
    }
    
    exports.dictsort = dictsort;
    
    function dump(obj, spaces) {
      return JSON.stringify(obj, null, spaces);
    }
    
    exports.dump = dump;
    
    function escape(str) {
      if (str instanceof r.SafeString) {
        return str;
      }
    
      str = str === null || str === undefined ? '' : str;
      return r.markSafe(lib.escape(str.toString()));
    }
    
    exports.escape = escape;
    
    function safe(str) {
      if (str instanceof r.SafeString) {
        return str;
      }
    
      str = str === null || str === undefined ? '' : str;
      return r.markSafe(str.toString());
    }
    
    exports.safe = safe;
    
    function first(arr) {
      return arr[0];
    }
    
    exports.first = first;
    
    function forceescape(str) {
      str = str === null || str === undefined ? '' : str;
      return r.markSafe(lib.escape(str.toString()));
    }
    
    exports.forceescape = forceescape;
    
    function groupby(arr, attr) {
      return lib.groupBy(arr, attr, this.env.opts.throwOnUndefined);
    }
    
    exports.groupby = groupby;
    
    function indent(str, width, indentfirst) {
      str = normalize(str, '');
    
      if (str === '') {
        return '';
      }
    
      width = width || 4; // let res = '';
    
      var lines = str.split('\n');
      var sp = lib.repeat(' ', width);
      var res = lines.map(function (l, i) {
        return i === 0 && !indentfirst ? l : "" + sp + l;
      }).join('\n');
      return r.copySafeness(str, res);
    }
    
    exports.indent = indent;
    
    function join(arr, del, attr) {
      del = del || '';
    
      if (attr) {
        arr = lib.map(arr, function (v) {
          return v[attr];
        });
      }
    
      return arr.join(del);
    }
    
    exports.join = join;
    
    function last(arr) {
      return arr[arr.length - 1];
    }
    
    exports.last = last;
    
    function lengthFilter(val) {
      var value = normalize(val, '');
    
      if (value !== undefined) {
        if (typeof Map === 'function' && value instanceof Map || typeof Set === 'function' && value instanceof Set) {
          // ECMAScript 2015 Maps and Sets
          return value.size;
        }
    
        if (lib.isObject(value) && !(value instanceof r.SafeString)) {
          // Objects (besides SafeStrings), non-primative Arrays
          return lib.keys(value).length;
        }
    
        return value.length;
      }
    
      return 0;
    }
    
    exports.length = lengthFilter;
    
    function list(val) {
      if (lib.isString(val)) {
        return val.split('');
      } else if (lib.isObject(val)) {
        return lib._entries(val || {}).map(function (_ref) {
          var key = _ref[0],
              value = _ref[1];
          return {
            key: key,
            value: value
          };
        });
      } else if (lib.isArray(val)) {
        return val;
      } else {
        throw new lib.TemplateError('list filter: type not iterable');
      }
    }
    
    exports.list = list;
    
    function lower(str) {
      str = normalize(str, '');
      return str.toLowerCase();
    }
    
    exports.lower = lower;
    
    function nl2br(str) {
      if (str === null || str === undefined) {
        return '';
      }
    
      return r.copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
    }
    
    exports.nl2br = nl2br;
    
    function random(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    
    exports.random = random;
    /**
     * Construct select or reject filter
     *
     * @param {boolean} expectedTestResult
     * @returns {function(array, string, *): array}
     */
    
    function getSelectOrReject(expectedTestResult) {
      function filter(arr, testName, secondArg) {
        if (testName === void 0) {
          testName = 'truthy';
        }
    
        var context = this;
        var test = context.env.getTest(testName);
        return lib.toArray(arr).filter(function examineTestResult(item) {
          return test.call(context, item, secondArg) === expectedTestResult;
        });
      }
    
      return filter;
    }
    
    exports.reject = getSelectOrReject(false);
    
    function rejectattr(arr, attr) {
      return arr.filter(function (item) {
        return !item[attr];
      });
    }
    
    exports.rejectattr = rejectattr;
    exports.select = getSelectOrReject(true);
    
    function selectattr(arr, attr) {
      return arr.filter(function (item) {
        return !!item[attr];
      });
    }
    
    exports.selectattr = selectattr;
    
    function replace(str, old, new_, maxCount) {
      var originalStr = str;
    
      if (old instanceof RegExp) {
        return str.replace(old, new_);
      }
    
      if (typeof maxCount === 'undefined') {
        maxCount = -1;
      }
    
      var res = ''; // Output
      // Cast Numbers in the search term to string
    
      if (typeof old === 'number') {
        old = '' + old;
      } else if (typeof old !== 'string') {
        // If it is something other than number or string,
        // return the original string
        return str;
      } // Cast numbers in the replacement to string
    
    
      if (typeof str === 'number') {
        str = '' + str;
      } // If by now, we don't have a string, throw it back
    
    
      if (typeof str !== 'string' && !(str instanceof r.SafeString)) {
        return str;
      } // ShortCircuits
    
    
      if (old === '') {
        // Mimic the python behaviour: empty string is replaced
        // by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
        res = new_ + str.split('').join(new_) + new_;
        return r.copySafeness(str, res);
      }
    
      var nextIndex = str.indexOf(old); // if # of replacements to perform is 0, or the string to does
      // not contain the old value, return the string
    
      if (maxCount === 0 || nextIndex === -1) {
        return str;
      }
    
      var pos = 0;
      var count = 0; // # of replacements made
    
      while (nextIndex > -1 && (maxCount === -1 || count < maxCount)) {
        // Grab the next chunk of src string and add it with the
        // replacement, to the result
        res += str.substring(pos, nextIndex) + new_; // Increment our pointer in the src string
    
        pos = nextIndex + old.length;
        count++; // See if there are any more replacements to be made
    
        nextIndex = str.indexOf(old, pos);
      } // We've either reached the end, or done the max # of
      // replacements, tack on any remaining string
    
    
      if (pos < str.length) {
        res += str.substring(pos);
      }
    
      return r.copySafeness(originalStr, res);
    }
    
    exports.replace = replace;
    
    function reverse(val) {
      var arr;
    
      if (lib.isString(val)) {
        arr = list(val);
      } else {
        // Copy it
        arr = lib.map(val, function (v) {
          return v;
        });
      }
    
      arr.reverse();
    
      if (lib.isString(val)) {
        return r.copySafeness(val, arr.join(''));
      }
    
      return arr;
    }
    
    exports.reverse = reverse;
    
    function round(val, precision, method) {
      precision = precision || 0;
      var factor = Math.pow(10, precision);
      var rounder;
    
      if (method === 'ceil') {
        rounder = Math.ceil;
      } else if (method === 'floor') {
        rounder = Math.floor;
      } else {
        rounder = Math.round;
      }
    
      return rounder(val * factor) / factor;
    }
    
    exports.round = round;
    
    function slice(arr, slices, fillWith) {
      var sliceLength = Math.floor(arr.length / slices);
      var extra = arr.length % slices;
      var res = [];
      var offset = 0;
    
      for (var i = 0; i < slices; i++) {
        var start = offset + i * sliceLength;
    
        if (i < extra) {
          offset++;
        }
    
        var end = offset + (i + 1) * sliceLength;
        var currSlice = arr.slice(start, end);
    
        if (fillWith && i >= extra) {
          currSlice.push(fillWith);
        }
    
        res.push(currSlice);
      }
    
      return res;
    }
    
    exports.slice = slice;
    
    function sum(arr, attr, start) {
      if (start === void 0) {
        start = 0;
      }
    
      if (attr) {
        arr = lib.map(arr, function (v) {
          return v[attr];
        });
      }
    
      return start + arr.reduce(function (a, b) {
        return a + b;
      }, 0);
    }
    
    exports.sum = sum;
    exports.sort = r.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function sortFilter(arr, reversed, caseSens, attr) {
      var _this = this;
    
      // Copy it
      var array = lib.map(arr, function (v) {
        return v;
      });
      var getAttribute = lib.getAttrGetter(attr);
      array.sort(function (a, b) {
        var x = attr ? getAttribute(a) : a;
        var y = attr ? getAttribute(b) : b;
    
        if (_this.env.opts.throwOnUndefined && attr && (x === undefined || y === undefined)) {
          throw new TypeError("sort: attribute \"" + attr + "\" resolved to undefined");
        }
    
        if (!caseSens && lib.isString(x) && lib.isString(y)) {
          x = x.toLowerCase();
          y = y.toLowerCase();
        }
    
        if (x < y) {
          return reversed ? 1 : -1;
        } else if (x > y) {
          return reversed ? -1 : 1;
        } else {
          return 0;
        }
      });
      return array;
    });
    
    function string(obj) {
      return r.copySafeness(obj, obj);
    }
    
    exports.string = string;
    
    function striptags(input, preserveLinebreaks) {
      input = normalize(input, '');
      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
      var trimmedInput = trim(input.replace(tags, ''));
      var res = '';
    
      if (preserveLinebreaks) {
        res = trimmedInput.replace(/^ +| +$/gm, '') // remove leading and trailing spaces
        .replace(/ +/g, ' ') // squash adjacent spaces
        .replace(/(\r\n)/g, '\n') // normalize linebreaks (CRLF -> LF)
        .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
      } else {
        res = trimmedInput.replace(/\s+/gi, ' ');
      }
    
      return r.copySafeness(input, res);
    }
    
    exports.striptags = striptags;
    
    function title(str) {
      str = normalize(str, '');
      var words = str.split(' ').map(function (word) {
        return capitalize(word);
      });
      return r.copySafeness(str, words.join(' '));
    }
    
    exports.title = title;
    
    function trim(str) {
      return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
    }
    
    exports.trim = trim;
    
    function truncate(input, length, killwords, end) {
      var orig = input;
      input = normalize(input, '');
      length = length || 255;
    
      if (input.length <= length) {
        return input;
      }
    
      if (killwords) {
        input = input.substring(0, length);
      } else {
        var idx = input.lastIndexOf(' ', length);
    
        if (idx === -1) {
          idx = length;
        }
    
        input = input.substring(0, idx);
      }
    
      input += end !== undefined && end !== null ? end : '...';
      return r.copySafeness(orig, input);
    }
    
    exports.truncate = truncate;
    
    function upper(str) {
      str = normalize(str, '');
      return str.toUpperCase();
    }
    
    exports.upper = upper;
    
    function urlencode(obj) {
      var enc = encodeURIComponent;
    
      if (lib.isString(obj)) {
        return enc(obj);
      } else {
        var keyvals = lib.isArray(obj) ? obj : lib._entries(obj);
        return keyvals.map(function (_ref2) {
          var k = _ref2[0],
              v = _ref2[1];
          return enc(k) + "=" + enc(v);
        }).join('&');
      }
    }
    
    exports.urlencode = urlencode; // For the jinja regexp, see
    // https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
    
    var puncRe = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/; // from http://blog.gerv.net/2011/05/html5_email_address_regexp/
    
    var emailRe = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
    var httpHttpsRe = /^https?:\/\/.*$/;
    var wwwRe = /^www\./;
    var tldRe = /\.(?:org|net|com)(?:\:|\/|$)/;
    
    function urlize(str, length, nofollow) {
      if (isNaN(length)) {
        length = Infinity;
      }
    
      var noFollowAttr = nofollow === true ? ' rel="nofollow"' : '';
      var words = str.split(/(\s+)/).filter(function (word) {
        // If the word has no length, bail. This can happen for str with
        // trailing whitespace.
        return word && word.length;
      }).map(function (word) {
        var matches = word.match(puncRe);
        var possibleUrl = matches ? matches[1] : word;
        var shortUrl = possibleUrl.substr(0, length); // url that starts with http or https
    
        if (httpHttpsRe.test(possibleUrl)) {
          return "<a href=\"" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
        } // url that starts with www.
    
    
        if (wwwRe.test(possibleUrl)) {
          return "<a href=\"http://" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
        } // an email address of the form username@domain.tld
    
    
        if (emailRe.test(possibleUrl)) {
          return "<a href=\"mailto:" + possibleUrl + "\">" + possibleUrl + "</a>";
        } // url that ends in .com, .org or .net that is not an email address
    
    
        if (tldRe.test(possibleUrl)) {
          return "<a href=\"http://" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
        }
    
        return word;
      });
      return words.join('');
    }
    
    exports.urlize = urlize;
    
    function wordcount(str) {
      str = normalize(str, '');
      var words = str ? str.match(/\w+/g) : null;
      return words ? words.length : null;
    }
    
    exports.wordcount = wordcount;
    
    function float(val, def) {
      var res = parseFloat(val);
      return isNaN(res) ? def : res;
    }
    
    exports.float = float;
    var intFilter = r.makeMacro(['value', 'default', 'base'], [], function doInt(value, defaultValue, base) {
      if (base === void 0) {
        base = 10;
      }
    
      var res = parseInt(value, base);
      return isNaN(res) ? defaultValue : res;
    });
    exports.int = intFilter; // Aliases
    
    exports.d = exports.default;
    exports.e = exports.escape;
    
    /***/ }),
    /* 19 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    var Loader = __webpack_require__(6);
    
    var PrecompiledLoader = /*#__PURE__*/function (_Loader) {
      _inheritsLoose(PrecompiledLoader, _Loader);
    
      function PrecompiledLoader(compiledTemplates) {
        var _this;
    
        _this = _Loader.call(this) || this;
        _this.precompiled = compiledTemplates || {};
        return _this;
      }
    
      var _proto = PrecompiledLoader.prototype;
    
      _proto.getSource = function getSource(name) {
        if (this.precompiled[name]) {
          return {
            src: {
              type: 'code',
              obj: this.precompiled[name]
            },
            path: name
          };
        }
    
        return null;
      };
    
      return PrecompiledLoader;
    }(Loader);
    
    module.exports = {
      PrecompiledLoader: PrecompiledLoader
    };
    
    /***/ }),
    /* 20 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var SafeString = __webpack_require__(2).SafeString;
    /**
     * Returns `true` if the object is a function, otherwise `false`.
     * @param { any } value
     * @returns { boolean }
     */
    
    
    function callable(value) {
      return typeof value === 'function';
    }
    
    exports.callable = callable;
    /**
     * Returns `true` if the object is strictly not `undefined`.
     * @param { any } value
     * @returns { boolean }
     */
    
    function defined(value) {
      return value !== undefined;
    }
    
    exports.defined = defined;
    /**
     * Returns `true` if the operand (one) is divisble by the test's argument
     * (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function divisibleby(one, two) {
      return one % two === 0;
    }
    
    exports.divisibleby = divisibleby;
    /**
     * Returns true if the string has been escaped (i.e., is a SafeString).
     * @param { any } value
     * @returns { boolean }
     */
    
    function escaped(value) {
      return value instanceof SafeString;
    }
    
    exports.escaped = escaped;
    /**
     * Returns `true` if the arguments are strictly equal.
     * @param { any } one
     * @param { any } two
     */
    
    function equalto(one, two) {
      return one === two;
    }
    
    exports.equalto = equalto; // Aliases
    
    exports.eq = exports.equalto;
    exports.sameas = exports.equalto;
    /**
     * Returns `true` if the value is evenly divisible by 2.
     * @param { number } value
     * @returns { boolean }
     */
    
    function even(value) {
      return value % 2 === 0;
    }
    
    exports.even = even;
    /**
     * Returns `true` if the value is falsy - if I recall correctly, '', 0, false,
     * undefined, NaN or null. I don't know if we should stick to the default JS
     * behavior or attempt to replicate what Python believes should be falsy (i.e.,
     * empty arrays, empty dicts, not 0...).
     * @param { any } value
     * @returns { boolean }
     */
    
    function falsy(value) {
      return !value;
    }
    
    exports.falsy = falsy;
    /**
     * Returns `true` if the operand (one) is greater or equal to the test's
     * argument (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function ge(one, two) {
      return one >= two;
    }
    
    exports.ge = ge;
    /**
     * Returns `true` if the operand (one) is greater than the test's argument
     * (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function greaterthan(one, two) {
      return one > two;
    }
    
    exports.greaterthan = greaterthan; // alias
    
    exports.gt = exports.greaterthan;
    /**
     * Returns `true` if the operand (one) is less than or equal to the test's
     * argument (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function le(one, two) {
      return one <= two;
    }
    
    exports.le = le;
    /**
     * Returns `true` if the operand (one) is less than the test's passed argument
     * (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function lessthan(one, two) {
      return one < two;
    }
    
    exports.lessthan = lessthan; // alias
    
    exports.lt = exports.lessthan;
    /**
     * Returns `true` if the string is lowercased.
     * @param { string } value
     * @returns { boolean }
     */
    
    function lower(value) {
      return value.toLowerCase() === value;
    }
    
    exports.lower = lower;
    /**
     * Returns `true` if the operand (one) is less than or equal to the test's
     * argument (two).
     * @param { number } one
     * @param { number } two
     * @returns { boolean }
     */
    
    function ne(one, two) {
      return one !== two;
    }
    
    exports.ne = ne;
    /**
     * Returns true if the value is strictly equal to `null`.
     * @param { any }
     * @returns { boolean }
     */
    
    function nullTest(value) {
      return value === null;
    }
    
    exports.null = nullTest;
    /**
     * Returns true if value is a number.
     * @param { any }
     * @returns { boolean }
     */
    
    function number(value) {
      return typeof value === 'number';
    }
    
    exports.number = number;
    /**
     * Returns `true` if the value is *not* evenly divisible by 2.
     * @param { number } value
     * @returns { boolean }
     */
    
    function odd(value) {
      return value % 2 === 1;
    }
    
    exports.odd = odd;
    /**
     * Returns `true` if the value is a string, `false` if not.
     * @param { any } value
     * @returns { boolean }
     */
    
    function string(value) {
      return typeof value === 'string';
    }
    
    exports.string = string;
    /**
     * Returns `true` if the value is not in the list of things considered falsy:
     * '', null, undefined, 0, NaN and false.
     * @param { any } value
     * @returns { boolean }
     */
    
    function truthy(value) {
      return !!value;
    }
    
    exports.truthy = truthy;
    /**
     * Returns `true` if the value is undefined.
     * @param { any } value
     * @returns { boolean }
     */
    
    function undefinedTest(value) {
      return value === undefined;
    }
    
    exports.undefined = undefinedTest;
    /**
     * Returns `true` if the string is uppercased.
     * @param { string } value
     * @returns { boolean }
     */
    
    function upper(value) {
      return value.toUpperCase() === value;
    }
    
    exports.upper = upper;
    /**
     * If ES6 features are available, returns `true` if the value implements the
     * `Symbol.iterator` method. If not, it's a string or Array.
     *
     * Could potentially cause issues if a browser exists that has Set and Map but
     * not Symbol.
     *
     * @param { any } value
     * @returns { boolean }
     */
    
    function iterable(value) {
      if (typeof Symbol !== 'undefined') {
        return !!value[Symbol.iterator];
      } else {
        return Array.isArray(value) || typeof value === 'string';
      }
    }
    
    exports.iterable = iterable;
    /**
     * If ES6 features are available, returns `true` if the value is an object hash
     * or an ES6 Map. Otherwise just return if it's an object hash.
     * @param { any } value
     * @returns { boolean }
     */
    
    function mapping(value) {
      // only maps and object hashes
      var bool = value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);
    
      if (Set) {
        return bool && !(value instanceof Set);
      } else {
        return bool;
      }
    }
    
    exports.mapping = mapping;
    
    /***/ }),
    /* 21 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _cycler(items) {
      var index = -1;
      return {
        current: null,
        reset: function reset() {
          index = -1;
          this.current = null;
        },
        next: function next() {
          index++;
    
          if (index >= items.length) {
            index = 0;
          }
    
          this.current = items[index];
          return this.current;
        }
      };
    }
    
    function _joiner(sep) {
      sep = sep || ',';
      var first = true;
      return function () {
        var val = first ? '' : sep;
        first = false;
        return val;
      };
    } // Making this a function instead so it returns a new object
    // each time it's called. That way, if something like an environment
    // uses it, they will each have their own copy.
    
    
    function globals() {
      return {
        range: function range(start, stop, step) {
          if (typeof stop === 'undefined') {
            stop = start;
            start = 0;
            step = 1;
          } else if (!step) {
            step = 1;
          }
    
          var arr = [];
    
          if (step > 0) {
            for (var i = start; i < stop; i += step) {
              arr.push(i);
            }
          } else {
            for (var _i = start; _i > stop; _i += step) {
              // eslint-disable-line for-direction
              arr.push(_i);
            }
          }
    
          return arr;
        },
        cycler: function cycler() {
          return _cycler(Array.prototype.slice.call(arguments));
        },
        joiner: function joiner(sep) {
          return _joiner(sep);
        }
      };
    }
    
    module.exports = globals;
    
    /***/ }),
    /* 22 */
    /***/ (function(module, exports, __webpack_require__) {
    
    var path = __webpack_require__(4);
    
    module.exports = function express(env, app) {
      function NunjucksView(name, opts) {
        this.name = name;
        this.path = name;
        this.defaultEngine = opts.defaultEngine;
        this.ext = path.extname(name);
    
        if (!this.ext && !this.defaultEngine) {
          throw new Error('No default engine was specified and no extension was provided.');
        }
    
        if (!this.ext) {
          this.name += this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine;
        }
      }
    
      NunjucksView.prototype.render = function render(opts, cb) {
        env.render(this.name, opts, cb);
      };
    
      app.set('view', NunjucksView);
      app.set('nunjucksEnv', env);
      return env;
    };
    
    /***/ }),
    /* 23 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var fs = __webpack_require__(4);
    
    var path = __webpack_require__(4);
    
    var _require = __webpack_require__(0),
        _prettifyError = _require._prettifyError;
    
    var compiler = __webpack_require__(5);
    
    var _require2 = __webpack_require__(7),
        Environment = _require2.Environment;
    
    var precompileGlobal = __webpack_require__(24);
    
    function match(filename, patterns) {
      if (!Array.isArray(patterns)) {
        return false;
      }
    
      return patterns.some(function (pattern) {
        return filename.match(pattern);
      });
    }
    
    function precompileString(str, opts) {
      opts = opts || {};
      opts.isString = true;
      var env = opts.env || new Environment([]);
      var wrapper = opts.wrapper || precompileGlobal;
    
      if (!opts.name) {
        throw new Error('the "name" option is required when compiling a string');
      }
    
      return wrapper([_precompile(str, opts.name, env)], opts);
    }
    
    function precompile(input, opts) {
      // The following options are available:
      //
      // * name: name of the template (auto-generated when compiling a directory)
      // * isString: input is a string, not a file path
      // * asFunction: generate a callable function
      // * force: keep compiling on error
      // * env: the Environment to use (gets extensions and async filters from it)
      // * include: which file/folders to include (folders are auto-included, files are auto-excluded)
      // * exclude: which file/folders to exclude (folders are auto-included, files are auto-excluded)
      // * wrapper: function(templates, opts) {...}
      //       Customize the output format to store the compiled template.
      //       By default, templates are stored in a global variable used by the runtime.
      //       A custom loader will be necessary to load your custom wrapper.
      opts = opts || {};
      var env = opts.env || new Environment([]);
      var wrapper = opts.wrapper || precompileGlobal;
    
      if (opts.isString) {
        return precompileString(input, opts);
      }
    
      var pathStats = fs.existsSync(input) && fs.statSync(input);
      var precompiled = [];
      var templates = [];
    
      function addTemplates(dir) {
        fs.readdirSync(dir).forEach(function (file) {
          var filepath = path.join(dir, file);
          var subpath = filepath.substr(path.join(input, '/').length);
          var stat = fs.statSync(filepath);
    
          if (stat && stat.isDirectory()) {
            subpath += '/';
    
            if (!match(subpath, opts.exclude)) {
              addTemplates(filepath);
            }
          } else if (match(subpath, opts.include)) {
            templates.push(filepath);
          }
        });
      }
    
      if (pathStats.isFile()) {
        precompiled.push(_precompile(fs.readFileSync(input, 'utf-8'), opts.name || input, env));
      } else if (pathStats.isDirectory()) {
        addTemplates(input);
    
        for (var i = 0; i < templates.length; i++) {
          var name = templates[i].replace(path.join(input, '/'), '');
    
          try {
            precompiled.push(_precompile(fs.readFileSync(templates[i], 'utf-8'), name, env));
          } catch (e) {
            if (opts.force) {
              // Don't stop generating the output if we're
              // forcing compilation.
              console.error(e); // eslint-disable-line no-console
            } else {
              throw e;
            }
          }
        }
      }
    
      return wrapper(precompiled, opts);
    }
    
    function _precompile(str, name, env) {
      env = env || new Environment([]);
      var asyncFilters = env.asyncFilters;
      var extensions = env.extensionsList;
      var template;
      name = name.replace(/\\/g, '/');
    
      try {
        template = compiler.compile(str, asyncFilters, extensions, name, env.opts);
      } catch (err) {
        throw _prettifyError(name, false, err);
      }
    
      return {
        name: name,
        template: template
      };
    }
    
    module.exports = {
      precompile: precompile,
      precompileString: precompileString
    };
    
    /***/ }),
    /* 24 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function precompileGlobal(templates, opts) {
      var out = '';
      opts = opts || {};
    
      for (var i = 0; i < templates.length; i++) {
        var name = JSON.stringify(templates[i].name);
        var template = templates[i].template;
        out += '(function() {' + '(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})' + '[' + name + '] = (function() {\n' + template + '\n})();\n';
    
        if (opts.asFunction) {
          out += 'return function(ctx, cb) { return nunjucks.render(' + name + ', ctx, cb); }\n';
        }
    
        out += '})();\n';
      }
    
      return out;
    }
    
    module.exports = precompileGlobal;
    
    /***/ }),
    /* 25 */
    /***/ (function(module, exports, __webpack_require__) {
    
    function installCompat() {
      'use strict';
      /* eslint-disable camelcase */
      // This must be called like `nunjucks.installCompat` so that `this`
      // references the nunjucks instance
    
      var runtime = this.runtime;
      var lib = this.lib; // Handle slim case where these 'modules' are excluded from the built source
    
      var Compiler = this.compiler.Compiler;
      var Parser = this.parser.Parser;
      var nodes = this.nodes;
      var lexer = this.lexer;
      var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
      var orig_memberLookup = runtime.memberLookup;
      var orig_Compiler_assertType;
      var orig_Parser_parseAggregate;
    
      if (Compiler) {
        orig_Compiler_assertType = Compiler.prototype.assertType;
      }
    
      if (Parser) {
        orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
      }
    
      function uninstall() {
        runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
        runtime.memberLookup = orig_memberLookup;
    
        if (Compiler) {
          Compiler.prototype.assertType = orig_Compiler_assertType;
        }
    
        if (Parser) {
          Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
        }
      }
    
      runtime.contextOrFrameLookup = function contextOrFrameLookup(context, frame, key) {
        var val = orig_contextOrFrameLookup.apply(this, arguments);
    
        if (val !== undefined) {
          return val;
        }
    
        switch (key) {
          case 'True':
            return true;
    
          case 'False':
            return false;
    
          case 'None':
            return null;
    
          default:
            return undefined;
        }
      };
    
      function getTokensState(tokens) {
        return {
          index: tokens.index,
          lineno: tokens.lineno,
          colno: tokens.colno
        };
      }
    
      if ("STD" !== 'SLIM' && nodes && Compiler && Parser) {
        // i.e., not slim mode
        var Slice = nodes.Node.extend('Slice', {
          fields: ['start', 'stop', 'step'],
          init: function init(lineno, colno, start, stop, step) {
            start = start || new nodes.Literal(lineno, colno, null);
            stop = stop || new nodes.Literal(lineno, colno, null);
            step = step || new nodes.Literal(lineno, colno, 1);
            this.parent(lineno, colno, start, stop, step);
          }
        });
    
        Compiler.prototype.assertType = function assertType(node) {
          if (node instanceof Slice) {
            return;
          }
    
          orig_Compiler_assertType.apply(this, arguments);
        };
    
        Compiler.prototype.compileSlice = function compileSlice(node, frame) {
          this._emit('(');
    
          this._compileExpression(node.start, frame);
    
          this._emit('),(');
    
          this._compileExpression(node.stop, frame);
    
          this._emit('),(');
    
          this._compileExpression(node.step, frame);
    
          this._emit(')');
        };
    
        Parser.prototype.parseAggregate = function parseAggregate() {
          var _this = this;
    
          var origState = getTokensState(this.tokens); // Set back one accounting for opening bracket/parens
    
          origState.colno--;
          origState.index--;
    
          try {
            return orig_Parser_parseAggregate.apply(this);
          } catch (e) {
            var errState = getTokensState(this.tokens);
    
            var rethrow = function rethrow() {
              lib._assign(_this.tokens, errState);
    
              return e;
            }; // Reset to state before original parseAggregate called
    
    
            lib._assign(this.tokens, origState);
    
            this.peeked = false;
            var tok = this.peekToken();
    
            if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
              throw rethrow();
            } else {
              this.nextToken();
            }
    
            var node = new Slice(tok.lineno, tok.colno); // If we don't encounter a colon while parsing, this is not a slice,
            // so re-raise the original exception.
    
            var isSlice = false;
    
            for (var i = 0; i <= node.fields.length; i++) {
              if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
                break;
              }
    
              if (i === node.fields.length) {
                if (isSlice) {
                  this.fail('parseSlice: too many slice components', tok.lineno, tok.colno);
                } else {
                  break;
                }
              }
    
              if (this.skip(lexer.TOKEN_COLON)) {
                isSlice = true;
              } else {
                var field = node.fields[i];
                node[field] = this.parseExpression();
                isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
              }
            }
    
            if (!isSlice) {
              throw rethrow();
            }
    
            return new nodes.Array(tok.lineno, tok.colno, [node]);
          }
        };
      }
    
      function sliceLookup(obj, start, stop, step) {
        obj = obj || [];
    
        if (start === null) {
          start = step < 0 ? obj.length - 1 : 0;
        }
    
        if (stop === null) {
          stop = step < 0 ? -1 : obj.length;
        } else if (stop < 0) {
          stop += obj.length;
        }
    
        if (start < 0) {
          start += obj.length;
        }
    
        var results = [];
    
        for (var i = start;; i += step) {
          if (i < 0 || i > obj.length) {
            break;
          }
    
          if (step > 0 && i >= stop) {
            break;
          }
    
          if (step < 0 && i <= stop) {
            break;
          }
    
          results.push(runtime.memberLookup(obj, i));
        }
    
        return results;
      }
    
      function hasOwnProp(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
    
      var ARRAY_MEMBERS = {
        pop: function pop(index) {
          if (index === undefined) {
            return this.pop();
          }
    
          if (index >= this.length || index < 0) {
            throw new Error('KeyError');
          }
    
          return this.splice(index, 1);
        },
        append: function append(element) {
          return this.push(element);
        },
        remove: function remove(element) {
          for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
              return this.splice(i, 1);
            }
          }
    
          throw new Error('ValueError');
        },
        count: function count(element) {
          var count = 0;
    
          for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
              count++;
            }
          }
    
          return count;
        },
        index: function index(element) {
          var i;
    
          if ((i = this.indexOf(element)) === -1) {
            throw new Error('ValueError');
          }
    
          return i;
        },
        find: function find(element) {
          return this.indexOf(element);
        },
        insert: function insert(index, elem) {
          return this.splice(index, 0, elem);
        }
      };
      var OBJECT_MEMBERS = {
        items: function items() {
          return lib._entries(this);
        },
        values: function values() {
          return lib._values(this);
        },
        keys: function keys() {
          return lib.keys(this);
        },
        get: function get(key, def) {
          var output = this[key];
    
          if (output === undefined) {
            output = def;
          }
    
          return output;
        },
        has_key: function has_key(key) {
          return hasOwnProp(this, key);
        },
        pop: function pop(key, def) {
          var output = this[key];
    
          if (output === undefined && def !== undefined) {
            output = def;
          } else if (output === undefined) {
            throw new Error('KeyError');
          } else {
            delete this[key];
          }
    
          return output;
        },
        popitem: function popitem() {
          var keys = lib.keys(this);
    
          if (!keys.length) {
            throw new Error('KeyError');
          }
    
          var k = keys[0];
          var val = this[k];
          delete this[k];
          return [k, val];
        },
        setdefault: function setdefault(key, def) {
          if (def === void 0) {
            def = null;
          }
    
          if (!(key in this)) {
            this[key] = def;
          }
    
          return this[key];
        },
        update: function update(kwargs) {
          lib._assign(this, kwargs);
    
          return null; // Always returns None
        }
      };
      OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
      OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
      OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
    
      runtime.memberLookup = function memberLookup(obj, val, autoescape) {
        if (arguments.length === 4) {
          return sliceLookup.apply(this, arguments);
        }
    
        obj = obj || {}; // If the object is an object, return any of the methods that Python would
        // otherwise provide.
    
        if (lib.isArray(obj) && hasOwnProp(ARRAY_MEMBERS, val)) {
          return ARRAY_MEMBERS[val].bind(obj);
        }
    
        if (lib.isObject(obj) && hasOwnProp(OBJECT_MEMBERS, val)) {
          return OBJECT_MEMBERS[val].bind(obj);
        }
    
        return orig_memberLookup.apply(this, arguments);
      };
    
      return uninstall;
    }
    
    module.exports = installCompat;
    
    /***/ })
    /******/ ]);
    });
    
    }).call(this)}).call(this,require('_process'),require("timers").setImmediate)
    },{"_process":60,"timers":70}],58:[function(require,module,exports){
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    
    'use strict';
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    
    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }
    
        return Object(val);
    }
    
    function shouldUseNative() {
        try {
            if (!Object.assign) {
                return false;
            }
    
            // Detect buggy property enumeration order in older V8 versions.
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=4118
            var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
            test1[5] = 'de';
            if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test2 = {};
            for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
            }
            var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
            });
            if (order2.join('') !== '0123456789') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test3 = {};
            'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
            });
            if (Object.keys(Object.assign({}, test3)).join('') !==
                    'abcdefghijklmnopqrst') {
                return false;
            }
    
            return true;
        } catch (err) {
            // We don't expect any of the above to throw, but better to be safe.
            return false;
        }
    }
    
    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;
    
        for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
    
            for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
    
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                    if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                    }
                }
            }
        }
    
        return to;
    };
    
    },{}],59:[function(require,module,exports){
    (function (process){(function (){
    // 'path' module extracted from Node.js v8.11.1 (only the posix part)
    // transplited with Babel
    
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    function assertPath(path) {
      if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
      }
    }
    
    // Resolves . and .. elements in a path with directory names
    function normalizeStringPosix(path, allowAboveRoot) {
      var res = '';
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i = 0; i <= path.length; ++i) {
        if (i < path.length)
          code = path.charCodeAt(i);
        else if (code === 47 /*/*/)
          break;
        else
          code = 47 /*/*/;
        if (code === 47 /*/*/) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf('/');
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = '';
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                  }
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = '';
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0)
                res += '/..';
              else
                res = '..';
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0)
              res += '/' + path.slice(lastSlash + 1, i);
            else
              res = path.slice(lastSlash + 1, i);
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === 46 /*.*/ && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    
    function _format(sep, pathObject) {
      var dir = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    
    var posix = {
      // path.resolve([from ...], to)
      resolve: function resolve() {
        var resolvedPath = '';
        var resolvedAbsolute = false;
        var cwd;
    
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path;
          if (i >= 0)
            path = arguments[i];
          else {
            if (cwd === undefined)
              cwd = process.cwd();
            path = cwd;
          }
    
          assertPath(path);
    
          // Skip empty entries
          if (path.length === 0) {
            continue;
          }
    
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
        }
    
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
    
        // Normalize the path
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return '/' + resolvedPath;
          else
            return '/';
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return '.';
        }
      },
    
      normalize: function normalize(path) {
        assertPath(path);
    
        if (path.length === 0) return '.';
    
        var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;
    
        // Normalize the path
        path = normalizeStringPosix(path, !isAbsolute);
    
        if (path.length === 0 && !isAbsolute) path = '.';
        if (path.length > 0 && trailingSeparator) path += '/';
    
        if (isAbsolute) return '/' + path;
        return path;
      },
    
      isAbsolute: function isAbsolute(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
      },
    
      join: function join() {
        if (arguments.length === 0)
          return '.';
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
          var arg = arguments[i];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === undefined)
              joined = arg;
            else
              joined += '/' + arg;
          }
        }
        if (joined === undefined)
          return '.';
        return posix.normalize(joined);
      },
    
      relative: function relative(from, to) {
        assertPath(from);
        assertPath(to);
    
        if (from === to) return '';
    
        from = posix.resolve(from);
        to = posix.resolve(to);
    
        if (from === to) return '';
    
        // Trim any leading backslashes
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47 /*/*/)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
    
        // Trim any leading backslashes
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47 /*/*/)
            break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
    
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
          if (i === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i) === 47 /*/*/) {
                // We get here if `from` is the exact base path for `to`.
                // For example: from='/foo/bar'; to='/foo/bar/baz'
                return to.slice(toStart + i + 1);
              } else if (i === 0) {
                // We get here if `from` is the root
                // For example: from='/'; to='/foo'
                return to.slice(toStart + i);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='/foo/bar/baz'; to='/foo/bar'
                lastCommonSep = i;
              } else if (i === 0) {
                // We get here if `to` is the root.
                // For example: from='/foo'; to='/'
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i);
          var toCode = to.charCodeAt(toStart + i);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47 /*/*/)
            lastCommonSep = i;
        }
    
        var out = '';
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
          if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
            if (out.length === 0)
              out += '..';
            else
              out += '/..';
          }
        }
    
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
          return out + to.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to.charCodeAt(toStart) === 47 /*/*/)
            ++toStart;
          return to.slice(toStart);
        }
      },
    
      _makeLong: function _makeLong(path) {
        return path;
      },
    
      dirname: function dirname(path) {
        assertPath(path);
        if (path.length === 0) return '.';
        var code = path.charCodeAt(0);
        var hasRoot = code === 47 /*/*/;
        var end = -1;
        var matchedSlash = true;
        for (var i = path.length - 1; i >= 1; --i) {
          code = path.charCodeAt(i);
          if (code === 47 /*/*/) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
            // We saw the first non-path separator
            matchedSlash = false;
          }
        }
    
        if (end === -1) return hasRoot ? '/' : '.';
        if (hasRoot && end === 1) return '//';
        return path.slice(0, end);
      },
    
      basename: function basename(path, ext) {
        if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
        assertPath(path);
    
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
    
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
          if (ext.length === path.length && ext === path) return '';
          var extIdx = ext.length - 1;
          var firstNonSlashEnd = -1;
          for (i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
              if (firstNonSlashEnd === -1) {
                // We saw the first non-path separator, remember this index in case
                // we need it if the extension ends up not matching
                matchedSlash = false;
                firstNonSlashEnd = i + 1;
              }
              if (extIdx >= 0) {
                // Try to match the explicit extension
                if (code === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    // We matched the extension, so mark this as the end of our path
                    // component
                    end = i;
                  }
                } else {
                  // Extension does not match, so our result is the entire path
                  // component
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
    
          if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
          return path.slice(start, end);
        } else {
          for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === 47 /*/*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
              // We saw the first non-path separator, mark this as the end of our
              // path component
              matchedSlash = false;
              end = i + 1;
            }
          }
    
          if (end === -1) return '';
          return path.slice(start, end);
        }
      },
    
      extname: function extname(path) {
        assertPath(path);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        for (var i = path.length - 1; i >= 0; --i) {
          var code = path.charCodeAt(i);
          if (code === 47 /*/*/) {
              // If we reached a path separator that was not part of a set of path
              // separators at the end of the string, stop now
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
          if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46 /*.*/) {
              // If this is our first dot, mark it as the start of our extension
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
          } else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
          }
        }
    
        if (startDot === -1 || end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return '';
        }
        return path.slice(startDot, end);
      },
    
      format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== 'object') {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format('/', pathObject);
      },
    
      parse: function parse(path) {
        assertPath(path);
    
        var ret = { root: '', dir: '', base: '', ext: '', name: '' };
        if (path.length === 0) return ret;
        var code = path.charCodeAt(0);
        var isAbsolute = code === 47 /*/*/;
        var start;
        if (isAbsolute) {
          ret.root = '/';
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
    
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
    
        // Get non-dir info
        for (; i >= start; --i) {
          code = path.charCodeAt(i);
          if (code === 47 /*/*/) {
              // If we reached a path separator that was not part of a set of path
              // separators at the end of the string, stop now
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
          if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46 /*.*/) {
              // If this is our first dot, mark it as the start of our extension
              if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
          }
        }
    
        if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
          } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
          }
          ret.ext = path.slice(startDot, end);
        }
    
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
    
        return ret;
      },
    
      sep: '/',
      delimiter: ':',
      win32: null,
      posix: null
    };
    
    posix.posix = posix;
    
    module.exports = posix;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":60}],60:[function(require,module,exports){
    // shim for using process in browser
    var process = module.exports = {};
    
    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.
    
    var cachedSetTimeout;
    var cachedClearTimeout;
    
    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    
    
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    
    
    
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    
    process.listeners = function (name) { return [] }
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    },{}],61:[function(require,module,exports){
    (function (global){(function (){
    /*! https://mths.be/punycode v1.4.1 by @mathias */
    ;(function(root) {
    
        /** Detect free variables */
        var freeExports = typeof exports == 'object' && exports &&
            !exports.nodeType && exports;
        var freeModule = typeof module == 'object' && module &&
            !module.nodeType && module;
        var freeGlobal = typeof global == 'object' && global;
        if (
            freeGlobal.global === freeGlobal ||
            freeGlobal.window === freeGlobal ||
            freeGlobal.self === freeGlobal
        ) {
            root = freeGlobal;
        }
    
        /**
         * The `punycode` object.
         * @name punycode
         * @type Object
         */
        var punycode,
    
        /** Highest positive signed 32-bit float value */
        maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
    
        /** Bootstring parameters */
        base = 36,
        tMin = 1,
        tMax = 26,
        skew = 38,
        damp = 700,
        initialBias = 72,
        initialN = 128, // 0x80
        delimiter = '-', // '\x2D'
    
        /** Regular expressions */
        regexPunycode = /^xn--/,
        regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
        regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
    
        /** Error messages */
        errors = {
            'overflow': 'Overflow: input needs wider integers to process',
            'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
            'invalid-input': 'Invalid input'
        },
    
        /** Convenience shortcuts */
        baseMinusTMin = base - tMin,
        floor = Math.floor,
        stringFromCharCode = String.fromCharCode,
    
        /** Temporary variable */
        key;
    
        /*--------------------------------------------------------------------------*/
    
        /**
         * A generic error utility function.
         * @private
         * @param {String} type The error type.
         * @returns {Error} Throws a `RangeError` with the applicable error message.
         */
        function error(type) {
            throw new RangeError(errors[type]);
        }
    
        /**
         * A generic `Array#map` utility function.
         * @private
         * @param {Array} array The array to iterate over.
         * @param {Function} callback The function that gets called for every array
         * item.
         * @returns {Array} A new array of values returned by the callback function.
         */
        function map(array, fn) {
            var length = array.length;
            var result = [];
            while (length--) {
                result[length] = fn(array[length]);
            }
            return result;
        }
    
        /**
         * A simple `Array#map`-like wrapper to work with domain name strings or email
         * addresses.
         * @private
         * @param {String} domain The domain name or email address.
         * @param {Function} callback The function that gets called for every
         * character.
         * @returns {Array} A new string of characters returned by the callback
         * function.
         */
        function mapDomain(string, fn) {
            var parts = string.split('@');
            var result = '';
            if (parts.length > 1) {
                // In email addresses, only the domain name should be punycoded. Leave
                // the local part (i.e. everything up to `@`) intact.
                result = parts[0] + '@';
                string = parts[1];
            }
            // Avoid `split(regex)` for IE8 compatibility. See #17.
            string = string.replace(regexSeparators, '\x2E');
            var labels = string.split('.');
            var encoded = map(labels, fn).join('.');
            return result + encoded;
        }
    
        /**
         * Creates an array containing the numeric code points of each Unicode
         * character in the string. While JavaScript uses UCS-2 internally,
         * this function will convert a pair of surrogate halves (each of which
         * UCS-2 exposes as separate characters) into a single code point,
         * matching UTF-16.
         * @see `punycode.ucs2.encode`
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode.ucs2
         * @name decode
         * @param {String} string The Unicode input string (UCS-2).
         * @returns {Array} The new array of code points.
         */
        function ucs2decode(string) {
            var output = [],
                counter = 0,
                length = string.length,
                value,
                extra;
            while (counter < length) {
                value = string.charCodeAt(counter++);
                if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                    // high surrogate, and there is a next character
                    extra = string.charCodeAt(counter++);
                    if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                    } else {
                        // unmatched surrogate; only append this code unit, in case the next
                        // code unit is the high surrogate of a surrogate pair
                        output.push(value);
                        counter--;
                    }
                } else {
                    output.push(value);
                }
            }
            return output;
        }
    
        /**
         * Creates a string based on an array of numeric code points.
         * @see `punycode.ucs2.decode`
         * @memberOf punycode.ucs2
         * @name encode
         * @param {Array} codePoints The array of numeric code points.
         * @returns {String} The new Unicode string (UCS-2).
         */
        function ucs2encode(array) {
            return map(array, function(value) {
                var output = '';
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                    value = 0xDC00 | value & 0x3FF;
                }
                output += stringFromCharCode(value);
                return output;
            }).join('');
        }
    
        /**
         * Converts a basic code point into a digit/integer.
         * @see `digitToBasic()`
         * @private
         * @param {Number} codePoint The basic numeric code point value.
         * @returns {Number} The numeric value of a basic code point (for use in
         * representing integers) in the range `0` to `base - 1`, or `base` if
         * the code point does not represent a value.
         */
        function basicToDigit(codePoint) {
            if (codePoint - 48 < 10) {
                return codePoint - 22;
            }
            if (codePoint - 65 < 26) {
                return codePoint - 65;
            }
            if (codePoint - 97 < 26) {
                return codePoint - 97;
            }
            return base;
        }
    
        /**
         * Converts a digit/integer into a basic code point.
         * @see `basicToDigit()`
         * @private
         * @param {Number} digit The numeric value of a basic code point.
         * @returns {Number} The basic code point whose value (when used for
         * representing integers) is `digit`, which needs to be in the range
         * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
         * used; else, the lowercase form is used. The behavior is undefined
         * if `flag` is non-zero and `digit` has no uppercase form.
         */
        function digitToBasic(digit, flag) {
            //  0..25 map to ASCII a..z or A..Z
            // 26..35 map to ASCII 0..9
            return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        }
    
        /**
         * Bias adaptation function as per section 3.4 of RFC 3492.
         * https://tools.ietf.org/html/rfc3492#section-3.4
         * @private
         */
        function adapt(delta, numPoints, firstTime) {
            var k = 0;
            delta = firstTime ? floor(delta / damp) : delta >> 1;
            delta += floor(delta / numPoints);
            for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
                delta = floor(delta / baseMinusTMin);
            }
            return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        }
    
        /**
         * Converts a Punycode string of ASCII-only symbols to a string of Unicode
         * symbols.
         * @memberOf punycode
         * @param {String} input The Punycode string of ASCII-only symbols.
         * @returns {String} The resulting string of Unicode symbols.
         */
        function decode(input) {
            // Don't use UCS-2
            var output = [],
                inputLength = input.length,
                out,
                i = 0,
                n = initialN,
                bias = initialBias,
                basic,
                j,
                index,
                oldi,
                w,
                k,
                digit,
                t,
                /** Cached calculation results */
                baseMinusT;
    
            // Handle the basic code points: let `basic` be the number of input code
            // points before the last delimiter, or `0` if there is none, then copy
            // the first basic code points to the output.
    
            basic = input.lastIndexOf(delimiter);
            if (basic < 0) {
                basic = 0;
            }
    
            for (j = 0; j < basic; ++j) {
                // if it's not a basic code point
                if (input.charCodeAt(j) >= 0x80) {
                    error('not-basic');
                }
                output.push(input.charCodeAt(j));
            }
    
            // Main decoding loop: start just after the last delimiter if any basic code
            // points were copied; start at the beginning otherwise.
    
            for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
    
                // `index` is the index of the next character to be consumed.
                // Decode a generalized variable-length integer into `delta`,
                // which gets added to `i`. The overflow checking is easier
                // if we increase `i` as we go, then subtract off its starting
                // value at the end to obtain `delta`.
                for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
    
                    if (index >= inputLength) {
                        error('invalid-input');
                    }
    
                    digit = basicToDigit(input.charCodeAt(index++));
    
                    if (digit >= base || digit > floor((maxInt - i) / w)) {
                        error('overflow');
                    }
    
                    i += digit * w;
                    t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
    
                    if (digit < t) {
                        break;
                    }
    
                    baseMinusT = base - t;
                    if (w > floor(maxInt / baseMinusT)) {
                        error('overflow');
                    }
    
                    w *= baseMinusT;
    
                }
    
                out = output.length + 1;
                bias = adapt(i - oldi, out, oldi == 0);
    
                // `i` was supposed to wrap around from `out` to `0`,
                // incrementing `n` each time, so we'll fix that now:
                if (floor(i / out) > maxInt - n) {
                    error('overflow');
                }
    
                n += floor(i / out);
                i %= out;
    
                // Insert `n` at position `i` of the output
                output.splice(i++, 0, n);
    
            }
    
            return ucs2encode(output);
        }
    
        /**
         * Converts a string of Unicode symbols (e.g. a domain name label) to a
         * Punycode string of ASCII-only symbols.
         * @memberOf punycode
         * @param {String} input The string of Unicode symbols.
         * @returns {String} The resulting Punycode string of ASCII-only symbols.
         */
        function encode(input) {
            var n,
                delta,
                handledCPCount,
                basicLength,
                bias,
                j,
                m,
                q,
                k,
                t,
                currentValue,
                output = [],
                /** `inputLength` will hold the number of code points in `input`. */
                inputLength,
                /** Cached calculation results */
                handledCPCountPlusOne,
                baseMinusT,
                qMinusT;
    
            // Convert the input in UCS-2 to Unicode
            input = ucs2decode(input);
    
            // Cache the length
            inputLength = input.length;
    
            // Initialize the state
            n = initialN;
            delta = 0;
            bias = initialBias;
    
            // Handle the basic code points
            for (j = 0; j < inputLength; ++j) {
                currentValue = input[j];
                if (currentValue < 0x80) {
                    output.push(stringFromCharCode(currentValue));
                }
            }
    
            handledCPCount = basicLength = output.length;
    
            // `handledCPCount` is the number of code points that have been handled;
            // `basicLength` is the number of basic code points.
    
            // Finish the basic string - if it is not empty - with a delimiter
            if (basicLength) {
                output.push(delimiter);
            }
    
            // Main encoding loop:
            while (handledCPCount < inputLength) {
    
                // All non-basic code points < n have been handled already. Find the next
                // larger one:
                for (m = maxInt, j = 0; j < inputLength; ++j) {
                    currentValue = input[j];
                    if (currentValue >= n && currentValue < m) {
                        m = currentValue;
                    }
                }
    
                // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                // but guard against overflow
                handledCPCountPlusOne = handledCPCount + 1;
                if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                    error('overflow');
                }
    
                delta += (m - n) * handledCPCountPlusOne;
                n = m;
    
                for (j = 0; j < inputLength; ++j) {
                    currentValue = input[j];
    
                    if (currentValue < n && ++delta > maxInt) {
                        error('overflow');
                    }
    
                    if (currentValue == n) {
                        // Represent delta as a generalized variable-length integer
                        for (q = delta, k = base; /* no condition */; k += base) {
                            t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                            if (q < t) {
                                break;
                            }
                            qMinusT = q - t;
                            baseMinusT = base - t;
                            output.push(
                                stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                            );
                            q = floor(qMinusT / baseMinusT);
                        }
    
                        output.push(stringFromCharCode(digitToBasic(q, 0)));
                        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                        delta = 0;
                        ++handledCPCount;
                    }
                }
    
                ++delta;
                ++n;
    
            }
            return output.join('');
        }
    
        /**
         * Converts a Punycode string representing a domain name or an email address
         * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
         * it doesn't matter if you call it on a string that has already been
         * converted to Unicode.
         * @memberOf punycode
         * @param {String} input The Punycoded domain name or email address to
         * convert to Unicode.
         * @returns {String} The Unicode representation of the given Punycode
         * string.
         */
        function toUnicode(input) {
            return mapDomain(input, function(string) {
                return regexPunycode.test(string)
                    ? decode(string.slice(4).toLowerCase())
                    : string;
            });
        }
    
        /**
         * Converts a Unicode string representing a domain name or an email address to
         * Punycode. Only the non-ASCII parts of the domain name will be converted,
         * i.e. it doesn't matter if you call it with a domain that's already in
         * ASCII.
         * @memberOf punycode
         * @param {String} input The domain name or email address to convert, as a
         * Unicode string.
         * @returns {String} The Punycode representation of the given domain name or
         * email address.
         */
        function toASCII(input) {
            return mapDomain(input, function(string) {
                return regexNonASCII.test(string)
                    ? 'xn--' + encode(string)
                    : string;
            });
        }
    
        /*--------------------------------------------------------------------------*/
    
        /** Define the public API */
        punycode = {
            /**
             * A string representing the current Punycode.js version number.
             * @memberOf punycode
             * @type String
             */
            'version': '1.4.1',
            /**
             * An object of methods to convert from JavaScript's internal character
             * representation (UCS-2) to Unicode code points, and back.
             * @see <https://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode
             * @type Object
             */
            'ucs2': {
                'decode': ucs2decode,
                'encode': ucs2encode
            },
            'decode': decode,
            'encode': encode,
            'toASCII': toASCII,
            'toUnicode': toUnicode
        };
    
        /** Expose `punycode` */
        // Some AMD build optimizers, like r.js, check for specific condition patterns
        // like the following:
        if (
            typeof define == 'function' &&
            typeof define.amd == 'object' &&
            define.amd
        ) {
            define('punycode', function() {
                return punycode;
            });
        } else if (freeExports && freeModule) {
            if (module.exports == freeExports) {
                // in Node.js, io.js, or RingoJS v0.8.0+
                freeModule.exports = punycode;
            } else {
                // in Narwhal or RingoJS v0.7.0-
                for (key in punycode) {
                    punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
                }
            }
        } else {
            // in Rhino or a web browser
            root.punycode = punycode;
        }
    
    }(this));
    
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}],62:[function(require,module,exports){
    'use strict';
    const strictUriEncode = require('strict-uri-encode');
    const decodeComponent = require('decode-uri-component');
    const splitOnFirst = require('split-on-first');
    const filterObject = require('filter-obj');
    
    const isNullOrUndefined = value => value === null || value === undefined;
    
    function encoderForArrayFormat(options) {
        switch (options.arrayFormat) {
            case 'index':
                return key => (result, value) => {
                    const index = result.length;
    
                    if (
                        value === undefined ||
                        (options.skipNull && value === null) ||
                        (options.skipEmptyString && value === '')
                    ) {
                        return result;
                    }
    
                    if (value === null) {
                        return [...result, [encode(key, options), '[', index, ']'].join('')];
                    }
    
                    return [
                        ...result,
                        [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
                    ];
                };
    
            case 'bracket':
                return key => (result, value) => {
                    if (
                        value === undefined ||
                        (options.skipNull && value === null) ||
                        (options.skipEmptyString && value === '')
                    ) {
                        return result;
                    }
    
                    if (value === null) {
                        return [...result, [encode(key, options), '[]'].join('')];
                    }
    
                    return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
                };
    
            case 'comma':
            case 'separator':
                return key => (result, value) => {
                    if (value === null || value === undefined || value.length === 0) {
                        return result;
                    }
    
                    if (result.length === 0) {
                        return [[encode(key, options), '=', encode(value, options)].join('')];
                    }
    
                    return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
                };
    
            default:
                return key => (result, value) => {
                    if (
                        value === undefined ||
                        (options.skipNull && value === null) ||
                        (options.skipEmptyString && value === '')
                    ) {
                        return result;
                    }
    
                    if (value === null) {
                        return [...result, encode(key, options)];
                    }
    
                    return [...result, [encode(key, options), '=', encode(value, options)].join('')];
                };
        }
    }
    
    function parserForArrayFormat(options) {
        let result;
    
        switch (options.arrayFormat) {
            case 'index':
                return (key, value, accumulator) => {
                    result = /\[(\d*)\]$/.exec(key);
    
                    key = key.replace(/\[\d*\]$/, '');
    
                    if (!result) {
                        accumulator[key] = value;
                        return;
                    }
    
                    if (accumulator[key] === undefined) {
                        accumulator[key] = {};
                    }
    
                    accumulator[key][result[1]] = value;
                };
    
            case 'bracket':
                return (key, value, accumulator) => {
                    result = /(\[\])$/.exec(key);
                    key = key.replace(/\[\]$/, '');
    
                    if (!result) {
                        accumulator[key] = value;
                        return;
                    }
    
                    if (accumulator[key] === undefined) {
                        accumulator[key] = [value];
                        return;
                    }
    
                    accumulator[key] = [].concat(accumulator[key], value);
                };
    
            case 'comma':
            case 'separator':
                return (key, value, accumulator) => {
                    const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
                    const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
                    value = isEncodedArray ? decode(value, options) : value;
                    const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
                    accumulator[key] = newValue;
                };
    
            default:
                return (key, value, accumulator) => {
                    if (accumulator[key] === undefined) {
                        accumulator[key] = value;
                        return;
                    }
    
                    accumulator[key] = [].concat(accumulator[key], value);
                };
        }
    }
    
    function validateArrayFormatSeparator(value) {
        if (typeof value !== 'string' || value.length !== 1) {
            throw new TypeError('arrayFormatSeparator must be single character string');
        }
    }
    
    function encode(value, options) {
        if (options.encode) {
            return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
        }
    
        return value;
    }
    
    function decode(value, options) {
        if (options.decode) {
            return decodeComponent(value);
        }
    
        return value;
    }
    
    function keysSorter(input) {
        if (Array.isArray(input)) {
            return input.sort();
        }
    
        if (typeof input === 'object') {
            return keysSorter(Object.keys(input))
                .sort((a, b) => Number(a) - Number(b))
                .map(key => input[key]);
        }
    
        return input;
    }
    
    function removeHash(input) {
        const hashStart = input.indexOf('#');
        if (hashStart !== -1) {
            input = input.slice(0, hashStart);
        }
    
        return input;
    }
    
    function getHash(url) {
        let hash = '';
        const hashStart = url.indexOf('#');
        if (hashStart !== -1) {
            hash = url.slice(hashStart);
        }
    
        return hash;
    }
    
    function extract(input) {
        input = removeHash(input);
        const queryStart = input.indexOf('?');
        if (queryStart === -1) {
            return '';
        }
    
        return input.slice(queryStart + 1);
    }
    
    function parseValue(value, options) {
        if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
            value = Number(value);
        } else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
            value = value.toLowerCase() === 'true';
        }
    
        return value;
    }
    
    function parse(query, options) {
        options = Object.assign({
            decode: true,
            sort: true,
            arrayFormat: 'none',
            arrayFormatSeparator: ',',
            parseNumbers: false,
            parseBooleans: false
        }, options);
    
        validateArrayFormatSeparator(options.arrayFormatSeparator);
    
        const formatter = parserForArrayFormat(options);
    
        // Create an object with no prototype
        const ret = Object.create(null);
    
        if (typeof query !== 'string') {
            return ret;
        }
    
        query = query.trim().replace(/^[?#&]/, '');
    
        if (!query) {
            return ret;
        }
    
        for (const param of query.split('&')) {
            if (param === '') {
                continue;
            }
    
            let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');
    
            // Missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
            formatter(decode(key, options), value, ret);
        }
    
        for (const key of Object.keys(ret)) {
            const value = ret[key];
            if (typeof value === 'object' && value !== null) {
                for (const k of Object.keys(value)) {
                    value[k] = parseValue(value[k], options);
                }
            } else {
                ret[key] = parseValue(value, options);
            }
        }
    
        if (options.sort === false) {
            return ret;
        }
    
        return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
            const value = ret[key];
            if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
                // Sort object keys, not values
                result[key] = keysSorter(value);
            } else {
                result[key] = value;
            }
    
            return result;
        }, Object.create(null));
    }
    
    exports.extract = extract;
    exports.parse = parse;
    
    exports.stringify = (object, options) => {
        if (!object) {
            return '';
        }
    
        options = Object.assign({
            encode: true,
            strict: true,
            arrayFormat: 'none',
            arrayFormatSeparator: ','
        }, options);
    
        validateArrayFormatSeparator(options.arrayFormatSeparator);
    
        const shouldFilter = key => (
            (options.skipNull && isNullOrUndefined(object[key])) ||
            (options.skipEmptyString && object[key] === '')
        );
    
        const formatter = encoderForArrayFormat(options);
    
        const objectCopy = {};
    
        for (const key of Object.keys(object)) {
            if (!shouldFilter(key)) {
                objectCopy[key] = object[key];
            }
        }
    
        const keys = Object.keys(objectCopy);
    
        if (options.sort !== false) {
            keys.sort(options.sort);
        }
    
        return keys.map(key => {
            const value = object[key];
    
            if (value === undefined) {
                return '';
            }
    
            if (value === null) {
                return encode(key, options);
            }
    
            if (Array.isArray(value)) {
                return value
                    .reduce(formatter(key), [])
                    .join('&');
            }
    
            return encode(key, options) + '=' + encode(value, options);
        }).filter(x => x.length > 0).join('&');
    };
    
    exports.parseUrl = (url, options) => {
        options = Object.assign({
            decode: true
        }, options);
    
        const [url_, hash] = splitOnFirst(url, '#');
    
        return Object.assign(
            {
                url: url_.split('?')[0] || '',
                query: parse(extract(url), options)
            },
            options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
        );
    };
    
    exports.stringifyUrl = (object, options) => {
        options = Object.assign({
            encode: true,
            strict: true
        }, options);
    
        const url = removeHash(object.url).split('?')[0] || '';
        const queryFromUrl = exports.extract(object.url);
        const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});
    
        const query = Object.assign(parsedQueryFromUrl, object.query);
        let queryString = exports.stringify(query, options);
        if (queryString) {
            queryString = `?${queryString}`;
        }
    
        let hash = getHash(object.url);
        if (object.fragmentIdentifier) {
            hash = `#${encode(object.fragmentIdentifier, options)}`;
        }
    
        return `${url}${queryString}${hash}`;
    };
    
    exports.pick = (input, filter, options) => {
        options = Object.assign({
            parseFragmentIdentifier: true
        }, options);
    
        const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
        return exports.stringifyUrl({
            url,
            query: filterObject(query, filter),
            fragmentIdentifier
        }, options);
    };
    
    exports.exclude = (input, filter, options) => {
        const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);
    
        return exports.pick(input, exclusionFilter, options);
    };
    
    },{"decode-uri-component":38,"filter-obj":42,"split-on-first":67,"strict-uri-encode":68}],63:[function(require,module,exports){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
    module.exports = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};
    
      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }
    
      var regexp = /\+/g;
      qs = qs.split(sep);
    
      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }
    
      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
    
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;
    
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }
    
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
    
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
    
      return obj;
    };
    
    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };
    
    },{}],64:[function(require,module,exports){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;
    
        case 'boolean':
          return v ? 'true' : 'false';
    
        case 'number':
          return isFinite(v) ? v : '';
    
        default:
          return '';
      }
    };
    
    module.exports = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }
    
      if (typeof obj === 'object') {
        return map(objectKeys(obj), function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (isArray(obj[k])) {
            return map(obj[k], function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
    
      }
    
      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };
    
    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };
    
    function map (xs, f) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
      }
      return res;
    }
    
    var objectKeys = Object.keys || function (obj) {
      var res = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
      }
      return res;
    };
    
    },{}],65:[function(require,module,exports){
    'use strict';
    
    exports.decode = exports.parse = require('./decode');
    exports.encode = exports.stringify = require('./encode');
    
    },{"./decode":63,"./encode":64}],66:[function(require,module,exports){
    'use strict';
    
    var fs = require('fs'),
      join = require('path').join,
      resolve = require('path').resolve,
      dirname = require('path').dirname,
      defaultOptions = {
        extensions: ['js', 'json', 'coffee'],
        recurse: true,
        rename: function (name) {
          return name;
        },
        visit: function (obj) {
          return obj;
        }
      };
    
    function checkFileInclusion(path, filename, options) {
      return (
        // verify file has valid extension
        (new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename)) &&
    
        // if options.include is a RegExp, evaluate it and make sure the path passes
        !(options.include && options.include instanceof RegExp && !options.include.test(path)) &&
    
        // if options.include is a function, evaluate it and make sure the path passes
        !(options.include && typeof options.include === 'function' && !options.include(path, filename)) &&
    
        // if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
        !(options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) &&
    
        // if options.exclude is a function, evaluate it and make sure the path doesn't pass
        !(options.exclude && typeof options.exclude === 'function' && options.exclude(path, filename))
      );
    }
    
    function requireDirectory(m, path, options) {
      var retval = {};
    
      // path is optional
      if (path && !options && typeof path !== 'string') {
        options = path;
        path = null;
      }
    
      // default options
      options = options || {};
      for (var prop in defaultOptions) {
        if (typeof options[prop] === 'undefined') {
          options[prop] = defaultOptions[prop];
        }
      }
    
      // if no path was passed in, assume the equivelant of __dirname from caller
      // otherwise, resolve path relative to the equivalent of __dirname
      path = !path ? dirname(m.filename) : resolve(dirname(m.filename), path);
    
      // get the path of each file in specified directory, append to current tree node, recurse
      fs.readdirSync(path).forEach(function (filename) {
        var joined = join(path, filename),
          files,
          key,
          obj;
    
        if (fs.statSync(joined).isDirectory() && options.recurse) {
          // this node is a directory; recurse
          files = requireDirectory(m, joined, options);
          // exclude empty directories
          if (Object.keys(files).length) {
            retval[options.rename(filename, joined, filename)] = files;
          }
        } else {
          if (joined !== m.filename && checkFileInclusion(joined, filename, options)) {
            // hash node key shouldn't include file extension
            key = filename.substring(0, filename.lastIndexOf('.'));
            obj = m.require(joined);
            retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
          }
        }
      });
    
      return retval;
    }
    
    module.exports = requireDirectory;
    module.exports.defaults = defaultOptions;
    
    },{"fs":7,"path":59}],67:[function(require,module,exports){
    'use strict';
    
    module.exports = (string, separator) => {
        if (!(typeof string === 'string' && typeof separator === 'string')) {
            throw new TypeError('Expected the arguments to be of type `string`');
        }
    
        if (separator === '') {
            return [string];
        }
    
        const separatorIndex = string.indexOf(separator);
    
        if (separatorIndex === -1) {
            return [string];
        }
    
        return [
            string.slice(0, separatorIndex),
            string.slice(separatorIndex + separator.length)
        ];
    };
    
    },{}],68:[function(require,module,exports){
    'use strict';
    module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
    
    },{}],69:[function(require,module,exports){
    /*! http://mths.be/startswith v0.2.0 by @mathias */
    if (!String.prototype.startsWith) {
        (function() {
            'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch(error) {}
                return result;
            }());
            var toString = {}.toString;
            var startsWith = function(search) {
                if (this == null) {
                    throw TypeError();
                }
                var string = String(this);
                if (search && toString.call(search) == '[object RegExp]') {
                    throw TypeError();
                }
                var stringLength = string.length;
                var searchString = String(search);
                var searchLength = searchString.length;
                var position = arguments.length > 1 ? arguments[1] : undefined;
                // `ToInteger`
                var pos = position ? Number(position) : 0;
                if (pos != pos) { // better `isNaN`
                    pos = 0;
                }
                var start = Math.min(Math.max(pos, 0), stringLength);
                // Avoid the `indexOf` call if no match is possible
                if (searchLength + start > stringLength) {
                    return false;
                }
                var index = -1;
                while (++index < searchLength) {
                    if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                        return false;
                    }
                }
                return true;
            };
            if (defineProperty) {
                defineProperty(String.prototype, 'startsWith', {
                    'value': startsWith,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.prototype.startsWith = startsWith;
            }
        }());
    }
    
    },{}],70:[function(require,module,exports){
    (function (setImmediate,clearImmediate){(function (){
    var nextTick = require('process/browser.js').nextTick;
    var apply = Function.prototype.apply;
    var slice = Array.prototype.slice;
    var immediateIds = {};
    var nextImmediateId = 0;
    
    // DOM APIs, for completeness
    
    exports.setTimeout = function() {
      return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
    };
    exports.setInterval = function() {
      return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
    };
    exports.clearTimeout =
    exports.clearInterval = function(timeout) { timeout.close(); };
    
    function Timeout(id, clearFn) {
      this._id = id;
      this._clearFn = clearFn;
    }
    Timeout.prototype.unref = Timeout.prototype.ref = function() {};
    Timeout.prototype.close = function() {
      this._clearFn.call(window, this._id);
    };
    
    // Does not start the time, just sets up the members needed.
    exports.enroll = function(item, msecs) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = msecs;
    };
    
    exports.unenroll = function(item) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = -1;
    };
    
    exports._unrefActive = exports.active = function(item) {
      clearTimeout(item._idleTimeoutId);
    
      var msecs = item._idleTimeout;
      if (msecs >= 0) {
        item._idleTimeoutId = setTimeout(function onTimeout() {
          if (item._onTimeout)
            item._onTimeout();
        }, msecs);
      }
    };
    
    // That's not how node.js implements it but the exposed api is the same.
    exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
      var id = nextImmediateId++;
      var args = arguments.length < 2 ? false : slice.call(arguments, 1);
    
      immediateIds[id] = true;
    
      nextTick(function onNextTick() {
        if (immediateIds[id]) {
          // fn.call() is faster so we optimize for the common use-case
          // @see http://jsperf.com/call-apply-segu
          if (args) {
            fn.apply(null, args);
          } else {
            fn.call(null);
          }
          // Prevent ids from leaking
          exports.clearImmediate(id);
        }
      });
    
      return id;
    };
    
    exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
      delete immediateIds[id];
    };
    }).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
    },{"process/browser.js":60,"timers":70}],71:[function(require,module,exports){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    var punycode = require('punycode');
    var util = require('./util');
    
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    
    exports.Url = Url;
    
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    
    // Reference: RFC 3986, RFC 1808, RFC 2396
    
    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9.+-]+:)/i,
        portPattern = /:[0-9]*$/,
    
        // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    
        // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    
        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
    
        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise),
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
        hostEndingChars = ['/', '?', '#'],
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
        hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        // protocols that can allow "unsafe" and "unwise" chars.
        unsafeProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        },
        querystring = require('querystring');
    
    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url) return url;
    
      var u = new Url;
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }
    
      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      var queryIndex = url.indexOf('?'),
          splitter =
              (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
          uSplit = url.split(splitter),
          slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, '/');
      url = uSplit.join(splitter);
    
      var rest = url;
    
      // trim before proceeding.
      // This is to support parse stuff like "  http://foo.com  \n"
      rest = rest.trim();
    
      if (!slashesDenoteHost && url.split('#').length === 1) {
        // Try fast path regexp
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = '';
            this.query = {};
          }
          return this;
        }
      }
    
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
    
      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
    
      if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {
    
        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c
    
        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.
    
        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
    
        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) {
          // atSign can be anywhere.
          atSign = rest.lastIndexOf('@');
        } else {
          // atSign must be in auth portion.
          // http://a@b/c@d => host:b auth:a path:/c@d
          atSign = rest.lastIndexOf('@', hostEnd);
        }
    
        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
    
        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1)
          hostEnd = rest.length;
    
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
    
        // pull out port.
        this.parseHost();
    
        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        this.hostname = this.hostname || '';
    
        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = this.hostname[0] === '[' &&
            this.hostname[this.hostname.length - 1] === ']';
    
        // validate a little.
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                this.hostname = validParts.join('.');
                break;
              }
            }
          }
        }
    
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = '';
        } else {
          // hostnames are always lower case.
          this.hostname = this.hostname.toLowerCase();
        }
    
        if (!ipv6Hostname) {
          // IDNA Support: Returns a punycoded representation of "domain".
          // It only converts parts of the domain name that
          // have non-ASCII characters, i.e. it doesn't matter if
          // you call it with a domain that already is ASCII-only.
          this.hostname = punycode.toASCII(this.hostname);
        }
    
        var p = this.port ? ':' + this.port : '';
        var h = this.hostname || '';
        this.host = h + p;
        this.href += this.host;
    
        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== '/') {
            rest = '/' + rest;
          }
        }
      }
    
      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {
    
        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
    
    
      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        this.search = '';
        this.query = {};
      }
      if (rest) this.pathname = rest;
      if (slashedProtocol[lowerProto] &&
          this.hostname && !this.pathname) {
        this.pathname = '/';
      }
    
      //to support http.request
      if (this.pathname || this.search) {
        var p = this.pathname || '';
        var s = this.search || '';
        this.path = p + s;
      }
    
      // finally, reconstruct the href based on what has been validated.
      this.href = this.format();
      return this;
    };
    
    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (util.isString(obj)) obj = urlParse(obj);
      if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
      return obj.format();
    }
    
    Url.prototype.format = function() {
      var auth = this.auth || '';
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ':');
        auth += '@';
      }
    
      var protocol = this.protocol || '',
          pathname = this.pathname || '',
          hash = this.hash || '',
          host = false,
          query = '';
    
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(':') === -1 ?
            this.hostname :
            '[' + this.hostname + ']');
        if (this.port) {
          host += ':' + this.port;
        }
      }
    
      if (this.query &&
          util.isObject(this.query) &&
          Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
    
      var search = this.search || (query && ('?' + query)) || '';
    
      if (protocol && protocol.substr(-1) !== ':') protocol += ':';
    
      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (this.slashes ||
          (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }
    
      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;
    
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace('#', '%23');
    
      return protocol + host + pathname + search + hash;
    };
    
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    
    function urlResolveObject(source, relative) {
      if (!source) return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    
    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
    
      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
    
      // hash is always overridden, no matter what.
      // even href="" will remove it.
      result.hash = relative.hash;
    
      // if the relative url is empty, then there's nothing left to do here.
      if (relative.href === '') {
        result.href = result.format();
        return result;
      }
    
      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== 'protocol')
            result[rkey] = relative[rkey];
        }
    
        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] &&
            result.hostname && !result.pathname) {
          result.path = result.pathname = '/';
        }
    
        result.href = result.format();
        return result;
      }
    
      if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
    
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (!relative.hostname) relative.hostname = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          result.pathname = relPath.join('/');
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
          var p = result.pathname || '';
          var s = result.search || '';
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
    
      var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
          isRelAbs = (
              relative.host ||
              relative.pathname && relative.pathname.charAt(0) === '/'
          ),
          mustEndAbs = (isRelAbs || isSourceAbs ||
                        (result.host && relative.pathname)),
          removeAllDots = mustEndAbs,
          srcPath = result.pathname && result.pathname.split('/') || [],
          relPath = relative.pathname && relative.pathname.split('/') || [],
          psychotic = result.protocol && !slashedProtocol[result.protocol];
    
      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // result.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
          if (srcPath[0] === '') srcPath[0] = result.host;
          else srcPath.unshift(result.host);
        }
        result.host = '';
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }
    
      if (isRelAbs) {
        // it's absolute.
        result.host = (relative.host || relative.host === '') ?
                      relative.host : result.host;
        result.hostname = (relative.hostname || relative.hostname === '') ?
                          relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          //occationaly the auth can get stuck only in host
          //this especially happens in cases like
          //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
          var authInHost = result.host && result.host.indexOf('@') > 0 ?
                           result.host.split('@') : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
      }
    
      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
          result.path = '/' + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
    
      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (
          (result.host || relative.host || srcPath.length > 1) &&
          (last === '.' || last === '..') || last === '');
    
      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }
    
      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }
    
      if (mustEndAbs && srcPath[0] !== '' &&
          (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }
    
      if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
      }
    
      var isAbsolute = srcPath[0] === '' ||
          (srcPath[0] && srcPath[0].charAt(0) === '/');
    
      // put the host back
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' :
                                        srcPath.length ? srcPath.shift() : '';
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                         result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
    
      mustEndAbs = mustEndAbs || (result.host && srcPath.length);
    
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }
    
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join('/');
      }
    
      //to support request.http
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
                      (result.search ? result.search : '');
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ':') {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) this.hostname = host;
    };
    
    },{"./util":72,"punycode":61,"querystring":65}],72:[function(require,module,exports){
    'use strict';
    
    module.exports = {
      isString: function(arg) {
        return typeof(arg) === 'string';
      },
      isObject: function(arg) {
        return typeof(arg) === 'object' && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
    
    },{}],73:[function(require,module,exports){
    arguments[4][4][0].apply(exports,arguments)
    },{"dup":4}],74:[function(require,module,exports){
    // Currently in sync with Node.js lib/internal/util/types.js
    // https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9
    
    'use strict';
    
    var isArgumentsObject = require('is-arguments');
    var isGeneratorFunction = require('is-generator-function');
    var whichTypedArray = require('which-typed-array');
    var isTypedArray = require('is-typed-array');
    
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    
    var BigIntSupported = typeof BigInt !== 'undefined';
    var SymbolSupported = typeof Symbol !== 'undefined';
    
    var ObjectToString = uncurryThis(Object.prototype.toString);
    
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    
    if (BigIntSupported) {
      var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    
    if (SymbolSupported) {
      var symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== 'object') {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch(e) {
        return false;
      }
    }
    
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction;
    exports.isTypedArray = isTypedArray;
    
    // Taken from here and modified for better browser support
    // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
    function isPromise(input) {
        return (
            (
                typeof Promise !== 'undefined' &&
                input instanceof Promise
            ) ||
            (
                input !== null &&
                typeof input === 'object' &&
                typeof input.then === 'function' &&
                typeof input.catch === 'function'
            )
        );
    }
    exports.isPromise = isPromise;
    
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
    
      return (
        isTypedArray(value) ||
        isDataView(value)
      );
    }
    exports.isArrayBufferView = isArrayBufferView;
    
    
    function isUint8Array(value) {
      return whichTypedArray(value) === 'Uint8Array';
    }
    exports.isUint8Array = isUint8Array;
    
    function isUint8ClampedArray(value) {
      return whichTypedArray(value) === 'Uint8ClampedArray';
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    
    function isUint16Array(value) {
      return whichTypedArray(value) === 'Uint16Array';
    }
    exports.isUint16Array = isUint16Array;
    
    function isUint32Array(value) {
      return whichTypedArray(value) === 'Uint32Array';
    }
    exports.isUint32Array = isUint32Array;
    
    function isInt8Array(value) {
      return whichTypedArray(value) === 'Int8Array';
    }
    exports.isInt8Array = isInt8Array;
    
    function isInt16Array(value) {
      return whichTypedArray(value) === 'Int16Array';
    }
    exports.isInt16Array = isInt16Array;
    
    function isInt32Array(value) {
      return whichTypedArray(value) === 'Int32Array';
    }
    exports.isInt32Array = isInt32Array;
    
    function isFloat32Array(value) {
      return whichTypedArray(value) === 'Float32Array';
    }
    exports.isFloat32Array = isFloat32Array;
    
    function isFloat64Array(value) {
      return whichTypedArray(value) === 'Float64Array';
    }
    exports.isFloat64Array = isFloat64Array;
    
    function isBigInt64Array(value) {
      return whichTypedArray(value) === 'BigInt64Array';
    }
    exports.isBigInt64Array = isBigInt64Array;
    
    function isBigUint64Array(value) {
      return whichTypedArray(value) === 'BigUint64Array';
    }
    exports.isBigUint64Array = isBigUint64Array;
    
    function isMapToString(value) {
      return ObjectToString(value) === '[object Map]';
    }
    isMapToString.working = (
      typeof Map !== 'undefined' &&
      isMapToString(new Map())
    );
    
    function isMap(value) {
      if (typeof Map === 'undefined') {
        return false;
      }
    
      return isMapToString.working
        ? isMapToString(value)
        : value instanceof Map;
    }
    exports.isMap = isMap;
    
    function isSetToString(value) {
      return ObjectToString(value) === '[object Set]';
    }
    isSetToString.working = (
      typeof Set !== 'undefined' &&
      isSetToString(new Set())
    );
    function isSet(value) {
      if (typeof Set === 'undefined') {
        return false;
      }
    
      return isSetToString.working
        ? isSetToString(value)
        : value instanceof Set;
    }
    exports.isSet = isSet;
    
    function isWeakMapToString(value) {
      return ObjectToString(value) === '[object WeakMap]';
    }
    isWeakMapToString.working = (
      typeof WeakMap !== 'undefined' &&
      isWeakMapToString(new WeakMap())
    );
    function isWeakMap(value) {
      if (typeof WeakMap === 'undefined') {
        return false;
      }
    
      return isWeakMapToString.working
        ? isWeakMapToString(value)
        : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    
    function isWeakSetToString(value) {
      return ObjectToString(value) === '[object WeakSet]';
    }
    isWeakSetToString.working = (
      typeof WeakSet !== 'undefined' &&
      isWeakSetToString(new WeakSet())
    );
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    
    function isArrayBufferToString(value) {
      return ObjectToString(value) === '[object ArrayBuffer]';
    }
    isArrayBufferToString.working = (
      typeof ArrayBuffer !== 'undefined' &&
      isArrayBufferToString(new ArrayBuffer())
    );
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === 'undefined') {
        return false;
      }
    
      return isArrayBufferToString.working
        ? isArrayBufferToString(value)
        : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    
    function isDataViewToString(value) {
      return ObjectToString(value) === '[object DataView]';
    }
    isDataViewToString.working = (
      typeof ArrayBuffer !== 'undefined' &&
      typeof DataView !== 'undefined' &&
      isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
    );
    function isDataView(value) {
      if (typeof DataView === 'undefined') {
        return false;
      }
    
      return isDataViewToString.working
        ? isDataViewToString(value)
        : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === '[object SharedArrayBuffer]';
    }
    isSharedArrayBufferToString.working = (
      typeof SharedArrayBuffer !== 'undefined' &&
      isSharedArrayBufferToString(new SharedArrayBuffer())
    );
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBuffer === 'undefined') {
        return false;
      }
    
      return isSharedArrayBufferToString.working
        ? isSharedArrayBufferToString(value)
        : value instanceof SharedArrayBuffer;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    
    function isAsyncFunction(value) {
      return ObjectToString(value) === '[object AsyncFunction]';
    }
    exports.isAsyncFunction = isAsyncFunction;
    
    function isMapIterator(value) {
      return ObjectToString(value) === '[object Map Iterator]';
    }
    exports.isMapIterator = isMapIterator;
    
    function isSetIterator(value) {
      return ObjectToString(value) === '[object Set Iterator]';
    }
    exports.isSetIterator = isSetIterator;
    
    function isGeneratorObject(value) {
      return ObjectToString(value) === '[object Generator]';
    }
    exports.isGeneratorObject = isGeneratorObject;
    
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === '[object WebAssembly.Module]';
    }
    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
    
    function isNumberObject(value) {
      return checkBoxedPrimitive(value, numberValue);
    }
    exports.isNumberObject = isNumberObject;
    
    function isStringObject(value) {
      return checkBoxedPrimitive(value, stringValue);
    }
    exports.isStringObject = isStringObject;
    
    function isBooleanObject(value) {
      return checkBoxedPrimitive(value, booleanValue);
    }
    exports.isBooleanObject = isBooleanObject;
    
    function isBigIntObject(value) {
      return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }
    exports.isBigIntObject = isBigIntObject;
    
    function isSymbolObject(value) {
      return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }
    exports.isSymbolObject = isSymbolObject;
    
    function isBoxedPrimitive(value) {
      return (
        isNumberObject(value) ||
        isStringObject(value) ||
        isBooleanObject(value) ||
        isBigIntObject(value) ||
        isSymbolObject(value)
      );
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    
    function isAnyArrayBuffer(value) {
      return typeof Uint8Array !== 'undefined' && (
        isArrayBuffer(value) ||
        isSharedArrayBuffer(value)
      );
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    
    ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function() {
          throw new Error(method + ' is not supported in userland');
        }
      });
    });
    
    },{"is-arguments":52,"is-generator-function":54,"is-typed-array":55,"which-typed-array":76}],75:[function(require,module,exports){
    (function (process){(function (){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
      function getOwnPropertyDescriptors(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
    
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }
    
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };
    
    
    // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      if (typeof process !== 'undefined' && process.noDeprecation === true) {
        return fn;
      }
    
      // Allow for deprecating things in the process of starting up.
      if (typeof process === 'undefined') {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
    
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
    
      return deprecated;
    };
    
    
    var debugs = {};
    var debugEnvRegex = /^$/;
    
    if (process.env.NODE_DEBUG) {
      var debugEnv = process.env.NODE_DEBUG;
      debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/,/g, '$|^')
        .toUpperCase();
      debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
    }
    exports.debuglog = function(set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };
    
    
    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    
    
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };
    
    // Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };
    
    
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
    
      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
               '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }
    
    
    function stylizeNoColor(str, styleType) {
      return str;
    }
    
    
    function arrayToHash(array) {
      var hash = {};
    
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
    
      return hash;
    }
    
    
    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
    
      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
    
      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
    
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
    
      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }
    
      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
    
      var base = '', array = false, braces = ['{', '}'];
    
      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }
    
      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }
    
      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }
    
      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }
    
      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }
    
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
    
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }
    
      ctx.seen.push(value);
    
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
    
      ctx.seen.pop();
    
      return reduceToSingleString(output, base, braces);
    }
    
    
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }
    
    
    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }
    
    
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
        }
      });
      return output;
    }
    
    
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }
    
      return name + ': ' + str;
    }
    
    
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf('\n') >= 0) numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);
    
      if (length > 60) {
        return braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];
      }
    
      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }
    
    
    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    exports.types = require('./support/types');
    
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    
    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;
    
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    
    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;
    
    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;
    
    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;
    
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    
    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;
    
    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    
    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;
    exports.types.isNativeError = isError;
    
    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;
    
    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;
    
    exports.isBuffer = require('./support/isBuffer');
    
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    
    
    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }
    
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];
    
    // 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }
    
    
    // log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };
    
    
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = require('inherits');
    
    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;
    
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
    var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;
    
    exports.promisify = function promisify(original) {
      if (typeof original !== 'function')
        throw new TypeError('The "original" argument must be of type Function');
    
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== 'function') {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn, enumerable: false, writable: false, configurable: true
        });
        return fn;
      }
    
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function (resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
    
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function (err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });
    
        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }
    
        return promise;
      }
    
      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    
      if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn, enumerable: false, writable: false, configurable: true
      });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    }
    
    exports.promisify.custom = kCustomPromisifiedSymbol
    
    function callbackifyOnRejected(reason, cb) {
      // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
      // Because `null` is a special error value in callbacks which means "no error
      // occurred", we error-wrap so the callback consumer can distinguish between
      // "the promise rejected with null" or "the promise fulfilled with undefined".
      if (!reason) {
        var newReason = new Error('Promise was rejected with a falsy value');
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    
    function callbackify(original) {
      if (typeof original !== 'function') {
        throw new TypeError('The "original" argument must be of type Function');
      }
    
      // We DO NOT return the promise as it gives the user a false sense that
      // the promise is actually somehow related to the callback's execution
      // and that the callback throwing will reject the promise.
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
    
        var maybeCb = args.pop();
        if (typeof maybeCb !== 'function') {
          throw new TypeError('The last argument must be of type Function');
        }
        var self = this;
        var cb = function() {
          return maybeCb.apply(self, arguments);
        };
        // In true node style we process the callback on `nextTick` with all the
        // implications (stack, `uncaughtException`, `async_hooks`)
        original.apply(this, args)
          .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
                function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
      }
    
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(callbackified,
                              getOwnPropertyDescriptors(original));
      return callbackified;
    }
    exports.callbackify = callbackify;
    
    }).call(this)}).call(this,require('_process'))
    },{"./support/isBuffer":73,"./support/types":74,"_process":60,"inherits":51}],76:[function(require,module,exports){
    (function (global){(function (){
    'use strict';
    
    var forEach = require('foreach');
    var availableTypedArrays = require('available-typed-arrays');
    var callBound = require('call-bind/callBound');
    
    var $toString = callBound('Object.prototype.toString');
    var hasSymbols = require('has-symbols')();
    var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';
    
    var typedArrays = availableTypedArrays();
    
    var $slice = callBound('String.prototype.slice');
    var toStrTags = {};
    var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
    var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
    if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function (typedArray) {
            if (typeof global[typedArray] === 'function') {
                var arr = new global[typedArray]();
                if (!(Symbol.toStringTag in arr)) {
                    throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
                }
                var proto = getPrototypeOf(arr);
                var descriptor = gOPD(proto, Symbol.toStringTag);
                if (!descriptor) {
                    var superProto = getPrototypeOf(proto);
                    descriptor = gOPD(superProto, Symbol.toStringTag);
                }
                toStrTags[typedArray] = descriptor.get;
            }
        });
    }
    
    var tryTypedArrays = function tryAllTypedArrays(value) {
        var foundName = false;
        forEach(toStrTags, function (getter, typedArray) {
            if (!foundName) {
                try {
                    var name = getter.call(value);
                    if (name === typedArray) {
                        foundName = name;
                    }
                } catch (e) {}
            }
        });
        return foundName;
    };
    
    var isTypedArray = require('is-typed-array');
    
    module.exports = function whichTypedArray(value) {
        if (!isTypedArray(value)) { return false; }
        if (!hasToStringTag) { return $slice($toString(value), 8, -1); }
        return tryTypedArrays(value);
    };
    
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"available-typed-arrays":6,"call-bind/callBound":8,"es-abstract/helpers/getOwnPropertyDescriptor":40,"foreach":43,"has-symbols":48,"is-typed-array":55}],77:[function(require,module,exports){
    'use strict';
    const stringWidth = require('string-width');
    const stripAnsi = require('strip-ansi');
    const ansiStyles = require('ansi-styles');
    
    const ESCAPES = new Set([
        '\u001B',
        '\u009B'
    ]);
    
    const END_CODE = 39;
    
    const ANSI_ESCAPE_BELL = '\u0007';
    const ANSI_CSI = '[';
    const ANSI_OSC = ']';
    const ANSI_SGR_TERMINATOR = 'm';
    const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
    
    const wrapAnsi = code => `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
    const wrapAnsiHyperlink = uri => `${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${uri}${ANSI_ESCAPE_BELL}`;
    
    // Calculate the length of words split on ' ', ignoring
    // the extra characters added by ansi escape codes
    const wordLengths = string => string.split(' ').map(character => stringWidth(character));
    
    // Wrap a long word across multiple rows
    // Ansi escape codes do not count towards length
    const wrapWord = (rows, word, columns) => {
        const characters = [...word];
    
        let isInsideEscape = false;
        let isInsideLinkEscape = false;
        let visible = stringWidth(stripAnsi(rows[rows.length - 1]));
    
        for (const [index, character] of characters.entries()) {
            const characterLength = stringWidth(character);
    
            if (visible + characterLength <= columns) {
                rows[rows.length - 1] += character;
            } else {
                rows.push(character);
                visible = 0;
            }
    
            if (ESCAPES.has(character)) {
                isInsideEscape = true;
                isInsideLinkEscape = characters.slice(index + 1).join('').startsWith(ANSI_ESCAPE_LINK);
            }
    
            if (isInsideEscape) {
                if (isInsideLinkEscape) {
                    if (character === ANSI_ESCAPE_BELL) {
                        isInsideEscape = false;
                        isInsideLinkEscape = false;
                    }
                } else if (character === ANSI_SGR_TERMINATOR) {
                    isInsideEscape = false;
                }
    
                continue;
            }
    
            visible += characterLength;
    
            if (visible === columns && index < characters.length - 1) {
                rows.push('');
                visible = 0;
            }
        }
    
        // It's possible that the last row we copy over is only
        // ansi escape characters, handle this edge-case
        if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
            rows[rows.length - 2] += rows.pop();
        }
    };
    
    // Trims spaces from a string ignoring invisible sequences
    const stringVisibleTrimSpacesRight = string => {
        const words = string.split(' ');
        let last = words.length;
    
        while (last > 0) {
            if (stringWidth(words[last - 1]) > 0) {
                break;
            }
    
            last--;
        }
    
        if (last === words.length) {
            return string;
        }
    
        return words.slice(0, last).join(' ') + words.slice(last).join('');
    };
    
    // The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
    //
    // 'hard' will never allow a string to take up more than columns characters
    //
    // 'soft' allows long words to expand past the column length
    const exec = (string, columns, options = {}) => {
        if (options.trim !== false && string.trim() === '') {
            return '';
        }
    
        let returnValue = '';
        let escapeCode;
        let escapeUrl;
    
        const lengths = wordLengths(string);
        let rows = [''];
    
        for (const [index, word] of string.split(' ').entries()) {
            if (options.trim !== false) {
                rows[rows.length - 1] = rows[rows.length - 1].trimStart();
            }
    
            let rowLength = stringWidth(rows[rows.length - 1]);
    
            if (index !== 0) {
                if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
                    // If we start with a new word but the current row length equals the length of the columns, add a new row
                    rows.push('');
                    rowLength = 0;
                }
    
                if (rowLength > 0 || options.trim === false) {
                    rows[rows.length - 1] += ' ';
                    rowLength++;
                }
            }
    
            // In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
            if (options.hard && lengths[index] > columns) {
                const remainingColumns = (columns - rowLength);
                const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
                const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
                if (breaksStartingNextLine < breaksStartingThisLine) {
                    rows.push('');
                }
    
                wrapWord(rows, word, columns);
                continue;
            }
    
            if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
                if (options.wordWrap === false && rowLength < columns) {
                    wrapWord(rows, word, columns);
                    continue;
                }
    
                rows.push('');
            }
    
            if (rowLength + lengths[index] > columns && options.wordWrap === false) {
                wrapWord(rows, word, columns);
                continue;
            }
    
            rows[rows.length - 1] += word;
        }
    
        if (options.trim !== false) {
            rows = rows.map(stringVisibleTrimSpacesRight);
        }
    
        const pre = [...rows.join('\n')];
    
        for (const [index, character] of pre.entries()) {
            returnValue += character;
    
            if (ESCAPES.has(character)) {
                const {groups} = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`).exec(pre.slice(index).join('')) || {groups: {}};
                if (groups.code !== undefined) {
                    const code = Number.parseFloat(groups.code);
                    escapeCode = code === END_CODE ? undefined : code;
                } else if (groups.uri !== undefined) {
                    escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
                }
            }
    
            const code = ansiStyles.codes.get(Number(escapeCode));
    
            if (pre[index + 1] === '\n') {
                if (escapeUrl) {
                    returnValue += wrapAnsiHyperlink('');
                }
    
                if (escapeCode && code) {
                    returnValue += wrapAnsi(code);
                }
            } else if (character === '\n') {
                if (escapeCode && code) {
                    returnValue += wrapAnsi(escapeCode);
                }
    
                if (escapeUrl) {
                    returnValue += wrapAnsiHyperlink(escapeUrl);
                }
            }
        }
    
        return returnValue;
    };
    
    // For each newline, invoke the method separately
    module.exports = (string, columns, options) => {
        return String(string)
            .normalize()
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map(line => exec(line, columns, options))
            .join('\n');
    };
    
    },{"ansi-styles":79,"string-width":85,"strip-ansi":86}],78:[function(require,module,exports){
    arguments[4][11][0].apply(exports,arguments)
    },{"dup":11}],79:[function(require,module,exports){
    'use strict';
    
    const wrapAnsi16 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `\u001B[${code + offset}m`;
    };
    
    const wrapAnsi256 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `\u001B[${38 + offset};5;${code}m`;
    };
    
    const wrapAnsi16m = (fn, offset) => (...args) => {
        const rgb = fn(...args);
        return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    
    const ansi2ansi = n => n;
    const rgb2rgb = (r, g, b) => [r, g, b];
    
    const setLazyProperty = (object, property, get) => {
        Object.defineProperty(object, property, {
            get: () => {
                const value = get();
    
                Object.defineProperty(object, property, {
                    value,
                    enumerable: true,
                    configurable: true
                });
    
                return value;
            },
            enumerable: true,
            configurable: true
        });
    };
    
    /** @type {typeof import('color-convert')} */
    let colorConvert;
    const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
        if (colorConvert === undefined) {
            colorConvert = require('color-convert');
        }
    
        const offset = isBackground ? 10 : 0;
        const styles = {};
    
        for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
            const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
            if (sourceSpace === targetSpace) {
                styles[name] = wrap(identity, offset);
            } else if (typeof suite === 'object') {
                styles[name] = wrap(suite[targetSpace], offset);
            }
        }
    
        return styles;
    };
    
    function assembleStyles() {
        const codes = new Map();
        const styles = {
            modifier: {
                reset: [0, 0],
                // 21 isn't widely supported and 22 does the same thing
                bold: [1, 22],
                dim: [2, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                hidden: [8, 28],
                strikethrough: [9, 29]
            },
            color: {
                black: [30, 39],
                red: [31, 39],
                green: [32, 39],
                yellow: [33, 39],
                blue: [34, 39],
                magenta: [35, 39],
                cyan: [36, 39],
                white: [37, 39],
    
                // Bright color
                blackBright: [90, 39],
                redBright: [91, 39],
                greenBright: [92, 39],
                yellowBright: [93, 39],
                blueBright: [94, 39],
                magentaBright: [95, 39],
                cyanBright: [96, 39],
                whiteBright: [97, 39]
            },
            bgColor: {
                bgBlack: [40, 49],
                bgRed: [41, 49],
                bgGreen: [42, 49],
                bgYellow: [43, 49],
                bgBlue: [44, 49],
                bgMagenta: [45, 49],
                bgCyan: [46, 49],
                bgWhite: [47, 49],
    
                // Bright color
                bgBlackBright: [100, 49],
                bgRedBright: [101, 49],
                bgGreenBright: [102, 49],
                bgYellowBright: [103, 49],
                bgBlueBright: [104, 49],
                bgMagentaBright: [105, 49],
                bgCyanBright: [106, 49],
                bgWhiteBright: [107, 49]
            }
        };
    
        // Alias bright black as gray (and grey)
        styles.color.gray = styles.color.blackBright;
        styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
        styles.color.grey = styles.color.blackBright;
        styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    
        for (const [groupName, group] of Object.entries(styles)) {
            for (const [styleName, style] of Object.entries(group)) {
                styles[styleName] = {
                    open: `\u001B[${style[0]}m`,
                    close: `\u001B[${style[1]}m`
                };
    
                group[styleName] = styles[styleName];
    
                codes.set(style[0], style[1]);
            }
    
            Object.defineProperty(styles, groupName, {
                value: group,
                enumerable: false
            });
        }
    
        Object.defineProperty(styles, 'codes', {
            value: codes,
            enumerable: false
        });
    
        styles.color.close = '\u001B[39m';
        styles.bgColor.close = '\u001B[49m';
    
        setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
        setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
        setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
        setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
        setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
        setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));
    
        return styles;
    }
    
    // Make the export immutable
    Object.defineProperty(module, 'exports', {
        enumerable: true,
        get: assembleStyles
    });
    
    },{"color-convert":81}],80:[function(require,module,exports){
    /* MIT license */
    /* eslint-disable no-mixed-operators */
    const cssKeywords = require('color-name');
    
    // NOTE: conversions should only return primitive values (i.e. arrays, or
    //       values that give correct `typeof` results).
    //       do not use box values types (i.e. Number(), String(), etc.)
    
    const reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
        reverseKeywords[cssKeywords[key]] = key;
    }
    
    const convert = {
        rgb: {channels: 3, labels: 'rgb'},
        hsl: {channels: 3, labels: 'hsl'},
        hsv: {channels: 3, labels: 'hsv'},
        hwb: {channels: 3, labels: 'hwb'},
        cmyk: {channels: 4, labels: 'cmyk'},
        xyz: {channels: 3, labels: 'xyz'},
        lab: {channels: 3, labels: 'lab'},
        lch: {channels: 3, labels: 'lch'},
        hex: {channels: 1, labels: ['hex']},
        keyword: {channels: 1, labels: ['keyword']},
        ansi16: {channels: 1, labels: ['ansi16']},
        ansi256: {channels: 1, labels: ['ansi256']},
        hcg: {channels: 3, labels: ['h', 'c', 'g']},
        apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
        gray: {channels: 1, labels: ['gray']}
    };
    
    module.exports = convert;
    
    // Hide .channels and .labels properties
    for (const model of Object.keys(convert)) {
        if (!('channels' in convert[model])) {
            throw new Error('missing channels property: ' + model);
        }
    
        if (!('labels' in convert[model])) {
            throw new Error('missing channel labels property: ' + model);
        }
    
        if (convert[model].labels.length !== convert[model].channels) {
            throw new Error('channel and label counts mismatch: ' + model);
        }
    
        const {channels, labels} = convert[model];
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], 'channels', {value: channels});
        Object.defineProperty(convert[model], 'labels', {value: labels});
    }
    
    convert.rgb.hsl = function (rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h;
        let s;
    
        if (max === min) {
            h = 0;
        } else if (r === max) {
            h = (g - b) / delta;
        } else if (g === max) {
            h = 2 + (b - r) / delta;
        } else if (b === max) {
            h = 4 + (r - g) / delta;
        }
    
        h = Math.min(h * 60, 360);
    
        if (h < 0) {
            h += 360;
        }
    
        const l = (min + max) / 2;
    
        if (max === min) {
            s = 0;
        } else if (l <= 0.5) {
            s = delta / (max + min);
        } else {
            s = delta / (2 - max - min);
        }
    
        return [h, s * 100, l * 100];
    };
    
    convert.rgb.hsv = function (rgb) {
        let rdif;
        let gdif;
        let bdif;
        let h;
        let s;
    
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = function (c) {
            return (v - c) / 6 / diff + 1 / 2;
        };
    
        if (diff === 0) {
            h = 0;
            s = 0;
        } else {
            s = diff / v;
            rdif = diffc(r);
            gdif = diffc(g);
            bdif = diffc(b);
    
            if (r === v) {
                h = bdif - gdif;
            } else if (g === v) {
                h = (1 / 3) + rdif - bdif;
            } else if (b === v) {
                h = (2 / 3) + gdif - rdif;
            }
    
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
    
        return [
            h * 360,
            s * 100,
            v * 100
        ];
    };
    
    convert.rgb.hwb = function (rgb) {
        const r = rgb[0];
        const g = rgb[1];
        let b = rgb[2];
        const h = convert.rgb.hsl(rgb)[0];
        const w = 1 / 255 * Math.min(r, Math.min(g, b));
    
        b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    
        return [h, w * 100, b * 100];
    };
    
    convert.rgb.cmyk = function (rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
    
        const k = Math.min(1 - r, 1 - g, 1 - b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
    
        return [c * 100, m * 100, y * 100, k * 100];
    };
    
    function comparativeDistance(x, y) {
        /*
            See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
        */
        return (
            ((x[0] - y[0]) ** 2) +
            ((x[1] - y[1]) ** 2) +
            ((x[2] - y[2]) ** 2)
        );
    }
    
    convert.rgb.keyword = function (rgb) {
        const reversed = reverseKeywords[rgb];
        if (reversed) {
            return reversed;
        }
    
        let currentClosestDistance = Infinity;
        let currentClosestKeyword;
    
        for (const keyword of Object.keys(cssKeywords)) {
            const value = cssKeywords[keyword];
    
            // Compute comparative distance
            const distance = comparativeDistance(rgb, value);
    
            // Check if its less, if so set as closest
            if (distance < currentClosestDistance) {
                currentClosestDistance = distance;
                currentClosestKeyword = keyword;
            }
        }
    
        return currentClosestKeyword;
    };
    
    convert.keyword.rgb = function (keyword) {
        return cssKeywords[keyword];
    };
    
    convert.rgb.xyz = function (rgb) {
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;
    
        // Assume sRGB
        r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
        g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
        b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);
    
        const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
        const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
        const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
    
        return [x * 100, y * 100, z * 100];
    };
    
    convert.rgb.lab = function (rgb) {
        const xyz = convert.rgb.xyz(rgb);
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
    
        x /= 95.047;
        y /= 100;
        z /= 108.883;
    
        x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);
    
        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
    
        return [l, a, b];
    };
    
    convert.hsl.rgb = function (hsl) {
        const h = hsl[0] / 360;
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        let t2;
        let t3;
        let val;
    
        if (s === 0) {
            val = l * 255;
            return [val, val, val];
        }
    
        if (l < 0.5) {
            t2 = l * (1 + s);
        } else {
            t2 = l + s - l * s;
        }
    
        const t1 = 2 * l - t2;
    
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            t3 = h + 1 / 3 * -(i - 1);
            if (t3 < 0) {
                t3++;
            }
    
            if (t3 > 1) {
                t3--;
            }
    
            if (6 * t3 < 1) {
                val = t1 + (t2 - t1) * 6 * t3;
            } else if (2 * t3 < 1) {
                val = t2;
            } else if (3 * t3 < 2) {
                val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
            } else {
                val = t1;
            }
    
            rgb[i] = val * 255;
        }
    
        return rgb;
    };
    
    convert.hsl.hsv = function (hsl) {
        const h = hsl[0];
        let s = hsl[1] / 100;
        let l = hsl[2] / 100;
        let smin = s;
        const lmin = Math.max(l, 0.01);
    
        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        smin *= lmin <= 1 ? lmin : 2 - lmin;
        const v = (l + s) / 2;
        const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);
    
        return [h, sv * 100, v * 100];
    };
    
    convert.hsv.rgb = function (hsv) {
        const h = hsv[0] / 60;
        const s = hsv[1] / 100;
        let v = hsv[2] / 100;
        const hi = Math.floor(h) % 6;
    
        const f = h - Math.floor(h);
        const p = 255 * v * (1 - s);
        const q = 255 * v * (1 - (s * f));
        const t = 255 * v * (1 - (s * (1 - f)));
        v *= 255;
    
        switch (hi) {
            case 0:
                return [v, t, p];
            case 1:
                return [q, v, p];
            case 2:
                return [p, v, t];
            case 3:
                return [p, q, v];
            case 4:
                return [t, p, v];
            case 5:
                return [v, p, q];
        }
    };
    
    convert.hsv.hsl = function (hsv) {
        const h = hsv[0];
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const vmin = Math.max(v, 0.01);
        let sl;
        let l;
    
        l = (2 - s) * v;
        const lmin = (2 - s) * vmin;
        sl = s * vmin;
        sl /= (lmin <= 1) ? lmin : 2 - lmin;
        sl = sl || 0;
        l /= 2;
    
        return [h, sl * 100, l * 100];
    };
    
    // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
    convert.hwb.rgb = function (hwb) {
        const h = hwb[0] / 360;
        let wh = hwb[1] / 100;
        let bl = hwb[2] / 100;
        const ratio = wh + bl;
        let f;
    
        // Wh + bl cant be > 1
        if (ratio > 1) {
            wh /= ratio;
            bl /= ratio;
        }
    
        const i = Math.floor(6 * h);
        const v = 1 - bl;
        f = 6 * h - i;
    
        if ((i & 0x01) !== 0) {
            f = 1 - f;
        }
    
        const n = wh + f * (v - wh); // Linear interpolation
    
        let r;
        let g;
        let b;
        /* eslint-disable max-statements-per-line,no-multi-spaces */
        switch (i) {
            default:
            case 6:
            case 0: r = v;  g = n;  b = wh; break;
            case 1: r = n;  g = v;  b = wh; break;
            case 2: r = wh; g = v;  b = n; break;
            case 3: r = wh; g = n;  b = v; break;
            case 4: r = n;  g = wh; b = v; break;
            case 5: r = v;  g = wh; b = n; break;
        }
        /* eslint-enable max-statements-per-line,no-multi-spaces */
    
        return [r * 255, g * 255, b * 255];
    };
    
    convert.cmyk.rgb = function (cmyk) {
        const c = cmyk[0] / 100;
        const m = cmyk[1] / 100;
        const y = cmyk[2] / 100;
        const k = cmyk[3] / 100;
    
        const r = 1 - Math.min(1, c * (1 - k) + k);
        const g = 1 - Math.min(1, m * (1 - k) + k);
        const b = 1 - Math.min(1, y * (1 - k) + k);
    
        return [r * 255, g * 255, b * 255];
    };
    
    convert.xyz.rgb = function (xyz) {
        const x = xyz[0] / 100;
        const y = xyz[1] / 100;
        const z = xyz[2] / 100;
        let r;
        let g;
        let b;
    
        r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
        g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
        b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);
    
        // Assume sRGB
        r = r > 0.0031308
            ? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
            : r * 12.92;
    
        g = g > 0.0031308
            ? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
            : g * 12.92;
    
        b = b > 0.0031308
            ? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
            : b * 12.92;
    
        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);
    
        return [r * 255, g * 255, b * 255];
    };
    
    convert.xyz.lab = function (xyz) {
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
    
        x /= 95.047;
        y /= 100;
        z /= 108.883;
    
        x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);
    
        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
    
        return [l, a, b];
    };
    
    convert.lab.xyz = function (lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let x;
        let y;
        let z;
    
        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;
    
        const y2 = y ** 3;
        const x2 = x ** 3;
        const z2 = z ** 3;
        y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
    
        x *= 95.047;
        y *= 100;
        z *= 108.883;
    
        return [x, y, z];
    };
    
    convert.lab.lch = function (lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let h;
    
        const hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;
    
        if (h < 0) {
            h += 360;
        }
    
        const c = Math.sqrt(a * a + b * b);
    
        return [l, c, h];
    };
    
    convert.lch.lab = function (lch) {
        const l = lch[0];
        const c = lch[1];
        const h = lch[2];
    
        const hr = h / 360 * 2 * Math.PI;
        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);
    
        return [l, a, b];
    };
    
    convert.rgb.ansi16 = function (args, saturation = null) {
        const [r, g, b] = args;
        let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization
    
        value = Math.round(value / 50);
    
        if (value === 0) {
            return 30;
        }
    
        let ansi = 30
            + ((Math.round(b / 255) << 2)
            | (Math.round(g / 255) << 1)
            | Math.round(r / 255));
    
        if (value === 2) {
            ansi += 60;
        }
    
        return ansi;
    };
    
    convert.hsv.ansi16 = function (args) {
        // Optimization here; we already know the value and don't need to get
        // it converted for us.
        return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    
    convert.rgb.ansi256 = function (args) {
        const r = args[0];
        const g = args[1];
        const b = args[2];
    
        // We use the extended greyscale palette here, with the exception of
        // black and white. normal palette only has 4 greyscale shades.
        if (r === g && g === b) {
            if (r < 8) {
                return 16;
            }
    
            if (r > 248) {
                return 231;
            }
    
            return Math.round(((r - 8) / 247) * 24) + 232;
        }
    
        const ansi = 16
            + (36 * Math.round(r / 255 * 5))
            + (6 * Math.round(g / 255 * 5))
            + Math.round(b / 255 * 5);
    
        return ansi;
    };
    
    convert.ansi16.rgb = function (args) {
        let color = args % 10;
    
        // Handle greyscale
        if (color === 0 || color === 7) {
            if (args > 50) {
                color += 3.5;
            }
    
            color = color / 10.5 * 255;
    
            return [color, color, color];
        }
    
        const mult = (~~(args > 50) + 1) * 0.5;
        const r = ((color & 1) * mult) * 255;
        const g = (((color >> 1) & 1) * mult) * 255;
        const b = (((color >> 2) & 1) * mult) * 255;
    
        return [r, g, b];
    };
    
    convert.ansi256.rgb = function (args) {
        // Handle greyscale
        if (args >= 232) {
            const c = (args - 232) * 10 + 8;
            return [c, c, c];
        }
    
        args -= 16;
    
        let rem;
        const r = Math.floor(args / 36) / 5 * 255;
        const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
        const b = (rem % 6) / 5 * 255;
    
        return [r, g, b];
    };
    
    convert.rgb.hex = function (args) {
        const integer = ((Math.round(args[0]) & 0xFF) << 16)
            + ((Math.round(args[1]) & 0xFF) << 8)
            + (Math.round(args[2]) & 0xFF);
    
        const string = integer.toString(16).toUpperCase();
        return '000000'.substring(string.length) + string;
    };
    
    convert.hex.rgb = function (args) {
        const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!match) {
            return [0, 0, 0];
        }
    
        let colorString = match[0];
    
        if (match[0].length === 3) {
            colorString = colorString.split('').map(char => {
                return char + char;
            }).join('');
        }
    
        const integer = parseInt(colorString, 16);
        const r = (integer >> 16) & 0xFF;
        const g = (integer >> 8) & 0xFF;
        const b = integer & 0xFF;
    
        return [r, g, b];
    };
    
    convert.rgb.hcg = function (rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const max = Math.max(Math.max(r, g), b);
        const min = Math.min(Math.min(r, g), b);
        const chroma = (max - min);
        let grayscale;
        let hue;
    
        if (chroma < 1) {
            grayscale = min / (1 - chroma);
        } else {
            grayscale = 0;
        }
    
        if (chroma <= 0) {
            hue = 0;
        } else
        if (max === r) {
            hue = ((g - b) / chroma) % 6;
        } else
        if (max === g) {
            hue = 2 + (b - r) / chroma;
        } else {
            hue = 4 + (r - g) / chroma;
        }
    
        hue /= 6;
        hue %= 1;
    
        return [hue * 360, chroma * 100, grayscale * 100];
    };
    
    convert.hsl.hcg = function (hsl) {
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
    
        const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));
    
        let f = 0;
        if (c < 1.0) {
            f = (l - 0.5 * c) / (1.0 - c);
        }
    
        return [hsl[0], c * 100, f * 100];
    };
    
    convert.hsv.hcg = function (hsv) {
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
    
        const c = s * v;
        let f = 0;
    
        if (c < 1.0) {
            f = (v - c) / (1 - c);
        }
    
        return [hsv[0], c * 100, f * 100];
    };
    
    convert.hcg.rgb = function (hcg) {
        const h = hcg[0] / 360;
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
    
        if (c === 0.0) {
            return [g * 255, g * 255, g * 255];
        }
    
        const pure = [0, 0, 0];
        const hi = (h % 1) * 6;
        const v = hi % 1;
        const w = 1 - v;
        let mg = 0;
    
        /* eslint-disable max-statements-per-line */
        switch (Math.floor(hi)) {
            case 0:
                pure[0] = 1; pure[1] = v; pure[2] = 0; break;
            case 1:
                pure[0] = w; pure[1] = 1; pure[2] = 0; break;
            case 2:
                pure[0] = 0; pure[1] = 1; pure[2] = v; break;
            case 3:
                pure[0] = 0; pure[1] = w; pure[2] = 1; break;
            case 4:
                pure[0] = v; pure[1] = 0; pure[2] = 1; break;
            default:
                pure[0] = 1; pure[1] = 0; pure[2] = w;
        }
        /* eslint-enable max-statements-per-line */
    
        mg = (1.0 - c) * g;
    
        return [
            (c * pure[0] + mg) * 255,
            (c * pure[1] + mg) * 255,
            (c * pure[2] + mg) * 255
        ];
    };
    
    convert.hcg.hsv = function (hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
    
        const v = c + g * (1.0 - c);
        let f = 0;
    
        if (v > 0.0) {
            f = c / v;
        }
    
        return [hcg[0], f * 100, v * 100];
    };
    
    convert.hcg.hsl = function (hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
    
        const l = g * (1.0 - c) + 0.5 * c;
        let s = 0;
    
        if (l > 0.0 && l < 0.5) {
            s = c / (2 * l);
        } else
        if (l >= 0.5 && l < 1.0) {
            s = c / (2 * (1 - l));
        }
    
        return [hcg[0], s * 100, l * 100];
    };
    
    convert.hcg.hwb = function (hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const v = c + g * (1.0 - c);
        return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    
    convert.hwb.hcg = function (hwb) {
        const w = hwb[1] / 100;
        const b = hwb[2] / 100;
        const v = 1 - b;
        const c = v - w;
        let g = 0;
    
        if (c < 1) {
            g = (v - c) / (1 - c);
        }
    
        return [hwb[0], c * 100, g * 100];
    };
    
    convert.apple.rgb = function (apple) {
        return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
    };
    
    convert.rgb.apple = function (rgb) {
        return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
    };
    
    convert.gray.rgb = function (args) {
        return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    
    convert.gray.hsl = function (args) {
        return [0, 0, args[0]];
    };
    
    convert.gray.hsv = convert.gray.hsl;
    
    convert.gray.hwb = function (gray) {
        return [0, 100, gray[0]];
    };
    
    convert.gray.cmyk = function (gray) {
        return [0, 0, 0, gray[0]];
    };
    
    convert.gray.lab = function (gray) {
        return [gray[0], 0, 0];
    };
    
    convert.gray.hex = function (gray) {
        const val = Math.round(gray[0] / 100 * 255) & 0xFF;
        const integer = (val << 16) + (val << 8) + val;
    
        const string = integer.toString(16).toUpperCase();
        return '000000'.substring(string.length) + string;
    };
    
    convert.rgb.gray = function (rgb) {
        const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return [val / 255 * 100];
    };
    
    },{"color-name":83}],81:[function(require,module,exports){
    const conversions = require('./conversions');
    const route = require('./route');
    
    const convert = {};
    
    const models = Object.keys(conversions);
    
    function wrapRaw(fn) {
        const wrappedFn = function (...args) {
            const arg0 = args[0];
            if (arg0 === undefined || arg0 === null) {
                return arg0;
            }
    
            if (arg0.length > 1) {
                args = arg0;
            }
    
            return fn(args);
        };
    
        // Preserve .conversion property if there is one
        if ('conversion' in fn) {
            wrappedFn.conversion = fn.conversion;
        }
    
        return wrappedFn;
    }
    
    function wrapRounded(fn) {
        const wrappedFn = function (...args) {
            const arg0 = args[0];
    
            if (arg0 === undefined || arg0 === null) {
                return arg0;
            }
    
            if (arg0.length > 1) {
                args = arg0;
            }
    
            const result = fn(args);
    
            // We're assuming the result is an array here.
            // see notice in conversions.js; don't use box types
            // in conversion functions.
            if (typeof result === 'object') {
                for (let len = result.length, i = 0; i < len; i++) {
                    result[i] = Math.round(result[i]);
                }
            }
    
            return result;
        };
    
        // Preserve .conversion property if there is one
        if ('conversion' in fn) {
            wrappedFn.conversion = fn.conversion;
        }
    
        return wrappedFn;
    }
    
    models.forEach(fromModel => {
        convert[fromModel] = {};
    
        Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
        Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});
    
        const routes = route(fromModel);
        const routeModels = Object.keys(routes);
    
        routeModels.forEach(toModel => {
            const fn = routes[toModel];
    
            convert[fromModel][toModel] = wrapRounded(fn);
            convert[fromModel][toModel].raw = wrapRaw(fn);
        });
    });
    
    module.exports = convert;
    
    },{"./conversions":80,"./route":82}],82:[function(require,module,exports){
    const conversions = require('./conversions');
    
    /*
        This function routes a model to all other models.
    
        all functions that are routed have a property `.conversion` attached
        to the returned synthetic function. This property is an array
        of strings, each with the steps in between the 'from' and 'to'
        color models (inclusive).
    
        conversions that are not possible simply are not included.
    */
    
    function buildGraph() {
        const graph = {};
        // https://jsperf.com/object-keys-vs-for-in-with-closure/3
        const models = Object.keys(conversions);
    
        for (let len = models.length, i = 0; i < len; i++) {
            graph[models[i]] = {
                // http://jsperf.com/1-vs-infinity
                // micro-opt, but this is simple.
                distance: -1,
                parent: null
            };
        }
    
        return graph;
    }
    
    // https://en.wikipedia.org/wiki/Breadth-first_search
    function deriveBFS(fromModel) {
        const graph = buildGraph();
        const queue = [fromModel]; // Unshift -> queue -> pop
    
        graph[fromModel].distance = 0;
    
        while (queue.length) {
            const current = queue.pop();
            const adjacents = Object.keys(conversions[current]);
    
            for (let len = adjacents.length, i = 0; i < len; i++) {
                const adjacent = adjacents[i];
                const node = graph[adjacent];
    
                if (node.distance === -1) {
                    node.distance = graph[current].distance + 1;
                    node.parent = current;
                    queue.unshift(adjacent);
                }
            }
        }
    
        return graph;
    }
    
    function link(from, to) {
        return function (args) {
            return to(from(args));
        };
    }
    
    function wrapConversion(toModel, graph) {
        const path = [graph[toModel].parent, toModel];
        let fn = conversions[graph[toModel].parent][toModel];
    
        let cur = graph[toModel].parent;
        while (graph[cur].parent) {
            path.unshift(graph[cur].parent);
            fn = link(conversions[graph[cur].parent][cur], fn);
            cur = graph[cur].parent;
        }
    
        fn.conversion = path;
        return fn;
    }
    
    module.exports = function (fromModel) {
        const graph = deriveBFS(fromModel);
        const conversion = {};
    
        const models = Object.keys(graph);
        for (let len = models.length, i = 0; i < len; i++) {
            const toModel = models[i];
            const node = graph[toModel];
    
            if (node.parent === null) {
                // No possible conversion, or this node is the source model.
                continue;
            }
    
            conversion[toModel] = wrapConversion(toModel, graph);
        }
    
        return conversion;
    };
    
    
    },{"./conversions":80}],83:[function(require,module,exports){
    'use strict'
    
    module.exports = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 219],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [219, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "rebeccapurple": [102, 51, 153],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50]
    };
    
    },{}],84:[function(require,module,exports){
    arguments[4][12][0].apply(exports,arguments)
    },{"dup":12}],85:[function(require,module,exports){
    arguments[4][13][0].apply(exports,arguments)
    },{"dup":13,"emoji-regex":39,"is-fullwidth-code-point":84,"strip-ansi":86}],86:[function(require,module,exports){
    arguments[4][14][0].apply(exports,arguments)
    },{"ansi-regex":78,"dup":14}],87:[function(require,module,exports){
    'use strict';
    
    var fs = require('fs');
    var util = require('util');
    var path = require('path');
    
    let shim;
    class Y18N {
        constructor(opts) {
            // configurable options.
            opts = opts || {};
            this.directory = opts.directory || './locales';
            this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true;
            this.locale = opts.locale || 'en';
            this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true;
            // internal stuff.
            this.cache = Object.create(null);
            this.writeQueue = [];
        }
        __(...args) {
            if (typeof arguments[0] !== 'string') {
                return this._taggedLiteral(arguments[0], ...arguments);
            }
            const str = args.shift();
            let cb = function () { }; // start with noop.
            if (typeof args[args.length - 1] === 'function')
                cb = args.pop();
            cb = cb || function () { }; // noop.
            if (!this.cache[this.locale])
                this._readLocaleFile();
            // we've observed a new string, update the language file.
            if (!this.cache[this.locale][str] && this.updateFiles) {
                this.cache[this.locale][str] = str;
                // include the current directory and locale,
                // since these values could change before the
                // write is performed.
                this._enqueueWrite({
                    directory: this.directory,
                    locale: this.locale,
                    cb
                });
            }
            else {
                cb();
            }
            return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
        }
        __n() {
            const args = Array.prototype.slice.call(arguments);
            const singular = args.shift();
            const plural = args.shift();
            const quantity = args.shift();
            let cb = function () { }; // start with noop.
            if (typeof args[args.length - 1] === 'function')
                cb = args.pop();
            if (!this.cache[this.locale])
                this._readLocaleFile();
            let str = quantity === 1 ? singular : plural;
            if (this.cache[this.locale][singular]) {
                const entry = this.cache[this.locale][singular];
                str = entry[quantity === 1 ? 'one' : 'other'];
            }
            // we've observed a new string, update the language file.
            if (!this.cache[this.locale][singular] && this.updateFiles) {
                this.cache[this.locale][singular] = {
                    one: singular,
                    other: plural
                };
                // include the current directory and locale,
                // since these values could change before the
                // write is performed.
                this._enqueueWrite({
                    directory: this.directory,
                    locale: this.locale,
                    cb
                });
            }
            else {
                cb();
            }
            // if a %d placeholder is provided, add quantity
            // to the arguments expanded by util.format.
            var values = [str];
            if (~str.indexOf('%d'))
                values.push(quantity);
            return shim.format.apply(shim.format, values.concat(args));
        }
        setLocale(locale) {
            this.locale = locale;
        }
        getLocale() {
            return this.locale;
        }
        updateLocale(obj) {
            if (!this.cache[this.locale])
                this._readLocaleFile();
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    this.cache[this.locale][key] = obj[key];
                }
            }
        }
        _taggedLiteral(parts, ...args) {
            let str = '';
            parts.forEach(function (part, i) {
                var arg = args[i + 1];
                str += part;
                if (typeof arg !== 'undefined') {
                    str += '%s';
                }
            });
            return this.__.apply(this, [str].concat([].slice.call(args, 1)));
        }
        _enqueueWrite(work) {
            this.writeQueue.push(work);
            if (this.writeQueue.length === 1)
                this._processWriteQueue();
        }
        _processWriteQueue() {
            var _this = this;
            var work = this.writeQueue[0];
            // destructure the enqueued work.
            var directory = work.directory;
            var locale = work.locale;
            var cb = work.cb;
            var languageFile = this._resolveLocaleFile(directory, locale);
            var serializedLocale = JSON.stringify(this.cache[locale], null, 2);
            shim.fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
                _this.writeQueue.shift();
                if (_this.writeQueue.length > 0)
                    _this._processWriteQueue();
                cb(err);
            });
        }
        _readLocaleFile() {
            var localeLookup = {};
            var languageFile = this._resolveLocaleFile(this.directory, this.locale);
            try {
                localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, 'utf-8'));
            }
            catch (err) {
                if (err instanceof SyntaxError) {
                    err.message = 'syntax error in ' + languageFile;
                }
                if (err.code === 'ENOENT')
                    localeLookup = {};
                else
                    throw err;
            }
            this.cache[this.locale] = localeLookup;
        }
        _resolveLocaleFile(directory, locale) {
            var file = shim.resolve(directory, './', locale + '.json');
            if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
                // attempt fallback to language only
                var languageFile = shim.resolve(directory, './', locale.split('_')[0] + '.json');
                if (this._fileExistsSync(languageFile))
                    file = languageFile;
            }
            return file;
        }
        _fileExistsSync(file) {
            return shim.exists(file);
        }
    }
    function y18n(opts, _shim) {
        shim = _shim;
        const y18n = new Y18N(opts);
        return {
            __: y18n.__.bind(y18n),
            __n: y18n.__n.bind(y18n),
            setLocale: y18n.setLocale.bind(y18n),
            getLocale: y18n.getLocale.bind(y18n),
            updateLocale: y18n.updateLocale.bind(y18n),
            locale: y18n.locale
        };
    }
    
    var nodePlatformShim = {
        fs: {
            readFileSync: fs.readFileSync,
            writeFile: fs.writeFile
        },
        format: util.format,
        resolve: path.resolve,
        exists: (file) => {
            try {
                return fs.statSync(file).isFile();
            }
            catch (err) {
                return false;
            }
        }
    };
    
    const y18n$1 = (opts) => {
        return y18n(opts, nodePlatformShim);
    };
    
    module.exports = y18n$1;
    
    },{"fs":7,"path":59,"util":75}],88:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Dumper, Inline, Utils;
    
    Utils = require('./Utils');
    
    Inline = require('./Inline');
    
    Dumper = (function() {
      function Dumper() {}
    
      Dumper.indentation = 4;
    
      Dumper.prototype.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        var i, key, len, output, prefix, value, willBeInlined;
        if (inline == null) {
          inline = 0;
        }
        if (indent == null) {
          indent = 0;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        output = '';
        prefix = (indent ? Utils.strRepeat(' ', indent) : '');
        if (inline <= 0 || typeof input !== 'object' || input instanceof Date || Utils.isEmpty(input)) {
          output += prefix + Inline.dump(input, exceptionOnInvalidType, objectEncoder);
        } else {
          if (input instanceof Array) {
            for (i = 0, len = input.length; i < len; i++) {
              value = input[i];
              willBeInlined = inline - 1 <= 0 || typeof value !== 'object' || Utils.isEmpty(value);
              output += prefix + '-' + (willBeInlined ? ' ' : "\n") + this.dump(value, inline - 1, (willBeInlined ? 0 : indent + this.indentation), exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : '');
            }
          } else {
            for (key in input) {
              value = input[key];
              willBeInlined = inline - 1 <= 0 || typeof value !== 'object' || Utils.isEmpty(value);
              output += prefix + Inline.dump(key, exceptionOnInvalidType, objectEncoder) + ':' + (willBeInlined ? ' ' : "\n") + this.dump(value, inline - 1, (willBeInlined ? 0 : indent + this.indentation), exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : '');
            }
          }
        }
        return output;
      };
    
      return Dumper;
    
    })();
    
    module.exports = Dumper;
    
    },{"./Inline":93,"./Utils":97}],89:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Escaper, Pattern;
    
    Pattern = require('./Pattern');
    
    Escaper = (function() {
      var ch;
    
      function Escaper() {}
    
      Escaper.LIST_ESCAPEES = ['\\', '\\\\', '\\"', '"', "\x00", "\x01", "\x02", "\x03", "\x04", "\x05", "\x06", "\x07", "\x08", "\x09", "\x0a", "\x0b", "\x0c", "\x0d", "\x0e", "\x0f", "\x10", "\x11", "\x12", "\x13", "\x14", "\x15", "\x16", "\x17", "\x18", "\x19", "\x1a", "\x1b", "\x1c", "\x1d", "\x1e", "\x1f", (ch = String.fromCharCode)(0x0085), ch(0x00A0), ch(0x2028), ch(0x2029)];
    
      Escaper.LIST_ESCAPED = ['\\\\', '\\"', '\\"', '\\"', "\\0", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\a", "\\b", "\\t", "\\n", "\\v", "\\f", "\\r", "\\x0e", "\\x0f", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1a", "\\e", "\\x1c", "\\x1d", "\\x1e", "\\x1f", "\\N", "\\_", "\\L", "\\P"];
    
      Escaper.MAPPING_ESCAPEES_TO_ESCAPED = (function() {
        var i, j, mapping, ref;
        mapping = {};
        for (i = j = 0, ref = Escaper.LIST_ESCAPEES.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          mapping[Escaper.LIST_ESCAPEES[i]] = Escaper.LIST_ESCAPED[i];
        }
        return mapping;
      })();
    
      Escaper.PATTERN_CHARACTERS_TO_ESCAPE = new Pattern('[\\x00-\\x1f]|\xc2\x85|\xc2\xa0|\xe2\x80\xa8|\xe2\x80\xa9');
    
      Escaper.PATTERN_MAPPING_ESCAPEES = new Pattern(Escaper.LIST_ESCAPEES.join('|').split('\\').join('\\\\'));
    
      Escaper.PATTERN_SINGLE_QUOTING = new Pattern('[\\s\'":{}[\\],&*#?]|^[-?|<>=!%@`]');
    
      Escaper.requiresDoubleQuoting = function(value) {
        return this.PATTERN_CHARACTERS_TO_ESCAPE.test(value);
      };
    
      Escaper.escapeWithDoubleQuotes = function(value) {
        var result;
        result = this.PATTERN_MAPPING_ESCAPEES.replace(value, (function(_this) {
          return function(str) {
            return _this.MAPPING_ESCAPEES_TO_ESCAPED[str];
          };
        })(this));
        return '"' + result + '"';
      };
    
      Escaper.requiresSingleQuoting = function(value) {
        return this.PATTERN_SINGLE_QUOTING.test(value);
      };
    
      Escaper.escapeWithSingleQuotes = function(value) {
        return "'" + value.replace(/'/g, "''") + "'";
      };
    
      return Escaper;
    
    })();
    
    module.exports = Escaper;
    
    },{"./Pattern":95}],90:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var DumpException,
      extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
      hasProp = {}.hasOwnProperty;
    
    DumpException = (function(superClass) {
      extend(DumpException, superClass);
    
      function DumpException(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
    
      DumpException.prototype.toString = function() {
        if ((this.parsedLine != null) && (this.snippet != null)) {
          return '<DumpException> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
        } else {
          return '<DumpException> ' + this.message;
        }
      };
    
      return DumpException;
    
    })(Error);
    
    module.exports = DumpException;
    
    },{}],91:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var ParseException,
      extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
      hasProp = {}.hasOwnProperty;
    
    ParseException = (function(superClass) {
      extend(ParseException, superClass);
    
      function ParseException(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
    
      ParseException.prototype.toString = function() {
        if ((this.parsedLine != null) && (this.snippet != null)) {
          return '<ParseException> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
        } else {
          return '<ParseException> ' + this.message;
        }
      };
    
      return ParseException;
    
    })(Error);
    
    module.exports = ParseException;
    
    },{}],92:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var ParseMore,
      extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
      hasProp = {}.hasOwnProperty;
    
    ParseMore = (function(superClass) {
      extend(ParseMore, superClass);
    
      function ParseMore(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
    
      ParseMore.prototype.toString = function() {
        if ((this.parsedLine != null) && (this.snippet != null)) {
          return '<ParseMore> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
        } else {
          return '<ParseMore> ' + this.message;
        }
      };
    
      return ParseMore;
    
    })(Error);
    
    module.exports = ParseMore;
    
    },{}],93:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var DumpException, Escaper, Inline, ParseException, ParseMore, Pattern, Unescaper, Utils,
      indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
    
    Pattern = require('./Pattern');
    
    Unescaper = require('./Unescaper');
    
    Escaper = require('./Escaper');
    
    Utils = require('./Utils');
    
    ParseException = require('./Exception/ParseException');
    
    ParseMore = require('./Exception/ParseMore');
    
    DumpException = require('./Exception/DumpException');
    
    Inline = (function() {
      function Inline() {}
    
      Inline.REGEX_QUOTED_STRING = '(?:"(?:[^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\'(?:[^\']*(?:\'\'[^\']*)*)\')';
    
      Inline.PATTERN_TRAILING_COMMENTS = new Pattern('^\\s*#.*$');
    
      Inline.PATTERN_QUOTED_SCALAR = new Pattern('^' + Inline.REGEX_QUOTED_STRING);
    
      Inline.PATTERN_THOUSAND_NUMERIC_SCALAR = new Pattern('^(-|\\+)?[0-9,]+(\\.[0-9]+)?$');
    
      Inline.PATTERN_SCALAR_BY_DELIMITERS = {};
    
      Inline.settings = {};
    
      Inline.configure = function(exceptionOnInvalidType, objectDecoder) {
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = null;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
        this.settings.objectDecoder = objectDecoder;
      };
    
      Inline.parse = function(value, exceptionOnInvalidType, objectDecoder) {
        var context, result;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
        this.settings.objectDecoder = objectDecoder;
        if (value == null) {
          return '';
        }
        value = Utils.trim(value);
        if (0 === value.length) {
          return '';
        }
        context = {
          exceptionOnInvalidType: exceptionOnInvalidType,
          objectDecoder: objectDecoder,
          i: 0
        };
        switch (value.charAt(0)) {
          case '[':
            result = this.parseSequence(value, context);
            ++context.i;
            break;
          case '{':
            result = this.parseMapping(value, context);
            ++context.i;
            break;
          default:
            result = this.parseScalar(value, null, ['"', "'"], context);
        }
        if (this.PATTERN_TRAILING_COMMENTS.replace(value.slice(context.i), '') !== '') {
          throw new ParseException('Unexpected characters near "' + value.slice(context.i) + '".');
        }
        return result;
      };
    
      Inline.dump = function(value, exceptionOnInvalidType, objectEncoder) {
        var ref, result, type;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        if (value == null) {
          return 'null';
        }
        type = typeof value;
        if (type === 'object') {
          if (value instanceof Date) {
            return value.toISOString();
          } else if (objectEncoder != null) {
            result = objectEncoder(value);
            if (typeof result === 'string' || (result != null)) {
              return result;
            }
          }
          return this.dumpObject(value);
        }
        if (type === 'boolean') {
          return (value ? 'true' : 'false');
        }
        if (Utils.isDigits(value)) {
          return (type === 'string' ? "'" + value + "'" : String(parseInt(value)));
        }
        if (Utils.isNumeric(value)) {
          return (type === 'string' ? "'" + value + "'" : String(parseFloat(value)));
        }
        if (type === 'number') {
          return (value === 2e308 ? '.Inf' : (value === -2e308 ? '-.Inf' : (isNaN(value) ? '.NaN' : value)));
        }
        if (Escaper.requiresDoubleQuoting(value)) {
          return Escaper.escapeWithDoubleQuotes(value);
        }
        if (Escaper.requiresSingleQuoting(value)) {
          return Escaper.escapeWithSingleQuotes(value);
        }
        if ('' === value) {
          return '""';
        }
        if (Utils.PATTERN_DATE.test(value)) {
          return "'" + value + "'";
        }
        if ((ref = value.toLowerCase()) === 'null' || ref === '~' || ref === 'true' || ref === 'false') {
          return "'" + value + "'";
        }
        return value;
      };
    
      Inline.dumpObject = function(value, exceptionOnInvalidType, objectSupport) {
        var j, key, len1, output, val;
        if (objectSupport == null) {
          objectSupport = null;
        }
        if (value instanceof Array) {
          output = [];
          for (j = 0, len1 = value.length; j < len1; j++) {
            val = value[j];
            output.push(this.dump(val));
          }
          return '[' + output.join(', ') + ']';
        } else {
          output = [];
          for (key in value) {
            val = value[key];
            output.push(this.dump(key) + ': ' + this.dump(val));
          }
          return '{' + output.join(', ') + '}';
        }
      };
    
      Inline.parseScalar = function(scalar, delimiters, stringDelimiters, context, evaluate) {
        var i, joinedDelimiters, match, output, pattern, ref, ref1, strpos, tmp;
        if (delimiters == null) {
          delimiters = null;
        }
        if (stringDelimiters == null) {
          stringDelimiters = ['"', "'"];
        }
        if (context == null) {
          context = null;
        }
        if (evaluate == null) {
          evaluate = true;
        }
        if (context == null) {
          context = {
            exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
            objectDecoder: this.settings.objectDecoder,
            i: 0
          };
        }
        i = context.i;
        if (ref = scalar.charAt(i), indexOf.call(stringDelimiters, ref) >= 0) {
          output = this.parseQuotedScalar(scalar, context);
          i = context.i;
          if (delimiters != null) {
            tmp = Utils.ltrim(scalar.slice(i), ' ');
            if (!(ref1 = tmp.charAt(0), indexOf.call(delimiters, ref1) >= 0)) {
              throw new ParseException('Unexpected characters (' + scalar.slice(i) + ').');
            }
          }
        } else {
          if (!delimiters) {
            output = scalar.slice(i);
            i += output.length;
            strpos = output.indexOf(' #');
            if (strpos !== -1) {
              output = Utils.rtrim(output.slice(0, strpos));
            }
          } else {
            joinedDelimiters = delimiters.join('|');
            pattern = this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters];
            if (pattern == null) {
              pattern = new Pattern('^(.+?)(' + joinedDelimiters + ')');
              this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters] = pattern;
            }
            if (match = pattern.exec(scalar.slice(i))) {
              output = match[1];
              i += output.length;
            } else {
              throw new ParseException('Malformed inline YAML string (' + scalar + ').');
            }
          }
          if (evaluate) {
            output = this.evaluateScalar(output, context);
          }
        }
        context.i = i;
        return output;
      };
    
      Inline.parseQuotedScalar = function(scalar, context) {
        var i, match, output;
        i = context.i;
        if (!(match = this.PATTERN_QUOTED_SCALAR.exec(scalar.slice(i)))) {
          throw new ParseMore('Malformed inline YAML string (' + scalar.slice(i) + ').');
        }
        output = match[0].substr(1, match[0].length - 2);
        if ('"' === scalar.charAt(i)) {
          output = Unescaper.unescapeDoubleQuotedString(output);
        } else {
          output = Unescaper.unescapeSingleQuotedString(output);
        }
        i += match[0].length;
        context.i = i;
        return output;
      };
    
      Inline.parseSequence = function(sequence, context) {
        var e, i, isQuoted, len, output, ref, value;
        output = [];
        len = sequence.length;
        i = context.i;
        i += 1;
        while (i < len) {
          context.i = i;
          switch (sequence.charAt(i)) {
            case '[':
              output.push(this.parseSequence(sequence, context));
              i = context.i;
              break;
            case '{':
              output.push(this.parseMapping(sequence, context));
              i = context.i;
              break;
            case ']':
              return output;
            case ',':
            case ' ':
            case "\n":
              break;
            default:
              isQuoted = ((ref = sequence.charAt(i)) === '"' || ref === "'");
              value = this.parseScalar(sequence, [',', ']'], ['"', "'"], context);
              i = context.i;
              if (!isQuoted && typeof value === 'string' && (value.indexOf(': ') !== -1 || value.indexOf(":\n") !== -1)) {
                try {
                  value = this.parseMapping('{' + value + '}');
                } catch (error) {
                  e = error;
                }
              }
              output.push(value);
              --i;
          }
          ++i;
        }
        throw new ParseMore('Malformed inline YAML string ' + sequence);
      };
    
      Inline.parseMapping = function(mapping, context) {
        var done, i, key, len, output, shouldContinueWhileLoop, value;
        output = {};
        len = mapping.length;
        i = context.i;
        i += 1;
        shouldContinueWhileLoop = false;
        while (i < len) {
          context.i = i;
          switch (mapping.charAt(i)) {
            case ' ':
            case ',':
            case "\n":
              ++i;
              context.i = i;
              shouldContinueWhileLoop = true;
              break;
            case '}':
              return output;
          }
          if (shouldContinueWhileLoop) {
            shouldContinueWhileLoop = false;
            continue;
          }
          key = this.parseScalar(mapping, [':', ' ', "\n"], ['"', "'"], context, false);
          i = context.i;
          done = false;
          while (i < len) {
            context.i = i;
            switch (mapping.charAt(i)) {
              case '[':
                value = this.parseSequence(mapping, context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                break;
              case '{':
                value = this.parseMapping(mapping, context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                break;
              case ':':
              case ' ':
              case "\n":
                break;
              default:
                value = this.parseScalar(mapping, [',', '}'], ['"', "'"], context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                --i;
            }
            ++i;
            if (done) {
              break;
            }
          }
        }
        throw new ParseMore('Malformed inline YAML string ' + mapping);
      };
    
      Inline.evaluateScalar = function(scalar, context) {
        var cast, date, exceptionOnInvalidType, firstChar, firstSpace, firstWord, objectDecoder, raw, scalarLower, subValue, trimmedScalar;
        scalar = Utils.trim(scalar);
        scalarLower = scalar.toLowerCase();
        switch (scalarLower) {
          case 'null':
          case '':
          case '~':
            return null;
          case 'true':
            return true;
          case 'false':
            return false;
          case '.inf':
            return 2e308;
          case '.nan':
            return 0/0;
          case '-.inf':
            return 2e308;
          default:
            firstChar = scalarLower.charAt(0);
            switch (firstChar) {
              case '!':
                firstSpace = scalar.indexOf(' ');
                if (firstSpace === -1) {
                  firstWord = scalarLower;
                } else {
                  firstWord = scalarLower.slice(0, firstSpace);
                }
                switch (firstWord) {
                  case '!':
                    if (firstSpace !== -1) {
                      return parseInt(this.parseScalar(scalar.slice(2)));
                    }
                    return null;
                  case '!str':
                    return Utils.ltrim(scalar.slice(4));
                  case '!!str':
                    return Utils.ltrim(scalar.slice(5));
                  case '!!int':
                    return parseInt(this.parseScalar(scalar.slice(5)));
                  case '!!bool':
                    return Utils.parseBoolean(this.parseScalar(scalar.slice(6)), false);
                  case '!!float':
                    return parseFloat(this.parseScalar(scalar.slice(7)));
                  case '!!timestamp':
                    return Utils.stringToDate(Utils.ltrim(scalar.slice(11)));
                  default:
                    if (context == null) {
                      context = {
                        exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
                        objectDecoder: this.settings.objectDecoder,
                        i: 0
                      };
                    }
                    objectDecoder = context.objectDecoder, exceptionOnInvalidType = context.exceptionOnInvalidType;
                    if (objectDecoder) {
                      trimmedScalar = Utils.rtrim(scalar);
                      firstSpace = trimmedScalar.indexOf(' ');
                      if (firstSpace === -1) {
                        return objectDecoder(trimmedScalar, null);
                      } else {
                        subValue = Utils.ltrim(trimmedScalar.slice(firstSpace + 1));
                        if (!(subValue.length > 0)) {
                          subValue = null;
                        }
                        return objectDecoder(trimmedScalar.slice(0, firstSpace), subValue);
                      }
                    }
                    if (exceptionOnInvalidType) {
                      throw new ParseException('Custom object support when parsing a YAML file has been disabled.');
                    }
                    return null;
                }
                break;
              case '0':
                if ('0x' === scalar.slice(0, 2)) {
                  return Utils.hexDec(scalar);
                } else if (Utils.isDigits(scalar)) {
                  return Utils.octDec(scalar);
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else {
                  return scalar;
                }
                break;
              case '+':
                if (Utils.isDigits(scalar)) {
                  raw = scalar;
                  cast = parseInt(raw);
                  if (raw === String(cast)) {
                    return cast;
                  } else {
                    return raw;
                  }
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(',', ''));
                }
                return scalar;
              case '-':
                if (Utils.isDigits(scalar.slice(1))) {
                  if ('0' === scalar.charAt(1)) {
                    return -Utils.octDec(scalar.slice(1));
                  } else {
                    raw = scalar.slice(1);
                    cast = parseInt(raw);
                    if (raw === String(cast)) {
                      return -cast;
                    } else {
                      return -raw;
                    }
                  }
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(',', ''));
                }
                return scalar;
              default:
                if (date = Utils.stringToDate(scalar)) {
                  return date;
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(',', ''));
                }
                return scalar;
            }
        }
      };
    
      return Inline;
    
    })();
    
    module.exports = Inline;
    
    },{"./Escaper":89,"./Exception/DumpException":90,"./Exception/ParseException":91,"./Exception/ParseMore":92,"./Pattern":95,"./Unescaper":96,"./Utils":97}],94:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Inline, ParseException, ParseMore, Parser, Pattern, Utils;
    
    Inline = require('./Inline');
    
    Pattern = require('./Pattern');
    
    Utils = require('./Utils');
    
    ParseException = require('./Exception/ParseException');
    
    ParseMore = require('./Exception/ParseMore');
    
    Parser = (function() {
      Parser.prototype.PATTERN_FOLDED_SCALAR_ALL = new Pattern('^(?:(?<type>![^\\|>]*)\\s+)?(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$');
    
      Parser.prototype.PATTERN_FOLDED_SCALAR_END = new Pattern('(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$');
    
      Parser.prototype.PATTERN_SEQUENCE_ITEM = new Pattern('^\\-((?<leadspaces>\\s+)(?<value>.+?))?\\s*$');
    
      Parser.prototype.PATTERN_ANCHOR_VALUE = new Pattern('^&(?<ref>[^ ]+) *(?<value>.*)');
    
      Parser.prototype.PATTERN_COMPACT_NOTATION = new Pattern('^(?<key>' + Inline.REGEX_QUOTED_STRING + '|[^ \'"\\{\\[].*?) *\\:(\\s+(?<value>.+?))?\\s*$');
    
      Parser.prototype.PATTERN_MAPPING_ITEM = new Pattern('^(?<key>' + Inline.REGEX_QUOTED_STRING + '|[^ \'"\\[\\{].*?) *\\:(\\s+(?<value>.+?))?\\s*$');
    
      Parser.prototype.PATTERN_DECIMAL = new Pattern('\\d+');
    
      Parser.prototype.PATTERN_INDENT_SPACES = new Pattern('^ +');
    
      Parser.prototype.PATTERN_TRAILING_LINES = new Pattern('(\n*)$');
    
      Parser.prototype.PATTERN_YAML_HEADER = new Pattern('^\\%YAML[: ][\\d\\.]+.*\n', 'm');
    
      Parser.prototype.PATTERN_LEADING_COMMENTS = new Pattern('^(\\#.*?\n)+', 'm');
    
      Parser.prototype.PATTERN_DOCUMENT_MARKER_START = new Pattern('^\\-\\-\\-.*?\n', 'm');
    
      Parser.prototype.PATTERN_DOCUMENT_MARKER_END = new Pattern('^\\.\\.\\.\\s*$', 'm');
    
      Parser.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION = {};
    
      Parser.prototype.CONTEXT_NONE = 0;
    
      Parser.prototype.CONTEXT_SEQUENCE = 1;
    
      Parser.prototype.CONTEXT_MAPPING = 2;
    
      function Parser(offset) {
        this.offset = offset != null ? offset : 0;
        this.lines = [];
        this.currentLineNb = -1;
        this.currentLine = '';
        this.refs = {};
      }
    
      Parser.prototype.parse = function(value, exceptionOnInvalidType, objectDecoder) {
        var alias, allowOverwrite, block, c, context, data, e, first, i, indent, isRef, j, k, key, l, lastKey, len, len1, len2, len3, lineCount, m, matches, mergeNode, n, name, parsed, parsedItem, parser, ref, ref1, ref2, refName, refValue, val, values;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.currentLineNb = -1;
        this.currentLine = '';
        this.lines = this.cleanup(value).split("\n");
        data = null;
        context = this.CONTEXT_NONE;
        allowOverwrite = false;
        while (this.moveToNextLine()) {
          if (this.isCurrentLineEmpty()) {
            continue;
          }
          if ("\t" === this.currentLine[0]) {
            throw new ParseException('A YAML file cannot contain tabs as indentation.', this.getRealCurrentLineNb() + 1, this.currentLine);
          }
          isRef = mergeNode = false;
          if (values = this.PATTERN_SEQUENCE_ITEM.exec(this.currentLine)) {
            if (this.CONTEXT_MAPPING === context) {
              throw new ParseException('You cannot define a sequence item when in a mapping');
            }
            context = this.CONTEXT_SEQUENCE;
            if (data == null) {
              data = [];
            }
            if ((values.value != null) && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
              isRef = matches.ref;
              values.value = matches.value;
            }
            if (!(values.value != null) || '' === Utils.trim(values.value, ' ') || Utils.ltrim(values.value, ' ').indexOf('#') === 0) {
              if (this.currentLineNb < this.lines.length - 1 && !this.isNextLineUnIndentedCollection()) {
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser(c);
                parser.refs = this.refs;
                data.push(parser.parse(this.getNextEmbedBlock(null, true), exceptionOnInvalidType, objectDecoder));
              } else {
                data.push(null);
              }
            } else {
              if (((ref = values.leadspaces) != null ? ref.length : void 0) && (matches = this.PATTERN_COMPACT_NOTATION.exec(values.value))) {
                c = this.getRealCurrentLineNb();
                parser = new Parser(c);
                parser.refs = this.refs;
                block = values.value;
                indent = this.getCurrentLineIndentation();
                if (this.isNextLineIndented(false)) {
                  block += "\n" + this.getNextEmbedBlock(indent + values.leadspaces.length + 1, true);
                }
                data.push(parser.parse(block, exceptionOnInvalidType, objectDecoder));
              } else {
                data.push(this.parseValue(values.value, exceptionOnInvalidType, objectDecoder));
              }
            }
          } else if ((values = this.PATTERN_MAPPING_ITEM.exec(this.currentLine)) && values.key.indexOf(' #') === -1) {
            if (this.CONTEXT_SEQUENCE === context) {
              throw new ParseException('You cannot define a mapping item when in a sequence');
            }
            context = this.CONTEXT_MAPPING;
            if (data == null) {
              data = {};
            }
            Inline.configure(exceptionOnInvalidType, objectDecoder);
            try {
              key = Inline.parseScalar(values.key);
            } catch (error) {
              e = error;
              e.parsedLine = this.getRealCurrentLineNb() + 1;
              e.snippet = this.currentLine;
              throw e;
            }
            if ('<<' === key) {
              mergeNode = true;
              allowOverwrite = true;
              if (((ref1 = values.value) != null ? ref1.indexOf('*') : void 0) === 0) {
                refName = values.value.slice(1);
                if (this.refs[refName] == null) {
                  throw new ParseException('Reference "' + refName + '" does not exist.', this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                refValue = this.refs[refName];
                if (typeof refValue !== 'object') {
                  throw new ParseException('YAML merge keys used with a scalar value instead of an object.', this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                if (refValue instanceof Array) {
                  for (i = j = 0, len = refValue.length; j < len; i = ++j) {
                    value = refValue[i];
                    if (data[name = String(i)] == null) {
                      data[name] = value;
                    }
                  }
                } else {
                  for (key in refValue) {
                    value = refValue[key];
                    if (data[key] == null) {
                      data[key] = value;
                    }
                  }
                }
              } else {
                if ((values.value != null) && values.value !== '') {
                  value = values.value;
                } else {
                  value = this.getNextEmbedBlock();
                }
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser(c);
                parser.refs = this.refs;
                parsed = parser.parse(value, exceptionOnInvalidType);
                if (typeof parsed !== 'object') {
                  throw new ParseException('YAML merge keys used with a scalar value instead of an object.', this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                if (parsed instanceof Array) {
                  for (l = 0, len1 = parsed.length; l < len1; l++) {
                    parsedItem = parsed[l];
                    if (typeof parsedItem !== 'object') {
                      throw new ParseException('Merge items must be objects.', this.getRealCurrentLineNb() + 1, parsedItem);
                    }
                    if (parsedItem instanceof Array) {
                      for (i = m = 0, len2 = parsedItem.length; m < len2; i = ++m) {
                        value = parsedItem[i];
                        k = String(i);
                        if (!data.hasOwnProperty(k)) {
                          data[k] = value;
                        }
                      }
                    } else {
                      for (key in parsedItem) {
                        value = parsedItem[key];
                        if (!data.hasOwnProperty(key)) {
                          data[key] = value;
                        }
                      }
                    }
                  }
                } else {
                  for (key in parsed) {
                    value = parsed[key];
                    if (!data.hasOwnProperty(key)) {
                      data[key] = value;
                    }
                  }
                }
              }
            } else if ((values.value != null) && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
              isRef = matches.ref;
              values.value = matches.value;
            }
            if (mergeNode) {
    
            } else if (!(values.value != null) || '' === Utils.trim(values.value, ' ') || Utils.ltrim(values.value, ' ').indexOf('#') === 0) {
              if (!(this.isNextLineIndented()) && !(this.isNextLineUnIndentedCollection())) {
                if (allowOverwrite || data[key] === void 0) {
                  data[key] = null;
                }
              } else {
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser(c);
                parser.refs = this.refs;
                val = parser.parse(this.getNextEmbedBlock(), exceptionOnInvalidType, objectDecoder);
                if (allowOverwrite || data[key] === void 0) {
                  data[key] = val;
                }
              }
            } else {
              val = this.parseValue(values.value, exceptionOnInvalidType, objectDecoder);
              if (allowOverwrite || data[key] === void 0) {
                data[key] = val;
              }
            }
          } else {
            lineCount = this.lines.length;
            if (1 === lineCount || (2 === lineCount && Utils.isEmpty(this.lines[1]))) {
              try {
                value = Inline.parse(this.lines[0], exceptionOnInvalidType, objectDecoder);
              } catch (error) {
                e = error;
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
              if (typeof value === 'object') {
                if (value instanceof Array) {
                  first = value[0];
                } else {
                  for (key in value) {
                    first = value[key];
                    break;
                  }
                }
                if (typeof first === 'string' && first.indexOf('*') === 0) {
                  data = [];
                  for (n = 0, len3 = value.length; n < len3; n++) {
                    alias = value[n];
                    data.push(this.refs[alias.slice(1)]);
                  }
                  value = data;
                }
              }
              return value;
            } else if ((ref2 = Utils.ltrim(value).charAt(0)) === '[' || ref2 === '{') {
              try {
                return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
              } catch (error) {
                e = error;
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
            }
            throw new ParseException('Unable to parse.', this.getRealCurrentLineNb() + 1, this.currentLine);
          }
          if (isRef) {
            if (data instanceof Array) {
              this.refs[isRef] = data[data.length - 1];
            } else {
              lastKey = null;
              for (key in data) {
                lastKey = key;
              }
              this.refs[isRef] = data[lastKey];
            }
          }
        }
        if (Utils.isEmpty(data)) {
          return null;
        } else {
          return data;
        }
      };
    
      Parser.prototype.getRealCurrentLineNb = function() {
        return this.currentLineNb + this.offset;
      };
    
      Parser.prototype.getCurrentLineIndentation = function() {
        return this.currentLine.length - Utils.ltrim(this.currentLine, ' ').length;
      };
    
      Parser.prototype.getNextEmbedBlock = function(indentation, includeUnindentedCollection) {
        var data, indent, isItUnindentedCollection, newIndent, removeComments, removeCommentsPattern, unindentedEmbedBlock;
        if (indentation == null) {
          indentation = null;
        }
        if (includeUnindentedCollection == null) {
          includeUnindentedCollection = false;
        }
        this.moveToNextLine();
        if (indentation == null) {
          newIndent = this.getCurrentLineIndentation();
          unindentedEmbedBlock = this.isStringUnIndentedCollectionItem(this.currentLine);
          if (!(this.isCurrentLineEmpty()) && 0 === newIndent && !unindentedEmbedBlock) {
            throw new ParseException('Indentation problem.', this.getRealCurrentLineNb() + 1, this.currentLine);
          }
        } else {
          newIndent = indentation;
        }
        data = [this.currentLine.slice(newIndent)];
        if (!includeUnindentedCollection) {
          isItUnindentedCollection = this.isStringUnIndentedCollectionItem(this.currentLine);
        }
        removeCommentsPattern = this.PATTERN_FOLDED_SCALAR_END;
        removeComments = !removeCommentsPattern.test(this.currentLine);
        while (this.moveToNextLine()) {
          indent = this.getCurrentLineIndentation();
          if (indent === newIndent) {
            removeComments = !removeCommentsPattern.test(this.currentLine);
          }
          if (removeComments && this.isCurrentLineComment()) {
            continue;
          }
          if (this.isCurrentLineBlank()) {
            data.push(this.currentLine.slice(newIndent));
            continue;
          }
          if (isItUnindentedCollection && !this.isStringUnIndentedCollectionItem(this.currentLine) && indent === newIndent) {
            this.moveToPreviousLine();
            break;
          }
          if (indent >= newIndent) {
            data.push(this.currentLine.slice(newIndent));
          } else if (Utils.ltrim(this.currentLine).charAt(0) === '#') {
    
          } else if (0 === indent) {
            this.moveToPreviousLine();
            break;
          } else {
            throw new ParseException('Indentation problem.', this.getRealCurrentLineNb() + 1, this.currentLine);
          }
        }
        return data.join("\n");
      };
    
      Parser.prototype.moveToNextLine = function() {
        if (this.currentLineNb >= this.lines.length - 1) {
          return false;
        }
        this.currentLine = this.lines[++this.currentLineNb];
        return true;
      };
    
      Parser.prototype.moveToPreviousLine = function() {
        this.currentLine = this.lines[--this.currentLineNb];
      };
    
      Parser.prototype.parseValue = function(value, exceptionOnInvalidType, objectDecoder) {
        var e, foldedIndent, matches, modifiers, pos, ref, ref1, val;
        if (0 === value.indexOf('*')) {
          pos = value.indexOf('#');
          if (pos !== -1) {
            value = value.substr(1, pos - 2);
          } else {
            value = value.slice(1);
          }
          if (this.refs[value] === void 0) {
            throw new ParseException('Reference "' + value + '" does not exist.', this.currentLine);
          }
          return this.refs[value];
        }
        if (matches = this.PATTERN_FOLDED_SCALAR_ALL.exec(value)) {
          modifiers = (ref = matches.modifiers) != null ? ref : '';
          foldedIndent = Math.abs(parseInt(modifiers));
          if (isNaN(foldedIndent)) {
            foldedIndent = 0;
          }
          val = this.parseFoldedScalar(matches.separator, this.PATTERN_DECIMAL.replace(modifiers, ''), foldedIndent);
          if (matches.type != null) {
            Inline.configure(exceptionOnInvalidType, objectDecoder);
            return Inline.parseScalar(matches.type + ' ' + val);
          } else {
            return val;
          }
        }
        if ((ref1 = value.charAt(0)) === '[' || ref1 === '{' || ref1 === '"' || ref1 === "'") {
          while (true) {
            try {
              return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
            } catch (error) {
              e = error;
              if (e instanceof ParseMore && this.moveToNextLine()) {
                value += "\n" + Utils.trim(this.currentLine, ' ');
              } else {
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
            }
          }
        } else {
          if (this.isNextLineIndented()) {
            value += "\n" + this.getNextEmbedBlock();
          }
          return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
        }
      };
    
      Parser.prototype.parseFoldedScalar = function(separator, indicator, indentation) {
        var isCurrentLineBlank, j, len, line, matches, newText, notEOF, pattern, ref, text;
        if (indicator == null) {
          indicator = '';
        }
        if (indentation == null) {
          indentation = 0;
        }
        notEOF = this.moveToNextLine();
        if (!notEOF) {
          return '';
        }
        isCurrentLineBlank = this.isCurrentLineBlank();
        text = '';
        while (notEOF && isCurrentLineBlank) {
          if (notEOF = this.moveToNextLine()) {
            text += "\n";
            isCurrentLineBlank = this.isCurrentLineBlank();
          }
        }
        if (0 === indentation) {
          if (matches = this.PATTERN_INDENT_SPACES.exec(this.currentLine)) {
            indentation = matches[0].length;
          }
        }
        if (indentation > 0) {
          pattern = this.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation];
          if (pattern == null) {
            pattern = new Pattern('^ {' + indentation + '}(.*)$');
            Parser.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation] = pattern;
          }
          while (notEOF && (isCurrentLineBlank || (matches = pattern.exec(this.currentLine)))) {
            if (isCurrentLineBlank) {
              text += this.currentLine.slice(indentation);
            } else {
              text += matches[1];
            }
            if (notEOF = this.moveToNextLine()) {
              text += "\n";
              isCurrentLineBlank = this.isCurrentLineBlank();
            }
          }
        } else if (notEOF) {
          text += "\n";
        }
        if (notEOF) {
          this.moveToPreviousLine();
        }
        if ('>' === separator) {
          newText = '';
          ref = text.split("\n");
          for (j = 0, len = ref.length; j < len; j++) {
            line = ref[j];
            if (line.length === 0 || line.charAt(0) === ' ') {
              newText = Utils.rtrim(newText, ' ') + line + "\n";
            } else {
              newText += line + ' ';
            }
          }
          text = newText;
        }
        if ('+' !== indicator) {
          text = Utils.rtrim(text);
        }
        if ('' === indicator) {
          text = this.PATTERN_TRAILING_LINES.replace(text, "\n");
        } else if ('-' === indicator) {
          text = this.PATTERN_TRAILING_LINES.replace(text, '');
        }
        return text;
      };
    
      Parser.prototype.isNextLineIndented = function(ignoreComments) {
        var EOF, currentIndentation, ret;
        if (ignoreComments == null) {
          ignoreComments = true;
        }
        currentIndentation = this.getCurrentLineIndentation();
        EOF = !this.moveToNextLine();
        if (ignoreComments) {
          while (!EOF && this.isCurrentLineEmpty()) {
            EOF = !this.moveToNextLine();
          }
        } else {
          while (!EOF && this.isCurrentLineBlank()) {
            EOF = !this.moveToNextLine();
          }
        }
        if (EOF) {
          return false;
        }
        ret = false;
        if (this.getCurrentLineIndentation() > currentIndentation) {
          ret = true;
        }
        this.moveToPreviousLine();
        return ret;
      };
    
      Parser.prototype.isCurrentLineEmpty = function() {
        var trimmedLine;
        trimmedLine = Utils.trim(this.currentLine, ' ');
        return trimmedLine.length === 0 || trimmedLine.charAt(0) === '#';
      };
    
      Parser.prototype.isCurrentLineBlank = function() {
        return '' === Utils.trim(this.currentLine, ' ');
      };
    
      Parser.prototype.isCurrentLineComment = function() {
        var ltrimmedLine;
        ltrimmedLine = Utils.ltrim(this.currentLine, ' ');
        return ltrimmedLine.charAt(0) === '#';
      };
    
      Parser.prototype.cleanup = function(value) {
        var count, i, indent, j, l, len, len1, line, lines, ref, ref1, ref2, smallestIndent, trimmedValue;
        if (value.indexOf("\r") !== -1) {
          value = value.split("\r\n").join("\n").split("\r").join("\n");
        }
        count = 0;
        ref = this.PATTERN_YAML_HEADER.replaceAll(value, ''), value = ref[0], count = ref[1];
        this.offset += count;
        ref1 = this.PATTERN_LEADING_COMMENTS.replaceAll(value, '', 1), trimmedValue = ref1[0], count = ref1[1];
        if (count === 1) {
          this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
          value = trimmedValue;
        }
        ref2 = this.PATTERN_DOCUMENT_MARKER_START.replaceAll(value, '', 1), trimmedValue = ref2[0], count = ref2[1];
        if (count === 1) {
          this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
          value = trimmedValue;
          value = this.PATTERN_DOCUMENT_MARKER_END.replace(value, '');
        }
        lines = value.split("\n");
        smallestIndent = -1;
        for (j = 0, len = lines.length; j < len; j++) {
          line = lines[j];
          if (Utils.trim(line, ' ').length === 0) {
            continue;
          }
          indent = line.length - Utils.ltrim(line).length;
          if (smallestIndent === -1 || indent < smallestIndent) {
            smallestIndent = indent;
          }
        }
        if (smallestIndent > 0) {
          for (i = l = 0, len1 = lines.length; l < len1; i = ++l) {
            line = lines[i];
            lines[i] = line.slice(smallestIndent);
          }
          value = lines.join("\n");
        }
        return value;
      };
    
      Parser.prototype.isNextLineUnIndentedCollection = function(currentIndentation) {
        var notEOF, ret;
        if (currentIndentation == null) {
          currentIndentation = null;
        }
        if (currentIndentation == null) {
          currentIndentation = this.getCurrentLineIndentation();
        }
        notEOF = this.moveToNextLine();
        while (notEOF && this.isCurrentLineEmpty()) {
          notEOF = this.moveToNextLine();
        }
        if (false === notEOF) {
          return false;
        }
        ret = false;
        if (this.getCurrentLineIndentation() === currentIndentation && this.isStringUnIndentedCollectionItem(this.currentLine)) {
          ret = true;
        }
        this.moveToPreviousLine();
        return ret;
      };
    
      Parser.prototype.isStringUnIndentedCollectionItem = function() {
        return this.currentLine === '-' || this.currentLine.slice(0, 2) === '- ';
      };
    
      return Parser;
    
    })();
    
    module.exports = Parser;
    
    },{"./Exception/ParseException":91,"./Exception/ParseMore":92,"./Inline":93,"./Pattern":95,"./Utils":97}],95:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Pattern;
    
    Pattern = (function() {
      Pattern.prototype.regex = null;
    
      Pattern.prototype.rawRegex = null;
    
      Pattern.prototype.cleanedRegex = null;
    
      Pattern.prototype.mapping = null;
    
      function Pattern(rawRegex, modifiers) {
        var _char, capturingBracketNumber, cleanedRegex, i, len, mapping, name, part, subChar;
        if (modifiers == null) {
          modifiers = '';
        }
        cleanedRegex = '';
        len = rawRegex.length;
        mapping = null;
        capturingBracketNumber = 0;
        i = 0;
        while (i < len) {
          _char = rawRegex.charAt(i);
          if (_char === '\\') {
            cleanedRegex += rawRegex.slice(i, +(i + 1) + 1 || 9e9);
            i++;
          } else if (_char === '(') {
            if (i < len - 2) {
              part = rawRegex.slice(i, +(i + 2) + 1 || 9e9);
              if (part === '(?:') {
                i += 2;
                cleanedRegex += part;
              } else if (part === '(?<') {
                capturingBracketNumber++;
                i += 2;
                name = '';
                while (i + 1 < len) {
                  subChar = rawRegex.charAt(i + 1);
                  if (subChar === '>') {
                    cleanedRegex += '(';
                    i++;
                    if (name.length > 0) {
                      if (mapping == null) {
                        mapping = {};
                      }
                      mapping[name] = capturingBracketNumber;
                    }
                    break;
                  } else {
                    name += subChar;
                  }
                  i++;
                }
              } else {
                cleanedRegex += _char;
                capturingBracketNumber++;
              }
            } else {
              cleanedRegex += _char;
            }
          } else {
            cleanedRegex += _char;
          }
          i++;
        }
        this.rawRegex = rawRegex;
        this.cleanedRegex = cleanedRegex;
        this.regex = new RegExp(this.cleanedRegex, 'g' + modifiers.replace('g', ''));
        this.mapping = mapping;
      }
    
      Pattern.prototype.exec = function(str) {
        var index, matches, name, ref;
        this.regex.lastIndex = 0;
        matches = this.regex.exec(str);
        if (matches == null) {
          return null;
        }
        if (this.mapping != null) {
          ref = this.mapping;
          for (name in ref) {
            index = ref[name];
            matches[name] = matches[index];
          }
        }
        return matches;
      };
    
      Pattern.prototype.test = function(str) {
        this.regex.lastIndex = 0;
        return this.regex.test(str);
      };
    
      Pattern.prototype.replace = function(str, replacement) {
        this.regex.lastIndex = 0;
        return str.replace(this.regex, replacement);
      };
    
      Pattern.prototype.replaceAll = function(str, replacement, limit) {
        var count;
        if (limit == null) {
          limit = 0;
        }
        this.regex.lastIndex = 0;
        count = 0;
        while (this.regex.test(str) && (limit === 0 || count < limit)) {
          this.regex.lastIndex = 0;
          str = str.replace(this.regex, replacement);
          count++;
        }
        return [str, count];
      };
    
      return Pattern;
    
    })();
    
    module.exports = Pattern;
    
    },{}],96:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Pattern, Unescaper, Utils;
    
    Utils = require('./Utils');
    
    Pattern = require('./Pattern');
    
    Unescaper = (function() {
      function Unescaper() {}
    
      Unescaper.PATTERN_ESCAPED_CHARACTER = new Pattern('\\\\([0abt\tnvfre "\\/\\\\N_LP]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})');
    
      Unescaper.unescapeSingleQuotedString = function(value) {
        return value.replace(/\'\'/g, '\'');
      };
    
      Unescaper.unescapeDoubleQuotedString = function(value) {
        if (this._unescapeCallback == null) {
          this._unescapeCallback = (function(_this) {
            return function(str) {
              return _this.unescapeCharacter(str);
            };
          })(this);
        }
        return this.PATTERN_ESCAPED_CHARACTER.replace(value, this._unescapeCallback);
      };
    
      Unescaper.unescapeCharacter = function(value) {
        var ch;
        ch = String.fromCharCode;
        switch (value.charAt(1)) {
          case '0':
            return ch(0);
          case 'a':
            return ch(7);
          case 'b':
            return ch(8);
          case 't':
            return "\t";
          case "\t":
            return "\t";
          case 'n':
            return "\n";
          case 'v':
            return ch(11);
          case 'f':
            return ch(12);
          case 'r':
            return ch(13);
          case 'e':
            return ch(27);
          case ' ':
            return ' ';
          case '"':
            return '"';
          case '/':
            return '/';
          case '\\':
            return '\\';
          case 'N':
            return ch(0x0085);
          case '_':
            return ch(0x00A0);
          case 'L':
            return ch(0x2028);
          case 'P':
            return ch(0x2029);
          case 'x':
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 2)));
          case 'u':
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 4)));
          case 'U':
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 8)));
          default:
            return '';
        }
      };
    
      return Unescaper;
    
    })();
    
    module.exports = Unescaper;
    
    },{"./Pattern":95,"./Utils":97}],97:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Pattern, Utils,
      hasProp = {}.hasOwnProperty;
    
    Pattern = require('./Pattern');
    
    Utils = (function() {
      function Utils() {}
    
      Utils.REGEX_LEFT_TRIM_BY_CHAR = {};
    
      Utils.REGEX_RIGHT_TRIM_BY_CHAR = {};
    
      Utils.REGEX_SPACES = /\s+/g;
    
      Utils.REGEX_DIGITS = /^\d+$/;
    
      Utils.REGEX_OCTAL = /[^0-7]/gi;
    
      Utils.REGEX_HEXADECIMAL = /[^a-f0-9]/gi;
    
      Utils.PATTERN_DATE = new Pattern('^' + '(?<year>[0-9][0-9][0-9][0-9])' + '-(?<month>[0-9][0-9]?)' + '-(?<day>[0-9][0-9]?)' + '(?:(?:[Tt]|[ \t]+)' + '(?<hour>[0-9][0-9]?)' + ':(?<minute>[0-9][0-9])' + ':(?<second>[0-9][0-9])' + '(?:\.(?<fraction>[0-9]*))?' + '(?:[ \t]*(?<tz>Z|(?<tz_sign>[-+])(?<tz_hour>[0-9][0-9]?)' + '(?::(?<tz_minute>[0-9][0-9]))?))?)?' + '$', 'i');
    
      Utils.LOCAL_TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;
    
      Utils.trim = function(str, _char) {
        var regexLeft, regexRight;
        if (_char == null) {
          _char = '\\s';
        }
        regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
          this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
        }
        regexLeft.lastIndex = 0;
        regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
          this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
        }
        regexRight.lastIndex = 0;
        return str.replace(regexLeft, '').replace(regexRight, '');
      };
    
      Utils.ltrim = function(str, _char) {
        var regexLeft;
        if (_char == null) {
          _char = '\\s';
        }
        regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
          this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
        }
        regexLeft.lastIndex = 0;
        return str.replace(regexLeft, '');
      };
    
      Utils.rtrim = function(str, _char) {
        var regexRight;
        if (_char == null) {
          _char = '\\s';
        }
        regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
          this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
        }
        regexRight.lastIndex = 0;
        return str.replace(regexRight, '');
      };
    
      Utils.isEmpty = function(value) {
        return !value || value === '' || value === '0' || (value instanceof Array && value.length === 0) || this.isEmptyObject(value);
      };
    
      Utils.isEmptyObject = function(value) {
        var k;
        return value instanceof Object && ((function() {
          var results;
          results = [];
          for (k in value) {
            if (!hasProp.call(value, k)) continue;
            results.push(k);
          }
          return results;
        })()).length === 0;
      };
    
      Utils.subStrCount = function(string, subString, start, length) {
        var c, i, j, len, ref, sublen;
        c = 0;
        string = '' + string;
        subString = '' + subString;
        if (start != null) {
          string = string.slice(start);
        }
        if (length != null) {
          string = string.slice(0, length);
        }
        len = string.length;
        sublen = subString.length;
        for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          if (subString === string.slice(i, sublen)) {
            c++;
            i += sublen - 1;
          }
        }
        return c;
      };
    
      Utils.isDigits = function(input) {
        this.REGEX_DIGITS.lastIndex = 0;
        return this.REGEX_DIGITS.test(input);
      };
    
      Utils.octDec = function(input) {
        this.REGEX_OCTAL.lastIndex = 0;
        return parseInt((input + '').replace(this.REGEX_OCTAL, ''), 8);
      };
    
      Utils.hexDec = function(input) {
        this.REGEX_HEXADECIMAL.lastIndex = 0;
        input = this.trim(input);
        if ((input + '').slice(0, 2) === '0x') {
          input = (input + '').slice(2);
        }
        return parseInt((input + '').replace(this.REGEX_HEXADECIMAL, ''), 16);
      };
    
      Utils.utf8chr = function(c) {
        var ch;
        ch = String.fromCharCode;
        if (0x80 > (c %= 0x200000)) {
          return ch(c);
        }
        if (0x800 > c) {
          return ch(0xC0 | c >> 6) + ch(0x80 | c & 0x3F);
        }
        if (0x10000 > c) {
          return ch(0xE0 | c >> 12) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
        }
        return ch(0xF0 | c >> 18) + ch(0x80 | c >> 12 & 0x3F) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
      };
    
      Utils.parseBoolean = function(input, strict) {
        var lowerInput;
        if (strict == null) {
          strict = true;
        }
        if (typeof input === 'string') {
          lowerInput = input.toLowerCase();
          if (!strict) {
            if (lowerInput === 'no') {
              return false;
            }
          }
          if (lowerInput === '0') {
            return false;
          }
          if (lowerInput === 'false') {
            return false;
          }
          if (lowerInput === '') {
            return false;
          }
          return true;
        }
        return !!input;
      };
    
      Utils.isNumeric = function(input) {
        this.REGEX_SPACES.lastIndex = 0;
        return typeof input === 'number' || typeof input === 'string' && !isNaN(input) && input.replace(this.REGEX_SPACES, '') !== '';
      };
    
      Utils.stringToDate = function(str) {
        var date, day, fraction, hour, info, minute, month, second, tz_hour, tz_minute, tz_offset, year;
        if (!(str != null ? str.length : void 0)) {
          return null;
        }
        info = this.PATTERN_DATE.exec(str);
        if (!info) {
          return null;
        }
        year = parseInt(info.year, 10);
        month = parseInt(info.month, 10) - 1;
        day = parseInt(info.day, 10);
        if (info.hour == null) {
          date = new Date(Date.UTC(year, month, day));
          return date;
        }
        hour = parseInt(info.hour, 10);
        minute = parseInt(info.minute, 10);
        second = parseInt(info.second, 10);
        if (info.fraction != null) {
          fraction = info.fraction.slice(0, 3);
          while (fraction.length < 3) {
            fraction += '0';
          }
          fraction = parseInt(fraction, 10);
        } else {
          fraction = 0;
        }
        if (info.tz != null) {
          tz_hour = parseInt(info.tz_hour, 10);
          if (info.tz_minute != null) {
            tz_minute = parseInt(info.tz_minute, 10);
          } else {
            tz_minute = 0;
          }
          tz_offset = (tz_hour * 60 + tz_minute) * 60000;
          if ('-' === info.tz_sign) {
            tz_offset *= -1;
          }
        }
        date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
        if (tz_offset) {
          date.setTime(date.getTime() - tz_offset);
        }
        return date;
      };
    
      Utils.strRepeat = function(str, number) {
        var i, res;
        res = '';
        i = 0;
        while (i < number) {
          res += str;
          i++;
        }
        return res;
      };
    
      Utils.getStringFromFile = function(path, callback) {
        var data, fs, j, len1, name, ref, req, xhr;
        if (callback == null) {
          callback = null;
        }
        xhr = null;
        if (typeof window !== "undefined" && window !== null) {
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            ref = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (j = 0, len1 = ref.length; j < len1; j++) {
              name = ref[j];
              try {
                xhr = new ActiveXObject(name);
              } catch (error) {}
            }
          }
        }
        if (xhr != null) {
          if (callback != null) {
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                  return callback(xhr.responseText);
                } else {
                  return callback(null);
                }
              }
            };
            xhr.open('GET', path, true);
            return xhr.send(null);
          } else {
            xhr.open('GET', path, false);
            xhr.send(null);
            if (xhr.status === 200 || xhr.status === 0) {
              return xhr.responseText;
            }
            return null;
          }
        } else {
          req = require;
          fs = req('fs');
          if (callback != null) {
            return fs.readFile(path, function(err, data) {
              if (err) {
                return callback(null);
              } else {
                return callback(String(data));
              }
            });
          } else {
            data = fs.readFileSync(path);
            if (data != null) {
              return String(data);
            }
            return null;
          }
        }
      };
    
      return Utils;
    
    })();
    
    module.exports = Utils;
    
    },{"./Pattern":95}],98:[function(require,module,exports){
    // Generated by CoffeeScript 1.12.4
    var Dumper, Parser, Utils, Yaml;
    
    Parser = require('./Parser');
    
    Dumper = require('./Dumper');
    
    Utils = require('./Utils');
    
    Yaml = (function() {
      function Yaml() {}
    
      Yaml.parse = function(input, exceptionOnInvalidType, objectDecoder) {
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        return new Parser().parse(input, exceptionOnInvalidType, objectDecoder);
      };
    
      Yaml.parseFile = function(path, callback, exceptionOnInvalidType, objectDecoder) {
        var input;
        if (callback == null) {
          callback = null;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        if (callback != null) {
          return Utils.getStringFromFile(path, (function(_this) {
            return function(input) {
              var result;
              result = null;
              if (input != null) {
                result = _this.parse(input, exceptionOnInvalidType, objectDecoder);
              }
              callback(result);
            };
          })(this));
        } else {
          input = Utils.getStringFromFile(path);
          if (input != null) {
            return this.parse(input, exceptionOnInvalidType, objectDecoder);
          }
          return null;
        }
      };
    
      Yaml.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        var yaml;
        if (inline == null) {
          inline = 2;
        }
        if (indent == null) {
          indent = 4;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        yaml = new Dumper();
        yaml.indentation = indent;
        return yaml.dump(input, inline, 0, exceptionOnInvalidType, objectEncoder);
      };
    
      Yaml.stringify = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        return this.dump(input, inline, indent, exceptionOnInvalidType, objectEncoder);
      };
    
      Yaml.load = function(path, callback, exceptionOnInvalidType, objectDecoder) {
        return this.parseFile(path, callback, exceptionOnInvalidType, objectDecoder);
      };
    
      return Yaml;
    
    })();
    
    if (typeof window !== "undefined" && window !== null) {
      window.YAML = Yaml;
    }
    
    if (typeof window === "undefined" || window === null) {
      this.YAML = Yaml;
    }
    
    module.exports = Yaml;
    
    },{"./Dumper":88,"./Parser":94,"./Utils":97}],99:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    var util = require('util');
    var fs = require('fs');
    var path = require('path');
    
    function camelCase(str) {
        const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
        if (!isCamelCase) {
            str = str.toLocaleLowerCase();
        }
        if (str.indexOf('-') === -1 && str.indexOf('_') === -1) {
            return str;
        }
        else {
            let camelcase = '';
            let nextChrUpper = false;
            const leadingHyphens = str.match(/^-+/);
            for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
                let chr = str.charAt(i);
                if (nextChrUpper) {
                    nextChrUpper = false;
                    chr = chr.toLocaleUpperCase();
                }
                if (i !== 0 && (chr === '-' || chr === '_')) {
                    nextChrUpper = true;
                }
                else if (chr !== '-' && chr !== '_') {
                    camelcase += chr;
                }
            }
            return camelcase;
        }
    }
    function decamelize(str, joinString) {
        const lowercase = str.toLocaleLowerCase();
        joinString = joinString || '-';
        let notCamelcase = '';
        for (let i = 0; i < str.length; i++) {
            const chrLower = lowercase.charAt(i);
            const chrString = str.charAt(i);
            if (chrLower !== chrString && i > 0) {
                notCamelcase += `${joinString}${lowercase.charAt(i)}`;
            }
            else {
                notCamelcase += chrString;
            }
        }
        return notCamelcase;
    }
    function looksLikeNumber(x) {
        if (x === null || x === undefined)
            return false;
        if (typeof x === 'number')
            return true;
        if (/^0x[0-9a-f]+$/i.test(x))
            return true;
        if (x.length > 1 && x[0] === '0')
            return false;
        return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    
    function tokenizeArgString(argString) {
        if (Array.isArray(argString)) {
            return argString.map(e => typeof e !== 'string' ? e + '' : e);
        }
        argString = argString.trim();
        let i = 0;
        let prevC = null;
        let c = null;
        let opening = null;
        const args = [];
        for (let ii = 0; ii < argString.length; ii++) {
            prevC = c;
            c = argString.charAt(ii);
            if (c === ' ' && !opening) {
                if (!(prevC === ' ')) {
                    i++;
                }
                continue;
            }
            let escaped = false;
            if (ii > 0) {
                const previousCharacterIndex = ii - 1;
                const previousCharacter = argString.charAt(previousCharacterIndex);
                escaped = previousCharacter === '\\';
            }
            if (c === opening && !escaped) {
                opening = null;
                continue;
            }
            else if ((c === "'" || c === '"') && !opening) {
                opening = c;
                continue;
            }
            let nextCharacter = null;
            if (ii < argString.length - 1) {
                nextCharacter = argString.charAt(ii + 1);
            }
            if (c === '\\' && nextCharacter === opening) {
                continue;
            }
            if (!args[i])
                args[i] = '';
            args[i] += c;
        }
        return args;
    }
    
    let mixin;
    class YargsParser {
        constructor(_mixin) {
            mixin = _mixin;
        }
        parse(argsInput, options) {
            const opts = Object.assign({
                alias: undefined,
                array: undefined,
                boolean: undefined,
                config: undefined,
                configObjects: undefined,
                configuration: undefined,
                coerce: undefined,
                count: undefined,
                default: undefined,
                envPrefix: undefined,
                narg: undefined,
                normalize: undefined,
                string: undefined,
                number: undefined,
                __: undefined,
                key: undefined
            }, options);
            const args = tokenizeArgString(argsInput);
            const aliases = combineAliases(Object.assign(Object.create(null), opts.alias));
            const configuration = Object.assign({
                'boolean-negation': true,
                'camel-case-expansion': true,
                'combine-arrays': false,
                'dot-notation': true,
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays': true,
                'greedy-arrays': true,
                'halt-at-non-option': false,
                'nargs-eats-options': false,
                'negation-prefix': 'no-',
                'parse-numbers': true,
                'parse-positional-numbers': true,
                'populate--': false,
                'set-placeholder-key': false,
                'short-option-groups': true,
                'strip-aliased': false,
                'strip-dashed': false,
                'unknown-options-as-args': false
            }, opts.configuration);
            const defaults = Object.assign(Object.create(null), opts.default);
            const configObjects = opts.configObjects || [];
            const envPrefix = opts.envPrefix;
            const notFlagsOption = configuration['populate--'];
            const notFlagsArgv = notFlagsOption ? '--' : '_';
            const newAliases = Object.create(null);
            const defaulted = Object.create(null);
            const __ = opts.__ || mixin.format;
            const flags = {
                aliases: Object.create(null),
                arrays: Object.create(null),
                bools: Object.create(null),
                strings: Object.create(null),
                numbers: Object.create(null),
                counts: Object.create(null),
                normalize: Object.create(null),
                configs: Object.create(null),
                nargs: Object.create(null),
                coercions: Object.create(null),
                keys: []
            };
            const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
            const negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)');
            [].concat(opts.array || []).filter(Boolean).forEach(function (opt) {
                const key = typeof opt === 'object' ? opt.key : opt;
                const assignment = Object.keys(opt).map(function (key) {
                    const arrayFlagKeys = {
                        boolean: 'bools',
                        string: 'strings',
                        number: 'numbers'
                    };
                    return arrayFlagKeys[key];
                }).filter(Boolean).pop();
                if (assignment) {
                    flags[assignment][key] = true;
                }
                flags.arrays[key] = true;
                flags.keys.push(key);
            });
            [].concat(opts.boolean || []).filter(Boolean).forEach(function (key) {
                flags.bools[key] = true;
                flags.keys.push(key);
            });
            [].concat(opts.string || []).filter(Boolean).forEach(function (key) {
                flags.strings[key] = true;
                flags.keys.push(key);
            });
            [].concat(opts.number || []).filter(Boolean).forEach(function (key) {
                flags.numbers[key] = true;
                flags.keys.push(key);
            });
            [].concat(opts.count || []).filter(Boolean).forEach(function (key) {
                flags.counts[key] = true;
                flags.keys.push(key);
            });
            [].concat(opts.normalize || []).filter(Boolean).forEach(function (key) {
                flags.normalize[key] = true;
                flags.keys.push(key);
            });
            if (typeof opts.narg === 'object') {
                Object.entries(opts.narg).forEach(([key, value]) => {
                    if (typeof value === 'number') {
                        flags.nargs[key] = value;
                        flags.keys.push(key);
                    }
                });
            }
            if (typeof opts.coerce === 'object') {
                Object.entries(opts.coerce).forEach(([key, value]) => {
                    if (typeof value === 'function') {
                        flags.coercions[key] = value;
                        flags.keys.push(key);
                    }
                });
            }
            if (typeof opts.config !== 'undefined') {
                if (Array.isArray(opts.config) || typeof opts.config === 'string') {
                    [].concat(opts.config).filter(Boolean).forEach(function (key) {
                        flags.configs[key] = true;
                    });
                }
                else if (typeof opts.config === 'object') {
                    Object.entries(opts.config).forEach(([key, value]) => {
                        if (typeof value === 'boolean' || typeof value === 'function') {
                            flags.configs[key] = value;
                        }
                    });
                }
            }
            extendAliases(opts.key, aliases, opts.default, flags.arrays);
            Object.keys(defaults).forEach(function (key) {
                (flags.aliases[key] || []).forEach(function (alias) {
                    defaults[alias] = defaults[key];
                });
            });
            let error = null;
            checkConfiguration();
            let notFlags = [];
            const argv = Object.assign(Object.create(null), { _: [] });
            const argvReturn = {};
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                let broken;
                let key;
                let letters;
                let m;
                let next;
                let value;
                if (!arg)
                    continue;
                if (arg !== '--' && isUnknownOptionAsArg(arg)) {
                    pushPositional(arg);
                }
                else if (arg.match(/---+(=|$)/)) {
                    pushPositional(arg);
                    continue;
                }
                else if (arg.match(/^--.+=/) || (!configuration['short-option-groups'] && arg.match(/^-.+=/))) {
                    m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
                    if (m !== null && Array.isArray(m) && m.length >= 3) {
                        if (checkAllAliases(m[1], flags.arrays)) {
                            i = eatArray(i, m[1], args, m[2]);
                        }
                        else if (checkAllAliases(m[1], flags.nargs) !== false) {
                            i = eatNargs(i, m[1], args, m[2]);
                        }
                        else {
                            setArg(m[1], m[2]);
                        }
                    }
                }
                else if (arg.match(negatedBoolean) && configuration['boolean-negation']) {
                    m = arg.match(negatedBoolean);
                    if (m !== null && Array.isArray(m) && m.length >= 2) {
                        key = m[1];
                        setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
                    }
                }
                else if (arg.match(/^--.+/) || (!configuration['short-option-groups'] && arg.match(/^-[^-]+/))) {
                    m = arg.match(/^--?(.+)/);
                    if (m !== null && Array.isArray(m) && m.length >= 2) {
                        key = m[1];
                        if (checkAllAliases(key, flags.arrays)) {
                            i = eatArray(i, key, args);
                        }
                        else if (checkAllAliases(key, flags.nargs) !== false) {
                            i = eatNargs(i, key, args);
                        }
                        else {
                            next = args[i + 1];
                            if (next !== undefined && (!next.match(/^-/) ||
                                next.match(negative)) &&
                                !checkAllAliases(key, flags.bools) &&
                                !checkAllAliases(key, flags.counts)) {
                                setArg(key, next);
                                i++;
                            }
                            else if (/^(true|false)$/.test(next)) {
                                setArg(key, next);
                                i++;
                            }
                            else {
                                setArg(key, defaultValue(key));
                            }
                        }
                    }
                }
                else if (arg.match(/^-.\..+=/)) {
                    m = arg.match(/^-([^=]+)=([\s\S]*)$/);
                    if (m !== null && Array.isArray(m) && m.length >= 3) {
                        setArg(m[1], m[2]);
                    }
                }
                else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
                    next = args[i + 1];
                    m = arg.match(/^-(.\..+)/);
                    if (m !== null && Array.isArray(m) && m.length >= 2) {
                        key = m[1];
                        if (next !== undefined && !next.match(/^-/) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
                else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
                    letters = arg.slice(1, -1).split('');
                    broken = false;
                    for (let j = 0; j < letters.length; j++) {
                        next = arg.slice(j + 2);
                        if (letters[j + 1] && letters[j + 1] === '=') {
                            value = arg.slice(j + 3);
                            key = letters[j];
                            if (checkAllAliases(key, flags.arrays)) {
                                i = eatArray(i, key, args, value);
                            }
                            else if (checkAllAliases(key, flags.nargs) !== false) {
                                i = eatNargs(i, key, args, value);
                            }
                            else {
                                setArg(key, value);
                            }
                            broken = true;
                            break;
                        }
                        if (next === '-') {
                            setArg(letters[j], next);
                            continue;
                        }
                        if (/[A-Za-z]/.test(letters[j]) &&
                            /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) &&
                            checkAllAliases(next, flags.bools) === false) {
                            setArg(letters[j], next);
                            broken = true;
                            break;
                        }
                        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                            setArg(letters[j], next);
                            broken = true;
                            break;
                        }
                        else {
                            setArg(letters[j], defaultValue(letters[j]));
                        }
                    }
                    key = arg.slice(-1)[0];
                    if (!broken && key !== '-') {
                        if (checkAllAliases(key, flags.arrays)) {
                            i = eatArray(i, key, args);
                        }
                        else if (checkAllAliases(key, flags.nargs) !== false) {
                            i = eatNargs(i, key, args);
                        }
                        else {
                            next = args[i + 1];
                            if (next !== undefined && (!/^(-|--)[^-]/.test(next) ||
                                next.match(negative)) &&
                                !checkAllAliases(key, flags.bools) &&
                                !checkAllAliases(key, flags.counts)) {
                                setArg(key, next);
                                i++;
                            }
                            else if (/^(true|false)$/.test(next)) {
                                setArg(key, next);
                                i++;
                            }
                            else {
                                setArg(key, defaultValue(key));
                            }
                        }
                    }
                }
                else if (arg.match(/^-[0-9]$/) &&
                    arg.match(negative) &&
                    checkAllAliases(arg.slice(1), flags.bools)) {
                    key = arg.slice(1);
                    setArg(key, defaultValue(key));
                }
                else if (arg === '--') {
                    notFlags = args.slice(i + 1);
                    break;
                }
                else if (configuration['halt-at-non-option']) {
                    notFlags = args.slice(i);
                    break;
                }
                else {
                    pushPositional(arg);
                }
            }
            applyEnvVars(argv, true);
            applyEnvVars(argv, false);
            setConfig(argv);
            setConfigObjects();
            applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
            applyCoercions(argv);
            if (configuration['set-placeholder-key'])
                setPlaceholderKeys(argv);
            Object.keys(flags.counts).forEach(function (key) {
                if (!hasKey(argv, key.split('.')))
                    setArg(key, 0);
            });
            if (notFlagsOption && notFlags.length)
                argv[notFlagsArgv] = [];
            notFlags.forEach(function (key) {
                argv[notFlagsArgv].push(key);
            });
            if (configuration['camel-case-expansion'] && configuration['strip-dashed']) {
                Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
                    delete argv[key];
                });
            }
            if (configuration['strip-aliased']) {
                [].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
                    if (configuration['camel-case-expansion'] && alias.includes('-')) {
                        delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')];
                    }
                    delete argv[alias];
                });
            }
            function pushPositional(arg) {
                const maybeCoercedNumber = maybeCoerceNumber('_', arg);
                if (typeof maybeCoercedNumber === 'string' || typeof maybeCoercedNumber === 'number') {
                    argv._.push(maybeCoercedNumber);
                }
            }
            function eatNargs(i, key, args, argAfterEqualSign) {
                let ii;
                let toEat = checkAllAliases(key, flags.nargs);
                toEat = typeof toEat !== 'number' || isNaN(toEat) ? 1 : toEat;
                if (toEat === 0) {
                    if (!isUndefined(argAfterEqualSign)) {
                        error = Error(__('Argument unexpected for: %s', key));
                    }
                    setArg(key, defaultValue(key));
                    return i;
                }
                let available = isUndefined(argAfterEqualSign) ? 0 : 1;
                if (configuration['nargs-eats-options']) {
                    if (args.length - (i + 1) + available < toEat) {
                        error = Error(__('Not enough arguments following: %s', key));
                    }
                    available = toEat;
                }
                else {
                    for (ii = i + 1; ii < args.length; ii++) {
                        if (!args[ii].match(/^-[^0-9]/) || args[ii].match(negative) || isUnknownOptionAsArg(args[ii]))
                            available++;
                        else
                            break;
                    }
                    if (available < toEat)
                        error = Error(__('Not enough arguments following: %s', key));
                }
                let consumed = Math.min(available, toEat);
                if (!isUndefined(argAfterEqualSign) && consumed > 0) {
                    setArg(key, argAfterEqualSign);
                    consumed--;
                }
                for (ii = i + 1; ii < (consumed + i + 1); ii++) {
                    setArg(key, args[ii]);
                }
                return (i + consumed);
            }
            function eatArray(i, key, args, argAfterEqualSign) {
                let argsToSet = [];
                let next = argAfterEqualSign || args[i + 1];
                const nargsCount = checkAllAliases(key, flags.nargs);
                if (checkAllAliases(key, flags.bools) && !(/^(true|false)$/.test(next))) {
                    argsToSet.push(true);
                }
                else if (isUndefined(next) ||
                    (isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))) {
                    if (defaults[key] !== undefined) {
                        const defVal = defaults[key];
                        argsToSet = Array.isArray(defVal) ? defVal : [defVal];
                    }
                }
                else {
                    if (!isUndefined(argAfterEqualSign)) {
                        argsToSet.push(processValue(key, argAfterEqualSign));
                    }
                    for (let ii = i + 1; ii < args.length; ii++) {
                        if ((!configuration['greedy-arrays'] && argsToSet.length > 0) ||
                            (nargsCount && typeof nargsCount === 'number' && argsToSet.length >= nargsCount))
                            break;
                        next = args[ii];
                        if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
                            break;
                        i = ii;
                        argsToSet.push(processValue(key, next));
                    }
                }
                if (typeof nargsCount === 'number' && ((nargsCount && argsToSet.length < nargsCount) ||
                    (isNaN(nargsCount) && argsToSet.length === 0))) {
                    error = Error(__('Not enough arguments following: %s', key));
                }
                setArg(key, argsToSet);
                return i;
            }
            function setArg(key, val) {
                if (/-/.test(key) && configuration['camel-case-expansion']) {
                    const alias = key.split('.').map(function (prop) {
                        return camelCase(prop);
                    }).join('.');
                    addNewAlias(key, alias);
                }
                const value = processValue(key, val);
                const splitKey = key.split('.');
                setKey(argv, splitKey, value);
                if (flags.aliases[key]) {
                    flags.aliases[key].forEach(function (x) {
                        const keyProperties = x.split('.');
                        setKey(argv, keyProperties, value);
                    });
                }
                if (splitKey.length > 1 && configuration['dot-notation']) {
                    (flags.aliases[splitKey[0]] || []).forEach(function (x) {
                        let keyProperties = x.split('.');
                        const a = [].concat(splitKey);
                        a.shift();
                        keyProperties = keyProperties.concat(a);
                        if (!(flags.aliases[key] || []).includes(keyProperties.join('.'))) {
                            setKey(argv, keyProperties, value);
                        }
                    });
                }
                if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
                    const keys = [key].concat(flags.aliases[key] || []);
                    keys.forEach(function (key) {
                        Object.defineProperty(argvReturn, key, {
                            enumerable: true,
                            get() {
                                return val;
                            },
                            set(value) {
                                val = typeof value === 'string' ? mixin.normalize(value) : value;
                            }
                        });
                    });
                }
            }
            function addNewAlias(key, alias) {
                if (!(flags.aliases[key] && flags.aliases[key].length)) {
                    flags.aliases[key] = [alias];
                    newAliases[alias] = true;
                }
                if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
                    addNewAlias(alias, key);
                }
            }
            function processValue(key, val) {
                if (typeof val === 'string') {
                    if ((val[0] === "'" || val[0] === '"') &&
                        val[val.length - 1] === val[0]) {
                        val = val.substring(1, val.length - 1);
                    }
                    else if (val.slice(0, 2) === "$'" && val[val.length - 1] === "'") {
                        val = parseAnsiCQuote(val.substring(2, val.length - 1));
                    }
                }
                if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
                    if (typeof val === 'string')
                        val = val === 'true';
                }
                let value = Array.isArray(val)
                    ? val.map(function (v) { return maybeCoerceNumber(key, v); })
                    : maybeCoerceNumber(key, val);
                if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === 'boolean')) {
                    value = increment();
                }
                if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
                    if (Array.isArray(val))
                        value = val.map((val) => { return mixin.normalize(val); });
                    else
                        value = mixin.normalize(val);
                }
                return value;
            }
            function parseAnsiCQuote(str) {
                function unescapeChar(x) {
                    switch (x.slice(0, 2)) {
                        case '\\\\':
                            return '\\';
                        case '\\a':
                            return '\a';
                        case '\\b':
                            return '\b';
                        case '\\e':
                            return '\u001b';
                        case '\\E':
                            return '\u001b';
                        case '\\f':
                            return '\f';
                        case '\\n':
                            return '\n';
                        case '\\r':
                            return '\r';
                        case '\\t':
                            return '\t';
                        case '\\v':
                            return '\v';
                        case "\\'":
                            return "'";
                        case '\\"':
                            return '"';
                        case '\\?':
                            return '?';
                        case '\\c':
                            if (x.match(/\\c[0-9]/)) {
                                return String.fromCodePoint(parseInt(x.slice(2), 10) + 16);
                            }
                            return String.fromCodePoint(x.toLowerCase().charCodeAt(2) - 'a'.charCodeAt(0) + 1);
                        case '\\x':
                        case '\\u':
                        case '\\U':
                            return String.fromCodePoint(parseInt(x.slice(2), 16));
                    }
                    return String.fromCodePoint(parseInt(x.slice(1), 8) % 256);
                }
                const ANSI_BACKSLASHES = /\\(\\|a|b|e|E|f|n|r|t|v|'|"|\?|[0-7]{1,3}|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{1,4}|U[0-9A-Fa-f]{1,8}|c.)/gs;
                return str.replace(ANSI_BACKSLASHES, unescapeChar);
            }
            function maybeCoerceNumber(key, value) {
                if (!configuration['parse-positional-numbers'] && key === '_')
                    return value;
                if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
                    const shouldCoerceNumber = looksLikeNumber(value) && configuration['parse-numbers'] && (Number.isSafeInteger(Math.floor(parseFloat(`${value}`))));
                    if (shouldCoerceNumber || (!isUndefined(value) && checkAllAliases(key, flags.numbers))) {
                        value = Number(value);
                    }
                }
                return value;
            }
            function setConfig(argv) {
                const configLookup = Object.create(null);
                applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
                Object.keys(flags.configs).forEach(function (configKey) {
                    const configPath = argv[configKey] || configLookup[configKey];
                    if (configPath) {
                        try {
                            let config = null;
                            const resolvedConfigPath = mixin.resolve(mixin.cwd(), configPath);
                            const resolveConfig = flags.configs[configKey];
                            if (typeof resolveConfig === 'function') {
                                try {
                                    config = resolveConfig(resolvedConfigPath);
                                }
                                catch (e) {
                                    config = e;
                                }
                                if (config instanceof Error) {
                                    error = config;
                                    return;
                                }
                            }
                            else {
                                config = mixin.require(resolvedConfigPath);
                            }
                            setConfigObject(config);
                        }
                        catch (ex) {
                            if (ex.name === 'PermissionDenied')
                                error = ex;
                            else if (argv[configKey])
                                error = Error(__('Invalid JSON config file: %s', configPath));
                        }
                    }
                });
            }
            function setConfigObject(config, prev) {
                Object.keys(config).forEach(function (key) {
                    const value = config[key];
                    const fullKey = prev ? prev + '.' + key : key;
                    if (typeof value === 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']) {
                        setConfigObject(value, fullKey);
                    }
                    else {
                        if (!hasKey(argv, fullKey.split('.')) || (checkAllAliases(fullKey, flags.arrays) && configuration['combine-arrays'])) {
                            setArg(fullKey, value);
                        }
                    }
                });
            }
            function setConfigObjects() {
                if (typeof configObjects !== 'undefined') {
                    configObjects.forEach(function (configObject) {
                        setConfigObject(configObject);
                    });
                }
            }
            function applyEnvVars(argv, configOnly) {
                if (typeof envPrefix === 'undefined')
                    return;
                const prefix = typeof envPrefix === 'string' ? envPrefix : '';
                const env = mixin.env();
                Object.keys(env).forEach(function (envVar) {
                    if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
                        const keys = envVar.split('__').map(function (key, i) {
                            if (i === 0) {
                                key = key.substring(prefix.length);
                            }
                            return camelCase(key);
                        });
                        if (((configOnly && flags.configs[keys.join('.')]) || !configOnly) && !hasKey(argv, keys)) {
                            setArg(keys.join('.'), env[envVar]);
                        }
                    }
                });
            }
            function applyCoercions(argv) {
                let coerce;
                const applied = new Set();
                Object.keys(argv).forEach(function (key) {
                    if (!applied.has(key)) {
                        coerce = checkAllAliases(key, flags.coercions);
                        if (typeof coerce === 'function') {
                            try {
                                const value = maybeCoerceNumber(key, coerce(argv[key]));
                                ([].concat(flags.aliases[key] || [], key)).forEach(ali => {
                                    applied.add(ali);
                                    argv[ali] = value;
                                });
                            }
                            catch (err) {
                                error = err;
                            }
                        }
                    }
                });
            }
            function setPlaceholderKeys(argv) {
                flags.keys.forEach((key) => {
                    if (~key.indexOf('.'))
                        return;
                    if (typeof argv[key] === 'undefined')
                        argv[key] = undefined;
                });
                return argv;
            }
            function applyDefaultsAndAliases(obj, aliases, defaults, canLog = false) {
                Object.keys(defaults).forEach(function (key) {
                    if (!hasKey(obj, key.split('.'))) {
                        setKey(obj, key.split('.'), defaults[key]);
                        if (canLog)
                            defaulted[key] = true;
                        (aliases[key] || []).forEach(function (x) {
                            if (hasKey(obj, x.split('.')))
                                return;
                            setKey(obj, x.split('.'), defaults[key]);
                        });
                    }
                });
            }
            function hasKey(obj, keys) {
                let o = obj;
                if (!configuration['dot-notation'])
                    keys = [keys.join('.')];
                keys.slice(0, -1).forEach(function (key) {
                    o = (o[key] || {});
                });
                const key = keys[keys.length - 1];
                if (typeof o !== 'object')
                    return false;
                else
                    return key in o;
            }
            function setKey(obj, keys, value) {
                let o = obj;
                if (!configuration['dot-notation'])
                    keys = [keys.join('.')];
                keys.slice(0, -1).forEach(function (key) {
                    key = sanitizeKey(key);
                    if (typeof o === 'object' && o[key] === undefined) {
                        o[key] = {};
                    }
                    if (typeof o[key] !== 'object' || Array.isArray(o[key])) {
                        if (Array.isArray(o[key])) {
                            o[key].push({});
                        }
                        else {
                            o[key] = [o[key], {}];
                        }
                        o = o[key][o[key].length - 1];
                    }
                    else {
                        o = o[key];
                    }
                });
                const key = sanitizeKey(keys[keys.length - 1]);
                const isTypeArray = checkAllAliases(keys.join('.'), flags.arrays);
                const isValueArray = Array.isArray(value);
                let duplicate = configuration['duplicate-arguments-array'];
                if (!duplicate && checkAllAliases(key, flags.nargs)) {
                    duplicate = true;
                    if ((!isUndefined(o[key]) && flags.nargs[key] === 1) || (Array.isArray(o[key]) && o[key].length === flags.nargs[key])) {
                        o[key] = undefined;
                    }
                }
                if (value === increment()) {
                    o[key] = increment(o[key]);
                }
                else if (Array.isArray(o[key])) {
                    if (duplicate && isTypeArray && isValueArray) {
                        o[key] = configuration['flatten-duplicate-arrays'] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
                    }
                    else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
                        o[key] = value;
                    }
                    else {
                        o[key] = o[key].concat([value]);
                    }
                }
                else if (o[key] === undefined && isTypeArray) {
                    o[key] = isValueArray ? value : [value];
                }
                else if (duplicate && !(o[key] === undefined ||
                    checkAllAliases(key, flags.counts) ||
                    checkAllAliases(key, flags.bools))) {
                    o[key] = [o[key], value];
                }
                else {
                    o[key] = value;
                }
            }
            function extendAliases(...args) {
                args.forEach(function (obj) {
                    Object.keys(obj || {}).forEach(function (key) {
                        if (flags.aliases[key])
                            return;
                        flags.aliases[key] = [].concat(aliases[key] || []);
                        flags.aliases[key].concat(key).forEach(function (x) {
                            if (/-/.test(x) && configuration['camel-case-expansion']) {
                                const c = camelCase(x);
                                if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                    flags.aliases[key].push(c);
                                    newAliases[c] = true;
                                }
                            }
                        });
                        flags.aliases[key].concat(key).forEach(function (x) {
                            if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
                                const c = decamelize(x, '-');
                                if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                    flags.aliases[key].push(c);
                                    newAliases[c] = true;
                                }
                            }
                        });
                        flags.aliases[key].forEach(function (x) {
                            flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
                                return x !== y;
                            }));
                        });
                    });
                });
            }
            function checkAllAliases(key, flag) {
                const toCheck = [].concat(flags.aliases[key] || [], key);
                const keys = Object.keys(flag);
                const setAlias = toCheck.find(key => keys.includes(key));
                return setAlias ? flag[setAlias] : false;
            }
            function hasAnyFlag(key) {
                const flagsKeys = Object.keys(flags);
                const toCheck = [].concat(flagsKeys.map(k => flags[k]));
                return toCheck.some(function (flag) {
                    return Array.isArray(flag) ? flag.includes(key) : flag[key];
                });
            }
            function hasFlagsMatching(arg, ...patterns) {
                const toCheck = [].concat(...patterns);
                return toCheck.some(function (pattern) {
                    const match = arg.match(pattern);
                    return match && hasAnyFlag(match[1]);
                });
            }
            function hasAllShortFlags(arg) {
                if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
                    return false;
                }
                let hasAllFlags = true;
                let next;
                const letters = arg.slice(1).split('');
                for (let j = 0; j < letters.length; j++) {
                    next = arg.slice(j + 2);
                    if (!hasAnyFlag(letters[j])) {
                        hasAllFlags = false;
                        break;
                    }
                    if ((letters[j + 1] && letters[j + 1] === '=') ||
                        next === '-' ||
                        (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
                        (letters[j + 1] && letters[j + 1].match(/\W/))) {
                        break;
                    }
                }
                return hasAllFlags;
            }
            function isUnknownOptionAsArg(arg) {
                return configuration['unknown-options-as-args'] && isUnknownOption(arg);
            }
            function isUnknownOption(arg) {
                if (arg.match(negative)) {
                    return false;
                }
                if (hasAllShortFlags(arg)) {
                    return false;
                }
                const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
                const normalFlag = /^-+([^=]+?)$/;
                const flagEndingInHyphen = /^-+([^=]+?)-$/;
                const flagEndingInDigits = /^-+([^=]+?\d+)$/;
                const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
                return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
            }
            function defaultValue(key) {
                if (!checkAllAliases(key, flags.bools) &&
                    !checkAllAliases(key, flags.counts) &&
                    `${key}` in defaults) {
                    return defaults[key];
                }
                else {
                    return defaultForType(guessType(key));
                }
            }
            function defaultForType(type) {
                const def = {
                    boolean: true,
                    string: '',
                    number: undefined,
                    array: []
                };
                return def[type];
            }
            function guessType(key) {
                let type = 'boolean';
                if (checkAllAliases(key, flags.strings))
                    type = 'string';
                else if (checkAllAliases(key, flags.numbers))
                    type = 'number';
                else if (checkAllAliases(key, flags.bools))
                    type = 'boolean';
                else if (checkAllAliases(key, flags.arrays))
                    type = 'array';
                return type;
            }
            function isUndefined(num) {
                return num === undefined;
            }
            function checkConfiguration() {
                Object.keys(flags.counts).find(key => {
                    if (checkAllAliases(key, flags.arrays)) {
                        error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key));
                        return true;
                    }
                    else if (checkAllAliases(key, flags.nargs)) {
                        error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key));
                        return true;
                    }
                    return false;
                });
            }
            return {
                aliases: Object.assign({}, flags.aliases),
                argv: Object.assign(argvReturn, argv),
                configuration: configuration,
                defaulted: Object.assign({}, defaulted),
                error: error,
                newAliases: Object.assign({}, newAliases)
            };
        }
    }
    function combineAliases(aliases) {
        const aliasArrays = [];
        const combined = Object.create(null);
        let change = true;
        Object.keys(aliases).forEach(function (key) {
            aliasArrays.push([].concat(aliases[key], key));
        });
        while (change) {
            change = false;
            for (let i = 0; i < aliasArrays.length; i++) {
                for (let ii = i + 1; ii < aliasArrays.length; ii++) {
                    const intersect = aliasArrays[i].filter(function (v) {
                        return aliasArrays[ii].indexOf(v) !== -1;
                    });
                    if (intersect.length) {
                        aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
                        aliasArrays.splice(ii, 1);
                        change = true;
                        break;
                    }
                }
            }
        }
        aliasArrays.forEach(function (aliasArray) {
            aliasArray = aliasArray.filter(function (v, i, self) {
                return self.indexOf(v) === i;
            });
            const lastAlias = aliasArray.pop();
            if (lastAlias !== undefined && typeof lastAlias === 'string') {
                combined[lastAlias] = aliasArray;
            }
        });
        return combined;
    }
    function increment(orig) {
        return orig !== undefined ? orig + 1 : 1;
    }
    function sanitizeKey(key) {
        if (key === '__proto__')
            return '___proto___';
        return key;
    }
    
    const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
        ? Number(process.env.YARGS_MIN_NODE_VERSION)
        : 10;
    if (process && process.version) {
        const major = Number(process.version.match(/v([^.]+)/)[1]);
        if (major < minNodeVersion) {
            throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
        }
    }
    const env = process ? process.env : {};
    const parser = new YargsParser({
        cwd: process.cwd,
        env: () => {
            return env;
        },
        format: util.format,
        normalize: path.normalize,
        resolve: path.resolve,
        require: (path) => {
            if (typeof require !== 'undefined') {
                return require(path);
            }
            else if (path.match(/\.json$/)) {
                return fs.readFileSync(path, 'utf8');
            }
            else {
                throw Error('only .json config files are supported in ESM');
            }
        }
    });
    const yargsParser = function Parser(args, opts) {
        const result = parser.parse(args.slice(), opts);
        return result.argv;
    };
    yargsParser.detailed = function (args, opts) {
        return parser.parse(args.slice(), opts);
    };
    yargsParser.camelCase = camelCase;
    yargsParser.decamelize = decamelize;
    yargsParser.looksLikeNumber = looksLikeNumber;
    
    module.exports = yargsParser;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":60,"fs":7,"path":59,"util":75}],100:[function(require,module,exports){
    (function (process,global,__dirname){(function (){
    'use strict';
    
    var assert = require('assert');
    
    class YError extends Error {
        constructor(msg) {
            super(msg || 'yargs error');
            this.name = 'YError';
            Error.captureStackTrace(this, YError);
        }
    }
    
    let previouslyVisitedConfigs = [];
    let shim$1;
    function applyExtends(config, cwd, mergeExtends, _shim) {
        shim$1 = _shim;
        let defaultConfig = {};
        if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
            if (typeof config.extends !== 'string')
                return defaultConfig;
            const isPath = /\.json|\..*rc$/.test(config.extends);
            let pathToDefault = null;
            if (!isPath) {
                try {
                    pathToDefault = require.resolve(config.extends);
                }
                catch (_err) {
                    return config;
                }
            }
            else {
                pathToDefault = getPathToDefaultConfig(cwd, config.extends);
            }
            checkForCircularExtends(pathToDefault);
            previouslyVisitedConfigs.push(pathToDefault);
            defaultConfig = isPath
                ? JSON.parse(shim$1.readFileSync(pathToDefault, 'utf8'))
                : require(config.extends);
            delete config.extends;
            defaultConfig = applyExtends(defaultConfig, shim$1.path.dirname(pathToDefault), mergeExtends, shim$1);
        }
        previouslyVisitedConfigs = [];
        return mergeExtends
            ? mergeDeep(defaultConfig, config)
            : Object.assign({}, defaultConfig, config);
    }
    function checkForCircularExtends(cfgPath) {
        if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
            throw new YError(`Circular extended configurations: '${cfgPath}'.`);
        }
    }
    function getPathToDefaultConfig(cwd, pathToExtend) {
        return shim$1.path.resolve(cwd, pathToExtend);
    }
    function mergeDeep(config1, config2) {
        const target = {};
        function isObject(obj) {
            return obj && typeof obj === 'object' && !Array.isArray(obj);
        }
        Object.assign(target, config1);
        for (const key of Object.keys(config2)) {
            if (isObject(config2[key]) && isObject(target[key])) {
                target[key] = mergeDeep(config1[key], config2[key]);
            }
            else {
                target[key] = config2[key];
            }
        }
        return target;
    }
    
    function parseCommand(cmd) {
        const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
        const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
        const bregex = /\.*[\][<>]/g;
        const firstCommand = splitCommand.shift();
        if (!firstCommand)
            throw new Error(`No command found in: ${cmd}`);
        const parsedCommand = {
            cmd: firstCommand.replace(bregex, ''),
            demanded: [],
            optional: [],
        };
        splitCommand.forEach((cmd, i) => {
            let variadic = false;
            cmd = cmd.replace(/\s/g, '');
            if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1)
                variadic = true;
            if (/^\[/.test(cmd)) {
                parsedCommand.optional.push({
                    cmd: cmd.replace(bregex, '').split('|'),
                    variadic,
                });
            }
            else {
                parsedCommand.demanded.push({
                    cmd: cmd.replace(bregex, '').split('|'),
                    variadic,
                });
            }
        });
        return parsedCommand;
    }
    
    const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    function argsert(arg1, arg2, arg3) {
        function parseArgs() {
            return typeof arg1 === 'object'
                ? [{ demanded: [], optional: [] }, arg1, arg2]
                : [
                    parseCommand(`cmd ${arg1}`),
                    arg2,
                    arg3,
                ];
        }
        try {
            let position = 0;
            const [parsed, callerArguments, _length] = parseArgs();
            const args = [].slice.call(callerArguments);
            while (args.length && args[args.length - 1] === undefined)
                args.pop();
            const length = _length || args.length;
            if (length < parsed.demanded.length) {
                throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
            }
            const totalCommands = parsed.demanded.length + parsed.optional.length;
            if (length > totalCommands) {
                throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
            }
            parsed.demanded.forEach(demanded => {
                const arg = args.shift();
                const observedType = guessType(arg);
                const matchingTypes = demanded.cmd.filter(type => type === observedType || type === '*');
                if (matchingTypes.length === 0)
                    argumentTypeError(observedType, demanded.cmd, position);
                position += 1;
            });
            parsed.optional.forEach(optional => {
                if (args.length === 0)
                    return;
                const arg = args.shift();
                const observedType = guessType(arg);
                const matchingTypes = optional.cmd.filter(type => type === observedType || type === '*');
                if (matchingTypes.length === 0)
                    argumentTypeError(observedType, optional.cmd, position);
                position += 1;
            });
        }
        catch (err) {
            console.warn(err.stack);
        }
    }
    function guessType(arg) {
        if (Array.isArray(arg)) {
            return 'array';
        }
        else if (arg === null) {
            return 'null';
        }
        return typeof arg;
    }
    function argumentTypeError(observedType, allowedTypes, position) {
        throw new YError(`Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`);
    }
    
    function isPromise(maybePromise) {
        return (!!maybePromise &&
            !!maybePromise.then &&
            typeof maybePromise.then === 'function');
    }
    
    function assertNotStrictEqual(actual, expected, shim, message) {
        shim.assert.notStrictEqual(actual, expected, message);
    }
    function assertSingleKey(actual, shim) {
        shim.assert.strictEqual(typeof actual, 'string');
    }
    function objectKeys(object) {
        return Object.keys(object);
    }
    
    function objFilter(original = {}, filter = () => true) {
        const obj = {};
        objectKeys(original).forEach(key => {
            if (filter(key, original[key])) {
                obj[key] = original[key];
            }
        });
        return obj;
    }
    
    function getProcessArgvBinIndex() {
        if (isBundledElectronApp())
            return 0;
        return 1;
    }
    function isBundledElectronApp() {
        return isElectronApp() && !process.defaultApp;
    }
    function isElectronApp() {
        return !!process.versions.electron;
    }
    function hideBin(argv) {
        return argv.slice(getProcessArgvBinIndex() + 1);
    }
    function getProcessArgvBin() {
        return process.argv[getProcessArgvBinIndex()];
    }
    
    var processArgv = /*#__PURE__*/Object.freeze({
      __proto__: null,
      hideBin: hideBin,
      getProcessArgvBin: getProcessArgvBin
    });
    
    class GlobalMiddleware {
        constructor(yargs) {
            this.globalMiddleware = [];
            this.frozens = [];
            this.yargs = yargs;
        }
        addMiddleware(callback, applyBeforeValidation, global = true) {
            argsert('<array|function> [boolean] [boolean]', [callback, applyBeforeValidation, global], arguments.length);
            if (Array.isArray(callback)) {
                for (let i = 0; i < callback.length; i++) {
                    if (typeof callback[i] !== 'function') {
                        throw Error('middleware must be a function');
                    }
                    const m = callback[i];
                    m.applyBeforeValidation = applyBeforeValidation;
                    m.global = global;
                }
                Array.prototype.push.apply(this.globalMiddleware, callback);
            }
            else if (typeof callback === 'function') {
                const m = callback;
                m.applyBeforeValidation = applyBeforeValidation;
                m.global = global;
                this.globalMiddleware.push(callback);
            }
            return this.yargs;
        }
        addCoerceMiddleware(callback, option) {
            const aliases = this.yargs.getAliases();
            this.globalMiddleware = this.globalMiddleware.filter(m => {
                const toCheck = [...(aliases[option] ? aliases[option] : []), option];
                if (!m.option)
                    return true;
                else
                    return !toCheck.includes(m.option);
            });
            callback.option = option;
            return this.addMiddleware(callback, true, true);
        }
        getMiddleware() {
            return this.globalMiddleware;
        }
        freeze() {
            this.frozens.push([...this.globalMiddleware]);
        }
        unfreeze() {
            const frozen = this.frozens.pop();
            if (frozen !== undefined)
                this.globalMiddleware = frozen;
        }
        reset() {
            this.globalMiddleware = this.globalMiddleware.filter(m => m.global);
        }
    }
    function commandMiddlewareFactory(commandMiddleware) {
        if (!commandMiddleware)
            return [];
        return commandMiddleware.map(middleware => {
            middleware.applyBeforeValidation = false;
            return middleware;
        });
    }
    function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
        return middlewares.reduce((acc, middleware) => {
            if (middleware.applyBeforeValidation !== beforeValidation) {
                return acc;
            }
            if (isPromise(acc)) {
                return acc
                    .then(initialObj => Promise.all([
                    initialObj,
                    middleware(initialObj, yargs),
                ]))
                    .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
            }
            else {
                const result = middleware(acc, yargs);
                return isPromise(result)
                    ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
                    : Object.assign(acc, result);
            }
        }, argv);
    }
    
    function maybeAsyncResult(getResult, resultHandler, errorHandler = (err) => {
        throw err;
    }) {
        try {
            const result = isFunction(getResult) ? getResult() : getResult;
            if (isPromise(result)) {
                return result.then((result) => {
                    return resultHandler(result);
                });
            }
            else {
                return resultHandler(result);
            }
        }
        catch (err) {
            return errorHandler(err);
        }
    }
    function isFunction(arg) {
        return typeof arg === 'function';
    }
    
    function whichModule(exported) {
        if (typeof require === 'undefined')
            return null;
        for (let i = 0, files = Object.keys(require.cache), mod; i < files.length; i++) {
            mod = require.cache[files[i]];
            if (mod.exports === exported)
                return mod;
        }
        return null;
    }
    
    const DEFAULT_MARKER = /(^\*)|(^\$0)/;
    function command(yargs, usage, validation, globalMiddleware, shim) {
        const self = {};
        let handlers = {};
        let aliasMap = {};
        let defaultCommand;
        self.addHandler = function addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
            let aliases = [];
            const middlewares = commandMiddlewareFactory(commandMiddleware);
            handler = handler || (() => { });
            if (Array.isArray(cmd)) {
                if (isCommandAndAliases(cmd)) {
                    [cmd, ...aliases] = cmd;
                }
                else {
                    for (const command of cmd) {
                        self.addHandler(command);
                    }
                }
            }
            else if (isCommandHandlerDefinition(cmd)) {
                let command = Array.isArray(cmd.command) || typeof cmd.command === 'string'
                    ? cmd.command
                    : moduleName(cmd);
                if (cmd.aliases)
                    command = [].concat(command).concat(cmd.aliases);
                self.addHandler(command, extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
                return;
            }
            else if (isCommandBuilderDefinition(builder)) {
                self.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
                return;
            }
            if (typeof cmd === 'string') {
                const parsedCommand = parseCommand(cmd);
                aliases = aliases.map(alias => parseCommand(alias).cmd);
                let isDefault = false;
                const parsedAliases = [parsedCommand.cmd].concat(aliases).filter(c => {
                    if (DEFAULT_MARKER.test(c)) {
                        isDefault = true;
                        return false;
                    }
                    return true;
                });
                if (parsedAliases.length === 0 && isDefault)
                    parsedAliases.push('$0');
                if (isDefault) {
                    parsedCommand.cmd = parsedAliases[0];
                    aliases = parsedAliases.slice(1);
                    cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
                }
                aliases.forEach(alias => {
                    aliasMap[alias] = parsedCommand.cmd;
                });
                if (description !== false) {
                    usage.command(cmd, description, isDefault, aliases, deprecated);
                }
                handlers[parsedCommand.cmd] = {
                    original: cmd,
                    description,
                    handler,
                    builder: builder || {},
                    middlewares,
                    deprecated,
                    demanded: parsedCommand.demanded,
                    optional: parsedCommand.optional,
                };
                if (isDefault)
                    defaultCommand = handlers[parsedCommand.cmd];
            }
        };
        self.addDirectory = function addDirectory(dir, context, req, callerFile, opts) {
            opts = opts || {};
            if (typeof opts.recurse !== 'boolean')
                opts.recurse = false;
            if (!Array.isArray(opts.extensions))
                opts.extensions = ['js'];
            const parentVisit = typeof opts.visit === 'function' ? opts.visit : (o) => o;
            opts.visit = function visit(obj, joined, filename) {
                const visited = parentVisit(obj, joined, filename);
                if (visited) {
                    if (~context.files.indexOf(joined))
                        return visited;
                    context.files.push(joined);
                    self.addHandler(visited);
                }
                return visited;
            };
            shim.requireDirectory({ require: req, filename: callerFile }, dir, opts);
        };
        function moduleName(obj) {
            const mod = whichModule(obj);
            if (!mod)
                throw new Error(`No command name given for module: ${shim.inspect(obj)}`);
            return commandFromFilename(mod.filename);
        }
        function commandFromFilename(filename) {
            return shim.path.basename(filename, shim.path.extname(filename));
        }
        function extractDesc({ describe, description, desc, }) {
            for (const test of [describe, description, desc]) {
                if (typeof test === 'string' || test === false)
                    return test;
                assertNotStrictEqual(test, true, shim);
            }
            return false;
        }
        self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap));
        self.getCommandHandlers = () => handlers;
        self.hasDefaultCommand = () => !!defaultCommand;
        self.runCommand = function runCommand(command, yargs, parsed, commandIndex = 0, helpOnly = false) {
            let aliases = parsed.aliases;
            const commandHandler = handlers[command] || handlers[aliasMap[command]] || defaultCommand;
            const currentContext = yargs.getContext();
            let numFiles = currentContext.files.length;
            const parentCommands = currentContext.commands.slice();
            let innerArgv = parsed.argv;
            let positionalMap = {};
            if (command) {
                currentContext.commands.push(command);
                currentContext.fullCommands.push(commandHandler.original);
            }
            const builder = commandHandler.builder;
            if (isCommandBuilderCallback(builder)) {
                const builderOutput = builder(yargs.reset(parsed.aliases));
                const innerYargs = isYargsInstance(builderOutput) ? builderOutput : yargs;
                if (!command)
                    innerYargs.getUsageInstance().unfreeze();
                if (shouldUpdateUsage(innerYargs)) {
                    innerYargs
                        .getUsageInstance()
                        .usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
                }
                innerArgv = innerYargs._parseArgs(null, undefined, true, commandIndex, helpOnly);
                aliases = innerYargs.parsed.aliases;
            }
            else if (isCommandBuilderOptionDefinitions(builder)) {
                const innerYargs = yargs.reset(parsed.aliases);
                if (!command)
                    innerYargs.getUsageInstance().unfreeze();
                if (shouldUpdateUsage(innerYargs)) {
                    innerYargs
                        .getUsageInstance()
                        .usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
                }
                Object.keys(commandHandler.builder).forEach(key => {
                    innerYargs.option(key, builder[key]);
                });
                innerArgv = innerYargs._parseArgs(null, undefined, true, commandIndex, helpOnly);
                aliases = innerYargs.parsed.aliases;
            }
            if (!yargs._hasOutput()) {
                positionalMap = populatePositionals(commandHandler, innerArgv, currentContext);
            }
            if (helpOnly)
                return innerArgv;
            const middlewares = globalMiddleware
                .getMiddleware()
                .slice(0)
                .concat(commandHandler.middlewares);
            innerArgv = applyMiddleware(innerArgv, yargs, middlewares, true);
            if (!yargs._hasOutput()) {
                const validation = yargs._runValidation(aliases, positionalMap, yargs.parsed.error, !command);
                innerArgv = maybeAsyncResult(innerArgv, result => {
                    validation(result);
                    return result;
                });
            }
            if (commandHandler.handler && !yargs._hasOutput()) {
                yargs._setHasOutput();
                const populateDoubleDash = !!yargs.getOptions().configuration['populate--'];
                yargs._postProcess(innerArgv, populateDoubleDash, false, false);
                innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
                innerArgv = maybeAsyncResult(innerArgv, result => {
                    const handlerResult = commandHandler.handler(result);
                    if (isPromise(handlerResult)) {
                        return handlerResult.then(() => result);
                    }
                    else {
                        return result;
                    }
                });
                yargs.getUsageInstance().cacheHelpMessage();
                if (isPromise(innerArgv) && !yargs._hasParseCallback()) {
                    innerArgv.catch(error => {
                        try {
                            yargs.getUsageInstance().fail(null, error);
                        }
                        catch (_err) {
                        }
                    });
                }
            }
            if (command) {
                currentContext.commands.pop();
                currentContext.fullCommands.pop();
            }
            numFiles = currentContext.files.length - numFiles;
            if (numFiles > 0)
                currentContext.files.splice(numFiles * -1, numFiles);
            return innerArgv;
        };
        function shouldUpdateUsage(yargs) {
            return (!yargs.getUsageInstance().getUsageDisabled() &&
                yargs.getUsageInstance().getUsage().length === 0);
        }
        function usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
            const c = DEFAULT_MARKER.test(commandHandler.original)
                ? commandHandler.original.replace(DEFAULT_MARKER, '').trim()
                : commandHandler.original;
            const pc = parentCommands.filter(c => {
                return !DEFAULT_MARKER.test(c);
            });
            pc.push(c);
            return `$0 ${pc.join(' ')}`;
        }
        self.runDefaultBuilderOn = function (yargs) {
            assertNotStrictEqual(defaultCommand, undefined, shim);
            if (shouldUpdateUsage(yargs)) {
                const commandString = DEFAULT_MARKER.test(defaultCommand.original)
                    ? defaultCommand.original
                    : defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ');
                yargs.getUsageInstance().usage(commandString, defaultCommand.description);
            }
            const builder = defaultCommand.builder;
            if (isCommandBuilderCallback(builder)) {
                builder(yargs);
            }
            else if (!isCommandBuilderDefinition(builder)) {
                Object.keys(builder).forEach(key => {
                    yargs.option(key, builder[key]);
                });
            }
        };
        function populatePositionals(commandHandler, argv, context) {
            argv._ = argv._.slice(context.commands.length);
            const demanded = commandHandler.demanded.slice(0);
            const optional = commandHandler.optional.slice(0);
            const positionalMap = {};
            validation.positionalCount(demanded.length, argv._.length);
            while (demanded.length) {
                const demand = demanded.shift();
                populatePositional(demand, argv, positionalMap);
            }
            while (optional.length) {
                const maybe = optional.shift();
                populatePositional(maybe, argv, positionalMap);
            }
            argv._ = context.commands.concat(argv._.map(a => '' + a));
            postProcessPositionals(argv, positionalMap, self.cmdToParseOptions(commandHandler.original));
            return positionalMap;
        }
        function populatePositional(positional, argv, positionalMap) {
            const cmd = positional.cmd[0];
            if (positional.variadic) {
                positionalMap[cmd] = argv._.splice(0).map(String);
            }
            else {
                if (argv._.length)
                    positionalMap[cmd] = [String(argv._.shift())];
            }
        }
        function postProcessPositionals(argv, positionalMap, parseOptions) {
            const options = Object.assign({}, yargs.getOptions());
            options.default = Object.assign(parseOptions.default, options.default);
            for (const key of Object.keys(parseOptions.alias)) {
                options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
            }
            options.array = options.array.concat(parseOptions.array);
            options.config = {};
            const unparsed = [];
            Object.keys(positionalMap).forEach(key => {
                positionalMap[key].map(value => {
                    if (options.configuration['unknown-options-as-args'])
                        options.key[key] = true;
                    unparsed.push(`--${key}`);
                    unparsed.push(value);
                });
            });
            if (!unparsed.length)
                return;
            const config = Object.assign({}, options.configuration, {
                'populate--': false,
            });
            const parsed = shim.Parser.detailed(unparsed, Object.assign({}, options, {
                configuration: config,
            }));
            if (parsed.error) {
                yargs.getUsageInstance().fail(parsed.error.message, parsed.error);
            }
            else {
                const positionalKeys = Object.keys(positionalMap);
                Object.keys(positionalMap).forEach(key => {
                    positionalKeys.push(...parsed.aliases[key]);
                });
                Object.keys(parsed.argv).forEach(key => {
                    if (positionalKeys.indexOf(key) !== -1) {
                        if (!positionalMap[key])
                            positionalMap[key] = parsed.argv[key];
                        argv[key] = parsed.argv[key];
                    }
                });
            }
        }
        self.cmdToParseOptions = function (cmdString) {
            const parseOptions = {
                array: [],
                default: {},
                alias: {},
                demand: {},
            };
            const parsed = parseCommand(cmdString);
            parsed.demanded.forEach(d => {
                const [cmd, ...aliases] = d.cmd;
                if (d.variadic) {
                    parseOptions.array.push(cmd);
                    parseOptions.default[cmd] = [];
                }
                parseOptions.alias[cmd] = aliases;
                parseOptions.demand[cmd] = true;
            });
            parsed.optional.forEach(o => {
                const [cmd, ...aliases] = o.cmd;
                if (o.variadic) {
                    parseOptions.array.push(cmd);
                    parseOptions.default[cmd] = [];
                }
                parseOptions.alias[cmd] = aliases;
            });
            return parseOptions;
        };
        self.reset = () => {
            handlers = {};
            aliasMap = {};
            defaultCommand = undefined;
            return self;
        };
        const frozens = [];
        self.freeze = () => {
            frozens.push({
                handlers,
                aliasMap,
                defaultCommand,
            });
        };
        self.unfreeze = () => {
            const frozen = frozens.pop();
            assertNotStrictEqual(frozen, undefined, shim);
            ({ handlers, aliasMap, defaultCommand } = frozen);
        };
        return self;
    }
    function isCommandBuilderDefinition(builder) {
        return (typeof builder === 'object' &&
            !!builder.builder &&
            typeof builder.handler === 'function');
    }
    function isCommandAndAliases(cmd) {
        if (cmd.every(c => typeof c === 'string')) {
            return true;
        }
        else {
            return false;
        }
    }
    function isCommandBuilderCallback(builder) {
        return typeof builder === 'function';
    }
    function isCommandBuilderOptionDefinitions(builder) {
        return typeof builder === 'object';
    }
    function isCommandHandlerDefinition(cmd) {
        return typeof cmd === 'object' && !Array.isArray(cmd);
    }
    
    function setBlocking(blocking) {
        if (typeof process === 'undefined')
            return;
        [process.stdout, process.stderr].forEach(_stream => {
            const stream = _stream;
            if (stream._handle &&
                stream.isTTY &&
                typeof stream._handle.setBlocking === 'function') {
                stream._handle.setBlocking(blocking);
            }
        });
    }
    
    function isBoolean(fail) {
        return typeof fail === 'boolean';
    }
    function usage(yargs, y18n, shim) {
        const __ = y18n.__;
        const self = {};
        const fails = [];
        self.failFn = function failFn(f) {
            fails.push(f);
        };
        let failMessage = null;
        let showHelpOnFail = true;
        self.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
            function parseFunctionArgs() {
                return typeof arg1 === 'string' ? [true, arg1] : [arg1, arg2];
            }
            const [enabled, message] = parseFunctionArgs();
            failMessage = message;
            showHelpOnFail = enabled;
            return self;
        };
        let failureOutput = false;
        self.fail = function fail(msg, err) {
            const logger = yargs._getLoggerInstance();
            if (fails.length) {
                for (let i = fails.length - 1; i >= 0; --i) {
                    const fail = fails[i];
                    if (isBoolean(fail)) {
                        if (err)
                            throw err;
                        else if (msg)
                            throw Error(msg);
                    }
                    else {
                        fail(msg, err, self);
                    }
                }
            }
            else {
                if (yargs.getExitProcess())
                    setBlocking(true);
                if (!failureOutput) {
                    failureOutput = true;
                    if (showHelpOnFail) {
                        yargs.showHelp('error');
                        logger.error();
                    }
                    if (msg || err)
                        logger.error(msg || err);
                    if (failMessage) {
                        if (msg || err)
                            logger.error('');
                        logger.error(failMessage);
                    }
                }
                err = err || new YError(msg);
                if (yargs.getExitProcess()) {
                    return yargs.exit(1);
                }
                else if (yargs._hasParseCallback()) {
                    return yargs.exit(1, err);
                }
                else {
                    throw err;
                }
            }
        };
        let usages = [];
        let usageDisabled = false;
        self.usage = (msg, description) => {
            if (msg === null) {
                usageDisabled = true;
                usages = [];
                return self;
            }
            usageDisabled = false;
            usages.push([msg, description || '']);
            return self;
        };
        self.getUsage = () => {
            return usages;
        };
        self.getUsageDisabled = () => {
            return usageDisabled;
        };
        self.getPositionalGroupName = () => {
            return __('Positionals:');
        };
        let examples = [];
        self.example = (cmd, description) => {
            examples.push([cmd, description || '']);
        };
        let commands = [];
        self.command = function command(cmd, description, isDefault, aliases, deprecated = false) {
            if (isDefault) {
                commands = commands.map(cmdArray => {
                    cmdArray[2] = false;
                    return cmdArray;
                });
            }
            commands.push([cmd, description || '', isDefault, aliases, deprecated]);
        };
        self.getCommands = () => commands;
        let descriptions = {};
        self.describe = function describe(keyOrKeys, desc) {
            if (Array.isArray(keyOrKeys)) {
                keyOrKeys.forEach(k => {
                    self.describe(k, desc);
                });
            }
            else if (typeof keyOrKeys === 'object') {
                Object.keys(keyOrKeys).forEach(k => {
                    self.describe(k, keyOrKeys[k]);
                });
            }
            else {
                descriptions[keyOrKeys] = desc;
            }
        };
        self.getDescriptions = () => descriptions;
        let epilogs = [];
        self.epilog = msg => {
            epilogs.push(msg);
        };
        let wrapSet = false;
        let wrap;
        self.wrap = cols => {
            wrapSet = true;
            wrap = cols;
        };
        function getWrap() {
            if (!wrapSet) {
                wrap = windowWidth();
                wrapSet = true;
            }
            return wrap;
        }
        const deferY18nLookupPrefix = '__yargsString__:';
        self.deferY18nLookup = str => deferY18nLookupPrefix + str;
        self.help = function help() {
            if (cachedHelpMessage)
                return cachedHelpMessage;
            normalizeAliases();
            const base$0 = yargs.customScriptName
                ? yargs.$0
                : shim.path.basename(yargs.$0);
            const demandedOptions = yargs.getDemandedOptions();
            const demandedCommands = yargs.getDemandedCommands();
            const deprecatedOptions = yargs.getDeprecatedOptions();
            const groups = yargs.getGroups();
            const options = yargs.getOptions();
            let keys = [];
            keys = keys.concat(Object.keys(descriptions));
            keys = keys.concat(Object.keys(demandedOptions));
            keys = keys.concat(Object.keys(demandedCommands));
            keys = keys.concat(Object.keys(options.default));
            keys = keys.filter(filterHiddenOptions);
            keys = Object.keys(keys.reduce((acc, key) => {
                if (key !== '_')
                    acc[key] = true;
                return acc;
            }, {}));
            const theWrap = getWrap();
            const ui = shim.cliui({
                width: theWrap,
                wrap: !!theWrap,
            });
            if (!usageDisabled) {
                if (usages.length) {
                    usages.forEach(usage => {
                        ui.div(`${usage[0].replace(/\$0/g, base$0)}`);
                        if (usage[1]) {
                            ui.div({ text: `${usage[1]}`, padding: [1, 0, 0, 0] });
                        }
                    });
                    ui.div();
                }
                else if (commands.length) {
                    let u = null;
                    if (demandedCommands._) {
                        u = `${base$0} <${__('command')}>\n`;
                    }
                    else {
                        u = `${base$0} [${__('command')}]\n`;
                    }
                    ui.div(`${u}`);
                }
            }
            if (commands.length > 1 || (commands.length === 1 && !commands[0][2])) {
                ui.div(__('Commands:'));
                const context = yargs.getContext();
                const parentCommands = context.commands.length
                    ? `${context.commands.join(' ')} `
                    : '';
                if (yargs.getParserConfiguration()['sort-commands'] === true) {
                    commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
                }
                commands.forEach(command => {
                    const commandString = `${base$0} ${parentCommands}${command[0].replace(/^\$0 ?/, '')}`;
                    ui.span({
                        text: commandString,
                        padding: [0, 2, 0, 2],
                        width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4,
                    }, { text: command[1] });
                    const hints = [];
                    if (command[2])
                        hints.push(`[${__('default')}]`);
                    if (command[3] && command[3].length) {
                        hints.push(`[${__('aliases:')} ${command[3].join(', ')}]`);
                    }
                    if (command[4]) {
                        if (typeof command[4] === 'string') {
                            hints.push(`[${__('deprecated: %s', command[4])}]`);
                        }
                        else {
                            hints.push(`[${__('deprecated')}]`);
                        }
                    }
                    if (hints.length) {
                        ui.div({
                            text: hints.join(' '),
                            padding: [0, 0, 0, 2],
                            align: 'right',
                        });
                    }
                    else {
                        ui.div();
                    }
                });
                ui.div();
            }
            const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || []);
            keys = keys.filter(key => !yargs.parsed.newAliases[key] &&
                aliasKeys.every(alias => (options.alias[alias] || []).indexOf(key) === -1));
            const defaultGroup = __('Options:');
            if (!groups[defaultGroup])
                groups[defaultGroup] = [];
            addUngroupedKeys(keys, options.alias, groups, defaultGroup);
            const isLongSwitch = (sw) => /^--/.test(getText(sw));
            const displayedGroups = Object.keys(groups)
                .filter(groupName => groups[groupName].length > 0)
                .map(groupName => {
                const normalizedKeys = groups[groupName]
                    .filter(filterHiddenOptions)
                    .map(key => {
                    if (~aliasKeys.indexOf(key))
                        return key;
                    for (let i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== undefined; i++) {
                        if (~(options.alias[aliasKey] || []).indexOf(key))
                            return aliasKey;
                    }
                    return key;
                });
                return { groupName, normalizedKeys };
            })
                .filter(({ normalizedKeys }) => normalizedKeys.length > 0)
                .map(({ groupName, normalizedKeys }) => {
                const switches = normalizedKeys.reduce((acc, key) => {
                    acc[key] = [key]
                        .concat(options.alias[key] || [])
                        .map(sw => {
                        if (groupName === self.getPositionalGroupName())
                            return sw;
                        else {
                            return ((/^[0-9]$/.test(sw)
                                ? ~options.boolean.indexOf(key)
                                    ? '-'
                                    : '--'
                                : sw.length > 1
                                    ? '--'
                                    : '-') + sw);
                        }
                    })
                        .sort((sw1, sw2) => isLongSwitch(sw1) === isLongSwitch(sw2)
                        ? 0
                        : isLongSwitch(sw1)
                            ? 1
                            : -1)
                        .join(', ');
                    return acc;
                }, {});
                return { groupName, normalizedKeys, switches };
            });
            const shortSwitchesUsed = displayedGroups
                .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
                .some(({ normalizedKeys, switches }) => !normalizedKeys.every(key => isLongSwitch(switches[key])));
            if (shortSwitchesUsed) {
                displayedGroups
                    .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
                    .forEach(({ normalizedKeys, switches }) => {
                    normalizedKeys.forEach(key => {
                        if (isLongSwitch(switches[key])) {
                            switches[key] = addIndentation(switches[key], '-x, '.length);
                        }
                    });
                });
            }
            displayedGroups.forEach(({ groupName, normalizedKeys, switches }) => {
                ui.div(groupName);
                normalizedKeys.forEach(key => {
                    const kswitch = switches[key];
                    let desc = descriptions[key] || '';
                    let type = null;
                    if (~desc.lastIndexOf(deferY18nLookupPrefix))
                        desc = __(desc.substring(deferY18nLookupPrefix.length));
                    if (~options.boolean.indexOf(key))
                        type = `[${__('boolean')}]`;
                    if (~options.count.indexOf(key))
                        type = `[${__('count')}]`;
                    if (~options.string.indexOf(key))
                        type = `[${__('string')}]`;
                    if (~options.normalize.indexOf(key))
                        type = `[${__('string')}]`;
                    if (~options.array.indexOf(key))
                        type = `[${__('array')}]`;
                    if (~options.number.indexOf(key))
                        type = `[${__('number')}]`;
                    const deprecatedExtra = (deprecated) => typeof deprecated === 'string'
                        ? `[${__('deprecated: %s', deprecated)}]`
                        : `[${__('deprecated')}]`;
                    const extra = [
                        key in deprecatedOptions
                            ? deprecatedExtra(deprecatedOptions[key])
                            : null,
                        type,
                        key in demandedOptions ? `[${__('required')}]` : null,
                        options.choices && options.choices[key]
                            ? `[${__('choices:')} ${self.stringifiedValues(options.choices[key])}]`
                            : null,
                        defaultString(options.default[key], options.defaultDescription[key]),
                    ]
                        .filter(Boolean)
                        .join(' ');
                    ui.span({
                        text: getText(kswitch),
                        padding: [0, 2, 0, 2 + getIndentation(kswitch)],
                        width: maxWidth(switches, theWrap) + 4,
                    }, desc);
                    if (extra)
                        ui.div({ text: extra, padding: [0, 0, 0, 2], align: 'right' });
                    else
                        ui.div();
                });
                ui.div();
            });
            if (examples.length) {
                ui.div(__('Examples:'));
                examples.forEach(example => {
                    example[0] = example[0].replace(/\$0/g, base$0);
                });
                examples.forEach(example => {
                    if (example[1] === '') {
                        ui.div({
                            text: example[0],
                            padding: [0, 2, 0, 2],
                        });
                    }
                    else {
                        ui.div({
                            text: example[0],
                            padding: [0, 2, 0, 2],
                            width: maxWidth(examples, theWrap) + 4,
                        }, {
                            text: example[1],
                        });
                    }
                });
                ui.div();
            }
            if (epilogs.length > 0) {
                const e = epilogs
                    .map(epilog => epilog.replace(/\$0/g, base$0))
                    .join('\n');
                ui.div(`${e}\n`);
            }
            return ui.toString().replace(/\s*$/, '');
        };
        function maxWidth(table, theWrap, modifier) {
            let width = 0;
            if (!Array.isArray(table)) {
                table = Object.values(table).map(v => [v]);
            }
            table.forEach(v => {
                width = Math.max(shim.stringWidth(modifier ? `${modifier} ${getText(v[0])}` : getText(v[0])) + getIndentation(v[0]), width);
            });
            if (theWrap)
                width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
            return width;
        }
        function normalizeAliases() {
            const demandedOptions = yargs.getDemandedOptions();
            const options = yargs.getOptions();
            (Object.keys(options.alias) || []).forEach(key => {
                options.alias[key].forEach(alias => {
                    if (descriptions[alias])
                        self.describe(key, descriptions[alias]);
                    if (alias in demandedOptions)
                        yargs.demandOption(key, demandedOptions[alias]);
                    if (~options.boolean.indexOf(alias))
                        yargs.boolean(key);
                    if (~options.count.indexOf(alias))
                        yargs.count(key);
                    if (~options.string.indexOf(alias))
                        yargs.string(key);
                    if (~options.normalize.indexOf(alias))
                        yargs.normalize(key);
                    if (~options.array.indexOf(alias))
                        yargs.array(key);
                    if (~options.number.indexOf(alias))
                        yargs.number(key);
                });
            });
        }
        let cachedHelpMessage;
        self.cacheHelpMessage = function () {
            cachedHelpMessage = this.help();
        };
        self.clearCachedHelpMessage = function () {
            cachedHelpMessage = undefined;
        };
        self.hasCachedHelpMessage = function () {
            return !!cachedHelpMessage;
        };
        function addUngroupedKeys(keys, aliases, groups, defaultGroup) {
            let groupedKeys = [];
            let toCheck = null;
            Object.keys(groups).forEach(group => {
                groupedKeys = groupedKeys.concat(groups[group]);
            });
            keys.forEach(key => {
                toCheck = [key].concat(aliases[key]);
                if (!toCheck.some(k => groupedKeys.indexOf(k) !== -1)) {
                    groups[defaultGroup].push(key);
                }
            });
            return groupedKeys;
        }
        function filterHiddenOptions(key) {
            return (yargs.getOptions().hiddenOptions.indexOf(key) < 0 ||
                yargs.parsed.argv[yargs.getOptions().showHiddenOpt]);
        }
        self.showHelp = (level) => {
            const logger = yargs._getLoggerInstance();
            if (!level)
                level = 'error';
            const emit = typeof level === 'function' ? level : logger[level];
            emit(self.help());
        };
        self.functionDescription = fn => {
            const description = fn.name
                ? shim.Parser.decamelize(fn.name, '-')
                : __('generated-value');
            return ['(', description, ')'].join('');
        };
        self.stringifiedValues = function stringifiedValues(values, separator) {
            let string = '';
            const sep = separator || ', ';
            const array = [].concat(values);
            if (!values || !array.length)
                return string;
            array.forEach(value => {
                if (string.length)
                    string += sep;
                string += JSON.stringify(value);
            });
            return string;
        };
        function defaultString(value, defaultDescription) {
            let string = `[${__('default:')} `;
            if (value === undefined && !defaultDescription)
                return null;
            if (defaultDescription) {
                string += defaultDescription;
            }
            else {
                switch (typeof value) {
                    case 'string':
                        string += `"${value}"`;
                        break;
                    case 'object':
                        string += JSON.stringify(value);
                        break;
                    default:
                        string += value;
                }
            }
            return `${string}]`;
        }
        function windowWidth() {
            const maxWidth = 80;
            if (shim.process.stdColumns) {
                return Math.min(maxWidth, shim.process.stdColumns);
            }
            else {
                return maxWidth;
            }
        }
        let version = null;
        self.version = ver => {
            version = ver;
        };
        self.showVersion = level => {
            const logger = yargs._getLoggerInstance();
            if (!level)
                level = 'error';
            const emit = typeof level === 'function' ? level : logger[level];
            emit(version);
        };
        self.reset = function reset(localLookup) {
            failMessage = null;
            failureOutput = false;
            usages = [];
            usageDisabled = false;
            epilogs = [];
            examples = [];
            commands = [];
            descriptions = objFilter(descriptions, k => !localLookup[k]);
            return self;
        };
        const frozens = [];
        self.freeze = function freeze() {
            frozens.push({
                failMessage,
                failureOutput,
                usages,
                usageDisabled,
                epilogs,
                examples,
                commands,
                descriptions,
            });
        };
        self.unfreeze = function unfreeze() {
            const frozen = frozens.pop();
            if (!frozen)
                return;
            ({
                failMessage,
                failureOutput,
                usages,
                usageDisabled,
                epilogs,
                examples,
                commands,
                descriptions,
            } = frozen);
        };
        return self;
    }
    function isIndentedText(text) {
        return typeof text === 'object';
    }
    function addIndentation(text, indent) {
        return isIndentedText(text)
            ? { text: text.text, indentation: text.indentation + indent }
            : { text, indentation: indent };
    }
    function getIndentation(text) {
        return isIndentedText(text) ? text.indentation : 0;
    }
    function getText(text) {
        return isIndentedText(text) ? text.text : text;
    }
    
    const completionShTemplate = `###-begin-{{app_name}}-completions-###
    #
    # yargs command completion script
    #
    # Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
    #    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
    #
    _yargs_completions()
    {
        local cur_word args type_list
    
        cur_word="\${COMP_WORDS[COMP_CWORD]}"
        args=("\${COMP_WORDS[@]}")
    
        # ask yargs to generate completions.
        type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")
    
        COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )
    
        # if no match was found, fall back to filename completion
        if [ \${#COMPREPLY[@]} -eq 0 ]; then
          COMPREPLY=()
        fi
    
        return 0
    }
    complete -o default -F _yargs_completions {{app_name}}
    ###-end-{{app_name}}-completions-###
    `;
    const completionZshTemplate = `#compdef {{app_name}}
    ###-begin-{{app_name}}-completions-###
    #
    # yargs command completion script
    #
    # Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
    #    or {{app_path}} {{completion_command}} >> ~/.zsh_profile on OSX.
    #
    _{{app_name}}_yargs_completions()
    {
      local reply
      local si=$IFS
      IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
      IFS=$si
      _describe 'values' reply
    }
    compdef _{{app_name}}_yargs_completions {{app_name}}
    ###-end-{{app_name}}-completions-###
    `;
    
    class Completion {
        constructor(yargs, usage, command, shim) {
            var _a, _b, _c;
            this.yargs = yargs;
            this.usage = usage;
            this.command = command;
            this.shim = shim;
            this.completionKey = 'get-yargs-completions';
            this.aliases = null;
            this.customCompletionFunction = null;
            this.zshShell =
                (_c = (((_a = this.shim.getEnv('SHELL')) === null || _a === void 0 ? void 0 : _a.includes('zsh')) ||
                    ((_b = this.shim.getEnv('ZSH_NAME')) === null || _b === void 0 ? void 0 : _b.includes('zsh')))) !== null && _c !== void 0 ? _c : false;
        }
        defaultCompletion(args, argv, current, done) {
            const handlers = this.command.getCommandHandlers();
            for (let i = 0, ii = args.length; i < ii; ++i) {
                if (handlers[args[i]] && handlers[args[i]].builder) {
                    const builder = handlers[args[i]].builder;
                    if (isCommandBuilderCallback(builder)) {
                        const y = this.yargs.reset();
                        builder(y);
                        return y.argv;
                    }
                }
            }
            const completions = [];
            this.commandCompletions(completions, args, current);
            this.optionCompletions(completions, args, argv, current);
            done(null, completions);
        }
        commandCompletions(completions, args, current) {
            const parentCommands = this.yargs.getContext().commands;
            if (!current.match(/^-/) &&
                parentCommands[parentCommands.length - 1] !== current) {
                this.usage.getCommands().forEach(usageCommand => {
                    const commandName = parseCommand(usageCommand[0]).cmd;
                    if (args.indexOf(commandName) === -1) {
                        if (!this.zshShell) {
                            completions.push(commandName);
                        }
                        else {
                            const desc = usageCommand[1] || '';
                            completions.push(commandName.replace(/:/g, '\\:') + ':' + desc);
                        }
                    }
                });
            }
        }
        optionCompletions(completions, args, argv, current) {
            if (current.match(/^-/) || (current === '' && completions.length === 0)) {
                const options = this.yargs.getOptions();
                const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
                Object.keys(options.key).forEach(key => {
                    const negable = !!options.configuration['boolean-negation'] &&
                        options.boolean.includes(key);
                    const isPositionalKey = positionalKeys.includes(key);
                    if (!isPositionalKey &&
                        !this.argsContainKey(args, argv, key, negable)) {
                        this.completeOptionKey(key, completions, current);
                        if (negable && !!options.default[key])
                            this.completeOptionKey(`no-${key}`, completions, current);
                    }
                });
            }
        }
        argsContainKey(args, argv, key, negable) {
            if (args.indexOf(`--${key}`) !== -1)
                return true;
            if (negable && args.indexOf(`--no-${key}`) !== -1)
                return true;
            if (this.aliases) {
                for (const alias of this.aliases[key]) {
                    if (argv[alias] !== undefined)
                        return true;
                }
            }
            return false;
        }
        completeOptionKey(key, completions, current) {
            const descs = this.usage.getDescriptions();
            const startsByTwoDashes = (s) => /^--/.test(s);
            const isShortOption = (s) => /^[^0-9]$/.test(s);
            const dashes = !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';
            if (!this.zshShell) {
                completions.push(dashes + key);
            }
            else {
                const desc = descs[key] || '';
                completions.push(dashes +
                    `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`);
            }
        }
        customCompletion(args, argv, current, done) {
            assertNotStrictEqual(this.customCompletionFunction, null, this.shim);
            if (isSyncCompletionFunction(this.customCompletionFunction)) {
                const result = this.customCompletionFunction(current, argv);
                if (isPromise(result)) {
                    return result
                        .then(list => {
                        this.shim.process.nextTick(() => {
                            done(null, list);
                        });
                    })
                        .catch(err => {
                        this.shim.process.nextTick(() => {
                            done(err, undefined);
                        });
                    });
                }
                return done(null, result);
            }
            else if (isFallbackCompletionFunction(this.customCompletionFunction)) {
                return this.customCompletionFunction(current, argv, (onCompleted = done) => this.defaultCompletion(args, argv, current, onCompleted), completions => {
                    done(null, completions);
                });
            }
            else {
                return this.customCompletionFunction(current, argv, completions => {
                    done(null, completions);
                });
            }
        }
        getCompletion(args, done) {
            const current = args.length ? args[args.length - 1] : '';
            const argv = this.yargs.parse(args, true);
            const completionFunction = this.customCompletionFunction
                ? (argv) => this.customCompletion(args, argv, current, done)
                : (argv) => this.defaultCompletion(args, argv, current, done);
            return isPromise(argv)
                ? argv.then(completionFunction)
                : completionFunction(argv);
        }
        generateCompletionScript($0, cmd) {
            let script = this.zshShell
                ? completionZshTemplate
                : completionShTemplate;
            const name = this.shim.path.basename($0);
            if ($0.match(/\.js$/))
                $0 = `./${$0}`;
            script = script.replace(/{{app_name}}/g, name);
            script = script.replace(/{{completion_command}}/g, cmd);
            return script.replace(/{{app_path}}/g, $0);
        }
        registerFunction(fn) {
            this.customCompletionFunction = fn;
        }
        setParsed(parsed) {
            this.aliases = parsed.aliases;
        }
    }
    function completion(yargs, usage, command, shim) {
        return new Completion(yargs, usage, command, shim);
    }
    function isSyncCompletionFunction(completionFunction) {
        return completionFunction.length < 3;
    }
    function isFallbackCompletionFunction(completionFunction) {
        return completionFunction.length > 3;
    }
    
    function levenshtein(a, b) {
        if (a.length === 0)
            return b.length;
        if (b.length === 0)
            return a.length;
        const matrix = [];
        let i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        let j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    }
    
    const specialKeys = ['$0', '--', '_'];
    function validation(yargs, usage, y18n, shim) {
        const __ = y18n.__;
        const __n = y18n.__n;
        const self = {};
        self.nonOptionCount = function nonOptionCount(argv) {
            const demandedCommands = yargs.getDemandedCommands();
            const positionalCount = argv._.length + (argv['--'] ? argv['--'].length : 0);
            const _s = positionalCount - yargs.getContext().commands.length;
            if (demandedCommands._ &&
                (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
                if (_s < demandedCommands._.min) {
                    if (demandedCommands._.minMsg !== undefined) {
                        usage.fail(demandedCommands._.minMsg
                            ? demandedCommands._.minMsg
                                .replace(/\$0/g, _s.toString())
                                .replace(/\$1/, demandedCommands._.min.toString())
                            : null);
                    }
                    else {
                        usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', _s, _s.toString(), demandedCommands._.min.toString()));
                    }
                }
                else if (_s > demandedCommands._.max) {
                    if (demandedCommands._.maxMsg !== undefined) {
                        usage.fail(demandedCommands._.maxMsg
                            ? demandedCommands._.maxMsg
                                .replace(/\$0/g, _s.toString())
                                .replace(/\$1/, demandedCommands._.max.toString())
                            : null);
                    }
                    else {
                        usage.fail(__n('Too many non-option arguments: got %s, maximum of %s', 'Too many non-option arguments: got %s, maximum of %s', _s, _s.toString(), demandedCommands._.max.toString()));
                    }
                }
            }
        };
        self.positionalCount = function positionalCount(required, observed) {
            if (observed < required) {
                usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', observed, observed + '', required + ''));
            }
        };
        self.requiredArguments = function requiredArguments(argv, demandedOptions) {
            let missing = null;
            for (const key of Object.keys(demandedOptions)) {
                if (!Object.prototype.hasOwnProperty.call(argv, key) ||
                    typeof argv[key] === 'undefined') {
                    missing = missing || {};
                    missing[key] = demandedOptions[key];
                }
            }
            if (missing) {
                const customMsgs = [];
                for (const key of Object.keys(missing)) {
                    const msg = missing[key];
                    if (msg && customMsgs.indexOf(msg) < 0) {
                        customMsgs.push(msg);
                    }
                }
                const customMsg = customMsgs.length ? `\n${customMsgs.join('\n')}` : '';
                usage.fail(__n('Missing required argument: %s', 'Missing required arguments: %s', Object.keys(missing).length, Object.keys(missing).join(', ') + customMsg));
            }
        };
        self.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand, checkPositionals = true) {
            const commandKeys = yargs.getCommandInstance().getCommands();
            const unknown = [];
            const currentContext = yargs.getContext();
            Object.keys(argv).forEach(key => {
                if (specialKeys.indexOf(key) === -1 &&
                    !Object.prototype.hasOwnProperty.call(positionalMap, key) &&
                    !Object.prototype.hasOwnProperty.call(yargs._getParseContext(), key) &&
                    !self.isValidAndSomeAliasIsNotNew(key, aliases)) {
                    unknown.push(key);
                }
            });
            if (checkPositionals &&
                (currentContext.commands.length > 0 ||
                    commandKeys.length > 0 ||
                    isDefaultCommand)) {
                argv._.slice(currentContext.commands.length).forEach(key => {
                    if (commandKeys.indexOf('' + key) === -1) {
                        unknown.push('' + key);
                    }
                });
            }
            if (unknown.length > 0) {
                usage.fail(__n('Unknown argument: %s', 'Unknown arguments: %s', unknown.length, unknown.join(', ')));
            }
        };
        self.unknownCommands = function unknownCommands(argv) {
            const commandKeys = yargs.getCommandInstance().getCommands();
            const unknown = [];
            const currentContext = yargs.getContext();
            if (currentContext.commands.length > 0 || commandKeys.length > 0) {
                argv._.slice(currentContext.commands.length).forEach(key => {
                    if (commandKeys.indexOf('' + key) === -1) {
                        unknown.push('' + key);
                    }
                });
            }
            if (unknown.length > 0) {
                usage.fail(__n('Unknown command: %s', 'Unknown commands: %s', unknown.length, unknown.join(', ')));
                return true;
            }
            else {
                return false;
            }
        };
        self.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
            if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
                return false;
            }
            const newAliases = yargs.parsed.newAliases;
            for (const a of [key, ...aliases[key]]) {
                if (!Object.prototype.hasOwnProperty.call(newAliases, a) ||
                    !newAliases[key]) {
                    return true;
                }
            }
            return false;
        };
        self.limitedChoices = function limitedChoices(argv) {
            const options = yargs.getOptions();
            const invalid = {};
            if (!Object.keys(options.choices).length)
                return;
            Object.keys(argv).forEach(key => {
                if (specialKeys.indexOf(key) === -1 &&
                    Object.prototype.hasOwnProperty.call(options.choices, key)) {
                    [].concat(argv[key]).forEach(value => {
                        if (options.choices[key].indexOf(value) === -1 &&
                            value !== undefined) {
                            invalid[key] = (invalid[key] || []).concat(value);
                        }
                    });
                }
            });
            const invalidKeys = Object.keys(invalid);
            if (!invalidKeys.length)
                return;
            let msg = __('Invalid values:');
            invalidKeys.forEach(key => {
                msg += `\n  ${__('Argument: %s, Given: %s, Choices: %s', key, usage.stringifiedValues(invalid[key]), usage.stringifiedValues(options.choices[key]))}`;
            });
            usage.fail(msg);
        };
        let implied = {};
        self.implies = function implies(key, value) {
            argsert('<string|object> [array|number|string]', [key, value], arguments.length);
            if (typeof key === 'object') {
                Object.keys(key).forEach(k => {
                    self.implies(k, key[k]);
                });
            }
            else {
                yargs.global(key);
                if (!implied[key]) {
                    implied[key] = [];
                }
                if (Array.isArray(value)) {
                    value.forEach(i => self.implies(key, i));
                }
                else {
                    assertNotStrictEqual(value, undefined, shim);
                    implied[key].push(value);
                }
            }
        };
        self.getImplied = function getImplied() {
            return implied;
        };
        function keyExists(argv, val) {
            const num = Number(val);
            val = isNaN(num) ? val : num;
            if (typeof val === 'number') {
                val = argv._.length >= val;
            }
            else if (val.match(/^--no-.+/)) {
                val = val.match(/^--no-(.+)/)[1];
                val = !argv[val];
            }
            else {
                val = argv[val];
            }
            return val;
        }
        self.implications = function implications(argv) {
            const implyFail = [];
            Object.keys(implied).forEach(key => {
                const origKey = key;
                (implied[key] || []).forEach(value => {
                    let key = origKey;
                    const origValue = value;
                    key = keyExists(argv, key);
                    value = keyExists(argv, value);
                    if (key && !value) {
                        implyFail.push(` ${origKey} -> ${origValue}`);
                    }
                });
            });
            if (implyFail.length) {
                let msg = `${__('Implications failed:')}\n`;
                implyFail.forEach(value => {
                    msg += value;
                });
                usage.fail(msg);
            }
        };
        let conflicting = {};
        self.conflicts = function conflicts(key, value) {
            argsert('<string|object> [array|string]', [key, value], arguments.length);
            if (typeof key === 'object') {
                Object.keys(key).forEach(k => {
                    self.conflicts(k, key[k]);
                });
            }
            else {
                yargs.global(key);
                if (!conflicting[key]) {
                    conflicting[key] = [];
                }
                if (Array.isArray(value)) {
                    value.forEach(i => self.conflicts(key, i));
                }
                else {
                    conflicting[key].push(value);
                }
            }
        };
        self.getConflicting = () => conflicting;
        self.conflicting = function conflictingFn(argv) {
            Object.keys(argv).forEach(key => {
                if (conflicting[key]) {
                    conflicting[key].forEach(value => {
                        if (value && argv[key] !== undefined && argv[value] !== undefined) {
                            usage.fail(__('Arguments %s and %s are mutually exclusive', key, value));
                        }
                    });
                }
            });
        };
        self.recommendCommands = function recommendCommands(cmd, potentialCommands) {
            const threshold = 3;
            potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
            let recommended = null;
            let bestDistance = Infinity;
            for (let i = 0, candidate; (candidate = potentialCommands[i]) !== undefined; i++) {
                const d = levenshtein(cmd, candidate);
                if (d <= threshold && d < bestDistance) {
                    bestDistance = d;
                    recommended = candidate;
                }
            }
            if (recommended)
                usage.fail(__('Did you mean %s?', recommended));
        };
        self.reset = function reset(localLookup) {
            implied = objFilter(implied, k => !localLookup[k]);
            conflicting = objFilter(conflicting, k => !localLookup[k]);
            return self;
        };
        const frozens = [];
        self.freeze = function freeze() {
            frozens.push({
                implied,
                conflicting,
            });
        };
        self.unfreeze = function unfreeze() {
            const frozen = frozens.pop();
            assertNotStrictEqual(frozen, undefined, shim);
            ({ implied, conflicting } = frozen);
        };
        return self;
    }
    
    let shim;
    function YargsWithShim(_shim) {
        shim = _shim;
        return Yargs$1;
    }
    function Yargs$1(processArgs = [], cwd = shim.process.cwd(), parentRequire) {
        const self = {};
        let command$1;
        let completion$1 = null;
        let groups = {};
        let output = '';
        const preservedGroups = {};
        const globalMiddleware = new GlobalMiddleware(self);
        let usage$1;
        let validation$1;
        const y18n = shim.y18n;
        self.scriptName = function (scriptName) {
            self.customScriptName = true;
            self.$0 = scriptName;
            return self;
        };
        let default$0;
        if (/\b(node|iojs|electron)(\.exe)?$/.test(shim.process.argv()[0])) {
            default$0 = shim.process.argv().slice(1, 2);
        }
        else {
            default$0 = shim.process.argv().slice(0, 1);
        }
        self.$0 = default$0
            .map(x => {
            const b = rebase(cwd, x);
            return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
        })
            .join(' ')
            .trim();
        if (shim.getEnv('_') && shim.getProcessArgvBin() === shim.getEnv('_')) {
            self.$0 = shim
                .getEnv('_')
                .replace(`${shim.path.dirname(shim.process.execPath())}/`, '');
        }
        const context = { resets: -1, commands: [], fullCommands: [], files: [] };
        self.getContext = () => context;
        let hasOutput = false;
        let exitError = null;
        self.exit = (code, err) => {
            hasOutput = true;
            exitError = err;
            if (exitProcess)
                shim.process.exit(code);
        };
        let completionCommand = null;
        self.completion = function (cmd, desc, fn) {
            argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length);
            if (typeof desc === 'function') {
                fn = desc;
                desc = undefined;
            }
            completionCommand = cmd || completionCommand || 'completion';
            if (!desc && desc !== false) {
                desc = 'generate completion script';
            }
            self.command(completionCommand, desc);
            if (fn)
                completion$1.registerFunction(fn);
            return self;
        };
        let options;
        self.resetOptions = self.reset = function resetOptions(aliases = {}) {
            context.resets++;
            options = options || {};
            const tmpOptions = {};
            tmpOptions.local = options.local ? options.local : [];
            tmpOptions.configObjects = options.configObjects
                ? options.configObjects
                : [];
            const localLookup = {};
            tmpOptions.local.forEach(l => {
                localLookup[l] = true;
                (aliases[l] || []).forEach(a => {
                    localLookup[a] = true;
                });
            });
            Object.assign(preservedGroups, Object.keys(groups).reduce((acc, groupName) => {
                const keys = groups[groupName].filter(key => !(key in localLookup));
                if (keys.length > 0) {
                    acc[groupName] = keys;
                }
                return acc;
            }, {}));
            groups = {};
            const arrayOptions = [
                'array',
                'boolean',
                'string',
                'skipValidation',
                'count',
                'normalize',
                'number',
                'hiddenOptions',
            ];
            const objectOptions = [
                'narg',
                'key',
                'alias',
                'default',
                'defaultDescription',
                'config',
                'choices',
                'demandedOptions',
                'demandedCommands',
                'deprecatedOptions',
            ];
            arrayOptions.forEach(k => {
                tmpOptions[k] = (options[k] || []).filter((k) => !localLookup[k]);
            });
            objectOptions.forEach((k) => {
                tmpOptions[k] = objFilter(options[k], k => !localLookup[k]);
            });
            tmpOptions.envPrefix = options.envPrefix;
            options = tmpOptions;
            usage$1 = usage$1 ? usage$1.reset(localLookup) : usage(self, y18n, shim);
            validation$1 = validation$1
                ? validation$1.reset(localLookup)
                : validation(self, usage$1, y18n, shim);
            command$1 = command$1
                ? command$1.reset()
                : command(self, usage$1, validation$1, globalMiddleware, shim);
            if (!completion$1)
                completion$1 = completion(self, usage$1, command$1, shim);
            globalMiddleware.reset();
            completionCommand = null;
            output = '';
            exitError = null;
            hasOutput = false;
            self.parsed = false;
            return self;
        };
        self.resetOptions();
        const frozens = [];
        function freeze() {
            frozens.push({
                options,
                configObjects: options.configObjects.slice(0),
                exitProcess,
                groups,
                strict,
                strictCommands,
                strictOptions,
                completionCommand,
                output,
                exitError,
                hasOutput,
                parsed: self.parsed,
                parseFn,
                parseContext,
            });
            usage$1.freeze();
            validation$1.freeze();
            command$1.freeze();
            globalMiddleware.freeze();
        }
        function unfreeze() {
            const frozen = frozens.pop();
            assertNotStrictEqual(frozen, undefined, shim);
            let configObjects;
            ({
                options,
                configObjects,
                exitProcess,
                groups,
                output,
                exitError,
                hasOutput,
                parsed: self.parsed,
                strict,
                strictCommands,
                strictOptions,
                completionCommand,
                parseFn,
                parseContext,
            } = frozen);
            options.configObjects = configObjects;
            usage$1.unfreeze();
            validation$1.unfreeze();
            command$1.unfreeze();
            globalMiddleware.unfreeze();
        }
        self.boolean = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('boolean', keys);
            return self;
        };
        self.array = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('array', keys);
            return self;
        };
        self.number = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('number', keys);
            return self;
        };
        self.normalize = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('normalize', keys);
            return self;
        };
        self.count = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('count', keys);
            return self;
        };
        self.string = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('string', keys);
            return self;
        };
        self.requiresArg = function (keys) {
            argsert('<array|string|object> [number]', [keys], arguments.length);
            if (typeof keys === 'string' && options.narg[keys]) {
                return self;
            }
            else {
                populateParserHintSingleValueDictionary(self.requiresArg, 'narg', keys, NaN);
            }
            return self;
        };
        self.skipValidation = function (keys) {
            argsert('<array|string>', [keys], arguments.length);
            populateParserHintArray('skipValidation', keys);
            return self;
        };
        function populateParserHintArray(type, keys) {
            keys = [].concat(keys);
            keys.forEach(key => {
                key = sanitizeKey(key);
                options[type].push(key);
            });
        }
        self.nargs = function (key, value) {
            argsert('<string|object|array> [number]', [key, value], arguments.length);
            populateParserHintSingleValueDictionary(self.nargs, 'narg', key, value);
            return self;
        };
        self.choices = function (key, value) {
            argsert('<object|string|array> [string|array]', [key, value], arguments.length);
            populateParserHintArrayDictionary(self.choices, 'choices', key, value);
            return self;
        };
        self.alias = function (key, value) {
            argsert('<object|string|array> [string|array]', [key, value], arguments.length);
            populateParserHintArrayDictionary(self.alias, 'alias', key, value);
            return self;
        };
        self.default = self.defaults = function (key, value, defaultDescription) {
            argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length);
            if (defaultDescription) {
                assertSingleKey(key, shim);
                options.defaultDescription[key] = defaultDescription;
            }
            if (typeof value === 'function') {
                assertSingleKey(key, shim);
                if (!options.defaultDescription[key])
                    options.defaultDescription[key] = usage$1.functionDescription(value);
                value = value.call();
            }
            populateParserHintSingleValueDictionary(self.default, 'default', key, value);
            return self;
        };
        self.describe = function (key, desc) {
            argsert('<object|string|array> [string]', [key, desc], arguments.length);
            setKey(key, true);
            usage$1.describe(key, desc);
            return self;
        };
        function setKey(key, set) {
            populateParserHintSingleValueDictionary(setKey, 'key', key, set);
            return self;
        }
        function demandOption(keys, msg) {
            argsert('<object|string|array> [string]', [keys, msg], arguments.length);
            populateParserHintSingleValueDictionary(self.demandOption, 'demandedOptions', keys, msg);
            return self;
        }
        self.demandOption = demandOption;
        self.coerce = function (keys, value) {
            argsert('<object|string|array> [function]', [keys, value], arguments.length);
            if (Array.isArray(keys)) {
                if (!value) {
                    throw new YError('coerce callback must be provided');
                }
                for (const key of keys) {
                    self.coerce(key, value);
                }
                return self;
            }
            else if (typeof keys === 'object') {
                for (const key of Object.keys(keys)) {
                    self.coerce(key, keys[key]);
                }
                return self;
            }
            if (!value) {
                throw new YError('coerce callback must be provided');
            }
            self.alias(keys, keys);
            globalMiddleware.addCoerceMiddleware((argv, yargs) => {
                let aliases;
                return maybeAsyncResult(() => {
                    aliases = yargs.getAliases();
                    return value(argv[keys]);
                }, (result) => {
                    argv[keys] = result;
                    if (aliases[keys]) {
                        for (const alias of aliases[keys]) {
                            argv[alias] = result;
                        }
                    }
                    return argv;
                }, (err) => {
                    throw new YError(err.message);
                });
            }, keys);
            return self;
        };
        function populateParserHintSingleValueDictionary(builder, type, key, value) {
            populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
                options[type][key] = value;
            });
        }
        function populateParserHintArrayDictionary(builder, type, key, value) {
            populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
                options[type][key] = (options[type][key] || []).concat(value);
            });
        }
        function populateParserHintDictionary(builder, type, key, value, singleKeyHandler) {
            if (Array.isArray(key)) {
                key.forEach(k => {
                    builder(k, value);
                });
            }
            else if (((key) => typeof key === 'object')(key)) {
                for (const k of objectKeys(key)) {
                    builder(k, key[k]);
                }
            }
            else {
                singleKeyHandler(type, sanitizeKey(key), value);
            }
        }
        function sanitizeKey(key) {
            if (key === '__proto__')
                return '___proto___';
            return key;
        }
        function deleteFromParserHintObject(optionKey) {
            objectKeys(options).forEach((hintKey) => {
                if (((key) => key === 'configObjects')(hintKey))
                    return;
                const hint = options[hintKey];
                if (Array.isArray(hint)) {
                    if (~hint.indexOf(optionKey))
                        hint.splice(hint.indexOf(optionKey), 1);
                }
                else if (typeof hint === 'object') {
                    delete hint[optionKey];
                }
            });
            delete usage$1.getDescriptions()[optionKey];
        }
        self.config = function config(key = 'config', msg, parseFn) {
            argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length);
            if (typeof key === 'object' && !Array.isArray(key)) {
                key = applyExtends(key, cwd, self.getParserConfiguration()['deep-merge-config'] || false, shim);
                options.configObjects = (options.configObjects || []).concat(key);
                return self;
            }
            if (typeof msg === 'function') {
                parseFn = msg;
                msg = undefined;
            }
            self.describe(key, msg || usage$1.deferY18nLookup('Path to JSON config file'));
            (Array.isArray(key) ? key : [key]).forEach(k => {
                options.config[k] = parseFn || true;
            });
            return self;
        };
        self.example = function (cmd, description) {
            argsert('<string|array> [string]', [cmd, description], arguments.length);
            if (Array.isArray(cmd)) {
                cmd.forEach(exampleParams => self.example(...exampleParams));
            }
            else {
                usage$1.example(cmd, description);
            }
            return self;
        };
        self.command = self.commands = function (cmd, description, builder, handler, middlewares, deprecated) {
            argsert('<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]', [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
            command$1.addHandler(cmd, description, builder, handler, middlewares, deprecated);
            return self;
        };
        self.commandDir = function (dir, opts) {
            argsert('<string> [object]', [dir, opts], arguments.length);
            const req = parentRequire || shim.require;
            command$1.addDirectory(dir, self.getContext(), req, shim.getCallerFile(), opts);
            return self;
        };
        self.demand = self.required = self.require = function demand(keys, max, msg) {
            if (Array.isArray(max)) {
                max.forEach(key => {
                    assertNotStrictEqual(msg, true, shim);
                    demandOption(key, msg);
                });
                max = Infinity;
            }
            else if (typeof max !== 'number') {
                msg = max;
                max = Infinity;
            }
            if (typeof keys === 'number') {
                assertNotStrictEqual(msg, true, shim);
                self.demandCommand(keys, max, msg, msg);
            }
            else if (Array.isArray(keys)) {
                keys.forEach(key => {
                    assertNotStrictEqual(msg, true, shim);
                    demandOption(key, msg);
                });
            }
            else {
                if (typeof msg === 'string') {
                    demandOption(keys, msg);
                }
                else if (msg === true || typeof msg === 'undefined') {
                    demandOption(keys);
                }
            }
            return self;
        };
        self.demandCommand = function demandCommand(min = 1, max, minMsg, maxMsg) {
            argsert('[number] [number|string] [string|null|undefined] [string|null|undefined]', [min, max, minMsg, maxMsg], arguments.length);
            if (typeof max !== 'number') {
                minMsg = max;
                max = Infinity;
            }
            self.global('_', false);
            options.demandedCommands._ = {
                min,
                max,
                minMsg,
                maxMsg,
            };
            return self;
        };
        self.getAliases = () => {
            return self.parsed ? self.parsed.aliases : {};
        };
        self.getDemandedOptions = () => {
            argsert([], 0);
            return options.demandedOptions;
        };
        self.getDemandedCommands = () => {
            argsert([], 0);
            return options.demandedCommands;
        };
        self.deprecateOption = function deprecateOption(option, message) {
            argsert('<string> [string|boolean]', [option, message], arguments.length);
            options.deprecatedOptions[option] = message;
            return self;
        };
        self.getDeprecatedOptions = () => {
            argsert([], 0);
            return options.deprecatedOptions;
        };
        self.implies = function (key, value) {
            argsert('<string|object> [number|string|array]', [key, value], arguments.length);
            validation$1.implies(key, value);
            return self;
        };
        self.conflicts = function (key1, key2) {
            argsert('<string|object> [string|array]', [key1, key2], arguments.length);
            validation$1.conflicts(key1, key2);
            return self;
        };
        self.usage = function (msg, description, builder, handler) {
            argsert('<string|null|undefined> [string|boolean] [function|object] [function]', [msg, description, builder, handler], arguments.length);
            if (description !== undefined) {
                assertNotStrictEqual(msg, null, shim);
                if ((msg || '').match(/^\$0( |$)/)) {
                    return self.command(msg, description, builder, handler);
                }
                else {
                    throw new YError('.usage() description must start with $0 if being used as alias for .command()');
                }
            }
            else {
                usage$1.usage(msg);
                return self;
            }
        };
        self.epilogue = self.epilog = function (msg) {
            argsert('<string>', [msg], arguments.length);
            usage$1.epilog(msg);
            return self;
        };
        self.fail = function (f) {
            argsert('<function|boolean>', [f], arguments.length);
            if (typeof f === 'boolean' && f !== false) {
                throw new YError("Invalid first argument. Expected function or boolean 'false'");
            }
            usage$1.failFn(f);
            return self;
        };
        self.check = function (f, global) {
            argsert('<function> [boolean]', [f, global], arguments.length);
            self.middleware((argv, _yargs) => {
                return maybeAsyncResult(() => {
                    return f(argv);
                }, (result) => {
                    if (!result) {
                        usage$1.fail(y18n.__('Argument check failed: %s', f.toString()));
                    }
                    else if (typeof result === 'string' || result instanceof Error) {
                        usage$1.fail(result.toString(), result);
                    }
                    return argv;
                }, (err) => {
                    usage$1.fail(err.message ? err.message : err.toString(), err);
                    return argv;
                });
            }, false, global);
            return self;
        };
        self.middleware = (callback, applyBeforeValidation, global = true) => {
            return globalMiddleware.addMiddleware(callback, !!applyBeforeValidation, global);
        };
        self.global = function global(globals, global) {
            argsert('<string|array> [boolean]', [globals, global], arguments.length);
            globals = [].concat(globals);
            if (global !== false) {
                options.local = options.local.filter(l => globals.indexOf(l) === -1);
            }
            else {
                globals.forEach(g => {
                    if (options.local.indexOf(g) === -1)
                        options.local.push(g);
                });
            }
            return self;
        };
        self.pkgConf = function pkgConf(key, rootPath) {
            argsert('<string> [string]', [key, rootPath], arguments.length);
            let conf = null;
            const obj = pkgUp(rootPath || cwd);
            if (obj[key] && typeof obj[key] === 'object') {
                conf = applyExtends(obj[key], rootPath || cwd, self.getParserConfiguration()['deep-merge-config'] || false, shim);
                options.configObjects = (options.configObjects || []).concat(conf);
            }
            return self;
        };
        const pkgs = {};
        function pkgUp(rootPath) {
            const npath = rootPath || '*';
            if (pkgs[npath])
                return pkgs[npath];
            let obj = {};
            try {
                let startDir = rootPath || shim.mainFilename;
                if (!rootPath && shim.path.extname(startDir)) {
                    startDir = shim.path.dirname(startDir);
                }
                const pkgJsonPath = shim.findUp(startDir, (dir, names) => {
                    if (names.includes('package.json')) {
                        return 'package.json';
                    }
                    else {
                        return undefined;
                    }
                });
                assertNotStrictEqual(pkgJsonPath, undefined, shim);
                obj = JSON.parse(shim.readFileSync(pkgJsonPath, 'utf8'));
            }
            catch (_noop) { }
            pkgs[npath] = obj || {};
            return pkgs[npath];
        }
        let parseFn = null;
        let parseContext = null;
        self.parse = function parse(args, shortCircuit, _parseFn) {
            argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length);
            freeze();
            if (typeof args === 'undefined') {
                const argv = self._parseArgs(processArgs);
                const tmpParsed = self.parsed;
                unfreeze();
                self.parsed = tmpParsed;
                return argv;
            }
            if (typeof shortCircuit === 'object') {
                parseContext = shortCircuit;
                shortCircuit = _parseFn;
            }
            if (typeof shortCircuit === 'function') {
                parseFn = shortCircuit;
                shortCircuit = false;
            }
            if (!shortCircuit)
                processArgs = args;
            if (parseFn)
                exitProcess = false;
            const parsed = self._parseArgs(args, !!shortCircuit);
            completion$1.setParsed(self.parsed);
            if (parseFn)
                parseFn(exitError, parsed, output);
            unfreeze();
            return parsed;
        };
        self._getParseContext = () => parseContext || {};
        self._hasParseCallback = () => !!parseFn;
        self.option = self.options = function option(key, opt) {
            argsert('<string|object> [object]', [key, opt], arguments.length);
            if (typeof key === 'object') {
                Object.keys(key).forEach(k => {
                    self.options(k, key[k]);
                });
            }
            else {
                if (typeof opt !== 'object') {
                    opt = {};
                }
                options.key[key] = true;
                if (opt.alias)
                    self.alias(key, opt.alias);
                const deprecate = opt.deprecate || opt.deprecated;
                if (deprecate) {
                    self.deprecateOption(key, deprecate);
                }
                const demand = opt.demand || opt.required || opt.require;
                if (demand) {
                    self.demand(key, demand);
                }
                if (opt.demandOption) {
                    self.demandOption(key, typeof opt.demandOption === 'string' ? opt.demandOption : undefined);
                }
                if (opt.conflicts) {
                    self.conflicts(key, opt.conflicts);
                }
                if ('default' in opt) {
                    self.default(key, opt.default);
                }
                if (opt.implies !== undefined) {
                    self.implies(key, opt.implies);
                }
                if (opt.nargs !== undefined) {
                    self.nargs(key, opt.nargs);
                }
                if (opt.config) {
                    self.config(key, opt.configParser);
                }
                if (opt.normalize) {
                    self.normalize(key);
                }
                if (opt.choices) {
                    self.choices(key, opt.choices);
                }
                if (opt.coerce) {
                    self.coerce(key, opt.coerce);
                }
                if (opt.group) {
                    self.group(key, opt.group);
                }
                if (opt.boolean || opt.type === 'boolean') {
                    self.boolean(key);
                    if (opt.alias)
                        self.boolean(opt.alias);
                }
                if (opt.array || opt.type === 'array') {
                    self.array(key);
                    if (opt.alias)
                        self.array(opt.alias);
                }
                if (opt.number || opt.type === 'number') {
                    self.number(key);
                    if (opt.alias)
                        self.number(opt.alias);
                }
                if (opt.string || opt.type === 'string') {
                    self.string(key);
                    if (opt.alias)
                        self.string(opt.alias);
                }
                if (opt.count || opt.type === 'count') {
                    self.count(key);
                }
                if (typeof opt.global === 'boolean') {
                    self.global(key, opt.global);
                }
                if (opt.defaultDescription) {
                    options.defaultDescription[key] = opt.defaultDescription;
                }
                if (opt.skipValidation) {
                    self.skipValidation(key);
                }
                const desc = opt.describe || opt.description || opt.desc;
                self.describe(key, desc);
                if (opt.hidden) {
                    self.hide(key);
                }
                if (opt.requiresArg) {
                    self.requiresArg(key);
                }
            }
            return self;
        };
        self.getOptions = () => options;
        self.positional = function (key, opts) {
            argsert('<string> <object>', [key, opts], arguments.length);
            if (context.resets === 0) {
                throw new YError(".positional() can only be called in a command's builder function");
            }
            const supportedOpts = [
                'default',
                'defaultDescription',
                'implies',
                'normalize',
                'choices',
                'conflicts',
                'coerce',
                'type',
                'describe',
                'desc',
                'description',
                'alias',
            ];
            opts = objFilter(opts, (k, v) => {
                let accept = supportedOpts.indexOf(k) !== -1;
                if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) === -1)
                    accept = false;
                return accept;
            });
            const fullCommand = context.fullCommands[context.fullCommands.length - 1];
            const parseOptions = fullCommand
                ? command$1.cmdToParseOptions(fullCommand)
                : {
                    array: [],
                    alias: {},
                    default: {},
                    demand: {},
                };
            objectKeys(parseOptions).forEach(pk => {
                const parseOption = parseOptions[pk];
                if (Array.isArray(parseOption)) {
                    if (parseOption.indexOf(key) !== -1)
                        opts[pk] = true;
                }
                else {
                    if (parseOption[key] && !(pk in opts))
                        opts[pk] = parseOption[key];
                }
            });
            self.group(key, usage$1.getPositionalGroupName());
            return self.option(key, opts);
        };
        self.group = function group(opts, groupName) {
            argsert('<string|array> <string>', [opts, groupName], arguments.length);
            const existing = preservedGroups[groupName] || groups[groupName];
            if (preservedGroups[groupName]) {
                delete preservedGroups[groupName];
            }
            const seen = {};
            groups[groupName] = (existing || []).concat(opts).filter(key => {
                if (seen[key])
                    return false;
                return (seen[key] = true);
            });
            return self;
        };
        self.getGroups = () => Object.assign({}, groups, preservedGroups);
        self.env = function (prefix) {
            argsert('[string|boolean]', [prefix], arguments.length);
            if (prefix === false)
                delete options.envPrefix;
            else
                options.envPrefix = prefix || '';
            return self;
        };
        self.wrap = function (cols) {
            argsert('<number|null|undefined>', [cols], arguments.length);
            usage$1.wrap(cols);
            return self;
        };
        let strict = false;
        self.strict = function (enabled) {
            argsert('[boolean]', [enabled], arguments.length);
            strict = enabled !== false;
            return self;
        };
        self.getStrict = () => strict;
        let strictCommands = false;
        self.strictCommands = function (enabled) {
            argsert('[boolean]', [enabled], arguments.length);
            strictCommands = enabled !== false;
            return self;
        };
        self.getStrictCommands = () => strictCommands;
        let strictOptions = false;
        self.strictOptions = function (enabled) {
            argsert('[boolean]', [enabled], arguments.length);
            strictOptions = enabled !== false;
            return self;
        };
        self.getStrictOptions = () => strictOptions;
        let parserConfig = {};
        self.parserConfiguration = function parserConfiguration(config) {
            argsert('<object>', [config], arguments.length);
            parserConfig = config;
            return self;
        };
        self.getParserConfiguration = () => parserConfig;
        self.getHelp = async function () {
            hasOutput = true;
            if (!usage$1.hasCachedHelpMessage()) {
                if (!self.parsed) {
                    self._parseArgs(processArgs, undefined, undefined, 0, true);
                }
                if (command$1.hasDefaultCommand()) {
                    context.resets++;
                    command$1.runDefaultBuilderOn(self);
                }
            }
            return usage$1.help();
        };
        self.showHelp = function (level) {
            argsert('[string|function]', [level], arguments.length);
            hasOutput = true;
            if (!usage$1.hasCachedHelpMessage()) {
                if (!self.parsed) {
                    self._parseArgs(processArgs, undefined, undefined, 0, true);
                }
                if (command$1.hasDefaultCommand()) {
                    context.resets++;
                    command$1.runDefaultBuilderOn(self);
                }
            }
            usage$1.showHelp(level);
            return self;
        };
        self.showVersion = function (level) {
            argsert('[string|function]', [level], arguments.length);
            usage$1.showVersion(level);
            return self;
        };
        let versionOpt = null;
        self.version = function version(opt, msg, ver) {
            const defaultVersionOpt = 'version';
            argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length);
            if (versionOpt) {
                deleteFromParserHintObject(versionOpt);
                usage$1.version(undefined);
                versionOpt = null;
            }
            if (arguments.length === 0) {
                ver = guessVersion();
                opt = defaultVersionOpt;
            }
            else if (arguments.length === 1) {
                if (opt === false) {
                    return self;
                }
                ver = opt;
                opt = defaultVersionOpt;
            }
            else if (arguments.length === 2) {
                ver = msg;
                msg = undefined;
            }
            versionOpt = typeof opt === 'string' ? opt : defaultVersionOpt;
            msg = msg || usage$1.deferY18nLookup('Show version number');
            usage$1.version(ver || undefined);
            self.boolean(versionOpt);
            self.describe(versionOpt, msg);
            return self;
        };
        function guessVersion() {
            const obj = pkgUp();
            return obj.version || 'unknown';
        }
        let helpOpt = null;
        self.addHelpOpt = self.help = function addHelpOpt(opt, msg) {
            const defaultHelpOpt = 'help';
            argsert('[string|boolean] [string]', [opt, msg], arguments.length);
            if (helpOpt) {
                deleteFromParserHintObject(helpOpt);
                helpOpt = null;
            }
            if (arguments.length === 1) {
                if (opt === false)
                    return self;
            }
            helpOpt = typeof opt === 'string' ? opt : defaultHelpOpt;
            self.boolean(helpOpt);
            self.describe(helpOpt, msg || usage$1.deferY18nLookup('Show help'));
            return self;
        };
        const defaultShowHiddenOpt = 'show-hidden';
        options.showHiddenOpt = defaultShowHiddenOpt;
        self.addShowHiddenOpt = self.showHidden = function addShowHiddenOpt(opt, msg) {
            argsert('[string|boolean] [string]', [opt, msg], arguments.length);
            if (arguments.length === 1) {
                if (opt === false)
                    return self;
            }
            const showHiddenOpt = typeof opt === 'string' ? opt : defaultShowHiddenOpt;
            self.boolean(showHiddenOpt);
            self.describe(showHiddenOpt, msg || usage$1.deferY18nLookup('Show hidden options'));
            options.showHiddenOpt = showHiddenOpt;
            return self;
        };
        self.hide = function hide(key) {
            argsert('<string>', [key], arguments.length);
            options.hiddenOptions.push(key);
            return self;
        };
        self.showHelpOnFail = function showHelpOnFail(enabled, message) {
            argsert('[boolean|string] [string]', [enabled, message], arguments.length);
            usage$1.showHelpOnFail(enabled, message);
            return self;
        };
        let exitProcess = true;
        self.exitProcess = function (enabled = true) {
            argsert('[boolean]', [enabled], arguments.length);
            exitProcess = enabled;
            return self;
        };
        self.getExitProcess = () => exitProcess;
        self.showCompletionScript = function ($0, cmd) {
            argsert('[string] [string]', [$0, cmd], arguments.length);
            $0 = $0 || self.$0;
            _logger.log(completion$1.generateCompletionScript($0, cmd || completionCommand || 'completion'));
            return self;
        };
        self.getCompletion = async function (args, done) {
            argsert('<array> [function]', [args, done], arguments.length);
            if (!done) {
                return new Promise((resolve, reject) => {
                    completion$1.getCompletion(args, (err, completions) => {
                        if (err)
                            reject(err);
                        else
                            resolve(completions);
                    });
                });
            }
            else {
                return completion$1.getCompletion(args, done);
            }
        };
        self.locale = function (locale) {
            argsert('[string]', [locale], arguments.length);
            if (!locale) {
                guessLocale();
                return y18n.getLocale();
            }
            detectLocale = false;
            y18n.setLocale(locale);
            return self;
        };
        self.updateStrings = self.updateLocale = function (obj) {
            argsert('<object>', [obj], arguments.length);
            detectLocale = false;
            y18n.updateLocale(obj);
            return self;
        };
        let detectLocale = true;
        self.detectLocale = function (detect) {
            argsert('<boolean>', [detect], arguments.length);
            detectLocale = detect;
            return self;
        };
        self.getDetectLocale = () => detectLocale;
        const _logger = {
            log(...args) {
                if (!self._hasParseCallback())
                    console.log(...args);
                hasOutput = true;
                if (output.length)
                    output += '\n';
                output += args.join(' ');
            },
            error(...args) {
                if (!self._hasParseCallback())
                    console.error(...args);
                hasOutput = true;
                if (output.length)
                    output += '\n';
                output += args.join(' ');
            },
        };
        self._getLoggerInstance = () => _logger;
        self._hasOutput = () => hasOutput;
        self._setHasOutput = () => {
            hasOutput = true;
        };
        let recommendCommands;
        self.recommendCommands = function (recommend = true) {
            argsert('[boolean]', [recommend], arguments.length);
            recommendCommands = recommend;
            return self;
        };
        self.getUsageInstance = () => usage$1;
        self.getValidationInstance = () => validation$1;
        self.getCommandInstance = () => command$1;
        self.terminalWidth = () => {
            argsert([], 0);
            return shim.process.stdColumns;
        };
        Object.defineProperty(self, 'argv', {
            get: () => {
                return self.parse();
            },
            enumerable: true,
        });
        self._parseArgs = function parseArgs(args, shortCircuit, calledFromCommand, commandIndex = 0, helpOnly = false) {
            let skipValidation = !!calledFromCommand || helpOnly;
            args = args || processArgs;
            options.__ = y18n.__;
            options.configuration = self.getParserConfiguration();
            const populateDoubleDash = !!options.configuration['populate--'];
            const config = Object.assign({}, options.configuration, {
                'populate--': true,
            });
            const parsed = shim.Parser.detailed(args, Object.assign({}, options, {
                configuration: Object.assign({ 'parse-positional-numbers': false }, config),
            }));
            let argv = parsed.argv;
            let argvPromise = undefined;
            if (parseContext)
                argv = Object.assign({}, argv, parseContext);
            const aliases = parsed.aliases;
            argv.$0 = self.$0;
            self.parsed = parsed;
            if (commandIndex === 0) {
                usage$1.clearCachedHelpMessage();
            }
            try {
                guessLocale();
                if (shortCircuit) {
                    return self._postProcess(argv, populateDoubleDash, !!calledFromCommand, false);
                }
                if (helpOpt) {
                    const helpCmds = [helpOpt]
                        .concat(aliases[helpOpt] || [])
                        .filter(k => k.length > 1);
                    if (~helpCmds.indexOf('' + argv._[argv._.length - 1])) {
                        argv._.pop();
                        argv[helpOpt] = true;
                    }
                }
                const handlerKeys = command$1.getCommands();
                const requestCompletions = completion$1.completionKey in argv;
                const skipRecommendation = argv[helpOpt] || requestCompletions || helpOnly;
                if (argv._.length) {
                    if (handlerKeys.length) {
                        let firstUnknownCommand;
                        for (let i = commandIndex || 0, cmd; argv._[i] !== undefined; i++) {
                            cmd = String(argv._[i]);
                            if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand) {
                                const innerArgv = command$1.runCommand(cmd, self, parsed, i + 1, helpOnly);
                                return self._postProcess(innerArgv, populateDoubleDash, !!calledFromCommand, false);
                            }
                            else if (!firstUnknownCommand && cmd !== completionCommand) {
                                firstUnknownCommand = cmd;
                                break;
                            }
                        }
                        if (command$1.hasDefaultCommand() && !skipRecommendation) {
                            const innerArgv = command$1.runCommand(null, self, parsed, 0, helpOnly);
                            return self._postProcess(innerArgv, populateDoubleDash, !!calledFromCommand, false);
                        }
                        if (recommendCommands && firstUnknownCommand && !skipRecommendation) {
                            validation$1.recommendCommands(firstUnknownCommand, handlerKeys);
                        }
                    }
                    if (completionCommand &&
                        ~argv._.indexOf(completionCommand) &&
                        !requestCompletions) {
                        if (exitProcess)
                            setBlocking(true);
                        self.showCompletionScript();
                        self.exit(0);
                    }
                }
                else if (command$1.hasDefaultCommand() && !skipRecommendation) {
                    const innerArgv = command$1.runCommand(null, self, parsed, 0, helpOnly);
                    return self._postProcess(innerArgv, populateDoubleDash, !!calledFromCommand, false);
                }
                if (requestCompletions) {
                    if (exitProcess)
                        setBlocking(true);
                    args = [].concat(args);
                    const completionArgs = args.slice(args.indexOf(`--${completion$1.completionKey}`) + 1);
                    completion$1.getCompletion(completionArgs, (err, completions) => {
                        if (err)
                            throw new YError(err.message);
                        (completions || []).forEach(completion => {
                            _logger.log(completion);
                        });
                        self.exit(0);
                    });
                    return self._postProcess(argv, !populateDoubleDash, !!calledFromCommand, false);
                }
                if (!hasOutput) {
                    Object.keys(argv).forEach(key => {
                        if (key === helpOpt && argv[key]) {
                            if (exitProcess)
                                setBlocking(true);
                            skipValidation = true;
                            self.showHelp('log');
                            self.exit(0);
                        }
                        else if (key === versionOpt && argv[key]) {
                            if (exitProcess)
                                setBlocking(true);
                            skipValidation = true;
                            usage$1.showVersion('log');
                            self.exit(0);
                        }
                    });
                }
                if (!skipValidation && options.skipValidation.length > 0) {
                    skipValidation = Object.keys(argv).some(key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true);
                }
                if (!skipValidation) {
                    if (parsed.error)
                        throw new YError(parsed.error.message);
                    if (!requestCompletions) {
                        const validation = self._runValidation(aliases, {}, parsed.error);
                        if (!calledFromCommand) {
                            argvPromise = applyMiddleware(argv, self, globalMiddleware.getMiddleware(), true);
                        }
                        argvPromise = validateAsync(validation, argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv);
                        if (isPromise(argvPromise) && !calledFromCommand) {
                            argvPromise = argvPromise.then(() => {
                                return applyMiddleware(argv, self, globalMiddleware.getMiddleware(), false);
                            });
                        }
                    }
                }
            }
            catch (err) {
                if (err instanceof YError)
                    usage$1.fail(err.message, err);
                else
                    throw err;
            }
            return self._postProcess(argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv, populateDoubleDash, !!calledFromCommand, true);
        };
        function validateAsync(validation, argv) {
            return maybeAsyncResult(argv, result => {
                validation(result);
                return result;
            });
        }
        self._postProcess = function (argv, populateDoubleDash, calledFromCommand, runGlobalMiddleware) {
            if (calledFromCommand)
                return argv;
            if (isPromise(argv))
                return argv;
            if (!populateDoubleDash) {
                argv = self._copyDoubleDash(argv);
            }
            const parsePositionalNumbers = self.getParserConfiguration()['parse-positional-numbers'] ||
                self.getParserConfiguration()['parse-positional-numbers'] === undefined;
            if (parsePositionalNumbers) {
                argv = self._parsePositionalNumbers(argv);
            }
            if (runGlobalMiddleware) {
                argv = applyMiddleware(argv, self, globalMiddleware.getMiddleware(), false);
            }
            return argv;
        };
        self._copyDoubleDash = function (argv) {
            if (!argv._ || !argv['--'])
                return argv;
            argv._.push.apply(argv._, argv['--']);
            try {
                delete argv['--'];
            }
            catch (_err) { }
            return argv;
        };
        self._parsePositionalNumbers = function (argv) {
            const args = argv['--'] ? argv['--'] : argv._;
            for (let i = 0, arg; (arg = args[i]) !== undefined; i++) {
                if (shim.Parser.looksLikeNumber(arg) &&
                    Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))) {
                    args[i] = Number(arg);
                }
            }
            return argv;
        };
        self._runValidation = function runValidation(aliases, positionalMap, parseErrors, isDefaultCommand = false) {
            aliases = Object.assign({}, aliases);
            positionalMap = Object.assign({}, positionalMap);
            const demandedOptions = Object.assign({}, self.getDemandedOptions());
            return (argv) => {
                if (parseErrors)
                    throw new YError(parseErrors.message);
                validation$1.nonOptionCount(argv);
                validation$1.requiredArguments(argv, demandedOptions);
                let failedStrictCommands = false;
                if (strictCommands) {
                    failedStrictCommands = validation$1.unknownCommands(argv);
                }
                if (strict && !failedStrictCommands) {
                    validation$1.unknownArguments(argv, aliases, positionalMap, isDefaultCommand);
                }
                else if (strictOptions) {
                    validation$1.unknownArguments(argv, aliases, {}, false, false);
                }
                validation$1.limitedChoices(argv);
                validation$1.implications(argv);
                validation$1.conflicting(argv);
            };
        };
        function guessLocale() {
            if (!detectLocale)
                return;
            const locale = shim.getEnv('LC_ALL') ||
                shim.getEnv('LC_MESSAGES') ||
                shim.getEnv('LANG') ||
                shim.getEnv('LANGUAGE') ||
                'en_US';
            self.locale(locale.replace(/[.:].*/, ''));
        }
        self.help();
        self.version();
        return self;
    }
    const rebase = (base, dir) => shim.path.relative(base, dir);
    function isYargsInstance(y) {
        return !!y && typeof y._parseArgs === 'function';
    }
    
    var _a, _b;
    const { readFileSync } = require('fs');
    const { inspect } = require('util');
    const { resolve } = require('path');
    const y18n = require('y18n');
    const Parser$1 = require('yargs-parser');
    var cjsPlatformShim = {
        assert: {
            notStrictEqual: assert.notStrictEqual,
            strictEqual: assert.strictEqual,
        },
        cliui: require('cliui'),
        findUp: require('escalade/sync'),
        getEnv: (key) => {
            return process.env[key];
        },
        getCallerFile: require('get-caller-file'),
        getProcessArgvBin: getProcessArgvBin,
        inspect,
        mainFilename: (_b = (_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) !== null && _b !== void 0 ? _b : process.cwd(),
        Parser: Parser$1,
        path: require('path'),
        process: {
            argv: () => process.argv,
            cwd: process.cwd,
            execPath: () => process.execPath,
            exit: (code) => {
                process.exit(code);
            },
            nextTick: process.nextTick,
            stdColumns: null,
        },
        readFileSync,
        require: require,
        requireDirectory: require('require-directory'),
        stringWidth: require('string-width'),
        y18n: y18n({
            directory: resolve(__dirname, '../locales'),
            updateFiles: false,
        }),
    };
    
    const minNodeVersion = process && process.env && process.env.YARGS_MIN_NODE_VERSION
        ? Number(process.env.YARGS_MIN_NODE_VERSION)
        : 10;
    if (process && process.version) {
        const major = Number(process.version.match(/v([^.]+)/)[1]);
        if (major < minNodeVersion) {
            throw Error(`yargs supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`);
        }
    }
    const Parser = require('yargs-parser');
    const Yargs = YargsWithShim(cjsPlatformShim);
    var cjs = {
        applyExtends,
        cjsPlatformShim,
        Yargs,
        argsert,
        isPromise,
        objFilter,
        parseCommand,
        Parser,
        processArgv,
        rebase,
        YError,
    };
    
    module.exports = cjs;
    
    }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},"/node_modules/yargs/build")
    },{"_process":60,"assert":2,"cliui":10,"escalade/sync":41,"fs":7,"get-caller-file":46,"path":59,"require-directory":66,"string-width":104,"util":75,"y18n":87,"yargs-parser":99}],101:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    // classic singleton yargs API, to use yargs
    // without running as a singleton do:
    // require('yargs/yargs')(process.argv.slice(2))
    const {Yargs, processArgv} = require('./build/index.cjs');
    
    Argv(processArgv.hideBin(process.argv));
    
    module.exports = Argv;
    
    function Argv(processArgs, cwd) {
      const argv = Yargs(processArgs, cwd, require);
      singletonify(argv);
      return argv;
    }
    
    /*  Hack an instance of Argv with process.argv into Argv
        so people can do
        require('yargs')(['--beeble=1','-z','zizzle']).argv
        to parse a list of args and
        require('yargs').argv
        to get a parsed version of process.argv.
    */
    function singletonify(inst) {
      Object.keys(inst).forEach(key => {
        if (key === 'argv') {
          Argv.__defineGetter__(key, inst.__lookupGetter__(key));
        } else if (typeof inst[key] === 'function') {
          Argv[key] = inst[key].bind(inst);
        } else {
          Argv.__defineGetter__('$0', () => {
            return inst.$0;
          });
          Argv.__defineGetter__('parsed', () => {
            return inst.parsed;
          });
        }
      });
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./build/index.cjs":100,"_process":60}],102:[function(require,module,exports){
    arguments[4][11][0].apply(exports,arguments)
    },{"dup":11}],103:[function(require,module,exports){
    arguments[4][12][0].apply(exports,arguments)
    },{"dup":12}],104:[function(require,module,exports){
    arguments[4][13][0].apply(exports,arguments)
    },{"dup":13,"emoji-regex":39,"is-fullwidth-code-point":103,"strip-ansi":105}],105:[function(require,module,exports){
    arguments[4][14][0].apply(exports,arguments)
    },{"ansi-regex":102,"dup":14}],106:[function(require,module,exports){
    'use strict'
    
    var curlconverter = require('curlconverter')
    
    document.addEventListener('DOMContentLoaded', function () {
      var hash = window.location.hash.replace('#', '')
      if (hash === 'node-fetch') {
        changeLanguage('node-fetch')
      } else if (hash === 'node-request') {
        changeLanguage('node-request')
      } else if (hash === 'php') {
        changeLanguage('php')
      } else if (hash === 'browser') {
        changeLanguage('browser')
      } else if (hash === 'r') {
        changeLanguage('r')
      } else if (hash === 'go') {
        changeLanguage('go')
      } else if (hash === 'strest') {
        changeLanguage('strest')
      } else if (hash === 'java') {
        changeLanguage('java')
      } else if (hash === 'json') {
        changeLanguage('json')
      } else if (hash === 'rust') {
        changeLanguage('rust')
      } else if (hash === 'dart') {
        changeLanguage('dart')
      } else if (hash === 'ansible') {
        changeLanguage('ansible')
      } else if (hash === 'matlab') {
        changeLanguage('matlab')
      }
    
      var curlCodeInput = document.getElementById('curl-code')
      curlCodeInput.addEventListener('keyup', convert)
    
      // listen for change in select
      var languageSelect = document.getElementById('language')
      languageSelect.addEventListener('change', function () {
        var language = document.getElementById('language').value
        changeLanguage(language)
        if (document.getElementById('curl-code').value) {
          convert()
        }
      })
    
      var getExample = document.getElementById('get-example')
      getExample.addEventListener('click', function () {
        showExample("curl 'http://en.wikipedia.org/' -H 'Accept-Encoding: gzip, deflate, sdch' " +
          "-H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' " +
          "-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' " +
          "-H 'Referer: http://www.wikipedia.org/' " +
          " -H 'Connection: keep-alive' --compressed")
      })
    
      var postExample = document.getElementById('post-example')
      postExample.addEventListener('click', function () {
        showExample("curl 'http://fiddle.jshell.net/echo/html/' -H 'Origin: http://fiddle.jshell.net' " +
          "-H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' " +
          "-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/39.0.2171.95 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' " +
          "-H 'Accept: */*' -H 'Referer: http://fiddle.jshell.net/_display/' -H 'X-Requested-With: XMLHttpRequest' " +
          "-H 'Connection: keep-alive' --data 'msg1=wow&msg2=such' --compressed")
      })
    
      var basicAuthExample = document.getElementById('basic-auth-example')
      basicAuthExample.addEventListener('click', function () {
        showExample('curl "https://api.test.com/" -u "some_username:some_password"')
      })
    })
    
    /*
    single point of truth in the dom, YEEEE HAWWWW
     */
    var changeLanguage = function (language) {
      var generatedCodeTitle = document.getElementById('generated-code-title')
    
      if (language === 'node-fetch') {
        generatedCodeTitle.innerHTML = 'Node (fetch)'
      } else if (language === 'node-request') {
        generatedCodeTitle.innerHTML = 'Node (request)'
      } else if (language === 'php') {
        generatedCodeTitle.innerHTML = 'PHP requests'
      } else if (language === 'browser') {
        generatedCodeTitle.innerHTML = 'Browser (fetch)'
      } else if (language === 'ansible') {
        generatedCodeTitle.innerHTML = 'Ansible URI'
      } else if (language === 'r') {
        generatedCodeTitle.innerHTML = 'R httr'
      } else if (language === 'go') {
        generatedCodeTitle.innerHTML = 'Go'
      } else if (language === 'strest') {
        generatedCodeTitle.innerHTML = 'Strest'
      } else if (language === 'rust') {
        generatedCodeTitle.innerHTML = 'Rust'
      } else if (language === 'elixir') {
        generatedCodeTitle.innerHTML = 'Elixir'
      } else if (language === 'dart') {
        generatedCodeTitle.innerHTML = 'Dart'
      } else if (language === 'java') {
        generatedCodeTitle.innerHTML = 'Java'
      } else if (language === 'json') {
        generatedCodeTitle.innerHTML = 'JSON'
      } else if (language === 'matlab') {
        generatedCodeTitle.innerHTML = 'MATLAB'
      } else {
        generatedCodeTitle.innerHTML = 'Python requests'
      }
      window.location.hash = '#' + language
      var languageSelect = document.getElementById('language')
      languageSelect.value = language
    
      return language
    }
    
    var getLanguage = function () {
      var languageSelect = document.getElementById('language')
      return languageSelect.value
    }
    
    var convert = function () {
      var curlCode = document.getElementById('curl-code').value
      var generatedCode
      if (curlCode.indexOf('curl') === -1) {
        generatedCode = 'Could not parse curl command.'
      } else {
        try {
          var language = getLanguage()
          if (language === 'node-fetch') {
            generatedCode = curlconverter.toNodeFetch(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tonodefetch')
          } else if (language === 'node-request') {
            generatedCode = curlconverter.toNodeRequest(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tonoderequests')
          } else if (language === 'php') {
            generatedCode = curlconverter.toPhp(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tophp')
          } else if (language === 'browser') {
            generatedCode = curlconverter.toBrowser(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tobrowser')
          } else if (language === 'r') {
            generatedCode = curlconverter.toR(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tor')
          } else if (language === 'go') {
            generatedCode = curlconverter.toGo(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'togo')
          } else if (language === 'strest') {
            generatedCode = curlconverter.toStrest(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tostrest')
          } else if (language === 'rust') {
            generatedCode = curlconverter.toRust(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'torust')
          } else if (language === 'elixir') {
            generatedCode = curlconverter.toElixir(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'toelixir')
          } else if (language === 'dart') {
            generatedCode = curlconverter.toDart(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'todart')
          } else if (language === 'java') {
            generatedCode = curlconverter.toJava(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tojava')
          } else if (language === 'json') {
            generatedCode = curlconverter.toJsonString(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tojson')
          } else if (language === 'ansible') {
            generatedCode = curlconverter.toAnsible(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'toansible')
          } else if (language === 'matlab') {
            generatedCode = curlconverter.toMATLAB(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'tomatlab')
          } else {
            generatedCode = curlconverter.toPython(curlCode)
            //window['ga']('send', 'event', 'convertcode', 'topython')
          }
          hideIssuePromo()
        } catch (e) {
          console.log(e)
          if (curlCode.indexOf('curl') !== 0) {
            generatedCode = 'Error parsing curl command. Your input should start with the word "curl"'
          } else {
            generatedCode = 'Error parsing curl command.'
          }
          window['ga']('send', 'event', 'convertcode', 'parseerror')
          showIssuePromo()
        }
      }
      document.getElementById('generated-code').value = generatedCode
    }
    
    var showIssuePromo = function () {
      document.getElementById('issue-promo').style.display = 'inline-block'
    }
    
    var hideIssuePromo = function () {
      document.getElementById('issue-promo').style.display = 'none'
    }
    
    var showExample = function (code) {
      document.getElementById('curl-code').value = code
      convert()
    }
    
    },{"curlconverter":35}]},{},[106]);
    
    
    
    