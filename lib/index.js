'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var crypto = _interopDefault(require('crypto'));
var reactDom = require('react-dom');
var reactDom__default = _interopDefault(reactDom);

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto.randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

var bytesToUuid_1 = bytesToUuid;

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid_1(b);
}

var v1_1 = v1;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var reactIs_production_min = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.suspense_list"):
60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.fundamental"):60117,w=b?Symbol.for("react.responder"):60118,x=b?Symbol.for("react.scope"):60119;function y(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case h:return a;default:return u}}case t:case r:case d:return u}}}function z(a){return y(a)===m}
exports.typeOf=y;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;
exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===v||a.$$typeof===w||a.$$typeof===x)};exports.isAsyncMode=function(a){return z(a)||y(a)===l};exports.isConcurrentMode=z;exports.isContextConsumer=function(a){return y(a)===k};exports.isContextProvider=function(a){return y(a)===h};
exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return y(a)===n};exports.isFragment=function(a){return y(a)===e};exports.isLazy=function(a){return y(a)===t};exports.isMemo=function(a){return y(a)===r};exports.isPortal=function(a){return y(a)===d};exports.isProfiler=function(a){return y(a)===g};exports.isStrictMode=function(a){return y(a)===f};exports.isSuspense=function(a){return y(a)===p};
});

unwrapExports(reactIs_production_min);
var reactIs_production_min_1 = reactIs_production_min.typeOf;
var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
var reactIs_production_min_6 = reactIs_production_min.Element;
var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
var reactIs_production_min_8 = reactIs_production_min.Fragment;
var reactIs_production_min_9 = reactIs_production_min.Lazy;
var reactIs_production_min_10 = reactIs_production_min.Memo;
var reactIs_production_min_11 = reactIs_production_min.Portal;
var reactIs_production_min_12 = reactIs_production_min.Profiler;
var reactIs_production_min_13 = reactIs_production_min.StrictMode;
var reactIs_production_min_14 = reactIs_production_min.Suspense;
var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
var reactIs_production_min_20 = reactIs_production_min.isElement;
var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
var reactIs_production_min_22 = reactIs_production_min.isFragment;
var reactIs_production_min_23 = reactIs_production_min.isLazy;
var reactIs_production_min_24 = reactIs_production_min.isMemo;
var reactIs_production_min_25 = reactIs_production_min.isPortal;
var reactIs_production_min_26 = reactIs_production_min.isProfiler;
var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
var reactIs_production_min_28 = reactIs_production_min.isSuspense;

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

Object.defineProperty(exports, '__esModule', { value: true });

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */
var lowPriorityWarningWithoutStack = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });

    if (typeof console !== 'undefined') {
      console.warn(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarningWithoutStack = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(void 0, [format].concat(args));
    }
  };
}

var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_LAZY_TYPE:
      case REACT_MEMO_TYPE:
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true;
      lowPriorityWarningWithoutStack$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.typeOf = typeOf;
exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isValidElementType = isValidElementType;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
  })();
}
});

unwrapExports(reactIs_development);
var reactIs_development_1 = reactIs_development.typeOf;
var reactIs_development_2 = reactIs_development.AsyncMode;
var reactIs_development_3 = reactIs_development.ConcurrentMode;
var reactIs_development_4 = reactIs_development.ContextConsumer;
var reactIs_development_5 = reactIs_development.ContextProvider;
var reactIs_development_6 = reactIs_development.Element;
var reactIs_development_7 = reactIs_development.ForwardRef;
var reactIs_development_8 = reactIs_development.Fragment;
var reactIs_development_9 = reactIs_development.Lazy;
var reactIs_development_10 = reactIs_development.Memo;
var reactIs_development_11 = reactIs_development.Portal;
var reactIs_development_12 = reactIs_development.Profiler;
var reactIs_development_13 = reactIs_development.StrictMode;
var reactIs_development_14 = reactIs_development.Suspense;
var reactIs_development_15 = reactIs_development.isValidElementType;
var reactIs_development_16 = reactIs_development.isAsyncMode;
var reactIs_development_17 = reactIs_development.isConcurrentMode;
var reactIs_development_18 = reactIs_development.isContextConsumer;
var reactIs_development_19 = reactIs_development.isContextProvider;
var reactIs_development_20 = reactIs_development.isElement;
var reactIs_development_21 = reactIs_development.isForwardRef;
var reactIs_development_22 = reactIs_development.isFragment;
var reactIs_development_23 = reactIs_development.isLazy;
var reactIs_development_24 = reactIs_development.isMemo;
var reactIs_development_25 = reactIs_development.isPortal;
var reactIs_development_26 = reactIs_development.isProfiler;
var reactIs_development_27 = reactIs_development.isStrictMode;
var reactIs_development_28 = reactIs_development.isSuspense;

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
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

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
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

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        switch (d.constructor) {
          case Array:
            for (var c = 0, e = d.length; c < e; ++c) {
              T(d[c]);
            }

            break;

          case Function:
            S[A++] = d;
            break;

          case Boolean:
            Y = !!d | 0;
        }

    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

var stylisRuleSheet = createCommonjsModule(function (module, exports) {
(function (factory) {
	 (module['exports'] = factory()) ;
}(function () {

	return function (insertRule) {
		var delimiter = '/*|*/';
		var needle = delimiter+'}';

		function toSheet (block) {
			if (block)
				try {
					insertRule(block + '}');
				} catch (e) {}
		}

		return function ruleSheet (context, content, selectors, parents, line, column, length, ns, depth, at) {
			switch (context) {
				// property
				case 1:
					// @import
					if (depth === 0 && content.charCodeAt(0) === 64)
						return insertRule(content+';'), ''
					break
				// selector
				case 2:
					if (ns === 0)
						return content + delimiter
					break
				// at-rule
				case 3:
					switch (ns) {
						// @font-face, @page
						case 102:
						case 112:
							return insertRule(selectors[0]+content), ''
						default:
							return content + (at === 0 ? delimiter : '')
					}
				case -2:
					content.split(needle).forEach(toSheet);
			}
		}
	}
}));
});

var hyphenateRegex = /[A-Z]|^ms/g;
var processStyleName = memoize(function (styleName) {
  return styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});
var processStyleValue = function processStyleValue(key, value) {
  if (value == null || typeof value === 'boolean') {
    return '';
  }

  if (unitlessKeys[key] !== 1 && key.charCodeAt(1) !== 45 && // custom properties
  !isNaN(value) && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    return oldProcessStyleValue(key, value);
  };
}

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'function':
        if (process.env.NODE_ENV !== 'production') {
          console.error('Passing functions to cx is deprecated and will be removed in the next major version of Emotion.\n' + 'Please call the function before passing it to cx.');
        }

        toAdd = classnames([arg()]);
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};
var isBrowser = typeof document !== 'undefined';

/*

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side

// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

styleSheet.inject()
- 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function makeStyleTag(opts) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', opts.key || '');

  if (opts.nonce !== undefined) {
    tag.setAttribute('nonce', opts.nonce);
  }

  tag.appendChild(document.createTextNode('')) // $FlowFixMe
  ;
  (opts.container !== undefined ? opts.container : document.head).appendChild(tag);
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = process.env.NODE_ENV === 'production'; // the big drawback here is that the css won't be editable in devtools

    this.tags = [];
    this.ctr = 0;
    this.opts = options;
  }

  var _proto = StyleSheet.prototype;

  _proto.inject = function inject() {
    if (this.injected) {
      throw new Error('already injected!');
    }

    this.tags[0] = makeStyleTag(this.opts);
    this.injected = true;
  };

  _proto.speedy = function speedy(bool) {
    if (this.ctr !== 0) {
      // cannot change speedy mode after inserting any rule to sheet. Either call speedy(${bool}) earlier in your app, or call flush() before speedy(${bool})
      throw new Error("cannot change speedy now");
    }

    this.isSpeedy = !!bool;
  };

  _proto.insert = function insert(rule, sourceMap) {
    // this is the ultrafast version, works across browsers
    if (this.isSpeedy) {
      var tag = this.tags[this.tags.length - 1];
      var sheet = sheetForTag(tag);

      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('illegal rule', rule); // eslint-disable-line no-console
        }
      }
    } else {
      var _tag = makeStyleTag(this.opts);

      this.tags.push(_tag);

      _tag.appendChild(document.createTextNode(rule + (sourceMap || '')));
    }

    this.ctr++;

    if (this.ctr % 65000 === 0) {
      this.tags.push(makeStyleTag(this.opts));
    }
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0; // todo - look for remnants in document.styleSheets

    this.injected = false;
  };

  return StyleSheet;
}();

function createEmotion(context, options) {
  if (context.__SECRET_EMOTION__ !== undefined) {
    return context.__SECRET_EMOTION__;
  }

  if (options === undefined) options = {};
  var key = options.key || 'css';

  if (process.env.NODE_ENV !== 'production') {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var current;

  function insertRule(rule) {
    current += rule;

    if (isBrowser) {
      sheet.insert(rule, currentSourceMap);
    }
  }

  var insertionPlugin = stylisRuleSheet(insertRule);
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var caches = {
    registered: {},
    inserted: {},
    nonce: options.nonce,
    key: key
  };
  var sheet = new StyleSheet(options);

  if (isBrowser) {
    // 🚀
    sheet.inject();
  }

  var stylis = new stylis_min(stylisOptions);
  stylis.use(options.stylisPlugins)(insertionPlugin);
  var currentSourceMap = '';

  function handleInterpolation(interpolation, couldBeSelectorInterpolation) {
    if (interpolation == null) {
      return '';
    }

    switch (typeof interpolation) {
      case 'boolean':
        return '';

      case 'function':
        if (interpolation.__emotion_styles !== undefined) {
          var selector = interpolation.toString();

          if (selector === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          return selector;
        }

        if (this === undefined && process.env.NODE_ENV !== 'production') {
          console.error('Interpolating functions in css calls is deprecated and will be removed in the next major version of Emotion.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        return handleInterpolation.call(this, this === undefined ? interpolation() : // $FlowFixMe
        interpolation(this.mergedProps, this.context), couldBeSelectorInterpolation);

      case 'object':
        return createStringFromObject.call(this, interpolation);

      default:
        var cached = caches.registered[interpolation];
        return couldBeSelectorInterpolation === false && cached !== undefined ? cached : interpolation;
    }
  }

  var objectToStringCache = new WeakMap();

  function createStringFromObject(obj) {
    if (objectToStringCache.has(obj)) {
      // $FlowFixMe
      return objectToStringCache.get(obj);
    }

    var string = '';

    if (Array.isArray(obj)) {
      obj.forEach(function (interpolation) {
        string += handleInterpolation.call(this, interpolation, false);
      }, this);
    } else {
      Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] !== 'object') {
          if (caches.registered[obj[key]] !== undefined) {
            string += key + "{" + caches.registered[obj[key]] + "}";
          } else {
            string += processStyleName(key) + ":" + processStyleValue(key, obj[key]) + ";";
          }
        } else {
          if (key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          if (Array.isArray(obj[key]) && typeof obj[key][0] === 'string' && caches.registered[obj[key][0]] === undefined) {
            obj[key].forEach(function (value) {
              string += processStyleName(key) + ":" + processStyleValue(key, value) + ";";
            });
          } else {
            string += key + "{" + handleInterpolation.call(this, obj[key], false) + "}";
          }
        }
      }, this);
    }

    objectToStringCache.set(obj, string);
    return string;
  }

  var name;
  var stylesWithLabel;
  var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;

  var createClassName = function createClassName(styles, identifierName) {
    return murmurhash2_32_gc(styles + identifierName) + identifierName;
  };

  if (process.env.NODE_ENV !== 'production') {
    var oldCreateClassName = createClassName;
    var sourceMappingUrlPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

    createClassName = function createClassName(styles, identifierName) {
      return oldCreateClassName(styles.replace(sourceMappingUrlPattern, function (sourceMap) {
        currentSourceMap = sourceMap;
        return '';
      }), identifierName);
    };
  }

  var createStyles = function createStyles(strings) {
    var stringMode = true;
    var styles = '';
    var identifierName = '';

    if (strings == null || strings.raw === undefined) {
      stringMode = false;
      styles += handleInterpolation.call(this, strings, false);
    } else {
      styles += strings[0];
    }

    for (var _len = arguments.length, interpolations = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    interpolations.forEach(function (interpolation, i) {
      styles += handleInterpolation.call(this, interpolation, styles.charCodeAt(styles.length - 1) === 46 // .
      );

      if (stringMode === true && strings[i + 1] !== undefined) {
        styles += strings[i + 1];
      }
    }, this);
    stylesWithLabel = styles;
    styles = styles.replace(labelPattern, function (match, p1) {
      identifierName += "-" + p1;
      return '';
    });
    name = createClassName(styles, identifierName);
    return styles;
  };

  if (process.env.NODE_ENV !== 'production') {
    var oldStylis = stylis;

    stylis = function stylis(selector, styles) {
      oldStylis(selector, styles);
      currentSourceMap = '';
    };
  }

  function insert(scope, styles) {
    if (caches.inserted[name] === undefined) {
      current = '';
      stylis(scope, styles);
      caches.inserted[name] = current;
    }
  }

  var css = function css() {
    var styles = createStyles.apply(this, arguments);
    var selector = key + "-" + name;

    if (caches.registered[selector] === undefined) {
      caches.registered[selector] = stylesWithLabel;
    }

    insert("." + selector, styles);
    return selector;
  };

  var keyframes = function keyframes() {
    var styles = createStyles.apply(this, arguments);
    var animation = "animation-" + name;
    insert('', "@keyframes " + animation + "{" + styles + "}");
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    var styles = createStyles.apply(this, arguments);
    insert('', styles);
  };

  function getRegisteredStyles(registeredStyles, classNames) {
    var rawClassName = '';
    classNames.split(' ').forEach(function (className) {
      if (caches.registered[className] !== undefined) {
        registeredStyles.push(className);
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }

  function merge(className, sourceMap) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registeredStyles, className);

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css(registeredStyles, sourceMap);
  }

  function cx() {
    for (var _len2 = arguments.length, classNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      classNames[_key2] = arguments[_key2];
    }

    return merge(classnames(classNames));
  }

  function hydrateSingleId(id) {
    caches.inserted[id] = true;
  }

  function hydrate(ids) {
    ids.forEach(hydrateSingleId);
  }

  function flush() {
    if (isBrowser) {
      sheet.flush();
      sheet.inject();
    }

    caches.inserted = {};
    caches.registered = {};
  }

  if (isBrowser) {
    var chunks = document.querySelectorAll("[data-emotion-" + key + "]");
    Array.prototype.forEach.call(chunks, function (node) {
      // $FlowFixMe
      sheet.tags[0].parentNode.insertBefore(node, sheet.tags[0]); // $FlowFixMe

      node.getAttribute("data-emotion-" + key).split(' ').forEach(hydrateSingleId);
    });
  }

  var emotion = {
    flush: flush,
    hydrate: hydrate,
    cx: cx,
    merge: merge,
    getRegisteredStyles: getRegisteredStyles,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    css: css,
    sheet: sheet,
    caches: caches
  };
  context.__SECRET_EMOTION__ = emotion;
  return emotion;
}

var context = typeof global !== 'undefined' ? global : {};

var _createEmotion = createEmotion(context),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    caches = _createEmotion.caches;

var stylesToClasses = function stylesToClasses() {
  var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(styles).reduce(function (classNames, styleKey) {
    return _objectSpread2({}, classNames, _defineProperty({}, styleKey, css(_objectSpread2({}, styles[styleKey], {
      label: styleKey
    }))));
  }, {});
};
var addKeyframes = function addKeyframes() {
  var keyframes$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(keyframes$1).reduce(function (keyframeNames, keyframeKey) {
    return _objectSpread2({}, keyframeNames, _defineProperty({}, keyframeKey, keyframes(keyframes$1[keyframeKey])));
  }, {});
};

/**
 * Sizing and Rhythm
 */
var rhythm = function rhythm() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'rem';
  var basis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.5;
  return Array.isArray(value) ? value.map(function (v) {
    return "".concat(basis * v).concat(unit);
  }).join(' ') : "".concat(basis * value).concat(unit);
};
var scale = function scale() {
  var exponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.2;
  return "".concat(Math.pow(scale, exponent), "rem");
};
/**
 * Colors
 */

var colors = {
  light: '#FFFFFF',
  dark: '#1B1C1D',
  grey: '#767676',
  lightGrey: '#999999',
  paleGrey: '#f5f5f5',
  primary: '#F2711C',
  secondary: '#FBBD08',
  tertiary: '#203a44',
  shade: 'rgba(0, 0, 0, 0.125)',
  tint: 'rgba(255, 255, 255, 0.25)',
  transparent: 'transparent',
  inherit: 'inherit',
  facebook: '#3b5999',
  twitter: '#55acee',
  instagram: '#e4405f',
  youtube: '#cd201f',
  linkedin: '#0084bf',
  google: '#dd4b39',
  vimeo: '#1ab7ea',
  fitbit: '#00b0b9',
  mapmyfitness: '#004a8d',
  strava: '#fc4c02',
  twitch: '#6701B3',
  slack: '#4a154b',
  whatsapp: '#25d366',
  pinterest: '#bd081c',
  messenger: '#0084ff',
  reddit: '#ff4500',
  danger: '#DB2828',
  success: '#5cb85c',
  blackbaud: '#8cbe4f',
  everydayhero: '#1bab6b',
  justgiving: '#ad29b6'
};
/**
 * Fonts
 */

var fonts = {
  head: '"Open Sans", sans-serif',
  body: "'Raleway', 'Helvetica', 'sans-serif'"
};
var measures = {
  medium: 1.5
};
var treatments = {
  head: {
    fontFamily: fonts.head,
    fontWeight: 700
  },
  body: {
    fontFamily: fonts.body
  },
  button: {
    fontFamily: fonts.head,
    textTransform: 'uppercase',
    fontWeight: 700
  },
  input: {
    fontFamily: fonts.body
  },
  container: {
    maxWidth: rhythm(40)
  }
};
/**
 * Default background styles
 */

var background = function background(url) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cover';
  return {
    backgroundImage: !!url && "url('".concat(url, "')"),
    backgroundSize: size,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
  };
};
/**
 * Borders and Edges
 */

var shadows = {
  none: 'none',
  light: '0 0 15px rgba(0, 0, 0, 0.125)'
};
var radiuses = {
  none: 0,
  small: 0.1,
  medium: 0.25,
  large: 50
};
/**
 * Media Queries
 */

var breakpoints = {
  xs: '24rem',
  sm: '36rem',
  md: '48rem',
  lg: '60rem',
  xl: '72rem'
};
var mediaQuery = function mediaQuery() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'sm';
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'min-width';
  return "@media (".concat(query, ": ").concat(breakpoints[size], ")");
};
/**
 * Effects, Animations, Transitions, Utils
 */

var transitions = {
  easeOut: 'ease-out .25s'
};
var utils = {
  fullSize: {
    position: 'absolute',
    content: '""',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
var effects = {
  none: {},
  shade: {
    position: 'relative',
    '&:before': _objectSpread2({
      transition: transitions.easeOut
    }, utils.fullSize, {
      backgroundColor: colors.shade,
      opacity: 0
    }),
    '&:hover:before': {
      opacity: 1
    }
  },
  tint: {
    position: 'relative',
    '&:before': _objectSpread2({
      transition: transitions.easeOut
    }, utils.fullSize, {
      backgroundColor: colors.tint,
      opacity: 0
    }),
    '&:hover:before': {
      opacity: 1
    }
  },
  grow: {
    transition: transitions.easeOut,
    backfaceVisibility: 'hidden',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  shrink: {
    transition: transitions.easeOut,
    backfaceVisibility: 'hidden',
    '&:hover': {
      transform: 'scale(0.925)'
    }
  }
};
/**
 * Flexbox justifyContent style polyfill
 */

var justifyContent = function justifyContent(value) {
  var flexPack = {
    'flex-start': 'start',
    'flex-end': 'end',
    'space-between': 'justify',
    'space-around': 'distribute',
    center: 'center'
  };
  return {
    justifyContent: value,
    flexPack: flexPack[value]
  };
};
/**
 * Spacing - for handling spacing objects i.e. padding/margin props
 * e.g. { x: 1, y: 2 } or { l: 1, t: 2 } or 5 etc.
 */

var calculateSpacing = function calculateSpacing(spacing) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'padding';
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var defaultOptions = {
    multiplier: 1
  };

  var options = _objectSpread2({}, defaultOptions, {}, args);

  switch (_typeof(spacing)) {
    case 'number':
      return _defineProperty({}, type, rhythm(spacing * options.multiplier, options.unit, options.basis));

    case 'object':
      return Object.keys(spacing).reduce(function (styles, direction) {
        return _objectSpread2({}, styles, {}, spacingDirection(direction, spacing[direction], type, options));
      }, {});

    default:
      return {};
  }
};

var spacingDirection = function spacingDirection(direction, space, type, options) {
  var map = {
    t: ['Top'],
    r: ['Right'],
    b: ['Bottom'],
    l: ['Left'],
    x: ['Left', 'Right'],
    y: ['Top', 'Bottom']
  };
  var fields = map[direction] || [];
  var styles = fields.reduce(function (styles, property) {
    return _objectSpread2({}, styles, _defineProperty({}, "".concat(type).concat(property), rhythm(space * options.multiplier, options.unit, options.basis)));
  }, {});
  return styles;
};

var defaultTraits = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rhythm: rhythm,
  scale: scale,
  colors: colors,
  fonts: fonts,
  measures: measures,
  treatments: treatments,
  background: background,
  shadows: shadows,
  radiuses: radiuses,
  breakpoints: breakpoints,
  mediaQuery: mediaQuery,
  transitions: transitions,
  utils: utils,
  effects: effects,
  justifyContent: justifyContent,
  calculateSpacing: calculateSpacing
});

/**
 * Higher order component to take a styles function and call it with the necessary props and traits
 */

var withStyles = function withStyles(styles) {
  var keyframes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (ComponentToWrap) {
    var ConnectStyles =
    /*#__PURE__*/
    function (_Component) {
      _inherits(ConnectStyles, _Component);

      function ConnectStyles() {
        _classCallCheck(this, ConnectStyles);

        return _possibleConstructorReturn(this, _getPrototypeOf(ConnectStyles).apply(this, arguments));
      }

      _createClass(ConnectStyles, [{
        key: "render",
        value: function render() {
          // Get current traits and defaults from context
          var _this$context$traits = this.context.traits,
              traits = _this$context$traits === void 0 ? defaultTraits : _this$context$traits; // Build our combined props from the component itself's default props,
          // The specified default traits, and the actual provided props

          var combinedProps = _objectSpread2({}, ComponentToWrap.defaultProps, {}, this.props); // Add any keyframes


          var keyframesIsFunction = typeof keyframes === 'function';
          var keyframesObject = keyframesIsFunction ? keyframes(combinedProps, traits) : keyframes;
          var keyframeNames = addKeyframes(keyframesObject); // Opt out of built-in styles

          if (_typeof(this.props.classNames) === 'object') {
            var _newProps = _objectSpread2({}, combinedProps, {
              styles: {},
              classNames: this.props.classNames
            });

            return React__default.createElement(ComponentToWrap, _newProps);
          } // If styles is a function, call it and pass through our props and traits


          var stylesIsFunction = typeof styles === 'function';
          var stylesObject = stylesIsFunction ? styles(combinedProps, traits, keyframeNames) : styles; // Build out our final props to be passed down to the original component

          var newProps = _objectSpread2({}, combinedProps, {
            styles: stylesObject,
            classNames: stylesToClasses(stylesObject)
          });

          return React__default.createElement(ComponentToWrap, newProps);
        }
      }]);

      return ConnectStyles;
    }(React.Component);

    ConnectStyles.contextTypes = {
      traits: propTypes.object
    };
    return ConnectStyles;
  };
};

var styles = (function (props, traits, keyframes) {
  var color = props.color,
      rotate = props.rotate,
      size = props.size,
      spin = props.spin,
      styles = props.styles;
  return {
    root: _objectSpread2({
      fill: traits.colors[color] || color,
      display: 'inline-block',
      width: "".concat(size, "em"),
      height: "".concat(size, "em"),
      transform: "rotate(".concat(rotate, "deg)"),
      animation: spin && "".concat(keyframes.spin, " 1s linear infinite")
    }, styles)
  };
});
var keyframes$1 = {
  spin: {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
};

/**
 * Social / Providers
 */
var facebook = [{
  d: 'M8 12 L13 12 L13 8 C13 2 17 1 24 2 L24 7 C20 7 19 7 19 10 L19 12 L24 12 L23 18 L19 18 L19 30 L13 30 L13 18 L8 18 z'
}];
var twitter = [{
  d: 'M2 4 C6 8 10 12 15 11 A6 6 0 0 1 22 4 A6 6 0 0 1 26 6 A8 8 0 0 0 31 4 A8 8 0 0 1 28 8 A8 8 0 0 0 32 7 A8 8 0 0 1 28 11 A18 18 0 0 1 10 30 A18 18 0 0 1 0 27 A12 12 0 0 0 8 24 A8 8 0 0 1 3 20 A8 8 0 0 0 6 19.5 A8 8 0 0 1 0 12 A8 8 0 0 0 3 13 A8 8 0 0 1 2 4'
}];
var instagram = [{
  d: 'M16 2.881c4.275 0 4.781 0.019 6.462 0.094 1.563 0.069 2.406 0.331 2.969 0.55 0.744 0.288 1.281 0.638 1.837 1.194 0.563 0.563 0.906 1.094 1.2 1.838 0.219 0.563 0.481 1.412 0.55 2.969 0.075 1.688 0.094 2.194 0.094 6.463s-0.019 4.781-0.094 6.463c-0.069 1.563-0.331 2.406-0.55 2.969-0.288 0.744-0.637 1.281-1.194 1.837-0.563 0.563-1.094 0.906-1.837 1.2-0.563 0.219-1.413 0.481-2.969 0.55-1.688 0.075-2.194 0.094-6.463 0.094s-4.781-0.019-6.463-0.094c-1.563-0.069-2.406-0.331-2.969-0.55-0.744-0.288-1.281-0.637-1.838-1.194-0.563-0.563-0.906-1.094-1.2-1.837-0.219-0.563-0.481-1.413-0.55-2.969-0.075-1.688-0.094-2.194-0.094-6.463s0.019-4.781 0.094-6.463c0.069-1.563 0.331-2.406 0.55-2.969 0.288-0.744 0.638-1.281 1.194-1.838 0.563-0.563 1.094-0.906 1.838-1.2 0.563-0.219 1.412-0.481 2.969-0.55 1.681-0.075 2.188-0.094 6.463-0.094zM16 0c-4.344 0-4.887 0.019-6.594 0.094-1.7 0.075-2.869 0.35-3.881 0.744-1.056 0.412-1.95 0.956-2.837 1.85-0.894 0.888-1.438 1.781-1.85 2.831-0.394 1.019-0.669 2.181-0.744 3.881-0.075 1.713-0.094 2.256-0.094 6.6s0.019 4.887 0.094 6.594c0.075 1.7 0.35 2.869 0.744 3.881 0.413 1.056 0.956 1.95 1.85 2.837 0.887 0.887 1.781 1.438 2.831 1.844 1.019 0.394 2.181 0.669 3.881 0.744 1.706 0.075 2.25 0.094 6.594 0.094s4.888-0.019 6.594-0.094c1.7-0.075 2.869-0.35 3.881-0.744 1.050-0.406 1.944-0.956 2.831-1.844s1.438-1.781 1.844-2.831c0.394-1.019 0.669-2.181 0.744-3.881 0.075-1.706 0.094-2.25 0.094-6.594s-0.019-4.887-0.094-6.594c-0.075-1.7-0.35-2.869-0.744-3.881-0.394-1.063-0.938-1.956-1.831-2.844-0.887-0.887-1.781-1.438-2.831-1.844-1.019-0.394-2.181-0.669-3.881-0.744-1.712-0.081-2.256-0.1-6.6-0.1v0z'
}, {
  d: 'M16 7.781c-4.537 0-8.219 3.681-8.219 8.219s3.681 8.219 8.219 8.219 8.219-3.681 8.219-8.219c0-4.537-3.681-8.219-8.219-8.219zM16 21.331c-2.944 0-5.331-2.387-5.331-5.331s2.387-5.331 5.331-5.331c2.944 0 5.331 2.387 5.331 5.331s-2.387 5.331-5.331 5.331z'
}, {
  d: 'M26.462 7.456c0 1.060-0.859 1.919-1.919 1.919s-1.919-0.859-1.919-1.919c0-1.060 0.859-1.919 1.919-1.919s1.919 0.859 1.919 1.919z'
}];
var youtube = [{
  d: 'M31.681 9.6c0 0-0.313-2.206-1.275-3.175-1.219-1.275-2.581-1.281-3.206-1.356-4.475-0.325-11.194-0.325-11.194-0.325h-0.012c0 0-6.719 0-11.194 0.325-0.625 0.075-1.987 0.081-3.206 1.356-0.963 0.969-1.269 3.175-1.269 3.175s-0.319 2.588-0.319 5.181v2.425c0 2.587 0.319 5.181 0.319 5.181s0.313 2.206 1.269 3.175c1.219 1.275 2.819 1.231 3.531 1.369 2.563 0.244 10.881 0.319 10.881 0.319s6.725-0.012 11.2-0.331c0.625-0.075 1.988-0.081 3.206-1.356 0.962-0.969 1.275-3.175 1.275-3.175s0.319-2.587 0.319-5.181v-2.425c-0.006-2.588-0.325-5.181-0.325-5.181zM12.694 20.15v-8.994l8.644 4.513-8.644 4.481z'
}];
var linkedin = [{
  d: 'M11.2,16.7104 C11.2,14.2384 11.1184,12.1728 11.0368,10.3888 L16.7872,10.3888 L17.072,13.1456 L17.1936,13.1456 C18.0032,11.848 19.9872,9.9456 23.3088,9.9456 C27.36,9.9456 30.4,12.6576 30.4,18.4928 L30.4,30.4 L24,30.4 L24,19.4224 C24,16.872 23.0288,14.9264 20.8,14.9264 C19.1008,14.9264 18.2496,16.3024 17.8032,17.4368 C17.64,17.8432 17.6,18.4096 17.6,18.9776 L17.6,30.4 L11.2,30.4 L11.2,16.7104 Z M8,4.8 C8,6.4992 6.864,7.9616 4.7984,7.9616 C2.8544,7.9616 1.6,6.5824 1.6,4.8832 C1.6,3.1392 2.816,1.6 4.8,1.6 C6.784,1.6 7.9616,3.056 8,4.8 Z M1.6,30.4 L1.6,9.6 L8,9.6 L8,30.4 L1.6,30.4 Z'
}];
var google = [{
  d: 'M16.319 13.713v5.487h9.075c-0.369 2.356-2.744 6.9-9.075 6.9-5.463 0-9.919-4.525-9.919-10.1s4.456-10.1 9.919-10.1c3.106 0 5.188 1.325 6.375 2.469l4.344-4.181c-2.788-2.612-6.4-4.188-10.719-4.188-8.844 0-16 7.156-16 16s7.156 16 16 16c9.231 0 15.363-6.494 15.363-15.631 0-1.050-0.113-1.85-0.25-2.65l-15.113-0.006z'
}];
var vimeo = [{
  d: 'M31.9494219,8.4180539 C31.8095733,11.5346808 29.6319301,15.8040602 25.4304772,21.2241941 C21.0751908,26.8820707 17.3991693,29.711009 14.3824342,29.711009 C12.5044667,29.711009 10.9461532,27.9888729 9.64755868,24.5406048 L7.09232415,15.0608645 C6.13336201,11.6165922 5.10847122,9.89245818 4.01165828,9.89245818 C3.77191774,9.89245818 2.93682155,10.3959133 1.50437185,11.4008257 L1.13686838e-13,9.45892738 C1.57829185,8.06843228 3.13260965,6.68193286 4.66495124,5.29143776 C6.76867443,3.46940969 8.34896412,2.51444323 9.39982679,2.41455134 C11.8891327,2.17481081 13.4194764,3.87896644 13.9948537,7.52901608 C14.6141834,11.4647565 15.0457164,13.91011 15.2874548,14.8670743 C16.0066764,18.1315412 16.7938244,19.7617769 17.6548925,19.7617769 C18.3241682,19.7617769 19.3290806,18.7029228 20.6716276,16.5852148 C22.0101789,14.4675067 22.7254048,12.8572495 22.8213011,11.7504473 C23.0130935,9.92242575 22.2958697,9.0054182 20.6696298,9.0054182 C19.9044579,9.0054182 19.115312,9.16524523 18.302192,9.52485603 C19.8804838,4.37043454 22.8772405,1.85315892 27.3124404,2.01298595 C30.6088728,2.09289946 32.1472079,4.23058589 31.9674025,8.40606687 L31.9494219,8.4180539 Z'
}];
var strava = [{
  d: 'M18.064098,18.3580735 C19.9065143,18.3580735 21.7488,18.3580735 23.6466612,18.3580735 C20.5089633,12.2140082 17.4013714,6.12897959 14.2713796,0 C11.1679673,6.15288163 8.09257143,12.2499265 5,18.3815184 C5.12989388,18.3815184 5.20793469,18.3815837 5.2859102,18.3814531 C6.97302857,18.3785143 8.66014694,18.3730286 10.3472653,18.3765551 C10.514449,18.3769469 10.5998041,18.3284245 10.6761469,18.1761306 C11.8504816,15.8325551 13.0319347,13.4926367 14.2122122,11.1521306 C14.236702,11.1033469 14.2661551,11.0569796 14.3033796,10.992 C14.3451755,11.0718694 14.3758041,11.1292082 14.4054531,11.1870694 C15.2087837,12.756049 16.012898,14.3247673 16.8151184,15.8945306 C17.2353633,16.7169959 17.6522122,17.5412245 18.070498,18.3646041 L18.064098,18.3580735 C18.064098,18.3580735 18.070498,18.3646041 18.0705633,18.3646694 C16.6957388,18.3646694 15.320849,18.3646694 13.9009633,18.3646694 C16.2284082,22.9196408 18.5369796,27.4373878 20.8684735,32 C23.1785469,27.4189061 25.4596245,22.8950857 27.7521306,18.3482776 C27.6673633,18.3391347 27.6177306,18.3291429 27.5680327,18.3292082 C26.3209469,18.3316245 25.0739918,18.3371755 23.8269061,18.3358041 C23.6740245,18.3356082 23.5952653,18.3915102 23.5270204,18.5282612 C22.6741224,20.2356898 21.8147592,21.9399184 20.9565061,23.6446694 C20.9265959,23.7042286 20.8913959,23.7611755 20.8484245,23.8379102 C20.8145959,23.7819429 20.7959837,23.7551673 20.7812898,23.7265633 C19.8911673,21.986351 19.0013061,20.2460735 18.1126204,18.5051429 C18.089502,18.4597551 18.0800327,18.407249 18.064098,18.3580735 Z'
}];
var mapmyfitness = [{
  d: 'M15.9991534,17.6838326 L15.9959297,17.6838326 L15.931456,17.682758 C13.8554023,17.682758 12.1635044,17.176102 10.9223853,16.4013428 C12.1635044,15.6255091 13.8559395,15.1172412 15.9341424,15.1172412 L15.9996907,15.1156294 L16.0023771,15.1156294 L16.0679254,15.1172412 C18.1434419,15.1172412 19.835877,15.6244345 21.0764588,16.3986564 C19.8353397,17.1744902 18.14183,17.682758 16.0636271,17.682758 L15.9980789,17.6838326 L15.9991534,17.6838326 Z M26.0758584,16.3986564 C29.5810796,14.8609582 31.8709712,12.5517245 31.9950832,9.98996873 C31.9950832,9.98996873 31.0709598,9.27914597 28.0836775,8.18363003 C25.4585226,7.22082249 23.4576882,7 23.4576882,7 L23.4668219,12.7086106 C23.4668219,13.5618128 23.1229621,14.4343571 22.4739267,15.204818 C20.4902852,14.726638 18.3003279,14.4579975 16.0023771,14.4569229 L16.0013025,14.4569229 C13.6990535,14.4579975 11.5074843,14.7282498 9.52169376,15.2075045 C8.87158376,14.4359689 8.52772393,13.5634246 8.52772393,12.7091478 L8.5368577,7.00053728 C8.5368577,7.00053728 6.53602328,7.22082249 3.91086835,8.18416731 C0.924123309,9.27968325 0,9.98996873 0,9.98996873 C0.12464919,12.5538736 2.41507806,14.8631073 5.92352295,16.399731 C2.41776447,17.939041 0.128947438,20.2472002 0.00376096695,22.8100305 C0.00376096695,22.8100305 0.927884275,23.5208533 3.9151666,24.6169065 C6.54085881,25.5786395 8.54115595,25.7999992 8.54115595,25.7999992 L8.53255945,20.0913887 C8.53255945,19.2371119 8.87641929,18.3667167 9.52652929,17.5951812 C11.5090962,18.0733613 13.6985162,18.3430763 15.9970043,18.3436136 L15.9991534,18.3436136 C18.2997906,18.3436136 20.4918971,18.0733613 22.4766131,17.5941066 C23.1267231,18.3656421 23.4705829,19.2381865 23.4705829,20.0924632 L23.463061,25.7983874 C23.463061,25.7983874 25.4633581,25.5770276 28.0890503,24.6152946 C31.0763327,23.5192414 32.000456,22.8084187 32.000456,22.8084187 C31.8758068,20.2455883 29.5853779,17.9352801 26.076933,16.3975819 L26.0758584,16.3986564 Z'
}];
var fitbit = [{
  d: 'M17.7286776,2.37823724 C17.7286776,3.67545756 16.6476607,4.75647449 15.3504404,4.75647449 C14.0532201,4.75647449 12.9722031,3.67545756 12.9722031,2.37823724 C12.9722031,1.08101693 14.0532201,0 15.3504404,0 C16.6476607,0 17.7286776,1.08101693 17.7286776,2.37823724 Z M15.3504404,6.70230496 C13.9451184,6.70230496 12.8641014,7.78332188 12.8641014,9.18864389 C12.8641014,10.5939659 13.9451184,11.6749828 15.3504404,11.6749828 C16.7557624,11.6749828 17.8367793,10.5939659 17.8367793,9.18864389 C17.8367793,7.78332188 16.7557624,6.70230496 15.3504404,6.70230496 Z M15.3504404,13.4046099 C13.9451184,13.4046099 12.7559998,14.5937285 12.7559998,15.9990505 C12.7559998,17.4043725 13.9451184,18.5934912 15.3504404,18.5934912 C16.7557624,18.5934912 17.944881,17.4043725 17.944881,15.9990505 C17.944881,14.5937285 16.7557624,13.4046099 15.3504404,13.4046099 L15.3504404,13.4046099 Z M15.3504404,20.2150166 C13.9451184,20.2150166 12.8641014,21.2960335 12.8641014,22.7013555 C12.8641014,24.1066775 13.9451184,25.1876944 15.3504404,25.1876944 C16.7557624,25.1876944 17.8367793,24.1066775 17.8367793,22.7013555 C17.8367793,21.4041352 16.7557624,20.2150166 15.3504404,20.2150166 Z M15.3504404,27.1335249 C14.0532201,27.1335249 12.9722031,28.2145418 12.9722031,29.5117621 C12.9722031,30.8089825 14.0532201,31.8899994 15.3504404,31.8899994 C16.6476607,31.8899994 17.7286776,30.8089825 17.7286776,29.5117621 C17.7286776,28.2145418 16.6476607,27.1335249 15.3504404,27.1335249 Z M21.9446436,6.37799988 C20.4312199,6.37799988 19.1339996,7.67522019 19.1339996,9.18864389 C19.1339996,10.7020676 20.4312199,11.9992879 21.9446436,11.9992879 C23.4580673,11.9992879 24.7552877,10.7020676 24.7552877,9.18864389 C24.7552877,7.67522019 23.4580673,6.37799988 21.9446436,6.37799988 Z M21.9446436,13.0803048 C20.3231183,13.0803048 19.0258979,14.3775251 19.0258979,15.9990505 C19.0258979,17.6205759 20.3231183,18.9177962 21.9446436,18.9177962 C23.566169,18.9177962 24.8633894,17.6205759 24.8633894,15.9990505 C24.8633894,14.3775251 23.566169,13.0803048 21.9446436,13.0803048 Z M21.9446436,19.8907115 C20.4312199,19.8907115 19.1339996,21.1879318 19.1339996,22.7013555 C19.1339996,24.2147792 20.4312199,25.5119995 21.9446436,25.5119995 C23.4580673,25.5119995 24.7552877,24.2147792 24.7552877,22.7013555 C24.7552877,21.1879318 23.4580673,19.8907115 21.9446436,19.8907115 Z M28.7550503,12.7559998 C27.0254232,12.7559998 25.5119995,14.1613218 25.5119995,15.9990505 C25.5119995,17.7286776 26.9173215,19.2421013 28.7550503,19.2421013 C30.5927791,19.2421013 31.9981011,17.8367793 31.9981011,15.9990505 C31.8899994,14.1613218 30.4846774,12.7559998 28.7550503,12.7559998 L28.7550503,12.7559998 Z M8.64813543,7.02661004 C7.45901681,7.02661004 6.48610157,7.99952527 6.48610157,9.18864389 C6.48610157,10.3777625 7.45901681,11.3506777 8.64813543,11.3506777 C9.83725405,11.3506777 10.8101693,10.3777625 10.8101693,9.18864389 C10.8101693,7.99952527 9.83725405,7.02661004 8.64813543,7.02661004 Z M8.64813543,13.728915 C7.35091511,13.728915 6.37799988,14.7018302 6.37799988,15.9990505 C6.37799988,17.2962709 7.35091511,18.2691861 8.64813543,18.2691861 C9.94535574,18.2691861 10.918271,17.2962709 10.918271,15.9990505 C10.918271,14.7018302 9.94535574,13.728915 8.64813543,13.728915 Z M8.64813543,20.5393216 C7.45901681,20.5393216 6.48610157,21.5122369 6.48610157,22.7013555 C6.48610157,23.8904741 7.45901681,24.8633894 8.64813543,24.8633894 C9.83725405,24.8633894 10.8101693,23.8904741 10.8101693,22.7013555 C10.8101693,21.5122369 9.83725405,20.5393216 8.64813543,20.5393216 Z M1.94583047,14.0532201 C0.864813543,14.0532201 0,14.9180336 0,15.9990505 C0,17.0800675 0.864813543,17.944881 1.94583047,17.944881 C3.0268474,17.944881 3.89166094,17.0800675 3.89166094,15.9990505 C3.89166094,14.9180336 3.0268474,14.0532201 1.94583047,14.0532201 Z'
}];
var slack = [{
  d: 'M25.2746563,11.7786562 C25.2799375,9.92390625 26.7824688,8.421875 28.636875,8.4173125 L28.6373125,8.4173125 C30.4921563,8.42184375 31.9946875,9.92390625 31.9999688,11.778125 L31.9999688,11.778625 C31.9946875,13.633375 30.4921563,15.1354062 28.63775,15.1399687 L25.2746563,15.1399687 L25.2746563,11.778625 L25.2746563,11.7786562 Z M23.584,11.7786562 C23.5786875,13.633875 22.0754375,15.1362187 20.220375,15.14 L20.22,15.14 C18.366,15.1347187 16.8645313,13.6327812 16.86,11.7790937 L16.86,3.36265625 C16.8637813,1.50796875 18.3655313,0.00528125 20.2195,-8.52651283e-14 L20.22,-8.52651283e-14 C22.0759063,0.00378125 23.5794688,1.506875 23.584,3.36225 L23.584,11.7786875 L23.584,11.7786562 Z M6.72265625,20.22 C6.718875,22.0749688 5.2173125,23.5779375 3.36325,23.584 L3.36265625,23.584 C1.506875,23.5794688 0.00378125,22.0759062 -7.10542736e-15,20.2203437 L-7.10542736e-15,20.22 C0.0053125,18.3655313 1.50796875,16.8637812 3.3623125,16.86 L6.7226875,16.86 L6.7226875,20.22 L6.72265625,20.22 Z M8.41734375,20.22 C8.422625,18.366 9.9245625,16.8645312 11.77825,16.86 L11.7786875,16.86 C13.6328125,16.8645312 15.1347187,18.366 15.1400312,20.2195 L15.1400312,28.6373437 C15.1355,30.4921875 13.6334375,31.9947188 11.7792187,32 L11.7787187,32 C9.92396875,31.9947188 8.4219375,30.4921875 8.417375,28.6377812 L8.417375,20.22 L8.41734375,20.22 Z M11.7786562,6.72265625 C9.92484375,6.717375 8.423375,5.216375 8.4173125,3.36325 L8.4173125,3.36265625 C8.42184375,1.5078125 9.92390625,0.00528125 11.778125,0 L11.778625,0 C13.633375,0.00528125 15.1354062,1.5078125 15.1399687,3.36221875 L15.1399687,6.72265625 L11.778625,6.72265625 L11.7786562,6.72265625 Z M11.7786562,8.41734375 C13.6329375,8.422625 15.1346875,9.92440625 15.14,11.7781563 L15.14,11.7786563 C15.1347187,13.6329375 13.6329375,15.1346875 11.7791875,15.14 L3.3626875,15.14 C1.50784375,15.1354688 0.0053125,13.6334063 3.125e-05,11.7791875 L3.125e-05,11.7786875 C0.0053125,9.9239375 1.50784375,8.42190625 3.36225,8.41734375 L11.7786875,8.41734375 L11.7786562,8.41734375 Z M20.22,25.2746562 C22.0759062,25.2784375 23.5794687,26.7815312 23.584,28.6369062 L23.584,28.6373437 C23.5794687,30.493125 22.0759062,31.9962187 20.2203437,32 L20.22,32 C18.3655312,31.9946875 16.8637812,30.4920312 16.86,28.6376875 L16.86,25.2746562 L20.22,25.2746562 Z M20.22,23.584 C18.3650625,23.5786875 16.8630312,22.07525 16.86,20.2202812 L16.86,20.22 C16.8645312,18.3661562 18.3661562,16.8645312 20.2195625,16.86 L28.6373437,16.86 C30.4920312,16.8637812 31.9947187,18.3655312 32,20.2195 L32,20.22 C31.9962187,22.0759062 30.493125,23.5794687 28.63775,23.584 L20.2199687,23.584 L20.22,23.584 Z'
}];
var whatsapp = [{
  d: 'M27.3254902,4.66823529 C24.32,1.65647059 20.3231373,0 16.0627451,0 C7.29098039,0 0.150588235,7.14039216 0.150588235,15.9184314 C0.150588235,18.7231373 0.884705882,21.465098 2.27764706,23.8745098 L0.0188235294,32.1254902 L8.45803922,29.9105882 C10.7858824,31.1780392 13.4023529,31.8494118 16.0627451,31.8494118 L16.0690196,31.8494118 C16.0690196,31.8494118 16.0690196,31.8494118 16.0690196,31.8494118 C24.8407843,31.8494118 31.987451,24.7090196 31.987451,15.9309804 C31.987451,11.6768627 30.3309804,7.68 27.3254902,4.66823529 Z M16.0690196,29.1639216 L16.0690196,29.1639216 C13.6909804,29.1639216 11.3631373,28.5239216 9.33019608,27.3192157 L8.84705882,27.0305882 L3.84,28.3419608 L5.17647059,23.4603922 L4.8627451,22.9584314 C3.53254902,20.8564706 2.83607843,18.4219608 2.83607843,15.9184314 C2.83607843,8.62117647 8.77176471,2.6854902 16.0752941,2.6854902 C19.6078431,2.6854902 22.9333333,4.06588235 25.4305882,6.56313725 C27.9278431,9.06666667 29.3019608,12.3858824 29.3019608,15.9247059 C29.2956863,23.2282353 23.36,29.1639216 16.0690196,29.1639216 Z M23.3223529,19.2501961 C22.9270588,19.0494118 20.9694118,18.0894118 20.6054902,17.9576471 C20.2415686,17.8258824 19.9780392,17.7568627 19.7082353,18.1584314 C19.4447059,18.5537255 18.6792157,19.4509804 18.4470588,19.7207843 C18.214902,19.9843137 17.9827451,20.0219608 17.587451,19.8211765 C17.1921569,19.6203922 15.9058824,19.2 14.387451,17.8447059 C13.2078431,16.7905882 12.4047059,15.4854902 12.172549,15.0901961 C11.9403922,14.694902 12.147451,14.4752941 12.3482353,14.2807843 C12.5301961,14.105098 12.7435294,13.8164706 12.9443137,13.5843137 C13.145098,13.3521569 13.2078431,13.1890196 13.3396078,12.9192157 C13.4713725,12.6556863 13.4086275,12.4235294 13.3082353,12.2227451 C13.2078431,12.0219608 12.4109804,10.0643137 12.0847059,9.26745098 C11.7647059,8.48941176 11.4321569,8.59607843 11.187451,8.58352941 C10.9552941,8.57098039 10.6917647,8.57098039 10.4282353,8.57098039 C10.1647059,8.57098039 9.73176471,8.67137255 9.36784314,9.06666667 C9.00392157,9.46196078 7.97490196,10.4282353 7.97490196,12.3858824 C7.97490196,14.3435294 9.39921569,16.2321569 9.6,16.5019608 C9.80078431,16.7654902 12.4047059,20.787451 16.3952941,22.5066667 C17.3427451,22.9145098 18.0831373,23.1592157 18.6603922,23.347451 C19.6141176,23.6486275 20.48,23.6047059 21.1639216,23.5043137 C21.9294118,23.3913725 23.5168627,22.5443137 23.8494118,21.6156863 C24.1819608,20.6870588 24.1819608,19.8901961 24.0815686,19.7270588 C23.987451,19.5513725 23.7239216,19.4509804 23.3223529,19.2501961 L23.3223529,19.2501961 Z'
}];
var pinterest = [{
  d: 'M16.0233856,0 C7.17363285,0 0,7.15600699 0,15.9826719 C0,22.7546785 4.22103158,28.5386841 10.1823721,30.8653426 C10.0420271,29.5999977 9.91637453,27.6613395 10.237163,26.2799944 C10.5298825,25.0306494 12.1164386,18.3373304 12.1164386,18.3373304 C12.1164386,18.3373304 11.6366029,17.3773295 11.6366029,15.9626718 C11.6366029,13.7453259 12.9291236,12.0813243 14.5343819,12.0813243 C15.9030899,12.0813243 16.5633691,13.106669 16.5633691,14.3319827 C16.5633691,15.7039841 15.6905675,17.7546423 15.2374538,19.6546442 C14.8565174,21.245302 16.039425,22.5413033 17.6099416,22.5413033 C20.4542768,22.5413033 22.6463211,19.5479566 22.6463211,15.2252961 C22.6463211,11.4106361 19.888887,8.73328978 15.9525239,8.73328978 C11.3946644,8.73328978 8.7227531,12.1492931 8.7227531,15.6652965 C8.7227531,17.0426416 9.24939133,18.5226431 9.91101761,19.3199564 C10.0433429,19.4799565 10.0607294,19.6199567 10.0246406,19.7799568 C9.90434496,20.2799573 9.63302179,21.3786146 9.57819954,21.5973023 C9.50736919,21.8973026 9.34829067,21.9586464 9.04222586,21.8173026 C7.04397038,20.8973017 5.79023244,17.9799551 5.79023244,15.6226403 C5.79023244,10.5879791 9.46326077,5.95328706 16.376253,5.95328706 C21.9339137,5.95328706 26.2565388,9.90929093 26.2565388,15.1839523 C26.2565388,20.6973015 22.7719737,25.1333058 17.9254045,25.1333058 C16.3027598,25.1333058 14.7790144,24.2946487 14.2389996,23.2946477 L13.2378826,27.0919952 C12.8783426,28.4853403 11.8959278,30.2279983 11.2356172,31.2866556 C12.7366505,31.746656 14.3178496,32 15.9806242,32 C24.8116748,32 32,24.8466493 32,16.0173281 C32,7.18666327 24.8116748,0.0346562838 15.9806242,0.0346562838 L16.0233856,2.94209389e-15 L16.0233856,0 Z'
}];
var messenger = [{
  d: 'M16,0.0312195122 C7.164,0.0312195122 0,6.65674927 0,14.8314224 C0,19.4908722 2.32534375,23.6414751 5.95865625,26.3588215 L5.95865625,31.9999688 L11.4093125,29.0135415 C12.8653125,29.4131512 14.4039687,29.6315941 15.9999687,29.6315941 C24.8359687,29.6315941 31.9999688,23.004722 31.9999688,14.8327024 C31.9999688,6.66068293 24.8359687,0.0311570732 15.9999688,0.0311570732 L16,0.0312195122 Z M17.588,19.9624117 L13.5146563,15.6199961 L5.564,19.9624117 L14.3093438,10.6874693 L18.484,15.0285737 L26.336,10.6874693 L17.588,19.9624117 Z'
}];
var reddit = [{
  d: 'M32,15.6906 C32,13.648 30.4106667,11.9876 28.4573333,11.9876 C27.504,11.9876 26.64,12.388 26.004,13.032 C23.5906667,11.3646 20.3253333,10.3034 16.7093333,10.1676 L18.6866667,3.631 L24.0413333,4.9484 L24.0333333,5.0296 C24.0333333,6.6998 25.3333333,8.0578 26.932,8.0578 C28.5293333,8.0578 29.828,6.6998 29.828,5.0296 C29.828,3.3594 28.528,2 26.932,2 C25.7053333,2 24.66,2.8036 24.2373333,3.9306 L18.4653333,2.5096 C18.2133333,2.4452 17.9573333,2.5978 17.8786667,2.8582 L15.6733333,10.148 C11.8893333,10.1956 8.46133333,11.2652 5.94,12.983 C5.308,12.3698 4.46933333,11.9862 3.54133333,11.9862 C1.588,11.9862 0,13.648 0,15.6906 C0,17.0486 0.710666667,18.226 1.756,18.87 C1.68666667,19.2648 1.64133333,19.6638 1.64133333,20.0698 C1.64133333,25.5452 8.052,30 15.9333333,30 C23.8146667,30 30.2266667,25.5452 30.2266667,20.0698 C30.2266667,19.6862 30.188,19.3082 30.1266667,18.9358 C31.236,18.31 32,17.099 32,15.6906 Z M21.3484128,24.8727834 C20.2374707,25.9672556 18.4936957,26.5 16.0181208,26.5 L16,26.4958595 L15.9818792,26.5 C13.5049103,26.5 11.7611354,25.9672556 10.6515872,24.8727834 C10.4494709,24.6740394 10.4494709,24.3497002 10.6515872,24.1509562 C10.8537034,23.950832 11.1826649,23.950832 11.3847811,24.1509562 C12.2908192,25.0439241 13.7948426,25.4772964 15.9818792,25.4772964 L16,25.4814369 L16.0181208,25.4772964 C18.2051574,25.4772964 19.7091808,25.0425439 20.6152189,24.149576 C20.8173351,23.9494518 21.1462966,23.950832 21.3484128,24.149576 C21.5505291,24.3497002 21.5505291,24.6726592 21.3484128,24.8727834 Z M20.75,20.5 C19.5090133,20.5 18.5,19.4911083 18.5,18.2507145 C18.5,17.0103207 19.5090133,16 20.75,16 C21.9909867,16 23,17.0103207 23,18.2507145 C23,19.4911083 21.9909867,20.5 20.75,20.5 Z M11.25,20.5 C10.0090133,20.5 9,19.4911083 9,18.2507145 C9,17.0103207 10.0090133,16 11.25,16 C12.4909867,16 13.5,17.0103207 13.5,18.2507145 C13.5,19.4911083 12.4909867,20.5 11.25,20.5 Z'
}];
/**
 * Other
 */

var calendar = [{
  d: 'M2 4 L6 4 L6 2 A2 2 0 0 1 10 2 L10 4 L22 4 L22 2 A2 2 0 0 1 26 2 L26 4 L30 4 L30 10 L2 10 M2 12 L30 12 L30 30 L2 30'
}];
var camera = [{
  d: 'M16.0000002,12.6000001 C13.3488002,12.6000001 11.2000002,14.7504002 11.2000002,17.4000002 C11.2000002,20.0496003 13.3488002,22.2000003 16.0000002,22.2000003 C18.6496003,22.2000003 20.8000003,20.0496003 20.8000003,17.4000002 C20.8000003,14.7504002 18.6496003,12.6000001 16.0000002,12.6000001 Z M28.8000004,7.80000007 L24.9600004,7.80000007 C24.4320004,7.80000007 23.8624004,7.39040007 23.6976004,6.88800006 L22.7040003,3.91040001 C22.5360003,3.40960001 21.9696003,3 21.4400003,3 L10.5600002,3 C10.0320001,3 9.46240014,3.40960001 9.29760014,3.90880001 L8.30240012,6.88800006 C8.13600012,7.39040007 7.56800011,7.80000007 7.0400001,7.80000007 L3.20000005,7.80000007 C1.44000002,7.80000007 0,9.24000009 0,11.0000001 L0,25.4000003 C0,27.1600004 1.44000002,28.6000004 3.20000005,28.6000004 L28.8000004,28.6000004 C30.5600005,28.6000004 32.0000005,27.1600004 32.0000005,25.4000003 L32.0000005,11.0000001 C32.0000005,9.24000009 30.5600005,7.80000007 28.8000004,7.80000007 Z M16.0000002,25.4000003 C11.5808002,25.4000003 8.00000012,21.8192003 8.00000012,17.4000002 C8.00000012,12.9808001 11.5808002,9.4000001 16.0000002,9.4000001 C20.4176003,9.4000001 24.0000004,12.9808001 24.0000004,17.4000002 C24.0000004,21.8192003 20.4176003,25.4000003 16.0000002,25.4000003 Z M28.0000004,12.9200001 C27.3808004,12.9200001 26.8800004,12.4176001 26.8800004,11.7984001 C26.8800004,11.1824001 27.3808004,10.6784001 28.0000004,10.6784001 C28.6192004,10.6784001 29.1200004,11.1808001 29.1200004,11.7984001 C29.1200004,12.4176001 28.6192004,12.9200001 28.0000004,12.9200001 Z'
}];
var chat = [{
  d: 'M32 16 A16 12 0 0 0 0 16 A16 12 0 0 0 16 28 L18 28 C20 30 24 32 28 32 C27 31 26 28 26 25.375 L26 25.375 A16 12 0 0 0 32 16'
}];
var check = [{
  d: 'M25.5857864,5.41421356 L12,19 L6.41421356,13.4142136 C5.63316498,12.633165 4.36683502,12.633165 3.58578644,13.4142136 L1.41421356,15.5857864 C0.633164979,16.366835 0.633164979,17.633165 1.41421356,18.4142136 L10.5857864,27.5857864 C11.366835,28.366835 12.633165,28.366835 13.4142136,27.5857864 L30.5857864,10.4142136 C31.366835,9.63316498 31.366835,8.36683502 30.5857864,7.58578644 L28.4142136,5.41421356 C27.633165,4.63316498 26.366835,4.63316498 25.5857864,5.41421356 Z'
}];
var chevron = [{
  d: 'M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z'
}];
var close = [{
  d: 'M20.3744956,16.0001289 L28.395199,7.9794255 C29.2016003,7.17405531 29.2016003,5.86752005 28.395199,5.06318107 L26.9370767,3.60402764 C26.1317065,2.79865745 24.8262025,2.79865745 24.0208323,3.60402764 L16.0001289,11.624731 L7.9783943,3.60402764 C7.17405531,2.79865745 5.86752005,2.79865745 5.06214986,3.60402764 L3.60402764,5.06318107 C2.79865745,5.86752005 2.79865745,7.17405531 3.60402764,7.9794255 L11.624731,16.0001289 L3.60402764,24.0208323 C2.79865745,24.8272337 2.79865745,26.1317065 3.60402764,26.9370767 L5.06214986,28.3962302 C5.86752005,29.2016003 7.17405531,29.2016003 7.9783943,28.3962302 L16.0001289,20.3744956 L24.0208323,28.3962302 C24.8262025,29.2016003 26.1317065,29.2016003 26.9370767,28.3962302 L28.395199,26.9370767 C29.2016003,26.1317065 29.2016003,24.8272337 28.395199,24.0208323 L20.3744956,16.0001289 Z'
}];
var cog = [{
  d: 'M14 0 H18 L19 6 L20.707 6.707 L26 3.293 L28.707 6 L25.293 11.293 L26 13 L32 14 V18 L26 19 L25.293 20.707 L28.707 26 L26 28.707 L20.707 25.293 L19 26 L18 32 L14 32 L13 26 L11.293 25.293 L6 28.707 L3.293 26 L6.707 20.707 L6 19 L0 18 L0 14 L6 13 L6.707 11.293 L3.293 6 L6 3.293 L11.293 6.707 L13 6 L14 0 z M16 10 A6 6 0 0 0 16 22 A6 6 0 0 0 16 10'
}];
var dollar = [{
  d: 'M26.2764977,20.8663594 C26.2764977,24.921659 23.6221198,28.0921659 18.202765,28.6451613 L18.202765,32 L14.7004608,32 L14.7004608,28.6820276 C10.8294931,28.3502304 8.02764977,26.875576 6,24.8479263 L8.83870968,20.8663594 C10.2396313,22.3041475 12.2304147,23.5576037 14.7004608,24 L14.7004608,18.2119816 C10.9032258,17.2903226 6.77419355,15.8156682 6.77419355,10.8387097 C6.77419355,7.07834101 9.76036866,3.9078341 14.7004608,3.42857143 L14.7004608,0 L18.202765,0 L18.202765,3.50230415 C21.1889401,3.79723502 23.6958525,4.97695853 25.6866359,6.78341014 L22.7741935,10.6175115 C21.483871,9.40092166 19.8617512,8.62672811 18.202765,8.22119816 L18.202765,13.3824885 C22.0368664,14.3778802 26.2764977,15.8525346 26.2764977,20.8663594 Z M12.156682,10.3963134 C12.156682,11.5391705 13.3364055,12.1658986 15.0322581,12.6082949 L15.0322581,7.92626728 C13.1520737,8.11059908 12.156682,9.06912442 12.156682,10.3963134 Z M17.8709677,24.1105991 C19.9723502,23.8156682 20.9308756,22.6728111 20.9308756,21.4562212 C20.9308756,20.0921659 19.640553,19.4654378 17.8709677,18.9493088 L17.8709677,24.1105991 Z'
}];
var dropdown = [{
  d: 'M4 9 16 25 28 9z'
}];
var download = [{
  d: 'M24.6153846,26.8461538 C24.6153846,26.5128205 24.4935897,26.224359 24.25,25.9807692 C24.0064103,25.7371795 23.7179487,25.6153846 23.3846154,25.6153846 C23.0512821,25.6153846 22.7628205,25.7371795 22.5192308,25.9807692 C22.275641,26.224359 22.1538462,26.5128205 22.1538462,26.8461538 C22.1538462,27.1794872 22.275641,27.4679487 22.5192308,27.7115385 C22.7628205,27.9551282 23.0512821,28.0769231 23.3846154,28.0769231 C23.7179487,28.0769231 24.0064103,27.9551282 24.25,27.7115385 C24.4935897,27.4679487 24.6153846,27.1794872 24.6153846,26.8461538 Z M29.5384615,26.8461538 C29.5384615,26.5128205 29.4166667,26.224359 29.1730769,25.9807692 C28.9294872,25.7371795 28.6410256,25.6153846 28.3076923,25.6153846 C27.974359,25.6153846 27.6858974,25.7371795 27.4423077,25.9807692 C27.1987179,26.224359 27.0769231,26.5128205 27.0769231,26.8461538 C27.0769231,27.1794872 27.1987179,27.4679487 27.4423077,27.7115385 C27.6858974,27.9551282 27.974359,28.0769231 28.3076923,28.0769231 C28.6410256,28.0769231 28.9294872,27.9551282 29.1730769,27.7115385 C29.4166667,27.4679487 29.5384615,27.1794872 29.5384615,26.8461538 Z M32,22.5384615 L32,28.6923077 C32,29.2051282 31.8205128,29.6410256 31.4615385,30 C31.1025641,30.3589744 30.6666667,30.5384615 30.1538462,30.5384615 L1.84615385,30.5384615 C1.33333333,30.5384615 0.897435897,30.3589744 0.538461538,30 C0.179487179,29.6410256 0,29.2051282 0,28.6923077 L0,22.5384615 C0,22.025641 0.179487179,21.5897436 0.538461538,21.2307692 C0.897435897,20.8717949 1.33333333,20.6923077 1.84615385,20.6923077 L10.7884615,20.6923077 L13.3846154,23.3076923 C14.1282051,24.025641 15,24.3846154 16,24.3846154 C17,24.3846154 17.8717949,24.025641 18.6153846,23.3076923 L21.2307692,20.6923077 L30.1538462,20.6923077 C30.6666667,20.6923077 31.1025641,20.8717949 31.4615385,21.2307692 C31.8205128,21.5897436 32,22.025641 32,22.5384615 Z M25.75,11.5961538 C25.9679487,12.1217949 25.8782051,12.5705128 25.4807692,12.9423077 L16.8653846,21.5576923 C16.6346154,21.8012821 16.3461538,21.9230769 16,21.9230769 C15.6538462,21.9230769 15.3653846,21.8012821 15.1346154,21.5576923 L6.51923077,12.9423077 C6.12179487,12.5705128 6.03205128,12.1217949 6.25,11.5961538 C6.46794872,11.0961538 6.84615385,10.8461538 7.38461538,10.8461538 L12.3076923,10.8461538 L12.3076923,2.23076923 C12.3076923,1.8974359 12.4294872,1.60897436 12.6730769,1.36538462 C12.9166667,1.12179487 13.2051282,1 13.5384615,1 L18.4615385,1 C18.7948718,1 19.0833333,1.12179487 19.3269231,1.36538462 C19.5705128,1.60897436 19.6923077,1.8974359 19.6923077,2.23076923 L19.6923077,10.8461538 L24.6153846,10.8461538 C25.1538462,10.8461538 25.5320513,11.0961538 25.75,11.5961538 Z'
}];
var edit = [{
  d: 'M8.70865676,27.6351002 L10.3904783,25.9532786 L6.04775634,21.6105567 L4.3659348,23.2923782 L4.3659348,25.2702003 L6.73186959,25.2702003 L6.73186959,27.6361351 L8.70969173,27.6361351 L8.70865676,27.6351002 Z M18.3742145,10.4836253 C18.3742145,10.243513 18.2075848,10.0768833 17.9674725,10.0768833 C17.856731,10.0768833 17.7459895,10.1141421 17.6528425,10.2062542 L7.63539587,20.2237007 C7.5432838,20.3158128 7.50602499,20.4265543 7.50602499,20.5383307 C7.50602499,20.7784431 7.67265469,20.9450728 7.91276706,20.9450728 C8.02350854,20.9450728 8.13425002,20.907814 8.22739706,20.8157019 L18.2448436,10.7982553 C18.3369557,10.7061433 18.3742145,10.5954018 18.3742145,10.4836253 L18.3742145,10.4836253 Z M17.3765062,6.93575811 L25.0652769,14.6245287 L9.68877061,30.001035 L2,30.001035 L2,22.3122644 L17.3765062,6.93575811 Z M30,8.70969173 C30,9.33791676 29.7412582,9.94751238 29.3158867,10.3728839 L26.2482443,13.4405264 L18.5594736,5.75175575 L21.6271161,2.70274266 C22.0524876,2.25874178 22.6620832,2 23.2903083,2 C23.9185333,2 24.5281289,2.25874178 24.9721298,2.70274266 L29.3148518,7.02787019 C29.7402233,7.47187107 29.998965,8.0814667 29.998965,8.70969173 L30,8.70969173 Z'
}];
var euro = [{
  d: 'M17.3395522,24.2521739 C14.2425373,24.2521739 11.7425373,22.5942029 10.511194,20.0318841 L19.6156716,20.0318841 L19.6156716,17.1681159 L9.57835821,17.1681159 C9.54104478,16.7913043 9.54104478,16.3768116 9.54104478,16 C9.54104478,15.5478261 9.54104478,15.1333333 9.57835821,14.7188406 L19.6156716,14.7188406 L19.6156716,11.8927536 L10.5485075,11.8927536 C11.8171642,9.36811594 14.2798507,7.74782609 17.3395522,7.74782609 C19.9141791,7.74782609 22.1529851,9.36811594 23.1604478,11.4028986 L27.75,9.14202899 C25.9962687,6.01449275 22.8246269,3 17.3395522,3 C11.2947761,3 6.33208955,6.46666667 4.69029851,11.8927536 L2.75,11.8927536 L2.75,14.7188406 L4.16791045,14.7188406 C4.13059701,15.1333333 4.09328358,15.5478261 4.09328358,16 C4.09328358,16.3768116 4.13059701,16.7913043 4.16791045,17.1681159 L2.75,17.1681159 L2.75,20.0318841 L4.65298507,20.0318841 C6.29477612,25.4956522 11.2574627,29 17.3395522,29 C22.8246269,29 25.9589552,25.9478261 27.75,22.8202899 L23.1604478,20.5971014 C22.1529851,22.6695652 19.9141791,24.2521739 17.3395522,24.2521739 Z'
}];
var heart = [{
  d: 'M0 10 C0 6, 3 2, 8 2 C12 2, 15 5, 16 6 C17 5, 20 2, 24 2 C30 2, 32 6, 32 10 C32 18, 18 29, 16 30 C14 29, 0 18, 0 10'
}];
var home = [{
  d: 'M16 0 L32 16 L28 16 L28 30 L20 30 L20 20 L12 20 L12 30 L4 30 L4 16 L0 16 Z'
}];
var info = [{
  d: 'M19.891,0 C22.035,0 23.107,1.459 23.107,3.131 C23.107,5.219 21.245,7.15 18.821,7.15 C16.791,7.15 15.607,5.95 15.663,3.966 C15.663,2.297 17.073,0 19.892,0 L19.891,0 Z M13.294,32 C11.601,32 10.361,30.957 11.545,26.362 L13.487,18.215 C13.825,16.913 13.881,16.389 13.487,16.389 C12.98,16.389 10.785,17.288 9.484,18.176 L8.639,16.768 C12.754,13.27 17.489,11.221 19.521,11.221 C21.212,11.221 21.494,13.258 20.649,16.389 L18.423,24.952 C18.029,26.464 18.197,26.986 18.593,26.986 C19.1,26.986 20.764,26.359 22.399,25.055 L23.359,26.357 C19.356,30.432 14.983,32 13.293,32 L13.294,32 Z'
}];
var like = [{
  d: 'M5.8,24.4583333 C5.8,23.797526 5.25625,23.25 4.6,23.25 C3.925,23.25 3.4,23.797526 3.4,24.4583333 C3.4,25.1380208 3.925,25.6666667 4.6,25.6666667 C5.25625,25.6666667 5.8,25.1380208 5.8,24.4583333 Z M8.8,14.7916667 L8.8,26.875 C8.8,27.5358073 8.25625,28.0833333 7.6,28.0833333 L2.2,28.0833333 C1.54375,28.0833333 1,27.5358073 1,26.875 L1,14.7916667 C1,14.1308594 1.54375,13.5833333 2.2,13.5833333 L7.6,13.5833333 C8.25625,13.5833333 8.8,14.1308594 8.8,14.7916667 Z M31,14.7916667 C31,15.7923177 30.60625,16.8684896 29.96875,17.6048177 C30.175,18.2089844 30.25,18.7753906 30.25,19.0397135 C30.2875,19.983724 30.00625,20.8710938 29.44375,21.6263021 C29.65,22.3248698 29.65,23.0800781 29.44375,23.8352865 C29.25625,24.5338542 28.9,25.156901 28.43125,25.610026 C28.54375,27.0260417 28.225,28.1777344 27.5125,29.0273438 C26.70625,29.9902344 25.46875,30.4811198 23.81875,30.5 L21.4,30.5 C18.71875,30.5 16.1875,29.6126302 14.1625,28.9140625 C12.98125,28.4986979 11.85625,28.1022135 11.2,28.0833333 C10.5625,28.0644531 10,27.5358073 10,26.875 L10,14.7727865 C10,14.1497396 10.525,13.6210938 11.14375,13.5644531 C11.8375,13.5078125 13.6375,11.2610677 14.4625,10.1660156 C15.1375,9.29752604 15.775,8.48567708 16.35625,7.90039062 C17.0875,7.1640625 17.29375,6.03125 17.51875,4.93619792 C17.725,3.82226562 17.95,2.65169271 18.75625,1.85872396 C18.98125,1.63216146 19.28125,1.5 19.6,1.5 C23.8,1.5 23.8,4.87955729 23.8,6.33333333 C23.8,7.88151042 23.25625,8.9765625 22.75,9.95833333 C22.54375,10.3736979 22.35625,10.5625 22.20625,11.1666667 L27.4,11.1666667 C29.35,11.1666667 31,12.828125 31,14.7916667 Z'
}];
var loading = [{
  d: 'M32,16.5322245 C31.9588157,14.3081247 31.4913515,12.0909439 30.6279637,10.0636341 C29.7674119,8.03452807 28.5184129,6.19642412 26.9851198,4.67752183 C25.4527291,3.15748857 23.6354642,1.95585863 21.6684149,1.16311019 C19.7025257,0.367301455 17.5887855,-0.0128399168 15.5005035,0.0332640333 C13.4119637,0.0759085239 11.3327049,0.544665281 9.43133132,1.40893139 C7.52847533,2.2703368 5.8046002,3.52019958 4.38048741,5.0538711 C2.9553434,6.58674428 1.82951057,8.40382536 1.08748439,10.3693971 C0.342622356,12.3340374 -0.0123101712,14.4449064 0.0322255791,16.5322245 C0.0736676737,18.6198753 0.514449144,20.6951518 1.32556697,22.593131 C2.1340423,24.4925073 3.30666667,26.2131892 4.74502316,27.6342287 C6.18260624,29.0563992 7.8861148,30.1790603 9.72754884,30.9180541 C11.5682095,31.6599751 13.5445398,32.0125073 15.5005035,31.966736 C17.456854,31.9238254 19.398574,31.4826112 21.1746546,30.6722994 C22.9518953,29.8645821 24.5620785,28.6937547 25.8913837,27.2579459 C27.22172,25.8229356 28.2710493,24.1232765 28.960999,22.2873015 C29.3810272,21.1743534 29.6660947,20.0120416 29.8163303,18.8345613 C29.8564834,18.8369563 29.8968298,18.838553 29.9375629,18.838553 C31.0766083,18.838553 32,17.8854719 32,16.7096549 C32,16.6499127 31.9969708,16.5908358 31.9923303,16.5322911 L32,16.5322911 L32,16.5322245 Z M28.722852,22.1853805 C27.9664532,23.9550936 26.8703968,25.5583534 25.5267835,26.8815967 C24.1839436,28.2058378 22.5942558,29.2495301 20.8784371,29.9349023 C19.1631339,30.622736 17.3242779,30.9478586 15.5005035,30.9022869 C13.6764068,30.8591102 11.8720322,30.4453721 10.2213092,29.6890146 C8.56974824,28.935052 7.0733857,27.8431933 5.83882377,26.5052474 C4.60335952,25.1680998 3.63046928,23.5858628 2.99259617,21.8796175 C2.35227392,20.1737048 2.05070695,18.3465114 2.09466264,16.5322245 C2.13662034,14.717605 2.52416516,12.9260042 3.2307432,11.2868191 C3.93512991,9.64690229 4.95474723,8.16099792 6.20342397,6.93555094 C7.45152064,5.70917256 8.92745217,4.74444906 10.5175911,4.11289813 C12.1075368,3.47888565 13.8089829,3.18130561 15.5005035,3.22661123 C17.1923464,3.27005405 18.8593112,3.65631601 20.3846767,4.35871933 C21.9106224,5.05892723 23.2932286,6.07188358 24.4329829,7.31196674 C25.5736395,8.55131809 26.4699617,10.0161331 27.0558228,11.5926486 C27.6438751,13.1690977 27.9188882,14.8544532 27.8751259,16.5322245 L27.8827956,16.5322245 C27.8781551,16.5907692 27.8751259,16.6498462 27.8751259,16.7095884 C27.8751259,17.8077006 28.6805076,18.7112183 29.7147553,18.8259792 C29.5141833,19.9842994 29.1820665,21.1151435 28.722852,22.1853805 L28.722852,22.1853805 Z'
}];
var lock = [{
  d: 'M10.5553571,14.6356043 L21.4446429,14.6356043 L21.4446429,10.5442071 C21.4446429,7.53979239 18.998335,5.09020403 16.0005955,5.09020403 C13.002856,5.09020403 10.5565481,7.54098556 10.5565481,10.5442071 L10.5565481,14.6356043 L10.5553571,14.6356043 Z M28.25,16.6818995 L28.25,28.954898 C28.25,30.0836416 27.3353143,31 26.2086311,31 L5.79136892,31 C4.66468572,31 3.75,30.0836416 3.75,28.954898 L3.75,16.6818995 C3.75,15.5531559 4.66468572,14.6367975 5.79136892,14.6367975 L6.47142822,14.6367975 L6.47142822,10.5454003 C6.47142822,5.30378236 10.7673545,1 15.9994045,1 C21.2314545,1 25.5273808,5.30378236 25.5273808,10.5454003 L25.5273808,14.6367975 L26.2074401,14.6367975 C27.3341233,14.6367975 28.248809,15.5531559 28.248809,16.6818995 L28.25,16.6818995 Z'
}];
var mail = [{
  d: 'M1.0204459,7.35766667 C1.88800146,7.838 13.9057792,14.4966667 14.3537792,14.7441667 C14.8017792,14.9916667 15.3813348,15.109 15.9644459,15.109 C16.547557,15.109 17.1271126,14.9916667 17.5751126,14.7441667 C18.0231126,14.4966667 30.0408903,7.838 30.9084459,7.35766667 C31.7777792,6.8755 32.5991126,5 31.0044459,5 L0.926223681,5 C-0.668442986,5 0.152890347,6.8755 1.0204459,7.35766667 Z M31.3120015,11.3965 C30.3253348,11.9263333 18.179557,18.453 17.5751126,18.7793333 C16.9706681,19.1056667 16.547557,19.1441667 15.9644459,19.1441667 C15.3813348,19.1441667 14.9582237,19.1056667 14.3537792,18.7793333 C13.7493348,18.453 1.67289035,11.9245 0.686223681,11.3946667 C-0.00710965268,11.0206667 1.4584275e-06,11.4588333 1.4584275e-06,11.7961667 C1.4584275e-06,12.1335 1.4584275e-06,25.1666667 1.4584275e-06,25.1666667 C1.4584275e-06,25.9366667 1.00622368,27 1.77777924,27 L30.2222237,27 C30.9937792,27 32.0000015,25.9366667 32.0000015,25.1666667 C32.0000015,25.1666667 32.0000015,12.1353333 32.0000015,11.798 C32.0000015,11.4606667 32.0071126,11.0225 31.3120015,11.3965 Z'
}];
var menu = [{
  d: 'M0,27.5 C0,26.1192881 1.1201337,25 2.49765754,25 L29.5023425,25 C30.8817606,25 32,26.1096621 32,27.5 L32,27.5 C32,28.8807119 30.8798663,30 29.5023425,30 L2.49765754,30 C1.11823937,30 0,28.8903379 0,27.5 L0,27.5 Z M0,16 C0,14.6192881 1.1201337,13.5 2.49765754,13.5 L29.5023425,13.5 C30.8817606,13.5 32,14.6096621 32,16 L32,16 C32,17.3807119 30.8798663,18.5 29.5023425,18.5 L2.49765754,18.5 C1.11823937,18.5 0,17.3903379 0,16 L0,16 Z M0,4.5 C0,3.11928813 1.1201337,2 2.49765754,2 L29.5023425,2 C30.8817606,2 32,3.10966206 32,4.5 L32,4.5 C32,5.88071187 30.8798663,7 29.5023425,7 L2.49765754,7 C1.11823937,7 0,5.89033794 0,4.5 L0,4.5 Z'
}];
var minus = [{
  d: 'M0 13v6c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-30c-0.552 0-1 0.448-1 1z'
}];
var mobile = [{
  d: 'M23,0 L9,0 C7.35,0 6,1.35 6,3 L6,29 C6,30.65 7.35,32 9,32 L23,32 C24.65,32 26,30.65 26,29 L26,3 C26,1.35 24.65,0 23,0 Z M12,1.5 L20,1.5 L20,2.5 L12,2.5 L12,1.5 Z M16,30 C14.8954375,30 14,29.1045625 14,28 C14,26.8954375 14.8954375,26 16,26 C17.1045625,26 18,26.8954375 18,28 C18,29.1045625 17.1045625,30 16,30 Z M24,24 L8,24 L8,4 L24,4 L24,24 Z'
}];
var phone = [{
  d: 'M26.6663866,30.1613926 L21.9717107,21.1013748 C21.961044,21.1067081 19.3397055,22.3947107 19.2197053,22.4493774 C16.2330328,23.8973803 10.1543541,12.0226903 13.0743599,10.4573539 L15.8516987,9.08935119 L11.1943562,8.8817842e-15 L8.38635067,1.38533606 C-1.21633487,6.39201256 14.0303618,36.0280708 23.8530477,31.5387286 C24.0143814,31.4653952 26.6557199,30.1667259 26.6663866,30.1613926 Z'
}];
var pin = [{
  d: 'M4 12 A12 12 0 0 1 28 12 C28 20, 16 32, 16 32 C16 32, 4 20 4 12 M11 12 A5 5 0 0 0 21 12 A5 5 0 0 0 11 12 Z'
}];
var play = [{
  d: 'M7,4.80618581 C7,4.0613363 7.50592001,3.78015953 8.1423958,4.18606254 L25.5247214,15.2713846 C26.1556492,15.6737496 26.1611971,16.3225738 25.5247214,16.7284769 L8.1423958,27.8137989 C7.51146796,28.2161638 7,27.9470088 7,27.1936756 L7,4.80618581 Z'
}];
var plus = [{
  d: 'M30,13 L19,13 L19,2 L19,2 C19,0.8954305 18.1045695,-2.02906125e-16 17,0 L15,1.27675648e-15 L15,1.55431223e-15 C13.8954305,2.73827315e-15 13,0.8954305 13,2 L13,13 L2,13 L2,13 C0.8954305,13 3.95440851e-15,13.8954305 3.10862447e-15,15 L3.55271368e-15,17 L3.99680289e-15,17 C4.13207364e-15,18.1045695 0.8954305,19 2,19 L13,19 L13,30 L13,30 C13,31.1045695 13.8954305,32 15,32 L17,32 L17,32 C18.1045695,32 19,31.1045695 19,30 L19,19 L30,19 L30,19 C31.1045695,19 32,18.1045695 32,17 L32,15 L32,15 C32,13.8954305 31.1045695,13 30,13 Z'
}];
var pound = [{
  d: 'M24.9565217,23.9130435 C24.3478261,24.6956522 23.0869565,25.4782609 21.2173913,25.4782609 C20.173913,25.4782609 19.3913043,25.173913 18.6086957,24.826087 C17.7826087,24.4782609 16.8695652,24.0869565 15.5652174,24.0869565 C14.9130435,24.0869565 14.0434783,24.173913 13.3913043,24.3913043 C15,23.4347826 16.2173913,21.6086957 16.2173913,19.5652174 C16.2173913,19.2608696 16.2173913,19 16.173913,18.7391304 L21.0869565,18.7391304 L21.0869565,15.2173913 L14.8695652,15.2173913 C14.6956522,15 14.5652174,14.7391304 14.3913043,14.5217391 C13.5217391,13.2173913 12.6956522,11.9565217 12.6956522,10.1304348 C12.6956522,7.65217391 14.6956522,6.04347826 17.2608696,6.04347826 C19.2608696,6.04347826 20.9565217,7.30434783 21.6956522,9.13043478 L26.6086957,6.26086957 C24.7391304,2.69565217 21.3043478,1 16.5217391,1 C11.3478261,1 5.95652174,4.47826087 5.95652174,10 C5.95652174,12.1304348 6.91304348,13.6956522 7.95652174,15.2173913 L5,15.2173913 L5,18.7391304 L10.2173913,18.7391304 C10.5217391,19.4782609 10.7391304,20.2173913 10.7391304,21.0869565 C10.7391304,23.3043478 8.69565217,25.2173913 6,26.5217391 L8.08695652,30.7391304 C9.82608696,29.7826087 11.6086957,29.0869565 13.1304348,29.0869565 C14.3043478,29.0869565 15.2608696,29.4782609 16.3043478,29.8695652 C17.5652174,30.3913043 18.9130435,31 21,31 C24.173913,31 26.2173913,30.0434783 27.3913043,28.826087 L24.9565217,23.9130435 Z'
}];
var search = [{
  d: 'M31.0082809,27.2313682 L23.4284569,20.7845177 C22.6444747,20.079534 21.8064942,19.7555417 21.1295093,19.7865408 C22.9184676,17.6905895 23.9994436,14.9716526 23.9994436,11.9997216 C23.9994436,5.37287538 18.6265671,0 11.9997209,0 C5.37287467,0 -9.9475983e-14,5.37287538 -9.9475983e-14,11.9997216 C-9.9475983e-14,18.6265678 5.37287467,23.9994432 11.9997209,23.9994432 C14.9716533,23.9994432 17.6905902,22.9184683 19.7865404,21.1295097 C19.7555413,21.806494 20.0795342,22.6444745 20.7845173,23.4284564 L27.2313689,31.0082805 C28.3353422,32.2342521 30.1383004,32.3382496 31.2382756,31.2382752 C32.3382489,30.1383006 32.2352516,28.3353426 31.0082809,27.2313682 Z M12.0007218,20.000536 C7.58282489,20.000536 4.00090667,16.418619 4.00090667,12.0007216 C4.00090667,7.582824 7.58282489,4.0009072 12.0007218,4.0009072 C16.4186187,4.0009072 20.0005351,7.582824 20.0005351,12.0007216 C20.0005351,16.418619 16.4186187,20.000536 12.0007218,20.000536 Z'
}];
var share = [{
  d: 'M7.999,20 C7.999,20 9.837,14 19.999,14 L19.999,20 L31.999,12 L19.999,4 L19.999,10 C11.999,10 7.999,14.99 7.999,20 Z M21.999,24 L3.999,24 L3.999,12 L7.933,12 C8.248,11.628 8.587,11.271 8.948,10.932 C10.322,9.645 11.966,8.662 13.827,8 L0,8 L0,28 L26,28 L26,19.605 L22,22.272 L22,24 L21.999,24 Z'
}];
var sms = [{
  d: 'M16,1.5 C7.54933333,1.5 0,7.13466667 0,14.8426667 C0,17.576 0.985333333,20.26 2.72933333,22.3426667 C2.80266667,24.7826667 1.36533333,28.284 0.072,30.8333333 C3.54133333,30.2066667 8.47333333,28.8226667 10.7093333,27.452 C23.024,30.448 32,22.912 32,14.8426667 C32,7.09333333 24.3986667,1.5 16,1.5 Z M9.33333333,16.8333333 C8.228,16.8333333 7.33333333,15.9386667 7.33333333,14.8333333 C7.33333333,13.728 8.228,12.8333333 9.33333333,12.8333333 C10.4386667,12.8333333 11.3333333,13.728 11.3333333,14.8333333 C11.3333333,15.9386667 10.4386667,16.8333333 9.33333333,16.8333333 Z M16,16.8333333 C14.8946667,16.8333333 14,15.9386667 14,14.8333333 C14,13.728 14.8946667,12.8333333 16,12.8333333 C17.1053333,12.8333333 18,13.728 18,14.8333333 C18,15.9386667 17.1053333,16.8333333 16,16.8333333 Z M22.6666667,16.8333333 C21.5626667,16.8333333 20.6666667,15.9386667 20.6666667,14.8333333 C20.6666667,13.728 21.5626667,12.8333333 22.6666667,12.8333333 C23.772,12.8333333 24.6666667,13.728 24.6666667,14.8333333 C24.6666667,15.9386667 23.772,16.8333333 22.6666667,16.8333333 Z'
}];
var star = [{
  d: 'M16 0 L21 11 L32 12 L23 19 L26 31 L16 25 L6 31 L9 19 L0 12 L11 11'
}];
var target = [{
  d: 'M16 1.333q2.99 0 5.703 1.161t4.677 3.125 3.125 4.677 1.161 5.703-1.161 5.703-3.125 4.677-4.677 3.125-5.703 1.161-5.703-1.161-4.677-3.125-3.125-4.677-1.161-5.703 1.161-5.703 3.125-4.677 4.677-3.125 5.703-1.161zM16 4q-2.438 0-4.661 0.953t-3.828 2.557-2.557 3.828-0.953 4.661 0.953 4.661 2.557 3.828 3.828 2.557 4.661 0.953 4.661-0.953 3.828-2.557 2.557-3.828 0.953-4.661-0.953-4.661-2.557-3.828-3.828-2.557-4.661-0.953zM16 6.667q1.896 0 3.625 0.74t2.979 1.99 1.99 2.979 0.74 3.625-0.74 3.625-1.99 2.979-2.979 1.99-3.625 0.74-3.625-0.74-2.979-1.99-1.99-2.979-0.74-3.625 0.74-3.625 1.99-2.979 2.979-1.99 3.625-0.74zM16 9.333q-1.354 0-2.589 0.531t-2.125 1.422-1.422 2.125-0.531 2.589 0.531 2.589 1.422 2.125 2.125 1.422 2.589 0.531 2.589-0.531 2.125-1.422 1.422-2.125 0.531-2.589-0.531-2.589-1.422-2.125-2.125-1.422-2.589-0.531zM16 12q1.656 0 2.828 1.172t1.172 2.828-1.172 2.828-2.828 1.172-2.828-1.172-1.172-2.828 1.172-2.828 2.828-1.172zM16 14.667q-0.552 0-0.943 0.391t-0.391 0.943 0.391 0.943 0.943 0.391 0.943-0.391 0.391-0.943-0.391-0.943-0.943-0.391z'
}];
var upload = [{
  d: 'M24.6153846,27.4 C24.6153846,26.74375 24.0576923,26.2 23.3846154,26.2 C22.7115385,26.2 22.1538462,26.74375 22.1538462,27.4 C22.1538462,28.05625 22.7115385,28.6 23.3846154,28.6 C24.0576923,28.6 24.6153846,28.05625 24.6153846,27.4 Z M29.5384615,27.4 C29.5384615,26.74375 28.9807692,26.2 28.3076923,26.2 C27.6346154,26.2 27.0769231,26.74375 27.0769231,27.4 C27.0769231,28.05625 27.6346154,28.6 28.3076923,28.6 C28.9807692,28.6 29.5384615,28.05625 29.5384615,27.4 Z M32,23.2 L32,29.2 C32,30.19375 31.1730769,31 30.1538462,31 L1.84615385,31 C0.826923077,31 0,30.19375 0,29.2 L0,23.2 C0,22.20625 0.826923077,21.4 1.84615385,21.4 L10.0576923,21.4 C10.5769231,22.7875 11.9423077,23.8 13.5384615,23.8 L18.4615385,23.8 C20.0576923,23.8 21.4230769,22.7875 21.9423077,21.4 L30.1538462,21.4 C31.1730769,21.4 32,22.20625 32,23.2 Z M25.75,11.05 C25.5576923,11.5 25.1153846,11.8 24.6153846,11.8 L19.6923077,11.8 L19.6923077,20.2 C19.6923077,20.85625 19.1346154,21.4 18.4615385,21.4 L13.5384615,21.4 C12.8653846,21.4 12.3076923,20.85625 12.3076923,20.2 L12.3076923,11.8 L7.38461538,11.8 C6.88461538,11.8 6.44230769,11.5 6.25,11.05 C6.05769231,10.61875 6.15384615,10.09375 6.51923077,9.75625 L15.1346154,1.35625 C15.3653846,1.1125 15.6923077,1 16,1 C16.3076923,1 16.6346154,1.1125 16.8653846,1.35625 L25.4807692,9.75625 C25.8461538,10.09375 25.9423077,10.61875 25.75,11.05 Z'
}];
var user = [{
  d: 'M16,19.7719298 C21,19.7719298 31,22.2280702 31,27.2280702 L31,31 L1,31 L1,27.2280702 C1,22.2280702 11,19.7719298 16,19.7719298 Z M16,16 C11.877193,16 8.54385965,12.6666667 8.54385965,8.54385965 C8.54385965,4.42105263 11.877193,1 16,1 C20.122807,1 23.4561404,4.42105263 23.4561404,8.54385965 C23.4561404,12.6666667 20.122807,16 16,16 Z'
}];
var warning = [{
  d: 'M15 0 H17 L32 29 L31 30 L1 30 L0 29 z M19 8 L13 8 L14 20 L18 20 z M16 22 A3 3 0 0 0 16 28 A3 3 0 0 0 16 22'
}];
var yen = [{
  d: 'M29 2 22.5 2 16 13.25 9.5 2 3 2 11 15.0038578 4 15 4 18.5 13 18.5 13 21.5 4 21.5 4 25 13 25 13 30 19 30 19 25 28 25 28 21.5 19 21.5 19 18.5 28 18.5 28 15.000423 21 15.000423z'
}];

var icons = /*#__PURE__*/Object.freeze({
  __proto__: null,
  facebook: facebook,
  twitter: twitter,
  instagram: instagram,
  youtube: youtube,
  linkedin: linkedin,
  google: google,
  vimeo: vimeo,
  strava: strava,
  mapmyfitness: mapmyfitness,
  fitbit: fitbit,
  slack: slack,
  whatsapp: whatsapp,
  pinterest: pinterest,
  messenger: messenger,
  reddit: reddit,
  calendar: calendar,
  camera: camera,
  chat: chat,
  check: check,
  chevron: chevron,
  close: close,
  cog: cog,
  dollar: dollar,
  dropdown: dropdown,
  download: download,
  edit: edit,
  euro: euro,
  heart: heart,
  home: home,
  info: info,
  like: like,
  loading: loading,
  lock: lock,
  mail: mail,
  menu: menu,
  minus: minus,
  mobile: mobile,
  phone: phone,
  pin: pin,
  play: play,
  plus: plus,
  pound: pound,
  search: search,
  share: share,
  sms: sms,
  star: star,
  target: target,
  upload: upload,
  user: user,
  warning: warning,
  yen: yen
});

var Icon = function Icon(_ref) {
  var name = _ref.name,
      paths = _ref.paths,
      viewBox = _ref.viewBox,
      _ref$ariaHidden = _ref.ariaHidden,
      ariaHidden = _ref$ariaHidden === void 0 ? true : _ref$ariaHidden,
      classNames = _ref.classNames;
  var iconPaths = name ? icons[name] : paths;
  return React__default.createElement("svg", {
    className: "c11n-icon ".concat(classNames.root),
    viewBox: "0 0 ".concat(viewBox, " ").concat(viewBox),
    "aria-hidden": ariaHidden
  }, iconPaths && iconPaths.map(function (pathProps, i) {
    return React__default.createElement("path", _extends({}, pathProps, {
      key: i
    }));
  }));
};

Icon.propTypes = {
  /**
   * The name of the icon e.g. chevron, facebook etc.
   */
  name: propTypes.string,

  /**
   * The color of the icon
   */
  color: propTypes.string,

  /**
   * The size of the icon in ems
   */
  size: propTypes.number,

  /**
   * The paths of a custom icon
   */
  paths: propTypes.array,

  /**
   * Rotate the icon a certain number of degrees
   */
  rotate: propTypes.number,

  /**
   * Make the icon spin
   */
  spin: propTypes.bool,

  /**
   * Custom viewbox sizing
   */
  viewBox: propTypes.number,

  /**
   * Override the default to hide icon from screen readers
   */
  ariaHidden: propTypes.string,

  /**
   * Add custom styles to the icon
   */
  styles: propTypes.object
};
Icon.defaultProps = {
  color: 'currentColor',
  paths: [],
  rotate: 0,
  size: 1,
  spin: false,
  styles: {},
  viewBox: 32
};
var Icon$1 = withStyles(styles, keyframes$1)(Icon);

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (initial) {
    return fns.reduceRight(function (result, fn) {
      return fn(result);
    }, initial);
  };
};

var withToggle = function withToggle(Component) {
  var toggle =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(toggle, _React$Component);

    function toggle(props) {
      var _this;

      _classCallCheck(this, toggle);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(toggle).call(this, props));
      _this.state = {
        toggled: props.toggled
      };
      _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
      _this.toggleOn = _this.toggleOn.bind(_assertThisInitialized(_this));
      _this.toggleOff = _this.toggleOff.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(toggle, [{
      key: "toggle",
      value: function toggle() {
        this.setState({
          toggled: !this.state.toggled
        });
      }
    }, {
      key: "toggleOn",
      value: function toggleOn() {
        this.setState({
          toggled: true
        });
      }
    }, {
      key: "toggleOff",
      value: function toggleOff() {
        this.setState({
          toggled: false
        });
      }
    }, {
      key: "render",
      value: function render() {
        return React__default.createElement(Component, _extends({}, this.props, {
          toggled: this.state.toggled,
          onToggle: this.toggle,
          onToggleOn: this.toggleOn,
          onToggleOff: this.toggleOff
        }));
      }
    }]);

    return toggle;
  }(React__default.Component);

  return toggle;
};

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$6.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$7.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    stack || (stack = new _Stack);
    if (isObject_1(srcValue)) {
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
  return _defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge$1 = _createAssigner(function(object, source, srcIndex) {
  _baseMerge(object, source, srcIndex);
});

var merge_1 = merge$1;

var styles$1 = (function (_ref, _ref2) {
  var border = _ref.border,
      color = _ref.color,
      font = _ref.font,
      gutter = _ref.gutter,
      toggled = _ref.toggled,
      styles = _ref.styles;
  var colors = _ref2.colors,
      scale = _ref2.scale,
      rhythm = _ref2.rhythm,
      treatments = _ref2.treatments,
      justifyContent = _ref2.justifyContent;
  var borderStyles = border ? {
    paddingLeft: rhythm(0.5),
    borderLeft: "2px solid ".concat(toggled ? colors[color] : colors.shade)
  } : {};
  var defaultStyles = {
    root: _objectSpread2({
      position: 'relative',
      paddingTop: rhythm(0.5),
      paddingBottom: rhythm(0.5)
    }, borderStyles),
    head: _objectSpread2({
      display: 'flex',
      width: '100%',
      alignItems: 'center'
    }, justifyContent('flex-start'), {
      cursor: 'pointer',
      '&:focus:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        boxShadow: "0 0 1rem ".concat(colors.shade),
        pointerEvents: 'none'
      }
    }),
    toggle: {
      flexBasis: rhythm(gutter),
      display: 'flex',
      alignItems: 'flex-start',
      flex: "0 0 ".concat(rhythm(1)),
      fontSize: scale(-2),
      color: toggled ? colors[color] : colors.lightGrey
    },
    title: _objectSpread2({}, treatments[font]),
    body: {
      display: toggled ? 'block' : 'none',
      paddingTop: rhythm(0.5),
      paddingLeft: rhythm(gutter)
    }
  };
  return merge_1(defaultStyles, styles);
});

var Accordion = function Accordion(_ref) {
  var children = _ref.children,
      title = _ref.title,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? v1_1() : _ref$id,
      opened = _ref.opened,
      closed = _ref.closed,
      toggled = _ref.toggled,
      onToggle = _ref.onToggle,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-accordion ".concat(classNames.root)
  }, React__default.createElement("button", {
    id: "".concat(id, "-title"),
    "aria-controls": "".concat(id, "-body"),
    "aria-expanded": toggled,
    "aria-label": title,
    className: classNames.head,
    onClick: onToggle
  }, React__default.createElement("div", {
    className: classNames.toggle
  }, toggled ? opened : closed), React__default.createElement("div", {
    className: classNames.title
  }, title)), React__default.createElement("div", {
    "aria-labelledby": "".concat(id, "-title"),
    role: "region",
    id: "".concat(id, "-body"),
    hidden: !toggled,
    className: classNames.body
  }, children));
};

Accordion.propTypes = {
  /**
   * The content of the Accordion
   */
  children: propTypes.any.isRequired,

  /**
   * The title of the section
   */
  title: propTypes.any.isRequired,

  /**
   * The size of the gutter to be passed through rhythm
   */
  gutter: propTypes.number,

  /**
   * Add or remove the border to the accordion
   */
  border: propTypes.bool,

  /**
   * The color to apply to icon/border when active
   */
  color: propTypes.string,

  /**
   * The font treatment to be used for the title
   */
  font: propTypes.string,

  /**
   * Opens the accordion by default
   */
  toggled: propTypes.bool,

  /**
   * DOM ID
   */
  id: propTypes.string,

  /**
   * Icon to show when the panel is open
   */
  opened: propTypes.any,

  /**
   * Icon to show when the panel is closed
   */
  closed: propTypes.any,

  /**
   * Custom styles be applied { root, head, title, body }
   */
  styles: propTypes.object
};
Accordion.defaultProps = {
  gutter: 1,
  border: true,
  color: 'primary',
  font: 'head',
  opened: React__default.createElement(Icon$1, {
    name: "minus"
  }),
  closed: React__default.createElement(Icon$1, {
    name: "plus"
  }),
  styles: {}
};
var index = compose(withToggle, withStyles(styles$1))(Accordion);

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$b.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$a.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap$1 = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap$1;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$d.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** `Object#toString` result references. */
var symbolTag$2 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$2);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = _MapCache;

var memoize_1 = memoize$1;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

var last_1 = last;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : _baseGet(object, _baseSlice(path, 0, -1));
}

var _parent = parent;

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = _castPath(path, object);
  object = _parent(object, path);
  return object == null || delete object[_toKey(last_1(path))];
}

var _baseUnset = baseUnset;

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject_1(value) ? undefined : value;
}

var _customOmitClone = customOmitClone;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}

var flatten_1 = flatten;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return _setToString(_overRest(func, undefined, flatten_1), func + '');
}

var _flatRest = flatRest;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = _flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = _arrayMap(paths, function(path) {
    path = _castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  _copyObject(object, _getAllKeysIn(object), result);
  if (isDeep) {
    result = _baseClone(result, CLONE_DEEP_FLAG$1 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$1, _customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    _baseUnset(result, paths[length]);
  }
  return result;
});

var omit_1 = omit;

var styles$2 = (function (_ref, _ref2) {
  var background = _ref.background,
      block = _ref.block,
      borderColor = _ref.borderColor,
      borderWidth = _ref.borderWidth,
      effect = _ref.effect,
      font = _ref.font,
      foreground = _ref.foreground,
      radius = _ref.radius,
      shadow = _ref.shadow,
      size = _ref.size,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing,
      colors = _ref2.colors,
      effects = _ref2.effects,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      shadows = _ref2.shadows,
      treatments = _ref2.treatments;
  return {
    root: merge_1(_objectSpread2({
      display: block ? 'block' : 'inline-block',
      width: block ? '100%' : 'auto',
      cursor: 'pointer',
      textDecoration: 'none',
      overflow: 'hidden',
      transform: 'translateZ(0)',
      // workaround for transition vs overflow:hidden/border-radius bug
      verticalAlign: 'middle',
      textAlign: 'center'
    }, calculateSpacing(spacing), {
      backgroundColor: colors[background] || colors.primary,
      color: colors[foreground] || colors.light,
      border: "".concat(borderWidth, "px solid ").concat(colors[borderColor]),
      borderRadius: rhythm(radiuses[radius]),
      boxShadow: shadow && shadows[shadow],
      fontSize: scale(size)
    }, treatments[font], {}, effects[effect], {
      '& > *': {
        margin: rhythm([0, 0.125])
      },
      '& > *:first-child': {
        marginLeft: 0
      },
      '& > *:last-child': {
        marginRight: 0
      },
      '& > *:first-child:last-child': {
        display: 'block' // removes awkward spacing around single child e.g. share icon

      }
    }), styles)
  };
});

var Button = function Button(_ref) {
  var children = _ref.children,
      Tag = _ref.tag,
      type = _ref.type,
      target = _ref.target,
      classNames = _ref.classNames,
      props = _objectWithoutProperties(_ref, ["children", "tag", "type", "target", "classNames"]);

  var propsBlacklist = ['children', 'background', 'foreground', 'borderColor', 'borderWidth', 'font', 'size', 'spacing', 'radius', 'shadow', 'effect', 'block', 'styles'];
  var allowedProps = omit_1(props, propsBlacklist);
  return React__default.createElement(Tag, _extends({
    className: "c11n-button ".concat(classNames.root),
    type: Tag === 'button' ? type : undefined,
    "aria-label": typeof children === 'string' ? children : 'button',
    target: ['a', 'form'].indexOf(Tag) > -1 ? target : undefined,
    formTarget: Tag === 'button' ? target : undefined
  }, allowedProps), children);
};

Button.propTypes = {
  /**
   * The text for the button
   */
  children: propTypes.any.isRequired,

  /**
   * The tag or component to be used e.g. button, a, Link
   */
  tag: propTypes.oneOfType([propTypes.string, propTypes.element, propTypes.func]),

  /**
   * The target for the button
   */
  target: propTypes.oneOf(['_self', '_blank', '_parent', '_top']),

  /**
   * The type the button
   */
  type: propTypes.string,

  /**
   * The background color of the button
   */
  background: propTypes.string,

  /**
   * The color of the text
   */
  foreground: propTypes.string,

  /**
   * The color of the border
   */
  borderColor: propTypes.string,

  /**
   * The width of the border
   */
  borderWidth: propTypes.number,

  /**
   * The font for the text
   */
  font: propTypes.string,

  /**
   * The scale to be used for the font size
   */
  size: propTypes.number,

  /**
   * The spacing to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * The radius of the button
   */
  radius: propTypes.string,

  /**
   * The shadow to be placed on the button
   */
  shadow: propTypes.string,

  /**
   * The effect to be used on the button
   */
  effect: propTypes.string,

  /**
   * Makes the button full width
   */
  block: propTypes.bool,

  /**
   * Custom styles to be applied to the button
   */
  styles: propTypes.object
};
Button.defaultProps = {
  tag: 'button',
  target: '_top',
  type: 'button',
  background: 'primary',
  foreground: 'light',
  borderColor: 'shade',
  borderWidth: 0,
  font: 'button',
  size: 0,
  spacing: {
    x: 0.75,
    y: 0.5
  },
  radius: 'small',
  effect: 'tint',
  styles: {}
};
var Button$1 = withStyles(styles$2)(Button);

var styles$3 = (function (_ref, _ref2) {
  var align = _ref.align,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing;
  return {
    root: merge_1(_objectSpread2({
      textAlign: align
    }, calculateSpacing(spacing, 'margin', {
      multiplier: -1
    }), {
      '& > *': _objectSpread2({
        display: 'inline-block'
      }, calculateSpacing(spacing, 'margin'))
    }), styles)
  };
});

var ButtonGroup = function ButtonGroup(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-button-group ".concat(classNames.root)
  }, children);
};

ButtonGroup.propTypes = {
  /**
   * The buttons to appear within the group
   */
  children: propTypes.any,

  /**
   * The spacing to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * The alignment of the buttons in the group
   */
  align: propTypes.oneOf(['left', 'center', 'right']),

  /**
   * Custom styles to be applied to the button
   */
  styles: propTypes.object
};
ButtonGroup.defaultProps = {
  spacing: 0.25,
  styles: {}
};
var ButtonGroup$1 = withStyles(styles$3)(ButtonGroup);

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$e.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = _baseRest(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn_1(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq_1(value, objectProto$e[key]) && !hasOwnProperty$c.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

var defaults_1 = defaults;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$2:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$3:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$5:
      var convert = _mapToArray;

    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$f.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$d.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var objectProto$g = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$e = objectProto$g.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$2 : _getTag(object),
      othTag = othIsArr ? arrayTag$2 : _getTag(other);

  objTag = objTag == argsTag$3 ? objectTag$4 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$4 : othTag;

  var objIsObj = objTag == objectTag$4,
      othIsObj = othTag == objectTag$4,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$e.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$e.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayMap : _baseMap;
  return func(collection, _baseIteratee(iteratee));
}

var map_1 = map;

var strictUriEncode = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

var stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

var services = {
  facebook: function facebook(_ref) {
    var url = _ref.url;
    return "http://www.facebook.com/sharer.php?".concat(stringify({
      u: url
    }));
  },
  mail: function mail(_ref2) {
    var url = _ref2.url,
        title = _ref2.title;
    return "mailto:?".concat(stringify({
      body: url,
      subject: title
    }));
  },
  linkedin: function linkedin(_ref3) {
    var url = _ref3.url,
        title = _ref3.title;
    return "https://www.linkedin.com/shareArticle?".concat(stringify({
      mini: true,
      url: url,
      title: title
    }));
  },
  messenger: function messenger(_ref4) {
    var url = _ref4.url;
    return "fb-messenger://share?".concat(stringify({
      link: url
    }));
  },
  pinterest: function pinterest(_ref5) {
    var url = _ref5.url,
        title = _ref5.title,
        image = _ref5.image;
    return "http://pinterest.com/pin/create/button/?".concat(stringify({
      url: url,
      media: image,
      description: title
    }));
  },
  reddit: function reddit(_ref6) {
    var url = _ref6.url,
        title = _ref6.title;
    return "http://www.reddit.com/submit?".concat(stringify({
      url: url,
      title: title
    }));
  },
  sms: function sms(_ref7) {
    var url = _ref7.url;
    return "sms:?&".concat(stringify({
      body: url
    }));
  },
  twitter: function twitter(_ref8) {
    var url = _ref8.url,
        title = _ref8.title,
        hashtags = _ref8.hashtags;
    return "https://twitter.com/share?".concat(stringify({
      url: url,
      hashtags: hashtags,
      text: title
    }));
  },
  whatsapp: function whatsapp(_ref9) {
    var url = _ref9.url,
        title = _ref9.title;
    return "whatsapp://send?".concat(stringify({
      text: [title, url].join(' - ')
    }));
  }
};
var popupShares = ['facebook', 'twitter', 'linkedin', 'pinterest', 'reddit'];

var toString$1 = function toString(obj) {
  return map_1(obj, function (value, key) {
    return key + '=' + value;
  }).join(',');
};

var openPopup = function openPopup(url, config) {
  config = defaults_1(config || {}, {
    width: 640,
    height: 320
  });
  var windowTop = window.screenTop ? window.screenTop : window.screenY;
  var windowLeft = window.screenLeft ? window.screenLeft : window.screenX;
  config.top = windowTop + window.innerHeight / 2 - config.height / 2;
  config.left = windowLeft + window.innerWidth / 2 - config.width / 2;
  config = toString$1(config);
  window.open(url, 'shareWindow', config);
};

var openShareDialog = (function (options) {
  return function () {
    var imageUrl = document.head.querySelector('meta[property="og:image"]') && document.head.querySelector('meta[property="og:image"]').content;
    var caption = options.caption,
        hashtags = options.hashtags,
        _options$image = options.image,
        image = _options$image === void 0 ? imageUrl : _options$image,
        _options$title = options.title,
        title = _options$title === void 0 ? document.title : _options$title,
        type = options.type,
        _options$url = options.url,
        url = _options$url === void 0 ? window.location.href : _options$url;
    var service = services[type];

    if (service) {
      var popupConfig = {
        toolbar: 0,
        status: 0,
        width: 640,
        height: 320
      };
      var shareUrl = service({
        url: url,
        title: title,
        hashtags: hashtags,
        caption: caption,
        image: image
      });
      console.log(shareUrl);
      return popupShares.indexOf(type) > -1 ? openPopup(shareUrl, popupConfig) : window.location.assign(shareUrl);
    }
  };
});

/**
 * Uses the Button component to create a share button with an icon. Renamed from `ButtonSocial` in v2.1
 *
 * Will accept any props that the Button accepts
 */

var ButtonShare = function ButtonShare(_ref) {
  var share = _ref.share,
      type = _ref.type,
      url = _ref.url,
      title = _ref.title,
      hashtags = _ref.hashtags,
      image = _ref.image,
      props = _objectWithoutProperties(_ref, ["share", "type", "url", "title", "hashtags", "image"]);

  return React__default.createElement(Button$1, _extends({
    background: type,
    tag: share ? 'button' : 'a',
    onClick: share && openShareDialog({
      type: type,
      url: url,
      title: title,
      hashtags: hashtags,
      image: image
    }),
    "aria-label": type
  }, props), React__default.createElement(Icon$1, {
    name: type
  }));
};

ButtonShare.propTypes = {
  /**
   * The social network / share target
   */
  type: propTypes.oneOf(['facebook', 'fitbit', 'google', 'instagram', 'linkedin', 'mail', 'mapmyfitness', 'messenger', 'pinterest', 'reddit', 'slack', 'sms', 'strava', 'twitter', 'vimeo', 'whatsapp', 'youtube']).isRequired,

  /**
   * Makes the button a share button (only available for twitter, facebook, linkedin, pinterest & mail)
   */
  share: propTypes.bool,

  /**
   * Hashtags to be added to a twitter share
   */
  hashtags: propTypes.string,

  /**
   * The text for a twitter, linkedin or pinterest share. Also the email subject for mail share
   */
  title: propTypes.string
};
ButtonShare.defaultProps = {
  spacing: 0.5,
  effect: 'grow',
  radius: 'large',
  target: '_blank'
};

var index$1 = (function (props) {
  console.log('The ButtonSocial component has been renamed and moved to the more reusable ButtonShare component. Support for importing from `constructicon/button-social` will be removed in version 3');
  return React__default.createElement(ButtonShare, props);
});

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = _toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject_1(objValue)
          ? objValue
          : (_isIndex(path[index + 1]) ? [] : {});
      }
    }
    _assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet;

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = _baseGet(object, path);

    if (predicate(value, path)) {
      _baseSet(result, _castPath(path, object), value);
    }
  }
  return result;
}

var _basePickBy = basePickBy;

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return _basePickBy(object, paths, function(value, path) {
    return hasIn_1(object, path);
  });
}

var _basePick = basePick;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = _flatRest(function(object, paths) {
  return object == null ? {} : _basePick(object, paths);
});

var pick_1 = pick;

var trackHelper = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.getTrackLeft = exports.getTrackAnimateCSS = exports.getTrackCSS = undefined;
exports.getPreClones = getPreClones;
exports.getPostClones = getPostClones;
exports.getTotalSlides = getTotalSlides;



var _reactDom2 = _interopRequireDefault(reactDom__default);



var _objectAssign2 = _interopRequireDefault(objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// checks if spec is the superset of keys in keysArray, i.e., spec contains all the keys from keysArray
var checkSpecKeys = function checkSpecKeys(spec, keysArray) {
  return keysArray.reduce(function (value, key) {
    return value && spec.hasOwnProperty(key);
  }, true) ? null : console.error('Keys Missing', spec);
};

var getTrackCSS = exports.getTrackCSS = function getTrackCSS(spec) {
  checkSpecKeys(spec, ['left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth']);

  var trackWidth, trackHeight;
  var trackChildren = spec.slideCount + 2 * spec.slidesToShow; // this should probably be getTotalSlides
  if (!spec.vertical) {
    trackWidth = getTotalSlides(spec) * spec.slideWidth;
    trackWidth += spec.slideWidth / 2; // this is a temporary hack so that track div doesn't create new row for slight overflow
  } else {
    trackHeight = trackChildren * spec.slideHeight;
  }

  var style = {
    opacity: 1,
    WebkitTransform: !spec.vertical ? 'translate3d(' + spec.left + 'px, 0px, 0px)' : 'translate3d(0px, ' + spec.left + 'px, 0px)',
    transform: !spec.vertical ? 'translate3d(' + spec.left + 'px, 0px, 0px)' : 'translate3d(0px, ' + spec.left + 'px, 0px)',
    transition: '',
    WebkitTransition: '',
    msTransform: !spec.vertical ? 'translateX(' + spec.left + 'px)' : 'translateY(' + spec.left + 'px)'
  };
  if (spec.fade) {
    style = {
      opacity: 1
    };
  }

  if (trackWidth) {
    (0, _objectAssign2.default)(style, { width: trackWidth });
  }

  if (trackHeight) {
    (0, _objectAssign2.default)(style, { height: trackHeight });
  }

  // Fallback for IE8
  if (window && !window.addEventListener && window.attachEvent) {
    if (!spec.vertical) {
      style.marginLeft = spec.left + 'px';
    } else {
      style.marginTop = spec.left + 'px';
    }
  }

  return style;
};

var getTrackAnimateCSS = exports.getTrackAnimateCSS = function getTrackAnimateCSS(spec) {
  checkSpecKeys(spec, ['left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth', 'speed', 'cssEase']);

  var style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  style.WebkitTransition = '-webkit-transform ' + spec.speed + 'ms ' + spec.cssEase;
  style.transition = 'transform ' + spec.speed + 'ms ' + spec.cssEase;
  return style;
};

// gets total length of track that's on the left side of current slide
var getTrackLeft = exports.getTrackLeft = function getTrackLeft(spec) {

  checkSpecKeys(spec, ['slideIndex', 'trackRef', 'infinite', 'centerMode', 'slideCount', 'slidesToShow', 'slidesToScroll', 'slideWidth', 'listWidth', 'variableWidth', 'slideHeight']);

  var slideIndex = spec.slideIndex,
      trackRef = spec.trackRef,
      infinite = spec.infinite,
      centerMode = spec.centerMode,
      slideCount = spec.slideCount,
      slidesToShow = spec.slidesToShow,
      slidesToScroll = spec.slidesToScroll,
      slideWidth = spec.slideWidth,
      listWidth = spec.listWidth,
      variableWidth = spec.variableWidth,
      slideHeight = spec.slideHeight,
      fade = spec.fade,
      vertical = spec.vertical;


  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var verticalOffset = 0;

  if (fade || spec.slideCount === 1) {
    return 0;
  }

  var slidesToOffset = 0;
  if (infinite) {
    slidesToOffset = -getPreClones(spec); // bring active slide to the beginning of visual area
    // if next scroll doesn't have enough children, just reach till the end of original slides instead of shifting slidesToScroll children
    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = -(slideIndex > slideCount ? slidesToShow - (slideIndex - slideCount) : slideCount % slidesToScroll);
    }
    // shift current slide to center of the frame
    if (centerMode) {
      slidesToOffset += parseInt(slidesToShow / 2);
    }
  } else {
    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = slidesToShow - slideCount % slidesToScroll;
    }
    if (centerMode) {
      slidesToOffset = parseInt(slidesToShow / 2);
    }
  }
  slideOffset = slidesToOffset * slideWidth;
  verticalOffset = slidesToOffset * slideHeight;

  if (!vertical) {
    targetLeft = slideIndex * slideWidth * -1 + slideOffset;
  } else {
    targetLeft = slideIndex * slideHeight * -1 + verticalOffset;
  }

  if (variableWidth === true) {
    var targetSlideIndex;
    var lastSlide = _reactDom2.default.findDOMNode(trackRef).children[slideCount - 1];
    var max = -lastSlide.offsetLeft + listWidth - lastSlide.offsetWidth;
    if (slideCount <= slidesToShow || infinite === false) {
      targetSlide = _reactDom2.default.findDOMNode(trackRef).childNodes[slideIndex];
    } else {
      targetSlideIndex = slideIndex + slidesToShow;
      targetSlide = _reactDom2.default.findDOMNode(trackRef).childNodes[targetSlideIndex];
    }
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    if (centerMode === true) {
      if (infinite === false) {
        targetSlide = _reactDom2.default.findDOMNode(trackRef).children[slideIndex];
      } else {
        targetSlide = _reactDom2.default.findDOMNode(trackRef).children[slideIndex + slidesToShow + 1];
      }

      if (targetSlide) {
        targetLeft = targetSlide.offsetLeft * -1 + (listWidth - targetSlide.offsetWidth) / 2;
      }
    }
    if (spec.infinite === false && targetLeft < max) {
      targetLeft = max;
    }
  }

  return targetLeft;
};

function getPreClones(spec) {
  return spec.slidesToShow + (spec.centerMode ? 1 : 0);
}

function getPostClones(spec) {
  return spec.slideCount;
}

function getTotalSlides(spec) {
  if (spec.slideCount === 1) {
    return 1;
  }
  return getPreClones(spec) + spec.slideCount + getPostClones(spec);
}
});

unwrapExports(trackHelper);
var trackHelper_1 = trackHelper.getTrackLeft;
var trackHelper_2 = trackHelper.getTrackAnimateCSS;
var trackHelper_3 = trackHelper.getTrackCSS;
var trackHelper_4 = trackHelper.getPreClones;
var trackHelper_5 = trackHelper.getPostClones;
var trackHelper_6 = trackHelper.getTotalSlides;

var helpers_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React__default);



var _reactDom2 = _interopRequireDefault(reactDom__default);





var _objectAssign2 = _interopRequireDefault(objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
  // supposed to start autoplay of slides
  initialize: function initialize(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);

    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      var centerPaddingAdj = props.centerMode && parseInt(props.centerPadding) * 2;
      if (props.centerPadding.slice(-1) === '%') {
        centerPaddingAdj *= listWidth / 100;
      }
      slideWidth = (this.getWidth(_reactDom2.default.findDOMNode(this)) - centerPaddingAdj) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    var currentSlide = props.rtl ? slideCount - 1 - props.initialSlide : props.initialSlide;

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      currentSlide: currentSlide,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {
      // this reference isn't lost due to mixin
      var targetLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  update: function update(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);
    // This method has mostly same code as initialize method.
    // Refactor it
    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      var centerPaddingAdj = props.centerMode && parseInt(props.centerPadding) * 2;
      if (props.centerPadding.slice(-1) === '%') {
        centerPaddingAdj *= listWidth / 100;
      }
      slideWidth = (this.getWidth(_reactDom2.default.findDOMNode(this)) - centerPaddingAdj) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    // pause slider if autoplay is set to false
    if (!props.autoplay) {
      this.pause();
    } else {
      this.autoPlay();
    }

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {

      var targetLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });
    });
  },
  getWidth: function getWidth(elem) {
    return elem && (elem.getBoundingClientRect().width || elem.offsetWidth) || 0;
  },
  getHeight: function getHeight(elem) {
    return elem && (elem.getBoundingClientRect().height || elem.offsetHeight) || 0;
  },

  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.list) {
        var slickList = _reactDom2.default.findDOMNode(this.list);
        var elem = slickList.querySelector(selector) || {};
        slickList.style.height = (elem.offsetHeight || 0) + 'px';
      }
    }
  },
  canGoNext: function canGoNext(opts) {
    var canGo = true;
    if (!opts.infinite) {
      if (opts.centerMode) {
        // check if current slide is last slide
        if (opts.currentSlide >= opts.slideCount - 1) {
          canGo = false;
        }
      } else {
        // check if all slides are shown in slider
        if (opts.slideCount <= opts.slidesToShow || opts.currentSlide >= opts.slideCount - opts.slidesToShow) {
          canGo = false;
        }
      }
    }
    return canGo;
  },
  slideHandler: function slideHandler(index) {
    var _this = this;

    // index is target slide index

    // Functionality of animateSlide and postSlide is merged into this function
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;
    var callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }

    if (this.props.fade) {
      currentSlide = this.state.currentSlide;

      // Don't change slide if infinite=false and target slide is out of range
      if (this.props.infinite === false && (index < 0 || index >= this.state.slideCount)) {
        return;
      }

      //  Shifting targetSlide back into the range
      if (index < 0) {
        targetSlide = index + this.state.slideCount;
      } else if (index >= this.state.slideCount) {
        targetSlide = index - this.state.slideCount;
      } else {
        targetSlide = index;
      }

      if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide)
        });
      }

      callback = function callback() {
        _this.setState({
          animating: false
        });
        if (_this.props.afterChange) {
          _this.props.afterChange(targetSlide);
        }
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        currentSlide: targetSlide
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed);
      });

      if (this.props.beforeChange) {
        this.props.beforeChange(this.state.currentSlide, targetSlide);
      }

      this.autoPlay();
      return;
    }

    targetSlide = index;
    if (targetSlide < 0) {
      if (this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: targetSlide,
      trackRef: this.track
    }, this.props, this.state));

    currentLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: currentSlide,
      trackRef: this.track
    }, this.props, this.state));

    if (this.props.infinite === false) {
      if (targetLeft === currentLeft) {
        targetSlide = currentSlide;
      }
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, currentSlide);
    }

    if (this.props.lazyLoad) {
      var slidesToLoad = [];
      var slideCount = this.state.slideCount;
      for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++) {
        if (this.state.lazyLoadedList.indexOf(i) < 0) {
          slidesToLoad.push(i);
        }
        if (i >= slideCount && this.state.lazyLoadedList.indexOf(i - slideCount) < 0) {
          slidesToLoad.push(i - slideCount);
        }
        if (i < 0 && this.state.lazyLoadedList.indexOf(i + slideCount) < 0) {
          slidesToLoad.push(i + slideCount);
        }
      }
      if (slidesToLoad.length > 0) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
        });
      }
    }

    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {

      this.setState({
        currentSlide: currentSlide,
        trackStyle: (0, trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });
    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: currentSlide,
        trackStyle: (0, trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state)),
        swipeLeft: null
      };
      callback = function callback() {
        _this.setState(nextStateChanges, function () {
          if (_this.props.afterChange) {
            _this.props.afterChange(currentSlide);
          }
          delete _this.animationEndCallback;
        });
      };

      this.setState({
        animating: true,
        currentSlide: currentSlide,
        trackStyle: (0, trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: targetLeft }, this.props, this.state))
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed);
      });
    }

    this.autoPlay();
  },
  swipeDirection: function swipeDirection(touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
      return 'left';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return 'right';
    }
    if (this.props.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  },
  play: function play() {
    var nextIndex;

    if (!this.state.mounted) {
      return false;
    }

    if (this.props.rtl) {
      nextIndex = this.state.currentSlide - this.props.slidesToScroll;
    } else {
      if (this.canGoNext(_extends({}, this.props, this.state))) {
        nextIndex = this.state.currentSlide + this.props.slidesToScroll;
      } else {
        return false;
      }
    }

    this.slideHandler(nextIndex);
  },
  autoPlay: function autoPlay() {
    if (this.state.autoPlayTimer) {
      clearTimeout(this.state.autoPlayTimer);
    }
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: setTimeout(this.play, this.props.autoplaySpeed)
      });
    }
  },
  pause: function pause() {
    if (this.state.autoPlayTimer) {
      clearTimeout(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: null
      });
    }
  }
};

exports.default = helpers;
});

unwrapExports(helpers_1);

var eventHandlers = createCommonjsModule(function (module, exports) {

exports.__esModule = true;





var _helpers2 = _interopRequireDefault(helpers_1);



var _objectAssign2 = _interopRequireDefault(objectAssign);



var _reactDom2 = _interopRequireDefault(reactDom__default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventHandlers = {
  // Event handler for previous and next
  // gets called if slide is changed via arrows or dots but not swiping/dragging
  changeSlide: function changeSlide(options) {
    var indexOffset, previousInt, slideOffset, unevenOffset, targetSlide;
    var _props = this.props,
        slidesToScroll = _props.slidesToScroll,
        slidesToShow = _props.slidesToShow;
    var _state = this.state,
        slideCount = _state.slideCount,
        currentSlide = _state.currentSlide;

    unevenOffset = slideCount % slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (slideCount - currentSlide) % slidesToScroll;

    if (options.message === 'previous') {
      slideOffset = indexOffset === 0 ? slidesToScroll : slidesToShow - indexOffset;
      targetSlide = currentSlide - slideOffset;
      if (this.props.lazyLoad && !this.props.infinite) {
        previousInt = currentSlide - slideOffset;
        targetSlide = previousInt === -1 ? slideCount - 1 : previousInt;
      }
    } else if (options.message === 'next') {
      slideOffset = indexOffset === 0 ? slidesToScroll : indexOffset;
      targetSlide = currentSlide + slideOffset;
      if (this.props.lazyLoad && !this.props.infinite) {
        targetSlide = (currentSlide + slidesToScroll) % slideCount + indexOffset;
      }
    } else if (options.message === 'dots' || options.message === 'children') {
      // Click on dots
      targetSlide = options.index * options.slidesToScroll;
      if (targetSlide === options.currentSlide) {
        return;
      }
    } else if (options.message === 'index') {
      targetSlide = Number(options.index);
      if (targetSlide === options.currentSlide) {
        return;
      }
    }

    this.slideHandler(targetSlide);
  },

  // Accessiblity handler for previous and next
  keyHandler: function keyHandler(e) {
    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
    if (!e.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (e.keyCode === 37 && this.props.accessibility === true) {
        this.changeSlide({
          message: this.props.rtl === true ? 'next' : 'previous'
        });
      } else if (e.keyCode === 39 && this.props.accessibility === true) {
        this.changeSlide({
          message: this.props.rtl === true ? 'previous' : 'next'
        });
      }
    }
  },
  // Focus on selecting a slide (click handler on track)
  selectHandler: function selectHandler(options) {
    this.changeSlide(options);
  },
  // invoked when swiping/dragging starts (just once)
  swipeStart: function swipeStart(e) {
    var posX, posY;

    if (this.props.swipe === false || 'ontouchend' in document && this.props.swipe === false) {
      return;
    } else if (this.props.draggable === false && e.type.indexOf('mouse') !== -1) {
      return;
    }
    posX = e.touches !== undefined ? e.touches[0].pageX : e.clientX;
    posY = e.touches !== undefined ? e.touches[0].pageY : e.clientY;
    this.setState({
      dragging: true,
      touchObject: {
        startX: posX,
        startY: posY,
        curX: posX,
        curY: posY
      }
    });
  },
  // continuous invokation while swiping/dragging is going on
  swipeMove: function swipeMove(e) {
    if (!this.state.dragging) {
      e.preventDefault();
      return;
    }
    if (this.state.scrolling) {
      return;
    }
    if (this.state.animating) {
      e.preventDefault();
      return;
    }
    if (this.props.vertical && this.props.swipeToSlide && this.props.verticalSwiping) {
      e.preventDefault();
    }
    var swipeLeft;
    var curLeft, positionOffset;
    var touchObject = this.state.touchObject;

    curLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: this.state.currentSlide,
      trackRef: this.track
    }, this.props, this.state));
    touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
    touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
    touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));
    var verticalSwipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2)));

    if (!this.props.verticalSwiping && !this.state.swiping && verticalSwipeLength > 4) {
      this.setState({
        scrolling: true
      });
      return;
    }

    if (this.props.verticalSwiping) {
      touchObject.swipeLength = verticalSwipeLength;
    }

    positionOffset = (this.props.rtl === false ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);

    if (this.props.verticalSwiping) {
      positionOffset = touchObject.curY > touchObject.startY ? 1 : -1;
    }

    var currentSlide = this.state.currentSlide;
    var dotCount = Math.ceil(this.state.slideCount / this.props.slidesToScroll); // this might not be correct, using getDotCount may be more accurate
    var swipeDirection = this.swipeDirection(this.state.touchObject);
    var touchSwipeLength = touchObject.swipeLength;

    if (this.props.infinite === false) {
      if (currentSlide === 0 && swipeDirection === 'right' || currentSlide + 1 >= dotCount && swipeDirection === 'left') {
        touchSwipeLength = touchObject.swipeLength * this.props.edgeFriction;

        if (this.state.edgeDragged === false && this.props.edgeEvent) {
          this.props.edgeEvent(swipeDirection);
          this.setState({ edgeDragged: true });
        }
      }
    }
    if (this.state.swiped === false && this.props.swipeEvent) {
      this.props.swipeEvent(swipeDirection);
      this.setState({ swiped: true });
    }

    if (!this.props.vertical) {
      if (!this.props.rtl) {
        swipeLeft = curLeft + touchSwipeLength * positionOffset;
      } else {
        swipeLeft = curLeft - touchSwipeLength * positionOffset;
      }
    } else {
      swipeLeft = curLeft + touchSwipeLength * (this.state.listHeight / this.state.listWidth) * positionOffset;
    }

    if (this.props.verticalSwiping) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    }

    this.setState({
      touchObject: touchObject,
      swipeLeft: swipeLeft,
      trackStyle: (0, trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: swipeLeft }, this.props, this.state))
    });

    if (Math.abs(touchObject.curX - touchObject.startX) < Math.abs(touchObject.curY - touchObject.startY) * 0.8) {
      return;
    }
    if (touchObject.swipeLength > 4) {
      this.setState({
        swiping: true
      });
      e.preventDefault();
    }
  },
  getNavigableIndexes: function getNavigableIndexes() {
    var max = void 0;
    var breakPoint = 0;
    var counter = 0;
    var indexes = [];

    if (!this.props.infinite) {
      max = this.state.slideCount;
    } else {
      breakPoint = this.props.slidesToShow * -1;
      counter = this.props.slidesToShow * -1;
      max = this.state.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + this.props.slidesToScroll;

      counter += this.props.slidesToScroll <= this.props.slidesToShow ? this.props.slidesToScroll : this.props.slidesToShow;
    }

    return indexes;
  },
  checkNavigable: function checkNavigable(index) {
    var navigables = this.getNavigableIndexes();
    var prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  },
  getSlideCount: function getSlideCount() {
    var _this = this;

    var centerOffset = this.props.centerMode ? this.state.slideWidth * Math.floor(this.props.slidesToShow / 2) : 0;

    if (this.props.swipeToSlide) {
      var swipedSlide = void 0;

      var slickList = _reactDom2.default.findDOMNode(this.list);

      var slides = slickList.querySelectorAll('.slick-slide');

      Array.from(slides).every(function (slide) {
        if (!_this.props.vertical) {
          if (slide.offsetLeft - centerOffset + _this.getWidth(slide) / 2 > _this.state.swipeLeft * -1) {
            swipedSlide = slide;
            return false;
          }
        } else {
          if (slide.offsetTop + _this.getHeight(slide) / 2 > _this.state.swipeLeft * -1) {
            swipedSlide = slide;
            return false;
          }
        }

        return true;
      });

      var currentIndex = this.props.rtl === true ? this.state.slideCount - this.state.currentSlide : this.state.currentSlide;
      var slidesTraversed = Math.abs(swipedSlide.dataset.index - currentIndex) || 1;

      return slidesTraversed;
    } else {
      return this.props.slidesToScroll;
    }
  },

  swipeEnd: function swipeEnd(e) {
    if (!this.state.dragging) {
      if (this.props.swipe) {
        e.preventDefault();
      }
      return;
    }
    var touchObject = this.state.touchObject;
    var minSwipe = this.state.listWidth / this.props.touchThreshold;
    var swipeDirection = this.swipeDirection(touchObject);

    if (this.props.verticalSwiping) {
      minSwipe = this.state.listHeight / this.props.touchThreshold;
    }

    var wasScrolling = this.state.scrolling;
    // reset the state of touch related state variables.
    this.setState({
      dragging: false,
      edgeDragged: false,
      scrolling: false,
      swiping: false,
      swiped: false,
      swipeLeft: null,
      touchObject: {}
    });
    if (wasScrolling) {
      return;
    }

    // Fix for #13
    if (!touchObject.swipeLength) {
      return;
    }
    if (touchObject.swipeLength > minSwipe) {
      e.preventDefault();

      var slideCount = void 0,
          newSlide = void 0;

      switch (swipeDirection) {

        case 'left':
        case 'down':
          newSlide = this.state.currentSlide + this.getSlideCount();
          slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
          this.state.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          newSlide = this.state.currentSlide - this.getSlideCount();
          slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
          this.state.currentDirection = 1;
          break;

        default:
          slideCount = this.state.currentSlide;

      }

      this.slideHandler(slideCount);
    } else {
      // Adjust the track back to it's original position.
      var currentLeft = (0, trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, this.props, this.state));

      this.setState({
        trackStyle: (0, trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      });
    }
  },
  onInnerSliderEnter: function onInnerSliderEnter(e) {
    if (this.props.autoplay && this.props.pauseOnHover) {
      this.pause();
    }
  },
  onInnerSliderOver: function onInnerSliderOver(e) {
    if (this.props.autoplay && this.props.pauseOnHover) {
      this.pause();
    }
  },
  onInnerSliderLeave: function onInnerSliderLeave(e) {
    if (this.props.autoplay && this.props.pauseOnHover) {
      this.autoPlay();
    }
  }
};

exports.default = EventHandlers;
});

unwrapExports(eventHandlers);

var initialState = {
    animating: false,
    dragging: false,
    autoPlayTimer: null,
    currentDirection: 0,
    currentLeft: null,
    currentSlide: 0,
    direction: 1,
    listWidth: null,
    listHeight: null,
    scrolling: false,
    // loadIndex: 0,
    slideCount: null,
    slideWidth: null,
    slideHeight: null,
    swiping: false,
    // sliding: false,
    // slideOffset: 0,
    swipeLeft: null,
    touchObject: {
        startX: 0,
        startY: 0,
        curX: 0,
        curY: 0
    },

    lazyLoadedList: [],

    // added for react
    initialized: false,
    edgeDragged: false,
    swiped: false, // used by swipeEvent. differentites between touch and swipe.
    trackStyle: {},
    trackWidth: 0

    // Removed
    // transformsEnabled: false,
    // $nextArrow: null,
    // $prevArrow: null,
    // $dots: null,
    // $list: null,
    // $slideTrack: null,
    // $slides: null,
};

var initialState_1 = initialState;

var defaultProps_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var _react2 = _interopRequireDefault(React__default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
    className: '',
    accessibility: true,
    adaptiveHeight: false,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: '50px',
    cssEase: 'ease',
    customPaging: function customPaging(i) {
        return _react2.default.createElement(
            'button',
            null,
            i + 1
        );
    },
    dots: false,
    dotsClass: 'slick-dots',
    draggable: true,
    easing: 'linear',
    edgeFriction: 0.35,
    fade: false,
    focusOnSelect: false,
    infinite: true,
    initialSlide: 0,
    lazyLoad: false,
    pauseOnHover: true,
    responsive: null,
    rtl: false,
    slide: 'div',
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    swipe: true,
    swipeToSlide: false,
    touchMove: true,
    touchThreshold: 5,
    useCSS: true,
    variableWidth: false,
    vertical: false,
    waitForAnimate: true,
    afterChange: null,
    beforeChange: null,
    edgeEvent: null,
    // init: function hook that gets called right before InnerSlider mounts
    init: null,
    swipeEvent: null,
    // nextArrow, prevArrow should react componets
    nextArrow: null,
    prevArrow: null
};

exports.default = defaultProps;
});

unwrapExports(defaultProps_1);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

var emptyObject_1 = emptyObject;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction$1 = function emptyFunction() {};

emptyFunction$1.thatReturns = makeEmptyFunction;
emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
emptyFunction$1.thatReturnsThis = function () {
  return this;
};
emptyFunction$1.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction$1;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning$1 = emptyFunction_1;

if (process.env.NODE_ENV !== 'production') {
  var printWarning$2 = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning$1 = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning$2.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning$1;

if (process.env.NODE_ENV !== 'production') {
  var warning$2 = warning_1;
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity$1(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = objectAssign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = objectAssign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = objectAssign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning$2(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      invariant_1(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      invariant_1(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning$2(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    invariant_1(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    invariant_1(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            invariant_1(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      invariant_1(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        invariant_1(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    invariant_1(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        invariant_1(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning$2(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning$2(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning$2(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  objectAssign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity$1(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning$2(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject_1;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      invariant_1(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    invariant_1(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning$2(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning$2(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
      warning$2(
        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
          'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

var factory_1 = factory;

if (typeof React__default === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React__default.Component().updater;

var createReactClass = factory_1(
  React__default.Component,
  React__default.isValidElement,
  ReactNoopUpdateQueue
);

var classnames$1 = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
});

var track = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.Track = undefined;



var _react2 = _interopRequireDefault(React__default);



var _objectAssign2 = _interopRequireDefault(objectAssign);



var _classnames2 = _interopRequireDefault(classnames$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// given specifications/props for a slide, fetch all the classes that need to be applied to the slide
var getSlideClasses = function getSlideClasses(spec) {
  // if spec has currentSlideIndex, we can also apply slickCurrent class according to that (https://github.com/kenwheeler/slick/blob/master/slick/slick.js#L2300-L2302)
  var slickActive, slickCenter, slickCloned;
  var centerOffset, index;

  if (spec.rtl) {
    // if we're going right to left, index is reversed
    index = spec.slideCount - 1 - spec.index;
  } else {
    // index of the slide
    index = spec.index;
  }
  slickCloned = index < 0 || index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0; // concern: not sure if this should be correct (https://github.com/kenwheeler/slick/blob/master/slick/slick.js#L2328-L2346)
    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    // concern: following can be incorrect in case where currentSlide is lastSlide in frame and rest of the slides to show have index smaller than currentSlideIndex
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }
  var slickCurrent = index === spec.currentSlide;
  return (0, _classnames2.default)({
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned,
    'slick-current': slickCurrent // dubious in case of RTL
  });
};

var getSlideStyle = function getSlideStyle(spec) {
  var style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = 'relative';
    if (spec.vertical) {
      style.top = -spec.index * spec.slideHeight;
    } else {
      style.left = -spec.index * spec.slideWidth;
    }
    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    style.visibility = spec.currentSlide === spec.index ? 'visible' : 'hidden';
    style.transition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase + ', ' + 'visibility ' + spec.speed + 'ms ' + spec.cssEase;
    style.WebkitTransition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase + ', ' + 'visibility ' + spec.speed + 'ms ' + spec.cssEase;
  }

  return style;
};

var getKey = function getKey(child, fallbackKey) {
  return child.key || fallbackKey;
};

var renderSlides = function renderSlides(spec) {
  var key;
  var slides = [];
  var preCloneSlides = [];
  var postCloneSlides = [];
  var childrenCount = _react2.default.Children.count(spec.children);

  _react2.default.Children.forEach(spec.children, function (elem, index) {
    var child = void 0;
    var childOnClickOptions = {
      message: 'children',
      index: index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide
    };

    // in case of lazyLoad, whether or not we want to fetch the slide
    if (!spec.lazyLoad || spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0) {
      child = elem;
    } else {
      child = _react2.default.createElement('div', null);
    }
    var childStyle = getSlideStyle((0, _objectAssign2.default)({}, spec, { index: index }));
    var slideClass = child.props.className || '';

    var onClick = function onClick(e) {
      child.props && child.props.onClick && child.props.onClick(e);
      if (spec.focusOnSelect) {
        spec.focusOnSelect(childOnClickOptions);
      }
    };

    // push a cloned element of the desired slide
    slides.push(_react2.default.cloneElement(child, {
      key: 'original' + getKey(child, index),
      'data-index': index,
      className: (0, _classnames2.default)(getSlideClasses((0, _objectAssign2.default)({ index: index }, spec)), slideClass),
      tabIndex: '-1',
      style: (0, _objectAssign2.default)({ outline: 'none' }, child.props.style || {}, childStyle),
      onClick: onClick
    }));

    // variableWidth doesn't wrap properly.
    // if slide needs to be precloned or postcloned
    if (spec.infinite && spec.fade === false) {
      var preCloneNo = childrenCount - index;
      if (preCloneNo <= spec.slidesToShow + (spec.centerMode ? 1 : 0) && childrenCount !== spec.slidesToShow) {
        key = -preCloneNo;
        preCloneSlides.push(_react2.default.cloneElement(child, {
          key: 'precloned' + getKey(child, key),
          'data-index': key,
          className: (0, _classnames2.default)(getSlideClasses((0, _objectAssign2.default)({ index: key }, spec)), slideClass),
          style: (0, _objectAssign2.default)({}, child.props.style || {}, childStyle),
          onClick: onClick
        }));
      }

      if (childrenCount !== spec.slidesToShow) {
        key = childrenCount + index;
        postCloneSlides.push(_react2.default.cloneElement(child, {
          key: 'postcloned' + getKey(child, key),
          'data-index': key,
          className: (0, _classnames2.default)(getSlideClasses((0, _objectAssign2.default)({ index: key }, spec)), slideClass),
          style: (0, _objectAssign2.default)({}, child.props.style || {}, childStyle),
          onClick: onClick
        }));
      }
    }
  });

  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

var Track = exports.Track = function (_React$Component) {
  _inherits(Track, _React$Component);

  function Track() {
    _classCallCheck(this, Track);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Track.prototype.render = function render() {
    // var slides = renderSlides.call(this, this.props);
    var slides = renderSlides(this.props);
    return _react2.default.createElement(
      'div',
      { className: 'slick-track', style: this.props.trackStyle },
      slides
    );
  };

  return Track;
}(_react2.default.Component);
});

unwrapExports(track);
var track_1 = track.Track;

var dots = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.Dots = undefined;



var _react2 = _interopRequireDefault(React__default);



var _classnames2 = _interopRequireDefault(classnames$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDotCount = function getDotCount(spec) {
  var dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

var Dots = exports.Dots = function (_React$Component) {
  _inherits(Dots, _React$Component);

  function Dots() {
    _classCallCheck(this, Dots);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Dots.prototype.clickHandler = function clickHandler(options, e) {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();
    this.props.clickHandler(options);
  };

  Dots.prototype.render = function render() {
    var _this2 = this;

    var dotCount = getDotCount({
      slideCount: this.props.slideCount,
      slidesToScroll: this.props.slidesToScroll,
      slidesToShow: this.props.slidesToShow,
      infinite: this.props.infinite
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    var dots = Array.apply(null, Array(dotCount + 1).join('0').split('')).map(function (x, i) {

      var leftBound = i * _this2.props.slidesToScroll;
      var rightBound = i * _this2.props.slidesToScroll + (_this2.props.slidesToScroll - 1);
      var className = (0, _classnames2.default)({
        'slick-active': _this2.props.currentSlide >= leftBound && _this2.props.currentSlide <= rightBound
      });

      var dotOptions = {
        message: 'dots',
        index: i,
        slidesToScroll: _this2.props.slidesToScroll,
        currentSlide: _this2.props.currentSlide
      };

      var onClick = _this2.clickHandler.bind(_this2, dotOptions);

      return _react2.default.createElement(
        'li',
        { key: i, className: className },
        _react2.default.cloneElement(_this2.props.customPaging(i), { onClick: onClick })
      );
    });

    return _react2.default.createElement(
      'ul',
      { className: this.props.dotsClass, style: { display: 'block' } },
      dots
    );
  };

  return Dots;
}(_react2.default.Component);
});

unwrapExports(dots);
var dots_1 = dots.Dots;

var arrows = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.NextArrow = exports.PrevArrow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React__default);



var _classnames2 = _interopRequireDefault(classnames$1);



var _helpers2 = _interopRequireDefault(helpers_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PrevArrow = exports.PrevArrow = function (_React$Component) {
  _inherits(PrevArrow, _React$Component);

  function PrevArrow() {
    _classCallCheck(this, PrevArrow);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PrevArrow.prototype.clickHandler = function clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  };

  PrevArrow.prototype.render = function render() {
    var prevClasses = { 'slick-arrow': true, 'slick-prev': true };
    var prevHandler = this.clickHandler.bind(this, { message: 'previous' });

    if (!this.props.infinite && (this.props.currentSlide === 0 || this.props.slideCount <= this.props.slidesToShow)) {
      prevClasses['slick-disabled'] = true;
      prevHandler = null;
    }

    var prevArrowProps = {
      key: '0',
      'data-role': 'none',
      className: (0, _classnames2.default)(prevClasses),
      style: { display: 'block' },
      onClick: prevHandler
    };
    var customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount
    };
    var prevArrow = void 0;

    if (this.props.prevArrow) {
      prevArrow = _react2.default.cloneElement(this.props.prevArrow, _extends({}, prevArrowProps, customProps));
    } else {
      prevArrow = _react2.default.createElement(
        'button',
        _extends({ key: '0', type: 'button' }, prevArrowProps),
        ' Previous'
      );
    }

    return prevArrow;
  };

  return PrevArrow;
}(_react2.default.Component);

var NextArrow = exports.NextArrow = function (_React$Component2) {
  _inherits(NextArrow, _React$Component2);

  function NextArrow() {
    _classCallCheck(this, NextArrow);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  NextArrow.prototype.clickHandler = function clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  };

  NextArrow.prototype.render = function render() {
    var nextClasses = { 'slick-arrow': true, 'slick-next': true };
    var nextHandler = this.clickHandler.bind(this, { message: 'next' });

    if (!_helpers2.default.canGoNext(this.props)) {
      nextClasses['slick-disabled'] = true;
      nextHandler = null;
    }

    var nextArrowProps = {
      key: '1',
      'data-role': 'none',
      className: (0, _classnames2.default)(nextClasses),
      style: { display: 'block' },
      onClick: nextHandler
    };
    var customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount
    };
    var nextArrow = void 0;

    if (this.props.nextArrow) {
      nextArrow = _react2.default.cloneElement(this.props.nextArrow, _extends({}, nextArrowProps, customProps));
    } else {
      nextArrow = _react2.default.createElement(
        'button',
        _extends({ key: '1', type: 'button' }, nextArrowProps),
        ' Next'
      );
    }

    return nextArrow;
  };

  return NextArrow;
}(_react2.default.Component);
});

unwrapExports(arrows);
var arrows_1 = arrows.NextArrow;
var arrows_2 = arrows.PrevArrow;

var innerSlider = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.InnerSlider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React__default);



var _eventHandlers2 = _interopRequireDefault(eventHandlers);



var _helpers2 = _interopRequireDefault(helpers_1);



var _initialState2 = _interopRequireDefault(initialState_1);



var _defaultProps2 = _interopRequireDefault(defaultProps_1);



var _createReactClass2 = _interopRequireDefault(createReactClass);



var _classnames2 = _interopRequireDefault(classnames$1);



var _objectAssign2 = _interopRequireDefault(objectAssign);







function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InnerSlider = exports.InnerSlider = (0, _createReactClass2.default)({
  displayName: 'InnerSlider',

  mixins: [_helpers2.default, _eventHandlers2.default],
  list: null, // wraps the track
  track: null, // component that rolls out like a film
  listRefHandler: function listRefHandler(ref) {
    this.list = ref;
  },
  trackRefHandler: function trackRefHandler(ref) {
    this.track = ref;
  },
  getInitialState: function getInitialState() {
    return _extends({}, _initialState2.default, {
      currentSlide: this.props.initialSlide
    });
  },
  componentWillMount: function componentWillMount() {
    if (this.props.init) {
      this.props.init();
    }
    this.setState({
      mounted: true
    });
    var lazyLoadedList = [];
    // number of slides shown in the active frame
    var slidesToShow = this.props.slidesToShow;
    var childrenLen = _react2.default.Children.count(this.props.children);
    var currentSlide = this.state.currentSlide;
    for (var i = 0; i < childrenLen; i++) {
      // if currentSlide is the lastSlide of current frame and 
      // rest of the active slides are on the left of currentSlide
      // then the following might cause a problem
      if (i >= currentSlide && i < currentSlide + slidesToShow) {
        lazyLoadedList.push(i);
      }
    }
    if (this.props.centerMode === true) {
      // add slides to show on the left in case of centerMode with lazyLoad
      var additionalCount = Math.floor(slidesToShow / 2);
      if (parseInt(this.props.centerPadding) > 0) {
        additionalCount += 1;
      }
      var additionalNum = currentSlide;
      while (additionalCount--) {
        lazyLoadedList.push((--additionalNum + childrenLen) % childrenLen);
      }
    }

    if (this.props.lazyLoad && this.state.lazyLoadedList.length === 0) {
      this.setState({
        lazyLoadedList: lazyLoadedList
      });
    }
  },
  componentDidMount: function componentDidMount() {
    // Hack for autoplay -- Inspect Later
    this.initialize(this.props);
    this.adaptHeight();

    // To support server-side rendering
    if (!window) {
      return;
    }
    if (window.addEventListener) {
      window.addEventListener('resize', this.onWindowResized);
    } else {
      window.attachEvent('onresize', this.onWindowResized);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.animationEndCallback) {
      clearTimeout(this.animationEndCallback);
    }
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onWindowResized);
    } else {
      window.detachEvent('onresize', this.onWindowResized);
    }
    if (this.state.autoPlayTimer) {
      clearInterval(this.state.autoPlayTimer);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.slickGoTo != nextProps.slickGoTo) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('react-slick deprecation warning: slickGoTo prop is deprecated and it will be removed in next release. Use slickGoTo method instead');
      }
      this.changeSlide({
        message: 'index',
        index: nextProps.slickGoTo,
        currentSlide: this.state.currentSlide
      });
    } else if (this.state.currentSlide >= nextProps.children.length) {
      this.update(nextProps);
      this.changeSlide({
        message: 'index',
        index: nextProps.children.length - nextProps.slidesToShow,
        currentSlide: this.state.currentSlide
      });
    } else {
      this.update(nextProps);
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.props.lazyLoad && this.props.centerMode) {
      var childrenLen = _react2.default.Children.count(this.props.children);
      var additionalCount = Math.floor(this.props.slidesToShow / 2);
      if (parseInt(this.props.centerPadding) > 0) additionalCount++;
      var leftMostSlide = (this.state.currentSlide - additionalCount + childrenLen) % childrenLen;
      var rightMostSlide = (this.state.currentSlide + additionalCount) % childrenLen;
      if (!this.state.lazyLoadedList.includes(leftMostSlide)) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList + [leftMostSlide]
        });
      }
      if (!this.state.lazyLoadedList.includes(rightMostSlide)) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList + [rightMostSlide]
        });
      }
    }
    this.adaptHeight();
  },
  onWindowResized: function onWindowResized() {
    this.update(this.props);
    // animating state should be cleared while resizing, otherwise autoplay stops working
    this.setState({
      animating: false
    });
    clearTimeout(this.animationEndCallback);
    delete this.animationEndCallback;
  },
  slickPrev: function slickPrev() {
    this.changeSlide({ message: 'previous' });
  },
  slickNext: function slickNext() {
    this.changeSlide({ message: 'next' });
  },
  slickGoTo: function slickGoTo(slide) {
    slide = Number(slide);
    !isNaN(slide) && this.changeSlide({
      message: 'index',
      index: slide,
      currentSlide: this.state.currentSlide
    });
  },
  render: function render() {
    var className = (0, _classnames2.default)('slick-initialized', 'slick-slider', this.props.className, {
      'slick-vertical': this.props.vertical
    });

    var trackProps = {
      fade: this.props.fade,
      cssEase: this.props.cssEase,
      speed: this.props.speed,
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      focusOnSelect: this.props.focusOnSelect ? this.selectHandler : null,
      currentSlide: this.state.currentSlide,
      lazyLoad: this.props.lazyLoad,
      lazyLoadedList: this.state.lazyLoadedList,
      rtl: this.props.rtl,
      slideWidth: this.state.slideWidth,
      slideHeight: this.state.slideHeight,
      listHeight: this.state.listHeight,
      vertical: this.props.vertical,
      slidesToShow: this.props.slidesToShow,
      slidesToScroll: this.props.slidesToScroll,
      slideCount: this.state.slideCount,
      trackStyle: this.state.trackStyle,
      variableWidth: this.props.variableWidth
    };

    var dots$1;

    if (this.props.dots === true && this.state.slideCount >= this.props.slidesToShow) {
      var dotProps = {
        dotsClass: this.props.dotsClass,
        slideCount: this.state.slideCount,
        slidesToShow: this.props.slidesToShow,
        currentSlide: this.state.currentSlide,
        slidesToScroll: this.props.slidesToScroll,
        clickHandler: this.changeSlide,
        children: this.props.children,
        customPaging: this.props.customPaging,
        infinite: this.props.infinite
      };

      dots$1 = _react2.default.createElement(dots.Dots, dotProps);
    }

    var prevArrow, nextArrow;

    var arrowProps = {
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      slideCount: this.state.slideCount,
      slidesToShow: this.props.slidesToShow,
      prevArrow: this.props.prevArrow,
      nextArrow: this.props.nextArrow,
      clickHandler: this.changeSlide
    };

    if (this.props.arrows) {
      prevArrow = _react2.default.createElement(arrows.PrevArrow, arrowProps);
      nextArrow = _react2.default.createElement(arrows.NextArrow, arrowProps);
    }

    var verticalHeightStyle = null;

    if (this.props.vertical) {
      verticalHeightStyle = {
        height: this.state.listHeight
      };
    }

    var centerPaddingStyle = null;

    if (this.props.vertical === false) {
      if (this.props.centerMode === true) {
        centerPaddingStyle = {
          padding: '0px ' + this.props.centerPadding
        };
      }
    } else {
      if (this.props.centerMode === true) {
        centerPaddingStyle = {
          padding: this.props.centerPadding + ' 0px'
        };
      }
    }

    var listStyle = (0, _objectAssign2.default)({}, verticalHeightStyle, centerPaddingStyle);

    return _react2.default.createElement(
      'div',
      {
        className: className,
        onMouseEnter: this.onInnerSliderEnter,
        onMouseLeave: this.onInnerSliderLeave,
        onMouseOver: this.onInnerSliderOver
      },
      prevArrow,
      _react2.default.createElement(
        'div',
        {
          ref: this.listRefHandler,
          className: 'slick-list',
          style: listStyle,
          onMouseDown: this.swipeStart,
          onMouseMove: this.state.dragging ? this.swipeMove : null,
          onMouseUp: this.swipeEnd,
          onMouseLeave: this.state.dragging ? this.swipeEnd : null,
          onTouchStart: this.swipeStart,
          onTouchMove: this.state.dragging ? this.swipeMove : null,
          onTouchEnd: this.swipeEnd,
          onTouchCancel: this.state.dragging ? this.swipeEnd : null,
          onKeyDown: this.props.accessibility ? this.keyHandler : null },
        _react2.default.createElement(
          track.Track,
          _extends({ ref: this.trackRefHandler }, trackProps),
          this.props.children
        )
      ),
      nextArrow,
      dots$1
    );
  }
});
});

unwrapExports(innerSlider);
var innerSlider_1 = innerSlider.InnerSlider;

var camel2hyphen = function (str) {
  return str
          .replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
          })
          .toLowerCase();
};

var camel2hyphen_1 = camel2hyphen;

var isDimension = function (feature) {
  var re = /[height|width]$/;
  return re.test(feature);
};

var obj2mq = function (obj) {
  var mq = '';
  var features = Object.keys(obj);
  features.forEach(function (feature, index) {
    var value = obj[feature];
    feature = camel2hyphen_1(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length-1) {
      mq += ' and ';
    }
  });
  return mq;
};

var json2mq = function (query) {
  var mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length-1) {
        mq += ', ';
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
};

var json2mq_1 = json2mq;

var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

var canUseDom = canUseDOM;

/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
    this.options = options;
    !options.deferSetup && this.setup();
}

QueryHandler.prototype = {

    constructor : QueryHandler,

    /**
     * coordinates setup of the handler
     *
     * @function
     */
    setup : function() {
        if(this.options.setup) {
            this.options.setup();
        }
        this.initialised = true;
    },

    /**
     * coordinates setup and triggering of the handler
     *
     * @function
     */
    on : function() {
        !this.initialised && this.setup();
        this.options.match && this.options.match();
    },

    /**
     * coordinates the unmatch event for the handler
     *
     * @function
     */
    off : function() {
        this.options.unmatch && this.options.unmatch();
    },

    /**
     * called when a handler is to be destroyed.
     * delegates to the destroy or unmatch callbacks, depending on availability.
     *
     * @function
     */
    destroy : function() {
        this.options.destroy ? this.options.destroy() : this.off();
    },

    /**
     * determines equality by reference.
     * if object is supplied compare options, if function, compare match callback
     *
     * @function
     * @param {object || function} [target] the target for comparison
     */
    equals : function(target) {
        return this.options === target || this.options.match === target;
    }

};

var QueryHandler_1 = QueryHandler;

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection, fn) {
    var i      = 0,
        length = collection.length,
        cont;

    for(i; i < length; i++) {
        cont = fn(collection[i], i);
        if(cont === false) {
            break; //allow early exit
        }
    }
}

/**
 * Helper function for determining whether target object is an array
 *
 * @param target the object under test
 * @return {Boolean} true if array, false otherwise
 */
function isArray$1(target) {
    return Object.prototype.toString.apply(target) === '[object Array]';
}

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
function isFunction$1(target) {
    return typeof target === 'function';
}

var Util = {
    isFunction : isFunction$1,
    isArray : isArray$1,
    each : each
};

var each$1 = Util.each;

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @constructor
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 */
function MediaQuery(query, isUnconditional) {
    this.query = query;
    this.isUnconditional = isUnconditional;
    this.handlers = [];
    this.mql = window.matchMedia(query);

    var self = this;
    this.listener = function(mql) {
        // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
        self.mql = mql.currentTarget || mql;
        self.assess();
    };
    this.mql.addListener(this.listener);
}

MediaQuery.prototype = {

    constuctor : MediaQuery,

    /**
     * add a handler for this query, triggering if already active
     *
     * @param {object} handler
     * @param {function} handler.match callback for when query is activated
     * @param {function} [handler.unmatch] callback for when query is deactivated
     * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
     */
    addHandler : function(handler) {
        var qh = new QueryHandler_1(handler);
        this.handlers.push(qh);

        this.matches() && qh.on();
    },

    /**
     * removes the given handler from the collection, and calls it's destroy methods
     *
     * @param {object || function} handler the handler to remove
     */
    removeHandler : function(handler) {
        var handlers = this.handlers;
        each$1(handlers, function(h, i) {
            if(h.equals(handler)) {
                h.destroy();
                return !handlers.splice(i,1); //remove from array and exit each early
            }
        });
    },

    /**
     * Determine whether the media query should be considered a match
     *
     * @return {Boolean} true if media query can be considered a match, false otherwise
     */
    matches : function() {
        return this.mql.matches || this.isUnconditional;
    },

    /**
     * Clears all handlers and unbinds events
     */
    clear : function() {
        each$1(this.handlers, function(handler) {
            handler.destroy();
        });
        this.mql.removeListener(this.listener);
        this.handlers.length = 0; //clear array
    },

    /*
        * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
        */
    assess : function() {
        var action = this.matches() ? 'on' : 'off';

        each$1(this.handlers, function(handler) {
            handler[action]();
        });
    }
};

var MediaQuery_1 = MediaQuery;

var each$2 = Util.each;
var isFunction$2 = Util.isFunction;
var isArray$2 = Util.isArray;

/**
 * Allows for registration of query handlers.
 * Manages the query handler's state and is responsible for wiring up browser events
 *
 * @constructor
 */
function MediaQueryDispatch () {
    if(!window.matchMedia) {
        throw new Error('matchMedia not present, legacy browsers require a polyfill');
    }

    this.queries = {};
    this.browserIsIncapable = !window.matchMedia('only all').matches;
}

MediaQueryDispatch.prototype = {

    constructor : MediaQueryDispatch,

    /**
     * Registers a handler for the given media query
     *
     * @param {string} q the media query
     * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
     * @param {function} options.match fired when query matched
     * @param {function} [options.unmatch] fired when a query is no longer matched
     * @param {function} [options.setup] fired when handler first triggered
     * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
     * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
     */
    register : function(q, options, shouldDegrade) {
        var queries         = this.queries,
            isUnconditional = shouldDegrade && this.browserIsIncapable;

        if(!queries[q]) {
            queries[q] = new MediaQuery_1(q, isUnconditional);
        }

        //normalise to object in an array
        if(isFunction$2(options)) {
            options = { match : options };
        }
        if(!isArray$2(options)) {
            options = [options];
        }
        each$2(options, function(handler) {
            if (isFunction$2(handler)) {
                handler = { match : handler };
            }
            queries[q].addHandler(handler);
        });

        return this;
    },

    /**
     * unregisters a query and all it's handlers, or a specific handler for a query
     *
     * @param {string} q the media query to target
     * @param {object || function} [handler] specific handler to unregister
     */
    unregister : function(q, handler) {
        var query = this.queries[q];

        if(query) {
            if(handler) {
                query.removeHandler(handler);
            }
            else {
                query.clear();
                delete this.queries[q];
            }
        }

        return this;
    }
};

var MediaQueryDispatch_1 = MediaQueryDispatch;

var src = new MediaQueryDispatch_1();

var slider = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React__default);





var _objectAssign2 = _interopRequireDefault(objectAssign);



var _json2mq2 = _interopRequireDefault(json2mq_1);



var _defaultProps2 = _interopRequireDefault(defaultProps_1);



var _canUseDom2 = _interopRequireDefault(canUseDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var enquire = _canUseDom2.default && src;

var Slider = function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      breakpoint: null
    };
    _this._responsiveMediaHandlers = [];
    _this.innerSliderRefHandler = _this.innerSliderRefHandler.bind(_this);
    return _this;
  }

  Slider.prototype.innerSliderRefHandler = function innerSliderRefHandler(ref) {
    this.innerSlider = ref;
  };

  Slider.prototype.media = function media(query, handler) {
    // javascript handler for  css media query
    enquire.register(query, handler);
    this._responsiveMediaHandlers.push({ query: query, handler: handler });
  };

  Slider.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    if (this.props.responsive) {
      var breakpoints = this.props.responsive.map(function (breakpt) {
        return breakpt.breakpoint;
      });
      // sort them in increasing order of their numerical value
      breakpoints.sort(function (x, y) {
        return x - y;
      });

      breakpoints.forEach(function (breakpoint, index) {
        // media query for each breakpoint
        var bQuery;
        if (index === 0) {
          bQuery = (0, _json2mq2.default)({ minWidth: 0, maxWidth: breakpoint });
        } else {
          bQuery = (0, _json2mq2.default)({ minWidth: breakpoints[index - 1], maxWidth: breakpoint });
        }
        // when not using server side rendering
        _canUseDom2.default && _this2.media(bQuery, function () {
          _this2.setState({ breakpoint: breakpoint });
        });
      });

      // Register media query for full screen. Need to support resize from small to large
      // convert javascript object to media query string
      var query = (0, _json2mq2.default)({ minWidth: breakpoints.slice(-1)[0] });

      _canUseDom2.default && this.media(query, function () {
        _this2.setState({ breakpoint: null });
      });
    }
  };

  Slider.prototype.componentWillUnmount = function componentWillUnmount() {
    this._responsiveMediaHandlers.forEach(function (obj) {
      enquire.unregister(obj.query, obj.handler);
    });
  };

  Slider.prototype.slickPrev = function slickPrev() {
    this.innerSlider.slickPrev();
  };

  Slider.prototype.slickNext = function slickNext() {
    this.innerSlider.slickNext();
  };

  Slider.prototype.slickGoTo = function slickGoTo(slide) {
    this.innerSlider.slickGoTo(slide);
  };

  Slider.prototype.slickPause = function slickPause() {
    this.innerSlider.pause();
  };

  Slider.prototype.slickPlay = function slickPlay() {
    this.innerSlider.autoPlay();
  };

  Slider.prototype.render = function render() {
    var _this3 = this;

    var settings;
    var newProps;
    if (this.state.breakpoint) {
      // never executes in the first render
      // so defaultProps should be already there in this.props
      newProps = this.props.responsive.filter(function (resp) {
        return resp.breakpoint === _this3.state.breakpoint;
      });
      settings = newProps[0].settings === 'unslick' ? 'unslick' : (0, _objectAssign2.default)({}, _defaultProps2.default, this.props, newProps[0].settings);
    } else {
      settings = (0, _objectAssign2.default)({}, _defaultProps2.default, this.props);
    }

    // force scrolling by one if centerMode is on
    if (settings.centerMode) {
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToScroll should be equal to 1 in centerMode, you are using ' + settings.slidesToScroll);
      }
      settings.slidesToScroll = 1;
    }
    // force showing one slide and scrolling by one if the fade mode is on
    if (settings.fade) {
      if (settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToShow should be equal to 1 when fade is true, you\'re using ' + settings.slidesToShow);
      }
      if (settings.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn('slidesToScroll should be equal to 1 when fade is true, you\'re using ' + settings.slidesToScroll);
      }
      settings.slidesToShow = 1;
      settings.slidesToScroll = 1;
    }

    // makes sure that children is an array, even when there is only 1 child
    var children = _react2.default.Children.toArray(this.props.children);

    // Children may contain false or null, so we should filter them
    // children may also contain string filled with spaces (in certain cases where we use jsx strings)
    children = children.filter(function (child) {
      if (typeof child === 'string') {
        return !!child.trim();
      }
      return !!child;
    });

    if (settings === 'unslick') {
      // if 'unslick' responsive breakpoint setting used, just return the <Slider> tag nested HTML
      return _react2.default.createElement(
        'div',
        { className: this.props.className + ' unslicked' },
        children
      );
    } else {
      return _react2.default.createElement(
        innerSlider.InnerSlider,
        _extends({ ref: this.innerSliderRefHandler }, settings),
        children
      );
    }
  };

  return Slider;
}(_react2.default.Component);

exports.default = Slider;
});

unwrapExports(slider);

var lib = slider;

var styles$4 = (function (_ref, _ref2) {
  var styles = _ref.styles;
  var rhythm = _ref2.rhythm;
  return {
    root: merge_1({
      // Base
      '& .slick-slider': {
        position: 'relative',
        display: 'block',
        height: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        touchAction: 'pan-y',
        paddingTop: rhythm(2),
        paddingBottom: rhythm(2)
      },
      '& .slick-list': {
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        height: '100%',
        margin: 0,
        padding: 0,
        transform: 'translate3d(0, 0, 0)'
      },
      '& .slick-list :focus': {
        outline: 'none'
      },
      '& .slick-list .dragging': {
        cursor: 'grab'
      },
      '& .slick-track': {
        display: 'block',
        position: 'relative',
        top: 0,
        left: 0,
        height: '100%',
        transform: 'translate3d(0, 0, 0)'
      },
      '& .slick-track:after': {
        content: '""',
        display: 'table',
        clear: 'both'
      },
      '& .slick-loading .slick-track': {
        visibility: 'hidden'
      },
      '& .slick-slide': {
        display: 'none',
        "float": 'left',
        height: '100%',
        minHeight: '1px',
        textAlign: 'center'
      },
      '& .slick-slide img': {
        display: 'block'
      },
      '&[dir="rtl"] .slick-slide': {
        "float": 'right'
      },
      '& .slick-slide.slick-loading img': {
        display: 'none'
      },
      '& .slick-slide.dragging img': {
        pointerEvents: 'none'
      },
      '& .slick-initialized .slick-slide': {
        display: 'block'
      },
      '& .slick-loading .slick-slide': {
        visibility: 'hidden'
      },
      '& .slick-vertical .slick-slide': {
        display: 'block',
        height: 'auto',
        border: '1px solid transparent'
      },
      '& .slick-arrow.slick-hidden': {
        display: 'none'
      },
      // Arrows
      '& .slick-arrow': {
        position: 'absolute',
        top: '50%',
        padding: 0,
        width: '20px',
        height: '20px',
        lineHeight: '1rem',
        fontSize: rhythm(0.6667),
        textAlign: 'center',
        marginTop: '-10px',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        cursor: 'pointer',
        opacity: 0.5,
        zIndex: 2
      },
      '& .slick-arrow:hover': {
        outline: 'none',
        opacity: 1
      },
      '& .slick-arrow:focus': {
        outline: 'none',
        opacity: 1
      },
      '& .slick-prev': {
        left: '1rem'
      },
      '& .slick-next': {
        right: '1rem'
      },
      // Dots
      '& .slick-dots': {
        display: 'block',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        textAlign: 'center'
      },
      '& .slick-dots li': {
        position: 'relative',
        display: 'inline-block',
        width: '20px',
        height: '20px',
        padding: 0,
        cursor: 'pointer'
      },
      '& .slick-dots button': {
        display: 'block',
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        color: 'transparent',
        border: 0,
        outline: 'none',
        background: 'transparent'
      },
      '& .slick-dots button:before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '8px',
        height: '8px',
        margin: '-4px',
        opacity: 0.25,
        borderRadius: '50%',
        background: 'black'
      },
      '& .slick-dots button:hover': {
        outline: 'none'
      },
      '& .slick-dots button:hover:before': {
        opacity: 1
      },
      '& .slick-dots button:focus': {
        outline: 'none'
      },
      '& .slick-dots button:focus:before': {
        opacity: 1
      },
      '& .slick-dots li.slick-active button:before': {
        opacity: 0.75,
        color: 'black'
      }
    }, styles)
  };
});

var styles$5 = (function (_ref, _ref2) {
  var disabled = _ref.disabled,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm;
  return {
    root: merge_1({
      width: rhythm(2),
      textAlign: 'center',
      opacity: disabled ? '0.2 !important' : 1,
      pointerEvents: disabled ? 'none' : 'all'
    }, styles)
  };
});

var labels = {
  prev: 'Previous',
  next: 'Next'
};

var PaginationLink = function PaginationLink(_ref) {
  var classNames = _ref.classNames,
      currentSlide = _ref.currentSlide,
      direction = _ref.direction,
      disabled = _ref.disabled,
      icon = _ref.icon,
      onClick = _ref.onClick,
      size = _ref.size,
      slideCount = _ref.slideCount,
      styles = _ref.styles,
      props = _objectWithoutProperties(_ref, ["classNames", "currentSlide", "direction", "disabled", "icon", "onClick", "size", "slideCount", "styles"]);

  return React__default.createElement("button", _extends({
    "aria-label": labels[direction],
    type: "button",
    role: "button",
    disabled: disabled,
    onClick: onClick,
    onKeyDown: onClick,
    className: "c11n-pagination-link ".concat(classNames.root)
  }, props), React__default.createElement(Icon$1, {
    name: icon,
    rotate: direction === 'prev' ? 180 : 0,
    size: size
  }));
};

PaginationLink.propTypes = {
  /**
   * The current slide if in a Carousel
   */
  currentSlide: propTypes.number,

  /**
   * The direction of the arrow
   */
  direction: propTypes.oneOf(['prev', 'next']).isRequired,

  /**
   * Whether or not the link is disabled
   */
  disabled: propTypes.bool,

  /**
   * The name of the icon e.g. chevron, heart etc.
   */
  icon: propTypes.string,

  /**
   * onClick handler
   */
  onClick: propTypes.func,

  /**
   * The icon size
   */
  size: propTypes.number,

  /**
   * The total number of slides if in a Carousel
   */
  slideCount: propTypes.number
};
PaginationLink.defaultProps = {
  direction: 'next',
  icon: 'chevron',
  size: 1
};
var PaginationLink$1 = withStyles(styles$5)(PaginationLink);

var Carousel = function Carousel(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames,
      props = _objectWithoutProperties(_ref, ["children", "classNames"]);

  var propsWhitelist = ['children', 'styles', 'accessibility', 'adaptiveHeight', 'afterChange', 'arrows', 'autoplay', 'autoplaySpeed', 'beforeChange', 'centerMode', 'dots', 'dotsClass', 'draggable', 'easing', 'fade', 'focusOnSelect', 'infinite', 'initialSlide', 'lazyLoad', 'nextArrow', 'pauseOnHover', 'prevArrow', 'responsive', 'rtl', 'slickGoTo', 'slide', 'slidesToScroll', 'slidesToShow', 'speed', 'swipe', 'swipeToSlide', 'touchMove', 'touchThreshold', 'useCSS', 'variableWidth', 'vertical'];
  var allowedProps = pick_1(props, propsWhitelist);
  return React__default.createElement("div", {
    className: "c11n-carousel ".concat(classNames.root)
  }, React__default.createElement(lib, _extends({
    prevArrow: React__default.createElement(PaginationLink$1, {
      direction: "prev"
    }),
    nextArrow: React__default.createElement(PaginationLink$1, {
      direction: "next"
    })
  }, allowedProps), children));
};

Carousel.propTypes = {
  /**
   * The content of the Carousel
   */
  children: propTypes.any.isRequired,

  /**
   * Custom styles be applied { carousel }
   */
  styles: propTypes.object,

  /**
   * Slick slider settings
   */
  accessibility: propTypes.bool,
  adaptiveHeight: propTypes.bool,
  afterChange: propTypes.func,
  arrows: propTypes.bool,
  autoplay: propTypes.bool,
  autoplaySpeed: propTypes.number,
  beforeChange: propTypes.func,
  centerMode: propTypes.bool,
  dots: propTypes.bool,
  dotsClass: propTypes.string,
  draggable: propTypes.bool,
  easing: propTypes.string,
  fade: propTypes.bool,
  focusOnSelect: propTypes.bool,
  infinite: propTypes.bool,
  initialSlide: propTypes.number,
  lazyLoad: propTypes.bool,
  nextArrow: propTypes.element,
  pauseOnHover: propTypes.bool,
  prevArrow: propTypes.element,
  responsive: propTypes.array,
  rtl: propTypes.bool,
  slickGoTo: propTypes.func,
  slide: propTypes.string,
  slidesToScroll: propTypes.number,
  slidesToShow: propTypes.number,
  speed: propTypes.number,
  swipe: propTypes.bool,
  swipeToSlide: propTypes.bool,
  touchMove: propTypes.bool,
  touchThreshold: propTypes.number,
  useCSS: propTypes.bool,
  variableWidth: propTypes.bool,
  vertical: propTypes.bool
};
Carousel.defaultProps = {
  arrows: true,
  dots: false,
  autoplay: false,
  styles: {}
};
var index$2 = compose(withStyles(styles$4))(Carousel);

var index$3 = (function (props) {
  console.log('The CarouselArrow component has been moved to the more reusable PaginationLink component. Support for importing from `constructicon/carousel-arrow` will be removed in version 2');
  return React__default.createElement(PaginationLink$1, props);
});

var styles$6 = (function (_ref, _ref2) {
  var shadow = _ref.shadow,
      background = _ref.background,
      foreground = _ref.foreground,
      outerColor = _ref.outerColor,
      width = _ref.width,
      spacing = _ref.spacing,
      fullHeight = _ref.fullHeight,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing,
      colors = _ref2.colors,
      rhythm = _ref2.rhythm,
      shadows = _ref2.shadows,
      treatments = _ref2.treatments;
  var defaultStyles = {
    root: _objectSpread2({
      maxWidth: width ? rhythm(width) : treatments.container.maxWidth,
      minHeight: fullHeight && '100vh',
      margin: '0 auto'
    }, calculateSpacing(spacing), {
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground]
    }, treatments.body, {
      boxShadow: shadow && shadows[shadow]
    }),
    outer: {
      backgroundColor: outerColor && colors[outerColor]
    }
  };
  return merge_1(defaultStyles, styles);
});

var Container = function Container(_ref) {
  var children = _ref.children,
      Tag = _ref.tag,
      classNames = _ref.classNames;

  if (!children) {
    return null;
  }

  return React__default.createElement("div", {
    className: "c11n-container-wrapper ".concat(classNames.outer)
  }, React__default.createElement(Tag, {
    className: "c11n-container ".concat(classNames.root)
  }, children));
};

Container.propTypes = {
  /**
   * The content
   */
  children: propTypes.any,

  /**
   * The tag or component to be used e.g. div, section
   */
  tag: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * The max width of the container to be passed into our rhythm
   */
  width: propTypes.number,

  /**
   * The internal padding to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * Sets the min-height to the height of the viewport
   */
  fullHeight: propTypes.bool,

  /**
   * The shadow to be applies to the container
   */
  shadow: propTypes.string,

  /**
   * The background color of the container
   */
  background: propTypes.string,

  /**
   * The foreground color of the area
   */
  foreground: propTypes.string,

  /**
   * The color of the area outside the container
   */
  outerColor: propTypes.string,

  /**
   * The custom styles to be applied to the container
   */
  styles: propTypes.object
};
Container.defaultProps = {
  tag: 'article',
  spacing: 0,
  styles: {}
};
var index$4 = withStyles(styles$6)(Container);

var styles$7 = (function (_ref, _ref2) {
  var background = _ref.background,
      foreground = _ref.foreground,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      colors = _ref2.colors;
  var defaultStyles = {
    root: {
      position: 'relative',
      marginBottom: rhythm(0.5),
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground]
    },
    icon: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },
    input: {
      display: 'block',
      width: '100%',
      height: rhythm(2),
      paddingLeft: rhythm(1.5),
      borderBottom: "1px solid ".concat(colors.shade, " !important")
    }
  };
  return merge_1(defaultStyles, styles);
});

var Filter =
/*#__PURE__*/
function (_Component) {
  _inherits(Filter, _Component);

  function Filter() {
    _classCallCheck(this, Filter);

    return _possibleConstructorReturn(this, _getPrototypeOf(Filter).apply(this, arguments));
  }

  _createClass(Filter, [{
    key: "onChange",
    value: function onChange() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          debounce = _this$props.debounce;

      if (onChange) {
        if (debounce) {
          return this.debounce(onChange);
        } else {
          return this.noDebounce(onChange);
        }
      }
    }
  }, {
    key: "debounce",
    value: function debounce(callback) {
      var _this = this;

      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var timeout;
      return function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          var val = _this.refs.field.value;
          callback(val);
        }, delay);
      };
    }
  }, {
    key: "noDebounce",
    value: function noDebounce(callback) {
      var _this2 = this;

      return function () {
        var val = _this2.refs.field.value;
        callback(val);
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          placeholder = _this$props2.placeholder,
          classNames = _this$props2.classNames,
          onSubmit = _this$props2.onSubmit,
          styles = _this$props2.styles;
      return React__default.createElement("form", {
        action: "/",
        onSubmit: onSubmit,
        className: "c11n-filter ".concat(classNames.root)
      }, React__default.createElement(Icon$1, {
        name: "search",
        size: 1.25,
        styles: styles.icon
      }), React__default.createElement("input", {
        ref: "field",
        type: "search",
        "aria-label": placeholder,
        placeholder: placeholder,
        onChange: this.onChange(),
        autoComplete: "off",
        className: classNames.input
      }));
    }
  }]);

  return Filter;
}(React.Component);

Filter.propTypes = {
  /**
   * The onChange event handler to be fired
   */
  onChange: propTypes.func.isRequired,

  /**
   * The onSubmit event handler
   */
  onSubmit: propTypes.func,

  /**
   * The placeholder for the input
   */
  placeholder: propTypes.string,

  /**
   * The background color for the leaderboard
   */
  background: propTypes.string,

  /**
   * The foreground color for the leaderboard
   */
  foreground: propTypes.string,

  /**
   * Custom styles for the component
   */
  styles: propTypes.object,

  /**
   * Whether or not to debounce the onChange callback
   */
  debounce: propTypes.bool
};
Filter.defaultProps = {
  placeholder: 'Filter results',
  styles: {},
  debounce: true,
  onSubmit: function onSubmit(e) {
    return e.preventDefault();
  }
};
var index$5 = withStyles(styles$7)(Filter);

var styles$8 = (function (_ref, _ref2) {
  var background = _ref.background,
      font = _ref.font,
      foreground = _ref.foreground,
      image = _ref.image,
      size = _ref.size,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      colors = _ref2.colors,
      treatments = _ref2.treatments,
      calculateSpacing = _ref2.calculateSpacing,
      justifyContent = _ref2.justifyContent;
  var defaultStyles = {
    root: {
      display: 'block',
      position: 'relative',
      perspective: '1000px',
      WebkitPerspective: '1000px',
      textAlign: 'center',
      width: '100%',
      paddingBottom: '100%',
      '&:hover > div:first-child': {
        transform: 'rotateY(180deg)'
      },
      '&:hover > div:last-child': {
        transform: 'rotateY(0)'
      }
    },
    wrapper: _objectSpread2({
      backfaceVisibility: 'hidden',
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      padding: rhythm(1),
      height: '100%',
      width: '100%',
      transition: '0.5s ease-out',
      transformStyle: 'preserve-3d',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center'
    }, justifyContent('center'), {
      textAlign: 'center',
      backgroundColor: colors[background],
      color: colors[foreground],
      fontSize: scale(size)
    }, calculateSpacing(spacing), {}, treatments[font]),
    front: {
      transform: 'rotateY(0)',
      visibility: 'visible',
      zIndex: 1,
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        background: image && "url(".concat(image, ")")
      }
    },
    back: {
      transform: 'rotateY(-180deg)'
    }
  };
  return merge_1(defaultStyles, styles);
});

var Flippy = function Flippy(_ref) {
  var front = _ref.front,
      back = _ref.back,
      color = _ref.color,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-flippy ".concat(classNames.root)
  }, React__default.createElement("div", {
    className: "".concat(classNames.wrapper, " ").concat(classNames.front)
  }, front), React__default.createElement("div", {
    className: "".concat(classNames.wrapper, " ").concat(classNames.back)
  }, back));
};

Flippy.propTypes = {
  /**
   * Content to appear by default
   */
  front: propTypes.node.isRequired,

  /**
   * Content to appear on hover
   */
  back: propTypes.node.isRequired,

  /**
   * The background color
   */
  background: propTypes.string,

  /**
   * The color of the text
   */
  foreground: propTypes.string,

  /**
   * The font for the text
   */
  font: propTypes.string,

  /**
   * The scale to be used for the font size
   */
  size: propTypes.number,

  /**
   * The spacing to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
Flippy.defaultProps = {
  background: 'primary',
  foreground: 'light',
  font: 'body',
  size: 2,
  spacing: {
    x: 1,
    y: 1
  },
  styles: {}
};
var index$6 = withStyles(styles$8)(Flippy);

var styles$9 = (function (props, traits, keyframes) {
  var isDisabled = props.isDisabled,
      isLoading = props.isLoading,
      styles = props.styles;
  var colors = traits.colors,
      radiuses = traits.radiuses,
      rhythm = traits.rhythm,
      treatments = traits.treatments;
  var isInactive = isDisabled || isLoading;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'block',
      margin: 'auto',
      paddingBottom: rhythm(1.5)
    }, treatments.form),
    fields: {
      opacity: isLoading && 0.3,
      pointerEvents: isLoading && 'none'
    },
    error: _objectSpread2({
      margin: rhythm([1, 0]),
      padding: rhythm([0.5, 0.75]),
      backgroundColor: colors.danger,
      fontWeight: 'bold',
      color: colors.light,
      borderRadius: rhythm(radiuses.small)
    }, treatments.formError, {
      '& p + p': {
        marginTop: rhythm(0.666)
      },
      '& a': {
        color: colors.tertiary
      }
    }),
    action: _objectSpread2({
      backgroundColor: colors.transparent,
      color: colors.primary
    }, treatments.formAction),
    submit: _objectSpread2({
      opacity: isInactive ? '0.3 !important' : 0.85,
      paddingLeft: rhythm(1.25),
      paddingRight: rhythm(1.25),
      transition: 'all 250ms ease',
      '&:focus': {
        opacity: isInactive ? '0.3 !important' : 1,
        boxShadow: "0 0 15px 1px rgba(0, 0, 0, 0.25)"
      },
      '&:active': {
        opacity: isInactive ? '0.3 !important' : 1,
        boxShadow: "inset 0 0 15px 1px rgba(0, 0, 0, 0.25)"
      },
      '&:hover': {
        opacity: isInactive ? '0.3 !important' : 1,
        cursor: isInactive ? 'default' : 'pointer',
        pointerEvents: isInactive ? 'none' : 'all'
      },
      '&:after': {
        content: '""',
        display: isLoading ? 'inline-block' : 'none',
        width: rhythm(0.75),
        height: rhythm(0.75),
        marginLeft: rhythm(0.5),
        marginRight: rhythm(-0.5),
        borderRadius: '50%',
        border: '2px solid transparent',
        borderRightColor: colors.light,
        textIndent: '-9999px',
        overflow: 'hidden',
        animation: "".concat(keyframes.spin, " 1s linear infinite")
      }
    }, treatments.formSubmit),
    icon: {
      display: isLoading && 'none'
    }
  };
  return merge_1(defaultStyles, styles);
});
var keyframes$2 = {
  spin: {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
};

var Form = function Form(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames,
      _ref$errors = _ref.errors,
      errors = _ref$errors === void 0 ? [] : _ref$errors,
      footer = _ref.footer,
      icon = _ref.icon,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      noValidate = _ref.noValidate,
      styles = _ref.styles,
      _ref$submit = _ref.submit,
      submit = _ref$submit === void 0 ? 'Submit' : _ref$submit,
      _ref$actions = _ref.actions,
      actions = _ref$actions === void 0 ? [] : _ref$actions,
      onSubmit = _ref.onSubmit,
      submitProps = _ref.submitProps,
      props = _objectWithoutProperties(_ref, ["children", "classNames", "errors", "footer", "icon", "isLoading", "isDisabled", "noValidate", "styles", "submit", "actions", "onSubmit", "submitProps"]);

  var renderIcon = function renderIcon(icon) {
    return _typeof(icon) === 'object' ? React__default.createElement(Icon$1, _extends({
      styles: styles.icon
    }, icon)) : React__default.createElement(Icon$1, {
      styles: styles.icon,
      name: icon
    });
  };

  return React__default.createElement("form", _extends({
    className: "c11n-form ".concat(classNames.root),
    action: "/",
    method: "POST",
    onSubmit: onSubmit,
    noValidate: noValidate
  }, props), React__default.createElement("div", {
    className: classNames.fields
  }, children), errors.map(function (error, i) {
    return React__default.createElement("div", {
      className: "".concat(classNames.error, " ").concat(error.status && classNames[error.status]),
      key: i
    }, error.field ? "Field ".concat(error.field, " ") : '', error.message);
  }), actions.length ? React__default.createElement(ButtonGroup$1, {
    styles: styles.actions
  }, submit && React__default.createElement(Button$1, {
    styles: styles.submit,
    disabled: isLoading || isDisabled,
    "aria-label": submit,
    title: submit,
    type: "submit"
  }, React__default.createElement("span", null, submit), icon && renderIcon(icon)), actions.map(function (_ref2, i) {
    var label = _ref2.label,
        icon = _ref2.icon,
        actionProps = _objectWithoutProperties(_ref2, ["label", "icon"]);

    return React__default.createElement(Button$1, _extends({
      key: i,
      tag: "a",
      styles: styles.action,
      disabled: isLoading || isDisabled,
      "aria-label": label,
      title: submit
    }, actionProps), React__default.createElement("span", null, label), icon && renderIcon(icon));
  })) : submit ? React__default.createElement(Button$1, _extends({
    block: true,
    styles: styles.submit,
    disabled: isLoading || isDisabled,
    "aria-label": submit,
    title: submit,
    type: "submit"
  }, submitProps), React__default.createElement("span", null, submit), icon && renderIcon(icon)) : null, footer);
};

Form.propTypes = {
  /**
   * Errors to be displayed
   */
  errors: propTypes.array,

  /**
   * The form inputs and content
   */
  children: propTypes.any,

  /**
   * Additional form actions to be displayed
   */
  actions: propTypes.array,

  /**
   * Disable form inputs
   */
  isDisabled: propTypes.bool,

  /**
   * Show loading animation / disable form inputs
   */
  isLoading: propTypes.bool,

  /**
   * The submit handler that will fire once the form is submitted
   */
  onSubmit: propTypes.func.isRequired,

  /**
   * The label for the submit button
   */
  submit: propTypes.string,

  /**
   * The name of the icon to add, an object of to pass to the Icon component, or false to hide
   */
  icon: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.bool]),

  /**
   * Props to spread over the submit Button
   */
  submitProps: propTypes.object
};
Form.defaultProps = {
  submit: 'Submit',
  icon: {
    name: 'chevron',
    size: 0.75
  }
};
var index$7 = withStyles(styles$9, keyframes$2)(Form);

var styles$a = (function (_ref, _ref2) {
  var align = _ref.align,
      direction = _ref.direction,
      justify = _ref.justify,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing,
      justifyContent = _ref2.justifyContent;
  return {
    root: merge_1(_objectSpread2({
      display: 'flex',
      minWidth: '100%',
      flexWrap: 'wrap',
      alignItems: align,
      direction: direction
    }, justifyContent(justify), {}, calculateSpacing(spacing, 'margin', {
      multiplier: -1
    }), {
      '& > *': _objectSpread2({}, calculateSpacing(spacing, 'padding')),
      '& > *:empty': {
        padding: 0
      }
    }), styles)
  };
});

var Grid = function Grid(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-grid ".concat(classNames.root)
  }, children);
};

Grid.propTypes = {
  /**
   * Single or array of GridColumn children
   */
  children: propTypes.any,

  /**
   * Flexbox align option
   */
  align: propTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch']),

  /**
   * Flexbox justify content options
   */
  justify: propTypes.oneOf(['flex-start', 'flex-end', 'space-between', 'space-around', 'center']),

  /**
   * Direction of the columns
   */
  direction: propTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),

  /**
   * The spacing to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * Custom styles to apply
   */
  styles: propTypes.object
};
Grid.defaultProps = {
  align: 'flex-start',
  justify: 'space-between',
  direction: 'row',
  spacing: 0,
  styles: {}
};
var index$8 = withStyles(styles$a)(Grid);

var styles$b = (function (_ref, _ref2) {
  var _objectSpread2$1;

  var xs = _ref.xs,
      sm = _ref.sm,
      md = _ref.md,
      lg = _ref.lg,
      xsAlign = _ref.xsAlign,
      smAlign = _ref.smAlign,
      mdAlign = _ref.mdAlign,
      lgAlign = _ref.lgAlign,
      background = _ref.background,
      borderColor = _ref.borderColor,
      borderWidth = _ref.borderWidth,
      foreground = _ref.foreground,
      radius = _ref.radius,
      styles = _ref.styles;
  var colors = _ref2.colors,
      mediaQuery = _ref2.mediaQuery,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm;

  var calculateSize = function calculateSize(cols) {
    return cols ? {
      flex: "1 0 ".concat(100 / 12 * cols, "%"),
      maxWidth: "".concat(100 / 12 * cols, "%")
    } : {};
  };

  return {
    root: merge_1(_objectSpread2({
      backgroundColor: colors[background],
      color: colors[foreground],
      border: borderWidth && "".concat(borderWidth, "px solid ").concat(colors[borderColor]),
      borderRadius: radius && rhythm(radiuses[radius]),
      textAlign: xsAlign
    }, calculateSize(xs), (_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, mediaQuery('sm'), _objectSpread2({
      textAlign: smAlign
    }, calculateSize(sm))), _defineProperty(_objectSpread2$1, mediaQuery('md'), _objectSpread2({
      textAlign: mdAlign
    }, calculateSize(md))), _defineProperty(_objectSpread2$1, mediaQuery('lg'), _objectSpread2({
      textAlign: lgAlign
    }, calculateSize(lg))), _objectSpread2$1)), styles)
  };
});

var GridColumn = function GridColumn(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-grid-column ".concat(classNames.root)
  }, children);
};

GridColumn.propTypes = {
  /**
   * The content for the column
   */
  children: propTypes.any,

  /**
   * The default size of the column in a 12 column grid
   */
  xs: propTypes.number,

  /**
   * The size of the column in a 12 column grid at the `sm` breakpoint
   */
  sm: propTypes.number,

  /**
   * The size of the column in a 12 column grid at the `md` breakpoint
   */
  md: propTypes.number,

  /**
   * The size of the column in a 12 column grid at the `lg` breakpoint
   */
  lg: propTypes.number,

  /**
   * The default alignment
   */
  xsAlign: propTypes.oneOf(['left', 'center', 'right']),

  /**
   * The alignment at the `sm` breakpoint
   */
  smAlign: propTypes.oneOf(['left', 'center', 'right']),

  /**
   * The alignment at the `md` breakpoint
   */
  mdAlign: propTypes.oneOf(['left', 'center', 'right']),

  /**
   * The alignment at the `lg` breakpoint
   */
  lgAlign: propTypes.oneOf(['left', 'center', 'right']),

  /**
   * The background color of the section -
   */
  background: propTypes.string,

  /**
   * The color of the text -
   */
  foreground: propTypes.string,

  /**
   * The color of the border
   */
  borderColor: propTypes.string,

  /**
   * The width of the border
   */
  borderWidth: propTypes.number,

  /**
   * The radius of the section -
   */
  radius: propTypes.string,

  /**
   * The custom styles to be applied
   */
  styles: propTypes.object
};
GridColumn.defaultProps = {
  xs: 12,
  borderColor: 'shade',
  styles: {}
};
var index$9 = withStyles(styles$b)(GridColumn);

var styles$c = (function (_ref, _ref2) {
  var color = _ref.color,
      size = _ref.size,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing,
      colors = _ref2.colors,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  return {
    root: merge_1(_objectSpread2({}, treatments.head, {}, calculateSpacing(spacing, 'margin'), {
      fontSize: scale(size),
      color: color && colors[color]
    }), styles)
  };
});

var Heading = function Heading(_ref) {
  var children = _ref.children,
      Tag = _ref.tag,
      id = _ref.id,
      classNames = _ref.classNames;

  if (!children) {
    return null;
  }

  return React__default.createElement(Tag, {
    id: id,
    className: "c11n-heading ".concat(classNames.root)
  }, children);
};

Heading.propTypes = {
  /**
   * The html to be structured
   */
  children: propTypes.any,

  /**
   * The tag to be used for the containing element
   */
  tag: propTypes.string,

  /**
   * The ID attribute be added to the element (useful for navigation)
   */
  id: propTypes.string,

  /**
   * The theme color to be used for the heading
   */
  color: propTypes.string,

  /**
   * The size of the heading (using the font scale)
   */
  size: propTypes.number,

  /**
   * Disable the bottom margin of the heading
   */
  spacing: propTypes.oneOfType([propTypes.number, propTypes.object]),

  /**
   * Custom styles to be added to the element
   */
  styles: propTypes.object
};
Heading.defaultProps = {
  tag: 'h2',
  size: 3,
  spacing: {
    b: 0.5
  },
  styles: {}
};
var index$a = withStyles(styles$c)(Heading);

var styles$d = (function (props, traits) {
  var maxHeight = props.maxHeight,
      maxWidth = props.maxWidth,
      styles = props.styles;
  var rhythm = traits.rhythm;
  return {
    root: _objectSpread2({
      display: 'block',
      maxHeight: maxHeight && rhythm(maxHeight),
      maxWidth: maxWidth && rhythm(maxWidth)
    }, styles)
  };
});

var Image = function Image(_ref) {
  var alt = _ref.alt,
      classNames = _ref.classNames,
      src = _ref.src;
  return React__default.createElement("img", {
    alt: alt,
    className: classNames.root,
    src: src
  });
};

Image.propTypes = {
  /**
   * The alt tag
   */
  alt: propTypes.string.isRequired,

  /**
   * The max height of the image (rhythm units)
   */
  maxHeight: propTypes.number,

  /**
   * The max width of the image (rhythm units)
   */
  maxWidth: propTypes.number,

  /**
   * The image src
   */
  src: propTypes.string.isRequired,

  /**
   * Custom styles to apply to the image
   */
  styles: propTypes.object
};
var index$b = withStyles(styles$d)(Image);

var moment = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     module.exports = factory() ;
}(commonjsGlobal, (function () {
    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate (y) {
        var date;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            var args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays (ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays :
            this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
        return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
            : (m) ? weekdays[m.day()] : weekdays;
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && ('object' !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = commonjsRequire;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    var MS_PER_SECOND = 1000;
    var MS_PER_MINUTE = 60 * MS_PER_SECOND;
    var MS_PER_HOUR = 60 * MS_PER_MINUTE;
    var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':   return months;
                case 'quarter': return months / 3;
                case 'year':    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asQuarters     = makeAs('Q');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asQuarters     = asQuarters;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.24.0';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));
});

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax$1 = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

var _baseRange = baseRange;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && _isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite_1(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite_1(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite_1(step);
    return _baseRange(start, end, step, fromRight);
  };
}

var _createRange = createRange;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = _createRange();

var range_1 = range;

var styles$e = (function (_ref, _ref2) {
  var _ref$spacing = _ref.spacing,
      spacing = _ref$spacing === void 0 ? 0.5 : _ref$spacing,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      colors = _ref2.colors,
      fonts = _ref2.fonts,
      measures = _ref2.measures;
  var baseStyles = {
    root: {
      display: 'block',
      position: 'relative',
      fontFamily: fonts.body,
      textAlign: 'left',
      marginBottom: rhythm(1)
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'nowrap',
      marginLeft: rhythm(-spacing)
    },
    input: {
      root: {
        flex: 'auto',
        marginBottom: 0,
        marginLeft: rhythm(spacing)
      },
      field: {
        textAlign: 'center'
      },
      label: {
        display: 'none'
      }
    }
  };
  return merge_1(baseStyles, styles);
});

var isBoolean = function isBoolean(type) {
  return ['radio', 'checkbox'].indexOf(type) > -1;
};

var styles$f = (function (_ref, _ref2) {
  var label = _ref.label,
      type = _ref.type,
      touched = _ref.touched,
      invalid = _ref.invalid,
      readOnly = _ref.readOnly,
      styles = _ref.styles;
  var colors = _ref2.colors,
      fonts = _ref2.fonts,
      measures = _ref2.measures,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  var checkbox = isBoolean(type);
  var textarea = type === 'textarea';
  var isInvalid = touched && invalid;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'block',
      position: 'relative',
      paddingLeft: checkbox ? rhythm(1) : '0',
      fontFamily: fonts.body,
      textAlign: 'left',
      marginBottom: rhythm(1)
    }, treatments.inputRoot),
    field: checkbox ? {
      position: 'absolute',
      top: rhythm(0.125),
      left: 0
    } : _objectSpread2({
      display: 'block',
      width: '100%',
      textAlign: 'left',
      backgroundColor: colors.light,
      color: readOnly ? colors.lightGrey : colors.dark,
      padding: rhythm([0.125, 0.333]),
      height: textarea ? 'auto' : rhythm(1.666),
      minHeight: textarea && rhythm(4),
      maxHeight: textarea && rhythm(10),
      border: "thin solid ".concat(isInvalid ? colors.danger : colors.lightGrey),
      boxShadow: isInvalid ? "0 0 5px ".concat(colors.danger) : 'none',
      borderRadius: rhythm(radiuses.small)
    }, treatments.input, {
      '&:focus': {
        borderColor: isInvalid ? colors.danger : colors.secondary,
        boxShadow: "0 0 5px ".concat(isInvalid ? colors.danger : colors.secondary)
      }
    }),
    status: {
      position: 'absolute',
      top: label ? rhythm(1.633) : rhythm(0.5),
      right: rhythm(0.5),
      pointerEvents: 'none'
    }
  };
  return merge_1(defaultStyles, styles);
});

var styles$g = (function (_ref, _ref2) {
  var styles = _ref.styles;
  var colors = _ref2.colors,
      scale = _ref2.scale,
      rhythm = _ref2.rhythm,
      treatments = _ref2.treatments;
  var defaultStyles = {
    root: _objectSpread2({
      fontSize: scale(-0.75),
      fontWeight: 700,
      color: colors.danger
    }, treatments.inputValidations),
    error: _objectSpread2({
      marginTop: rhythm(0.5)
    }, treatments.inputValidation)
  };
  return merge_1(defaultStyles, styles);
});

var InputValidations = function InputValidations(_ref) {
  var classNames = _ref.classNames,
      _ref$validations = _ref.validations,
      validations = _ref$validations === void 0 ? [] : _ref$validations;
  return React__default.createElement("div", {
    className: "c11n-input-validations ".concat(classNames.root)
  }, validations.map(function (error, i) {
    return React__default.createElement("div", {
      className: classNames.error,
      key: i
    }, error);
  }));
};

InputValidations.propTypes = {
  /**
   * An array of input validations
   */
  validations: propTypes.array,

  /**
   *
   */
  styles: propTypes.object
};
InputValidations.defaultProps = {};
var InputValidations$1 = withStyles(styles$g)(InputValidations);

var styles$h = (function (_ref, _ref2) {
  var styles = _ref.styles;
  var colors = _ref2.colors,
      measures = _ref2.measures,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'block',
      fontWeight: 700,
      fontSize: scale(-0.5),
      lineHeight: measures.medium,
      textAlign: 'left',
      marginBottom: rhythm(0.25)
    }, treatments.label, {
      '& a': {
        color: colors.primary,
        textDecoration: 'underline'
      }
    }),
    required: {
      display: 'inline-block',
      color: colors.danger,
      cursor: 'help'
    }
  };
  return merge_1(defaultStyles, styles);
});

var Label = function Label(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames,
      id = _ref.id,
      inputId = _ref.inputId,
      required = _ref.required;
  return React__default.createElement("label", {
    className: "c11n-label ".concat(classNames.root),
    id: id,
    htmlFor: inputId
  }, children, required && React__default.createElement("span", {
    className: classNames.required,
    title: "Required field"
  }, "*"));
};

Label.propTypes = {
  /**
   * The label
   */
  children: propTypes.any,

  /**
   * The id of the label
   */
  id: propTypes.string,

  /**
   * The id of the related input
   */
  inputId: propTypes.string,

  /**
   * Whether the field is required
   */
  required: propTypes.bool
};
Label.defaultProps = {};
var Label$1 = withStyles(styles$h)(Label);

var InputField = function InputField(_ref) {
  var classNames = _ref.classNames,
      error = _ref.error,
      id = _ref.id,
      label = _ref.label,
      name = _ref.name,
      required = _ref.required,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'text' : _ref$type,
      _onBlur = _ref.onBlur,
      _onChange = _ref.onChange,
      _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      status = _ref.status,
      validations = _ref.validations,
      value = _ref.value,
      props = _objectWithoutProperties(_ref, ["classNames", "error", "id", "label", "name", "required", "type", "onBlur", "onChange", "styles", "status", "validations", "value"]);

  var propsBlacklist = ['children', 'dirty', 'initial', 'invalid', 'styles', 'touched', 'validators'];
  var allowedProps = omit_1(props, propsBlacklist);
  var Tag = type === 'textarea' ? 'textarea' : 'input';
  var inputId = id || name;
  var labelId = "label-".concat(inputId);

  var renderField = function renderField() {
    return React__default.createElement(Tag, _extends({
      className: classNames.field,
      type: type,
      name: name,
      id: inputId,
      value: value,
      checked: isBoolean(type) && value,
      onChange: function onChange(e) {
        return _onChange && _onChange(isBoolean(type) ? e.target.checked : e.target.value);
      },
      onBlur: function onBlur(e) {
        return _onBlur && _onBlur(isBoolean(type) ? e.target.checked : e.target.value);
      },
      required: required,
      "aria-labelledby": labelId
    }, allowedProps));
  };

  var renderStatus = function renderStatus() {
    switch (status) {
      case 'fetching':
        return React__default.createElement(Icon$1, {
          styles: styles.status,
          name: "loading",
          spin: true,
          color: "grey"
        });

      case 'fetched':
        return React__default.createElement(Icon$1, {
          styles: styles.status,
          name: "check",
          color: "success"
        });

      case 'failed':
        return React__default.createElement(Icon$1, {
          styles: styles.status,
          name: "warning",
          color: "danger"
        });

      default:
        return null;
    }
  };

  return React__default.createElement("div", {
    className: "c11n-input-field ".concat(classNames.root)
  }, label && React__default.createElement(Label$1, {
    id: labelId,
    inputId: inputId,
    required: required,
    styles: {
      root: styles.label,
      required: styles.required
    }
  }, label), renderField(), status && renderStatus(), error && React__default.createElement(InputValidations$1, {
    styles: {
      root: styles.error
    },
    validations: validations
  }));
};

InputField.propTypes = {
  /**
   * The label for the field
   */
  label: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * Whether to display validation errors
   */
  error: propTypes.bool,

  /**
   * The name of the field
   */
  name: propTypes.string.isRequired,

  /**
   * The current value
   */
  value: propTypes.oneOfType([propTypes.array, propTypes.bool, propTypes.number, propTypes.object, propTypes.string]),

  /**
   * The change handler that will receive the updated value as it's only param
   */
  onChange: propTypes.func.isRequired,

  /**
   * The blur handler that will receive the updated value as it's only param
   */
  onBlur: propTypes.func,

  /**
   * The type of field
   */
  type: propTypes.oneOf(['checkbox', 'color', 'date', 'email', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'textarea', 'time', 'url', 'week']),

  /**
   * The placeholder for the field
   */
  placeholder: propTypes.oneOfType([propTypes.string, propTypes.number]),

  /**
   * The ID for the field
   */
  id: propTypes.string,

  /**
   * Mark the field as required and displays an asterisk next to the label
   */
  required: propTypes.bool,

  /**
   * Validation errors
   */
  validations: propTypes.array,
  styles: propTypes.object
};
InputField.defaultProps = {
  type: 'text'
};
var InputField$1 = withStyles(styles$f)(InputField);

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = _baseIteratee(iteratee);

  _baseForOwn(object, function(value, key, object) {
    _baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

var mapKeys_1 = mapKeys;

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

var _arrayAggregator = arrayAggregator;

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  _baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

var _baseAggregator = baseAggregator;

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayAggregator : _baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, _baseIteratee(iteratee), accumulator);
  };
}

var _createAggregator = createAggregator;

/** Used for built-in method references. */
var objectProto$h = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$f = objectProto$h.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = _createAggregator(function(result, value, key) {
  if (hasOwnProperty$f.call(result, key)) {
    result[key].push(value);
  } else {
    _baseAssignValue(result, key, [value]);
  }
});

var groupBy_1 = groupBy;

var styles$i = (function (_ref, _ref2) {
  var invalid = _ref.invalid,
      touched = _ref.touched,
      readOnly = _ref.readOnly,
      styles = _ref.styles;
  var colors = _ref2.colors,
      fonts = _ref2.fonts,
      measures = _ref2.measures,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  var isInvalid = touched && invalid;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'block',
      position: 'relative',
      fontFamily: fonts.body,
      textAlign: 'left',
      marginBottom: rhythm(1)
    }, treatments.inputRoot),
    wrapper: {
      position: 'relative',
      '& select::-ms-expand': {
        display: 'none'
      },
      '& select::-ms-value': {
        background: 'none',
        color: readOnly ? colors.lightGrey : colors.dark
      },
      '& select:-moz-focusring': {
        color: 'transparent',
        textShadow: '0 0 0 #000'
      }
    },
    input: _objectSpread2({
      display: 'block',
      position: 'relative',
      zIndex: 1,
      width: '100%',
      textAlign: 'left',
      height: rhythm(1.666),
      lineHeight: rhythm(1.666),
      paddingLeft: rhythm(0.5),
      paddingRight: rhythm(1.25),
      color: readOnly ? colors.lightGrey : colors.dark,
      border: 0,
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      boxShadow: 'none',
      appearance: 'none',
      outline: 'none',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }, treatments.input, {
      '&:focus': {
        border: 0,
        outline: 0
      },
      '&:focus + span': {
        borderColor: isInvalid ? colors.danger : colors.secondary,
        boxShadow: "0 0 5px ".concat(isInvalid ? colors.danger : colors.secondary)
      }
    }),
    field: _objectSpread2({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      backgroundColor: colors.light,
      border: "thin solid ".concat(isInvalid ? colors.danger : colors.lightGrey),
      boxShadow: isInvalid && "0 0 5px ".concat(colors.danger),
      borderRadius: rhythm(radiuses.small)
    }, treatments.input),
    icon: {
      position: 'absolute',
      top: '50%',
      right: rhythm(0.333),
      transform: 'translateY(-50%)'
    }
  };
  return merge_1(defaultStyles, styles);
});

var InputSelect = function InputSelect(_ref) {
  var classNames = _ref.classNames,
      error = _ref.error,
      groupOptions = _ref.groupOptions,
      id = _ref.id,
      label = _ref.label,
      name = _ref.name,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      _onBlur = _ref.onBlur,
      _onChange = _ref.onChange,
      placeholder = _ref.placeholder,
      required = _ref.required,
      _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      validations = _ref.validations,
      value = _ref.value,
      props = _objectWithoutProperties(_ref, ["classNames", "error", "groupOptions", "id", "label", "name", "options", "onBlur", "onChange", "placeholder", "required", "styles", "validations", "value"]);

  var propsBlacklist = ['children', 'dirty', 'initial', 'invalid', 'styles', 'touched', 'validators'];
  var allowedProps = omit_1(props, propsBlacklist);
  var inputId = id || name;
  var labelId = "label-".concat(inputId);

  var renderOptions = function renderOptions() {
    if (groupOptions) {
      var groupedOptions = groupBy_1(options, 'group');
      var resultOptions = [];
      mapKeys_1(groupedOptions, function (opts, groupLabel) {
        if (groupLabel !== 'undefined') {
          resultOptions.push(React__default.createElement("optgroup", {
            key: groupLabel,
            label: groupLabel
          }, opts.map(function (_ref2, index) {
            var value = _ref2.value,
                label = _ref2.label,
                disabled = _ref2.disabled;
            return React__default.createElement("option", {
              value: value,
              key: index,
              disabled: disabled
            }, label);
          })));
        } else {
          resultOptions.push(opts.map(function (_ref3, index) {
            var value = _ref3.value,
                label = _ref3.label,
                disabled = _ref3.disabled;
            return React__default.createElement("option", {
              value: value,
              key: index,
              disabled: disabled
            }, label);
          }));
        }
      });
      return resultOptions;
    } else {
      return options.map(function (_ref4, index) {
        var value = _ref4.value,
            label = _ref4.label,
            disabled = _ref4.disabled;
        return React__default.createElement("option", {
          value: value,
          key: index,
          disabled: disabled
        }, label);
      });
    }
  };

  return React__default.createElement("div", {
    className: "c11n-input-select ".concat(classNames.root)
  }, label && React__default.createElement(Label$1, {
    id: labelId,
    inputId: inputId,
    required: required,
    styles: {
      root: styles.label,
      required: styles.required
    }
  }, label), React__default.createElement("div", {
    className: classNames.wrapper
  }, React__default.createElement("select", _extends({
    name: name,
    id: inputId,
    value: value,
    placeholder: placeholder,
    onChange: function onChange(e) {
      return _onChange && _onChange(e.target.value);
    },
    onBlur: function onBlur(e) {
      return _onBlur && _onBlur(e.target.value);
    },
    className: classNames.input,
    required: true,
    "aria-labelledby": labelId
  }, allowedProps), placeholder && React__default.createElement("option", {
    disabled: true,
    value: ""
  }, placeholder), renderOptions()), React__default.createElement("span", {
    className: classNames.field,
    "aria-hidden": true
  }), React__default.createElement(Icon$1, {
    name: "dropdown",
    size: 0.75,
    styles: styles.icon
  })), error && React__default.createElement(InputValidations$1, {
    styles: {
      root: styles.error
    },
    validations: validations
  }));
};

InputSelect.propTypes = {
  /**
   * The label for the field
   */
  label: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * The name of the field
   */
  name: propTypes.string.isRequired,

  /**
   * The ID of the field
   */
  id: propTypes.string,

  /**
   * The current value
   */
  value: propTypes.string,

  /**
   * The available options i.e. [{ value, label }, { value, label }]
   */
  options: propTypes.array.isRequired,

  /**
   * Group options by `group` param
   */
  groupOptions: propTypes.bool,

  /**
   * The change handler that will receive the updated value as it's only param
   */
  onChange: propTypes.func.isRequired,

  /**
   * The blur handler that will receive the updated value as it's only param
   */
  onBlur: propTypes.func,

  /**
   * The placeholder for the field
   */
  placeholder: propTypes.string,

  /**
   * Mark the field as required and displays an asterisk next to the label
   */
  required: propTypes.bool
};
var InputSelect$1 = withStyles(styles$i)(InputSelect);

var InputDate =
/*#__PURE__*/
function (_Component) {
  _inherits(InputDate, _Component);

  function InputDate(props) {
    var _this;

    _classCallCheck(this, InputDate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputDate).call(this, props));
    _this.updateDay = _this.updateDay.bind(_assertThisInitialized(_this));
    _this.updateMonth = _this.updateMonth.bind(_assertThisInitialized(_this));
    _this.updateYear = _this.updateYear.bind(_assertThisInitialized(_this));
    _this.updateDate = _this.updateDate.bind(_assertThisInitialized(_this));
    _this.state = {
      touched: !!props.value,
      showSelects: props.showSelects,
      value: props.value,
      date: props.value ? moment(props.value) : moment()
    };
    return _this;
  }

  _createClass(InputDate, [{
    key: "testDateInput",
    value: function testDateInput() {
      try {
        var test = document.createElement('input');
        test.type = 'date';
        return test.type === 'text';
      } catch (error) {
        return true;
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.testDateInput()) this.setState({
        showSelects: true
      });
    }
  }, {
    key: "updateDay",
    value: function updateDay(day) {
      var date = this.state.date.date(day);
      this.updateDate(date);
    }
  }, {
    key: "updateMonth",
    value: function updateMonth(month) {
      var date = this.state.date.month(month);
      this.updateDate(date);
    }
  }, {
    key: "updateYear",
    value: function updateYear(year) {
      var date = this.state.date.year(year);
      this.updateDate(date);
    }
  }, {
    key: "updateDate",
    value: function updateDate(moment) {
      this.setState({
        date: moment,
        touched: true
      });
      this.props.onChange(moment.format('YYYY-MM-DD'));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$required = _this$props.required,
          required = _this$props$required === void 0 ? false : _this$props$required,
          classNames = _this$props.classNames,
          error = _this$props.error,
          id = _this$props.id,
          label = _this$props.label,
          name = _this$props.name,
          _this$props$styles = _this$props.styles,
          styles = _this$props$styles === void 0 ? {} : _this$props$styles,
          validations = _this$props.validations;
      var _this$state = this.state,
          showSelects = _this$state.showSelects,
          touched = _this$state.touched,
          _this$state$date = _this$state.date,
          date = _this$state$date === void 0 ? moment() : _this$state$date;
      var labelId = "label-".concat(id || name);
      var allowedProps = pick_1(this.props, ['disabled', 'placeholder', 'required']);
      var months = [{
        label: 'January',
        value: 0
      }, {
        label: 'February',
        value: 1
      }, {
        label: 'March',
        value: 2
      }, {
        label: 'April',
        value: 3
      }, {
        label: 'May',
        value: 4
      }, {
        label: 'June',
        value: 5
      }, {
        label: 'July',
        value: 6
      }, {
        label: 'August',
        value: 7
      }, {
        label: 'September',
        value: 8
      }, {
        label: 'October',
        value: 9
      }, {
        label: 'November',
        value: 10
      }, {
        label: 'December',
        value: 11
      }];
      var daysInMonth = date.daysInMonth() || 31;

      var mapValues = function mapValues(array) {
        return array.map(function (value) {
          return {
            label: value,
            value: value
          };
        });
      };

      return showSelects ? React__default.createElement("div", {
        className: "c11n-input-date ".concat(classNames.root),
        id: id
      }, label && React__default.createElement(Label$1, {
        id: labelId,
        required: required,
        styles: {
          root: styles.label,
          required: styles.required
        }
      }, label), React__default.createElement("div", {
        className: classNames.wrapper
      }, React__default.createElement(InputSelect$1, _extends({}, allowedProps, {
        styles: styles.input,
        value: touched ? date.date().toString() : '',
        onChange: this.updateDay,
        onBlur: this.updateDay,
        label: "Day",
        name: "".concat(name, "-day"),
        "aria-labelledby": labelId,
        options: [{
          label: 'Day',
          value: '',
          disabled: true
        }].concat(_toConsumableArray(mapValues(range_1(1, daysInMonth + 1))))
      })), React__default.createElement(InputSelect$1, _extends({}, allowedProps, {
        styles: styles.input,
        value: touched ? date.month().toString() : '',
        onChange: this.updateMonth,
        onBlur: this.updateMonth,
        label: "Month",
        name: "".concat(name, "-month"),
        "aria-labelledby": labelId,
        options: [{
          label: 'Month',
          value: '',
          disabled: true
        }].concat(months)
      })), React__default.createElement(InputSelect$1, _extends({}, allowedProps, {
        styles: styles.input,
        value: touched ? date.year().toString() : '',
        onChange: this.updateYear,
        onBlur: this.updateYear,
        label: "Year",
        name: "".concat(name, "-year"),
        "aria-labelledby": labelId,
        options: [{
          label: 'Year',
          value: '',
          disabled: true
        }].concat(_toConsumableArray(mapValues(range_1(1900, parseInt(moment().year() + 1)))))
      }))), error && React__default.createElement(InputValidations$1, {
        styles: {
          root: styles.error
        },
        validations: validations
      })) : React__default.createElement(InputField$1, _extends({
        type: "date"
      }, this.props));
    }
  }]);

  return InputDate;
}(React.Component);

var index$c = withStyles(styles$e)(InputDate);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutProperties$1(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/**
 * Check whether some DOM node is our Component's node.
 */
function isNodeFound(current, componentNode, ignoreClass) {
  if (current === componentNode) {
    return true;
  } // SVG <use/> elements do not technically reside in the rendered DOM, so
  // they do not have classList directly, but they offer a link to their
  // corresponding element, which can have classList. This extra check is for
  // that case.
  // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
  // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17


  if (current.correspondingElement) {
    return current.correspondingElement.classList.contains(ignoreClass);
  }

  return current.classList.contains(ignoreClass);
}
/**
 * Try to find our node in a hierarchy of nodes, returning the document
 * node as highest node if our node is not found in the path up.
 */

function findHighest(current, componentNode, ignoreClass) {
  if (current === componentNode) {
    return true;
  } // If source=local then this event came from 'somewhere'
  // inside and should be ignored. We could handle this with
  // a layered approach, too, but that requires going back to
  // thinking in terms of Dom node nesting, running counter
  // to React's 'you shouldn't care about the DOM' philosophy.


  while (current.parentNode) {
    if (isNodeFound(current, componentNode, ignoreClass)) {
      return true;
    }

    current = current.parentNode;
  }

  return current;
}
/**
 * Check if the browser scrollbar was clicked
 */

function clickedScrollbar(evt) {
  return document.documentElement.clientWidth <= evt.clientX || document.documentElement.clientHeight <= evt.clientY;
}

// ideally will get replaced with external dep
// when rafrex/detect-passive-events#4 and rafrex/detect-passive-events#5 get merged in
var testPassiveEventSupport = function testPassiveEventSupport() {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return;
  }

  var passive = false;
  var options = Object.defineProperty({}, 'passive', {
    get: function get() {
      passive = true;
    }
  });

  var noop = function noop() {};

  window.addEventListener('testPassiveEventSupport', noop, options);
  window.removeEventListener('testPassiveEventSupport', noop, options);
  return passive;
};

function autoInc(seed) {
  if (seed === void 0) {
    seed = 0;
  }

  return function () {
    return ++seed;
  };
}

var uid = autoInc();

var passiveEventSupport;
var handlersMap = {};
var enabledInstances = {};
var touchEvents = ['touchstart', 'touchmove'];
var IGNORE_CLASS_NAME = 'ignore-react-onclickoutside';
/**
 * Options for addEventHandler and removeEventHandler
 */

function getEventHandlerOptions(instance, eventName) {
  var handlerOptions = null;
  var isTouchEvent = touchEvents.indexOf(eventName) !== -1;

  if (isTouchEvent && passiveEventSupport) {
    handlerOptions = {
      passive: !instance.props.preventDefault
    };
  }

  return handlerOptions;
}
/**
 * This function generates the HOC function that you'll use
 * in order to impart onOutsideClick listening to an
 * arbitrary component. It gets called at the end of the
 * bootstrapping code to yield an instance of the
 * onClickOutsideHOC function defined inside setupHOC().
 */


function onClickOutsideHOC(WrappedComponent, config) {
  var _class, _temp;

  var componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(onClickOutside, _Component);

    function onClickOutside(props) {
      var _this;

      _this = _Component.call(this, props) || this;

      _this.__outsideClickHandler = function (event) {
        if (typeof _this.__clickOutsideHandlerProp === 'function') {
          _this.__clickOutsideHandlerProp(event);

          return;
        }

        var instance = _this.getInstance();

        if (typeof instance.props.handleClickOutside === 'function') {
          instance.props.handleClickOutside(event);
          return;
        }

        if (typeof instance.handleClickOutside === 'function') {
          instance.handleClickOutside(event);
          return;
        }

        throw new Error("WrappedComponent: " + componentName + " lacks a handleClickOutside(event) function for processing outside click events.");
      };

      _this.__getComponentNode = function () {
        var instance = _this.getInstance();

        if (config && typeof config.setClickOutsideRef === 'function') {
          return config.setClickOutsideRef()(instance);
        }

        if (typeof instance.setClickOutsideRef === 'function') {
          return instance.setClickOutsideRef();
        }

        return reactDom.findDOMNode(instance);
      };

      _this.enableOnClickOutside = function () {
        if (typeof document === 'undefined' || enabledInstances[_this._uid]) {
          return;
        }

        if (typeof passiveEventSupport === 'undefined') {
          passiveEventSupport = testPassiveEventSupport();
        }

        enabledInstances[_this._uid] = true;
        var events = _this.props.eventTypes;

        if (!events.forEach) {
          events = [events];
        }

        handlersMap[_this._uid] = function (event) {
          if (_this.componentNode === null) return;

          if (_this.props.preventDefault) {
            event.preventDefault();
          }

          if (_this.props.stopPropagation) {
            event.stopPropagation();
          }

          if (_this.props.excludeScrollbar && clickedScrollbar(event)) return;
          var current = event.target;

          if (findHighest(current, _this.componentNode, _this.props.outsideClickIgnoreClass) !== document) {
            return;
          }

          _this.__outsideClickHandler(event);
        };

        events.forEach(function (eventName) {
          document.addEventListener(eventName, handlersMap[_this._uid], getEventHandlerOptions(_this, eventName));
        });
      };

      _this.disableOnClickOutside = function () {
        delete enabledInstances[_this._uid];
        var fn = handlersMap[_this._uid];

        if (fn && typeof document !== 'undefined') {
          var events = _this.props.eventTypes;

          if (!events.forEach) {
            events = [events];
          }

          events.forEach(function (eventName) {
            return document.removeEventListener(eventName, fn, getEventHandlerOptions(_this, eventName));
          });
          delete handlersMap[_this._uid];
        }
      };

      _this.getRef = function (ref) {
        return _this.instanceRef = ref;
      };

      _this._uid = uid();
      return _this;
    }
    /**
     * Access the WrappedComponent's instance.
     */


    var _proto = onClickOutside.prototype;

    _proto.getInstance = function getInstance() {
      if (!WrappedComponent.prototype.isReactComponent) {
        return this;
      }

      var ref = this.instanceRef;
      return ref.getInstance ? ref.getInstance() : ref;
    };

    /**
     * Add click listeners to the current document,
     * linked to this component's state.
     */
    _proto.componentDidMount = function componentDidMount() {
      // If we are in an environment without a DOM such
      // as shallow rendering or snapshots then we exit
      // early to prevent any unhandled errors being thrown.
      if (typeof document === 'undefined' || !document.createElement) {
        return;
      }

      var instance = this.getInstance();

      if (config && typeof config.handleClickOutside === 'function') {
        this.__clickOutsideHandlerProp = config.handleClickOutside(instance);

        if (typeof this.__clickOutsideHandlerProp !== 'function') {
          throw new Error("WrappedComponent: " + componentName + " lacks a function for processing outside click events specified by the handleClickOutside config option.");
        }
      }

      this.componentNode = this.__getComponentNode(); // return early so we dont initiate onClickOutside

      if (this.props.disableOnClickOutside) return;
      this.enableOnClickOutside();
    };

    _proto.componentDidUpdate = function componentDidUpdate() {
      this.componentNode = this.__getComponentNode();
    };
    /**
     * Remove all document's event listeners for this component
     */


    _proto.componentWillUnmount = function componentWillUnmount() {
      this.disableOnClickOutside();
    };
    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */


    /**
     * Pass-through render
     */
    _proto.render = function render() {
      // eslint-disable-next-line no-unused-vars
      var _props = this.props,
          excludeScrollbar = _props.excludeScrollbar,
          props = _objectWithoutProperties$1(_props, ["excludeScrollbar"]);

      if (WrappedComponent.prototype.isReactComponent) {
        props.ref = this.getRef;
      } else {
        props.wrappedRef = this.getRef;
      }

      props.disableOnClickOutside = this.disableOnClickOutside;
      props.enableOnClickOutside = this.enableOnClickOutside;
      return React.createElement(WrappedComponent, props);
    };

    return onClickOutside;
  }(React.Component), _class.displayName = "OnClickOutside(" + componentName + ")", _class.defaultProps = {
    eventTypes: ['mousedown', 'touchstart'],
    excludeScrollbar: config && config.excludeScrollbar || false,
    outsideClickIgnoreClass: IGNORE_CLASS_NAME,
    preventDefault: false,
    stopPropagation: false
  }, _class.getClass = function () {
    return WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent;
  }, _temp;
}

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$2 = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax$2(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

var styles$j = (function (_ref, _ref2) {
  var invalid = _ref.invalid,
      readOnly = _ref.readOnly,
      styles = _ref.styles,
      touched = _ref.touched,
      value = _ref.value;
  var colors = _ref2.colors,
      fonts = _ref2.fonts,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      shadows = _ref2.shadows,
      treatments = _ref2.treatments;
  var isInvalid = touched && invalid;
  var baseStyles = {
    root: _objectSpread2({
      display: 'block',
      position: 'relative',
      fontFamily: fonts.body,
      textAlign: 'left',
      marginBottom: rhythm(1)
    }, treatments.inputRoot),
    fieldWrapper: {
      position: 'relative'
    },
    field: _objectSpread2({
      display: 'block',
      width: '100%',
      textAlign: 'left',
      overflow: 'hidden',
      backgroundColor: colors.light,
      color: readOnly ? colors.lightGrey : colors.dark,
      padding: rhythm([0.125, 0.333]),
      paddingRight: rhythm(1.5),
      height: rhythm(1.666),
      border: "thin solid ".concat(isInvalid ? colors.danger : colors.lightGrey),
      boxShadow: isInvalid ? "0 0 5px ".concat(colors.danger) : 'none',
      borderRadius: rhythm(radiuses.small),
      textIndent: value && '-99999px'
    }, treatments.input, {
      '&:focus': {
        borderColor: isInvalid ? colors.danger : colors.secondary,
        boxShadow: "0 0 5px ".concat(isInvalid ? colors.danger : colors.secondary)
      }
    }),
    icon: {
      position: 'absolute',
      right: rhythm(0.5),
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: value && 'pointer'
    },
    selected: {
      position: 'absolute',
      left: rhythm(0.5),
      right: rhythm(1.5),
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer'
    },
    results: {
      position: 'absolute',
      zIndex: 6,
      maxHeight: rhythm(12),
      overflow: 'auto',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.light,
      color: colors.dark,
      boxShadow: shadows.light
    },
    status: {
      padding: rhythm(1),
      textAlign: 'center',
      fontSize: scale(-1),
      opacity: 0.5
    },
    showMore: {
      display: 'block',
      width: '100%',
      padding: rhythm(0.5),
      textAlign: 'center',
      fontSize: scale(-0.5),
      cursor: 'pointer',
      backgroundColor: colors.paleGrey,
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.light
      }
    }
  };
  return merge_1(baseStyles, styles);
});

/** `Object#toString` result references. */
var mapTag$6 = '[object Map]',
    setTag$6 = '[object Set]';

/** Used for built-in method references. */
var objectProto$i = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$g = objectProto$i.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_1(value) &&
      (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
    return !value.length;
  }
  var tag = _getTag(value);
  if (tag == mapTag$6 || tag == setTag$6) {
    return !value.size;
  }
  if (_isPrototype(value)) {
    return !_baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$g.call(value, key)) {
      return false;
    }
  }
  return true;
}

var isEmpty_1 = isEmpty;

var styles$k = (function (props, traits) {
  var styles = props.styles;
  var colors = traits.colors;
  return {
    root: _objectSpread2({
      cursor: 'pointer',
      borderTop: "1px solid ".concat(colors.shade),
      ':hover': {
        backgroundColor: colors.paleGrey
      }
    }, styles)
  };
});

var styles$l = (function (_ref, _ref2) {
  var background = _ref.background,
      borderColor = _ref.borderColor,
      borderWidth = _ref.borderWidth,
      foreground = _ref.foreground,
      margin = _ref.margin,
      radius = _ref.radius,
      spacing = _ref.spacing,
      styles = _ref.styles;
  var colors = _ref2.colors,
      radiuses = _ref2.radiuses,
      rhythm = _ref2.rhythm,
      calculateSpacing = _ref2.calculateSpacing;
  return {
    root: merge_1(_objectSpread2({}, calculateSpacing(spacing), {}, calculateSpacing(margin, 'margin'), {
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground],
      border: borderWidth && "".concat(borderWidth, "px solid ").concat(colors[borderColor]),
      borderRadius: radius && rhythm(radiuses[radius])
    }), styles)
  };
});

var Section = function Section(_ref) {
  var background = _ref.background,
      borderColor = _ref.borderColor,
      borderWidth = _ref.borderWidth,
      children = _ref.children,
      classNames = _ref.classNames,
      foreground = _ref.foreground,
      margin = _ref.margin,
      spacing = _ref.spacing,
      styles = _ref.styles,
      Tag = _ref.tag,
      props = _objectWithoutProperties(_ref, ["background", "borderColor", "borderWidth", "children", "classNames", "foreground", "margin", "spacing", "styles", "tag"]);

  if (!children) {
    return null;
  }

  return React__default.createElement(Tag, _extends({
    className: "c11n-section ".concat(classNames.root)
  }, props), children);
};

Section.propTypes = {
  /**
   * The content
   */
  children: propTypes.any,

  /**
   * The tag or component to be used e.g. div, section
   */
  tag: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * The background color of the section
   */
  background: propTypes.string,

  /**
   * The color of the text
   */
  foreground: propTypes.string,

  /**
   * The color of the border
   */
  borderColor: propTypes.string,

  /**
   * The width of the border
   */
  borderWidth: propTypes.number,

  /**
   * The radius of the section
   */
  radius: propTypes.string,

  /**
   * The spacing to be applied
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * The margin to be applied
   */
  margin: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * The custom styles to be applied to the section
   */
  styles: propTypes.object
};
Section.defaultProps = {
  tag: 'section',
  borderColor: 'shade',
  spacing: {
    x: 1,
    y: 1
  },
  margin: 0,
  styles: {}
};
var Section$1 = withStyles(styles$l)(Section);

var InputSearchResult = function InputSearchResult(_ref) {
  var children = _ref.children,
      isActive = _ref.isActive,
      spacing = _ref.spacing,
      styles = _ref.styles;
  return React__default.createElement(Section$1, {
    background: isActive ? 'shade' : 'light',
    spacing: spacing,
    styles: styles.root
  }, children);
};

InputSearchResult.propTypes = {
  /**
   * The contents of the search result
   */
  children: propTypes.any.isRequired,

  /**
   * Whether the item is the actively selected result
   */
  isActive: propTypes.bool,

  /**
   * The spacing to be applied to the result
   */
  spacing: propTypes.oneOfType([propTypes.number, propTypes.object]),

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
InputSearchResult.defaultProps = {
  spacing: {
    x: 1,
    y: 0.5
  }
};
var InputSearchResult$1 = withStyles(styles$k)(InputSearchResult);

var Results = function Results(_ref) {
  var active = _ref.active,
      children = _ref.children,
      classNames = _ref.classNames,
      emptyMessage = _ref.emptyMessage,
      errorMessage = _ref.errorMessage,
      _ref$ResultComponent = _ref.ResultComponent,
      ResultComponent = _ref$ResultComponent === void 0 ? DefaultResultComponent : _ref$ResultComponent,
      results = _ref.results,
      selectItem = _ref.selectItem,
      status = _ref.status,
      toShow = _ref.toShow;

  if (status === 'fetching') {
    return React__default.createElement("div", {
      className: classNames.status
    }, React__default.createElement(Icon$1, {
      name: "loading",
      spin: true
    }));
  }

  if (status === 'failed') {
    return React__default.createElement("div", {
      className: classNames.status
    }, React__default.createElement(Icon$1, {
      name: "warning"
    }), " ", errorMessage);
  }

  if (isEmpty_1(results)) {
    return React__default.createElement("div", {
      className: classNames.status
    }, React__default.createElement(Icon$1, {
      name: "warning"
    }), " ", emptyMessage);
  }

  return React__default.createElement("ol", {
    className: classNames.list
  }, results.slice(0, toShow).map(function (result, index) {
    return React__default.createElement("li", {
      key: index,
      onClick: function onClick() {
        return selectItem(index, true);
      }
    }, React__default.createElement(ResultComponent, {
      isActive: index === active,
      result: result
    }));
  }), children);
};

var DefaultResultComponent = function DefaultResultComponent(_ref2) {
  var isActive = _ref2.isActive,
      result = _ref2.result;
  return React__default.createElement(InputSearchResult$1, {
    isActive: isActive
  }, result.label);
};

var InputSearch =
/*#__PURE__*/
function (_Component) {
  _inherits(InputSearch, _Component);

  function InputSearch(props) {
    var _this;

    _classCallCheck(this, InputSearch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputSearch).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.showMore = _this.showMore.bind(_assertThisInitialized(_this));
    _this.clearSelection = _this.clearSelection.bind(_assertThisInitialized(_this));
    _this.setActiveItem = _this.setActiveItem.bind(_assertThisInitialized(_this));

    if (props.debounce) {
      _this.handleChange = debounce_1(_this.handleChange, props.debounce);
    }

    _this.state = {
      query: '',
      active: -1,
      toShow: props.limit
    };
    return _this;
  }

  _createClass(InputSearch, [{
    key: "handleChange",
    value: function handleChange(e) {
      var query = e.target.value;
      if (this.refs.results) this.refs.results.scrollTop = 0;
      this.setState({
        query: query
      }, this.sendQuery);
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          return this.setActiveItem(this.state.active - 1);

        case 'ArrowDown':
          e.preventDefault();
          return this.setActiveItem(this.state.active + 1);

        case 'Enter':
          e.preventDefault();
          return this.confirmSelection();

        case 'Escape':
          e.preventDefault();

          if (this.props.value) {
            return this.clearSelection();
          } else {
            return this.clearActive();
          }

        case 'Backspace':
          if (this.props.value) {
            e.preventDefault();
            return this.clearSelection();
          } else if (this.state.active !== -1) {
            e.preventDefault();
            return this.clearActive();
          } else {
            return null;
          }

        default:
          return null;
      }
    }
  }, {
    key: "handleClickOutside",
    value: function handleClickOutside() {
      this.props.closeOnClickOutside && this.clearActive();
    }
  }, {
    key: "sendQuery",
    value: function sendQuery(query) {
      this.props.onSearch(this.state.query);
    }
  }, {
    key: "setActiveItem",
    value: function setActiveItem(newIndex, selectItem) {
      var results = this.props.results;

      if (results.length) {
        var isLast = newIndex < 0;
        var isFirst = newIndex >= results.length;
        var active = isLast ? results.length - 1 : isFirst ? 0 : newIndex;
        var resultsEl = this.refs.results;
        var selectedEl = resultsEl.querySelector("[data-selected=\"".concat(active, "\"]"));
        resultsEl.scrollTop = selectedEl && selectedEl.offsetTop;
        this.setState({
          active: active
        }, selectItem && this.confirmSelection);
      }
    }
  }, {
    key: "confirmSelection",
    value: function confirmSelection() {
      var active = this.state.active;
      var _this$props = this.props,
          onChange = _this$props.onChange,
          results = _this$props.results;
      var selectedResult = results[active];
      onChange(selectedResult);
      this.clearActive();
    }
  }, {
    key: "clearActive",
    value: function clearActive() {
      this.setState({
        query: '',
        active: -1,
        toShow: this.props.limit
      });
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.props.onChange();
      this.refs.input.focus();
    }
  }, {
    key: "showMore",
    value: function showMore() {
      var toShow = this.state.toShow;
      var limit = this.props.limit;
      this.setState({
        toShow: toShow + limit
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          autoComplete = _this$props2.autoComplete,
          autoFocus = _this$props2.autoFocus,
          classNames = _this$props2.classNames,
          emptyMessage = _this$props2.emptyMessage,
          error = _this$props2.error,
          errorMessage = _this$props2.errorMessage,
          icon = _this$props2.icon,
          id = _this$props2.id,
          label = _this$props2.label,
          name = _this$props2.name,
          _onBlur = _this$props2.onBlur,
          placeholder = _this$props2.placeholder,
          readOnly = _this$props2.readOnly,
          required = _this$props2.required,
          ResultComponent = _this$props2.ResultComponent,
          results = _this$props2.results,
          showMore = _this$props2.showMore,
          status = _this$props2.status,
          styles = _this$props2.styles,
          type = _this$props2.type,
          validations = _this$props2.validations,
          value = _this$props2.value,
          valueFormatter = _this$props2.valueFormatter;
      var _this$state = this.state,
          active = _this$state.active,
          query = _this$state.query,
          toShow = _this$state.toShow;
      var inputId = id || name;
      var labelId = "label-".concat(inputId);
      return React__default.createElement("div", {
        className: "c11n-input-search ".concat(classNames.root),
        onKeyDown: this.handleKeyDown
      }, label && React__default.createElement(Label$1, {
        id: labelId,
        inputId: inputId,
        placeholder: placeholder,
        readOnly: readOnly,
        required: required,
        styles: {
          root: styles.label,
          required: styles.required
        }
      }, label), React__default.createElement("div", {
        className: classNames.fieldWrapper
      }, React__default.createElement("input", {
        "aria-labelledby": labelId,
        autoFocus: autoFocus,
        autoComplete: autoComplete,
        className: classNames.field,
        type: type,
        id: inputId,
        name: name,
        placeholder: placeholder,
        readOnly: readOnly || !!value,
        ref: "input",
        required: required,
        onChange: function onChange(e) {
          e.persist && e.persist();

          _this2.handleChange(e);
        },
        onBlur: function onBlur(e) {
          return _onBlur && _onBlur(e.target.value);
        }
      }), value ? React__default.createElement("div", {
        onClick: this.clearSelection
      }, React__default.createElement("div", {
        className: classNames.selected
      }, valueFormatter(value)), React__default.createElement("div", {
        className: classNames.icon
      }, React__default.createElement(Icon$1, {
        name: "close"
      }))) : icon && React__default.createElement("div", {
        className: classNames.icon
      }, React__default.createElement(Icon$1, {
        name: icon
      })), query && React__default.createElement("div", {
        className: classNames.results,
        ref: "results"
      }, React__default.createElement(Results, {
        active: active,
        classNames: classNames,
        emptyMessage: emptyMessage,
        errorMessage: errorMessage,
        ResultComponent: ResultComponent,
        results: results,
        selectItem: this.setActiveItem,
        status: status,
        toShow: toShow
      }, showMore && results.length > toShow && React__default.createElement("button", {
        type: "button",
        className: classNames.showMore,
        onClick: this.showMore
      }, React__default.createElement("span", null, "Load More"), ' ', React__default.createElement(Icon$1, {
        name: "chevron",
        rotate: 90,
        size: 0.75
      }))))), error && React__default.createElement(InputValidations$1, {
        styles: {
          root: styles.error
        },
        validations: validations
      }));
    }
  }]);

  return InputSearch;
}(React.Component);

InputSearch.propTypes = {
  /**
   * The length of time to debounce (false to disable debounce)
   */
  debounce: propTypes.oneOfType([propTypes.bool, propTypes.number]),

  /**
   * The message to display when no results are found
   */
  emptyMessage: propTypes.string,

  /**
   * The message to display when there is an error
   */
  errorMessage: propTypes.string,

  /**
   * If the field is in an error state
   */
  error: propTypes.bool,

  /**
   * The icon to display on the right of the field (false to hide)
   */
  icon: propTypes.oneOfType([propTypes.string, propTypes.bool]),

  /**
   * The ID of the input field
   */
  id: propTypes.string,

  /**
   * The label of the input field
   */
  label: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * The number of results to show
   */
  limit: propTypes.number,

  /**
   * The name of the input
   */
  name: propTypes.string,

  /**
   * The function to call when a user selects an item
   */
  onChange: propTypes.func,

  /**
   * The function to call when a user blurs the input
   */
  onBlur: propTypes.func,

  /**
   * The function to call when the search is altered
   */
  onSearch: propTypes.func.isRequired,

  /**
   * A component that is used to render each individual result
   */
  ResultComponent: propTypes.func,

  /**
   * The array of currently applicable results
   */
  results: propTypes.array,

  /**
   * Whether the field is required or not
   */
  required: propTypes.bool,

  /**
   * The currently selected value (useful if your values are objects with various keys e.g. id, label)
   */
  value: propTypes.any,

  /**
   * A function to format the value to display on the label
   */
  valueFormatter: propTypes.func,

  /**
   * Enables a Show More button
   */
  showMore: propTypes.bool,

  /**
   * The status of the searching
   */
  status: propTypes.oneOf(['fetching', 'fetched', 'failed']),

  /**
   * The type of the search input field
   */
  type: propTypes.string,

  /**
   * An array of validation messages to display
   */
  validations: propTypes.array,

  /**
   * The autocomplete value for the field
   */
  autoComplete: propTypes.string,

  /**
   * The autofocus value for the field
   */
  autoFocus: propTypes.bool,

  /**
   * The autofocus value for the field
   */
  closeOnClickOutside: propTypes.bool
};
InputSearch.defaultProps = {
  autoComplete: 'off',
  closeOnClickOutside: true,
  debounce: 500,
  emptyMessage: 'No results found',
  errorMessage: 'There was an unexpected error',
  icon: 'search',
  limit: 5,
  name: 'search',
  results: [],
  status: 'fetched',
  type: 'search',
  valueFormatter: function valueFormatter(value) {
    return value;
  }
};
var index$d = compose(withStyles(styles$j), onClickOutsideHOC)(InputSearch);

var styles$m = (function (_ref, _ref2) {
  var styles = _ref.styles,
      theme = _ref.theme,
      transition = _ref.transition,
      color = _ref.color;
  var colors = _ref2.colors;
  var backgroundColor = colors[color];
  return {
    root: merge_1({
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: backgroundColor,
      height: '20em',
      width: '20em'
    }, styles),
    overlay: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: transition,
      backgroundColor: backgroundColor
    }
  };
});

var styles$n = (function (_ref, _ref2, keyframes) {
  var color = _ref.color,
      size = _ref.size,
      duration = _ref.duration,
      styles = _ref.styles;
  var colors = _ref2.colors,
      rhythm = _ref2.rhythm;
  var dotSize = size / 2;
  var defaultStyles = {
    root: {
      display: 'inline-block',
      height: rhythm(dotSize),
      textAlign: 'center'
    },
    dot: {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
      margin: "auto ".concat(rhythm(dotSize / 3)),
      width: rhythm(dotSize),
      height: rhythm(dotSize),
      backgroundColor: colors[color],
      lineHeight: 0,
      borderRadius: '50%',
      transformOrigin: 'bottom',
      animation: "".concat(keyframes.dots, " infinite alternate"),
      animationDuration: "".concat(duration, "ms"),
      '&:nth-of-type(2)': {
        animationDelay: '200ms'
      },
      '&:nth-of-type(3)': {
        animationDelay: '400ms'
      }
    }
  };
  return merge_1(defaultStyles, styles);
});
var keyframes$3 = {
  dots: {
    '0%': {
      opacity: 0.1,
      transform: 'scale(0.75)'
    },
    '100%': {
      opacity: 0.9,
      transform: 'scale(1)'
    }
  }
};

var Loading = function Loading(_ref) {
  var classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-loading ".concat(classNames.root)
  }, React__default.createElement("span", {
    className: classNames.dot
  }), React__default.createElement("span", {
    className: classNames.dot
  }), React__default.createElement("span", {
    className: classNames.dot
  }));
};

Loading.propTypes = {
  /**
   * The color of the dots
   */
  color: propTypes.string,

  /**
   * The duration of the animation
   */
  duration: propTypes.number,

  /**
   * The size of the dots
   */
  size: propTypes.number,

  /**
   * Custom styles to be applied to the loading dots
   */
  styles: propTypes.object
};
Loading.defaultProps = {
  color: 'grey',
  duration: 550,
  size: 1,
  styles: {}
};
var Loading$1 = withStyles(styles$n, keyframes$3)(Loading);

/**
 * Render a colored square with a loading spinner in place of an image whilst it's being loaded.
 *
 * Useful to prevent a layout from breaking, flickering or changing size during a page load.
 */

var LazyImage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LazyImage, _React$Component);

  function LazyImage() {
    var _this;

    _classCallCheck(this, LazyImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LazyImage).call(this));
    _this.state = {
      status: 'waiting',
      hasEventListener: false
    };
    _this.handleScroll = _this.handleScroll.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LazyImage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var url = this.props.url;

      if (this.shouldLoadImage()) {
        this.loadImage(url);
      } else if (this.props.lazy) {
        window.addEventListener('scroll', this.handleScroll);
        this.setState({
          hasEventListener: true
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.hasEventListener) {
        window.removeEventListener('scroll', this.handleScroll);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var url = _ref.url,
          lazy = _ref.lazy;

      if (lazy !== this.props.lazy) {
        console.error('The lazy prop on <LazyImage /> should never change');
      } else if (url !== this.props.url) {
        this.setState({
          status: 'waiting'
        });

        if (this.shouldLoadImage()) {
          this.loadImage(url);
        }
      }
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      if (this.shouldLoadImage()) {
        this.loadImage(this.props.url);
      }
    }
  }, {
    key: "shouldLoadImage",
    value: function shouldLoadImage() {
      if (this.props.url) {
        if (this.state.status !== 'fetching' && this.state.status !== 'fetched') {
          if (this.props.lazy) {
            return this.isImageInViewport();
          } else {
            return true;
          }
        } else return false;
      } else return false;
    }
  }, {
    key: "loadImage",
    value: function loadImage(url) {
      var _this2 = this;

      this.setState({
        status: 'fetching'
      });
      var img = document.createElement('img');

      img.onload = function () {
        _this2.setState({
          status: 'fetched'
        });

        _this2.props.onLoad();
      };

      img.src = url;
    }
  }, {
    key: "isImageInViewport",
    value: function isImageInViewport() {
      if (!this.image) return false;
      var rect = this.image.getBoundingClientRect();
      return rect.bottom > 0 && rect.right > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.top < (window.innerHeight || document.documentElement.clientHeight);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          classNames = _this$props.classNames,
          url = _this$props.url,
          children = _this$props.children,
          loadingProps = _this$props.loadingProps;
      var status = this.state.status;
      var loaded = status === 'fetched';
      var spinner = children || React__default.createElement(Loading$1, loadingProps);
      return React__default.createElement("div", {
        ref: function ref(_ref2) {
          _this3.image = _ref2;
        },
        style: {
          backgroundImage: loaded ? "url('".concat(url, "')") : ''
        },
        className: "c11n-lazy-image ".concat(classNames.root)
      }, React__default.createElement("div", {
        className: classNames.overlay,
        style: {
          opacity: loaded ? 0 : 1
        }
      }, !loaded && spinner));
    }
  }]);

  return LazyImage;
}(React__default.Component);

LazyImage.propTypes = {
  /**
   * Url of the image to be loaded and displayed
   */
  url: propTypes.string,

  /**
   * If image loading should be delayed until image has entered the viewport
   */
  lazy: propTypes.bool,

  /**
   * Background color while image is loading
   */
  color: propTypes.string,

  /**
   * Props to be spread onto the constructicon loading dots
   */
  loadingProps: propTypes.object,

  /**
   * Optional callback that fires when image has been loaded
   */
  onLoad: propTypes.func,

  /**
   * Styles to be merged with the image wrapper. This is where you should set a custom height and width
   */
  styles: propTypes.object,

  /**
   * transition to be used to fade out the overlay
   */
  transition: propTypes.string,

  /**
   * Optional children that will be rendered when loading, instead of the constructicon loading dots
   * */
  children: propTypes.any
};
LazyImage.defaultProps = {
  lazy: false,
  loadingProps: {},
  onLoad: function onLoad() {},
  color: 'light',
  transition: 'opacity 1s ease'
};
var index$e = withStyles(styles$m)(LazyImage);

var styles$o = (function (_ref, _ref2) {
  var background = _ref.background,
      foreground = _ref.foreground,
      columns = _ref.columns,
      styles = _ref.styles;
  var colors = _ref2.colors,
      mediaQuery = _ref2.mediaQuery,
      scale = _ref2.scale,
      rhythm = _ref2.rhythm,
      justifyContent = _ref2.justifyContent,
      treatments = _ref2.treatments;

  var createColumns = function createColumns() {
    return Object.keys(columns).reduce(function (styles, breakpoint) {
      return _objectSpread2({}, styles, _defineProperty({}, mediaQuery(breakpoint), {
        columnCount: columns[breakpoint]
      }));
    }, {});
  };

  var defaultStyles = {
    root: _objectSpread2({
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground]
    }, treatments.leaderboard),
    leaders: _objectSpread2({
      counterReset: 'board'
    }, createColumns(), {}, treatments.leaderboardLeaders),
    state: _objectSpread2({
      display: 'flex',
      alignItems: 'flex-start'
    }, justifyContent('center'), {
      padding: rhythm(2),
      fontSize: scale(-1)
    }, treatments.leaderboardState, {
      '& > *': {
        margin: rhythm([0, 0.25])
      }
    })
  };
  return merge_1(defaultStyles, styles);
});

var Leaderboard =
/*#__PURE__*/
function (_Component) {
  _inherits(Leaderboard, _Component);

  function Leaderboard() {
    _classCallCheck(this, Leaderboard);

    return _possibleConstructorReturn(this, _getPrototypeOf(Leaderboard).apply(this, arguments));
  }

  _createClass(Leaderboard, [{
    key: "render",
    value: function render() {
      var classNames = this.props.classNames;
      return React__default.createElement("div", {
        className: "c11n-leaderboard ".concat(classNames.root)
      }, this.renderLeaderboard());
    }
  }, {
    key: "renderLeaderboard",
    value: function renderLeaderboard() {
      var _this$props = this.props,
          children = _this$props.children,
          loading = _this$props.loading,
          error = _this$props.error;

      if (loading) {
        return this.renderLoading();
      }

      if (error) {
        return this.renderError();
      }

      if (isEmpty_1(children)) {
        return this.renderEmpty();
      }

      return this.renderLeaders();
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "loading",
        size: 2,
        spin: true
      }));
    }
  }, {
    key: "renderError",
    value: function renderError() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "warning"
      }), this.props.errorLabel);
    }
  }, {
    key: "renderEmpty",
    value: function renderEmpty() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "warning"
      }), this.props.emptyLabel);
    }
  }, {
    key: "renderLeaders",
    value: function renderLeaders() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          classNames = _this$props2.classNames;
      return React__default.createElement("ol", {
        className: classNames.leaders
      }, children);
    }
  }]);

  return Leaderboard;
}(React.Component);

Leaderboard.propTypes = {
  /**
   * An an array of leaderboard items for each leader
   */
  children: propTypes.oneOfType([propTypes.element, propTypes.arrayOf(propTypes.element)]),

  /**
   * If the results are currently loading
   */
  loading: propTypes.bool,

  /**
   * Set the error message or set to true to show default message
   */
  error: propTypes.oneOfType([propTypes.bool, propTypes.string]),

  /**
   * Set the message to display if there are no results
   */
  emptyLabel: propTypes.string,

  /**
   * Set the message to display if there is an error
   */
  errorLabel: propTypes.string,

  /**
   * An object to specify how many columns to use at which breakpoints (e.g. { xs: 1, sm: 2, md: 3 })
   */
  columns: propTypes.object,

  /**
   * The background color for the leaderboard
   */
  background: propTypes.string,

  /**
   * The foreground color for the leaderboard
   */
  foreground: propTypes.string,

  /**
   * Custom styles to be applied to root, leaders
   */
  styles: propTypes.object
};
Leaderboard.defaultProps = {
  columns: {},
  styles: {},
  emptyLabel: 'No results found',
  errorLabel: 'There was an error loading the results'
};
var index$f = withStyles(styles$o)(Leaderboard);

var styles$p = (function (_ref, _ref2) {
  var rank = _ref.rank,
      styles = _ref.styles,
      subtitle = _ref.subtitle;
  var measures = _ref2.measures,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'block',
      position: 'relative',
      minHeight: rhythm(2),
      padding: "".concat(rhythm(0.33), " ").concat(rhythm(0.33), " ").concat(rhythm(0.33), " ").concat(rhythm(rank ? 2 : 0.33)),
      fontSize: scale(-1),
      breakInside: 'avoid',
      listStyle: 'none'
    }, treatments.leaderboardItem),
    rank: _objectSpread2({
      position: 'absolute',
      top: '50%',
      left: rhythm(0.5),
      height: rhythm(2),
      lineHeight: rhythm(2),
      marginTop: rhythm(-1)
    }, treatments.leaderboardItemRank),
    link: {
      display: 'flex',
      alignItems: 'center',
      transition: 'opacity 200ms ease',
      minHeight: rhythm(1.33),
      '&:hover': {
        opacity: 0.75
      }
    },
    image: _objectSpread2({
      flex: '0 0 auto',
      width: rhythm(1.25),
      height: rhythm(1.25),
      backgroundColor: 'rgba(0,0,0,0.125)',
      border: '2px solid rgba(0,0,0,0.25)',
      borderRadius: '50%',
      marginRight: rhythm(0.5)
    }, treatments.leaderboardItemImage),
    info: {
      flex: 1,
      minWidth: 0
    },
    title: _objectSpread2({
      marginBottom: subtitle && rhythm(0.125),
      fontWeight: 700,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }, treatments.leaderboardItemTitle),
    subtitle: _objectSpread2({
      lineHeight: measures.medium,
      fontSize: '0.75em',
      opacity: 0.7,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }, treatments.leaderboardItemSubtitle),
    amount: _objectSpread2({
      flex: '0 0 auto',
      paddingLeft: rhythm(0.5),
      paddingRight: rhythm(0.5),
      textAlign: 'right',
      lineHeight: measures.medium
    }, treatments.leaderboardItemAmount)
  };
  return merge_1(defaultStyles, styles);
});

var LeaderboardItem = function LeaderboardItem(_ref) {
  var amount = _ref.amount,
      classNames = _ref.classNames,
      href = _ref.href,
      image = _ref.image,
      LinkTag = _ref.linkTag,
      linkProps = _ref.linkProps,
      rank = _ref.rank,
      subtitle = _ref.subtitle,
      target = _ref.target,
      title = _ref.title;
  return React__default.createElement("li", {
    className: "c11n-leaderboard-item ".concat(classNames.root)
  }, React__default.createElement(LinkTag, _extends({
    href: href,
    target: target,
    rel: target === '_blank' ? 'noopener' : undefined
  }, linkProps), React__default.createElement("div", {
    className: classNames.link
  }, rank && React__default.createElement("div", {
    className: classNames.rank
  }, rank), image && React__default.createElement("img", {
    src: image,
    alt: title,
    className: classNames.image
  }), React__default.createElement("div", {
    className: classNames.info
  }, React__default.createElement("div", {
    className: classNames.title
  }, title), subtitle && React__default.createElement("div", {
    className: classNames.subtitle
  }, subtitle)), amount && React__default.createElement("div", {
    className: classNames.amount
  }, amount))));
};

LeaderboardItem.propTypes = {
  /**
   * The tag or component to be used as the link. e.g. `a`, React Router `Link`
   */
  linkTag: propTypes.oneOfType([propTypes.string, propTypes.element, propTypes.func]),

  /**
   * Props to be applied to the linkTag
   */
  linkProps: propTypes.object,

  /**
   * The url of the leader's page. Passed to linkTag as `href` prop
   */
  href: propTypes.string,

  /**
   * The target for the link. e.g. `_blank`
   */
  target: propTypes.string,

  /**
   * The avatar for the leader
   */
  image: propTypes.string,

  /**
   * The name or title of the leader
   */
  title: propTypes.string.isRequired,

  /**
   * The charity or subtitle of the leader
   */
  subtitle: propTypes.string,

  /**
   * The rank of the leader (optional)
   */
  rank: propTypes.number,

  /**
   * The amount being ranked by
   */
  amount: propTypes.string,

  /**
   * The custom styles to be applied
   */
  styles: propTypes.object
};
LeaderboardItem.defaultProps = {
  linkTag: 'a',
  target: '_blank',
  href: '#',
  styles: {}
};
var index$g = withStyles(styles$p)(LeaderboardItem);

//

var shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }


var React__default = _interopDefault$1(React__default);
var shallowEqual = _interopDefault$1(shallowequal);

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inheritsLoose$1(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var canUseDOM$1 = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function withSideEffect(reducePropsToState, handleStateChangeOnClient, mapStateOnServer) {
  if (typeof reducePropsToState !== 'function') {
    throw new Error('Expected reducePropsToState to be a function.');
  }

  if (typeof handleStateChangeOnClient !== 'function') {
    throw new Error('Expected handleStateChangeOnClient to be a function.');
  }

  if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
    throw new Error('Expected mapStateOnServer to either be undefined or a function.');
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  return function wrap(WrappedComponent) {
    if (typeof WrappedComponent !== 'function') {
      throw new Error('Expected WrappedComponent to be a React component.');
    }

    var mountedInstances = [];
    var state;

    function emitChange() {
      state = reducePropsToState(mountedInstances.map(function (instance) {
        return instance.props;
      }));

      if (SideEffect.canUseDOM) {
        handleStateChangeOnClient(state);
      } else if (mapStateOnServer) {
        state = mapStateOnServer(state);
      }
    }

    var SideEffect =
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose$1(SideEffect, _Component);

      function SideEffect() {
        return _Component.apply(this, arguments) || this;
      }

      // Try to use displayName of wrapped component
      // Expose canUseDOM so tests can monkeypatch it
      SideEffect.peek = function peek() {
        return state;
      };

      SideEffect.rewind = function rewind() {
        if (SideEffect.canUseDOM) {
          throw new Error('You may only call rewind() on the server. Call peek() to read the current state.');
        }

        var recordedState = state;
        state = undefined;
        mountedInstances = [];
        return recordedState;
      };

      var _proto = SideEffect.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return !shallowEqual(nextProps, this.props);
      };

      _proto.componentWillMount = function componentWillMount() {
        mountedInstances.push(this);
        emitChange();
      };

      _proto.componentDidUpdate = function componentDidUpdate() {
        emitChange();
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        var index = mountedInstances.indexOf(this);
        mountedInstances.splice(index, 1);
        emitChange();
      };

      _proto.render = function render() {
        return React__default.createElement(WrappedComponent, this.props);
      };

      return SideEffect;
    }(React__default.Component);

    _defineProperty$2(SideEffect, "displayName", "SideEffect(" + getDisplayName(WrappedComponent) + ")");

    _defineProperty$2(SideEffect, "canUseDOM", canUseDOM$1);

    return SideEffect;
  };
}

var lib$1 = withSideEffect;

var isArray$3 = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var hasElementType = typeof Element !== 'undefined';

function equal(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray$3(a)
      , arrB = isArray$3(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;
    // end fast-deep-equal

    // start react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element && b instanceof Element)
      return a === b;

    // custom handling for React
    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) return false;
      }
    }
    // end react-fast-compare

    // fast-deep-equal index.js 2.0.1
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

var reactFastCompare = function exportedEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};

var HelmetConstants = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
var ATTRIBUTE_NAMES = exports.ATTRIBUTE_NAMES = {
    BODY: "bodyAttributes",
    HTML: "htmlAttributes",
    TITLE: "titleAttributes"
};

var TAG_NAMES = exports.TAG_NAMES = {
    BASE: "base",
    BODY: "body",
    HEAD: "head",
    HTML: "html",
    LINK: "link",
    META: "meta",
    NOSCRIPT: "noscript",
    SCRIPT: "script",
    STYLE: "style",
    TITLE: "title"
};

var VALID_TAG_NAMES = exports.VALID_TAG_NAMES = Object.keys(TAG_NAMES).map(function (name) {
    return TAG_NAMES[name];
});

var TAG_PROPERTIES = exports.TAG_PROPERTIES = {
    CHARSET: "charset",
    CSS_TEXT: "cssText",
    HREF: "href",
    HTTPEQUIV: "http-equiv",
    INNER_HTML: "innerHTML",
    ITEM_PROP: "itemprop",
    NAME: "name",
    PROPERTY: "property",
    REL: "rel",
    SRC: "src"
};

var REACT_TAG_MAP = exports.REACT_TAG_MAP = {
    accesskey: "accessKey",
    charset: "charSet",
    class: "className",
    contenteditable: "contentEditable",
    contextmenu: "contextMenu",
    "http-equiv": "httpEquiv",
    itemprop: "itemProp",
    tabindex: "tabIndex"
};

var HELMET_PROPS = exports.HELMET_PROPS = {
    DEFAULT_TITLE: "defaultTitle",
    DEFER: "defer",
    ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
    ON_CHANGE_CLIENT_STATE: "onChangeClientState",
    TITLE_TEMPLATE: "titleTemplate"
};

var HTML_TAG_MAP = exports.HTML_TAG_MAP = Object.keys(REACT_TAG_MAP).reduce(function (obj, key) {
    obj[REACT_TAG_MAP[key]] = key;
    return obj;
}, {});

var SELF_CLOSING_TAGS = exports.SELF_CLOSING_TAGS = [TAG_NAMES.NOSCRIPT, TAG_NAMES.SCRIPT, TAG_NAMES.STYLE];

var HELMET_ATTRIBUTE = exports.HELMET_ATTRIBUTE = "data-react-helmet";
});

unwrapExports(HelmetConstants);
var HelmetConstants_1 = HelmetConstants.ATTRIBUTE_NAMES;
var HelmetConstants_2 = HelmetConstants.TAG_NAMES;
var HelmetConstants_3 = HelmetConstants.VALID_TAG_NAMES;
var HelmetConstants_4 = HelmetConstants.TAG_PROPERTIES;
var HelmetConstants_5 = HelmetConstants.REACT_TAG_MAP;
var HelmetConstants_6 = HelmetConstants.HELMET_PROPS;
var HelmetConstants_7 = HelmetConstants.HTML_TAG_MAP;
var HelmetConstants_8 = HelmetConstants.SELF_CLOSING_TAGS;
var HelmetConstants_9 = HelmetConstants.HELMET_ATTRIBUTE;

var HelmetUtils = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.warn = exports.requestAnimationFrame = exports.reducePropsToState = exports.mapStateOnServer = exports.handleClientStateChange = exports.convertReactPropstoHtmlAttributes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React__default);



var _objectAssign2 = _interopRequireDefault(objectAssign);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encodeSpecialCharacters = function encodeSpecialCharacters(str) {
    var encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (encode === false) {
        return String(str);
    }

    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};

var getTitleFromPropsList = function getTitleFromPropsList(propsList) {
    var innermostTitle = getInnermostProperty(propsList, HelmetConstants.TAG_NAMES.TITLE);
    var innermostTemplate = getInnermostProperty(propsList, HelmetConstants.HELMET_PROPS.TITLE_TEMPLATE);

    if (innermostTemplate && innermostTitle) {
        // use function arg to avoid need to escape $ characters
        return innermostTemplate.replace(/%s/g, function () {
            return innermostTitle;
        });
    }

    var innermostDefaultTitle = getInnermostProperty(propsList, HelmetConstants.HELMET_PROPS.DEFAULT_TITLE);

    return innermostTitle || innermostDefaultTitle || undefined;
};

var getOnChangeClientState = function getOnChangeClientState(propsList) {
    return getInnermostProperty(propsList, HelmetConstants.HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || function () {};
};

var getAttributesFromPropsList = function getAttributesFromPropsList(tagType, propsList) {
    return propsList.filter(function (props) {
        return typeof props[tagType] !== "undefined";
    }).map(function (props) {
        return props[tagType];
    }).reduce(function (tagAttrs, current) {
        return _extends({}, tagAttrs, current);
    }, {});
};

var getBaseTagFromPropsList = function getBaseTagFromPropsList(primaryAttributes, propsList) {
    return propsList.filter(function (props) {
        return typeof props[HelmetConstants.TAG_NAMES.BASE] !== "undefined";
    }).map(function (props) {
        return props[HelmetConstants.TAG_NAMES.BASE];
    }).reverse().reduce(function (innermostBaseTag, tag) {
        if (!innermostBaseTag.length) {
            var keys = Object.keys(tag);

            for (var i = 0; i < keys.length; i++) {
                var attributeKey = keys[i];
                var lowerCaseAttributeKey = attributeKey.toLowerCase();

                if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
                    return innermostBaseTag.concat(tag);
                }
            }
        }

        return innermostBaseTag;
    }, []);
};

var getTagsFromPropsList = function getTagsFromPropsList(tagName, primaryAttributes, propsList) {
    // Calculate list of tags, giving priority innermost component (end of the propslist)
    var approvedSeenTags = {};

    return propsList.filter(function (props) {
        if (Array.isArray(props[tagName])) {
            return true;
        }
        if (typeof props[tagName] !== "undefined") {
            warn("Helmet: " + tagName + " should be of type \"Array\". Instead found type \"" + _typeof(props[tagName]) + "\"");
        }
        return false;
    }).map(function (props) {
        return props[tagName];
    }).reverse().reduce(function (approvedTags, instanceTags) {
        var instanceSeenTags = {};

        instanceTags.filter(function (tag) {
            var primaryAttributeKey = void 0;
            var keys = Object.keys(tag);
            for (var i = 0; i < keys.length; i++) {
                var attributeKey = keys[i];
                var lowerCaseAttributeKey = attributeKey.toLowerCase();

                // Special rule with link tags, since rel and href are both primary tags, rel takes priority
                if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === HelmetConstants.TAG_PROPERTIES.REL && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === HelmetConstants.TAG_PROPERTIES.REL && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
                    primaryAttributeKey = lowerCaseAttributeKey;
                }
                // Special case for innerHTML which doesn't work lowercased
                if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === HelmetConstants.TAG_PROPERTIES.INNER_HTML || attributeKey === HelmetConstants.TAG_PROPERTIES.CSS_TEXT || attributeKey === HelmetConstants.TAG_PROPERTIES.ITEM_PROP)) {
                    primaryAttributeKey = attributeKey;
                }
            }

            if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
                return false;
            }

            var value = tag[primaryAttributeKey].toLowerCase();

            if (!approvedSeenTags[primaryAttributeKey]) {
                approvedSeenTags[primaryAttributeKey] = {};
            }

            if (!instanceSeenTags[primaryAttributeKey]) {
                instanceSeenTags[primaryAttributeKey] = {};
            }

            if (!approvedSeenTags[primaryAttributeKey][value]) {
                instanceSeenTags[primaryAttributeKey][value] = true;
                return true;
            }

            return false;
        }).reverse().forEach(function (tag) {
            return approvedTags.push(tag);
        });

        // Update seen tags with tags from this instance
        var keys = Object.keys(instanceSeenTags);
        for (var i = 0; i < keys.length; i++) {
            var attributeKey = keys[i];
            var tagUnion = (0, _objectAssign2.default)({}, approvedSeenTags[attributeKey], instanceSeenTags[attributeKey]);

            approvedSeenTags[attributeKey] = tagUnion;
        }

        return approvedTags;
    }, []).reverse();
};

var getInnermostProperty = function getInnermostProperty(propsList, property) {
    for (var i = propsList.length - 1; i >= 0; i--) {
        var props = propsList[i];

        if (props.hasOwnProperty(property)) {
            return props[property];
        }
    }

    return null;
};

var reducePropsToState = function reducePropsToState(propsList) {
    return {
        baseTag: getBaseTagFromPropsList([HelmetConstants.TAG_PROPERTIES.HREF], propsList),
        bodyAttributes: getAttributesFromPropsList(HelmetConstants.ATTRIBUTE_NAMES.BODY, propsList),
        defer: getInnermostProperty(propsList, HelmetConstants.HELMET_PROPS.DEFER),
        encode: getInnermostProperty(propsList, HelmetConstants.HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
        htmlAttributes: getAttributesFromPropsList(HelmetConstants.ATTRIBUTE_NAMES.HTML, propsList),
        linkTags: getTagsFromPropsList(HelmetConstants.TAG_NAMES.LINK, [HelmetConstants.TAG_PROPERTIES.REL, HelmetConstants.TAG_PROPERTIES.HREF], propsList),
        metaTags: getTagsFromPropsList(HelmetConstants.TAG_NAMES.META, [HelmetConstants.TAG_PROPERTIES.NAME, HelmetConstants.TAG_PROPERTIES.CHARSET, HelmetConstants.TAG_PROPERTIES.HTTPEQUIV, HelmetConstants.TAG_PROPERTIES.PROPERTY, HelmetConstants.TAG_PROPERTIES.ITEM_PROP], propsList),
        noscriptTags: getTagsFromPropsList(HelmetConstants.TAG_NAMES.NOSCRIPT, [HelmetConstants.TAG_PROPERTIES.INNER_HTML], propsList),
        onChangeClientState: getOnChangeClientState(propsList),
        scriptTags: getTagsFromPropsList(HelmetConstants.TAG_NAMES.SCRIPT, [HelmetConstants.TAG_PROPERTIES.SRC, HelmetConstants.TAG_PROPERTIES.INNER_HTML], propsList),
        styleTags: getTagsFromPropsList(HelmetConstants.TAG_NAMES.STYLE, [HelmetConstants.TAG_PROPERTIES.CSS_TEXT], propsList),
        title: getTitleFromPropsList(propsList),
        titleAttributes: getAttributesFromPropsList(HelmetConstants.ATTRIBUTE_NAMES.TITLE, propsList)
    };
};

var rafPolyfill = function () {
    var clock = Date.now();

    return function (callback) {
        var currentTime = Date.now();

        if (currentTime - clock > 16) {
            clock = currentTime;
            callback(currentTime);
        } else {
            setTimeout(function () {
                rafPolyfill(callback);
            }, 0);
        }
    };
}();

var cafPolyfill = function cafPolyfill(id) {
    return clearTimeout(id);
};

var requestAnimationFrame = typeof window !== "undefined" ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || rafPolyfill : commonjsGlobal.requestAnimationFrame || rafPolyfill;

var cancelAnimationFrame = typeof window !== "undefined" ? window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || cafPolyfill : commonjsGlobal.cancelAnimationFrame || cafPolyfill;

var warn = function warn(msg) {
    return console && typeof console.warn === "function" && console.warn(msg);
};

var _helmetCallback = null;

var handleClientStateChange = function handleClientStateChange(newState) {
    if (_helmetCallback) {
        cancelAnimationFrame(_helmetCallback);
    }

    if (newState.defer) {
        _helmetCallback = requestAnimationFrame(function () {
            commitTagChanges(newState, function () {
                _helmetCallback = null;
            });
        });
    } else {
        commitTagChanges(newState);
        _helmetCallback = null;
    }
};

var commitTagChanges = function commitTagChanges(newState, cb) {
    var baseTag = newState.baseTag,
        bodyAttributes = newState.bodyAttributes,
        htmlAttributes = newState.htmlAttributes,
        linkTags = newState.linkTags,
        metaTags = newState.metaTags,
        noscriptTags = newState.noscriptTags,
        onChangeClientState = newState.onChangeClientState,
        scriptTags = newState.scriptTags,
        styleTags = newState.styleTags,
        title = newState.title,
        titleAttributes = newState.titleAttributes;

    updateAttributes(HelmetConstants.TAG_NAMES.BODY, bodyAttributes);
    updateAttributes(HelmetConstants.TAG_NAMES.HTML, htmlAttributes);

    updateTitle(title, titleAttributes);

    var tagUpdates = {
        baseTag: updateTags(HelmetConstants.TAG_NAMES.BASE, baseTag),
        linkTags: updateTags(HelmetConstants.TAG_NAMES.LINK, linkTags),
        metaTags: updateTags(HelmetConstants.TAG_NAMES.META, metaTags),
        noscriptTags: updateTags(HelmetConstants.TAG_NAMES.NOSCRIPT, noscriptTags),
        scriptTags: updateTags(HelmetConstants.TAG_NAMES.SCRIPT, scriptTags),
        styleTags: updateTags(HelmetConstants.TAG_NAMES.STYLE, styleTags)
    };

    var addedTags = {};
    var removedTags = {};

    Object.keys(tagUpdates).forEach(function (tagType) {
        var _tagUpdates$tagType = tagUpdates[tagType],
            newTags = _tagUpdates$tagType.newTags,
            oldTags = _tagUpdates$tagType.oldTags;


        if (newTags.length) {
            addedTags[tagType] = newTags;
        }
        if (oldTags.length) {
            removedTags[tagType] = tagUpdates[tagType].oldTags;
        }
    });

    cb && cb();

    onChangeClientState(newState, addedTags, removedTags);
};

var flattenArray = function flattenArray(possibleArray) {
    return Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
};

var updateTitle = function updateTitle(title, attributes) {
    if (typeof title !== "undefined" && document.title !== title) {
        document.title = flattenArray(title);
    }

    updateAttributes(HelmetConstants.TAG_NAMES.TITLE, attributes);
};

var updateAttributes = function updateAttributes(tagName, attributes) {
    var elementTag = document.getElementsByTagName(tagName)[0];

    if (!elementTag) {
        return;
    }

    var helmetAttributeString = elementTag.getAttribute(HelmetConstants.HELMET_ATTRIBUTE);
    var helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
    var attributesToRemove = [].concat(helmetAttributes);
    var attributeKeys = Object.keys(attributes);

    for (var i = 0; i < attributeKeys.length; i++) {
        var attribute = attributeKeys[i];
        var value = attributes[attribute] || "";

        if (elementTag.getAttribute(attribute) !== value) {
            elementTag.setAttribute(attribute, value);
        }

        if (helmetAttributes.indexOf(attribute) === -1) {
            helmetAttributes.push(attribute);
        }

        var indexToSave = attributesToRemove.indexOf(attribute);
        if (indexToSave !== -1) {
            attributesToRemove.splice(indexToSave, 1);
        }
    }

    for (var _i = attributesToRemove.length - 1; _i >= 0; _i--) {
        elementTag.removeAttribute(attributesToRemove[_i]);
    }

    if (helmetAttributes.length === attributesToRemove.length) {
        elementTag.removeAttribute(HelmetConstants.HELMET_ATTRIBUTE);
    } else if (elementTag.getAttribute(HelmetConstants.HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
        elementTag.setAttribute(HelmetConstants.HELMET_ATTRIBUTE, attributeKeys.join(","));
    }
};

var updateTags = function updateTags(type, tags) {
    var headElement = document.head || document.querySelector(HelmetConstants.TAG_NAMES.HEAD);
    var tagNodes = headElement.querySelectorAll(type + "[" + HelmetConstants.HELMET_ATTRIBUTE + "]");
    var oldTags = Array.prototype.slice.call(tagNodes);
    var newTags = [];
    var indexToDelete = void 0;

    if (tags && tags.length) {
        tags.forEach(function (tag) {
            var newElement = document.createElement(type);

            for (var attribute in tag) {
                if (tag.hasOwnProperty(attribute)) {
                    if (attribute === HelmetConstants.TAG_PROPERTIES.INNER_HTML) {
                        newElement.innerHTML = tag.innerHTML;
                    } else if (attribute === HelmetConstants.TAG_PROPERTIES.CSS_TEXT) {
                        if (newElement.styleSheet) {
                            newElement.styleSheet.cssText = tag.cssText;
                        } else {
                            newElement.appendChild(document.createTextNode(tag.cssText));
                        }
                    } else {
                        var value = typeof tag[attribute] === "undefined" ? "" : tag[attribute];
                        newElement.setAttribute(attribute, value);
                    }
                }
            }

            newElement.setAttribute(HelmetConstants.HELMET_ATTRIBUTE, "true");

            // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
            if (oldTags.some(function (existingTag, index) {
                indexToDelete = index;
                return newElement.isEqualNode(existingTag);
            })) {
                oldTags.splice(indexToDelete, 1);
            } else {
                newTags.push(newElement);
            }
        });
    }

    oldTags.forEach(function (tag) {
        return tag.parentNode.removeChild(tag);
    });
    newTags.forEach(function (tag) {
        return headElement.appendChild(tag);
    });

    return {
        oldTags: oldTags,
        newTags: newTags
    };
};

var generateElementAttributesAsString = function generateElementAttributesAsString(attributes) {
    return Object.keys(attributes).reduce(function (str, key) {
        var attr = typeof attributes[key] !== "undefined" ? key + "=\"" + attributes[key] + "\"" : "" + key;
        return str ? str + " " + attr : attr;
    }, "");
};

var generateTitleAsString = function generateTitleAsString(type, title, attributes, encode) {
    var attributeString = generateElementAttributesAsString(attributes);
    var flattenedTitle = flattenArray(title);
    return attributeString ? "<" + type + " " + HelmetConstants.HELMET_ATTRIBUTE + "=\"true\" " + attributeString + ">" + encodeSpecialCharacters(flattenedTitle, encode) + "</" + type + ">" : "<" + type + " " + HelmetConstants.HELMET_ATTRIBUTE + "=\"true\">" + encodeSpecialCharacters(flattenedTitle, encode) + "</" + type + ">";
};

var generateTagsAsString = function generateTagsAsString(type, tags, encode) {
    return tags.reduce(function (str, tag) {
        var attributeHtml = Object.keys(tag).filter(function (attribute) {
            return !(attribute === HelmetConstants.TAG_PROPERTIES.INNER_HTML || attribute === HelmetConstants.TAG_PROPERTIES.CSS_TEXT);
        }).reduce(function (string, attribute) {
            var attr = typeof tag[attribute] === "undefined" ? attribute : attribute + "=\"" + encodeSpecialCharacters(tag[attribute], encode) + "\"";
            return string ? string + " " + attr : attr;
        }, "");

        var tagContent = tag.innerHTML || tag.cssText || "";

        var isSelfClosing = HelmetConstants.SELF_CLOSING_TAGS.indexOf(type) === -1;

        return str + "<" + type + " " + HelmetConstants.HELMET_ATTRIBUTE + "=\"true\" " + attributeHtml + (isSelfClosing ? "/>" : ">" + tagContent + "</" + type + ">");
    }, "");
};

var convertElementAttributestoReactProps = function convertElementAttributestoReactProps(attributes) {
    var initProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return Object.keys(attributes).reduce(function (obj, key) {
        obj[HelmetConstants.REACT_TAG_MAP[key] || key] = attributes[key];
        return obj;
    }, initProps);
};

var convertReactPropstoHtmlAttributes = function convertReactPropstoHtmlAttributes(props) {
    var initAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return Object.keys(props).reduce(function (obj, key) {
        obj[HelmetConstants.HTML_TAG_MAP[key] || key] = props[key];
        return obj;
    }, initAttributes);
};

var generateTitleAsReactComponent = function generateTitleAsReactComponent(type, title, attributes) {
    var _initProps;

    // assigning into an array to define toString function on it
    var initProps = (_initProps = {
        key: title
    }, _initProps[HelmetConstants.HELMET_ATTRIBUTE] = true, _initProps);
    var props = convertElementAttributestoReactProps(attributes, initProps);

    return [_react2.default.createElement(HelmetConstants.TAG_NAMES.TITLE, props, title)];
};

var generateTagsAsReactComponent = function generateTagsAsReactComponent(type, tags) {
    return tags.map(function (tag, i) {
        var _mappedTag;

        var mappedTag = (_mappedTag = {
            key: i
        }, _mappedTag[HelmetConstants.HELMET_ATTRIBUTE] = true, _mappedTag);

        Object.keys(tag).forEach(function (attribute) {
            var mappedAttribute = HelmetConstants.REACT_TAG_MAP[attribute] || attribute;

            if (mappedAttribute === HelmetConstants.TAG_PROPERTIES.INNER_HTML || mappedAttribute === HelmetConstants.TAG_PROPERTIES.CSS_TEXT) {
                var content = tag.innerHTML || tag.cssText;
                mappedTag.dangerouslySetInnerHTML = { __html: content };
            } else {
                mappedTag[mappedAttribute] = tag[attribute];
            }
        });

        return _react2.default.createElement(type, mappedTag);
    });
};

var getMethodsForTag = function getMethodsForTag(type, tags, encode) {
    switch (type) {
        case HelmetConstants.TAG_NAMES.TITLE:
            return {
                toComponent: function toComponent() {
                    return generateTitleAsReactComponent(type, tags.title, tags.titleAttributes);
                },
                toString: function toString() {
                    return generateTitleAsString(type, tags.title, tags.titleAttributes, encode);
                }
            };
        case HelmetConstants.ATTRIBUTE_NAMES.BODY:
        case HelmetConstants.ATTRIBUTE_NAMES.HTML:
            return {
                toComponent: function toComponent() {
                    return convertElementAttributestoReactProps(tags);
                },
                toString: function toString() {
                    return generateElementAttributesAsString(tags);
                }
            };
        default:
            return {
                toComponent: function toComponent() {
                    return generateTagsAsReactComponent(type, tags);
                },
                toString: function toString() {
                    return generateTagsAsString(type, tags, encode);
                }
            };
    }
};

var mapStateOnServer = function mapStateOnServer(_ref) {
    var baseTag = _ref.baseTag,
        bodyAttributes = _ref.bodyAttributes,
        encode = _ref.encode,
        htmlAttributes = _ref.htmlAttributes,
        linkTags = _ref.linkTags,
        metaTags = _ref.metaTags,
        noscriptTags = _ref.noscriptTags,
        scriptTags = _ref.scriptTags,
        styleTags = _ref.styleTags,
        _ref$title = _ref.title,
        title = _ref$title === undefined ? "" : _ref$title,
        titleAttributes = _ref.titleAttributes;
    return {
        base: getMethodsForTag(HelmetConstants.TAG_NAMES.BASE, baseTag, encode),
        bodyAttributes: getMethodsForTag(HelmetConstants.ATTRIBUTE_NAMES.BODY, bodyAttributes, encode),
        htmlAttributes: getMethodsForTag(HelmetConstants.ATTRIBUTE_NAMES.HTML, htmlAttributes, encode),
        link: getMethodsForTag(HelmetConstants.TAG_NAMES.LINK, linkTags, encode),
        meta: getMethodsForTag(HelmetConstants.TAG_NAMES.META, metaTags, encode),
        noscript: getMethodsForTag(HelmetConstants.TAG_NAMES.NOSCRIPT, noscriptTags, encode),
        script: getMethodsForTag(HelmetConstants.TAG_NAMES.SCRIPT, scriptTags, encode),
        style: getMethodsForTag(HelmetConstants.TAG_NAMES.STYLE, styleTags, encode),
        title: getMethodsForTag(HelmetConstants.TAG_NAMES.TITLE, { title: title, titleAttributes: titleAttributes }, encode)
    };
};

exports.convertReactPropstoHtmlAttributes = convertReactPropstoHtmlAttributes;
exports.handleClientStateChange = handleClientStateChange;
exports.mapStateOnServer = mapStateOnServer;
exports.reducePropsToState = reducePropsToState;
exports.requestAnimationFrame = requestAnimationFrame;
exports.warn = warn;
});

unwrapExports(HelmetUtils);
var HelmetUtils_1 = HelmetUtils.warn;
var HelmetUtils_2 = HelmetUtils.requestAnimationFrame;
var HelmetUtils_3 = HelmetUtils.reducePropsToState;
var HelmetUtils_4 = HelmetUtils.mapStateOnServer;
var HelmetUtils_5 = HelmetUtils.handleClientStateChange;
var HelmetUtils_6 = HelmetUtils.convertReactPropstoHtmlAttributes;

var Helmet_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.Helmet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React__default);



var _propTypes2 = _interopRequireDefault(propTypes);



var _reactSideEffect2 = _interopRequireDefault(lib$1);



var _reactFastCompare2 = _interopRequireDefault(reactFastCompare);





function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Helmet = function Helmet(Component) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
        _inherits(HelmetWrapper, _React$Component);

        function HelmetWrapper() {
            _classCallCheck(this, HelmetWrapper);

            return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
        }

        HelmetWrapper.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
            return !(0, _reactFastCompare2.default)(this.props, nextProps);
        };

        HelmetWrapper.prototype.mapNestedChildrenToProps = function mapNestedChildrenToProps(child, nestedChildren) {
            if (!nestedChildren) {
                return null;
            }

            switch (child.type) {
                case HelmetConstants.TAG_NAMES.SCRIPT:
                case HelmetConstants.TAG_NAMES.NOSCRIPT:
                    return {
                        innerHTML: nestedChildren
                    };

                case HelmetConstants.TAG_NAMES.STYLE:
                    return {
                        cssText: nestedChildren
                    };
            }

            throw new Error("<" + child.type + " /> elements are self-closing and can not contain children. Refer to our API for more information.");
        };

        HelmetWrapper.prototype.flattenArrayTypeChildren = function flattenArrayTypeChildren(_ref) {
            var _extends2;

            var child = _ref.child,
                arrayTypeChildren = _ref.arrayTypeChildren,
                newChildProps = _ref.newChildProps,
                nestedChildren = _ref.nestedChildren;

            return _extends({}, arrayTypeChildren, (_extends2 = {}, _extends2[child.type] = [].concat(arrayTypeChildren[child.type] || [], [_extends({}, newChildProps, this.mapNestedChildrenToProps(child, nestedChildren))]), _extends2));
        };

        HelmetWrapper.prototype.mapObjectTypeChildren = function mapObjectTypeChildren(_ref2) {
            var _extends3, _extends4;

            var child = _ref2.child,
                newProps = _ref2.newProps,
                newChildProps = _ref2.newChildProps,
                nestedChildren = _ref2.nestedChildren;

            switch (child.type) {
                case HelmetConstants.TAG_NAMES.TITLE:
                    return _extends({}, newProps, (_extends3 = {}, _extends3[child.type] = nestedChildren, _extends3.titleAttributes = _extends({}, newChildProps), _extends3));

                case HelmetConstants.TAG_NAMES.BODY:
                    return _extends({}, newProps, {
                        bodyAttributes: _extends({}, newChildProps)
                    });

                case HelmetConstants.TAG_NAMES.HTML:
                    return _extends({}, newProps, {
                        htmlAttributes: _extends({}, newChildProps)
                    });
            }

            return _extends({}, newProps, (_extends4 = {}, _extends4[child.type] = _extends({}, newChildProps), _extends4));
        };

        HelmetWrapper.prototype.mapArrayTypeChildrenToProps = function mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
            var newFlattenedProps = _extends({}, newProps);

            Object.keys(arrayTypeChildren).forEach(function (arrayChildName) {
                var _extends5;

                newFlattenedProps = _extends({}, newFlattenedProps, (_extends5 = {}, _extends5[arrayChildName] = arrayTypeChildren[arrayChildName], _extends5));
            });

            return newFlattenedProps;
        };

        HelmetWrapper.prototype.warnOnInvalidChildren = function warnOnInvalidChildren(child, nestedChildren) {
            if (process.env.NODE_ENV !== "production") {
                if (!HelmetConstants.VALID_TAG_NAMES.some(function (name) {
                    return child.type === name;
                })) {
                    if (typeof child.type === "function") {
                        return (0, HelmetUtils.warn)("You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.");
                    }

                    return (0, HelmetUtils.warn)("Only elements types " + HelmetConstants.VALID_TAG_NAMES.join(", ") + " are allowed. Helmet does not support rendering <" + child.type + "> elements. Refer to our API for more information.");
                }

                if (nestedChildren && typeof nestedChildren !== "string" && (!Array.isArray(nestedChildren) || nestedChildren.some(function (nestedChild) {
                    return typeof nestedChild !== "string";
                }))) {
                    throw new Error("Helmet expects a string as a child of <" + child.type + ">. Did you forget to wrap your children in braces? ( <" + child.type + ">{``}</" + child.type + "> ) Refer to our API for more information.");
                }
            }

            return true;
        };

        HelmetWrapper.prototype.mapChildrenToProps = function mapChildrenToProps(children, newProps) {
            var _this2 = this;

            var arrayTypeChildren = {};

            _react2.default.Children.forEach(children, function (child) {
                if (!child || !child.props) {
                    return;
                }

                var _child$props = child.props,
                    nestedChildren = _child$props.children,
                    childProps = _objectWithoutProperties(_child$props, ["children"]);

                var newChildProps = (0, HelmetUtils.convertReactPropstoHtmlAttributes)(childProps);

                _this2.warnOnInvalidChildren(child, nestedChildren);

                switch (child.type) {
                    case HelmetConstants.TAG_NAMES.LINK:
                    case HelmetConstants.TAG_NAMES.META:
                    case HelmetConstants.TAG_NAMES.NOSCRIPT:
                    case HelmetConstants.TAG_NAMES.SCRIPT:
                    case HelmetConstants.TAG_NAMES.STYLE:
                        arrayTypeChildren = _this2.flattenArrayTypeChildren({
                            child: child,
                            arrayTypeChildren: arrayTypeChildren,
                            newChildProps: newChildProps,
                            nestedChildren: nestedChildren
                        });
                        break;

                    default:
                        newProps = _this2.mapObjectTypeChildren({
                            child: child,
                            newProps: newProps,
                            newChildProps: newChildProps,
                            nestedChildren: nestedChildren
                        });
                        break;
                }
            });

            newProps = this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
            return newProps;
        };

        HelmetWrapper.prototype.render = function render() {
            var _props = this.props,
                children = _props.children,
                props = _objectWithoutProperties(_props, ["children"]);

            var newProps = _extends({}, props);

            if (children) {
                newProps = this.mapChildrenToProps(children, newProps);
            }

            return _react2.default.createElement(Component, newProps);
        };

        _createClass(HelmetWrapper, null, [{
            key: "canUseDOM",


            // Component.peek comes from react-side-effect:
            // For testing, you may use a static peek() method available on the returned component.
            // It lets you get the current state without resetting the mounted instance stack.
            // Don’t use it for anything other than testing.

            /**
             * @param {Object} base: {"target": "_blank", "href": "http://mysite.com/"}
             * @param {Object} bodyAttributes: {"className": "root"}
             * @param {String} defaultTitle: "Default Title"
             * @param {Boolean} defer: true
             * @param {Boolean} encodeSpecialCharacters: true
             * @param {Object} htmlAttributes: {"lang": "en", "amp": undefined}
             * @param {Array} link: [{"rel": "canonical", "href": "http://mysite.com/example"}]
             * @param {Array} meta: [{"name": "description", "content": "Test description"}]
             * @param {Array} noscript: [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
             * @param {Function} onChangeClientState: "(newState) => console.log(newState)"
             * @param {Array} script: [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
             * @param {Array} style: [{"type": "text/css", "cssText": "div { display: block; color: blue; }"}]
             * @param {String} title: "Title"
             * @param {Object} titleAttributes: {"itemprop": "name"}
             * @param {String} titleTemplate: "MySite.com - %s"
             */
            set: function set(canUseDOM) {
                Component.canUseDOM = canUseDOM;
            }
        }]);

        return HelmetWrapper;
    }(_react2.default.Component), _class.propTypes = {
        base: _propTypes2.default.object,
        bodyAttributes: _propTypes2.default.object,
        children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]),
        defaultTitle: _propTypes2.default.string,
        defer: _propTypes2.default.bool,
        encodeSpecialCharacters: _propTypes2.default.bool,
        htmlAttributes: _propTypes2.default.object,
        link: _propTypes2.default.arrayOf(_propTypes2.default.object),
        meta: _propTypes2.default.arrayOf(_propTypes2.default.object),
        noscript: _propTypes2.default.arrayOf(_propTypes2.default.object),
        onChangeClientState: _propTypes2.default.func,
        script: _propTypes2.default.arrayOf(_propTypes2.default.object),
        style: _propTypes2.default.arrayOf(_propTypes2.default.object),
        title: _propTypes2.default.string,
        titleAttributes: _propTypes2.default.object,
        titleTemplate: _propTypes2.default.string
    }, _class.defaultProps = {
        defer: true,
        encodeSpecialCharacters: true
    }, _class.peek = Component.peek, _class.rewind = function () {
        var mappedState = Component.rewind();
        if (!mappedState) {
            // provide fallback if mappedState is undefined
            mappedState = (0, HelmetUtils.mapStateOnServer)({
                baseTag: [],
                bodyAttributes: {},
                encodeSpecialCharacters: true,
                htmlAttributes: {},
                linkTags: [],
                metaTags: [],
                noscriptTags: [],
                scriptTags: [],
                styleTags: [],
                title: "",
                titleAttributes: {}
            });
        }

        return mappedState;
    }, _temp;
};

var NullComponent = function NullComponent() {
    return null;
};

var HelmetSideEffects = (0, _reactSideEffect2.default)(HelmetUtils.reducePropsToState, HelmetUtils.handleClientStateChange, HelmetUtils.mapStateOnServer)(NullComponent);

var HelmetExport = Helmet(HelmetSideEffects);
HelmetExport.renderStatic = HelmetExport.rewind;

exports.Helmet = HelmetExport;
exports.default = HelmetExport;
});

var Helmet = unwrapExports(Helmet_1);
var Helmet_2 = Helmet_1.Helmet;

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  _baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

var _baseFilter = baseFilter;

/** Error message constants. */
var FUNC_ERROR_TEXT$2 = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

var negate_1 = negate;

/**
 * The opposite of `_.filter`; this method returns the elements of `collection`
 * that `predicate` does **not** return truthy for.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.filter
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * _.reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.reject(users, { 'age': 40, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.reject(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.reject(users, 'active');
 * // => objects for ['barney']
 */
function reject(collection, predicate) {
  var func = isArray_1(collection) ? _arrayFilter : _baseFilter;
  return func(collection, negate_1(_baseIteratee(predicate)));
}

var reject_1 = reject;

var Meta = function Meta(_ref) {
  var title = _ref.title,
      description = _ref.description,
      keywords = _ref.keywords,
      author = _ref.author,
      ogType = _ref.ogType,
      ogTitle = _ref.ogTitle,
      ogDescription = _ref.ogDescription,
      ogImage = _ref.ogImage,
      ogUrl = _ref.ogUrl,
      url = _ref.url,
      favicon = _ref.favicon,
      appleTouchIcon = _ref.appleTouchIcon;

  var getURL = function getURL(value) {
    switch (_typeof(value)) {
      case 'object':
        return value.url;

      case 'string':
        return value;

      default:
        return undefined;
    }
  };

  var meta = [{
    name: 'description',
    content: description
  }, {
    name: 'keywords',
    content: keywords
  }, {
    name: 'author',
    content: author
  }, {
    property: 'og:type',
    content: ogType
  }, {
    property: 'og:title',
    content: ogTitle
  }, {
    property: 'og:description',
    content: ogDescription
  }, {
    property: 'og:image',
    content: getURL(ogImage)
  }, {
    property: 'og:url',
    content: getURL(ogUrl) || getURL(url)
  }];
  var links = [{
    rel: 'canonical',
    href: getURL(url)
  }, {
    rel: 'shortcut icon',
    href: getURL(favicon)
  }, {
    rel: 'apple-touch-icon',
    href: getURL(appleTouchIcon)
  }];
  return React__default.createElement(Helmet, {
    title: title,
    meta: reject_1(meta, function (prop) {
      return !prop.content;
    }),
    link: reject_1(links, function (prop) {
      return !prop.href;
    })
  });
};

Meta.propTypes = {
  foreground: propTypes.string,
  title: propTypes.string,
  description: propTypes.string,
  keywords: propTypes.string,
  author: propTypes.string,
  ogType: propTypes.string,
  ogTitle: propTypes.string,
  ogDescription: propTypes.string,
  ogImage: propTypes.oneOfType([propTypes.string, propTypes.object]),
  ogUrl: propTypes.oneOfType([propTypes.string, propTypes.object]),
  url: propTypes.oneOfType([propTypes.string, propTypes.object]),
  favicon: propTypes.oneOfType([propTypes.string, propTypes.object]),
  appleTouchIcon: propTypes.oneOfType([propTypes.string, propTypes.object])
};

var styles$q = (function (_ref, _ref2) {
  var align = _ref.align,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;
  var defaultStyles = {
    root: _objectSpread2({
      textAlign: align
    }, treatments.metric),
    icon: _objectSpread2({
      marginBottom: rhythm(0.66)
    }, treatments.metricIcon),
    label: _objectSpread2({
      display: 'block',
      opacity: 0.5,
      marginBottom: rhythm(0.33),
      fontSize: scale(-1)
    }, treatments.button, {}, treatments.metricLabel),
    amount: _objectSpread2({
      fontSize: scale(3)
    }, treatments.head, {}, treatments.metricAmount)
  };
  return merge_1(defaultStyles, styles);
});

var Metric = function Metric(_ref) {
  var label = _ref.label,
      amount = _ref.amount,
      icon = _ref.icon,
      Tag = _ref.tag,
      classNames = _ref.classNames,
      styles = _ref.styles;

  var renderIcon = function renderIcon() {
    if (typeof icon === 'string') {
      return React__default.createElement(Icon$1, {
        name: icon,
        styles: styles.icon,
        size: 1.5
      });
    } else if (Array.isArray(icon)) {
      return React__default.createElement(Icon$1, {
        paths: icon,
        styles: styles.icon,
        size: 1.5
      });
    } else {
      return icon;
    }
  };

  return React__default.createElement(Tag, {
    className: "c11n-metric ".concat(classNames.root)
  }, renderIcon(), label && React__default.createElement("div", {
    className: classNames.label
  }, label), amount && React__default.createElement("div", {
    className: classNames.amount
  }, amount));
};

Metric.propTypes = {
  /**
   * The label to be displayed
   */
  label: propTypes.oneOfType([propTypes.string, propTypes.element]),

  /**
   * The actual amount
   */
  amount: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.element]).isRequired,

  /**
   * The icon to display above the metric
   */
  icon: propTypes.oneOfType([propTypes.string, propTypes.array, propTypes.element]),
  tag: propTypes.oneOfType([propTypes.string, propTypes.element, propTypes.func]),

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
Metric.defaultProps = {
  align: 'center',
  styles: {},
  tag: 'div'
};
var index$h = withStyles(styles$q)(Metric);

var styles$r = (function (_ref, _ref2) {
  var background = _ref.background,
      foreground = _ref.foreground,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      colors = _ref2.colors,
      justifyContent = _ref2.justifyContent;
  return {
    root: merge_1(_objectSpread2({
      display: 'flex',
      alignItems: 'flex-start'
    }, justifyContent('center'), {
      flexWrap: 'wrap',
      margin: rhythm(-1),
      color: foreground && colors[foreground],
      backgroundColor: background && colors[background],
      '& > *': {
        margin: rhythm(1)
      }
    }), styles)
  };
});

var MetricGroup = function MetricGroup(_ref) {
  var children = _ref.children,
      classNames = _ref.classNames;
  return React__default.createElement("div", {
    className: "c11n-metric-group ".concat(classNames.root)
  }, children);
};

MetricGroup.propTypes = {
  /**
   * The metrics to be displayed
   */
  children: propTypes.oneOfType([propTypes.element, propTypes.arrayOf(propTypes.element)]).isRequired,

  /**
   * The color to be used
   */
  foreground: propTypes.string,

  /**
   * The background color to be used
   */
  background: propTypes.string,

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
MetricGroup.defaultProps = {
  styles: {}
};
var index$i = withStyles(styles$r)(MetricGroup);

var tabbable_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findTabbableDescendants;
/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

var tabbableNode = /input|select|textarea|button|object/;

function hidesContents(element) {
  var zeroSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

  // If the node is empty, this is good enough
  if (zeroSize && !element.innerHTML) return true;

  // Otherwise we need to check some styles
  var style = window.getComputedStyle(element);
  return zeroSize ? style.getPropertyValue("overflow") !== "visible" : style.getPropertyValue("display") == "none";
}

function visible(element) {
  var parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) break;
    if (hidesContents(parentElement)) return false;
    parentElement = parentElement.parentNode;
  }
  return true;
}

function focusable(element, isTabIndexNotNaN) {
  var nodeName = element.nodeName.toLowerCase();
  var res = tabbableNode.test(nodeName) && !element.disabled || (nodeName === "a" ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
  return res && visible(element);
}

function tabbable(element) {
  var tabIndex = element.getAttribute("tabindex");
  if (tabIndex === null) tabIndex = undefined;
  var isTabIndexNaN = isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
}

function findTabbableDescendants(element) {
  return [].slice.call(element.querySelectorAll("*"), 0).filter(tabbable);
}
module.exports = exports["default"];
});

unwrapExports(tabbable_1);

var focusManager = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBlur = handleBlur;
exports.handleFocus = handleFocus;
exports.markForFocusLater = markForFocusLater;
exports.returnFocus = returnFocus;
exports.popWithoutFocus = popWithoutFocus;
exports.setupScopedFocus = setupScopedFocus;
exports.teardownScopedFocus = teardownScopedFocus;



var _tabbable2 = _interopRequireDefault(tabbable_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focusLaterElements = [];
var modalElement = null;
var needToFocus = false;

function handleBlur() {
  needToFocus = true;
}

function handleFocus() {
  if (needToFocus) {
    needToFocus = false;
    if (!modalElement) {
      return;
    }
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin, if it did, we could focus
    // the element outside of a setTimeout. Side-effect of this implementation
    // is that the document.body gets focus, and then we focus our element right
    // after, seems fine.
    setTimeout(function () {
      if (modalElement.contains(document.activeElement)) {
        return;
      }
      var el = (0, _tabbable2.default)(modalElement)[0] || modalElement;
      el.focus();
    }, 0);
  }
}

function markForFocusLater() {
  focusLaterElements.push(document.activeElement);
}

/* eslint-disable no-console */
function returnFocus() {
  var toFocus = null;
  try {
    if (focusLaterElements.length !== 0) {
      toFocus = focusLaterElements.pop();
      toFocus.focus();
    }
    return;
  } catch (e) {
    console.warn(["You tried to return focus to", toFocus, "but it is not in the DOM anymore"].join(" "));
  }
}
/* eslint-enable no-console */

function popWithoutFocus() {
  focusLaterElements.length > 0 && focusLaterElements.pop();
}

function setupScopedFocus(element) {
  modalElement = element;

  if (window.addEventListener) {
    window.addEventListener("blur", handleBlur, false);
    document.addEventListener("focus", handleFocus, true);
  } else {
    window.attachEvent("onBlur", handleBlur);
    document.attachEvent("onFocus", handleFocus);
  }
}

function teardownScopedFocus() {
  modalElement = null;

  if (window.addEventListener) {
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("focus", handleFocus);
  } else {
    window.detachEvent("onBlur", handleBlur);
    document.detachEvent("onFocus", handleFocus);
  }
}
});

unwrapExports(focusManager);
var focusManager_1 = focusManager.handleBlur;
var focusManager_2 = focusManager.handleFocus;
var focusManager_3 = focusManager.markForFocusLater;
var focusManager_4 = focusManager.returnFocus;
var focusManager_5 = focusManager.popWithoutFocus;
var focusManager_6 = focusManager.setupScopedFocus;
var focusManager_7 = focusManager.teardownScopedFocus;

var scopeTab_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scopeTab;



var _tabbable2 = _interopRequireDefault(tabbable_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scopeTab(node, event) {
  var tabbable = (0, _tabbable2.default)(node);

  if (!tabbable.length) {
    // Do nothing, since there are no elements that can receive focus.
    event.preventDefault();
    return;
  }

  var shiftKey = event.shiftKey;
  var head = tabbable[0];
  var tail = tabbable[tabbable.length - 1];

  // proceed with default browser behavior on tab.
  // Focus on last element on shift + tab.
  if (node === document.activeElement) {
    if (!shiftKey) return;
    target = tail;
  }

  var target;
  if (tail === document.activeElement && !shiftKey) {
    target = head;
  }

  if (head === document.activeElement && shiftKey) {
    target = tail;
  }

  if (target) {
    event.preventDefault();
    target.focus();
    return;
  }

  // Safari radio issue.
  //
  // Safari does not move the focus to the radio button,
  // so we need to force it to really walk through all elements.
  //
  // This is very error prone, since we are trying to guess
  // if it is a safari browser from the first occurence between
  // chrome or safari.
  //
  // The chrome user agent contains the first ocurrence
  // as the 'chrome/version' and later the 'safari/version'.
  var checkSafari = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);
  var isSafariDesktop = checkSafari != null && checkSafari[1] != "Chrome" && /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;

  // If we are not in safari desktop, let the browser control
  // the focus
  if (!isSafariDesktop) return;

  var x = tabbable.indexOf(document.activeElement);

  if (x > -1) {
    x += shiftKey ? -1 : 1;
  }

  // If the tabbable element does not exist,
  // focus head/tail based on shiftKey
  if (typeof tabbable[x] === "undefined") {
    event.preventDefault();
    target = shiftKey ? tail : head;
    target.focus();
    return;
  }

  event.preventDefault();

  tabbable[x].focus();
}
module.exports = exports["default"];
});

unwrapExports(scopeTab_1);

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = process.env.NODE_ENV !== 'production';

var warning$3 = function() {};

if (__DEV__) {
  var printWarning$3 = function printWarning(format, args) {
    var len = arguments.length;
    args = new Array(len > 1 ? len - 1 : 0);
    for (var key = 1; key < len; key++) {
      args[key - 1] = arguments[key];
    }
    var argIndex = 0;
    var message = 'Warning: ' +
      format.replace(/%s/g, function() {
        return args[argIndex++];
      });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning$3 = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
          '`warning(condition, format, ...args)` requires a warning ' +
          'message argument'
      );
    }
    if (!condition) {
      printWarning$3.apply(null, [format].concat(args));
    }
  };
}

var warning_1$1 = warning$3;

var exenv = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
/* global define */

(function () {

	var canUseDOM = !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);

	var ExecutionEnvironment = {

		canUseDOM: canUseDOM,

		canUseWorkers: typeof Worker !== 'undefined',

		canUseEventListeners:
			canUseDOM && !!(window.addEventListener || window.attachEvent),

		canUseViewport: canUseDOM && !!window.screen

	};

	if ( module.exports) {
		module.exports = ExecutionEnvironment;
	} else {
		window.ExecutionEnvironment = ExecutionEnvironment;
	}

}());
});

var safeHTMLElement = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDOM = undefined;



var _exenv2 = _interopRequireDefault(exenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EE = _exenv2.default;

var SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

var canUseDOM = exports.canUseDOM = EE.canUseDOM;

exports.default = SafeHTMLElement;
});

unwrapExports(safeHTMLElement);
var safeHTMLElement_1 = safeHTMLElement.canUseDOM;

var ariaAppHider = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertNodeList = assertNodeList;
exports.setElement = setElement;
exports.validateElement = validateElement;
exports.hide = hide;
exports.show = show;
exports.documentNotReadyOrSSRTesting = documentNotReadyOrSSRTesting;
exports.resetForTesting = resetForTesting;



var _warning2 = _interopRequireDefault(warning_1$1);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalElement = null;

function assertNodeList(nodeList, selector) {
  if (!nodeList || !nodeList.length) {
    throw new Error("react-modal: No elements were found for selector " + selector + ".");
  }
}

function setElement(element) {
  var useElement = element;
  if (typeof useElement === "string" && safeHTMLElement.canUseDOM) {
    var el = document.querySelectorAll(useElement);
    assertNodeList(el, useElement);
    useElement = "length" in el ? el[0] : el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

function validateElement(appElement) {
  if (!appElement && !globalElement) {
    (0, _warning2.default)(false, ["react-modal: App element is not defined.", "Please use `Modal.setAppElement(el)` or set `appElement={el}`.", "This is needed so screen readers don't see main content", "when modal is opened. It is not recommended, but you can opt-out", "by setting `ariaHideApp={false}`."].join(" "));

    return false;
  }

  return true;
}

function hide(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).setAttribute("aria-hidden", "true");
  }
}

function show(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).removeAttribute("aria-hidden");
  }
}

function documentNotReadyOrSSRTesting() {
  globalElement = null;
}

function resetForTesting() {
  globalElement = null;
}
});

unwrapExports(ariaAppHider);
var ariaAppHider_1 = ariaAppHider.assertNodeList;
var ariaAppHider_2 = ariaAppHider.setElement;
var ariaAppHider_3 = ariaAppHider.validateElement;
var ariaAppHider_4 = ariaAppHider.hide;
var ariaAppHider_5 = ariaAppHider.show;
var ariaAppHider_6 = ariaAppHider.documentNotReadyOrSSRTesting;
var ariaAppHider_7 = ariaAppHider.resetForTesting;

var classList = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dumpClassLists = dumpClassLists;
var htmlClassList = {};
var docBodyClassList = {};

function dumpClassLists() {
  if (process.env.NODE_ENV !== "production") {
    var classes = document.getElementsByTagName("html")[0].className;
    var buffer = "Show tracked classes:\n\n";

    buffer += "<html /> (" + classes + "):\n";
    for (var x in htmlClassList) {
      buffer += "  " + x + " " + htmlClassList[x] + "\n";
    }

    classes = document.body.className;

    // eslint-disable-next-line max-len
    buffer += "\n\ndoc.body (" + classes + "):\n";
    for (var _x in docBodyClassList) {
      buffer += "  " + _x + " " + docBodyClassList[_x] + "\n";
    }

    buffer += "\n";

    // eslint-disable-next-line no-console
    console.log(buffer);
  }
}

/**
 * Track the number of reference of a class.
 * @param {object} poll The poll to receive the reference.
 * @param {string} className The class name.
 * @return {string}
 */
var incrementReference = function incrementReference(poll, className) {
  if (!poll[className]) {
    poll[className] = 0;
  }
  poll[className] += 1;
  return className;
};

/**
 * Drop the reference of a class.
 * @param {object} poll The poll to receive the reference.
 * @param {string} className The class name.
 * @return {string}
 */
var decrementReference = function decrementReference(poll, className) {
  if (poll[className]) {
    poll[className] -= 1;
  }
  return className;
};

/**
 * Track a class and add to the given class list.
 * @param {Object} classListRef A class list of an element.
 * @param {Object} poll         The poll to be used.
 * @param {Array}  classes      The list of classes to be tracked.
 */
var trackClass = function trackClass(classListRef, poll, classes) {
  classes.forEach(function (className) {
    incrementReference(poll, className);
    classListRef.add(className);
  });
};

/**
 * Untrack a class and remove from the given class list if the reference
 * reaches 0.
 * @param {Object} classListRef A class list of an element.
 * @param {Object} poll         The poll to be used.
 * @param {Array}  classes      The list of classes to be untracked.
 */
var untrackClass = function untrackClass(classListRef, poll, classes) {
  classes.forEach(function (className) {
    decrementReference(poll, className);
    poll[className] === 0 && classListRef.remove(className);
  });
};

/**
 * Public inferface to add classes to the document.body.
 * @param {string} bodyClass The class string to be added.
 *                           It may contain more then one class
 *                           with ' ' as separator.
 */
var add = exports.add = function add(element, classString) {
  return trackClass(element.classList, element.nodeName.toLowerCase() == "html" ? htmlClassList : docBodyClassList, classString.split(" "));
};

/**
 * Public inferface to remove classes from the document.body.
 * @param {string} bodyClass The class string to be added.
 *                           It may contain more then one class
 *                           with ' ' as separator.
 */
var remove = exports.remove = function remove(element, classString) {
  return untrackClass(element.classList, element.nodeName.toLowerCase() == "html" ? htmlClassList : docBodyClassList, classString.split(" "));
};
});

unwrapExports(classList);
var classList_1 = classList.dumpClassLists;
var classList_2 = classList.add;
var classList_3 = classList.remove;

var ModalPortal_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React__default);



var _propTypes2 = _interopRequireDefault(propTypes);



var focusManager$1 = _interopRequireWildcard(focusManager);



var _scopeTab2 = _interopRequireDefault(scopeTab_1);



var ariaAppHider$1 = _interopRequireWildcard(ariaAppHider);



var classList$1 = _interopRequireWildcard(classList);



var _safeHTMLElement2 = _interopRequireDefault(safeHTMLElement);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// so that our CSS is statically analyzable
var CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

var TAB_KEY = 9;
var ESC_KEY = 27;

var ariaHiddenInstances = 0;

var ModalPortal = function (_Component) {
  _inherits(ModalPortal, _Component);

  function ModalPortal(props) {
    _classCallCheck(this, ModalPortal);

    var _this = _possibleConstructorReturn(this, (ModalPortal.__proto__ || Object.getPrototypeOf(ModalPortal)).call(this, props));

    _this.setOverlayRef = function (overlay) {
      _this.overlay = overlay;
      _this.props.overlayRef && _this.props.overlayRef(overlay);
    };

    _this.setContentRef = function (content) {
      _this.content = content;
      _this.props.contentRef && _this.props.contentRef(content);
    };

    _this.afterClose = function () {
      var _this$props = _this.props,
          appElement = _this$props.appElement,
          ariaHideApp = _this$props.ariaHideApp,
          htmlOpenClassName = _this$props.htmlOpenClassName,
          bodyOpenClassName = _this$props.bodyOpenClassName;

      // Remove classes.

      bodyOpenClassName && classList$1.remove(document.body, bodyOpenClassName);

      htmlOpenClassName && classList$1.remove(document.getElementsByTagName("html")[0], htmlOpenClassName);

      // Reset aria-hidden attribute if all modals have been removed
      if (ariaHideApp && ariaHiddenInstances > 0) {
        ariaHiddenInstances -= 1;

        if (ariaHiddenInstances === 0) {
          ariaAppHider$1.show(appElement);
        }
      }

      if (_this.props.shouldFocusAfterRender) {
        if (_this.props.shouldReturnFocusAfterClose) {
          focusManager$1.returnFocus();
          focusManager$1.teardownScopedFocus();
        } else {
          focusManager$1.popWithoutFocus();
        }
      }

      if (_this.props.onAfterClose) {
        _this.props.onAfterClose();
      }
    };

    _this.open = function () {
      _this.beforeOpen();
      if (_this.state.afterOpen && _this.state.beforeClose) {
        clearTimeout(_this.closeTimer);
        _this.setState({ beforeClose: false });
      } else {
        if (_this.props.shouldFocusAfterRender) {
          focusManager$1.setupScopedFocus(_this.node);
          focusManager$1.markForFocusLater();
        }

        _this.setState({ isOpen: true }, function () {
          _this.setState({ afterOpen: true });

          if (_this.props.isOpen && _this.props.onAfterOpen) {
            _this.props.onAfterOpen();
          }
        });
      }
    };

    _this.close = function () {
      if (_this.props.closeTimeoutMS > 0) {
        _this.closeWithTimeout();
      } else {
        _this.closeWithoutTimeout();
      }
    };

    _this.focusContent = function () {
      return _this.content && !_this.contentHasFocus() && _this.content.focus();
    };

    _this.closeWithTimeout = function () {
      var closesAt = Date.now() + _this.props.closeTimeoutMS;
      _this.setState({ beforeClose: true, closesAt: closesAt }, function () {
        _this.closeTimer = setTimeout(_this.closeWithoutTimeout, _this.state.closesAt - Date.now());
      });
    };

    _this.closeWithoutTimeout = function () {
      _this.setState({
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      }, _this.afterClose);
    };

    _this.handleKeyDown = function (event) {
      if (event.keyCode === TAB_KEY) {
        (0, _scopeTab2.default)(_this.content, event);
      }

      if (_this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
        event.stopPropagation();
        _this.requestClose(event);
      }
    };

    _this.handleOverlayOnClick = function (event) {
      if (_this.shouldClose === null) {
        _this.shouldClose = true;
      }

      if (_this.shouldClose && _this.props.shouldCloseOnOverlayClick) {
        if (_this.ownerHandlesClose()) {
          _this.requestClose(event);
        } else {
          _this.focusContent();
        }
      }
      _this.shouldClose = null;
    };

    _this.handleContentOnMouseUp = function () {
      _this.shouldClose = false;
    };

    _this.handleOverlayOnMouseDown = function (event) {
      if (!_this.props.shouldCloseOnOverlayClick && event.target == _this.overlay) {
        event.preventDefault();
      }
    };

    _this.handleContentOnClick = function () {
      _this.shouldClose = false;
    };

    _this.handleContentOnMouseDown = function () {
      _this.shouldClose = false;
    };

    _this.requestClose = function (event) {
      return _this.ownerHandlesClose() && _this.props.onRequestClose(event);
    };

    _this.ownerHandlesClose = function () {
      return _this.props.onRequestClose;
    };

    _this.shouldBeClosed = function () {
      return !_this.state.isOpen && !_this.state.beforeClose;
    };

    _this.contentHasFocus = function () {
      return document.activeElement === _this.content || _this.content.contains(document.activeElement);
    };

    _this.buildClassName = function (which, additional) {
      var classNames = (typeof additional === "undefined" ? "undefined" : _typeof(additional)) === "object" ? additional : {
        base: CLASS_NAMES[which],
        afterOpen: CLASS_NAMES[which] + "--after-open",
        beforeClose: CLASS_NAMES[which] + "--before-close"
      };
      var className = classNames.base;
      if (_this.state.afterOpen) {
        className = className + " " + classNames.afterOpen;
      }
      if (_this.state.beforeClose) {
        className = className + " " + classNames.beforeClose;
      }
      return typeof additional === "string" && additional ? className + " " + additional : className;
    };

    _this.attributesFromObject = function (prefix, items) {
      return Object.keys(items).reduce(function (acc, name) {
        acc[prefix + "-" + name] = items[name];
        return acc;
      }, {});
    };

    _this.state = {
      afterOpen: false,
      beforeClose: false
    };

    _this.shouldClose = null;
    _this.moveFromContentToOverlay = null;
    return _this;
  }

  _createClass(ModalPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.isOpen) {
        this.open();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (process.env.NODE_ENV !== "production") {
        if (prevProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
          // eslint-disable-next-line no-console
          console.warn('React-Modal: "bodyOpenClassName" prop has been modified. ' + "This may cause unexpected behavior when multiple modals are open.");
        }
        if (prevProps.htmlOpenClassName !== this.props.htmlOpenClassName) {
          // eslint-disable-next-line no-console
          console.warn('React-Modal: "htmlOpenClassName" prop has been modified. ' + "This may cause unexpected behavior when multiple modals are open.");
        }
      }

      if (this.props.isOpen && !prevProps.isOpen) {
        this.open();
      } else if (!this.props.isOpen && prevProps.isOpen) {
        this.close();
      }

      // Focus only needs to be set once when the modal is being opened
      if (this.props.shouldFocusAfterRender && this.state.isOpen && !prevState.isOpen) {
        this.focusContent();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.isOpen) {
        this.afterClose();
      }
      clearTimeout(this.closeTimer);
    }
  }, {
    key: "beforeOpen",
    value: function beforeOpen() {
      var _props = this.props,
          appElement = _props.appElement,
          ariaHideApp = _props.ariaHideApp,
          htmlOpenClassName = _props.htmlOpenClassName,
          bodyOpenClassName = _props.bodyOpenClassName;

      // Add classes.

      bodyOpenClassName && classList$1.add(document.body, bodyOpenClassName);

      htmlOpenClassName && classList$1.add(document.getElementsByTagName("html")[0], htmlOpenClassName);

      if (ariaHideApp) {
        ariaHiddenInstances += 1;
        ariaAppHider$1.hide(appElement);
      }
    }

    // Don't steal focus from inner elements

  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          id = _props2.id,
          className = _props2.className,
          overlayClassName = _props2.overlayClassName,
          defaultStyles = _props2.defaultStyles;

      var contentStyles = className ? {} : defaultStyles.content;
      var overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

      return this.shouldBeClosed() ? null : _react2.default.createElement(
        "div",
        {
          ref: this.setOverlayRef,
          className: this.buildClassName("overlay", overlayClassName),
          style: _extends({}, overlayStyles, this.props.style.overlay),
          onClick: this.handleOverlayOnClick,
          onMouseDown: this.handleOverlayOnMouseDown
        },
        _react2.default.createElement(
          "div",
          _extends({
            id: id,
            ref: this.setContentRef,
            style: _extends({}, contentStyles, this.props.style.content),
            className: this.buildClassName("content", className),
            tabIndex: "-1",
            onKeyDown: this.handleKeyDown,
            onMouseDown: this.handleContentOnMouseDown,
            onMouseUp: this.handleContentOnMouseUp,
            onClick: this.handleContentOnClick,
            role: this.props.role,
            "aria-label": this.props.contentLabel
          }, this.attributesFromObject("aria", this.props.aria || {}), this.attributesFromObject("data", this.props.data || {}), {
            "data-testid": this.props.testId
          }),
          this.props.children
        )
      );
    }
  }]);

  return ModalPortal;
}(React__default.Component);

ModalPortal.defaultProps = {
  style: {
    overlay: {},
    content: {}
  },
  defaultStyles: {}
};
ModalPortal.propTypes = {
  isOpen: _propTypes2.default.bool.isRequired,
  defaultStyles: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  style: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  overlayClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  bodyOpenClassName: _propTypes2.default.string,
  htmlOpenClassName: _propTypes2.default.string,
  ariaHideApp: _propTypes2.default.bool,
  appElement: _propTypes2.default.instanceOf(_safeHTMLElement2.default),
  onAfterOpen: _propTypes2.default.func,
  onAfterClose: _propTypes2.default.func,
  onRequestClose: _propTypes2.default.func,
  closeTimeoutMS: _propTypes2.default.number,
  shouldFocusAfterRender: _propTypes2.default.bool,
  shouldCloseOnOverlayClick: _propTypes2.default.bool,
  shouldReturnFocusAfterClose: _propTypes2.default.bool,
  role: _propTypes2.default.string,
  contentLabel: _propTypes2.default.string,
  aria: _propTypes2.default.object,
  data: _propTypes2.default.object,
  children: _propTypes2.default.node,
  shouldCloseOnEsc: _propTypes2.default.bool,
  overlayRef: _propTypes2.default.func,
  contentRef: _propTypes2.default.func,
  id: _propTypes2.default.string,
  testId: _propTypes2.default.string
};
exports.default = ModalPortal;
module.exports = exports["default"];
});

unwrapExports(ModalPortal_1);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function componentWillMount() {
  // Call this.constructor.gDSFP to support sub-classes.
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== undefined) {
    this.setState(state);
  }
}

function componentWillReceiveProps(nextProps) {
  // Call this.constructor.gDSFP to support sub-classes.
  // Use the setState() updater to ensure state isn't stale in certain edge cases.
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== undefined ? state : null;
  }
  // Binding "this" is important for shallow renderer support.
  this.setState(updater.bind(this));
}

function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}

// React may warn about cWM/cWRP/cWU methods being deprecated.
// Add a flag to suppress these warnings for this special case.
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

function polyfill(Component) {
  var prototype = Component.prototype;

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  }

  if (
    typeof Component.getDerivedStateFromProps !== 'function' &&
    typeof prototype.getSnapshotBeforeUpdate !== 'function'
  ) {
    return Component;
  }

  // If new component APIs are defined, "unsafe" lifecycles won't be called.
  // Error if any of these lifecycles are present,
  // Because they would work differently between older and newer (16.3+) versions of React.
  var foundWillMountName = null;
  var foundWillReceivePropsName = null;
  var foundWillUpdateName = null;
  if (typeof prototype.componentWillMount === 'function') {
    foundWillMountName = 'componentWillMount';
  } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
    foundWillMountName = 'UNSAFE_componentWillMount';
  }
  if (typeof prototype.componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'componentWillReceiveProps';
  } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
  }
  if (typeof prototype.componentWillUpdate === 'function') {
    foundWillUpdateName = 'componentWillUpdate';
  } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
    foundWillUpdateName = 'UNSAFE_componentWillUpdate';
  }
  if (
    foundWillMountName !== null ||
    foundWillReceivePropsName !== null ||
    foundWillUpdateName !== null
  ) {
    var componentName = Component.displayName || Component.name;
    var newApiName =
      typeof Component.getDerivedStateFromProps === 'function'
        ? 'getDerivedStateFromProps()'
        : 'getSnapshotBeforeUpdate()';

    throw Error(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        componentName +
        ' uses ' +
        newApiName +
        ' but also contains the following legacy lifecycles:' +
        (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
        (foundWillReceivePropsName !== null
          ? '\n  ' + foundWillReceivePropsName
          : '') +
        (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
        '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks'
    );
  }

  // React <= 16.2 does not support static getDerivedStateFromProps.
  // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
  // Newer versions of React will ignore these lifecycles if gDSFP exists.
  if (typeof Component.getDerivedStateFromProps === 'function') {
    prototype.componentWillMount = componentWillMount;
    prototype.componentWillReceiveProps = componentWillReceiveProps;
  }

  // React <= 16.2 does not support getSnapshotBeforeUpdate.
  // As a workaround, use cWU to invoke the new lifecycle.
  // Newer versions of React will ignore that lifecycle if gSBU exists.
  if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
    if (typeof prototype.componentDidUpdate !== 'function') {
      throw new Error(
        'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
      );
    }

    prototype.componentWillUpdate = componentWillUpdate;

    var componentDidUpdate = prototype.componentDidUpdate;

    prototype.componentDidUpdate = function componentDidUpdatePolyfill(
      prevProps,
      prevState,
      maybeSnapshot
    ) {
      // 16.3+ will not execute our will-update method;
      // It will pass a snapshot value to did-update though.
      // Older versions will require our polyfilled will-update value.
      // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
      // Because for <= 15.x versions this might be a "prevContext" object.
      // We also can't just check "__reactInternalSnapshot",
      // Because get-snapshot might return a falsy value.
      // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
      var snapshot = this.__reactInternalSnapshotFlag
        ? this.__reactInternalSnapshot
        : maybeSnapshot;

      componentDidUpdate.call(this, prevProps, prevState, snapshot);
    };
  }

  return Component;
}

var reactLifecyclesCompat_es = /*#__PURE__*/Object.freeze({
  __proto__: null,
  polyfill: polyfill
});

var Modal_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bodyOpenClassName = exports.portalClassName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React__default);



var _reactDom2 = _interopRequireDefault(reactDom__default);



var _propTypes2 = _interopRequireDefault(propTypes);



var _ModalPortal2 = _interopRequireDefault(ModalPortal_1);



var ariaAppHider$1 = _interopRequireWildcard(ariaAppHider);



var _safeHTMLElement2 = _interopRequireDefault(safeHTMLElement);



function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var portalClassName = exports.portalClassName = "ReactModalPortal";
var bodyOpenClassName = exports.bodyOpenClassName = "ReactModal__Body--open";

var isReact16 = _reactDom2.default.createPortal !== undefined;

var getCreatePortal = function getCreatePortal() {
  return isReact16 ? _reactDom2.default.createPortal : _reactDom2.default.unstable_renderSubtreeIntoContainer;
};

function getParentElement(parentSelector) {
  return parentSelector();
}

var Modal = function (_Component) {
  _inherits(Modal, _Component);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.removePortal = function () {
      !isReact16 && _reactDom2.default.unmountComponentAtNode(_this.node);
      var parent = getParentElement(_this.props.parentSelector);
      parent.removeChild(_this.node);
    }, _this.portalRef = function (ref) {
      _this.portal = ref;
    }, _this.renderPortal = function (props) {
      var createPortal = getCreatePortal();
      var portal = createPortal(_this, _react2.default.createElement(_ModalPortal2.default, _extends({ defaultStyles: Modal.defaultStyles }, props)), _this.node);
      _this.portalRef(portal);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!safeHTMLElement.canUseDOM) return;

      if (!isReact16) {
        this.node = document.createElement("div");
      }
      this.node.className = this.props.portalClassName;

      var parent = getParentElement(this.props.parentSelector);
      parent.appendChild(this.node);

      !isReact16 && this.renderPortal(this.props);
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps) {
      var prevParent = getParentElement(prevProps.parentSelector);
      var nextParent = getParentElement(this.props.parentSelector);
      return { prevParent: prevParent, nextParent: nextParent };
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, _, snapshot) {
      if (!safeHTMLElement.canUseDOM) return;
      var _props = this.props,
          isOpen = _props.isOpen,
          portalClassName = _props.portalClassName;


      if (prevProps.portalClassName !== portalClassName) {
        this.node.className = portalClassName;
      }

      var prevParent = snapshot.prevParent,
          nextParent = snapshot.nextParent;

      if (nextParent !== prevParent) {
        prevParent.removeChild(this.node);
        nextParent.appendChild(this.node);
      }

      // Stop unnecessary renders if modal is remaining closed
      if (!prevProps.isOpen && !isOpen) return;

      !isReact16 && this.renderPortal(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!safeHTMLElement.canUseDOM || !this.node || !this.portal) return;

      var state = this.portal.state;
      var now = Date.now();
      var closesAt = state.isOpen && this.props.closeTimeoutMS && (state.closesAt || now + this.props.closeTimeoutMS);

      if (closesAt) {
        if (!state.beforeClose) {
          this.portal.closeWithTimeout();
        }

        setTimeout(this.removePortal, closesAt - now);
      } else {
        this.removePortal();
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!safeHTMLElement.canUseDOM || !isReact16) {
        return null;
      }

      if (!this.node && isReact16) {
        this.node = document.createElement("div");
      }

      var createPortal = getCreatePortal();
      return createPortal(_react2.default.createElement(_ModalPortal2.default, _extends({
        ref: this.portalRef,
        defaultStyles: Modal.defaultStyles
      }, this.props)), this.node);
    }
  }], [{
    key: "setAppElement",
    value: function setAppElement(element) {
      ariaAppHider$1.setElement(element);
    }

    /* eslint-disable react/no-unused-prop-types */

    /* eslint-enable react/no-unused-prop-types */

  }]);

  return Modal;
}(React__default.Component);

Modal.propTypes = {
  isOpen: _propTypes2.default.bool.isRequired,
  style: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  portalClassName: _propTypes2.default.string,
  bodyOpenClassName: _propTypes2.default.string,
  htmlOpenClassName: _propTypes2.default.string,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
    base: _propTypes2.default.string.isRequired,
    afterOpen: _propTypes2.default.string.isRequired,
    beforeClose: _propTypes2.default.string.isRequired
  })]),
  overlayClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
    base: _propTypes2.default.string.isRequired,
    afterOpen: _propTypes2.default.string.isRequired,
    beforeClose: _propTypes2.default.string.isRequired
  })]),
  appElement: _propTypes2.default.instanceOf(_safeHTMLElement2.default),
  onAfterOpen: _propTypes2.default.func,
  onRequestClose: _propTypes2.default.func,
  closeTimeoutMS: _propTypes2.default.number,
  ariaHideApp: _propTypes2.default.bool,
  shouldFocusAfterRender: _propTypes2.default.bool,
  shouldCloseOnOverlayClick: _propTypes2.default.bool,
  shouldReturnFocusAfterClose: _propTypes2.default.bool,
  parentSelector: _propTypes2.default.func,
  aria: _propTypes2.default.object,
  data: _propTypes2.default.object,
  role: _propTypes2.default.string,
  contentLabel: _propTypes2.default.string,
  shouldCloseOnEsc: _propTypes2.default.bool,
  overlayRef: _propTypes2.default.func,
  contentRef: _propTypes2.default.func
};
Modal.defaultProps = {
  isOpen: false,
  portalClassName: portalClassName,
  bodyOpenClassName: bodyOpenClassName,
  role: "dialog",
  ariaHideApp: true,
  closeTimeoutMS: 0,
  shouldFocusAfterRender: true,
  shouldCloseOnEsc: true,
  shouldCloseOnOverlayClick: true,
  shouldReturnFocusAfterClose: true,
  parentSelector: function parentSelector() {
    return document.body;
  }
};
Modal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },
  content: {
    position: "absolute",
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
};


(0, reactLifecyclesCompat_es.polyfill)(Modal);

exports.default = Modal;
});

unwrapExports(Modal_1);
var Modal_2 = Modal_1.bodyOpenClassName;
var Modal_3 = Modal_1.portalClassName;

var lib$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



var _Modal2 = _interopRequireDefault(Modal_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Modal2.default;
module.exports = exports["default"];
});

var ReactModal = unwrapExports(lib$2);

var styles$s = (function (_ref, _ref2) {
  var spacing = _ref.spacing,
      styles = _ref.styles;
  var calculateSpacing = _ref2.calculateSpacing,
      rhythm = _ref2.rhythm;
  var defaultStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100vw - 2rem)',
      maxHeight: 'calc(100vh - 2rem)',
      border: '1px solid #ccc',
      background: '#fff',
      maxWidth: '40rem',
      overflow: 'hidden',
      borderRadius: '4px',
      outline: 'none',
      padding: '0'
    },
    container: _objectSpread2({}, calculateSpacing(spacing), {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 2rem)'
    }),
    close: {
      position: 'absolute',
      zIndex: 100,
      top: rhythm(0.75),
      right: rhythm(0.75)
    }
  };
  return merge_1(defaultStyles, styles);
});

/**
 * Uses React Modal - https://github.com/reactjs/react-modal
 */

var Modal =
/*#__PURE__*/
function (_Component) {
  _inherits(Modal, _Component);

  function Modal() {
    _classCallCheck(this, Modal);

    return _possibleConstructorReturn(this, _getPrototypeOf(Modal).apply(this, arguments));
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var appElement = this.props.appElement;

      if (appElement) {
        ReactModal.setAppElement(appElement);
      }

      this.calculateDocumentScroll(this.props);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.isOpen !== this.props.isOpen) {
        this.calculateDocumentScroll(nextProps);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.calculateDocumentScroll({
        isOpen: false
      });
    }
  }, {
    key: "calculateDocumentScroll",
    value: function calculateDocumentScroll(props) {
      if (!props.enableDocumentScroll) {
        window.document.body.style.overflow = props.isOpen ? 'hidden' : 'auto';
        window.document.documentElement.style.overflow = props.isOpen ? 'hidden' : 'auto';
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          appElement = _this$props.appElement,
          children = _this$props.children,
          closeIcon = _this$props.closeIcon,
          classNames = _this$props.classNames,
          styles = _this$props.styles,
          props = _objectWithoutProperties(_this$props, ["appElement", "children", "closeIcon", "classNames", "styles"]);

      return React__default.createElement(ReactModal, _extends({
        style: {
          overlay: styles.overlay,
          content: styles.content
        },
        className: {
          base: 'c11n-modal',
          afterOpen: 'c11n-modal-after-open',
          beforeClose: 'c11n-modal-before-close'
        },
        overlayClassName: {
          base: 'c11n-modal-overlay',
          afterOpen: 'c11n-modal-overlay-after-open',
          beforeClose: 'c11n-modal-overlay-before-close'
        }
      }, props), closeIcon && React__default.createElement("button", {
        className: classNames.close,
        onClick: props.onRequestClose,
        "aria-label": "Close",
        children: closeIcon
      }), React__default.createElement("div", {
        className: classNames.container
      }, children));
    }
  }]);

  return Modal;
}(React.Component);

Modal.propTypes = {
  /**
   * A valid query selector for the element your React app is mounted to
   */
  appElement: propTypes.string,

  /**
   * The content of the modal
   */
  children: propTypes.any.isRequired,

  /**
   * Number indicating the milliseconds to wait before closing the modal.
   */
  closeTimeoutMS: propTypes.number,

  /**
   * A react-modal required prop for accessibility
   */
  contentLabel: propTypes.string.isRequired,

  /**
   * The close icon (set to false to hide)
   */
  closeIcon: propTypes.any,

  /**
   * Specifies whether the modal is open or not
   */
  isOpen: propTypes.bool,

  /**
   * Function that will be run after the modal has opened.
   */
  onAfterOpen: propTypes.func,

  /**
   * The callback to call when the modal should be closed
   */
  onRequestClose: propTypes.func,

  /**
   * Specifies whether the modal closes on clicking overlay
   */
  shouldCloseOnOverlayClick: propTypes.bool,

  /**
   * A spacing object to determine the padding within the modal
   */
  spacing: propTypes.oneOfType([propTypes.object, propTypes.number]),

  /**
   * Custom styles for the overlay, content, container or close
   */
  styles: propTypes.object,

  /**
   * Enable scroll of document when modal is open
   */
  enableDocumentScroll: propTypes.bool
};
Modal.defaultProps = {
  appElement: '#mount',
  closeIcon: React__default.createElement(Icon$1, {
    name: "close"
  }),
  shouldCloseOnOverlayClick: true,
  spacing: 1,
  styles: {}
};
var index$j = withStyles(styles$s)(Modal);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil$1 = Math.ceil,
    nativeMax$3 = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? _isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax$3(toInteger_1(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil$1(length / size));

  while (index < length) {
    result[resIndex++] = _baseSlice(array, index, (index += size));
  }
  return result;
}

var chunk_1 = chunk;

var words = {
  ones: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
  teens: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
};
var numberToWords = (function () {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  if (typeof number !== 'number' || isNaN(number) || number === 0) {
    return 'zero';
  } else {
    var numberAsArray = number.toString().split('');
    var groupsOfHundreds = groupIntoHundreds(numberAsArray);

    if (groupsOfHundreds.length > 3) {
      return 'number is too large';
    }

    return convert(groupsOfHundreds);
  }
});

var sizes = function sizes(arrayLength) {
  switch (arrayLength) {
    case 1:
      return [''];

    case 2:
      return ['thousand', ''];

    case 3:
      return ['million', 'thousand', ''];
  }
};

var groupHasValue = function groupHasValue(group) {
  return group.some(function (number) {
    return number !== '0';
  });
};

var convert = function convert(groupsOfHundreds) {
  return groupsOfHundreds.map(function (group, i) {
    var isLast = groupsOfHundreds.length > 1 && groupsOfHundreds.length - 1 === i;
    return groupHasValue(group) ? "".concat(convertHundreds(group, isLast), " ").concat(sizes(groupsOfHundreds.length)[i]) : '';
  }).join(' ').replace(/\s{2,}/g, ' ').trim();
};

var convertHundreds = function convertHundreds(group, isLast) {
  var tensInt = parseInt(group[1] + group[2]);
  var tensWord = convertTensAndOnes(tensInt);
  var hundredsInt = parseInt(group[0]);
  var hundredsWord = hundredsInt > 0 ? "".concat(words.ones[hundredsInt], " hundred") : '';
  var and = (hundredsInt || isLast) && tensInt ? 'and' : '';
  return "".concat(hundredsWord, " ").concat(and, " ").concat(tensWord);
};

var convertTensAndOnes = function convertTensAndOnes(tens) {
  if (tens < 10) return words.ones[tens];else if (tens >= 10 && tens < 20) {
    return words.teens[tens - 10];
  } else {
    var tensWord = words.tens[Math.floor(tens / 10)];
    var onesWord = words.ones[tens % 10];
    var hyphen = tensWord !== '' && onesWord !== '';
    return "".concat(tensWord).concat(hyphen ? '-' : '').concat(onesWord);
  }
};

var groupIntoHundreds = function groupIntoHundreds(numberArray) {
  var one, tens, hundreds;

  switch (numberArray.length % 3) {
    case 1:

      var _numberArray = _toArray(numberArray);

      one = _numberArray[0];
      hundreds = _numberArray.slice(1);
      return [['0', '0', one]].concat(_toConsumableArray(chunk_1(hundreds, 3)));

    case 2:

      var _numberArray2 = _toArray(numberArray);

      tens = _numberArray2[0];
      one = _numberArray2[1];
      hundreds = _numberArray2.slice(2);
      return [['0', tens, one]].concat(_toConsumableArray(chunk_1(hundreds, 3)));

    default:
      return chunk_1(numberArray, 3);
  }
};

var NumberToWords = function NumberToWords(_ref) {
  var number = _ref.number,
      Tag = _ref.tag,
      props = _objectWithoutProperties(_ref, ["number", "tag"]);

  return React__default.createElement(Tag, props, numberToWords(number));
};

NumberToWords.defaultProps = {
  number: 0,
  tag: 'span'
};
NumberToWords.propTypes = {
  /**
   * the number to be converted
   */
  number: propTypes.number.isRequired,

  /**
   * The tag or component to be used e.g. span, div
   */
  tag: propTypes.oneOfType([propTypes.string, propTypes.element, propTypes.func])
};

var Pagination =
/*#__PURE__*/
function (_Component) {
  _inherits(Pagination, _Component);

  function Pagination() {
    var _this;

    _classCallCheck(this, Pagination);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Pagination).apply(this, arguments));
    _this.state = {
      pageNumber: 0,
      allPages: _this.paginate(_this.props.toPaginate)
    };
    _this.paginate = _this.paginate.bind(_assertThisInitialized(_this));
    _this.handlePagintionClick = _this.handlePaginationClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Pagination, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var toPaginate = _ref.toPaginate;

      if (this.props.persistPage) {
        this.setState({
          allPages: this.paginate(toPaginate)
        });
      } else {
        this.setState({
          pageNumber: 0,
          allPages: this.paginate(toPaginate)
        });
      }
    }
  }, {
    key: "paginate",
    value: function paginate(toPaginate) {
      var _this$props$max = this.props.max,
          max = _this$props$max === void 0 ? 10 : _this$props$max;
      return chunk_1(toPaginate, max);
    }
  }, {
    key: "handlePaginationClick",
    value: function handlePaginationClick(val) {
      var _this2 = this;

      var _this$state = this.state,
          allPages = _this$state.allPages,
          pageNumber = _this$state.pageNumber;
      var canNext = pageNumber + 1 < allPages.length;
      var canPrev = pageNumber > 0;

      var changePage = function changePage() {
        return _this2.setState({
          pageNumber: pageNumber + val
        });
      };

      if (val > 0) {
        return canNext ? changePage : null;
      } else {
        return canPrev ? changePage : null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          allPages = _this$state2.allPages,
          pageNumber = _this$state2.pageNumber;

      if (allPages.length) {
        return React__default.createElement("div", null, this.props.children({
          allPages: allPages,
          currentPage: allPages[pageNumber],
          numberOfPages: allPages.length,
          pageIndex: this.state.pageNumber,
          pageNumber: this.state.pageNumber + 1,
          pageOf: "Page ".concat(this.state.pageNumber + 1, " of ").concat(allPages.length),
          isPaginated: allPages.length > 1,
          canNext: pageNumber + 1 < allPages.length,
          canPrev: pageNumber > 0,
          next: this.handlePaginationClick(+1),
          prev: this.handlePaginationClick(-1)
        }));
      } else return null;
    }
  }]);

  return Pagination;
}(React.Component);
Pagination.defaultProps = {
  max: 10
};
Pagination.propTypes = {
  /**
   * The array to be paginated
   */
  toPaginate: propTypes.array.isRequired,

  /**
   * The max amount of items per page
   */
  max: propTypes.number,

  /**
   * A render prop that gets called with the paginated data and methods to control it.
   */
  children: propTypes.func.isRequired,

  /**
   * Prevents the page number being reset when toPaginate changes
   */
  persistPage: propTypes.bool
};

var styles$t = (function (_ref, _ref2) {
  var background = _ref.background,
      fill = _ref.fill,
      radius = _ref.radius,
      _ref$progress = _ref.progress,
      progress = _ref$progress === void 0 ? 0 : _ref$progress,
      styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      colors = _ref2.colors,
      radiuses = _ref2.radiuses;
  var defaultStyles = {
    root: {
      background: colors[background],
      borderRadius: rhythm(radiuses[radius]),
      height: rhythm(1),
      position: 'relative'
    },
    fill: {
      background: colors[fill],
      borderRadius: rhythm(radiuses[radius]),
      position: 'absolute',
      top: 0,
      left: 0,
      width: "".concat(progress, "%"),
      maxWidth: '100%',
      height: rhythm(1)
    },
    alt: {
      position: 'absolute',
      left: '-10000px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }
  };
  return merge_1(defaultStyles, styles);
});

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = _createAssigner(function(object, source, srcIndex, customizer) {
  _copyObject(source, keysIn_1(source), object, customizer);
});

var assignInWith_1 = assignInWith;

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag$3 = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike_1(value)) {
    return false;
  }
  var tag = _baseGetTag(value);
  return tag == errorTag$3 || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject_1(value));
}

var isError_1 = isError;

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */
var attempt = _baseRest(function(func, args) {
  try {
    return _apply(func, undefined, args);
  } catch (e) {
    return isError_1(e) ? e : new Error(e);
  }
});

var attempt_1 = attempt;

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return _arrayMap(props, function(key) {
    return object[key];
  });
}

var _baseValues = baseValues;

/** Used for built-in method references. */
var objectProto$j = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$h = objectProto$j.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq_1(objValue, objectProto$j[key]) && !hasOwnProperty$h.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

var _customDefaultsAssignIn = customDefaultsAssignIn;

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

var _escapeStringChar = escapeStringChar;

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

var _reInterpolate = reInterpolate;

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

var _basePropertyOf = basePropertyOf;

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = _basePropertyOf(htmlEscapes);

var _escapeHtmlChar = escapeHtmlChar;

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString_1(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, _escapeHtmlChar)
    : string;
}

var _escape = escape;

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;

var _reEscape = reEscape;

/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;

var _reEvaluate = reEvaluate;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': _reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': _reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': _reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': { 'escape': _escape }
  }
};

var templateSettings_1 = templateSettings;

/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/** Used for built-in method references. */
var objectProto$k = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$i = objectProto$k.hasOwnProperty;

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES template literal delimiter as an "interpolate" delimiter.
 * // Disable support by replacing the "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings_1.imports._.templateSettings || templateSettings_1;

  if (guard && _isIterateeCall(string, options, guard)) {
    options = undefined;
  }
  string = toString_1(string);
  options = assignInWith_1({}, options, settings, _customDefaultsAssignIn);

  var imports = assignInWith_1({}, options.imports, settings.imports, _customDefaultsAssignIn),
      importsKeys = keys_1(imports),
      importsValues = _baseValues(imports, importsKeys);

  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === _reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  // Use a sourceURL for easier debugging.
  // The sourceURL gets injected into the source that's eval-ed, so be careful
  // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
  // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.
  var sourceURL = hasOwnProperty$i.call(options, 'sourceURL')
    ? ('//# sourceURL=' +
       (options.sourceURL + '').replace(/[\r\n]/g, ' ') +
       '\n')
    : '';

  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // Escape characters that can't be included in string literals.
    source += string.slice(index, offset).replace(reUnescapedString, _escapeStringChar);

    // Replace delimiters with snippets.
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.
    return match;
  });

  source += "';\n";

  // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  // Like with sourceURL, we take care to not check the option's prototype,
  // as this configuration is a code injection vector.
  var variable = hasOwnProperty$i.call(options, 'variable') && options.variable;
  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }
  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source = 'function(' + (variable || 'obj') + ') {\n' +
    (variable
      ? ''
      : 'obj || (obj = {});\n'
    ) +
    "var __t, __p = ''" +
    (isEscaping
       ? ', __e = _.escape'
       : ''
    ) +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  var result = attempt_1(function() {
    return Function(importsKeys, sourceURL + 'return ' + source)
      .apply(undefined, importsValues);
  });

  // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.
  result.source = source;
  if (isError_1(result)) {
    throw result;
  }
  return result;
}

var template_1 = template;

var altTemplate = function altTemplate(str, progress) {
  var compileTemplate = template_1(str);
  return compileTemplate({
    progress: progress
  });
};

var ProgressBar = function ProgressBar(_ref) {
  var classNames = _ref.classNames,
      alt = _ref.alt,
      _ref$progress = _ref.progress,
      progress = _ref$progress === void 0 ? 0 : _ref$progress;
  return React__default.createElement("div", {
    className: "c11n-progress-bar ".concat(classNames.root)
  }, React__default.createElement("div", {
    className: classNames.fill,
    "aria-hidden": true
  }), React__default.createElement("div", {
    className: classNames.alt
  }, altTemplate(alt, progress)));
};

ProgressBar.propTypes = {
  /**
   * The alt text for the progress bar. Takes a `progress` value in a valid [Lodash Template](https://lodash.com/docs/4.17.4#template). E.g. `'<%= progress %>% there'`
   */
  alt: propTypes.string.isRequired,

  /**
   * The progress amount (percentage)
   */
  progress: propTypes.number.isRequired,

  /**
   * The fill color of the progress bar -
   */
  fill: propTypes.string,

  /**
   * The background color of the progress bar -
   */
  background: propTypes.string,

  /**
   * The border radius of the progress bar -
   */
  radius: propTypes.string,

  /**
   * Custom styles to be applied to the progress bar
   */
  styles: propTypes.object
};
ProgressBar.defaultProps = {
  fill: 'primary',
  background: 'shade',
  radius: 'small',
  styles: {}
};
var index$k = withStyles(styles$t)(ProgressBar);

var styles$u = (function (_ref, _ref2) {
  var lineClamp = _ref.lineClamp,
      size = _ref.size,
      styles = _ref.styles;
  var measures = _ref2.measures,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      treatments = _ref2.treatments;

  var headingStyle = function headingStyle(size) {
    return _objectSpread2({}, treatments.head, {
      fontSize: scale(size),
      marginBottom: rhythm(1)
    });
  };

  var defaultStyles = _objectSpread2({
    fontSize: scale(size),
    lineHeight: measures.medium
  }, treatments.body, {}, lineClamp && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp
  }, {
    '& p': {
      marginBottom: rhythm(1)
    },
    '& ul': {
      listStyleType: 'disc',
      listStylePosition: 'outside',
      marginBottom: rhythm(1)
    },
    '& ol': {
      listStyleType: 'decimal',
      listStylePosition: 'outside',
      marginBottom: rhythm(1)
    },
    '& li': {
      marginLeft: rhythm(1)
    },
    '& blockquote': {
      maxWidth: rhythm(25),
      marginBottom: rhythm(1),
      margin: '0 auto',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: scale(size + 1)
    },
    '& blockquote:before': {
      content: '"open-quote"'
    },
    '& blockquote:after': {
      content: '"close-quote"'
    },
    '& img': {
      display: 'block',
      margin: '0 auto',
      width: 'auto',
      maxWidth: '100%'
    },
    '& iframe': {
      marginBottom: rhythm(2)
    },
    '& strong': {
      fontWeight: 700
    },
    '& em': {
      fontStyle: 'italic'
    },
    '& h1': _objectSpread2({}, headingStyle(size + 4)),
    '& h2': _objectSpread2({}, headingStyle(size + 3)),
    '& h3': _objectSpread2({}, headingStyle(size + 2)),
    '& h4': _objectSpread2({}, headingStyle(size + 1)),
    '& h5': _objectSpread2({}, headingStyle(size)),
    '& h6': _objectSpread2({}, headingStyle(size - 1)),
    '& > *:last-child': {
      marginBottom: 0
    }
  });

  return {
    root: merge_1(defaultStyles, styles)
  };
});

var RichText = function RichText(_ref) {
  var children = _ref.children,
      Tag = _ref.tag,
      classNames = _ref.classNames;

  if (!children) {
    return null;
  }

  return React__default.createElement(Tag, {
    className: "c11n-rich-text ".concat(classNames.root)
  }, typeof children === 'string' ? React__default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: children
    }
  }) : children);
};

RichText.propTypes = {
  /**
   * The html to be structured
   */
  children: propTypes.oneOfType([propTypes.string, propTypes.arrayOf(propTypes.element), propTypes.element]),

  /**
   * The tag to be used for the containing element
   */
  tag: propTypes.string,

  /**
   * The base font size to use
   */
  size: propTypes.number,

  /**
   * The number of lines to clamp
   */
  lineClamp: propTypes.number,

  /**
   * Custom styles to be added to the element
   */
  styles: propTypes.object
};
RichText.defaultProps = {
  size: 0,
  styles: {},
  tag: 'div'
};
var index$l = withStyles(styles$u)(RichText);

var styles$v = (function (_ref, _ref2) {
  var toggled = _ref.toggled,
      expanded = _ref.expanded,
      styles = _ref.styles;
  var mediaQuery = _ref2.mediaQuery,
      rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      transitions = _ref2.transitions,
      justifyContent = _ref2.justifyContent;
  var open = expanded || toggled;
  var defaultStyles = {
    root: {
      position: 'relative'
    },
    form: _defineProperty({
      maxWidth: rhythm(32),
      padding: rhythm(0.5),
      margin: '0 auto'
    }, mediaQuery('sm'), _objectSpread2({
      display: 'flex',
      alignItems: 'center',
      flexPack: 'center'
    }, justifyContent('center'))),
    field: {
      position: 'relative',
      marginRight: rhythm(1),
      flex: 1,
      transition: transitions.easeOut
    },
    input: _objectSpread2({
      paddingTop: rhythm(0.5),
      paddingBottom: rhythm(0.5),
      fontSize: scale(2),
      opacity: 0,
      transition: transitions.easeOut
    }, open && {
      width: '100%',
      opacity: 1
    }),
    label: _objectSpread2({
      display: 'block',
      transform: "translateY(".concat(rhythm(1), ")"),
      fontSize: scale(2),
      whiteSpace: 'nowrap',
      transition: transitions.easeOut
    }, open && {
      transform: 'translateY(0)',
      fontSize: scale(-1),
      marginTop: '0.6rem'
    }),
    results: {
      maxWidth: rhythm(32),
      paddingTop: rhythm(1),
      margin: '0 auto'
    }
  };
  return merge_1(defaultStyles, styles);
});

var SearchForm =
/*#__PURE__*/
function (_Component) {
  _inherits(SearchForm, _Component);

  function SearchForm() {
    var _this;

    _classCallCheck(this, SearchForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchForm).call(this));
    _this.showForm = _this.showForm.bind(_assertThisInitialized(_this));
    _this.closeForm = _this.closeForm.bind(_assertThisInitialized(_this));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchForm, [{
    key: "showForm",
    value: function showForm() {
      this.props.onToggleOn();
      this.refs.field.focus();
    }
  }, {
    key: "closeForm",
    value: function closeForm() {
      this.refs.field.value = '';
      this.props.onToggleOff();
      this.props.onChange();
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'Escape') {
        this.closeForm();
      }
    }
  }, {
    key: "onChange",
    value: function onChange() {
      var _this2 = this;

      var _this$props = this.props,
          debounce = _this$props.debounce,
          onChange = _this$props.onChange;
      return debounce ? this.debounce(onChange) : function () {
        return onChange(_this2.refs.field.value);
      };
    }
  }, {
    key: "debounce",
    value: function debounce(callback) {
      var _this3 = this;

      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var timeout;
      return function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          callback(_this3.refs.field.value);
        }, delay);
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          button = _this$props2.button,
          buttonText = _this$props2.buttonText,
          children = _this$props2.children,
          placeholder = _this$props2.placeholder,
          title = _this$props2.title,
          expanded = _this$props2.expanded,
          toggled = _this$props2.toggled,
          classNames = _this$props2.classNames,
          autofocus = _this$props2.autofocus;
      return React__default.createElement("div", {
        className: "c11n-search-form ".concat(classNames.root)
      }, React__default.createElement("div", {
        className: classNames.form,
        onKeyDown: this.handleKeyDown
      }, React__default.createElement("label", {
        className: classNames.field,
        id: "label-search-form"
      }, React__default.createElement("span", {
        className: classNames.label
      }, title), React__default.createElement("input", {
        ref: "field",
        type: "search",
        "aria-labelledby": "label-search-form",
        placeholder: placeholder,
        autoFocus: autofocus,
        onFocus: this.showForm,
        onChange: this.onChange(),
        className: classNames.input
      })), React__default.createElement("div", {
        className: classNames.cta
      }, React__default.createElement(Button$1, _extends({
        onClick: expanded ? this.onChange() : toggled ? this.closeForm : this.showForm,
        children: expanded ? buttonText : toggled ? 'Close' : buttonText,
        "aria-label": expanded ? buttonText : toggled ? 'Close' : buttonText
      }, button)))), children && React__default.createElement("div", {
        className: classNames.results
      }, children));
    }
  }]);

  return SearchForm;
}(React.Component);

SearchForm.propTypes = {
  /**
   * The onChange event handler to be fired
   */
  onChange: propTypes.func.isRequired,

  /**
   * The title for the section
   */
  title: propTypes.string,

  /**
   * The placeholder for the input
   */
  placeholder: propTypes.string,

  /**
   * The button text
   */
  buttonText: propTypes.string,

  /**
   * Autofocus the search input on form load (best for modals)
   */
  autofocus: propTypes.bool,

  /**
   * Disable toggle functionality (best for modals)
   */
  expanded: propTypes.bool,

  /**
   * Whether or note to debounce the onChange callback
   */
  debounce: propTypes.bool,

  /**
   * Custom styles for the component
   */
  styles: propTypes.object,

  /**
   * Props to be passed to the Button component
   */
  button: propTypes.object,

  /**
   * To be displayed under the field, usually SearchResult(s)
   */
  children: propTypes.any
};
SearchForm.defaultProps = {
  title: 'Looking for someone?',
  placeholder: 'Find a fundraiser',
  buttonText: 'Search',
  autofocus: false,
  expanded: false,
  debounce: true,
  onChange: function onChange() {}
};
var index$m = compose(withToggle, withStyles(styles$v))(SearchForm);

var styles$w = (function (_ref, _ref2) {
  var styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      justifyContent = _ref2.justifyContent;
  var defaultStyles = {
    root: _objectSpread2({
      display: 'flex',
      alignItems: 'center'
    }, justifyContent('space-between'), {
      '& > div': {
        padding: rhythm(0.5)
      },
      '& > div + div': {
        paddingLeft: rhythm(0.1)
      }
    }),
    avatar: {
      height: rhythm(1.65),
      width: rhythm(1.65),
      borderRadius: '50%'
    },
    titles: {
      flex: 1
    },
    title: {
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: scale(-1),
      lineHeight: '1.45em',
      paddingTop: rhythm(0.25)
    }
  };
  return merge_1(defaultStyles, styles);
});

var SearchResult = function SearchResult(_ref) {
  var image = _ref.image,
      subtitle = _ref.subtitle,
      title = _ref.title,
      url = _ref.url,
      button = _ref.button,
      cta = _ref.cta,
      classNames = _ref.classNames;
  return React__default.createElement("li", {
    className: "c11n-search-result ".concat(classNames.root)
  }, image && React__default.createElement("div", null, React__default.createElement("img", {
    src: image,
    alt: title,
    className: classNames.avatar
  })), React__default.createElement("div", {
    className: classNames.titles
  }, React__default.createElement("h4", {
    className: classNames.title
  }, title), subtitle && React__default.createElement("h6", {
    className: classNames.subtitle
  }, subtitle)), React__default.createElement("div", null, React__default.createElement(Button$1, _extends({
    tag: "a",
    href: url,
    "aria-label": cta,
    children: cta,
    target: "_blank",
    rel: "noopener"
  }, button))));
};

SearchResult.propTypes = {
  /**
   * Image URL
   */
  image: propTypes.string,

  /**
   * Name of the result to display
   */
  title: propTypes.string.isRequired,

  /**
   * Additional text to display below the title
   */
  subtitle: propTypes.string,

  /**
   * The URL for the page
   */
  url: propTypes.string,

  /**
   * Props to be passed into the button
   */
  button: propTypes.object,

  /**
   * The button text
   */
  cta: propTypes.string,

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
SearchResult.defaultProps = {
  cta: 'Support'
};
var index$n = withStyles(styles$w)(SearchResult);

var styles$x = (function (_ref, _ref2) {
  var styles = _ref.styles;
  var rhythm = _ref2.rhythm,
      scale = _ref2.scale,
      justifyContent = _ref2.justifyContent;
  var defaultStyles = {
    loading: {
      textAlign: 'center',
      fontSize: scale(2)
    },
    state: _objectSpread2({
      display: 'flex',
      alignItems: 'flex-start'
    }, justifyContent('center'), {
      padding: rhythm(2),
      fontSize: scale(-1),
      '& > *': {
        margin: rhythm([0, 0.25])
      }
    })
  };
  return merge_1(defaultStyles, styles);
});

var SearchResults =
/*#__PURE__*/
function (_Component) {
  _inherits(SearchResults, _Component);

  function SearchResults() {
    _classCallCheck(this, SearchResults);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchResults).apply(this, arguments));
  }

  _createClass(SearchResults, [{
    key: "render",
    value: function render() {
      var classNames = this.props.classNames;
      return React__default.createElement("div", {
        className: "c11n-search-results ".concat(classNames.root)
      }, this.renderSearchResults());
    }
  }, {
    key: "renderSearchResults",
    value: function renderSearchResults() {
      var _this$props = this.props,
          children = _this$props.children,
          loading = _this$props.loading,
          error = _this$props.error;

      if (loading) {
        return this.renderLoading();
      }

      if (error) {
        return this.renderError();
      }

      if (isEmpty_1(children)) {
        return this.renderEmpty();
      }

      return this.renderResults();
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "loading",
        size: 2,
        spin: true
      }));
    }
  }, {
    key: "renderError",
    value: function renderError() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "warning"
      }), this.props.errorLabel);
    }
  }, {
    key: "renderEmpty",
    value: function renderEmpty() {
      return React__default.createElement("div", {
        className: this.props.classNames.state
      }, React__default.createElement(Icon$1, {
        name: "warning"
      }), this.props.emptyLabel);
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      return React__default.createElement("ul", null, this.props.children);
    }
  }]);

  return SearchResults;
}(React.Component);

SearchResults.propTypes = {
  /**
   * An an array of leaderboard items for each leader
   */
  children: propTypes.oneOfType([propTypes.element, propTypes.arrayOf(propTypes.element)]),

  /**
   * If the results are currently loading
   */
  loading: propTypes.bool,

  /**
   * Set the error message or set to true to show default message
   */
  error: propTypes.oneOfType([propTypes.bool, propTypes.string]),

  /**
   * Set the message to display if there are no results
   */
  emptyLabel: propTypes.string,

  /**
   * Set the message to display if there is an error
   */
  errorLabel: propTypes.string,

  /**
   * The background color for the leaderboard
   */
  background: propTypes.string,

  /**
   * The foreground color for the leaderboard
   */
  foreground: propTypes.string,

  /**
   * Custom styles to be applied to root, leaders
   */
  styles: propTypes.object
};
SearchResults.defaultProps = {
  styles: {},
  emptyLabel: 'No results found',
  errorLabel: 'There was an error loading the results'
};
var index$o = withStyles(styles$x)(SearchResults);

var speeds = {
  snail: 5,
  slow: 3,
  medium: 2,
  fast: 1
};
var styles$y = (function (_ref, _ref2, keyframes) {
  var background = _ref.background,
      foreground = _ref.foreground,
      _ref$items = _ref.items,
      items = _ref$items === void 0 ? [] : _ref$items,
      labelBackground = _ref.labelBackground,
      labelForeground = _ref.labelForeground,
      spacing = _ref.spacing,
      speed = _ref.speed,
      styles = _ref.styles;
  var colors = _ref2.colors,
      rhythm = _ref2.rhythm,
      treatments = _ref2.treatments;
  return merge_1({
    root: {
      position: 'relative',
      overflow: 'hidden',
      height: rhythm(2.5),
      backgroundColor: colors[background],
      color: colors[foreground]
    },
    label: _objectSpread2({
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexPack: 'center',
      padding: "".concat(rhythm(0.5), " ").concat(rhythm(1)),
      backgroundColor: colors[labelBackground],
      color: colors[labelForeground],
      boxShadow: "0.5rem 0 3rem ".concat(colors[background])
    }, treatments.head),
    items: {
      position: 'absolute',
      top: '50%',
      left: 0,
      paddingLeft: '100%',
      animation: "".concat(keyframes.marquee, " linear infinite"),
      whiteSpace: 'nowrap',
      animationDuration: "".concat(Math.max(10, items.length * speeds[speed]), "s")
    },
    item: {
      display: 'inline-block',
      marginRight: rhythm(1)
    }
  }, styles);
});
var keyframes$4 = {
  marquee: {
    '0%': {
      transform: 'translate(0, -50%)'
    },
    '100%': {
      transform: 'translate(-100%, -50%)'
    }
  }
};

var Ticker = function Ticker(_ref) {
  var classNames = _ref.classNames,
      label = _ref.label,
      _ref$items = _ref.items,
      items = _ref$items === void 0 ? [] : _ref$items;
  return React__default.createElement("div", {
    className: "c11n-ticker ".concat(classNames.root)
  }, React__default.createElement("ul", {
    className: classNames.items
  }, items.map(function (item, index) {
    return React__default.createElement("li", {
      className: classNames.item,
      key: index
    }, item);
  })), label && React__default.createElement("div", {
    className: classNames.label
  }, label));
};

Ticker.propTypes = {
  /**
   * The background color
   */
  background: propTypes.string,

  /**
   * The color of the text
   */
  foreground: propTypes.string,

  /**
   * Items to display in animated scroll
   */
  items: propTypes.array.isRequired,

  /**
   * The label text
   */
  label: propTypes.string,

  /**
   * The label background color
   */
  labelBackground: propTypes.string,

  /**
   * The color of the label text
   */
  labelForeground: propTypes.string,

  /**
   * Animation speed
   */
  speed: propTypes.oneOf(['snail', 'slow', 'medium', 'fast']),

  /**
   * Custom styles to be applied
   */
  styles: propTypes.object
};
Ticker.defaultProps = {
  background: 'shade',
  foreground: 'dark',
  labelBackground: 'primary',
  labelForeground: 'light',
  speed: 'medium',
  styles: {}
};
var index$p = withStyles(styles$y, keyframes$4)(Ticker);

var TooltipPortal =
/*#__PURE__*/
function (_Component) {
  _inherits(TooltipPortal, _Component);

  function TooltipPortal() {
    var _this;

    _classCallCheck(this, TooltipPortal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TooltipPortal).apply(this, arguments));
    _this.anchor = document.createElement('div');
    return _this;
  }

  _createClass(TooltipPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.body.appendChild(this.anchor);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.body.removeChild(this.anchor);
    }
  }, {
    key: "render",
    value: function render() {
      return reactDom.createPortal(this.props.children, this.anchor);
    }
  }]);

  return TooltipPortal;
}(React.Component);

var Tooltip =
/*#__PURE__*/
function (_Component) {
  _inherits(Tooltip, _Component);

  function Tooltip() {
    var _this;

    _classCallCheck(this, Tooltip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tooltip).apply(this, arguments));
    _this.ref = null;
    _this.popup = null;
    _this.state = {
      hovering: false,
      position: {
        top: 0,
        left: 0
      }
    };
    _this.onMouseLeave = _this.onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onMouseEnter = _this.onMouseEnter.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Tooltip, [{
    key: "onMouseEnter",
    value: function onMouseEnter() {
      var _this$ref$getBounding = this.ref.getBoundingClientRect(),
          top = _this$ref$getBounding.top,
          left = _this$ref$getBounding.left,
          width = _this$ref$getBounding.width;

      var _window = window,
          pageXOffset = _window.pageXOffset,
          pageYOffset = _window.pageYOffset;
      this.setState({
        hovering: true,
        position: {
          top: top + pageYOffset,
          left: left + pageXOffset + width / 2
        }
      });
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      this.setState({
        hovering: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          position = _this$state.position,
          hovering = _this$state.hovering;
      var children = this.props.children;
      var bindTarget = {
        ref: function ref(_ref) {
          return _this2.ref = _ref;
        },
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter
      };

      var tooltipStyles = _objectSpread2({
        position: 'absolute',
        transform: 'translate(-50%, -0.5em)'
      }, position);

      var TooltipPortal$1 = function TooltipPortal$1(props) {
        return hovering ? React__default.createElement(TooltipPortal, props) : null;
      };

      return children(bindTarget, TooltipPortal$1, tooltipStyles);
    }
  }]);

  return Tooltip;
}(React.Component);
Tooltip.propTypes = {
  /**
   * A function responsible for rendering the hover target and content to appear
   * in the tooltip popup.
   */
  children: propTypes.func.isRequired
};

var TraitsProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(TraitsProvider, _Component);

  function TraitsProvider() {
    _classCallCheck(this, TraitsProvider);

    return _possibleConstructorReturn(this, _getPrototypeOf(TraitsProvider).apply(this, arguments));
  }

  _createClass(TraitsProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        traits: merge_1(defaultTraits, this.props.traits)
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return TraitsProvider;
}(React.Component);

TraitsProvider.propTypes = {
  /**
   * The children who will be provided these traits
   */
  children: propTypes.any.isRequired,

  /**
   * The traits to be added - colors, fonts, treatments, radiuses, shadows etc.
   */
  traits: propTypes.object
};
TraitsProvider.defaultProps = {
  traits: {}
};
TraitsProvider.childContextTypes = {
  traits: propTypes.object,
  defaults: propTypes.object
};

var Typekit = function Typekit(_ref) {
  var id = _ref.id;
  return React__default.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: "(function(d) {\n        var config = {\n          kitId: '".concat(id, "',\n          scriptTimeout: 3000,\n          async: true\n        },\n        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,\"\")+\" wf-inactive\";},config.scriptTimeout),tk=d.createElement(\"script\"),f=false,s=d.getElementsByTagName(\"script\")[0],a;h.className+=\" wf-loading\";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!=\"complete\"&&a!=\"loaded\")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)\n      })(document);")
    }
  });
};

Typekit.propTypes = {
  /**
   * The Typekit kit ID
   */
  id: propTypes.string.isRequired
};

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray_1(collection) ? _arrayFilter : _baseFilter;
  return func(collection, _baseIteratee(predicate));
}

var filter_1 = filter;

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = _baseIteratee(iteratee);

  _baseForOwn(object, function(value, key, object) {
    _baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

var mapValues_1 = mapValues;

var withForm = function withForm(config) {
  return function (ComponentToWrap) {
    return (
      /*#__PURE__*/
      function (_Component) {
        _inherits(_class, _Component);

        function _class(props) {
          var _this;

          _classCallCheck(this, _class);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
          _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
          _this.updateValues = _this.updateValues.bind(_assertThisInitialized(_this));
          _this.resetForm = _this.resetForm.bind(_assertThisInitialized(_this));
          _this.submitForm = _this.submitForm.bind(_assertThisInitialized(_this));

          var options = _this.initOptions(config);

          var fields = _this.initFields(options.fields);

          _this.state = {
            fields: _this.validateFields(fields),
            options: options
          };
          return _this;
        }

        _createClass(_class, [{
          key: "initOptions",
          value: function initOptions(config) {
            var defaults = {
              fields: {}
            };
            var supplied = typeof config === 'function' ? config(this.props) : config;
            return merge_1(defaults, supplied);
          }
        }, {
          key: "initialValue",
          value: function initialValue(field) {
            return isBoolean(field.type) ? false : '';
          }
        }, {
          key: "initFields",
          value: function initFields(fields) {
            var _this2 = this;

            return mapValues_1(fields, function (field, key) {
              return _objectSpread2({}, field, {
                name: key,
                value: field.initial || _this2.initialValue(field),
                onChange: _this2.handleChange(key),
                onBlur: _this2.handleChange(key, true)
              });
            });
          }
        }, {
          key: "validateFields",
          value: function validateFields(fields) {
            var _this3 = this;

            return mapValues_1(fields, function (field) {
              var validations = _this3.validateField(field.validators, field.value, _this3.getValues(fields));

              return _objectSpread2({}, field, {
                validations: validations,
                invalid: !isEmpty_1(validations),
                error: field.touched && !isEmpty_1(validations)
              });
            });
          }
        }, {
          key: "validateField",
          value: function validateField(validators, value, values) {
            var _this4 = this;

            switch (_typeof(validators)) {
              case 'function':
                return validators(value, values);

              case 'object':
                var validations = validators.map(function (validator) {
                  return _this4.validateField(validator, value, values);
                });
                return validations.filter(function (v) {
                  return v;
                });

              default:
                return validators;
            }
          }
        }, {
          key: "checkIfValid",
          value: function checkIfValid(fields) {
            return filter_1(fields, function (filter) {
              return filter.invalid;
            }).length === 0;
          }
        }, {
          key: "touchFields",
          value: function touchFields(fields) {
            return mapValues_1(fields, function (field) {
              return merge_1({}, field, {
                touched: true,
                error: !isEmpty_1(field.validations)
              });
            });
          }
        }, {
          key: "handleChange",
          value: function handleChange(key, touched) {
            var _this5 = this;

            return function (value) {
              var field = _this5.state.fields[key];

              var updatedFields = _objectSpread2({}, _this5.state.fields, _defineProperty({}, key, _objectSpread2({}, field, {
                value: value,
                touched: touched || field.touched,
                dirty: value !== field.initial
              })));

              var fields = _this5.validateFields(updatedFields);

              if (_this5.state.options.onFormChange) {
                _this5.state.options.onFormChange(_this5.getForm(fields));
              }

              _this5.setState({
                fields: fields
              });
            };
          }
        }, {
          key: "getValues",
          value: function getValues(fields) {
            return mapValues_1(fields, 'value');
          }
        }, {
          key: "getValidations",
          value: function getValidations(fields) {
            return mapValues_1(fields, 'validations');
          }
        }, {
          key: "updateValues",
          value: function updateValues(keys) {
            var _this6 = this;

            var newValues = mapValues_1(keys, function (value, key) {
              return _objectSpread2({}, _this6.state.fields[key], {
                value: value
              });
            });

            var updatedFields = _objectSpread2({}, this.state.fields, {}, newValues);

            this.setState({
              fields: this.validateFields(updatedFields)
            });
          }
        }, {
          key: "resetForm",
          value: function resetForm() {
            var fields = this.initFields(this.state.options.fields);
            this.setState({
              fields: this.validateFields(fields)
            });
          }
        }, {
          key: "submitForm",
          value: function submitForm() {
            var _this7 = this;

            var fields = this.touchFields(this.state.fields);
            this.setState({
              fields: fields
            });
            return new Promise(function (resolve, reject) {
              return _this7.checkIfValid(fields) ? resolve(_this7.getValues(fields)) : reject(_this7.getValidations(fields));
            });
          }
        }, {
          key: "getForm",
          value: function getForm(fields) {
            return {
              fields: fields,
              values: this.getValues(fields),
              invalid: !this.checkIfValid(fields),
              validations: this.getValidations(fields),
              updateValues: this.updateValues,
              resetForm: this.resetForm,
              submit: this.submitForm
            };
          }
        }, {
          key: "render",
          value: function render() {
            return React__default.createElement(ComponentToWrap, _extends({}, this.props, {
              form: this.getForm(this.state.fields)
            }));
          }
        }]);

        return _class;
      }(React.Component)
    );
  };
};

exports.Accordion = index;
exports.Button = Button$1;
exports.ButtonGroup = ButtonGroup$1;
exports.ButtonShare = ButtonShare;
exports.ButtonSocial = index$1;
exports.Carousel = index$2;
exports.CarouselArrow = index$3;
exports.Container = index$4;
exports.Filter = index$5;
exports.Flippy = index$6;
exports.Form = index$7;
exports.Grid = index$8;
exports.GridColumn = index$9;
exports.Heading = index$a;
exports.Icon = Icon$1;
exports.Image = index$b;
exports.InputDate = index$c;
exports.InputField = InputField$1;
exports.InputSearch = index$d;
exports.InputSearchResult = InputSearchResult$1;
exports.InputSelect = InputSelect$1;
exports.InputValidations = InputValidations$1;
exports.Label = Label$1;
exports.LazyImage = index$e;
exports.Leaderboard = index$f;
exports.LeaderboardItem = index$g;
exports.Loading = Loading$1;
exports.Meta = Meta;
exports.Metric = index$h;
exports.MetricGroup = index$i;
exports.Modal = index$j;
exports.NumberToWords = NumberToWords;
exports.Pagination = Pagination;
exports.PaginationLink = PaginationLink$1;
exports.ProgressBar = index$k;
exports.RichText = index$l;
exports.SearchForm = index$m;
exports.SearchResult = index$n;
exports.SearchResults = index$o;
exports.Section = Section$1;
exports.Ticker = index$p;
exports.Tooltip = Tooltip;
exports.TraitsProvider = TraitsProvider;
exports.Typekit = Typekit;
exports.WithForm = withForm;
exports.WithStyles = withStyles;
exports.WithToggle = withToggle;
