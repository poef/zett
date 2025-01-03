(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter2() {
        EventEmitter2.init.call(this);
      }
      module.exports = EventEmitter2;
      module.exports.once = once;
      EventEmitter2.EventEmitter = EventEmitter2;
      EventEmitter2.prototype._events = void 0;
      EventEmitter2.prototype._eventsCount = 0;
      EventEmitter2.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter2.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter2.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter2.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners2 = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners2[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter2.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
      EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
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
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter2.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
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
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners2, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys2 = Object.keys(events);
          var key;
          for (i = 0; i < keys2.length; ++i) {
            key = keys2[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners2 = events[type];
        if (typeof listeners2 === "function") {
          this.removeListener(type, listeners2);
        } else if (listeners2 !== void 0) {
          for (i = listeners2.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners2[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter2.prototype.listeners = function listeners2(type) {
        return _listeners(this, type, true);
      };
      EventEmitter2.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter2.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter2.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
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
        return new Promise(function(resolve, reject2) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject2(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // node_modules/@inrupt/oidc-client/lib/oidc-client.min.js
  var require_oidc_client_min = __commonJS({
    "node_modules/@inrupt/oidc-client/lib/oidc-client.min.js"(exports, module) {
      !function t6(e, r) {
        if ("object" == typeof exports && "object" == typeof module)
          module.exports = r();
        else if ("function" == typeof define && define.amd)
          define([], r);
        else {
          var n = r();
          for (var i in n)
            ("object" == typeof exports ? exports : e)[i] = n[i];
        }
      }(exports, function() {
        return function(t6) {
          var e = {};
          function r(n) {
            if (e[n])
              return e[n].exports;
            var i = e[n] = { i: n, l: false, exports: {} };
            return t6[n].call(i.exports, i, i.exports, r), i.l = true, i.exports;
          }
          return r.m = t6, r.c = e, r.d = function(t7, e2, n) {
            r.o(t7, e2) || Object.defineProperty(t7, e2, { enumerable: true, get: n });
          }, r.r = function(t7) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t7, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t7, "__esModule", { value: true });
          }, r.t = function(t7, e2) {
            if (1 & e2 && (t7 = r(t7)), 8 & e2)
              return t7;
            if (4 & e2 && "object" == typeof t7 && t7 && t7.__esModule)
              return t7;
            var n = /* @__PURE__ */ Object.create(null);
            if (r.r(n), Object.defineProperty(n, "default", { enumerable: true, value: t7 }), 2 & e2 && "string" != typeof t7)
              for (var i in t7)
                r.d(n, i, function(e3) {
                  return t7[e3];
                }.bind(null, i));
            return n;
          }, r.n = function(t7) {
            var e2 = t7 && t7.__esModule ? function e3() {
              return t7.default;
            } : function e3() {
              return t7;
            };
            return r.d(e2, "a", e2), e2;
          }, r.o = function(t7, e2) {
            return Object.prototype.hasOwnProperty.call(t7, e2);
          }, r.p = "", r(r.s = 22);
        }([function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }();
          var i = { debug: function t7() {
          }, info: function t7() {
          }, warn: function t7() {
          }, error: function t7() {
          } }, o = void 0, s = void 0;
          (e.Log = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.reset = function t8() {
              s = 3, o = i;
            }, t7.debug = function t8() {
              if (s >= 4) {
                for (var e2 = arguments.length, r2 = Array(e2), n2 = 0; n2 < e2; n2++)
                  r2[n2] = arguments[n2];
                o.debug.apply(o, Array.from(r2));
              }
            }, t7.info = function t8() {
              if (s >= 3) {
                for (var e2 = arguments.length, r2 = Array(e2), n2 = 0; n2 < e2; n2++)
                  r2[n2] = arguments[n2];
                o.info.apply(o, Array.from(r2));
              }
            }, t7.warn = function t8() {
              if (s >= 2) {
                for (var e2 = arguments.length, r2 = Array(e2), n2 = 0; n2 < e2; n2++)
                  r2[n2] = arguments[n2];
                o.warn.apply(o, Array.from(r2));
              }
            }, t7.error = function t8() {
              if (s >= 1) {
                for (var e2 = arguments.length, r2 = Array(e2), n2 = 0; n2 < e2; n2++)
                  r2[n2] = arguments[n2];
                o.error.apply(o, Array.from(r2));
              }
            }, n(t7, null, [{ key: "NONE", get: function t8() {
              return 0;
            } }, { key: "ERROR", get: function t8() {
              return 1;
            } }, { key: "WARN", get: function t8() {
              return 2;
            } }, { key: "INFO", get: function t8() {
              return 3;
            } }, { key: "DEBUG", get: function t8() {
              return 4;
            } }, { key: "level", get: function t8() {
              return s;
            }, set: function t8(e2) {
              if (!(0 <= e2 && e2 <= 4))
                throw new Error("Invalid log level");
              s = e2;
            } }, { key: "logger", get: function t8() {
              return o;
            }, set: function t8(e2) {
              if (!e2.debug && e2.info && (e2.debug = e2.info), !(e2.debug && e2.info && e2.warn && e2.error))
                throw new Error("Invalid logger");
              o = e2;
            } }]), t7;
          }()).reset();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }();
          var i = { setInterval: function(t7) {
            function e2(e3, r2) {
              return t7.apply(this, arguments);
            }
            return e2.toString = function() {
              return t7.toString();
            }, e2;
          }(function(t7, e2) {
            return setInterval(t7, e2);
          }), clearInterval: function(t7) {
            function e2(e3) {
              return t7.apply(this, arguments);
            }
            return e2.toString = function() {
              return t7.toString();
            }, e2;
          }(function(t7) {
            return clearInterval(t7);
          }) }, o = false, s = null;
          e.Global = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7._testing = function t8() {
              o = true;
            }, t7.setXMLHttpRequest = function t8(e2) {
              s = e2;
            }, n(t7, null, [{ key: "location", get: function t8() {
              if (!o)
                return location;
            } }, { key: "localStorage", get: function t8() {
              if (!o && "undefined" != typeof window)
                return localStorage;
            } }, { key: "sessionStorage", get: function t8() {
              if (!o && "undefined" != typeof window)
                return sessionStorage;
            } }, { key: "XMLHttpRequest", get: function t8() {
              if (!o && "undefined" != typeof window)
                return s || XMLHttpRequest;
            } }, { key: "timer", get: function t8() {
              if (!o)
                return i;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.MetadataService = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(7);
          function s(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          var a = ".well-known/openid-configuration";
          e.MetadataService = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.JsonService;
              if (s(this, t7), !e2)
                throw i.Log.error("MetadataService: No settings passed to MetadataService"), new Error("settings");
              this._settings = e2, this._jsonService = new r2(["application/jwk-set+json"]);
            }
            return t7.prototype.resetSigningKeys = function t8() {
              this._settings = this._settings || {}, this._settings.signingKeys = void 0;
            }, t7.prototype.getMetadata = function t8() {
              var e2 = this;
              return this._settings.metadata ? (i.Log.debug("MetadataService.getMetadata: Returning metadata from settings"), Promise.resolve(this._settings.metadata)) : this.metadataUrl ? (i.Log.debug("MetadataService.getMetadata: getting metadata from", this.metadataUrl), this._jsonService.getJson(this.metadataUrl).then(function(t9) {
                i.Log.debug("MetadataService.getMetadata: json received");
                var r2 = e2._settings.metadataSeed || {};
                return e2._settings.metadata = Object.assign({}, r2, t9), e2._settings.metadata;
              })) : (i.Log.error("MetadataService.getMetadata: No authority or metadataUrl configured on settings"), Promise.reject(new Error("No authority or metadataUrl configured on settings")));
            }, t7.prototype.getIssuer = function t8() {
              return this._getMetadataProperty("issuer");
            }, t7.prototype.getAuthorizationEndpoint = function t8() {
              return this._getMetadataProperty("authorization_endpoint");
            }, t7.prototype.getUserInfoEndpoint = function t8() {
              return this._getMetadataProperty("userinfo_endpoint");
            }, t7.prototype.getTokenEndpoint = function t8() {
              var e2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
              return this._getMetadataProperty("token_endpoint", e2);
            }, t7.prototype.getCheckSessionIframe = function t8() {
              return this._getMetadataProperty("check_session_iframe", true);
            }, t7.prototype.getEndSessionEndpoint = function t8() {
              return this._getMetadataProperty("end_session_endpoint", true);
            }, t7.prototype.getRevocationEndpoint = function t8() {
              return this._getMetadataProperty("revocation_endpoint", true);
            }, t7.prototype.getKeysEndpoint = function t8() {
              return this._getMetadataProperty("jwks_uri", true);
            }, t7.prototype._getMetadataProperty = function t8(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
              return i.Log.debug("MetadataService.getMetadataProperty for: " + e2), this.getMetadata().then(function(t9) {
                if (i.Log.debug("MetadataService.getMetadataProperty: metadata recieved"), void 0 === t9[e2]) {
                  if (true === r2)
                    return void i.Log.warn("MetadataService.getMetadataProperty: Metadata does not contain optional property " + e2);
                  throw i.Log.error("MetadataService.getMetadataProperty: Metadata does not contain property " + e2), new Error("Metadata does not contain property " + e2);
                }
                return t9[e2];
              });
            }, t7.prototype.getSigningKeys = function t8() {
              var e2 = this;
              return this._settings.signingKeys ? (i.Log.debug("MetadataService.getSigningKeys: Returning signingKeys from settings"), Promise.resolve(this._settings.signingKeys)) : this._getMetadataProperty("jwks_uri").then(function(t9) {
                return i.Log.debug("MetadataService.getSigningKeys: jwks_uri received", t9), e2._jsonService.getJson(t9).then(function(t10) {
                  if (i.Log.debug("MetadataService.getSigningKeys: key set received", t10), !t10.keys)
                    throw i.Log.error("MetadataService.getSigningKeys: Missing keys on keyset"), new Error("Missing keys on keyset");
                  return e2._settings.signingKeys = t10.keys, e2._settings.signingKeys;
                });
              });
            }, n(t7, [{ key: "metadataUrl", get: function t8() {
              return this._metadataUrl || (this._settings.metadataUrl ? this._metadataUrl = this._settings.metadataUrl : (this._metadataUrl = this._settings.authority, this._metadataUrl && this._metadataUrl.indexOf(a) < 0 && ("/" !== this._metadataUrl[this._metadataUrl.length - 1] && (this._metadataUrl += "/"), this._metadataUrl += a))), this._metadataUrl;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.UrlUtility = void 0;
          var n = r(0), i = r(1);
          e.UrlUtility = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.addQueryParam = function t8(e2, r2, n2) {
              return e2.indexOf("?") < 0 && (e2 += "?"), "?" !== e2[e2.length - 1] && (e2 += "&"), e2 += encodeURIComponent(r2), e2 += "=", e2 += encodeURIComponent(n2);
            }, t7.parseUrlFragment = function t8(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "#", o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i.Global;
              "string" != typeof e2 && (e2 = o.location.href);
              var s = e2.lastIndexOf(r2);
              s >= 0 && (e2 = e2.substr(s + 1)), "?" === r2 && (s = e2.indexOf("#")) >= 0 && (e2 = e2.substr(0, s));
              for (var a, u = {}, c = /([^&=]+)=([^&]*)/g, h = 0; a = c.exec(e2); )
                if (u[decodeURIComponent(a[1])] = decodeURIComponent(a[2].replace(/\+/g, " ")), h++ > 50)
                  return n.Log.error("UrlUtility.parseUrlFragment: response exceeded expected number of parameters", e2), { error: "Response exceeded expected number of parameters" };
              for (var l in u)
                return u;
              return {};
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.JoseUtil = void 0;
          var n = r(26), i = function o(t7) {
            return t7 && t7.__esModule ? t7 : { default: t7 };
          }(r(33));
          e.JoseUtil = (0, i.default)({ jws: n.jws, KeyUtil: n.KeyUtil, X509: n.X509, crypto: n.crypto, hextob64u: n.hextob64u, b64tohex: n.b64tohex, AllowedSigningAlgs: n.AllowedSigningAlgs });
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.OidcClientSettings = void 0;
          var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t7) {
            return typeof t7;
          } : function(t7) {
            return t7 && "function" == typeof Symbol && t7.constructor === Symbol && t7 !== Symbol.prototype ? "symbol" : typeof t7;
          }, i = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), o = r(0), s = r(23), a = r(6), u = r(24), c = r(2);
          function h(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          var l = ".well-known/openid-configuration", f = "id_token", g = "openid", d = "client_secret_post";
          e.OidcClientSettings = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = e2.authority, i2 = e2.metadataUrl, o2 = e2.metadata, l2 = e2.signingKeys, p = e2.metadataSeed, v2 = e2.client_id, y = e2.client_secret, m = e2.response_type, _ = void 0 === m ? f : m, S = e2.scope, b = void 0 === S ? g : S, w = e2.redirect_uri, F = e2.post_logout_redirect_uri, E = e2.client_authentication, x = void 0 === E ? d : E, A2 = e2.prompt, k = e2.display, P2 = e2.max_age, C = e2.ui_locales, T = e2.acr_values, R = e2.resource, I = e2.response_mode, D = e2.filterProtocolClaims, L = void 0 === D || D, N = e2.loadUserInfo, U = void 0 === N || N, B2 = e2.staleStateAge, O = void 0 === B2 ? 900 : B2, j = e2.clockSkew, M = void 0 === j ? 300 : j, H2 = e2.clockService, V2 = void 0 === H2 ? new s.ClockService() : H2, K = e2.userInfoJwtIssuer, q = void 0 === K ? "OP" : K, J = e2.mergeClaims, W = void 0 !== J && J, z = e2.stateStore, Y = void 0 === z ? new a.WebStorageStateStore() : z, G = e2.ResponseValidatorCtor, X2 = void 0 === G ? u.ResponseValidator : G, $ = e2.MetadataServiceCtor, Q2 = void 0 === $ ? c.MetadataService : $, Z2 = e2.extraQueryParams, tt = void 0 === Z2 ? {} : Z2, et = e2.extraTokenParams, rt = void 0 === et ? {} : et;
              h(this, t7), this._authority = r2, this._metadataUrl = i2, this._metadata = o2, this._metadataSeed = p, this._signingKeys = l2, this._client_id = v2, this._client_secret = y, this._response_type = _, this._scope = b, this._redirect_uri = w, this._post_logout_redirect_uri = F, this._client_authentication = x, this._prompt = A2, this._display = k, this._max_age = P2, this._ui_locales = C, this._acr_values = T, this._resource = R, this._response_mode = I, this._filterProtocolClaims = !!L, this._loadUserInfo = !!U, this._staleStateAge = O, this._clockSkew = M, this._clockService = V2, this._userInfoJwtIssuer = q, this._mergeClaims = !!W, this._stateStore = Y, this._validator = new X2(this), this._metadataService = new Q2(this), this._extraQueryParams = "object" === (void 0 === tt ? "undefined" : n(tt)) ? tt : {}, this._extraTokenParams = "object" === (void 0 === rt ? "undefined" : n(rt)) ? rt : {};
            }
            return t7.prototype.getEpochTime = function t8() {
              return this._clockService.getEpochTime();
            }, i(t7, [{ key: "client_id", get: function t8() {
              return this._client_id;
            }, set: function t8(e2) {
              if (this._client_id)
                throw o.Log.error("OidcClientSettings.set_client_id: client_id has already been assigned."), new Error("client_id has already been assigned.");
              this._client_id = e2;
            } }, { key: "client_secret", get: function t8() {
              return this._client_secret;
            } }, { key: "response_type", get: function t8() {
              return this._response_type;
            } }, { key: "scope", get: function t8() {
              return this._scope;
            } }, { key: "redirect_uri", get: function t8() {
              return this._redirect_uri;
            } }, { key: "post_logout_redirect_uri", get: function t8() {
              return this._post_logout_redirect_uri;
            } }, { key: "client_authentication", get: function t8() {
              return this._client_authentication;
            } }, { key: "prompt", get: function t8() {
              return this._prompt;
            } }, { key: "display", get: function t8() {
              return this._display;
            } }, { key: "max_age", get: function t8() {
              return this._max_age;
            } }, { key: "ui_locales", get: function t8() {
              return this._ui_locales;
            } }, { key: "acr_values", get: function t8() {
              return this._acr_values;
            } }, { key: "resource", get: function t8() {
              return this._resource;
            } }, { key: "response_mode", get: function t8() {
              return this._response_mode;
            } }, { key: "authority", get: function t8() {
              return this._authority;
            }, set: function t8(e2) {
              if (this._authority)
                throw o.Log.error("OidcClientSettings.set_authority: authority has already been assigned."), new Error("authority has already been assigned.");
              this._authority = e2;
            } }, { key: "metadataUrl", get: function t8() {
              return this._metadataUrl || (this._metadataUrl = this.authority, this._metadataUrl && this._metadataUrl.indexOf(l) < 0 && ("/" !== this._metadataUrl[this._metadataUrl.length - 1] && (this._metadataUrl += "/"), this._metadataUrl += l)), this._metadataUrl;
            } }, { key: "metadata", get: function t8() {
              return this._metadata;
            }, set: function t8(e2) {
              this._metadata = e2;
            } }, { key: "metadataSeed", get: function t8() {
              return this._metadataSeed;
            }, set: function t8(e2) {
              this._metadataSeed = e2;
            } }, { key: "signingKeys", get: function t8() {
              return this._signingKeys;
            }, set: function t8(e2) {
              this._signingKeys = e2;
            } }, { key: "filterProtocolClaims", get: function t8() {
              return this._filterProtocolClaims;
            } }, { key: "loadUserInfo", get: function t8() {
              return this._loadUserInfo;
            } }, { key: "staleStateAge", get: function t8() {
              return this._staleStateAge;
            } }, { key: "clockSkew", get: function t8() {
              return this._clockSkew;
            } }, { key: "userInfoJwtIssuer", get: function t8() {
              return this._userInfoJwtIssuer;
            } }, { key: "mergeClaims", get: function t8() {
              return this._mergeClaims;
            } }, { key: "stateStore", get: function t8() {
              return this._stateStore;
            } }, { key: "validator", get: function t8() {
              return this._validator;
            } }, { key: "metadataService", get: function t8() {
              return this._metadataService;
            } }, { key: "extraQueryParams", get: function t8() {
              return this._extraQueryParams;
            }, set: function t8(e2) {
              "object" === (void 0 === e2 ? "undefined" : n(e2)) ? this._extraQueryParams = e2 : this._extraQueryParams = {};
            } }, { key: "extraTokenParams", get: function t8() {
              return this._extraTokenParams;
            }, set: function t8(e2) {
              "object" === (void 0 === e2 ? "undefined" : n(e2)) ? this._extraTokenParams = e2 : this._extraTokenParams = {};
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.WebStorageStateStore = void 0;
          var n = r(0), i = r(1);
          function o(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.WebStorageStateStore = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = e2.prefix, n2 = void 0 === r2 ? "oidc." : r2, s = e2.store, a = void 0 === s ? i.Global.localStorage : s;
              o(this, t7), this._store = a, this._prefix = n2;
            }
            return t7.prototype.set = function t8(e2, r2) {
              return n.Log.debug("WebStorageStateStore.set", e2), e2 = this._prefix + e2, this._store.setItem(e2, r2), Promise.resolve();
            }, t7.prototype.get = function t8(e2) {
              n.Log.debug("WebStorageStateStore.get", e2), e2 = this._prefix + e2;
              var r2 = this._store.getItem(e2);
              return Promise.resolve(r2);
            }, t7.prototype.remove = function t8(e2) {
              n.Log.debug("WebStorageStateStore.remove", e2), e2 = this._prefix + e2;
              var r2 = this._store.getItem(e2);
              return this._store.removeItem(e2), Promise.resolve(r2);
            }, t7.prototype.getAllKeys = function t8() {
              n.Log.debug("WebStorageStateStore.getAllKeys");
              for (var e2 = [], r2 = 0; r2 < this._store.length; r2++) {
                var i2 = this._store.key(r2);
                0 === i2.indexOf(this._prefix) && e2.push(i2.substr(this._prefix.length));
              }
              return Promise.resolve(e2);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.JsonService = void 0;
          var n = r(0), i = r(1);
          function o(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.JsonService = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : i.Global.XMLHttpRequest, n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
              o(this, t7), e2 && Array.isArray(e2) ? this._contentTypes = e2.slice() : this._contentTypes = [], this._contentTypes.push("application/json"), n2 && this._contentTypes.push("application/jwt"), this._XMLHttpRequest = r2, this._jwtHandler = n2;
            }
            return t7.prototype.getJson = function t8(e2, r2) {
              var i2 = this;
              if (!e2)
                throw n.Log.error("JsonService.getJson: No url passed"), new Error("url");
              return n.Log.debug("JsonService.getJson, url: ", e2), new Promise(function(t9, o2) {
                var s = new i2._XMLHttpRequest();
                s.open("GET", e2);
                var a = i2._contentTypes, u = i2._jwtHandler;
                s.onload = function() {
                  if (n.Log.debug("JsonService.getJson: HTTP response received, status", s.status), 200 === s.status) {
                    var r3 = s.getResponseHeader("Content-Type");
                    if (r3) {
                      var i3 = a.find(function(t10) {
                        if (r3.startsWith(t10))
                          return true;
                      });
                      if ("application/jwt" == i3)
                        return void u(s).then(t9, o2);
                      if (i3)
                        try {
                          return void t9(JSON.parse(s.responseText));
                        } catch (t10) {
                          return n.Log.error("JsonService.getJson: Error parsing JSON response", t10.message), void o2(t10);
                        }
                    }
                    o2(Error("Invalid response Content-Type: " + r3 + ", from URL: " + e2));
                  } else
                    o2(Error(s.statusText + " (" + s.status + ")"));
                }, s.onerror = function() {
                  n.Log.error("JsonService.getJson: network error"), o2(Error("Network Error"));
                }, r2 && (n.Log.debug("JsonService.getJson: token passed, setting Authorization header"), s.setRequestHeader("Authorization", "Bearer " + r2)), s.send();
              });
            }, t7.prototype.postForm = function t8(e2, r2, i2) {
              var o2 = this;
              if (!e2)
                throw n.Log.error("JsonService.postForm: No url passed"), new Error("url");
              return n.Log.debug("JsonService.postForm, url: ", e2), new Promise(function(t9, s) {
                var a = new o2._XMLHttpRequest();
                a.open("POST", e2);
                var u = o2._contentTypes;
                a.onload = function() {
                  if (n.Log.debug("JsonService.postForm: HTTP response received, status", a.status), 200 !== a.status) {
                    if (400 === a.status) {
                      if (i3 = a.getResponseHeader("Content-Type")) {
                        if (u.find(function(t10) {
                          if (i3.startsWith(t10))
                            return true;
                        }))
                          try {
                            var r3 = JSON.parse(a.responseText);
                            if (r3 && r3.error)
                              return n.Log.error("JsonService.postForm: Error from server: ", r3.error), void s(new Error(r3.error));
                          } catch (t10) {
                            return n.Log.error("JsonService.postForm: Error parsing JSON response", t10.message), void s(t10);
                          }
                      }
                    }
                    s(Error(a.statusText + " (" + a.status + ")"));
                  } else {
                    var i3;
                    if ((i3 = a.getResponseHeader("Content-Type")) && u.find(function(t10) {
                      if (i3.startsWith(t10))
                        return true;
                    }))
                      try {
                        return void t9(JSON.parse(a.responseText));
                      } catch (t10) {
                        return n.Log.error("JsonService.postForm: Error parsing JSON response", t10.message), void s(t10);
                      }
                    s(Error("Invalid response Content-Type: " + i3 + ", from URL: " + e2));
                  }
                }, a.onerror = function() {
                  n.Log.error("JsonService.postForm: network error"), s(Error("Network Error"));
                };
                var c = "";
                for (var h in r2) {
                  var l = r2[h];
                  l && (c.length > 0 && (c += "&"), c += encodeURIComponent(h), c += "=", c += encodeURIComponent(l));
                }
                a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), void 0 !== i2 && a.setRequestHeader("Authorization", "Basic " + btoa(i2)), a.send(c);
              });
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SigninRequest = void 0;
          var n = r(0), i = r(3), o = r(13);
          e.SigninRequest = function() {
            function t7(e2) {
              var r2 = e2.url, s = e2.client_id, a = e2.redirect_uri, u = e2.response_type, c = e2.scope, h = e2.authority, l = e2.data, f = e2.prompt, g = e2.display, d = e2.max_age, p = e2.ui_locales, v2 = e2.id_token_hint, y = e2.login_hint, m = e2.acr_values, _ = e2.resource, S = e2.response_mode, b = e2.request, w = e2.request_uri, F = e2.extraQueryParams, E = e2.request_type, x = e2.client_secret, A2 = e2.extraTokenParams, k = e2.skipUserInfo;
              if (function P2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), !r2)
                throw n.Log.error("SigninRequest.ctor: No url passed"), new Error("url");
              if (!s)
                throw n.Log.error("SigninRequest.ctor: No client_id passed"), new Error("client_id");
              if (!a)
                throw n.Log.error("SigninRequest.ctor: No redirect_uri passed"), new Error("redirect_uri");
              if (!u)
                throw n.Log.error("SigninRequest.ctor: No response_type passed"), new Error("response_type");
              if (!c)
                throw n.Log.error("SigninRequest.ctor: No scope passed"), new Error("scope");
              if (!h)
                throw n.Log.error("SigninRequest.ctor: No authority passed"), new Error("authority");
              var C = t7.isOidc(u), T = t7.isCode(u);
              S || (S = t7.isCode(u) ? "query" : null), this.state = new o.SigninState({ nonce: C, data: l, client_id: s, authority: h, redirect_uri: a, code_verifier: T, request_type: E, response_mode: S, client_secret: x, scope: c, extraTokenParams: A2, skipUserInfo: k }), r2 = i.UrlUtility.addQueryParam(r2, "client_id", s), r2 = i.UrlUtility.addQueryParam(r2, "redirect_uri", a), r2 = i.UrlUtility.addQueryParam(r2, "response_type", u), r2 = i.UrlUtility.addQueryParam(r2, "scope", c), r2 = i.UrlUtility.addQueryParam(r2, "state", this.state.id), C && (r2 = i.UrlUtility.addQueryParam(r2, "nonce", this.state.nonce)), T && (r2 = i.UrlUtility.addQueryParam(r2, "code_challenge", this.state.code_challenge), r2 = i.UrlUtility.addQueryParam(r2, "code_challenge_method", "S256"));
              var R = { prompt: f, display: g, max_age: d, ui_locales: p, id_token_hint: v2, login_hint: y, acr_values: m, resource: _, request: b, request_uri: w, response_mode: S };
              for (var I in R)
                R[I] && (r2 = i.UrlUtility.addQueryParam(r2, I, R[I]));
              for (var D in F)
                r2 = i.UrlUtility.addQueryParam(r2, D, F[D]);
              this.url = r2;
            }
            return t7.isOidc = function t8(e2) {
              return !!e2.split(/\s+/g).filter(function(t9) {
                return "id_token" === t9;
              })[0];
            }, t7.isOAuth = function t8(e2) {
              return !!e2.split(/\s+/g).filter(function(t9) {
                return "token" === t9;
              })[0];
            }, t7.isCode = function t8(e2) {
              return !!e2.split(/\s+/g).filter(function(t9) {
                return "code" === t9;
              })[0];
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.State = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = function s(t7) {
            return t7 && t7.__esModule ? t7 : { default: t7 };
          }(r(14));
          function a(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.State = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = e2.id, n2 = e2.data, i2 = e2.created, s = e2.request_type;
              a(this, t7), this._id = r2 || (0, o.default)(), this._data = n2, this._created = "number" == typeof i2 && i2 > 0 ? i2 : parseInt(Date.now() / 1e3), this._request_type = s;
            }
            return t7.prototype.toStorageString = function t8() {
              return i.Log.debug("State.toStorageString"), JSON.stringify({ id: this.id, data: this.data, created: this.created, request_type: this.request_type });
            }, t7.fromStorageString = function e2(r2) {
              return i.Log.debug("State.fromStorageString"), new t7(JSON.parse(r2));
            }, t7.clearStaleState = function e2(r2, n2) {
              var o2 = Date.now() / 1e3 - n2;
              return r2.getAllKeys().then(function(e3) {
                i.Log.debug("State.clearStaleState: got keys", e3);
                for (var n3 = [], s = function s2(a3) {
                  var c = e3[a3];
                  u = r2.get(c).then(function(e4) {
                    var n4 = false;
                    if (e4)
                      try {
                        var s3 = t7.fromStorageString(e4);
                        i.Log.debug("State.clearStaleState: got item from key: ", c, s3.created), s3.created <= o2 && (n4 = true);
                      } catch (t8) {
                        i.Log.error("State.clearStaleState: Error parsing state for key", c, t8.message), n4 = true;
                      }
                    else
                      i.Log.debug("State.clearStaleState: no item in storage for key: ", c), n4 = true;
                    if (n4)
                      return i.Log.debug("State.clearStaleState: removed item for key: ", c), r2.remove(c);
                  }), n3.push(u);
                }, a2 = 0; a2 < e3.length; a2++) {
                  var u;
                  s(a2);
                }
                return i.Log.debug("State.clearStaleState: waiting on promise count:", n3.length), Promise.all(n3);
              });
            }, n(t7, [{ key: "id", get: function t8() {
              return this._id;
            } }, { key: "data", get: function t8() {
              return this._data;
            } }, { key: "created", get: function t8() {
              return this._created;
            } }, { key: "request_type", get: function t8() {
              return this._request_type;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.OidcClient = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(5), s = r(12), a = r(8), u = r(34), c = r(35), h = r(36), l = r(13), f = r(9);
          function g(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.OidcClient = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              g(this, t7), e2 instanceof o.OidcClientSettings ? this._settings = e2 : this._settings = new o.OidcClientSettings(e2);
            }
            return t7.prototype.createSigninRequest = function t8() {
              var e2 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = r2.response_type, o2 = r2.scope, s2 = r2.redirect_uri, u2 = r2.data, c2 = r2.state, h2 = r2.prompt, l2 = r2.display, f2 = r2.max_age, g2 = r2.ui_locales, d = r2.id_token_hint, p = r2.login_hint, v2 = r2.acr_values, y = r2.resource, m = r2.request, _ = r2.request_uri, S = r2.response_mode, b = r2.extraQueryParams, w = r2.extraTokenParams, F = r2.request_type, E = r2.skipUserInfo, x = arguments[1];
              i.Log.debug("OidcClient.createSigninRequest");
              var A2 = this._settings.client_id;
              n2 = n2 || this._settings.response_type, o2 = o2 || this._settings.scope, s2 = s2 || this._settings.redirect_uri, h2 = h2 || this._settings.prompt, l2 = l2 || this._settings.display, f2 = f2 || this._settings.max_age, g2 = g2 || this._settings.ui_locales, v2 = v2 || this._settings.acr_values, y = y || this._settings.resource, S = S || this._settings.response_mode, b = b || this._settings.extraQueryParams, w = w || this._settings.extraTokenParams;
              var k = this._settings.authority;
              return a.SigninRequest.isCode(n2) && "code" !== n2 ? Promise.reject(new Error("OpenID Connect hybrid flow is not supported")) : this._metadataService.getAuthorizationEndpoint().then(function(t9) {
                i.Log.debug("OidcClient.createSigninRequest: Received authorization endpoint", t9);
                var r3 = new a.SigninRequest({ url: t9, client_id: A2, redirect_uri: s2, response_type: n2, scope: o2, data: u2 || c2, authority: k, prompt: h2, display: l2, max_age: f2, ui_locales: g2, id_token_hint: d, login_hint: p, acr_values: v2, resource: y, request: m, request_uri: _, extraQueryParams: b, extraTokenParams: w, request_type: F, response_mode: S, client_secret: e2._settings.client_secret, skipUserInfo: E }), P2 = r3.state;
                return (x = x || e2._stateStore).set(P2.id, P2.toStorageString()).then(function() {
                  return r3;
                });
              });
            }, t7.prototype.readSigninResponseState = function t8(e2, r2) {
              var n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
              i.Log.debug("OidcClient.readSigninResponseState");
              var o2 = "query" === this._settings.response_mode || !this._settings.response_mode && a.SigninRequest.isCode(this._settings.response_type), s2 = o2 ? "?" : "#", c2 = new u.SigninResponse(e2, s2);
              if (!c2.state)
                return i.Log.error("OidcClient.readSigninResponseState: No state in response"), Promise.reject(new Error("No state in response"));
              r2 = r2 || this._stateStore;
              var h2 = n2 ? r2.remove.bind(r2) : r2.get.bind(r2);
              return h2(c2.state).then(function(t9) {
                if (!t9)
                  throw i.Log.error("OidcClient.readSigninResponseState: No matching state found in storage"), new Error("No matching state found in storage");
                return { state: l.SigninState.fromStorageString(t9), response: c2 };
              });
            }, t7.prototype.processSigninResponse = function t8(e2, r2) {
              var n2 = this;
              return i.Log.debug("OidcClient.processSigninResponse"), this.readSigninResponseState(e2, r2, true).then(function(t9) {
                var e3 = t9.state, r3 = t9.response;
                return i.Log.debug("OidcClient.processSigninResponse: Received state from storage; validating response"), n2._validator.validateSigninResponse(e3, r3);
              });
            }, t7.prototype.createSignoutRequest = function t8() {
              var e2 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = r2.id_token_hint, o2 = r2.data, s2 = r2.state, a2 = r2.post_logout_redirect_uri, u2 = r2.extraQueryParams, h2 = r2.request_type, l2 = arguments[1];
              return i.Log.debug("OidcClient.createSignoutRequest"), a2 = a2 || this._settings.post_logout_redirect_uri, u2 = u2 || this._settings.extraQueryParams, this._metadataService.getEndSessionEndpoint().then(function(t9) {
                if (!t9)
                  throw i.Log.error("OidcClient.createSignoutRequest: No end session endpoint url returned"), new Error("no end session endpoint");
                i.Log.debug("OidcClient.createSignoutRequest: Received end session endpoint", t9);
                var r3 = new c.SignoutRequest({ url: t9, id_token_hint: n2, post_logout_redirect_uri: a2, data: o2 || s2, extraQueryParams: u2, request_type: h2 }), f2 = r3.state;
                return f2 && (i.Log.debug("OidcClient.createSignoutRequest: Signout request has state to persist"), (l2 = l2 || e2._stateStore).set(f2.id, f2.toStorageString())), r3;
              });
            }, t7.prototype.readSignoutResponseState = function t8(e2, r2) {
              var n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
              i.Log.debug("OidcClient.readSignoutResponseState");
              var o2 = new h.SignoutResponse(e2);
              if (!o2.state)
                return i.Log.debug("OidcClient.readSignoutResponseState: No state in response"), o2.error ? (i.Log.warn("OidcClient.readSignoutResponseState: Response was error: ", o2.error), Promise.reject(new s.ErrorResponse(o2))) : Promise.resolve({ state: void 0, response: o2 });
              var a2 = o2.state;
              r2 = r2 || this._stateStore;
              var u2 = n2 ? r2.remove.bind(r2) : r2.get.bind(r2);
              return u2(a2).then(function(t9) {
                if (!t9)
                  throw i.Log.error("OidcClient.readSignoutResponseState: No matching state found in storage"), new Error("No matching state found in storage");
                return { state: f.State.fromStorageString(t9), response: o2 };
              });
            }, t7.prototype.processSignoutResponse = function t8(e2, r2) {
              var n2 = this;
              return i.Log.debug("OidcClient.processSignoutResponse"), this.readSignoutResponseState(e2, r2, true).then(function(t9) {
                var e3 = t9.state, r3 = t9.response;
                return e3 ? (i.Log.debug("OidcClient.processSignoutResponse: Received state from storage; validating response"), n2._validator.validateSignoutResponse(e3, r3)) : (i.Log.debug("OidcClient.processSignoutResponse: No state from storage; skipping validating response"), r3);
              });
            }, t7.prototype.clearStaleState = function t8(e2) {
              return i.Log.debug("OidcClient.clearStaleState"), e2 = e2 || this._stateStore, f.State.clearStaleState(e2, this.settings.staleStateAge);
            }, n(t7, [{ key: "_stateStore", get: function t8() {
              return this.settings.stateStore;
            } }, { key: "_validator", get: function t8() {
              return this.settings.validator;
            } }, { key: "_metadataService", get: function t8() {
              return this.settings.metadataService;
            } }, { key: "settings", get: function t8() {
              return this._settings;
            } }, { key: "metadataService", get: function t8() {
              return this._metadataService;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.TokenClient = void 0;
          var n = r(7), i = r(2), o = r(0);
          function s(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.TokenClient = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.JsonService, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i.MetadataService;
              if (s(this, t7), !e2)
                throw o.Log.error("TokenClient.ctor: No settings passed"), new Error("settings");
              this._settings = e2, this._jsonService = new r2(), this._metadataService = new a(this._settings);
            }
            return t7.prototype.exchangeCode = function t8() {
              var e2 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (r2 = Object.assign({}, r2)).grant_type = r2.grant_type || "authorization_code", r2.client_id = r2.client_id || this._settings.client_id, r2.client_secret = r2.client_secret || this._settings.client_secret, r2.redirect_uri = r2.redirect_uri || this._settings.redirect_uri;
              var n2 = void 0, i2 = r2._client_authentication || this._settings._client_authentication;
              return delete r2._client_authentication, r2.code ? r2.redirect_uri ? r2.code_verifier ? r2.client_id ? r2.client_secret || "client_secret_basic" != i2 ? ("client_secret_basic" == i2 && (n2 = r2.client_id + ":" + r2.client_secret, delete r2.client_id, delete r2.client_secret), this._metadataService.getTokenEndpoint(false).then(function(t9) {
                return o.Log.debug("TokenClient.exchangeCode: Received token endpoint"), e2._jsonService.postForm(t9, r2, n2).then(function(t10) {
                  return o.Log.debug("TokenClient.exchangeCode: response received"), t10;
                });
              })) : (o.Log.error("TokenClient.exchangeCode: No client_secret passed"), Promise.reject(new Error("A client_secret is required"))) : (o.Log.error("TokenClient.exchangeCode: No client_id passed"), Promise.reject(new Error("A client_id is required"))) : (o.Log.error("TokenClient.exchangeCode: No code_verifier passed"), Promise.reject(new Error("A code_verifier is required"))) : (o.Log.error("TokenClient.exchangeCode: No redirect_uri passed"), Promise.reject(new Error("A redirect_uri is required"))) : (o.Log.error("TokenClient.exchangeCode: No code passed"), Promise.reject(new Error("A code is required")));
            }, t7.prototype.exchangeRefreshToken = function t8() {
              var e2 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (r2 = Object.assign({}, r2)).grant_type = r2.grant_type || "refresh_token", r2.client_id = r2.client_id || this._settings.client_id, r2.client_secret = r2.client_secret || this._settings.client_secret;
              var n2 = void 0, i2 = r2._client_authentication || this._settings._client_authentication;
              return delete r2._client_authentication, r2.refresh_token ? r2.client_id ? ("client_secret_basic" == i2 && (n2 = r2.client_id + ":" + r2.client_secret, delete r2.client_id, delete r2.client_secret), this._metadataService.getTokenEndpoint(false).then(function(t9) {
                return o.Log.debug("TokenClient.exchangeRefreshToken: Received token endpoint"), e2._jsonService.postForm(t9, r2, n2).then(function(t10) {
                  return o.Log.debug("TokenClient.exchangeRefreshToken: response received"), t10;
                });
              })) : (o.Log.error("TokenClient.exchangeRefreshToken: No client_id passed"), Promise.reject(new Error("A client_id is required"))) : (o.Log.error("TokenClient.exchangeRefreshToken: No refresh_token passed"), Promise.reject(new Error("A refresh_token is required")));
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.ErrorResponse = void 0;
          var n = r(0);
          function i(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          function o(t7, e2) {
            if (!t7)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e2 || "object" != typeof e2 && "function" != typeof e2 ? t7 : e2;
          }
          e.ErrorResponse = function(t7) {
            function e2() {
              var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, s = r2.error, a = r2.error_description, u = r2.error_uri, c = r2.state, h = r2.session_state;
              if (i(this, e2), !s)
                throw n.Log.error("No error passed to ErrorResponse"), new Error("error");
              var l = o(this, t7.call(this, a || s));
              return l.name = "ErrorResponse", l.error = s, l.error_description = a, l.error_uri = u, l.state = c, l.session_state = h, l;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), e2;
          }(Error);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SigninState = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(9), s = r(4), a = function u(t7) {
            return t7 && t7.__esModule ? t7 : { default: t7 };
          }(r(14));
          function c(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          function h(t7, e2) {
            if (!t7)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e2 || "object" != typeof e2 && "function" != typeof e2 ? t7 : e2;
          }
          e.SigninState = function(t7) {
            function e2() {
              var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = r2.nonce, i2 = r2.authority, o2 = r2.client_id, u = r2.redirect_uri, l = r2.code_verifier, f = r2.response_mode, g = r2.client_secret, d = r2.scope, p = r2.extraTokenParams, v2 = r2.skipUserInfo;
              c(this, e2);
              var y = h(this, t7.call(this, arguments[0]));
              if (true === n2 ? y._nonce = (0, a.default)() : n2 && (y._nonce = n2), true === l ? y._code_verifier = (0, a.default)() + (0, a.default)() + (0, a.default)() : l && (y._code_verifier = l), y.code_verifier) {
                var m = s.JoseUtil.hashString(y.code_verifier, "SHA256");
                y._code_challenge = s.JoseUtil.hexToBase64Url(m);
              }
              return y._redirect_uri = u, y._authority = i2, y._client_id = o2, y._response_mode = f, y._client_secret = g, y._scope = d, y._extraTokenParams = p, y._skipUserInfo = v2, y;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), e2.prototype.toStorageString = function t8() {
              return i.Log.debug("SigninState.toStorageString"), JSON.stringify({ id: this.id, data: this.data, created: this.created, request_type: this.request_type, nonce: this.nonce, code_verifier: this.code_verifier, redirect_uri: this.redirect_uri, authority: this.authority, client_id: this.client_id, response_mode: this.response_mode, client_secret: this.client_secret, scope: this.scope, extraTokenParams: this.extraTokenParams, skipUserInfo: this.skipUserInfo });
            }, e2.fromStorageString = function t8(r2) {
              return i.Log.debug("SigninState.fromStorageString"), new e2(JSON.parse(r2));
            }, n(e2, [{ key: "nonce", get: function t8() {
              return this._nonce;
            } }, { key: "authority", get: function t8() {
              return this._authority;
            } }, { key: "client_id", get: function t8() {
              return this._client_id;
            } }, { key: "redirect_uri", get: function t8() {
              return this._redirect_uri;
            } }, { key: "code_verifier", get: function t8() {
              return this._code_verifier;
            } }, { key: "code_challenge", get: function t8() {
              return this._code_challenge;
            } }, { key: "response_mode", get: function t8() {
              return this._response_mode;
            } }, { key: "client_secret", get: function t8() {
              return this._client_secret;
            } }, { key: "scope", get: function t8() {
              return this._scope;
            } }, { key: "extraTokenParams", get: function t8() {
              return this._extraTokenParams;
            } }, { key: "skipUserInfo", get: function t8() {
              return this._skipUserInfo;
            } }]), e2;
          }(o.State);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.default = function n() {
            return ("undefined" != i && null !== i && void 0 !== i.getRandomValues ? o : s)().replace(/-/g, "");
          };
          var i = "undefined" != typeof window ? window.crypto || window.msCrypto : null;
          function o() {
            return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, function(t7) {
              return (t7 ^ i.getRandomValues(new Uint8Array(1))[0] & 15 >> t7 / 4).toString(16);
            });
          }
          function s() {
            return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, function(t7) {
              return (t7 ^ 16 * Math.random() >> t7 / 4).toString(16);
            });
          }
          t6.exports = e.default;
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.User = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0);
          e.User = function() {
            function t7(e2) {
              var r2 = e2.id_token, n2 = e2.session_state, i2 = e2.access_token, o = e2.refresh_token, s = e2.token_type, a = e2.scope, u = e2.profile, c = e2.expires_at, h = e2.state;
              !function l(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this.id_token = r2, this.session_state = n2, this.access_token = i2, this.refresh_token = o, this.token_type = s, this.scope = a, this.profile = u, this.expires_at = c, this.state = h;
            }
            return t7.prototype.toStorageString = function t8() {
              return i.Log.debug("User.toStorageString"), JSON.stringify({ id_token: this.id_token, session_state: this.session_state, access_token: this.access_token, refresh_token: this.refresh_token, token_type: this.token_type, scope: this.scope, profile: this.profile, expires_at: this.expires_at });
            }, t7.fromStorageString = function e2(r2) {
              return i.Log.debug("User.fromStorageString"), new t7(JSON.parse(r2));
            }, n(t7, [{ key: "expires_in", get: function t8() {
              if (this.expires_at) {
                var e2 = parseInt(Date.now() / 1e3);
                return this.expires_at - e2;
              }
            }, set: function t8(e2) {
              var r2 = parseInt(e2);
              if ("number" == typeof r2 && r2 > 0) {
                var n2 = parseInt(Date.now() / 1e3);
                this.expires_at = n2 + r2;
              }
            } }, { key: "expired", get: function t8() {
              var e2 = this.expires_in;
              if (void 0 !== e2)
                return e2 <= 0;
            } }, { key: "scopes", get: function t8() {
              return (this.scope || "").split(" ");
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.AccessTokenEvents = void 0;
          var n = r(0), i = r(46);
          function o(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.AccessTokenEvents = function() {
            function t7() {
              var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = e2.accessTokenExpiringNotificationTime, n2 = void 0 === r2 ? 60 : r2, s = e2.accessTokenExpiringTimer, a = void 0 === s ? new i.Timer("Access token expiring") : s, u = e2.accessTokenExpiredTimer, c = void 0 === u ? new i.Timer("Access token expired") : u;
              o(this, t7), this._accessTokenExpiringNotificationTime = n2, this._accessTokenExpiring = a, this._accessTokenExpired = c;
            }
            return t7.prototype.load = function t8(e2) {
              if (e2.access_token && void 0 !== e2.expires_in) {
                var r2 = e2.expires_in;
                if (n.Log.debug("AccessTokenEvents.load: access token present, remaining duration:", r2), r2 > 0) {
                  var i2 = r2 - this._accessTokenExpiringNotificationTime;
                  i2 <= 0 && (i2 = 1), n.Log.debug("AccessTokenEvents.load: registering expiring timer in:", i2), this._accessTokenExpiring.init(i2);
                } else
                  n.Log.debug("AccessTokenEvents.load: canceling existing expiring timer becase we're past expiration."), this._accessTokenExpiring.cancel();
                var o2 = r2 + 1;
                n.Log.debug("AccessTokenEvents.load: registering expired timer in:", o2), this._accessTokenExpired.init(o2);
              } else
                this._accessTokenExpiring.cancel(), this._accessTokenExpired.cancel();
            }, t7.prototype.unload = function t8() {
              n.Log.debug("AccessTokenEvents.unload: canceling existing access token timers"), this._accessTokenExpiring.cancel(), this._accessTokenExpired.cancel();
            }, t7.prototype.addAccessTokenExpiring = function t8(e2) {
              this._accessTokenExpiring.addHandler(e2);
            }, t7.prototype.removeAccessTokenExpiring = function t8(e2) {
              this._accessTokenExpiring.removeHandler(e2);
            }, t7.prototype.addAccessTokenExpired = function t8(e2) {
              this._accessTokenExpired.addHandler(e2);
            }, t7.prototype.removeAccessTokenExpired = function t8(e2) {
              this._accessTokenExpired.removeHandler(e2);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Event = void 0;
          var n = r(0);
          e.Event = function() {
            function t7(e2) {
              !function r2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._name = e2, this._callbacks = [];
            }
            return t7.prototype.addHandler = function t8(e2) {
              this._callbacks.push(e2);
            }, t7.prototype.removeHandler = function t8(e2) {
              var r2 = this._callbacks.findIndex(function(t9) {
                return t9 === e2;
              });
              r2 >= 0 && this._callbacks.splice(r2, 1);
            }, t7.prototype.raise = function t8() {
              n.Log.debug("Event: Raising event: " + this._name);
              for (var e2 = 0; e2 < this._callbacks.length; e2++) {
                var r2;
                (r2 = this._callbacks)[e2].apply(r2, arguments);
              }
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SessionMonitor = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(19), s = r(1);
          function a(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.SessionMonitor = function() {
            function t7(e2) {
              var r2 = this, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.CheckSessionIFrame, u = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : s.Global.timer;
              if (a(this, t7), !e2)
                throw i.Log.error("SessionMonitor.ctor: No user manager passed to SessionMonitor"), new Error("userManager");
              this._userManager = e2, this._CheckSessionIFrameCtor = n2, this._timer = u, this._userManager.events.addUserLoaded(this._start.bind(this)), this._userManager.events.addUserUnloaded(this._stop.bind(this)), Promise.resolve(this._userManager.getUser().then(function(t8) {
                t8 ? r2._start(t8) : r2._settings.monitorAnonymousSession && r2._userManager.querySessionStatus().then(function(t9) {
                  var e3 = { session_state: t9.session_state };
                  t9.sub && t9.sid && (e3.profile = { sub: t9.sub, sid: t9.sid }), r2._start(e3);
                }).catch(function(t9) {
                  i.Log.error("SessionMonitor ctor: error from querySessionStatus:", t9.message);
                });
              }).catch(function(t8) {
                i.Log.error("SessionMonitor ctor: error from getUser:", t8.message);
              }));
            }
            return t7.prototype._start = function t8(e2) {
              var r2 = this, n2 = e2.session_state;
              n2 && (e2.profile ? (this._sub = e2.profile.sub, this._sid = e2.profile.sid, i.Log.debug("SessionMonitor._start: session_state:", n2, ", sub:", this._sub)) : (this._sub = void 0, this._sid = void 0, i.Log.debug("SessionMonitor._start: session_state:", n2, ", anonymous user")), this._checkSessionIFrame ? this._checkSessionIFrame.start(n2) : this._metadataService.getCheckSessionIframe().then(function(t9) {
                if (t9) {
                  i.Log.debug("SessionMonitor._start: Initializing check session iframe");
                  var e3 = r2._client_id, o2 = r2._checkSessionInterval, s2 = r2._stopCheckSessionOnError;
                  r2._checkSessionIFrame = new r2._CheckSessionIFrameCtor(r2._callback.bind(r2), e3, t9, o2, s2), r2._checkSessionIFrame.load().then(function() {
                    r2._checkSessionIFrame.start(n2);
                  });
                } else
                  i.Log.warn("SessionMonitor._start: No check session iframe found in the metadata");
              }).catch(function(t9) {
                i.Log.error("SessionMonitor._start: Error from getCheckSessionIframe:", t9.message);
              }));
            }, t7.prototype._stop = function t8() {
              var e2 = this;
              if (this._sub = void 0, this._sid = void 0, this._checkSessionIFrame && (i.Log.debug("SessionMonitor._stop"), this._checkSessionIFrame.stop()), this._settings.monitorAnonymousSession)
                var r2 = this._timer.setInterval(function() {
                  e2._timer.clearInterval(r2), e2._userManager.querySessionStatus().then(function(t9) {
                    var r3 = { session_state: t9.session_state };
                    t9.sub && t9.sid && (r3.profile = { sub: t9.sub, sid: t9.sid }), e2._start(r3);
                  }).catch(function(t9) {
                    i.Log.error("SessionMonitor: error from querySessionStatus:", t9.message);
                  });
                }, 1e3);
            }, t7.prototype._callback = function t8() {
              var e2 = this;
              this._userManager.querySessionStatus().then(function(t9) {
                var r2 = true;
                t9 ? t9.sub === e2._sub ? (r2 = false, e2._checkSessionIFrame.start(t9.session_state), t9.sid === e2._sid ? i.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, restarting check session iframe; session_state:", t9.session_state) : (i.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, session state has changed, restarting check session iframe; session_state:", t9.session_state), e2._userManager.events._raiseUserSessionChanged())) : i.Log.debug("SessionMonitor._callback: Different subject signed into OP:", t9.sub) : i.Log.debug("SessionMonitor._callback: Subject no longer signed into OP"), r2 && (e2._sub ? (i.Log.debug("SessionMonitor._callback: SessionMonitor._callback; raising signed out event"), e2._userManager.events._raiseUserSignedOut()) : (i.Log.debug("SessionMonitor._callback: SessionMonitor._callback; raising signed in event"), e2._userManager.events._raiseUserSignedIn()));
              }).catch(function(t9) {
                e2._sub && (i.Log.debug("SessionMonitor._callback: Error calling queryCurrentSigninSession; raising signed out event", t9.message), e2._userManager.events._raiseUserSignedOut());
              });
            }, n(t7, [{ key: "_settings", get: function t8() {
              return this._userManager.settings;
            } }, { key: "_metadataService", get: function t8() {
              return this._userManager.metadataService;
            } }, { key: "_client_id", get: function t8() {
              return this._settings.client_id;
            } }, { key: "_checkSessionInterval", get: function t8() {
              return this._settings.checkSessionInterval;
            } }, { key: "_stopCheckSessionOnError", get: function t8() {
              return this._settings.stopCheckSessionOnError;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.CheckSessionIFrame = void 0;
          var n = r(0);
          function i(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.CheckSessionIFrame = function() {
            function t7(e2, r2, n2, o) {
              var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
              i(this, t7), this._callback = e2, this._client_id = r2, this._url = n2, this._interval = o || 2e3, this._stopOnError = s;
              var a = n2.indexOf("/", n2.indexOf("//") + 2);
              this._frame_origin = n2.substr(0, a), this._frame = window.document.createElement("iframe"), this._frame.style.visibility = "hidden", this._frame.style.position = "absolute", this._frame.style.display = "none", this._frame.width = 0, this._frame.height = 0, this._frame.src = n2;
            }
            return t7.prototype.load = function t8() {
              var e2 = this;
              return new Promise(function(t9) {
                e2._frame.onload = function() {
                  t9();
                }, window.document.body.appendChild(e2._frame), e2._boundMessageEvent = e2._message.bind(e2), window.addEventListener("message", e2._boundMessageEvent, false);
              });
            }, t7.prototype._message = function t8(e2) {
              e2.origin === this._frame_origin && e2.source === this._frame.contentWindow && ("error" === e2.data ? (n.Log.error("CheckSessionIFrame: error message from check session op iframe"), this._stopOnError && this.stop()) : "changed" === e2.data ? (n.Log.debug("CheckSessionIFrame: changed message from check session op iframe"), this.stop(), this._callback()) : n.Log.debug("CheckSessionIFrame: " + e2.data + " message from check session op iframe"));
            }, t7.prototype.start = function t8(e2) {
              var r2 = this;
              if (this._session_state !== e2) {
                n.Log.debug("CheckSessionIFrame.start"), this.stop(), this._session_state = e2;
                var i2 = function t9() {
                  r2._frame.contentWindow.postMessage(r2._client_id + " " + r2._session_state, r2._frame_origin);
                };
                i2(), this._timer = window.setInterval(i2, this._interval);
              }
            }, t7.prototype.stop = function t8() {
              this._session_state = null, this._timer && (n.Log.debug("CheckSessionIFrame.stop"), window.clearInterval(this._timer), this._timer = null);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.TokenRevocationClient = void 0;
          var n = r(0), i = r(2), o = r(1);
          function s(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          var a = "access_token", u = "refresh_token";
          e.TokenRevocationClient = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.Global.XMLHttpRequest, a2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i.MetadataService;
              if (s(this, t7), !e2)
                throw n.Log.error("TokenRevocationClient.ctor: No settings provided"), new Error("No settings provided.");
              this._settings = e2, this._XMLHttpRequestCtor = r2, this._metadataService = new a2(this._settings);
            }
            return t7.prototype.revoke = function t8(e2, r2) {
              var i2 = this, o2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "access_token";
              if (!e2)
                throw n.Log.error("TokenRevocationClient.revoke: No token provided"), new Error("No token provided.");
              if (o2 !== a && o2 != u)
                throw n.Log.error("TokenRevocationClient.revoke: Invalid token type"), new Error("Invalid token type.");
              return this._metadataService.getRevocationEndpoint().then(function(t9) {
                if (t9) {
                  n.Log.debug("TokenRevocationClient.revoke: Revoking " + o2);
                  var s2 = i2._settings.client_id, a2 = i2._settings.client_secret;
                  return i2._revoke(t9, s2, a2, e2, o2);
                }
                if (r2)
                  throw n.Log.error("TokenRevocationClient.revoke: Revocation not supported"), new Error("Revocation not supported");
              });
            }, t7.prototype._revoke = function t8(e2, r2, i2, o2, s2) {
              var a2 = this;
              return new Promise(function(t9, u2) {
                var c = new a2._XMLHttpRequestCtor();
                c.open("POST", e2), c.onload = function() {
                  n.Log.debug("TokenRevocationClient.revoke: HTTP response received, status", c.status), 200 === c.status ? t9() : u2(Error(c.statusText + " (" + c.status + ")"));
                }, c.onerror = function() {
                  n.Log.debug("TokenRevocationClient.revoke: Network Error."), u2("Network Error");
                };
                var h = "client_id=" + encodeURIComponent(r2);
                i2 && (h += "&client_secret=" + encodeURIComponent(i2)), h += "&token_type_hint=" + encodeURIComponent(s2), h += "&token=" + encodeURIComponent(o2), c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), c.send(h);
              });
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.CordovaPopupWindow = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0);
          e.CordovaPopupWindow = function() {
            function t7(e2) {
              var r2 = this;
              !function n2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._promise = new Promise(function(t8, e3) {
                r2._resolve = t8, r2._reject = e3;
              }), this.features = e2.popupWindowFeatures || "location=no,toolbar=no,zoom=no", this.target = e2.popupWindowTarget || "_blank", this.redirect_uri = e2.startUrl, i.Log.debug("CordovaPopupWindow.ctor: redirect_uri: " + this.redirect_uri);
            }
            return t7.prototype._isInAppBrowserInstalled = function t8(e2) {
              return ["cordova-plugin-inappbrowser", "cordova-plugin-inappbrowser.inappbrowser", "org.apache.cordova.inappbrowser"].some(function(t9) {
                return e2.hasOwnProperty(t9);
              });
            }, t7.prototype.navigate = function t8(e2) {
              if (e2 && e2.url) {
                if (!window.cordova)
                  return this._error("cordova is undefined");
                var r2 = window.cordova.require("cordova/plugin_list").metadata;
                if (false === this._isInAppBrowserInstalled(r2))
                  return this._error("InAppBrowser plugin not found");
                this._popup = cordova.InAppBrowser.open(e2.url, this.target, this.features), this._popup ? (i.Log.debug("CordovaPopupWindow.navigate: popup successfully created"), this._exitCallbackEvent = this._exitCallback.bind(this), this._loadStartCallbackEvent = this._loadStartCallback.bind(this), this._popup.addEventListener("exit", this._exitCallbackEvent, false), this._popup.addEventListener("loadstart", this._loadStartCallbackEvent, false)) : this._error("Error opening popup window");
              } else
                this._error("No url provided");
              return this.promise;
            }, t7.prototype._loadStartCallback = function t8(e2) {
              0 === e2.url.indexOf(this.redirect_uri) && this._success({ url: e2.url });
            }, t7.prototype._exitCallback = function t8(e2) {
              this._error(e2);
            }, t7.prototype._success = function t8(e2) {
              this._cleanup(), i.Log.debug("CordovaPopupWindow: Successful response from cordova popup window"), this._resolve(e2);
            }, t7.prototype._error = function t8(e2) {
              this._cleanup(), i.Log.error(e2), this._reject(new Error(e2));
            }, t7.prototype.close = function t8() {
              this._cleanup();
            }, t7.prototype._cleanup = function t8() {
              this._popup && (i.Log.debug("CordovaPopupWindow: cleaning up popup"), this._popup.removeEventListener("exit", this._exitCallbackEvent, false), this._popup.removeEventListener("loadstart", this._loadStartCallbackEvent, false), this._popup.close()), this._popup = null;
            }, n(t7, [{ key: "promise", get: function t8() {
              return this._promise;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var n = r(0), i = r(10), o = r(5), s = r(6), a = r(37), u = r(38), c = r(16), h = r(2), l = r(48), f = r(49), g = r(19), d = r(20), p = r(18), v2 = r(1), y = r(15), m = r(50);
          e.default = { Version: m.Version, Log: n.Log, OidcClient: i.OidcClient, OidcClientSettings: o.OidcClientSettings, WebStorageStateStore: s.WebStorageStateStore, InMemoryWebStorage: a.InMemoryWebStorage, UserManager: u.UserManager, AccessTokenEvents: c.AccessTokenEvents, MetadataService: h.MetadataService, CordovaPopupNavigator: l.CordovaPopupNavigator, CordovaIFrameNavigator: f.CordovaIFrameNavigator, CheckSessionIFrame: g.CheckSessionIFrame, TokenRevocationClient: d.TokenRevocationClient, SessionMonitor: p.SessionMonitor, Global: v2.Global, User: y.User }, t6.exports = e.default;
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          e.ClockService = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.getEpochTime = function t8() {
              return Promise.resolve(Date.now() / 1e3 | 0);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.ResponseValidator = void 0;
          var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t7) {
            return typeof t7;
          } : function(t7) {
            return t7 && "function" == typeof Symbol && t7.constructor === Symbol && t7 !== Symbol.prototype ? "symbol" : typeof t7;
          }, i = r(0), o = r(2), s = r(25), a = r(11), u = r(12), c = r(4);
          function h(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          var l = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss", "c_hash"];
          e.ResponseValidator = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.MetadataService, n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : s.UserInfoService, u2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : c.JoseUtil, l2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : a.TokenClient;
              if (h(this, t7), !e2)
                throw i.Log.error("ResponseValidator.ctor: No settings passed to ResponseValidator"), new Error("settings");
              this._settings = e2, this._metadataService = new r2(this._settings), this._userInfoService = new n2(this._settings), this._joseUtil = u2, this._tokenClient = new l2(this._settings);
            }
            return t7.prototype.validateSigninResponse = function t8(e2, r2) {
              var n2 = this;
              return i.Log.debug("ResponseValidator.validateSigninResponse"), this._processSigninParams(e2, r2).then(function(t9) {
                return i.Log.debug("ResponseValidator.validateSigninResponse: state processed"), n2._validateTokens(e2, t9).then(function(t10) {
                  return i.Log.debug("ResponseValidator.validateSigninResponse: tokens validated"), n2._processClaims(e2, t10).then(function(t11) {
                    return i.Log.debug("ResponseValidator.validateSigninResponse: claims processed"), t11;
                  });
                });
              });
            }, t7.prototype.validateSignoutResponse = function t8(e2, r2) {
              return e2.id !== r2.state ? (i.Log.error("ResponseValidator.validateSignoutResponse: State does not match"), Promise.reject(new Error("State does not match"))) : (i.Log.debug("ResponseValidator.validateSignoutResponse: state validated"), r2.state = e2.data, r2.error ? (i.Log.warn("ResponseValidator.validateSignoutResponse: Response was error", r2.error), Promise.reject(new u.ErrorResponse(r2))) : Promise.resolve(r2));
            }, t7.prototype._processSigninParams = function t8(e2, r2) {
              if (e2.id !== r2.state)
                return i.Log.error("ResponseValidator._processSigninParams: State does not match"), Promise.reject(new Error("State does not match"));
              if (!e2.client_id)
                return i.Log.error("ResponseValidator._processSigninParams: No client_id on state"), Promise.reject(new Error("No client_id on state"));
              if (!e2.authority)
                return i.Log.error("ResponseValidator._processSigninParams: No authority on state"), Promise.reject(new Error("No authority on state"));
              if (this._settings.authority) {
                if (this._settings.authority && this._settings.authority !== e2.authority)
                  return i.Log.error("ResponseValidator._processSigninParams: authority mismatch on settings vs. signin state"), Promise.reject(new Error("authority mismatch on settings vs. signin state"));
              } else
                this._settings.authority = e2.authority;
              if (this._settings.client_id) {
                if (this._settings.client_id && this._settings.client_id !== e2.client_id)
                  return i.Log.error("ResponseValidator._processSigninParams: client_id mismatch on settings vs. signin state"), Promise.reject(new Error("client_id mismatch on settings vs. signin state"));
              } else
                this._settings.client_id = e2.client_id;
              return i.Log.debug("ResponseValidator._processSigninParams: state validated"), r2.state = e2.data, r2.error ? (i.Log.warn("ResponseValidator._processSigninParams: Response was error", r2.error), Promise.reject(new u.ErrorResponse(r2))) : e2.nonce && !r2.id_token ? (i.Log.error("ResponseValidator._processSigninParams: Expecting id_token in response"), Promise.reject(new Error("No id_token in response"))) : !e2.nonce && r2.id_token ? (i.Log.error("ResponseValidator._processSigninParams: Not expecting id_token in response"), Promise.reject(new Error("Unexpected id_token in response"))) : e2.code_verifier && !r2.code ? (i.Log.error("ResponseValidator._processSigninParams: Expecting code in response"), Promise.reject(new Error("No code in response"))) : !e2.code_verifier && r2.code ? (i.Log.error("ResponseValidator._processSigninParams: Not expecting code in response"), Promise.reject(new Error("Unexpected code in response"))) : (r2.scope || (r2.scope = e2.scope), Promise.resolve(r2));
            }, t7.prototype._processClaims = function t8(e2, r2) {
              var n2 = this;
              if (r2.isOpenIdConnect) {
                if (i.Log.debug("ResponseValidator._processClaims: response is OIDC, processing claims"), r2.profile = this._filterProtocolClaims(r2.profile), true !== e2.skipUserInfo && this._settings.loadUserInfo && r2.access_token)
                  return i.Log.debug("ResponseValidator._processClaims: loading user info"), this._userInfoService.getClaims(r2.access_token).then(function(t9) {
                    return i.Log.debug("ResponseValidator._processClaims: user info claims received from user info endpoint"), t9.sub !== r2.profile.sub ? (i.Log.error("ResponseValidator._processClaims: sub from user info endpoint does not match sub in id_token"), Promise.reject(new Error("sub from user info endpoint does not match sub in id_token"))) : (r2.profile = n2._mergeClaims(r2.profile, t9), i.Log.debug("ResponseValidator._processClaims: user info claims received, updated profile:", r2.profile), r2);
                  });
                i.Log.debug("ResponseValidator._processClaims: not loading user info");
              } else
                i.Log.debug("ResponseValidator._processClaims: response is not OIDC, not processing claims");
              return Promise.resolve(r2);
            }, t7.prototype._mergeClaims = function t8(e2, r2) {
              var i2 = Object.assign({}, e2);
              for (var o2 in r2) {
                var s2 = r2[o2];
                Array.isArray(s2) || (s2 = [s2]);
                for (var a2 = 0; a2 < s2.length; a2++) {
                  var u2 = s2[a2];
                  i2[o2] ? Array.isArray(i2[o2]) ? i2[o2].indexOf(u2) < 0 && i2[o2].push(u2) : i2[o2] !== u2 && ("object" === (void 0 === u2 ? "undefined" : n(u2)) && this._settings.mergeClaims ? i2[o2] = this._mergeClaims(i2[o2], u2) : i2[o2] = [i2[o2], u2]) : i2[o2] = u2;
                }
              }
              return i2;
            }, t7.prototype._filterProtocolClaims = function t8(e2) {
              i.Log.debug("ResponseValidator._filterProtocolClaims, incoming claims:", e2);
              var r2 = Object.assign({}, e2);
              return this._settings._filterProtocolClaims ? (l.forEach(function(t9) {
                delete r2[t9];
              }), i.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims filtered", r2)) : i.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims not filtered"), r2;
            }, t7.prototype._validateTokens = function t8(e2, r2) {
              return r2.code ? (i.Log.debug("ResponseValidator._validateTokens: Validating code"), this._processCode(e2, r2)) : r2.id_token ? r2.access_token ? (i.Log.debug("ResponseValidator._validateTokens: Validating id_token and access_token"), this._validateIdTokenAndAccessToken(e2, r2)) : (i.Log.debug("ResponseValidator._validateTokens: Validating id_token"), this._validateIdToken(e2, r2)) : (i.Log.debug("ResponseValidator._validateTokens: No code to process or id_token to validate"), Promise.resolve(r2));
            }, t7.prototype._processCode = function t8(e2, r2) {
              var o2 = this, s2 = { client_id: e2.client_id, client_secret: e2.client_secret, code: r2.code, redirect_uri: e2.redirect_uri, code_verifier: e2.code_verifier };
              return e2.extraTokenParams && "object" === n(e2.extraTokenParams) && Object.assign(s2, e2.extraTokenParams), this._tokenClient.exchangeCode(s2).then(function(t9) {
                for (var n2 in t9)
                  r2[n2] = t9[n2];
                return r2.id_token ? (i.Log.debug("ResponseValidator._processCode: token response successful, processing id_token"), o2._validateIdTokenAttributes(e2, r2)) : (i.Log.debug("ResponseValidator._processCode: token response successful, returning response"), r2);
              });
            }, t7.prototype._validateIdTokenAttributes = function t8(e2, r2) {
              var n2 = this;
              return this._metadataService.getIssuer().then(function(t9) {
                var o2 = e2.client_id, s2 = n2._settings.clockSkew;
                return i.Log.debug("ResponseValidator._validateIdTokenAttributes: Validaing JWT attributes; using clock skew (in seconds) of: ", s2), n2._settings.getEpochTime().then(function(a2) {
                  return n2._joseUtil.validateJwtAttributes(r2.id_token, t9, o2, s2, a2).then(function(t10) {
                    return e2.nonce && e2.nonce !== t10.nonce ? (i.Log.error("ResponseValidator._validateIdTokenAttributes: Invalid nonce in id_token"), Promise.reject(new Error("Invalid nonce in id_token"))) : t10.sub ? (r2.profile = t10, r2) : (i.Log.error("ResponseValidator._validateIdTokenAttributes: No sub present in id_token"), Promise.reject(new Error("No sub present in id_token")));
                  });
                });
              });
            }, t7.prototype._validateIdTokenAndAccessToken = function t8(e2, r2) {
              var n2 = this;
              return this._validateIdToken(e2, r2).then(function(t9) {
                return n2._validateAccessToken(t9);
              });
            }, t7.prototype._getSigningKeyForJwt = function t8(e2) {
              var r2 = this;
              return this._metadataService.getSigningKeys().then(function(t9) {
                var n2 = e2.header.kid;
                if (!t9)
                  return i.Log.error("ResponseValidator._validateIdToken: No signing keys from metadata"), Promise.reject(new Error("No signing keys from metadata"));
                i.Log.debug("ResponseValidator._validateIdToken: Received signing keys");
                var o2 = void 0;
                if (n2)
                  o2 = t9.filter(function(t10) {
                    return t10.kid === n2;
                  })[0];
                else {
                  if ((t9 = r2._filterByAlg(t9, e2.header.alg)).length > 1)
                    return i.Log.error("ResponseValidator._validateIdToken: No kid found in id_token and more than one key found in metadata"), Promise.reject(new Error("No kid found in id_token and more than one key found in metadata"));
                  o2 = t9[0];
                }
                return Promise.resolve(o2);
              });
            }, t7.prototype._getSigningKeyForJwtWithSingleRetry = function t8(e2) {
              var r2 = this;
              return this._getSigningKeyForJwt(e2).then(function(t9) {
                return t9 ? Promise.resolve(t9) : (r2._metadataService.resetSigningKeys(), r2._getSigningKeyForJwt(e2));
              });
            }, t7.prototype._validateIdToken = function t8(e2, r2) {
              var n2 = this;
              if (!e2.nonce)
                return i.Log.error("ResponseValidator._validateIdToken: No nonce on state"), Promise.reject(new Error("No nonce on state"));
              var o2 = this._joseUtil.parseJwt(r2.id_token);
              return o2 && o2.header && o2.payload ? e2.nonce !== o2.payload.nonce ? (i.Log.error("ResponseValidator._validateIdToken: Invalid nonce in id_token"), Promise.reject(new Error("Invalid nonce in id_token"))) : this._metadataService.getIssuer().then(function(t9) {
                return i.Log.debug("ResponseValidator._validateIdToken: Received issuer"), n2._getSigningKeyForJwtWithSingleRetry(o2).then(function(s2) {
                  if (!s2)
                    return i.Log.error("ResponseValidator._validateIdToken: No key matching kid or alg found in signing keys"), Promise.reject(new Error("No key matching kid or alg found in signing keys"));
                  var a2 = e2.client_id, u2 = n2._settings.clockSkew;
                  return i.Log.debug("ResponseValidator._validateIdToken: Validaing JWT; using clock skew (in seconds) of: ", u2), n2._joseUtil.validateJwt(r2.id_token, s2, t9, a2, u2).then(function() {
                    return i.Log.debug("ResponseValidator._validateIdToken: JWT validation successful"), o2.payload.sub ? (r2.profile = o2.payload, r2) : (i.Log.error("ResponseValidator._validateIdToken: No sub present in id_token"), Promise.reject(new Error("No sub present in id_token")));
                  });
                });
              }) : (i.Log.error("ResponseValidator._validateIdToken: Failed to parse id_token", o2), Promise.reject(new Error("Failed to parse id_token")));
            }, t7.prototype._filterByAlg = function t8(e2, r2) {
              var n2 = null;
              if (r2.startsWith("RS"))
                n2 = "RSA";
              else if (r2.startsWith("PS"))
                n2 = "PS";
              else {
                if (!r2.startsWith("ES"))
                  return i.Log.debug("ResponseValidator._filterByAlg: alg not supported: ", r2), [];
                n2 = "EC";
              }
              return i.Log.debug("ResponseValidator._filterByAlg: Looking for keys that match kty: ", n2), e2 = e2.filter(function(t9) {
                return t9.kty === n2;
              }), i.Log.debug("ResponseValidator._filterByAlg: Number of keys that match kty: ", n2, e2.length), e2;
            }, t7.prototype._validateAccessToken = function t8(e2) {
              if (!e2.profile)
                return i.Log.error("ResponseValidator._validateAccessToken: No profile loaded from id_token"), Promise.reject(new Error("No profile loaded from id_token"));
              if (!e2.profile.at_hash)
                return i.Log.error("ResponseValidator._validateAccessToken: No at_hash in id_token"), Promise.reject(new Error("No at_hash in id_token"));
              if (!e2.id_token)
                return i.Log.error("ResponseValidator._validateAccessToken: No id_token"), Promise.reject(new Error("No id_token"));
              var r2 = this._joseUtil.parseJwt(e2.id_token);
              if (!r2 || !r2.header)
                return i.Log.error("ResponseValidator._validateAccessToken: Failed to parse id_token", r2), Promise.reject(new Error("Failed to parse id_token"));
              var n2 = r2.header.alg;
              if (!n2 || 5 !== n2.length)
                return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:", n2), Promise.reject(new Error("Unsupported alg: " + n2));
              var o2 = n2.substr(2, 3);
              if (!o2)
                return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:", n2, o2), Promise.reject(new Error("Unsupported alg: " + n2));
              if (256 !== (o2 = parseInt(o2)) && 384 !== o2 && 512 !== o2)
                return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:", n2, o2), Promise.reject(new Error("Unsupported alg: " + n2));
              var s2 = "sha" + o2, a2 = this._joseUtil.hashString(e2.access_token, s2);
              if (!a2)
                return i.Log.error("ResponseValidator._validateAccessToken: access_token hash failed:", s2), Promise.reject(new Error("Failed to validate at_hash"));
              var u2 = a2.substr(0, a2.length / 2), c2 = this._joseUtil.hexToBase64Url(u2);
              return c2 !== e2.profile.at_hash ? (i.Log.error("ResponseValidator._validateAccessToken: Failed to validate at_hash", c2, e2.profile.at_hash), Promise.reject(new Error("Failed to validate at_hash"))) : (i.Log.debug("ResponseValidator._validateAccessToken: success"), Promise.resolve(e2));
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.UserInfoService = void 0;
          var n = r(7), i = r(2), o = r(0), s = r(4);
          function a(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.UserInfoService = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.JsonService, u = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : i.MetadataService, c = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : s.JoseUtil;
              if (a(this, t7), !e2)
                throw o.Log.error("UserInfoService.ctor: No settings passed"), new Error("settings");
              this._settings = e2, this._jsonService = new r2(void 0, void 0, this._getClaimsFromJwt.bind(this)), this._metadataService = new u(this._settings), this._joseUtil = c;
            }
            return t7.prototype.getClaims = function t8(e2) {
              var r2 = this;
              return e2 ? this._metadataService.getUserInfoEndpoint().then(function(t9) {
                return o.Log.debug("UserInfoService.getClaims: received userinfo url", t9), r2._jsonService.getJson(t9, e2).then(function(t10) {
                  return o.Log.debug("UserInfoService.getClaims: claims received", t10), t10;
                });
              }) : (o.Log.error("UserInfoService.getClaims: No token passed"), Promise.reject(new Error("A token is required")));
            }, t7.prototype._getClaimsFromJwt = function t8(e2) {
              var r2 = this;
              try {
                var n2 = this._joseUtil.parseJwt(e2.responseText);
                if (!n2 || !n2.header || !n2.payload)
                  return o.Log.error("UserInfoService._getClaimsFromJwt: Failed to parse JWT", n2), Promise.reject(new Error("Failed to parse id_token"));
                var i2 = n2.header.kid, s2 = void 0;
                switch (this._settings.userInfoJwtIssuer) {
                  case "OP":
                    s2 = this._metadataService.getIssuer();
                    break;
                  case "ANY":
                    s2 = Promise.resolve(n2.payload.iss);
                    break;
                  default:
                    s2 = Promise.resolve(this._settings.userInfoJwtIssuer);
                }
                return s2.then(function(t9) {
                  return o.Log.debug("UserInfoService._getClaimsFromJwt: Received issuer:" + t9), r2._metadataService.getSigningKeys().then(function(s3) {
                    if (!s3)
                      return o.Log.error("UserInfoService._getClaimsFromJwt: No signing keys from metadata"), Promise.reject(new Error("No signing keys from metadata"));
                    o.Log.debug("UserInfoService._getClaimsFromJwt: Received signing keys");
                    var a2 = void 0;
                    if (i2)
                      a2 = s3.filter(function(t10) {
                        return t10.kid === i2;
                      })[0];
                    else {
                      if ((s3 = r2._filterByAlg(s3, n2.header.alg)).length > 1)
                        return o.Log.error("UserInfoService._getClaimsFromJwt: No kid found in id_token and more than one key found in metadata"), Promise.reject(new Error("No kid found in id_token and more than one key found in metadata"));
                      a2 = s3[0];
                    }
                    if (!a2)
                      return o.Log.error("UserInfoService._getClaimsFromJwt: No key matching kid or alg found in signing keys"), Promise.reject(new Error("No key matching kid or alg found in signing keys"));
                    var u = r2._settings.client_id, c = r2._settings.clockSkew;
                    return o.Log.debug("UserInfoService._getClaimsFromJwt: Validaing JWT; using clock skew (in seconds) of: ", c), r2._joseUtil.validateJwt(e2.responseText, a2, t9, u, c, void 0, true).then(function() {
                      return o.Log.debug("UserInfoService._getClaimsFromJwt: JWT validation successful"), n2.payload;
                    });
                  });
                });
              } catch (t9) {
                return o.Log.error("UserInfoService._getClaimsFromJwt: Error parsing JWT response", t9.message), void reject(t9);
              }
            }, t7.prototype._filterByAlg = function t8(e2, r2) {
              var n2 = null;
              if (r2.startsWith("RS"))
                n2 = "RSA";
              else if (r2.startsWith("PS"))
                n2 = "PS";
              else {
                if (!r2.startsWith("ES"))
                  return o.Log.debug("UserInfoService._filterByAlg: alg not supported: ", r2), [];
                n2 = "EC";
              }
              return o.Log.debug("UserInfoService._filterByAlg: Looking for keys that match kty: ", n2), e2 = e2.filter(function(t9) {
                return t9.kty === n2;
              }), o.Log.debug("UserInfoService._filterByAlg: Number of keys that match kty: ", n2, e2.length), e2;
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.AllowedSigningAlgs = e.b64tohex = e.hextob64u = e.crypto = e.X509 = e.KeyUtil = e.jws = void 0;
          var n = r(27);
          e.jws = n.jws, e.KeyUtil = n.KEYUTIL, e.X509 = n.X509, e.crypto = n.crypto, e.hextob64u = n.hextob64u, e.b64tohex = n.b64tohex, e.AllowedSigningAlgs = ["RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
        }, function(t6, e, r) {
          "use strict";
          (function(t7) {
            Object.defineProperty(e, "__esModule", { value: true });
            var r2, n, i, o, s, a, u, c, h, l, f, g = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t8) {
              return typeof t8;
            } : function(t8) {
              return t8 && "function" == typeof Symbol && t8.constructor === Symbol && t8 !== Symbol.prototype ? "symbol" : typeof t8;
            }, d = { userAgent: false }, p = {}, v2 = v2 || (r2 = Math, i = (n = {}).lib = {}, o = i.Base = /* @__PURE__ */ function() {
              function t8() {
              }
              return { extend: function e2(r3) {
                t8.prototype = this;
                var n2 = new t8();
                return r3 && n2.mixIn(r3), n2.hasOwnProperty("init") || (n2.init = function() {
                  n2.$super.init.apply(this, arguments);
                }), n2.init.prototype = n2, n2.$super = this, n2;
              }, create: function t9() {
                var e2 = this.extend();
                return e2.init.apply(e2, arguments), e2;
              }, init: function t9() {
              }, mixIn: function t9(e2) {
                for (var r3 in e2)
                  e2.hasOwnProperty(r3) && (this[r3] = e2[r3]);
                e2.hasOwnProperty("toString") && (this.toString = e2.toString);
              }, clone: function t9() {
                return this.init.prototype.extend(this);
              } };
            }(), s = i.WordArray = o.extend({ init: function t8(e2, r3) {
              e2 = this.words = e2 || [], this.sigBytes = null != r3 ? r3 : 4 * e2.length;
            }, toString: function t8(e2) {
              return (e2 || u).stringify(this);
            }, concat: function t8(e2) {
              var r3 = this.words, n2 = e2.words, i2 = this.sigBytes, o2 = e2.sigBytes;
              if (this.clamp(), i2 % 4)
                for (var s2 = 0; s2 < o2; s2++) {
                  var a2 = n2[s2 >>> 2] >>> 24 - s2 % 4 * 8 & 255;
                  r3[i2 + s2 >>> 2] |= a2 << 24 - (i2 + s2) % 4 * 8;
                }
              else
                for (s2 = 0; s2 < o2; s2 += 4)
                  r3[i2 + s2 >>> 2] = n2[s2 >>> 2];
              return this.sigBytes += o2, this;
            }, clamp: function t8() {
              var e2 = this.words, n2 = this.sigBytes;
              e2[n2 >>> 2] &= 4294967295 << 32 - n2 % 4 * 8, e2.length = r2.ceil(n2 / 4);
            }, clone: function t8() {
              var e2 = o.clone.call(this);
              return e2.words = this.words.slice(0), e2;
            }, random: function t8(e2) {
              for (var n2 = [], i2 = 0; i2 < e2; i2 += 4)
                n2.push(4294967296 * r2.random() | 0);
              return new s.init(n2, e2);
            } }), a = n.enc = {}, u = a.Hex = { stringify: function t8(e2) {
              for (var r3 = e2.words, n2 = e2.sigBytes, i2 = [], o2 = 0; o2 < n2; o2++) {
                var s2 = r3[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255;
                i2.push((s2 >>> 4).toString(16)), i2.push((15 & s2).toString(16));
              }
              return i2.join("");
            }, parse: function t8(e2) {
              for (var r3 = e2.length, n2 = [], i2 = 0; i2 < r3; i2 += 2)
                n2[i2 >>> 3] |= parseInt(e2.substr(i2, 2), 16) << 24 - i2 % 8 * 4;
              return new s.init(n2, r3 / 2);
            } }, c = a.Latin1 = { stringify: function t8(e2) {
              for (var r3 = e2.words, n2 = e2.sigBytes, i2 = [], o2 = 0; o2 < n2; o2++) {
                var s2 = r3[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255;
                i2.push(String.fromCharCode(s2));
              }
              return i2.join("");
            }, parse: function t8(e2) {
              for (var r3 = e2.length, n2 = [], i2 = 0; i2 < r3; i2++)
                n2[i2 >>> 2] |= (255 & e2.charCodeAt(i2)) << 24 - i2 % 4 * 8;
              return new s.init(n2, r3);
            } }, h = a.Utf8 = { stringify: function t8(e2) {
              try {
                return decodeURIComponent(escape(c.stringify(e2)));
              } catch (t9) {
                throw new Error("Malformed UTF-8 data");
              }
            }, parse: function t8(e2) {
              return c.parse(unescape(encodeURIComponent(e2)));
            } }, l = i.BufferedBlockAlgorithm = o.extend({ reset: function t8() {
              this._data = new s.init(), this._nDataBytes = 0;
            }, _append: function t8(e2) {
              "string" == typeof e2 && (e2 = h.parse(e2)), this._data.concat(e2), this._nDataBytes += e2.sigBytes;
            }, _process: function t8(e2) {
              var n2 = this._data, i2 = n2.words, o2 = n2.sigBytes, a2 = this.blockSize, u2 = o2 / (4 * a2), c2 = (u2 = e2 ? r2.ceil(u2) : r2.max((0 | u2) - this._minBufferSize, 0)) * a2, h2 = r2.min(4 * c2, o2);
              if (c2) {
                for (var l2 = 0; l2 < c2; l2 += a2)
                  this._doProcessBlock(i2, l2);
                var f2 = i2.splice(0, c2);
                n2.sigBytes -= h2;
              }
              return new s.init(f2, h2);
            }, clone: function t8() {
              var e2 = o.clone.call(this);
              return e2._data = this._data.clone(), e2;
            }, _minBufferSize: 0 }), i.Hasher = l.extend({ cfg: o.extend(), init: function t8(e2) {
              this.cfg = this.cfg.extend(e2), this.reset();
            }, reset: function t8() {
              l.reset.call(this), this._doReset();
            }, update: function t8(e2) {
              return this._append(e2), this._process(), this;
            }, finalize: function t8(e2) {
              return e2 && this._append(e2), this._doFinalize();
            }, blockSize: 16, _createHelper: function t8(e2) {
              return function(t9, r3) {
                return new e2.init(r3).finalize(t9);
              };
            }, _createHmacHelper: function t8(e2) {
              return function(t9, r3) {
                return new f.HMAC.init(e2, r3).finalize(t9);
              };
            } }), f = n.algo = {}, n);
            !function(t8) {
              var e2, r3 = (e2 = v2).lib, n2 = r3.Base, i2 = r3.WordArray;
              (e2 = e2.x64 = {}).Word = n2.extend({ init: function t9(e3, r4) {
                this.high = e3, this.low = r4;
              } }), e2.WordArray = n2.extend({ init: function t9(e3, r4) {
                e3 = this.words = e3 || [], this.sigBytes = null != r4 ? r4 : 8 * e3.length;
              }, toX32: function t9() {
                for (var e3 = this.words, r4 = e3.length, n3 = [], o2 = 0; o2 < r4; o2++) {
                  var s2 = e3[o2];
                  n3.push(s2.high), n3.push(s2.low);
                }
                return i2.create(n3, this.sigBytes);
              }, clone: function t9() {
                for (var e3 = n2.clone.call(this), r4 = e3.words = this.words.slice(0), i3 = r4.length, o2 = 0; o2 < i3; o2++)
                  r4[o2] = r4[o2].clone();
                return e3;
              } });
            }(), function() {
              var t8 = v2, e2 = t8.lib.WordArray;
              t8.enc.Base64 = { stringify: function t9(e3) {
                var r3 = e3.words, n2 = e3.sigBytes, i2 = this._map;
                e3.clamp(), e3 = [];
                for (var o2 = 0; o2 < n2; o2 += 3)
                  for (var s2 = (r3[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255) << 16 | (r3[o2 + 1 >>> 2] >>> 24 - (o2 + 1) % 4 * 8 & 255) << 8 | r3[o2 + 2 >>> 2] >>> 24 - (o2 + 2) % 4 * 8 & 255, a2 = 0; 4 > a2 && o2 + 0.75 * a2 < n2; a2++)
                    e3.push(i2.charAt(s2 >>> 6 * (3 - a2) & 63));
                if (r3 = i2.charAt(64))
                  for (; e3.length % 4; )
                    e3.push(r3);
                return e3.join("");
              }, parse: function t9(r3) {
                var n2 = r3.length, i2 = this._map;
                (o2 = i2.charAt(64)) && (-1 != (o2 = r3.indexOf(o2)) && (n2 = o2));
                for (var o2 = [], s2 = 0, a2 = 0; a2 < n2; a2++)
                  if (a2 % 4) {
                    var u2 = i2.indexOf(r3.charAt(a2 - 1)) << a2 % 4 * 2, c2 = i2.indexOf(r3.charAt(a2)) >>> 6 - a2 % 4 * 2;
                    o2[s2 >>> 2] |= (u2 | c2) << 24 - s2 % 4 * 8, s2++;
                  }
                return e2.create(o2, s2);
              }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
            }(), function(t8) {
              for (var e2 = v2, r3 = (i2 = e2.lib).WordArray, n2 = i2.Hasher, i2 = e2.algo, o2 = [], s2 = [], a2 = function t9(e3) {
                return 4294967296 * (e3 - (0 | e3)) | 0;
              }, u2 = 2, c2 = 0; 64 > c2; ) {
                var h2;
                t: {
                  h2 = u2;
                  for (var l2 = t8.sqrt(h2), f2 = 2; f2 <= l2; f2++)
                    if (!(h2 % f2)) {
                      h2 = false;
                      break t;
                    }
                  h2 = true;
                }
                h2 && (8 > c2 && (o2[c2] = a2(t8.pow(u2, 0.5))), s2[c2] = a2(t8.pow(u2, 1 / 3)), c2++), u2++;
              }
              var g2 = [];
              i2 = i2.SHA256 = n2.extend({ _doReset: function t9() {
                this._hash = new r3.init(o2.slice(0));
              }, _doProcessBlock: function t9(e3, r4) {
                for (var n3 = this._hash.words, i3 = n3[0], o3 = n3[1], a3 = n3[2], u3 = n3[3], c3 = n3[4], h3 = n3[5], l3 = n3[6], f3 = n3[7], d2 = 0; 64 > d2; d2++) {
                  if (16 > d2)
                    g2[d2] = 0 | e3[r4 + d2];
                  else {
                    var p2 = g2[d2 - 15], v3 = g2[d2 - 2];
                    g2[d2] = ((p2 << 25 | p2 >>> 7) ^ (p2 << 14 | p2 >>> 18) ^ p2 >>> 3) + g2[d2 - 7] + ((v3 << 15 | v3 >>> 17) ^ (v3 << 13 | v3 >>> 19) ^ v3 >>> 10) + g2[d2 - 16];
                  }
                  p2 = f3 + ((c3 << 26 | c3 >>> 6) ^ (c3 << 21 | c3 >>> 11) ^ (c3 << 7 | c3 >>> 25)) + (c3 & h3 ^ ~c3 & l3) + s2[d2] + g2[d2], v3 = ((i3 << 30 | i3 >>> 2) ^ (i3 << 19 | i3 >>> 13) ^ (i3 << 10 | i3 >>> 22)) + (i3 & o3 ^ i3 & a3 ^ o3 & a3), f3 = l3, l3 = h3, h3 = c3, c3 = u3 + p2 | 0, u3 = a3, a3 = o3, o3 = i3, i3 = p2 + v3 | 0;
                }
                n3[0] = n3[0] + i3 | 0, n3[1] = n3[1] + o3 | 0, n3[2] = n3[2] + a3 | 0, n3[3] = n3[3] + u3 | 0, n3[4] = n3[4] + c3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l3 | 0, n3[7] = n3[7] + f3 | 0;
              }, _doFinalize: function e3() {
                var r4 = this._data, n3 = r4.words, i3 = 8 * this._nDataBytes, o3 = 8 * r4.sigBytes;
                return n3[o3 >>> 5] |= 128 << 24 - o3 % 32, n3[14 + (o3 + 64 >>> 9 << 4)] = t8.floor(i3 / 4294967296), n3[15 + (o3 + 64 >>> 9 << 4)] = i3, r4.sigBytes = 4 * n3.length, this._process(), this._hash;
              }, clone: function t9() {
                var e3 = n2.clone.call(this);
                return e3._hash = this._hash.clone(), e3;
              } });
              e2.SHA256 = n2._createHelper(i2), e2.HmacSHA256 = n2._createHmacHelper(i2);
            }(Math), function() {
              function t8() {
                return n2.create.apply(n2, arguments);
              }
              for (var e2 = v2, r3 = e2.lib.Hasher, n2 = (o2 = e2.x64).Word, i2 = o2.WordArray, o2 = e2.algo, s2 = [t8(1116352408, 3609767458), t8(1899447441, 602891725), t8(3049323471, 3964484399), t8(3921009573, 2173295548), t8(961987163, 4081628472), t8(1508970993, 3053834265), t8(2453635748, 2937671579), t8(2870763221, 3664609560), t8(3624381080, 2734883394), t8(310598401, 1164996542), t8(607225278, 1323610764), t8(1426881987, 3590304994), t8(1925078388, 4068182383), t8(2162078206, 991336113), t8(2614888103, 633803317), t8(3248222580, 3479774868), t8(3835390401, 2666613458), t8(4022224774, 944711139), t8(264347078, 2341262773), t8(604807628, 2007800933), t8(770255983, 1495990901), t8(1249150122, 1856431235), t8(1555081692, 3175218132), t8(1996064986, 2198950837), t8(2554220882, 3999719339), t8(2821834349, 766784016), t8(2952996808, 2566594879), t8(3210313671, 3203337956), t8(3336571891, 1034457026), t8(3584528711, 2466948901), t8(113926993, 3758326383), t8(338241895, 168717936), t8(666307205, 1188179964), t8(773529912, 1546045734), t8(1294757372, 1522805485), t8(1396182291, 2643833823), t8(1695183700, 2343527390), t8(1986661051, 1014477480), t8(2177026350, 1206759142), t8(2456956037, 344077627), t8(2730485921, 1290863460), t8(2820302411, 3158454273), t8(3259730800, 3505952657), t8(3345764771, 106217008), t8(3516065817, 3606008344), t8(3600352804, 1432725776), t8(4094571909, 1467031594), t8(275423344, 851169720), t8(430227734, 3100823752), t8(506948616, 1363258195), t8(659060556, 3750685593), t8(883997877, 3785050280), t8(958139571, 3318307427), t8(1322822218, 3812723403), t8(1537002063, 2003034995), t8(1747873779, 3602036899), t8(1955562222, 1575990012), t8(2024104815, 1125592928), t8(2227730452, 2716904306), t8(2361852424, 442776044), t8(2428436474, 593698344), t8(2756734187, 3733110249), t8(3204031479, 2999351573), t8(3329325298, 3815920427), t8(3391569614, 3928383900), t8(3515267271, 566280711), t8(3940187606, 3454069534), t8(4118630271, 4000239992), t8(116418474, 1914138554), t8(174292421, 2731055270), t8(289380356, 3203993006), t8(460393269, 320620315), t8(685471733, 587496836), t8(852142971, 1086792851), t8(1017036298, 365543100), t8(1126000580, 2618297676), t8(1288033470, 3409855158), t8(1501505948, 4234509866), t8(1607167915, 987167468), t8(1816402316, 1246189591)], a2 = [], u2 = 0; 80 > u2; u2++)
                a2[u2] = t8();
              o2 = o2.SHA512 = r3.extend({ _doReset: function t9() {
                this._hash = new i2.init([new n2.init(1779033703, 4089235720), new n2.init(3144134277, 2227873595), new n2.init(1013904242, 4271175723), new n2.init(2773480762, 1595750129), new n2.init(1359893119, 2917565137), new n2.init(2600822924, 725511199), new n2.init(528734635, 4215389547), new n2.init(1541459225, 327033209)]);
              }, _doProcessBlock: function t9(e3, r4) {
                for (var n3 = (f2 = this._hash.words)[0], i3 = f2[1], o3 = f2[2], u3 = f2[3], c2 = f2[4], h2 = f2[5], l2 = f2[6], f2 = f2[7], g2 = n3.high, d2 = n3.low, p2 = i3.high, v3 = i3.low, y2 = o3.high, m2 = o3.low, _2 = u3.high, S2 = u3.low, b2 = c2.high, w2 = c2.low, F2 = h2.high, E = h2.low, x = l2.high, A2 = l2.low, k2 = f2.high, P3 = f2.low, C2 = g2, T2 = d2, R2 = p2, I2 = v3, D2 = y2, L2 = m2, N2 = _2, U2 = S2, B3 = b2, O2 = w2, j2 = F2, M2 = E, H3 = x, V3 = A2, K2 = k2, q2 = P3, J = 0; 80 > J; J++) {
                  var W = a2[J];
                  if (16 > J)
                    var z = W.high = 0 | e3[r4 + 2 * J], Y = W.low = 0 | e3[r4 + 2 * J + 1];
                  else {
                    z = ((Y = (z = a2[J - 15]).high) >>> 1 | (G = z.low) << 31) ^ (Y >>> 8 | G << 24) ^ Y >>> 7;
                    var G = (G >>> 1 | Y << 31) ^ (G >>> 8 | Y << 24) ^ (G >>> 7 | Y << 25), X2 = ((Y = (X2 = a2[J - 2]).high) >>> 19 | ($ = X2.low) << 13) ^ (Y << 3 | $ >>> 29) ^ Y >>> 6, $ = ($ >>> 19 | Y << 13) ^ ($ << 3 | Y >>> 29) ^ ($ >>> 6 | Y << 26), Q2 = (Y = a2[J - 7]).high, Z2 = (tt = a2[J - 16]).high, tt = tt.low;
                    z = (z = (z = z + Q2 + ((Y = G + Y.low) >>> 0 < G >>> 0 ? 1 : 0)) + X2 + ((Y = Y + $) >>> 0 < $ >>> 0 ? 1 : 0)) + Z2 + ((Y = Y + tt) >>> 0 < tt >>> 0 ? 1 : 0);
                    W.high = z, W.low = Y;
                  }
                  Q2 = B3 & j2 ^ ~B3 & H3, tt = O2 & M2 ^ ~O2 & V3, W = C2 & R2 ^ C2 & D2 ^ R2 & D2;
                  var et = T2 & I2 ^ T2 & L2 ^ I2 & L2, rt = (G = (C2 >>> 28 | T2 << 4) ^ (C2 << 30 | T2 >>> 2) ^ (C2 << 25 | T2 >>> 7), X2 = (T2 >>> 28 | C2 << 4) ^ (T2 << 30 | C2 >>> 2) ^ (T2 << 25 | C2 >>> 7), ($ = s2[J]).high), nt = $.low;
                  Z2 = K2 + ((B3 >>> 14 | O2 << 18) ^ (B3 >>> 18 | O2 << 14) ^ (B3 << 23 | O2 >>> 9)) + (($ = q2 + ((O2 >>> 14 | B3 << 18) ^ (O2 >>> 18 | B3 << 14) ^ (O2 << 23 | B3 >>> 9))) >>> 0 < q2 >>> 0 ? 1 : 0), K2 = H3, q2 = V3, H3 = j2, V3 = M2, j2 = B3, M2 = O2, B3 = N2 + (Z2 = (Z2 = (Z2 = Z2 + Q2 + (($ = $ + tt) >>> 0 < tt >>> 0 ? 1 : 0)) + rt + (($ = $ + nt) >>> 0 < nt >>> 0 ? 1 : 0)) + z + (($ = $ + Y) >>> 0 < Y >>> 0 ? 1 : 0)) + ((O2 = U2 + $ | 0) >>> 0 < U2 >>> 0 ? 1 : 0) | 0, N2 = D2, U2 = L2, D2 = R2, L2 = I2, R2 = C2, I2 = T2, C2 = Z2 + (W = G + W + ((Y = X2 + et) >>> 0 < X2 >>> 0 ? 1 : 0)) + ((T2 = $ + Y | 0) >>> 0 < $ >>> 0 ? 1 : 0) | 0;
                }
                d2 = n3.low = d2 + T2, n3.high = g2 + C2 + (d2 >>> 0 < T2 >>> 0 ? 1 : 0), v3 = i3.low = v3 + I2, i3.high = p2 + R2 + (v3 >>> 0 < I2 >>> 0 ? 1 : 0), m2 = o3.low = m2 + L2, o3.high = y2 + D2 + (m2 >>> 0 < L2 >>> 0 ? 1 : 0), S2 = u3.low = S2 + U2, u3.high = _2 + N2 + (S2 >>> 0 < U2 >>> 0 ? 1 : 0), w2 = c2.low = w2 + O2, c2.high = b2 + B3 + (w2 >>> 0 < O2 >>> 0 ? 1 : 0), E = h2.low = E + M2, h2.high = F2 + j2 + (E >>> 0 < M2 >>> 0 ? 1 : 0), A2 = l2.low = A2 + V3, l2.high = x + H3 + (A2 >>> 0 < V3 >>> 0 ? 1 : 0), P3 = f2.low = P3 + q2, f2.high = k2 + K2 + (P3 >>> 0 < q2 >>> 0 ? 1 : 0);
              }, _doFinalize: function t9() {
                var e3 = this._data, r4 = e3.words, n3 = 8 * this._nDataBytes, i3 = 8 * e3.sigBytes;
                return r4[i3 >>> 5] |= 128 << 24 - i3 % 32, r4[30 + (i3 + 128 >>> 10 << 5)] = Math.floor(n3 / 4294967296), r4[31 + (i3 + 128 >>> 10 << 5)] = n3, e3.sigBytes = 4 * r4.length, this._process(), this._hash.toX32();
              }, clone: function t9() {
                var e3 = r3.clone.call(this);
                return e3._hash = this._hash.clone(), e3;
              }, blockSize: 32 }), e2.SHA512 = r3._createHelper(o2), e2.HmacSHA512 = r3._createHmacHelper(o2);
            }(), function() {
              var t8 = v2, e2 = (i2 = t8.x64).Word, r3 = i2.WordArray, n2 = (i2 = t8.algo).SHA512, i2 = i2.SHA384 = n2.extend({ _doReset: function t9() {
                this._hash = new r3.init([new e2.init(3418070365, 3238371032), new e2.init(1654270250, 914150663), new e2.init(2438529370, 812702999), new e2.init(355462360, 4144912697), new e2.init(1731405415, 4290775857), new e2.init(2394180231, 1750603025), new e2.init(3675008525, 1694076839), new e2.init(1203062813, 3204075428)]);
              }, _doFinalize: function t9() {
                var e3 = n2._doFinalize.call(this);
                return e3.sigBytes -= 16, e3;
              } });
              t8.SHA384 = n2._createHelper(i2), t8.HmacSHA384 = n2._createHmacHelper(i2);
            }();
            var y, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            function _(t8) {
              var e2, r3, n2 = "";
              for (e2 = 0; e2 + 3 <= t8.length; e2 += 3)
                r3 = parseInt(t8.substring(e2, e2 + 3), 16), n2 += m.charAt(r3 >> 6) + m.charAt(63 & r3);
              for (e2 + 1 == t8.length ? (r3 = parseInt(t8.substring(e2, e2 + 1), 16), n2 += m.charAt(r3 << 2)) : e2 + 2 == t8.length && (r3 = parseInt(t8.substring(e2, e2 + 2), 16), n2 += m.charAt(r3 >> 2) + m.charAt((3 & r3) << 4)), "="; (3 & n2.length) > 0; )
                n2 += "=";
              return n2;
            }
            function S(t8) {
              var e2, r3, n2, i2 = "", o2 = 0;
              for (e2 = 0; e2 < t8.length && "=" != t8.charAt(e2); ++e2)
                (n2 = m.indexOf(t8.charAt(e2))) < 0 || (0 == o2 ? (i2 += T(n2 >> 2), r3 = 3 & n2, o2 = 1) : 1 == o2 ? (i2 += T(r3 << 2 | n2 >> 4), r3 = 15 & n2, o2 = 2) : 2 == o2 ? (i2 += T(r3), i2 += T(n2 >> 2), r3 = 3 & n2, o2 = 3) : (i2 += T(r3 << 2 | n2 >> 4), i2 += T(15 & n2), o2 = 0));
              return 1 == o2 && (i2 += T(r3 << 2)), i2;
            }
            function b(t8) {
              var e2, r3 = S(t8), n2 = new Array();
              for (e2 = 0; 2 * e2 < r3.length; ++e2)
                n2[e2] = parseInt(r3.substring(2 * e2, 2 * e2 + 2), 16);
              return n2;
            }
            function w(t8, e2, r3) {
              null != t8 && ("number" == typeof t8 ? this.fromNumber(t8, e2, r3) : null == e2 && "string" != typeof t8 ? this.fromString(t8, 256) : this.fromString(t8, e2));
            }
            function F() {
              return new w(null);
            }
            "Microsoft Internet Explorer" == d.appName ? (w.prototype.am = function E(t8, e2, r3, n2, i2, o2) {
              for (var s2 = 32767 & e2, a2 = e2 >> 15; --o2 >= 0; ) {
                var u2 = 32767 & this[t8], c2 = this[t8++] >> 15, h2 = a2 * u2 + c2 * s2;
                i2 = ((u2 = s2 * u2 + ((32767 & h2) << 15) + r3[n2] + (1073741823 & i2)) >>> 30) + (h2 >>> 15) + a2 * c2 + (i2 >>> 30), r3[n2++] = 1073741823 & u2;
              }
              return i2;
            }, y = 30) : "Netscape" != d.appName ? (w.prototype.am = function x(t8, e2, r3, n2, i2, o2) {
              for (; --o2 >= 0; ) {
                var s2 = e2 * this[t8++] + r3[n2] + i2;
                i2 = Math.floor(s2 / 67108864), r3[n2++] = 67108863 & s2;
              }
              return i2;
            }, y = 26) : (w.prototype.am = function A2(t8, e2, r3, n2, i2, o2) {
              for (var s2 = 16383 & e2, a2 = e2 >> 14; --o2 >= 0; ) {
                var u2 = 16383 & this[t8], c2 = this[t8++] >> 14, h2 = a2 * u2 + c2 * s2;
                i2 = ((u2 = s2 * u2 + ((16383 & h2) << 14) + r3[n2] + i2) >> 28) + (h2 >> 14) + a2 * c2, r3[n2++] = 268435455 & u2;
              }
              return i2;
            }, y = 28), w.prototype.DB = y, w.prototype.DM = (1 << y) - 1, w.prototype.DV = 1 << y;
            w.prototype.FV = Math.pow(2, 52), w.prototype.F1 = 52 - y, w.prototype.F2 = 2 * y - 52;
            var k, P2, C = new Array();
            for (k = "0".charCodeAt(0), P2 = 0; P2 <= 9; ++P2)
              C[k++] = P2;
            for (k = "a".charCodeAt(0), P2 = 10; P2 < 36; ++P2)
              C[k++] = P2;
            for (k = "A".charCodeAt(0), P2 = 10; P2 < 36; ++P2)
              C[k++] = P2;
            function T(t8) {
              return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t8);
            }
            function R(t8, e2) {
              var r3 = C[t8.charCodeAt(e2)];
              return null == r3 ? -1 : r3;
            }
            function I(t8) {
              var e2 = F();
              return e2.fromInt(t8), e2;
            }
            function D(t8) {
              var e2, r3 = 1;
              return 0 != (e2 = t8 >>> 16) && (t8 = e2, r3 += 16), 0 != (e2 = t8 >> 8) && (t8 = e2, r3 += 8), 0 != (e2 = t8 >> 4) && (t8 = e2, r3 += 4), 0 != (e2 = t8 >> 2) && (t8 = e2, r3 += 2), 0 != (e2 = t8 >> 1) && (t8 = e2, r3 += 1), r3;
            }
            function L(t8) {
              this.m = t8;
            }
            function N(t8) {
              this.m = t8, this.mp = t8.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << t8.DB - 15) - 1, this.mt2 = 2 * t8.t;
            }
            function U(t8, e2) {
              return t8 & e2;
            }
            function B2(t8, e2) {
              return t8 | e2;
            }
            function O(t8, e2) {
              return t8 ^ e2;
            }
            function j(t8, e2) {
              return t8 & ~e2;
            }
            function M(t8) {
              if (0 == t8)
                return -1;
              var e2 = 0;
              return 0 == (65535 & t8) && (t8 >>= 16, e2 += 16), 0 == (255 & t8) && (t8 >>= 8, e2 += 8), 0 == (15 & t8) && (t8 >>= 4, e2 += 4), 0 == (3 & t8) && (t8 >>= 2, e2 += 2), 0 == (1 & t8) && ++e2, e2;
            }
            function H2(t8) {
              for (var e2 = 0; 0 != t8; )
                t8 &= t8 - 1, ++e2;
              return e2;
            }
            function V2() {
            }
            function K(t8) {
              return t8;
            }
            function q(t8) {
              this.r2 = F(), this.q3 = F(), w.ONE.dlShiftTo(2 * t8.t, this.r2), this.mu = this.r2.divide(t8), this.m = t8;
            }
            L.prototype.convert = function J(t8) {
              return t8.s < 0 || t8.compareTo(this.m) >= 0 ? t8.mod(this.m) : t8;
            }, L.prototype.revert = function W(t8) {
              return t8;
            }, L.prototype.reduce = function z(t8) {
              t8.divRemTo(this.m, null, t8);
            }, L.prototype.mulTo = function Y(t8, e2, r3) {
              t8.multiplyTo(e2, r3), this.reduce(r3);
            }, L.prototype.sqrTo = function G(t8, e2) {
              t8.squareTo(e2), this.reduce(e2);
            }, N.prototype.convert = function X2(t8) {
              var e2 = F();
              return t8.abs().dlShiftTo(this.m.t, e2), e2.divRemTo(this.m, null, e2), t8.s < 0 && e2.compareTo(w.ZERO) > 0 && this.m.subTo(e2, e2), e2;
            }, N.prototype.revert = function $(t8) {
              var e2 = F();
              return t8.copyTo(e2), this.reduce(e2), e2;
            }, N.prototype.reduce = function Q2(t8) {
              for (; t8.t <= this.mt2; )
                t8[t8.t++] = 0;
              for (var e2 = 0; e2 < this.m.t; ++e2) {
                var r3 = 32767 & t8[e2], n2 = r3 * this.mpl + ((r3 * this.mph + (t8[e2] >> 15) * this.mpl & this.um) << 15) & t8.DM;
                for (t8[r3 = e2 + this.m.t] += this.m.am(0, n2, t8, e2, 0, this.m.t); t8[r3] >= t8.DV; )
                  t8[r3] -= t8.DV, t8[++r3]++;
              }
              t8.clamp(), t8.drShiftTo(this.m.t, t8), t8.compareTo(this.m) >= 0 && t8.subTo(this.m, t8);
            }, N.prototype.mulTo = function Z2(t8, e2, r3) {
              t8.multiplyTo(e2, r3), this.reduce(r3);
            }, N.prototype.sqrTo = function tt(t8, e2) {
              t8.squareTo(e2), this.reduce(e2);
            }, w.prototype.copyTo = function et(t8) {
              for (var e2 = this.t - 1; e2 >= 0; --e2)
                t8[e2] = this[e2];
              t8.t = this.t, t8.s = this.s;
            }, w.prototype.fromInt = function rt(t8) {
              this.t = 1, this.s = t8 < 0 ? -1 : 0, t8 > 0 ? this[0] = t8 : t8 < -1 ? this[0] = t8 + this.DV : this.t = 0;
            }, w.prototype.fromString = function nt(t8, e2) {
              var r3;
              if (16 == e2)
                r3 = 4;
              else if (8 == e2)
                r3 = 3;
              else if (256 == e2)
                r3 = 8;
              else if (2 == e2)
                r3 = 1;
              else if (32 == e2)
                r3 = 5;
              else {
                if (4 != e2)
                  return void this.fromRadix(t8, e2);
                r3 = 2;
              }
              this.t = 0, this.s = 0;
              for (var n2 = t8.length, i2 = false, o2 = 0; --n2 >= 0; ) {
                var s2 = 8 == r3 ? 255 & t8[n2] : R(t8, n2);
                s2 < 0 ? "-" == t8.charAt(n2) && (i2 = true) : (i2 = false, 0 == o2 ? this[this.t++] = s2 : o2 + r3 > this.DB ? (this[this.t - 1] |= (s2 & (1 << this.DB - o2) - 1) << o2, this[this.t++] = s2 >> this.DB - o2) : this[this.t - 1] |= s2 << o2, (o2 += r3) >= this.DB && (o2 -= this.DB));
              }
              8 == r3 && 0 != (128 & t8[0]) && (this.s = -1, o2 > 0 && (this[this.t - 1] |= (1 << this.DB - o2) - 1 << o2)), this.clamp(), i2 && w.ZERO.subTo(this, this);
            }, w.prototype.clamp = function it() {
              for (var t8 = this.s & this.DM; this.t > 0 && this[this.t - 1] == t8; )
                --this.t;
            }, w.prototype.dlShiftTo = function ot2(t8, e2) {
              var r3;
              for (r3 = this.t - 1; r3 >= 0; --r3)
                e2[r3 + t8] = this[r3];
              for (r3 = t8 - 1; r3 >= 0; --r3)
                e2[r3] = 0;
              e2.t = this.t + t8, e2.s = this.s;
            }, w.prototype.drShiftTo = function st(t8, e2) {
              for (var r3 = t8; r3 < this.t; ++r3)
                e2[r3 - t8] = this[r3];
              e2.t = Math.max(this.t - t8, 0), e2.s = this.s;
            }, w.prototype.lShiftTo = function at2(t8, e2) {
              var r3, n2 = t8 % this.DB, i2 = this.DB - n2, o2 = (1 << i2) - 1, s2 = Math.floor(t8 / this.DB), a2 = this.s << n2 & this.DM;
              for (r3 = this.t - 1; r3 >= 0; --r3)
                e2[r3 + s2 + 1] = this[r3] >> i2 | a2, a2 = (this[r3] & o2) << n2;
              for (r3 = s2 - 1; r3 >= 0; --r3)
                e2[r3] = 0;
              e2[s2] = a2, e2.t = this.t + s2 + 1, e2.s = this.s, e2.clamp();
            }, w.prototype.rShiftTo = function ut(t8, e2) {
              e2.s = this.s;
              var r3 = Math.floor(t8 / this.DB);
              if (r3 >= this.t)
                e2.t = 0;
              else {
                var n2 = t8 % this.DB, i2 = this.DB - n2, o2 = (1 << n2) - 1;
                e2[0] = this[r3] >> n2;
                for (var s2 = r3 + 1; s2 < this.t; ++s2)
                  e2[s2 - r3 - 1] |= (this[s2] & o2) << i2, e2[s2 - r3] = this[s2] >> n2;
                n2 > 0 && (e2[this.t - r3 - 1] |= (this.s & o2) << i2), e2.t = this.t - r3, e2.clamp();
              }
            }, w.prototype.subTo = function ct2(t8, e2) {
              for (var r3 = 0, n2 = 0, i2 = Math.min(t8.t, this.t); r3 < i2; )
                n2 += this[r3] - t8[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
              if (t8.t < this.t) {
                for (n2 -= t8.s; r3 < this.t; )
                  n2 += this[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
                n2 += this.s;
              } else {
                for (n2 += this.s; r3 < t8.t; )
                  n2 -= t8[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
                n2 -= t8.s;
              }
              e2.s = n2 < 0 ? -1 : 0, n2 < -1 ? e2[r3++] = this.DV + n2 : n2 > 0 && (e2[r3++] = n2), e2.t = r3, e2.clamp();
            }, w.prototype.multiplyTo = function ht(t8, e2) {
              var r3 = this.abs(), n2 = t8.abs(), i2 = r3.t;
              for (e2.t = i2 + n2.t; --i2 >= 0; )
                e2[i2] = 0;
              for (i2 = 0; i2 < n2.t; ++i2)
                e2[i2 + r3.t] = r3.am(0, n2[i2], e2, i2, 0, r3.t);
              e2.s = 0, e2.clamp(), this.s != t8.s && w.ZERO.subTo(e2, e2);
            }, w.prototype.squareTo = function lt(t8) {
              for (var e2 = this.abs(), r3 = t8.t = 2 * e2.t; --r3 >= 0; )
                t8[r3] = 0;
              for (r3 = 0; r3 < e2.t - 1; ++r3) {
                var n2 = e2.am(r3, e2[r3], t8, 2 * r3, 0, 1);
                (t8[r3 + e2.t] += e2.am(r3 + 1, 2 * e2[r3], t8, 2 * r3 + 1, n2, e2.t - r3 - 1)) >= e2.DV && (t8[r3 + e2.t] -= e2.DV, t8[r3 + e2.t + 1] = 1);
              }
              t8.t > 0 && (t8[t8.t - 1] += e2.am(r3, e2[r3], t8, 2 * r3, 0, 1)), t8.s = 0, t8.clamp();
            }, w.prototype.divRemTo = function ft(t8, e2, r3) {
              var n2 = t8.abs();
              if (!(n2.t <= 0)) {
                var i2 = this.abs();
                if (i2.t < n2.t)
                  return null != e2 && e2.fromInt(0), void (null != r3 && this.copyTo(r3));
                null == r3 && (r3 = F());
                var o2 = F(), s2 = this.s, a2 = t8.s, u2 = this.DB - D(n2[n2.t - 1]);
                u2 > 0 ? (n2.lShiftTo(u2, o2), i2.lShiftTo(u2, r3)) : (n2.copyTo(o2), i2.copyTo(r3));
                var c2 = o2.t, h2 = o2[c2 - 1];
                if (0 != h2) {
                  var l2 = h2 * (1 << this.F1) + (c2 > 1 ? o2[c2 - 2] >> this.F2 : 0), f2 = this.FV / l2, g2 = (1 << this.F1) / l2, d2 = 1 << this.F2, p2 = r3.t, v3 = p2 - c2, y2 = null == e2 ? F() : e2;
                  for (o2.dlShiftTo(v3, y2), r3.compareTo(y2) >= 0 && (r3[r3.t++] = 1, r3.subTo(y2, r3)), w.ONE.dlShiftTo(c2, y2), y2.subTo(o2, o2); o2.t < c2; )
                    o2[o2.t++] = 0;
                  for (; --v3 >= 0; ) {
                    var m2 = r3[--p2] == h2 ? this.DM : Math.floor(r3[p2] * f2 + (r3[p2 - 1] + d2) * g2);
                    if ((r3[p2] += o2.am(0, m2, r3, v3, 0, c2)) < m2)
                      for (o2.dlShiftTo(v3, y2), r3.subTo(y2, r3); r3[p2] < --m2; )
                        r3.subTo(y2, r3);
                  }
                  null != e2 && (r3.drShiftTo(c2, e2), s2 != a2 && w.ZERO.subTo(e2, e2)), r3.t = c2, r3.clamp(), u2 > 0 && r3.rShiftTo(u2, r3), s2 < 0 && w.ZERO.subTo(r3, r3);
                }
              }
            }, w.prototype.invDigit = function gt() {
              if (this.t < 1)
                return 0;
              var t8 = this[0];
              if (0 == (1 & t8))
                return 0;
              var e2 = 3 & t8;
              return (e2 = (e2 = (e2 = (e2 = e2 * (2 - (15 & t8) * e2) & 15) * (2 - (255 & t8) * e2) & 255) * (2 - ((65535 & t8) * e2 & 65535)) & 65535) * (2 - t8 * e2 % this.DV) % this.DV) > 0 ? this.DV - e2 : -e2;
            }, w.prototype.isEven = function dt() {
              return 0 == (this.t > 0 ? 1 & this[0] : this.s);
            }, w.prototype.exp = function pt(t8, e2) {
              if (t8 > 4294967295 || t8 < 1)
                return w.ONE;
              var r3 = F(), n2 = F(), i2 = e2.convert(this), o2 = D(t8) - 1;
              for (i2.copyTo(r3); --o2 >= 0; )
                if (e2.sqrTo(r3, n2), (t8 & 1 << o2) > 0)
                  e2.mulTo(n2, i2, r3);
                else {
                  var s2 = r3;
                  r3 = n2, n2 = s2;
                }
              return e2.revert(r3);
            }, w.prototype.toString = function vt2(t8) {
              if (this.s < 0)
                return "-" + this.negate().toString(t8);
              var e2;
              if (16 == t8)
                e2 = 4;
              else if (8 == t8)
                e2 = 3;
              else if (2 == t8)
                e2 = 1;
              else if (32 == t8)
                e2 = 5;
              else {
                if (4 != t8)
                  return this.toRadix(t8);
                e2 = 2;
              }
              var r3, n2 = (1 << e2) - 1, i2 = false, o2 = "", s2 = this.t, a2 = this.DB - s2 * this.DB % e2;
              if (s2-- > 0)
                for (a2 < this.DB && (r3 = this[s2] >> a2) > 0 && (i2 = true, o2 = T(r3)); s2 >= 0; )
                  a2 < e2 ? (r3 = (this[s2] & (1 << a2) - 1) << e2 - a2, r3 |= this[--s2] >> (a2 += this.DB - e2)) : (r3 = this[s2] >> (a2 -= e2) & n2, a2 <= 0 && (a2 += this.DB, --s2)), r3 > 0 && (i2 = true), i2 && (o2 += T(r3));
              return i2 ? o2 : "0";
            }, w.prototype.negate = function yt() {
              var t8 = F();
              return w.ZERO.subTo(this, t8), t8;
            }, w.prototype.abs = function mt() {
              return this.s < 0 ? this.negate() : this;
            }, w.prototype.compareTo = function _t2(t8) {
              var e2 = this.s - t8.s;
              if (0 != e2)
                return e2;
              var r3 = this.t;
              if (0 != (e2 = r3 - t8.t))
                return this.s < 0 ? -e2 : e2;
              for (; --r3 >= 0; )
                if (0 != (e2 = this[r3] - t8[r3]))
                  return e2;
              return 0;
            }, w.prototype.bitLength = function St() {
              return this.t <= 0 ? 0 : this.DB * (this.t - 1) + D(this[this.t - 1] ^ this.s & this.DM);
            }, w.prototype.mod = function bt(t8) {
              var e2 = F();
              return this.abs().divRemTo(t8, null, e2), this.s < 0 && e2.compareTo(w.ZERO) > 0 && t8.subTo(e2, e2), e2;
            }, w.prototype.modPowInt = function wt(t8, e2) {
              var r3;
              return r3 = t8 < 256 || e2.isEven() ? new L(e2) : new N(e2), this.exp(t8, r3);
            }, w.ZERO = I(0), w.ONE = I(1), V2.prototype.convert = K, V2.prototype.revert = K, V2.prototype.mulTo = function Ft2(t8, e2, r3) {
              t8.multiplyTo(e2, r3);
            }, V2.prototype.sqrTo = function Et(t8, e2) {
              t8.squareTo(e2);
            }, q.prototype.convert = function xt(t8) {
              if (t8.s < 0 || t8.t > 2 * this.m.t)
                return t8.mod(this.m);
              if (t8.compareTo(this.m) < 0)
                return t8;
              var e2 = F();
              return t8.copyTo(e2), this.reduce(e2), e2;
            }, q.prototype.revert = function At(t8) {
              return t8;
            }, q.prototype.reduce = function kt(t8) {
              for (t8.drShiftTo(this.m.t - 1, this.r2), t8.t > this.m.t + 1 && (t8.t = this.m.t + 1, t8.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t8.compareTo(this.r2) < 0; )
                t8.dAddOffset(1, this.m.t + 1);
              for (t8.subTo(this.r2, t8); t8.compareTo(this.m) >= 0; )
                t8.subTo(this.m, t8);
            }, q.prototype.mulTo = function Pt2(t8, e2, r3) {
              t8.multiplyTo(e2, r3), this.reduce(r3);
            }, q.prototype.sqrTo = function Ct2(t8, e2) {
              t8.squareTo(e2), this.reduce(e2);
            };
            var Tt2 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], Rt = (1 << 26) / Tt2[Tt2.length - 1];
            function It() {
              this.i = 0, this.j = 0, this.S = new Array();
            }
            w.prototype.chunkSize = function Dt2(t8) {
              return Math.floor(Math.LN2 * this.DB / Math.log(t8));
            }, w.prototype.toRadix = function Lt2(t8) {
              if (null == t8 && (t8 = 10), 0 == this.signum() || t8 < 2 || t8 > 36)
                return "0";
              var e2 = this.chunkSize(t8), r3 = Math.pow(t8, e2), n2 = I(r3), i2 = F(), o2 = F(), s2 = "";
              for (this.divRemTo(n2, i2, o2); i2.signum() > 0; )
                s2 = (r3 + o2.intValue()).toString(t8).substr(1) + s2, i2.divRemTo(n2, i2, o2);
              return o2.intValue().toString(t8) + s2;
            }, w.prototype.fromRadix = function Nt(t8, e2) {
              this.fromInt(0), null == e2 && (e2 = 10);
              for (var r3 = this.chunkSize(e2), n2 = Math.pow(e2, r3), i2 = false, o2 = 0, s2 = 0, a2 = 0; a2 < t8.length; ++a2) {
                var u2 = R(t8, a2);
                u2 < 0 ? "-" == t8.charAt(a2) && 0 == this.signum() && (i2 = true) : (s2 = e2 * s2 + u2, ++o2 >= r3 && (this.dMultiply(n2), this.dAddOffset(s2, 0), o2 = 0, s2 = 0));
              }
              o2 > 0 && (this.dMultiply(Math.pow(e2, o2)), this.dAddOffset(s2, 0)), i2 && w.ZERO.subTo(this, this);
            }, w.prototype.fromNumber = function Ut2(t8, e2, r3) {
              if ("number" == typeof e2)
                if (t8 < 2)
                  this.fromInt(1);
                else
                  for (this.fromNumber(t8, r3), this.testBit(t8 - 1) || this.bitwiseTo(w.ONE.shiftLeft(t8 - 1), B2, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e2); )
                    this.dAddOffset(2, 0), this.bitLength() > t8 && this.subTo(w.ONE.shiftLeft(t8 - 1), this);
              else {
                var n2 = new Array(), i2 = 7 & t8;
                n2.length = 1 + (t8 >> 3), e2.nextBytes(n2), i2 > 0 ? n2[0] &= (1 << i2) - 1 : n2[0] = 0, this.fromString(n2, 256);
              }
            }, w.prototype.bitwiseTo = function Bt2(t8, e2, r3) {
              var n2, i2, o2 = Math.min(t8.t, this.t);
              for (n2 = 0; n2 < o2; ++n2)
                r3[n2] = e2(this[n2], t8[n2]);
              if (t8.t < this.t) {
                for (i2 = t8.s & this.DM, n2 = o2; n2 < this.t; ++n2)
                  r3[n2] = e2(this[n2], i2);
                r3.t = this.t;
              } else {
                for (i2 = this.s & this.DM, n2 = o2; n2 < t8.t; ++n2)
                  r3[n2] = e2(i2, t8[n2]);
                r3.t = t8.t;
              }
              r3.s = e2(this.s, t8.s), r3.clamp();
            }, w.prototype.changeBit = function Ot2(t8, e2) {
              var r3 = w.ONE.shiftLeft(t8);
              return this.bitwiseTo(r3, e2, r3), r3;
            }, w.prototype.addTo = function jt2(t8, e2) {
              for (var r3 = 0, n2 = 0, i2 = Math.min(t8.t, this.t); r3 < i2; )
                n2 += this[r3] + t8[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
              if (t8.t < this.t) {
                for (n2 += t8.s; r3 < this.t; )
                  n2 += this[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
                n2 += this.s;
              } else {
                for (n2 += this.s; r3 < t8.t; )
                  n2 += t8[r3], e2[r3++] = n2 & this.DM, n2 >>= this.DB;
                n2 += t8.s;
              }
              e2.s = n2 < 0 ? -1 : 0, n2 > 0 ? e2[r3++] = n2 : n2 < -1 && (e2[r3++] = this.DV + n2), e2.t = r3, e2.clamp();
            }, w.prototype.dMultiply = function Mt2(t8) {
              this[this.t] = this.am(0, t8 - 1, this, 0, 0, this.t), ++this.t, this.clamp();
            }, w.prototype.dAddOffset = function Ht(t8, e2) {
              if (0 != t8) {
                for (; this.t <= e2; )
                  this[this.t++] = 0;
                for (this[e2] += t8; this[e2] >= this.DV; )
                  this[e2] -= this.DV, ++e2 >= this.t && (this[this.t++] = 0), ++this[e2];
              }
            }, w.prototype.multiplyLowerTo = function Vt(t8, e2, r3) {
              var n2, i2 = Math.min(this.t + t8.t, e2);
              for (r3.s = 0, r3.t = i2; i2 > 0; )
                r3[--i2] = 0;
              for (n2 = r3.t - this.t; i2 < n2; ++i2)
                r3[i2 + this.t] = this.am(0, t8[i2], r3, i2, 0, this.t);
              for (n2 = Math.min(t8.t, e2); i2 < n2; ++i2)
                this.am(0, t8[i2], r3, i2, 0, e2 - i2);
              r3.clamp();
            }, w.prototype.multiplyUpperTo = function Kt(t8, e2, r3) {
              --e2;
              var n2 = r3.t = this.t + t8.t - e2;
              for (r3.s = 0; --n2 >= 0; )
                r3[n2] = 0;
              for (n2 = Math.max(e2 - this.t, 0); n2 < t8.t; ++n2)
                r3[this.t + n2 - e2] = this.am(e2 - n2, t8[n2], r3, 0, 0, this.t + n2 - e2);
              r3.clamp(), r3.drShiftTo(1, r3);
            }, w.prototype.modInt = function qt(t8) {
              if (t8 <= 0)
                return 0;
              var e2 = this.DV % t8, r3 = this.s < 0 ? t8 - 1 : 0;
              if (this.t > 0)
                if (0 == e2)
                  r3 = this[0] % t8;
                else
                  for (var n2 = this.t - 1; n2 >= 0; --n2)
                    r3 = (e2 * r3 + this[n2]) % t8;
              return r3;
            }, w.prototype.millerRabin = function Jt(t8) {
              var e2 = this.subtract(w.ONE), r3 = e2.getLowestSetBit();
              if (r3 <= 0)
                return false;
              var n2 = e2.shiftRight(r3);
              (t8 = t8 + 1 >> 1) > Tt2.length && (t8 = Tt2.length);
              for (var i2 = F(), o2 = 0; o2 < t8; ++o2) {
                i2.fromInt(Tt2[Math.floor(Math.random() * Tt2.length)]);
                var s2 = i2.modPow(n2, this);
                if (0 != s2.compareTo(w.ONE) && 0 != s2.compareTo(e2)) {
                  for (var a2 = 1; a2++ < r3 && 0 != s2.compareTo(e2); )
                    if (0 == (s2 = s2.modPowInt(2, this)).compareTo(w.ONE))
                      return false;
                  if (0 != s2.compareTo(e2))
                    return false;
                }
              }
              return true;
            }, w.prototype.clone = /*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
             */
            function Wt2() {
              var t8 = F();
              return this.copyTo(t8), t8;
            }, w.prototype.intValue = function zt2() {
              if (this.s < 0) {
                if (1 == this.t)
                  return this[0] - this.DV;
                if (0 == this.t)
                  return -1;
              } else {
                if (1 == this.t)
                  return this[0];
                if (0 == this.t)
                  return 0;
              }
              return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
            }, w.prototype.byteValue = function Yt() {
              return 0 == this.t ? this.s : this[0] << 24 >> 24;
            }, w.prototype.shortValue = function Gt2() {
              return 0 == this.t ? this.s : this[0] << 16 >> 16;
            }, w.prototype.signum = function Xt() {
              return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1;
            }, w.prototype.toByteArray = function $t2() {
              var t8 = this.t, e2 = new Array();
              e2[0] = this.s;
              var r3, n2 = this.DB - t8 * this.DB % 8, i2 = 0;
              if (t8-- > 0)
                for (n2 < this.DB && (r3 = this[t8] >> n2) != (this.s & this.DM) >> n2 && (e2[i2++] = r3 | this.s << this.DB - n2); t8 >= 0; )
                  n2 < 8 ? (r3 = (this[t8] & (1 << n2) - 1) << 8 - n2, r3 |= this[--t8] >> (n2 += this.DB - 8)) : (r3 = this[t8] >> (n2 -= 8) & 255, n2 <= 0 && (n2 += this.DB, --t8)), 0 != (128 & r3) && (r3 |= -256), 0 == i2 && (128 & this.s) != (128 & r3) && ++i2, (i2 > 0 || r3 != this.s) && (e2[i2++] = r3);
              return e2;
            }, w.prototype.equals = function Qt(t8) {
              return 0 == this.compareTo(t8);
            }, w.prototype.min = function Zt(t8) {
              return this.compareTo(t8) < 0 ? this : t8;
            }, w.prototype.max = function te(t8) {
              return this.compareTo(t8) > 0 ? this : t8;
            }, w.prototype.and = function ee(t8) {
              var e2 = F();
              return this.bitwiseTo(t8, U, e2), e2;
            }, w.prototype.or = function re(t8) {
              var e2 = F();
              return this.bitwiseTo(t8, B2, e2), e2;
            }, w.prototype.xor = function ne(t8) {
              var e2 = F();
              return this.bitwiseTo(t8, O, e2), e2;
            }, w.prototype.andNot = function ie(t8) {
              var e2 = F();
              return this.bitwiseTo(t8, j, e2), e2;
            }, w.prototype.not = function oe() {
              for (var t8 = F(), e2 = 0; e2 < this.t; ++e2)
                t8[e2] = this.DM & ~this[e2];
              return t8.t = this.t, t8.s = ~this.s, t8;
            }, w.prototype.shiftLeft = function se(t8) {
              var e2 = F();
              return t8 < 0 ? this.rShiftTo(-t8, e2) : this.lShiftTo(t8, e2), e2;
            }, w.prototype.shiftRight = function ae2(t8) {
              var e2 = F();
              return t8 < 0 ? this.lShiftTo(-t8, e2) : this.rShiftTo(t8, e2), e2;
            }, w.prototype.getLowestSetBit = function ue2() {
              for (var t8 = 0; t8 < this.t; ++t8)
                if (0 != this[t8])
                  return t8 * this.DB + M(this[t8]);
              return this.s < 0 ? this.t * this.DB : -1;
            }, w.prototype.bitCount = function ce() {
              for (var t8 = 0, e2 = this.s & this.DM, r3 = 0; r3 < this.t; ++r3)
                t8 += H2(this[r3] ^ e2);
              return t8;
            }, w.prototype.testBit = function he(t8) {
              var e2 = Math.floor(t8 / this.DB);
              return e2 >= this.t ? 0 != this.s : 0 != (this[e2] & 1 << t8 % this.DB);
            }, w.prototype.setBit = function le2(t8) {
              return this.changeBit(t8, B2);
            }, w.prototype.clearBit = function fe(t8) {
              return this.changeBit(t8, j);
            }, w.prototype.flipBit = function ge2(t8) {
              return this.changeBit(t8, O);
            }, w.prototype.add = function de(t8) {
              var e2 = F();
              return this.addTo(t8, e2), e2;
            }, w.prototype.subtract = function pe(t8) {
              var e2 = F();
              return this.subTo(t8, e2), e2;
            }, w.prototype.multiply = function ve2(t8) {
              var e2 = F();
              return this.multiplyTo(t8, e2), e2;
            }, w.prototype.divide = function ye(t8) {
              var e2 = F();
              return this.divRemTo(t8, e2, null), e2;
            }, w.prototype.remainder = function me(t8) {
              var e2 = F();
              return this.divRemTo(t8, null, e2), e2;
            }, w.prototype.divideAndRemainder = function _e2(t8) {
              var e2 = F(), r3 = F();
              return this.divRemTo(t8, e2, r3), new Array(e2, r3);
            }, w.prototype.modPow = function Se(t8, e2) {
              var r3, n2, i2 = t8.bitLength(), o2 = I(1);
              if (i2 <= 0)
                return o2;
              r3 = i2 < 18 ? 1 : i2 < 48 ? 3 : i2 < 144 ? 4 : i2 < 768 ? 5 : 6, n2 = i2 < 8 ? new L(e2) : e2.isEven() ? new q(e2) : new N(e2);
              var s2 = new Array(), a2 = 3, u2 = r3 - 1, c2 = (1 << r3) - 1;
              if (s2[1] = n2.convert(this), r3 > 1) {
                var h2 = F();
                for (n2.sqrTo(s2[1], h2); a2 <= c2; )
                  s2[a2] = F(), n2.mulTo(h2, s2[a2 - 2], s2[a2]), a2 += 2;
              }
              var l2, f2, g2 = t8.t - 1, d2 = true, p2 = F();
              for (i2 = D(t8[g2]) - 1; g2 >= 0; ) {
                for (i2 >= u2 ? l2 = t8[g2] >> i2 - u2 & c2 : (l2 = (t8[g2] & (1 << i2 + 1) - 1) << u2 - i2, g2 > 0 && (l2 |= t8[g2 - 1] >> this.DB + i2 - u2)), a2 = r3; 0 == (1 & l2); )
                  l2 >>= 1, --a2;
                if ((i2 -= a2) < 0 && (i2 += this.DB, --g2), d2)
                  s2[l2].copyTo(o2), d2 = false;
                else {
                  for (; a2 > 1; )
                    n2.sqrTo(o2, p2), n2.sqrTo(p2, o2), a2 -= 2;
                  a2 > 0 ? n2.sqrTo(o2, p2) : (f2 = o2, o2 = p2, p2 = f2), n2.mulTo(p2, s2[l2], o2);
                }
                for (; g2 >= 0 && 0 == (t8[g2] & 1 << i2); )
                  n2.sqrTo(o2, p2), f2 = o2, o2 = p2, p2 = f2, --i2 < 0 && (i2 = this.DB - 1, --g2);
              }
              return n2.revert(o2);
            }, w.prototype.modInverse = function be(t8) {
              var e2 = t8.isEven();
              if (this.isEven() && e2 || 0 == t8.signum())
                return w.ZERO;
              for (var r3 = t8.clone(), n2 = this.clone(), i2 = I(1), o2 = I(0), s2 = I(0), a2 = I(1); 0 != r3.signum(); ) {
                for (; r3.isEven(); )
                  r3.rShiftTo(1, r3), e2 ? (i2.isEven() && o2.isEven() || (i2.addTo(this, i2), o2.subTo(t8, o2)), i2.rShiftTo(1, i2)) : o2.isEven() || o2.subTo(t8, o2), o2.rShiftTo(1, o2);
                for (; n2.isEven(); )
                  n2.rShiftTo(1, n2), e2 ? (s2.isEven() && a2.isEven() || (s2.addTo(this, s2), a2.subTo(t8, a2)), s2.rShiftTo(1, s2)) : a2.isEven() || a2.subTo(t8, a2), a2.rShiftTo(1, a2);
                r3.compareTo(n2) >= 0 ? (r3.subTo(n2, r3), e2 && i2.subTo(s2, i2), o2.subTo(a2, o2)) : (n2.subTo(r3, n2), e2 && s2.subTo(i2, s2), a2.subTo(o2, a2));
              }
              return 0 != n2.compareTo(w.ONE) ? w.ZERO : a2.compareTo(t8) >= 0 ? a2.subtract(t8) : a2.signum() < 0 ? (a2.addTo(t8, a2), a2.signum() < 0 ? a2.add(t8) : a2) : a2;
            }, w.prototype.pow = function we(t8) {
              return this.exp(t8, new V2());
            }, w.prototype.gcd = function Fe2(t8) {
              var e2 = this.s < 0 ? this.negate() : this.clone(), r3 = t8.s < 0 ? t8.negate() : t8.clone();
              if (e2.compareTo(r3) < 0) {
                var n2 = e2;
                e2 = r3, r3 = n2;
              }
              var i2 = e2.getLowestSetBit(), o2 = r3.getLowestSetBit();
              if (o2 < 0)
                return e2;
              for (i2 < o2 && (o2 = i2), o2 > 0 && (e2.rShiftTo(o2, e2), r3.rShiftTo(o2, r3)); e2.signum() > 0; )
                (i2 = e2.getLowestSetBit()) > 0 && e2.rShiftTo(i2, e2), (i2 = r3.getLowestSetBit()) > 0 && r3.rShiftTo(i2, r3), e2.compareTo(r3) >= 0 ? (e2.subTo(r3, e2), e2.rShiftTo(1, e2)) : (r3.subTo(e2, r3), r3.rShiftTo(1, r3));
              return o2 > 0 && r3.lShiftTo(o2, r3), r3;
            }, w.prototype.isProbablePrime = function Ee2(t8) {
              var e2, r3 = this.abs();
              if (1 == r3.t && r3[0] <= Tt2[Tt2.length - 1]) {
                for (e2 = 0; e2 < Tt2.length; ++e2)
                  if (r3[0] == Tt2[e2])
                    return true;
                return false;
              }
              if (r3.isEven())
                return false;
              for (e2 = 1; e2 < Tt2.length; ) {
                for (var n2 = Tt2[e2], i2 = e2 + 1; i2 < Tt2.length && n2 < Rt; )
                  n2 *= Tt2[i2++];
                for (n2 = r3.modInt(n2); e2 < i2; )
                  if (n2 % Tt2[e2++] == 0)
                    return false;
              }
              return r3.millerRabin(t8);
            }, w.prototype.square = function xe2() {
              var t8 = F();
              return this.squareTo(t8), t8;
            }, It.prototype.init = function Ae2(t8) {
              var e2, r3, n2;
              for (e2 = 0; e2 < 256; ++e2)
                this.S[e2] = e2;
              for (r3 = 0, e2 = 0; e2 < 256; ++e2)
                r3 = r3 + this.S[e2] + t8[e2 % t8.length] & 255, n2 = this.S[e2], this.S[e2] = this.S[r3], this.S[r3] = n2;
              this.i = 0, this.j = 0;
            }, It.prototype.next = function ke() {
              var t8;
              return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, t8 = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = t8, this.S[t8 + this.S[this.i] & 255];
            };
            var Pe2, Ce, Te;
            function Re() {
              !function t8(e2) {
                Ce[Te++] ^= 255 & e2, Ce[Te++] ^= e2 >> 8 & 255, Ce[Te++] ^= e2 >> 16 & 255, Ce[Te++] ^= e2 >> 24 & 255, Te >= 256 && (Te -= 256);
              }((/* @__PURE__ */ new Date()).getTime());
            }
            if (null == Ce) {
              var Ie;
              if (Ce = new Array(), Te = 0, void 0 !== p && (void 0 !== p.crypto || void 0 !== p.msCrypto)) {
                var De2 = p.crypto || p.msCrypto;
                if (De2.getRandomValues) {
                  var Le = new Uint8Array(32);
                  for (De2.getRandomValues(Le), Ie = 0; Ie < 32; ++Ie)
                    Ce[Te++] = Le[Ie];
                } else if ("Netscape" == d.appName && d.appVersion < "5") {
                  var Ne = p.crypto.random(32);
                  for (Ie = 0; Ie < Ne.length; ++Ie)
                    Ce[Te++] = 255 & Ne.charCodeAt(Ie);
                }
              }
              for (; Te < 256; )
                Ie = Math.floor(65536 * Math.random()), Ce[Te++] = Ie >>> 8, Ce[Te++] = 255 & Ie;
              Te = 0, Re();
            }
            function Ue2() {
              if (null == Pe2) {
                for (Re(), (Pe2 = function t8() {
                  return new It();
                }()).init(Ce), Te = 0; Te < Ce.length; ++Te)
                  Ce[Te] = 0;
                Te = 0;
              }
              return Pe2.next();
            }
            function Be2() {
            }
            function Oe(t8, e2) {
              return new w(t8, e2);
            }
            function je(t8, e2, r3) {
              for (var n2 = "", i2 = 0; n2.length < e2; )
                n2 += r3(String.fromCharCode.apply(String, t8.concat([(4278190080 & i2) >> 24, (16711680 & i2) >> 16, (65280 & i2) >> 8, 255 & i2]))), i2 += 1;
              return n2;
            }
            function Me() {
              this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null;
            }
            function He2(t8, e2) {
              this.x = e2, this.q = t8;
            }
            function Ve(t8, e2, r3, n2) {
              this.curve = t8, this.x = e2, this.y = r3, this.z = null == n2 ? w.ONE : n2, this.zinv = null;
            }
            function Ke(t8, e2, r3) {
              this.q = t8, this.a = this.fromBigInteger(e2), this.b = this.fromBigInteger(r3), this.infinity = new Ve(this, null, null);
            }
            Be2.prototype.nextBytes = function qe2(t8) {
              var e2;
              for (e2 = 0; e2 < t8.length; ++e2)
                t8[e2] = Ue2();
            }, Me.prototype.doPublic = function Je(t8) {
              return t8.modPowInt(this.e, this.n);
            }, Me.prototype.setPublic = function We2(t8, e2) {
              if (this.isPublic = true, this.isPrivate = false, "string" != typeof t8)
                this.n = t8, this.e = e2;
              else {
                if (!(null != t8 && null != e2 && t8.length > 0 && e2.length > 0))
                  throw "Invalid RSA public key";
                this.n = Oe(t8, 16), this.e = parseInt(e2, 16);
              }
            }, Me.prototype.encrypt = function ze(t8) {
              var e2 = function r3(t9, e3) {
                if (e3 < t9.length + 11)
                  throw "Message too long for RSA";
                for (var r4 = new Array(), n3 = t9.length - 1; n3 >= 0 && e3 > 0; ) {
                  var i3 = t9.charCodeAt(n3--);
                  i3 < 128 ? r4[--e3] = i3 : i3 > 127 && i3 < 2048 ? (r4[--e3] = 63 & i3 | 128, r4[--e3] = i3 >> 6 | 192) : (r4[--e3] = 63 & i3 | 128, r4[--e3] = i3 >> 6 & 63 | 128, r4[--e3] = i3 >> 12 | 224);
                }
                r4[--e3] = 0;
                for (var o2 = new Be2(), s2 = new Array(); e3 > 2; ) {
                  for (s2[0] = 0; 0 == s2[0]; )
                    o2.nextBytes(s2);
                  r4[--e3] = s2[0];
                }
                return r4[--e3] = 2, r4[--e3] = 0, new w(r4);
              }(t8, this.n.bitLength() + 7 >> 3);
              if (null == e2)
                return null;
              var n2 = this.doPublic(e2);
              if (null == n2)
                return null;
              var i2 = n2.toString(16);
              return 0 == (1 & i2.length) ? i2 : "0" + i2;
            }, Me.prototype.encryptOAEP = function Ye(t8, e2, r3) {
              var n2 = function i2(t9, e3, r4, n3) {
                var i3 = Sr.crypto.MessageDigest, o3 = Sr.crypto.Util, s3 = null;
                if (r4 || (r4 = "sha1"), "string" == typeof r4 && (s3 = i3.getCanonicalAlgName(r4), n3 = i3.getHashLength(s3), r4 = function t10(e4) {
                  return Lr(o3.hashHex(Nr(e4), s3));
                }), t9.length + 2 * n3 + 2 > e3)
                  throw "Message too long for RSA";
                var a2, u2 = "";
                for (a2 = 0; a2 < e3 - t9.length - 2 * n3 - 2; a2 += 1)
                  u2 += "\0";
                var c2 = r4("") + u2 + "" + t9, h2 = new Array(n3);
                new Be2().nextBytes(h2);
                var l2 = je(h2, c2.length, r4), f2 = [];
                for (a2 = 0; a2 < c2.length; a2 += 1)
                  f2[a2] = c2.charCodeAt(a2) ^ l2.charCodeAt(a2);
                var g2 = je(f2, h2.length, r4), d2 = [0];
                for (a2 = 0; a2 < h2.length; a2 += 1)
                  d2[a2 + 1] = h2[a2] ^ g2.charCodeAt(a2);
                return new w(d2.concat(f2));
              }(t8, this.n.bitLength() + 7 >> 3, e2, r3);
              if (null == n2)
                return null;
              var o2 = this.doPublic(n2);
              if (null == o2)
                return null;
              var s2 = o2.toString(16);
              return 0 == (1 & s2.length) ? s2 : "0" + s2;
            }, Me.prototype.type = "RSA", He2.prototype.equals = function Ge2(t8) {
              return t8 == this || this.q.equals(t8.q) && this.x.equals(t8.x);
            }, He2.prototype.toBigInteger = function Xe() {
              return this.x;
            }, He2.prototype.negate = function $e2() {
              return new He2(this.q, this.x.negate().mod(this.q));
            }, He2.prototype.add = function Qe(t8) {
              return new He2(this.q, this.x.add(t8.toBigInteger()).mod(this.q));
            }, He2.prototype.subtract = function Ze2(t8) {
              return new He2(this.q, this.x.subtract(t8.toBigInteger()).mod(this.q));
            }, He2.prototype.multiply = function tr2(t8) {
              return new He2(this.q, this.x.multiply(t8.toBigInteger()).mod(this.q));
            }, He2.prototype.square = function er() {
              return new He2(this.q, this.x.square().mod(this.q));
            }, He2.prototype.divide = function rr2(t8) {
              return new He2(this.q, this.x.multiply(t8.toBigInteger().modInverse(this.q)).mod(this.q));
            }, Ve.prototype.getX = function nr2() {
              return null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)), this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
            }, Ve.prototype.getY = function ir2() {
              return null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q)), this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
            }, Ve.prototype.equals = function or(t8) {
              return t8 == this || (this.isInfinity() ? t8.isInfinity() : t8.isInfinity() ? this.isInfinity() : !!t8.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t8.z)).mod(this.curve.q).equals(w.ZERO) && t8.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t8.z)).mod(this.curve.q).equals(w.ZERO));
            }, Ve.prototype.isInfinity = function sr2() {
              return null == this.x && null == this.y || this.z.equals(w.ZERO) && !this.y.toBigInteger().equals(w.ZERO);
            }, Ve.prototype.negate = function ar() {
              return new Ve(this.curve, this.x, this.y.negate(), this.z);
            }, Ve.prototype.add = function ur(t8) {
              if (this.isInfinity())
                return t8;
              if (t8.isInfinity())
                return this;
              var e2 = t8.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t8.z)).mod(this.curve.q), r3 = t8.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t8.z)).mod(this.curve.q);
              if (w.ZERO.equals(r3))
                return w.ZERO.equals(e2) ? this.twice() : this.curve.getInfinity();
              var n2 = new w("3"), i2 = this.x.toBigInteger(), o2 = this.y.toBigInteger(), s2 = (t8.x.toBigInteger(), t8.y.toBigInteger(), r3.square()), a2 = s2.multiply(r3), u2 = i2.multiply(s2), c2 = e2.square().multiply(this.z), h2 = c2.subtract(u2.shiftLeft(1)).multiply(t8.z).subtract(a2).multiply(r3).mod(this.curve.q), l2 = u2.multiply(n2).multiply(e2).subtract(o2.multiply(a2)).subtract(c2.multiply(e2)).multiply(t8.z).add(e2.multiply(a2)).mod(this.curve.q), f2 = a2.multiply(this.z).multiply(t8.z).mod(this.curve.q);
              return new Ve(this.curve, this.curve.fromBigInteger(h2), this.curve.fromBigInteger(l2), f2);
            }, Ve.prototype.twice = function cr() {
              if (this.isInfinity())
                return this;
              if (0 == this.y.toBigInteger().signum())
                return this.curve.getInfinity();
              var t8 = new w("3"), e2 = this.x.toBigInteger(), r3 = this.y.toBigInteger(), n2 = r3.multiply(this.z), i2 = n2.multiply(r3).mod(this.curve.q), o2 = this.curve.a.toBigInteger(), s2 = e2.square().multiply(t8);
              w.ZERO.equals(o2) || (s2 = s2.add(this.z.square().multiply(o2)));
              var a2 = (s2 = s2.mod(this.curve.q)).square().subtract(e2.shiftLeft(3).multiply(i2)).shiftLeft(1).multiply(n2).mod(this.curve.q), u2 = s2.multiply(t8).multiply(e2).subtract(i2.shiftLeft(1)).shiftLeft(2).multiply(i2).subtract(s2.square().multiply(s2)).mod(this.curve.q), c2 = n2.square().multiply(n2).shiftLeft(3).mod(this.curve.q);
              return new Ve(this.curve, this.curve.fromBigInteger(a2), this.curve.fromBigInteger(u2), c2);
            }, Ve.prototype.multiply = function hr(t8) {
              if (this.isInfinity())
                return this;
              if (0 == t8.signum())
                return this.curve.getInfinity();
              var e2, r3 = t8, n2 = r3.multiply(new w("3")), i2 = this.negate(), o2 = this, s2 = this.curve.q.subtract(t8), a2 = s2.multiply(new w("3")), u2 = new Ve(this.curve, this.x, this.y), c2 = u2.negate();
              for (e2 = n2.bitLength() - 2; e2 > 0; --e2) {
                o2 = o2.twice();
                var h2 = n2.testBit(e2);
                h2 != r3.testBit(e2) && (o2 = o2.add(h2 ? this : i2));
              }
              for (e2 = a2.bitLength() - 2; e2 > 0; --e2) {
                u2 = u2.twice();
                var l2 = a2.testBit(e2);
                l2 != s2.testBit(e2) && (u2 = u2.add(l2 ? u2 : c2));
              }
              return o2;
            }, Ve.prototype.multiplyTwo = function lr(t8, e2, r3) {
              var n2;
              n2 = t8.bitLength() > r3.bitLength() ? t8.bitLength() - 1 : r3.bitLength() - 1;
              for (var i2 = this.curve.getInfinity(), o2 = this.add(e2); n2 >= 0; )
                i2 = i2.twice(), t8.testBit(n2) ? i2 = r3.testBit(n2) ? i2.add(o2) : i2.add(this) : r3.testBit(n2) && (i2 = i2.add(e2)), --n2;
              return i2;
            }, Ke.prototype.getQ = function fr() {
              return this.q;
            }, Ke.prototype.getA = function gr() {
              return this.a;
            }, Ke.prototype.getB = function dr() {
              return this.b;
            }, Ke.prototype.equals = function pr(t8) {
              return t8 == this || this.q.equals(t8.q) && this.a.equals(t8.a) && this.b.equals(t8.b);
            }, Ke.prototype.getInfinity = function vr() {
              return this.infinity;
            }, Ke.prototype.fromBigInteger = function yr(t8) {
              return new He2(this.q, t8);
            }, Ke.prototype.decodePointHex = function mr(t8) {
              switch (parseInt(t8.substr(0, 2), 16)) {
                case 0:
                  return this.infinity;
                case 2:
                case 3:
                  return null;
                case 4:
                case 6:
                case 7:
                  var e2 = (t8.length - 2) / 2, r3 = t8.substr(2, e2), n2 = t8.substr(e2 + 2, e2);
                  return new Ve(this, this.fromBigInteger(new w(r3, 16)), this.fromBigInteger(new w(n2, 16)));
                default:
                  return null;
              }
            }, /*! (c) Stefan Thomas | https://github.com/bitcoinjs/bitcoinjs-lib
             */
            He2.prototype.getByteLength = function() {
              return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
            }, Ve.prototype.getEncoded = function(t8) {
              var e2 = function t9(e3, r4) {
                var n3 = e3.toByteArrayUnsigned();
                if (r4 < n3.length)
                  n3 = n3.slice(n3.length - r4);
                else
                  for (; r4 > n3.length; )
                    n3.unshift(0);
                return n3;
              }, r3 = this.getX().toBigInteger(), n2 = this.getY().toBigInteger(), i2 = e2(r3, 32);
              return t8 ? n2.isEven() ? i2.unshift(2) : i2.unshift(3) : (i2.unshift(4), i2 = i2.concat(e2(n2, 32))), i2;
            }, Ve.decodeFrom = function(t8, e2) {
              e2[0];
              var r3 = e2.length - 1, n2 = e2.slice(1, 1 + r3 / 2), i2 = e2.slice(1 + r3 / 2, 1 + r3);
              n2.unshift(0), i2.unshift(0);
              var o2 = new w(n2), s2 = new w(i2);
              return new Ve(t8, t8.fromBigInteger(o2), t8.fromBigInteger(s2));
            }, Ve.decodeFromHex = function(t8, e2) {
              e2.substr(0, 2);
              var r3 = e2.length - 2, n2 = e2.substr(2, r3 / 2), i2 = e2.substr(2 + r3 / 2, r3 / 2), o2 = new w(n2, 16), s2 = new w(i2, 16);
              return new Ve(t8, t8.fromBigInteger(o2), t8.fromBigInteger(s2));
            }, Ve.prototype.add2D = function(t8) {
              if (this.isInfinity())
                return t8;
              if (t8.isInfinity())
                return this;
              if (this.x.equals(t8.x))
                return this.y.equals(t8.y) ? this.twice() : this.curve.getInfinity();
              var e2 = t8.x.subtract(this.x), r3 = t8.y.subtract(this.y).divide(e2), n2 = r3.square().subtract(this.x).subtract(t8.x), i2 = r3.multiply(this.x.subtract(n2)).subtract(this.y);
              return new Ve(this.curve, n2, i2);
            }, Ve.prototype.twice2D = function() {
              if (this.isInfinity())
                return this;
              if (0 == this.y.toBigInteger().signum())
                return this.curve.getInfinity();
              var t8 = this.curve.fromBigInteger(w.valueOf(2)), e2 = this.curve.fromBigInteger(w.valueOf(3)), r3 = this.x.square().multiply(e2).add(this.curve.a).divide(this.y.multiply(t8)), n2 = r3.square().subtract(this.x.multiply(t8)), i2 = r3.multiply(this.x.subtract(n2)).subtract(this.y);
              return new Ve(this.curve, n2, i2);
            }, Ve.prototype.multiply2D = function(t8) {
              if (this.isInfinity())
                return this;
              if (0 == t8.signum())
                return this.curve.getInfinity();
              var e2, r3 = t8, n2 = r3.multiply(new w("3")), i2 = this.negate(), o2 = this;
              for (e2 = n2.bitLength() - 2; e2 > 0; --e2) {
                o2 = o2.twice();
                var s2 = n2.testBit(e2);
                s2 != r3.testBit(e2) && (o2 = o2.add2D(s2 ? this : i2));
              }
              return o2;
            }, Ve.prototype.isOnCurve = function() {
              var t8 = this.getX().toBigInteger(), e2 = this.getY().toBigInteger(), r3 = this.curve.getA().toBigInteger(), n2 = this.curve.getB().toBigInteger(), i2 = this.curve.getQ(), o2 = e2.multiply(e2).mod(i2), s2 = t8.multiply(t8).multiply(t8).add(r3.multiply(t8)).add(n2).mod(i2);
              return o2.equals(s2);
            }, Ve.prototype.toString = function() {
              return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")";
            }, Ve.prototype.validate = function() {
              var t8 = this.curve.getQ();
              if (this.isInfinity())
                throw new Error("Point is at infinity.");
              var e2 = this.getX().toBigInteger(), r3 = this.getY().toBigInteger();
              if (e2.compareTo(w.ONE) < 0 || e2.compareTo(t8.subtract(w.ONE)) > 0)
                throw new Error("x coordinate out of bounds");
              if (r3.compareTo(w.ONE) < 0 || r3.compareTo(t8.subtract(w.ONE)) > 0)
                throw new Error("y coordinate out of bounds");
              if (!this.isOnCurve())
                throw new Error("Point is not on the curve.");
              if (this.multiply(t8).isInfinity())
                throw new Error("Point is not a scalar multiple of G.");
              return true;
            };
            var _r = function() {
              var t8 = new RegExp('(?:false|true|null|[\\{\\}\\[\\]]|(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)|(?:"(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))*"))', "g"), e2 = new RegExp("\\\\(?:([^u])|u(.{4}))", "g"), r3 = { '"': '"', "/": "/", "\\": "\\", b: "\b", f: "\f", n: "\n", r: "\r", t: "	" };
              function n2(t9, e3, n3) {
                return e3 ? r3[e3] : String.fromCharCode(parseInt(n3, 16));
              }
              var i2 = new String(""), o2 = Object.hasOwnProperty;
              return function(r4, s2) {
                var a2, u2, c2 = r4.match(t8), h2 = c2[0], l2 = false;
                "{" === h2 ? a2 = {} : "[" === h2 ? a2 = [] : (a2 = [], l2 = true);
                for (var f2 = [a2], d2 = 1 - l2, p2 = c2.length; d2 < p2; ++d2) {
                  var v3;
                  switch ((h2 = c2[d2]).charCodeAt(0)) {
                    default:
                      (v3 = f2[0])[u2 || v3.length] = +h2, u2 = void 0;
                      break;
                    case 34:
                      if (-1 !== (h2 = h2.substring(1, h2.length - 1)).indexOf("\\") && (h2 = h2.replace(e2, n2)), v3 = f2[0], !u2) {
                        if (!(v3 instanceof Array)) {
                          u2 = h2 || i2;
                          break;
                        }
                        u2 = v3.length;
                      }
                      v3[u2] = h2, u2 = void 0;
                      break;
                    case 91:
                      v3 = f2[0], f2.unshift(v3[u2 || v3.length] = []), u2 = void 0;
                      break;
                    case 93:
                      f2.shift();
                      break;
                    case 102:
                      (v3 = f2[0])[u2 || v3.length] = false, u2 = void 0;
                      break;
                    case 110:
                      (v3 = f2[0])[u2 || v3.length] = null, u2 = void 0;
                      break;
                    case 116:
                      (v3 = f2[0])[u2 || v3.length] = true, u2 = void 0;
                      break;
                    case 123:
                      v3 = f2[0], f2.unshift(v3[u2 || v3.length] = {}), u2 = void 0;
                      break;
                    case 125:
                      f2.shift();
                  }
                }
                if (l2) {
                  if (1 !== f2.length)
                    throw new Error();
                  a2 = a2[0];
                } else if (f2.length)
                  throw new Error();
                if (s2) {
                  a2 = function t9(e3, r5) {
                    var n3 = e3[r5];
                    if (n3 && "object" === (void 0 === n3 ? "undefined" : g(n3))) {
                      var i3 = null;
                      for (var a3 in n3)
                        if (o2.call(n3, a3) && n3 !== e3) {
                          var u3 = t9(n3, a3);
                          void 0 !== u3 ? n3[a3] = u3 : (i3 || (i3 = []), i3.push(a3));
                        }
                      if (i3)
                        for (var c3 = i3.length; --c3 >= 0; )
                          delete n3[i3[c3]];
                    }
                    return s2.call(e3, r5, n3);
                  }({ "": a2 }, "");
                }
                return a2;
              };
            }();
            void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.asn1 && Sr.asn1 || (Sr.asn1 = {}), Sr.asn1.ASN1Util = new function() {
              this.integerToByteHex = function(t8) {
                var e2 = t8.toString(16);
                return e2.length % 2 == 1 && (e2 = "0" + e2), e2;
              }, this.bigIntToMinTwosComplementsHex = function(t8) {
                var e2 = t8.toString(16);
                if ("-" != e2.substr(0, 1))
                  e2.length % 2 == 1 ? e2 = "0" + e2 : e2.match(/^[0-7]/) || (e2 = "00" + e2);
                else {
                  var r3 = e2.substr(1).length;
                  r3 % 2 == 1 ? r3 += 1 : e2.match(/^[0-7]/) || (r3 += 2);
                  for (var n2 = "", i2 = 0; i2 < r3; i2++)
                    n2 += "f";
                  e2 = new w(n2, 16).xor(t8).add(w.ONE).toString(16).replace(/^-/, "");
                }
                return e2;
              }, this.getPEMStringFromHex = function(t8, e2) {
                return jr2(t8, e2);
              }, this.newObject = function(t8) {
                var e2 = Sr.asn1, r3 = e2.ASN1Object, n2 = e2.DERBoolean, i2 = e2.DERInteger, o2 = e2.DERBitString, s2 = e2.DEROctetString, a2 = e2.DERNull, u2 = e2.DERObjectIdentifier, c2 = e2.DEREnumerated, h2 = e2.DERUTF8String, l2 = e2.DERNumericString, f2 = e2.DERPrintableString, g2 = e2.DERTeletexString, d2 = e2.DERIA5String, p2 = e2.DERUTCTime, v3 = e2.DERGeneralizedTime, y2 = e2.DERVisibleString, m2 = e2.DERBMPString, _2 = e2.DERSequence, S2 = e2.DERSet, b2 = e2.DERTaggedObject, w2 = e2.ASN1Util.newObject;
                if (t8 instanceof e2.ASN1Object)
                  return t8;
                var F2 = Object.keys(t8);
                if (1 != F2.length)
                  throw new Error("key of param shall be only one.");
                var E = F2[0];
                if (-1 == ":asn1:bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:visstr:bmpstr:seq:set:tag:".indexOf(":" + E + ":"))
                  throw new Error("undefined key: " + E);
                if ("bool" == E)
                  return new n2(t8[E]);
                if ("int" == E)
                  return new i2(t8[E]);
                if ("bitstr" == E)
                  return new o2(t8[E]);
                if ("octstr" == E)
                  return new s2(t8[E]);
                if ("null" == E)
                  return new a2(t8[E]);
                if ("oid" == E)
                  return new u2(t8[E]);
                if ("enum" == E)
                  return new c2(t8[E]);
                if ("utf8str" == E)
                  return new h2(t8[E]);
                if ("numstr" == E)
                  return new l2(t8[E]);
                if ("prnstr" == E)
                  return new f2(t8[E]);
                if ("telstr" == E)
                  return new g2(t8[E]);
                if ("ia5str" == E)
                  return new d2(t8[E]);
                if ("utctime" == E)
                  return new p2(t8[E]);
                if ("gentime" == E)
                  return new v3(t8[E]);
                if ("visstr" == E)
                  return new y2(t8[E]);
                if ("bmpstr" == E)
                  return new m2(t8[E]);
                if ("asn1" == E)
                  return new r3(t8[E]);
                if ("seq" == E) {
                  for (var x = t8[E], A2 = [], k2 = 0; k2 < x.length; k2++) {
                    var P3 = w2(x[k2]);
                    A2.push(P3);
                  }
                  return new _2({ array: A2 });
                }
                if ("set" == E) {
                  for (x = t8[E], A2 = [], k2 = 0; k2 < x.length; k2++) {
                    P3 = w2(x[k2]);
                    A2.push(P3);
                  }
                  return new S2({ array: A2 });
                }
                if ("tag" == E) {
                  var C2 = t8[E];
                  if ("[object Array]" === Object.prototype.toString.call(C2) && 3 == C2.length) {
                    var T2 = w2(C2[2]);
                    return new b2({ tag: C2[0], explicit: C2[1], obj: T2 });
                  }
                  return new b2(C2);
                }
              }, this.jsonToASN1HEX = function(t8) {
                return this.newObject(t8).getEncodedHex();
              };
            }(), Sr.asn1.ASN1Util.oidHexToInt = function(t8) {
              for (var e2 = "", r3 = parseInt(t8.substr(0, 2), 16), n2 = (e2 = Math.floor(r3 / 40) + "." + r3 % 40, ""), i2 = 2; i2 < t8.length; i2 += 2) {
                var o2 = ("00000000" + parseInt(t8.substr(i2, 2), 16).toString(2)).slice(-8);
                if (n2 += o2.substr(1, 7), "0" == o2.substr(0, 1))
                  e2 = e2 + "." + new w(n2, 2).toString(10), n2 = "";
              }
              return e2;
            }, Sr.asn1.ASN1Util.oidIntToHex = function(t8) {
              var e2 = function t9(e3) {
                var r4 = e3.toString(16);
                return 1 == r4.length && (r4 = "0" + r4), r4;
              }, r3 = function t9(r4) {
                var n3 = "", i3 = new w(r4, 10).toString(2), o3 = 7 - i3.length % 7;
                7 == o3 && (o3 = 0);
                for (var s3 = "", a2 = 0; a2 < o3; a2++)
                  s3 += "0";
                i3 = s3 + i3;
                for (a2 = 0; a2 < i3.length - 1; a2 += 7) {
                  var u2 = i3.substr(a2, 7);
                  a2 != i3.length - 7 && (u2 = "1" + u2), n3 += e2(parseInt(u2, 2));
                }
                return n3;
              };
              if (!t8.match(/^[0-9.]+$/))
                throw "malformed oid string: " + t8;
              var n2 = "", i2 = t8.split("."), o2 = 40 * parseInt(i2[0]) + parseInt(i2[1]);
              n2 += e2(o2), i2.splice(0, 2);
              for (var s2 = 0; s2 < i2.length; s2++)
                n2 += r3(i2[s2]);
              return n2;
            }, Sr.asn1.ASN1Object = function(t8) {
              this.params = null, this.getLengthHexFromValue = function() {
                if (void 0 === this.hV || null == this.hV)
                  throw new Error("this.hV is null or undefined");
                if (this.hV.length % 2 == 1)
                  throw new Error("value hex must be even length: n=" + "".length + ",v=" + this.hV);
                var t9 = this.hV.length / 2, e2 = t9.toString(16);
                if (e2.length % 2 == 1 && (e2 = "0" + e2), t9 < 128)
                  return e2;
                var r3 = e2.length / 2;
                if (r3 > 15)
                  throw "ASN.1 length too long to represent by 8x: n = " + t9.toString(16);
                return (128 + r3).toString(16) + e2;
              }, this.getEncodedHex = function() {
                return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(), this.hL = this.getLengthHexFromValue(), this.hTLV = this.hT + this.hL + this.hV, this.isModified = false), this.hTLV;
              }, this.getValueHex = function() {
                return this.getEncodedHex(), this.hV;
              }, this.getFreshValueHex = function() {
                return "";
              }, this.setByParam = function(t9) {
                this.params = t9;
              }, null != t8 && null != t8.tlv && (this.hTLV = t8.tlv, this.isModified = false);
            }, Sr.asn1.DERAbstractString = function(t8) {
              Sr.asn1.DERAbstractString.superclass.constructor.call(this);
              this.getString = function() {
                return this.s;
              }, this.setString = function(t9) {
                this.hTLV = null, this.isModified = true, this.s = t9, this.hV = Ir(this.s).toLowerCase();
              }, this.setStringHex = function(t9) {
                this.hTLV = null, this.isModified = true, this.s = null, this.hV = t9;
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, void 0 !== t8 && ("string" == typeof t8 ? this.setString(t8) : void 0 !== t8.str ? this.setString(t8.str) : void 0 !== t8.hex && this.setStringHex(t8.hex));
            }, Zr2(Sr.asn1.DERAbstractString, Sr.asn1.ASN1Object), Sr.asn1.DERAbstractTime = function(t8) {
              Sr.asn1.DERAbstractTime.superclass.constructor.call(this);
              this.localDateToUTC = function(t9) {
                var e2 = t9.getTime() + 6e4 * t9.getTimezoneOffset();
                return new Date(e2);
              }, this.formatDate = function(t9, e2, r3) {
                var n2 = this.zeroPadding, i2 = this.localDateToUTC(t9), o2 = String(i2.getFullYear());
                "utc" == e2 && (o2 = o2.substr(2, 2));
                var s2 = o2 + n2(String(i2.getMonth() + 1), 2) + n2(String(i2.getDate()), 2) + n2(String(i2.getHours()), 2) + n2(String(i2.getMinutes()), 2) + n2(String(i2.getSeconds()), 2);
                if (true === r3) {
                  var a2 = i2.getMilliseconds();
                  if (0 != a2) {
                    var u2 = n2(String(a2), 3);
                    s2 = s2 + "." + (u2 = u2.replace(/[0]+$/, ""));
                  }
                }
                return s2 + "Z";
              }, this.zeroPadding = function(t9, e2) {
                return t9.length >= e2 ? t9 : new Array(e2 - t9.length + 1).join("0") + t9;
              }, this.getString = function() {
                return this.s;
              }, this.setString = function(t9) {
                this.hTLV = null, this.isModified = true, this.s = t9, this.hV = kr(t9);
              }, this.setByDateValue = function(t9, e2, r3, n2, i2, o2) {
                var s2 = new Date(Date.UTC(t9, e2 - 1, r3, n2, i2, o2, 0));
                this.setByDate(s2);
              }, this.getFreshValueHex = function() {
                return this.hV;
              };
            }, Zr2(Sr.asn1.DERAbstractTime, Sr.asn1.ASN1Object), Sr.asn1.DERAbstractStructured = function(t8) {
              Sr.asn1.DERAbstractString.superclass.constructor.call(this);
              this.setByASN1ObjectArray = function(t9) {
                this.hTLV = null, this.isModified = true, this.asn1Array = t9;
              }, this.appendASN1Object = function(t9) {
                this.hTLV = null, this.isModified = true, this.asn1Array.push(t9);
              }, this.asn1Array = new Array(), void 0 !== t8 && void 0 !== t8.array && (this.asn1Array = t8.array);
            }, Zr2(Sr.asn1.DERAbstractStructured, Sr.asn1.ASN1Object), Sr.asn1.DERBoolean = function(t8) {
              Sr.asn1.DERBoolean.superclass.constructor.call(this), this.hT = "01", this.hTLV = 0 == t8 ? "010100" : "0101ff";
            }, Zr2(Sr.asn1.DERBoolean, Sr.asn1.ASN1Object), Sr.asn1.DERInteger = function(t8) {
              Sr.asn1.DERInteger.superclass.constructor.call(this), this.hT = "02", this.setByBigInteger = function(t9) {
                this.hTLV = null, this.isModified = true, this.hV = Sr.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t9);
              }, this.setByInteger = function(t9) {
                var e2 = new w(String(t9), 10);
                this.setByBigInteger(e2);
              }, this.setValueHex = function(t9) {
                this.hV = t9;
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, void 0 !== t8 && (void 0 !== t8.bigint ? this.setByBigInteger(t8.bigint) : void 0 !== t8.int ? this.setByInteger(t8.int) : "number" == typeof t8 ? this.setByInteger(t8) : void 0 !== t8.hex && this.setValueHex(t8.hex));
            }, Zr2(Sr.asn1.DERInteger, Sr.asn1.ASN1Object), Sr.asn1.DERBitString = function(t8) {
              if (void 0 !== t8 && void 0 !== t8.obj) {
                var e2 = Sr.asn1.ASN1Util.newObject(t8.obj);
                t8.hex = "00" + e2.getEncodedHex();
              }
              Sr.asn1.DERBitString.superclass.constructor.call(this), this.hT = "03", this.setHexValueIncludingUnusedBits = function(t9) {
                this.hTLV = null, this.isModified = true, this.hV = t9;
              }, this.setUnusedBitsAndHexValue = function(t9, e3) {
                if (t9 < 0 || 7 < t9)
                  throw "unused bits shall be from 0 to 7: u = " + t9;
                var r3 = "0" + t9;
                this.hTLV = null, this.isModified = true, this.hV = r3 + e3;
              }, this.setByBinaryString = function(t9) {
                var e3 = 8 - (t9 = t9.replace(/0+$/, "")).length % 8;
                8 == e3 && (e3 = 0);
                for (var r3 = 0; r3 <= e3; r3++)
                  t9 += "0";
                var n2 = "";
                for (r3 = 0; r3 < t9.length - 1; r3 += 8) {
                  var i2 = t9.substr(r3, 8), o2 = parseInt(i2, 2).toString(16);
                  1 == o2.length && (o2 = "0" + o2), n2 += o2;
                }
                this.hTLV = null, this.isModified = true, this.hV = "0" + e3 + n2;
              }, this.setByBooleanArray = function(t9) {
                for (var e3 = "", r3 = 0; r3 < t9.length; r3++)
                  1 == t9[r3] ? e3 += "1" : e3 += "0";
                this.setByBinaryString(e3);
              }, this.newFalseArray = function(t9) {
                for (var e3 = new Array(t9), r3 = 0; r3 < t9; r3++)
                  e3[r3] = false;
                return e3;
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, void 0 !== t8 && ("string" == typeof t8 && t8.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(t8) : void 0 !== t8.hex ? this.setHexValueIncludingUnusedBits(t8.hex) : void 0 !== t8.bin ? this.setByBinaryString(t8.bin) : void 0 !== t8.array && this.setByBooleanArray(t8.array));
            }, Zr2(Sr.asn1.DERBitString, Sr.asn1.ASN1Object), Sr.asn1.DEROctetString = function(t8) {
              if (void 0 !== t8 && void 0 !== t8.obj) {
                var e2 = Sr.asn1.ASN1Util.newObject(t8.obj);
                t8.hex = e2.getEncodedHex();
              }
              Sr.asn1.DEROctetString.superclass.constructor.call(this, t8), this.hT = "04";
            }, Zr2(Sr.asn1.DEROctetString, Sr.asn1.DERAbstractString), Sr.asn1.DERNull = function() {
              Sr.asn1.DERNull.superclass.constructor.call(this), this.hT = "05", this.hTLV = "0500";
            }, Zr2(Sr.asn1.DERNull, Sr.asn1.ASN1Object), Sr.asn1.DERObjectIdentifier = function(t8) {
              Sr.asn1.DERObjectIdentifier.superclass.constructor.call(this), this.hT = "06", this.setValueHex = function(t9) {
                this.hTLV = null, this.isModified = true, this.s = null, this.hV = t9;
              }, this.setValueOidString = function(t9) {
                var e2 = function r3(t10) {
                  var e3 = function t11(e4) {
                    var r5 = e4.toString(16);
                    return 1 == r5.length && (r5 = "0" + r5), r5;
                  }, r4 = function t11(r5) {
                    var n3 = "", i3 = parseInt(r5, 10).toString(2), o3 = 7 - i3.length % 7;
                    7 == o3 && (o3 = 0);
                    for (var s3 = "", a2 = 0; a2 < o3; a2++)
                      s3 += "0";
                    i3 = s3 + i3;
                    for (a2 = 0; a2 < i3.length - 1; a2 += 7) {
                      var u2 = i3.substr(a2, 7);
                      a2 != i3.length - 7 && (u2 = "1" + u2), n3 += e3(parseInt(u2, 2));
                    }
                    return n3;
                  };
                  try {
                    if (!t10.match(/^[0-9.]+$/))
                      return null;
                    var n2 = "", i2 = t10.split("."), o2 = 40 * parseInt(i2[0], 10) + parseInt(i2[1], 10);
                    n2 += e3(o2), i2.splice(0, 2);
                    for (var s2 = 0; s2 < i2.length; s2++)
                      n2 += r4(i2[s2]);
                    return n2;
                  } catch (t11) {
                    return null;
                  }
                }(t9);
                if (null == e2)
                  throw new Error("malformed oid string: " + t9);
                this.hTLV = null, this.isModified = true, this.s = null, this.hV = e2;
              }, this.setValueName = function(t9) {
                var e2 = Sr.asn1.x509.OID.name2oid(t9);
                if ("" === e2)
                  throw new Error("DERObjectIdentifier oidName undefined: " + t9);
                this.setValueOidString(e2);
              }, this.setValueNameOrOid = function(t9) {
                t9.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(t9) : this.setValueName(t9);
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, this.setByParam = function(t9) {
                "string" == typeof t9 ? this.setValueNameOrOid(t9) : void 0 !== t9.oid ? this.setValueNameOrOid(t9.oid) : void 0 !== t9.name ? this.setValueNameOrOid(t9.name) : void 0 !== t9.hex && this.setValueHex(t9.hex);
              }, void 0 !== t8 && this.setByParam(t8);
            }, Zr2(Sr.asn1.DERObjectIdentifier, Sr.asn1.ASN1Object), Sr.asn1.DEREnumerated = function(t8) {
              Sr.asn1.DEREnumerated.superclass.constructor.call(this), this.hT = "0a", this.setByBigInteger = function(t9) {
                this.hTLV = null, this.isModified = true, this.hV = Sr.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t9);
              }, this.setByInteger = function(t9) {
                var e2 = new w(String(t9), 10);
                this.setByBigInteger(e2);
              }, this.setValueHex = function(t9) {
                this.hV = t9;
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, void 0 !== t8 && (void 0 !== t8.int ? this.setByInteger(t8.int) : "number" == typeof t8 ? this.setByInteger(t8) : void 0 !== t8.hex && this.setValueHex(t8.hex));
            }, Zr2(Sr.asn1.DEREnumerated, Sr.asn1.ASN1Object), Sr.asn1.DERUTF8String = function(t8) {
              Sr.asn1.DERUTF8String.superclass.constructor.call(this, t8), this.hT = "0c";
            }, Zr2(Sr.asn1.DERUTF8String, Sr.asn1.DERAbstractString), Sr.asn1.DERNumericString = function(t8) {
              Sr.asn1.DERNumericString.superclass.constructor.call(this, t8), this.hT = "12";
            }, Zr2(Sr.asn1.DERNumericString, Sr.asn1.DERAbstractString), Sr.asn1.DERPrintableString = function(t8) {
              Sr.asn1.DERPrintableString.superclass.constructor.call(this, t8), this.hT = "13";
            }, Zr2(Sr.asn1.DERPrintableString, Sr.asn1.DERAbstractString), Sr.asn1.DERTeletexString = function(t8) {
              Sr.asn1.DERTeletexString.superclass.constructor.call(this, t8), this.hT = "14";
            }, Zr2(Sr.asn1.DERTeletexString, Sr.asn1.DERAbstractString), Sr.asn1.DERIA5String = function(t8) {
              Sr.asn1.DERIA5String.superclass.constructor.call(this, t8), this.hT = "16";
            }, Zr2(Sr.asn1.DERIA5String, Sr.asn1.DERAbstractString), Sr.asn1.DERVisibleString = function(t8) {
              Sr.asn1.DERIA5String.superclass.constructor.call(this, t8), this.hT = "1a";
            }, Zr2(Sr.asn1.DERVisibleString, Sr.asn1.DERAbstractString), Sr.asn1.DERBMPString = function(t8) {
              Sr.asn1.DERBMPString.superclass.constructor.call(this, t8), this.hT = "1e";
            }, Zr2(Sr.asn1.DERBMPString, Sr.asn1.DERAbstractString), Sr.asn1.DERUTCTime = function(t8) {
              Sr.asn1.DERUTCTime.superclass.constructor.call(this, t8), this.hT = "17", this.setByDate = function(t9) {
                this.hTLV = null, this.isModified = true, this.date = t9, this.s = this.formatDate(this.date, "utc"), this.hV = kr(this.s);
              }, this.getFreshValueHex = function() {
                return void 0 === this.date && void 0 === this.s && (this.date = /* @__PURE__ */ new Date(), this.s = this.formatDate(this.date, "utc"), this.hV = kr(this.s)), this.hV;
              }, void 0 !== t8 && (void 0 !== t8.str ? this.setString(t8.str) : "string" == typeof t8 && t8.match(/^[0-9]{12}Z$/) ? this.setString(t8) : void 0 !== t8.hex ? this.setStringHex(t8.hex) : void 0 !== t8.date && this.setByDate(t8.date));
            }, Zr2(Sr.asn1.DERUTCTime, Sr.asn1.DERAbstractTime), Sr.asn1.DERGeneralizedTime = function(t8) {
              Sr.asn1.DERGeneralizedTime.superclass.constructor.call(this, t8), this.hT = "18", this.withMillis = false, this.setByDate = function(t9) {
                this.hTLV = null, this.isModified = true, this.date = t9, this.s = this.formatDate(this.date, "gen", this.withMillis), this.hV = kr(this.s);
              }, this.getFreshValueHex = function() {
                return void 0 === this.date && void 0 === this.s && (this.date = /* @__PURE__ */ new Date(), this.s = this.formatDate(this.date, "gen", this.withMillis), this.hV = kr(this.s)), this.hV;
              }, void 0 !== t8 && (void 0 !== t8.str ? this.setString(t8.str) : "string" == typeof t8 && t8.match(/^[0-9]{14}Z$/) ? this.setString(t8) : void 0 !== t8.hex ? this.setStringHex(t8.hex) : void 0 !== t8.date && this.setByDate(t8.date), true === t8.millis && (this.withMillis = true));
            }, Zr2(Sr.asn1.DERGeneralizedTime, Sr.asn1.DERAbstractTime), Sr.asn1.DERSequence = function(t8) {
              Sr.asn1.DERSequence.superclass.constructor.call(this, t8), this.hT = "30", this.getFreshValueHex = function() {
                for (var t9 = "", e2 = 0; e2 < this.asn1Array.length; e2++) {
                  t9 += this.asn1Array[e2].getEncodedHex();
                }
                return this.hV = t9, this.hV;
              };
            }, Zr2(Sr.asn1.DERSequence, Sr.asn1.DERAbstractStructured), Sr.asn1.DERSet = function(t8) {
              Sr.asn1.DERSet.superclass.constructor.call(this, t8), this.hT = "31", this.sortFlag = true, this.getFreshValueHex = function() {
                for (var t9 = new Array(), e2 = 0; e2 < this.asn1Array.length; e2++) {
                  var r3 = this.asn1Array[e2];
                  t9.push(r3.getEncodedHex());
                }
                return 1 == this.sortFlag && t9.sort(), this.hV = t9.join(""), this.hV;
              }, void 0 !== t8 && void 0 !== t8.sortflag && 0 == t8.sortflag && (this.sortFlag = false);
            }, Zr2(Sr.asn1.DERSet, Sr.asn1.DERAbstractStructured), Sr.asn1.DERTaggedObject = function(t8) {
              Sr.asn1.DERTaggedObject.superclass.constructor.call(this);
              var e2 = Sr.asn1;
              this.hT = "a0", this.hV = "", this.isExplicit = true, this.asn1Object = null, this.setASN1Object = function(t9, e3, r3) {
                this.hT = e3, this.isExplicit = t9, this.asn1Object = r3, this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(), this.hTLV = null, this.isModified = true) : (this.hV = null, this.hTLV = r3.getEncodedHex(), this.hTLV = this.hTLV.replace(/^../, e3), this.isModified = false);
              }, this.getFreshValueHex = function() {
                return this.hV;
              }, this.setByParam = function(t9) {
                null != t9.tag && (this.hT = t9.tag), null != t9.explicit && (this.isExplicit = t9.explicit), null != t9.tage && (this.hT = t9.tage, this.isExplicit = true), null != t9.tagi && (this.hT = t9.tagi, this.isExplicit = false), null != t9.obj && (t9.obj instanceof e2.ASN1Object ? (this.asn1Object = t9.obj, this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)) : "object" == g(t9.obj) && (this.asn1Object = e2.ASN1Util.newObject(t9.obj), this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)));
              }, null != t8 && this.setByParam(t8);
            }, Zr2(Sr.asn1.DERTaggedObject, Sr.asn1.ASN1Object);
            var Sr, br, wr, Fr = new function() {
            }();
            function Er(t8) {
              for (var e2 = new Array(), r3 = 0; r3 < t8.length; r3++)
                e2[r3] = t8.charCodeAt(r3);
              return e2;
            }
            function xr2(t8) {
              for (var e2 = "", r3 = 0; r3 < t8.length; r3++)
                e2 += String.fromCharCode(t8[r3]);
              return e2;
            }
            function Ar(t8) {
              for (var e2 = "", r3 = 0; r3 < t8.length; r3++) {
                var n2 = t8[r3].toString(16);
                1 == n2.length && (n2 = "0" + n2), e2 += n2;
              }
              return e2;
            }
            function kr(t8) {
              return Ar(Er(t8));
            }
            function Pr(t8) {
              return t8 = (t8 = (t8 = t8.replace(/\=/g, "")).replace(/\+/g, "-")).replace(/\//g, "_");
            }
            function Cr(t8) {
              return t8.length % 4 == 2 ? t8 += "==" : t8.length % 4 == 3 && (t8 += "="), t8 = (t8 = t8.replace(/-/g, "+")).replace(/_/g, "/");
            }
            function Tr(t8) {
              return t8.length % 2 == 1 && (t8 = "0" + t8), Pr(_(t8));
            }
            function Rr(t8) {
              return S(Cr(t8));
            }
            function Ir(t8) {
              return Kr2(Gr2(t8));
            }
            function Dr(t8) {
              return decodeURIComponent(qr(t8));
            }
            function Lr(t8) {
              for (var e2 = "", r3 = 0; r3 < t8.length - 1; r3 += 2)
                e2 += String.fromCharCode(parseInt(t8.substr(r3, 2), 16));
              return e2;
            }
            function Nr(t8) {
              for (var e2 = "", r3 = 0; r3 < t8.length; r3++)
                e2 += ("0" + t8.charCodeAt(r3).toString(16)).slice(-2);
              return e2;
            }
            function Ur(t8) {
              return _(t8);
            }
            function Br(t8) {
              var e2 = Ur(t8).replace(/(.{64})/g, "$1\r\n");
              return e2 = e2.replace(/\r\n$/, "");
            }
            function Or(t8) {
              return S(t8.replace(/[^0-9A-Za-z\/+=]*/g, ""));
            }
            function jr2(t8, e2) {
              return "-----BEGIN " + e2 + "-----\r\n" + Br(t8) + "\r\n-----END " + e2 + "-----\r\n";
            }
            function Mr2(t8, e2) {
              if (-1 == t8.indexOf("-----BEGIN "))
                throw "can't find PEM header: " + e2;
              return Or(t8 = void 0 !== e2 ? (t8 = t8.replace(new RegExp("^[^]*-----BEGIN " + e2 + "-----"), "")).replace(new RegExp("-----END " + e2 + "-----[^]*$"), "") : (t8 = t8.replace(/^[^]*-----BEGIN [^-]+-----/, "")).replace(/-----END [^-]+-----[^]*$/, ""));
            }
            function Hr(t8) {
              var e2, r3, n2, i2, o2, s2, a2, u2, c2, h2, l2;
              if (l2 = t8.match(/^(\d{2}|\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/))
                return u2 = l2[1], e2 = parseInt(u2), 2 === u2.length && (50 <= e2 && e2 < 100 ? e2 = 1900 + e2 : 0 <= e2 && e2 < 50 && (e2 = 2e3 + e2)), r3 = parseInt(l2[2]) - 1, n2 = parseInt(l2[3]), i2 = parseInt(l2[4]), o2 = parseInt(l2[5]), s2 = parseInt(l2[6]), a2 = 0, "" !== (c2 = l2[7]) && (h2 = (c2.substr(1) + "00").substr(0, 3), a2 = parseInt(h2)), Date.UTC(e2, r3, n2, i2, o2, s2, a2);
              throw "unsupported zulu format: " + t8;
            }
            function Vr2(t8) {
              return ~~(Hr(t8) / 1e3);
            }
            function Kr2(t8) {
              return t8.replace(/%/g, "");
            }
            function qr(t8) {
              return t8.replace(/(..)/g, "%$1");
            }
            function Jr2(t8) {
              var e2 = "malformed IPv6 address";
              if (!t8.match(/^[0-9A-Fa-f:]+$/))
                throw e2;
              var r3 = (t8 = t8.toLowerCase()).split(":").length - 1;
              if (r3 < 2)
                throw e2;
              var n2 = ":".repeat(7 - r3 + 2), i2 = (t8 = t8.replace("::", n2)).split(":");
              if (8 != i2.length)
                throw e2;
              for (var o2 = 0; o2 < 8; o2++)
                i2[o2] = ("0000" + i2[o2]).slice(-4);
              return i2.join("");
            }
            function Wr2(t8) {
              if (!t8.match(/^[0-9A-Fa-f]{32}$/))
                throw "malformed IPv6 address octet";
              for (var e2 = (t8 = t8.toLowerCase()).match(/.{1,4}/g), r3 = 0; r3 < 8; r3++)
                e2[r3] = e2[r3].replace(/^0+/, ""), "" == e2[r3] && (e2[r3] = "0");
              var n2 = (t8 = ":" + e2.join(":") + ":").match(/:(0:){2,}/g);
              if (null === n2)
                return t8.slice(1, -1);
              var i2 = "";
              for (r3 = 0; r3 < n2.length; r3++)
                n2[r3].length > i2.length && (i2 = n2[r3]);
              return (t8 = t8.replace(i2, "::")).slice(1, -1);
            }
            function zr2(t8) {
              var e2 = "malformed hex value";
              if (!t8.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/))
                throw e2;
              if (8 != t8.length)
                return 32 == t8.length ? Wr2(t8) : t8;
              try {
                return parseInt(t8.substr(0, 2), 16) + "." + parseInt(t8.substr(2, 2), 16) + "." + parseInt(t8.substr(4, 2), 16) + "." + parseInt(t8.substr(6, 2), 16);
              } catch (t9) {
                throw e2;
              }
            }
            function Yr2(t8) {
              return t8.match(/.{4}/g).map(function e2(t9) {
                var e3 = parseInt(t9.substr(0, 2), 16), r3 = parseInt(t9.substr(2), 16);
                if (0 == e3 & r3 < 128)
                  return String.fromCharCode(r3);
                if (e3 < 8) {
                  var n2 = 128 | 63 & r3;
                  return Dr((192 | (7 & e3) << 3 | (192 & r3) >> 6).toString(16) + n2.toString(16));
                }
                n2 = 128 | (15 & e3) << 2 | (192 & r3) >> 6;
                var i2 = 128 | 63 & r3;
                return Dr((224 | (240 & e3) >> 4).toString(16) + n2.toString(16) + i2.toString(16));
              }).join("");
            }
            function Gr2(t8) {
              for (var e2 = encodeURIComponent(t8), r3 = "", n2 = 0; n2 < e2.length; n2++)
                "%" == e2[n2] ? (r3 += e2.substr(n2, 3), n2 += 2) : r3 = r3 + "%" + kr(e2[n2]);
              return r3;
            }
            function Xr2(t8) {
              return !(t8.length % 2 != 0 || !t8.match(/^[0-9a-f]+$/) && !t8.match(/^[0-9A-F]+$/));
            }
            function $r(t8) {
              return t8.length % 2 == 1 ? "0" + t8 : t8.substr(0, 1) > "7" ? "00" + t8 : t8;
            }
            Fr.getLblen = function(t8, e2) {
              if ("8" != t8.substr(e2 + 2, 1))
                return 1;
              var r3 = parseInt(t8.substr(e2 + 3, 1));
              return 0 == r3 ? -1 : 0 < r3 && r3 < 10 ? r3 + 1 : -2;
            }, Fr.getL = function(t8, e2) {
              var r3 = Fr.getLblen(t8, e2);
              return r3 < 1 ? "" : t8.substr(e2 + 2, 2 * r3);
            }, Fr.getVblen = function(t8, e2) {
              var r3;
              return "" == (r3 = Fr.getL(t8, e2)) ? -1 : ("8" === r3.substr(0, 1) ? new w(r3.substr(2), 16) : new w(r3, 16)).intValue();
            }, Fr.getVidx = function(t8, e2) {
              var r3 = Fr.getLblen(t8, e2);
              return r3 < 0 ? r3 : e2 + 2 * (r3 + 1);
            }, Fr.getV = function(t8, e2) {
              var r3 = Fr.getVidx(t8, e2), n2 = Fr.getVblen(t8, e2);
              return t8.substr(r3, 2 * n2);
            }, Fr.getTLV = function(t8, e2) {
              return t8.substr(e2, 2) + Fr.getL(t8, e2) + Fr.getV(t8, e2);
            }, Fr.getTLVblen = function(t8, e2) {
              return 2 + 2 * Fr.getLblen(t8, e2) + 2 * Fr.getVblen(t8, e2);
            }, Fr.getNextSiblingIdx = function(t8, e2) {
              return Fr.getVidx(t8, e2) + 2 * Fr.getVblen(t8, e2);
            }, Fr.getChildIdx = function(t8, e2) {
              var r3, n2, i2, o2 = Fr, s2 = [];
              r3 = o2.getVidx(t8, e2), n2 = 2 * o2.getVblen(t8, e2), "03" == t8.substr(e2, 2) && (r3 += 2, n2 -= 2), i2 = 0;
              for (var a2 = r3; i2 <= n2; ) {
                var u2 = o2.getTLVblen(t8, a2);
                if ((i2 += u2) <= n2 && s2.push(a2), a2 += u2, i2 >= n2)
                  break;
              }
              return s2;
            }, Fr.getNthChildIdx = function(t8, e2, r3) {
              return Fr.getChildIdx(t8, e2)[r3];
            }, Fr.getIdxbyList = function(t8, e2, r3, n2) {
              var i2, o2, s2 = Fr;
              return 0 == r3.length ? void 0 !== n2 && t8.substr(e2, 2) !== n2 ? -1 : e2 : (i2 = r3.shift()) >= (o2 = s2.getChildIdx(t8, e2)).length ? -1 : s2.getIdxbyList(t8, o2[i2], r3, n2);
            }, Fr.getIdxbyListEx = function(t8, e2, r3, n2) {
              var i2, o2, s2 = Fr;
              if (0 == r3.length)
                return void 0 !== n2 && t8.substr(e2, 2) !== n2 ? -1 : e2;
              i2 = r3.shift(), o2 = s2.getChildIdx(t8, e2);
              for (var a2 = 0, u2 = 0; u2 < o2.length; u2++) {
                var c2 = t8.substr(o2[u2], 2);
                if ("number" == typeof i2 && !s2.isContextTag(c2) && a2 == i2 || "string" == typeof i2 && s2.isContextTag(c2, i2))
                  return s2.getIdxbyListEx(t8, o2[u2], r3, n2);
                s2.isContextTag(c2) || a2++;
              }
              return -1;
            }, Fr.getTLVbyList = function(t8, e2, r3, n2) {
              var i2 = Fr, o2 = i2.getIdxbyList(t8, e2, r3, n2);
              return -1 == o2 || o2 >= t8.length ? null : i2.getTLV(t8, o2);
            }, Fr.getTLVbyListEx = function(t8, e2, r3, n2) {
              var i2 = Fr, o2 = i2.getIdxbyListEx(t8, e2, r3, n2);
              return -1 == o2 ? null : i2.getTLV(t8, o2);
            }, Fr.getVbyList = function(t8, e2, r3, n2, i2) {
              var o2, s2, a2 = Fr;
              return -1 == (o2 = a2.getIdxbyList(t8, e2, r3, n2)) || o2 >= t8.length ? null : (s2 = a2.getV(t8, o2), true === i2 && (s2 = s2.substr(2)), s2);
            }, Fr.getVbyListEx = function(t8, e2, r3, n2, i2) {
              var o2, s2, a2 = Fr;
              return -1 == (o2 = a2.getIdxbyListEx(t8, e2, r3, n2)) ? null : (s2 = a2.getV(t8, o2), "03" == t8.substr(o2, 2) && false !== i2 && (s2 = s2.substr(2)), s2);
            }, Fr.getInt = function(t8, e2, r3) {
              null == r3 && (r3 = -1);
              try {
                var n2 = t8.substr(e2, 2);
                if ("02" != n2 && "03" != n2)
                  return r3;
                var i2 = Fr.getV(t8, e2);
                return "02" == n2 ? parseInt(i2, 16) : function o2(t9) {
                  try {
                    var e3 = t9.substr(0, 2);
                    if ("00" == e3)
                      return parseInt(t9.substr(2), 16);
                    var r4 = parseInt(e3, 16), n3 = t9.substr(2), i3 = parseInt(n3, 16).toString(2);
                    return "0" == i3 && (i3 = "00000000"), i3 = i3.slice(0, 0 - r4), parseInt(i3, 2);
                  } catch (t10) {
                    return -1;
                  }
                }(i2);
              } catch (t9) {
                return r3;
              }
            }, Fr.getOID = function(t8, e2, r3) {
              null == r3 && (r3 = null);
              try {
                return "06" != t8.substr(e2, 2) ? r3 : function n2(t9) {
                  if (!Xr2(t9))
                    return null;
                  try {
                    var e3 = [], r4 = t9.substr(0, 2), n3 = parseInt(r4, 16);
                    e3[0] = new String(Math.floor(n3 / 40)), e3[1] = new String(n3 % 40);
                    for (var i2 = t9.substr(2), o2 = [], s2 = 0; s2 < i2.length / 2; s2++)
                      o2.push(parseInt(i2.substr(2 * s2, 2), 16));
                    var a2 = [], u2 = "";
                    for (s2 = 0; s2 < o2.length; s2++)
                      128 & o2[s2] ? u2 += Qr((127 & o2[s2]).toString(2), 7) : (u2 += Qr((127 & o2[s2]).toString(2), 7), a2.push(new String(parseInt(u2, 2))), u2 = "");
                    var c2 = e3.join(".");
                    return a2.length > 0 && (c2 = c2 + "." + a2.join(".")), c2;
                  } catch (t10) {
                    return null;
                  }
                }(Fr.getV(t8, e2));
              } catch (t9) {
                return r3;
              }
            }, Fr.getOIDName = function(t8, e2, r3) {
              null == r3 && (r3 = null);
              try {
                var n2 = Fr.getOID(t8, e2, r3);
                if (n2 == r3)
                  return r3;
                var i2 = Sr.asn1.x509.OID.oid2name(n2);
                return "" == i2 ? n2 : i2;
              } catch (t9) {
                return r3;
              }
            }, Fr.getString = function(t8, e2, r3) {
              null == r3 && (r3 = null);
              try {
                return Lr(Fr.getV(t8, e2));
              } catch (t9) {
                return r3;
              }
            }, Fr.hextooidstr = function(t8) {
              var e2 = function t9(e3, r4) {
                return e3.length >= r4 ? e3 : new Array(r4 - e3.length + 1).join("0") + e3;
              }, r3 = [], n2 = t8.substr(0, 2), i2 = parseInt(n2, 16);
              r3[0] = new String(Math.floor(i2 / 40)), r3[1] = new String(i2 % 40);
              for (var o2 = t8.substr(2), s2 = [], a2 = 0; a2 < o2.length / 2; a2++)
                s2.push(parseInt(o2.substr(2 * a2, 2), 16));
              var u2 = [], c2 = "";
              for (a2 = 0; a2 < s2.length; a2++)
                128 & s2[a2] ? c2 += e2((127 & s2[a2]).toString(2), 7) : (c2 += e2((127 & s2[a2]).toString(2), 7), u2.push(new String(parseInt(c2, 2))), c2 = "");
              var h2 = r3.join(".");
              return u2.length > 0 && (h2 = h2 + "." + u2.join(".")), h2;
            }, Fr.dump = function(t8, e2, r3, n2) {
              var i2 = Fr, o2 = i2.getV, s2 = i2.dump, a2 = i2.getChildIdx, u2 = t8;
              t8 instanceof Sr.asn1.ASN1Object && (u2 = t8.getEncodedHex());
              var c2 = function t9(e3, r4) {
                return e3.length <= 2 * r4 ? e3 : e3.substr(0, r4) + "..(total " + e3.length / 2 + "bytes).." + e3.substr(e3.length - r4, r4);
              };
              void 0 === e2 && (e2 = { ommit_long_octet: 32 }), void 0 === r3 && (r3 = 0), void 0 === n2 && (n2 = "");
              var h2, l2 = e2.ommit_long_octet;
              if ("01" == (h2 = u2.substr(r3, 2)))
                return "00" == (f2 = o2(u2, r3)) ? n2 + "BOOLEAN FALSE\n" : n2 + "BOOLEAN TRUE\n";
              if ("02" == h2)
                return n2 + "INTEGER " + c2(f2 = o2(u2, r3), l2) + "\n";
              if ("03" == h2) {
                var f2 = o2(u2, r3);
                if (i2.isASN1HEX(f2.substr(2))) {
                  var g2 = n2 + "BITSTRING, encapsulates\n";
                  return g2 += s2(f2.substr(2), e2, 0, n2 + "  ");
                }
                return n2 + "BITSTRING " + c2(f2, l2) + "\n";
              }
              if ("04" == h2) {
                f2 = o2(u2, r3);
                if (i2.isASN1HEX(f2)) {
                  g2 = n2 + "OCTETSTRING, encapsulates\n";
                  return g2 += s2(f2, e2, 0, n2 + "  ");
                }
                return n2 + "OCTETSTRING " + c2(f2, l2) + "\n";
              }
              if ("05" == h2)
                return n2 + "NULL\n";
              if ("06" == h2) {
                var d2 = o2(u2, r3), p2 = Sr.asn1.ASN1Util.oidHexToInt(d2), v3 = Sr.asn1.x509.OID.oid2name(p2), y2 = p2.replace(/\./g, " ");
                return "" != v3 ? n2 + "ObjectIdentifier " + v3 + " (" + y2 + ")\n" : n2 + "ObjectIdentifier (" + y2 + ")\n";
              }
              if ("0a" == h2)
                return n2 + "ENUMERATED " + parseInt(o2(u2, r3)) + "\n";
              if ("0c" == h2)
                return n2 + "UTF8String '" + Dr(o2(u2, r3)) + "'\n";
              if ("13" == h2)
                return n2 + "PrintableString '" + Dr(o2(u2, r3)) + "'\n";
              if ("14" == h2)
                return n2 + "TeletexString '" + Dr(o2(u2, r3)) + "'\n";
              if ("16" == h2)
                return n2 + "IA5String '" + Dr(o2(u2, r3)) + "'\n";
              if ("17" == h2)
                return n2 + "UTCTime " + Dr(o2(u2, r3)) + "\n";
              if ("18" == h2)
                return n2 + "GeneralizedTime " + Dr(o2(u2, r3)) + "\n";
              if ("1a" == h2)
                return n2 + "VisualString '" + Dr(o2(u2, r3)) + "'\n";
              if ("1e" == h2)
                return n2 + "BMPString '" + Yr2(o2(u2, r3)) + "'\n";
              if ("30" == h2) {
                if ("3000" == u2.substr(r3, 4))
                  return n2 + "SEQUENCE {}\n";
                g2 = n2 + "SEQUENCE\n";
                var m2 = e2;
                if ((2 == (b2 = a2(u2, r3)).length || 3 == b2.length) && "06" == u2.substr(b2[0], 2) && "04" == u2.substr(b2[b2.length - 1], 2)) {
                  v3 = i2.oidname(o2(u2, b2[0]));
                  var _2 = JSON.parse(JSON.stringify(e2));
                  _2.x509ExtName = v3, m2 = _2;
                }
                for (var S2 = 0; S2 < b2.length; S2++)
                  g2 += s2(u2, m2, b2[S2], n2 + "  ");
                return g2;
              }
              if ("31" == h2) {
                g2 = n2 + "SET\n";
                var b2 = a2(u2, r3);
                for (S2 = 0; S2 < b2.length; S2++)
                  g2 += s2(u2, e2, b2[S2], n2 + "  ");
                return g2;
              }
              if (0 != (128 & (h2 = parseInt(h2, 16)))) {
                var w2 = 31 & h2;
                if (0 != (32 & h2)) {
                  for (g2 = n2 + "[" + w2 + "]\n", b2 = a2(u2, r3), S2 = 0; S2 < b2.length; S2++)
                    g2 += s2(u2, e2, b2[S2], n2 + "  ");
                  return g2;
                }
                f2 = o2(u2, r3);
                if (Fr.isASN1HEX(f2)) {
                  var g2 = n2 + "[" + w2 + "]\n";
                  return g2 += s2(f2, e2, 0, n2 + "  ");
                }
                return ("68747470" == f2.substr(0, 8) || "subjectAltName" === e2.x509ExtName && 2 == w2) && (f2 = Dr(f2)), g2 = n2 + "[" + w2 + "] " + f2 + "\n";
              }
              return n2 + "UNKNOWN(" + h2 + ") " + o2(u2, r3) + "\n";
            }, Fr.isContextTag = function(t8, e2) {
              var r3, n2;
              t8 = t8.toLowerCase();
              try {
                r3 = parseInt(t8, 16);
              } catch (t9) {
                return -1;
              }
              if (void 0 === e2)
                return 128 == (192 & r3);
              try {
                return null != e2.match(/^\[[0-9]+\]$/) && (!((n2 = parseInt(e2.substr(1, e2.length - 1), 10)) > 31) && (128 == (192 & r3) && (31 & r3) == n2));
              } catch (t9) {
                return false;
              }
            }, Fr.isASN1HEX = function(t8) {
              var e2 = Fr;
              if (t8.length % 2 == 1)
                return false;
              var r3 = e2.getVblen(t8, 0), n2 = t8.substr(0, 2), i2 = e2.getL(t8, 0);
              return t8.length - n2.length - i2.length == 2 * r3;
            }, Fr.checkStrictDER = function(t8, e2, r3, n2, i2) {
              var o2 = Fr;
              if (void 0 === r3) {
                if ("string" != typeof t8)
                  throw new Error("not hex string");
                if (t8 = t8.toLowerCase(), !Sr.lang.String.isHex(t8))
                  throw new Error("not hex string");
                r3 = t8.length, i2 = (n2 = t8.length / 2) < 128 ? 1 : Math.ceil(n2.toString(16)) + 1;
              }
              if (o2.getL(t8, e2).length > 2 * i2)
                throw new Error("L of TLV too long: idx=" + e2);
              var s2 = o2.getVblen(t8, e2);
              if (s2 > n2)
                throw new Error("value of L too long than hex: idx=" + e2);
              var a2 = o2.getTLV(t8, e2), u2 = a2.length - 2 - o2.getL(t8, e2).length;
              if (u2 !== 2 * s2)
                throw new Error("V string length and L's value not the same:" + u2 + "/" + 2 * s2);
              if (0 === e2 && t8.length != a2.length)
                throw new Error("total length and TLV length unmatch:" + t8.length + "!=" + a2.length);
              var c2 = t8.substr(e2, 2);
              if ("02" === c2) {
                var h2 = o2.getVidx(t8, e2);
                if ("00" == t8.substr(h2, 2) && t8.charCodeAt(h2 + 2) < 56)
                  throw new Error("not least zeros for DER INTEGER");
              }
              if (32 & parseInt(c2, 16)) {
                for (var l2 = o2.getVblen(t8, e2), f2 = 0, g2 = o2.getChildIdx(t8, e2), d2 = 0; d2 < g2.length; d2++) {
                  f2 += o2.getTLV(t8, g2[d2]).length, o2.checkStrictDER(t8, g2[d2], r3, n2, i2);
                }
                if (2 * l2 != f2)
                  throw new Error("sum of children's TLV length and L unmatch: " + 2 * l2 + "!=" + f2);
              }
            }, Fr.oidname = function(t8) {
              var e2 = Sr.asn1;
              Sr.lang.String.isHex(t8) && (t8 = e2.ASN1Util.oidHexToInt(t8));
              var r3 = e2.x509.OID.oid2name(t8);
              return "" === r3 && (r3 = t8), r3;
            }, void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.lang && Sr.lang || (Sr.lang = {}), Sr.lang.String = function() {
            }, "function" == typeof t7 ? (e.utf8tob64u = br = function e2(r3) {
              return Pr(t7.from(r3, "utf8").toString("base64"));
            }, e.b64utoutf8 = wr = function e2(r3) {
              return t7.from(Cr(r3), "base64").toString("utf8");
            }) : (e.utf8tob64u = br = function t8(e2) {
              return Tr(Kr2(Gr2(e2)));
            }, e.b64utoutf8 = wr = function t8(e2) {
              return decodeURIComponent(qr(Rr(e2)));
            }), Sr.lang.String.isInteger = function(t8) {
              return !!t8.match(/^[0-9]+$/) || !!t8.match(/^-[0-9]+$/);
            }, Sr.lang.String.isHex = function(t8) {
              return Xr2(t8);
            }, Sr.lang.String.isBase64 = function(t8) {
              return !(!(t8 = t8.replace(/\s+/g, "")).match(/^[0-9A-Za-z+\/]+={0,3}$/) || t8.length % 4 != 0);
            }, Sr.lang.String.isBase64URL = function(t8) {
              return !t8.match(/[+/=]/) && (t8 = Cr(t8), Sr.lang.String.isBase64(t8));
            }, Sr.lang.String.isIntegerArray = function(t8) {
              return !!(t8 = t8.replace(/\s+/g, "")).match(/^\[[0-9,]+\]$/);
            }, Sr.lang.String.isPrintable = function(t8) {
              return null !== t8.match(/^[0-9A-Za-z '()+,-./:=?]*$/);
            }, Sr.lang.String.isIA5 = function(t8) {
              return null !== t8.match(/^[\x20-\x21\x23-\x7f]*$/);
            }, Sr.lang.String.isMail = function(t8) {
              return null !== t8.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
            };
            var Qr = function t8(e2, r3, n2) {
              return null == n2 && (n2 = "0"), e2.length >= r3 ? e2 : new Array(r3 - e2.length + 1).join(n2) + e2;
            };
            function Zr2(t8, e2) {
              var r3 = function t9() {
              };
              r3.prototype = e2.prototype, t8.prototype = new r3(), t8.prototype.constructor = t8, t8.superclass = e2.prototype, e2.prototype.constructor == Object.prototype.constructor && (e2.prototype.constructor = e2);
            }
            void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.crypto && Sr.crypto || (Sr.crypto = {}), Sr.crypto.Util = new function() {
              this.DIGESTINFOHEAD = { sha1: "3021300906052b0e03021a05000414", sha224: "302d300d06096086480165030402040500041c", sha256: "3031300d060960864801650304020105000420", sha384: "3041300d060960864801650304020205000430", sha512: "3051300d060960864801650304020305000440", md2: "3020300c06082a864886f70d020205000410", md5: "3020300c06082a864886f70d020505000410", ripemd160: "3021300906052b2403020105000414" }, this.DEFAULTPROVIDER = { md5: "cryptojs", sha1: "cryptojs", sha224: "cryptojs", sha256: "cryptojs", sha384: "cryptojs", sha512: "cryptojs", ripemd160: "cryptojs", hmacmd5: "cryptojs", hmacsha1: "cryptojs", hmacsha224: "cryptojs", hmacsha256: "cryptojs", hmacsha384: "cryptojs", hmacsha512: "cryptojs", hmacripemd160: "cryptojs", MD5withRSA: "cryptojs/jsrsa", SHA1withRSA: "cryptojs/jsrsa", SHA224withRSA: "cryptojs/jsrsa", SHA256withRSA: "cryptojs/jsrsa", SHA384withRSA: "cryptojs/jsrsa", SHA512withRSA: "cryptojs/jsrsa", RIPEMD160withRSA: "cryptojs/jsrsa", MD5withECDSA: "cryptojs/jsrsa", SHA1withECDSA: "cryptojs/jsrsa", SHA224withECDSA: "cryptojs/jsrsa", SHA256withECDSA: "cryptojs/jsrsa", SHA384withECDSA: "cryptojs/jsrsa", SHA512withECDSA: "cryptojs/jsrsa", RIPEMD160withECDSA: "cryptojs/jsrsa", SHA1withDSA: "cryptojs/jsrsa", SHA224withDSA: "cryptojs/jsrsa", SHA256withDSA: "cryptojs/jsrsa", MD5withRSAandMGF1: "cryptojs/jsrsa", SHAwithRSAandMGF1: "cryptojs/jsrsa", SHA1withRSAandMGF1: "cryptojs/jsrsa", SHA224withRSAandMGF1: "cryptojs/jsrsa", SHA256withRSAandMGF1: "cryptojs/jsrsa", SHA384withRSAandMGF1: "cryptojs/jsrsa", SHA512withRSAandMGF1: "cryptojs/jsrsa", RIPEMD160withRSAandMGF1: "cryptojs/jsrsa" }, this.CRYPTOJSMESSAGEDIGESTNAME = { md5: v2.algo.MD5, sha1: v2.algo.SHA1, sha224: v2.algo.SHA224, sha256: v2.algo.SHA256, sha384: v2.algo.SHA384, sha512: v2.algo.SHA512, ripemd160: v2.algo.RIPEMD160 }, this.getDigestInfoHex = function(t8, e2) {
                if (void 0 === this.DIGESTINFOHEAD[e2])
                  throw "alg not supported in Util.DIGESTINFOHEAD: " + e2;
                return this.DIGESTINFOHEAD[e2] + t8;
              }, this.getPaddedDigestInfoHex = function(t8, e2, r3) {
                var n2 = this.getDigestInfoHex(t8, e2), i2 = r3 / 4;
                if (n2.length + 22 > i2)
                  throw "key is too short for SigAlg: keylen=" + r3 + "," + e2;
                for (var o2 = "0001", s2 = "00" + n2, a2 = "", u2 = i2 - o2.length - s2.length, c2 = 0; c2 < u2; c2 += 2)
                  a2 += "ff";
                return o2 + a2 + s2;
              }, this.hashString = function(t8, e2) {
                return new Sr.crypto.MessageDigest({ alg: e2 }).digestString(t8);
              }, this.hashHex = function(t8, e2) {
                return new Sr.crypto.MessageDigest({ alg: e2 }).digestHex(t8);
              }, this.sha1 = function(t8) {
                return this.hashString(t8, "sha1");
              }, this.sha256 = function(t8) {
                return this.hashString(t8, "sha256");
              }, this.sha256Hex = function(t8) {
                return this.hashHex(t8, "sha256");
              }, this.sha512 = function(t8) {
                return this.hashString(t8, "sha512");
              }, this.sha512Hex = function(t8) {
                return this.hashHex(t8, "sha512");
              }, this.isKey = function(t8) {
                return t8 instanceof Me || t8 instanceof Sr.crypto.DSA || t8 instanceof Sr.crypto.ECDSA;
              };
            }(), Sr.crypto.Util.md5 = function(t8) {
              return new Sr.crypto.MessageDigest({ alg: "md5", prov: "cryptojs" }).digestString(t8);
            }, Sr.crypto.Util.ripemd160 = function(t8) {
              return new Sr.crypto.MessageDigest({ alg: "ripemd160", prov: "cryptojs" }).digestString(t8);
            }, Sr.crypto.Util.SECURERANDOMGEN = new Be2(), Sr.crypto.Util.getRandomHexOfNbytes = function(t8) {
              var e2 = new Array(t8);
              return Sr.crypto.Util.SECURERANDOMGEN.nextBytes(e2), Ar(e2);
            }, Sr.crypto.Util.getRandomBigIntegerOfNbytes = function(t8) {
              return new w(Sr.crypto.Util.getRandomHexOfNbytes(t8), 16);
            }, Sr.crypto.Util.getRandomHexOfNbits = function(t8) {
              var e2 = t8 % 8, r3 = new Array((t8 - e2) / 8 + 1);
              return Sr.crypto.Util.SECURERANDOMGEN.nextBytes(r3), r3[0] = (255 << e2 & 255 ^ 255) & r3[0], Ar(r3);
            }, Sr.crypto.Util.getRandomBigIntegerOfNbits = function(t8) {
              return new w(Sr.crypto.Util.getRandomHexOfNbits(t8), 16);
            }, Sr.crypto.Util.getRandomBigIntegerZeroToMax = function(t8) {
              for (var e2 = t8.bitLength(); ; ) {
                var r3 = Sr.crypto.Util.getRandomBigIntegerOfNbits(e2);
                if (-1 != t8.compareTo(r3))
                  return r3;
              }
            }, Sr.crypto.Util.getRandomBigIntegerMinToMax = function(t8, e2) {
              var r3 = t8.compareTo(e2);
              if (1 == r3)
                throw "biMin is greater than biMax";
              if (0 == r3)
                return t8;
              var n2 = e2.subtract(t8);
              return Sr.crypto.Util.getRandomBigIntegerZeroToMax(n2).add(t8);
            }, Sr.crypto.MessageDigest = function(t8) {
              this.setAlgAndProvider = function(t9, e2) {
                if (null !== (t9 = Sr.crypto.MessageDigest.getCanonicalAlgName(t9)) && void 0 === e2 && (e2 = Sr.crypto.Util.DEFAULTPROVIDER[t9]), -1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(t9) && "cryptojs" == e2) {
                  try {
                    this.md = Sr.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[t9].create();
                  } catch (e3) {
                    throw "setAlgAndProvider hash alg set fail alg=" + t9 + "/" + e3;
                  }
                  this.updateString = function(t10) {
                    this.md.update(t10);
                  }, this.updateHex = function(t10) {
                    var e3 = v2.enc.Hex.parse(t10);
                    this.md.update(e3);
                  }, this.digest = function() {
                    return this.md.finalize().toString(v2.enc.Hex);
                  }, this.digestString = function(t10) {
                    return this.updateString(t10), this.digest();
                  }, this.digestHex = function(t10) {
                    return this.updateHex(t10), this.digest();
                  };
                }
                if (-1 != ":sha256:".indexOf(t9) && "sjcl" == e2) {
                  try {
                    this.md = new sjcl.hash.sha256();
                  } catch (e3) {
                    throw "setAlgAndProvider hash alg set fail alg=" + t9 + "/" + e3;
                  }
                  this.updateString = function(t10) {
                    this.md.update(t10);
                  }, this.updateHex = function(t10) {
                    var e3 = sjcl.codec.hex.toBits(t10);
                    this.md.update(e3);
                  }, this.digest = function() {
                    var t10 = this.md.finalize();
                    return sjcl.codec.hex.fromBits(t10);
                  }, this.digestString = function(t10) {
                    return this.updateString(t10), this.digest();
                  }, this.digestHex = function(t10) {
                    return this.updateHex(t10), this.digest();
                  };
                }
              }, this.updateString = function(t9) {
                throw "updateString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
              }, this.updateHex = function(t9) {
                throw "updateHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
              }, this.digest = function() {
                throw "digest() not supported for this alg/prov: " + this.algName + "/" + this.provName;
              }, this.digestString = function(t9) {
                throw "digestString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
              }, this.digestHex = function(t9) {
                throw "digestHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
              }, void 0 !== t8 && void 0 !== t8.alg && (this.algName = t8.alg, void 0 === t8.prov && (this.provName = Sr.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName));
            }, Sr.crypto.MessageDigest.getCanonicalAlgName = function(t8) {
              return "string" == typeof t8 && (t8 = (t8 = t8.toLowerCase()).replace(/-/, "")), t8;
            }, Sr.crypto.MessageDigest.getHashLength = function(t8) {
              var e2 = Sr.crypto.MessageDigest, r3 = e2.getCanonicalAlgName(t8);
              if (void 0 === e2.HASHLENGTH[r3])
                throw "not supported algorithm: " + t8;
              return e2.HASHLENGTH[r3];
            }, Sr.crypto.MessageDigest.HASHLENGTH = { md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, ripemd160: 20 }, Sr.crypto.Mac = function(t8) {
              this.setAlgAndProvider = function(t9, e2) {
                if (null == (t9 = t9.toLowerCase()) && (t9 = "hmacsha1"), "hmac" != (t9 = t9.toLowerCase()).substr(0, 4))
                  throw "setAlgAndProvider unsupported HMAC alg: " + t9;
                void 0 === e2 && (e2 = Sr.crypto.Util.DEFAULTPROVIDER[t9]), this.algProv = t9 + "/" + e2;
                var r3 = t9.substr(4);
                if (-1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(r3) && "cryptojs" == e2) {
                  try {
                    var n2 = Sr.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[r3];
                    this.mac = v2.algo.HMAC.create(n2, this.pass);
                  } catch (t10) {
                    throw "setAlgAndProvider hash alg set fail hashAlg=" + r3 + "/" + t10;
                  }
                  this.updateString = function(t10) {
                    this.mac.update(t10);
                  }, this.updateHex = function(t10) {
                    var e3 = v2.enc.Hex.parse(t10);
                    this.mac.update(e3);
                  }, this.doFinal = function() {
                    return this.mac.finalize().toString(v2.enc.Hex);
                  }, this.doFinalString = function(t10) {
                    return this.updateString(t10), this.doFinal();
                  }, this.doFinalHex = function(t10) {
                    return this.updateHex(t10), this.doFinal();
                  };
                }
              }, this.updateString = function(t9) {
                throw "updateString(str) not supported for this alg/prov: " + this.algProv;
              }, this.updateHex = function(t9) {
                throw "updateHex(hex) not supported for this alg/prov: " + this.algProv;
              }, this.doFinal = function() {
                throw "digest() not supported for this alg/prov: " + this.algProv;
              }, this.doFinalString = function(t9) {
                throw "digestString(str) not supported for this alg/prov: " + this.algProv;
              }, this.doFinalHex = function(t9) {
                throw "digestHex(hex) not supported for this alg/prov: " + this.algProv;
              }, this.setPassword = function(t9) {
                if ("string" == typeof t9) {
                  var e2 = t9;
                  return t9.length % 2 != 1 && t9.match(/^[0-9A-Fa-f]+$/) || (e2 = Nr(t9)), void (this.pass = v2.enc.Hex.parse(e2));
                }
                if ("object" != (void 0 === t9 ? "undefined" : g(t9)))
                  throw "KJUR.crypto.Mac unsupported password type: " + t9;
                e2 = null;
                if (void 0 !== t9.hex) {
                  if (t9.hex.length % 2 != 0 || !t9.hex.match(/^[0-9A-Fa-f]+$/))
                    throw "Mac: wrong hex password: " + t9.hex;
                  e2 = t9.hex;
                }
                if (void 0 !== t9.utf8 && (e2 = Ir(t9.utf8)), void 0 !== t9.rstr && (e2 = Nr(t9.rstr)), void 0 !== t9.b64 && (e2 = S(t9.b64)), void 0 !== t9.b64u && (e2 = Rr(t9.b64u)), null == e2)
                  throw "KJUR.crypto.Mac unsupported password type: " + t9;
                this.pass = v2.enc.Hex.parse(e2);
              }, void 0 !== t8 && (void 0 !== t8.pass && this.setPassword(t8.pass), void 0 !== t8.alg && (this.algName = t8.alg, void 0 === t8.prov && (this.provName = Sr.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName)));
            }, Sr.crypto.Signature = function(t8) {
              var e2 = null;
              if (this._setAlgNames = function() {
                var t9 = this.algName.match(/^(.+)with(.+)$/);
                t9 && (this.mdAlgName = t9[1].toLowerCase(), this.pubkeyAlgName = t9[2].toLowerCase(), "rsaandmgf1" == this.pubkeyAlgName && "sha" == this.mdAlgName && (this.mdAlgName = "sha1"));
              }, this._zeroPaddingOfSignature = function(t9, e3) {
                for (var r3 = "", n2 = e3 / 4 - t9.length, i2 = 0; i2 < n2; i2++)
                  r3 += "0";
                return r3 + t9;
              }, this.setAlgAndProvider = function(t9, e3) {
                if (this._setAlgNames(), "cryptojs/jsrsa" != e3)
                  throw new Error("provider not supported: " + e3);
                if (-1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)) {
                  try {
                    this.md = new Sr.crypto.MessageDigest({ alg: this.mdAlgName });
                  } catch (t10) {
                    throw new Error("setAlgAndProvider hash alg set fail alg=" + this.mdAlgName + "/" + t10);
                  }
                  this.init = function(t10, e4) {
                    var r3 = null;
                    try {
                      r3 = void 0 === e4 ? tn2.getKey(t10) : tn2.getKey(t10, e4);
                    } catch (t11) {
                      throw "init failed:" + t11;
                    }
                    if (true === r3.isPrivate)
                      this.prvKey = r3, this.state = "SIGN";
                    else {
                      if (true !== r3.isPublic)
                        throw "init failed.:" + r3;
                      this.pubKey = r3, this.state = "VERIFY";
                    }
                  }, this.updateString = function(t10) {
                    this.md.updateString(t10);
                  }, this.updateHex = function(t10) {
                    this.md.updateHex(t10);
                  }, this.sign = function() {
                    if (this.sHashHex = this.md.digest(), void 0 === this.prvKey && void 0 !== this.ecprvhex && void 0 !== this.eccurvename && void 0 !== Sr.crypto.ECDSA && (this.prvKey = new Sr.crypto.ECDSA({ curve: this.eccurvename, prv: this.ecprvhex })), this.prvKey instanceof Me && "rsaandmgf1" === this.pubkeyAlgName)
                      this.hSign = this.prvKey.signWithMessageHashPSS(this.sHashHex, this.mdAlgName, this.pssSaltLen);
                    else if (this.prvKey instanceof Me && "rsa" === this.pubkeyAlgName)
                      this.hSign = this.prvKey.signWithMessageHash(this.sHashHex, this.mdAlgName);
                    else if (this.prvKey instanceof Sr.crypto.ECDSA)
                      this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                    else {
                      if (!(this.prvKey instanceof Sr.crypto.DSA))
                        throw "Signature: unsupported private key alg: " + this.pubkeyAlgName;
                      this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                    }
                    return this.hSign;
                  }, this.signString = function(t10) {
                    return this.updateString(t10), this.sign();
                  }, this.signHex = function(t10) {
                    return this.updateHex(t10), this.sign();
                  }, this.verify = function(t10) {
                    if (this.sHashHex = this.md.digest(), void 0 === this.pubKey && void 0 !== this.ecpubhex && void 0 !== this.eccurvename && void 0 !== Sr.crypto.ECDSA && (this.pubKey = new Sr.crypto.ECDSA({ curve: this.eccurvename, pub: this.ecpubhex })), this.pubKey instanceof Me && "rsaandmgf1" === this.pubkeyAlgName)
                      return this.pubKey.verifyWithMessageHashPSS(this.sHashHex, t10, this.mdAlgName, this.pssSaltLen);
                    if (this.pubKey instanceof Me && "rsa" === this.pubkeyAlgName)
                      return this.pubKey.verifyWithMessageHash(this.sHashHex, t10);
                    if (void 0 !== Sr.crypto.ECDSA && this.pubKey instanceof Sr.crypto.ECDSA)
                      return this.pubKey.verifyWithMessageHash(this.sHashHex, t10);
                    if (void 0 !== Sr.crypto.DSA && this.pubKey instanceof Sr.crypto.DSA)
                      return this.pubKey.verifyWithMessageHash(this.sHashHex, t10);
                    throw "Signature: unsupported public key alg: " + this.pubkeyAlgName;
                  };
                }
              }, this.init = function(t9, e3) {
                throw "init(key, pass) not supported for this alg:prov=" + this.algProvName;
              }, this.updateString = function(t9) {
                throw "updateString(str) not supported for this alg:prov=" + this.algProvName;
              }, this.updateHex = function(t9) {
                throw "updateHex(hex) not supported for this alg:prov=" + this.algProvName;
              }, this.sign = function() {
                throw "sign() not supported for this alg:prov=" + this.algProvName;
              }, this.signString = function(t9) {
                throw "digestString(str) not supported for this alg:prov=" + this.algProvName;
              }, this.signHex = function(t9) {
                throw "digestHex(hex) not supported for this alg:prov=" + this.algProvName;
              }, this.verify = function(t9) {
                throw "verify(hSigVal) not supported for this alg:prov=" + this.algProvName;
              }, this.initParams = t8, void 0 !== t8 && (void 0 !== t8.alg && (this.algName = t8.alg, void 0 === t8.prov ? this.provName = Sr.crypto.Util.DEFAULTPROVIDER[this.algName] : this.provName = t8.prov, this.algProvName = this.algName + ":" + this.provName, this.setAlgAndProvider(this.algName, this.provName), this._setAlgNames()), void 0 !== t8.psssaltlen && (this.pssSaltLen = t8.psssaltlen), void 0 !== t8.prvkeypem)) {
                if (void 0 !== t8.prvkeypas)
                  throw "both prvkeypem and prvkeypas parameters not supported";
                try {
                  e2 = tn2.getKey(t8.prvkeypem);
                  this.init(e2);
                } catch (t9) {
                  throw "fatal error to load pem private key: " + t9;
                }
              }
            }, Sr.crypto.Cipher = function(t8) {
            }, Sr.crypto.Cipher.encrypt = function(t8, e2, r3) {
              if (e2 instanceof Me && e2.isPublic) {
                var n2 = Sr.crypto.Cipher.getAlgByKeyAndName(e2, r3);
                if ("RSA" === n2)
                  return e2.encrypt(t8);
                if ("RSAOAEP" === n2)
                  return e2.encryptOAEP(t8, "sha1");
                var i2 = n2.match(/^RSAOAEP(\d+)$/);
                if (null !== i2)
                  return e2.encryptOAEP(t8, "sha" + i2[1]);
                throw "Cipher.encrypt: unsupported algorithm for RSAKey: " + r3;
              }
              throw "Cipher.encrypt: unsupported key or algorithm";
            }, Sr.crypto.Cipher.decrypt = function(t8, e2, r3) {
              if (e2 instanceof Me && e2.isPrivate) {
                var n2 = Sr.crypto.Cipher.getAlgByKeyAndName(e2, r3);
                if ("RSA" === n2)
                  return e2.decrypt(t8);
                if ("RSAOAEP" === n2)
                  return e2.decryptOAEP(t8, "sha1");
                var i2 = n2.match(/^RSAOAEP(\d+)$/);
                if (null !== i2)
                  return e2.decryptOAEP(t8, "sha" + i2[1]);
                throw "Cipher.decrypt: unsupported algorithm for RSAKey: " + r3;
              }
              throw "Cipher.decrypt: unsupported key or algorithm";
            }, Sr.crypto.Cipher.getAlgByKeyAndName = function(t8, e2) {
              if (t8 instanceof Me) {
                if (-1 != ":RSA:RSAOAEP:RSAOAEP224:RSAOAEP256:RSAOAEP384:RSAOAEP512:".indexOf(e2))
                  return e2;
                if (null == e2)
                  return "RSA";
                throw "getAlgByKeyAndName: not supported algorithm name for RSAKey: " + e2;
              }
              throw "getAlgByKeyAndName: not supported algorithm name: " + e2;
            }, Sr.crypto.OID = new function() {
              this.oidhex2name = { "2a864886f70d010101": "rsaEncryption", "2a8648ce3d0201": "ecPublicKey", "2a8648ce380401": "dsa", "2a8648ce3d030107": "secp256r1", "2b8104001f": "secp192k1", "2b81040021": "secp224r1", "2b8104000a": "secp256k1", "2b81040023": "secp521r1", "2b81040022": "secp384r1", "2a8648ce380403": "SHA1withDSA", "608648016503040301": "SHA224withDSA", "608648016503040302": "SHA256withDSA" };
            }(), void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.crypto && Sr.crypto || (Sr.crypto = {}), Sr.crypto.ECDSA = function(t8) {
              var e2 = Error, r3 = w, n2 = Ve, i2 = Sr.crypto.ECDSA, o2 = Sr.crypto.ECParameterDB, s2 = i2.getName, a2 = Fr, u2 = a2.getVbyListEx, c2 = a2.isASN1HEX, h2 = new Be2();
              this.type = "EC", this.isPrivate = false, this.isPublic = false, this.getBigRandom = function(t9) {
                return new r3(t9.bitLength(), h2).mod(t9.subtract(r3.ONE)).add(r3.ONE);
              }, this.setNamedCurve = function(t9) {
                this.ecparams = o2.getByName(t9), this.prvKeyHex = null, this.pubKeyHex = null, this.curveName = t9;
              }, this.setPrivateKeyHex = function(t9) {
                this.isPrivate = true, this.prvKeyHex = t9;
              }, this.setPublicKeyHex = function(t9) {
                this.isPublic = true, this.pubKeyHex = t9;
              }, this.getPublicKeyXYHex = function() {
                var t9 = this.pubKeyHex;
                if ("04" !== t9.substr(0, 2))
                  throw "this method supports uncompressed format(04) only";
                var e3 = this.ecparams.keylen / 4;
                if (t9.length !== 2 + 2 * e3)
                  throw "malformed public key hex length";
                var r4 = {};
                return r4.x = t9.substr(2, e3), r4.y = t9.substr(2 + e3), r4;
              }, this.getShortNISTPCurveName = function() {
                var t9 = this.curveName;
                return "secp256r1" === t9 || "NIST P-256" === t9 || "P-256" === t9 || "prime256v1" === t9 ? "P-256" : "secp384r1" === t9 || "NIST P-384" === t9 || "P-384" === t9 ? "P-384" : null;
              }, this.generateKeyPairHex = function() {
                var t9 = this.ecparams.n, e3 = this.getBigRandom(t9), r4 = this.ecparams.G.multiply(e3), n3 = r4.getX().toBigInteger(), i3 = r4.getY().toBigInteger(), o3 = this.ecparams.keylen / 4, s3 = ("0000000000" + e3.toString(16)).slice(-o3), a3 = "04" + ("0000000000" + n3.toString(16)).slice(-o3) + ("0000000000" + i3.toString(16)).slice(-o3);
                return this.setPrivateKeyHex(s3), this.setPublicKeyHex(a3), { ecprvhex: s3, ecpubhex: a3 };
              }, this.signWithMessageHash = function(t9) {
                return this.signHex(t9, this.prvKeyHex);
              }, this.signHex = function(t9, e3) {
                var n3 = new r3(e3, 16), o3 = this.ecparams.n, s3 = new r3(t9.substring(0, this.ecparams.keylen / 4), 16);
                do {
                  var a3 = this.getBigRandom(o3), u3 = this.ecparams.G.multiply(a3).getX().toBigInteger().mod(o3);
                } while (u3.compareTo(r3.ZERO) <= 0);
                var c3 = a3.modInverse(o3).multiply(s3.add(n3.multiply(u3))).mod(o3);
                return i2.biRSSigToASN1Sig(u3, c3);
              }, this.sign = function(t9, e3) {
                var n3 = e3, i3 = this.ecparams.n, o3 = r3.fromByteArrayUnsigned(t9);
                do {
                  var s3 = this.getBigRandom(i3), a3 = this.ecparams.G.multiply(s3).getX().toBigInteger().mod(i3);
                } while (a3.compareTo(w.ZERO) <= 0);
                var u3 = s3.modInverse(i3).multiply(o3.add(n3.multiply(a3))).mod(i3);
                return this.serializeSig(a3, u3);
              }, this.verifyWithMessageHash = function(t9, e3) {
                return this.verifyHex(t9, e3, this.pubKeyHex);
              }, this.verifyHex = function(t9, e3, o3) {
                try {
                  var s3, a3, u3 = i2.parseSigHex(e3);
                  s3 = u3.r, a3 = u3.s;
                  var c3 = n2.decodeFromHex(this.ecparams.curve, o3), h3 = new r3(t9.substring(0, this.ecparams.keylen / 4), 16);
                  return this.verifyRaw(h3, s3, a3, c3);
                } catch (t10) {
                  return false;
                }
              }, this.verify = function(t9, e3, i3) {
                var o3, s3, a3;
                if (Bitcoin.Util.isArray(e3)) {
                  var u3 = this.parseSig(e3);
                  o3 = u3.r, s3 = u3.s;
                } else {
                  if ("object" !== (void 0 === e3 ? "undefined" : g(e3)) || !e3.r || !e3.s)
                    throw "Invalid value for signature";
                  o3 = e3.r, s3 = e3.s;
                }
                if (i3 instanceof Ve)
                  a3 = i3;
                else {
                  if (!Bitcoin.Util.isArray(i3))
                    throw "Invalid format for pubkey value, must be byte array or ECPointFp";
                  a3 = n2.decodeFrom(this.ecparams.curve, i3);
                }
                var c3 = r3.fromByteArrayUnsigned(t9);
                return this.verifyRaw(c3, o3, s3, a3);
              }, this.verifyRaw = function(t9, e3, n3, i3) {
                var o3 = this.ecparams.n, s3 = this.ecparams.G;
                if (e3.compareTo(r3.ONE) < 0 || e3.compareTo(o3) >= 0)
                  return false;
                if (n3.compareTo(r3.ONE) < 0 || n3.compareTo(o3) >= 0)
                  return false;
                var a3 = n3.modInverse(o3), u3 = t9.multiply(a3).mod(o3), c3 = e3.multiply(a3).mod(o3);
                return s3.multiply(u3).add(i3.multiply(c3)).getX().toBigInteger().mod(o3).equals(e3);
              }, this.serializeSig = function(t9, e3) {
                var r4 = t9.toByteArraySigned(), n3 = e3.toByteArraySigned(), i3 = [];
                return i3.push(2), i3.push(r4.length), (i3 = i3.concat(r4)).push(2), i3.push(n3.length), (i3 = i3.concat(n3)).unshift(i3.length), i3.unshift(48), i3;
              }, this.parseSig = function(t9) {
                var e3;
                if (48 != t9[0])
                  throw new Error("Signature not a valid DERSequence");
                if (2 != t9[e3 = 2])
                  throw new Error("First element in signature must be a DERInteger");
                var n3 = t9.slice(e3 + 2, e3 + 2 + t9[e3 + 1]);
                if (2 != t9[e3 += 2 + t9[e3 + 1]])
                  throw new Error("Second element in signature must be a DERInteger");
                var i3 = t9.slice(e3 + 2, e3 + 2 + t9[e3 + 1]);
                return e3 += 2 + t9[e3 + 1], { r: r3.fromByteArrayUnsigned(n3), s: r3.fromByteArrayUnsigned(i3) };
              }, this.parseSigCompact = function(t9) {
                if (65 !== t9.length)
                  throw "Signature has the wrong length";
                var e3 = t9[0] - 27;
                if (e3 < 0 || e3 > 7)
                  throw "Invalid signature type";
                var n3 = this.ecparams.n;
                return { r: r3.fromByteArrayUnsigned(t9.slice(1, 33)).mod(n3), s: r3.fromByteArrayUnsigned(t9.slice(33, 65)).mod(n3), i: e3 };
              }, this.readPKCS5PrvKeyHex = function(t9) {
                if (false === c2(t9))
                  throw new Error("not ASN.1 hex string");
                var e3, r4, n3;
                try {
                  e3 = u2(t9, 0, ["[0]", 0], "06"), r4 = u2(t9, 0, [1], "04");
                  try {
                    n3 = u2(t9, 0, ["[1]", 0], "03");
                  } catch (t10) {
                  }
                } catch (t10) {
                  throw new Error("malformed PKCS#1/5 plain ECC private key");
                }
                if (this.curveName = s2(e3), void 0 === this.curveName)
                  throw "unsupported curve name";
                this.setNamedCurve(this.curveName), this.setPublicKeyHex(n3), this.setPrivateKeyHex(r4), this.isPublic = false;
              }, this.readPKCS8PrvKeyHex = function(t9) {
                if (false === c2(t9))
                  throw new e2("not ASN.1 hex string");
                var r4, n3, i3;
                try {
                  u2(t9, 0, [1, 0], "06"), r4 = u2(t9, 0, [1, 1], "06"), n3 = u2(t9, 0, [2, 0, 1], "04");
                  try {
                    i3 = u2(t9, 0, [2, 0, "[1]", 0], "03");
                  } catch (t10) {
                  }
                } catch (t10) {
                  throw new e2("malformed PKCS#8 plain ECC private key");
                }
                if (this.curveName = s2(r4), void 0 === this.curveName)
                  throw new e2("unsupported curve name");
                this.setNamedCurve(this.curveName), this.setPublicKeyHex(i3), this.setPrivateKeyHex(n3), this.isPublic = false;
              }, this.readPKCS8PubKeyHex = function(t9) {
                if (false === c2(t9))
                  throw new e2("not ASN.1 hex string");
                var r4, n3;
                try {
                  u2(t9, 0, [0, 0], "06"), r4 = u2(t9, 0, [0, 1], "06"), n3 = u2(t9, 0, [1], "03");
                } catch (t10) {
                  throw new e2("malformed PKCS#8 ECC public key");
                }
                if (this.curveName = s2(r4), null === this.curveName)
                  throw new e2("unsupported curve name");
                this.setNamedCurve(this.curveName), this.setPublicKeyHex(n3);
              }, this.readCertPubKeyHex = function(t9, r4) {
                if (false === c2(t9))
                  throw new e2("not ASN.1 hex string");
                var n3, i3;
                try {
                  n3 = u2(t9, 0, [0, 5, 0, 1], "06"), i3 = u2(t9, 0, [0, 5, 1], "03");
                } catch (t10) {
                  throw new e2("malformed X.509 certificate ECC public key");
                }
                if (this.curveName = s2(n3), null === this.curveName)
                  throw new e2("unsupported curve name");
                this.setNamedCurve(this.curveName), this.setPublicKeyHex(i3);
              }, void 0 !== t8 && void 0 !== t8.curve && (this.curveName = t8.curve), void 0 === this.curveName && (this.curveName = "secp256r1"), this.setNamedCurve(this.curveName), void 0 !== t8 && (void 0 !== t8.prv && this.setPrivateKeyHex(t8.prv), void 0 !== t8.pub && this.setPublicKeyHex(t8.pub));
            }, Sr.crypto.ECDSA.parseSigHex = function(t8) {
              var e2 = Sr.crypto.ECDSA.parseSigHexInHexRS(t8);
              return { r: new w(e2.r, 16), s: new w(e2.s, 16) };
            }, Sr.crypto.ECDSA.parseSigHexInHexRS = function(t8) {
              var e2 = Fr, r3 = e2.getChildIdx, n2 = e2.getV;
              if (e2.checkStrictDER(t8, 0), "30" != t8.substr(0, 2))
                throw new Error("signature is not a ASN.1 sequence");
              var i2 = r3(t8, 0);
              if (2 != i2.length)
                throw new Error("signature shall have two elements");
              var o2 = i2[0], s2 = i2[1];
              if ("02" != t8.substr(o2, 2))
                throw new Error("1st item not ASN.1 integer");
              if ("02" != t8.substr(s2, 2))
                throw new Error("2nd item not ASN.1 integer");
              return { r: n2(t8, o2), s: n2(t8, s2) };
            }, Sr.crypto.ECDSA.asn1SigToConcatSig = function(t8) {
              var e2 = Sr.crypto.ECDSA.parseSigHexInHexRS(t8), r3 = e2.r, n2 = e2.s;
              if ("00" == r3.substr(0, 2) && r3.length % 32 == 2 && (r3 = r3.substr(2)), "00" == n2.substr(0, 2) && n2.length % 32 == 2 && (n2 = n2.substr(2)), r3.length % 32 == 30 && (r3 = "00" + r3), n2.length % 32 == 30 && (n2 = "00" + n2), r3.length % 32 != 0)
                throw "unknown ECDSA sig r length error";
              if (n2.length % 32 != 0)
                throw "unknown ECDSA sig s length error";
              return r3 + n2;
            }, Sr.crypto.ECDSA.concatSigToASN1Sig = function(t8) {
              if (t8.length / 2 * 8 % 128 != 0)
                throw "unknown ECDSA concatinated r-s sig  length error";
              var e2 = t8.substr(0, t8.length / 2), r3 = t8.substr(t8.length / 2);
              return Sr.crypto.ECDSA.hexRSSigToASN1Sig(e2, r3);
            }, Sr.crypto.ECDSA.hexRSSigToASN1Sig = function(t8, e2) {
              var r3 = new w(t8, 16), n2 = new w(e2, 16);
              return Sr.crypto.ECDSA.biRSSigToASN1Sig(r3, n2);
            }, Sr.crypto.ECDSA.biRSSigToASN1Sig = function(t8, e2) {
              var r3 = Sr.asn1, n2 = new r3.DERInteger({ bigint: t8 }), i2 = new r3.DERInteger({ bigint: e2 });
              return new r3.DERSequence({ array: [n2, i2] }).getEncodedHex();
            }, Sr.crypto.ECDSA.getName = function(t8) {
              return "2b8104001f" === t8 ? "secp192k1" : "2a8648ce3d030107" === t8 ? "secp256r1" : "2b8104000a" === t8 ? "secp256k1" : "2b81040021" === t8 ? "secp224r1" : "2b81040022" === t8 ? "secp384r1" : -1 !== "|secp256r1|NIST P-256|P-256|prime256v1|".indexOf(t8) ? "secp256r1" : -1 !== "|secp256k1|".indexOf(t8) ? "secp256k1" : -1 !== "|secp224r1|NIST P-224|P-224|".indexOf(t8) ? "secp224r1" : -1 !== "|secp384r1|NIST P-384|P-384|".indexOf(t8) ? "secp384r1" : null;
            }, void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.crypto && Sr.crypto || (Sr.crypto = {}), Sr.crypto.ECParameterDB = new function() {
              var t8 = {}, e2 = {};
              function r3(t9) {
                return new w(t9, 16);
              }
              this.getByName = function(r4) {
                var n2 = r4;
                if (void 0 !== e2[n2] && (n2 = e2[r4]), void 0 !== t8[n2])
                  return t8[n2];
                throw "unregistered EC curve name: " + n2;
              }, this.regist = function(n2, i2, o2, s2, a2, u2, c2, h2, l2, f2, g2, d2) {
                t8[n2] = {};
                var p2 = r3(o2), v3 = r3(s2), y2 = r3(a2), m2 = r3(u2), _2 = r3(c2), S2 = new Ke(p2, v3, y2), b2 = S2.decodePointHex("04" + h2 + l2);
                t8[n2].name = n2, t8[n2].keylen = i2, t8[n2].curve = S2, t8[n2].G = b2, t8[n2].n = m2, t8[n2].h = _2, t8[n2].oid = g2, t8[n2].info = d2;
                for (var w2 = 0; w2 < f2.length; w2++)
                  e2[f2[w2]] = n2;
              };
            }(), Sr.crypto.ECParameterDB.regist("secp128r1", 128, "FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF", "FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC", "E87579C11079F43DD824993C2CEE5ED3", "FFFFFFFE0000000075A30D1B9038A115", "1", "161FF7528B899B2D0C28607CA52C5B86", "CF5AC8395BAFEB13C02DA292DDED7A83", [], "", "secp128r1 : SECG curve over a 128 bit prime field"), Sr.crypto.ECParameterDB.regist("secp160k1", 160, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73", "0", "7", "0100000000000000000001B8FA16DFAB9ACA16B6B3", "1", "3B4C382CE37AA192A4019E763036F4F5DD4D7EBB", "938CF935318FDCED6BC28286531733C3F03C4FEE", [], "", "secp160k1 : SECG curve over a 160 bit prime field"), Sr.crypto.ECParameterDB.regist("secp160r1", 160, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC", "1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45", "0100000000000000000001F4C8F927AED3CA752257", "1", "4A96B5688EF573284664698968C38BB913CBFC82", "23A628553168947D59DCC912042351377AC5FB32", [], "", "secp160r1 : SECG curve over a 160 bit prime field"), Sr.crypto.ECParameterDB.regist("secp192k1", 192, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37", "0", "3", "FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D", "1", "DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D", "9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D", []), Sr.crypto.ECParameterDB.regist("secp192r1", 192, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC", "64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1", "FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831", "1", "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012", "07192B95FFC8DA78631011ED6B24CDD573F977A11E794811", []), Sr.crypto.ECParameterDB.regist("secp224r1", 224, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE", "B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4", "FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D", "1", "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21", "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34", []), Sr.crypto.ECParameterDB.regist("secp256k1", 256, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", "0", "7", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", "1", "79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", "483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", []), Sr.crypto.ECParameterDB.regist("secp256r1", 256, "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF", "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC", "5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B", "FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551", "1", "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296", "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5", ["NIST P-256", "P-256", "prime256v1"]), Sr.crypto.ECParameterDB.regist("secp384r1", 384, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC", "B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973", "1", "AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7", "3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f", ["NIST P-384", "P-384"]), Sr.crypto.ECParameterDB.regist("secp521r1", 521, "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC", "051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00", "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409", "1", "C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66", "011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650", ["NIST P-521", "P-521"]);
            var tn2 = /* @__PURE__ */ function() {
              var t8 = function t9(r4, n3, i3) {
                return e2(v2.AES, r4, n3, i3);
              }, e2 = function t9(e3, r4, n3, i3) {
                var o3 = v2.enc.Hex.parse(r4), s3 = v2.enc.Hex.parse(n3), a3 = v2.enc.Hex.parse(i3), u2 = {};
                u2.key = s3, u2.iv = a3, u2.ciphertext = o3;
                var c2 = e3.decrypt(u2, s3, { iv: a3 });
                return v2.enc.Hex.stringify(c2);
              }, r3 = function t9(e3, r4, i3) {
                return n2(v2.AES, e3, r4, i3);
              }, n2 = function t9(e3, r4, n3, i3) {
                var o3 = v2.enc.Hex.parse(r4), s3 = v2.enc.Hex.parse(n3), a3 = v2.enc.Hex.parse(i3), u2 = e3.encrypt(o3, s3, { iv: a3 }), c2 = v2.enc.Hex.parse(u2.toString());
                return v2.enc.Base64.stringify(c2);
              }, i2 = { "AES-256-CBC": { proc: t8, eproc: r3, keylen: 32, ivlen: 16 }, "AES-192-CBC": { proc: t8, eproc: r3, keylen: 24, ivlen: 16 }, "AES-128-CBC": { proc: t8, eproc: r3, keylen: 16, ivlen: 16 }, "DES-EDE3-CBC": { proc: function t9(r4, n3, i3) {
                return e2(v2.TripleDES, r4, n3, i3);
              }, eproc: function t9(e3, r4, i3) {
                return n2(v2.TripleDES, e3, r4, i3);
              }, keylen: 24, ivlen: 8 }, "DES-CBC": { proc: function t9(r4, n3, i3) {
                return e2(v2.DES, r4, n3, i3);
              }, eproc: function t9(e3, r4, i3) {
                return n2(v2.DES, e3, r4, i3);
              }, keylen: 8, ivlen: 8 } }, o2 = function t9(e3) {
                var r4 = {}, n3 = e3.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)", "m"));
                n3 && (r4.cipher = n3[1], r4.ivsalt = n3[2]);
                var i3 = e3.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"));
                i3 && (r4.type = i3[1]);
                var o3 = -1, s3 = 0;
                -1 != e3.indexOf("\r\n\r\n") && (o3 = e3.indexOf("\r\n\r\n"), s3 = 2), -1 != e3.indexOf("\n\n") && (o3 = e3.indexOf("\n\n"), s3 = 1);
                var a3 = e3.indexOf("-----END");
                if (-1 != o3 && -1 != a3) {
                  var u2 = e3.substring(o3 + 2 * s3, a3 - s3);
                  u2 = u2.replace(/\s+/g, ""), r4.data = u2;
                }
                return r4;
              }, s2 = function t9(e3, r4, n3) {
                for (var o3 = n3.substring(0, 16), s3 = v2.enc.Hex.parse(o3), a3 = v2.enc.Utf8.parse(r4), u2 = i2[e3].keylen + i2[e3].ivlen, c2 = "", h2 = null; ; ) {
                  var l2 = v2.algo.MD5.create();
                  if (null != h2 && l2.update(h2), l2.update(a3), l2.update(s3), h2 = l2.finalize(), (c2 += v2.enc.Hex.stringify(h2)).length >= 2 * u2)
                    break;
                }
                var f2 = {};
                return f2.keyhex = c2.substr(0, 2 * i2[e3].keylen), f2.ivhex = c2.substr(2 * i2[e3].keylen, 2 * i2[e3].ivlen), f2;
              }, a2 = function t9(e3, r4, n3, o3) {
                var s3 = v2.enc.Base64.parse(e3), a3 = v2.enc.Hex.stringify(s3);
                return (0, i2[r4].proc)(a3, n3, o3);
              };
              return { version: "1.0.0", parsePKCS5PEM: function t9(e3) {
                return o2(e3);
              }, getKeyAndUnusedIvByPasscodeAndIvsalt: function t9(e3, r4, n3) {
                return s2(e3, r4, n3);
              }, decryptKeyB64: function t9(e3, r4, n3, i3) {
                return a2(e3, r4, n3, i3);
              }, getDecryptedKeyHex: function t9(e3, r4) {
                var n3 = o2(e3), i3 = (n3.type, n3.cipher), u2 = n3.ivsalt, c2 = n3.data, h2 = s2(i3, r4, u2).keyhex;
                return a2(c2, i3, h2, u2);
              }, getEncryptedPKCS5PEMFromPrvKeyHex: function t9(e3, r4, n3, o3, a3) {
                var u2 = "";
                if (void 0 !== o3 && null != o3 || (o3 = "AES-256-CBC"), void 0 === i2[o3])
                  throw new Error("KEYUTIL unsupported algorithm: " + o3);
                void 0 !== a3 && null != a3 || (a3 = function t10(e4) {
                  var r5 = v2.lib.WordArray.random(e4);
                  return v2.enc.Hex.stringify(r5);
                }(i2[o3].ivlen).toUpperCase());
                var c2 = function t10(e4, r5, n4, o4) {
                  return (0, i2[r5].eproc)(e4, n4, o4);
                }(r4, o3, s2(o3, n3, a3).keyhex, a3);
                u2 = "-----BEGIN " + e3 + " PRIVATE KEY-----\r\n";
                return u2 += "Proc-Type: 4,ENCRYPTED\r\n", u2 += "DEK-Info: " + o3 + "," + a3 + "\r\n", u2 += "\r\n", u2 += c2.replace(/(.{64})/g, "$1\r\n"), u2 += "\r\n-----END " + e3 + " PRIVATE KEY-----\r\n";
              }, parseHexOfEncryptedPKCS8: function t9(e3) {
                var r4 = Fr, n3 = r4.getChildIdx, i3 = r4.getV, o3 = {}, s3 = n3(e3, 0);
                if (2 != s3.length)
                  throw new Error("malformed format: SEQUENCE(0).items != 2: " + s3.length);
                o3.ciphertext = i3(e3, s3[1]);
                var a3 = n3(e3, s3[0]);
                if (2 != a3.length)
                  throw new Error("malformed format: SEQUENCE(0.0).items != 2: " + a3.length);
                if ("2a864886f70d01050d" != i3(e3, a3[0]))
                  throw new Error("this only supports pkcs5PBES2");
                var u2 = n3(e3, a3[1]);
                if (2 != a3.length)
                  throw new Error("malformed format: SEQUENCE(0.0.1).items != 2: " + u2.length);
                var c2 = n3(e3, u2[1]);
                if (2 != c2.length)
                  throw new Error("malformed format: SEQUENCE(0.0.1.1).items != 2: " + c2.length);
                if ("2a864886f70d0307" != i3(e3, c2[0]))
                  throw "this only supports TripleDES";
                o3.encryptionSchemeAlg = "TripleDES", o3.encryptionSchemeIV = i3(e3, c2[1]);
                var h2 = n3(e3, u2[0]);
                if (2 != h2.length)
                  throw new Error("malformed format: SEQUENCE(0.0.1.0).items != 2: " + h2.length);
                if ("2a864886f70d01050c" != i3(e3, h2[0]))
                  throw new Error("this only supports pkcs5PBKDF2");
                var l2 = n3(e3, h2[1]);
                if (l2.length < 2)
                  throw new Error("malformed format: SEQUENCE(0.0.1.0.1).items < 2: " + l2.length);
                o3.pbkdf2Salt = i3(e3, l2[0]);
                var f2 = i3(e3, l2[1]);
                try {
                  o3.pbkdf2Iter = parseInt(f2, 16);
                } catch (t10) {
                  throw new Error("malformed format pbkdf2Iter: " + f2);
                }
                return o3;
              }, getPBKDF2KeyHexFromParam: function t9(e3, r4) {
                var n3 = v2.enc.Hex.parse(e3.pbkdf2Salt), i3 = e3.pbkdf2Iter, o3 = v2.PBKDF2(r4, n3, { keySize: 6, iterations: i3 });
                return v2.enc.Hex.stringify(o3);
              }, _getPlainPKCS8HexFromEncryptedPKCS8PEM: function t9(e3, r4) {
                var n3 = Mr2(e3, "ENCRYPTED PRIVATE KEY"), i3 = this.parseHexOfEncryptedPKCS8(n3), o3 = tn2.getPBKDF2KeyHexFromParam(i3, r4), s3 = {};
                s3.ciphertext = v2.enc.Hex.parse(i3.ciphertext);
                var a3 = v2.enc.Hex.parse(o3), u2 = v2.enc.Hex.parse(i3.encryptionSchemeIV), c2 = v2.TripleDES.decrypt(s3, a3, { iv: u2 });
                return v2.enc.Hex.stringify(c2);
              }, getKeyFromEncryptedPKCS8PEM: function t9(e3, r4) {
                var n3 = this._getPlainPKCS8HexFromEncryptedPKCS8PEM(e3, r4);
                return this.getKeyFromPlainPrivatePKCS8Hex(n3);
              }, parsePlainPrivatePKCS8Hex: function t9(e3) {
                var r4 = Fr, n3 = r4.getChildIdx, i3 = r4.getV, o3 = { algparam: null };
                if ("30" != e3.substr(0, 2))
                  throw new Error("malformed plain PKCS8 private key(code:001)");
                var s3 = n3(e3, 0);
                if (s3.length < 3)
                  throw new Error("malformed plain PKCS8 private key(code:002)");
                if ("30" != e3.substr(s3[1], 2))
                  throw new Error("malformed PKCS8 private key(code:003)");
                var a3 = n3(e3, s3[1]);
                if (2 != a3.length)
                  throw new Error("malformed PKCS8 private key(code:004)");
                if ("06" != e3.substr(a3[0], 2))
                  throw new Error("malformed PKCS8 private key(code:005)");
                if (o3.algoid = i3(e3, a3[0]), "06" == e3.substr(a3[1], 2) && (o3.algparam = i3(e3, a3[1])), "04" != e3.substr(s3[2], 2))
                  throw new Error("malformed PKCS8 private key(code:006)");
                return o3.keyidx = r4.getVidx(e3, s3[2]), o3;
              }, getKeyFromPlainPrivatePKCS8PEM: function t9(e3) {
                var r4 = Mr2(e3, "PRIVATE KEY");
                return this.getKeyFromPlainPrivatePKCS8Hex(r4);
              }, getKeyFromPlainPrivatePKCS8Hex: function t9(e3) {
                var r4, n3 = this.parsePlainPrivatePKCS8Hex(e3);
                if ("2a864886f70d010101" == n3.algoid)
                  r4 = new Me();
                else if ("2a8648ce380401" == n3.algoid)
                  r4 = new Sr.crypto.DSA();
                else {
                  if ("2a8648ce3d0201" != n3.algoid)
                    throw new Error("unsupported private key algorithm");
                  r4 = new Sr.crypto.ECDSA();
                }
                return r4.readPKCS8PrvKeyHex(e3), r4;
              }, _getKeyFromPublicPKCS8Hex: function t9(e3) {
                var r4, n3 = Fr.getVbyList(e3, 0, [0, 0], "06");
                if ("2a864886f70d010101" === n3)
                  r4 = new Me();
                else if ("2a8648ce380401" === n3)
                  r4 = new Sr.crypto.DSA();
                else {
                  if ("2a8648ce3d0201" !== n3)
                    throw new Error("unsupported PKCS#8 public key hex");
                  r4 = new Sr.crypto.ECDSA();
                }
                return r4.readPKCS8PubKeyHex(e3), r4;
              }, parsePublicRawRSAKeyHex: function t9(e3) {
                var r4 = Fr, n3 = r4.getChildIdx, i3 = r4.getV, o3 = {};
                if ("30" != e3.substr(0, 2))
                  throw new Error("malformed RSA key(code:001)");
                var s3 = n3(e3, 0);
                if (2 != s3.length)
                  throw new Error("malformed RSA key(code:002)");
                if ("02" != e3.substr(s3[0], 2))
                  throw new Error("malformed RSA key(code:003)");
                if (o3.n = i3(e3, s3[0]), "02" != e3.substr(s3[1], 2))
                  throw new Error("malformed RSA key(code:004)");
                return o3.e = i3(e3, s3[1]), o3;
              }, parsePublicPKCS8Hex: function t9(e3) {
                var r4 = Fr, n3 = r4.getChildIdx, i3 = r4.getV, o3 = { algparam: null }, s3 = n3(e3, 0);
                if (2 != s3.length)
                  throw new Error("outer DERSequence shall have 2 elements: " + s3.length);
                var a3 = s3[0];
                if ("30" != e3.substr(a3, 2))
                  throw new Error("malformed PKCS8 public key(code:001)");
                var u2 = n3(e3, a3);
                if (2 != u2.length)
                  throw new Error("malformed PKCS8 public key(code:002)");
                if ("06" != e3.substr(u2[0], 2))
                  throw new Error("malformed PKCS8 public key(code:003)");
                if (o3.algoid = i3(e3, u2[0]), "06" == e3.substr(u2[1], 2) ? o3.algparam = i3(e3, u2[1]) : "30" == e3.substr(u2[1], 2) && (o3.algparam = {}, o3.algparam.p = r4.getVbyList(e3, u2[1], [0], "02"), o3.algparam.q = r4.getVbyList(e3, u2[1], [1], "02"), o3.algparam.g = r4.getVbyList(e3, u2[1], [2], "02")), "03" != e3.substr(s3[1], 2))
                  throw new Error("malformed PKCS8 public key(code:004)");
                return o3.key = i3(e3, s3[1]).substr(2), o3;
              } };
            }();
            tn2.getKey = function(t8, e2, r3) {
              var n2 = (v3 = Fr).getChildIdx, i2 = (v3.getV, v3.getVbyList), o2 = Sr.crypto, s2 = o2.ECDSA, a2 = o2.DSA, u2 = Me, c2 = Mr2, h2 = tn2;
              if (void 0 !== u2 && t8 instanceof u2)
                return t8;
              if (void 0 !== s2 && t8 instanceof s2)
                return t8;
              if (void 0 !== a2 && t8 instanceof a2)
                return t8;
              if (void 0 !== t8.curve && void 0 !== t8.xy && void 0 === t8.d)
                return new s2({ pub: t8.xy, curve: t8.curve });
              if (void 0 !== t8.curve && void 0 !== t8.d)
                return new s2({ prv: t8.d, curve: t8.curve });
              if (void 0 === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 === t8.d)
                return (P3 = new u2()).setPublic(t8.n, t8.e), P3;
              if (void 0 === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 !== t8.d && void 0 !== t8.p && void 0 !== t8.q && void 0 !== t8.dp && void 0 !== t8.dq && void 0 !== t8.co && void 0 === t8.qi)
                return (P3 = new u2()).setPrivateEx(t8.n, t8.e, t8.d, t8.p, t8.q, t8.dp, t8.dq, t8.co), P3;
              if (void 0 === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 !== t8.d && void 0 === t8.p)
                return (P3 = new u2()).setPrivate(t8.n, t8.e, t8.d), P3;
              if (void 0 !== t8.p && void 0 !== t8.q && void 0 !== t8.g && void 0 !== t8.y && void 0 === t8.x)
                return (P3 = new a2()).setPublic(t8.p, t8.q, t8.g, t8.y), P3;
              if (void 0 !== t8.p && void 0 !== t8.q && void 0 !== t8.g && void 0 !== t8.y && void 0 !== t8.x)
                return (P3 = new a2()).setPrivate(t8.p, t8.q, t8.g, t8.y, t8.x), P3;
              if ("RSA" === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 === t8.d)
                return (P3 = new u2()).setPublic(Rr(t8.n), Rr(t8.e)), P3;
              if ("RSA" === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 !== t8.d && void 0 !== t8.p && void 0 !== t8.q && void 0 !== t8.dp && void 0 !== t8.dq && void 0 !== t8.qi)
                return (P3 = new u2()).setPrivateEx(Rr(t8.n), Rr(t8.e), Rr(t8.d), Rr(t8.p), Rr(t8.q), Rr(t8.dp), Rr(t8.dq), Rr(t8.qi)), P3;
              if ("RSA" === t8.kty && void 0 !== t8.n && void 0 !== t8.e && void 0 !== t8.d)
                return (P3 = new u2()).setPrivate(Rr(t8.n), Rr(t8.e), Rr(t8.d)), P3;
              if ("EC" === t8.kty && void 0 !== t8.crv && void 0 !== t8.x && void 0 !== t8.y && void 0 === t8.d) {
                var l2 = (k2 = new s2({ curve: t8.crv })).ecparams.keylen / 4, f2 = "04" + ("0000000000" + Rr(t8.x)).slice(-l2) + ("0000000000" + Rr(t8.y)).slice(-l2);
                return k2.setPublicKeyHex(f2), k2;
              }
              if ("EC" === t8.kty && void 0 !== t8.crv && void 0 !== t8.x && void 0 !== t8.y && void 0 !== t8.d) {
                l2 = (k2 = new s2({ curve: t8.crv })).ecparams.keylen / 4, f2 = "04" + ("0000000000" + Rr(t8.x)).slice(-l2) + ("0000000000" + Rr(t8.y)).slice(-l2);
                var g2 = ("0000000000" + Rr(t8.d)).slice(-l2);
                return k2.setPublicKeyHex(f2), k2.setPrivateKeyHex(g2), k2;
              }
              if ("pkcs5prv" === r3) {
                var d2, p2 = t8, v3 = Fr;
                if (9 === (d2 = n2(p2, 0)).length)
                  (P3 = new u2()).readPKCS5PrvKeyHex(p2);
                else if (6 === d2.length)
                  (P3 = new a2()).readPKCS5PrvKeyHex(p2);
                else {
                  if (!(d2.length > 2 && "04" === p2.substr(d2[1], 2)))
                    throw new Error("unsupported PKCS#1/5 hexadecimal key");
                  (P3 = new s2()).readPKCS5PrvKeyHex(p2);
                }
                return P3;
              }
              if ("pkcs8prv" === r3)
                return P3 = h2.getKeyFromPlainPrivatePKCS8Hex(t8);
              if ("pkcs8pub" === r3)
                return h2._getKeyFromPublicPKCS8Hex(t8);
              if ("x509pub" === r3)
                return on.getPublicKeyFromCertHex(t8);
              if (-1 != t8.indexOf("-END CERTIFICATE-", 0) || -1 != t8.indexOf("-END X509 CERTIFICATE-", 0) || -1 != t8.indexOf("-END TRUSTED CERTIFICATE-", 0))
                return on.getPublicKeyFromCertPEM(t8);
              if (-1 != t8.indexOf("-END PUBLIC KEY-")) {
                var y2 = Mr2(t8, "PUBLIC KEY");
                return h2._getKeyFromPublicPKCS8Hex(y2);
              }
              if (-1 != t8.indexOf("-END RSA PRIVATE KEY-") && -1 == t8.indexOf("4,ENCRYPTED")) {
                var m2 = c2(t8, "RSA PRIVATE KEY");
                return h2.getKey(m2, null, "pkcs5prv");
              }
              if (-1 != t8.indexOf("-END DSA PRIVATE KEY-") && -1 == t8.indexOf("4,ENCRYPTED")) {
                var _2 = i2(R2 = c2(t8, "DSA PRIVATE KEY"), 0, [1], "02"), S2 = i2(R2, 0, [2], "02"), b2 = i2(R2, 0, [3], "02"), F2 = i2(R2, 0, [4], "02"), E = i2(R2, 0, [5], "02");
                return (P3 = new a2()).setPrivate(new w(_2, 16), new w(S2, 16), new w(b2, 16), new w(F2, 16), new w(E, 16)), P3;
              }
              if (-1 != t8.indexOf("-END EC PRIVATE KEY-") && -1 == t8.indexOf("4,ENCRYPTED")) {
                m2 = c2(t8, "EC PRIVATE KEY");
                return h2.getKey(m2, null, "pkcs5prv");
              }
              if (-1 != t8.indexOf("-END PRIVATE KEY-"))
                return h2.getKeyFromPlainPrivatePKCS8PEM(t8);
              if (-1 != t8.indexOf("-END RSA PRIVATE KEY-") && -1 != t8.indexOf("4,ENCRYPTED")) {
                var x = h2.getDecryptedKeyHex(t8, e2), A2 = new Me();
                return A2.readPKCS5PrvKeyHex(x), A2;
              }
              if (-1 != t8.indexOf("-END EC PRIVATE KEY-") && -1 != t8.indexOf("4,ENCRYPTED")) {
                var k2, P3 = i2(R2 = h2.getDecryptedKeyHex(t8, e2), 0, [1], "04"), C2 = i2(R2, 0, [2, 0], "06"), T2 = i2(R2, 0, [3, 0], "03").substr(2);
                if (void 0 === Sr.crypto.OID.oidhex2name[C2])
                  throw new Error("undefined OID(hex) in KJUR.crypto.OID: " + C2);
                return (k2 = new s2({ curve: Sr.crypto.OID.oidhex2name[C2] })).setPublicKeyHex(T2), k2.setPrivateKeyHex(P3), k2.isPublic = false, k2;
              }
              if (-1 != t8.indexOf("-END DSA PRIVATE KEY-") && -1 != t8.indexOf("4,ENCRYPTED")) {
                var R2;
                _2 = i2(R2 = h2.getDecryptedKeyHex(t8, e2), 0, [1], "02"), S2 = i2(R2, 0, [2], "02"), b2 = i2(R2, 0, [3], "02"), F2 = i2(R2, 0, [4], "02"), E = i2(R2, 0, [5], "02");
                return (P3 = new a2()).setPrivate(new w(_2, 16), new w(S2, 16), new w(b2, 16), new w(F2, 16), new w(E, 16)), P3;
              }
              if (-1 != t8.indexOf("-END ENCRYPTED PRIVATE KEY-"))
                return h2.getKeyFromEncryptedPKCS8PEM(t8, e2);
              throw new Error("not supported argument");
            }, tn2.generateKeypair = function(t8, e2) {
              if ("RSA" == t8) {
                var r3 = e2;
                (s2 = new Me()).generate(r3, "10001"), s2.isPrivate = true, s2.isPublic = true;
                var n2 = new Me(), i2 = s2.n.toString(16), o2 = s2.e.toString(16);
                return n2.setPublic(i2, o2), n2.isPrivate = false, n2.isPublic = true, (a2 = {}).prvKeyObj = s2, a2.pubKeyObj = n2, a2;
              }
              if ("EC" == t8) {
                var s2, a2, u2 = e2, c2 = new Sr.crypto.ECDSA({ curve: u2 }).generateKeyPairHex();
                return (s2 = new Sr.crypto.ECDSA({ curve: u2 })).setPublicKeyHex(c2.ecpubhex), s2.setPrivateKeyHex(c2.ecprvhex), s2.isPrivate = true, s2.isPublic = false, (n2 = new Sr.crypto.ECDSA({ curve: u2 })).setPublicKeyHex(c2.ecpubhex), n2.isPrivate = false, n2.isPublic = true, (a2 = {}).prvKeyObj = s2, a2.pubKeyObj = n2, a2;
              }
              throw new Error("unknown algorithm: " + t8);
            }, tn2.getPEM = function(t8, e2, r3, n2, i2, o2) {
              var s2 = Sr, a2 = s2.asn1, u2 = a2.DERObjectIdentifier, c2 = a2.DERInteger, h2 = a2.ASN1Util.newObject, l2 = a2.x509.SubjectPublicKeyInfo, f2 = s2.crypto, g2 = f2.DSA, d2 = f2.ECDSA, p2 = Me;
              function y2(t9) {
                return h2({ seq: [{ int: 0 }, { int: { bigint: t9.n } }, { int: t9.e }, { int: { bigint: t9.d } }, { int: { bigint: t9.p } }, { int: { bigint: t9.q } }, { int: { bigint: t9.dmp1 } }, { int: { bigint: t9.dmq1 } }, { int: { bigint: t9.coeff } }] });
              }
              function m2(t9) {
                return h2({ seq: [{ int: 1 }, { octstr: { hex: t9.prvKeyHex } }, { tag: ["a0", true, { oid: { name: t9.curveName } }] }, { tag: ["a1", true, { bitstr: { hex: "00" + t9.pubKeyHex } }] }] });
              }
              function _2(t9) {
                return h2({ seq: [{ int: 0 }, { int: { bigint: t9.p } }, { int: { bigint: t9.q } }, { int: { bigint: t9.g } }, { int: { bigint: t9.y } }, { int: { bigint: t9.x } }] });
              }
              if ((void 0 !== p2 && t8 instanceof p2 || void 0 !== g2 && t8 instanceof g2 || void 0 !== d2 && t8 instanceof d2) && 1 == t8.isPublic && (void 0 === e2 || "PKCS8PUB" == e2))
                return jr2(F2 = new l2(t8).getEncodedHex(), "PUBLIC KEY");
              if ("PKCS1PRV" == e2 && void 0 !== p2 && t8 instanceof p2 && (void 0 === r3 || null == r3) && 1 == t8.isPrivate)
                return jr2(F2 = y2(t8).getEncodedHex(), "RSA PRIVATE KEY");
              if ("PKCS1PRV" == e2 && void 0 !== d2 && t8 instanceof d2 && (void 0 === r3 || null == r3) && 1 == t8.isPrivate) {
                var S2 = new u2({ name: t8.curveName }).getEncodedHex(), b2 = m2(t8).getEncodedHex(), w2 = "";
                return w2 += jr2(S2, "EC PARAMETERS"), w2 += jr2(b2, "EC PRIVATE KEY");
              }
              if ("PKCS1PRV" == e2 && void 0 !== g2 && t8 instanceof g2 && (void 0 === r3 || null == r3) && 1 == t8.isPrivate)
                return jr2(F2 = _2(t8).getEncodedHex(), "DSA PRIVATE KEY");
              if ("PKCS5PRV" == e2 && void 0 !== p2 && t8 instanceof p2 && void 0 !== r3 && null != r3 && 1 == t8.isPrivate) {
                var F2 = y2(t8).getEncodedHex();
                return void 0 === n2 && (n2 = "DES-EDE3-CBC"), this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA", F2, r3, n2, o2);
              }
              if ("PKCS5PRV" == e2 && void 0 !== d2 && t8 instanceof d2 && void 0 !== r3 && null != r3 && 1 == t8.isPrivate) {
                F2 = m2(t8).getEncodedHex();
                return void 0 === n2 && (n2 = "DES-EDE3-CBC"), this.getEncryptedPKCS5PEMFromPrvKeyHex("EC", F2, r3, n2, o2);
              }
              if ("PKCS5PRV" == e2 && void 0 !== g2 && t8 instanceof g2 && void 0 !== r3 && null != r3 && 1 == t8.isPrivate) {
                F2 = _2(t8).getEncodedHex();
                return void 0 === n2 && (n2 = "DES-EDE3-CBC"), this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA", F2, r3, n2, o2);
              }
              var E = function t9(e3, r4) {
                var n3 = x(e3, r4);
                return new h2({ seq: [{ seq: [{ oid: { name: "pkcs5PBES2" } }, { seq: [{ seq: [{ oid: { name: "pkcs5PBKDF2" } }, { seq: [{ octstr: { hex: n3.pbkdf2Salt } }, { int: n3.pbkdf2Iter }] }] }, { seq: [{ oid: { name: "des-EDE3-CBC" } }, { octstr: { hex: n3.encryptionSchemeIV } }] }] }] }, { octstr: { hex: n3.ciphertext } }] }).getEncodedHex();
              }, x = function t9(e3, r4) {
                var n3 = v2.lib.WordArray.random(8), i3 = v2.lib.WordArray.random(8), o3 = v2.PBKDF2(r4, n3, { keySize: 6, iterations: 100 }), s3 = v2.enc.Hex.parse(e3), a3 = v2.TripleDES.encrypt(s3, o3, { iv: i3 }) + "", u3 = {};
                return u3.ciphertext = a3, u3.pbkdf2Salt = v2.enc.Hex.stringify(n3), u3.pbkdf2Iter = 100, u3.encryptionSchemeAlg = "DES-EDE3-CBC", u3.encryptionSchemeIV = v2.enc.Hex.stringify(i3), u3;
              };
              if ("PKCS8PRV" == e2 && null != p2 && t8 instanceof p2 && 1 == t8.isPrivate) {
                var A2 = y2(t8).getEncodedHex();
                F2 = h2({ seq: [{ int: 0 }, { seq: [{ oid: { name: "rsaEncryption" } }, { null: true }] }, { octstr: { hex: A2 } }] }).getEncodedHex();
                return void 0 === r3 || null == r3 ? jr2(F2, "PRIVATE KEY") : jr2(b2 = E(F2, r3), "ENCRYPTED PRIVATE KEY");
              }
              if ("PKCS8PRV" == e2 && void 0 !== d2 && t8 instanceof d2 && 1 == t8.isPrivate) {
                A2 = new h2({ seq: [{ int: 1 }, { octstr: { hex: t8.prvKeyHex } }, { tag: ["a1", true, { bitstr: { hex: "00" + t8.pubKeyHex } }] }] }).getEncodedHex(), F2 = h2({ seq: [{ int: 0 }, { seq: [{ oid: { name: "ecPublicKey" } }, { oid: { name: t8.curveName } }] }, { octstr: { hex: A2 } }] }).getEncodedHex();
                return void 0 === r3 || null == r3 ? jr2(F2, "PRIVATE KEY") : jr2(b2 = E(F2, r3), "ENCRYPTED PRIVATE KEY");
              }
              if ("PKCS8PRV" == e2 && void 0 !== g2 && t8 instanceof g2 && 1 == t8.isPrivate) {
                A2 = new c2({ bigint: t8.x }).getEncodedHex(), F2 = h2({ seq: [{ int: 0 }, { seq: [{ oid: { name: "dsa" } }, { seq: [{ int: { bigint: t8.p } }, { int: { bigint: t8.q } }, { int: { bigint: t8.g } }] }] }, { octstr: { hex: A2 } }] }).getEncodedHex();
                return void 0 === r3 || null == r3 ? jr2(F2, "PRIVATE KEY") : jr2(b2 = E(F2, r3), "ENCRYPTED PRIVATE KEY");
              }
              throw new Error("unsupported object nor format");
            }, tn2.getKeyFromCSRPEM = function(t8) {
              var e2 = Mr2(t8, "CERTIFICATE REQUEST");
              return tn2.getKeyFromCSRHex(e2);
            }, tn2.getKeyFromCSRHex = function(t8) {
              var e2 = tn2.parseCSRHex(t8);
              return tn2.getKey(e2.p8pubkeyhex, null, "pkcs8pub");
            }, tn2.parseCSRHex = function(t8) {
              var e2 = Fr, r3 = e2.getChildIdx, n2 = e2.getTLV, i2 = {}, o2 = t8;
              if ("30" != o2.substr(0, 2))
                throw new Error("malformed CSR(code:001)");
              var s2 = r3(o2, 0);
              if (s2.length < 1)
                throw new Error("malformed CSR(code:002)");
              if ("30" != o2.substr(s2[0], 2))
                throw new Error("malformed CSR(code:003)");
              var a2 = r3(o2, s2[0]);
              if (a2.length < 3)
                throw new Error("malformed CSR(code:004)");
              return i2.p8pubkeyhex = n2(o2, a2[2]), i2;
            }, tn2.getKeyID = function(t8) {
              var e2 = tn2, r3 = Fr;
              "string" == typeof t8 && -1 != t8.indexOf("BEGIN ") && (t8 = e2.getKey(t8));
              var n2 = Mr2(e2.getPEM(t8)), i2 = r3.getIdxbyList(n2, 0, [1]), o2 = r3.getV(n2, i2).substring(2);
              return Sr.crypto.Util.hashHex(o2, "sha1");
            }, tn2.getJWKFromKey = function(t8) {
              var e2 = {};
              if (t8 instanceof Me && t8.isPrivate)
                return e2.kty = "RSA", e2.n = Tr(t8.n.toString(16)), e2.e = Tr(t8.e.toString(16)), e2.d = Tr(t8.d.toString(16)), e2.p = Tr(t8.p.toString(16)), e2.q = Tr(t8.q.toString(16)), e2.dp = Tr(t8.dmp1.toString(16)), e2.dq = Tr(t8.dmq1.toString(16)), e2.qi = Tr(t8.coeff.toString(16)), e2;
              if (t8 instanceof Me && t8.isPublic)
                return e2.kty = "RSA", e2.n = Tr(t8.n.toString(16)), e2.e = Tr(t8.e.toString(16)), e2;
              if (t8 instanceof Sr.crypto.ECDSA && t8.isPrivate) {
                if ("P-256" !== (n2 = t8.getShortNISTPCurveName()) && "P-384" !== n2)
                  throw new Error("unsupported curve name for JWT: " + n2);
                var r3 = t8.getPublicKeyXYHex();
                return e2.kty = "EC", e2.crv = n2, e2.x = Tr(r3.x), e2.y = Tr(r3.y), e2.d = Tr(t8.prvKeyHex), e2;
              }
              if (t8 instanceof Sr.crypto.ECDSA && t8.isPublic) {
                var n2;
                if ("P-256" !== (n2 = t8.getShortNISTPCurveName()) && "P-384" !== n2)
                  throw new Error("unsupported curve name for JWT: " + n2);
                r3 = t8.getPublicKeyXYHex();
                return e2.kty = "EC", e2.crv = n2, e2.x = Tr(r3.x), e2.y = Tr(r3.y), e2;
              }
              throw new Error("not supported key object");
            }, Me.getPosArrayOfChildrenFromHex = function(t8) {
              return Fr.getChildIdx(t8, 0);
            }, Me.getHexValueArrayOfChildrenFromHex = function(t8) {
              var e2, r3 = Fr.getV, n2 = r3(t8, (e2 = Me.getPosArrayOfChildrenFromHex(t8))[0]), i2 = r3(t8, e2[1]), o2 = r3(t8, e2[2]), s2 = r3(t8, e2[3]), a2 = r3(t8, e2[4]), u2 = r3(t8, e2[5]), c2 = r3(t8, e2[6]), h2 = r3(t8, e2[7]), l2 = r3(t8, e2[8]);
              return (e2 = new Array()).push(n2, i2, o2, s2, a2, u2, c2, h2, l2), e2;
            }, Me.prototype.readPrivateKeyFromPEMString = function(t8) {
              var e2 = Mr2(t8), r3 = Me.getHexValueArrayOfChildrenFromHex(e2);
              this.setPrivateEx(r3[1], r3[2], r3[3], r3[4], r3[5], r3[6], r3[7], r3[8]);
            }, Me.prototype.readPKCS5PrvKeyHex = function(t8) {
              var e2 = Me.getHexValueArrayOfChildrenFromHex(t8);
              this.setPrivateEx(e2[1], e2[2], e2[3], e2[4], e2[5], e2[6], e2[7], e2[8]);
            }, Me.prototype.readPKCS8PrvKeyHex = function(t8) {
              var e2, r3, n2, i2, o2, s2, a2, u2, c2 = Fr, h2 = c2.getVbyListEx;
              if (false === c2.isASN1HEX(t8))
                throw new Error("not ASN.1 hex string");
              try {
                e2 = h2(t8, 0, [2, 0, 1], "02"), r3 = h2(t8, 0, [2, 0, 2], "02"), n2 = h2(t8, 0, [2, 0, 3], "02"), i2 = h2(t8, 0, [2, 0, 4], "02"), o2 = h2(t8, 0, [2, 0, 5], "02"), s2 = h2(t8, 0, [2, 0, 6], "02"), a2 = h2(t8, 0, [2, 0, 7], "02"), u2 = h2(t8, 0, [2, 0, 8], "02");
              } catch (t9) {
                throw new Error("malformed PKCS#8 plain RSA private key");
              }
              this.setPrivateEx(e2, r3, n2, i2, o2, s2, a2, u2);
            }, Me.prototype.readPKCS5PubKeyHex = function(t8) {
              var e2 = Fr, r3 = e2.getV;
              if (false === e2.isASN1HEX(t8))
                throw new Error("keyHex is not ASN.1 hex string");
              var n2 = e2.getChildIdx(t8, 0);
              if (2 !== n2.length || "02" !== t8.substr(n2[0], 2) || "02" !== t8.substr(n2[1], 2))
                throw new Error("wrong hex for PKCS#5 public key");
              var i2 = r3(t8, n2[0]), o2 = r3(t8, n2[1]);
              this.setPublic(i2, o2);
            }, Me.prototype.readPKCS8PubKeyHex = function(t8) {
              var e2 = Fr;
              if (false === e2.isASN1HEX(t8))
                throw new Error("not ASN.1 hex string");
              if ("06092a864886f70d010101" !== e2.getTLVbyListEx(t8, 0, [0, 0]))
                throw new Error("not PKCS8 RSA public key");
              var r3 = e2.getTLVbyListEx(t8, 0, [1, 0]);
              this.readPKCS5PubKeyHex(r3);
            }, Me.prototype.readCertPubKeyHex = function(t8, e2) {
              var r3, n2;
              (r3 = new on()).readCertHex(t8), n2 = r3.getPublicKeyHex(), this.readPKCS8PubKeyHex(n2);
            };
            new RegExp("[^0-9a-f]", "gi");
            function en2(t8, e2) {
              for (var r3 = "", n2 = e2 / 4 - t8.length, i2 = 0; i2 < n2; i2++)
                r3 += "0";
              return r3 + t8;
            }
            function rn(t8, e2, r3) {
              for (var n2 = "", i2 = 0; n2.length < e2; )
                n2 += Lr(r3(Nr(t8 + String.fromCharCode.apply(String, [(4278190080 & i2) >> 24, (16711680 & i2) >> 16, (65280 & i2) >> 8, 255 & i2])))), i2 += 1;
              return n2;
            }
            function nn(t8) {
              for (var e2 in Sr.crypto.Util.DIGESTINFOHEAD) {
                var r3 = Sr.crypto.Util.DIGESTINFOHEAD[e2], n2 = r3.length;
                if (t8.substring(0, n2) == r3)
                  return [e2, t8.substring(n2)];
              }
              return [];
            }
            function on(t8) {
              var e2, r3 = Fr, n2 = r3.getChildIdx, i2 = r3.getV, o2 = r3.getTLV, s2 = r3.getVbyList, a2 = r3.getVbyListEx, u2 = r3.getTLVbyList, c2 = r3.getTLVbyListEx, h2 = r3.getIdxbyList, l2 = r3.getIdxbyListEx, f2 = r3.getVidx, g2 = r3.getInt, d2 = r3.oidname, p2 = r3.hextooidstr, v3 = Mr2;
              try {
                e2 = Sr.asn1.x509.AlgorithmIdentifier.PSSNAME2ASN1TLV;
              } catch (t9) {
              }
              this.HEX2STAG = { "0c": "utf8", 13: "prn", 16: "ia5", "1a": "vis", "1e": "bmp" }, this.hex = null, this.version = 0, this.foffset = 0, this.aExtInfo = null, this.getVersion = function() {
                if (null === this.hex || 0 !== this.version)
                  return this.version;
                var t9 = u2(this.hex, 0, [0, 0]);
                if ("a0" == t9.substr(0, 2)) {
                  var e3 = u2(t9, 0, [0]), r4 = g2(e3, 0);
                  if (r4 < 0 || 2 < r4)
                    throw new Error("malformed version field");
                  return this.version = r4 + 1, this.version;
                }
                return this.version = 1, this.foffset = -1, 1;
              }, this.getSerialNumberHex = function() {
                return a2(this.hex, 0, [0, 0], "02");
              }, this.getSignatureAlgorithmField = function() {
                var t9 = c2(this.hex, 0, [0, 1]);
                return this.getAlgorithmIdentifierName(t9);
              }, this.getAlgorithmIdentifierName = function(t9) {
                for (var r4 in e2)
                  if (t9 === e2[r4])
                    return r4;
                return d2(a2(t9, 0, [0], "06"));
              }, this.getIssuer = function() {
                return this.getX500Name(this.getIssuerHex());
              }, this.getIssuerHex = function() {
                return u2(this.hex, 0, [0, 3 + this.foffset], "30");
              }, this.getIssuerString = function() {
                return this.getIssuer().str;
              }, this.getSubject = function() {
                return this.getX500Name(this.getSubjectHex());
              }, this.getSubjectHex = function() {
                return u2(this.hex, 0, [0, 5 + this.foffset], "30");
              }, this.getSubjectString = function() {
                return this.getSubject().str;
              }, this.getNotBefore = function() {
                var t9 = s2(this.hex, 0, [0, 4 + this.foffset, 0]);
                return t9 = t9.replace(/(..)/g, "%$1"), t9 = decodeURIComponent(t9);
              }, this.getNotAfter = function() {
                var t9 = s2(this.hex, 0, [0, 4 + this.foffset, 1]);
                return t9 = t9.replace(/(..)/g, "%$1"), t9 = decodeURIComponent(t9);
              }, this.getPublicKeyHex = function() {
                return r3.getTLVbyList(this.hex, 0, [0, 6 + this.foffset], "30");
              }, this.getPublicKeyIdx = function() {
                return h2(this.hex, 0, [0, 6 + this.foffset], "30");
              }, this.getPublicKeyContentIdx = function() {
                var t9 = this.getPublicKeyIdx();
                return h2(this.hex, t9, [1, 0], "30");
              }, this.getPublicKey = function() {
                return tn2.getKey(this.getPublicKeyHex(), null, "pkcs8pub");
              }, this.getSignatureAlgorithmName = function() {
                var t9 = u2(this.hex, 0, [1], "30");
                return this.getAlgorithmIdentifierName(t9);
              }, this.getSignatureValueHex = function() {
                return s2(this.hex, 0, [2], "03", true);
              }, this.verifySignature = function(t9) {
                var e3 = this.getSignatureAlgorithmField(), r4 = this.getSignatureValueHex(), n3 = u2(this.hex, 0, [0], "30"), i3 = new Sr.crypto.Signature({ alg: e3 });
                return i3.init(t9), i3.updateHex(n3), i3.verify(r4);
              }, this.parseExt = function(t9) {
                var e3, o3, a3;
                if (void 0 === t9) {
                  if (a3 = this.hex, 3 !== this.version)
                    return -1;
                  e3 = h2(a3, 0, [0, 7, 0], "30"), o3 = n2(a3, e3);
                } else {
                  a3 = Mr2(t9);
                  var u3 = h2(a3, 0, [0, 3, 0, 0], "06");
                  if ("2a864886f70d01090e" != i2(a3, u3))
                    return void (this.aExtInfo = new Array());
                  e3 = h2(a3, 0, [0, 3, 0, 1, 0], "30"), o3 = n2(a3, e3), this.hex = a3;
                }
                this.aExtInfo = new Array();
                for (var c3 = 0; c3 < o3.length; c3++) {
                  var l3 = { critical: false }, g3 = 0;
                  3 === n2(a3, o3[c3]).length && (l3.critical = true, g3 = 1), l3.oid = r3.hextooidstr(s2(a3, o3[c3], [0], "06"));
                  var d3 = h2(a3, o3[c3], [1 + g3]);
                  l3.vidx = f2(a3, d3), this.aExtInfo.push(l3);
                }
              }, this.getExtInfo = function(t9) {
                var e3 = this.aExtInfo, r4 = t9;
                if (t9.match(/^[0-9.]+$/) || (r4 = Sr.asn1.x509.OID.name2oid(t9)), "" !== r4) {
                  for (var n3 = 0; n3 < e3.length; n3++)
                    if (e3[n3].oid === r4)
                      return e3[n3];
                }
              }, this.getExtBasicConstraints = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("basicConstraints");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var n3 = { extname: "basicConstraints" };
                if (e3 && (n3.critical = true), "3000" === t9)
                  return n3;
                if ("30030101ff" === t9)
                  return n3.cA = true, n3;
                if ("30060101ff02" === t9.substr(0, 12)) {
                  var s3 = i2(t9, 10), a3 = parseInt(s3, 16);
                  return n3.cA = true, n3.pathLen = a3, n3;
                }
                throw new Error("hExtV parse error: " + t9);
              }, this.getExtKeyUsage = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("keyUsage");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var n3 = { extname: "keyUsage" };
                return e3 && (n3.critical = true), n3.names = this.getExtKeyUsageString(t9).split(","), n3;
              }, this.getExtKeyUsageBin = function(t9) {
                if (void 0 === t9) {
                  var e3 = this.getExtInfo("keyUsage");
                  if (void 0 === e3)
                    return "";
                  t9 = o2(this.hex, e3.vidx);
                }
                if (8 != t9.length && 10 != t9.length)
                  throw new Error("malformed key usage value: " + t9);
                var r4 = "000000000000000" + parseInt(t9.substr(6), 16).toString(2);
                return 8 == t9.length && (r4 = r4.slice(-8)), 10 == t9.length && (r4 = r4.slice(-16)), "" == (r4 = r4.replace(/0+$/, "")) && (r4 = "0"), r4;
              }, this.getExtKeyUsageString = function(t9) {
                for (var e3 = this.getExtKeyUsageBin(t9), r4 = new Array(), n3 = 0; n3 < e3.length; n3++)
                  "1" == e3.substr(n3, 1) && r4.push(on.KEYUSAGE_NAME[n3]);
                return r4.join(",");
              }, this.getExtSubjectKeyIdentifier = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("subjectKeyIdentifier");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var n3 = { extname: "subjectKeyIdentifier" };
                e3 && (n3.critical = true);
                var s3 = i2(t9, 0);
                return n3.kid = { hex: s3 }, n3;
              }, this.getExtAuthorityKeyIdentifier = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("authorityKeyIdentifier");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var s3 = { extname: "authorityKeyIdentifier" };
                e3 && (s3.critical = true);
                for (var a3 = n2(t9, 0), u3 = 0; u3 < a3.length; u3++) {
                  var c3 = t9.substr(a3[u3], 2);
                  if ("80" === c3 && (s3.kid = { hex: i2(t9, a3[u3]) }), "a1" === c3) {
                    var h3 = o2(t9, a3[u3]), l3 = this.getGeneralNames(h3);
                    s3.issuer = l3[0].dn;
                  }
                  "82" === c3 && (s3.sn = { hex: i2(t9, a3[u3]) });
                }
                return s3;
              }, this.getExtExtKeyUsage = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("extKeyUsage");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var s3 = { extname: "extKeyUsage", array: [] };
                e3 && (s3.critical = true);
                for (var a3 = n2(t9, 0), u3 = 0; u3 < a3.length; u3++)
                  s3.array.push(d2(i2(t9, a3[u3])));
                return s3;
              }, this.getExtExtKeyUsageName = function() {
                var t9 = this.getExtInfo("extKeyUsage");
                if (void 0 === t9)
                  return t9;
                var e3 = new Array(), r4 = o2(this.hex, t9.vidx);
                if ("" === r4)
                  return e3;
                for (var s3 = n2(r4, 0), a3 = 0; a3 < s3.length; a3++)
                  e3.push(d2(i2(r4, s3[a3])));
                return e3;
              }, this.getExtSubjectAltName = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("subjectAltName");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var n3 = { extname: "subjectAltName", array: [] };
                return e3 && (n3.critical = true), n3.array = this.getGeneralNames(t9), n3;
              }, this.getExtIssuerAltName = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("issuerAltName");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var n3 = { extname: "issuerAltName", array: [] };
                return e3 && (n3.critical = true), n3.array = this.getGeneralNames(t9), n3;
              }, this.getGeneralNames = function(t9) {
                for (var e3 = n2(t9, 0), r4 = [], i3 = 0; i3 < e3.length; i3++) {
                  var s3 = this.getGeneralName(o2(t9, e3[i3]));
                  void 0 !== s3 && r4.push(s3);
                }
                return r4;
              }, this.getGeneralName = function(t9) {
                var e3 = t9.substr(0, 2), r4 = i2(t9, 0), n3 = Lr(r4);
                return "81" == e3 ? { rfc822: n3 } : "82" == e3 ? { dns: n3 } : "86" == e3 ? { uri: n3 } : "87" == e3 ? { ip: zr2(r4) } : "a4" == e3 ? { dn: this.getX500Name(r4) } : void 0;
              }, this.getExtSubjectAltName2 = function() {
                var t9, e3, r4, s3 = this.getExtInfo("subjectAltName");
                if (void 0 === s3)
                  return s3;
                for (var a3 = new Array(), u3 = o2(this.hex, s3.vidx), c3 = n2(u3, 0), h3 = 0; h3 < c3.length; h3++)
                  r4 = u3.substr(c3[h3], 2), t9 = i2(u3, c3[h3]), "81" === r4 && (e3 = Dr(t9), a3.push(["MAIL", e3])), "82" === r4 && (e3 = Dr(t9), a3.push(["DNS", e3])), "84" === r4 && (e3 = on.hex2dn(t9, 0), a3.push(["DN", e3])), "86" === r4 && (e3 = Dr(t9), a3.push(["URI", e3])), "87" === r4 && (e3 = zr2(t9), a3.push(["IP", e3]));
                return a3;
              }, this.getExtCRLDistributionPoints = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("cRLDistributionPoints");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var i3 = { extname: "cRLDistributionPoints", array: [] };
                e3 && (i3.critical = true);
                for (var s3 = n2(t9, 0), a3 = 0; a3 < s3.length; a3++) {
                  var u3 = o2(t9, s3[a3]);
                  i3.array.push(this.getDistributionPoint(u3));
                }
                return i3;
              }, this.getDistributionPoint = function(t9) {
                for (var e3 = {}, r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++) {
                  var s3 = t9.substr(r4[i3], 2), a3 = o2(t9, r4[i3]);
                  "a0" == s3 && (e3.dpname = this.getDistributionPointName(a3));
                }
                return e3;
              }, this.getDistributionPointName = function(t9) {
                for (var e3 = {}, r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++) {
                  var s3 = t9.substr(r4[i3], 2), a3 = o2(t9, r4[i3]);
                  "a0" == s3 && (e3.full = this.getGeneralNames(a3));
                }
                return e3;
              }, this.getExtCRLDistributionPointsURI = function() {
                var t9 = this.getExtInfo("cRLDistributionPoints");
                if (void 0 === t9)
                  return t9;
                for (var e3 = new Array(), r4 = n2(this.hex, t9.vidx), i3 = 0; i3 < r4.length; i3++)
                  try {
                    var o3 = Dr(s2(this.hex, r4[i3], [0, 0, 0], "86"));
                    e3.push(o3);
                  } catch (t10) {
                  }
                return e3;
              }, this.getExtAIAInfo = function() {
                var t9 = this.getExtInfo("authorityInfoAccess");
                if (void 0 === t9)
                  return t9;
                for (var e3 = { ocsp: [], caissuer: [] }, r4 = n2(this.hex, t9.vidx), i3 = 0; i3 < r4.length; i3++) {
                  var o3 = s2(this.hex, r4[i3], [0], "06"), a3 = s2(this.hex, r4[i3], [1], "86");
                  "2b06010505073001" === o3 && e3.ocsp.push(Dr(a3)), "2b06010505073002" === o3 && e3.caissuer.push(Dr(a3));
                }
                return e3;
              }, this.getExtAuthorityInfoAccess = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("authorityInfoAccess");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var i3 = { extname: "authorityInfoAccess", array: [] };
                e3 && (i3.critical = true);
                for (var u3 = n2(t9, 0), c3 = 0; c3 < u3.length; c3++) {
                  var h3 = a2(t9, u3[c3], [0], "06"), l3 = Dr(s2(t9, u3[c3], [1], "86"));
                  if ("2b06010505073001" == h3)
                    i3.array.push({ ocsp: l3 });
                  else {
                    if ("2b06010505073002" != h3)
                      throw new Error("unknown method: " + h3);
                    i3.array.push({ caissuer: l3 });
                  }
                }
                return i3;
              }, this.getExtCertificatePolicies = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("certificatePolicies");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var i3 = { extname: "certificatePolicies", array: [] };
                e3 && (i3.critical = true);
                for (var s3 = n2(t9, 0), a3 = 0; a3 < s3.length; a3++) {
                  var u3 = o2(t9, s3[a3]), c3 = this.getPolicyInformation(u3);
                  i3.array.push(c3);
                }
                return i3;
              }, this.getPolicyInformation = function(t9) {
                var e3 = {}, r4 = s2(t9, 0, [0], "06");
                e3.policyoid = d2(r4);
                var i3 = l2(t9, 0, [1], "30");
                if (-1 != i3) {
                  e3.array = [];
                  for (var a3 = n2(t9, i3), u3 = 0; u3 < a3.length; u3++) {
                    var c3 = o2(t9, a3[u3]), h3 = this.getPolicyQualifierInfo(c3);
                    e3.array.push(h3);
                  }
                }
                return e3;
              }, this.getPolicyQualifierInfo = function(t9) {
                var e3 = {}, r4 = s2(t9, 0, [0], "06");
                if ("2b06010505070201" === r4) {
                  var n3 = a2(t9, 0, [1], "16");
                  e3.cps = Lr(n3);
                } else if ("2b06010505070202" === r4) {
                  var i3 = u2(t9, 0, [1], "30");
                  e3.unotice = this.getUserNotice(i3);
                }
                return e3;
              }, this.getUserNotice = function(t9) {
                for (var e3 = {}, r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++) {
                  var s3 = o2(t9, r4[i3]);
                  "30" != s3.substr(0, 2) && (e3.exptext = this.getDisplayText(s3));
                }
                return e3;
              }, this.getDisplayText = function(t9) {
                var e3 = {};
                return e3.type = { "0c": "utf8", 16: "ia5", "1a": "vis", "1e": "bmp" }[t9.substr(0, 2)], e3.str = Lr(i2(t9, 0)), e3;
              }, this.getExtCRLNumber = function(t9, e3) {
                var r4 = { extname: "cRLNumber" };
                if (e3 && (r4.critical = true), "02" == t9.substr(0, 2))
                  return r4.num = { hex: i2(t9, 0) }, r4;
                throw new Error("hExtV parse error: " + t9);
              }, this.getExtCRLReason = function(t9, e3) {
                var r4 = { extname: "cRLReason" };
                if (e3 && (r4.critical = true), "0a" == t9.substr(0, 2))
                  return r4.code = parseInt(i2(t9, 0), 16), r4;
                throw new Error("hExtV parse error: " + t9);
              }, this.getExtOcspNonce = function(t9, e3) {
                var r4 = { extname: "ocspNonce" };
                e3 && (r4.critical = true);
                var n3 = i2(t9, 0);
                return r4.hex = n3, r4;
              }, this.getExtOcspNoCheck = function(t9, e3) {
                var r4 = { extname: "ocspNoCheck" };
                return e3 && (r4.critical = true), r4;
              }, this.getExtAdobeTimeStamp = function(t9, e3) {
                if (void 0 === t9 && void 0 === e3) {
                  var r4 = this.getExtInfo("adobeTimeStamp");
                  if (void 0 === r4)
                    return;
                  t9 = o2(this.hex, r4.vidx), e3 = r4.critical;
                }
                var i3 = { extname: "adobeTimeStamp" };
                e3 && (i3.critical = true);
                var s3 = n2(t9, 0);
                if (s3.length > 1) {
                  var a3 = o2(t9, s3[1]), u3 = this.getGeneralName(a3);
                  null != u3.uri && (i3.uri = u3.uri);
                }
                if (s3.length > 2) {
                  var c3 = o2(t9, s3[2]);
                  "0101ff" == c3 && (i3.reqauth = true), "010100" == c3 && (i3.reqauth = false);
                }
                return i3;
              }, this.getX500NameRule = function(t9) {
                for (var e3 = null, r4 = [], n3 = 0; n3 < t9.length; n3++)
                  for (var i3 = t9[n3], o3 = 0; o3 < i3.length; o3++)
                    r4.push(i3[o3]);
                for (n3 = 0; n3 < r4.length; n3++) {
                  var s3 = r4[n3], a3 = s3.ds, u3 = s3.value, c3 = s3.type;
                  if (":" + a3, "prn" != a3 && "utf8" != a3 && "ia5" != a3)
                    return "mixed";
                  if ("ia5" == a3) {
                    if ("CN" != c3)
                      return "mixed";
                    if (Sr.lang.String.isMail(u3))
                      continue;
                    return "mixed";
                  }
                  if ("C" == c3) {
                    if ("prn" == a3)
                      continue;
                    return "mixed";
                  }
                  if (":" + a3, null == e3)
                    e3 = a3;
                  else if (e3 !== a3)
                    return "mixed";
                }
                return null == e3 ? "prn" : e3;
              }, this.getX500Name = function(t9) {
                var e3 = this.getX500NameArray(t9);
                return { array: e3, str: this.dnarraytostr(e3) };
              }, this.getX500NameArray = function(t9) {
                for (var e3 = [], r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++)
                  e3.push(this.getRDN(o2(t9, r4[i3])));
                return e3;
              }, this.getRDN = function(t9) {
                for (var e3 = [], r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++)
                  e3.push(this.getAttrTypeAndValue(o2(t9, r4[i3])));
                return e3;
              }, this.getAttrTypeAndValue = function(t9) {
                var e3 = { type: null, value: null, ds: null }, r4 = n2(t9, 0), i3 = s2(t9, r4[0], [], "06"), o3 = s2(t9, r4[1], []), a3 = Sr.asn1.ASN1Util.oidHexToInt(i3);
                return e3.type = Sr.asn1.x509.OID.oid2atype(a3), e3.ds = this.HEX2STAG[t9.substr(r4[1], 2)], "bmp" != e3.ds ? e3.value = Dr(o3) : e3.value = Yr2(o3), e3;
              }, this.readCertPEM = function(t9) {
                this.readCertHex(v3(t9));
              }, this.readCertHex = function(t9) {
                this.hex = t9, this.getVersion();
                try {
                  h2(this.hex, 0, [0, 7], "a3"), this.parseExt();
                } catch (t10) {
                }
              }, this.getParam = function() {
                var t9 = {};
                return t9.version = this.getVersion(), t9.serial = { hex: this.getSerialNumberHex() }, t9.sigalg = this.getSignatureAlgorithmField(), t9.issuer = this.getIssuer(), t9.notbefore = this.getNotBefore(), t9.notafter = this.getNotAfter(), t9.subject = this.getSubject(), t9.sbjpubkey = jr2(this.getPublicKeyHex(), "PUBLIC KEY"), this.aExtInfo.length > 0 && (t9.ext = this.getExtParamArray()), t9.sighex = this.getSignatureValueHex(), t9;
              }, this.getExtParamArray = function(t9) {
                null == t9 && (-1 != l2(this.hex, 0, [0, "[3]"]) && (t9 = c2(this.hex, 0, [0, "[3]", 0], "30")));
                for (var e3 = [], r4 = n2(t9, 0), i3 = 0; i3 < r4.length; i3++) {
                  var s3 = o2(t9, r4[i3]), a3 = this.getExtParam(s3);
                  null != a3 && e3.push(a3);
                }
                return e3;
              }, this.getExtParam = function(t9) {
                var e3 = n2(t9, 0).length;
                if (2 != e3 && 3 != e3)
                  throw new Error("wrong number elements in Extension: " + e3 + " " + t9);
                var r4 = p2(s2(t9, 0, [0], "06")), i3 = false;
                3 == e3 && "0101ff" == u2(t9, 0, [1]) && (i3 = true);
                var o3 = u2(t9, 0, [e3 - 1, 0]), a3 = void 0;
                if ("2.5.29.14" == r4 ? a3 = this.getExtSubjectKeyIdentifier(o3, i3) : "2.5.29.15" == r4 ? a3 = this.getExtKeyUsage(o3, i3) : "2.5.29.17" == r4 ? a3 = this.getExtSubjectAltName(o3, i3) : "2.5.29.18" == r4 ? a3 = this.getExtIssuerAltName(o3, i3) : "2.5.29.19" == r4 ? a3 = this.getExtBasicConstraints(o3, i3) : "2.5.29.31" == r4 ? a3 = this.getExtCRLDistributionPoints(o3, i3) : "2.5.29.32" == r4 ? a3 = this.getExtCertificatePolicies(o3, i3) : "2.5.29.35" == r4 ? a3 = this.getExtAuthorityKeyIdentifier(o3, i3) : "2.5.29.37" == r4 ? a3 = this.getExtExtKeyUsage(o3, i3) : "1.3.6.1.5.5.7.1.1" == r4 ? a3 = this.getExtAuthorityInfoAccess(o3, i3) : "2.5.29.20" == r4 ? a3 = this.getExtCRLNumber(o3, i3) : "2.5.29.21" == r4 ? a3 = this.getExtCRLReason(o3, i3) : "1.3.6.1.5.5.7.48.1.2" == r4 ? a3 = this.getExtOcspNonce(o3, i3) : "1.3.6.1.5.5.7.48.1.5" == r4 ? a3 = this.getExtOcspNoCheck(o3, i3) : "1.2.840.113583.1.1.9.1" == r4 && (a3 = this.getExtAdobeTimeStamp(o3, i3)), null != a3)
                  return a3;
                var c3 = { extname: r4, extn: o3 };
                return i3 && (c3.critical = true), c3;
              }, this.findExt = function(t9, e3) {
                for (var r4 = 0; r4 < t9.length; r4++)
                  if (t9[r4].extname == e3)
                    return t9[r4];
                return null;
              }, this.updateExtCDPFullURI = function(t9, e3) {
                var r4 = this.findExt(t9, "cRLDistributionPoints");
                if (null != r4 && null != r4.array) {
                  for (var n3 = r4.array, i3 = 0; i3 < n3.length; i3++)
                    if (null != n3[i3].dpname && null != n3[i3].dpname.full)
                      for (var o3 = n3[i3].dpname.full, s3 = 0; s3 < o3.length; s3++) {
                        var a3 = o3[i3];
                        null != a3.uri && (a3.uri = e3);
                      }
                }
              }, this.updateExtAIAOCSP = function(t9, e3) {
                var r4 = this.findExt(t9, "authorityInfoAccess");
                if (null != r4 && null != r4.array)
                  for (var n3 = r4.array, i3 = 0; i3 < n3.length; i3++)
                    null != n3[i3].ocsp && (n3[i3].ocsp = e3);
              }, this.updateExtAIACAIssuer = function(t9, e3) {
                var r4 = this.findExt(t9, "authorityInfoAccess");
                if (null != r4 && null != r4.array)
                  for (var n3 = r4.array, i3 = 0; i3 < n3.length; i3++)
                    null != n3[i3].caissuer && (n3[i3].caissuer = e3);
              }, this.dnarraytostr = function(t9) {
                return "/" + t9.map(function(t10) {
                  return function e3(t11) {
                    return t11.map(function(t12) {
                      return function e4(t13) {
                        return t13.type + "=" + t13.value;
                      }(t12).replace(/\+/, "\\+");
                    }).join("+");
                  }(t10).replace(/\//, "\\/");
                }).join("/");
              }, this.getInfo = function() {
                var t9, e3, r4, n3 = function t10(e4) {
                  return JSON.stringify(e4.array).replace(/[\[\]\{\}\"]/g, "");
                }, i3 = function t10(e4) {
                  for (var r5 = "", n4 = e4.array, i4 = 0; i4 < n4.length; i4++) {
                    var o4 = n4[i4];
                    if (r5 += "    policy oid: " + o4.policyoid + "\n", void 0 !== o4.array)
                      for (var s4 = 0; s4 < o4.array.length; s4++) {
                        var a4 = o4.array[s4];
                        void 0 !== a4.cps && (r5 += "    cps: " + a4.cps + "\n");
                      }
                  }
                  return r5;
                }, o3 = function t10(e4) {
                  for (var r5 = "", n4 = e4.array, i4 = 0; i4 < n4.length; i4++) {
                    var o4 = n4[i4];
                    try {
                      void 0 !== o4.dpname.full[0].uri && (r5 += "    " + o4.dpname.full[0].uri + "\n");
                    } catch (t11) {
                    }
                    try {
                      void 0 !== o4.dname.full[0].dn.hex && (r5 += "    " + on.hex2dn(o4.dpname.full[0].dn.hex) + "\n");
                    } catch (t11) {
                    }
                  }
                  return r5;
                }, s3 = function t10(e4) {
                  for (var r5 = "", n4 = e4.array, i4 = 0; i4 < n4.length; i4++) {
                    var o4 = n4[i4];
                    void 0 !== o4.caissuer && (r5 += "    caissuer: " + o4.caissuer + "\n"), void 0 !== o4.ocsp && (r5 += "    ocsp: " + o4.ocsp + "\n");
                  }
                  return r5;
                };
                if (t9 = "Basic Fields\n", t9 += "  serial number: " + this.getSerialNumberHex() + "\n", t9 += "  signature algorithm: " + this.getSignatureAlgorithmField() + "\n", t9 += "  issuer: " + this.getIssuerString() + "\n", t9 += "  notBefore: " + this.getNotBefore() + "\n", t9 += "  notAfter: " + this.getNotAfter() + "\n", t9 += "  subject: " + this.getSubjectString() + "\n", t9 += "  subject public key info: \n", t9 += "    key algorithm: " + (e3 = this.getPublicKey()).type + "\n", "RSA" === e3.type && (t9 += "    n=" + $r(e3.n.toString(16)).substr(0, 16) + "...\n", t9 += "    e=" + $r(e3.e.toString(16)) + "\n"), null != (r4 = this.aExtInfo)) {
                  t9 += "X509v3 Extensions:\n";
                  for (var a3 = 0; a3 < r4.length; a3++) {
                    var u3 = r4[a3], c3 = Sr.asn1.x509.OID.oid2name(u3.oid);
                    "" === c3 && (c3 = u3.oid);
                    var h3 = "";
                    if (true === u3.critical && (h3 = "CRITICAL"), t9 += "  " + c3 + " " + h3 + ":\n", "basicConstraints" === c3) {
                      var l3 = this.getExtBasicConstraints();
                      void 0 === l3.cA ? t9 += "    {}\n" : (t9 += "    cA=true", void 0 !== l3.pathLen && (t9 += ", pathLen=" + l3.pathLen), t9 += "\n");
                    } else if ("keyUsage" === c3)
                      t9 += "    " + this.getExtKeyUsageString() + "\n";
                    else if ("subjectKeyIdentifier" === c3)
                      t9 += "    " + this.getExtSubjectKeyIdentifier().kid.hex + "\n";
                    else if ("authorityKeyIdentifier" === c3) {
                      var f3 = this.getExtAuthorityKeyIdentifier();
                      void 0 !== f3.kid && (t9 += "    kid=" + f3.kid.hex + "\n");
                    } else {
                      if ("extKeyUsage" === c3)
                        t9 += "    " + this.getExtExtKeyUsage().array.join(", ") + "\n";
                      else if ("subjectAltName" === c3)
                        t9 += "    " + n3(this.getExtSubjectAltName()) + "\n";
                      else if ("cRLDistributionPoints" === c3)
                        t9 += o3(this.getExtCRLDistributionPoints());
                      else if ("authorityInfoAccess" === c3)
                        t9 += s3(this.getExtAuthorityInfoAccess());
                      else
                        "certificatePolicies" === c3 && (t9 += i3(this.getExtCertificatePolicies()));
                    }
                  }
                }
                return t9 += "signature algorithm: " + this.getSignatureAlgorithmName() + "\n", t9 += "signature: " + this.getSignatureValueHex().substr(0, 16) + "...\n";
              }, "string" == typeof t8 && (-1 != t8.indexOf("-----BEGIN") ? this.readCertPEM(t8) : Sr.lang.String.isHex(t8) && this.readCertHex(t8));
            }
            Me.prototype.sign = function(t8, e2) {
              var r3 = function t9(r4) {
                return Sr.crypto.Util.hashString(r4, e2);
              }(t8);
              return this.signWithMessageHash(r3, e2);
            }, Me.prototype.signWithMessageHash = function(t8, e2) {
              var r3 = Oe(Sr.crypto.Util.getPaddedDigestInfoHex(t8, e2, this.n.bitLength()), 16);
              return en2(this.doPrivate(r3).toString(16), this.n.bitLength());
            }, Me.prototype.signPSS = function(t8, e2, r3) {
              var n2 = function t9(r4) {
                return Sr.crypto.Util.hashHex(r4, e2);
              }(Nr(t8));
              return void 0 === r3 && (r3 = -1), this.signWithMessageHashPSS(n2, e2, r3);
            }, Me.prototype.signWithMessageHashPSS = function(t8, e2, r3) {
              var n2, i2 = Lr(t8), o2 = i2.length, s2 = this.n.bitLength() - 1, a2 = Math.ceil(s2 / 8), u2 = function t9(r4) {
                return Sr.crypto.Util.hashHex(r4, e2);
              };
              if (-1 === r3 || void 0 === r3)
                r3 = o2;
              else if (-2 === r3)
                r3 = a2 - o2 - 2;
              else if (r3 < -2)
                throw new Error("invalid salt length");
              if (a2 < o2 + r3 + 2)
                throw new Error("data too long");
              var c2 = "";
              r3 > 0 && (c2 = new Array(r3), new Be2().nextBytes(c2), c2 = String.fromCharCode.apply(String, c2));
              var h2 = Lr(u2(Nr("\0\0\0\0\0\0\0\0" + i2 + c2))), l2 = [];
              for (n2 = 0; n2 < a2 - r3 - o2 - 2; n2 += 1)
                l2[n2] = 0;
              var f2 = String.fromCharCode.apply(String, l2) + "" + c2, g2 = rn(h2, f2.length, u2), d2 = [];
              for (n2 = 0; n2 < f2.length; n2 += 1)
                d2[n2] = f2.charCodeAt(n2) ^ g2.charCodeAt(n2);
              var p2 = 65280 >> 8 * a2 - s2 & 255;
              for (d2[0] &= ~p2, n2 = 0; n2 < o2; n2++)
                d2.push(h2.charCodeAt(n2));
              return d2.push(188), en2(this.doPrivate(new w(d2)).toString(16), this.n.bitLength());
            }, Me.prototype.verify = function(t8, e2) {
              if (null == (e2 = e2.toLowerCase()).match(/^[0-9a-f]+$/))
                return false;
              var r3 = Oe(e2, 16), n2 = this.n.bitLength();
              if (r3.bitLength() > n2)
                return false;
              var i2 = this.doPublic(r3).toString(16);
              if (i2.length + 3 != n2 / 4)
                return false;
              var o2 = nn(i2.replace(/^1f+00/, ""));
              if (0 == o2.length)
                return false;
              var s2 = o2[0];
              return o2[1] == function t9(e3) {
                return Sr.crypto.Util.hashString(e3, s2);
              }(t8);
            }, Me.prototype.verifyWithMessageHash = function(t8, e2) {
              if (e2.length != Math.ceil(this.n.bitLength() / 4))
                return false;
              var r3 = Oe(e2, 16);
              if (r3.bitLength() > this.n.bitLength())
                return 0;
              var n2 = nn(this.doPublic(r3).toString(16).replace(/^1f+00/, ""));
              if (0 == n2.length)
                return false;
              n2[0];
              return n2[1] == t8;
            }, Me.prototype.verifyPSS = function(t8, e2, r3, n2) {
              var i2 = function t9(e3) {
                return Sr.crypto.Util.hashHex(e3, r3);
              }(Nr(t8));
              return void 0 === n2 && (n2 = -1), this.verifyWithMessageHashPSS(i2, e2, r3, n2);
            }, Me.prototype.verifyWithMessageHashPSS = function(t8, e2, r3, n2) {
              if (e2.length != Math.ceil(this.n.bitLength() / 4))
                return false;
              var i2, o2 = new w(e2, 16), s2 = function t9(e3) {
                return Sr.crypto.Util.hashHex(e3, r3);
              }, a2 = Lr(t8), u2 = a2.length, c2 = this.n.bitLength() - 1, h2 = Math.ceil(c2 / 8);
              if (-1 === n2 || void 0 === n2)
                n2 = u2;
              else if (-2 === n2)
                n2 = h2 - u2 - 2;
              else if (n2 < -2)
                throw new Error("invalid salt length");
              if (h2 < u2 + n2 + 2)
                throw new Error("data too long");
              var l2 = this.doPublic(o2).toByteArray();
              for (i2 = 0; i2 < l2.length; i2 += 1)
                l2[i2] &= 255;
              for (; l2.length < h2; )
                l2.unshift(0);
              if (188 !== l2[h2 - 1])
                throw new Error("encoded message does not end in 0xbc");
              var f2 = (l2 = String.fromCharCode.apply(String, l2)).substr(0, h2 - u2 - 1), g2 = l2.substr(f2.length, u2), d2 = 65280 >> 8 * h2 - c2 & 255;
              if (0 != (f2.charCodeAt(0) & d2))
                throw new Error("bits beyond keysize not zero");
              var p2 = rn(g2, f2.length, s2), v3 = [];
              for (i2 = 0; i2 < f2.length; i2 += 1)
                v3[i2] = f2.charCodeAt(i2) ^ p2.charCodeAt(i2);
              v3[0] &= ~d2;
              var y2 = h2 - u2 - n2 - 2;
              for (i2 = 0; i2 < y2; i2 += 1)
                if (0 !== v3[i2])
                  throw new Error("leftmost octets not zero");
              if (1 !== v3[y2])
                throw new Error("0x01 marker not found");
              return g2 === Lr(s2(Nr("\0\0\0\0\0\0\0\0" + a2 + String.fromCharCode.apply(String, v3.slice(-n2)))));
            }, Me.SALT_LEN_HLEN = -1, Me.SALT_LEN_MAX = -2, Me.SALT_LEN_RECOVER = -2, on.hex2dn = function(t8, e2) {
              void 0 === e2 && (e2 = 0);
              var r3 = new on();
              Fr.getTLV(t8, e2);
              return r3.getX500Name(t8).str;
            }, on.hex2rdn = function(t8, e2) {
              if (void 0 === e2 && (e2 = 0), "31" !== t8.substr(e2, 2))
                throw new Error("malformed RDN");
              for (var r3 = new Array(), n2 = Fr.getChildIdx(t8, e2), i2 = 0; i2 < n2.length; i2++)
                r3.push(on.hex2attrTypeValue(t8, n2[i2]));
              return (r3 = r3.map(function(t9) {
                return t9.replace("+", "\\+");
              })).join("+");
            }, on.hex2attrTypeValue = function(t8, e2) {
              var r3 = Fr, n2 = r3.getV;
              if (void 0 === e2 && (e2 = 0), "30" !== t8.substr(e2, 2))
                throw new Error("malformed attribute type and value");
              var i2 = r3.getChildIdx(t8, e2);
              2 !== i2.length || t8.substr(i2[0], 2);
              var o2 = n2(t8, i2[0]), s2 = Sr.asn1.ASN1Util.oidHexToInt(o2);
              return Sr.asn1.x509.OID.oid2atype(s2) + "=" + Lr(n2(t8, i2[1]));
            }, on.getPublicKeyFromCertHex = function(t8) {
              var e2 = new on();
              return e2.readCertHex(t8), e2.getPublicKey();
            }, on.getPublicKeyFromCertPEM = function(t8) {
              var e2 = new on();
              return e2.readCertPEM(t8), e2.getPublicKey();
            }, on.getPublicKeyInfoPropOfCertPEM = function(t8) {
              var e2, r3, n2 = Fr.getVbyList, i2 = {};
              return i2.algparam = null, (e2 = new on()).readCertPEM(t8), r3 = e2.getPublicKeyHex(), i2.keyhex = n2(r3, 0, [1], "03").substr(2), i2.algoid = n2(r3, 0, [0, 0], "06"), "2a8648ce3d0201" === i2.algoid && (i2.algparam = n2(r3, 0, [0, 1], "06")), i2;
            }, on.KEYUSAGE_NAME = ["digitalSignature", "nonRepudiation", "keyEncipherment", "dataEncipherment", "keyAgreement", "keyCertSign", "cRLSign", "encipherOnly", "decipherOnly"], void 0 !== Sr && Sr || (e.KJUR = Sr = {}), void 0 !== Sr.jws && Sr.jws || (Sr.jws = {}), Sr.jws.JWS = function() {
              var t8 = Sr.jws.JWS.isSafeJSONString;
              this.parseJWS = function(e2, r3) {
                if (void 0 === this.parsedJWS || !r3 && void 0 === this.parsedJWS.sigvalH) {
                  var n2 = e2.match(/^([^.]+)\.([^.]+)\.([^.]+)$/);
                  if (null == n2)
                    throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
                  var i2 = n2[1], o2 = n2[2], s2 = n2[3], a2 = i2 + "." + o2;
                  if (this.parsedJWS = {}, this.parsedJWS.headB64U = i2, this.parsedJWS.payloadB64U = o2, this.parsedJWS.sigvalB64U = s2, this.parsedJWS.si = a2, !r3) {
                    var u2 = Rr(s2), c2 = Oe(u2, 16);
                    this.parsedJWS.sigvalH = u2, this.parsedJWS.sigvalBI = c2;
                  }
                  var h2 = wr(i2), l2 = wr(o2);
                  if (this.parsedJWS.headS = h2, this.parsedJWS.payloadS = l2, !t8(h2, this.parsedJWS, "headP"))
                    throw "malformed JSON string for JWS Head: " + h2;
                }
              };
            }, Sr.jws.JWS.sign = function(t8, e2, r3, n2, i2) {
              var o2, s2, a2, u2 = Sr, c2 = u2.jws.JWS, h2 = c2.readSafeJSONString, l2 = c2.isSafeJSONString, f2 = u2.crypto, d2 = (f2.ECDSA, f2.Mac), p2 = f2.Signature, v3 = JSON;
              if ("string" != typeof e2 && "object" != (void 0 === e2 ? "undefined" : g(e2)))
                throw "spHeader must be JSON string or object: " + e2;
              if ("object" == (void 0 === e2 ? "undefined" : g(e2)) && (s2 = e2, o2 = v3.stringify(s2)), "string" == typeof e2) {
                if (!l2(o2 = e2))
                  throw "JWS Head is not safe JSON string: " + o2;
                s2 = h2(o2);
              }
              if (a2 = r3, "object" == (void 0 === r3 ? "undefined" : g(r3)) && (a2 = v3.stringify(r3)), "" != t8 && null != t8 || void 0 === s2.alg || (t8 = s2.alg), "" != t8 && null != t8 && void 0 === s2.alg && (s2.alg = t8, o2 = v3.stringify(s2)), t8 !== s2.alg)
                throw "alg and sHeader.alg doesn't match: " + t8 + "!=" + s2.alg;
              var y2 = null;
              if (void 0 === c2.jwsalg2sigalg[t8])
                throw "unsupported alg name: " + t8;
              y2 = c2.jwsalg2sigalg[t8];
              var m2 = br(o2) + "." + br(a2), _2 = "";
              if ("Hmac" == y2.substr(0, 4)) {
                if (void 0 === n2)
                  throw "mac key shall be specified for HS* alg";
                var S2 = new d2({ alg: y2, prov: "cryptojs", pass: n2 });
                S2.updateString(m2), _2 = S2.doFinal();
              } else if (-1 != y2.indexOf("withECDSA")) {
                (w2 = new p2({ alg: y2 })).init(n2, i2), w2.updateString(m2);
                var b2 = w2.sign();
                _2 = Sr.crypto.ECDSA.asn1SigToConcatSig(b2);
              } else {
                var w2;
                if ("none" != y2)
                  (w2 = new p2({ alg: y2 })).init(n2, i2), w2.updateString(m2), _2 = w2.sign();
              }
              return m2 + "." + Tr(_2);
            }, Sr.jws.JWS.verify = function(t8, e2, r3) {
              var n2, i2 = Sr, o2 = i2.jws.JWS, s2 = o2.readSafeJSONString, a2 = i2.crypto, u2 = a2.ECDSA, c2 = a2.Mac, h2 = a2.Signature;
              void 0 !== g(Me) && (n2 = Me);
              var l2 = t8.split(".");
              if (3 !== l2.length)
                return false;
              var f2 = l2[0] + "." + l2[1], d2 = Rr(l2[2]), p2 = s2(wr(l2[0])), v3 = null, y2 = null;
              if (void 0 === p2.alg)
                throw "algorithm not specified in header";
              if ((y2 = (v3 = p2.alg).substr(0, 2), null != r3 && "[object Array]" === Object.prototype.toString.call(r3) && r3.length > 0) && -1 == (":" + r3.join(":") + ":").indexOf(":" + v3 + ":"))
                throw "algorithm '" + v3 + "' not accepted in the list";
              if ("none" != v3 && null === e2)
                throw "key shall be specified to verify.";
              if ("string" == typeof e2 && -1 != e2.indexOf("-----BEGIN ") && (e2 = tn2.getKey(e2)), !("RS" != y2 && "PS" != y2 || e2 instanceof n2))
                throw "key shall be a RSAKey obj for RS* and PS* algs";
              if ("ES" == y2 && !(e2 instanceof u2))
                throw "key shall be a ECDSA obj for ES* algs";
              var m2 = null;
              if (void 0 === o2.jwsalg2sigalg[p2.alg])
                throw "unsupported alg name: " + v3;
              if ("none" == (m2 = o2.jwsalg2sigalg[v3]))
                throw "not supported";
              if ("Hmac" == m2.substr(0, 4)) {
                if (void 0 === e2)
                  throw "hexadecimal key shall be specified for HMAC";
                var _2 = new c2({ alg: m2, pass: e2 });
                return _2.updateString(f2), d2 == _2.doFinal();
              }
              if (-1 != m2.indexOf("withECDSA")) {
                var S2, b2 = null;
                try {
                  b2 = u2.concatSigToASN1Sig(d2);
                } catch (t9) {
                  return false;
                }
                return (S2 = new h2({ alg: m2 })).init(e2), S2.updateString(f2), S2.verify(b2);
              }
              return (S2 = new h2({ alg: m2 })).init(e2), S2.updateString(f2), S2.verify(d2);
            }, Sr.jws.JWS.parse = function(t8) {
              var e2, r3, n2, i2 = t8.split("."), o2 = {};
              if (2 != i2.length && 3 != i2.length)
                throw "malformed sJWS: wrong number of '.' splitted elements";
              return e2 = i2[0], r3 = i2[1], 3 == i2.length && (n2 = i2[2]), o2.headerObj = Sr.jws.JWS.readSafeJSONString(wr(e2)), o2.payloadObj = Sr.jws.JWS.readSafeJSONString(wr(r3)), o2.headerPP = JSON.stringify(o2.headerObj, null, "  "), null == o2.payloadObj ? o2.payloadPP = wr(r3) : o2.payloadPP = JSON.stringify(o2.payloadObj, null, "  "), void 0 !== n2 && (o2.sigHex = Rr(n2)), o2;
            }, Sr.jws.JWS.verifyJWT = function(t8, e2, r3) {
              var n2 = Sr.jws, i2 = n2.JWS, o2 = i2.readSafeJSONString, s2 = i2.inArray, a2 = i2.includedArray, u2 = t8.split("."), c2 = u2[0], h2 = u2[1], l2 = (Rr(u2[2]), o2(wr(c2))), f2 = o2(wr(h2));
              if (void 0 === l2.alg)
                return false;
              if (void 0 === r3.alg)
                throw "acceptField.alg shall be specified";
              if (!s2(l2.alg, r3.alg))
                return false;
              if (void 0 !== f2.iss && "object" === g(r3.iss) && !s2(f2.iss, r3.iss))
                return false;
              if (void 0 !== f2.sub && "object" === g(r3.sub) && !s2(f2.sub, r3.sub))
                return false;
              if (void 0 !== f2.aud && "object" === g(r3.aud)) {
                if ("string" == typeof f2.aud) {
                  if (!s2(f2.aud, r3.aud))
                    return false;
                } else if ("object" == g(f2.aud) && !a2(f2.aud, r3.aud))
                  return false;
              }
              var d2 = n2.IntDate.getNow();
              return void 0 !== r3.verifyAt && "number" == typeof r3.verifyAt && (d2 = r3.verifyAt), void 0 !== r3.gracePeriod && "number" == typeof r3.gracePeriod || (r3.gracePeriod = 0), !(void 0 !== f2.exp && "number" == typeof f2.exp && f2.exp + r3.gracePeriod < d2) && (!(void 0 !== f2.nbf && "number" == typeof f2.nbf && d2 < f2.nbf - r3.gracePeriod) && (!(void 0 !== f2.iat && "number" == typeof f2.iat && d2 < f2.iat - r3.gracePeriod) && ((void 0 === f2.jti || void 0 === r3.jti || f2.jti === r3.jti) && !!i2.verify(t8, e2, r3.alg))));
            }, Sr.jws.JWS.includedArray = function(t8, e2) {
              var r3 = Sr.jws.JWS.inArray;
              if (null === t8)
                return false;
              if ("object" !== (void 0 === t8 ? "undefined" : g(t8)))
                return false;
              if ("number" != typeof t8.length)
                return false;
              for (var n2 = 0; n2 < t8.length; n2++)
                if (!r3(t8[n2], e2))
                  return false;
              return true;
            }, Sr.jws.JWS.inArray = function(t8, e2) {
              if (null === e2)
                return false;
              if ("object" !== (void 0 === e2 ? "undefined" : g(e2)))
                return false;
              if ("number" != typeof e2.length)
                return false;
              for (var r3 = 0; r3 < e2.length; r3++)
                if (e2[r3] == t8)
                  return true;
              return false;
            }, Sr.jws.JWS.jwsalg2sigalg = { HS256: "HmacSHA256", HS384: "HmacSHA384", HS512: "HmacSHA512", RS256: "SHA256withRSA", RS384: "SHA384withRSA", RS512: "SHA512withRSA", ES256: "SHA256withECDSA", ES384: "SHA384withECDSA", PS256: "SHA256withRSAandMGF1", PS384: "SHA384withRSAandMGF1", PS512: "SHA512withRSAandMGF1", none: "none" }, Sr.jws.JWS.isSafeJSONString = function(t8, e2, r3) {
              var n2 = null;
              try {
                return "object" != (void 0 === (n2 = _r(t8)) ? "undefined" : g(n2)) || n2.constructor === Array ? 0 : (e2 && (e2[r3] = n2), 1);
              } catch (t9) {
                return 0;
              }
            }, Sr.jws.JWS.readSafeJSONString = function(t8) {
              var e2 = null;
              try {
                return "object" != (void 0 === (e2 = _r(t8)) ? "undefined" : g(e2)) || e2.constructor === Array ? null : e2;
              } catch (t9) {
                return null;
              }
            }, Sr.jws.JWS.getEncodedSignatureValueFromJWS = function(t8) {
              var e2 = t8.match(/^[^.]+\.[^.]+\.([^.]+)$/);
              if (null == e2)
                throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
              return e2[1];
            }, Sr.jws.JWS.getJWKthumbprint = function(t8) {
              if ("RSA" !== t8.kty && "EC" !== t8.kty && "oct" !== t8.kty)
                throw "unsupported algorithm for JWK Thumprint";
              var e2 = "{";
              if ("RSA" === t8.kty) {
                if ("string" != typeof t8.n || "string" != typeof t8.e)
                  throw "wrong n and e value for RSA key";
                e2 += '"e":"' + t8.e + '",', e2 += '"kty":"' + t8.kty + '",', e2 += '"n":"' + t8.n + '"}';
              } else if ("EC" === t8.kty) {
                if ("string" != typeof t8.crv || "string" != typeof t8.x || "string" != typeof t8.y)
                  throw "wrong crv, x and y value for EC key";
                e2 += '"crv":"' + t8.crv + '",', e2 += '"kty":"' + t8.kty + '",', e2 += '"x":"' + t8.x + '",', e2 += '"y":"' + t8.y + '"}';
              } else if ("oct" === t8.kty) {
                if ("string" != typeof t8.k)
                  throw "wrong k value for oct(symmetric) key";
                e2 += '"kty":"' + t8.kty + '",', e2 += '"k":"' + t8.k + '"}';
              }
              var r3 = Nr(e2);
              return Tr(Sr.crypto.Util.hashHex(r3, "sha256"));
            }, Sr.jws.IntDate = {}, Sr.jws.IntDate.get = function(t8) {
              var e2 = Sr.jws.IntDate, r3 = e2.getNow, n2 = e2.getZulu;
              if ("now" == t8)
                return r3();
              if ("now + 1hour" == t8)
                return r3() + 3600;
              if ("now + 1day" == t8)
                return r3() + 86400;
              if ("now + 1month" == t8)
                return r3() + 2592e3;
              if ("now + 1year" == t8)
                return r3() + 31536e3;
              if (t8.match(/Z$/))
                return n2(t8);
              if (t8.match(/^[0-9]+$/))
                return parseInt(t8);
              throw "unsupported format: " + t8;
            }, Sr.jws.IntDate.getZulu = function(t8) {
              return Vr2(t8);
            }, Sr.jws.IntDate.getNow = function() {
              return ~~(/* @__PURE__ */ new Date() / 1e3);
            }, Sr.jws.IntDate.intDate2UTCString = function(t8) {
              return new Date(1e3 * t8).toUTCString();
            }, Sr.jws.IntDate.intDate2Zulu = function(t8) {
              var e2 = new Date(1e3 * t8);
              return ("0000" + e2.getUTCFullYear()).slice(-4) + ("00" + (e2.getUTCMonth() + 1)).slice(-2) + ("00" + e2.getUTCDate()).slice(-2) + ("00" + e2.getUTCHours()).slice(-2) + ("00" + e2.getUTCMinutes()).slice(-2) + ("00" + e2.getUTCSeconds()).slice(-2) + "Z";
            }, e.SecureRandom = Be2, e.rng_seed_time = Re, e.BigInteger = w, e.RSAKey = Me;
            var sn = Sr.crypto.EDSA;
            e.EDSA = sn;
            var an = Sr.crypto.DSA;
            e.DSA = an;
            var un = Sr.crypto.Signature;
            e.Signature = un;
            var cn = Sr.crypto.MessageDigest;
            e.MessageDigest = cn;
            var hn = Sr.crypto.Mac;
            e.Mac = hn;
            var ln = Sr.crypto.Cipher;
            e.Cipher = ln, e.KEYUTIL = tn2, e.ASN1HEX = Fr, e.X509 = on, e.CryptoJS = v2, e.b64tohex = S, e.b64toBA = b, e.stoBA = Er, e.BAtos = xr2, e.BAtohex = Ar, e.stohex = kr, e.stob64 = function fn(t8) {
              return _(kr(t8));
            }, e.stob64u = function gn(t8) {
              return Pr(_(kr(t8)));
            }, e.b64utos = function dn(t8) {
              return xr2(b(Cr(t8)));
            }, e.b64tob64u = Pr, e.b64utob64 = Cr, e.hex2b64 = _, e.hextob64u = Tr, e.b64utohex = Rr, e.utf8tob64u = br, e.b64utoutf8 = wr, e.utf8tob64 = function pn(t8) {
              return _(Kr2(Gr2(t8)));
            }, e.b64toutf8 = function vn(t8) {
              return decodeURIComponent(qr(S(t8)));
            }, e.utf8tohex = Ir, e.hextoutf8 = Dr, e.hextorstr = Lr, e.rstrtohex = Nr, e.hextob64 = Ur, e.hextob64nl = Br, e.b64nltohex = Or, e.hextopem = jr2, e.pemtohex = Mr2, e.hextoArrayBuffer = function yn(t8) {
              if (t8.length % 2 != 0)
                throw "input is not even length";
              if (null == t8.match(/^[0-9A-Fa-f]+$/))
                throw "input is not hexadecimal";
              for (var e2 = new ArrayBuffer(t8.length / 2), r3 = new DataView(e2), n2 = 0; n2 < t8.length / 2; n2++)
                r3.setUint8(n2, parseInt(t8.substr(2 * n2, 2), 16));
              return e2;
            }, e.ArrayBuffertohex = function mn(t8) {
              for (var e2 = "", r3 = new DataView(t8), n2 = 0; n2 < t8.byteLength; n2++)
                e2 += ("00" + r3.getUint8(n2).toString(16)).slice(-2);
              return e2;
            }, e.zulutomsec = Hr, e.zulutosec = Vr2, e.zulutodate = function _n(t8) {
              return new Date(Hr(t8));
            }, e.datetozulu = function Sn(t8, e2, r3) {
              var n2, i2 = t8.getUTCFullYear();
              if (e2) {
                if (i2 < 1950 || 2049 < i2)
                  throw "not proper year for UTCTime: " + i2;
                n2 = ("" + i2).slice(-2);
              } else
                n2 = ("000" + i2).slice(-4);
              if (n2 += ("0" + (t8.getUTCMonth() + 1)).slice(-2), n2 += ("0" + t8.getUTCDate()).slice(-2), n2 += ("0" + t8.getUTCHours()).slice(-2), n2 += ("0" + t8.getUTCMinutes()).slice(-2), n2 += ("0" + t8.getUTCSeconds()).slice(-2), r3) {
                var o2 = t8.getUTCMilliseconds();
                0 !== o2 && (n2 += "." + (o2 = (o2 = ("00" + o2).slice(-3)).replace(/0+$/g, "")));
              }
              return n2 += "Z";
            }, e.uricmptohex = Kr2, e.hextouricmp = qr, e.ipv6tohex = Jr2, e.hextoipv6 = Wr2, e.hextoip = zr2, e.iptohex = function bn(t8) {
              var e2 = "malformed IP address";
              if (!(t8 = t8.toLowerCase(t8)).match(/^[0-9.]+$/)) {
                if (t8.match(/^[0-9a-f:]+$/) && -1 !== t8.indexOf(":"))
                  return Jr2(t8);
                throw e2;
              }
              var r3 = t8.split(".");
              if (4 !== r3.length)
                throw e2;
              var n2 = "";
              try {
                for (var i2 = 0; i2 < 4; i2++) {
                  n2 += ("0" + parseInt(r3[i2]).toString(16)).slice(-2);
                }
                return n2;
              } catch (t9) {
                throw e2;
              }
            }, e.encodeURIComponentAll = Gr2, e.newline_toUnix = function wn(t8) {
              return t8 = t8.replace(/\r\n/gm, "\n");
            }, e.newline_toDos = function Fn(t8) {
              return t8 = (t8 = t8.replace(/\r\n/gm, "\n")).replace(/\n/gm, "\r\n");
            }, e.hextoposhex = $r, e.intarystrtohex = function En(t8) {
              t8 = (t8 = (t8 = t8.replace(/^\s*\[\s*/, "")).replace(/\s*\]\s*$/, "")).replace(/\s*/g, "");
              try {
                return t8.split(/,/).map(function(t9, e2, r3) {
                  var n2 = parseInt(t9);
                  if (n2 < 0 || 255 < n2)
                    throw "integer not in range 0-255";
                  return ("00" + n2.toString(16)).slice(-2);
                }).join("");
              } catch (t9) {
                throw "malformed integer array string: " + t9;
              }
            }, e.strdiffidx = function t8(e2, r3) {
              var n2 = e2.length;
              e2.length > r3.length && (n2 = r3.length);
              for (var i2 = 0; i2 < n2; i2++)
                if (e2.charCodeAt(i2) != r3.charCodeAt(i2))
                  return i2;
              return e2.length != r3.length ? n2 : -1;
            }, e.KJUR = Sr;
            var xn = Sr.crypto;
            e.crypto = xn;
            var An = Sr.asn1;
            e.asn1 = An;
            var kn = Sr.jws;
            e.jws = kn;
            var Pn = Sr.lang;
            e.lang = Pn;
          }).call(this, r(28).Buffer);
        }, function(t6, e, r) {
          "use strict";
          (function(t7) {
            var n = r(30), i = r(31), o = r(32);
            function s() {
              return u.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
            }
            function a(t8, e2) {
              if (s() < e2)
                throw new RangeError("Invalid typed array length");
              return u.TYPED_ARRAY_SUPPORT ? (t8 = new Uint8Array(e2)).__proto__ = u.prototype : (null === t8 && (t8 = new u(e2)), t8.length = e2), t8;
            }
            function u(t8, e2, r2) {
              if (!(u.TYPED_ARRAY_SUPPORT || this instanceof u))
                return new u(t8, e2, r2);
              if ("number" == typeof t8) {
                if ("string" == typeof e2)
                  throw new Error("If encoding is specified then the first argument must be a string");
                return l(this, t8);
              }
              return c(this, t8, e2, r2);
            }
            function c(t8, e2, r2, n2) {
              if ("number" == typeof e2)
                throw new TypeError('"value" argument must not be a number');
              return "undefined" != typeof ArrayBuffer && e2 instanceof ArrayBuffer ? function i2(t9, e3, r3, n3) {
                if (e3.byteLength, r3 < 0 || e3.byteLength < r3)
                  throw new RangeError("'offset' is out of bounds");
                if (e3.byteLength < r3 + (n3 || 0))
                  throw new RangeError("'length' is out of bounds");
                e3 = void 0 === r3 && void 0 === n3 ? new Uint8Array(e3) : void 0 === n3 ? new Uint8Array(e3, r3) : new Uint8Array(e3, r3, n3);
                u.TYPED_ARRAY_SUPPORT ? (t9 = e3).__proto__ = u.prototype : t9 = f(t9, e3);
                return t9;
              }(t8, e2, r2, n2) : "string" == typeof e2 ? function s2(t9, e3, r3) {
                "string" == typeof r3 && "" !== r3 || (r3 = "utf8");
                if (!u.isEncoding(r3))
                  throw new TypeError('"encoding" must be a valid string encoding');
                var n3 = 0 | d(e3, r3), i2 = (t9 = a(t9, n3)).write(e3, r3);
                i2 !== n3 && (t9 = t9.slice(0, i2));
                return t9;
              }(t8, e2, r2) : function c2(t9, e3) {
                if (u.isBuffer(e3)) {
                  var r3 = 0 | g(e3.length);
                  return 0 === (t9 = a(t9, r3)).length || e3.copy(t9, 0, 0, r3), t9;
                }
                if (e3) {
                  if ("undefined" != typeof ArrayBuffer && e3.buffer instanceof ArrayBuffer || "length" in e3)
                    return "number" != typeof e3.length || function n3(t10) {
                      return t10 != t10;
                    }(e3.length) ? a(t9, 0) : f(t9, e3);
                  if ("Buffer" === e3.type && o(e3.data))
                    return f(t9, e3.data);
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
              }(t8, e2);
            }
            function h(t8) {
              if ("number" != typeof t8)
                throw new TypeError('"size" argument must be a number');
              if (t8 < 0)
                throw new RangeError('"size" argument must not be negative');
            }
            function l(t8, e2) {
              if (h(e2), t8 = a(t8, e2 < 0 ? 0 : 0 | g(e2)), !u.TYPED_ARRAY_SUPPORT)
                for (var r2 = 0; r2 < e2; ++r2)
                  t8[r2] = 0;
              return t8;
            }
            function f(t8, e2) {
              var r2 = e2.length < 0 ? 0 : 0 | g(e2.length);
              t8 = a(t8, r2);
              for (var n2 = 0; n2 < r2; n2 += 1)
                t8[n2] = 255 & e2[n2];
              return t8;
            }
            function g(t8) {
              if (t8 >= s())
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
              return 0 | t8;
            }
            function d(t8, e2) {
              if (u.isBuffer(t8))
                return t8.length;
              if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t8) || t8 instanceof ArrayBuffer))
                return t8.byteLength;
              "string" != typeof t8 && (t8 = "" + t8);
              var r2 = t8.length;
              if (0 === r2)
                return 0;
              for (var n2 = false; ; )
                switch (e2) {
                  case "ascii":
                  case "latin1":
                  case "binary":
                    return r2;
                  case "utf8":
                  case "utf-8":
                  case void 0:
                    return K(t8).length;
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return 2 * r2;
                  case "hex":
                    return r2 >>> 1;
                  case "base64":
                    return q(t8).length;
                  default:
                    if (n2)
                      return K(t8).length;
                    e2 = ("" + e2).toLowerCase(), n2 = true;
                }
            }
            function p(t8, e2, r2) {
              var n2 = false;
              if ((void 0 === e2 || e2 < 0) && (e2 = 0), e2 > this.length)
                return "";
              if ((void 0 === r2 || r2 > this.length) && (r2 = this.length), r2 <= 0)
                return "";
              if ((r2 >>>= 0) <= (e2 >>>= 0))
                return "";
              for (t8 || (t8 = "utf8"); ; )
                switch (t8) {
                  case "hex":
                    return I(this, e2, r2);
                  case "utf8":
                  case "utf-8":
                    return A2(this, e2, r2);
                  case "ascii":
                    return T(this, e2, r2);
                  case "latin1":
                  case "binary":
                    return R(this, e2, r2);
                  case "base64":
                    return x(this, e2, r2);
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return D(this, e2, r2);
                  default:
                    if (n2)
                      throw new TypeError("Unknown encoding: " + t8);
                    t8 = (t8 + "").toLowerCase(), n2 = true;
                }
            }
            function v2(t8, e2, r2) {
              var n2 = t8[e2];
              t8[e2] = t8[r2], t8[r2] = n2;
            }
            function y(t8, e2, r2, n2, i2) {
              if (0 === t8.length)
                return -1;
              if ("string" == typeof r2 ? (n2 = r2, r2 = 0) : r2 > 2147483647 ? r2 = 2147483647 : r2 < -2147483648 && (r2 = -2147483648), r2 = +r2, isNaN(r2) && (r2 = i2 ? 0 : t8.length - 1), r2 < 0 && (r2 = t8.length + r2), r2 >= t8.length) {
                if (i2)
                  return -1;
                r2 = t8.length - 1;
              } else if (r2 < 0) {
                if (!i2)
                  return -1;
                r2 = 0;
              }
              if ("string" == typeof e2 && (e2 = u.from(e2, n2)), u.isBuffer(e2))
                return 0 === e2.length ? -1 : m(t8, e2, r2, n2, i2);
              if ("number" == typeof e2)
                return e2 &= 255, u.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i2 ? Uint8Array.prototype.indexOf.call(t8, e2, r2) : Uint8Array.prototype.lastIndexOf.call(t8, e2, r2) : m(t8, [e2], r2, n2, i2);
              throw new TypeError("val must be string, number or Buffer");
            }
            function m(t8, e2, r2, n2, i2) {
              var o2, s2 = 1, a2 = t8.length, u2 = e2.length;
              if (void 0 !== n2 && ("ucs2" === (n2 = String(n2).toLowerCase()) || "ucs-2" === n2 || "utf16le" === n2 || "utf-16le" === n2)) {
                if (t8.length < 2 || e2.length < 2)
                  return -1;
                s2 = 2, a2 /= 2, u2 /= 2, r2 /= 2;
              }
              function c2(t9, e3) {
                return 1 === s2 ? t9[e3] : t9.readUInt16BE(e3 * s2);
              }
              if (i2) {
                var h2 = -1;
                for (o2 = r2; o2 < a2; o2++)
                  if (c2(t8, o2) === c2(e2, -1 === h2 ? 0 : o2 - h2)) {
                    if (-1 === h2 && (h2 = o2), o2 - h2 + 1 === u2)
                      return h2 * s2;
                  } else
                    -1 !== h2 && (o2 -= o2 - h2), h2 = -1;
              } else
                for (r2 + u2 > a2 && (r2 = a2 - u2), o2 = r2; o2 >= 0; o2--) {
                  for (var l2 = true, f2 = 0; f2 < u2; f2++)
                    if (c2(t8, o2 + f2) !== c2(e2, f2)) {
                      l2 = false;
                      break;
                    }
                  if (l2)
                    return o2;
                }
              return -1;
            }
            function _(t8, e2, r2, n2) {
              r2 = Number(r2) || 0;
              var i2 = t8.length - r2;
              n2 ? (n2 = Number(n2)) > i2 && (n2 = i2) : n2 = i2;
              var o2 = e2.length;
              if (o2 % 2 != 0)
                throw new TypeError("Invalid hex string");
              n2 > o2 / 2 && (n2 = o2 / 2);
              for (var s2 = 0; s2 < n2; ++s2) {
                var a2 = parseInt(e2.substr(2 * s2, 2), 16);
                if (isNaN(a2))
                  return s2;
                t8[r2 + s2] = a2;
              }
              return s2;
            }
            function S(t8, e2, r2, n2) {
              return J(K(e2, t8.length - r2), t8, r2, n2);
            }
            function b(t8, e2, r2, n2) {
              return J(function i2(t9) {
                for (var e3 = [], r3 = 0; r3 < t9.length; ++r3)
                  e3.push(255 & t9.charCodeAt(r3));
                return e3;
              }(e2), t8, r2, n2);
            }
            function w(t8, e2, r2, n2) {
              return b(t8, e2, r2, n2);
            }
            function F(t8, e2, r2, n2) {
              return J(q(e2), t8, r2, n2);
            }
            function E(t8, e2, r2, n2) {
              return J(function i2(t9, e3) {
                for (var r3, n3, i3, o2 = [], s2 = 0; s2 < t9.length && !((e3 -= 2) < 0); ++s2)
                  n3 = (r3 = t9.charCodeAt(s2)) >> 8, i3 = r3 % 256, o2.push(i3), o2.push(n3);
                return o2;
              }(e2, t8.length - r2), t8, r2, n2);
            }
            function x(t8, e2, r2) {
              return 0 === e2 && r2 === t8.length ? n.fromByteArray(t8) : n.fromByteArray(t8.slice(e2, r2));
            }
            function A2(t8, e2, r2) {
              r2 = Math.min(t8.length, r2);
              for (var n2 = [], i2 = e2; i2 < r2; ) {
                var o2, s2, a2, u2, c2 = t8[i2], h2 = null, l2 = c2 > 239 ? 4 : c2 > 223 ? 3 : c2 > 191 ? 2 : 1;
                if (i2 + l2 <= r2)
                  switch (l2) {
                    case 1:
                      c2 < 128 && (h2 = c2);
                      break;
                    case 2:
                      128 == (192 & (o2 = t8[i2 + 1])) && (u2 = (31 & c2) << 6 | 63 & o2) > 127 && (h2 = u2);
                      break;
                    case 3:
                      o2 = t8[i2 + 1], s2 = t8[i2 + 2], 128 == (192 & o2) && 128 == (192 & s2) && (u2 = (15 & c2) << 12 | (63 & o2) << 6 | 63 & s2) > 2047 && (u2 < 55296 || u2 > 57343) && (h2 = u2);
                      break;
                    case 4:
                      o2 = t8[i2 + 1], s2 = t8[i2 + 2], a2 = t8[i2 + 3], 128 == (192 & o2) && 128 == (192 & s2) && 128 == (192 & a2) && (u2 = (15 & c2) << 18 | (63 & o2) << 12 | (63 & s2) << 6 | 63 & a2) > 65535 && u2 < 1114112 && (h2 = u2);
                  }
                null === h2 ? (h2 = 65533, l2 = 1) : h2 > 65535 && (h2 -= 65536, n2.push(h2 >>> 10 & 1023 | 55296), h2 = 56320 | 1023 & h2), n2.push(h2), i2 += l2;
              }
              return function f2(t9) {
                var e3 = t9.length;
                if (e3 <= C)
                  return String.fromCharCode.apply(String, t9);
                var r3 = "", n3 = 0;
                for (; n3 < e3; )
                  r3 += String.fromCharCode.apply(String, t9.slice(n3, n3 += C));
                return r3;
              }(n2);
            }
            e.Buffer = u, e.SlowBuffer = function k(t8) {
              +t8 != t8 && (t8 = 0);
              return u.alloc(+t8);
            }, e.INSPECT_MAX_BYTES = 50, u.TYPED_ARRAY_SUPPORT = void 0 !== t7.TYPED_ARRAY_SUPPORT ? t7.TYPED_ARRAY_SUPPORT : function P2() {
              try {
                var t8 = new Uint8Array(1);
                return t8.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
                  return 42;
                } }, 42 === t8.foo() && "function" == typeof t8.subarray && 0 === t8.subarray(1, 1).byteLength;
              } catch (t9) {
                return false;
              }
            }(), e.kMaxLength = s(), u.poolSize = 8192, u._augment = function(t8) {
              return t8.__proto__ = u.prototype, t8;
            }, u.from = function(t8, e2, r2) {
              return c(null, t8, e2, r2);
            }, u.TYPED_ARRAY_SUPPORT && (u.prototype.__proto__ = Uint8Array.prototype, u.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && u[Symbol.species] === u && Object.defineProperty(u, Symbol.species, { value: null, configurable: true })), u.alloc = function(t8, e2, r2) {
              return function n2(t9, e3, r3, i2) {
                return h(e3), e3 <= 0 ? a(t9, e3) : void 0 !== r3 ? "string" == typeof i2 ? a(t9, e3).fill(r3, i2) : a(t9, e3).fill(r3) : a(t9, e3);
              }(null, t8, e2, r2);
            }, u.allocUnsafe = function(t8) {
              return l(null, t8);
            }, u.allocUnsafeSlow = function(t8) {
              return l(null, t8);
            }, u.isBuffer = function t8(e2) {
              return !(null == e2 || !e2._isBuffer);
            }, u.compare = function t8(e2, r2) {
              if (!u.isBuffer(e2) || !u.isBuffer(r2))
                throw new TypeError("Arguments must be Buffers");
              if (e2 === r2)
                return 0;
              for (var n2 = e2.length, i2 = r2.length, o2 = 0, s2 = Math.min(n2, i2); o2 < s2; ++o2)
                if (e2[o2] !== r2[o2]) {
                  n2 = e2[o2], i2 = r2[o2];
                  break;
                }
              return n2 < i2 ? -1 : i2 < n2 ? 1 : 0;
            }, u.isEncoding = function t8(e2) {
              switch (String(e2).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return true;
                default:
                  return false;
              }
            }, u.concat = function t8(e2, r2) {
              if (!o(e2))
                throw new TypeError('"list" argument must be an Array of Buffers');
              if (0 === e2.length)
                return u.alloc(0);
              var n2;
              if (void 0 === r2)
                for (r2 = 0, n2 = 0; n2 < e2.length; ++n2)
                  r2 += e2[n2].length;
              var i2 = u.allocUnsafe(r2), s2 = 0;
              for (n2 = 0; n2 < e2.length; ++n2) {
                var a2 = e2[n2];
                if (!u.isBuffer(a2))
                  throw new TypeError('"list" argument must be an Array of Buffers');
                a2.copy(i2, s2), s2 += a2.length;
              }
              return i2;
            }, u.byteLength = d, u.prototype._isBuffer = true, u.prototype.swap16 = function t8() {
              var e2 = this.length;
              if (e2 % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
              for (var r2 = 0; r2 < e2; r2 += 2)
                v2(this, r2, r2 + 1);
              return this;
            }, u.prototype.swap32 = function t8() {
              var e2 = this.length;
              if (e2 % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits");
              for (var r2 = 0; r2 < e2; r2 += 4)
                v2(this, r2, r2 + 3), v2(this, r2 + 1, r2 + 2);
              return this;
            }, u.prototype.swap64 = function t8() {
              var e2 = this.length;
              if (e2 % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits");
              for (var r2 = 0; r2 < e2; r2 += 8)
                v2(this, r2, r2 + 7), v2(this, r2 + 1, r2 + 6), v2(this, r2 + 2, r2 + 5), v2(this, r2 + 3, r2 + 4);
              return this;
            }, u.prototype.toString = function t8() {
              var e2 = 0 | this.length;
              return 0 === e2 ? "" : 0 === arguments.length ? A2(this, 0, e2) : p.apply(this, arguments);
            }, u.prototype.equals = function t8(e2) {
              if (!u.isBuffer(e2))
                throw new TypeError("Argument must be a Buffer");
              return this === e2 || 0 === u.compare(this, e2);
            }, u.prototype.inspect = function t8() {
              var r2 = "", n2 = e.INSPECT_MAX_BYTES;
              return this.length > 0 && (r2 = this.toString("hex", 0, n2).match(/.{2}/g).join(" "), this.length > n2 && (r2 += " ... ")), "<Buffer " + r2 + ">";
            }, u.prototype.compare = function t8(e2, r2, n2, i2, o2) {
              if (!u.isBuffer(e2))
                throw new TypeError("Argument must be a Buffer");
              if (void 0 === r2 && (r2 = 0), void 0 === n2 && (n2 = e2 ? e2.length : 0), void 0 === i2 && (i2 = 0), void 0 === o2 && (o2 = this.length), r2 < 0 || n2 > e2.length || i2 < 0 || o2 > this.length)
                throw new RangeError("out of range index");
              if (i2 >= o2 && r2 >= n2)
                return 0;
              if (i2 >= o2)
                return -1;
              if (r2 >= n2)
                return 1;
              if (this === e2)
                return 0;
              for (var s2 = (o2 >>>= 0) - (i2 >>>= 0), a2 = (n2 >>>= 0) - (r2 >>>= 0), c2 = Math.min(s2, a2), h2 = this.slice(i2, o2), l2 = e2.slice(r2, n2), f2 = 0; f2 < c2; ++f2)
                if (h2[f2] !== l2[f2]) {
                  s2 = h2[f2], a2 = l2[f2];
                  break;
                }
              return s2 < a2 ? -1 : a2 < s2 ? 1 : 0;
            }, u.prototype.includes = function t8(e2, r2, n2) {
              return -1 !== this.indexOf(e2, r2, n2);
            }, u.prototype.indexOf = function t8(e2, r2, n2) {
              return y(this, e2, r2, n2, true);
            }, u.prototype.lastIndexOf = function t8(e2, r2, n2) {
              return y(this, e2, r2, n2, false);
            }, u.prototype.write = function t8(e2, r2, n2, i2) {
              if (void 0 === r2)
                i2 = "utf8", n2 = this.length, r2 = 0;
              else if (void 0 === n2 && "string" == typeof r2)
                i2 = r2, n2 = this.length, r2 = 0;
              else {
                if (!isFinite(r2))
                  throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                r2 |= 0, isFinite(n2) ? (n2 |= 0, void 0 === i2 && (i2 = "utf8")) : (i2 = n2, n2 = void 0);
              }
              var o2 = this.length - r2;
              if ((void 0 === n2 || n2 > o2) && (n2 = o2), e2.length > 0 && (n2 < 0 || r2 < 0) || r2 > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
              i2 || (i2 = "utf8");
              for (var s2 = false; ; )
                switch (i2) {
                  case "hex":
                    return _(this, e2, r2, n2);
                  case "utf8":
                  case "utf-8":
                    return S(this, e2, r2, n2);
                  case "ascii":
                    return b(this, e2, r2, n2);
                  case "latin1":
                  case "binary":
                    return w(this, e2, r2, n2);
                  case "base64":
                    return F(this, e2, r2, n2);
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return E(this, e2, r2, n2);
                  default:
                    if (s2)
                      throw new TypeError("Unknown encoding: " + i2);
                    i2 = ("" + i2).toLowerCase(), s2 = true;
                }
            }, u.prototype.toJSON = function t8() {
              return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
            };
            var C = 4096;
            function T(t8, e2, r2) {
              var n2 = "";
              r2 = Math.min(t8.length, r2);
              for (var i2 = e2; i2 < r2; ++i2)
                n2 += String.fromCharCode(127 & t8[i2]);
              return n2;
            }
            function R(t8, e2, r2) {
              var n2 = "";
              r2 = Math.min(t8.length, r2);
              for (var i2 = e2; i2 < r2; ++i2)
                n2 += String.fromCharCode(t8[i2]);
              return n2;
            }
            function I(t8, e2, r2) {
              var n2 = t8.length;
              (!e2 || e2 < 0) && (e2 = 0), (!r2 || r2 < 0 || r2 > n2) && (r2 = n2);
              for (var i2 = "", o2 = e2; o2 < r2; ++o2)
                i2 += V2(t8[o2]);
              return i2;
            }
            function D(t8, e2, r2) {
              for (var n2 = t8.slice(e2, r2), i2 = "", o2 = 0; o2 < n2.length; o2 += 2)
                i2 += String.fromCharCode(n2[o2] + 256 * n2[o2 + 1]);
              return i2;
            }
            function L(t8, e2, r2) {
              if (t8 % 1 != 0 || t8 < 0)
                throw new RangeError("offset is not uint");
              if (t8 + e2 > r2)
                throw new RangeError("Trying to access beyond buffer length");
            }
            function N(t8, e2, r2, n2, i2, o2) {
              if (!u.isBuffer(t8))
                throw new TypeError('"buffer" argument must be a Buffer instance');
              if (e2 > i2 || e2 < o2)
                throw new RangeError('"value" argument is out of bounds');
              if (r2 + n2 > t8.length)
                throw new RangeError("Index out of range");
            }
            function U(t8, e2, r2, n2) {
              e2 < 0 && (e2 = 65535 + e2 + 1);
              for (var i2 = 0, o2 = Math.min(t8.length - r2, 2); i2 < o2; ++i2)
                t8[r2 + i2] = (e2 & 255 << 8 * (n2 ? i2 : 1 - i2)) >>> 8 * (n2 ? i2 : 1 - i2);
            }
            function B2(t8, e2, r2, n2) {
              e2 < 0 && (e2 = 4294967295 + e2 + 1);
              for (var i2 = 0, o2 = Math.min(t8.length - r2, 4); i2 < o2; ++i2)
                t8[r2 + i2] = e2 >>> 8 * (n2 ? i2 : 3 - i2) & 255;
            }
            function O(t8, e2, r2, n2, i2, o2) {
              if (r2 + n2 > t8.length)
                throw new RangeError("Index out of range");
              if (r2 < 0)
                throw new RangeError("Index out of range");
            }
            function j(t8, e2, r2, n2, o2) {
              return o2 || O(t8, 0, r2, 4), i.write(t8, e2, r2, n2, 23, 4), r2 + 4;
            }
            function M(t8, e2, r2, n2, o2) {
              return o2 || O(t8, 0, r2, 8), i.write(t8, e2, r2, n2, 52, 8), r2 + 8;
            }
            u.prototype.slice = function t8(e2, r2) {
              var n2, i2 = this.length;
              if ((e2 = ~~e2) < 0 ? (e2 += i2) < 0 && (e2 = 0) : e2 > i2 && (e2 = i2), (r2 = void 0 === r2 ? i2 : ~~r2) < 0 ? (r2 += i2) < 0 && (r2 = 0) : r2 > i2 && (r2 = i2), r2 < e2 && (r2 = e2), u.TYPED_ARRAY_SUPPORT)
                (n2 = this.subarray(e2, r2)).__proto__ = u.prototype;
              else {
                var o2 = r2 - e2;
                n2 = new u(o2, void 0);
                for (var s2 = 0; s2 < o2; ++s2)
                  n2[s2] = this[s2 + e2];
              }
              return n2;
            }, u.prototype.readUIntLE = function t8(e2, r2, n2) {
              e2 |= 0, r2 |= 0, n2 || L(e2, r2, this.length);
              for (var i2 = this[e2], o2 = 1, s2 = 0; ++s2 < r2 && (o2 *= 256); )
                i2 += this[e2 + s2] * o2;
              return i2;
            }, u.prototype.readUIntBE = function t8(e2, r2, n2) {
              e2 |= 0, r2 |= 0, n2 || L(e2, r2, this.length);
              for (var i2 = this[e2 + --r2], o2 = 1; r2 > 0 && (o2 *= 256); )
                i2 += this[e2 + --r2] * o2;
              return i2;
            }, u.prototype.readUInt8 = function t8(e2, r2) {
              return r2 || L(e2, 1, this.length), this[e2];
            }, u.prototype.readUInt16LE = function t8(e2, r2) {
              return r2 || L(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
            }, u.prototype.readUInt16BE = function t8(e2, r2) {
              return r2 || L(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
            }, u.prototype.readUInt32LE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
            }, u.prototype.readUInt32BE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
            }, u.prototype.readIntLE = function t8(e2, r2, n2) {
              e2 |= 0, r2 |= 0, n2 || L(e2, r2, this.length);
              for (var i2 = this[e2], o2 = 1, s2 = 0; ++s2 < r2 && (o2 *= 256); )
                i2 += this[e2 + s2] * o2;
              return i2 >= (o2 *= 128) && (i2 -= Math.pow(2, 8 * r2)), i2;
            }, u.prototype.readIntBE = function t8(e2, r2, n2) {
              e2 |= 0, r2 |= 0, n2 || L(e2, r2, this.length);
              for (var i2 = r2, o2 = 1, s2 = this[e2 + --i2]; i2 > 0 && (o2 *= 256); )
                s2 += this[e2 + --i2] * o2;
              return s2 >= (o2 *= 128) && (s2 -= Math.pow(2, 8 * r2)), s2;
            }, u.prototype.readInt8 = function t8(e2, r2) {
              return r2 || L(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
            }, u.prototype.readInt16LE = function t8(e2, r2) {
              r2 || L(e2, 2, this.length);
              var n2 = this[e2] | this[e2 + 1] << 8;
              return 32768 & n2 ? 4294901760 | n2 : n2;
            }, u.prototype.readInt16BE = function t8(e2, r2) {
              r2 || L(e2, 2, this.length);
              var n2 = this[e2 + 1] | this[e2] << 8;
              return 32768 & n2 ? 4294901760 | n2 : n2;
            }, u.prototype.readInt32LE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
            }, u.prototype.readInt32BE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
            }, u.prototype.readFloatLE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), i.read(this, e2, true, 23, 4);
            }, u.prototype.readFloatBE = function t8(e2, r2) {
              return r2 || L(e2, 4, this.length), i.read(this, e2, false, 23, 4);
            }, u.prototype.readDoubleLE = function t8(e2, r2) {
              return r2 || L(e2, 8, this.length), i.read(this, e2, true, 52, 8);
            }, u.prototype.readDoubleBE = function t8(e2, r2) {
              return r2 || L(e2, 8, this.length), i.read(this, e2, false, 52, 8);
            }, u.prototype.writeUIntLE = function t8(e2, r2, n2, i2) {
              (e2 = +e2, r2 |= 0, n2 |= 0, i2) || N(this, e2, r2, n2, Math.pow(2, 8 * n2) - 1, 0);
              var o2 = 1, s2 = 0;
              for (this[r2] = 255 & e2; ++s2 < n2 && (o2 *= 256); )
                this[r2 + s2] = e2 / o2 & 255;
              return r2 + n2;
            }, u.prototype.writeUIntBE = function t8(e2, r2, n2, i2) {
              (e2 = +e2, r2 |= 0, n2 |= 0, i2) || N(this, e2, r2, n2, Math.pow(2, 8 * n2) - 1, 0);
              var o2 = n2 - 1, s2 = 1;
              for (this[r2 + o2] = 255 & e2; --o2 >= 0 && (s2 *= 256); )
                this[r2 + o2] = e2 / s2 & 255;
              return r2 + n2;
            }, u.prototype.writeUInt8 = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 1, 255, 0), u.TYPED_ARRAY_SUPPORT || (e2 = Math.floor(e2)), this[r2] = 255 & e2, r2 + 1;
            }, u.prototype.writeUInt16LE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 2, 65535, 0), u.TYPED_ARRAY_SUPPORT ? (this[r2] = 255 & e2, this[r2 + 1] = e2 >>> 8) : U(this, e2, r2, true), r2 + 2;
            }, u.prototype.writeUInt16BE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 2, 65535, 0), u.TYPED_ARRAY_SUPPORT ? (this[r2] = e2 >>> 8, this[r2 + 1] = 255 & e2) : U(this, e2, r2, false), r2 + 2;
            }, u.prototype.writeUInt32LE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 4, 4294967295, 0), u.TYPED_ARRAY_SUPPORT ? (this[r2 + 3] = e2 >>> 24, this[r2 + 2] = e2 >>> 16, this[r2 + 1] = e2 >>> 8, this[r2] = 255 & e2) : B2(this, e2, r2, true), r2 + 4;
            }, u.prototype.writeUInt32BE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 4, 4294967295, 0), u.TYPED_ARRAY_SUPPORT ? (this[r2] = e2 >>> 24, this[r2 + 1] = e2 >>> 16, this[r2 + 2] = e2 >>> 8, this[r2 + 3] = 255 & e2) : B2(this, e2, r2, false), r2 + 4;
            }, u.prototype.writeIntLE = function t8(e2, r2, n2, i2) {
              if (e2 = +e2, r2 |= 0, !i2) {
                var o2 = Math.pow(2, 8 * n2 - 1);
                N(this, e2, r2, n2, o2 - 1, -o2);
              }
              var s2 = 0, a2 = 1, u2 = 0;
              for (this[r2] = 255 & e2; ++s2 < n2 && (a2 *= 256); )
                e2 < 0 && 0 === u2 && 0 !== this[r2 + s2 - 1] && (u2 = 1), this[r2 + s2] = (e2 / a2 >> 0) - u2 & 255;
              return r2 + n2;
            }, u.prototype.writeIntBE = function t8(e2, r2, n2, i2) {
              if (e2 = +e2, r2 |= 0, !i2) {
                var o2 = Math.pow(2, 8 * n2 - 1);
                N(this, e2, r2, n2, o2 - 1, -o2);
              }
              var s2 = n2 - 1, a2 = 1, u2 = 0;
              for (this[r2 + s2] = 255 & e2; --s2 >= 0 && (a2 *= 256); )
                e2 < 0 && 0 === u2 && 0 !== this[r2 + s2 + 1] && (u2 = 1), this[r2 + s2] = (e2 / a2 >> 0) - u2 & 255;
              return r2 + n2;
            }, u.prototype.writeInt8 = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 1, 127, -128), u.TYPED_ARRAY_SUPPORT || (e2 = Math.floor(e2)), e2 < 0 && (e2 = 255 + e2 + 1), this[r2] = 255 & e2, r2 + 1;
            }, u.prototype.writeInt16LE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 2, 32767, -32768), u.TYPED_ARRAY_SUPPORT ? (this[r2] = 255 & e2, this[r2 + 1] = e2 >>> 8) : U(this, e2, r2, true), r2 + 2;
            }, u.prototype.writeInt16BE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 2, 32767, -32768), u.TYPED_ARRAY_SUPPORT ? (this[r2] = e2 >>> 8, this[r2 + 1] = 255 & e2) : U(this, e2, r2, false), r2 + 2;
            }, u.prototype.writeInt32LE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 4, 2147483647, -2147483648), u.TYPED_ARRAY_SUPPORT ? (this[r2] = 255 & e2, this[r2 + 1] = e2 >>> 8, this[r2 + 2] = e2 >>> 16, this[r2 + 3] = e2 >>> 24) : B2(this, e2, r2, true), r2 + 4;
            }, u.prototype.writeInt32BE = function t8(e2, r2, n2) {
              return e2 = +e2, r2 |= 0, n2 || N(this, e2, r2, 4, 2147483647, -2147483648), e2 < 0 && (e2 = 4294967295 + e2 + 1), u.TYPED_ARRAY_SUPPORT ? (this[r2] = e2 >>> 24, this[r2 + 1] = e2 >>> 16, this[r2 + 2] = e2 >>> 8, this[r2 + 3] = 255 & e2) : B2(this, e2, r2, false), r2 + 4;
            }, u.prototype.writeFloatLE = function t8(e2, r2, n2) {
              return j(this, e2, r2, true, n2);
            }, u.prototype.writeFloatBE = function t8(e2, r2, n2) {
              return j(this, e2, r2, false, n2);
            }, u.prototype.writeDoubleLE = function t8(e2, r2, n2) {
              return M(this, e2, r2, true, n2);
            }, u.prototype.writeDoubleBE = function t8(e2, r2, n2) {
              return M(this, e2, r2, false, n2);
            }, u.prototype.copy = function t8(e2, r2, n2, i2) {
              if (n2 || (n2 = 0), i2 || 0 === i2 || (i2 = this.length), r2 >= e2.length && (r2 = e2.length), r2 || (r2 = 0), i2 > 0 && i2 < n2 && (i2 = n2), i2 === n2)
                return 0;
              if (0 === e2.length || 0 === this.length)
                return 0;
              if (r2 < 0)
                throw new RangeError("targetStart out of bounds");
              if (n2 < 0 || n2 >= this.length)
                throw new RangeError("sourceStart out of bounds");
              if (i2 < 0)
                throw new RangeError("sourceEnd out of bounds");
              i2 > this.length && (i2 = this.length), e2.length - r2 < i2 - n2 && (i2 = e2.length - r2 + n2);
              var o2, s2 = i2 - n2;
              if (this === e2 && n2 < r2 && r2 < i2)
                for (o2 = s2 - 1; o2 >= 0; --o2)
                  e2[o2 + r2] = this[o2 + n2];
              else if (s2 < 1e3 || !u.TYPED_ARRAY_SUPPORT)
                for (o2 = 0; o2 < s2; ++o2)
                  e2[o2 + r2] = this[o2 + n2];
              else
                Uint8Array.prototype.set.call(e2, this.subarray(n2, n2 + s2), r2);
              return s2;
            }, u.prototype.fill = function t8(e2, r2, n2, i2) {
              if ("string" == typeof e2) {
                if ("string" == typeof r2 ? (i2 = r2, r2 = 0, n2 = this.length) : "string" == typeof n2 && (i2 = n2, n2 = this.length), 1 === e2.length) {
                  var o2 = e2.charCodeAt(0);
                  o2 < 256 && (e2 = o2);
                }
                if (void 0 !== i2 && "string" != typeof i2)
                  throw new TypeError("encoding must be a string");
                if ("string" == typeof i2 && !u.isEncoding(i2))
                  throw new TypeError("Unknown encoding: " + i2);
              } else
                "number" == typeof e2 && (e2 &= 255);
              if (r2 < 0 || this.length < r2 || this.length < n2)
                throw new RangeError("Out of range index");
              if (n2 <= r2)
                return this;
              var s2;
              if (r2 >>>= 0, n2 = void 0 === n2 ? this.length : n2 >>> 0, e2 || (e2 = 0), "number" == typeof e2)
                for (s2 = r2; s2 < n2; ++s2)
                  this[s2] = e2;
              else {
                var a2 = u.isBuffer(e2) ? e2 : K(new u(e2, i2).toString()), c2 = a2.length;
                for (s2 = 0; s2 < n2 - r2; ++s2)
                  this[s2 + r2] = a2[s2 % c2];
              }
              return this;
            };
            var H2 = /[^+\/0-9A-Za-z-_]/g;
            function V2(t8) {
              return t8 < 16 ? "0" + t8.toString(16) : t8.toString(16);
            }
            function K(t8, e2) {
              var r2;
              e2 = e2 || 1 / 0;
              for (var n2 = t8.length, i2 = null, o2 = [], s2 = 0; s2 < n2; ++s2) {
                if ((r2 = t8.charCodeAt(s2)) > 55295 && r2 < 57344) {
                  if (!i2) {
                    if (r2 > 56319) {
                      (e2 -= 3) > -1 && o2.push(239, 191, 189);
                      continue;
                    }
                    if (s2 + 1 === n2) {
                      (e2 -= 3) > -1 && o2.push(239, 191, 189);
                      continue;
                    }
                    i2 = r2;
                    continue;
                  }
                  if (r2 < 56320) {
                    (e2 -= 3) > -1 && o2.push(239, 191, 189), i2 = r2;
                    continue;
                  }
                  r2 = 65536 + (i2 - 55296 << 10 | r2 - 56320);
                } else
                  i2 && (e2 -= 3) > -1 && o2.push(239, 191, 189);
                if (i2 = null, r2 < 128) {
                  if ((e2 -= 1) < 0)
                    break;
                  o2.push(r2);
                } else if (r2 < 2048) {
                  if ((e2 -= 2) < 0)
                    break;
                  o2.push(r2 >> 6 | 192, 63 & r2 | 128);
                } else if (r2 < 65536) {
                  if ((e2 -= 3) < 0)
                    break;
                  o2.push(r2 >> 12 | 224, r2 >> 6 & 63 | 128, 63 & r2 | 128);
                } else {
                  if (!(r2 < 1114112))
                    throw new Error("Invalid code point");
                  if ((e2 -= 4) < 0)
                    break;
                  o2.push(r2 >> 18 | 240, r2 >> 12 & 63 | 128, r2 >> 6 & 63 | 128, 63 & r2 | 128);
                }
              }
              return o2;
            }
            function q(t8) {
              return n.toByteArray(function e2(t9) {
                if ((t9 = function e3(t10) {
                  return t10.trim ? t10.trim() : t10.replace(/^\s+|\s+$/g, "");
                }(t9).replace(H2, "")).length < 2)
                  return "";
                for (; t9.length % 4 != 0; )
                  t9 += "=";
                return t9;
              }(t8));
            }
            function J(t8, e2, r2, n2) {
              for (var i2 = 0; i2 < n2 && !(i2 + r2 >= e2.length || i2 >= t8.length); ++i2)
                e2[i2 + r2] = t8[i2];
              return i2;
            }
          }).call(this, r(29));
        }, function(t6, e) {
          var r;
          r = /* @__PURE__ */ function() {
            return this;
          }();
          try {
            r = r || new Function("return this")();
          } catch (t7) {
            "object" == typeof window && (r = window);
          }
          t6.exports = r;
        }, function(t6, e, r) {
          "use strict";
          e.byteLength = function n(t7) {
            var e2 = f(t7), r2 = e2[0], n2 = e2[1];
            return 3 * (r2 + n2) / 4 - n2;
          }, e.toByteArray = function i(t7) {
            var e2, r2, n = f(t7), i2 = n[0], o = n[1], s2 = new u(function c2(t8, e3, r3) {
              return 3 * (e3 + r3) / 4 - r3;
            }(0, i2, o)), h2 = 0, l2 = o > 0 ? i2 - 4 : i2;
            for (r2 = 0; r2 < l2; r2 += 4)
              e2 = a[t7.charCodeAt(r2)] << 18 | a[t7.charCodeAt(r2 + 1)] << 12 | a[t7.charCodeAt(r2 + 2)] << 6 | a[t7.charCodeAt(r2 + 3)], s2[h2++] = e2 >> 16 & 255, s2[h2++] = e2 >> 8 & 255, s2[h2++] = 255 & e2;
            2 === o && (e2 = a[t7.charCodeAt(r2)] << 2 | a[t7.charCodeAt(r2 + 1)] >> 4, s2[h2++] = 255 & e2);
            1 === o && (e2 = a[t7.charCodeAt(r2)] << 10 | a[t7.charCodeAt(r2 + 1)] << 4 | a[t7.charCodeAt(r2 + 2)] >> 2, s2[h2++] = e2 >> 8 & 255, s2[h2++] = 255 & e2);
            return s2;
          }, e.fromByteArray = function o(t7) {
            for (var e2, r2 = t7.length, n = r2 % 3, i = [], o2 = 16383, a2 = 0, u2 = r2 - n; a2 < u2; a2 += o2)
              i.push(g(t7, a2, a2 + o2 > u2 ? u2 : a2 + o2));
            1 === n ? (e2 = t7[r2 - 1], i.push(s[e2 >> 2] + s[e2 << 4 & 63] + "==")) : 2 === n && (e2 = (t7[r2 - 2] << 8) + t7[r2 - 1], i.push(s[e2 >> 10] + s[e2 >> 4 & 63] + s[e2 << 2 & 63] + "="));
            return i.join("");
          };
          for (var s = [], a = [], u = "undefined" != typeof Uint8Array ? Uint8Array : Array, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = 0, l = c.length; h < l; ++h)
            s[h] = c[h], a[c.charCodeAt(h)] = h;
          function f(t7) {
            var e2 = t7.length;
            if (e2 % 4 > 0)
              throw new Error("Invalid string. Length must be a multiple of 4");
            var r2 = t7.indexOf("=");
            return -1 === r2 && (r2 = e2), [r2, r2 === e2 ? 0 : 4 - r2 % 4];
          }
          function g(t7, e2, r2) {
            for (var n, i, o = [], a2 = e2; a2 < r2; a2 += 3)
              n = (t7[a2] << 16 & 16711680) + (t7[a2 + 1] << 8 & 65280) + (255 & t7[a2 + 2]), o.push(s[(i = n) >> 18 & 63] + s[i >> 12 & 63] + s[i >> 6 & 63] + s[63 & i]);
            return o.join("");
          }
          a["-".charCodeAt(0)] = 62, a["_".charCodeAt(0)] = 63;
        }, function(t6, e) {
          e.read = function(t7, e2, r, n, i) {
            var o, s, a = 8 * i - n - 1, u = (1 << a) - 1, c = u >> 1, h = -7, l = r ? i - 1 : 0, f = r ? -1 : 1, g = t7[e2 + l];
            for (l += f, o = g & (1 << -h) - 1, g >>= -h, h += a; h > 0; o = 256 * o + t7[e2 + l], l += f, h -= 8)
              ;
            for (s = o & (1 << -h) - 1, o >>= -h, h += n; h > 0; s = 256 * s + t7[e2 + l], l += f, h -= 8)
              ;
            if (0 === o)
              o = 1 - c;
            else {
              if (o === u)
                return s ? NaN : 1 / 0 * (g ? -1 : 1);
              s += Math.pow(2, n), o -= c;
            }
            return (g ? -1 : 1) * s * Math.pow(2, o - n);
          }, e.write = function(t7, e2, r, n, i, o) {
            var s, a, u, c = 8 * o - i - 1, h = (1 << c) - 1, l = h >> 1, f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = n ? 0 : o - 1, d = n ? 1 : -1, p = e2 < 0 || 0 === e2 && 1 / e2 < 0 ? 1 : 0;
            for (e2 = Math.abs(e2), isNaN(e2) || e2 === 1 / 0 ? (a = isNaN(e2) ? 1 : 0, s = h) : (s = Math.floor(Math.log(e2) / Math.LN2), e2 * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (e2 += s + l >= 1 ? f / u : f * Math.pow(2, 1 - l)) * u >= 2 && (s++, u /= 2), s + l >= h ? (a = 0, s = h) : s + l >= 1 ? (a = (e2 * u - 1) * Math.pow(2, i), s += l) : (a = e2 * Math.pow(2, l - 1) * Math.pow(2, i), s = 0)); i >= 8; t7[r + g] = 255 & a, g += d, a /= 256, i -= 8)
              ;
            for (s = s << i | a, c += i; c > 0; t7[r + g] = 255 & s, g += d, s /= 256, c -= 8)
              ;
            t7[r + g - d] |= 128 * p;
          };
        }, function(t6, e) {
          var r = {}.toString;
          t6.exports = Array.isArray || function(t7) {
            return "[object Array]" == r.call(t7);
          };
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.default = function n(t7) {
            var e2 = t7.jws, r2 = t7.KeyUtil, n2 = t7.X509, o = t7.crypto, s = t7.hextob64u, a = t7.b64tohex, u = t7.AllowedSigningAlgs;
            return function() {
              function t8() {
                !function e3(t9, r3) {
                  if (!(t9 instanceof r3))
                    throw new TypeError("Cannot call a class as a function");
                }(this, t8);
              }
              return t8.parseJwt = function t9(r3) {
                i.Log.debug("JoseUtil.parseJwt");
                try {
                  var n3 = e2.JWS.parse(r3);
                  return { header: n3.headerObj, payload: n3.payloadObj };
                } catch (t10) {
                  i.Log.error(t10);
                }
              }, t8.validateJwt = function e3(o2, s2, u2, c, h, l, f) {
                i.Log.debug("JoseUtil.validateJwt");
                try {
                  if ("RSA" === s2.kty)
                    if (s2.e && s2.n)
                      s2 = r2.getKey(s2);
                    else {
                      if (!s2.x5c || !s2.x5c.length)
                        return i.Log.error("JoseUtil.validateJwt: RSA key missing key material", s2), Promise.reject(new Error("RSA key missing key material"));
                      var g = a(s2.x5c[0]);
                      s2 = n2.getPublicKeyFromCertHex(g);
                    }
                  else {
                    if ("EC" !== s2.kty)
                      return i.Log.error("JoseUtil.validateJwt: Unsupported key type", s2 && s2.kty), Promise.reject(new Error(s2.kty));
                    if (!(s2.crv && s2.x && s2.y))
                      return i.Log.error("JoseUtil.validateJwt: EC key missing key material", s2), Promise.reject(new Error("EC key missing key material"));
                    s2 = r2.getKey(s2);
                  }
                  return t8._validateJwt(o2, s2, u2, c, h, l, f);
                } catch (t9) {
                  return i.Log.error(t9 && t9.message || t9), Promise.reject("JWT validation failed");
                }
              }, t8.validateJwtAttributes = function e3(r3, n3, o2, s2, a2, u2) {
                s2 || (s2 = 0), a2 || (a2 = parseInt(Date.now() / 1e3));
                var c = t8.parseJwt(r3).payload;
                if (!c.iss)
                  return i.Log.error("JoseUtil._validateJwt: issuer was not provided"), Promise.reject(new Error("issuer was not provided"));
                if (c.iss !== n3)
                  return i.Log.error("JoseUtil._validateJwt: Invalid issuer in token", c.iss), Promise.reject(new Error("Invalid issuer in token: " + c.iss));
                if (!c.aud)
                  return i.Log.error("JoseUtil._validateJwt: aud was not provided"), Promise.reject(new Error("aud was not provided"));
                if (!(c.aud === o2 || Array.isArray(c.aud) && c.aud.indexOf(o2) >= 0))
                  return i.Log.error("JoseUtil._validateJwt: Invalid audience in token", c.aud), Promise.reject(new Error("Invalid audience in token: " + c.aud));
                if (c.azp && c.azp !== o2)
                  return i.Log.error("JoseUtil._validateJwt: Invalid azp in token", c.azp), Promise.reject(new Error("Invalid azp in token: " + c.azp));
                if (!u2) {
                  var h = a2 + s2, l = a2 - s2;
                  if (!c.iat)
                    return i.Log.error("JoseUtil._validateJwt: iat was not provided"), Promise.reject(new Error("iat was not provided"));
                  if (h < c.iat)
                    return i.Log.error("JoseUtil._validateJwt: iat is in the future", c.iat), Promise.reject(new Error("iat is in the future: " + c.iat));
                  if (c.nbf && h < c.nbf)
                    return i.Log.error("JoseUtil._validateJwt: nbf is in the future", c.nbf), Promise.reject(new Error("nbf is in the future: " + c.nbf));
                  if (!c.exp)
                    return i.Log.error("JoseUtil._validateJwt: exp was not provided"), Promise.reject(new Error("exp was not provided"));
                  if (c.exp < l)
                    return i.Log.error("JoseUtil._validateJwt: exp is in the past", c.exp), Promise.reject(new Error("exp is in the past:" + c.exp));
                }
                return Promise.resolve(c);
              }, t8._validateJwt = function r3(n3, o2, s2, a2, c, h, l) {
                return t8.validateJwtAttributes(n3, s2, a2, c, h, l).then(function(t9) {
                  try {
                    return e2.JWS.verify(n3, o2, u) ? t9 : (i.Log.error("JoseUtil._validateJwt: signature validation failed"), Promise.reject(new Error("signature validation failed")));
                  } catch (t10) {
                    return i.Log.error(t10 && t10.message || t10), Promise.reject(new Error("signature validation failed"));
                  }
                });
              }, t8.hashString = function t9(e3, r3) {
                try {
                  return o.Util.hashString(e3, r3);
                } catch (t10) {
                  i.Log.error(t10);
                }
              }, t8.hexToBase64Url = function t9(e3) {
                try {
                  return s(e3);
                } catch (t10) {
                  i.Log.error(t10);
                }
              }, t8;
            }();
          };
          var i = r(0);
          t6.exports = e.default;
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SigninResponse = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(3);
          function o(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          e.SigninResponse = function() {
            function t7(e2) {
              var r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "#";
              o(this, t7);
              var n2 = i.UrlUtility.parseUrlFragment(e2, r2);
              this.error = n2.error, this.error_description = n2.error_description, this.error_uri = n2.error_uri, this.code = n2.code, this.state = n2.state, this.id_token = n2.id_token, this.session_state = n2.session_state, this.access_token = n2.access_token, this.token_type = n2.token_type, this.scope = n2.scope, this.profile = void 0, this.expires_in = n2.expires_in;
            }
            return n(t7, [{ key: "expires_in", get: function t8() {
              if (this.expires_at) {
                var e2 = parseInt(Date.now() / 1e3);
                return this.expires_at - e2;
              }
            }, set: function t8(e2) {
              var r2 = parseInt(e2);
              if ("number" == typeof r2 && r2 > 0) {
                var n2 = parseInt(Date.now() / 1e3);
                this.expires_at = n2 + r2;
              }
            } }, { key: "expired", get: function t8() {
              var e2 = this.expires_in;
              if (void 0 !== e2)
                return e2 <= 0;
            } }, { key: "scopes", get: function t8() {
              return (this.scope || "").split(" ");
            } }, { key: "isOpenIdConnect", get: function t8() {
              return this.scopes.indexOf("openid") >= 0 || !!this.id_token;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SignoutRequest = void 0;
          var n = r(0), i = r(3), o = r(9);
          e.SignoutRequest = function t7(e2) {
            var r2 = e2.url, s = e2.id_token_hint, a = e2.post_logout_redirect_uri, u = e2.data, c = e2.extraQueryParams, h = e2.request_type;
            if (function l(t8, e3) {
              if (!(t8 instanceof e3))
                throw new TypeError("Cannot call a class as a function");
            }(this, t7), !r2)
              throw n.Log.error("SignoutRequest.ctor: No url passed"), new Error("url");
            for (var f in s && (r2 = i.UrlUtility.addQueryParam(r2, "id_token_hint", s)), a && (r2 = i.UrlUtility.addQueryParam(r2, "post_logout_redirect_uri", a), u && (this.state = new o.State({ data: u, request_type: h }), r2 = i.UrlUtility.addQueryParam(r2, "state", this.state.id))), c)
              r2 = i.UrlUtility.addQueryParam(r2, f, c[f]);
            this.url = r2;
          };
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SignoutResponse = void 0;
          var n = r(3);
          e.SignoutResponse = function t7(e2) {
            !function r2(t8, e3) {
              if (!(t8 instanceof e3))
                throw new TypeError("Cannot call a class as a function");
            }(this, t7);
            var i = n.UrlUtility.parseUrlFragment(e2, "?");
            this.error = i.error, this.error_description = i.error_description, this.error_uri = i.error_uri, this.state = i.state;
          };
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.InMemoryWebStorage = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0);
          e.InMemoryWebStorage = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._data = {};
            }
            return t7.prototype.getItem = function t8(e2) {
              return i.Log.debug("InMemoryWebStorage.getItem", e2), this._data[e2];
            }, t7.prototype.setItem = function t8(e2, r2) {
              i.Log.debug("InMemoryWebStorage.setItem", e2), this._data[e2] = r2;
            }, t7.prototype.removeItem = function t8(e2) {
              i.Log.debug("InMemoryWebStorage.removeItem", e2), delete this._data[e2];
            }, t7.prototype.key = function t8(e2) {
              return Object.getOwnPropertyNames(this._data)[e2];
            }, n(t7, [{ key: "length", get: function t8() {
              return Object.getOwnPropertyNames(this._data).length;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.UserManager = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(10), s = r(39), a = r(15), u = r(45), c = r(47), h = r(18), l = r(8), f = r(20), g = r(11), d = r(4);
          function p(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          function v2(t7, e2) {
            if (!t7)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e2 || "object" != typeof e2 && "function" != typeof e2 ? t7 : e2;
          }
          e.UserManager = function(t7) {
            function e2() {
              var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : c.SilentRenewService, o2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : h.SessionMonitor, a2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : f.TokenRevocationClient, l2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : g.TokenClient, y = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : d.JoseUtil;
              p(this, e2), r2 instanceof s.UserManagerSettings || (r2 = new s.UserManagerSettings(r2));
              var m = v2(this, t7.call(this, r2));
              return m._events = new u.UserManagerEvents(r2), m._silentRenewService = new n2(m), m.settings.automaticSilentRenew && (i.Log.debug("UserManager.ctor: automaticSilentRenew is configured, setting up silent renew"), m.startSilentRenew()), m.settings.monitorSession && (i.Log.debug("UserManager.ctor: monitorSession is configured, setting up session monitor"), m._sessionMonitor = new o2(m)), m._tokenRevocationClient = new a2(m._settings), m._tokenClient = new l2(m._settings), m._joseUtil = y, m;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), e2.prototype.getUser = function t8() {
              var e3 = this;
              return this._loadUser().then(function(t9) {
                return t9 ? (i.Log.info("UserManager.getUser: user loaded"), e3._events.load(t9, false), t9) : (i.Log.info("UserManager.getUser: user not found in storage"), null);
              });
            }, e2.prototype.removeUser = function t8() {
              var e3 = this;
              return this.storeUser(null).then(function() {
                i.Log.info("UserManager.removeUser: user removed from storage"), e3._events.unload();
              });
            }, e2.prototype.signinRedirect = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (e3 = Object.assign({}, e3)).request_type = "si:r";
              var r2 = { useReplaceToNavigate: e3.useReplaceToNavigate };
              return this._signinStart(e3, this._redirectNavigator, r2).then(function() {
                i.Log.info("UserManager.signinRedirect: successful");
              });
            }, e2.prototype.signinRedirectCallback = function t8(e3) {
              return this._signinEnd(e3 || this._redirectNavigator.url).then(function(t9) {
                return t9.profile && t9.profile.sub ? i.Log.info("UserManager.signinRedirectCallback: successful, signed in sub: ", t9.profile.sub) : i.Log.info("UserManager.signinRedirectCallback: no sub"), t9;
              });
            }, e2.prototype.signinPopup = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (e3 = Object.assign({}, e3)).request_type = "si:p";
              var r2 = e3.redirect_uri || this.settings.popup_redirect_uri || this.settings.redirect_uri;
              return r2 ? (e3.redirect_uri = r2, e3.display = "popup", this._signin(e3, this._popupNavigator, { startUrl: r2, popupWindowFeatures: e3.popupWindowFeatures || this.settings.popupWindowFeatures, popupWindowTarget: e3.popupWindowTarget || this.settings.popupWindowTarget }).then(function(t9) {
                return t9 && (t9.profile && t9.profile.sub ? i.Log.info("UserManager.signinPopup: signinPopup successful, signed in sub: ", t9.profile.sub) : i.Log.info("UserManager.signinPopup: no sub")), t9;
              })) : (i.Log.error("UserManager.signinPopup: No popup_redirect_uri or redirect_uri configured"), Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured")));
            }, e2.prototype.signinPopupCallback = function t8(e3) {
              return this._signinCallback(e3, this._popupNavigator).then(function(t9) {
                return t9 && (t9.profile && t9.profile.sub ? i.Log.info("UserManager.signinPopupCallback: successful, signed in sub: ", t9.profile.sub) : i.Log.info("UserManager.signinPopupCallback: no sub")), t9;
              }).catch(function(t9) {
                i.Log.error(t9.message);
              });
            }, e2.prototype.signinSilent = function t8() {
              var e3 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              return r2 = Object.assign({}, r2), this._loadUser().then(function(t9) {
                return t9 && t9.refresh_token ? (r2.refresh_token = t9.refresh_token, e3._useRefreshToken(r2)) : (r2.request_type = "si:s", r2.id_token_hint = r2.id_token_hint || e3.settings.includeIdTokenInSilentRenew && t9 && t9.id_token, t9 && e3._settings.validateSubOnSilentRenew && (i.Log.debug("UserManager.signinSilent, subject prior to silent renew: ", t9.profile.sub), r2.current_sub = t9.profile.sub), e3._signinSilentIframe(r2));
              });
            }, e2.prototype._useRefreshToken = function t8() {
              var e3 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              return this._tokenClient.exchangeRefreshToken(r2).then(function(t9) {
                return t9 ? t9.access_token ? e3._loadUser().then(function(r3) {
                  if (r3) {
                    var n2 = Promise.resolve();
                    return t9.id_token && (n2 = e3._validateIdTokenFromTokenRefreshToken(r3.profile, t9.id_token)), n2.then(function() {
                      return i.Log.debug("UserManager._useRefreshToken: refresh token response success"), r3.id_token = t9.id_token || r3.id_token, r3.access_token = t9.access_token, r3.refresh_token = t9.refresh_token || r3.refresh_token, r3.expires_in = t9.expires_in, e3.storeUser(r3).then(function() {
                        return e3._events.load(r3), r3;
                      });
                    });
                  }
                  return null;
                }) : (i.Log.error("UserManager._useRefreshToken: No access token returned from token endpoint"), Promise.reject("No access token returned from token endpoint")) : (i.Log.error("UserManager._useRefreshToken: No response returned from token endpoint"), Promise.reject("No response returned from token endpoint"));
              });
            }, e2.prototype._validateIdTokenFromTokenRefreshToken = function t8(e3, r2) {
              var n2 = this;
              return this._metadataService.getIssuer().then(function(t9) {
                return n2.settings.getEpochTime().then(function(o2) {
                  return n2._joseUtil.validateJwtAttributes(r2, t9, n2._settings.client_id, n2._settings.clockSkew, o2).then(function(t10) {
                    return t10 ? t10.sub !== e3.sub ? (i.Log.error("UserManager._validateIdTokenFromTokenRefreshToken: sub in id_token does not match current sub"), Promise.reject(new Error("sub in id_token does not match current sub"))) : t10.auth_time && t10.auth_time !== e3.auth_time ? (i.Log.error("UserManager._validateIdTokenFromTokenRefreshToken: auth_time in id_token does not match original auth_time"), Promise.reject(new Error("auth_time in id_token does not match original auth_time"))) : t10.azp && t10.azp !== e3.azp ? (i.Log.error("UserManager._validateIdTokenFromTokenRefreshToken: azp in id_token does not match original azp"), Promise.reject(new Error("azp in id_token does not match original azp"))) : !t10.azp && e3.azp ? (i.Log.error("UserManager._validateIdTokenFromTokenRefreshToken: azp not in id_token, but present in original id_token"), Promise.reject(new Error("azp not in id_token, but present in original id_token"))) : void 0 : (i.Log.error("UserManager._validateIdTokenFromTokenRefreshToken: Failed to validate id_token"), Promise.reject(new Error("Failed to validate id_token")));
                  });
                });
              });
            }, e2.prototype._signinSilentIframe = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = e3.redirect_uri || this.settings.silent_redirect_uri || this.settings.redirect_uri;
              return r2 ? (e3.redirect_uri = r2, e3.prompt = e3.prompt || "none", this._signin(e3, this._iframeNavigator, { startUrl: r2, silentRequestTimeout: e3.silentRequestTimeout || this.settings.silentRequestTimeout }).then(function(t9) {
                return t9 && (t9.profile && t9.profile.sub ? i.Log.info("UserManager.signinSilent: successful, signed in sub: ", t9.profile.sub) : i.Log.info("UserManager.signinSilent: no sub")), t9;
              })) : (i.Log.error("UserManager.signinSilent: No silent_redirect_uri configured"), Promise.reject(new Error("No silent_redirect_uri configured")));
            }, e2.prototype.signinSilentCallback = function t8(e3) {
              return this._signinCallback(e3, this._iframeNavigator).then(function(t9) {
                return t9 && (t9.profile && t9.profile.sub ? i.Log.info("UserManager.signinSilentCallback: successful, signed in sub: ", t9.profile.sub) : i.Log.info("UserManager.signinSilentCallback: no sub")), t9;
              });
            }, e2.prototype.signinCallback = function t8(e3) {
              var r2 = this;
              return this.readSigninResponseState(e3).then(function(t9) {
                var n2 = t9.state;
                t9.response;
                return "si:r" === n2.request_type ? r2.signinRedirectCallback(e3) : "si:p" === n2.request_type ? r2.signinPopupCallback(e3) : "si:s" === n2.request_type ? r2.signinSilentCallback(e3) : Promise.reject(new Error("invalid response_type in state"));
              });
            }, e2.prototype.signoutCallback = function t8(e3, r2) {
              var n2 = this;
              return this.readSignoutResponseState(e3).then(function(t9) {
                var i2 = t9.state, o2 = t9.response;
                return i2 ? "so:r" === i2.request_type ? n2.signoutRedirectCallback(e3) : "so:p" === i2.request_type ? n2.signoutPopupCallback(e3, r2) : Promise.reject(new Error("invalid response_type in state")) : o2;
              });
            }, e2.prototype.querySessionStatus = function t8() {
              var e3 = this, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (r2 = Object.assign({}, r2)).request_type = "si:s";
              var n2 = r2.redirect_uri || this.settings.silent_redirect_uri || this.settings.redirect_uri;
              return n2 ? (r2.redirect_uri = n2, r2.prompt = "none", r2.response_type = r2.response_type || this.settings.query_status_response_type, r2.scope = r2.scope || "openid", r2.skipUserInfo = true, this._signinStart(r2, this._iframeNavigator, { startUrl: n2, silentRequestTimeout: r2.silentRequestTimeout || this.settings.silentRequestTimeout }).then(function(t9) {
                return e3.processSigninResponse(t9.url).then(function(t10) {
                  if (i.Log.debug("UserManager.querySessionStatus: got signin response"), t10.session_state && t10.profile.sub)
                    return i.Log.info("UserManager.querySessionStatus: querySessionStatus success for sub: ", t10.profile.sub), { session_state: t10.session_state, sub: t10.profile.sub, sid: t10.profile.sid };
                  i.Log.info("querySessionStatus successful, user not authenticated");
                }).catch(function(t10) {
                  if (t10.session_state && e3.settings.monitorAnonymousSession && ("login_required" == t10.message || "consent_required" == t10.message || "interaction_required" == t10.message || "account_selection_required" == t10.message))
                    return i.Log.info("UserManager.querySessionStatus: querySessionStatus success for anonymous user"), { session_state: t10.session_state };
                  throw t10;
                });
              })) : (i.Log.error("UserManager.querySessionStatus: No silent_redirect_uri configured"), Promise.reject(new Error("No silent_redirect_uri configured")));
            }, e2.prototype._signin = function t8(e3, r2) {
              var n2 = this, i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
              return this._signinStart(e3, r2, i2).then(function(t9) {
                return n2._signinEnd(t9.url, e3);
              });
            }, e2.prototype._signinStart = function t8(e3, r2) {
              var n2 = this, o2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
              return r2.prepare(o2).then(function(t9) {
                return i.Log.debug("UserManager._signinStart: got navigator window handle"), n2.createSigninRequest(e3).then(function(e4) {
                  return i.Log.debug("UserManager._signinStart: got signin request"), o2.url = e4.url, o2.id = e4.state.id, t9.navigate(o2);
                }).catch(function(e4) {
                  throw t9.close && (i.Log.debug("UserManager._signinStart: Error after preparing navigator, closing navigator window"), t9.close()), e4;
                });
              });
            }, e2.prototype._signinEnd = function t8(e3) {
              var r2 = this, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
              return this.processSigninResponse(e3).then(function(t9) {
                i.Log.debug("UserManager._signinEnd: got signin response");
                var e4 = new a.User(t9);
                if (n2.current_sub) {
                  if (n2.current_sub !== e4.profile.sub)
                    return i.Log.debug("UserManager._signinEnd: current user does not match user returned from signin. sub from signin: ", e4.profile.sub), Promise.reject(new Error("login_required"));
                  i.Log.debug("UserManager._signinEnd: current user matches user returned from signin");
                }
                return r2.storeUser(e4).then(function() {
                  return i.Log.debug("UserManager._signinEnd: user stored"), r2._events.load(e4), e4;
                });
              });
            }, e2.prototype._signinCallback = function t8(e3, r2) {
              i.Log.debug("UserManager._signinCallback");
              var n2 = "query" === this._settings.response_mode || !this._settings.response_mode && l.SigninRequest.isCode(this._settings.response_type) ? "?" : "#";
              return r2.callback(e3, void 0, n2);
            }, e2.prototype.signoutRedirect = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (e3 = Object.assign({}, e3)).request_type = "so:r";
              var r2 = e3.post_logout_redirect_uri || this.settings.post_logout_redirect_uri;
              r2 && (e3.post_logout_redirect_uri = r2);
              var n2 = { useReplaceToNavigate: e3.useReplaceToNavigate };
              return this._signoutStart(e3, this._redirectNavigator, n2).then(function() {
                i.Log.info("UserManager.signoutRedirect: successful");
              });
            }, e2.prototype.signoutRedirectCallback = function t8(e3) {
              return this._signoutEnd(e3 || this._redirectNavigator.url).then(function(t9) {
                return i.Log.info("UserManager.signoutRedirectCallback: successful"), t9;
              });
            }, e2.prototype.signoutPopup = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              (e3 = Object.assign({}, e3)).request_type = "so:p";
              var r2 = e3.post_logout_redirect_uri || this.settings.popup_post_logout_redirect_uri || this.settings.post_logout_redirect_uri;
              return e3.post_logout_redirect_uri = r2, e3.display = "popup", e3.post_logout_redirect_uri && (e3.state = e3.state || {}), this._signout(e3, this._popupNavigator, { startUrl: r2, popupWindowFeatures: e3.popupWindowFeatures || this.settings.popupWindowFeatures, popupWindowTarget: e3.popupWindowTarget || this.settings.popupWindowTarget }).then(function() {
                i.Log.info("UserManager.signoutPopup: successful");
              });
            }, e2.prototype.signoutPopupCallback = function t8(e3, r2) {
              void 0 === r2 && "boolean" == typeof e3 && (r2 = e3, e3 = null);
              return this._popupNavigator.callback(e3, r2, "?").then(function() {
                i.Log.info("UserManager.signoutPopupCallback: successful");
              });
            }, e2.prototype._signout = function t8(e3, r2) {
              var n2 = this, i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
              return this._signoutStart(e3, r2, i2).then(function(t9) {
                return n2._signoutEnd(t9.url);
              });
            }, e2.prototype._signoutStart = function t8() {
              var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = this, n2 = arguments[1], o2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
              return n2.prepare(o2).then(function(t9) {
                return i.Log.debug("UserManager._signoutStart: got navigator window handle"), r2._loadUser().then(function(n3) {
                  return i.Log.debug("UserManager._signoutStart: loaded current user from storage"), (r2._settings.revokeAccessTokenOnSignout ? r2._revokeInternal(n3) : Promise.resolve()).then(function() {
                    var s2 = e3.id_token_hint || n3 && n3.id_token;
                    return s2 && (i.Log.debug("UserManager._signoutStart: Setting id_token into signout request"), e3.id_token_hint = s2), r2.removeUser().then(function() {
                      return i.Log.debug("UserManager._signoutStart: user removed, creating signout request"), r2.createSignoutRequest(e3).then(function(e4) {
                        return i.Log.debug("UserManager._signoutStart: got signout request"), o2.url = e4.url, e4.state && (o2.id = e4.state.id), t9.navigate(o2);
                      });
                    });
                  });
                }).catch(function(e4) {
                  throw t9.close && (i.Log.debug("UserManager._signoutStart: Error after preparing navigator, closing navigator window"), t9.close()), e4;
                });
              });
            }, e2.prototype._signoutEnd = function t8(e3) {
              return this.processSignoutResponse(e3).then(function(t9) {
                return i.Log.debug("UserManager._signoutEnd: got signout response"), t9;
              });
            }, e2.prototype.revokeAccessToken = function t8() {
              var e3 = this;
              return this._loadUser().then(function(t9) {
                return e3._revokeInternal(t9, true).then(function(r2) {
                  if (r2)
                    return i.Log.debug("UserManager.revokeAccessToken: removing token properties from user and re-storing"), t9.access_token = null, t9.refresh_token = null, t9.expires_at = null, t9.token_type = null, e3.storeUser(t9).then(function() {
                      i.Log.debug("UserManager.revokeAccessToken: user stored"), e3._events.load(t9);
                    });
                });
              }).then(function() {
                i.Log.info("UserManager.revokeAccessToken: access token revoked successfully");
              });
            }, e2.prototype._revokeInternal = function t8(e3, r2) {
              var n2 = this;
              if (e3) {
                var o2 = e3.access_token, s2 = e3.refresh_token;
                return this._revokeAccessTokenInternal(o2, r2).then(function(t9) {
                  return n2._revokeRefreshTokenInternal(s2, r2).then(function(e4) {
                    return t9 || e4 || i.Log.debug("UserManager.revokeAccessToken: no need to revoke due to no token(s), or JWT format"), t9 || e4;
                  });
                });
              }
              return Promise.resolve(false);
            }, e2.prototype._revokeAccessTokenInternal = function t8(e3, r2) {
              return !e3 || e3.indexOf(".") >= 0 ? Promise.resolve(false) : this._tokenRevocationClient.revoke(e3, r2).then(function() {
                return true;
              });
            }, e2.prototype._revokeRefreshTokenInternal = function t8(e3, r2) {
              return e3 ? this._tokenRevocationClient.revoke(e3, r2, "refresh_token").then(function() {
                return true;
              }) : Promise.resolve(false);
            }, e2.prototype.startSilentRenew = function t8() {
              this._silentRenewService.start();
            }, e2.prototype.stopSilentRenew = function t8() {
              this._silentRenewService.stop();
            }, e2.prototype._loadUser = function t8() {
              return this._userStore.get(this._userStoreKey).then(function(t9) {
                return t9 ? (i.Log.debug("UserManager._loadUser: user storageString loaded"), a.User.fromStorageString(t9)) : (i.Log.debug("UserManager._loadUser: no user storageString"), null);
              });
            }, e2.prototype.storeUser = function t8(e3) {
              if (e3) {
                i.Log.debug("UserManager.storeUser: storing user");
                var r2 = e3.toStorageString();
                return this._userStore.set(this._userStoreKey, r2);
              }
              return i.Log.debug("storeUser.storeUser: removing user"), this._userStore.remove(this._userStoreKey);
            }, n(e2, [{ key: "_redirectNavigator", get: function t8() {
              return this.settings.redirectNavigator;
            } }, { key: "_popupNavigator", get: function t8() {
              return this.settings.popupNavigator;
            } }, { key: "_iframeNavigator", get: function t8() {
              return this.settings.iframeNavigator;
            } }, { key: "_userStore", get: function t8() {
              return this.settings.userStore;
            } }, { key: "events", get: function t8() {
              return this._events;
            } }, { key: "_userStoreKey", get: function t8() {
              return "user:" + this.settings.authority + ":" + this.settings.client_id;
            } }]), e2;
          }(o.OidcClient);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.UserManagerSettings = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = (r(0), r(5)), o = r(40), s = r(41), a = r(43), u = r(6), c = r(1), h = r(8);
          function l(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          function f(t7, e2) {
            if (!t7)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e2 || "object" != typeof e2 && "function" != typeof e2 ? t7 : e2;
          }
          e.UserManagerSettings = function(t7) {
            function e2() {
              var r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = r2.popup_redirect_uri, i2 = r2.popup_post_logout_redirect_uri, g = r2.popupWindowFeatures, d = r2.popupWindowTarget, p = r2.silent_redirect_uri, v2 = r2.silentRequestTimeout, y = r2.automaticSilentRenew, m = void 0 !== y && y, _ = r2.validateSubOnSilentRenew, S = void 0 !== _ && _, b = r2.includeIdTokenInSilentRenew, w = void 0 === b || b, F = r2.monitorSession, E = void 0 === F || F, x = r2.monitorAnonymousSession, A2 = void 0 !== x && x, k = r2.checkSessionInterval, P2 = void 0 === k ? 2e3 : k, C = r2.stopCheckSessionOnError, T = void 0 === C || C, R = r2.query_status_response_type, I = r2.revokeAccessTokenOnSignout, D = void 0 !== I && I, L = r2.accessTokenExpiringNotificationTime, N = void 0 === L ? 60 : L, U = r2.redirectNavigator, B2 = void 0 === U ? new o.RedirectNavigator() : U, O = r2.popupNavigator, j = void 0 === O ? new s.PopupNavigator() : O, M = r2.iframeNavigator, H2 = void 0 === M ? new a.IFrameNavigator() : M, V2 = r2.userStore, K = void 0 === V2 ? new u.WebStorageStateStore({ store: c.Global.sessionStorage }) : V2;
              l(this, e2);
              var q = f(this, t7.call(this, arguments[0]));
              return q._popup_redirect_uri = n2, q._popup_post_logout_redirect_uri = i2, q._popupWindowFeatures = g, q._popupWindowTarget = d, q._silent_redirect_uri = p, q._silentRequestTimeout = v2, q._automaticSilentRenew = m, q._validateSubOnSilentRenew = S, q._includeIdTokenInSilentRenew = w, q._accessTokenExpiringNotificationTime = N, q._monitorSession = E, q._monitorAnonymousSession = A2, q._checkSessionInterval = P2, q._stopCheckSessionOnError = T, R ? q._query_status_response_type = R : arguments[0] && arguments[0].response_type ? q._query_status_response_type = h.SigninRequest.isOidc(arguments[0].response_type) ? "id_token" : "code" : q._query_status_response_type = "id_token", q._revokeAccessTokenOnSignout = D, q._redirectNavigator = B2, q._popupNavigator = j, q._iframeNavigator = H2, q._userStore = K, q;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), n(e2, [{ key: "popup_redirect_uri", get: function t8() {
              return this._popup_redirect_uri;
            } }, { key: "popup_post_logout_redirect_uri", get: function t8() {
              return this._popup_post_logout_redirect_uri;
            } }, { key: "popupWindowFeatures", get: function t8() {
              return this._popupWindowFeatures;
            } }, { key: "popupWindowTarget", get: function t8() {
              return this._popupWindowTarget;
            } }, { key: "silent_redirect_uri", get: function t8() {
              return this._silent_redirect_uri;
            } }, { key: "silentRequestTimeout", get: function t8() {
              return this._silentRequestTimeout;
            } }, { key: "automaticSilentRenew", get: function t8() {
              return this._automaticSilentRenew;
            } }, { key: "validateSubOnSilentRenew", get: function t8() {
              return this._validateSubOnSilentRenew;
            } }, { key: "includeIdTokenInSilentRenew", get: function t8() {
              return this._includeIdTokenInSilentRenew;
            } }, { key: "accessTokenExpiringNotificationTime", get: function t8() {
              return this._accessTokenExpiringNotificationTime;
            } }, { key: "monitorSession", get: function t8() {
              return this._monitorSession;
            } }, { key: "monitorAnonymousSession", get: function t8() {
              return this._monitorAnonymousSession;
            } }, { key: "checkSessionInterval", get: function t8() {
              return this._checkSessionInterval;
            } }, { key: "stopCheckSessionOnError", get: function t8() {
              return this._stopCheckSessionOnError;
            } }, { key: "query_status_response_type", get: function t8() {
              return this._query_status_response_type;
            } }, { key: "revokeAccessTokenOnSignout", get: function t8() {
              return this._revokeAccessTokenOnSignout;
            } }, { key: "redirectNavigator", get: function t8() {
              return this._redirectNavigator;
            } }, { key: "popupNavigator", get: function t8() {
              return this._popupNavigator;
            } }, { key: "iframeNavigator", get: function t8() {
              return this._iframeNavigator;
            } }, { key: "userStore", get: function t8() {
              return this._userStore;
            } }]), e2;
          }(i.OidcClientSettings);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.RedirectNavigator = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0);
          e.RedirectNavigator = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.prepare = function t8() {
              return Promise.resolve(this);
            }, t7.prototype.navigate = function t8(e2) {
              return e2 && e2.url ? (e2.useReplaceToNavigate ? window.location.replace(e2.url) : window.location = e2.url, Promise.resolve()) : (i.Log.error("RedirectNavigator.navigate: No url provided"), Promise.reject(new Error("No url provided")));
            }, n(t7, [{ key: "url", get: function t8() {
              return window.location.href;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.PopupNavigator = void 0;
          var n = r(0), i = r(42);
          e.PopupNavigator = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.prepare = function t8(e2) {
              var r2 = new i.PopupWindow(e2);
              return Promise.resolve(r2);
            }, t7.prototype.callback = function t8(e2, r2, o) {
              n.Log.debug("PopupNavigator.callback");
              try {
                return i.PopupWindow.notifyOpener(e2, r2, o), Promise.resolve();
              } catch (t9) {
                return Promise.reject(t9);
              }
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.PopupWindow = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(3);
          e.PopupWindow = function() {
            function t7(e2) {
              var r2 = this;
              !function n2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._promise = new Promise(function(t8, e3) {
                r2._resolve = t8, r2._reject = e3;
              });
              var o2 = e2.popupWindowTarget || "_blank", s = e2.popupWindowFeatures || "location=no,toolbar=no,width=500,height=500,left=100,top=100;";
              this._popup = window.open("", o2, s), this._popup && (i.Log.debug("PopupWindow.ctor: popup successfully created"), this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), 500));
            }
            return t7.prototype.navigate = function t8(e2) {
              return this._popup ? e2 && e2.url ? (i.Log.debug("PopupWindow.navigate: Setting URL in popup"), this._id = e2.id, this._id && (window["popupCallback_" + e2.id] = this._callback.bind(this)), this._popup.focus(), this._popup.window.location = e2.url) : (this._error("PopupWindow.navigate: no url provided"), this._error("No url provided")) : this._error("PopupWindow.navigate: Error opening popup window"), this.promise;
            }, t7.prototype._success = function t8(e2) {
              i.Log.debug("PopupWindow.callback: Successful response from popup window"), this._cleanup(), this._resolve(e2);
            }, t7.prototype._error = function t8(e2) {
              i.Log.error("PopupWindow.error: ", e2), this._cleanup(), this._reject(new Error(e2));
            }, t7.prototype.close = function t8() {
              this._cleanup(false);
            }, t7.prototype._cleanup = function t8(e2) {
              i.Log.debug("PopupWindow.cleanup"), window.clearInterval(this._checkForPopupClosedTimer), this._checkForPopupClosedTimer = null, delete window["popupCallback_" + this._id], this._popup && !e2 && this._popup.close(), this._popup = null;
            }, t7.prototype._checkForPopupClosed = function t8() {
              this._popup && !this._popup.closed || this._error("Popup window closed");
            }, t7.prototype._callback = function t8(e2, r2) {
              this._cleanup(r2), e2 ? (i.Log.debug("PopupWindow.callback success"), this._success({ url: e2 })) : (i.Log.debug("PopupWindow.callback: Invalid response from popup"), this._error("Invalid response from popup"));
            }, t7.notifyOpener = function t8(e2, r2, n2) {
              if (window.opener) {
                if (e2 = e2 || window.location.href) {
                  var s = o.UrlUtility.parseUrlFragment(e2, n2);
                  if (s.state) {
                    var a = "popupCallback_" + s.state, u = window.opener[a];
                    u ? (i.Log.debug("PopupWindow.notifyOpener: passing url message to opener"), u(e2, r2)) : i.Log.warn("PopupWindow.notifyOpener: no matching callback found on opener");
                  } else
                    i.Log.warn("PopupWindow.notifyOpener: no state found in response url");
                }
              } else
                i.Log.warn("PopupWindow.notifyOpener: no window.opener. Can't complete notification.");
            }, n(t7, [{ key: "promise", get: function t8() {
              return this._promise;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.IFrameNavigator = void 0;
          var n = r(0), i = r(44);
          e.IFrameNavigator = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.prepare = function t8(e2) {
              var r2 = new i.IFrameWindow(e2);
              return Promise.resolve(r2);
            }, t7.prototype.callback = function t8(e2) {
              n.Log.debug("IFrameNavigator.callback");
              try {
                return i.IFrameWindow.notifyParent(e2), Promise.resolve();
              } catch (t9) {
                return Promise.reject(t9);
              }
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.IFrameWindow = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0);
          e.IFrameWindow = function() {
            function t7(e2) {
              var r2 = this;
              !function n2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._promise = new Promise(function(t8, e3) {
                r2._resolve = t8, r2._reject = e3;
              }), this._boundMessageEvent = this._message.bind(this), window.addEventListener("message", this._boundMessageEvent, false), this._frame = window.document.createElement("iframe"), this._frame.style.visibility = "hidden", this._frame.style.position = "absolute", this._frame.width = 0, this._frame.height = 0, window.document.body.appendChild(this._frame);
            }
            return t7.prototype.navigate = function t8(e2) {
              if (e2 && e2.url) {
                var r2 = e2.silentRequestTimeout || 1e4;
                i.Log.debug("IFrameWindow.navigate: Using timeout of:", r2), this._timer = window.setTimeout(this._timeout.bind(this), r2), this._frame.src = e2.url;
              } else
                this._error("No url provided");
              return this.promise;
            }, t7.prototype._success = function t8(e2) {
              this._cleanup(), i.Log.debug("IFrameWindow: Successful response from frame window"), this._resolve(e2);
            }, t7.prototype._error = function t8(e2) {
              this._cleanup(), i.Log.error(e2), this._reject(new Error(e2));
            }, t7.prototype.close = function t8() {
              this._cleanup();
            }, t7.prototype._cleanup = function t8() {
              this._frame && (i.Log.debug("IFrameWindow: cleanup"), window.removeEventListener("message", this._boundMessageEvent, false), window.clearTimeout(this._timer), window.document.body.removeChild(this._frame), this._timer = null, this._frame = null, this._boundMessageEvent = null);
            }, t7.prototype._timeout = function t8() {
              i.Log.debug("IFrameWindow.timeout"), this._error("Frame window timed out");
            }, t7.prototype._message = function t8(e2) {
              if (i.Log.debug("IFrameWindow.message"), this._timer && e2.origin === this._origin && e2.source === this._frame.contentWindow && "string" == typeof e2.data && (e2.data.startsWith("http://") || e2.data.startsWith("https://"))) {
                var r2 = e2.data;
                r2 ? this._success({ url: r2 }) : this._error("Invalid response from frame");
              }
            }, t7.notifyParent = function t8(e2) {
              i.Log.debug("IFrameWindow.notifyParent"), (e2 = e2 || window.location.href) && (i.Log.debug("IFrameWindow.notifyParent: posting url message to parent"), window.parent.postMessage(e2, location.protocol + "//" + location.host));
            }, n(t7, [{ key: "promise", get: function t8() {
              return this._promise;
            } }, { key: "_origin", get: function t8() {
              return location.protocol + "//" + location.host;
            } }]), t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.UserManagerEvents = void 0;
          var n = r(0), i = r(16), o = r(17);
          e.UserManagerEvents = function(t7) {
            function e2(r2) {
              !function n2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, e2);
              var i2 = function s(t8, e3) {
                if (!t8)
                  throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e3 || "object" != typeof e3 && "function" != typeof e3 ? t8 : e3;
              }(this, t7.call(this, r2));
              return i2._userLoaded = new o.Event("User loaded"), i2._userUnloaded = new o.Event("User unloaded"), i2._silentRenewError = new o.Event("Silent renew error"), i2._userSignedIn = new o.Event("User signed in"), i2._userSignedOut = new o.Event("User signed out"), i2._userSessionChanged = new o.Event("User session changed"), i2;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), e2.prototype.load = function e3(r2) {
              var i2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
              n.Log.debug("UserManagerEvents.load"), t7.prototype.load.call(this, r2), i2 && this._userLoaded.raise(r2);
            }, e2.prototype.unload = function e3() {
              n.Log.debug("UserManagerEvents.unload"), t7.prototype.unload.call(this), this._userUnloaded.raise();
            }, e2.prototype.addUserLoaded = function t8(e3) {
              this._userLoaded.addHandler(e3);
            }, e2.prototype.removeUserLoaded = function t8(e3) {
              this._userLoaded.removeHandler(e3);
            }, e2.prototype.addUserUnloaded = function t8(e3) {
              this._userUnloaded.addHandler(e3);
            }, e2.prototype.removeUserUnloaded = function t8(e3) {
              this._userUnloaded.removeHandler(e3);
            }, e2.prototype.addSilentRenewError = function t8(e3) {
              this._silentRenewError.addHandler(e3);
            }, e2.prototype.removeSilentRenewError = function t8(e3) {
              this._silentRenewError.removeHandler(e3);
            }, e2.prototype._raiseSilentRenewError = function t8(e3) {
              n.Log.debug("UserManagerEvents._raiseSilentRenewError", e3.message), this._silentRenewError.raise(e3);
            }, e2.prototype.addUserSignedIn = function t8(e3) {
              this._userSignedIn.addHandler(e3);
            }, e2.prototype.removeUserSignedIn = function t8(e3) {
              this._userSignedIn.removeHandler(e3);
            }, e2.prototype._raiseUserSignedIn = function t8() {
              n.Log.debug("UserManagerEvents._raiseUserSignedIn"), this._userSignedIn.raise();
            }, e2.prototype.addUserSignedOut = function t8(e3) {
              this._userSignedOut.addHandler(e3);
            }, e2.prototype.removeUserSignedOut = function t8(e3) {
              this._userSignedOut.removeHandler(e3);
            }, e2.prototype._raiseUserSignedOut = function t8() {
              n.Log.debug("UserManagerEvents._raiseUserSignedOut"), this._userSignedOut.raise();
            }, e2.prototype.addUserSessionChanged = function t8(e3) {
              this._userSessionChanged.addHandler(e3);
            }, e2.prototype.removeUserSessionChanged = function t8(e3) {
              this._userSessionChanged.removeHandler(e3);
            }, e2.prototype._raiseUserSessionChanged = function t8() {
              n.Log.debug("UserManagerEvents._raiseUserSessionChanged"), this._userSessionChanged.raise();
            }, e2;
          }(i.AccessTokenEvents);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Timer = void 0;
          var n = /* @__PURE__ */ function() {
            function t7(t8, e2) {
              for (var r2 = 0; r2 < e2.length; r2++) {
                var n2 = e2[r2];
                n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t8, n2.key, n2);
              }
            }
            return function(e2, r2, n2) {
              return r2 && t7(e2.prototype, r2), n2 && t7(e2, n2), e2;
            };
          }(), i = r(0), o = r(1), s = r(17);
          function a(t7, e2) {
            if (!(t7 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          function u(t7, e2) {
            if (!t7)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e2 || "object" != typeof e2 && "function" != typeof e2 ? t7 : e2;
          }
          e.Timer = function(t7) {
            function e2(r2) {
              var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.Global.timer, i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
              a(this, e2);
              var s2 = u(this, t7.call(this, r2));
              return s2._timer = n2, s2._nowFunc = i2 || function() {
                return Date.now() / 1e3;
              }, s2;
            }
            return function r2(t8, e3) {
              if ("function" != typeof e3 && null !== e3)
                throw new TypeError("Super expression must either be null or a function, not " + typeof e3);
              t8.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t8, enumerable: false, writable: true, configurable: true } }), e3 && (Object.setPrototypeOf ? Object.setPrototypeOf(t8, e3) : t8.__proto__ = e3);
            }(e2, t7), e2.prototype.init = function t8(e3) {
              e3 <= 0 && (e3 = 1), e3 = parseInt(e3);
              var r2 = this.now + e3;
              if (this.expiration === r2 && this._timerHandle)
                i.Log.debug("Timer.init timer " + this._name + " skipping initialization since already initialized for expiration:", this.expiration);
              else {
                this.cancel(), i.Log.debug("Timer.init timer " + this._name + " for duration:", e3), this._expiration = r2;
                var n2 = 5;
                e3 < n2 && (n2 = e3), this._timerHandle = this._timer.setInterval(this._callback.bind(this), 1e3 * n2);
              }
            }, e2.prototype.cancel = function t8() {
              this._timerHandle && (i.Log.debug("Timer.cancel: ", this._name), this._timer.clearInterval(this._timerHandle), this._timerHandle = null);
            }, e2.prototype._callback = function e3() {
              var r2 = this._expiration - this.now;
              i.Log.debug("Timer.callback; " + this._name + " timer expires in:", r2), this._expiration <= this.now && (this.cancel(), t7.prototype.raise.call(this));
            }, n(e2, [{ key: "now", get: function t8() {
              return parseInt(this._nowFunc());
            } }, { key: "expiration", get: function t8() {
              return this._expiration;
            } }]), e2;
          }(s.Event);
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.SilentRenewService = void 0;
          var n = r(0);
          e.SilentRenewService = function() {
            function t7(e2) {
              !function r2(t8, e3) {
                if (!(t8 instanceof e3))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7), this._userManager = e2;
            }
            return t7.prototype.start = function t8() {
              this._callback || (this._callback = this._tokenExpiring.bind(this), this._userManager.events.addAccessTokenExpiring(this._callback), this._userManager.getUser().then(function(t9) {
              }).catch(function(t9) {
                n.Log.error("SilentRenewService.start: Error from getUser:", t9.message);
              }));
            }, t7.prototype.stop = function t8() {
              this._callback && (this._userManager.events.removeAccessTokenExpiring(this._callback), delete this._callback);
            }, t7.prototype._tokenExpiring = function t8() {
              var e2 = this;
              this._userManager.signinSilent().then(function(t9) {
                n.Log.debug("SilentRenewService._tokenExpiring: Silent token renewal successful");
              }, function(t9) {
                n.Log.error("SilentRenewService._tokenExpiring: Error from signinSilent:", t9.message), e2._userManager.events._raiseSilentRenewError(t9);
              });
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.CordovaPopupNavigator = void 0;
          var n = r(21);
          e.CordovaPopupNavigator = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.prepare = function t8(e2) {
              var r2 = new n.CordovaPopupWindow(e2);
              return Promise.resolve(r2);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.CordovaIFrameNavigator = void 0;
          var n = r(21);
          e.CordovaIFrameNavigator = function() {
            function t7() {
              !function e2(t8, r2) {
                if (!(t8 instanceof r2))
                  throw new TypeError("Cannot call a class as a function");
              }(this, t7);
            }
            return t7.prototype.prepare = function t8(e2) {
              e2.popupWindowFeatures = "hidden=yes";
              var r2 = new n.CordovaPopupWindow(e2);
              return Promise.resolve(r2);
            }, t7;
          }();
        }, function(t6, e, r) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          e.Version = "1.11.6";
        }]);
      });
    }
  });

  // src/transformers.mjs
  var transformers = {
    position: function(context, next) {
      const position = context.value;
      this.dataset.simplyPositionX = position.x || 0;
      this.dataset.simplyPositionY = position.y || 0;
      this.style.transform = `translate(${position.x}px, ${position.y}px`;
      return;
    },
    hideHidden: function(context, next) {
      const data = context.value;
      if (data) {
        this.closest(".zett-entity").classList.add("zett-hidden");
      }
      return next(context);
    }
  };

  // node_modules/jose/dist/browser/runtime/webcrypto.js
  var webcrypto_default = crypto;
  var isCryptoKey = (key) => key instanceof CryptoKey;

  // node_modules/jose/dist/browser/lib/buffer_utils.js
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var MAX_INT32 = 2 ** 32;
  function concat(...buffers) {
    const size = buffers.reduce((acc, { length }) => acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers) {
      buf.set(buffer, i);
      i += buffer.length;
    }
    return buf;
  }

  // node_modules/jose/dist/browser/runtime/base64url.js
  var encodeBase64 = (input) => {
    let unencoded = input;
    if (typeof unencoded === "string") {
      unencoded = encoder.encode(unencoded);
    }
    const CHUNK_SIZE = 32768;
    const arr = [];
    for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
      arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(""));
  };
  var encode = (input) => {
    return encodeBase64(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
  var decodeBase64 = (encoded) => {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };
  var decode = (input) => {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
      encoded = decoder.decode(encoded);
    }
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
    try {
      return decodeBase64(encoded);
    } catch {
      throw new TypeError("The input to be decoded is not correctly encoded.");
    }
  };

  // node_modules/jose/dist/browser/util/errors.js
  var JOSEError = class extends Error {
    constructor(message2, options) {
      super(message2, options);
      this.code = "ERR_JOSE_GENERIC";
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  JOSEError.code = "ERR_JOSE_GENERIC";
  var JWTClaimValidationFailed = class extends JOSEError {
    constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
      super(message2, { cause: { claim, reason, payload } });
      this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  };
  JWTClaimValidationFailed.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  var JWTExpired = class extends JOSEError {
    constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
      super(message2, { cause: { claim, reason, payload } });
      this.code = "ERR_JWT_EXPIRED";
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  };
  JWTExpired.code = "ERR_JWT_EXPIRED";
  var JOSEAlgNotAllowed = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
    }
  };
  JOSEAlgNotAllowed.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  var JOSENotSupported = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JOSE_NOT_SUPPORTED";
    }
  };
  JOSENotSupported.code = "ERR_JOSE_NOT_SUPPORTED";
  var JWEDecryptionFailed = class extends JOSEError {
    constructor(message2 = "decryption operation failed", options) {
      super(message2, options);
      this.code = "ERR_JWE_DECRYPTION_FAILED";
    }
  };
  JWEDecryptionFailed.code = "ERR_JWE_DECRYPTION_FAILED";
  var JWEInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JWE_INVALID";
    }
  };
  JWEInvalid.code = "ERR_JWE_INVALID";
  var JWSInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JWS_INVALID";
    }
  };
  JWSInvalid.code = "ERR_JWS_INVALID";
  var JWTInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JWT_INVALID";
    }
  };
  JWTInvalid.code = "ERR_JWT_INVALID";
  var JWKInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JWK_INVALID";
    }
  };
  JWKInvalid.code = "ERR_JWK_INVALID";
  var JWKSInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      this.code = "ERR_JWKS_INVALID";
    }
  };
  JWKSInvalid.code = "ERR_JWKS_INVALID";
  var JWKSNoMatchingKey = class extends JOSEError {
    constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
      super(message2, options);
      this.code = "ERR_JWKS_NO_MATCHING_KEY";
    }
  };
  JWKSNoMatchingKey.code = "ERR_JWKS_NO_MATCHING_KEY";
  var JWKSMultipleMatchingKeys = class extends JOSEError {
    constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
      super(message2, options);
      this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    }
  };
  JWKSMultipleMatchingKeys.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  var JWKSTimeout = class extends JOSEError {
    constructor(message2 = "request timed out", options) {
      super(message2, options);
      this.code = "ERR_JWKS_TIMEOUT";
    }
  };
  JWKSTimeout.code = "ERR_JWKS_TIMEOUT";
  var JWSSignatureVerificationFailed = class extends JOSEError {
    constructor(message2 = "signature verification failed", options) {
      super(message2, options);
      this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    }
  };
  JWSSignatureVerificationFailed.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

  // node_modules/jose/dist/browser/lib/crypto_key.js
  function unusable(name, prop = "algorithm.name") {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
  }
  function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
  }
  function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
  }
  function getNamedCurve(alg) {
    switch (alg) {
      case "ES256":
        return "P-256";
      case "ES384":
        return "P-384";
      case "ES512":
        return "P-521";
      default:
        throw new Error("unreachable");
    }
  }
  function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
      let msg = "CryptoKey does not support this operation, its usages must include ";
      if (usages.length > 2) {
        const last = usages.pop();
        msg += `one of ${usages.join(", ")}, or ${last}.`;
      } else if (usages.length === 2) {
        msg += `one of ${usages[0]} or ${usages[1]}.`;
      } else {
        msg += `${usages[0]}.`;
      }
      throw new TypeError(msg);
    }
  }
  function checkSigCryptoKey(key, alg, ...usages) {
    switch (alg) {
      case "HS256":
      case "HS384":
      case "HS512": {
        if (!isAlgorithm(key.algorithm, "HMAC"))
          throw unusable("HMAC");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "RS256":
      case "RS384":
      case "RS512": {
        if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
          throw unusable("RSASSA-PKCS1-v1_5");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "PS256":
      case "PS384":
      case "PS512": {
        if (!isAlgorithm(key.algorithm, "RSA-PSS"))
          throw unusable("RSA-PSS");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "EdDSA": {
        if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
          throw unusable("Ed25519 or Ed448");
        }
        break;
      }
      case "ES256":
      case "ES384":
      case "ES512": {
        if (!isAlgorithm(key.algorithm, "ECDSA"))
          throw unusable("ECDSA");
        const expected = getNamedCurve(alg);
        const actual = key.algorithm.namedCurve;
        if (actual !== expected)
          throw unusable(expected, "algorithm.namedCurve");
        break;
      }
      default:
        throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
  }

  // node_modules/jose/dist/browser/lib/invalid_key_input.js
  function message(msg, actual, ...types2) {
    types2 = types2.filter(Boolean);
    if (types2.length > 2) {
      const last = types2.pop();
      msg += `one of type ${types2.join(", ")}, or ${last}.`;
    } else if (types2.length === 2) {
      msg += `one of type ${types2[0]} or ${types2[1]}.`;
    } else {
      msg += `of type ${types2[0]}.`;
    }
    if (actual == null) {
      msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
      msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
      if (actual.constructor?.name) {
        msg += ` Received an instance of ${actual.constructor.name}`;
      }
    }
    return msg;
  }
  var invalid_key_input_default = (actual, ...types2) => {
    return message("Key must be ", actual, ...types2);
  };
  function withAlg(alg, actual, ...types2) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types2);
  }

  // node_modules/jose/dist/browser/runtime/is_key_like.js
  var is_key_like_default = (key) => {
    if (isCryptoKey(key)) {
      return true;
    }
    return key?.[Symbol.toStringTag] === "KeyObject";
  };
  var types = ["CryptoKey"];

  // node_modules/jose/dist/browser/lib/is_disjoint.js
  var isDisjoint = (...headers) => {
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
      return true;
    }
    let acc;
    for (const header of sources) {
      const parameters = Object.keys(header);
      if (!acc || acc.size === 0) {
        acc = new Set(parameters);
        continue;
      }
      for (const parameter of parameters) {
        if (acc.has(parameter)) {
          return false;
        }
        acc.add(parameter);
      }
    }
    return true;
  };
  var is_disjoint_default = isDisjoint;

  // node_modules/jose/dist/browser/lib/is_object.js
  function isObjectLike(value) {
    return typeof value === "object" && value !== null;
  }
  function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
      return false;
    }
    if (Object.getPrototypeOf(input) === null) {
      return true;
    }
    let proto = input;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
  }

  // node_modules/jose/dist/browser/runtime/check_key_length.js
  var check_key_length_default = (alg, key) => {
    if (alg.startsWith("RS") || alg.startsWith("PS")) {
      const { modulusLength } = key.algorithm;
      if (typeof modulusLength !== "number" || modulusLength < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
      }
    }
  };

  // node_modules/jose/dist/browser/lib/is_jwk.js
  function isJWK(key) {
    return isObject(key) && typeof key.kty === "string";
  }
  function isPrivateJWK(key) {
    return key.kty !== "oct" && typeof key.d === "string";
  }
  function isPublicJWK(key) {
    return key.kty !== "oct" && typeof key.d === "undefined";
  }
  function isSecretJWK(key) {
    return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
  }

  // node_modules/jose/dist/browser/runtime/jwk_to_key.js
  function subtleMapping(jwk) {
    let algorithm;
    let keyUsages;
    switch (jwk.kty) {
      case "RSA": {
        switch (jwk.alg) {
          case "PS256":
          case "PS384":
          case "PS512":
            algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            algorithm = {
              name: "RSA-OAEP",
              hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
            };
            keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
      case "EC": {
        switch (jwk.alg) {
          case "ES256":
            algorithm = { name: "ECDSA", namedCurve: "P-256" };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "ES384":
            algorithm = { name: "ECDSA", namedCurve: "P-384" };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "ES512":
            algorithm = { name: "ECDSA", namedCurve: "P-521" };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            algorithm = { name: "ECDH", namedCurve: jwk.crv };
            keyUsages = jwk.d ? ["deriveBits"] : [];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
      case "OKP": {
        switch (jwk.alg) {
          case "EdDSA":
            algorithm = { name: jwk.crv };
            keyUsages = jwk.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            algorithm = { name: jwk.crv };
            keyUsages = jwk.d ? ["deriveBits"] : [];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
      default:
        throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
    return { algorithm, keyUsages };
  }
  var parse = async (jwk) => {
    if (!jwk.alg) {
      throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    }
    const { algorithm, keyUsages } = subtleMapping(jwk);
    const rest = [
      algorithm,
      jwk.ext ?? false,
      jwk.key_ops ?? keyUsages
    ];
    const keyData = { ...jwk };
    delete keyData.alg;
    delete keyData.use;
    return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
  };
  var jwk_to_key_default = parse;

  // node_modules/jose/dist/browser/runtime/normalize_key.js
  var exportKeyValue = (k) => decode(k);
  var privCache;
  var pubCache;
  var isKeyObject = (key) => {
    return key?.[Symbol.toStringTag] === "KeyObject";
  };
  var importAndCache = async (cache, key, jwk, alg, freeze = false) => {
    let cached = cache.get(key);
    if (cached?.[alg]) {
      return cached[alg];
    }
    const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
    if (freeze)
      Object.freeze(key);
    if (!cached) {
      cache.set(key, { [alg]: cryptoKey });
    } else {
      cached[alg] = cryptoKey;
    }
    return cryptoKey;
  };
  var normalizePublicKey = (key, alg) => {
    if (isKeyObject(key)) {
      let jwk = key.export({ format: "jwk" });
      delete jwk.d;
      delete jwk.dp;
      delete jwk.dq;
      delete jwk.p;
      delete jwk.q;
      delete jwk.qi;
      if (jwk.k) {
        return exportKeyValue(jwk.k);
      }
      pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
      return importAndCache(pubCache, key, jwk, alg);
    }
    if (isJWK(key)) {
      if (key.k)
        return decode(key.k);
      pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
      const cryptoKey = importAndCache(pubCache, key, key, alg, true);
      return cryptoKey;
    }
    return key;
  };
  var normalizePrivateKey = (key, alg) => {
    if (isKeyObject(key)) {
      let jwk = key.export({ format: "jwk" });
      if (jwk.k) {
        return exportKeyValue(jwk.k);
      }
      privCache || (privCache = /* @__PURE__ */ new WeakMap());
      return importAndCache(privCache, key, jwk, alg);
    }
    if (isJWK(key)) {
      if (key.k)
        return decode(key.k);
      privCache || (privCache = /* @__PURE__ */ new WeakMap());
      const cryptoKey = importAndCache(privCache, key, key, alg, true);
      return cryptoKey;
    }
    return key;
  };
  var normalize_key_default = { normalizePublicKey, normalizePrivateKey };

  // node_modules/jose/dist/browser/key/import.js
  async function importJWK(jwk, alg) {
    if (!isObject(jwk)) {
      throw new TypeError("JWK must be an object");
    }
    alg || (alg = jwk.alg);
    switch (jwk.kty) {
      case "oct":
        if (typeof jwk.k !== "string" || !jwk.k) {
          throw new TypeError('missing "k" (Key Value) Parameter value');
        }
        return decode(jwk.k);
      case "RSA":
        if (jwk.oth !== void 0) {
          throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
        }
      case "EC":
      case "OKP":
        return jwk_to_key_default({ ...jwk, alg });
      default:
        throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
    }
  }

  // node_modules/jose/dist/browser/lib/check_key_type.js
  var tag = (key) => key?.[Symbol.toStringTag];
  var jwkMatchesOp = (alg, key, usage) => {
    if (key.use !== void 0 && key.use !== "sig") {
      throw new TypeError("Invalid key for this operation, when present its use must be sig");
    }
    if (key.key_ops !== void 0 && key.key_ops.includes?.(usage) !== true) {
      throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
    }
    if (key.alg !== void 0 && key.alg !== alg) {
      throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
    }
    return true;
  };
  var symmetricTypeCheck = (alg, key, usage, allowJwk) => {
    if (key instanceof Uint8Array)
      return;
    if (allowJwk && isJWK(key)) {
      if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
        return;
      throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!is_key_like_default(key)) {
      throw new TypeError(withAlg(alg, key, ...types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
    }
    if (key.type !== "secret") {
      throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
  };
  var asymmetricTypeCheck = (alg, key, usage, allowJwk) => {
    if (allowJwk && isJWK(key)) {
      switch (usage) {
        case "sign":
          if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
            return;
          throw new TypeError(`JSON Web Key for this operation be a private JWK`);
        case "verify":
          if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
            return;
          throw new TypeError(`JSON Web Key for this operation be a public JWK`);
      }
    }
    if (!is_key_like_default(key)) {
      throw new TypeError(withAlg(alg, key, ...types, allowJwk ? "JSON Web Key" : null));
    }
    if (key.type === "secret") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === "sign" && key.type === "public") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === "decrypt" && key.type === "public") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === "verify" && key.type === "private") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === "encrypt" && key.type === "private") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
  };
  function checkKeyType(allowJwk, alg, key, usage) {
    const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
      symmetricTypeCheck(alg, key, usage, allowJwk);
    } else {
      asymmetricTypeCheck(alg, key, usage, allowJwk);
    }
  }
  var check_key_type_default = checkKeyType.bind(void 0, false);
  var checkKeyTypeWithJwk = checkKeyType.bind(void 0, true);

  // node_modules/jose/dist/browser/lib/validate_crit.js
  function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
      throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === void 0) {
      return /* @__PURE__ */ new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
      throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== void 0) {
      recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
    } else {
      recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit) {
      if (!recognized.has(parameter)) {
        throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
      }
      if (joseHeader[parameter] === void 0) {
        throw new Err(`Extension Header Parameter "${parameter}" is missing`);
      }
      if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
        throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
      }
    }
    return new Set(protectedHeader.crit);
  }
  var validate_crit_default = validateCrit;

  // node_modules/jose/dist/browser/lib/validate_algorithms.js
  var validateAlgorithms = (option, algorithms) => {
    if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
      throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
      return void 0;
    }
    return new Set(algorithms);
  };
  var validate_algorithms_default = validateAlgorithms;

  // node_modules/jose/dist/browser/runtime/key_to_jwk.js
  var keyToJWK = async (key) => {
    if (key instanceof Uint8Array) {
      return {
        kty: "oct",
        k: encode(key)
      };
    }
    if (!isCryptoKey(key)) {
      throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array"));
    }
    if (!key.extractable) {
      throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");
    }
    const { ext, key_ops, alg, use, ...jwk } = await webcrypto_default.subtle.exportKey("jwk", key);
    return jwk;
  };
  var key_to_jwk_default = keyToJWK;

  // node_modules/jose/dist/browser/key/export.js
  async function exportJWK(key) {
    return key_to_jwk_default(key);
  }

  // node_modules/jose/dist/browser/runtime/subtle_dsa.js
  function subtleDsa(alg, algorithm) {
    const hash = `SHA-${alg.slice(-3)}`;
    switch (alg) {
      case "HS256":
      case "HS384":
      case "HS512":
        return { hash, name: "HMAC" };
      case "PS256":
      case "PS384":
      case "PS512":
        return { hash, name: "RSA-PSS", saltLength: alg.slice(-3) >> 3 };
      case "RS256":
      case "RS384":
      case "RS512":
        return { hash, name: "RSASSA-PKCS1-v1_5" };
      case "ES256":
      case "ES384":
      case "ES512":
        return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
      case "EdDSA":
        return { name: algorithm.name };
      default:
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
  }

  // node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
  async function getCryptoKey(alg, key, usage) {
    if (usage === "sign") {
      key = await normalize_key_default.normalizePrivateKey(key, alg);
    }
    if (usage === "verify") {
      key = await normalize_key_default.normalizePublicKey(key, alg);
    }
    if (isCryptoKey(key)) {
      checkSigCryptoKey(key, alg, usage);
      return key;
    }
    if (key instanceof Uint8Array) {
      if (!alg.startsWith("HS")) {
        throw new TypeError(invalid_key_input_default(key, ...types));
      }
      return webcrypto_default.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
    }
    throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array", "JSON Web Key"));
  }

  // node_modules/jose/dist/browser/runtime/verify.js
  var verify = async (alg, key, signature, data) => {
    const cryptoKey = await getCryptoKey(alg, key, "verify");
    check_key_length_default(alg, cryptoKey);
    const algorithm = subtleDsa(alg, cryptoKey.algorithm);
    try {
      return await webcrypto_default.subtle.verify(algorithm, cryptoKey, signature, data);
    } catch {
      return false;
    }
  };
  var verify_default = verify;

  // node_modules/jose/dist/browser/jws/flattened/verify.js
  async function flattenedVerify(jws, key, options) {
    if (!isObject(jws)) {
      throw new JWSInvalid("Flattened JWS must be an object");
    }
    if (jws.protected === void 0 && jws.header === void 0) {
      throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== void 0 && typeof jws.protected !== "string") {
      throw new JWSInvalid("JWS Protected Header incorrect type");
    }
    if (jws.payload === void 0) {
      throw new JWSInvalid("JWS Payload missing");
    }
    if (typeof jws.signature !== "string") {
      throw new JWSInvalid("JWS Signature missing or incorrect type");
    }
    if (jws.header !== void 0 && !isObject(jws.header)) {
      throw new JWSInvalid("JWS Unprotected Header incorrect type");
    }
    let parsedProt = {};
    if (jws.protected) {
      try {
        const protectedHeader = decode(jws.protected);
        parsedProt = JSON.parse(decoder.decode(protectedHeader));
      } catch {
        throw new JWSInvalid("JWS Protected Header is invalid");
      }
    }
    if (!is_disjoint_default(parsedProt, jws.header)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...parsedProt,
      ...jws.header
    };
    const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
      b64 = parsedProt.b64;
      if (typeof b64 !== "boolean") {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
      throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (b64) {
      if (typeof jws.payload !== "string") {
        throw new JWSInvalid("JWS Payload must be a string");
      }
    } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
      throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
    }
    let resolvedKey = false;
    if (typeof key === "function") {
      key = await key(parsedProt, jws);
      resolvedKey = true;
      checkKeyTypeWithJwk(alg, key, "verify");
      if (isJWK(key)) {
        key = await importJWK(key, alg);
      }
    } else {
      checkKeyTypeWithJwk(alg, key, "verify");
    }
    const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
    let signature;
    try {
      signature = decode(jws.signature);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the signature");
    }
    const verified = await verify_default(alg, key, signature, data);
    if (!verified) {
      throw new JWSSignatureVerificationFailed();
    }
    let payload;
    if (b64) {
      try {
        payload = decode(jws.payload);
      } catch {
        throw new JWSInvalid("Failed to base64url decode the payload");
      }
    } else if (typeof jws.payload === "string") {
      payload = encoder.encode(jws.payload);
    } else {
      payload = jws.payload;
    }
    const result = { payload };
    if (jws.protected !== void 0) {
      result.protectedHeader = parsedProt;
    }
    if (jws.header !== void 0) {
      result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
      return { ...result, key };
    }
    return result;
  }

  // node_modules/jose/dist/browser/jws/compact/verify.js
  async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
      jws = decoder.decode(jws);
    }
    if (typeof jws !== "string") {
      throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
    if (length !== 3) {
      throw new JWSInvalid("Invalid Compact JWS");
    }
    const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
    const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: verified.key };
    }
    return result;
  }

  // node_modules/jose/dist/browser/lib/epoch.js
  var epoch_default = (date) => Math.floor(date.getTime() / 1e3);

  // node_modules/jose/dist/browser/lib/secs.js
  var minute = 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var year = day * 365.25;
  var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
  var secs_default = (str) => {
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
      throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch (unit) {
      case "sec":
      case "secs":
      case "second":
      case "seconds":
      case "s":
        numericDate = Math.round(value);
        break;
      case "minute":
      case "minutes":
      case "min":
      case "mins":
      case "m":
        numericDate = Math.round(value * minute);
        break;
      case "hour":
      case "hours":
      case "hr":
      case "hrs":
      case "h":
        numericDate = Math.round(value * hour);
        break;
      case "day":
      case "days":
      case "d":
        numericDate = Math.round(value * day);
        break;
      case "week":
      case "weeks":
      case "w":
        numericDate = Math.round(value * week);
        break;
      default:
        numericDate = Math.round(value * year);
        break;
    }
    if (matched[1] === "-" || matched[4] === "ago") {
      return -numericDate;
    }
    return numericDate;
  };

  // node_modules/jose/dist/browser/lib/jwt_claims_set.js
  var normalizeTyp = (value) => value.toLowerCase().replace(/^application\//, "");
  var checkAudiencePresence = (audPayload, audOption) => {
    if (typeof audPayload === "string") {
      return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
      return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
  };
  var jwt_claims_set_default = (protectedHeader, encodedPayload, options = {}) => {
    let payload;
    try {
      payload = JSON.parse(decoder.decode(encodedPayload));
    } catch {
    }
    if (!isObject(payload)) {
      throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
    }
    const { typ } = options;
    if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
      throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [...requiredClaims];
    if (maxTokenAge !== void 0)
      presenceCheck.push("iat");
    if (audience !== void 0)
      presenceCheck.push("aud");
    if (subject !== void 0)
      presenceCheck.push("sub");
    if (issuer !== void 0)
      presenceCheck.push("iss");
    for (const claim of new Set(presenceCheck.reverse())) {
      if (!(claim in payload)) {
        throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
      }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
      throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
    }
    if (subject && payload.sub !== subject) {
      throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
      throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
    }
    let tolerance;
    switch (typeof options.clockTolerance) {
      case "string":
        tolerance = secs_default(options.clockTolerance);
        break;
      case "number":
        tolerance = options.clockTolerance;
        break;
      case "undefined":
        tolerance = 0;
        break;
      default:
        throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate } = options;
    const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
    if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
      throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
    }
    if (payload.nbf !== void 0) {
      if (typeof payload.nbf !== "number") {
        throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
      }
      if (payload.nbf > now + tolerance) {
        throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
      }
    }
    if (payload.exp !== void 0) {
      if (typeof payload.exp !== "number") {
        throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
      }
      if (payload.exp <= now - tolerance) {
        throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
      }
    }
    if (maxTokenAge) {
      const age = now - payload.iat;
      const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
      if (age - tolerance > max) {
        throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
      }
      if (age < 0 - tolerance) {
        throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
      }
    }
    return payload;
  };

  // node_modules/jose/dist/browser/jwt/verify.js
  async function jwtVerify(jwt, key, options) {
    const verified = await compactVerify(jwt, key, options);
    if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    const payload = jwt_claims_set_default(verified.protectedHeader, verified.payload, options);
    const result = { payload, protectedHeader: verified.protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: verified.key };
    }
    return result;
  }

  // node_modules/jose/dist/browser/runtime/sign.js
  var sign = async (alg, key, data) => {
    const cryptoKey = await getCryptoKey(alg, key, "sign");
    check_key_length_default(alg, cryptoKey);
    const signature = await webcrypto_default.subtle.sign(subtleDsa(alg, cryptoKey.algorithm), cryptoKey, data);
    return new Uint8Array(signature);
  };
  var sign_default = sign;

  // node_modules/jose/dist/browser/jws/flattened/sign.js
  var FlattenedSign = class {
    constructor(payload) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError("payload must be an instance of Uint8Array");
      }
      this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
      if (this._protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this._protectedHeader = protectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      if (this._unprotectedHeader) {
        throw new TypeError("setUnprotectedHeader can only be called once");
      }
      this._unprotectedHeader = unprotectedHeader;
      return this;
    }
    async sign(key, options) {
      if (!this._protectedHeader && !this._unprotectedHeader) {
        throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
      }
      if (!is_disjoint_default(this._protectedHeader, this._unprotectedHeader)) {
        throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
      }
      const joseHeader = {
        ...this._protectedHeader,
        ...this._unprotectedHeader
      };
      const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this._protectedHeader, joseHeader);
      let b64 = true;
      if (extensions.has("b64")) {
        b64 = this._protectedHeader.b64;
        if (typeof b64 !== "boolean") {
          throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
      }
      const { alg } = joseHeader;
      if (typeof alg !== "string" || !alg) {
        throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
      }
      checkKeyTypeWithJwk(alg, key, "sign");
      let payload = this._payload;
      if (b64) {
        payload = encoder.encode(encode(payload));
      }
      let protectedHeader;
      if (this._protectedHeader) {
        protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
      } else {
        protectedHeader = encoder.encode("");
      }
      const data = concat(protectedHeader, encoder.encode("."), payload);
      const signature = await sign_default(alg, key, data);
      const jws = {
        signature: encode(signature),
        payload: ""
      };
      if (b64) {
        jws.payload = decoder.decode(payload);
      }
      if (this._unprotectedHeader) {
        jws.header = this._unprotectedHeader;
      }
      if (this._protectedHeader) {
        jws.protected = decoder.decode(protectedHeader);
      }
      return jws;
    }
  };

  // node_modules/jose/dist/browser/jws/compact/sign.js
  var CompactSign = class {
    constructor(payload) {
      this._flattened = new FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
      this._flattened.setProtectedHeader(protectedHeader);
      return this;
    }
    async sign(key, options) {
      const jws = await this._flattened.sign(key, options);
      if (jws.payload === void 0) {
        throw new TypeError("use the flattened module for creating JWS with b64: false");
      }
      return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
  };

  // node_modules/jose/dist/browser/jwt/produce.js
  function validateInput(label, input) {
    if (!Number.isFinite(input)) {
      throw new TypeError(`Invalid ${label} input`);
    }
    return input;
  }
  var ProduceJWT = class {
    constructor(payload = {}) {
      if (!isObject(payload)) {
        throw new TypeError("JWT Claims Set MUST be an object");
      }
      this._payload = payload;
    }
    setIssuer(issuer) {
      this._payload = { ...this._payload, iss: issuer };
      return this;
    }
    setSubject(subject) {
      this._payload = { ...this._payload, sub: subject };
      return this;
    }
    setAudience(audience) {
      this._payload = { ...this._payload, aud: audience };
      return this;
    }
    setJti(jwtId) {
      this._payload = { ...this._payload, jti: jwtId };
      return this;
    }
    setNotBefore(input) {
      if (typeof input === "number") {
        this._payload = { ...this._payload, nbf: validateInput("setNotBefore", input) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, nbf: validateInput("setNotBefore", epoch_default(input)) };
      } else {
        this._payload = { ...this._payload, nbf: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
      }
      return this;
    }
    setExpirationTime(input) {
      if (typeof input === "number") {
        this._payload = { ...this._payload, exp: validateInput("setExpirationTime", input) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, exp: validateInput("setExpirationTime", epoch_default(input)) };
      } else {
        this._payload = { ...this._payload, exp: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
      }
      return this;
    }
    setIssuedAt(input) {
      if (typeof input === "undefined") {
        this._payload = { ...this._payload, iat: epoch_default(/* @__PURE__ */ new Date()) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, iat: validateInput("setIssuedAt", epoch_default(input)) };
      } else if (typeof input === "string") {
        this._payload = {
          ...this._payload,
          iat: validateInput("setIssuedAt", epoch_default(/* @__PURE__ */ new Date()) + secs_default(input))
        };
      } else {
        this._payload = { ...this._payload, iat: validateInput("setIssuedAt", input) };
      }
      return this;
    }
  };

  // node_modules/jose/dist/browser/jwt/sign.js
  var SignJWT = class extends ProduceJWT {
    setProtectedHeader(protectedHeader) {
      this._protectedHeader = protectedHeader;
      return this;
    }
    async sign(key, options) {
      const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)));
      sig.setProtectedHeader(this._protectedHeader);
      if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
        throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
      }
      return sig.sign(key, options);
    }
  };

  // node_modules/jose/dist/browser/jwks/local.js
  function getKtyFromAlg(alg) {
    switch (typeof alg === "string" && alg.slice(0, 2)) {
      case "RS":
      case "PS":
        return "RSA";
      case "ES":
        return "EC";
      case "Ed":
        return "OKP";
      default:
        throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    }
  }
  function isJWKSLike(jwks) {
    return jwks && typeof jwks === "object" && Array.isArray(jwks.keys) && jwks.keys.every(isJWKLike);
  }
  function isJWKLike(key) {
    return isObject(key);
  }
  function clone(obj) {
    if (typeof structuredClone === "function") {
      return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
  }
  var LocalJWKSet = class {
    constructor(jwks) {
      this._cached = /* @__PURE__ */ new WeakMap();
      if (!isJWKSLike(jwks)) {
        throw new JWKSInvalid("JSON Web Key Set malformed");
      }
      this._jwks = clone(jwks);
    }
    async getKey(protectedHeader, token) {
      const { alg, kid } = { ...protectedHeader, ...token?.header };
      const kty = getKtyFromAlg(alg);
      const candidates = this._jwks.keys.filter((jwk2) => {
        let candidate = kty === jwk2.kty;
        if (candidate && typeof kid === "string") {
          candidate = kid === jwk2.kid;
        }
        if (candidate && typeof jwk2.alg === "string") {
          candidate = alg === jwk2.alg;
        }
        if (candidate && typeof jwk2.use === "string") {
          candidate = jwk2.use === "sig";
        }
        if (candidate && Array.isArray(jwk2.key_ops)) {
          candidate = jwk2.key_ops.includes("verify");
        }
        if (candidate && alg === "EdDSA") {
          candidate = jwk2.crv === "Ed25519" || jwk2.crv === "Ed448";
        }
        if (candidate) {
          switch (alg) {
            case "ES256":
              candidate = jwk2.crv === "P-256";
              break;
            case "ES256K":
              candidate = jwk2.crv === "secp256k1";
              break;
            case "ES384":
              candidate = jwk2.crv === "P-384";
              break;
            case "ES512":
              candidate = jwk2.crv === "P-521";
              break;
          }
        }
        return candidate;
      });
      const { 0: jwk, length } = candidates;
      if (length === 0) {
        throw new JWKSNoMatchingKey();
      }
      if (length !== 1) {
        const error = new JWKSMultipleMatchingKeys();
        const { _cached } = this;
        error[Symbol.asyncIterator] = async function* () {
          for (const jwk2 of candidates) {
            try {
              yield await importWithAlgCache(_cached, jwk2, alg);
            } catch {
            }
          }
        };
        throw error;
      }
      return importWithAlgCache(this._cached, jwk, alg);
    }
  };
  async function importWithAlgCache(cache, jwk, alg) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
    if (cached[alg] === void 0) {
      const key = await importJWK({ ...jwk, ext: true }, alg);
      if (key instanceof Uint8Array || key.type !== "public") {
        throw new JWKSInvalid("JSON Web Key Set members must be public keys");
      }
      cached[alg] = key;
    }
    return cached[alg];
  }
  function createLocalJWKSet(jwks) {
    const set = new LocalJWKSet(jwks);
    const localJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
    Object.defineProperties(localJWKSet, {
      jwks: {
        value: () => clone(set._jwks),
        enumerable: true,
        configurable: false,
        writable: false
      }
    });
    return localJWKSet;
  }

  // node_modules/jose/dist/browser/runtime/fetch_jwks.js
  var fetchJwks = async (url, timeout, options) => {
    let controller;
    let id;
    let timedOut = false;
    if (typeof AbortController === "function") {
      controller = new AbortController();
      id = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeout);
    }
    const response = await fetch(url.href, {
      signal: controller ? controller.signal : void 0,
      redirect: "manual",
      headers: options.headers
    }).catch((err) => {
      if (timedOut)
        throw new JWKSTimeout();
      throw err;
    });
    if (id !== void 0)
      clearTimeout(id);
    if (response.status !== 200) {
      throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
    }
    try {
      return await response.json();
    } catch {
      throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
  };
  var fetch_jwks_default = fetchJwks;

  // node_modules/jose/dist/browser/jwks/remote.js
  function isCloudflareWorkers() {
    return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
  }
  var USER_AGENT;
  if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
    const NAME = "jose";
    const VERSION = "v5.9.6";
    USER_AGENT = `${NAME}/${VERSION}`;
  }
  var jwksCache = Symbol();
  function isFreshJwksCache(input, cacheMaxAge) {
    if (typeof input !== "object" || input === null) {
      return false;
    }
    if (!("uat" in input) || typeof input.uat !== "number" || Date.now() - input.uat >= cacheMaxAge) {
      return false;
    }
    if (!("jwks" in input) || !isObject(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, isObject)) {
      return false;
    }
    return true;
  }
  var RemoteJWKSet = class {
    constructor(url, options) {
      if (!(url instanceof URL)) {
        throw new TypeError("url must be an instance of URL");
      }
      this._url = new URL(url.href);
      this._options = { agent: options?.agent, headers: options?.headers };
      this._timeoutDuration = typeof options?.timeoutDuration === "number" ? options?.timeoutDuration : 5e3;
      this._cooldownDuration = typeof options?.cooldownDuration === "number" ? options?.cooldownDuration : 3e4;
      this._cacheMaxAge = typeof options?.cacheMaxAge === "number" ? options?.cacheMaxAge : 6e5;
      if (options?.[jwksCache] !== void 0) {
        this._cache = options?.[jwksCache];
        if (isFreshJwksCache(options?.[jwksCache], this._cacheMaxAge)) {
          this._jwksTimestamp = this._cache.uat;
          this._local = createLocalJWKSet(this._cache.jwks);
        }
      }
    }
    coolingDown() {
      return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cooldownDuration : false;
    }
    fresh() {
      return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cacheMaxAge : false;
    }
    async getKey(protectedHeader, token) {
      if (!this._local || !this.fresh()) {
        await this.reload();
      }
      try {
        return await this._local(protectedHeader, token);
      } catch (err) {
        if (err instanceof JWKSNoMatchingKey) {
          if (this.coolingDown() === false) {
            await this.reload();
            return this._local(protectedHeader, token);
          }
        }
        throw err;
      }
    }
    async reload() {
      if (this._pendingFetch && isCloudflareWorkers()) {
        this._pendingFetch = void 0;
      }
      const headers = new Headers(this._options.headers);
      if (USER_AGENT && !headers.has("User-Agent")) {
        headers.set("User-Agent", USER_AGENT);
        this._options.headers = Object.fromEntries(headers.entries());
      }
      this._pendingFetch || (this._pendingFetch = fetch_jwks_default(this._url, this._timeoutDuration, this._options).then((json) => {
        this._local = createLocalJWKSet(json);
        if (this._cache) {
          this._cache.uat = Date.now();
          this._cache.jwks = json;
        }
        this._jwksTimestamp = Date.now();
        this._pendingFetch = void 0;
      }).catch((err) => {
        this._pendingFetch = void 0;
        throw err;
      }));
      await this._pendingFetch;
    }
  };
  function createRemoteJWKSet(url, options) {
    const set = new RemoteJWKSet(url, options);
    const remoteJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
    Object.defineProperties(remoteJWKSet, {
      coolingDown: {
        get: () => set.coolingDown(),
        enumerable: true,
        configurable: false
      },
      fresh: {
        get: () => set.fresh(),
        enumerable: true,
        configurable: false
      },
      reload: {
        value: () => set.reload(),
        enumerable: true,
        configurable: false,
        writable: false
      },
      reloading: {
        get: () => !!set._pendingFetch,
        enumerable: true,
        configurable: false
      },
      jwks: {
        value: () => set._local?.jwks(),
        enumerable: true,
        configurable: false,
        writable: false
      }
    });
    return remoteJWKSet;
  }

  // node_modules/jose/dist/browser/runtime/generate.js
  function getModulusLengthOption(options) {
    const modulusLength = options?.modulusLength ?? 2048;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
    }
    return modulusLength;
  }
  async function generateKeyPair(alg, options) {
    let algorithm;
    let keyUsages;
    switch (alg) {
      case "PS256":
      case "PS384":
      case "PS512":
        algorithm = {
          name: "RSA-PSS",
          hash: `SHA-${alg.slice(-3)}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: getModulusLengthOption(options)
        };
        keyUsages = ["sign", "verify"];
        break;
      case "RS256":
      case "RS384":
      case "RS512":
        algorithm = {
          name: "RSASSA-PKCS1-v1_5",
          hash: `SHA-${alg.slice(-3)}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: getModulusLengthOption(options)
        };
        keyUsages = ["sign", "verify"];
        break;
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512":
        algorithm = {
          name: "RSA-OAEP",
          hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`,
          publicExponent: new Uint8Array([1, 0, 1]),
          modulusLength: getModulusLengthOption(options)
        };
        keyUsages = ["decrypt", "unwrapKey", "encrypt", "wrapKey"];
        break;
      case "ES256":
        algorithm = { name: "ECDSA", namedCurve: "P-256" };
        keyUsages = ["sign", "verify"];
        break;
      case "ES384":
        algorithm = { name: "ECDSA", namedCurve: "P-384" };
        keyUsages = ["sign", "verify"];
        break;
      case "ES512":
        algorithm = { name: "ECDSA", namedCurve: "P-521" };
        keyUsages = ["sign", "verify"];
        break;
      case "EdDSA": {
        keyUsages = ["sign", "verify"];
        const crv = options?.crv ?? "Ed25519";
        switch (crv) {
          case "Ed25519":
          case "Ed448":
            algorithm = { name: crv };
            break;
          default:
            throw new JOSENotSupported("Invalid or unsupported crv option provided");
        }
        break;
      }
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW": {
        keyUsages = ["deriveKey", "deriveBits"];
        const crv = options?.crv ?? "P-256";
        switch (crv) {
          case "P-256":
          case "P-384":
          case "P-521": {
            algorithm = { name: "ECDH", namedCurve: crv };
            break;
          }
          case "X25519":
          case "X448":
            algorithm = { name: crv };
            break;
          default:
            throw new JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
        }
        break;
      }
      default:
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return webcrypto_default.subtle.generateKey(algorithm, options?.extractable ?? false, keyUsages);
  }

  // node_modules/jose/dist/browser/key/generate_key_pair.js
  async function generateKeyPair2(alg, options) {
    return generateKeyPair(alg, options);
  }

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      if (typeof crypto === "undefined" || !crypto.getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
      getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = { randomUUID };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // node_modules/@inrupt/solid-client-authn-core/dist/index.mjs
  var SOLID_CLIENT_AUTHN_KEY_PREFIX = "solidClientAuthn:";
  var PREFERRED_SIGNING_ALG = ["ES256", "RS256"];
  var EVENTS = {
    // Note that an `error` events MUST be listened to: https://nodejs.org/dist/latest-v16.x/docs/api/events.html#error-events.
    ERROR: "error",
    LOGIN: "login",
    LOGOUT: "logout",
    NEW_REFRESH_TOKEN: "newRefreshToken",
    SESSION_EXPIRED: "sessionExpired",
    SESSION_EXTENDED: "sessionExtended",
    SESSION_RESTORED: "sessionRestore",
    TIMEOUT_SET: "timeoutSet"
  };
  var REFRESH_BEFORE_EXPIRATION_SECONDS = 5;
  var SCOPE_OPENID = "openid";
  var SCOPE_OFFLINE = "offline_access";
  var SCOPE_WEBID = "webid";
  var DEFAULT_SCOPES = [SCOPE_OPENID, SCOPE_OFFLINE, SCOPE_WEBID].join(" ");
  var AggregateHandler = class {
    constructor(handleables) {
      this.handleables = handleables;
      this.handleables = handleables;
    }
    /**
     * Helper function that will asynchronously determine the proper handler to use. If multiple
     * handlers can handle, it will choose the first one in the list
     * @param params Paramerters to feed to the handler
     */
    async getProperHandler(params) {
      const canHandleList = await Promise.all(this.handleables.map((handleable) => handleable.canHandle(...params)));
      for (let i = 0; i < canHandleList.length; i += 1) {
        if (canHandleList[i]) {
          return this.handleables[i];
        }
      }
      return null;
    }
    async canHandle(...params) {
      return await this.getProperHandler(params) !== null;
    }
    async handle(...params) {
      const handler = await this.getProperHandler(params);
      if (handler) {
        return handler.handle(...params);
      }
      throw new Error(`[${this.constructor.name}] cannot find a suitable handler for: ${params.map((param) => {
        try {
          return JSON.stringify(param);
        } catch (err) {
          return param.toString();
        }
      }).join(", ")}`);
    }
  };
  async function getWebidFromTokenPayload(idToken, jwksIri, issuerIri, clientId) {
    let payload;
    let clientIdInPayload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(idToken, createRemoteJWKSet(new URL(jwksIri)), {
        issuer: issuerIri,
        audience: clientId
      });
      payload = verifiedPayload;
    } catch (e) {
      throw new Error(`Token verification failed: ${e.stack}`);
    }
    if (typeof payload.azp === "string") {
      clientIdInPayload = payload.azp;
    }
    if (typeof payload.webid === "string") {
      return {
        webId: payload.webid,
        clientId: clientIdInPayload
      };
    }
    if (typeof payload.sub !== "string") {
      throw new Error(`The token ${JSON.stringify(payload)} is invalid: it has no 'webid' claim and no 'sub' claim.`);
    }
    try {
      new URL(payload.sub);
      return {
        webId: payload.sub,
        clientId: clientIdInPayload
      };
    } catch (e) {
      throw new Error(`The token has no 'webid' claim, and its 'sub' claim of [${payload.sub}] is invalid as a URL - error [${e}].`);
    }
  }
  function isValidRedirectUrl(redirectUrl) {
    try {
      const urlObject = new URL(redirectUrl);
      const noReservedQuery = !urlObject.searchParams.has("code") && !urlObject.searchParams.has("state");
      const noHash = urlObject.hash === "";
      return noReservedQuery && noHash;
    } catch (e) {
      return false;
    }
  }
  function removeOpenIdParams(redirectUrl) {
    const cleanedUpUrl = new URL(redirectUrl);
    cleanedUpUrl.searchParams.delete("state");
    cleanedUpUrl.searchParams.delete("code");
    cleanedUpUrl.searchParams.delete("error");
    cleanedUpUrl.searchParams.delete("error_description");
    cleanedUpUrl.searchParams.delete("iss");
    return cleanedUpUrl;
  }
  function booleanWithFallback(value, fallback) {
    if (typeof value === "boolean") {
      return Boolean(value);
    }
    return Boolean(fallback);
  }
  var AuthorizationCodeWithPkceOidcHandlerBase = class {
    constructor(storageUtility, redirector) {
      this.storageUtility = storageUtility;
      this.redirector = redirector;
      this.parametersGuard = (oidcLoginOptions) => {
        return oidcLoginOptions.issuerConfiguration.grantTypesSupported !== void 0 && oidcLoginOptions.issuerConfiguration.grantTypesSupported.indexOf("authorization_code") > -1 && oidcLoginOptions.redirectUrl !== void 0;
      };
      this.storageUtility = storageUtility;
      this.redirector = redirector;
    }
    async canHandle(oidcLoginOptions) {
      return this.parametersGuard(oidcLoginOptions);
    }
    async handleRedirect({ oidcLoginOptions, state, codeVerifier, targetUrl }) {
      if (!this.parametersGuard(oidcLoginOptions)) {
        throw new Error("The authorization code grant requires a redirectUrl.");
      }
      await Promise.all([
        // We use the OAuth 'state' value (which should be crypto-random) as
        // the key in our storage to store our actual SessionID. We do this
        // 'cos we'll need to lookup our session information again when the
        // browser is redirected back to us (i.e. the OAuth client
        // application) from the Authorization Server.
        // We don't want to use our session ID as the OAuth 'state' value, as
        // that session ID can be any developer-specified value, and therefore
        // may not be appropriate (since the OAuth 'state' value should really
        // be an unguessable crypto-random value).
        this.storageUtility.setForUser(state, {
          sessionId: oidcLoginOptions.sessionId
        }),
        // Store our login-process state using the session ID as the key.
        // Strictly speaking, this indirection from our OAuth state value to
        // our session ID is unnecessary, but it provides a slightly cleaner
        // separation of concerns.
        this.storageUtility.setForUser(oidcLoginOptions.sessionId, {
          codeVerifier,
          issuer: oidcLoginOptions.issuer.toString(),
          // The redirect URL is read after redirect, so it must be stored now.
          redirectUrl: oidcLoginOptions.redirectUrl,
          dpop: Boolean(oidcLoginOptions.dpop).toString(),
          keepAlive: booleanWithFallback(oidcLoginOptions.keepAlive, true).toString()
        })
      ]);
      this.redirector.redirect(targetUrl, {
        handleRedirect: oidcLoginOptions.handleRedirect
      });
      return void 0;
    }
  };
  var GeneralLogoutHandler = class {
    constructor(sessionInfoManager) {
      this.sessionInfoManager = sessionInfoManager;
      this.sessionInfoManager = sessionInfoManager;
    }
    async canHandle() {
      return true;
    }
    async handle(userId) {
      await this.sessionInfoManager.clear(userId);
    }
  };
  var IRpLogoutHandler = class {
    constructor(redirector) {
      this.redirector = redirector;
      this.redirector = redirector;
    }
    async canHandle(userId, options) {
      return (options === null || options === void 0 ? void 0 : options.logoutType) === "idp";
    }
    async handle(userId, options) {
      if ((options === null || options === void 0 ? void 0 : options.logoutType) !== "idp") {
        throw new Error("Attempting to call idp logout handler to perform app logout");
      }
      if (options.toLogoutUrl === void 0) {
        throw new Error("Cannot perform IDP logout. Did you log in using the OIDC authentication flow?");
      }
      this.redirector.redirect(options.toLogoutUrl(options), {
        handleRedirect: options.handleRedirect
      });
    }
  };
  var IWaterfallLogoutHandler = class {
    constructor(sessionInfoManager, redirector) {
      this.handlers = [
        new GeneralLogoutHandler(sessionInfoManager),
        new IRpLogoutHandler(redirector)
      ];
    }
    async canHandle() {
      return true;
    }
    async handle(userId, options) {
      for (const handler of this.handlers) {
        if (await handler.canHandle(userId, options))
          await handler.handle(userId, options);
      }
    }
  };
  function getUnauthenticatedSession() {
    return {
      isLoggedIn: false,
      sessionId: v4_default(),
      fetch: (...args) => fetch(...args)
    };
  }
  async function clear(sessionId, storage) {
    await Promise.all([
      storage.deleteAllUserData(sessionId, { secure: false }),
      storage.deleteAllUserData(sessionId, { secure: true })
    ]);
  }
  var SessionInfoManagerBase = class {
    constructor(storageUtility) {
      this.storageUtility = storageUtility;
      this.storageUtility = storageUtility;
    }
    update(_sessionId, _options) {
      throw new Error("Not Implemented");
    }
    get(_) {
      throw new Error("Not implemented");
    }
    // eslint-disable-next-line class-methods-use-this
    async getAll() {
      throw new Error("Not implemented");
    }
    /**
     * This function removes all session-related information from storage.
     * @param sessionId the session identifier
     * @param storage the storage where session info is stored
     * @hidden
     */
    async clear(sessionId) {
      return clear(sessionId, this.storageUtility);
    }
    /**
     * Registers a new session, so that its ID can be retrieved.
     * @param sessionId
     */
    async register(_sessionId) {
      throw new Error("Not implemented");
    }
    /**
     * Returns all the registered session IDs. Differs from getAll, which also
     * returns additional session information.
     */
    async getRegisteredSessionIdAll() {
      throw new Error("Not implemented");
    }
    /**
     * Deletes all information about all sessions, including their registrations.
     */
    async clearAll() {
      throw new Error("Not implemented");
    }
  };
  function getEndSessionUrl({ endSessionEndpoint, idTokenHint, postLogoutRedirectUri, state }) {
    const url = new URL(endSessionEndpoint);
    if (idTokenHint !== void 0)
      url.searchParams.append("id_token_hint", idTokenHint);
    if (postLogoutRedirectUri !== void 0) {
      url.searchParams.append("post_logout_redirect_uri", postLogoutRedirectUri);
      if (state !== void 0)
        url.searchParams.append("state", state);
    }
    return url.toString();
  }
  function maybeBuildRpInitiatedLogout({ endSessionEndpoint, idTokenHint }) {
    if (endSessionEndpoint === void 0)
      return void 0;
    return function logout({ state, postLogoutUrl }) {
      return getEndSessionUrl({
        endSessionEndpoint,
        idTokenHint,
        state,
        postLogoutRedirectUri: postLogoutUrl
      });
    };
  }
  function isSupportedTokenType(token) {
    return typeof token === "string" && ["DPoP", "Bearer"].includes(token);
  }
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_a) {
      return false;
    }
  }
  function determineSigningAlg(supported, preferred) {
    var _a;
    return (_a = preferred.find((signingAlg) => {
      return supported.includes(signingAlg);
    })) !== null && _a !== void 0 ? _a : null;
  }
  function isStaticClient(options) {
    return options.clientId !== void 0 && !isValidUrl(options.clientId);
  }
  function isSolidOidcClient(options, issuerConfig) {
    return issuerConfig.scopesSupported.includes("webid") && options.clientId !== void 0 && isValidUrl(options.clientId);
  }
  function isKnownClientType(clientType) {
    return typeof clientType === "string" && ["dynamic", "static", "solid-oidc"].includes(clientType);
  }
  async function handleRegistration(options, issuerConfig, storageUtility, clientRegistrar) {
    let clientInfo;
    if (isSolidOidcClient(options, issuerConfig)) {
      clientInfo = {
        clientId: options.clientId,
        clientName: options.clientName,
        clientType: "solid-oidc"
      };
    } else if (isStaticClient(options)) {
      clientInfo = {
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        clientName: options.clientName,
        clientType: "static"
      };
    } else {
      return clientRegistrar.getClient({
        sessionId: options.sessionId,
        clientName: options.clientName,
        redirectUrl: options.redirectUrl
      }, issuerConfig);
    }
    const infoToSave = {
      clientId: clientInfo.clientId,
      clientType: clientInfo.clientType
    };
    if (clientInfo.clientType === "static") {
      infoToSave.clientSecret = clientInfo.clientSecret;
    }
    if (clientInfo.clientName) {
      infoToSave.clientName = clientInfo.clientName;
    }
    await storageUtility.setForUser(options.sessionId, infoToSave);
    return clientInfo;
  }
  var boundFetch = (request, init) => fetch(request, init);
  var ClientAuthentication = class {
    constructor(loginHandler, redirectHandler, logoutHandler, sessionInfoManager, issuerConfigFetcher) {
      this.loginHandler = loginHandler;
      this.redirectHandler = redirectHandler;
      this.logoutHandler = logoutHandler;
      this.sessionInfoManager = sessionInfoManager;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.fetch = boundFetch;
      this.logout = async (sessionId, options) => {
        await this.logoutHandler.handle(sessionId, (options === null || options === void 0 ? void 0 : options.logoutType) === "idp" ? {
          ...options,
          toLogoutUrl: this.boundLogout
        } : options);
        this.fetch = boundFetch;
        delete this.boundLogout;
      };
      this.getSessionInfo = async (sessionId) => {
        return this.sessionInfoManager.get(sessionId);
      };
      this.getAllSessionInfo = async () => {
        return this.sessionInfoManager.getAll();
      };
      this.loginHandler = loginHandler;
      this.redirectHandler = redirectHandler;
      this.logoutHandler = logoutHandler;
      this.sessionInfoManager = sessionInfoManager;
      this.issuerConfigFetcher = issuerConfigFetcher;
    }
  };
  async function loadOidcContextFromStorage(sessionId, storageUtility, configFetcher) {
    try {
      const [issuerIri, codeVerifier, storedRedirectIri, dpop, keepAlive] = await Promise.all([
        storageUtility.getForUser(sessionId, "issuer", {
          errorIfNull: true
        }),
        storageUtility.getForUser(sessionId, "codeVerifier"),
        storageUtility.getForUser(sessionId, "redirectUrl"),
        storageUtility.getForUser(sessionId, "dpop", { errorIfNull: true }),
        storageUtility.getForUser(sessionId, "keepAlive")
      ]);
      await storageUtility.deleteForUser(sessionId, "codeVerifier");
      const issuerConfig = await configFetcher.fetchConfig(issuerIri);
      return {
        codeVerifier,
        redirectUrl: storedRedirectIri,
        issuerConfig,
        dpop: dpop === "true",
        // Default keepAlive to true if not found in storage.
        keepAlive: typeof keepAlive === "string" ? keepAlive === "true" : true
      };
    } catch (e) {
      throw new Error(`Failed to retrieve OIDC context from storage associated with session [${sessionId}]: ${e}`);
    }
  }
  async function saveSessionInfoToStorage(storageUtility, sessionId, webId, clientId, isLoggedIn2, refreshToken, secure, dpopKey) {
    if (refreshToken !== void 0) {
      await storageUtility.setForUser(sessionId, { refreshToken }, { secure });
    }
    if (webId !== void 0) {
      await storageUtility.setForUser(sessionId, { webId }, { secure });
    }
    if (clientId !== void 0) {
      await storageUtility.setForUser(sessionId, { clientId }, { secure });
    }
    if (isLoggedIn2 !== void 0) {
      await storageUtility.setForUser(sessionId, { isLoggedIn: isLoggedIn2 }, { secure });
    }
    if (dpopKey !== void 0) {
      await storageUtility.setForUser(sessionId, {
        publicKey: JSON.stringify(dpopKey.publicKey),
        privateKey: JSON.stringify(await exportJWK(dpopKey.privateKey))
      }, { secure });
    }
  }
  var StorageUtility = class {
    constructor(secureStorage, insecureStorage) {
      this.secureStorage = secureStorage;
      this.insecureStorage = insecureStorage;
      this.secureStorage = secureStorage;
      this.insecureStorage = insecureStorage;
    }
    getKey(userId) {
      return `solidClientAuthenticationUser:${userId}`;
    }
    async getUserData(userId, secure) {
      const stored = await (secure ? this.secureStorage : this.insecureStorage).get(this.getKey(userId));
      if (stored === void 0) {
        return {};
      }
      try {
        return JSON.parse(stored);
      } catch (err) {
        throw new Error(`Data for user [${userId}] in [${secure ? "secure" : "unsecure"}] storage is corrupted - expected valid JSON, but got: ${stored}`);
      }
    }
    async setUserData(userId, data, secure) {
      await (secure ? this.secureStorage : this.insecureStorage).set(this.getKey(userId), JSON.stringify(data));
    }
    async get(key, options) {
      const value = await ((options === null || options === void 0 ? void 0 : options.secure) ? this.secureStorage : this.insecureStorage).get(key);
      if (value === void 0 && (options === null || options === void 0 ? void 0 : options.errorIfNull)) {
        throw new Error(`[${key}] is not stored`);
      }
      return value;
    }
    async set(key, value, options) {
      return ((options === null || options === void 0 ? void 0 : options.secure) ? this.secureStorage : this.insecureStorage).set(key, value);
    }
    async delete(key, options) {
      return ((options === null || options === void 0 ? void 0 : options.secure) ? this.secureStorage : this.insecureStorage).delete(key);
    }
    async getForUser(userId, key, options) {
      const userData = await this.getUserData(userId, options === null || options === void 0 ? void 0 : options.secure);
      let value;
      if (!userData || !userData[key]) {
        value = void 0;
      }
      value = userData[key];
      if (value === void 0 && (options === null || options === void 0 ? void 0 : options.errorIfNull)) {
        throw new Error(`Field [${key}] for user [${userId}] is not stored`);
      }
      return value || void 0;
    }
    async setForUser(userId, values, options) {
      let userData;
      try {
        userData = await this.getUserData(userId, options === null || options === void 0 ? void 0 : options.secure);
      } catch (_a) {
        userData = {};
      }
      await this.setUserData(userId, { ...userData, ...values }, options === null || options === void 0 ? void 0 : options.secure);
    }
    async deleteForUser(userId, key, options) {
      const userData = await this.getUserData(userId, options === null || options === void 0 ? void 0 : options.secure);
      delete userData[key];
      await this.setUserData(userId, userData, options === null || options === void 0 ? void 0 : options.secure);
    }
    async deleteAllUserData(userId, options) {
      await ((options === null || options === void 0 ? void 0 : options.secure) ? this.secureStorage : this.insecureStorage).delete(this.getKey(userId));
    }
  };
  var InMemoryStorage = class {
    constructor() {
      this.map = {};
    }
    async get(key) {
      return this.map[key] || void 0;
    }
    async set(key, value) {
      this.map[key] = value;
    }
    async delete(key) {
      delete this.map[key];
    }
  };
  var ConfigurationError = class extends Error {
    /* istanbul ignore next */
    constructor(message2) {
      super(message2);
    }
  };
  var InvalidResponseError = class extends Error {
    /* istanbul ignore next */
    constructor(missingFields) {
      super(`Invalid response from OIDC provider: missing fields ${missingFields}`);
      this.missingFields = missingFields;
    }
  };
  var OidcProviderError = class extends Error {
    /* istanbul ignore next */
    constructor(message2, error, errorDescription) {
      super(message2);
      this.error = error;
      this.errorDescription = errorDescription;
    }
  };
  function normalizeHTU(audience) {
    const audienceUrl = new URL(audience);
    return new URL(audienceUrl.pathname, audienceUrl.origin).toString();
  }
  async function createDpopHeader(audience, method, dpopKey) {
    return new SignJWT({
      htu: normalizeHTU(audience),
      htm: method.toUpperCase(),
      jti: v4_default()
    }).setProtectedHeader({
      alg: PREFERRED_SIGNING_ALG[0],
      jwk: dpopKey.publicKey,
      typ: "dpop+jwt"
    }).setIssuedAt().sign(dpopKey.privateKey, {});
  }
  async function generateDpopKeyPair() {
    const { privateKey, publicKey } = await generateKeyPair2(PREFERRED_SIGNING_ALG[0]);
    const dpopKeyPair = {
      privateKey,
      publicKey: await exportJWK(publicKey)
    };
    [dpopKeyPair.publicKey.alg] = PREFERRED_SIGNING_ALG;
    return dpopKeyPair;
  }
  var DEFAULT_EXPIRATION_TIME_SECONDS = 600;
  function isExpectedAuthError(statusCode) {
    return [401, 403].includes(statusCode);
  }
  async function buildDpopFetchOptions(targetUrl, authToken, dpopKey, defaultOptions) {
    var _a;
    const headers = new Headers(defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.headers);
    headers.set("Authorization", `DPoP ${authToken}`);
    headers.set("DPoP", await createDpopHeader(targetUrl, (_a = defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.method) !== null && _a !== void 0 ? _a : "get", dpopKey));
    return {
      ...defaultOptions,
      headers
    };
  }
  async function buildAuthenticatedHeaders(targetUrl, authToken, dpopKey, defaultOptions) {
    if (dpopKey !== void 0) {
      return buildDpopFetchOptions(targetUrl, authToken, dpopKey, defaultOptions);
    }
    const headers = new Headers(defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.headers);
    headers.set("Authorization", `Bearer ${authToken}`);
    return {
      ...defaultOptions,
      headers
    };
  }
  async function makeAuthenticatedRequest(accessToken, url, defaultRequestInit, dpopKey) {
    return fetch(url, await buildAuthenticatedHeaders(url.toString(), accessToken, dpopKey, defaultRequestInit));
  }
  async function refreshAccessToken(refreshOptions, dpopKey, eventEmitter) {
    var _a;
    const tokenSet = await refreshOptions.tokenRefresher.refresh(refreshOptions.sessionId, refreshOptions.refreshToken, dpopKey);
    eventEmitter === null || eventEmitter === void 0 ? void 0 : eventEmitter.emit(EVENTS.SESSION_EXTENDED, (_a = tokenSet.expiresIn) !== null && _a !== void 0 ? _a : DEFAULT_EXPIRATION_TIME_SECONDS);
    if (typeof tokenSet.refreshToken === "string") {
      eventEmitter === null || eventEmitter === void 0 ? void 0 : eventEmitter.emit(EVENTS.NEW_REFRESH_TOKEN, tokenSet.refreshToken);
    }
    return {
      accessToken: tokenSet.accessToken,
      refreshToken: tokenSet.refreshToken,
      expiresIn: tokenSet.expiresIn
    };
  }
  var computeRefreshDelay = (expiresIn) => {
    if (expiresIn !== void 0) {
      return expiresIn - REFRESH_BEFORE_EXPIRATION_SECONDS > 0 ? (
        // We want to refresh the token 5 seconds before they actually expire.
        expiresIn - REFRESH_BEFORE_EXPIRATION_SECONDS
      ) : expiresIn;
    }
    return DEFAULT_EXPIRATION_TIME_SECONDS;
  };
  async function buildAuthenticatedFetch(accessToken, options) {
    var _a;
    let currentAccessToken = accessToken;
    let latestTimeout;
    const currentRefreshOptions = options === null || options === void 0 ? void 0 : options.refreshOptions;
    if (currentRefreshOptions !== void 0) {
      const proactivelyRefreshToken = async () => {
        var _a2, _b, _c, _d;
        try {
          const { accessToken: refreshedAccessToken, refreshToken, expiresIn } = await refreshAccessToken(
            currentRefreshOptions,
            // If currentRefreshOptions is defined, options is necessarily defined too.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.dpopKey,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.eventEmitter
          );
          currentAccessToken = refreshedAccessToken;
          if (refreshToken !== void 0) {
            currentRefreshOptions.refreshToken = refreshToken;
          }
          clearTimeout(latestTimeout);
          latestTimeout = setTimeout(proactivelyRefreshToken, computeRefreshDelay(expiresIn) * 1e3);
          (_a2 = options.eventEmitter) === null || _a2 === void 0 ? void 0 : _a2.emit(EVENTS.TIMEOUT_SET, latestTimeout);
        } catch (e) {
          if (e instanceof OidcProviderError) {
            (_b = options === null || options === void 0 ? void 0 : options.eventEmitter) === null || _b === void 0 ? void 0 : _b.emit(EVENTS.ERROR, e.error, e.errorDescription);
            (_c = options === null || options === void 0 ? void 0 : options.eventEmitter) === null || _c === void 0 ? void 0 : _c.emit(EVENTS.SESSION_EXPIRED);
          }
          if (e instanceof InvalidResponseError && e.missingFields.includes("access_token")) {
            (_d = options === null || options === void 0 ? void 0 : options.eventEmitter) === null || _d === void 0 ? void 0 : _d.emit(EVENTS.SESSION_EXPIRED);
          }
        }
      };
      latestTimeout = setTimeout(
        proactivelyRefreshToken,
        // If currentRefreshOptions is defined, options is necessarily defined too.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        computeRefreshDelay(options.expiresIn) * 1e3
      );
      (_a = options.eventEmitter) === null || _a === void 0 ? void 0 : _a.emit(EVENTS.TIMEOUT_SET, latestTimeout);
    } else if (options !== void 0 && options.eventEmitter !== void 0) {
      const expirationTimeout = setTimeout(() => {
        options.eventEmitter.emit(EVENTS.SESSION_EXPIRED);
      }, computeRefreshDelay(options.expiresIn) * 1e3);
      options.eventEmitter.emit(EVENTS.TIMEOUT_SET, expirationTimeout);
    }
    return async (url, requestInit) => {
      let response = await makeAuthenticatedRequest(currentAccessToken, url, requestInit, options === null || options === void 0 ? void 0 : options.dpopKey);
      const failedButNotExpectedAuthError = !response.ok && !isExpectedAuthError(response.status);
      if (response.ok || failedButNotExpectedAuthError) {
        return response;
      }
      const hasBeenRedirected = response.url !== url;
      if (hasBeenRedirected && (options === null || options === void 0 ? void 0 : options.dpopKey) !== void 0) {
        response = await makeAuthenticatedRequest(
          currentAccessToken,
          // Replace the original target IRI (`url`) by the redirection target
          response.url,
          requestInit,
          options.dpopKey
        );
      }
      return response;
    };
  }

  // node_modules/@inrupt/solid-client-authn-browser/dist/index.mjs
  var import_events = __toESM(require_events(), 1);

  // node_modules/@inrupt/oidc-client-ext/dist/index.es.js
  var import_oidc_client = __toESM(require_oidc_client_min());
  var import_oidc_client2 = __toESM(require_oidc_client_min());
  function processErrorResponse(responseBody, options) {
    var _a, _b, _c, _d;
    if (responseBody.error === "invalid_redirect_uri") {
      throw new Error(`Dynamic client registration failed: the provided redirect uri [${(_a = options.redirectUrl) === null || _a === void 0 ? void 0 : _a.toString()}] is invalid - ${(_b = responseBody.error_description) !== null && _b !== void 0 ? _b : ""}`);
    }
    if (responseBody.error === "invalid_client_metadata") {
      throw new Error(`Dynamic client registration failed: the provided client metadata ${JSON.stringify(options)} is invalid - ${(_c = responseBody.error_description) !== null && _c !== void 0 ? _c : ""}`);
    }
    throw new Error(`Dynamic client registration failed: ${responseBody.error} - ${(_d = responseBody.error_description) !== null && _d !== void 0 ? _d : ""}`);
  }
  function validateRegistrationResponse(responseBody, options) {
    if (responseBody.client_id === void 0) {
      throw new Error(`Dynamic client registration failed: no client_id has been found on ${JSON.stringify(responseBody)}`);
    }
    if (options.redirectUrl && (responseBody.redirect_uris === void 0 || responseBody.redirect_uris[0] !== options.redirectUrl.toString())) {
      throw new Error(`Dynamic client registration failed: the returned redirect URIs ${JSON.stringify(responseBody.redirect_uris)} don't match the provided ${JSON.stringify([
        options.redirectUrl.toString()
      ])}`);
    }
  }
  async function registerClient(options, issuerConfig) {
    var _a;
    if (!issuerConfig.registrationEndpoint) {
      throw new Error("Dynamic Registration could not be completed because the issuer has no registration endpoint.");
    }
    if (!Array.isArray(issuerConfig.idTokenSigningAlgValuesSupported)) {
      throw new Error("The OIDC issuer discovery profile is missing the 'id_token_signing_alg_values_supported' value, which is mandatory.");
    }
    const signingAlg = determineSigningAlg(issuerConfig.idTokenSigningAlgValuesSupported, PREFERRED_SIGNING_ALG);
    const config = {
      /* eslint-disable camelcase */
      client_name: options.clientName,
      application_type: "web",
      redirect_uris: [(_a = options.redirectUrl) === null || _a === void 0 ? void 0 : _a.toString()],
      subject_type: "public",
      token_endpoint_auth_method: "client_secret_basic",
      id_token_signed_response_alg: signingAlg,
      grant_types: ["authorization_code", "refresh_token"]
      /* eslint-enable camelcase */
    };
    const headers = {
      "Content-Type": "application/json"
    };
    const registerResponse = await fetch(issuerConfig.registrationEndpoint.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(config)
    });
    if (registerResponse.ok) {
      const responseBody = await registerResponse.json();
      validateRegistrationResponse(responseBody, options);
      return {
        clientId: responseBody.client_id,
        clientSecret: responseBody.client_secret,
        idTokenSignedResponseAlg: responseBody.id_token_signed_response_alg,
        clientType: "dynamic"
      };
    }
    if (registerResponse.status === 400) {
      processErrorResponse(await registerResponse.json(), options);
    }
    throw new Error(`Dynamic client registration failed: the server returned ${registerResponse.status} ${registerResponse.statusText} - ${await registerResponse.text()}`);
  }
  function hasError(value) {
    return value.error !== void 0 && typeof value.error === "string";
  }
  function hasErrorDescription(value) {
    return value.error_description !== void 0 && typeof value.error_description === "string";
  }
  function hasErrorUri(value) {
    return value.error_uri !== void 0 && typeof value.error_uri === "string";
  }
  function hasAccessToken(value) {
    return value.access_token !== void 0 && typeof value.access_token === "string";
  }
  function hasIdToken(value) {
    return value.id_token !== void 0 && typeof value.id_token === "string";
  }
  function hasRefreshToken(value) {
    return value.refresh_token !== void 0 && typeof value.refresh_token === "string";
  }
  function hasTokenType(value) {
    return value.token_type !== void 0 && typeof value.token_type === "string";
  }
  function hasExpiresIn(value) {
    return value.expires_in === void 0 || typeof value.expires_in === "number";
  }
  function validatePreconditions(issuer, data) {
    if (data.grantType && (!issuer.grantTypesSupported || !issuer.grantTypesSupported.includes(data.grantType))) {
      throw new Error(`The issuer [${issuer.issuer}] does not support the [${data.grantType}] grant`);
    }
    if (!issuer.tokenEndpoint) {
      throw new Error(`This issuer [${issuer.issuer}] does not have a token endpoint`);
    }
  }
  function validateTokenEndpointResponse(tokenResponse, dpop) {
    if (hasError(tokenResponse)) {
      throw new OidcProviderError(`Token endpoint returned error [${tokenResponse.error}]${hasErrorDescription(tokenResponse) ? `: ${tokenResponse.error_description}` : ""}${hasErrorUri(tokenResponse) ? ` (see ${tokenResponse.error_uri})` : ""}`, tokenResponse.error, hasErrorDescription(tokenResponse) ? tokenResponse.error_description : void 0);
    }
    if (!hasAccessToken(tokenResponse)) {
      throw new InvalidResponseError(["access_token"]);
    }
    if (!hasIdToken(tokenResponse)) {
      throw new InvalidResponseError(["id_token"]);
    }
    if (!hasTokenType(tokenResponse)) {
      throw new InvalidResponseError(["token_type"]);
    }
    if (!hasExpiresIn(tokenResponse)) {
      throw new InvalidResponseError(["expires_in"]);
    }
    if (!dpop && tokenResponse.token_type.toLowerCase() !== "bearer") {
      throw new Error(`Invalid token endpoint response: requested a [Bearer] token, but got a 'token_type' value of [${tokenResponse.token_type}].`);
    }
    return tokenResponse;
  }
  async function getTokens(issuer, client, data, dpop) {
    validatePreconditions(issuer, data);
    const headers = {
      "content-type": "application/x-www-form-urlencoded"
    };
    let dpopKey;
    if (dpop) {
      dpopKey = await generateDpopKeyPair();
      headers.DPoP = await createDpopHeader(issuer.tokenEndpoint, "POST", dpopKey);
    }
    if (client.clientSecret) {
      headers.Authorization = `Basic ${btoa(`${client.clientId}:${client.clientSecret}`)}`;
    }
    const requestBody = {
      /* eslint-disable camelcase */
      grant_type: data.grantType,
      redirect_uri: data.redirectUrl,
      code: data.code,
      code_verifier: data.codeVerifier,
      client_id: client.clientId
      /* eslint-enable camelcase */
    };
    const tokenRequestInit = {
      method: "POST",
      headers,
      body: new URLSearchParams(requestBody).toString()
    };
    const rawTokenResponse = await fetch(issuer.tokenEndpoint, tokenRequestInit);
    const jsonTokenResponse = await rawTokenResponse.json();
    const tokenResponse = validateTokenEndpointResponse(jsonTokenResponse, dpop);
    const { webId, clientId } = await getWebidFromTokenPayload(tokenResponse.id_token, issuer.jwksUri, issuer.issuer, client.clientId);
    return {
      accessToken: tokenResponse.access_token,
      idToken: tokenResponse.id_token,
      refreshToken: hasRefreshToken(tokenResponse) ? tokenResponse.refresh_token : void 0,
      webId,
      clientId,
      dpopKey,
      expiresIn: tokenResponse.expires_in
    };
  }
  var isValidUrl2 = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_a) {
      return false;
    }
  };
  async function refresh(refreshToken, issuer, client, dpopKey) {
    if (client.clientId === void 0) {
      throw new Error("No client ID available when trying to refresh the access token.");
    }
    const requestBody = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      scope: DEFAULT_SCOPES
    };
    let dpopHeader = {};
    if (dpopKey !== void 0) {
      dpopHeader = {
        DPoP: await createDpopHeader(issuer.tokenEndpoint, "POST", dpopKey)
      };
    }
    let authHeader = {};
    if (client.clientSecret !== void 0) {
      authHeader = {
        // We assume that client_secret_basic is the client authentication method.
        // TODO: Get the authentication method from the IClient configuration object.
        Authorization: `Basic ${btoa(`${client.clientId}:${client.clientSecret}`)}`
      };
    } else if (isValidUrl2(client.clientId)) {
      requestBody.client_id = client.clientId;
    }
    const rawResponse = await fetch(issuer.tokenEndpoint, {
      method: "POST",
      body: new URLSearchParams(requestBody).toString(),
      headers: {
        ...dpopHeader,
        ...authHeader,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    let response;
    try {
      response = await rawResponse.json();
    } catch (e) {
      throw new Error(`The token endpoint of issuer ${issuer.issuer} returned a malformed response.`);
    }
    const validatedResponse = validateTokenEndpointResponse(response, dpopKey !== void 0);
    const { webId } = await getWebidFromTokenPayload(validatedResponse.id_token, issuer.jwksUri, issuer.issuer, client.clientId);
    return {
      accessToken: validatedResponse.access_token,
      idToken: validatedResponse.id_token,
      refreshToken: typeof validatedResponse.refresh_token === "string" ? validatedResponse.refresh_token : void 0,
      webId,
      dpopKey,
      expiresIn: validatedResponse.expires_in
    };
  }
  function normalizeCallbackUrl(redirectUrl) {
    const cleanedUrl = removeOpenIdParams(redirectUrl);
    cleanedUrl.hash = "";
    if (
      // The trailing slash is present in the original redirect URL
      redirectUrl.includes(`${cleanedUrl.origin}/`)
    ) {
      return cleanedUrl.href;
    }
    return `${cleanedUrl.origin}${cleanedUrl.href.substring(
      // Adds 1 to the origin length to remove the trailing slash
      cleanedUrl.origin.length + 1
    )}`;
  }
  async function clearOidcPersistentStorage() {
    const client = new import_oidc_client.OidcClient({
      // TODO: We should look at the various interfaces being used for storage,
      //  i.e. between oidc-client-js (WebStorageStoreState), localStorage
      //  (which has an interface Storage), and our own proprietary interface
      //  IStorage - i.e. we should really just be using the browser Web Storage
      //  API, e.g. "stateStore: window.localStorage,".
      // We are instantiating a new instance here, so the only value we need to
      // explicitly provide is the response mode (default otherwise will look
      // for a hash '#' fragment!).
      // eslint-disable-next-line camelcase
      response_mode: "query"
    });
    await client.clearStaleState(new import_oidc_client.WebStorageStateStore({}));
    const myStorage = window.localStorage;
    const itemsToRemove = [];
    for (let i = 0; i <= myStorage.length; i += 1) {
      const key = myStorage.key(i);
      if (key && (key.match(/^oidc\..+$/) || key.match(/^solidClientAuthenticationUser:.+$/))) {
        itemsToRemove.push(key);
      }
    }
    itemsToRemove.forEach((key) => myStorage.removeItem(key));
  }

  // node_modules/@inrupt/solid-client-authn-browser/dist/index.mjs
  var StorageUtilityBrowser = class extends StorageUtility {
    constructor(secureStorage, insecureStorage) {
      super(secureStorage, insecureStorage);
    }
  };
  var ClientAuthentication2 = class extends ClientAuthentication {
    constructor() {
      super(...arguments);
      this.login = async (options, eventEmitter) => {
        var _a, _b;
        await this.sessionInfoManager.clear(options.sessionId);
        const redirectUrl = (_a = options.redirectUrl) !== null && _a !== void 0 ? _a : normalizeCallbackUrl(window.location.href);
        if (!isValidRedirectUrl(redirectUrl)) {
          throw new Error(`${redirectUrl} is not a valid redirect URL, it is either a malformed IRI, includes a hash fragment, or reserved query parameters ('code' or 'state').`);
        }
        await this.loginHandler.handle({
          ...options,
          redirectUrl,
          // If no clientName is provided, the clientId may be used instead.
          clientName: (_b = options.clientName) !== null && _b !== void 0 ? _b : options.clientId,
          eventEmitter
        });
      };
      this.validateCurrentSession = async (currentSessionId) => {
        const sessionInfo = await this.sessionInfoManager.get(currentSessionId);
        if (sessionInfo === void 0 || sessionInfo.clientAppId === void 0 || sessionInfo.issuer === void 0) {
          return null;
        }
        return sessionInfo;
      };
      this.handleIncomingRedirect = async (url, eventEmitter) => {
        try {
          const redirectInfo = await this.redirectHandler.handle(url, eventEmitter, void 0);
          this.fetch = redirectInfo.fetch.bind(window);
          this.boundLogout = redirectInfo.getLogoutUrl;
          await this.cleanUrlAfterRedirect(url);
          return {
            isLoggedIn: redirectInfo.isLoggedIn,
            webId: redirectInfo.webId,
            sessionId: redirectInfo.sessionId,
            expirationDate: redirectInfo.expirationDate,
            clientAppId: redirectInfo.clientAppId
          };
        } catch (err) {
          await this.cleanUrlAfterRedirect(url);
          eventEmitter.emit(EVENTS.ERROR, "redirect", err);
          return void 0;
        }
      };
    }
    async cleanUrlAfterRedirect(url) {
      const cleanedUpUrl = removeOpenIdParams(url).href;
      window.history.replaceState(null, "", cleanedUpUrl);
      while (window.location.href !== cleanedUpUrl) {
        await new Promise((resolve) => {
          setTimeout(() => resolve(), 1);
        });
      }
    }
  };
  function hasIssuer(options) {
    return typeof options.oidcIssuer === "string";
  }
  function hasRedirectUrl(options) {
    return typeof options.redirectUrl === "string";
  }
  var OidcLoginHandler = class {
    constructor(storageUtility, oidcHandler, issuerConfigFetcher, clientRegistrar) {
      this.storageUtility = storageUtility;
      this.oidcHandler = oidcHandler;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
      this.storageUtility = storageUtility;
      this.oidcHandler = oidcHandler;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
    }
    async canHandle(options) {
      return hasIssuer(options) && hasRedirectUrl(options);
    }
    async handle(options) {
      if (!hasIssuer(options)) {
        throw new ConfigurationError(`OidcLoginHandler requires an OIDC issuer: missing property 'oidcIssuer' in ${JSON.stringify(options)}`);
      }
      if (!hasRedirectUrl(options)) {
        throw new ConfigurationError(`OidcLoginHandler requires a redirect URL: missing property 'redirectUrl' in ${JSON.stringify(options)}`);
      }
      const issuerConfig = await this.issuerConfigFetcher.fetchConfig(options.oidcIssuer);
      const clientRegistration = await handleRegistration(options, issuerConfig, this.storageUtility, this.clientRegistrar);
      const OidcOptions = {
        // Note that here, the issuer is not the one from the received options, but
        // from the issuer's config. This enforces the canonical URL is used and stored,
        // which is also the one present in the ID token, so storing a technically
        // valid, but different issuer URL (e.g. using a trailing slash or not) now
        // could prevent from validating the ID token later.
        issuer: issuerConfig.issuer,
        // TODO: differentiate if DPoP should be true
        dpop: options.tokenType.toLowerCase() === "dpop",
        ...options,
        issuerConfiguration: issuerConfig,
        client: clientRegistration
      };
      return this.oidcHandler.handle(OidcOptions);
    }
  };
  var AuthorizationCodeWithPkceOidcHandler = class extends AuthorizationCodeWithPkceOidcHandlerBase {
    async handle(oidcLoginOptions) {
      var _a;
      const oidcOptions = {
        authority: oidcLoginOptions.issuer.toString(),
        client_id: oidcLoginOptions.client.clientId,
        client_secret: oidcLoginOptions.client.clientSecret,
        redirect_uri: oidcLoginOptions.redirectUrl,
        response_type: "code",
        scope: DEFAULT_SCOPES,
        filterProtocolClaims: true,
        // The userinfo endpoint on NSS fails, so disable this for now
        // Note that in Solid, information should be retrieved from the
        // profile referenced by the WebId.
        loadUserInfo: false,
        code_verifier: true,
        prompt: (_a = oidcLoginOptions.prompt) !== null && _a !== void 0 ? _a : "consent"
      };
      const oidcClientLibrary = new import_oidc_client2.OidcClient(oidcOptions);
      try {
        const signingRequest = await oidcClientLibrary.createSigninRequest();
        return await this.handleRedirect({
          oidcLoginOptions,
          // eslint-disable-next-line no-underscore-dangle
          state: signingRequest.state._id,
          // eslint-disable-next-line no-underscore-dangle
          codeVerifier: signingRequest.state._code_verifier,
          targetUrl: signingRequest.url.toString()
        });
      } catch (err) {
        console.error(err);
      }
      return void 0;
    }
  };
  var WELL_KNOWN_OPENID_CONFIG = ".well-known/openid-configuration";
  var issuerConfigKeyMap = {
    issuer: {
      toKey: "issuer",
      convertToUrl: true
    },
    authorization_endpoint: {
      toKey: "authorizationEndpoint",
      convertToUrl: true
    },
    token_endpoint: {
      toKey: "tokenEndpoint",
      convertToUrl: true
    },
    userinfo_endpoint: {
      toKey: "userinfoEndpoint",
      convertToUrl: true
    },
    jwks_uri: {
      toKey: "jwksUri",
      convertToUrl: true
    },
    registration_endpoint: {
      toKey: "registrationEndpoint",
      convertToUrl: true
    },
    end_session_endpoint: {
      toKey: "endSessionEndpoint",
      convertToUrl: true
    },
    scopes_supported: { toKey: "scopesSupported" },
    response_types_supported: { toKey: "responseTypesSupported" },
    response_modes_supported: { toKey: "responseModesSupported" },
    grant_types_supported: { toKey: "grantTypesSupported" },
    acr_values_supported: { toKey: "acrValuesSupported" },
    subject_types_supported: { toKey: "subjectTypesSupported" },
    id_token_signing_alg_values_supported: {
      toKey: "idTokenSigningAlgValuesSupported"
    },
    id_token_encryption_alg_values_supported: {
      toKey: "idTokenEncryptionAlgValuesSupported"
    },
    id_token_encryption_enc_values_supported: {
      toKey: "idTokenEncryptionEncValuesSupported"
    },
    userinfo_signing_alg_values_supported: {
      toKey: "userinfoSigningAlgValuesSupported"
    },
    userinfo_encryption_alg_values_supported: {
      toKey: "userinfoEncryptionAlgValuesSupported"
    },
    userinfo_encryption_enc_values_supported: {
      toKey: "userinfoEncryptionEncValuesSupported"
    },
    request_object_signing_alg_values_supported: {
      toKey: "requestObjectSigningAlgValuesSupported"
    },
    request_object_encryption_alg_values_supported: {
      toKey: "requestObjectEncryptionAlgValuesSupported"
    },
    request_object_encryption_enc_values_supported: {
      toKey: "requestObjectEncryptionEncValuesSupported"
    },
    token_endpoint_auth_methods_supported: {
      toKey: "tokenEndpointAuthMethodsSupported"
    },
    token_endpoint_auth_signing_alg_values_supported: {
      toKey: "tokenEndpointAuthSigningAlgValuesSupported"
    },
    display_values_supported: { toKey: "displayValuesSupported" },
    claim_types_supported: { toKey: "claimTypesSupported" },
    claims_supported: { toKey: "claimsSupported" },
    service_documentation: { toKey: "serviceDocumentation" },
    claims_locales_supported: { toKey: "claimsLocalesSupported" },
    ui_locales_supported: { toKey: "uiLocalesSupported" },
    claims_parameter_supported: { toKey: "claimsParameterSupported" },
    request_parameter_supported: { toKey: "requestParameterSupported" },
    request_uri_parameter_supported: { toKey: "requestUriParameterSupported" },
    require_request_uri_registration: { toKey: "requireRequestUriRegistration" },
    op_policy_uri: {
      toKey: "opPolicyUri",
      convertToUrl: true
    },
    op_tos_uri: {
      toKey: "opTosUri",
      convertToUrl: true
    }
  };
  function processConfig(config) {
    const parsedConfig = {};
    Object.keys(config).forEach((key) => {
      if (issuerConfigKeyMap[key]) {
        parsedConfig[issuerConfigKeyMap[key].toKey] = config[key];
      }
    });
    if (!Array.isArray(parsedConfig.scopesSupported)) {
      parsedConfig.scopesSupported = ["openid"];
    }
    return parsedConfig;
  }
  var IssuerConfigFetcher = class _IssuerConfigFetcher {
    constructor(storageUtility) {
      this.storageUtility = storageUtility;
      this.storageUtility = storageUtility;
    }
    // This method needs no state (so can be static), and can be exposed to allow
    // callers to know where this implementation puts state it needs.
    static getLocalStorageKey(issuer) {
      return `issuerConfig:${issuer}`;
    }
    async fetchConfig(issuer) {
      let issuerConfig;
      const openIdConfigUrl = new URL(
        WELL_KNOWN_OPENID_CONFIG,
        // Make sure to append a slash at issuer URL, so that the .well-known URL
        // includes the full issuer path. See https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig.
        issuer.endsWith("/") ? issuer : `${issuer}/`
      ).href;
      const issuerConfigRequestBody = await fetch(openIdConfigUrl);
      try {
        issuerConfig = processConfig(await issuerConfigRequestBody.json());
      } catch (err) {
        throw new ConfigurationError(`[${issuer.toString()}] has an invalid configuration: ${err.message}`);
      }
      await this.storageUtility.set(_IssuerConfigFetcher.getLocalStorageKey(issuer), JSON.stringify(issuerConfig));
      return issuerConfig;
    }
  };
  async function clear2(sessionId, storage) {
    await clear(sessionId, storage);
    await clearOidcPersistentStorage();
  }
  var SessionInfoManager = class extends SessionInfoManagerBase {
    async get(sessionId) {
      const [isLoggedIn2, webId, clientId, clientSecret, redirectUrl, refreshToken, issuer, tokenType] = await Promise.all([
        this.storageUtility.getForUser(sessionId, "isLoggedIn", {
          secure: true
        }),
        this.storageUtility.getForUser(sessionId, "webId", {
          secure: true
        }),
        this.storageUtility.getForUser(sessionId, "clientId", {
          secure: false
        }),
        this.storageUtility.getForUser(sessionId, "clientSecret", {
          secure: false
        }),
        this.storageUtility.getForUser(sessionId, "redirectUrl", {
          secure: false
        }),
        this.storageUtility.getForUser(sessionId, "refreshToken", {
          secure: true
        }),
        this.storageUtility.getForUser(sessionId, "issuer", {
          secure: false
        }),
        this.storageUtility.getForUser(sessionId, "tokenType", {
          secure: false
        })
      ]);
      if (typeof redirectUrl === "string" && !isValidRedirectUrl(redirectUrl)) {
        await Promise.all([
          this.storageUtility.deleteAllUserData(sessionId, { secure: false }),
          this.storageUtility.deleteAllUserData(sessionId, { secure: true })
        ]);
        return void 0;
      }
      if (tokenType !== void 0 && !isSupportedTokenType(tokenType)) {
        throw new Error(`Tokens of type [${tokenType}] are not supported.`);
      }
      if (clientId === void 0 && isLoggedIn2 === void 0 && webId === void 0 && refreshToken === void 0) {
        return void 0;
      }
      return {
        sessionId,
        webId,
        isLoggedIn: isLoggedIn2 === "true",
        redirectUrl,
        refreshToken,
        issuer,
        clientAppId: clientId,
        clientAppSecret: clientSecret,
        // Default the token type to DPoP if unspecified.
        tokenType: tokenType !== null && tokenType !== void 0 ? tokenType : "DPoP"
      };
    }
    /**
     * This function removes all session-related information from storage.
     * @param sessionId the session identifier
     * @param storage the storage where session info is stored
     * @hidden
     */
    async clear(sessionId) {
      return clear2(sessionId, this.storageUtility);
    }
  };
  var FallbackRedirectHandler = class {
    async canHandle(redirectUrl) {
      try {
        new URL(redirectUrl);
        return true;
      } catch (e) {
        throw new Error(`[${redirectUrl}] is not a valid URL, and cannot be used as a redirect URL: ${e}`);
      }
    }
    async handle(_redirectUrl) {
      return getUnauthenticatedSession();
    }
  };
  var AuthCodeRedirectHandler = class {
    constructor(storageUtility, sessionInfoManager, issuerConfigFetcher, clientRegistrar, tokerRefresher) {
      this.storageUtility = storageUtility;
      this.sessionInfoManager = sessionInfoManager;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
      this.tokerRefresher = tokerRefresher;
      this.storageUtility = storageUtility;
      this.sessionInfoManager = sessionInfoManager;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
      this.tokerRefresher = tokerRefresher;
    }
    async canHandle(redirectUrl) {
      try {
        const myUrl = new URL(redirectUrl);
        return myUrl.searchParams.get("code") !== null && myUrl.searchParams.get("state") !== null;
      } catch (e) {
        throw new Error(`[${redirectUrl}] is not a valid URL, and cannot be used as a redirect URL: ${e}`);
      }
    }
    async handle(redirectUrl, eventEmitter) {
      if (!await this.canHandle(redirectUrl)) {
        throw new Error(`AuthCodeRedirectHandler cannot handle [${redirectUrl}]: it is missing one of [code, state].`);
      }
      const url = new URL(redirectUrl);
      const oauthState = url.searchParams.get("state");
      const storedSessionId = await this.storageUtility.getForUser(oauthState, "sessionId", {
        errorIfNull: true
      });
      const { issuerConfig, codeVerifier, redirectUrl: storedRedirectIri, dpop: isDpop } = await loadOidcContextFromStorage(storedSessionId, this.storageUtility, this.issuerConfigFetcher);
      const iss = url.searchParams.get("iss");
      if (typeof iss === "string" && iss !== issuerConfig.issuer) {
        throw new Error(`The value of the iss parameter (${iss}) does not match the issuer identifier of the authorization server (${issuerConfig.issuer}). See [rfc9207](https://www.rfc-editor.org/rfc/rfc9207.html#section-2.3-3.1.1)`);
      }
      if (codeVerifier === void 0) {
        throw new Error(`The code verifier for session ${storedSessionId} is missing from storage.`);
      }
      if (storedRedirectIri === void 0) {
        throw new Error(`The redirect URL for session ${storedSessionId} is missing from storage.`);
      }
      const client = await this.clientRegistrar.getClient({ sessionId: storedSessionId }, issuerConfig);
      const tokenCreatedAt = Date.now();
      const tokens = await getTokens(issuerConfig, client, {
        grantType: "authorization_code",
        // We rely on our 'canHandle' function checking that the OAuth 'code'
        // parameter is present in our query string.
        code: url.searchParams.get("code"),
        codeVerifier,
        redirectUrl: storedRedirectIri
      }, isDpop);
      window.localStorage.removeItem(`oidc.${oauthState}`);
      let refreshOptions;
      if (tokens.refreshToken !== void 0) {
        refreshOptions = {
          sessionId: storedSessionId,
          refreshToken: tokens.refreshToken,
          tokenRefresher: this.tokerRefresher
        };
      }
      const authFetch = await buildAuthenticatedFetch(tokens.accessToken, {
        dpopKey: tokens.dpopKey,
        refreshOptions,
        eventEmitter,
        expiresIn: tokens.expiresIn
      });
      await saveSessionInfoToStorage(this.storageUtility, storedSessionId, tokens.webId, tokens.clientId, "true", void 0, true);
      const sessionInfo = await this.sessionInfoManager.get(storedSessionId);
      if (!sessionInfo) {
        throw new Error(`Could not retrieve session: [${storedSessionId}].`);
      }
      return Object.assign(sessionInfo, {
        fetch: authFetch,
        getLogoutUrl: maybeBuildRpInitiatedLogout({
          idTokenHint: tokens.idToken,
          endSessionEndpoint: issuerConfig.endSessionEndpoint
        }),
        expirationDate: typeof tokens.expiresIn === "number" ? tokenCreatedAt + tokens.expiresIn * 1e3 : void 0
      });
    }
  };
  var AggregateRedirectHandler = class extends AggregateHandler {
    constructor(redirectHandlers) {
      super(redirectHandlers);
    }
  };
  var BrowserStorage = class {
    get storage() {
      return window.localStorage;
    }
    async get(key) {
      return this.storage.getItem(key) || void 0;
    }
    async set(key, value) {
      this.storage.setItem(key, value);
    }
    async delete(key) {
      this.storage.removeItem(key);
    }
  };
  var Redirector = class {
    redirect(redirectUrl, options) {
      if (options && options.handleRedirect) {
        options.handleRedirect(redirectUrl);
      } else if (options && options.redirectByReplacingState) {
        window.history.replaceState({}, "", redirectUrl);
      } else {
        window.location.href = redirectUrl;
      }
    }
  };
  var ClientRegistrar = class {
    constructor(storageUtility) {
      this.storageUtility = storageUtility;
      this.storageUtility = storageUtility;
    }
    async getClient(options, issuerConfig) {
      const [storedClientId, storedClientSecret, storedClientName, storedClientType] = await Promise.all([
        this.storageUtility.getForUser(options.sessionId, "clientId", {
          secure: false
        }),
        this.storageUtility.getForUser(options.sessionId, "clientSecret", {
          secure: false
        }),
        this.storageUtility.getForUser(options.sessionId, "clientName", {
          secure: false
        }),
        this.storageUtility.getForUser(options.sessionId, "clientType", {
          secure: false
        })
      ]);
      if (storedClientId && isKnownClientType(storedClientType)) {
        return {
          clientId: storedClientId,
          clientSecret: storedClientSecret,
          clientName: storedClientName,
          // Note: static clients are not applicable in a browser context.
          clientType: storedClientType
        };
      }
      try {
        const registeredClient = await registerClient(options, issuerConfig);
        const infoToSave = {
          clientId: registeredClient.clientId,
          clientType: "dynamic"
        };
        if (registeredClient.clientSecret) {
          infoToSave.clientSecret = registeredClient.clientSecret;
        }
        if (registeredClient.idTokenSignedResponseAlg) {
          infoToSave.idTokenSignedResponseAlg = registeredClient.idTokenSignedResponseAlg;
        }
        await this.storageUtility.setForUser(options.sessionId, infoToSave, {
          // FIXME: figure out how to persist secure storage at reload
          // Otherwise, the client info cannot be retrieved from storage, and
          // the lib tries to re-register the client on each fetch
          secure: false
        });
        return registeredClient;
      } catch (error) {
        throw new Error(`Client registration failed: [${error}]`);
      }
    }
  };
  var ErrorOidcHandler = class {
    async canHandle(redirectUrl) {
      try {
        return new URL(redirectUrl).searchParams.has("error");
      } catch (e) {
        throw new Error(`[${redirectUrl}] is not a valid URL, and cannot be used as a redirect URL: ${e}`);
      }
    }
    async handle(redirectUrl, eventEmitter) {
      if (eventEmitter !== void 0) {
        const url = new URL(redirectUrl);
        const errorUrl = url.searchParams.get("error");
        const errorDescriptionUrl = url.searchParams.get("error_description");
        eventEmitter.emit(EVENTS.ERROR, errorUrl, errorDescriptionUrl);
      }
      return getUnauthenticatedSession();
    }
  };
  var TokenRefresher = class {
    constructor(storageUtility, issuerConfigFetcher, clientRegistrar) {
      this.storageUtility = storageUtility;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
      this.storageUtility = storageUtility;
      this.issuerConfigFetcher = issuerConfigFetcher;
      this.clientRegistrar = clientRegistrar;
    }
    async refresh(sessionId, refreshToken, dpopKey, eventEmitter) {
      const oidcContext = await loadOidcContextFromStorage(sessionId, this.storageUtility, this.issuerConfigFetcher);
      const clientInfo = await this.clientRegistrar.getClient({ sessionId }, oidcContext.issuerConfig);
      if (refreshToken === void 0) {
        throw new Error(`Session [${sessionId}] has no refresh token to allow it to refresh its access token.`);
      }
      if (oidcContext.dpop && dpopKey === void 0) {
        throw new Error(`For session [${sessionId}], the key bound to the DPoP access token must be provided to refresh said access token.`);
      }
      const tokenSet = await refresh(refreshToken, oidcContext.issuerConfig, clientInfo, dpopKey);
      if (tokenSet.refreshToken !== void 0) {
        eventEmitter === null || eventEmitter === void 0 ? void 0 : eventEmitter.emit(EVENTS.NEW_REFRESH_TOKEN, tokenSet.refreshToken);
      }
      return tokenSet;
    }
  };
  function getClientAuthenticationWithDependencies(dependencies) {
    const inMemoryStorage = new InMemoryStorage();
    const secureStorage = dependencies.secureStorage || inMemoryStorage;
    const insecureStorage = dependencies.insecureStorage || new BrowserStorage();
    const storageUtility = new StorageUtilityBrowser(secureStorage, insecureStorage);
    const issuerConfigFetcher = new IssuerConfigFetcher(storageUtility);
    const clientRegistrar = new ClientRegistrar(storageUtility);
    const sessionInfoManager = new SessionInfoManager(storageUtility);
    const tokenRefresher = new TokenRefresher(storageUtility, issuerConfigFetcher, clientRegistrar);
    const redirector = new Redirector();
    const loginHandler = new OidcLoginHandler(storageUtility, new AuthorizationCodeWithPkceOidcHandler(storageUtility, redirector), issuerConfigFetcher, clientRegistrar);
    const redirectHandler = new AggregateRedirectHandler([
      new ErrorOidcHandler(),
      new AuthCodeRedirectHandler(storageUtility, sessionInfoManager, issuerConfigFetcher, clientRegistrar, tokenRefresher),
      // This catch-all class will always be able to handle the
      // redirect IRI, so it must be registered last.
      new FallbackRedirectHandler()
    ]);
    return new ClientAuthentication2(loginHandler, redirectHandler, new IWaterfallLogoutHandler(sessionInfoManager, redirector), sessionInfoManager, issuerConfigFetcher);
  }
  var KEY_CURRENT_SESSION = `${SOLID_CLIENT_AUTHN_KEY_PREFIX}currentSession`;
  var KEY_CURRENT_URL = `${SOLID_CLIENT_AUTHN_KEY_PREFIX}currentUrl`;
  async function silentlyAuthenticate(sessionId, clientAuthn, session) {
    var _a;
    const storedSessionInfo = await clientAuthn.validateCurrentSession(sessionId);
    if (storedSessionInfo !== null) {
      window.localStorage.setItem(KEY_CURRENT_URL, window.location.href);
      await clientAuthn.login({
        sessionId,
        prompt: "none",
        oidcIssuer: storedSessionInfo.issuer,
        redirectUrl: storedSessionInfo.redirectUrl,
        clientId: storedSessionInfo.clientAppId,
        clientSecret: storedSessionInfo.clientAppSecret,
        tokenType: (_a = storedSessionInfo.tokenType) !== null && _a !== void 0 ? _a : "DPoP"
      }, session.events);
      return true;
    }
    return false;
  }
  function isLoggedIn(sessionInfo) {
    return !!(sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.isLoggedIn);
  }
  var Session = class {
    /**
     * Session object constructor. Typically called as follows:
     *
     * ```typescript
     * const session = new Session();
     * ```
     *
     * See also [getDefaultSession](https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/functions.html#getdefaultsession).
     *
     * @param sessionOptions The options enabling the correct instantiation of
     * the session. Either both storages or clientAuthentication are required. For
     * more information, see {@link ISessionOptions}.
     * @param sessionId A string uniquely identifying the session.
     *
     */
    constructor(sessionOptions = {}, sessionId = void 0) {
      this.tokenRequestInProgress = false;
      this.login = async (options) => {
        var _a;
        await this.clientAuthentication.login({
          sessionId: this.info.sessionId,
          ...options,
          // Defaults the token type to DPoP
          tokenType: (_a = options.tokenType) !== null && _a !== void 0 ? _a : "DPoP"
        }, this.events);
        return new Promise(() => {
        });
      };
      this.fetch = (url, init) => this.clientAuthentication.fetch(url, init);
      this.internalLogout = async (emitSignal, options) => {
        window.localStorage.removeItem(KEY_CURRENT_SESSION);
        await this.clientAuthentication.logout(this.info.sessionId, options);
        this.info.isLoggedIn = false;
        if (emitSignal) {
          this.events.emit(EVENTS.LOGOUT);
        }
      };
      this.logout = async (options) => this.internalLogout(true, options);
      this.handleIncomingRedirect = async (inputOptions = {}) => {
        var _a;
        if (this.info.isLoggedIn) {
          return this.info;
        }
        if (this.tokenRequestInProgress) {
          return void 0;
        }
        const options = typeof inputOptions === "string" ? { url: inputOptions } : inputOptions;
        const url = (_a = options.url) !== null && _a !== void 0 ? _a : window.location.href;
        this.tokenRequestInProgress = true;
        const sessionInfo = await this.clientAuthentication.handleIncomingRedirect(url, this.events);
        if (isLoggedIn(sessionInfo)) {
          this.setSessionInfo(sessionInfo);
          const currentUrl = window.localStorage.getItem(KEY_CURRENT_URL);
          if (currentUrl === null) {
            this.events.emit(EVENTS.LOGIN);
          } else {
            window.localStorage.removeItem(KEY_CURRENT_URL);
            this.events.emit(EVENTS.SESSION_RESTORED, currentUrl);
          }
        } else if (options.restorePreviousSession === true) {
          const storedSessionId = window.localStorage.getItem(KEY_CURRENT_SESSION);
          if (storedSessionId !== null) {
            const attemptedSilentAuthentication = await silentlyAuthenticate(storedSessionId, this.clientAuthentication, this);
            if (attemptedSilentAuthentication) {
              return new Promise(() => {
              });
            }
          }
        }
        this.tokenRequestInProgress = false;
        return sessionInfo;
      };
      this.events = new import_events.default();
      if (sessionOptions.clientAuthentication) {
        this.clientAuthentication = sessionOptions.clientAuthentication;
      } else if (sessionOptions.secureStorage && sessionOptions.insecureStorage) {
        this.clientAuthentication = getClientAuthenticationWithDependencies({
          secureStorage: sessionOptions.secureStorage,
          insecureStorage: sessionOptions.insecureStorage
        });
      } else {
        this.clientAuthentication = getClientAuthenticationWithDependencies({});
      }
      if (sessionOptions.sessionInfo) {
        this.info = {
          sessionId: sessionOptions.sessionInfo.sessionId,
          isLoggedIn: false,
          webId: sessionOptions.sessionInfo.webId,
          clientAppId: sessionOptions.sessionInfo.clientAppId
        };
      } else {
        this.info = {
          sessionId: sessionId !== null && sessionId !== void 0 ? sessionId : v4_default(),
          isLoggedIn: false
        };
      }
      this.events.on(EVENTS.LOGIN, () => window.localStorage.setItem(KEY_CURRENT_SESSION, this.info.sessionId));
      this.events.on(EVENTS.SESSION_EXPIRED, () => this.internalLogout(false));
      this.events.on(EVENTS.ERROR, () => this.internalLogout(false));
    }
    setSessionInfo(sessionInfo) {
      this.info.isLoggedIn = sessionInfo.isLoggedIn;
      this.info.webId = sessionInfo.webId;
      this.info.sessionId = sessionInfo.sessionId;
      this.info.clientAppId = sessionInfo.clientAppId;
      this.info.expirationDate = sessionInfo.expirationDate;
      this.events.on(EVENTS.SESSION_EXTENDED, (expiresIn) => {
        this.info.expirationDate = Date.now() + expiresIn * 1e3;
      });
    }
  };
  var defaultSession;
  function getDefaultSession() {
    if (typeof defaultSession === "undefined") {
      defaultSession = new Session();
    }
    return defaultSession;
  }

  // node_modules/@muze-nl/oldm/dist/oldm.mjs
  var Bl = Object.create;
  var zr = Object.defineProperty;
  var Fl = Object.getOwnPropertyDescriptor;
  var jl = Object.getOwnPropertyNames;
  var Pl = Object.getPrototypeOf;
  var Ol = Object.prototype.hasOwnProperty;
  var A = (t6, e) => () => (e || t6((e = { exports: {} }).exports, e), e.exports);
  var Cl = (t6, e) => {
    for (var r in e)
      zr(t6, r, { get: e[r], enumerable: true });
  };
  var Ml = (t6, e, r, n) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let i of jl(e))
        !Ol.call(t6, i) && i !== r && zr(t6, i, { get: () => e[i], enumerable: !(n = Fl(e, i)) || n.enumerable });
    return t6;
  };
  var nr = (t6, e, r) => (r = t6 != null ? Bl(Pl(t6)) : {}, Ml(e || !t6 || !t6.__esModule ? zr(r, "default", { value: t6, enumerable: true }) : r, t6));
  var Di = A((T_, $i) => {
    var Mi;
    $i.exports = typeof queueMicrotask == "function" ? queueMicrotask.bind(typeof window < "u" ? window : global) : (t6) => (Mi || (Mi = Promise.resolve())).then(t6).catch((e) => setTimeout(() => {
      throw e;
    }, 0));
  });
  var Xi = A((or) => {
    "use strict";
    or.byteLength = lu;
    or.toByteArray = fu;
    or.fromByteArray = hu;
    var fe = [], ee = [], au = typeof Uint8Array < "u" ? Uint8Array : Array, rn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (Qe = 0, Yi = rn.length; Qe < Yi; ++Qe)
      fe[Qe] = rn[Qe], ee[rn.charCodeAt(Qe)] = Qe;
    var Qe, Yi;
    ee[45] = 62;
    ee[95] = 63;
    function Zi(t6) {
      var e = t6.length;
      if (e % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var r = t6.indexOf("=");
      r === -1 && (r = e);
      var n = r === e ? 0 : 4 - r % 4;
      return [r, n];
    }
    function lu(t6) {
      var e = Zi(t6), r = e[0], n = e[1];
      return (r + n) * 3 / 4 - n;
    }
    function uu(t6, e, r) {
      return (e + r) * 3 / 4 - r;
    }
    function fu(t6) {
      var e, r = Zi(t6), n = r[0], i = r[1], s = new au(uu(t6, n, i)), o = 0, a = i > 0 ? n - 4 : n, l;
      for (l = 0; l < a; l += 4)
        e = ee[t6.charCodeAt(l)] << 18 | ee[t6.charCodeAt(l + 1)] << 12 | ee[t6.charCodeAt(l + 2)] << 6 | ee[t6.charCodeAt(l + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
      return i === 2 && (e = ee[t6.charCodeAt(l)] << 2 | ee[t6.charCodeAt(l + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = ee[t6.charCodeAt(l)] << 10 | ee[t6.charCodeAt(l + 1)] << 4 | ee[t6.charCodeAt(l + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
    }
    function du(t6) {
      return fe[t6 >> 18 & 63] + fe[t6 >> 12 & 63] + fe[t6 >> 6 & 63] + fe[t6 & 63];
    }
    function cu(t6, e, r) {
      for (var n, i = [], s = e; s < r; s += 3)
        n = (t6[s] << 16 & 16711680) + (t6[s + 1] << 8 & 65280) + (t6[s + 2] & 255), i.push(du(n));
      return i.join("");
    }
    function hu(t6) {
      for (var e, r = t6.length, n = r % 3, i = [], s = 16383, o = 0, a = r - n; o < a; o += s)
        i.push(cu(t6, o, o + s > a ? a : o + s));
      return n === 1 ? (e = t6[r - 1], i.push(fe[e >> 2] + fe[e << 4 & 63] + "==")) : n === 2 && (e = (t6[r - 2] << 8) + t6[r - 1], i.push(fe[e >> 10] + fe[e >> 4 & 63] + fe[e << 2 & 63] + "=")), i.join("");
    }
  });
  var es = A((nn) => {
    nn.read = function(t6, e, r, n, i) {
      var s, o, a = i * 8 - n - 1, l = (1 << a) - 1, u = l >> 1, d = -7, f = r ? i - 1 : 0, b = r ? -1 : 1, _ = t6[e + f];
      for (f += b, s = _ & (1 << -d) - 1, _ >>= -d, d += a; d > 0; s = s * 256 + t6[e + f], f += b, d -= 8)
        ;
      for (o = s & (1 << -d) - 1, s >>= -d, d += n; d > 0; o = o * 256 + t6[e + f], f += b, d -= 8)
        ;
      if (s === 0)
        s = 1 - u;
      else {
        if (s === l)
          return o ? NaN : (_ ? -1 : 1) * (1 / 0);
        o = o + Math.pow(2, n), s = s - u;
      }
      return (_ ? -1 : 1) * o * Math.pow(2, s - n);
    };
    nn.write = function(t6, e, r, n, i, s) {
      var o, a, l, u = s * 8 - i - 1, d = (1 << u) - 1, f = d >> 1, b = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _ = n ? 0 : s - 1, y = n ? 1 : -1, g = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
      for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = d) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), o + f >= 1 ? e += b / l : e += b * Math.pow(2, 1 - f), e * l >= 2 && (o++, l /= 2), o + f >= d ? (a = 0, o = d) : o + f >= 1 ? (a = (e * l - 1) * Math.pow(2, i), o = o + f) : (a = e * Math.pow(2, f - 1) * Math.pow(2, i), o = 0)); i >= 8; t6[r + _] = a & 255, _ += y, a /= 256, i -= 8)
        ;
      for (o = o << i | a, u += i; u > 0; t6[r + _] = o & 255, _ += y, o /= 256, u -= 8)
        ;
      t6[r + _ - y] |= g * 128;
    };
  });
  var Ee = A((dt) => {
    "use strict";
    var sn = Xi(), ut = es(), ts = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    dt.Buffer = h;
    dt.SlowBuffer = wu;
    dt.INSPECT_MAX_BYTES = 50;
    var ar = 2147483647;
    dt.kMaxLength = ar;
    h.TYPED_ARRAY_SUPPORT = pu();
    !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    function pu() {
      try {
        let t6 = new Uint8Array(1), e = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(t6, e), t6.foo() === 42;
      } catch {
        return false;
      }
    }
    Object.defineProperty(h.prototype, "parent", { enumerable: true, get: function() {
      if (h.isBuffer(this))
        return this.buffer;
    } });
    Object.defineProperty(h.prototype, "offset", { enumerable: true, get: function() {
      if (h.isBuffer(this))
        return this.byteOffset;
    } });
    function Se(t6) {
      if (t6 > ar)
        throw new RangeError('The value "' + t6 + '" is invalid for option "size"');
      let e = new Uint8Array(t6);
      return Object.setPrototypeOf(e, h.prototype), e;
    }
    function h(t6, e, r) {
      if (typeof t6 == "number") {
        if (typeof e == "string")
          throw new TypeError('The "string" argument must be of type string. Received type number');
        return un(t6);
      }
      return ss(t6, e, r);
    }
    h.poolSize = 8192;
    function ss(t6, e, r) {
      if (typeof t6 == "string")
        return bu(t6, e);
      if (ArrayBuffer.isView(t6))
        return yu(t6);
      if (t6 == null)
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t6);
      if (de(t6, ArrayBuffer) || t6 && de(t6.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (de(t6, SharedArrayBuffer) || t6 && de(t6.buffer, SharedArrayBuffer)))
        return an(t6, e, r);
      if (typeof t6 == "number")
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      let n = t6.valueOf && t6.valueOf();
      if (n != null && n !== t6)
        return h.from(n, e, r);
      let i = gu(t6);
      if (i)
        return i;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof t6[Symbol.toPrimitive] == "function")
        return h.from(t6[Symbol.toPrimitive]("string"), e, r);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t6);
    }
    h.from = function(t6, e, r) {
      return ss(t6, e, r);
    };
    Object.setPrototypeOf(h.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(h, Uint8Array);
    function os(t6) {
      if (typeof t6 != "number")
        throw new TypeError('"size" argument must be of type number');
      if (t6 < 0)
        throw new RangeError('The value "' + t6 + '" is invalid for option "size"');
    }
    function _u(t6, e, r) {
      return os(t6), t6 <= 0 ? Se(t6) : e !== void 0 ? typeof r == "string" ? Se(t6).fill(e, r) : Se(t6).fill(e) : Se(t6);
    }
    h.alloc = function(t6, e, r) {
      return _u(t6, e, r);
    };
    function un(t6) {
      return os(t6), Se(t6 < 0 ? 0 : fn(t6) | 0);
    }
    h.allocUnsafe = function(t6) {
      return un(t6);
    };
    h.allocUnsafeSlow = function(t6) {
      return un(t6);
    };
    function bu(t6, e) {
      if ((typeof e != "string" || e === "") && (e = "utf8"), !h.isEncoding(e))
        throw new TypeError("Unknown encoding: " + e);
      let r = as(t6, e) | 0, n = Se(r), i = n.write(t6, e);
      return i !== r && (n = n.slice(0, i)), n;
    }
    function on(t6) {
      let e = t6.length < 0 ? 0 : fn(t6.length) | 0, r = Se(e);
      for (let n = 0; n < e; n += 1)
        r[n] = t6[n] & 255;
      return r;
    }
    function yu(t6) {
      if (de(t6, Uint8Array)) {
        let e = new Uint8Array(t6);
        return an(e.buffer, e.byteOffset, e.byteLength);
      }
      return on(t6);
    }
    function an(t6, e, r) {
      if (e < 0 || t6.byteLength < e)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (t6.byteLength < e + (r || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let n;
      return e === void 0 && r === void 0 ? n = new Uint8Array(t6) : r === void 0 ? n = new Uint8Array(t6, e) : n = new Uint8Array(t6, e, r), Object.setPrototypeOf(n, h.prototype), n;
    }
    function gu(t6) {
      if (h.isBuffer(t6)) {
        let e = fn(t6.length) | 0, r = Se(e);
        return r.length === 0 || t6.copy(r, 0, 0, e), r;
      }
      if (t6.length !== void 0)
        return typeof t6.length != "number" || cn(t6.length) ? Se(0) : on(t6);
      if (t6.type === "Buffer" && Array.isArray(t6.data))
        return on(t6.data);
    }
    function fn(t6) {
      if (t6 >= ar)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ar.toString(16) + " bytes");
      return t6 | 0;
    }
    function wu(t6) {
      return +t6 != t6 && (t6 = 0), h.alloc(+t6);
    }
    h.isBuffer = function(e) {
      return e != null && e._isBuffer === true && e !== h.prototype;
    };
    h.compare = function(e, r) {
      if (de(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), de(r, Uint8Array) && (r = h.from(r, r.offset, r.byteLength)), !h.isBuffer(e) || !h.isBuffer(r))
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (e === r)
        return 0;
      let n = e.length, i = r.length;
      for (let s = 0, o = Math.min(n, i); s < o; ++s)
        if (e[s] !== r[s]) {
          n = e[s], i = r[s];
          break;
        }
      return n < i ? -1 : i < n ? 1 : 0;
    };
    h.isEncoding = function(e) {
      switch (String(e).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    h.concat = function(e, r) {
      if (!Array.isArray(e))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (e.length === 0)
        return h.alloc(0);
      let n;
      if (r === void 0)
        for (r = 0, n = 0; n < e.length; ++n)
          r += e[n].length;
      let i = h.allocUnsafe(r), s = 0;
      for (n = 0; n < e.length; ++n) {
        let o = e[n];
        if (de(o, Uint8Array))
          s + o.length > i.length ? (h.isBuffer(o) || (o = h.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
        else if (h.isBuffer(o))
          o.copy(i, s);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        s += o.length;
      }
      return i;
    };
    function as(t6, e) {
      if (h.isBuffer(t6))
        return t6.length;
      if (ArrayBuffer.isView(t6) || de(t6, ArrayBuffer))
        return t6.byteLength;
      if (typeof t6 != "string")
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t6);
      let r = t6.length, n = arguments.length > 2 && arguments[2] === true;
      if (!n && r === 0)
        return 0;
      let i = false;
      for (; ; )
        switch (e) {
          case "ascii":
          case "latin1":
          case "binary":
            return r;
          case "utf8":
          case "utf-8":
            return ln(t6).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return r * 2;
          case "hex":
            return r >>> 1;
          case "base64":
            return bs(t6).length;
          default:
            if (i)
              return n ? -1 : ln(t6).length;
            e = ("" + e).toLowerCase(), i = true;
        }
    }
    h.byteLength = as;
    function mu(t6, e, r) {
      let n = false;
      if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, e >>>= 0, r <= e))
        return "";
      for (t6 || (t6 = "utf8"); ; )
        switch (t6) {
          case "hex":
            return Lu(this, e, r);
          case "utf8":
          case "utf-8":
            return us(this, e, r);
          case "ascii":
            return Nu(this, e, r);
          case "latin1":
          case "binary":
            return ku(this, e, r);
          case "base64":
            return Au(this, e, r);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return vu(this, e, r);
          default:
            if (n)
              throw new TypeError("Unknown encoding: " + t6);
            t6 = (t6 + "").toLowerCase(), n = true;
        }
    }
    h.prototype._isBuffer = true;
    function ze(t6, e, r) {
      let n = t6[e];
      t6[e] = t6[r], t6[r] = n;
    }
    h.prototype.swap16 = function() {
      let e = this.length;
      if (e % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let r = 0; r < e; r += 2)
        ze(this, r, r + 1);
      return this;
    };
    h.prototype.swap32 = function() {
      let e = this.length;
      if (e % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let r = 0; r < e; r += 4)
        ze(this, r, r + 3), ze(this, r + 1, r + 2);
      return this;
    };
    h.prototype.swap64 = function() {
      let e = this.length;
      if (e % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let r = 0; r < e; r += 8)
        ze(this, r, r + 7), ze(this, r + 1, r + 6), ze(this, r + 2, r + 5), ze(this, r + 3, r + 4);
      return this;
    };
    h.prototype.toString = function() {
      let e = this.length;
      return e === 0 ? "" : arguments.length === 0 ? us(this, 0, e) : mu.apply(this, arguments);
    };
    h.prototype.toLocaleString = h.prototype.toString;
    h.prototype.equals = function(e) {
      if (!h.isBuffer(e))
        throw new TypeError("Argument must be a Buffer");
      return this === e ? true : h.compare(this, e) === 0;
    };
    h.prototype.inspect = function() {
      let e = "", r = dt.INSPECT_MAX_BYTES;
      return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">";
    };
    ts && (h.prototype[ts] = h.prototype.inspect);
    h.prototype.compare = function(e, r, n, i, s) {
      if (de(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e))
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
      if (r === void 0 && (r = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), r < 0 || n > e.length || i < 0 || s > this.length)
        throw new RangeError("out of range index");
      if (i >= s && r >= n)
        return 0;
      if (i >= s)
        return -1;
      if (r >= n)
        return 1;
      if (r >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e)
        return 0;
      let o = s - i, a = n - r, l = Math.min(o, a), u = this.slice(i, s), d = e.slice(r, n);
      for (let f = 0; f < l; ++f)
        if (u[f] !== d[f]) {
          o = u[f], a = d[f];
          break;
        }
      return o < a ? -1 : a < o ? 1 : 0;
    };
    function ls(t6, e, r, n, i) {
      if (t6.length === 0)
        return -1;
      if (typeof r == "string" ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, cn(r) && (r = i ? 0 : t6.length - 1), r < 0 && (r = t6.length + r), r >= t6.length) {
        if (i)
          return -1;
        r = t6.length - 1;
      } else if (r < 0)
        if (i)
          r = 0;
        else
          return -1;
      if (typeof e == "string" && (e = h.from(e, n)), h.isBuffer(e))
        return e.length === 0 ? -1 : rs(t6, e, r, n, i);
      if (typeof e == "number")
        return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(t6, e, r) : Uint8Array.prototype.lastIndexOf.call(t6, e, r) : rs(t6, [e], r, n, i);
      throw new TypeError("val must be string, number or Buffer");
    }
    function rs(t6, e, r, n, i) {
      let s = 1, o = t6.length, a = e.length;
      if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
        if (t6.length < 2 || e.length < 2)
          return -1;
        s = 2, o /= 2, a /= 2, r /= 2;
      }
      function l(d, f) {
        return s === 1 ? d[f] : d.readUInt16BE(f * s);
      }
      let u;
      if (i) {
        let d = -1;
        for (u = r; u < o; u++)
          if (l(t6, u) === l(e, d === -1 ? 0 : u - d)) {
            if (d === -1 && (d = u), u - d + 1 === a)
              return d * s;
          } else
            d !== -1 && (u -= u - d), d = -1;
      } else
        for (r + a > o && (r = o - a), u = r; u >= 0; u--) {
          let d = true;
          for (let f = 0; f < a; f++)
            if (l(t6, u + f) !== l(e, f)) {
              d = false;
              break;
            }
          if (d)
            return u;
        }
      return -1;
    }
    h.prototype.includes = function(e, r, n) {
      return this.indexOf(e, r, n) !== -1;
    };
    h.prototype.indexOf = function(e, r, n) {
      return ls(this, e, r, n, true);
    };
    h.prototype.lastIndexOf = function(e, r, n) {
      return ls(this, e, r, n, false);
    };
    function xu(t6, e, r, n) {
      r = Number(r) || 0;
      let i = t6.length - r;
      n ? (n = Number(n), n > i && (n = i)) : n = i;
      let s = e.length;
      n > s / 2 && (n = s / 2);
      let o;
      for (o = 0; o < n; ++o) {
        let a = parseInt(e.substr(o * 2, 2), 16);
        if (cn(a))
          return o;
        t6[r + o] = a;
      }
      return o;
    }
    function Su(t6, e, r, n) {
      return lr(ln(e, t6.length - r), t6, r, n);
    }
    function Eu(t6, e, r, n) {
      return lr(Pu(e), t6, r, n);
    }
    function Ru(t6, e, r, n) {
      return lr(bs(e), t6, r, n);
    }
    function Iu(t6, e, r, n) {
      return lr(Ou(e, t6.length - r), t6, r, n);
    }
    h.prototype.write = function(e, r, n, i) {
      if (r === void 0)
        i = "utf8", n = this.length, r = 0;
      else if (n === void 0 && typeof r == "string")
        i = r, n = this.length, r = 0;
      else if (isFinite(r))
        r = r >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
      else
        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      let s = this.length - r;
      if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || r < 0) || r > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      i || (i = "utf8");
      let o = false;
      for (; ; )
        switch (i) {
          case "hex":
            return xu(this, e, r, n);
          case "utf8":
          case "utf-8":
            return Su(this, e, r, n);
          case "ascii":
          case "latin1":
          case "binary":
            return Eu(this, e, r, n);
          case "base64":
            return Ru(this, e, r, n);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Iu(this, e, r, n);
          default:
            if (o)
              throw new TypeError("Unknown encoding: " + i);
            i = ("" + i).toLowerCase(), o = true;
        }
    };
    h.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    function Au(t6, e, r) {
      return e === 0 && r === t6.length ? sn.fromByteArray(t6) : sn.fromByteArray(t6.slice(e, r));
    }
    function us(t6, e, r) {
      r = Math.min(t6.length, r);
      let n = [], i = e;
      for (; i < r; ) {
        let s = t6[i], o = null, a = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
        if (i + a <= r) {
          let l, u, d, f;
          switch (a) {
            case 1:
              s < 128 && (o = s);
              break;
            case 2:
              l = t6[i + 1], (l & 192) === 128 && (f = (s & 31) << 6 | l & 63, f > 127 && (o = f));
              break;
            case 3:
              l = t6[i + 1], u = t6[i + 2], (l & 192) === 128 && (u & 192) === 128 && (f = (s & 15) << 12 | (l & 63) << 6 | u & 63, f > 2047 && (f < 55296 || f > 57343) && (o = f));
              break;
            case 4:
              l = t6[i + 1], u = t6[i + 2], d = t6[i + 3], (l & 192) === 128 && (u & 192) === 128 && (d & 192) === 128 && (f = (s & 15) << 18 | (l & 63) << 12 | (u & 63) << 6 | d & 63, f > 65535 && f < 1114112 && (o = f));
          }
        }
        o === null ? (o = 65533, a = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += a;
      }
      return Tu(n);
    }
    var ns = 4096;
    function Tu(t6) {
      let e = t6.length;
      if (e <= ns)
        return String.fromCharCode.apply(String, t6);
      let r = "", n = 0;
      for (; n < e; )
        r += String.fromCharCode.apply(String, t6.slice(n, n += ns));
      return r;
    }
    function Nu(t6, e, r) {
      let n = "";
      r = Math.min(t6.length, r);
      for (let i = e; i < r; ++i)
        n += String.fromCharCode(t6[i] & 127);
      return n;
    }
    function ku(t6, e, r) {
      let n = "";
      r = Math.min(t6.length, r);
      for (let i = e; i < r; ++i)
        n += String.fromCharCode(t6[i]);
      return n;
    }
    function Lu(t6, e, r) {
      let n = t6.length;
      (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
      let i = "";
      for (let s = e; s < r; ++s)
        i += Cu[t6[s]];
      return i;
    }
    function vu(t6, e, r) {
      let n = t6.slice(e, r), i = "";
      for (let s = 0; s < n.length - 1; s += 2)
        i += String.fromCharCode(n[s] + n[s + 1] * 256);
      return i;
    }
    h.prototype.slice = function(e, r) {
      let n = this.length;
      e = ~~e, r = r === void 0 ? n : ~~r, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), r < e && (r = e);
      let i = this.subarray(e, r);
      return Object.setPrototypeOf(i, h.prototype), i;
    };
    function q(t6, e, r) {
      if (t6 % 1 !== 0 || t6 < 0)
        throw new RangeError("offset is not uint");
      if (t6 + e > r)
        throw new RangeError("Trying to access beyond buffer length");
    }
    h.prototype.readUintLE = h.prototype.readUIntLE = function(e, r, n) {
      e = e >>> 0, r = r >>> 0, n || q(e, r, this.length);
      let i = this[e], s = 1, o = 0;
      for (; ++o < r && (s *= 256); )
        i += this[e + o] * s;
      return i;
    };
    h.prototype.readUintBE = h.prototype.readUIntBE = function(e, r, n) {
      e = e >>> 0, r = r >>> 0, n || q(e, r, this.length);
      let i = this[e + --r], s = 1;
      for (; r > 0 && (s *= 256); )
        i += this[e + --r] * s;
      return i;
    };
    h.prototype.readUint8 = h.prototype.readUInt8 = function(e, r) {
      return e = e >>> 0, r || q(e, 1, this.length), this[e];
    };
    h.prototype.readUint16LE = h.prototype.readUInt16LE = function(e, r) {
      return e = e >>> 0, r || q(e, 2, this.length), this[e] | this[e + 1] << 8;
    };
    h.prototype.readUint16BE = h.prototype.readUInt16BE = function(e, r) {
      return e = e >>> 0, r || q(e, 2, this.length), this[e] << 8 | this[e + 1];
    };
    h.prototype.readUint32LE = h.prototype.readUInt32LE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
    };
    h.prototype.readUint32BE = h.prototype.readUInt32BE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
    };
    h.prototype.readBigUInt64LE = je(function(e) {
      e = e >>> 0, ft(e, "offset");
      let r = this[e], n = this[e + 7];
      (r === void 0 || n === void 0) && qt(e, this.length - 8);
      let i = r + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
      return BigInt(i) + (BigInt(s) << BigInt(32));
    });
    h.prototype.readBigUInt64BE = je(function(e) {
      e = e >>> 0, ft(e, "offset");
      let r = this[e], n = this[e + 7];
      (r === void 0 || n === void 0) && qt(e, this.length - 8);
      let i = r * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
      return (BigInt(i) << BigInt(32)) + BigInt(s);
    });
    h.prototype.readIntLE = function(e, r, n) {
      e = e >>> 0, r = r >>> 0, n || q(e, r, this.length);
      let i = this[e], s = 1, o = 0;
      for (; ++o < r && (s *= 256); )
        i += this[e + o] * s;
      return s *= 128, i >= s && (i -= Math.pow(2, 8 * r)), i;
    };
    h.prototype.readIntBE = function(e, r, n) {
      e = e >>> 0, r = r >>> 0, n || q(e, r, this.length);
      let i = r, s = 1, o = this[e + --i];
      for (; i > 0 && (s *= 256); )
        o += this[e + --i] * s;
      return s *= 128, o >= s && (o -= Math.pow(2, 8 * r)), o;
    };
    h.prototype.readInt8 = function(e, r) {
      return e = e >>> 0, r || q(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
    };
    h.prototype.readInt16LE = function(e, r) {
      e = e >>> 0, r || q(e, 2, this.length);
      let n = this[e] | this[e + 1] << 8;
      return n & 32768 ? n | 4294901760 : n;
    };
    h.prototype.readInt16BE = function(e, r) {
      e = e >>> 0, r || q(e, 2, this.length);
      let n = this[e + 1] | this[e] << 8;
      return n & 32768 ? n | 4294901760 : n;
    };
    h.prototype.readInt32LE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
    };
    h.prototype.readInt32BE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
    };
    h.prototype.readBigInt64LE = je(function(e) {
      e = e >>> 0, ft(e, "offset");
      let r = this[e], n = this[e + 7];
      (r === void 0 || n === void 0) && qt(e, this.length - 8);
      let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
      return (BigInt(i) << BigInt(32)) + BigInt(r + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
    });
    h.prototype.readBigInt64BE = je(function(e) {
      e = e >>> 0, ft(e, "offset");
      let r = this[e], n = this[e + 7];
      (r === void 0 || n === void 0) && qt(e, this.length - 8);
      let i = (r << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
      return (BigInt(i) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n);
    });
    h.prototype.readFloatLE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), ut.read(this, e, true, 23, 4);
    };
    h.prototype.readFloatBE = function(e, r) {
      return e = e >>> 0, r || q(e, 4, this.length), ut.read(this, e, false, 23, 4);
    };
    h.prototype.readDoubleLE = function(e, r) {
      return e = e >>> 0, r || q(e, 8, this.length), ut.read(this, e, true, 52, 8);
    };
    h.prototype.readDoubleBE = function(e, r) {
      return e = e >>> 0, r || q(e, 8, this.length), ut.read(this, e, false, 52, 8);
    };
    function Y(t6, e, r, n, i, s) {
      if (!h.isBuffer(t6))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (e > i || e < s)
        throw new RangeError('"value" argument is out of bounds');
      if (r + n > t6.length)
        throw new RangeError("Index out of range");
    }
    h.prototype.writeUintLE = h.prototype.writeUIntLE = function(e, r, n, i) {
      if (e = +e, r = r >>> 0, n = n >>> 0, !i) {
        let a = Math.pow(2, 8 * n) - 1;
        Y(this, e, r, n, a, 0);
      }
      let s = 1, o = 0;
      for (this[r] = e & 255; ++o < n && (s *= 256); )
        this[r + o] = e / s & 255;
      return r + n;
    };
    h.prototype.writeUintBE = h.prototype.writeUIntBE = function(e, r, n, i) {
      if (e = +e, r = r >>> 0, n = n >>> 0, !i) {
        let a = Math.pow(2, 8 * n) - 1;
        Y(this, e, r, n, a, 0);
      }
      let s = n - 1, o = 1;
      for (this[r + s] = e & 255; --s >= 0 && (o *= 256); )
        this[r + s] = e / o & 255;
      return r + n;
    };
    h.prototype.writeUint8 = h.prototype.writeUInt8 = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 1, 255, 0), this[r] = e & 255, r + 1;
    };
    h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 2, 65535, 0), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
    };
    h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 2, 65535, 0), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
    };
    h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 4, 4294967295, 0), this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = e & 255, r + 4;
    };
    h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 4, 4294967295, 0), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
    };
    function fs(t6, e, r, n, i) {
      _s(e, n, i, t6, r, 7);
      let s = Number(e & BigInt(4294967295));
      t6[r++] = s, s = s >> 8, t6[r++] = s, s = s >> 8, t6[r++] = s, s = s >> 8, t6[r++] = s;
      let o = Number(e >> BigInt(32) & BigInt(4294967295));
      return t6[r++] = o, o = o >> 8, t6[r++] = o, o = o >> 8, t6[r++] = o, o = o >> 8, t6[r++] = o, r;
    }
    function ds(t6, e, r, n, i) {
      _s(e, n, i, t6, r, 7);
      let s = Number(e & BigInt(4294967295));
      t6[r + 7] = s, s = s >> 8, t6[r + 6] = s, s = s >> 8, t6[r + 5] = s, s = s >> 8, t6[r + 4] = s;
      let o = Number(e >> BigInt(32) & BigInt(4294967295));
      return t6[r + 3] = o, o = o >> 8, t6[r + 2] = o, o = o >> 8, t6[r + 1] = o, o = o >> 8, t6[r] = o, r + 8;
    }
    h.prototype.writeBigUInt64LE = je(function(e, r = 0) {
      return fs(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    h.prototype.writeBigUInt64BE = je(function(e, r = 0) {
      return ds(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    h.prototype.writeIntLE = function(e, r, n, i) {
      if (e = +e, r = r >>> 0, !i) {
        let l = Math.pow(2, 8 * n - 1);
        Y(this, e, r, n, l - 1, -l);
      }
      let s = 0, o = 1, a = 0;
      for (this[r] = e & 255; ++s < n && (o *= 256); )
        e < 0 && a === 0 && this[r + s - 1] !== 0 && (a = 1), this[r + s] = (e / o >> 0) - a & 255;
      return r + n;
    };
    h.prototype.writeIntBE = function(e, r, n, i) {
      if (e = +e, r = r >>> 0, !i) {
        let l = Math.pow(2, 8 * n - 1);
        Y(this, e, r, n, l - 1, -l);
      }
      let s = n - 1, o = 1, a = 0;
      for (this[r + s] = e & 255; --s >= 0 && (o *= 256); )
        e < 0 && a === 0 && this[r + s + 1] !== 0 && (a = 1), this[r + s] = (e / o >> 0) - a & 255;
      return r + n;
    };
    h.prototype.writeInt8 = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[r] = e & 255, r + 1;
    };
    h.prototype.writeInt16LE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 2, 32767, -32768), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
    };
    h.prototype.writeInt16BE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 2, 32767, -32768), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
    };
    h.prototype.writeInt32LE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 4, 2147483647, -2147483648), this[r] = e & 255, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24, r + 4;
    };
    h.prototype.writeInt32BE = function(e, r, n) {
      return e = +e, r = r >>> 0, n || Y(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
    };
    h.prototype.writeBigInt64LE = je(function(e, r = 0) {
      return fs(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    h.prototype.writeBigInt64BE = je(function(e, r = 0) {
      return ds(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function cs(t6, e, r, n, i, s) {
      if (r + n > t6.length)
        throw new RangeError("Index out of range");
      if (r < 0)
        throw new RangeError("Index out of range");
    }
    function hs(t6, e, r, n, i) {
      return e = +e, r = r >>> 0, i || cs(t6, e, r, 4, 34028234663852886e22, -34028234663852886e22), ut.write(t6, e, r, n, 23, 4), r + 4;
    }
    h.prototype.writeFloatLE = function(e, r, n) {
      return hs(this, e, r, true, n);
    };
    h.prototype.writeFloatBE = function(e, r, n) {
      return hs(this, e, r, false, n);
    };
    function ps(t6, e, r, n, i) {
      return e = +e, r = r >>> 0, i || cs(t6, e, r, 8, 17976931348623157e292, -17976931348623157e292), ut.write(t6, e, r, n, 52, 8), r + 8;
    }
    h.prototype.writeDoubleLE = function(e, r, n) {
      return ps(this, e, r, true, n);
    };
    h.prototype.writeDoubleBE = function(e, r, n) {
      return ps(this, e, r, false, n);
    };
    h.prototype.copy = function(e, r, n, i) {
      if (!h.isBuffer(e))
        throw new TypeError("argument should be a Buffer");
      if (n || (n = 0), !i && i !== 0 && (i = this.length), r >= e.length && (r = e.length), r || (r = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0)
        return 0;
      if (r < 0)
        throw new RangeError("targetStart out of bounds");
      if (n < 0 || n >= this.length)
        throw new RangeError("Index out of range");
      if (i < 0)
        throw new RangeError("sourceEnd out of bounds");
      i > this.length && (i = this.length), e.length - r < i - n && (i = e.length - r + n);
      let s = i - n;
      return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(r, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), r), s;
    };
    h.prototype.fill = function(e, r, n, i) {
      if (typeof e == "string") {
        if (typeof r == "string" ? (i = r, r = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string")
          throw new TypeError("encoding must be a string");
        if (typeof i == "string" && !h.isEncoding(i))
          throw new TypeError("Unknown encoding: " + i);
        if (e.length === 1) {
          let o = e.charCodeAt(0);
          (i === "utf8" && o < 128 || i === "latin1") && (e = o);
        }
      } else
        typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
      if (r < 0 || this.length < r || this.length < n)
        throw new RangeError("Out of range index");
      if (n <= r)
        return this;
      r = r >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
      let s;
      if (typeof e == "number")
        for (s = r; s < n; ++s)
          this[s] = e;
      else {
        let o = h.isBuffer(e) ? e : h.from(e, i), a = o.length;
        if (a === 0)
          throw new TypeError('The value "' + e + '" is invalid for argument "value"');
        for (s = 0; s < n - r; ++s)
          this[s + r] = o[s % a];
      }
      return this;
    };
    var lt = {};
    function dn(t6, e, r) {
      lt[t6] = class extends r {
        constructor() {
          super(), Object.defineProperty(this, "message", { value: e.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${t6}]`, this.stack, delete this.name;
        }
        get code() {
          return t6;
        }
        set code(i) {
          Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: i, writable: true });
        }
        toString() {
          return `${this.name} [${t6}]: ${this.message}`;
        }
      };
    }
    dn("ERR_BUFFER_OUT_OF_BOUNDS", function(t6) {
      return t6 ? `${t6} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    }, RangeError);
    dn("ERR_INVALID_ARG_TYPE", function(t6, e) {
      return `The "${t6}" argument must be of type number. Received type ${typeof e}`;
    }, TypeError);
    dn("ERR_OUT_OF_RANGE", function(t6, e, r) {
      let n = `The value of "${t6}" is out of range.`, i = r;
      return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? i = is(String(r)) : typeof r == "bigint" && (i = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = is(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
    }, RangeError);
    function is(t6) {
      let e = "", r = t6.length, n = t6[0] === "-" ? 1 : 0;
      for (; r >= n + 4; r -= 3)
        e = `_${t6.slice(r - 3, r)}${e}`;
      return `${t6.slice(0, r)}${e}`;
    }
    function Bu(t6, e, r) {
      ft(e, "offset"), (t6[e] === void 0 || t6[e + r] === void 0) && qt(e, t6.length - (r + 1));
    }
    function _s(t6, e, r, n, i, s) {
      if (t6 > r || t6 < e) {
        let o = typeof e == "bigint" ? "n" : "", a;
        throw s > 3 ? e === 0 || e === BigInt(0) ? a = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : a = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : a = `>= ${e}${o} and <= ${r}${o}`, new lt.ERR_OUT_OF_RANGE("value", a, t6);
      }
      Bu(n, i, s);
    }
    function ft(t6, e) {
      if (typeof t6 != "number")
        throw new lt.ERR_INVALID_ARG_TYPE(e, "number", t6);
    }
    function qt(t6, e, r) {
      throw Math.floor(t6) !== t6 ? (ft(t6, r), new lt.ERR_OUT_OF_RANGE(r || "offset", "an integer", t6)) : e < 0 ? new lt.ERR_BUFFER_OUT_OF_BOUNDS() : new lt.ERR_OUT_OF_RANGE(r || "offset", `>= ${r ? 1 : 0} and <= ${e}`, t6);
    }
    var Fu = /[^+/0-9A-Za-z-_]/g;
    function ju(t6) {
      if (t6 = t6.split("=")[0], t6 = t6.trim().replace(Fu, ""), t6.length < 2)
        return "";
      for (; t6.length % 4 !== 0; )
        t6 = t6 + "=";
      return t6;
    }
    function ln(t6, e) {
      e = e || 1 / 0;
      let r, n = t6.length, i = null, s = [];
      for (let o = 0; o < n; ++o) {
        if (r = t6.charCodeAt(o), r > 55295 && r < 57344) {
          if (!i) {
            if (r > 56319) {
              (e -= 3) > -1 && s.push(239, 191, 189);
              continue;
            } else if (o + 1 === n) {
              (e -= 3) > -1 && s.push(239, 191, 189);
              continue;
            }
            i = r;
            continue;
          }
          if (r < 56320) {
            (e -= 3) > -1 && s.push(239, 191, 189), i = r;
            continue;
          }
          r = (i - 55296 << 10 | r - 56320) + 65536;
        } else
          i && (e -= 3) > -1 && s.push(239, 191, 189);
        if (i = null, r < 128) {
          if ((e -= 1) < 0)
            break;
          s.push(r);
        } else if (r < 2048) {
          if ((e -= 2) < 0)
            break;
          s.push(r >> 6 | 192, r & 63 | 128);
        } else if (r < 65536) {
          if ((e -= 3) < 0)
            break;
          s.push(r >> 12 | 224, r >> 6 & 63 | 128, r & 63 | 128);
        } else if (r < 1114112) {
          if ((e -= 4) < 0)
            break;
          s.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, r & 63 | 128);
        } else
          throw new Error("Invalid code point");
      }
      return s;
    }
    function Pu(t6) {
      let e = [];
      for (let r = 0; r < t6.length; ++r)
        e.push(t6.charCodeAt(r) & 255);
      return e;
    }
    function Ou(t6, e) {
      let r, n, i, s = [];
      for (let o = 0; o < t6.length && !((e -= 2) < 0); ++o)
        r = t6.charCodeAt(o), n = r >> 8, i = r % 256, s.push(i), s.push(n);
      return s;
    }
    function bs(t6) {
      return sn.toByteArray(ju(t6));
    }
    function lr(t6, e, r, n) {
      let i;
      for (i = 0; i < n && !(i + r >= e.length || i >= t6.length); ++i)
        e[i + r] = t6[i];
      return i;
    }
    function de(t6, e) {
      return t6 instanceof e || t6 != null && t6.constructor != null && t6.constructor.name != null && t6.constructor.name === e.name;
    }
    function cn(t6) {
      return t6 !== t6;
    }
    var Cu = function() {
      let t6 = "0123456789abcdef", e = new Array(256);
      for (let r = 0; r < 16; ++r) {
        let n = r * 16;
        for (let i = 0; i < 16; ++i)
          e[n + i] = t6[r] + t6[i];
      }
      return e;
    }();
    function je(t6) {
      return typeof BigInt > "u" ? Mu : t6;
    }
    function Mu() {
      throw new Error("BigInt not supported");
    }
  });
  var B = A((Q_, ys) => {
    "use strict";
    ys.exports = { ArrayIsArray(t6) {
      return Array.isArray(t6);
    }, ArrayPrototypeIncludes(t6, e) {
      return t6.includes(e);
    }, ArrayPrototypeIndexOf(t6, e) {
      return t6.indexOf(e);
    }, ArrayPrototypeJoin(t6, e) {
      return t6.join(e);
    }, ArrayPrototypeMap(t6, e) {
      return t6.map(e);
    }, ArrayPrototypePop(t6, e) {
      return t6.pop(e);
    }, ArrayPrototypePush(t6, e) {
      return t6.push(e);
    }, ArrayPrototypeSlice(t6, e, r) {
      return t6.slice(e, r);
    }, Error, FunctionPrototypeCall(t6, e, ...r) {
      return t6.call(e, ...r);
    }, FunctionPrototypeSymbolHasInstance(t6, e) {
      return Function.prototype[Symbol.hasInstance].call(t6, e);
    }, MathFloor: Math.floor, Number, NumberIsInteger: Number.isInteger, NumberIsNaN: Number.isNaN, NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER, NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER, NumberParseInt: Number.parseInt, ObjectDefineProperties(t6, e) {
      return Object.defineProperties(t6, e);
    }, ObjectDefineProperty(t6, e, r) {
      return Object.defineProperty(t6, e, r);
    }, ObjectGetOwnPropertyDescriptor(t6, e) {
      return Object.getOwnPropertyDescriptor(t6, e);
    }, ObjectKeys(t6) {
      return Object.keys(t6);
    }, ObjectSetPrototypeOf(t6, e) {
      return Object.setPrototypeOf(t6, e);
    }, Promise, PromisePrototypeCatch(t6, e) {
      return t6.catch(e);
    }, PromisePrototypeThen(t6, e, r) {
      return t6.then(e, r);
    }, PromiseReject(t6) {
      return Promise.reject(t6);
    }, PromiseResolve(t6) {
      return Promise.resolve(t6);
    }, ReflectApply: Reflect.apply, RegExpPrototypeTest(t6, e) {
      return t6.test(e);
    }, SafeSet: Set, String, StringPrototypeSlice(t6, e, r) {
      return t6.slice(e, r);
    }, StringPrototypeToLowerCase(t6) {
      return t6.toLowerCase();
    }, StringPrototypeToUpperCase(t6) {
      return t6.toUpperCase();
    }, StringPrototypeTrim(t6) {
      return t6.trim();
    }, Symbol, SymbolFor: Symbol.for, SymbolAsyncIterator: Symbol.asyncIterator, SymbolHasInstance: Symbol.hasInstance, SymbolIterator: Symbol.iterator, SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"), SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"), TypedArrayPrototypeSet(t6, e, r) {
      return t6.set(e, r);
    }, Boolean, Uint8Array };
  });
  var ct = A((z_, ur) => {
    "use strict";
    var { AbortController: gs, AbortSignal: $u } = typeof self < "u" ? self : typeof window < "u" ? window : void 0;
    ur.exports = gs;
    ur.exports.AbortSignal = $u;
    ur.exports.default = gs;
  });
  var Ut = A((V_, hn) => {
    "use strict";
    var ht = typeof Reflect == "object" ? Reflect : null, ws = ht && typeof ht.apply == "function" ? ht.apply : function(e, r, n) {
      return Function.prototype.apply.call(e, r, n);
    }, fr;
    ht && typeof ht.ownKeys == "function" ? fr = ht.ownKeys : Object.getOwnPropertySymbols ? fr = function(e) {
      return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : fr = function(e) {
      return Object.getOwnPropertyNames(e);
    };
    function Du(t6) {
      console && console.warn && console.warn(t6);
    }
    var xs = Number.isNaN || function(e) {
      return e !== e;
    };
    function T() {
      T.init.call(this);
    }
    hn.exports = T;
    hn.exports.once = Gu;
    T.EventEmitter = T;
    T.prototype._events = void 0;
    T.prototype._eventsCount = 0;
    T.prototype._maxListeners = void 0;
    var ms = 10;
    function dr(t6) {
      if (typeof t6 != "function")
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t6);
    }
    Object.defineProperty(T, "defaultMaxListeners", { enumerable: true, get: function() {
      return ms;
    }, set: function(t6) {
      if (typeof t6 != "number" || t6 < 0 || xs(t6))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t6 + ".");
      ms = t6;
    } });
    T.init = function() {
      (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    };
    T.prototype.setMaxListeners = function(e) {
      if (typeof e != "number" || e < 0 || xs(e))
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
      return this._maxListeners = e, this;
    };
    function Ss(t6) {
      return t6._maxListeners === void 0 ? T.defaultMaxListeners : t6._maxListeners;
    }
    T.prototype.getMaxListeners = function() {
      return Ss(this);
    };
    T.prototype.emit = function(e) {
      for (var r = [], n = 1; n < arguments.length; n++)
        r.push(arguments[n]);
      var i = e === "error", s = this._events;
      if (s !== void 0)
        i = i && s.error === void 0;
      else if (!i)
        return false;
      if (i) {
        var o;
        if (r.length > 0 && (o = r[0]), o instanceof Error)
          throw o;
        var a = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
        throw a.context = o, a;
      }
      var l = s[e];
      if (l === void 0)
        return false;
      if (typeof l == "function")
        ws(l, this, r);
      else
        for (var u = l.length, d = Ts(l, u), n = 0; n < u; ++n)
          ws(d[n], this, r);
      return true;
    };
    function Es(t6, e, r, n) {
      var i, s, o;
      if (dr(r), s = t6._events, s === void 0 ? (s = t6._events = /* @__PURE__ */ Object.create(null), t6._eventsCount = 0) : (s.newListener !== void 0 && (t6.emit("newListener", e, r.listener ? r.listener : r), s = t6._events), o = s[e]), o === void 0)
        o = s[e] = r, ++t6._eventsCount;
      else if (typeof o == "function" ? o = s[e] = n ? [r, o] : [o, r] : n ? o.unshift(r) : o.push(r), i = Ss(t6), i > 0 && o.length > i && !o.warned) {
        o.warned = true;
        var a = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        a.name = "MaxListenersExceededWarning", a.emitter = t6, a.type = e, a.count = o.length, Du(a);
      }
      return t6;
    }
    T.prototype.addListener = function(e, r) {
      return Es(this, e, r, false);
    };
    T.prototype.on = T.prototype.addListener;
    T.prototype.prependListener = function(e, r) {
      return Es(this, e, r, true);
    };
    function qu() {
      if (!this.fired)
        return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function Rs(t6, e, r) {
      var n = { fired: false, wrapFn: void 0, target: t6, type: e, listener: r }, i = qu.bind(n);
      return i.listener = r, n.wrapFn = i, i;
    }
    T.prototype.once = function(e, r) {
      return dr(r), this.on(e, Rs(this, e, r)), this;
    };
    T.prototype.prependOnceListener = function(e, r) {
      return dr(r), this.prependListener(e, Rs(this, e, r)), this;
    };
    T.prototype.removeListener = function(e, r) {
      var n, i, s, o, a;
      if (dr(r), i = this._events, i === void 0)
        return this;
      if (n = i[e], n === void 0)
        return this;
      if (n === r || n.listener === r)
        --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || r));
      else if (typeof n != "function") {
        for (s = -1, o = n.length - 1; o >= 0; o--)
          if (n[o] === r || n[o].listener === r) {
            a = n[o].listener, s = o;
            break;
          }
        if (s < 0)
          return this;
        s === 0 ? n.shift() : Uu(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, a || r);
      }
      return this;
    };
    T.prototype.off = T.prototype.removeListener;
    T.prototype.removeAllListeners = function(e) {
      var r, n, i;
      if (n = this._events, n === void 0)
        return this;
      if (n.removeListener === void 0)
        return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
      if (arguments.length === 0) {
        var s = Object.keys(n), o;
        for (i = 0; i < s.length; ++i)
          o = s[i], o !== "removeListener" && this.removeAllListeners(o);
        return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
      }
      if (r = n[e], typeof r == "function")
        this.removeListener(e, r);
      else if (r !== void 0)
        for (i = r.length - 1; i >= 0; i--)
          this.removeListener(e, r[i]);
      return this;
    };
    function Is(t6, e, r) {
      var n = t6._events;
      if (n === void 0)
        return [];
      var i = n[e];
      return i === void 0 ? [] : typeof i == "function" ? r ? [i.listener || i] : [i] : r ? Wu(i) : Ts(i, i.length);
    }
    T.prototype.listeners = function(e) {
      return Is(this, e, true);
    };
    T.prototype.rawListeners = function(e) {
      return Is(this, e, false);
    };
    T.listenerCount = function(t6, e) {
      return typeof t6.listenerCount == "function" ? t6.listenerCount(e) : As.call(t6, e);
    };
    T.prototype.listenerCount = As;
    function As(t6) {
      var e = this._events;
      if (e !== void 0) {
        var r = e[t6];
        if (typeof r == "function")
          return 1;
        if (r !== void 0)
          return r.length;
      }
      return 0;
    }
    T.prototype.eventNames = function() {
      return this._eventsCount > 0 ? fr(this._events) : [];
    };
    function Ts(t6, e) {
      for (var r = new Array(e), n = 0; n < e; ++n)
        r[n] = t6[n];
      return r;
    }
    function Uu(t6, e) {
      for (; e + 1 < t6.length; e++)
        t6[e] = t6[e + 1];
      t6.pop();
    }
    function Wu(t6) {
      for (var e = new Array(t6.length), r = 0; r < e.length; ++r)
        e[r] = t6[r].listener || t6[r];
      return e;
    }
    function Gu(t6, e) {
      return new Promise(function(r, n) {
        function i(o) {
          t6.removeListener(e, s), n(o);
        }
        function s() {
          typeof t6.removeListener == "function" && t6.removeListener("error", i), r([].slice.call(arguments));
        }
        Ns(t6, e, s, { once: true }), e !== "error" && Hu(t6, i, { once: true });
      });
    }
    function Hu(t6, e, r) {
      typeof t6.on == "function" && Ns(t6, "error", e, r);
    }
    function Ns(t6, e, r, n) {
      if (typeof t6.on == "function")
        n.once ? t6.once(e, r) : t6.on(e, r);
      else if (typeof t6.addEventListener == "function")
        t6.addEventListener(e, function i(s) {
          n.once && t6.removeEventListener(e, i), r(s);
        });
      else
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t6);
    }
  });
  var Q = A((J_, _n) => {
    "use strict";
    var Qu = Ee(), { kResistStopPropagation: zu, SymbolDispose: Vu } = B(), Ju = globalThis.AbortSignal || ct().AbortSignal, Ku = globalThis.AbortController || ct().AbortController, Yu = Object.getPrototypeOf(async function() {
    }).constructor, ks = globalThis.Blob || Qu.Blob, Zu = typeof ks < "u" ? function(e) {
      return e instanceof ks;
    } : function(e) {
      return false;
    }, Ls = (t6, e) => {
      if (t6 !== void 0 && (t6 === null || typeof t6 != "object" || !("aborted" in t6)))
        throw new ERR_INVALID_ARG_TYPE(e, "AbortSignal", t6);
    }, Xu = (t6, e) => {
      if (typeof t6 != "function")
        throw new ERR_INVALID_ARG_TYPE(e, "Function", t6);
    }, pn = class extends Error {
      constructor(e) {
        if (!Array.isArray(e))
          throw new TypeError(`Expected input to be an Array, got ${typeof e}`);
        let r = "";
        for (let n = 0; n < e.length; n++)
          r += `    ${e[n].stack}
`;
        super(r), this.name = "AggregateError", this.errors = e;
      }
    };
    _n.exports = { AggregateError: pn, kEmptyObject: Object.freeze({}), once(t6) {
      let e = false;
      return function(...r) {
        e || (e = true, t6.apply(this, r));
      };
    }, createDeferredPromise: function() {
      let t6, e;
      return { promise: new Promise((n, i) => {
        t6 = n, e = i;
      }), resolve: t6, reject: e };
    }, promisify(t6) {
      return new Promise((e, r) => {
        t6((n, ...i) => n ? r(n) : e(...i));
      });
    }, debuglog() {
      return function() {
      };
    }, format(t6, ...e) {
      return t6.replace(/%([sdifj])/g, function(...[r, n]) {
        let i = e.shift();
        return n === "f" ? i.toFixed(6) : n === "j" ? JSON.stringify(i) : n === "s" && typeof i == "object" ? `${i.constructor !== Object ? i.constructor.name : ""} {}`.trim() : i.toString();
      });
    }, inspect(t6) {
      switch (typeof t6) {
        case "string":
          if (t6.includes("'"))
            if (t6.includes('"')) {
              if (!t6.includes("`") && !t6.includes("${"))
                return `\`${t6}\``;
            } else
              return `"${t6}"`;
          return `'${t6}'`;
        case "number":
          return isNaN(t6) ? "NaN" : Object.is(t6, -0) ? String(t6) : t6;
        case "bigint":
          return `${String(t6)}n`;
        case "boolean":
        case "undefined":
          return String(t6);
        case "object":
          return "{}";
      }
    }, types: { isAsyncFunction(t6) {
      return t6 instanceof Yu;
    }, isArrayBufferView(t6) {
      return ArrayBuffer.isView(t6);
    } }, isBlob: Zu, deprecate(t6, e) {
      return t6;
    }, addAbortListener: Ut().addAbortListener || function(e, r) {
      if (e === void 0)
        throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", e);
      Ls(e, "signal"), Xu(r, "listener");
      let n;
      return e.aborted ? queueMicrotask(() => r()) : (e.addEventListener("abort", r, { __proto__: null, once: true, [zu]: true }), n = () => {
        e.removeEventListener("abort", r);
      }), { __proto__: null, [Vu]() {
        var i;
        (i = n) === null || i === void 0 || i();
      } };
    }, AbortSignalAny: Ju.any || function(e) {
      if (e.length === 1)
        return e[0];
      let r = new Ku(), n = () => r.abort();
      return e.forEach((i) => {
        Ls(i, "signals"), i.addEventListener("abort", n, { once: true });
      }), r.signal.addEventListener("abort", () => {
        e.forEach((i) => i.removeEventListener("abort", n));
      }, { once: true }), r.signal;
    } };
    _n.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
  });
  var V = A((K_, Fs) => {
    "use strict";
    var { format: ef, inspect: cr, AggregateError: tf } = Q(), rf = globalThis.AggregateError || tf, nf = Symbol("kIsNodeError"), sf = ["string", "function", "number", "object", "Function", "Object", "boolean", "bigint", "symbol"], of = /^([A-Z][a-z0-9]*)+$/, af = "__node_internal_", hr = {};
    function Ve(t6, e) {
      if (!t6)
        throw new hr.ERR_INTERNAL_ASSERTION(e);
    }
    function vs(t6) {
      let e = "", r = t6.length, n = t6[0] === "-" ? 1 : 0;
      for (; r >= n + 4; r -= 3)
        e = `_${t6.slice(r - 3, r)}${e}`;
      return `${t6.slice(0, r)}${e}`;
    }
    function lf(t6, e, r) {
      if (typeof e == "function")
        return Ve(e.length <= r.length, `Code: ${t6}; The provided arguments length (${r.length}) does not match the required ones (${e.length}).`), e(...r);
      let n = (e.match(/%[dfijoOs]/g) || []).length;
      return Ve(n === r.length, `Code: ${t6}; The provided arguments length (${r.length}) does not match the required ones (${n}).`), r.length === 0 ? e : ef(e, ...r);
    }
    function U(t6, e, r) {
      r || (r = Error);
      class n extends r {
        constructor(...s) {
          super(lf(t6, e, s));
        }
        toString() {
          return `${this.name} [${t6}]: ${this.message}`;
        }
      }
      Object.defineProperties(n.prototype, { name: { value: r.name, writable: true, enumerable: false, configurable: true }, toString: { value() {
        return `${this.name} [${t6}]: ${this.message}`;
      }, writable: true, enumerable: false, configurable: true } }), n.prototype.code = t6, n.prototype[nf] = true, hr[t6] = n;
    }
    function Bs(t6) {
      let e = af + t6.name;
      return Object.defineProperty(t6, "name", { value: e }), t6;
    }
    function uf(t6, e) {
      if (t6 && e && t6 !== e) {
        if (Array.isArray(e.errors))
          return e.errors.push(t6), e;
        let r = new rf([e, t6], e.message);
        return r.code = e.code, r;
      }
      return t6 || e;
    }
    var bn = class extends Error {
      constructor(e = "The operation was aborted", r = void 0) {
        if (r !== void 0 && typeof r != "object")
          throw new hr.ERR_INVALID_ARG_TYPE("options", "Object", r);
        super(e, r), this.code = "ABORT_ERR", this.name = "AbortError";
      }
    };
    U("ERR_ASSERTION", "%s", Error);
    U("ERR_INVALID_ARG_TYPE", (t6, e, r) => {
      Ve(typeof t6 == "string", "'name' must be a string"), Array.isArray(e) || (e = [e]);
      let n = "The ";
      t6.endsWith(" argument") ? n += `${t6} ` : n += `"${t6}" ${t6.includes(".") ? "property" : "argument"} `, n += "must be ";
      let i = [], s = [], o = [];
      for (let l of e)
        Ve(typeof l == "string", "All expected entries have to be of type string"), sf.includes(l) ? i.push(l.toLowerCase()) : of.test(l) ? s.push(l) : (Ve(l !== "object", 'The value "object" should be written as "Object"'), o.push(l));
      if (s.length > 0) {
        let l = i.indexOf("object");
        l !== -1 && (i.splice(i, l, 1), s.push("Object"));
      }
      if (i.length > 0) {
        switch (i.length) {
          case 1:
            n += `of type ${i[0]}`;
            break;
          case 2:
            n += `one of type ${i[0]} or ${i[1]}`;
            break;
          default: {
            let l = i.pop();
            n += `one of type ${i.join(", ")}, or ${l}`;
          }
        }
        (s.length > 0 || o.length > 0) && (n += " or ");
      }
      if (s.length > 0) {
        switch (s.length) {
          case 1:
            n += `an instance of ${s[0]}`;
            break;
          case 2:
            n += `an instance of ${s[0]} or ${s[1]}`;
            break;
          default: {
            let l = s.pop();
            n += `an instance of ${s.join(", ")}, or ${l}`;
          }
        }
        o.length > 0 && (n += " or ");
      }
      switch (o.length) {
        case 0:
          break;
        case 1:
          o[0].toLowerCase() !== o[0] && (n += "an "), n += `${o[0]}`;
          break;
        case 2:
          n += `one of ${o[0]} or ${o[1]}`;
          break;
        default: {
          let l = o.pop();
          n += `one of ${o.join(", ")}, or ${l}`;
        }
      }
      if (r == null)
        n += `. Received ${r}`;
      else if (typeof r == "function" && r.name)
        n += `. Received function ${r.name}`;
      else if (typeof r == "object") {
        var a;
        if ((a = r.constructor) !== null && a !== void 0 && a.name)
          n += `. Received an instance of ${r.constructor.name}`;
        else {
          let l = cr(r, { depth: -1 });
          n += `. Received ${l}`;
        }
      } else {
        let l = cr(r, { colors: false });
        l.length > 25 && (l = `${l.slice(0, 25)}...`), n += `. Received type ${typeof r} (${l})`;
      }
      return n;
    }, TypeError);
    U("ERR_INVALID_ARG_VALUE", (t6, e, r = "is invalid") => {
      let n = cr(e);
      return n.length > 128 && (n = n.slice(0, 128) + "..."), `The ${t6.includes(".") ? "property" : "argument"} '${t6}' ${r}. Received ${n}`;
    }, TypeError);
    U("ERR_INVALID_RETURN_VALUE", (t6, e, r) => {
      var n;
      let i = r != null && (n = r.constructor) !== null && n !== void 0 && n.name ? `instance of ${r.constructor.name}` : `type ${typeof r}`;
      return `Expected ${t6} to be returned from the "${e}" function but got ${i}.`;
    }, TypeError);
    U("ERR_MISSING_ARGS", (...t6) => {
      Ve(t6.length > 0, "At least one arg needs to be specified");
      let e, r = t6.length;
      switch (t6 = (Array.isArray(t6) ? t6 : [t6]).map((n) => `"${n}"`).join(" or "), r) {
        case 1:
          e += `The ${t6[0]} argument`;
          break;
        case 2:
          e += `The ${t6[0]} and ${t6[1]} arguments`;
          break;
        default:
          {
            let n = t6.pop();
            e += `The ${t6.join(", ")}, and ${n} arguments`;
          }
          break;
      }
      return `${e} must be specified`;
    }, TypeError);
    U("ERR_OUT_OF_RANGE", (t6, e, r) => {
      Ve(e, 'Missing "range" argument');
      let n;
      return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? n = vs(String(r)) : typeof r == "bigint" ? (n = String(r), (r > 2n ** 32n || r < -(2n ** 32n)) && (n = vs(n)), n += "n") : n = cr(r), `The value of "${t6}" is out of range. It must be ${e}. Received ${n}`;
    }, RangeError);
    U("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
    U("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
    U("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
    U("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
    U("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
    U("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    U("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
    U("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
    U("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
    U("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
    U("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
    Fs.exports = { AbortError: bn, aggregateTwoErrors: Bs(uf), hideStackFrames: Bs, codes: hr };
  });
  var _t = A((Y_, Ws) => {
    "use strict";
    var { ArrayIsArray: gn, ArrayPrototypeIncludes: Cs, ArrayPrototypeJoin: Ms, ArrayPrototypeMap: ff, NumberIsInteger: wn, NumberIsNaN: df, NumberMAX_SAFE_INTEGER: cf, NumberMIN_SAFE_INTEGER: hf, NumberParseInt: pf, ObjectPrototypeHasOwnProperty: _f, RegExpPrototypeExec: $s, String: bf, StringPrototypeToUpperCase: yf, StringPrototypeTrim: gf } = B(), { hideStackFrames: te, codes: { ERR_SOCKET_BAD_PORT: wf, ERR_INVALID_ARG_TYPE: z, ERR_INVALID_ARG_VALUE: pt, ERR_OUT_OF_RANGE: Je, ERR_UNKNOWN_SIGNAL: js } } = V(), { normalizeEncoding: mf } = Q(), { isAsyncFunction: xf, isArrayBufferView: Sf } = Q().types, Ps = {};
    function Ef(t6) {
      return t6 === (t6 | 0);
    }
    function Rf(t6) {
      return t6 === t6 >>> 0;
    }
    var If = /^[0-7]+$/, Af = "must be a 32-bit unsigned integer or an octal string";
    function Tf(t6, e, r) {
      if (typeof t6 > "u" && (t6 = r), typeof t6 == "string") {
        if ($s(If, t6) === null)
          throw new pt(e, t6, Af);
        t6 = pf(t6, 8);
      }
      return Ds(t6, e), t6;
    }
    var Nf = te((t6, e, r = hf, n = cf) => {
      if (typeof t6 != "number")
        throw new z(e, "number", t6);
      if (!wn(t6))
        throw new Je(e, "an integer", t6);
      if (t6 < r || t6 > n)
        throw new Je(e, `>= ${r} && <= ${n}`, t6);
    }), kf = te((t6, e, r = -2147483648, n = 2147483647) => {
      if (typeof t6 != "number")
        throw new z(e, "number", t6);
      if (!wn(t6))
        throw new Je(e, "an integer", t6);
      if (t6 < r || t6 > n)
        throw new Je(e, `>= ${r} && <= ${n}`, t6);
    }), Ds = te((t6, e, r = false) => {
      if (typeof t6 != "number")
        throw new z(e, "number", t6);
      if (!wn(t6))
        throw new Je(e, "an integer", t6);
      let n = r ? 1 : 0, i = 4294967295;
      if (t6 < n || t6 > i)
        throw new Je(e, `>= ${n} && <= ${i}`, t6);
    });
    function mn(t6, e) {
      if (typeof t6 != "string")
        throw new z(e, "string", t6);
    }
    function Lf(t6, e, r = void 0, n) {
      if (typeof t6 != "number")
        throw new z(e, "number", t6);
      if (r != null && t6 < r || n != null && t6 > n || (r != null || n != null) && df(t6))
        throw new Je(e, `${r != null ? `>= ${r}` : ""}${r != null && n != null ? " && " : ""}${n != null ? `<= ${n}` : ""}`, t6);
    }
    var vf = te((t6, e, r) => {
      if (!Cs(r, t6)) {
        let i = "must be one of: " + Ms(ff(r, (s) => typeof s == "string" ? `'${s}'` : bf(s)), ", ");
        throw new pt(e, t6, i);
      }
    });
    function qs(t6, e) {
      if (typeof t6 != "boolean")
        throw new z(e, "boolean", t6);
    }
    function yn(t6, e, r) {
      return t6 == null || !_f(t6, e) ? r : t6[e];
    }
    var Bf = te((t6, e, r = null) => {
      let n = yn(r, "allowArray", false), i = yn(r, "allowFunction", false);
      if (!yn(r, "nullable", false) && t6 === null || !n && gn(t6) || typeof t6 != "object" && (!i || typeof t6 != "function"))
        throw new z(e, "Object", t6);
    }), Ff = te((t6, e) => {
      if (t6 != null && typeof t6 != "object" && typeof t6 != "function")
        throw new z(e, "a dictionary", t6);
    }), pr = te((t6, e, r = 0) => {
      if (!gn(t6))
        throw new z(e, "Array", t6);
      if (t6.length < r) {
        let n = `must be longer than ${r}`;
        throw new pt(e, t6, n);
      }
    });
    function jf(t6, e) {
      pr(t6, e);
      for (let r = 0; r < t6.length; r++)
        mn(t6[r], `${e}[${r}]`);
    }
    function Pf(t6, e) {
      pr(t6, e);
      for (let r = 0; r < t6.length; r++)
        qs(t6[r], `${e}[${r}]`);
    }
    function Of(t6, e) {
      pr(t6, e);
      for (let r = 0; r < t6.length; r++) {
        let n = t6[r], i = `${e}[${r}]`;
        if (n == null)
          throw new z(i, "AbortSignal", n);
        Us(n, i);
      }
    }
    function Cf(t6, e = "signal") {
      if (mn(t6, e), Ps[t6] === void 0)
        throw Ps[yf(t6)] !== void 0 ? new js(t6 + " (signals must use all capital letters)") : new js(t6);
    }
    var Mf = te((t6, e = "buffer") => {
      if (!Sf(t6))
        throw new z(e, ["Buffer", "TypedArray", "DataView"], t6);
    });
    function $f(t6, e) {
      let r = mf(e), n = t6.length;
      if (r === "hex" && n % 2 !== 0)
        throw new pt("encoding", e, `is invalid for data of length ${n}`);
    }
    function Df(t6, e = "Port", r = true) {
      if (typeof t6 != "number" && typeof t6 != "string" || typeof t6 == "string" && gf(t6).length === 0 || +t6 !== +t6 >>> 0 || t6 > 65535 || t6 === 0 && !r)
        throw new wf(e, t6, r);
      return t6 | 0;
    }
    var Us = te((t6, e) => {
      if (t6 !== void 0 && (t6 === null || typeof t6 != "object" || !("aborted" in t6)))
        throw new z(e, "AbortSignal", t6);
    }), qf = te((t6, e) => {
      if (typeof t6 != "function")
        throw new z(e, "Function", t6);
    }), Uf = te((t6, e) => {
      if (typeof t6 != "function" || xf(t6))
        throw new z(e, "Function", t6);
    }), Wf = te((t6, e) => {
      if (t6 !== void 0)
        throw new z(e, "undefined", t6);
    });
    function Gf(t6, e, r) {
      if (!Cs(r, t6))
        throw new z(e, `('${Ms(r, "|")}')`, t6);
    }
    var Hf = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
    function Os(t6, e) {
      if (typeof t6 > "u" || !$s(Hf, t6))
        throw new pt(e, t6, 'must be an array or string of format "</styles.css>; rel=preload; as=style"');
    }
    function Qf(t6) {
      if (typeof t6 == "string")
        return Os(t6, "hints"), t6;
      if (gn(t6)) {
        let e = t6.length, r = "";
        if (e === 0)
          return r;
        for (let n = 0; n < e; n++) {
          let i = t6[n];
          Os(i, "hints"), r += i, n !== e - 1 && (r += ", ");
        }
        return r;
      }
      throw new pt("hints", t6, 'must be an array or string of format "</styles.css>; rel=preload; as=style"');
    }
    Ws.exports = { isInt32: Ef, isUint32: Rf, parseFileMode: Tf, validateArray: pr, validateStringArray: jf, validateBooleanArray: Pf, validateAbortSignalArray: Of, validateBoolean: qs, validateBuffer: Mf, validateDictionary: Ff, validateEncoding: $f, validateFunction: qf, validateInt32: kf, validateInteger: Nf, validateNumber: Lf, validateObject: Bf, validateOneOf: vf, validatePlainFunction: Uf, validatePort: Df, validateSignalName: Cf, validateString: mn, validateUint32: Ds, validateUndefined: Wf, validateUnion: Gf, validateAbortSignal: Us, validateLinkHeaderValue: Qf };
  });
  var Pe = A((Z_, zs) => {
    var O = zs.exports = {}, ce, he;
    function xn() {
      throw new Error("setTimeout has not been defined");
    }
    function Sn() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        typeof setTimeout == "function" ? ce = setTimeout : ce = xn;
      } catch {
        ce = xn;
      }
      try {
        typeof clearTimeout == "function" ? he = clearTimeout : he = Sn;
      } catch {
        he = Sn;
      }
    })();
    function Gs(t6) {
      if (ce === setTimeout)
        return setTimeout(t6, 0);
      if ((ce === xn || !ce) && setTimeout)
        return ce = setTimeout, setTimeout(t6, 0);
      try {
        return ce(t6, 0);
      } catch {
        try {
          return ce.call(null, t6, 0);
        } catch {
          return ce.call(this, t6, 0);
        }
      }
    }
    function zf(t6) {
      if (he === clearTimeout)
        return clearTimeout(t6);
      if ((he === Sn || !he) && clearTimeout)
        return he = clearTimeout, clearTimeout(t6);
      try {
        return he(t6);
      } catch {
        try {
          return he.call(null, t6);
        } catch {
          return he.call(this, t6);
        }
      }
    }
    var Re = [], bt = false, Ke, _r = -1;
    function Vf() {
      !bt || !Ke || (bt = false, Ke.length ? Re = Ke.concat(Re) : _r = -1, Re.length && Hs());
    }
    function Hs() {
      if (!bt) {
        var t6 = Gs(Vf);
        bt = true;
        for (var e = Re.length; e; ) {
          for (Ke = Re, Re = []; ++_r < e; )
            Ke && Ke[_r].run();
          _r = -1, e = Re.length;
        }
        Ke = null, bt = false, zf(t6);
      }
    }
    O.nextTick = function(t6) {
      var e = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var r = 1; r < arguments.length; r++)
          e[r - 1] = arguments[r];
      Re.push(new Qs(t6, e)), Re.length === 1 && !bt && Gs(Hs);
    };
    function Qs(t6, e) {
      this.fun = t6, this.array = e;
    }
    Qs.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    O.title = "browser";
    O.browser = true;
    O.env = {};
    O.argv = [];
    O.version = "";
    O.versions = {};
    function Ie() {
    }
    O.on = Ie;
    O.addListener = Ie;
    O.once = Ie;
    O.off = Ie;
    O.removeListener = Ie;
    O.removeAllListeners = Ie;
    O.emit = Ie;
    O.prependListener = Ie;
    O.prependOnceListener = Ie;
    O.listeners = function(t6) {
      return [];
    };
    O.binding = function(t6) {
      throw new Error("process.binding is not supported");
    };
    O.cwd = function() {
      return "/";
    };
    O.chdir = function(t6) {
      throw new Error("process.chdir is not supported");
    };
    O.umask = function() {
      return 0;
    };
  });
  var _e = A((X_, lo) => {
    "use strict";
    var { SymbolAsyncIterator: Vs, SymbolIterator: Js, SymbolFor: Ye } = B(), Ks = Ye("nodejs.stream.destroyed"), Ys = Ye("nodejs.stream.errored"), En = Ye("nodejs.stream.readable"), Rn = Ye("nodejs.stream.writable"), Zs = Ye("nodejs.stream.disturbed"), Jf = Ye("nodejs.webstream.isClosedPromise"), Kf = Ye("nodejs.webstream.controllerErrorFunction");
    function br(t6, e = false) {
      var r;
      return !!(t6 && typeof t6.pipe == "function" && typeof t6.on == "function" && (!e || typeof t6.pause == "function" && typeof t6.resume == "function") && (!t6._writableState || ((r = t6._readableState) === null || r === void 0 ? void 0 : r.readable) !== false) && (!t6._writableState || t6._readableState));
    }
    function yr(t6) {
      var e;
      return !!(t6 && typeof t6.write == "function" && typeof t6.on == "function" && (!t6._readableState || ((e = t6._writableState) === null || e === void 0 ? void 0 : e.writable) !== false));
    }
    function Yf(t6) {
      return !!(t6 && typeof t6.pipe == "function" && t6._readableState && typeof t6.on == "function" && typeof t6.write == "function");
    }
    function pe(t6) {
      return t6 && (t6._readableState || t6._writableState || typeof t6.write == "function" && typeof t6.on == "function" || typeof t6.pipe == "function" && typeof t6.on == "function");
    }
    function Xs(t6) {
      return !!(t6 && !pe(t6) && typeof t6.pipeThrough == "function" && typeof t6.getReader == "function" && typeof t6.cancel == "function");
    }
    function eo(t6) {
      return !!(t6 && !pe(t6) && typeof t6.getWriter == "function" && typeof t6.abort == "function");
    }
    function to(t6) {
      return !!(t6 && !pe(t6) && typeof t6.readable == "object" && typeof t6.writable == "object");
    }
    function Zf(t6) {
      return Xs(t6) || eo(t6) || to(t6);
    }
    function Xf(t6, e) {
      return t6 == null ? false : e === true ? typeof t6[Vs] == "function" : e === false ? typeof t6[Js] == "function" : typeof t6[Vs] == "function" || typeof t6[Js] == "function";
    }
    function gr(t6) {
      if (!pe(t6))
        return null;
      let e = t6._writableState, r = t6._readableState, n = e || r;
      return !!(t6.destroyed || t6[Ks] || n != null && n.destroyed);
    }
    function ro(t6) {
      if (!yr(t6))
        return null;
      if (t6.writableEnded === true)
        return true;
      let e = t6._writableState;
      return e != null && e.errored ? false : typeof e?.ended != "boolean" ? null : e.ended;
    }
    function ed(t6, e) {
      if (!yr(t6))
        return null;
      if (t6.writableFinished === true)
        return true;
      let r = t6._writableState;
      return r != null && r.errored ? false : typeof r?.finished != "boolean" ? null : !!(r.finished || e === false && r.ended === true && r.length === 0);
    }
    function td(t6) {
      if (!br(t6))
        return null;
      if (t6.readableEnded === true)
        return true;
      let e = t6._readableState;
      return !e || e.errored ? false : typeof e?.ended != "boolean" ? null : e.ended;
    }
    function no(t6, e) {
      if (!br(t6))
        return null;
      let r = t6._readableState;
      return r != null && r.errored ? false : typeof r?.endEmitted != "boolean" ? null : !!(r.endEmitted || e === false && r.ended === true && r.length === 0);
    }
    function io(t6) {
      return t6 && t6[En] != null ? t6[En] : typeof t6?.readable != "boolean" ? null : gr(t6) ? false : br(t6) && t6.readable && !no(t6);
    }
    function so(t6) {
      return t6 && t6[Rn] != null ? t6[Rn] : typeof t6?.writable != "boolean" ? null : gr(t6) ? false : yr(t6) && t6.writable && !ro(t6);
    }
    function rd(t6, e) {
      return pe(t6) ? gr(t6) ? true : !(e?.readable !== false && io(t6) || e?.writable !== false && so(t6)) : null;
    }
    function nd(t6) {
      var e, r;
      return pe(t6) ? t6.writableErrored ? t6.writableErrored : (e = (r = t6._writableState) === null || r === void 0 ? void 0 : r.errored) !== null && e !== void 0 ? e : null : null;
    }
    function id(t6) {
      var e, r;
      return pe(t6) ? t6.readableErrored ? t6.readableErrored : (e = (r = t6._readableState) === null || r === void 0 ? void 0 : r.errored) !== null && e !== void 0 ? e : null : null;
    }
    function sd(t6) {
      if (!pe(t6))
        return null;
      if (typeof t6.closed == "boolean")
        return t6.closed;
      let e = t6._writableState, r = t6._readableState;
      return typeof e?.closed == "boolean" || typeof r?.closed == "boolean" ? e?.closed || r?.closed : typeof t6._closed == "boolean" && oo(t6) ? t6._closed : null;
    }
    function oo(t6) {
      return typeof t6._closed == "boolean" && typeof t6._defaultKeepAlive == "boolean" && typeof t6._removedConnection == "boolean" && typeof t6._removedContLen == "boolean";
    }
    function ao(t6) {
      return typeof t6._sent100 == "boolean" && oo(t6);
    }
    function od(t6) {
      var e;
      return typeof t6._consuming == "boolean" && typeof t6._dumped == "boolean" && ((e = t6.req) === null || e === void 0 ? void 0 : e.upgradeOrConnect) === void 0;
    }
    function ad(t6) {
      if (!pe(t6))
        return null;
      let e = t6._writableState, r = t6._readableState, n = e || r;
      return !n && ao(t6) || !!(n && n.autoDestroy && n.emitClose && n.closed === false);
    }
    function ld(t6) {
      var e;
      return !!(t6 && ((e = t6[Zs]) !== null && e !== void 0 ? e : t6.readableDidRead || t6.readableAborted));
    }
    function ud(t6) {
      var e, r, n, i, s, o, a, l, u, d;
      return !!(t6 && ((e = (r = (n = (i = (s = (o = t6[Ys]) !== null && o !== void 0 ? o : t6.readableErrored) !== null && s !== void 0 ? s : t6.writableErrored) !== null && i !== void 0 ? i : (a = t6._readableState) === null || a === void 0 ? void 0 : a.errorEmitted) !== null && n !== void 0 ? n : (l = t6._writableState) === null || l === void 0 ? void 0 : l.errorEmitted) !== null && r !== void 0 ? r : (u = t6._readableState) === null || u === void 0 ? void 0 : u.errored) !== null && e !== void 0 ? e : !((d = t6._writableState) === null || d === void 0) && d.errored));
    }
    lo.exports = { isDestroyed: gr, kIsDestroyed: Ks, isDisturbed: ld, kIsDisturbed: Zs, isErrored: ud, kIsErrored: Ys, isReadable: io, kIsReadable: En, kIsClosedPromise: Jf, kControllerErrorFunction: Kf, kIsWritable: Rn, isClosed: sd, isDuplexNodeStream: Yf, isFinished: rd, isIterable: Xf, isReadableNodeStream: br, isReadableStream: Xs, isReadableEnded: td, isReadableFinished: no, isReadableErrored: id, isNodeStream: pe, isWebStream: Zf, isWritable: so, isWritableNodeStream: yr, isWritableStream: eo, isWritableEnded: ro, isWritableFinished: ed, isWritableErrored: nd, isServerRequest: od, isServerResponse: ao, willEmitClose: ad, isTransformStream: to };
  });
  var Ae = A((eb, kn) => {
    var Oe = Pe(), { AbortError: go, codes: fd } = V(), { ERR_INVALID_ARG_TYPE: dd, ERR_STREAM_PREMATURE_CLOSE: uo } = fd, { kEmptyObject: An, once: Tn } = Q(), { validateAbortSignal: cd, validateFunction: hd, validateObject: pd, validateBoolean: _d } = _t(), { Promise: bd, PromisePrototypeThen: yd, SymbolDispose: wo } = B(), { isClosed: gd, isReadable: fo, isReadableNodeStream: In, isReadableStream: wd, isReadableFinished: co, isReadableErrored: ho, isWritable: po, isWritableNodeStream: _o, isWritableStream: md, isWritableFinished: bo, isWritableErrored: yo, isNodeStream: xd, willEmitClose: Sd, kIsClosedPromise: Ed } = _e(), yt;
    function Rd(t6) {
      return t6.setHeader && typeof t6.abort == "function";
    }
    var Nn = () => {
    };
    function mo(t6, e, r) {
      var n, i;
      if (arguments.length === 2 ? (r = e, e = An) : e == null ? e = An : pd(e, "options"), hd(r, "callback"), cd(e.signal, "options.signal"), r = Tn(r), wd(t6) || md(t6))
        return Id(t6, e, r);
      if (!xd(t6))
        throw new dd("stream", ["ReadableStream", "WritableStream", "Stream"], t6);
      let s = (n = e.readable) !== null && n !== void 0 ? n : In(t6), o = (i = e.writable) !== null && i !== void 0 ? i : _o(t6), a = t6._writableState, l = t6._readableState, u = () => {
        t6.writable || b();
      }, d = Sd(t6) && In(t6) === s && _o(t6) === o, f = bo(t6, false), b = () => {
        f = true, t6.destroyed && (d = false), !(d && (!t6.readable || s)) && (!s || _) && r.call(t6);
      }, _ = co(t6, false), y = () => {
        _ = true, t6.destroyed && (d = false), !(d && (!t6.writable || o)) && (!o || f) && r.call(t6);
      }, g = (j) => {
        r.call(t6, j);
      }, m = gd(t6), w = () => {
        m = true;
        let j = yo(t6) || ho(t6);
        if (j && typeof j != "boolean")
          return r.call(t6, j);
        if (s && !_ && In(t6, true) && !co(t6, false))
          return r.call(t6, new uo());
        if (o && !f && !bo(t6, false))
          return r.call(t6, new uo());
        r.call(t6);
      }, R = () => {
        m = true;
        let j = yo(t6) || ho(t6);
        if (j && typeof j != "boolean")
          return r.call(t6, j);
        r.call(t6);
      }, N = () => {
        t6.req.on("finish", b);
      };
      Rd(t6) ? (t6.on("complete", b), d || t6.on("abort", w), t6.req ? N() : t6.on("request", N)) : o && !a && (t6.on("end", u), t6.on("close", u)), !d && typeof t6.aborted == "boolean" && t6.on("aborted", w), t6.on("end", y), t6.on("finish", b), e.error !== false && t6.on("error", g), t6.on("close", w), m ? Oe.nextTick(w) : a != null && a.errorEmitted || l != null && l.errorEmitted ? d || Oe.nextTick(R) : (!s && (!d || fo(t6)) && (f || po(t6) === false) || !o && (!d || po(t6)) && (_ || fo(t6) === false) || l && t6.req && t6.aborted) && Oe.nextTick(R);
      let S = () => {
        r = Nn, t6.removeListener("aborted", w), t6.removeListener("complete", b), t6.removeListener("abort", w), t6.removeListener("request", N), t6.req && t6.req.removeListener("finish", b), t6.removeListener("end", u), t6.removeListener("close", u), t6.removeListener("finish", b), t6.removeListener("end", y), t6.removeListener("error", g), t6.removeListener("close", w);
      };
      if (e.signal && !m) {
        let j = () => {
          let me = r;
          S(), me.call(t6, new go(void 0, { cause: e.signal.reason }));
        };
        if (e.signal.aborted)
          Oe.nextTick(j);
        else {
          yt = yt || Q().addAbortListener;
          let me = yt(e.signal, j), J = r;
          r = Tn((...Le) => {
            me[wo](), J.apply(t6, Le);
          });
        }
      }
      return S;
    }
    function Id(t6, e, r) {
      let n = false, i = Nn;
      if (e.signal)
        if (i = () => {
          n = true, r.call(t6, new go(void 0, { cause: e.signal.reason }));
        }, e.signal.aborted)
          Oe.nextTick(i);
        else {
          yt = yt || Q().addAbortListener;
          let o = yt(e.signal, i), a = r;
          r = Tn((...l) => {
            o[wo](), a.apply(t6, l);
          });
        }
      let s = (...o) => {
        n || Oe.nextTick(() => r.apply(t6, o));
      };
      return yd(t6[Ed].promise, s, s), Nn;
    }
    function Ad(t6, e) {
      var r;
      let n = false;
      return e === null && (e = An), (r = e) !== null && r !== void 0 && r.cleanup && (_d(e.cleanup, "cleanup"), n = e.cleanup), new bd((i, s) => {
        let o = mo(t6, e, (a) => {
          n && o(), a ? s(a) : i();
        });
      });
    }
    kn.exports = mo;
    kn.exports.finished = Ad;
  });
  var Ze = A((tb, No) => {
    "use strict";
    var be = Pe(), { aggregateTwoErrors: Td, codes: { ERR_MULTIPLE_CALLBACK: Nd }, AbortError: kd } = V(), { Symbol: Eo } = B(), { kIsDestroyed: Ld, isDestroyed: vd, isFinished: Bd, isServerRequest: Fd } = _e(), Ro = Eo("kDestroy"), Ln = Eo("kConstruct");
    function Io(t6, e, r) {
      t6 && (t6.stack, e && !e.errored && (e.errored = t6), r && !r.errored && (r.errored = t6));
    }
    function jd(t6, e) {
      let r = this._readableState, n = this._writableState, i = n || r;
      return n != null && n.destroyed || r != null && r.destroyed ? (typeof e == "function" && e(), this) : (Io(t6, n, r), n && (n.destroyed = true), r && (r.destroyed = true), i.constructed ? xo(this, t6, e) : this.once(Ro, function(s) {
        xo(this, Td(s, t6), e);
      }), this);
    }
    function xo(t6, e, r) {
      let n = false;
      function i(s) {
        if (n)
          return;
        n = true;
        let o = t6._readableState, a = t6._writableState;
        Io(s, a, o), a && (a.closed = true), o && (o.closed = true), typeof r == "function" && r(s), s ? be.nextTick(Pd, t6, s) : be.nextTick(Ao, t6);
      }
      try {
        t6._destroy(e || null, i);
      } catch (s) {
        i(s);
      }
    }
    function Pd(t6, e) {
      vn(t6, e), Ao(t6);
    }
    function Ao(t6) {
      let e = t6._readableState, r = t6._writableState;
      r && (r.closeEmitted = true), e && (e.closeEmitted = true), (r != null && r.emitClose || e != null && e.emitClose) && t6.emit("close");
    }
    function vn(t6, e) {
      let r = t6._readableState, n = t6._writableState;
      n != null && n.errorEmitted || r != null && r.errorEmitted || (n && (n.errorEmitted = true), r && (r.errorEmitted = true), t6.emit("error", e));
    }
    function Od() {
      let t6 = this._readableState, e = this._writableState;
      t6 && (t6.constructed = true, t6.closed = false, t6.closeEmitted = false, t6.destroyed = false, t6.errored = null, t6.errorEmitted = false, t6.reading = false, t6.ended = t6.readable === false, t6.endEmitted = t6.readable === false), e && (e.constructed = true, e.destroyed = false, e.closed = false, e.closeEmitted = false, e.errored = null, e.errorEmitted = false, e.finalCalled = false, e.prefinished = false, e.ended = e.writable === false, e.ending = e.writable === false, e.finished = e.writable === false);
    }
    function Bn(t6, e, r) {
      let n = t6._readableState, i = t6._writableState;
      if (i != null && i.destroyed || n != null && n.destroyed)
        return this;
      n != null && n.autoDestroy || i != null && i.autoDestroy ? t6.destroy(e) : e && (e.stack, i && !i.errored && (i.errored = e), n && !n.errored && (n.errored = e), r ? be.nextTick(vn, t6, e) : vn(t6, e));
    }
    function Cd(t6, e) {
      if (typeof t6._construct != "function")
        return;
      let r = t6._readableState, n = t6._writableState;
      r && (r.constructed = false), n && (n.constructed = false), t6.once(Ln, e), !(t6.listenerCount(Ln) > 1) && be.nextTick(Md, t6);
    }
    function Md(t6) {
      let e = false;
      function r(n) {
        if (e) {
          Bn(t6, n ?? new Nd());
          return;
        }
        e = true;
        let i = t6._readableState, s = t6._writableState, o = s || i;
        i && (i.constructed = true), s && (s.constructed = true), o.destroyed ? t6.emit(Ro, n) : n ? Bn(t6, n, true) : be.nextTick($d, t6);
      }
      try {
        t6._construct((n) => {
          be.nextTick(r, n);
        });
      } catch (n) {
        be.nextTick(r, n);
      }
    }
    function $d(t6) {
      t6.emit(Ln);
    }
    function So(t6) {
      return t6?.setHeader && typeof t6.abort == "function";
    }
    function To(t6) {
      t6.emit("close");
    }
    function Dd(t6, e) {
      t6.emit("error", e), be.nextTick(To, t6);
    }
    function qd(t6, e) {
      !t6 || vd(t6) || (!e && !Bd(t6) && (e = new kd()), Fd(t6) ? (t6.socket = null, t6.destroy(e)) : So(t6) ? t6.abort() : So(t6.req) ? t6.req.abort() : typeof t6.destroy == "function" ? t6.destroy(e) : typeof t6.close == "function" ? t6.close() : e ? be.nextTick(Dd, t6, e) : be.nextTick(To, t6), t6.destroyed || (t6[Ld] = true));
    }
    No.exports = { construct: Cd, destroyer: qd, destroy: jd, undestroy: Od, errorOrDestroy: Bn };
  });
  var xr = A((rb, Lo) => {
    "use strict";
    var { ArrayIsArray: Ud, ObjectSetPrototypeOf: ko } = B(), { EventEmitter: wr } = Ut();
    function mr(t6) {
      wr.call(this, t6);
    }
    ko(mr.prototype, wr.prototype);
    ko(mr, wr);
    mr.prototype.pipe = function(t6, e) {
      let r = this;
      function n(d) {
        t6.writable && t6.write(d) === false && r.pause && r.pause();
      }
      r.on("data", n);
      function i() {
        r.readable && r.resume && r.resume();
      }
      t6.on("drain", i), !t6._isStdio && (!e || e.end !== false) && (r.on("end", o), r.on("close", a));
      let s = false;
      function o() {
        s || (s = true, t6.end());
      }
      function a() {
        s || (s = true, typeof t6.destroy == "function" && t6.destroy());
      }
      function l(d) {
        u(), wr.listenerCount(this, "error") === 0 && this.emit("error", d);
      }
      Fn(r, "error", l), Fn(t6, "error", l);
      function u() {
        r.removeListener("data", n), t6.removeListener("drain", i), r.removeListener("end", o), r.removeListener("close", a), r.removeListener("error", l), t6.removeListener("error", l), r.removeListener("end", u), r.removeListener("close", u), t6.removeListener("close", u);
      }
      return r.on("end", u), r.on("close", u), t6.on("close", u), t6.emit("pipe", r), t6;
    };
    function Fn(t6, e, r) {
      if (typeof t6.prependListener == "function")
        return t6.prependListener(e, r);
      !t6._events || !t6._events[e] ? t6.on(e, r) : Ud(t6._events[e]) ? t6._events[e].unshift(r) : t6._events[e] = [r, t6._events[e]];
    }
    Lo.exports = { Stream: mr, prependListener: Fn };
  });
  var Wt = A((nb, Sr) => {
    "use strict";
    var { SymbolDispose: Wd } = B(), { AbortError: vo, codes: Gd } = V(), { isNodeStream: Bo, isWebStream: Hd, kControllerErrorFunction: Qd } = _e(), zd = Ae(), { ERR_INVALID_ARG_TYPE: Fo } = Gd, jn, Vd = (t6, e) => {
      if (typeof t6 != "object" || !("aborted" in t6))
        throw new Fo(e, "AbortSignal", t6);
    };
    Sr.exports.addAbortSignal = function(e, r) {
      if (Vd(e, "signal"), !Bo(r) && !Hd(r))
        throw new Fo("stream", ["ReadableStream", "WritableStream", "Stream"], r);
      return Sr.exports.addAbortSignalNoValidate(e, r);
    };
    Sr.exports.addAbortSignalNoValidate = function(t6, e) {
      if (typeof t6 != "object" || !("aborted" in t6))
        return e;
      let r = Bo(e) ? () => {
        e.destroy(new vo(void 0, { cause: t6.reason }));
      } : () => {
        e[Qd](new vo(void 0, { cause: t6.reason }));
      };
      if (t6.aborted)
        r();
      else {
        jn = jn || Q().addAbortListener;
        let n = jn(t6, r);
        zd(e, n[Wd]);
      }
      return e;
    };
  });
  var Oo = A((sb, Po) => {
    "use strict";
    var { StringPrototypeSlice: jo, SymbolIterator: Jd, TypedArrayPrototypeSet: Er, Uint8Array: Kd } = B(), { Buffer: Pn } = Ee(), { inspect: Yd } = Q();
    Po.exports = class {
      constructor() {
        this.head = null, this.tail = null, this.length = 0;
      }
      push(e) {
        let r = { data: e, next: null };
        this.length > 0 ? this.tail.next = r : this.head = r, this.tail = r, ++this.length;
      }
      unshift(e) {
        let r = { data: e, next: this.head };
        this.length === 0 && (this.tail = r), this.head = r, ++this.length;
      }
      shift() {
        if (this.length === 0)
          return;
        let e = this.head.data;
        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
      }
      clear() {
        this.head = this.tail = null, this.length = 0;
      }
      join(e) {
        if (this.length === 0)
          return "";
        let r = this.head, n = "" + r.data;
        for (; (r = r.next) !== null; )
          n += e + r.data;
        return n;
      }
      concat(e) {
        if (this.length === 0)
          return Pn.alloc(0);
        let r = Pn.allocUnsafe(e >>> 0), n = this.head, i = 0;
        for (; n; )
          Er(r, n.data, i), i += n.data.length, n = n.next;
        return r;
      }
      consume(e, r) {
        let n = this.head.data;
        if (e < n.length) {
          let i = n.slice(0, e);
          return this.head.data = n.slice(e), i;
        }
        return e === n.length ? this.shift() : r ? this._getString(e) : this._getBuffer(e);
      }
      first() {
        return this.head.data;
      }
      *[Jd]() {
        for (let e = this.head; e; e = e.next)
          yield e.data;
      }
      _getString(e) {
        let r = "", n = this.head, i = 0;
        do {
          let s = n.data;
          if (e > s.length)
            r += s, e -= s.length;
          else {
            e === s.length ? (r += s, ++i, n.next ? this.head = n.next : this.head = this.tail = null) : (r += jo(s, 0, e), this.head = n, n.data = jo(s, e));
            break;
          }
          ++i;
        } while ((n = n.next) !== null);
        return this.length -= i, r;
      }
      _getBuffer(e) {
        let r = Pn.allocUnsafe(e), n = e, i = this.head, s = 0;
        do {
          let o = i.data;
          if (e > o.length)
            Er(r, o, n - e), e -= o.length;
          else {
            e === o.length ? (Er(r, o, n - e), ++s, i.next ? this.head = i.next : this.head = this.tail = null) : (Er(r, new Kd(o.buffer, o.byteOffset, e), n - e), this.head = i, i.data = o.slice(e));
            break;
          }
          ++s;
        } while ((i = i.next) !== null);
        return this.length -= s, r;
      }
      [Symbol.for("nodejs.util.inspect.custom")](e, r) {
        return Yd(this, { ...r, depth: 0, customInspect: false });
      }
    };
  });
  var Gt = A((ob, Do) => {
    "use strict";
    var { MathFloor: Zd, NumberIsInteger: Xd } = B(), { validateInteger: ec } = _t(), { ERR_INVALID_ARG_VALUE: tc } = V().codes, Co = 16 * 1024, Mo = 16;
    function rc(t6, e, r) {
      return t6.highWaterMark != null ? t6.highWaterMark : e ? t6[r] : null;
    }
    function $o(t6) {
      return t6 ? Mo : Co;
    }
    function nc(t6, e) {
      ec(e, "value", 0), t6 ? Mo = e : Co = e;
    }
    function ic(t6, e, r, n) {
      let i = rc(e, n, r);
      if (i != null) {
        if (!Xd(i) || i < 0) {
          let s = n ? `options.${r}` : "options.highWaterMark";
          throw new tc(s, i);
        }
        return Zd(i);
      }
      return $o(t6.objectMode);
    }
    Do.exports = { getHighWaterMark: ic, getDefaultHighWaterMark: $o, setDefaultHighWaterMark: nc };
  });
  var Wo = A((On, Uo) => {
    var Rr = Ee(), ye = Rr.Buffer;
    function qo(t6, e) {
      for (var r in t6)
        e[r] = t6[r];
    }
    ye.from && ye.alloc && ye.allocUnsafe && ye.allocUnsafeSlow ? Uo.exports = Rr : (qo(Rr, On), On.Buffer = Xe);
    function Xe(t6, e, r) {
      return ye(t6, e, r);
    }
    Xe.prototype = Object.create(ye.prototype);
    qo(ye, Xe);
    Xe.from = function(t6, e, r) {
      if (typeof t6 == "number")
        throw new TypeError("Argument must not be a number");
      return ye(t6, e, r);
    };
    Xe.alloc = function(t6, e, r) {
      if (typeof t6 != "number")
        throw new TypeError("Argument must be a number");
      var n = ye(t6);
      return e !== void 0 ? typeof r == "string" ? n.fill(e, r) : n.fill(e) : n.fill(0), n;
    };
    Xe.allocUnsafe = function(t6) {
      if (typeof t6 != "number")
        throw new TypeError("Argument must be a number");
      return ye(t6);
    };
    Xe.allocUnsafeSlow = function(t6) {
      if (typeof t6 != "number")
        throw new TypeError("Argument must be a number");
      return Rr.SlowBuffer(t6);
    };
  });
  var Qo = A((Ho) => {
    "use strict";
    var Mn = Wo().Buffer, Go = Mn.isEncoding || function(t6) {
      switch (t6 = "" + t6, t6 && t6.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function sc(t6) {
      if (!t6)
        return "utf8";
      for (var e; ; )
        switch (t6) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return t6;
          default:
            if (e)
              return;
            t6 = ("" + t6).toLowerCase(), e = true;
        }
    }
    function oc(t6) {
      var e = sc(t6);
      if (typeof e != "string" && (Mn.isEncoding === Go || !Go(t6)))
        throw new Error("Unknown encoding: " + t6);
      return e || t6;
    }
    Ho.StringDecoder = Ht;
    function Ht(t6) {
      this.encoding = oc(t6);
      var e;
      switch (this.encoding) {
        case "utf16le":
          this.text = cc, this.end = hc, e = 4;
          break;
        case "utf8":
          this.fillLast = uc, e = 4;
          break;
        case "base64":
          this.text = pc, this.end = _c, e = 3;
          break;
        default:
          this.write = bc, this.end = yc;
          return;
      }
      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Mn.allocUnsafe(e);
    }
    Ht.prototype.write = function(t6) {
      if (t6.length === 0)
        return "";
      var e, r;
      if (this.lastNeed) {
        if (e = this.fillLast(t6), e === void 0)
          return "";
        r = this.lastNeed, this.lastNeed = 0;
      } else
        r = 0;
      return r < t6.length ? e ? e + this.text(t6, r) : this.text(t6, r) : e || "";
    };
    Ht.prototype.end = dc;
    Ht.prototype.text = fc;
    Ht.prototype.fillLast = function(t6) {
      if (this.lastNeed <= t6.length)
        return t6.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      t6.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t6.length), this.lastNeed -= t6.length;
    };
    function Cn(t6) {
      return t6 <= 127 ? 0 : t6 >> 5 === 6 ? 2 : t6 >> 4 === 14 ? 3 : t6 >> 3 === 30 ? 4 : t6 >> 6 === 2 ? -1 : -2;
    }
    function ac(t6, e, r) {
      var n = e.length - 1;
      if (n < r)
        return 0;
      var i = Cn(e[n]);
      return i >= 0 ? (i > 0 && (t6.lastNeed = i - 1), i) : --n < r || i === -2 ? 0 : (i = Cn(e[n]), i >= 0 ? (i > 0 && (t6.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : (i = Cn(e[n]), i >= 0 ? (i > 0 && (i === 2 ? i = 0 : t6.lastNeed = i - 3), i) : 0));
    }
    function lc(t6, e, r) {
      if ((e[0] & 192) !== 128)
        return t6.lastNeed = 0, "\uFFFD";
      if (t6.lastNeed > 1 && e.length > 1) {
        if ((e[1] & 192) !== 128)
          return t6.lastNeed = 1, "\uFFFD";
        if (t6.lastNeed > 2 && e.length > 2 && (e[2] & 192) !== 128)
          return t6.lastNeed = 2, "\uFFFD";
      }
    }
    function uc(t6) {
      var e = this.lastTotal - this.lastNeed, r = lc(this, t6, e);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= t6.length)
        return t6.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      t6.copy(this.lastChar, e, 0, t6.length), this.lastNeed -= t6.length;
    }
    function fc(t6, e) {
      var r = ac(this, t6, e);
      if (!this.lastNeed)
        return t6.toString("utf8", e);
      this.lastTotal = r;
      var n = t6.length - (r - this.lastNeed);
      return t6.copy(this.lastChar, 0, n), t6.toString("utf8", e, n);
    }
    function dc(t6) {
      var e = t6 && t6.length ? this.write(t6) : "";
      return this.lastNeed ? e + "\uFFFD" : e;
    }
    function cc(t6, e) {
      if ((t6.length - e) % 2 === 0) {
        var r = t6.toString("utf16le", e);
        if (r) {
          var n = r.charCodeAt(r.length - 1);
          if (n >= 55296 && n <= 56319)
            return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t6[t6.length - 2], this.lastChar[1] = t6[t6.length - 1], r.slice(0, -1);
        }
        return r;
      }
      return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t6[t6.length - 1], t6.toString("utf16le", e, t6.length - 1);
    }
    function hc(t6) {
      var e = t6 && t6.length ? this.write(t6) : "";
      if (this.lastNeed) {
        var r = this.lastTotal - this.lastNeed;
        return e + this.lastChar.toString("utf16le", 0, r);
      }
      return e;
    }
    function pc(t6, e) {
      var r = (t6.length - e) % 3;
      return r === 0 ? t6.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = t6[t6.length - 1] : (this.lastChar[0] = t6[t6.length - 2], this.lastChar[1] = t6[t6.length - 1]), t6.toString("base64", e, t6.length - r));
    }
    function _c(t6) {
      var e = t6 && t6.length ? this.write(t6) : "";
      return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
    }
    function bc(t6) {
      return t6.toString(this.encoding);
    }
    function yc(t6) {
      return t6 && t6.length ? this.write(t6) : "";
    }
  });
  var $n = A((lb, Ko) => {
    "use strict";
    var zo = Pe(), { PromisePrototypeThen: gc, SymbolAsyncIterator: Vo, SymbolIterator: Jo } = B(), { Buffer: wc } = Ee(), { ERR_INVALID_ARG_TYPE: mc, ERR_STREAM_NULL_VALUES: xc } = V().codes;
    function Sc(t6, e, r) {
      let n;
      if (typeof e == "string" || e instanceof wc)
        return new t6({ objectMode: true, ...r, read() {
          this.push(e), this.push(null);
        } });
      let i;
      if (e && e[Vo])
        i = true, n = e[Vo]();
      else if (e && e[Jo])
        i = false, n = e[Jo]();
      else
        throw new mc("iterable", ["Iterable"], e);
      let s = new t6({ objectMode: true, highWaterMark: 1, ...r }), o = false;
      s._read = function() {
        o || (o = true, l());
      }, s._destroy = function(u, d) {
        gc(a(u), () => zo.nextTick(d, u), (f) => zo.nextTick(d, f || u));
      };
      async function a(u) {
        let d = u != null, f = typeof n.throw == "function";
        if (d && f) {
          let { value: b, done: _ } = await n.throw(u);
          if (await b, _)
            return;
        }
        if (typeof n.return == "function") {
          let { value: b } = await n.return();
          await b;
        }
      }
      async function l() {
        for (; ; ) {
          try {
            let { value: u, done: d } = i ? await n.next() : n.next();
            if (d)
              s.push(null);
            else {
              let f = u && typeof u.then == "function" ? await u : u;
              if (f === null)
                throw o = false, new xc();
              if (s.push(f))
                continue;
              o = false;
            }
          } catch (u) {
            s.destroy(u);
          }
          break;
        }
      }
      return s;
    }
    Ko.exports = Sc;
  });
  var zt = A((ub, pa) => {
    var ie = Pe(), { ArrayPrototypeIndexOf: Ec, NumberIsInteger: Rc, NumberIsNaN: Ic, NumberParseInt: Ac, ObjectDefineProperties: zn, ObjectKeys: Tc, ObjectSetPrototypeOf: Xo, Promise: ea, SafeSet: Nc, SymbolAsyncDispose: kc, SymbolAsyncIterator: Lc, Symbol: vc } = B();
    pa.exports = E;
    E.ReadableState = Nr;
    var { EventEmitter: Bc } = Ut(), { Stream: Ce, prependListener: Fc } = xr(), { Buffer: Dn } = Ee(), { addAbortSignal: jc } = Wt(), ta = Ae(), I = Q().debuglog("stream", (t6) => {
      I = t6;
    }), Pc = Oo(), mt = Ze(), { getHighWaterMark: Oc, getDefaultHighWaterMark: Cc } = Gt(), { aggregateTwoErrors: Yo, codes: { ERR_INVALID_ARG_TYPE: Mc, ERR_METHOD_NOT_IMPLEMENTED: $c, ERR_OUT_OF_RANGE: Dc, ERR_STREAM_PUSH_AFTER_EOF: qc, ERR_STREAM_UNSHIFT_AFTER_END_EVENT: Uc }, AbortError: Wc } = V(), { validateObject: Gc } = _t(), et = vc("kPaused"), { StringDecoder: ra } = Qo(), Hc = $n();
    Xo(E.prototype, Ce.prototype);
    Xo(E, Ce);
    var qn = () => {
    }, { errorOrDestroy: gt } = mt, wt = 1, Qc = 2, na = 4, Qt = 8, ia = 16, Ir = 32, Ar = 64, sa = 128, zc = 256, Vc = 512, Jc = 1024, Hn = 2048, Qn = 4096, Kc = 8192, Yc = 16384, Zc = 32768, oa = 65536, Xc = 1 << 17, eh = 1 << 18;
    function $(t6) {
      return { enumerable: false, get() {
        return (this.state & t6) !== 0;
      }, set(e) {
        e ? this.state |= t6 : this.state &= ~t6;
      } };
    }
    zn(Nr.prototype, { objectMode: $(wt), ended: $(Qc), endEmitted: $(na), reading: $(Qt), constructed: $(ia), sync: $(Ir), needReadable: $(Ar), emittedReadable: $(sa), readableListening: $(zc), resumeScheduled: $(Vc), errorEmitted: $(Jc), emitClose: $(Hn), autoDestroy: $(Qn), destroyed: $(Kc), closed: $(Yc), closeEmitted: $(Zc), multiAwaitDrain: $(oa), readingMore: $(Xc), dataEmitted: $(eh) });
    function Nr(t6, e, r) {
      typeof r != "boolean" && (r = e instanceof ge()), this.state = Hn | Qn | ia | Ir, t6 && t6.objectMode && (this.state |= wt), r && t6 && t6.readableObjectMode && (this.state |= wt), this.highWaterMark = t6 ? Oc(this, t6, "readableHighWaterMark", r) : Cc(false), this.buffer = new Pc(), this.length = 0, this.pipes = [], this.flowing = null, this[et] = null, t6 && t6.emitClose === false && (this.state &= ~Hn), t6 && t6.autoDestroy === false && (this.state &= ~Qn), this.errored = null, this.defaultEncoding = t6 && t6.defaultEncoding || "utf8", this.awaitDrainWriters = null, this.decoder = null, this.encoding = null, t6 && t6.encoding && (this.decoder = new ra(t6.encoding), this.encoding = t6.encoding);
    }
    function E(t6) {
      if (!(this instanceof E))
        return new E(t6);
      let e = this instanceof ge();
      this._readableState = new Nr(t6, this, e), t6 && (typeof t6.read == "function" && (this._read = t6.read), typeof t6.destroy == "function" && (this._destroy = t6.destroy), typeof t6.construct == "function" && (this._construct = t6.construct), t6.signal && !e && jc(t6.signal, this)), Ce.call(this, t6), mt.construct(this, () => {
        this._readableState.needReadable && Tr(this, this._readableState);
      });
    }
    E.prototype.destroy = mt.destroy;
    E.prototype._undestroy = mt.undestroy;
    E.prototype._destroy = function(t6, e) {
      e(t6);
    };
    E.prototype[Bc.captureRejectionSymbol] = function(t6) {
      this.destroy(t6);
    };
    E.prototype[kc] = function() {
      let t6;
      return this.destroyed || (t6 = this.readableEnded ? null : new Wc(), this.destroy(t6)), new ea((e, r) => ta(this, (n) => n && n !== t6 ? r(n) : e(null)));
    };
    E.prototype.push = function(t6, e) {
      return aa(this, t6, e, false);
    };
    E.prototype.unshift = function(t6, e) {
      return aa(this, t6, e, true);
    };
    function aa(t6, e, r, n) {
      I("readableAddChunk", e);
      let i = t6._readableState, s;
      if (i.state & wt || (typeof e == "string" ? (r = r || i.defaultEncoding, i.encoding !== r && (n && i.encoding ? e = Dn.from(e, r).toString(i.encoding) : (e = Dn.from(e, r), r = ""))) : e instanceof Dn ? r = "" : Ce._isUint8Array(e) ? (e = Ce._uint8ArrayToBuffer(e), r = "") : e != null && (s = new Mc("chunk", ["string", "Buffer", "Uint8Array"], e))), s)
        gt(t6, s);
      else if (e === null)
        i.state &= ~Qt, nh(t6, i);
      else if (i.state & wt || e && e.length > 0)
        if (n)
          if (i.state & na)
            gt(t6, new Uc());
          else {
            if (i.destroyed || i.errored)
              return false;
            Un(t6, i, e, true);
          }
        else if (i.ended)
          gt(t6, new qc());
        else {
          if (i.destroyed || i.errored)
            return false;
          i.state &= ~Qt, i.decoder && !r ? (e = i.decoder.write(e), i.objectMode || e.length !== 0 ? Un(t6, i, e, false) : Tr(t6, i)) : Un(t6, i, e, false);
        }
      else
        n || (i.state &= ~Qt, Tr(t6, i));
      return !i.ended && (i.length < i.highWaterMark || i.length === 0);
    }
    function Un(t6, e, r, n) {
      e.flowing && e.length === 0 && !e.sync && t6.listenerCount("data") > 0 ? (e.state & oa ? e.awaitDrainWriters.clear() : e.awaitDrainWriters = null, e.dataEmitted = true, t6.emit("data", r)) : (e.length += e.objectMode ? 1 : r.length, n ? e.buffer.unshift(r) : e.buffer.push(r), e.state & Ar && kr(t6)), Tr(t6, e);
    }
    E.prototype.isPaused = function() {
      let t6 = this._readableState;
      return t6[et] === true || t6.flowing === false;
    };
    E.prototype.setEncoding = function(t6) {
      let e = new ra(t6);
      this._readableState.decoder = e, this._readableState.encoding = this._readableState.decoder.encoding;
      let r = this._readableState.buffer, n = "";
      for (let i of r)
        n += e.write(i);
      return r.clear(), n !== "" && r.push(n), this._readableState.length = n.length, this;
    };
    var th = 1073741824;
    function rh(t6) {
      if (t6 > th)
        throw new Dc("size", "<= 1GiB", t6);
      return t6--, t6 |= t6 >>> 1, t6 |= t6 >>> 2, t6 |= t6 >>> 4, t6 |= t6 >>> 8, t6 |= t6 >>> 16, t6++, t6;
    }
    function Zo(t6, e) {
      return t6 <= 0 || e.length === 0 && e.ended ? 0 : e.state & wt ? 1 : Ic(t6) ? e.flowing && e.length ? e.buffer.first().length : e.length : t6 <= e.length ? t6 : e.ended ? e.length : 0;
    }
    E.prototype.read = function(t6) {
      I("read", t6), t6 === void 0 ? t6 = NaN : Rc(t6) || (t6 = Ac(t6, 10));
      let e = this._readableState, r = t6;
      if (t6 > e.highWaterMark && (e.highWaterMark = rh(t6)), t6 !== 0 && (e.state &= ~sa), t6 === 0 && e.needReadable && ((e.highWaterMark !== 0 ? e.length >= e.highWaterMark : e.length > 0) || e.ended))
        return I("read: emitReadable", e.length, e.ended), e.length === 0 && e.ended ? Wn(this) : kr(this), null;
      if (t6 = Zo(t6, e), t6 === 0 && e.ended)
        return e.length === 0 && Wn(this), null;
      let n = (e.state & Ar) !== 0;
      if (I("need readable", n), (e.length === 0 || e.length - t6 < e.highWaterMark) && (n = true, I("length less than watermark", n)), e.ended || e.reading || e.destroyed || e.errored || !e.constructed)
        n = false, I("reading, ended or constructing", n);
      else if (n) {
        I("do read"), e.state |= Qt | Ir, e.length === 0 && (e.state |= Ar);
        try {
          this._read(e.highWaterMark);
        } catch (s) {
          gt(this, s);
        }
        e.state &= ~Ir, e.reading || (t6 = Zo(r, e));
      }
      let i;
      return t6 > 0 ? i = ca(t6, e) : i = null, i === null ? (e.needReadable = e.length <= e.highWaterMark, t6 = 0) : (e.length -= t6, e.multiAwaitDrain ? e.awaitDrainWriters.clear() : e.awaitDrainWriters = null), e.length === 0 && (e.ended || (e.needReadable = true), r !== t6 && e.ended && Wn(this)), i !== null && !e.errorEmitted && !e.closeEmitted && (e.dataEmitted = true, this.emit("data", i)), i;
    };
    function nh(t6, e) {
      if (I("onEofChunk"), !e.ended) {
        if (e.decoder) {
          let r = e.decoder.end();
          r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length);
        }
        e.ended = true, e.sync ? kr(t6) : (e.needReadable = false, e.emittedReadable = true, la(t6));
      }
    }
    function kr(t6) {
      let e = t6._readableState;
      I("emitReadable", e.needReadable, e.emittedReadable), e.needReadable = false, e.emittedReadable || (I("emitReadable", e.flowing), e.emittedReadable = true, ie.nextTick(la, t6));
    }
    function la(t6) {
      let e = t6._readableState;
      I("emitReadable_", e.destroyed, e.length, e.ended), !e.destroyed && !e.errored && (e.length || e.ended) && (t6.emit("readable"), e.emittedReadable = false), e.needReadable = !e.flowing && !e.ended && e.length <= e.highWaterMark, fa(t6);
    }
    function Tr(t6, e) {
      !e.readingMore && e.constructed && (e.readingMore = true, ie.nextTick(ih, t6, e));
    }
    function ih(t6, e) {
      for (; !e.reading && !e.ended && (e.length < e.highWaterMark || e.flowing && e.length === 0); ) {
        let r = e.length;
        if (I("maybeReadMore read 0"), t6.read(0), r === e.length)
          break;
      }
      e.readingMore = false;
    }
    E.prototype._read = function(t6) {
      throw new $c("_read()");
    };
    E.prototype.pipe = function(t6, e) {
      let r = this, n = this._readableState;
      n.pipes.length === 1 && (n.multiAwaitDrain || (n.multiAwaitDrain = true, n.awaitDrainWriters = new Nc(n.awaitDrainWriters ? [n.awaitDrainWriters] : []))), n.pipes.push(t6), I("pipe count=%d opts=%j", n.pipes.length, e);
      let s = (!e || e.end !== false) && t6 !== ie.stdout && t6 !== ie.stderr ? a : m;
      n.endEmitted ? ie.nextTick(s) : r.once("end", s), t6.on("unpipe", o);
      function o(w, R) {
        I("onunpipe"), w === r && R && R.hasUnpiped === false && (R.hasUnpiped = true, d());
      }
      function a() {
        I("onend"), t6.end();
      }
      let l, u = false;
      function d() {
        I("cleanup"), t6.removeListener("close", y), t6.removeListener("finish", g), l && t6.removeListener("drain", l), t6.removeListener("error", _), t6.removeListener("unpipe", o), r.removeListener("end", a), r.removeListener("end", m), r.removeListener("data", b), u = true, l && n.awaitDrainWriters && (!t6._writableState || t6._writableState.needDrain) && l();
      }
      function f() {
        u || (n.pipes.length === 1 && n.pipes[0] === t6 ? (I("false write response, pause", 0), n.awaitDrainWriters = t6, n.multiAwaitDrain = false) : n.pipes.length > 1 && n.pipes.includes(t6) && (I("false write response, pause", n.awaitDrainWriters.size), n.awaitDrainWriters.add(t6)), r.pause()), l || (l = sh(r, t6), t6.on("drain", l));
      }
      r.on("data", b);
      function b(w) {
        I("ondata");
        let R = t6.write(w);
        I("dest.write", R), R === false && f();
      }
      function _(w) {
        if (I("onerror", w), m(), t6.removeListener("error", _), t6.listenerCount("error") === 0) {
          let R = t6._writableState || t6._readableState;
          R && !R.errorEmitted ? gt(t6, w) : t6.emit("error", w);
        }
      }
      Fc(t6, "error", _);
      function y() {
        t6.removeListener("finish", g), m();
      }
      t6.once("close", y);
      function g() {
        I("onfinish"), t6.removeListener("close", y), m();
      }
      t6.once("finish", g);
      function m() {
        I("unpipe"), r.unpipe(t6);
      }
      return t6.emit("pipe", r), t6.writableNeedDrain === true ? f() : n.flowing || (I("pipe resume"), r.resume()), t6;
    };
    function sh(t6, e) {
      return function() {
        let n = t6._readableState;
        n.awaitDrainWriters === e ? (I("pipeOnDrain", 1), n.awaitDrainWriters = null) : n.multiAwaitDrain && (I("pipeOnDrain", n.awaitDrainWriters.size), n.awaitDrainWriters.delete(e)), (!n.awaitDrainWriters || n.awaitDrainWriters.size === 0) && t6.listenerCount("data") && t6.resume();
      };
    }
    E.prototype.unpipe = function(t6) {
      let e = this._readableState, r = { hasUnpiped: false };
      if (e.pipes.length === 0)
        return this;
      if (!t6) {
        let i = e.pipes;
        e.pipes = [], this.pause();
        for (let s = 0; s < i.length; s++)
          i[s].emit("unpipe", this, { hasUnpiped: false });
        return this;
      }
      let n = Ec(e.pipes, t6);
      return n === -1 ? this : (e.pipes.splice(n, 1), e.pipes.length === 0 && this.pause(), t6.emit("unpipe", this, r), this);
    };
    E.prototype.on = function(t6, e) {
      let r = Ce.prototype.on.call(this, t6, e), n = this._readableState;
      return t6 === "data" ? (n.readableListening = this.listenerCount("readable") > 0, n.flowing !== false && this.resume()) : t6 === "readable" && !n.endEmitted && !n.readableListening && (n.readableListening = n.needReadable = true, n.flowing = false, n.emittedReadable = false, I("on readable", n.length, n.reading), n.length ? kr(this) : n.reading || ie.nextTick(oh, this)), r;
    };
    E.prototype.addListener = E.prototype.on;
    E.prototype.removeListener = function(t6, e) {
      let r = Ce.prototype.removeListener.call(this, t6, e);
      return t6 === "readable" && ie.nextTick(ua, this), r;
    };
    E.prototype.off = E.prototype.removeListener;
    E.prototype.removeAllListeners = function(t6) {
      let e = Ce.prototype.removeAllListeners.apply(this, arguments);
      return (t6 === "readable" || t6 === void 0) && ie.nextTick(ua, this), e;
    };
    function ua(t6) {
      let e = t6._readableState;
      e.readableListening = t6.listenerCount("readable") > 0, e.resumeScheduled && e[et] === false ? e.flowing = true : t6.listenerCount("data") > 0 ? t6.resume() : e.readableListening || (e.flowing = null);
    }
    function oh(t6) {
      I("readable nexttick read 0"), t6.read(0);
    }
    E.prototype.resume = function() {
      let t6 = this._readableState;
      return t6.flowing || (I("resume"), t6.flowing = !t6.readableListening, ah(this, t6)), t6[et] = false, this;
    };
    function ah(t6, e) {
      e.resumeScheduled || (e.resumeScheduled = true, ie.nextTick(lh, t6, e));
    }
    function lh(t6, e) {
      I("resume", e.reading), e.reading || t6.read(0), e.resumeScheduled = false, t6.emit("resume"), fa(t6), e.flowing && !e.reading && t6.read(0);
    }
    E.prototype.pause = function() {
      return I("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== false && (I("pause"), this._readableState.flowing = false, this.emit("pause")), this._readableState[et] = true, this;
    };
    function fa(t6) {
      let e = t6._readableState;
      for (I("flow", e.flowing); e.flowing && t6.read() !== null; )
        ;
    }
    E.prototype.wrap = function(t6) {
      let e = false;
      t6.on("data", (n) => {
        !this.push(n) && t6.pause && (e = true, t6.pause());
      }), t6.on("end", () => {
        this.push(null);
      }), t6.on("error", (n) => {
        gt(this, n);
      }), t6.on("close", () => {
        this.destroy();
      }), t6.on("destroy", () => {
        this.destroy();
      }), this._read = () => {
        e && t6.resume && (e = false, t6.resume());
      };
      let r = Tc(t6);
      for (let n = 1; n < r.length; n++) {
        let i = r[n];
        this[i] === void 0 && typeof t6[i] == "function" && (this[i] = t6[i].bind(t6));
      }
      return this;
    };
    E.prototype[Lc] = function() {
      return da(this);
    };
    E.prototype.iterator = function(t6) {
      return t6 !== void 0 && Gc(t6, "options"), da(this, t6);
    };
    function da(t6, e) {
      typeof t6.read != "function" && (t6 = E.wrap(t6, { objectMode: true }));
      let r = uh(t6, e);
      return r.stream = t6, r;
    }
    async function* uh(t6, e) {
      let r = qn;
      function n(o) {
        this === t6 ? (r(), r = qn) : r = o;
      }
      t6.on("readable", n);
      let i, s = ta(t6, { writable: false }, (o) => {
        i = o ? Yo(i, o) : null, r(), r = qn;
      });
      try {
        for (; ; ) {
          let o = t6.destroyed ? null : t6.read();
          if (o !== null)
            yield o;
          else {
            if (i)
              throw i;
            if (i === null)
              return;
            await new ea(n);
          }
        }
      } catch (o) {
        throw i = Yo(i, o), i;
      } finally {
        (i || e?.destroyOnReturn !== false) && (i === void 0 || t6._readableState.autoDestroy) ? mt.destroyer(t6, null) : (t6.off("readable", n), s());
      }
    }
    zn(E.prototype, { readable: { __proto__: null, get() {
      let t6 = this._readableState;
      return !!t6 && t6.readable !== false && !t6.destroyed && !t6.errorEmitted && !t6.endEmitted;
    }, set(t6) {
      this._readableState && (this._readableState.readable = !!t6);
    } }, readableDidRead: { __proto__: null, enumerable: false, get: function() {
      return this._readableState.dataEmitted;
    } }, readableAborted: { __proto__: null, enumerable: false, get: function() {
      return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
    } }, readableHighWaterMark: { __proto__: null, enumerable: false, get: function() {
      return this._readableState.highWaterMark;
    } }, readableBuffer: { __proto__: null, enumerable: false, get: function() {
      return this._readableState && this._readableState.buffer;
    } }, readableFlowing: { __proto__: null, enumerable: false, get: function() {
      return this._readableState.flowing;
    }, set: function(t6) {
      this._readableState && (this._readableState.flowing = t6);
    } }, readableLength: { __proto__: null, enumerable: false, get() {
      return this._readableState.length;
    } }, readableObjectMode: { __proto__: null, enumerable: false, get() {
      return this._readableState ? this._readableState.objectMode : false;
    } }, readableEncoding: { __proto__: null, enumerable: false, get() {
      return this._readableState ? this._readableState.encoding : null;
    } }, errored: { __proto__: null, enumerable: false, get() {
      return this._readableState ? this._readableState.errored : null;
    } }, closed: { __proto__: null, get() {
      return this._readableState ? this._readableState.closed : false;
    } }, destroyed: { __proto__: null, enumerable: false, get() {
      return this._readableState ? this._readableState.destroyed : false;
    }, set(t6) {
      this._readableState && (this._readableState.destroyed = t6);
    } }, readableEnded: { __proto__: null, enumerable: false, get() {
      return this._readableState ? this._readableState.endEmitted : false;
    } } });
    zn(Nr.prototype, { pipesCount: { __proto__: null, get() {
      return this.pipes.length;
    } }, paused: { __proto__: null, get() {
      return this[et] !== false;
    }, set(t6) {
      this[et] = !!t6;
    } } });
    E._fromList = ca;
    function ca(t6, e) {
      if (e.length === 0)
        return null;
      let r;
      return e.objectMode ? r = e.buffer.shift() : !t6 || t6 >= e.length ? (e.decoder ? r = e.buffer.join("") : e.buffer.length === 1 ? r = e.buffer.first() : r = e.buffer.concat(e.length), e.buffer.clear()) : r = e.buffer.consume(t6, e.decoder), r;
    }
    function Wn(t6) {
      let e = t6._readableState;
      I("endReadable", e.endEmitted), e.endEmitted || (e.ended = true, ie.nextTick(fh, e, t6));
    }
    function fh(t6, e) {
      if (I("endReadableNT", t6.endEmitted, t6.length), !t6.errored && !t6.closeEmitted && !t6.endEmitted && t6.length === 0) {
        if (t6.endEmitted = true, e.emit("end"), e.writable && e.allowHalfOpen === false)
          ie.nextTick(dh, e);
        else if (t6.autoDestroy) {
          let r = e._writableState;
          (!r || r.autoDestroy && (r.finished || r.writable === false)) && e.destroy();
        }
      }
    }
    function dh(t6) {
      t6.writable && !t6.writableEnded && !t6.destroyed && t6.end();
    }
    E.from = function(t6, e) {
      return Hc(E, t6, e);
    };
    var Gn;
    function ha() {
      return Gn === void 0 && (Gn = {}), Gn;
    }
    E.fromWeb = function(t6, e) {
      return ha().newStreamReadableFromReadableStream(t6, e);
    };
    E.toWeb = function(t6, e) {
      return ha().newReadableStreamFromStreamReadable(t6, e);
    };
    E.wrap = function(t6, e) {
      var r, n;
      return new E({ objectMode: (r = (n = t6.readableObjectMode) !== null && n !== void 0 ? n : t6.objectMode) !== null && r !== void 0 ? r : true, ...e, destroy(i, s) {
        mt.destroyer(t6, i), s(i);
      } }).wrap(t6);
    };
  });
  var jr = A((fb, Aa) => {
    var tt = Pe(), { ArrayPrototypeSlice: ya, Error: ch, FunctionPrototypeSymbolHasInstance: ga, ObjectDefineProperty: wa, ObjectDefineProperties: hh, ObjectSetPrototypeOf: ma, StringPrototypeToLowerCase: ph, Symbol: _h, SymbolHasInstance: bh } = B();
    Aa.exports = F;
    F.WritableState = Kt;
    var { EventEmitter: yh } = Ut(), Vt = xr().Stream, { Buffer: Lr } = Ee(), Fr = Ze(), { addAbortSignal: gh } = Wt(), { getHighWaterMark: wh, getDefaultHighWaterMark: mh } = Gt(), { ERR_INVALID_ARG_TYPE: xh, ERR_METHOD_NOT_IMPLEMENTED: Sh, ERR_MULTIPLE_CALLBACK: xa, ERR_STREAM_CANNOT_PIPE: Eh, ERR_STREAM_DESTROYED: Jt, ERR_STREAM_ALREADY_FINISHED: Rh, ERR_STREAM_NULL_VALUES: Ih, ERR_STREAM_WRITE_AFTER_END: Ah, ERR_UNKNOWN_ENCODING: Sa } = V().codes, { errorOrDestroy: xt } = Fr;
    ma(F.prototype, Vt.prototype);
    ma(F, Vt);
    function Kn() {
    }
    var St = _h("kOnFinished");
    function Kt(t6, e, r) {
      typeof r != "boolean" && (r = e instanceof ge()), this.objectMode = !!(t6 && t6.objectMode), r && (this.objectMode = this.objectMode || !!(t6 && t6.writableObjectMode)), this.highWaterMark = t6 ? wh(this, t6, "writableHighWaterMark", r) : mh(false), this.finalCalled = false, this.needDrain = false, this.ending = false, this.ended = false, this.finished = false, this.destroyed = false;
      let n = !!(t6 && t6.decodeStrings === false);
      this.decodeStrings = !n, this.defaultEncoding = t6 && t6.defaultEncoding || "utf8", this.length = 0, this.writing = false, this.corked = 0, this.sync = true, this.bufferProcessing = false, this.onwrite = Nh.bind(void 0, e), this.writecb = null, this.writelen = 0, this.afterWriteTickInfo = null, Br(this), this.pendingcb = 0, this.constructed = true, this.prefinished = false, this.errorEmitted = false, this.emitClose = !t6 || t6.emitClose !== false, this.autoDestroy = !t6 || t6.autoDestroy !== false, this.errored = null, this.closed = false, this.closeEmitted = false, this[St] = [];
    }
    function Br(t6) {
      t6.buffered = [], t6.bufferedIndex = 0, t6.allBuffers = true, t6.allNoop = true;
    }
    Kt.prototype.getBuffer = function() {
      return ya(this.buffered, this.bufferedIndex);
    };
    wa(Kt.prototype, "bufferedRequestCount", { __proto__: null, get() {
      return this.buffered.length - this.bufferedIndex;
    } });
    function F(t6) {
      let e = this instanceof ge();
      if (!e && !ga(F, this))
        return new F(t6);
      this._writableState = new Kt(t6, this, e), t6 && (typeof t6.write == "function" && (this._write = t6.write), typeof t6.writev == "function" && (this._writev = t6.writev), typeof t6.destroy == "function" && (this._destroy = t6.destroy), typeof t6.final == "function" && (this._final = t6.final), typeof t6.construct == "function" && (this._construct = t6.construct), t6.signal && gh(t6.signal, this)), Vt.call(this, t6), Fr.construct(this, () => {
        let r = this._writableState;
        r.writing || Zn(this, r), Xn(this, r);
      });
    }
    wa(F, bh, { __proto__: null, value: function(t6) {
      return ga(this, t6) ? true : this !== F ? false : t6 && t6._writableState instanceof Kt;
    } });
    F.prototype.pipe = function() {
      xt(this, new Eh());
    };
    function Ea(t6, e, r, n) {
      let i = t6._writableState;
      if (typeof r == "function")
        n = r, r = i.defaultEncoding;
      else {
        if (!r)
          r = i.defaultEncoding;
        else if (r !== "buffer" && !Lr.isEncoding(r))
          throw new Sa(r);
        typeof n != "function" && (n = Kn);
      }
      if (e === null)
        throw new Ih();
      if (!i.objectMode)
        if (typeof e == "string")
          i.decodeStrings !== false && (e = Lr.from(e, r), r = "buffer");
        else if (e instanceof Lr)
          r = "buffer";
        else if (Vt._isUint8Array(e))
          e = Vt._uint8ArrayToBuffer(e), r = "buffer";
        else
          throw new xh("chunk", ["string", "Buffer", "Uint8Array"], e);
      let s;
      return i.ending ? s = new Ah() : i.destroyed && (s = new Jt("write")), s ? (tt.nextTick(n, s), xt(t6, s, true), s) : (i.pendingcb++, Th(t6, i, e, r, n));
    }
    F.prototype.write = function(t6, e, r) {
      return Ea(this, t6, e, r) === true;
    };
    F.prototype.cork = function() {
      this._writableState.corked++;
    };
    F.prototype.uncork = function() {
      let t6 = this._writableState;
      t6.corked && (t6.corked--, t6.writing || Zn(this, t6));
    };
    F.prototype.setDefaultEncoding = function(e) {
      if (typeof e == "string" && (e = ph(e)), !Lr.isEncoding(e))
        throw new Sa(e);
      return this._writableState.defaultEncoding = e, this;
    };
    function Th(t6, e, r, n, i) {
      let s = e.objectMode ? 1 : r.length;
      e.length += s;
      let o = e.length < e.highWaterMark;
      return o || (e.needDrain = true), e.writing || e.corked || e.errored || !e.constructed ? (e.buffered.push({ chunk: r, encoding: n, callback: i }), e.allBuffers && n !== "buffer" && (e.allBuffers = false), e.allNoop && i !== Kn && (e.allNoop = false)) : (e.writelen = s, e.writecb = i, e.writing = true, e.sync = true, t6._write(r, n, e.onwrite), e.sync = false), o && !e.errored && !e.destroyed;
    }
    function _a(t6, e, r, n, i, s, o) {
      e.writelen = n, e.writecb = o, e.writing = true, e.sync = true, e.destroyed ? e.onwrite(new Jt("write")) : r ? t6._writev(i, e.onwrite) : t6._write(i, s, e.onwrite), e.sync = false;
    }
    function ba(t6, e, r, n) {
      --e.pendingcb, n(r), Yn(e), xt(t6, r);
    }
    function Nh(t6, e) {
      let r = t6._writableState, n = r.sync, i = r.writecb;
      if (typeof i != "function") {
        xt(t6, new xa());
        return;
      }
      r.writing = false, r.writecb = null, r.length -= r.writelen, r.writelen = 0, e ? (e.stack, r.errored || (r.errored = e), t6._readableState && !t6._readableState.errored && (t6._readableState.errored = e), n ? tt.nextTick(ba, t6, r, e, i) : ba(t6, r, e, i)) : (r.buffered.length > r.bufferedIndex && Zn(t6, r), n ? r.afterWriteTickInfo !== null && r.afterWriteTickInfo.cb === i ? r.afterWriteTickInfo.count++ : (r.afterWriteTickInfo = { count: 1, cb: i, stream: t6, state: r }, tt.nextTick(kh, r.afterWriteTickInfo)) : Ra(t6, r, 1, i));
    }
    function kh({ stream: t6, state: e, count: r, cb: n }) {
      return e.afterWriteTickInfo = null, Ra(t6, e, r, n);
    }
    function Ra(t6, e, r, n) {
      for (!e.ending && !t6.destroyed && e.length === 0 && e.needDrain && (e.needDrain = false, t6.emit("drain")); r-- > 0; )
        e.pendingcb--, n();
      e.destroyed && Yn(e), Xn(t6, e);
    }
    function Yn(t6) {
      if (t6.writing)
        return;
      for (let i = t6.bufferedIndex; i < t6.buffered.length; ++i) {
        var e;
        let { chunk: s, callback: o } = t6.buffered[i], a = t6.objectMode ? 1 : s.length;
        t6.length -= a, o((e = t6.errored) !== null && e !== void 0 ? e : new Jt("write"));
      }
      let r = t6[St].splice(0);
      for (let i = 0; i < r.length; i++) {
        var n;
        r[i]((n = t6.errored) !== null && n !== void 0 ? n : new Jt("end"));
      }
      Br(t6);
    }
    function Zn(t6, e) {
      if (e.corked || e.bufferProcessing || e.destroyed || !e.constructed)
        return;
      let { buffered: r, bufferedIndex: n, objectMode: i } = e, s = r.length - n;
      if (!s)
        return;
      let o = n;
      if (e.bufferProcessing = true, s > 1 && t6._writev) {
        e.pendingcb -= s - 1;
        let a = e.allNoop ? Kn : (u) => {
          for (let d = o; d < r.length; ++d)
            r[d].callback(u);
        }, l = e.allNoop && o === 0 ? r : ya(r, o);
        l.allBuffers = e.allBuffers, _a(t6, e, true, e.length, l, "", a), Br(e);
      } else {
        do {
          let { chunk: a, encoding: l, callback: u } = r[o];
          r[o++] = null;
          let d = i ? 1 : a.length;
          _a(t6, e, false, d, a, l, u);
        } while (o < r.length && !e.writing);
        o === r.length ? Br(e) : o > 256 ? (r.splice(0, o), e.bufferedIndex = 0) : e.bufferedIndex = o;
      }
      e.bufferProcessing = false;
    }
    F.prototype._write = function(t6, e, r) {
      if (this._writev)
        this._writev([{ chunk: t6, encoding: e }], r);
      else
        throw new Sh("_write()");
    };
    F.prototype._writev = null;
    F.prototype.end = function(t6, e, r) {
      let n = this._writableState;
      typeof t6 == "function" ? (r = t6, t6 = null, e = null) : typeof e == "function" && (r = e, e = null);
      let i;
      if (t6 != null) {
        let s = Ea(this, t6, e);
        s instanceof ch && (i = s);
      }
      return n.corked && (n.corked = 1, this.uncork()), i || (!n.errored && !n.ending ? (n.ending = true, Xn(this, n, true), n.ended = true) : n.finished ? i = new Rh("end") : n.destroyed && (i = new Jt("end"))), typeof r == "function" && (i || n.finished ? tt.nextTick(r, i) : n[St].push(r)), this;
    };
    function vr(t6) {
      return t6.ending && !t6.destroyed && t6.constructed && t6.length === 0 && !t6.errored && t6.buffered.length === 0 && !t6.finished && !t6.writing && !t6.errorEmitted && !t6.closeEmitted;
    }
    function Lh(t6, e) {
      let r = false;
      function n(i) {
        if (r) {
          xt(t6, i ?? xa());
          return;
        }
        if (r = true, e.pendingcb--, i) {
          let s = e[St].splice(0);
          for (let o = 0; o < s.length; o++)
            s[o](i);
          xt(t6, i, e.sync);
        } else
          vr(e) && (e.prefinished = true, t6.emit("prefinish"), e.pendingcb++, tt.nextTick(Jn, t6, e));
      }
      e.sync = true, e.pendingcb++;
      try {
        t6._final(n);
      } catch (i) {
        n(i);
      }
      e.sync = false;
    }
    function vh(t6, e) {
      !e.prefinished && !e.finalCalled && (typeof t6._final == "function" && !e.destroyed ? (e.finalCalled = true, Lh(t6, e)) : (e.prefinished = true, t6.emit("prefinish")));
    }
    function Xn(t6, e, r) {
      vr(e) && (vh(t6, e), e.pendingcb === 0 && (r ? (e.pendingcb++, tt.nextTick((n, i) => {
        vr(i) ? Jn(n, i) : i.pendingcb--;
      }, t6, e)) : vr(e) && (e.pendingcb++, Jn(t6, e))));
    }
    function Jn(t6, e) {
      e.pendingcb--, e.finished = true;
      let r = e[St].splice(0);
      for (let n = 0; n < r.length; n++)
        r[n]();
      if (t6.emit("finish"), e.autoDestroy) {
        let n = t6._readableState;
        (!n || n.autoDestroy && (n.endEmitted || n.readable === false)) && t6.destroy();
      }
    }
    hh(F.prototype, { closed: { __proto__: null, get() {
      return this._writableState ? this._writableState.closed : false;
    } }, destroyed: { __proto__: null, get() {
      return this._writableState ? this._writableState.destroyed : false;
    }, set(t6) {
      this._writableState && (this._writableState.destroyed = t6);
    } }, writable: { __proto__: null, get() {
      let t6 = this._writableState;
      return !!t6 && t6.writable !== false && !t6.destroyed && !t6.errored && !t6.ending && !t6.ended;
    }, set(t6) {
      this._writableState && (this._writableState.writable = !!t6);
    } }, writableFinished: { __proto__: null, get() {
      return this._writableState ? this._writableState.finished : false;
    } }, writableObjectMode: { __proto__: null, get() {
      return this._writableState ? this._writableState.objectMode : false;
    } }, writableBuffer: { __proto__: null, get() {
      return this._writableState && this._writableState.getBuffer();
    } }, writableEnded: { __proto__: null, get() {
      return this._writableState ? this._writableState.ending : false;
    } }, writableNeedDrain: { __proto__: null, get() {
      let t6 = this._writableState;
      return t6 ? !t6.destroyed && !t6.ending && t6.needDrain : false;
    } }, writableHighWaterMark: { __proto__: null, get() {
      return this._writableState && this._writableState.highWaterMark;
    } }, writableCorked: { __proto__: null, get() {
      return this._writableState ? this._writableState.corked : 0;
    } }, writableLength: { __proto__: null, get() {
      return this._writableState && this._writableState.length;
    } }, errored: { __proto__: null, enumerable: false, get() {
      return this._writableState ? this._writableState.errored : null;
    } }, writableAborted: { __proto__: null, enumerable: false, get: function() {
      return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
    } } });
    var Bh = Fr.destroy;
    F.prototype.destroy = function(t6, e) {
      let r = this._writableState;
      return !r.destroyed && (r.bufferedIndex < r.buffered.length || r[St].length) && tt.nextTick(Yn, r), Bh.call(this, t6, e), this;
    };
    F.prototype._undestroy = Fr.undestroy;
    F.prototype._destroy = function(t6, e) {
      e(t6);
    };
    F.prototype[yh.captureRejectionSymbol] = function(t6) {
      this.destroy(t6);
    };
    var Vn;
    function Ia() {
      return Vn === void 0 && (Vn = {}), Vn;
    }
    F.fromWeb = function(t6, e) {
      return Ia().newStreamWritableFromWritableStream(t6, e);
    };
    F.toWeb = function(t6) {
      return Ia().newWritableStreamFromStreamWritable(t6);
    };
  });
  var qa = A((db, Da) => {
    var ei = Pe(), Fh = Ee(), { isReadable: jh, isWritable: Ph, isIterable: Ta, isNodeStream: Oh, isReadableNodeStream: Na, isWritableNodeStream: ka, isDuplexNodeStream: Ch, isReadableStream: La, isWritableStream: va } = _e(), Ba = Ae(), { AbortError: Ma, codes: { ERR_INVALID_ARG_TYPE: Mh, ERR_INVALID_RETURN_VALUE: Fa } } = V(), { destroyer: Rt } = Ze(), $h = ge(), $a = zt(), Dh = jr(), { createDeferredPromise: ja } = Q(), Pa = $n(), Oa = globalThis.Blob || Fh.Blob, qh = typeof Oa < "u" ? function(e) {
      return e instanceof Oa;
    } : function(e) {
      return false;
    }, Uh = globalThis.AbortController || ct().AbortController, { FunctionPrototypeCall: Ca } = B(), Me = class extends $h {
      constructor(e) {
        super(e), e?.readable === false && (this._readableState.readable = false, this._readableState.ended = true, this._readableState.endEmitted = true), e?.writable === false && (this._writableState.writable = false, this._writableState.ending = true, this._writableState.ended = true, this._writableState.finished = true);
      }
    };
    Da.exports = function t6(e, r) {
      if (Ch(e))
        return e;
      if (Na(e))
        return Et({ readable: e });
      if (ka(e))
        return Et({ writable: e });
      if (Oh(e))
        return Et({ writable: false, readable: false });
      if (La(e))
        return Et({ readable: $a.fromWeb(e) });
      if (va(e))
        return Et({ writable: Dh.fromWeb(e) });
      if (typeof e == "function") {
        let { value: i, write: s, final: o, destroy: a } = Wh(e);
        if (Ta(i))
          return Pa(Me, i, { objectMode: true, write: s, final: o, destroy: a });
        let l = i?.then;
        if (typeof l == "function") {
          let u, d = Ca(l, i, (f) => {
            if (f != null)
              throw new Fa("nully", "body", f);
          }, (f) => {
            Rt(u, f);
          });
          return u = new Me({ objectMode: true, readable: false, write: s, final(f) {
            o(async () => {
              try {
                await d, ei.nextTick(f, null);
              } catch (b) {
                ei.nextTick(f, b);
              }
            });
          }, destroy: a });
        }
        throw new Fa("Iterable, AsyncIterable or AsyncFunction", r, i);
      }
      if (qh(e))
        return t6(e.arrayBuffer());
      if (Ta(e))
        return Pa(Me, e, { objectMode: true, writable: false });
      if (La(e?.readable) && va(e?.writable))
        return Me.fromWeb(e);
      if (typeof e?.writable == "object" || typeof e?.readable == "object") {
        let i = e != null && e.readable ? Na(e?.readable) ? e?.readable : t6(e.readable) : void 0, s = e != null && e.writable ? ka(e?.writable) ? e?.writable : t6(e.writable) : void 0;
        return Et({ readable: i, writable: s });
      }
      let n = e?.then;
      if (typeof n == "function") {
        let i;
        return Ca(n, e, (s) => {
          s != null && i.push(s), i.push(null);
        }, (s) => {
          Rt(i, s);
        }), i = new Me({ objectMode: true, writable: false, read() {
        } });
      }
      throw new Mh(r, ["Blob", "ReadableStream", "WritableStream", "Stream", "Iterable", "AsyncIterable", "Function", "{ readable, writable } pair", "Promise"], e);
    };
    function Wh(t6) {
      let { promise: e, resolve: r } = ja(), n = new Uh(), i = n.signal;
      return { value: t6(async function* () {
        for (; ; ) {
          let o = e;
          e = null;
          let { chunk: a, done: l, cb: u } = await o;
          if (ei.nextTick(u), l)
            return;
          if (i.aborted)
            throw new Ma(void 0, { cause: i.reason });
          ({ promise: e, resolve: r } = ja()), yield a;
        }
      }(), { signal: i }), write(o, a, l) {
        let u = r;
        r = null, u({ chunk: o, done: false, cb: l });
      }, final(o) {
        let a = r;
        r = null, a({ done: true, cb: o });
      }, destroy(o, a) {
        n.abort(), a(o);
      } };
    }
    function Et(t6) {
      let e = t6.readable && typeof t6.readable.read != "function" ? $a.wrap(t6.readable) : t6.readable, r = t6.writable, n = !!jh(e), i = !!Ph(r), s, o, a, l, u;
      function d(f) {
        let b = l;
        l = null, b ? b(f) : f && u.destroy(f);
      }
      return u = new Me({ readableObjectMode: !!(e != null && e.readableObjectMode), writableObjectMode: !!(r != null && r.writableObjectMode), readable: n, writable: i }), i && (Ba(r, (f) => {
        i = false, f && Rt(e, f), d(f);
      }), u._write = function(f, b, _) {
        r.write(f, b) ? _() : s = _;
      }, u._final = function(f) {
        r.end(), o = f;
      }, r.on("drain", function() {
        if (s) {
          let f = s;
          s = null, f();
        }
      }), r.on("finish", function() {
        if (o) {
          let f = o;
          o = null, f();
        }
      })), n && (Ba(e, (f) => {
        n = false, f && Rt(e, f), d(f);
      }), e.on("readable", function() {
        if (a) {
          let f = a;
          a = null, f();
        }
      }), e.on("end", function() {
        u.push(null);
      }), u._read = function() {
        for (; ; ) {
          let f = e.read();
          if (f === null) {
            a = u._read;
            return;
          }
          if (!u.push(f))
            return;
        }
      }), u._destroy = function(f, b) {
        !f && l !== null && (f = new Ma()), a = null, s = null, o = null, l === null ? b(f) : (l = b, Rt(r, f), Rt(e, f));
      }, u;
    }
  });
  var ge = A((cb, Ga) => {
    "use strict";
    var { ObjectDefineProperties: Gh, ObjectGetOwnPropertyDescriptor: Te, ObjectKeys: Hh, ObjectSetPrototypeOf: Ua } = B();
    Ga.exports = se;
    var ni = zt(), re = jr();
    Ua(se.prototype, ni.prototype);
    Ua(se, ni);
    {
      let t6 = Hh(re.prototype);
      for (let e = 0; e < t6.length; e++) {
        let r = t6[e];
        se.prototype[r] || (se.prototype[r] = re.prototype[r]);
      }
    }
    function se(t6) {
      if (!(this instanceof se))
        return new se(t6);
      ni.call(this, t6), re.call(this, t6), t6 ? (this.allowHalfOpen = t6.allowHalfOpen !== false, t6.readable === false && (this._readableState.readable = false, this._readableState.ended = true, this._readableState.endEmitted = true), t6.writable === false && (this._writableState.writable = false, this._writableState.ending = true, this._writableState.ended = true, this._writableState.finished = true)) : this.allowHalfOpen = true;
    }
    Gh(se.prototype, { writable: { __proto__: null, ...Te(re.prototype, "writable") }, writableHighWaterMark: { __proto__: null, ...Te(re.prototype, "writableHighWaterMark") }, writableObjectMode: { __proto__: null, ...Te(re.prototype, "writableObjectMode") }, writableBuffer: { __proto__: null, ...Te(re.prototype, "writableBuffer") }, writableLength: { __proto__: null, ...Te(re.prototype, "writableLength") }, writableFinished: { __proto__: null, ...Te(re.prototype, "writableFinished") }, writableCorked: { __proto__: null, ...Te(re.prototype, "writableCorked") }, writableEnded: { __proto__: null, ...Te(re.prototype, "writableEnded") }, writableNeedDrain: { __proto__: null, ...Te(re.prototype, "writableNeedDrain") }, destroyed: { __proto__: null, get() {
      return this._readableState === void 0 || this._writableState === void 0 ? false : this._readableState.destroyed && this._writableState.destroyed;
    }, set(t6) {
      this._readableState && this._writableState && (this._readableState.destroyed = t6, this._writableState.destroyed = t6);
    } } });
    var ti;
    function Wa() {
      return ti === void 0 && (ti = {}), ti;
    }
    se.fromWeb = function(t6, e) {
      return Wa().newStreamDuplexFromReadableWritablePair(t6, e);
    };
    se.toWeb = function(t6) {
      return Wa().newReadableWritablePairFromDuplex(t6);
    };
    var ri;
    se.from = function(t6) {
      return ri || (ri = qa()), ri(t6, "body");
    };
  });
  var oi = A((hb, Qa) => {
    "use strict";
    var { ObjectSetPrototypeOf: Ha, Symbol: Qh } = B();
    Qa.exports = Ne;
    var { ERR_METHOD_NOT_IMPLEMENTED: zh } = V().codes, si = ge(), { getHighWaterMark: Vh } = Gt();
    Ha(Ne.prototype, si.prototype);
    Ha(Ne, si);
    var Yt = Qh("kCallback");
    function Ne(t6) {
      if (!(this instanceof Ne))
        return new Ne(t6);
      let e = t6 ? Vh(this, t6, "readableHighWaterMark", true) : null;
      e === 0 && (t6 = { ...t6, highWaterMark: null, readableHighWaterMark: e, writableHighWaterMark: t6.writableHighWaterMark || 0 }), si.call(this, t6), this._readableState.sync = false, this[Yt] = null, t6 && (typeof t6.transform == "function" && (this._transform = t6.transform), typeof t6.flush == "function" && (this._flush = t6.flush)), this.on("prefinish", Jh);
    }
    function ii(t6) {
      typeof this._flush == "function" && !this.destroyed ? this._flush((e, r) => {
        if (e) {
          t6 ? t6(e) : this.destroy(e);
          return;
        }
        r != null && this.push(r), this.push(null), t6 && t6();
      }) : (this.push(null), t6 && t6());
    }
    function Jh() {
      this._final !== ii && ii.call(this);
    }
    Ne.prototype._final = ii;
    Ne.prototype._transform = function(t6, e, r) {
      throw new zh("_transform()");
    };
    Ne.prototype._write = function(t6, e, r) {
      let n = this._readableState, i = this._writableState, s = n.length;
      this._transform(t6, e, (o, a) => {
        if (o) {
          r(o);
          return;
        }
        a != null && this.push(a), i.ended || s === n.length || n.length < n.highWaterMark ? r() : this[Yt] = r;
      });
    };
    Ne.prototype._read = function() {
      if (this[Yt]) {
        let t6 = this[Yt];
        this[Yt] = null, t6();
      }
    };
  });
  var li = A((pb, Va) => {
    "use strict";
    var { ObjectSetPrototypeOf: za } = B();
    Va.exports = It;
    var ai = oi();
    za(It.prototype, ai.prototype);
    za(It, ai);
    function It(t6) {
      if (!(this instanceof It))
        return new It(t6);
      ai.call(this, t6);
    }
    It.prototype._transform = function(t6, e, r) {
      r(null, t6);
    };
  });
  var Mr = A((_b, Xa) => {
    var Zt = Pe(), { ArrayIsArray: Kh, Promise: Yh, SymbolAsyncIterator: Zh, SymbolDispose: Xh } = B(), Cr = Ae(), { once: ep } = Q(), tp = Ze(), Ja = ge(), { aggregateTwoErrors: rp, codes: { ERR_INVALID_ARG_TYPE: yi, ERR_INVALID_RETURN_VALUE: ui, ERR_MISSING_ARGS: np, ERR_STREAM_DESTROYED: ip, ERR_STREAM_PREMATURE_CLOSE: sp }, AbortError: op } = V(), { validateFunction: ap, validateAbortSignal: lp } = _t(), { isIterable: rt, isReadable: fi, isReadableNodeStream: Or, isNodeStream: Ka, isTransformStream: At, isWebStream: up, isReadableStream: di, isReadableFinished: fp } = _e(), dp = globalThis.AbortController || ct().AbortController, ci, hi, pi;
    function Ya(t6, e, r) {
      let n = false;
      t6.on("close", () => {
        n = true;
      });
      let i = Cr(t6, { readable: e, writable: r }, (s) => {
        n = !s;
      });
      return { destroy: (s) => {
        n || (n = true, tp.destroyer(t6, s || new ip("pipe")));
      }, cleanup: i };
    }
    function cp(t6) {
      return ap(t6[t6.length - 1], "streams[stream.length - 1]"), t6.pop();
    }
    function _i(t6) {
      if (rt(t6))
        return t6;
      if (Or(t6))
        return hp(t6);
      throw new yi("val", ["Readable", "Iterable", "AsyncIterable"], t6);
    }
    async function* hp(t6) {
      hi || (hi = zt()), yield* hi.prototype[Zh].call(t6);
    }
    async function Pr(t6, e, r, { end: n }) {
      let i, s = null, o = (u) => {
        if (u && (i = u), s) {
          let d = s;
          s = null, d();
        }
      }, a = () => new Yh((u, d) => {
        i ? d(i) : s = () => {
          i ? d(i) : u();
        };
      });
      e.on("drain", o);
      let l = Cr(e, { readable: false }, o);
      try {
        e.writableNeedDrain && await a();
        for await (let u of t6)
          e.write(u) || await a();
        n && (e.end(), await a()), r();
      } catch (u) {
        r(i !== u ? rp(i, u) : u);
      } finally {
        l(), e.off("drain", o);
      }
    }
    async function bi(t6, e, r, { end: n }) {
      At(e) && (e = e.writable);
      let i = e.getWriter();
      try {
        for await (let s of t6)
          await i.ready, i.write(s).catch(() => {
          });
        await i.ready, n && await i.close(), r();
      } catch (s) {
        try {
          await i.abort(s), r(s);
        } catch (o) {
          r(o);
        }
      }
    }
    function pp(...t6) {
      return Za(t6, ep(cp(t6)));
    }
    function Za(t6, e, r) {
      if (t6.length === 1 && Kh(t6[0]) && (t6 = t6[0]), t6.length < 2)
        throw new np("streams");
      let n = new dp(), i = n.signal, s = r?.signal, o = [];
      lp(s, "options.signal");
      function a() {
        y(new op());
      }
      pi = pi || Q().addAbortListener;
      let l;
      s && (l = pi(s, a));
      let u, d, f = [], b = 0;
      function _(N) {
        y(N, --b === 0);
      }
      function y(N, S) {
        var j;
        if (N && (!u || u.code === "ERR_STREAM_PREMATURE_CLOSE") && (u = N), !(!u && !S)) {
          for (; f.length; )
            f.shift()(u);
          (j = l) === null || j === void 0 || j[Xh](), n.abort(), S && (u || o.forEach((me) => me()), Zt.nextTick(e, u, d));
        }
      }
      let g;
      for (let N = 0; N < t6.length; N++) {
        let S = t6[N], j = N < t6.length - 1, me = N > 0, J = j || r?.end !== false, Le = N === t6.length - 1;
        if (Ka(S)) {
          let W = function(ne) {
            ne && ne.name !== "AbortError" && ne.code !== "ERR_STREAM_PREMATURE_CLOSE" && _(ne);
          };
          var R = W;
          if (J) {
            let { destroy: ne, cleanup: Nt } = Ya(S, j, me);
            f.push(ne), fi(S) && Le && o.push(Nt);
          }
          S.on("error", W), fi(S) && Le && o.push(() => {
            S.removeListener("error", W);
          });
        }
        if (N === 0)
          if (typeof S == "function") {
            if (g = S({ signal: i }), !rt(g))
              throw new ui("Iterable, AsyncIterable or Stream", "source", g);
          } else
            rt(S) || Or(S) || At(S) ? g = S : g = Ja.from(S);
        else if (typeof S == "function") {
          if (At(g)) {
            var m;
            g = _i((m = g) === null || m === void 0 ? void 0 : m.readable);
          } else
            g = _i(g);
          if (g = S(g, { signal: i }), j) {
            if (!rt(g, true))
              throw new ui("AsyncIterable", `transform[${N - 1}]`, g);
          } else {
            var w;
            ci || (ci = li());
            let W = new ci({ objectMode: true }), ne = (w = g) === null || w === void 0 ? void 0 : w.then;
            if (typeof ne == "function")
              b++, ne.call(g, (oe) => {
                d = oe, oe != null && W.write(oe), J && W.end(), Zt.nextTick(_);
              }, (oe) => {
                W.destroy(oe), Zt.nextTick(_, oe);
              });
            else if (rt(g, true))
              b++, Pr(g, W, _, { end: J });
            else if (di(g) || At(g)) {
              let oe = g.readable || g;
              b++, Pr(oe, W, _, { end: J });
            } else
              throw new ui("AsyncIterable or Promise", "destination", g);
            g = W;
            let { destroy: Nt, cleanup: kt } = Ya(g, false, true);
            f.push(Nt), Le && o.push(kt);
          }
        } else if (Ka(S)) {
          if (Or(g)) {
            b += 2;
            let W = _p(g, S, _, { end: J });
            fi(S) && Le && o.push(W);
          } else if (At(g) || di(g)) {
            let W = g.readable || g;
            b++, Pr(W, S, _, { end: J });
          } else if (rt(g))
            b++, Pr(g, S, _, { end: J });
          else
            throw new yi("val", ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"], g);
          g = S;
        } else if (up(S)) {
          if (Or(g))
            b++, bi(_i(g), S, _, { end: J });
          else if (di(g) || rt(g))
            b++, bi(g, S, _, { end: J });
          else if (At(g))
            b++, bi(g.readable, S, _, { end: J });
          else
            throw new yi("val", ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"], g);
          g = S;
        } else
          g = Ja.from(S);
      }
      return (i != null && i.aborted || s != null && s.aborted) && Zt.nextTick(a), g;
    }
    function _p(t6, e, r, { end: n }) {
      let i = false;
      if (e.on("close", () => {
        i || r(new sp());
      }), t6.pipe(e, { end: false }), n) {
        let o = function() {
          i = true, e.end();
        };
        var s = o;
        fp(t6) ? Zt.nextTick(o) : t6.once("end", o);
      } else
        r();
      return Cr(t6, { readable: true, writable: false }, (o) => {
        let a = t6._readableState;
        o && o.code === "ERR_STREAM_PREMATURE_CLOSE" && a && a.ended && !a.errored && !a.errorEmitted ? t6.once("end", r).once("error", r) : r(o);
      }), Cr(e, { readable: false, writable: true }, r);
    }
    Xa.exports = { pipelineImpl: Za, pipeline: pp };
  });
  var wi = A((bb, sl) => {
    "use strict";
    var { pipeline: bp } = Mr(), $r = ge(), { destroyer: yp } = Ze(), { isNodeStream: Dr, isReadable: el, isWritable: tl, isWebStream: gi, isTransformStream: nt, isWritableStream: rl, isReadableStream: nl } = _e(), { AbortError: gp, codes: { ERR_INVALID_ARG_VALUE: il, ERR_MISSING_ARGS: wp } } = V(), mp = Ae();
    sl.exports = function(...e) {
      if (e.length === 0)
        throw new wp("streams");
      if (e.length === 1)
        return $r.from(e[0]);
      let r = [...e];
      if (typeof e[0] == "function" && (e[0] = $r.from(e[0])), typeof e[e.length - 1] == "function") {
        let _ = e.length - 1;
        e[_] = $r.from(e[_]);
      }
      for (let _ = 0; _ < e.length; ++_)
        if (!(!Dr(e[_]) && !gi(e[_]))) {
          if (_ < e.length - 1 && !(el(e[_]) || nl(e[_]) || nt(e[_])))
            throw new il(`streams[${_}]`, r[_], "must be readable");
          if (_ > 0 && !(tl(e[_]) || rl(e[_]) || nt(e[_])))
            throw new il(`streams[${_}]`, r[_], "must be writable");
        }
      let n, i, s, o, a;
      function l(_) {
        let y = o;
        o = null, y ? y(_) : _ ? a.destroy(_) : !b && !f && a.destroy();
      }
      let u = e[0], d = bp(e, l), f = !!(tl(u) || rl(u) || nt(u)), b = !!(el(d) || nl(d) || nt(d));
      if (a = new $r({ writableObjectMode: !!(u != null && u.writableObjectMode), readableObjectMode: !!(d != null && d.readableObjectMode), writable: f, readable: b }), f) {
        if (Dr(u))
          a._write = function(y, g, m) {
            u.write(y, g) ? m() : n = m;
          }, a._final = function(y) {
            u.end(), i = y;
          }, u.on("drain", function() {
            if (n) {
              let y = n;
              n = null, y();
            }
          });
        else if (gi(u)) {
          let g = (nt(u) ? u.writable : u).getWriter();
          a._write = async function(m, w, R) {
            try {
              await g.ready, g.write(m).catch(() => {
              }), R();
            } catch (N) {
              R(N);
            }
          }, a._final = async function(m) {
            try {
              await g.ready, g.close().catch(() => {
              }), i = m;
            } catch (w) {
              m(w);
            }
          };
        }
        let _ = nt(d) ? d.readable : d;
        mp(_, () => {
          if (i) {
            let y = i;
            i = null, y();
          }
        });
      }
      if (b) {
        if (Dr(d))
          d.on("readable", function() {
            if (s) {
              let _ = s;
              s = null, _();
            }
          }), d.on("end", function() {
            a.push(null);
          }), a._read = function() {
            for (; ; ) {
              let _ = d.read();
              if (_ === null) {
                s = a._read;
                return;
              }
              if (!a.push(_))
                return;
            }
          };
        else if (gi(d)) {
          let y = (nt(d) ? d.readable : d).getReader();
          a._read = async function() {
            for (; ; )
              try {
                let { value: g, done: m } = await y.read();
                if (!a.push(g))
                  return;
                if (m) {
                  a.push(null);
                  return;
                }
              } catch {
                return;
              }
          };
        }
      }
      return a._destroy = function(_, y) {
        !_ && o !== null && (_ = new gp()), s = null, n = null, i = null, o === null ? y(_) : (o = y, Dr(d) && yp(d, _));
      }, a;
    };
  });
  var _l = A((yb, Si) => {
    "use strict";
    var xp = globalThis.AbortController || ct().AbortController, { codes: { ERR_INVALID_ARG_VALUE: Sp, ERR_INVALID_ARG_TYPE: Xt, ERR_MISSING_ARGS: Ep, ERR_OUT_OF_RANGE: Rp }, AbortError: we } = V(), { validateAbortSignal: it, validateInteger: ol, validateObject: st } = _t(), Ip = B().Symbol("kWeak"), Ap = B().Symbol("kResistStopPropagation"), { finished: Tp } = Ae(), Np = wi(), { addAbortSignalNoValidate: kp } = Wt(), { isWritable: Lp, isNodeStream: vp } = _e(), { deprecate: Bp } = Q(), { ArrayPrototypePush: Fp, Boolean: jp, MathFloor: al, Number: Pp, NumberIsNaN: Op, Promise: ll, PromiseReject: ul, PromiseResolve: Cp, PromisePrototypeThen: fl, Symbol: cl } = B(), qr = cl("kEmpty"), dl = cl("kEof");
    function Mp(t6, e) {
      if (e != null && st(e, "options"), e?.signal != null && it(e.signal, "options.signal"), vp(t6) && !Lp(t6))
        throw new Sp("stream", t6, "must be writable");
      let r = Np(this, t6);
      return e != null && e.signal && kp(e.signal, r), r;
    }
    function Ur(t6, e) {
      if (typeof t6 != "function")
        throw new Xt("fn", ["Function", "AsyncFunction"], t6);
      e != null && st(e, "options"), e?.signal != null && it(e.signal, "options.signal");
      let r = 1;
      e?.concurrency != null && (r = al(e.concurrency));
      let n = r - 1;
      return e?.highWaterMark != null && (n = al(e.highWaterMark)), ol(r, "options.concurrency", 1), ol(n, "options.highWaterMark", 0), n += r, async function* () {
        let s = Q().AbortSignalAny([e?.signal].filter(jp)), o = this, a = [], l = { signal: s }, u, d, f = false, b = 0;
        function _() {
          f = true, y();
        }
        function y() {
          b -= 1, g();
        }
        function g() {
          d && !f && b < r && a.length < n && (d(), d = null);
        }
        async function m() {
          try {
            for await (let w of o) {
              if (f)
                return;
              if (s.aborted)
                throw new we();
              try {
                if (w = t6(w, l), w === qr)
                  continue;
                w = Cp(w);
              } catch (R) {
                w = ul(R);
              }
              b += 1, fl(w, y, _), a.push(w), u && (u(), u = null), !f && (a.length >= n || b >= r) && await new ll((R) => {
                d = R;
              });
            }
            a.push(dl);
          } catch (w) {
            let R = ul(w);
            fl(R, y, _), a.push(R);
          } finally {
            f = true, u && (u(), u = null);
          }
        }
        m();
        try {
          for (; ; ) {
            for (; a.length > 0; ) {
              let w = await a[0];
              if (w === dl)
                return;
              if (s.aborted)
                throw new we();
              w !== qr && (yield w), a.shift(), g();
            }
            await new ll((w) => {
              u = w;
            });
          }
        } finally {
          f = true, d && (d(), d = null);
        }
      }.call(this);
    }
    function $p(t6 = void 0) {
      return t6 != null && st(t6, "options"), t6?.signal != null && it(t6.signal, "options.signal"), async function* () {
        let r = 0;
        for await (let i of this) {
          var n;
          if (t6 != null && (n = t6.signal) !== null && n !== void 0 && n.aborted)
            throw new we({ cause: t6.signal.reason });
          yield [r++, i];
        }
      }.call(this);
    }
    async function hl(t6, e = void 0) {
      for await (let r of xi.call(this, t6, e))
        return true;
      return false;
    }
    async function Dp(t6, e = void 0) {
      if (typeof t6 != "function")
        throw new Xt("fn", ["Function", "AsyncFunction"], t6);
      return !await hl.call(this, async (...r) => !await t6(...r), e);
    }
    async function qp(t6, e) {
      for await (let r of xi.call(this, t6, e))
        return r;
    }
    async function Up(t6, e) {
      if (typeof t6 != "function")
        throw new Xt("fn", ["Function", "AsyncFunction"], t6);
      async function r(n, i) {
        return await t6(n, i), qr;
      }
      for await (let n of Ur.call(this, r, e))
        ;
    }
    function xi(t6, e) {
      if (typeof t6 != "function")
        throw new Xt("fn", ["Function", "AsyncFunction"], t6);
      async function r(n, i) {
        return await t6(n, i) ? n : qr;
      }
      return Ur.call(this, r, e);
    }
    var mi = class extends Ep {
      constructor() {
        super("reduce"), this.message = "Reduce of an empty stream requires an initial value";
      }
    };
    async function Wp(t6, e, r) {
      var n;
      if (typeof t6 != "function")
        throw new Xt("reducer", ["Function", "AsyncFunction"], t6);
      r != null && st(r, "options"), r?.signal != null && it(r.signal, "options.signal");
      let i = arguments.length > 1;
      if (r != null && (n = r.signal) !== null && n !== void 0 && n.aborted) {
        let u = new we(void 0, { cause: r.signal.reason });
        throw this.once("error", () => {
        }), await Tp(this.destroy(u)), u;
      }
      let s = new xp(), o = s.signal;
      if (r != null && r.signal) {
        let u = { once: true, [Ip]: this, [Ap]: true };
        r.signal.addEventListener("abort", () => s.abort(), u);
      }
      let a = false;
      try {
        for await (let u of this) {
          var l;
          if (a = true, r != null && (l = r.signal) !== null && l !== void 0 && l.aborted)
            throw new we();
          i ? e = await t6(e, u, { signal: o }) : (e = u, i = true);
        }
        if (!a && !i)
          throw new mi();
      } finally {
        s.abort();
      }
      return e;
    }
    async function Gp(t6) {
      t6 != null && st(t6, "options"), t6?.signal != null && it(t6.signal, "options.signal");
      let e = [];
      for await (let n of this) {
        var r;
        if (t6 != null && (r = t6.signal) !== null && r !== void 0 && r.aborted)
          throw new we(void 0, { cause: t6.signal.reason });
        Fp(e, n);
      }
      return e;
    }
    function Hp(t6, e) {
      let r = Ur.call(this, t6, e);
      return async function* () {
        for await (let i of r)
          yield* i;
      }.call(this);
    }
    function pl(t6) {
      if (t6 = Pp(t6), Op(t6))
        return 0;
      if (t6 < 0)
        throw new Rp("number", ">= 0", t6);
      return t6;
    }
    function Qp(t6, e = void 0) {
      return e != null && st(e, "options"), e?.signal != null && it(e.signal, "options.signal"), t6 = pl(t6), async function* () {
        var n;
        if (e != null && (n = e.signal) !== null && n !== void 0 && n.aborted)
          throw new we();
        for await (let s of this) {
          var i;
          if (e != null && (i = e.signal) !== null && i !== void 0 && i.aborted)
            throw new we();
          t6-- <= 0 && (yield s);
        }
      }.call(this);
    }
    function zp(t6, e = void 0) {
      return e != null && st(e, "options"), e?.signal != null && it(e.signal, "options.signal"), t6 = pl(t6), async function* () {
        var n;
        if (e != null && (n = e.signal) !== null && n !== void 0 && n.aborted)
          throw new we();
        for await (let s of this) {
          var i;
          if (e != null && (i = e.signal) !== null && i !== void 0 && i.aborted)
            throw new we();
          if (t6-- > 0 && (yield s), t6 <= 0)
            return;
        }
      }.call(this);
    }
    Si.exports.streamReturningOperators = { asIndexedPairs: Bp($p, "readable.asIndexedPairs will be removed in a future version."), drop: Qp, filter: xi, flatMap: Hp, map: Ur, take: zp, compose: Mp };
    Si.exports.promiseReturningOperators = { every: Dp, forEach: Up, reduce: Wp, toArray: Gp, some: hl, find: qp };
  });
  var Ei = A((gb, bl) => {
    "use strict";
    var { ArrayPrototypePop: Vp, Promise: Jp } = B(), { isIterable: Kp, isNodeStream: Yp, isWebStream: Zp } = _e(), { pipelineImpl: Xp } = Mr(), { finished: e_ } = Ae();
    Ri();
    function t_(...t6) {
      return new Jp((e, r) => {
        let n, i, s = t6[t6.length - 1];
        if (s && typeof s == "object" && !Yp(s) && !Kp(s) && !Zp(s)) {
          let o = Vp(t6);
          n = o.signal, i = o.end;
        }
        Xp(t6, (o, a) => {
          o ? r(o) : e(a);
        }, { signal: n, end: i });
      });
    }
    bl.exports = { finished: e_, pipeline: t_ };
  });
  var Ri = A((wb, Il) => {
    var { Buffer: r_ } = Ee(), { ObjectDefineProperty: ke, ObjectKeys: wl, ReflectApply: ml } = B(), { promisify: { custom: xl } } = Q(), { streamReturningOperators: yl, promiseReturningOperators: gl } = _l(), { codes: { ERR_ILLEGAL_CONSTRUCTOR: Sl } } = V(), n_ = wi(), { setDefaultHighWaterMark: i_, getDefaultHighWaterMark: s_ } = Gt(), { pipeline: El } = Mr(), { destroyer: o_ } = Ze(), Rl = Ae(), Ii = Ei(), er = _e(), L = Il.exports = xr().Stream;
    L.isDestroyed = er.isDestroyed;
    L.isDisturbed = er.isDisturbed;
    L.isErrored = er.isErrored;
    L.isReadable = er.isReadable;
    L.isWritable = er.isWritable;
    L.Readable = zt();
    for (let t6 of wl(yl)) {
      let r = function(...n) {
        if (new.target)
          throw Sl();
        return L.Readable.from(ml(e, this, n));
      };
      Ai = r;
      let e = yl[t6];
      ke(r, "name", { __proto__: null, value: e.name }), ke(r, "length", { __proto__: null, value: e.length }), ke(L.Readable.prototype, t6, { __proto__: null, value: r, enumerable: false, configurable: true, writable: true });
    }
    var Ai;
    for (let t6 of wl(gl)) {
      let r = function(...i) {
        if (new.target)
          throw Sl();
        return ml(e, this, i);
      };
      Ai = r;
      let e = gl[t6];
      ke(r, "name", { __proto__: null, value: e.name }), ke(r, "length", { __proto__: null, value: e.length }), ke(L.Readable.prototype, t6, { __proto__: null, value: r, enumerable: false, configurable: true, writable: true });
    }
    var Ai;
    L.Writable = jr();
    L.Duplex = ge();
    L.Transform = oi();
    L.PassThrough = li();
    L.pipeline = El;
    var { addAbortSignal: a_ } = Wt();
    L.addAbortSignal = a_;
    L.finished = Rl;
    L.destroy = o_;
    L.compose = n_;
    L.setDefaultHighWaterMark = i_;
    L.getDefaultHighWaterMark = s_;
    ke(L, "promises", { __proto__: null, configurable: true, enumerable: true, get() {
      return Ii;
    } });
    ke(El, xl, { __proto__: null, enumerable: true, get() {
      return Ii.pipeline;
    } });
    ke(Rl, xl, { __proto__: null, enumerable: true, get() {
      return Ii.finished;
    } });
    L.Stream = L;
    L._isUint8Array = function(e) {
      return e instanceof Uint8Array;
    };
    L._uint8ArrayToBuffer = function(e) {
      return r_.from(e.buffer, e.byteOffset, e.byteLength);
    };
  });
  var Wr = A((mb, C) => {
    "use strict";
    var D = Ri(), l_ = Ei(), u_ = D.Readable.destroy;
    C.exports = D.Readable;
    C.exports._uint8ArrayToBuffer = D._uint8ArrayToBuffer;
    C.exports._isUint8Array = D._isUint8Array;
    C.exports.isDisturbed = D.isDisturbed;
    C.exports.isErrored = D.isErrored;
    C.exports.isReadable = D.isReadable;
    C.exports.Readable = D.Readable;
    C.exports.Writable = D.Writable;
    C.exports.Duplex = D.Duplex;
    C.exports.Transform = D.Transform;
    C.exports.PassThrough = D.PassThrough;
    C.exports.addAbortSignal = D.addAbortSignal;
    C.exports.finished = D.finished;
    C.exports.destroy = D.destroy;
    C.exports.destroy = u_;
    C.exports.pipeline = D.pipeline;
    C.exports.compose = D.compose;
    Object.defineProperty(D, "promises", { configurable: true, enumerable: true, get() {
      return l_;
    } });
    C.exports.Stream = D.Stream;
    C.exports.default = C.exports;
  });
  var Vr = JSON.stringify;
  var Bi = (t6, e = null, r = "") => {
    let n = /* @__PURE__ */ new WeakMap(), i = "", s = "";
    if (typeof r == "number" ? i += " ".repeat(r) : typeof r == "string" && (i = r), e && typeof e != "function" && (typeof e != "object" || typeof e.length != "number"))
      throw new Error("JSONTag.stringify");
    let o = (u) => {
      let d = s;
      s += i;
      let f = "", b = "", _ = Object.keys(u);
      Array.isArray(e) && (_ = _.filter((g) => e.indexOf(g) !== -1)), s && (f = `
` + s, b = `
` + d);
      let y = f + _.map((g) => '"' + g + '":' + l(g, u)).join("," + f) + b;
      return s = d, y;
    }, a = (u) => {
      let d = s;
      s += i;
      let f = "", b = "";
      s && (f = `
` + s, b = `
` + d);
      let _ = f + u.map((y, g) => l(g, u)).join("," + f) + b;
      return s = d, _;
    }, l = (u, d) => {
      let f = d[u];
      if (typeof e == "function" && u !== "" && (f = e.call(d, u, f)), typeof f == "object" && n.has(f)) {
        let b = Jr(f, "id");
        return b || (b = $l(f)), '<link>"' + b + '"';
      }
      if (typeof f > "u" || f === null)
        return "null";
      if (typeof f == "object" && n.set(f, true), typeof f.toJSONTag == "function")
        return f.toJSONTag(n, e, r);
      if (Array.isArray(f))
        return ae(f) + "[" + a(f) + "]";
      if (f instanceof Object)
        switch (le(f)) {
          case "string":
          case "decimal":
          case "money":
          case "link":
          case "text":
          case "blob":
          case "color":
          case "email":
          case "hash":
          case "duration":
          case "phone":
          case "url":
          case "uuid":
          case "date":
          case "time":
          case "datetime":
            return ae(f) + Vr("" + f, e, r);
          case "int":
          case "uint":
          case "int8":
          case "uint8":
          case "int16":
          case "uint16":
          case "int32":
          case "uint32":
          case "int64":
          case "uint64":
          case "float":
          case "float32":
          case "float64":
          case "timestamp":
          case "number":
          case "boolean":
            return ae(f) + Vr(f, e, r);
          case "array":
            let b = a(f);
            return ae(f) + "[" + b + "}";
          case "object":
            if (f === null)
              return "null";
            let _ = o(f);
            return ae(f) + "{" + _ + "}";
          default:
            throw new Error(le(f) + " type not yet implemented");
        }
      else
        return Vr(f, e, r);
    };
    return l("", { "": t6 });
  };
  function $l(t6) {
    if (typeof crypto > "u")
      throw console.error("JSONTag: cannot generate uuid, crypto support is disabled."), new Error("Cannot create links to resolve references, crypto support is disabled");
    if (typeof crypto.randomUUID == "function")
      var e = crypto.randomUUID();
    else
      var e = ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (n) => (n ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> n / 4).toString(16));
    return Lt(t6, "id", e), e;
  }
  var Fi = (t6) => t6 === null || typeof t6.isNull < "u" && t6.isNull;
  globalThis.JSONTagTypeInfo || (globalThis.JSONTagTypeInfo = /* @__PURE__ */ new WeakMap());
  var Z = globalThis.JSONTagTypeInfo;
  var le = (t6) => {
    if (Z.has(t6)) {
      let e = Z.get(t6);
      if (e.type)
        return e.type;
    }
    return Array.isArray(t6) ? "array" : typeof t6;
  };
  var Dl = ["object", "array", "string", "number", "boolean", "decimal", "money", "uuid", "url", "link", "date", "time", "datetime", "duration", "timestamp", "text", "blob", "color", "email", "hash", "phone", "int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16", "uint32", "uint64", "float", "float32", "float64"];
  var $e = (t6, e) => {
    if (typeof t6 != "object")
      throw new TypeError("JSONTag can only add attributes to objects, convert literals to objects first");
    let r = {};
    if (Z.has(t6) && (r = Z.get(t6)), !Dl.includes(e))
      throw new TypeError("unknown type " + e);
    r.type = e, typeof r.attributes > "u" && (r.attributes = {}), Z.set(t6, r);
  };
  var Lt = (t6, e, r) => {
    if (typeof t6 != "object")
      throw new TypeError("JSONTag can only add attributes to objects, convert literals to objects first");
    if (Array.isArray(r) && (r = r.join(" ")), typeof r != "string")
      throw new TypeError("attribute values must be a string or an array of strings");
    if (r.indexOf('"') !== -1)
      throw new TypeError('attribute values must not contain " character');
    r.indexOf(" ") !== -1 && (r = r.split(" "));
    let n = Z.get(t6) || { attributes: {} };
    n.attributes[e] = r, Z.set(t6, n);
  };
  var vt = (t6, e) => {
    if (typeof t6 != "object")
      throw new TypeError("JSONTag can only add attributes to objects, convert literals to objects first");
    if (typeof e != "object")
      throw new TypeError("attributes param must be an object");
    Object.keys(e).forEach((r) => {
      Lt(t6, r, e[r]);
    });
  };
  var Jr = (t6, e) => (Z.get(t6) || { attributes: {} }).attributes[e];
  var ji = (t6, e, r) => {
    if (typeof r != "string")
      throw new TypeError("attribute values must be a string");
    if (r.indexOf('"') !== -1)
      throw new TypeError('attribute values must not contain " characters');
    let n = Z.get(t6) || { attributes: {} };
    typeof n.attributes[e] > "u" ? Lt(t6, e, r) : (Array.isArray(n.attributes[e]) || (n.attributes[e] = [n.attributes[e]]), r.indexOf(" ") !== -1 ? r = r.split(" ") : r = [r], n.attributes[e] = n.attributes[e].concat(r), Z.set(t6, n));
  };
  var Pi = (t6, e) => {
    let r = Z.get(t6) || { attributes: {} };
    typeof r.attributes[e] < "u" && (delete r.attributes[e], Z.set(t6, r));
  };
  var Bt = (t6) => {
    let e = Z.get(t6) || { attributes: {} };
    return Object.assign({}, e.attributes);
  };
  var ir = (t6) => Object.entries(Bt(t6)).map(([e, r]) => (Array.isArray(r) && (r = r.join(" ")), e + '="' + r + '"')).join(" ");
  var ae = (t6) => {
    let e = le(t6), r = Bt(t6), n = Object.entries(r).map(([i, s]) => (Array.isArray(s) && (s = s.join(" ")), i + '="' + s + '"')).join(" ");
    return n || ["object", "array", "string", "number", "boolean"].indexOf(e) !== -1 && (e = ""), e || n ? "<" + [e, n].filter(Boolean).join(" ") + ">" : "";
  };
  function ql(t6) {
    return t6 instanceof Number ? new Number(t6) : t6 instanceof Boolean ? new Boolean(t6) : t6 instanceof String ? new String(t6) : Array.isArray(t6) ? [...t6] : { ...t6 };
  }
  var Oi = (t6) => {
    let e = ae(t6), r = le(t6), n = Bt(t6), i = ql(t6);
    return e && ($e(i, r), n && vt(i, n)), i;
  };
  var Ft = class t {
    #e;
    constructor(e) {
      if (typeof e != "string")
        throw new Error("not a url:", e);
      this.#e = "" + e, $e(this, "link");
    }
    static from(e) {
      if (e instanceof t)
        return e;
      if (typeof e != "string")
        throw new Error("not a url:", e);
      return new t(e);
    }
    get value() {
      return this.#e;
    }
    toString() {
      return this.#e;
    }
    toJSON() {
      return '"' + this.#e + '"';
    }
    toJSONTag() {
      let e = ir(this);
      return "<link" + (e ? " " + e : "") + ">" + this.toJSON();
    }
  };
  var Kr = class {
    constructor() {
      return new Proxy(this, { get: (e, r) => {
        if (typeof e[r] < "u")
          return e[r];
        if (r != "then")
          throw console.error("Attempting to get from Null", r, typeof r, JSON.stringify(r)), new Error("Attempting to get " + r + " from Null");
      }, set: (e, r, n) => {
        throw console.error("Attempting to set " + r + " in Null to", n), new Error("Attempting to set " + r + " in Null");
      } });
    }
  };
  var De = class extends Kr {
    isNull = true;
    toString() {
      return "";
    }
    toJSON() {
      return "null";
    }
    toJSONTag() {
      return ae(this) + this.toJSON();
    }
  };
  function Yr(t6, e, r) {
    r || (r = {}), r.index || (r.index = {}), r.index.id || (r.index.id = /* @__PURE__ */ new Map()), r.unresolved || (r.unresolved = /* @__PURE__ */ new Map()), r.baseURL || (r.baseURL = "http://localhost/");
    let n, i, s, o, a = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: `
`, r: "\r", t: "	" }, l = function(p) {
      let c = t6.substring(n - 100, n + 100);
      throw { name: "SyntaxError", message: p, at: n, input: c };
    }, u = function(p) {
      return p && p !== i && l("Expected '" + p + "' instead of '" + i + "'"), i = t6.charAt(n), n += 1, i;
    }, d = function(p) {
      let c = "";
      for (i === "-" && (c = "-", u("-")); i >= "0" && i <= "9"; )
        c += i, u();
      if (i === ".")
        for (c += "."; u() && i >= "0" && i <= "9"; )
          c += i;
      if (i === "e" || i === "E")
        for (c += i, u(), (i === "-" || i === "+") && (c += i, u()); i >= "0" && i <= "9"; )
          c += i, u();
      let x = new Number(c).valueOf();
      if (p)
        switch (p) {
          case "int":
            y(c);
            break;
          case "uint":
            y(c, [0, 1 / 0]);
            break;
          case "int8":
            y(c, [-128, 127]);
            break;
          case "uint8":
            y(c, [0, 255]);
            break;
          case "int16":
            y(c, [-32768, 32767]);
            break;
          case "uint16":
            y(c, [0, 65535]);
            break;
          case "int32":
            y(c, [-2147483648, 2147483647]);
            break;
          case "uint32":
            y(c, [0, 4294967295]);
            break;
          case "timestamp":
          case "int64":
            y(c, [-9223372036854776e3, 9223372036854776e3]);
            break;
          case "uint64":
            y(c, [0, 18446744073709552e3]);
            break;
          case "float":
            _(c);
            break;
          case "float32":
            _(c, [-34e37, 34e37]);
            break;
          case "float64":
            _(c, [-17e307, 17e307]);
            break;
          case "number":
            break;
          default:
            f(p, c);
            break;
        }
      return x;
    }, f = function(p, c) {
      l("Syntax error, expected " + p + ", got: " + c);
    }, b = { color: /^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i, email: /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, decimal: /^\d*\.?\d*$/, money: /^[A-Z]+\$\d*\.?\d*$/, duration: /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/, phone: /^[+]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?)(?:[ -]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?))*(?:[ ]?(?:x|ext)\.?[ ]?\d{1,5})?$/, time: /^(\d{2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?$/, date: /^-?[1-9][0-9]{3,}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])$/, datetime: /^(\d{4,})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?Z?$/, range: /^\[-?(\d+\.)?\d+\,-?(\d+\.)?\d+\]$/ }, _ = function(p, c) {
      let x = new Number(parseFloat(p)), k = x.toString();
      p !== k && l("Syntax Error: expected float value"), c && (typeof c[0] == "number" && x < c[0] && l("Syntax Error: float value out of range"), typeof c[1] == "number" && x > c[1] && l("Syntax Error: float value out of range"));
    }, y = function(p, c) {
      let x = new Number(parseInt(p)), k = x.toString();
      p !== k && l("Syntax Error: expected integer value"), c && (typeof c[0] == "number" && x < c[0] && l("Syntax Error: integer value out of range"), typeof c[1] == "number" && x > c[1] && l("Syntax Error: integer value out of range"));
    }, g = function(p) {
      let c = false;
      return p.charAt(0) === "#" ? (p = p.substring(1), c = [3, 4, 6, 8].indexOf(p.length) > -1 && !isNaN(parseInt(p, 16)), c.toString(16) !== p && f("color", p)) : c = b.color.test(p), c || f("color", p), true;
    }, m = function(p) {
      return b.email.test(p) || f("email", p), true;
    }, w = function(p) {
      return b.uuid.test(p) || f("uuid", p), true;
    }, R = function(p) {
      return b.decimal.test(p) || f("decimal", p), true;
    }, N = function(p) {
      return b.money.test(p) || f("money", p), true;
    }, S = function(p) {
      try {
        return !!new URL(p, r.baseURL);
      } catch (c) {
        console.log(c), f("url", p);
      }
    }, j = function(p) {
      return b.duration.test(p) || f("duration", p), true;
    }, me = function(p) {
      return b.phone.test(p) || f("phone", p), true;
    }, J = function(p) {
      return b.range.test(p) || f("range", p), true;
    }, Le = function(p) {
      return b.time.test(p) || f("time", p), true;
    }, W = function(p) {
      return b.date.test(p) || f("date", p), true;
    }, ne = function(p) {
      return b.datetime.test(p) || f("datetime", p), true;
    }, Nt = function(p, c) {
      if (p) {
        switch (p) {
          case "object":
          case "array":
          case "int8":
          case "uint8":
          case "int16":
          case "uint16":
          case "int32":
          case "uint32":
          case "int64":
          case "uint64":
          case "int":
          case "uint":
          case "float32":
          case "float64":
          case "float":
          case "timestamp":
            f(p, c);
            break;
          case "uuid":
            return w(c);
          case "decimal":
            return R(c);
          case "money":
            return N(c);
          case "url":
            return S(c);
          case "link":
          case "string":
          case "text":
          case "blob":
          case "hash":
            return true;
          case "color":
            return g(c);
          case "email":
            return m(c);
          case "duration":
            return j(c);
          case "phone":
            return me(c);
          case "range":
            return J(c);
          case "time":
            return Le(c);
          case "date":
            return W(c);
          case "datetime":
            return ne(c);
        }
        l("Syntax error: unknown tagName " + p);
      }
    }, kt = function(p) {
      let c = "", x, k, M;
      for (i !== '"' && l("Syntax Error"), u('"'); i; ) {
        if (i === '"')
          return u(), Nt(p, c), c;
        if (i === "\\")
          if (u(), i === "u") {
            for (M = 0, k = 0; k < 4 && (x = parseInt(u(), 16), !!isFinite(x)); k++)
              M = M * 16 + x;
            c += String.fromCharCode(M), u();
          } else if (typeof a[i] == "string")
            c += a[i], u();
          else
            break;
        else
          c += i, u();
      }
      l("Syntax error: incomplete string");
    }, oe = function() {
      let p, c, x = { attributes: {} };
      for (i !== "<" && l("Syntax Error"), u("<"), p = Hr(), p || l("Syntax Error: expected tag name"), x.tagName = p, K(); i; ) {
        if (i === ">")
          return u(">"), x;
        p = Hr(), p || l("Syntax Error: expected attribute name"), K(), u("="), K(), c = kt(), x.attributes[p] = c, K();
      }
      l("Syntax Error: unexpected end of input");
    }, K = function() {
      for (; i; )
        switch (i) {
          case " ":
          case "	":
          case "\r":
          case `
`:
            u();
            break;
          default:
            return;
        }
    }, Hr = function() {
      let p = "";
      for (i >= "a" && i <= "z" || i >= "A" && i <= "Z" ? (p += i, u()) : l("Syntax Error: expected word"); i >= "a" && i <= "z" || i >= "A" && i <= "Z" || i >= "0" && i <= "9" || i == "_"; )
        p += i, u();
      return p;
    }, kl = function(p) {
      let c = Hr();
      switch ((!c || typeof c != "string") && l('Syntax error: expected boolean or null, got "' + c + '"'), c.toLowerCase()) {
        case "true":
          return p && p !== "boolean" && f(p, c), true;
          break;
        case "false":
          return p && p !== "boolean" && f(p, c), false;
          break;
        case "null":
          return null;
        default:
          l('Syntax error: expected boolean or null, got "' + c + '"');
          break;
      }
    }, Qr = function(p, c, x) {
      if (le(p) === "link") {
        let k = "" + p, M = r.unresolved.get(k);
        typeof M > "u" && (r.unresolved.set(k, []), M = r.unresolved.get(k));
        let G = M.push({ src: new WeakRef(c), key: x });
      }
    }, Ll = function() {
      let p, c = [];
      if (i !== "[" && l("Syntax error"), u("["), K(), i === "]")
        return u("]"), c;
      for (; i; ) {
        if (p = s(), Qr(p, c, c.length), c.push(p), K(), i === "]")
          return u("]"), c;
        u(","), K();
      }
      l("Input stopped early");
    }, vl = function() {
      let p, c, x = {};
      if (i !== "{" && l("Syntax Error"), u("{"), K(), i === "}")
        return u("}"), x;
      for (; i; ) {
        if (p = kt(), p === "__proto__" && l("Attempt at prototype pollution"), K(), u(":"), c = s(), x[p] = c, Qr(c, x, p), K(), i === "}")
          return u("}"), x;
        u(","), K();
      }
      l("Input stopped early");
    };
    if (s = function() {
      let p, c, x;
      switch (K(), i === "<" && (p = oe(), x = p.tagName, K()), i) {
        case "{":
          x && x !== "object" && f(x, i), c = vl();
          break;
        case "[":
          x && x !== "array" && f(x, i), c = Ll();
          break;
        case '"':
          c = kt(x);
          break;
        case "-":
          c = d(x);
          break;
        default:
          i >= "0" && i <= "9" ? c = d(x) : c = kl(x);
          break;
      }
      if (p) {
        if (c === null && (c = new De()), typeof c != "object")
          switch (typeof c) {
            case "string":
              c = new String(c);
              break;
            case "number":
              c = new Number(c);
              break;
            default:
              l("Syntax Error: unexpected type " + typeof c);
              break;
          }
        p.tagName && $e(c, p.tagName), p.attributes && (vt(c, p.attributes), p.attributes?.id && r.index.id.set(p.attributes.id, new WeakRef(c)));
      }
      return c;
    }, n = 0, i = " ", o = s(), K(), i && l("Syntax error"), typeof e == "function") {
      let p = function(c, x) {
        var k, M, G = c[x];
        if (G !== null && typeof G == "object" && !(G instanceof String || G instanceof Number || G instanceof Boolean))
          for (k in G)
            Object.prototype.hasOwnProperty.call(G, k) && (M = p(G, k), M !== void 0 && (typeof G[k] > "u" || G[k] !== M) ? (G[k] = M, le(M) === "link" && Qr(M, G, k)) : M === void 0 && delete G[k]);
        return e.call(c, x, G, r);
      };
      p({ "": o }, "");
    }
    let vi = function(p, c) {
      if (typeof c < "u") {
        let x = p.src.deref();
        if (typeof x < "u" && le(x[p.key]) === "link")
          return x[p.key] = c, true;
      }
    };
    return r.index.id.size > r.unresolved.size ? r.unresolved.forEach((p, c) => {
      let x = r.index.id.get(c)?.deref();
      x !== void 0 && p.forEach((k, M) => {
        vi(k, x) && delete p[M];
      });
    }) : r.index.id.forEach((p, c) => {
      let x = p.deref(), k = r.unresolved.get(c);
      x !== void 0 && typeof k < "u" && (k.forEach((M, G) => {
        vi(M, x);
      }), r.unresolved.delete(c));
    }), o;
  }
  var v = class t2 {
    static {
      t2.stringify = Bi, t2.parse = Yr, t2.getType = le, t2.setType = $e, t2.getTypeString = ae, t2.setAttribute = Lt, t2.getAttribute = Jr, t2.addAttribute = ji, t2.removeAttribute = Pi, t2.getAttributes = Bt, t2.setAttributes = vt, t2.getAttributesString = ir, t2.isNull = Fi, t2.clone = Oi, t2.Link = Ft, t2.Null = De;
    }
  };
  var jt = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  var Pt = "http://www.w3.org/2001/XMLSchema#";
  var Zr = "http://www.w3.org/2000/10/swap/";
  var P = { xsd: { decimal: `${Pt}decimal`, boolean: `${Pt}boolean`, double: `${Pt}double`, integer: `${Pt}integer`, string: `${Pt}string` }, rdf: { type: `${jt}type`, nil: `${jt}nil`, first: `${jt}first`, rest: `${jt}rest`, langString: `${jt}langString` }, owl: { sameAs: "http://www.w3.org/2002/07/owl#sameAs" }, r: { forSome: `${Zr}reify#forSome`, forAll: `${Zr}reify#forAll` }, log: { implies: `${Zr}log#implies` } };
  var Ui = nr(Di());
  var { xsd: sr } = P;
  var Ul = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g;
  var qi = { "\\": "\\", "'": "'", '"': '"', n: `
`, r: "\r", t: "	", f: "\f", b: "\b", _: "_", "~": "~", ".": ".", "-": "-", "!": "!", $: "$", "&": "&", "(": "(", ")": ")", "*": "*", "+": "+", ",": ",", ";": ";", "=": "=", "/": "/", "?": "?", "#": "#", "@": "@", "%": "%" };
  var Wl = /[\x00-\x20<>\\"\{\}\|\^\`]/;
  var Gl = { _iri: true, _unescapedIri: true, _simpleQuotedString: true, _langcode: true, _blank: true, _newline: true, _comment: true, _whitespace: true, _endOfFile: true };
  var Hl = /$0^/;
  var qe = class {
    constructor(e) {
      if (this._iri = /^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/, this._unescapedIri = /^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/, this._simpleQuotedString = /^"([^"\\\r\n]*)"(?=[^"])/, this._simpleApostropheString = /^'([^'\\\r\n]*)'(?=[^'])/, this._langcode = /^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9\-])/i, this._prefix = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/, this._prefixed = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/, this._variable = /^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/, this._blank = /^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/, this._number = /^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/, this._boolean = /^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/, this._keyword = /^@[a-z]+(?=[\s#<:])/i, this._sparqlKeyword = /^(?:PREFIX|BASE|GRAPH)(?=[\s#<])/i, this._shortPredicates = /^a(?=[\s#()\[\]\{\}"'<>])/, this._newline = /^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/, this._comment = /#([^\n\r]*)/, this._whitespace = /^[ \t]+/, this._endOfFile = /^(?:#[^\n\r]*)?$/, e = e || {}, this._lineMode = !!e.lineMode) {
        this._n3Mode = false;
        for (let r in this)
          !(r in Gl) && this[r] instanceof RegExp && (this[r] = Hl);
      } else
        this._n3Mode = e.n3 !== false;
      this._comments = !!e.comments, this._literalClosingPos = 0;
    }
    _tokenizeToEnd(e, r) {
      let n = this._input, i = n.length;
      for (; ; ) {
        let a, l;
        for (; a = this._newline.exec(n); )
          this._comments && (l = this._comment.exec(a[0])) && s("comment", l[1], "", this._line, a[0].length), n = n.substr(a[0].length, n.length), i = n.length, this._line++;
        if (!a && (a = this._whitespace.exec(n)) && (n = n.substr(a[0].length, n.length)), this._endOfFile.test(n))
          return r && (this._comments && (l = this._comment.exec(n)) && s("comment", l[1], "", this._line, n.length), n = null, s("eof", "", "", this._line, 0)), this._input = n;
        let u = this._line, d = n[0], f = "", b = "", _ = "", y = null, g = 0, m = false;
        switch (d) {
          case "^":
            if (n.length < 3)
              break;
            if (n[1] === "^") {
              if (this._previousMarker = "^^", n = n.substr(2), n[0] !== "<") {
                m = true;
                break;
              }
            } else {
              this._n3Mode && (g = 1, f = "^");
              break;
            }
          case "<":
            if (y = this._unescapedIri.exec(n))
              f = "IRI", b = y[1];
            else if (y = this._iri.exec(n)) {
              if (b = this._unescape(y[1]), b === null || Wl.test(b))
                return o(this);
              f = "IRI";
            } else
              n.length > 1 && n[1] === "<" ? (f = "<<", g = 2) : this._n3Mode && n.length > 1 && n[1] === "=" && (f = "inverse", g = 2, b = ">");
            break;
          case ">":
            n.length > 1 && n[1] === ">" && (f = ">>", g = 2);
            break;
          case "_":
            ((y = this._blank.exec(n)) || r && (y = this._blank.exec(`${n} `))) && (f = "blank", _ = "_", b = y[1]);
            break;
          case '"':
            if (y = this._simpleQuotedString.exec(n))
              b = y[1];
            else if ({ value: b, matchLength: g } = this._parseLiteral(n), b === null)
              return o(this);
            (y !== null || g !== 0) && (f = "literal", this._literalClosingPos = 0);
            break;
          case "'":
            if (!this._lineMode) {
              if (y = this._simpleApostropheString.exec(n))
                b = y[1];
              else if ({ value: b, matchLength: g } = this._parseLiteral(n), b === null)
                return o(this);
              (y !== null || g !== 0) && (f = "literal", this._literalClosingPos = 0);
            }
            break;
          case "?":
            this._n3Mode && (y = this._variable.exec(n)) && (f = "var", b = y[0]);
            break;
          case "@":
            this._previousMarker === "literal" && (y = this._langcode.exec(n)) ? (f = "langcode", b = y[1]) : (y = this._keyword.exec(n)) && (f = y[0]);
            break;
          case ".":
            if (n.length === 1 ? r : n[1] < "0" || n[1] > "9") {
              f = ".", g = 1;
              break;
            }
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
          case "+":
          case "-":
            (y = this._number.exec(n) || r && (y = this._number.exec(`${n} `))) && (f = "literal", b = y[0], _ = typeof y[1] == "string" ? sr.double : typeof y[2] == "string" ? sr.decimal : sr.integer);
            break;
          case "B":
          case "b":
          case "p":
          case "P":
          case "G":
          case "g":
            (y = this._sparqlKeyword.exec(n)) ? f = y[0].toUpperCase() : m = true;
            break;
          case "f":
          case "t":
            (y = this._boolean.exec(n)) ? (f = "literal", b = y[0], _ = sr.boolean) : m = true;
            break;
          case "a":
            (y = this._shortPredicates.exec(n)) ? (f = "abbreviation", b = "a") : m = true;
            break;
          case "=":
            this._n3Mode && n.length > 1 && (f = "abbreviation", n[1] !== ">" ? (g = 1, b = "=") : (g = 2, b = ">"));
            break;
          case "!":
            if (!this._n3Mode)
              break;
          case ",":
          case ";":
          case "[":
          case "]":
          case "(":
          case ")":
          case "}":
            this._lineMode || (g = 1, f = d);
            break;
          case "{":
            !this._lineMode && n.length >= 2 && (n[1] === "|" ? (f = "{|", g = 2) : (f = d, g = 1));
            break;
          case "|":
            n.length >= 2 && n[1] === "}" && (f = "|}", g = 2);
            break;
          default:
            m = true;
        }
        if (m && ((this._previousMarker === "@prefix" || this._previousMarker === "PREFIX") && (y = this._prefix.exec(n)) ? (f = "prefix", b = y[1] || "") : ((y = this._prefixed.exec(n)) || r && (y = this._prefixed.exec(`${n} `))) && (f = "prefixed", _ = y[1] || "", b = this._unescape(y[2]))), this._previousMarker === "^^")
          switch (f) {
            case "prefixed":
              f = "type";
              break;
            case "IRI":
              f = "typeIRI";
              break;
            default:
              f = "";
          }
        if (!f)
          return r || !/^'''|^"""/.test(n) && /\n|\r/.test(n) ? o(this) : this._input = n;
        let w = g || y[0].length, R = s(f, b, _, u, w);
        this.previousToken = R, this._previousMarker = f, n = n.substr(w, n.length);
      }
      function s(a, l, u, d, f) {
        let b = n ? i - n.length : i, _ = b + f, y = { type: a, value: l, prefix: u, line: d, start: b, end: _ };
        return e(null, y), y;
      }
      function o(a) {
        e(a._syntaxError(/^\S*/.exec(n)[0]));
      }
    }
    _unescape(e) {
      let r = false, n = e.replace(Ul, (i, s, o, a) => {
        if (typeof s == "string")
          return String.fromCharCode(Number.parseInt(s, 16));
        if (typeof o == "string") {
          let l = Number.parseInt(o, 16);
          return l <= 65535 ? String.fromCharCode(Number.parseInt(o, 16)) : String.fromCharCode(55296 + ((l -= 65536) >> 10), 56320 + (l & 1023));
        }
        return a in qi ? qi[a] : (r = true, "");
      });
      return r ? null : n;
    }
    _parseLiteral(e) {
      if (e.length >= 3) {
        let r = e.match(/^(?:"""|"|'''|'|)/)[0], n = r.length, i = Math.max(this._literalClosingPos, n);
        for (; (i = e.indexOf(r, i)) > 0; ) {
          let s = 0;
          for (; e[i - s - 1] === "\\"; )
            s++;
          if (s % 2 === 0) {
            let o = e.substring(n, i), a = o.split(/\r\n|\r|\n/).length - 1, l = i + n;
            if (n === 1 && a !== 0 || n === 3 && this._lineMode)
              break;
            return this._line += a, { value: this._unescape(o), matchLength: l };
          }
          i++;
        }
        this._literalClosingPos = e.length - n + 1;
      }
      return { value: "", matchLength: 0 };
    }
    _syntaxError(e) {
      this._input = null;
      let r = new Error(`Unexpected "${e}" on line ${this._line}.`);
      return r.context = { token: void 0, line: this._line, previousToken: this.previousToken }, r;
    }
    _readStartingBom(e) {
      return e.startsWith("\uFEFF") ? e.substr(1) : e;
    }
    tokenize(e, r) {
      if (this._line = 1, typeof e == "string")
        if (this._input = this._readStartingBom(e), typeof r == "function")
          (0, Ui.default)(() => this._tokenizeToEnd(r, true));
        else {
          let n = [], i;
          if (this._tokenizeToEnd((s, o) => s ? i = s : n.push(o), true), i)
            throw i;
          return n;
        }
      else
        this._pendingBuffer = null, typeof e.setEncoding == "function" && e.setEncoding("utf8"), e.on("data", (n) => {
          this._input !== null && n.length !== 0 && (this._pendingBuffer && (n = Buffer.concat([this._pendingBuffer, n]), this._pendingBuffer = null), n[n.length - 1] & 128 ? this._pendingBuffer = n : (typeof this._input > "u" ? this._input = this._readStartingBom(typeof n == "string" ? n : n.toString()) : this._input += n, this._tokenizeToEnd(r, false)));
        }), e.on("end", () => {
          typeof this._input == "string" && this._tokenizeToEnd(r, true);
        }), e.on("error", r);
    }
  };
  var Xr = {};
  Cl(Xr, { inDefaultGraph: () => Kl, isBlankNode: () => zl, isDefaultGraph: () => xe, isLiteral: () => Vl, isNamedNode: () => Ql, isVariable: () => Jl, prefix: () => Yl, prefixes: () => Wi });
  function Ql(t6) {
    return !!t6 && t6.termType === "NamedNode";
  }
  function zl(t6) {
    return !!t6 && t6.termType === "BlankNode";
  }
  function Vl(t6) {
    return !!t6 && t6.termType === "Literal";
  }
  function Jl(t6) {
    return !!t6 && t6.termType === "Variable";
  }
  function xe(t6) {
    return !!t6 && t6.termType === "DefaultGraph";
  }
  function Kl(t6) {
    return xe(t6.graph);
  }
  function Yl(t6, e) {
    return Wi({ "": t6.value || t6 }, e)("");
  }
  function Wi(t6, e) {
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in t6)
      n(i, t6[i]);
    e = e || ue;
    function n(i, s) {
      if (typeof s == "string") {
        let o = /* @__PURE__ */ Object.create(null);
        r[i] = (a) => o[a] || (o[a] = e.namedNode(s + a));
      } else if (!(i in r))
        throw new Error(`Unknown prefix: ${i}`);
      return r[i];
    }
    return n;
  }
  var { rdf: Zl, xsd: Ue } = P;
  var $t;
  var Xl = 0;
  var en = { namedNode: eu, blankNode: tu, variable: nu, literal: ru, defaultGraph: iu, quad: Gi, triple: Gi };
  var ue = en;
  var X = class t3 {
    constructor(e) {
      this.id = e;
    }
    get value() {
      return this.id;
    }
    equals(e) {
      return e instanceof t3 ? this.id === e.id : !!e && this.termType === e.termType && this.value === e.value;
    }
    hashCode() {
      return 0;
    }
    toJSON() {
      return { termType: this.termType, value: this.value };
    }
  };
  var ot = class extends X {
    get termType() {
      return "NamedNode";
    }
  };
  var Be = class t4 extends X {
    get termType() {
      return "Literal";
    }
    get value() {
      return this.id.substring(1, this.id.lastIndexOf('"'));
    }
    get language() {
      let e = this.id, r = e.lastIndexOf('"') + 1;
      return r < e.length && e[r++] === "@" ? e.substr(r).toLowerCase() : "";
    }
    get datatype() {
      return new ot(this.datatypeString);
    }
    get datatypeString() {
      let e = this.id, r = e.lastIndexOf('"') + 1, n = r < e.length ? e[r] : "";
      return n === "^" ? e.substr(r + 2) : n !== "@" ? Ue.string : Zl.langString;
    }
    equals(e) {
      return e instanceof t4 ? this.id === e.id : !!e && !!e.datatype && this.termType === e.termType && this.value === e.value && this.language === e.language && this.datatype.value === e.datatype.value;
    }
    toJSON() {
      return { termType: this.termType, value: this.value, language: this.language, datatype: { termType: "NamedNode", value: this.datatypeString } };
    }
  };
  var Ot = class extends X {
    constructor(e) {
      super(`_:${e}`);
    }
    get termType() {
      return "BlankNode";
    }
    get value() {
      return this.id.substr(2);
    }
  };
  var Ct = class extends X {
    constructor(e) {
      super(`?${e}`);
    }
    get termType() {
      return "Variable";
    }
    get value() {
      return this.id.substr(1);
    }
  };
  var Mt = class extends X {
    constructor() {
      return super(""), $t || this;
    }
    get termType() {
      return "DefaultGraph";
    }
    equals(e) {
      return this === e || !!e && this.termType === e.termType;
    }
  };
  $t = new Mt();
  function ve(t6, e, r) {
    if (e = e || en, !t6)
      return e.defaultGraph();
    switch (t6[0]) {
      case "?":
        return e.variable(t6.substr(1));
      case "_":
        return e.blankNode(t6.substr(2));
      case '"':
        if (e === en)
          return new Be(t6);
        if (t6[t6.length - 1] === '"')
          return e.literal(t6.substr(1, t6.length - 2));
        let n = t6.lastIndexOf('"', t6.length - 1);
        return e.literal(t6.substr(1, n - 1), t6[n + 1] === "@" ? t6.substr(n + 2) : e.namedNode(t6.substr(n + 3)));
      case "[":
        t6 = JSON.parse(t6);
        break;
      default:
        if (!r || !Array.isArray(t6))
          return e.namedNode(t6);
    }
    return e.quad(ve(t6[0], e, true), ve(t6[1], e, true), ve(t6[2], e, true), t6[3] && ve(t6[3], e, true));
  }
  function H(t6, e) {
    if (typeof t6 == "string")
      return t6;
    if (t6 instanceof X && t6.termType !== "Quad")
      return t6.id;
    if (!t6)
      return $t.id;
    switch (t6.termType) {
      case "NamedNode":
        return t6.value;
      case "BlankNode":
        return `_:${t6.value}`;
      case "Variable":
        return `?${t6.value}`;
      case "DefaultGraph":
        return "";
      case "Literal":
        return `"${t6.value}"${t6.language ? `@${t6.language}` : t6.datatype && t6.datatype.value !== Ue.string ? `^^${t6.datatype.value}` : ""}`;
      case "Quad":
        let r = [H(t6.subject, true), H(t6.predicate, true), H(t6.object, true)];
        return xe(t6.graph) || r.push(H(t6.graph, true)), e ? r : JSON.stringify(r);
      default:
        throw new Error(`Unexpected termType: ${t6.termType}`);
    }
  }
  var We = class extends X {
    constructor(e, r, n, i) {
      super(""), this._subject = e, this._predicate = r, this._object = n, this._graph = i || $t;
    }
    get termType() {
      return "Quad";
    }
    get subject() {
      return this._subject;
    }
    get predicate() {
      return this._predicate;
    }
    get object() {
      return this._object;
    }
    get graph() {
      return this._graph;
    }
    toJSON() {
      return { termType: this.termType, subject: this._subject.toJSON(), predicate: this._predicate.toJSON(), object: this._object.toJSON(), graph: this._graph.toJSON() };
    }
    equals(e) {
      return !!e && this._subject.equals(e.subject) && this._predicate.equals(e.predicate) && this._object.equals(e.object) && this._graph.equals(e.graph);
    }
  };
  function eu(t6) {
    return new ot(t6);
  }
  function tu(t6) {
    return new Ot(t6 || `n3-${Xl++}`);
  }
  function ru(t6, e) {
    if (typeof e == "string")
      return new Be(`"${t6}"@${e.toLowerCase()}`);
    let r = e ? e.value : "";
    return r === "" && (typeof t6 == "boolean" ? r = Ue.boolean : typeof t6 == "number" && (Number.isFinite(t6) ? r = Number.isInteger(t6) ? Ue.integer : Ue.double : (r = Ue.double, Number.isNaN(t6) || (t6 = t6 > 0 ? "INF" : "-INF")))), r === "" || r === Ue.string ? new Be(`"${t6}"`) : new Be(`"${t6}"^^${r}`);
  }
  function nu(t6) {
    return new Ct(t6);
  }
  function iu() {
    return $t;
  }
  function Gi(t6, e, r, n) {
    return new We(t6, e, r, n);
  }
  var Hi = 0;
  var Fe = class {
    constructor(e) {
      this._contextStack = [], this._graph = null, e = e || {}, this._setBase(e.baseIRI), e.factory && Qi(this, e.factory);
      let r = typeof e.format == "string" ? e.format.match(/\w*$/)[0].toLowerCase() : "", n = /turtle/.test(r), i = /trig/.test(r), s = /triple/.test(r), o = /quad/.test(r), a = this._n3Mode = /n3/.test(r), l = s || o;
      (this._supportsNamedGraphs = !(n || a)) || (this._readPredicateOrNamedGraph = this._readPredicate), this._supportsQuads = !(n || i || s || a), this._supportsRDFStar = r === "" || /star|\*$/.test(r), l && (this._resolveRelativeIRI = (u) => null), this._blankNodePrefix = typeof e.blankNodePrefix != "string" ? "" : e.blankNodePrefix.replace(/^(?!_:)/, "_:"), this._lexer = e.lexer || new qe({ lineMode: l, n3: a }), this._explicitQuantifiers = !!e.explicitQuantifiers;
    }
    static _resetBlankNodePrefix() {
      Hi = 0;
    }
    _setBase(e) {
      if (!e)
        this._base = "", this._basePath = "";
      else {
        let r = e.indexOf("#");
        r >= 0 && (e = e.substr(0, r)), this._base = e, this._basePath = e.indexOf("/") < 0 ? e : e.replace(/[^\/?]*(?:\?.*)?$/, ""), e = e.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i), this._baseRoot = e[0], this._baseScheme = e[1];
      }
    }
    _saveContext(e, r, n, i, s) {
      let o = this._n3Mode;
      this._contextStack.push({ type: e, subject: n, predicate: i, object: s, graph: r, inverse: o ? this._inversePredicate : false, blankPrefix: o ? this._prefixes._ : "", quantified: o ? this._quantified : null }), o && (this._inversePredicate = false, this._prefixes._ = this._graph ? `${this._graph.value}.` : ".", this._quantified = Object.create(this._quantified));
    }
    _restoreContext(e, r) {
      let n = this._contextStack.pop();
      if (!n || n.type !== e)
        return this._error(`Unexpected ${r.type}`, r);
      this._subject = n.subject, this._predicate = n.predicate, this._object = n.object, this._graph = n.graph, this._n3Mode && (this._inversePredicate = n.inverse, this._prefixes._ = n.blankPrefix, this._quantified = n.quantified);
    }
    _readInTopContext(e) {
      switch (e.type) {
        case "eof":
          return this._graph !== null ? this._error("Unclosed graph", e) : (delete this._prefixes._, this._callback(null, null, this._prefixes));
        case "PREFIX":
          this._sparqlStyle = true;
        case "@prefix":
          return this._readPrefix;
        case "BASE":
          this._sparqlStyle = true;
        case "@base":
          return this._readBaseIRI;
        case "{":
          if (this._supportsNamedGraphs)
            return this._graph = "", this._subject = null, this._readSubject;
        case "GRAPH":
          if (this._supportsNamedGraphs)
            return this._readNamedGraphLabel;
        default:
          return this._readSubject(e);
      }
    }
    _readEntity(e, r) {
      let n;
      switch (e.type) {
        case "IRI":
        case "typeIRI":
          let i = this._resolveIRI(e.value);
          if (i === null)
            return this._error("Invalid IRI", e);
          n = this._namedNode(i);
          break;
        case "type":
        case "prefixed":
          let s = this._prefixes[e.prefix];
          if (s === void 0)
            return this._error(`Undefined prefix "${e.prefix}:"`, e);
          n = this._namedNode(s + e.value);
          break;
        case "blank":
          n = this._blankNode(this._prefixes[e.prefix] + e.value);
          break;
        case "var":
          n = this._variable(e.value.substr(1));
          break;
        default:
          return this._error(`Expected entity but got ${e.type}`, e);
      }
      return !r && this._n3Mode && n.id in this._quantified && (n = this._quantified[n.id]), n;
    }
    _readSubject(e) {
      switch (this._predicate = null, e.type) {
        case "[":
          return this._saveContext("blank", this._graph, this._subject = this._blankNode(), null, null), this._readBlankNodeHead;
        case "(":
          return this._saveContext("list", this._graph, this.RDF_NIL, null, null), this._subject = null, this._readListItem;
        case "{":
          return this._n3Mode ? (this._saveContext("formula", this._graph, this._graph = this._blankNode(), null, null), this._readSubject) : this._error("Unexpected graph", e);
        case "}":
          return this._readPunctuation(e);
        case "@forSome":
          return this._n3Mode ? (this._subject = null, this._predicate = this.N3_FORSOME, this._quantifier = this._blankNode, this._readQuantifierList) : this._error('Unexpected "@forSome"', e);
        case "@forAll":
          return this._n3Mode ? (this._subject = null, this._predicate = this.N3_FORALL, this._quantifier = this._variable, this._readQuantifierList) : this._error('Unexpected "@forAll"', e);
        case "literal":
          if (!this._n3Mode)
            return this._error("Unexpected literal", e);
          if (e.prefix.length === 0)
            return this._literalValue = e.value, this._completeSubjectLiteral;
          this._subject = this._literal(e.value, this._namedNode(e.prefix));
          break;
        case "<<":
          return this._supportsRDFStar ? (this._saveContext("<<", this._graph, null, null, null), this._graph = null, this._readSubject) : this._error("Unexpected RDF* syntax", e);
        default:
          if ((this._subject = this._readEntity(e)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._readPredicateOrNamedGraph);
      }
      return this._readPredicateOrNamedGraph;
    }
    _readPredicate(e) {
      let r = e.type;
      switch (r) {
        case "inverse":
          this._inversePredicate = true;
        case "abbreviation":
          this._predicate = this.ABBREVIATIONS[e.value];
          break;
        case ".":
        case "]":
        case "}":
          return this._predicate === null ? this._error(`Unexpected ${r}`, e) : (this._subject = null, r === "]" ? this._readBlankNodeTail(e) : this._readPunctuation(e));
        case ";":
          return this._predicate !== null ? this._readPredicate : this._error("Expected predicate but got ;", e);
        case "[":
          if (this._n3Mode)
            return this._saveContext("blank", this._graph, this._subject, this._subject = this._blankNode(), null), this._readBlankNodeHead;
        case "blank":
          if (!this._n3Mode)
            return this._error("Disallowed blank node as predicate", e);
        default:
          if ((this._predicate = this._readEntity(e)) === void 0)
            return;
      }
      return this._readObject;
    }
    _readObject(e) {
      switch (e.type) {
        case "literal":
          if (e.prefix.length === 0)
            return this._literalValue = e.value, this._readDataTypeOrLang;
          this._object = this._literal(e.value, this._namedNode(e.prefix));
          break;
        case "[":
          return this._saveContext("blank", this._graph, this._subject, this._predicate, this._subject = this._blankNode()), this._readBlankNodeHead;
        case "(":
          return this._saveContext("list", this._graph, this._subject, this._predicate, this.RDF_NIL), this._subject = null, this._readListItem;
        case "{":
          return this._n3Mode ? (this._saveContext("formula", this._graph, this._subject, this._predicate, this._graph = this._blankNode()), this._readSubject) : this._error("Unexpected graph", e);
        case "<<":
          return this._supportsRDFStar ? (this._saveContext("<<", this._graph, this._subject, this._predicate, null), this._graph = null, this._readSubject) : this._error("Unexpected RDF* syntax", e);
        default:
          if ((this._object = this._readEntity(e)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._getContextEndReader());
      }
      return this._getContextEndReader();
    }
    _readPredicateOrNamedGraph(e) {
      return e.type === "{" ? this._readGraph(e) : this._readPredicate(e);
    }
    _readGraph(e) {
      return e.type !== "{" ? this._error(`Expected graph but got ${e.type}`, e) : (this._graph = this._subject, this._subject = null, this._readSubject);
    }
    _readBlankNodeHead(e) {
      return e.type === "]" ? (this._subject = null, this._readBlankNodeTail(e)) : (this._predicate = null, this._readPredicate(e));
    }
    _readBlankNodeTail(e) {
      if (e.type !== "]")
        return this._readBlankNodePunctuation(e);
      this._subject !== null && this._emit(this._subject, this._predicate, this._object, this._graph);
      let r = this._predicate === null;
      return this._restoreContext("blank", e), this._object !== null ? this._getContextEndReader() : this._predicate !== null ? this._readObject : r ? this._readPredicateOrNamedGraph : this._readPredicateAfterBlank;
    }
    _readPredicateAfterBlank(e) {
      switch (e.type) {
        case ".":
        case "}":
          return this._subject = null, this._readPunctuation(e);
        default:
          return this._readPredicate(e);
      }
    }
    _readListItem(e) {
      let r = null, n = null, i = this._readListItem, s = this._subject, o = this._contextStack, a = o[o.length - 1];
      switch (e.type) {
        case "[":
          this._saveContext("blank", this._graph, n = this._blankNode(), this.RDF_FIRST, this._subject = r = this._blankNode()), i = this._readBlankNodeHead;
          break;
        case "(":
          this._saveContext("list", this._graph, n = this._blankNode(), this.RDF_FIRST, this.RDF_NIL), this._subject = null;
          break;
        case ")":
          if (this._restoreContext("list", e), o.length !== 0 && o[o.length - 1].type === "list" && this._emit(this._subject, this._predicate, this._object, this._graph), this._predicate === null) {
            if (i = this._readPredicate, this._subject === this.RDF_NIL)
              return i;
          } else if (i = this._getContextEndReader(), this._object === this.RDF_NIL)
            return i;
          n = this.RDF_NIL;
          break;
        case "literal":
          e.prefix.length === 0 ? (this._literalValue = e.value, i = this._readListItemDataTypeOrLang) : (r = this._literal(e.value, this._namedNode(e.prefix)), i = this._getContextEndReader());
          break;
        case "{":
          return this._n3Mode ? (this._saveContext("formula", this._graph, this._subject, this._predicate, this._graph = this._blankNode()), this._readSubject) : this._error("Unexpected graph", e);
        default:
          if ((r = this._readEntity(e)) === void 0)
            return;
      }
      if (n === null && (this._subject = n = this._blankNode()), s === null ? a.predicate === null ? a.subject = n : a.object = n : this._emit(s, this.RDF_REST, n, this._graph), r !== null) {
        if (this._n3Mode && (e.type === "IRI" || e.type === "prefixed"))
          return this._saveContext("item", this._graph, n, this.RDF_FIRST, r), this._subject = r, this._predicate = null, this._getPathReader(this._readListItem);
        this._emit(n, this.RDF_FIRST, r, this._graph);
      }
      return i;
    }
    _readDataTypeOrLang(e) {
      return this._completeObjectLiteral(e, false);
    }
    _readListItemDataTypeOrLang(e) {
      return this._completeObjectLiteral(e, true);
    }
    _completeLiteral(e) {
      let r = this._literal(this._literalValue);
      switch (e.type) {
        case "type":
        case "typeIRI":
          let n = this._readEntity(e);
          if (n === void 0)
            return;
          r = this._literal(this._literalValue, n), e = null;
          break;
        case "langcode":
          r = this._literal(this._literalValue, e.value), e = null;
          break;
      }
      return { token: e, literal: r };
    }
    _completeSubjectLiteral(e) {
      return this._subject = this._completeLiteral(e).literal, this._readPredicateOrNamedGraph;
    }
    _completeObjectLiteral(e, r) {
      let n = this._completeLiteral(e);
      if (n)
        return this._object = n.literal, r && this._emit(this._subject, this.RDF_FIRST, this._object, this._graph), n.token === null ? this._getContextEndReader() : (this._readCallback = this._getContextEndReader(), this._readCallback(n.token));
    }
    _readFormulaTail(e) {
      return e.type !== "}" ? this._readPunctuation(e) : (this._subject !== null && this._emit(this._subject, this._predicate, this._object, this._graph), this._restoreContext("formula", e), this._object === null ? this._readPredicate : this._getContextEndReader());
    }
    _readPunctuation(e) {
      let r, n = this._graph, i = this._subject, s = this._inversePredicate;
      switch (e.type) {
        case "}":
          if (this._graph === null)
            return this._error("Unexpected graph closing", e);
          if (this._n3Mode)
            return this._readFormulaTail(e);
          this._graph = null;
        case ".":
          this._subject = null, r = this._contextStack.length ? this._readSubject : this._readInTopContext, s && (this._inversePredicate = false);
          break;
        case ";":
          r = this._readPredicate;
          break;
        case ",":
          r = this._readObject;
          break;
        case "{|":
          if (!this._supportsRDFStar)
            return this._error("Unexpected RDF* syntax", e);
          let o = this._predicate, a = this._object;
          this._subject = this._quad(i, o, a, this.DEFAULTGRAPH), r = this._readPredicate;
          break;
        case "|}":
          if (this._subject.termType !== "Quad")
            return this._error("Unexpected asserted triple closing", e);
          this._subject = null, r = this._readPunctuation;
          break;
        default:
          if (this._supportsQuads && this._graph === null && (n = this._readEntity(e)) !== void 0) {
            r = this._readQuadPunctuation;
            break;
          }
          return this._error(`Expected punctuation to follow "${this._object.id}"`, e);
      }
      if (i !== null) {
        let o = this._predicate, a = this._object;
        s ? this._emit(a, o, i, n) : this._emit(i, o, a, n);
      }
      return r;
    }
    _readBlankNodePunctuation(e) {
      let r;
      switch (e.type) {
        case ";":
          r = this._readPredicate;
          break;
        case ",":
          r = this._readObject;
          break;
        default:
          return this._error(`Expected punctuation to follow "${this._object.id}"`, e);
      }
      return this._emit(this._subject, this._predicate, this._object, this._graph), r;
    }
    _readQuadPunctuation(e) {
      return e.type !== "." ? this._error("Expected dot to follow quad", e) : this._readInTopContext;
    }
    _readPrefix(e) {
      return e.type !== "prefix" ? this._error("Expected prefix to follow @prefix", e) : (this._prefix = e.value, this._readPrefixIRI);
    }
    _readPrefixIRI(e) {
      if (e.type !== "IRI")
        return this._error(`Expected IRI to follow prefix "${this._prefix}:"`, e);
      let r = this._readEntity(e);
      return this._prefixes[this._prefix] = r.value, this._prefixCallback(this._prefix, r), this._readDeclarationPunctuation;
    }
    _readBaseIRI(e) {
      let r = e.type === "IRI" && this._resolveIRI(e.value);
      return r ? (this._setBase(r), this._readDeclarationPunctuation) : this._error("Expected valid IRI to follow base declaration", e);
    }
    _readNamedGraphLabel(e) {
      switch (e.type) {
        case "IRI":
        case "blank":
        case "prefixed":
          return this._readSubject(e), this._readGraph;
        case "[":
          return this._readNamedGraphBlankLabel;
        default:
          return this._error("Invalid graph label", e);
      }
    }
    _readNamedGraphBlankLabel(e) {
      return e.type !== "]" ? this._error("Invalid graph label", e) : (this._subject = this._blankNode(), this._readGraph);
    }
    _readDeclarationPunctuation(e) {
      return this._sparqlStyle ? (this._sparqlStyle = false, this._readInTopContext(e)) : e.type !== "." ? this._error("Expected declaration to end with a dot", e) : this._readInTopContext;
    }
    _readQuantifierList(e) {
      let r;
      switch (e.type) {
        case "IRI":
        case "prefixed":
          if ((r = this._readEntity(e, true)) !== void 0)
            break;
        default:
          return this._error(`Unexpected ${e.type}`, e);
      }
      return this._explicitQuantifiers ? (this._subject === null ? this._emit(this._graph || this.DEFAULTGRAPH, this._predicate, this._subject = this._blankNode(), this.QUANTIFIERS_GRAPH) : this._emit(this._subject, this.RDF_REST, this._subject = this._blankNode(), this.QUANTIFIERS_GRAPH), this._emit(this._subject, this.RDF_FIRST, r, this.QUANTIFIERS_GRAPH)) : this._quantified[r.id] = this._quantifier(this._blankNode().value), this._readQuantifierPunctuation;
    }
    _readQuantifierPunctuation(e) {
      return e.type === "," ? this._readQuantifierList : (this._explicitQuantifiers && (this._emit(this._subject, this.RDF_REST, this.RDF_NIL, this.QUANTIFIERS_GRAPH), this._subject = null), this._readCallback = this._getContextEndReader(), this._readCallback(e));
    }
    _getPathReader(e) {
      return this._afterPath = e, this._readPath;
    }
    _readPath(e) {
      switch (e.type) {
        case "!":
          return this._readForwardPath;
        case "^":
          return this._readBackwardPath;
        default:
          let r = this._contextStack, n = r.length && r[r.length - 1];
          if (n && n.type === "item") {
            let i = this._subject;
            this._restoreContext("item", e), this._emit(this._subject, this.RDF_FIRST, i, this._graph);
          }
          return this._afterPath(e);
      }
    }
    _readForwardPath(e) {
      let r, n, i = this._blankNode();
      if ((n = this._readEntity(e)) !== void 0)
        return this._predicate === null ? (r = this._subject, this._subject = i) : (r = this._object, this._object = i), this._emit(r, n, i, this._graph), this._readPath;
    }
    _readBackwardPath(e) {
      let r = this._blankNode(), n, i;
      if ((n = this._readEntity(e)) !== void 0)
        return this._predicate === null ? (i = this._subject, this._subject = r) : (i = this._object, this._object = r), this._emit(r, n, i, this._graph), this._readPath;
    }
    _readRDFStarTailOrGraph(e) {
      return e.type !== ">>" ? this._supportsQuads && this._graph === null && (this._graph = this._readEntity(e)) !== void 0 ? this._readRDFStarTail : this._error(`Expected >> to follow "${this._object.id}"`, e) : this._readRDFStarTail(e);
    }
    _readRDFStarTail(e) {
      if (e.type !== ">>")
        return this._error(`Expected >> but got ${e.type}`, e);
      let r = this._quad(this._subject, this._predicate, this._object, this._graph || this.DEFAULTGRAPH);
      return this._restoreContext("<<", e), this._subject === null ? (this._subject = r, this._readPredicate) : (this._object = r, this._getContextEndReader());
    }
    _getContextEndReader() {
      let e = this._contextStack;
      if (!e.length)
        return this._readPunctuation;
      switch (e[e.length - 1].type) {
        case "blank":
          return this._readBlankNodeTail;
        case "list":
          return this._readListItem;
        case "formula":
          return this._readFormulaTail;
        case "<<":
          return this._readRDFStarTailOrGraph;
      }
    }
    _emit(e, r, n, i) {
      this._callback(null, this._quad(e, r, n, i || this.DEFAULTGRAPH));
    }
    _error(e, r) {
      let n = new Error(`${e} on line ${r.line}.`);
      n.context = { token: r, line: r.line, previousToken: this._lexer.previousToken }, this._callback(n), this._callback = tn;
    }
    _resolveIRI(e) {
      return /^[a-z][a-z0-9+.-]*:/i.test(e) ? e : this._resolveRelativeIRI(e);
    }
    _resolveRelativeIRI(e) {
      if (!e.length)
        return this._base;
      switch (e[0]) {
        case "#":
          return this._base + e;
        case "?":
          return this._base.replace(/(?:\?.*)?$/, e);
        case "/":
          return (e[1] === "/" ? this._baseScheme : this._baseRoot) + this._removeDotSegments(e);
        default:
          return /^[^/:]*:/.test(e) ? null : this._removeDotSegments(this._basePath + e);
      }
    }
    _removeDotSegments(e) {
      if (!/(^|\/)\.\.?($|[/#?])/.test(e))
        return e;
      let r = e.length, n = "", i = -1, s = -1, o = 0, a = "/";
      for (; i < r; ) {
        switch (a) {
          case ":":
            if (s < 0 && e[++i] === "/" && e[++i] === "/")
              for (; (s = i + 1) < r && e[s] !== "/"; )
                i = s;
            break;
          case "?":
          case "#":
            i = r;
            break;
          case "/":
            if (e[i + 1] === ".")
              switch (a = e[++i + 1], a) {
                case "/":
                  n += e.substring(o, i - 1), o = i + 1;
                  break;
                case void 0:
                case "?":
                case "#":
                  return n + e.substring(o, i) + e.substr(i + 1);
                case ".":
                  if (a = e[++i + 1], a === void 0 || a === "/" || a === "?" || a === "#") {
                    if (n += e.substring(o, i - 2), (o = n.lastIndexOf("/")) >= s && (n = n.substr(0, o)), a !== "/")
                      return `${n}/${e.substr(i + 1)}`;
                    o = i + 1;
                  }
              }
        }
        a = e[++i];
      }
      return n + e.substring(o);
    }
    parse(e, r, n) {
      if (this._readCallback = this._readInTopContext, this._sparqlStyle = false, this._prefixes = /* @__PURE__ */ Object.create(null), this._prefixes._ = this._blankNodePrefix ? this._blankNodePrefix.substr(2) : `b${Hi++}_`, this._prefixCallback = n || tn, this._inversePredicate = false, this._quantified = /* @__PURE__ */ Object.create(null), !r) {
        let i = [], s;
        if (this._callback = (o, a) => {
          o ? s = o : a && i.push(a);
        }, this._lexer.tokenize(e).every((o) => this._readCallback = this._readCallback(o)), s)
          throw s;
        return i;
      }
      this._callback = r, this._lexer.tokenize(e, (i, s) => {
        i !== null ? (this._callback(i), this._callback = tn) : this._readCallback && (this._readCallback = this._readCallback(s));
      });
    }
  };
  function tn() {
  }
  function Qi(t6, e) {
    let r = e.namedNode;
    t6._namedNode = r, t6._blankNode = e.blankNode, t6._literal = e.literal, t6._variable = e.variable, t6._quad = e.quad, t6.DEFAULTGRAPH = e.defaultGraph(), t6.RDF_FIRST = r(P.rdf.first), t6.RDF_REST = r(P.rdf.rest), t6.RDF_NIL = r(P.rdf.nil), t6.N3_FORALL = r(P.r.forAll), t6.N3_FORSOME = r(P.r.forSome), t6.ABBREVIATIONS = { a: r(P.rdf.type), "=": r(P.owl.sameAs), ">": r(P.log.implies) }, t6.QUANTIFIERS_GRAPH = r("urn:n3:quantifiers");
  }
  Qi(Fe.prototype, ue);
  var Dt = ue.defaultGraph();
  var { rdf: su, xsd: at } = P;
  var zi = /["\\\t\n\r\b\f\u0000-\u0019\ud800-\udbff]/;
  var Vi = /["\\\t\n\r\b\f\u0000-\u0019]|[\ud800-\udbff][\udc00-\udfff]/g;
  var ou = { "\\": "\\\\", '"': '\\"', "	": "\\t", "\n": "\\n", "\r": "\\r", "\b": "\\b", "\f": "\\f" };
  var Ge = class extends X {
    equals(e) {
      return e === this;
    }
  };
  var He = class {
    constructor(e, r) {
      if (this._prefixRegex = /$0^/, e && typeof e.write != "function" && (r = e, e = null), r = r || {}, this._lists = r.lists, e)
        this._outputStream = e, this._endStream = r.end === void 0 ? true : !!r.end;
      else {
        let n = "";
        this._outputStream = { write(i, s, o) {
          n += i, o && o();
        }, end: (i) => {
          i && i(null, n);
        } }, this._endStream = true;
      }
      this._subject = null, /triple|quad/i.test(r.format) ? (this._lineMode = true, this._writeQuad = this._writeQuadLine) : (this._lineMode = false, this._graph = Dt, this._prefixIRIs = /* @__PURE__ */ Object.create(null), r.prefixes && this.addPrefixes(r.prefixes), r.baseIRI && (this._baseMatcher = new RegExp(`^${Ki(r.baseIRI)}${r.baseIRI.endsWith("/") ? "" : "[#?]"}`), this._baseLength = r.baseIRI.length));
    }
    get _inDefaultGraph() {
      return Dt.equals(this._graph);
    }
    _write(e, r) {
      this._outputStream.write(e, "utf8", r);
    }
    _writeQuad(e, r, n, i, s) {
      try {
        i.equals(this._graph) || (this._write((this._subject === null ? "" : this._inDefaultGraph ? `.
` : `
}
`) + (Dt.equals(i) ? "" : `${this._encodeIriOrBlank(i)} {
`)), this._graph = i, this._subject = null), e.equals(this._subject) ? r.equals(this._predicate) ? this._write(`, ${this._encodeObject(n)}`, s) : this._write(`;
    ${this._encodePredicate(this._predicate = r)} ${this._encodeObject(n)}`, s) : this._write(`${(this._subject === null ? "" : `.
`) + this._encodeSubject(this._subject = e)} ${this._encodePredicate(this._predicate = r)} ${this._encodeObject(n)}`, s);
      } catch (o) {
        s && s(o);
      }
    }
    _writeQuadLine(e, r, n, i, s) {
      delete this._prefixMatch, this._write(this.quadToString(e, r, n, i), s);
    }
    quadToString(e, r, n, i) {
      return `${this._encodeSubject(e)} ${this._encodeIriOrBlank(r)} ${this._encodeObject(n)}${i && i.value ? ` ${this._encodeIriOrBlank(i)} .
` : ` .
`}`;
    }
    quadsToString(e) {
      return e.map((r) => this.quadToString(r.subject, r.predicate, r.object, r.graph)).join("");
    }
    _encodeSubject(e) {
      return e.termType === "Quad" ? this._encodeQuad(e) : this._encodeIriOrBlank(e);
    }
    _encodeIriOrBlank(e) {
      if (e.termType !== "NamedNode")
        return this._lists && e.value in this._lists && (e = this.list(this._lists[e.value])), "id" in e ? e.id : `_:${e.value}`;
      let r = e.value;
      this._baseMatcher && this._baseMatcher.test(r) && (r = r.substr(this._baseLength)), zi.test(r) && (r = r.replace(Vi, Ji));
      let n = this._prefixRegex.exec(r);
      return n ? n[1] ? this._prefixIRIs[n[1]] + n[2] : r : `<${r}>`;
    }
    _encodeLiteral(e) {
      let r = e.value;
      if (zi.test(r) && (r = r.replace(Vi, Ji)), e.language)
        return `"${r}"@${e.language}`;
      if (this._lineMode) {
        if (e.datatype.value === at.string)
          return `"${r}"`;
      } else
        switch (e.datatype.value) {
          case at.string:
            return `"${r}"`;
          case at.boolean:
            if (r === "true" || r === "false")
              return r;
            break;
          case at.integer:
            if (/^[+-]?\d+$/.test(r))
              return r;
            break;
          case at.decimal:
            if (/^[+-]?\d*\.\d+$/.test(r))
              return r;
            break;
          case at.double:
            if (/^[+-]?(?:\d+\.\d*|\.?\d+)[eE][+-]?\d+$/.test(r))
              return r;
            break;
        }
      return `"${r}"^^${this._encodeIriOrBlank(e.datatype)}`;
    }
    _encodePredicate(e) {
      return e.value === su.type ? "a" : this._encodeIriOrBlank(e);
    }
    _encodeObject(e) {
      switch (e.termType) {
        case "Quad":
          return this._encodeQuad(e);
        case "Literal":
          return this._encodeLiteral(e);
        default:
          return this._encodeIriOrBlank(e);
      }
    }
    _encodeQuad({ subject: e, predicate: r, object: n, graph: i }) {
      return `<<${this._encodeSubject(e)} ${this._encodePredicate(r)} ${this._encodeObject(n)}${xe(i) ? "" : ` ${this._encodeIriOrBlank(i)}`}>>`;
    }
    _blockedWrite() {
      throw new Error("Cannot write because the writer has been closed.");
    }
    addQuad(e, r, n, i, s) {
      n === void 0 ? this._writeQuad(e.subject, e.predicate, e.object, e.graph, r) : typeof i == "function" ? this._writeQuad(e, r, n, Dt, i) : this._writeQuad(e, r, n, i || Dt, s);
    }
    addQuads(e) {
      for (let r = 0; r < e.length; r++)
        this.addQuad(e[r]);
    }
    addPrefix(e, r, n) {
      let i = {};
      i[e] = r, this.addPrefixes(i, n);
    }
    addPrefixes(e, r) {
      if (!this._prefixIRIs)
        return r && r();
      let n = false;
      for (let i in e) {
        let s = e[i];
        typeof s != "string" && (s = s.value), n = true, this._subject !== null && (this._write(this._inDefaultGraph ? `.
` : `
}
`), this._subject = null, this._graph = ""), this._prefixIRIs[s] = i += ":", this._write(`@prefix ${i} <${s}>.
`);
      }
      if (n) {
        let i = "", s = "";
        for (let o in this._prefixIRIs)
          i += i ? `|${o}` : o, s += (s ? "|" : "") + this._prefixIRIs[o];
        i = Ki(i, /[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&"), this._prefixRegex = new RegExp(`^(?:${s})[^/]*$|^(${i})([_a-zA-Z][\\-_a-zA-Z0-9]*)$`);
      }
      this._write(n ? `
` : "", r);
    }
    blank(e, r) {
      let n = e, i, s;
      switch (e === void 0 ? n = [] : e.termType ? n = [{ predicate: e, object: r }] : "length" in e || (n = [e]), s = n.length) {
        case 0:
          return new Ge("[]");
        case 1:
          if (i = n[0], !(i.object instanceof Ge))
            return new Ge(`[ ${this._encodePredicate(i.predicate)} ${this._encodeObject(i.object)} ]`);
        default:
          let o = "[";
          for (let a = 0; a < s; a++)
            i = n[a], i.predicate.equals(e) ? o += `, ${this._encodeObject(i.object)}` : (o += `${(a ? `;
  ` : `
  `) + this._encodePredicate(i.predicate)} ${this._encodeObject(i.object)}`, e = i.predicate);
          return new Ge(`${o}
]`);
      }
    }
    list(e) {
      let r = e && e.length || 0, n = new Array(r);
      for (let i = 0; i < r; i++)
        n[i] = this._encodeObject(e[i]);
      return new Ge(`(${n.join(" ")})`);
    }
    end(e) {
      this._subject !== null && (this._write(this._inDefaultGraph ? `.
` : `
}
`), this._subject = null), this._write = this._blockedWrite;
      let r = e && ((n, i) => {
        r = null, e(n, i);
      });
      if (this._endStream)
        try {
          return this._outputStream.end(r);
        } catch {
        }
      r && r();
    }
  };
  function Ji(t6) {
    let e = ou[t6];
    return e === void 0 && (t6.length === 1 ? (e = t6.charCodeAt(0).toString(16), e = "\\u0000".substr(0, 6 - e.length) + e) : (e = ((t6.charCodeAt(0) - 55296) * 1024 + t6.charCodeAt(1) + 9216).toString(16), e = "\\U00000000".substr(0, 10 - e.length) + e)), e;
  }
  function Ki(t6) {
    return t6.replace(/[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&");
  }
  var Ni = nr(Wr());
  var Tt = class {
    constructor(e, r) {
      this._size = 0, this._graphs = /* @__PURE__ */ Object.create(null), this._id = 0, this._ids = /* @__PURE__ */ Object.create(null), this._entities = /* @__PURE__ */ Object.create(null), this._blankNodeIndex = 0, !r && e && !e[0] && (r = e, e = null), r = r || {}, this._factory = r.factory || ue, e && this.addQuads(e);
    }
    _termFromId(e, r) {
      if (e[0] === ".") {
        let n = this._entities, i = e.split(".");
        return this._factory.quad(this._termFromId(n[i[1]]), this._termFromId(n[i[2]]), this._termFromId(n[i[3]]), i[4] && this._termFromId(n[i[4]]));
      }
      return ve(e, r);
    }
    _termToNumericId(e) {
      if (e.termType === "Quad") {
        let r = this._termToNumericId(e.subject), n = this._termToNumericId(e.predicate), i = this._termToNumericId(e.object), s;
        return r && n && i && (xe(e.graph) || (s = this._termToNumericId(e.graph))) && this._ids[s ? `.${r}.${n}.${i}.${s}` : `.${r}.${n}.${i}`];
      }
      return this._ids[H(e)];
    }
    _termToNewNumericId(e) {
      let r = e && e.termType === "Quad" ? `.${this._termToNewNumericId(e.subject)}.${this._termToNewNumericId(e.predicate)}.${this._termToNewNumericId(e.object)}${xe(e.graph) ? "" : `.${this._termToNewNumericId(e.graph)}`}` : H(e);
      return this._ids[r] || (this._ids[this._entities[++this._id] = r] = this._id);
    }
    get size() {
      let e = this._size;
      if (e !== null)
        return e;
      e = 0;
      let r = this._graphs, n, i;
      for (let s in r)
        for (let o in n = r[s].subjects)
          for (let a in i = n[o])
            e += Object.keys(i[a]).length;
      return this._size = e;
    }
    _addToIndex(e, r, n, i) {
      let s = e[r] || (e[r] = {}), o = s[n] || (s[n] = {}), a = i in o;
      return a || (o[i] = null), !a;
    }
    _removeFromIndex(e, r, n, i) {
      let s = e[r], o = s[n];
      delete o[i];
      for (let a in o)
        return;
      delete s[n];
      for (let a in s)
        return;
      delete e[r];
    }
    *_findInIndex(e, r, n, i, s, o, a, l) {
      let u, d, f, b = this._entities, _ = this._termFromId(l, this._factory), y = { subject: null, predicate: null, object: null };
      r && ((u = e, e = {})[r] = u[r]);
      for (let g in e)
        if (d = e[g]) {
          y[s] = this._termFromId(b[g], this._factory), n && ((u = d, d = {})[n] = u[n]);
          for (let m in d)
            if (f = d[m]) {
              y[o] = this._termFromId(b[m], this._factory);
              let w = i ? i in f ? [i] : [] : Object.keys(f);
              for (let R = 0; R < w.length; R++)
                y[a] = this._termFromId(b[w[R]], this._factory), yield this._factory.quad(y.subject, y.predicate, y.object, _);
            }
        }
    }
    _loop(e, r) {
      for (let n in e)
        r(n);
    }
    _loopByKey0(e, r, n) {
      let i, s;
      if (i = e[r])
        for (s in i)
          n(s);
    }
    _loopByKey1(e, r, n) {
      let i, s;
      for (i in e)
        s = e[i], s[r] && n(i);
    }
    _loopBy2Keys(e, r, n, i) {
      let s, o, a;
      if ((s = e[r]) && (o = s[n]))
        for (a in o)
          i(a);
    }
    _countInIndex(e, r, n, i) {
      let s = 0, o, a, l;
      r && ((o = e, e = {})[r] = o[r]);
      for (let u in e)
        if (a = e[u]) {
          n && ((o = a, a = {})[n] = o[n]);
          for (let d in a)
            (l = a[d]) && (i ? i in l && s++ : s += Object.keys(l).length);
        }
      return s;
    }
    _getGraphs(e) {
      if (!f_(e))
        return this._graphs;
      let r = {};
      return r[e] = this._graphs[e], r;
    }
    _uniqueEntities(e) {
      let r = /* @__PURE__ */ Object.create(null);
      return (n) => {
        n in r || (r[n] = true, e(this._termFromId(this._entities[n], this._factory)));
      };
    }
    add(e) {
      return this.addQuad(e), this;
    }
    addQuad(e, r, n, i) {
      r || (i = e.graph, n = e.object, r = e.predicate, e = e.subject), i = H(i);
      let s = this._graphs[i];
      s || (s = this._graphs[i] = { subjects: {}, predicates: {}, objects: {} }, Object.freeze(s)), e = this._termToNewNumericId(e), r = this._termToNewNumericId(r), n = this._termToNewNumericId(n);
      let o = this._addToIndex(s.subjects, e, r, n);
      return this._addToIndex(s.predicates, r, n, e), this._addToIndex(s.objects, n, e, r), this._size = null, o;
    }
    addQuads(e) {
      for (let r = 0; r < e.length; r++)
        this.addQuad(e[r]);
    }
    delete(e) {
      return this.removeQuad(e), this;
    }
    has(e, r, n, i) {
      return e && e.subject && ({ subject: e, predicate: r, object: n, graph: i } = e), !this.readQuads(e, r, n, i).next().done;
    }
    import(e) {
      return e.on("data", (r) => {
        this.addQuad(r);
      }), e;
    }
    removeQuad(e, r, n, i) {
      r || (i = e.graph, n = e.object, r = e.predicate, e = e.subject), i = H(i);
      let s = this._graphs, o, a, l;
      if (!(e = e && this._termToNumericId(e)) || !(r = r && this._termToNumericId(r)) || !(n = n && this._termToNumericId(n)) || !(o = s[i]) || !(a = o.subjects[e]) || !(l = a[r]) || !(n in l))
        return false;
      this._removeFromIndex(o.subjects, e, r, n), this._removeFromIndex(o.predicates, r, n, e), this._removeFromIndex(o.objects, n, e, r), this._size !== null && this._size--;
      for (e in o.subjects)
        return true;
      return delete s[i], true;
    }
    removeQuads(e) {
      for (let r = 0; r < e.length; r++)
        this.removeQuad(e[r]);
    }
    remove(e) {
      return e.on("data", (r) => {
        this.removeQuad(r);
      }), e;
    }
    removeMatches(e, r, n, i) {
      let s = new Ni.Readable({ objectMode: true });
      return s._read = () => {
        for (let o of this.readQuads(e, r, n, i))
          s.push(o);
        s.push(null);
      }, this.remove(s);
    }
    deleteGraph(e) {
      return this.removeMatches(null, null, null, e);
    }
    getQuads(e, r, n, i) {
      return [...this.readQuads(e, r, n, i)];
    }
    *readQuads(e, r, n, i) {
      i = i && H(i);
      let s = this._getGraphs(i), o, a, l, u;
      if (!(e && !(a = this._termToNumericId(e)) || r && !(l = this._termToNumericId(r)) || n && !(u = this._termToNumericId(n))))
        for (let d in s)
          (o = s[d]) && (a ? u ? yield* this._findInIndex(o.objects, u, a, l, "object", "subject", "predicate", d) : yield* this._findInIndex(o.subjects, a, l, null, "subject", "predicate", "object", d) : l ? yield* this._findInIndex(o.predicates, l, u, null, "predicate", "object", "subject", d) : u ? yield* this._findInIndex(o.objects, u, null, null, "object", "subject", "predicate", d) : yield* this._findInIndex(o.subjects, null, null, null, "subject", "predicate", "object", d));
    }
    match(e, r, n, i) {
      return new Ti(this, e, r, n, i);
    }
    countQuads(e, r, n, i) {
      i = i && H(i);
      let s = this._getGraphs(i), o = 0, a, l, u, d;
      if (e && !(l = this._termToNumericId(e)) || r && !(u = this._termToNumericId(r)) || n && !(d = this._termToNumericId(n)))
        return 0;
      for (let f in s)
        (a = s[f]) && (e ? n ? o += this._countInIndex(a.objects, d, l, u) : o += this._countInIndex(a.subjects, l, u, d) : r ? o += this._countInIndex(a.predicates, u, d, l) : o += this._countInIndex(a.objects, d, l, u));
      return o;
    }
    forEach(e, r, n, i, s) {
      this.some((o) => (e(o), false), r, n, i, s);
    }
    every(e, r, n, i, s) {
      let o = false, a = !this.some((l) => (o = true, !e(l)), r, n, i, s);
      return o && a;
    }
    some(e, r, n, i, s) {
      for (let o of this.readQuads(r, n, i, s))
        if (e(o))
          return true;
      return false;
    }
    getSubjects(e, r, n) {
      let i = [];
      return this.forSubjects((s) => {
        i.push(s);
      }, e, r, n), i;
    }
    forSubjects(e, r, n, i) {
      i = i && H(i);
      let s = this._getGraphs(i), o, a, l;
      if (e = this._uniqueEntities(e), !(r && !(a = this._termToNumericId(r)) || n && !(l = this._termToNumericId(n))))
        for (i in s)
          (o = s[i]) && (a ? l ? this._loopBy2Keys(o.predicates, a, l, e) : this._loopByKey1(o.subjects, a, e) : l ? this._loopByKey0(o.objects, l, e) : this._loop(o.subjects, e));
    }
    getPredicates(e, r, n) {
      let i = [];
      return this.forPredicates((s) => {
        i.push(s);
      }, e, r, n), i;
    }
    forPredicates(e, r, n, i) {
      i = i && H(i);
      let s = this._getGraphs(i), o, a, l;
      if (e = this._uniqueEntities(e), !(r && !(a = this._termToNumericId(r)) || n && !(l = this._termToNumericId(n))))
        for (i in s)
          (o = s[i]) && (a ? l ? this._loopBy2Keys(o.objects, l, a, e) : this._loopByKey0(o.subjects, a, e) : l ? this._loopByKey1(o.predicates, l, e) : this._loop(o.predicates, e));
    }
    getObjects(e, r, n) {
      let i = [];
      return this.forObjects((s) => {
        i.push(s);
      }, e, r, n), i;
    }
    forObjects(e, r, n, i) {
      i = i && H(i);
      let s = this._getGraphs(i), o, a, l;
      if (e = this._uniqueEntities(e), !(r && !(a = this._termToNumericId(r)) || n && !(l = this._termToNumericId(n))))
        for (i in s)
          (o = s[i]) && (a ? l ? this._loopBy2Keys(o.subjects, a, l, e) : this._loopByKey1(o.objects, a, e) : l ? this._loopByKey0(o.predicates, l, e) : this._loop(o.objects, e));
    }
    getGraphs(e, r, n) {
      let i = [];
      return this.forGraphs((s) => {
        i.push(s);
      }, e, r, n), i;
    }
    forGraphs(e, r, n, i) {
      for (let s in this._graphs)
        this.some((o) => (e(o.graph), true), r, n, i, s);
    }
    createBlankNode(e) {
      let r, n;
      if (e)
        for (r = e = `_:${e}`, n = 1; this._ids[r]; )
          r = e + n++;
      else
        do
          r = `_:b${this._blankNodeIndex++}`;
        while (this._ids[r]);
      return this._ids[r] = ++this._id, this._entities[this._id] = r, this._factory.blankNode(r.substr(2));
    }
    extractLists({ remove: e = false, ignoreErrors: r = false } = {}) {
      let n = {}, i = r ? () => true : (a, l) => {
        throw new Error(`${a.value} ${l}`);
      }, s = this.getQuads(null, P.rdf.rest, P.rdf.nil, null), o = e ? [...s] : [];
      return s.forEach((a) => {
        let l = [], u = false, d, f, b = a.graph, _ = a.subject;
        for (; _ && !u; ) {
          let y = this.getQuads(null, null, _, null), g = this.getQuads(_, null, null, null), m, w = null, R = null, N = null;
          for (let S = 0; S < g.length && !u; S++)
            m = g[S], m.graph.equals(b) ? d ? u = i(_, "has non-list arcs out") : m.predicate.value === P.rdf.first ? w ? u = i(_, "has multiple rdf:first arcs") : o.push(w = m) : m.predicate.value === P.rdf.rest ? R ? u = i(_, "has multiple rdf:rest arcs") : o.push(R = m) : y.length ? u = i(_, "can't be subject and object") : (d = m, f = "subject") : u = i(_, "not confined to single graph");
          for (let S = 0; S < y.length && !u; ++S)
            m = y[S], d ? u = i(_, "can't have coreferences") : m.predicate.value === P.rdf.rest ? N ? u = i(_, "has incoming rdf:rest arcs") : N = m : (d = m, f = "object");
          w ? l.unshift(w.object) : u = i(_, "has no list head"), _ = N && N.subject;
        }
        u ? e = false : d && (n[d[f].value] = l);
      }), e && this.removeQuads(o), n;
    }
    *[Symbol.iterator]() {
      yield* this.readQuads();
    }
  };
  function f_(t6) {
    return typeof t6 == "string" || t6 instanceof String;
  }
  var Ti = class t5 extends Ni.Readable {
    constructor(e, r, n, i, s) {
      super({ objectMode: true }), Object.assign(this, { n3Store: e, subject: r, predicate: n, object: i, graph: s });
    }
    get filtered() {
      if (!this._filtered) {
        let { n3Store: e, graph: r, object: n, predicate: i, subject: s } = this, o = this._filtered = new Tt({ factory: e._factory });
        for (let a of e.readQuads(s, i, n, r))
          o.addQuad(a);
      }
      return this._filtered;
    }
    get size() {
      return this.filtered.size;
    }
    _read() {
      for (let e of this)
        this.push(e);
      this.push(null);
    }
    add(e) {
      return this.filtered.add(e);
    }
    delete(e) {
      return this.filtered.delete(e);
    }
    has(e) {
      return this.filtered.has(e);
    }
    match(e, r, n, i) {
      return new t5(this.filtered, e, r, n, i);
    }
    *[Symbol.iterator]() {
      yield* this._filtered || this.n3Store.readQuads(this.subject, this.predicate, this.object, this.graph);
    }
  };
  var Al = nr(Wr());
  var tr = class extends Al.Transform {
    constructor(e) {
      super({ decodeStrings: true }), this._readableState.objectMode = true;
      let r = new Fe(e), n, i;
      r.parse({ on: (s, o) => {
        switch (s) {
          case "data":
            n = o;
            break;
          case "end":
            i = o;
            break;
        }
      } }, (s, o) => {
        s && this.emit("error", s) || o && this.push(o);
      }, (s, o) => {
        this.emit("prefix", s, o);
      }), this._transform = (s, o, a) => {
        n(s), a();
      }, this._flush = (s) => {
        i(), s();
      };
    }
    import(e) {
      return e.on("data", (r) => {
        this.write(r);
      }), e.on("end", () => {
        this.end();
      }), e.on("error", (r) => {
        this.emit("error", r);
      }), this;
    }
  };
  var Tl = nr(Wr());
  var rr = class extends Tl.Transform {
    constructor(e) {
      super({ encoding: "utf8", writableObjectMode: true });
      let r = this._writer = new He({ write: (n, i, s) => {
        this.push(n), s && s();
      }, end: (n) => {
        this.push(null), n && n();
      } }, e);
      this._transform = (n, i, s) => {
        r.addQuad(n, s);
      }, this._flush = (n) => {
        r.end(n);
      };
    }
    import(e) {
      return e.on("data", (r) => {
        this.write(r);
      }), e.on("end", () => {
        this.end();
      }), e.on("error", (r) => {
        this.emit("error", r);
      }), e.on("prefix", (r, n) => {
        this._writer.addPrefix(r, n);
      }), this;
    }
  };
  var Nl = { Lexer: qe, Parser: Fe, Writer: He, Store: Tt, StreamParser: tr, StreamWriter: rr, Util: Xr, DataFactory: ue, Term: X, NamedNode: ot, Literal: Be, BlankNode: Ot, Variable: Ct, DefaultGraph: Mt, Quad: We, Triple: We, termFromId: ve, termToId: H };
  var d_ = { xsd$dateTime: "<datetime>", xsd$time: "<time>", xsd$date: "<date>", xsd$duration: "<duration>", xsd$string: "<string>", xsd$float: "<float>", xsd$decimal: "<decimal>", xsd$double: "<float64>", xsd$anyURI: "<url>", xsd$integer: "<int>", xsd$int: "<int>", xsd$long: "<int64>", xsd$short: "<int16>", xsd$byte: "<int8>", xsd$nonNegativeInteger: "<uint>", xsd$unsignedLong: "<uint64>", xsd$unsignedInt: "<uint>", xsd$unsignedShort: "<uint16>", xsd$unsignedByte: "<uint8>", xsd$base64Binary: '<blob class="base64">' };
  var c_ = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  var h_ = Symbol("source");
  var ki = class {
    prefixes = {};
    index = /* @__PURE__ */ new Map();
    unresolved = /* @__PURE__ */ new Map();
    types = {};
    constructor(e = {}) {
      this.prefixes = e?.prefixes ?? {}, this.separator = e?.separator ?? "$", this.prefixes.xsd || (this.prefixes.xsd = "http://www.w3.org/2001/XMLSchema#"), this.types = {}, Object.entries(d_).forEach(([r, n]) => {
        let i = r.split("$").join(this.separator);
        this.types[i] = n;
      });
    }
    parse(e, r) {
      let n = this.graph(r), s = new Nl.Parser({ blankNodePrefix: "", baseIRI: r }).parse(e);
      n[h_] = s;
      for (let o of s) {
        let a;
        o.subject.termType == "BlankNode" ? a = n.addBlankNode(o.subject.id) : a = n.addSubject(o.subject.id), a.addPredicate(o.predicate.id, o.object, n);
      }
      return this.index.has(r) ? this.index.get(r) : n;
    }
    short(e, r) {
      if (r && e.startsWith(r))
        return new v.Link(e.substring(r.length));
      let n = this.prefixes;
      for (let i in n)
        if (e.startsWith(n[i]))
          return new v.Link(i + this.separator + e.substring(n[i].length));
      return e;
    }
    long(e) {
      if (e instanceof v.Link) {
        e = e.value;
        let [r, n] = e.split(this.separator);
        return this.prefixes[r] && (e = this.prefixes[r] + n), e;
      }
      return e;
    }
    graph(e) {
      return new Li(this, e);
    }
  };
  var Li = class extends Array {
    constructor(e, r) {
      super();
      let n = new URL(r);
      if (n.hash = "", Object.defineProperty(this, "baseURI", { value: n.href, writable: true, configurable: false, enumerable: false }), Object.defineProperty(this, "parser", { value: e, writable: false, configurable: false, enumerable: false }), Object.defineProperty(this, "blankNodes", { value: /* @__PURE__ */ new Map(), writable: true, configurable: false, enumerable: false }), e.prefixes) {
        let i = [];
        for (let [s, o] of Object.entries(e.prefixes))
          i.push(s + ":" + o);
        v.setAttribute(this, "prefix", i.join(" "));
      }
      r && v.setAttribute(this, "baseURI", r);
    }
    static get [Symbol.species]() {
      return Array;
    }
    resolveLinks(e, r) {
      if (this.parser.unresolved.has(r)) {
        let n = this.parser.unresolved.get(r), i = this.parser.short(r, this.baseURI);
        for (let s in n) {
          let o = this.parser.index.get(s);
          for (let a of n[s]) {
            let l = o[a];
            Array.isArray(l) ? l = l.map((u) => {
              if (u instanceof v.Link) {
                if (u.value == i)
                  return e;
              } else
                return u;
            }) : l instanceof v.Link && l.value == i && (o[a] = e);
          }
        }
        this.parser.unresolved.remove(r);
      }
    }
    addSubject(e) {
      let r;
      return this.parser.index.has(e) ? (r = this.parser.index.get(e), this.includes(r) || this.push(r)) : (r = new Gr(this, e), this.push(r), this.resolveLinks(r, e)), r;
    }
    addBlankNode(e) {
      let r;
      return this.blankNodes.has(e) ? r = this.blankNodes.get(e) : (r = new Gr(this), this.blankNodes.set(e, r)), r;
    }
    setType(e, r) {
      let n;
      switch (typeof e) {
        case "string":
          n = new String(e), v.setType(n, "string");
          break;
        case "number":
          n = new Number(e), v.setType(n, "number");
          break;
        default:
          throw new Error("missing type implementation for " + typeof e);
      }
      let i = this.parser.short(r, this.baseURI);
      return i instanceof v.Link && this.parser.types[i.value] ? this.#e(n, this.parser.types[i.value]) : v.setAttribute(n, "class", r), n;
    }
    #e(e, r) {
      let n = r.substring(1, r.length - 1).split(" ").pop();
      v.setType(e, n);
    }
    addUnresolved(e, r, n) {
      let i = this.parser.unresolved;
      if (!i.has(e))
        i.set(e, { parentID: [r] });
      else {
        let s = i.get(e);
        s[n] ? s[n].push(r) : s[n] = [r];
      }
    }
  };
  var Gr = class {
    #e;
    constructor(e, r) {
      this.#e = [e], r && (v.setAttribute(this, "id", r), e.parser.index.set(r, this));
    }
    get id() {
      return v.getAttribute(this, "id");
    }
    addPredicate(e, r, n) {
      if (this.#e.includes(n) || this.#e.push(n), e == c_)
        this.addType(n.parser.short(r.id, n.baseURI), n);
      else {
        let i = n.parser.short(e, n.baseURI);
        i instanceof v.Link && (i = i.value);
        let s = this.#t(r);
        s instanceof v.Link && n.addUnresolved(s.value, i, this.id), this[i] ? Array.isArray(this[i]) ? this[i].push(s) : this[i] = [this[i], s] : this[i] = s;
      }
    }
    addType(e) {
      e instanceof v.Link && (e = e.value);
      let r = v.getAttribute(this, "class");
      r || (r = []), Array.isArray(r) || (r = r.split(" ")), r.indexOf(e) || (r.push(e), v.setAttribute(this, "class", r));
    }
    #t(e) {
      if (e.termType == "Literal")
        e = this.#e[this.#e.length - 1].setType(e.value, e.datatype.id);
      else {
        let r, n;
        (() => {
          for (n of this.#e) {
            if (r = n.parser, e.id.startsWith(n.baseURI))
              return e = n.addSubject(e.id), true;
            if (r.index.has(e.id))
              return e = r.index.get(e.id), true;
            if (n.blankNodes.has(e.id))
              return e = n.blankNodes.get(e.id), true;
          }
        })() || (e = r.short(e.id, n.baseURI));
      }
      return e;
    }
  };
  function p_(t6 = [], e = null) {
    return new ki(t6, e);
  }

  // src/solid-api.mjs
  var solidSession = getDefaultSession();
  var solidApi = {
    fetch: function(url, loginInfo) {
      let cleanUrl = new URL(url);
      cleanUrl.hash = "";
      cleanUrl = cleanUrl.href;
      const parser = new p_({ prefixes: solidApi.prefixes });
      var fetchParams = {
        mode: "cors",
        headers: {
          "Accept": "application/*"
        }
      };
      if (loginInfo && loginInfo.username && loginInfo.password) {
        fetchParams.headers.Authorization = "Basic " + btoa(loginInfo.username + ":" + loginInfo.password);
      }
      return fetch(cleanUrl, fetchParams).catch((error) => {
        return solidSession.fetch(cleanUrl);
      }).then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return solidSession.fetch(cleanUrl).then((response2) => {
            if (response2.ok) {
              return response2.text();
            } else {
              throw new Error("Could not fetch resource: " + response2.status + ": " + response2.statusText);
            }
          });
        }
      }).then((text, error) => {
        if (!error) {
          var data = parser.parse(text, url);
          return { data, prefixes: solidApi.prefixes };
        } else {
          throw error;
        }
      });
    },
    write: function(url, body, contentType = "text/turtle") {
      var fetchParams = {
        headers: {
          "Content-Type": contentType
        },
        body,
        method: "PUT"
      };
      return solidSession.fetch(url, fetchParams).then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw response;
        }
      });
    },
    connect: function(issuer, resourceUrl) {
      if (solidSession.info && solidSession.info.isLoggedIn === false) {
        let url = new URL(window.location);
        url.searchParams.set("resourceUrl", resourceUrl);
        return solidSession.login({
          oidcIssuer: issuer,
          redirectUrl: url.href
        });
      }
      return solidSession.info;
    },
    disconnect: function() {
      return solidSession.logout();
    },
    getPodUrl: function(webIdUrl) {
      return solidApi.fetch(webIdUrl.href).then((quads) => quads.find((quad) => quad.predicate.value.includes("pim/space#storage")).object.value).then((podUrl) => {
        if (!podUrl.endsWith("/")) {
          podUrl += "/";
        }
        return podUrl;
      });
    }
  };

  // src/appui.mjs
  var appui = {
    keys: {
      default: {
        Escape: function(evt) {
          if (this.container.querySelector(":popover-open")) {
            return;
          }
          if (this.state.openDialogs?.length) {
            if (this.actions.uiCloseDialog(this.state.openDialogs[this.state.openDialogs.length - 1])) {
              evt.preventDefault();
            }
          }
        }
      }
    },
    commands: {
      uiCloseDialog: function(el, value) {
        let dialog = el.closest("dialog");
        this.actions.uiCloseDialog(dialog);
      },
      uiSelectTab: function(el, value) {
        const group = el.dataset.uiGroup;
        const target = this.container.querySelector("#" + value);
        const targetGroup = target ? target.dataset.uiGroup : null;
        this.actions.uiSelect(el, group);
        if (target) {
          this.actions.uiSelect(target, targetGroup);
          target.scrollIntoView();
        }
      }
    },
    actions: {
      uiCloseDialog: function(dialog) {
        if (dialog.open) {
          this.state.openDialogs = this.state.openDialogs?.filter((d) => d == dialog);
          dialog.close();
          return true;
        }
        return false;
      },
      uiOpenDialog: function(dialog) {
        if (!dialog.open) {
          dialog.show();
          this.state.openDialogs.push(dialog);
          dialog.querySelector("[autofocus]")?.focus();
        }
      },
      uiOpenModalDialog: function(dialog) {
        if (!dialog.open) {
          dialog.showModal();
          this.state.openDialogs.push(dialog);
          dialog.querySelector("[autofocus]")?.focus();
        }
      },
      uiSelect: function(selected, group) {
        if (group) {
          for (let gel of Array.from(
            this.container.querySelectorAll(`[data-ui-group=${group}].ui-selected`)
          )) {
            gel.classList.remove("ui-selected");
          }
        }
        selected.classList.add("ui-selected");
      }
    },
    state: {
      openDialogs: []
    }
  };

  // node_modules/simplyview/src/activate.mjs
  var listeners = /* @__PURE__ */ new Map();
  var activate = {
    addListener: (name, callback) => {
      if (!listeners.has(name)) {
        listeners.set(name, []);
      }
      listeners.get(name).push(callback);
      initialCall(name);
    },
    removeListener: (name, callback) => {
      if (!listeners.has(name)) {
        return false;
      }
      listeners.set(name, listeners.get(name).filter((listener) => {
        return listener != callback;
      }));
    }
  };
  function initialCall(name) {
    const nodes = document.querySelectorAll('[data-simply-activate="' + name + '"]');
    if (nodes) {
      for (let node of nodes) {
        callListeners(node);
      }
    }
  }
  function callListeners(node) {
    const activate2 = node?.dataset?.simplyActivate;
    if (activate2 && listeners.has(activate2)) {
      for (let callback of listeners.get(activate2)) {
        callback.call(node);
      }
    }
  }
  function handleChanges(changes) {
    let activateNodes = [];
    for (let change of changes) {
      if (change.type == "childList") {
        for (let node of change.addedNodes) {
          if (node.querySelectorAll) {
            var toActivate = Array.from(node.querySelectorAll("[data-simply-activate]"));
            if (node.matches("[data-simply-activate]")) {
              toActivate.push(node);
            }
            activateNodes = activateNodes.concat(toActivate);
          }
        }
      }
    }
    for (let node of activateNodes) {
      callListeners(node);
    }
  }
  var observer = new MutationObserver(handleChanges);
  observer.observe(document, {
    subtree: true,
    childList: true
  });

  // node_modules/simplyview/src/action.mjs
  var action_exports = {};
  __export(action_exports, {
    actions: () => actions
  });
  function actions(options) {
    if (options.app) {
      const actionHandler = {
        get: (target, property) => {
          return target[property].bind(options.app);
        }
      };
      return new Proxy(options.actions, actionHandler);
    } else {
      return options;
    }
  }

  // node_modules/simplyview/src/route.mjs
  var route_exports = {};
  __export(route_exports, {
    routes: () => routes
  });
  function routes(options) {
    return new SimplyRoute(options);
  }
  var SimplyRoute = class {
    constructor(options = {}) {
      this.root = options.root || "/";
      this.app = options.app;
      this.clear();
      if (options.routes) {
        this.load(options.routes);
      }
    }
    load(routes2) {
      parseRoutes(routes2, this.routeInfo);
    }
    clear() {
      this.routeInfo = [];
      this.listeners = {
        match: {},
        call: {},
        finish: {}
      };
    }
    match(path, options) {
      let args = {
        path,
        options
      };
      args = this.runListeners("match", args);
      path = args.path ? args.path : path;
      let matches;
      if (!path) {
        if (this.match(document.location.pathname + document.location.hash)) {
          return true;
        } else {
          return this.match(document.location.pathname);
        }
      }
      path = getPath(path);
      for (let route of this.routeInfo) {
        matches = route.match.exec(path);
        if (matches && matches.length) {
          var params = {};
          route.params.forEach((key, i) => {
            if (key == "*") {
              key = "remainder";
            }
            params[key] = matches[i + 1];
          });
          Object.assign(params, options);
          args.route = route;
          args.params = params;
          args = this.runListeners("call", args);
          params = args.params ? args.params : params;
          args.result = route.action.call(route, params);
          this.runListeners("finish", args);
          return args.result;
        }
      }
      if (path && path[path.length - 1] != "/") {
        return this.match(path + "/", options);
      }
      return false;
    }
    runListeners(action, params) {
      if (!Object.keys(this.listeners[action])) {
        return;
      }
      Object.keys(this.listeners[action]).forEach((route) => {
        var routeRe = getRegexpFromRoute(route);
        if (routeRe.exec(params.path)) {
          var result;
          for (let callback of this.listeners[action][route]) {
            result = callback.call(this.app, params);
            if (result) {
              params = result;
            }
          }
        }
      });
      return params;
    }
    handleEvents() {
      globalThis.addEventListener("popstate", () => {
        if (this.match(getPath(document.location.pathname + document.location.hash, this.root)) === false) {
          this.match(getPath(document.location.pathname, this.root));
        }
      });
      globalThis.document.addEventListener("click", (evt) => {
        if (evt.ctrlKey) {
          return;
        }
        if (evt.which != 1) {
          return;
        }
        var link = evt.target;
        while (link && link.tagName != "A") {
          link = link.parentElement;
        }
        if (link && link.pathname && link.hostname == globalThis.location.hostname && !link.link && !link.dataset.simplyCommand) {
          let path = getPath(link.pathname + link.hash, this.root);
          if (!this.has(path)) {
            path = getPath(link.pathname, this.root);
          }
          if (this.has(path)) {
            let params = this.runListeners("goto", { path });
            if (params.path) {
              this.goto(params.path);
            }
            evt.preventDefault();
            return false;
          }
        }
      });
    }
    goto(path) {
      history.pushState({}, "", getURL(path));
      return this.match(path);
    }
    has(path) {
      path = getPath(path, this.root);
      for (let route of this.routeInfo) {
        var matches = route.match.exec(path);
        if (matches && matches.length) {
          return true;
        }
      }
      return false;
    }
    addListener(action, route, callback) {
      if (["goto", "match", "call", "finish"].indexOf(action) == -1) {
        throw new Error("Unknown action " + action);
      }
      if (!this.listeners[action][route]) {
        this.listeners[action][route] = [];
      }
      this.listeners[action][route].push(callback);
    }
    removeListener(action, route, callback) {
      if (["match", "call", "finish"].indexOf(action) == -1) {
        throw new Error("Unknown action " + action);
      }
      if (!this.listeners[action][route]) {
        return;
      }
      this.listeners[action][route] = this.listeners[action][route].filter((listener) => {
        return listener != callback;
      });
    }
    init(options) {
      if (options.root) {
        this.root = options.root;
      }
    }
  };
  function getPath(path, root = "/") {
    if (path.substring(0, root.length) == root || root[root.length - 1] == "/" && path.length == root.length - 1 && path == root.substring(0, path.length)) {
      path = path.substring(root.length);
    }
    if (path[0] != "/" && path[0] != "#") {
      path = "/" + path;
    }
    return path;
  }
  function getURL(path, root) {
    path = getPath(path, root);
    if (root[root.length - 1] === "/" && path[0] === "/") {
      path = path.substring(1);
    }
    return root + path;
  }
  function getRegexpFromRoute(route) {
    return new RegExp("^" + route.replace(/:\w+/g, "([^/]+)").replace(/:\*/, "(.*)"));
  }
  function parseRoutes(routes2) {
    let routeInfo = [];
    const paths = Object.keys(routes2);
    const matchParams = /:(\w+|\*)/g;
    for (let path of paths) {
      let matches = [];
      let params = [];
      do {
        matches = matchParams.exec(path);
        if (matches) {
          params.push(matches[1]);
        }
      } while (matches);
      routeInfo.push({
        match: getRegexpFromRoute(path),
        params,
        action: routes2[path]
      });
    }
    return routeInfo;
  }

  // node_modules/simplyview/src/command.mjs
  var command_exports = {};
  __export(command_exports, {
    commands: () => commands
  });
  var SimplyCommands = class {
    constructor(options = {}) {
      if (!options.app) {
        options.app = {};
      }
      if (!options.app.container) {
        options.app.container = document.body;
      }
      this.$handlers = options.handlers || defaultHandlers;
      if (options.commands) {
        Object.assign(this, options.commands);
      }
      const commandHandler = (evt) => {
        const command = getCommand(evt, this.$handlers);
        if (!command) {
          return;
        }
        if (!this[command.name]) {
          console.error("simply.command: undefined command " + command.name, command.source);
          return;
        }
        const shouldContinue = this[command.name].call(options.app, command.source, command.value);
        if (shouldContinue === false) {
          evt.preventDefault();
          evt.stopPropagation();
          return false;
        }
      };
      options.app.container.addEventListener("click", commandHandler);
      options.app.container.addEventListener("submit", commandHandler);
      options.app.container.addEventListener("change", commandHandler);
      options.app.container.addEventListener("input", commandHandler);
    }
  };
  function commands(options = {}) {
    return new SimplyCommands(options);
  }
  function getCommand(evt, handlers) {
    var el = evt.target.closest("[data-simply-command]");
    if (el) {
      for (let handler of handlers) {
        if (el.matches(handler.match)) {
          if (handler.check(el, evt)) {
            return {
              name: el.dataset.simplyCommand,
              source: el,
              value: handler.get(el)
            };
          }
          return null;
        }
      }
    }
    return null;
  }
  var defaultHandlers = [
    {
      match: "input,select,textarea",
      get: function(el) {
        if (el.tagName === "SELECT" && el.multiple) {
          let values = [];
          for (let option of el.options) {
            if (option.selected) {
              values.push(option.value);
            }
          }
          return values;
        }
        return el.dataset.simplyValue || el.value;
      },
      check: function(el, evt) {
        return evt.type == "change" || el.dataset.simplyImmediate && evt.type == "input";
      }
    },
    {
      match: "a,button",
      get: function(el) {
        return el.dataset.simplyValue || el.href || el.value;
      },
      check: function(el, evt) {
        return evt.type == "click" && evt.ctrlKey == false && evt.button == 0;
      }
    },
    {
      match: "form",
      get: function(el) {
        let data = {};
        for (let input of Array.from(el.elements)) {
          if (input.tagName == "INPUT" && (input.type == "checkbox" || input.type == "radio")) {
            if (!input.checked) {
              return;
            }
          }
          if (data[input.name] && !Array.isArray(data[input.name])) {
            data[input.name] = [data[input.name]];
          }
          if (Array.isArray(data[input.name])) {
            data[input.name].push(input.value);
          } else {
            data[input.name] = input.value;
          }
        }
        return data;
      },
      check: function(el, evt) {
        return evt.type == "submit";
      }
    },
    {
      match: "*",
      get: function(el) {
        return el.dataset.simplyValue;
      },
      check: function(el, evt) {
        return evt.type == "click" && evt.ctrlKey == false && evt.button == 0;
      }
    }
  ];

  // node_modules/simplyview/src/key.mjs
  var key_exports = {};
  __export(key_exports, {
    keys: () => keys
  });
  var SimplyKeys = class {
    constructor(options = {}) {
      if (!options.app) {
        options.app = {};
      }
      if (!options.app.container) {
        options.app.container = document.body;
      }
      Object.assign(this, options.keys);
      const keyHandler = (e) => {
        if (e.isComposing || e.keyCode === 229) {
          return;
        }
        if (e.defaultPrevented) {
          return;
        }
        if (!e.target) {
          return;
        }
        let selectedKeyboard = "default";
        if (e.target.closest("[data-simply-keyboard]")) {
          selectedKeyboard = e.target.closest("[data-simply-keyboard]").dataset.simplyKeyboard;
        }
        let key = "";
        if (e.ctrlKey && e.keyCode != 17) {
          key += "Control+";
        }
        if (e.metaKey && e.keyCode != 224) {
          key += "Meta+";
        }
        if (e.altKey && e.keyCode != 18) {
          key += "Alt+";
        }
        if (e.shiftKey && e.keyCode != 16) {
          key += "Shift+";
        }
        key += e.key;
        if (this[selectedKeyboard] && this[selectedKeyboard][key]) {
          let keyboard = this[selectedKeyboard];
          keyboard[key].call(options.app, e);
        }
      };
      options.app.container.addEventListener("keydown", keyHandler);
    }
  };
  function keys(options = {}) {
    return new SimplyKeys(options);
  }

  // node_modules/simplyview/src/state.mjs
  var state_exports = {};
  __export(state_exports, {
    batch: () => batch,
    clockEffect: () => clockEffect,
    destroy: () => destroy,
    effect: () => effect,
    signal: () => signal,
    throttledEffect: () => throttledEffect,
    untracked: () => untracked
  });
  var iterate = Symbol("iterate");
  if (!Symbol.xRay) {
    Symbol.xRay = Symbol("xRay");
  }
  var signalHandler = {
    get: (target, property, receiver) => {
      if (property === Symbol.xRay) {
        return target;
      }
      const value = target?.[property];
      notifyGet(receiver, property);
      if (typeof value === "function") {
        if (Array.isArray(target)) {
          return (...args) => {
            let l = target.length;
            let result = value.apply(receiver, args);
            if (l != target.length) {
              notifySet(receiver, makeContext("length", { was: l, now: target.length }));
            }
            return result;
          };
        } else if (target instanceof Set || target instanceof Map) {
          return (...args) => {
            let s = target.size;
            let result = value.apply(target, args);
            if (s != target.size) {
              notifySet(receiver, makeContext("size", { was: s, now: target.size }));
            }
            if (["set", "add", "clear", "delete"].includes(property)) {
              notifySet(receiver, makeContext({ entries: {}, forEach: {}, has: {}, keys: {}, values: {}, [Symbol.iterator]: {} }));
            }
            return result;
          };
        } else if (target instanceof HTMLElement || target instanceof Number || target instanceof String || target instanceof Boolean) {
          return value.bind(target);
        } else {
          return value.bind(receiver);
        }
      }
      if (value && typeof value == "object") {
        return signal(value);
      }
      return value;
    },
    set: (target, property, value, receiver) => {
      value = value?.[Symbol.xRay] || value;
      let current = target[property];
      if (current !== value) {
        target[property] = value;
        notifySet(receiver, makeContext(property, { was: current, now: value }));
      }
      if (typeof current === "undefined") {
        notifySet(receiver, makeContext(iterate, {}));
      }
      return true;
    },
    has: (target, property) => {
      let receiver = signals.get(target);
      if (receiver) {
        notifyGet(receiver, property);
      }
      return Object.hasOwn(target, property);
    },
    deleteProperty: (target, property) => {
      if (typeof target[property] !== "undefined") {
        let current = target[property];
        delete target[property];
        let receiver = signals.get(target);
        notifySet(receiver, makeContext(property, { delete: true, was: current }));
      }
      return true;
    },
    defineProperty: (target, property, descriptor) => {
      if (typeof target[property] === "undefined") {
        let receiver = signals.get(target);
        notifySet(receiver, makeContext(iterate, {}));
      }
      return Object.defineProperty(target, property, descriptor);
    },
    ownKeys: (target) => {
      let receiver = signals.get(target);
      notifyGet(receiver, iterate);
      return Reflect.ownKeys(target);
    }
  };
  var signals = /* @__PURE__ */ new WeakMap();
  function signal(v2) {
    if (!signals.has(v2)) {
      signals.set(v2, new Proxy(v2, signalHandler));
    }
    return signals.get(v2);
  }
  var batchedListeners = /* @__PURE__ */ new Set();
  var batchMode = 0;
  function notifySet(self2, context = {}) {
    let listeners2 = [];
    context.forEach((change, property) => {
      let propListeners = getListeners(self2, property);
      if (propListeners?.length) {
        for (let listener of propListeners) {
          addContext(listener, makeContext(property, change));
        }
        listeners2 = listeners2.concat(propListeners);
      }
    });
    listeners2 = new Set(listeners2.filter(Boolean));
    if (listeners2) {
      if (batchMode) {
        batchedListeners = batchedListeners.union(listeners2);
      } else {
        const currentEffect = computeStack[computeStack.length - 1];
        for (let listener of Array.from(listeners2)) {
          if (listener != currentEffect && listener?.needsUpdate) {
            listener();
          }
          clearContext(listener);
        }
      }
    }
  }
  function makeContext(property, change) {
    let context = /* @__PURE__ */ new Map();
    if (typeof property === "object") {
      for (let prop in property) {
        context.set(prop, property[prop]);
      }
    } else {
      context.set(property, change);
    }
    return context;
  }
  function addContext(listener, context) {
    if (!listener.context) {
      listener.context = context;
    } else {
      context.forEach((change, property) => {
        listener.context.set(property, change);
      });
    }
    listener.needsUpdate = true;
  }
  function clearContext(listener) {
    delete listener.context;
    delete listener.needsUpdate;
  }
  function notifyGet(self2, property) {
    let currentCompute = computeStack[computeStack.length - 1];
    if (currentCompute) {
      setListeners(self2, property, currentCompute);
    }
  }
  var listenersMap = /* @__PURE__ */ new WeakMap();
  var computeMap = /* @__PURE__ */ new WeakMap();
  function getListeners(self2, property) {
    let listeners2 = listenersMap.get(self2);
    return listeners2 ? Array.from(listeners2.get(property) || []) : [];
  }
  function setListeners(self2, property, compute) {
    if (!listenersMap.has(self2)) {
      listenersMap.set(self2, /* @__PURE__ */ new Map());
    }
    let listeners2 = listenersMap.get(self2);
    if (!listeners2.has(property)) {
      listeners2.set(property, /* @__PURE__ */ new Set());
    }
    listeners2.get(property).add(compute);
    if (!computeMap.has(compute)) {
      computeMap.set(compute, /* @__PURE__ */ new Map());
    }
    let connectedSignals = computeMap.get(compute);
    if (!connectedSignals.has(property)) {
      connectedSignals.set(property, /* @__PURE__ */ new Set());
    }
    connectedSignals.get(property).add(self2);
  }
  function clearListeners(compute) {
    let connectedSignals = computeMap.get(compute);
    if (connectedSignals) {
      connectedSignals.forEach((property) => {
        property.forEach((s) => {
          let listeners2 = listenersMap.get(s);
          if (listeners2.has(property)) {
            listeners2.get(property).delete(compute);
          }
        });
      });
    }
  }
  var computeStack = [];
  var effectStack = [];
  var effectMap = /* @__PURE__ */ new WeakMap();
  var signalStack = [];
  function effect(fn) {
    if (effectStack.findIndex((f) => fn == f) !== -1) {
      throw new Error("Recursive update() call", { cause: fn });
    }
    effectStack.push(fn);
    let connectedSignal = signals.get(fn);
    if (!connectedSignal) {
      connectedSignal = signal({
        current: null
      });
      signals.set(fn, connectedSignal);
    }
    const computeEffect = function computeEffect2() {
      if (signalStack.findIndex((s) => s == connectedSignal) !== -1) {
        throw new Error("Cyclical dependency in update() call", { cause: fn });
      }
      clearListeners(computeEffect2);
      computeStack.push(computeEffect2);
      signalStack.push(connectedSignal);
      let result;
      try {
        result = fn(computeEffect2, computeStack, signalStack);
      } finally {
        computeStack.pop();
        signalStack.pop();
        if (result instanceof Promise) {
          result.then((result2) => {
            connectedSignal.current = result2;
          });
        } else {
          connectedSignal.current = result;
        }
      }
    };
    computeEffect.fn = fn;
    effectMap.set(connectedSignal, computeEffect);
    computeEffect();
    return connectedSignal;
  }
  function destroy(connectedSignal) {
    const computeEffect = effectMap.get(connectedSignal)?.deref();
    if (!computeEffect) {
      return;
    }
    clearListeners(computeEffect);
    let fn = computeEffect.fn;
    signals.remove(fn);
    effectMap.delete(connectedSignal);
  }
  function batch(fn) {
    batchMode++;
    let result;
    try {
      result = fn();
    } finally {
      if (result instanceof Promise) {
        result.then(() => {
          batchMode--;
          if (!batchMode) {
            runBatchedListeners();
          }
        });
      } else {
        batchMode--;
        if (!batchMode) {
          runBatchedListeners();
        }
      }
    }
    return result;
  }
  function runBatchedListeners() {
    let copyBatchedListeners = Array.from(batchedListeners);
    batchedListeners = /* @__PURE__ */ new Set();
    const currentEffect = computeStack[computeStack.length - 1];
    for (let listener of copyBatchedListeners) {
      if (listener != currentEffect && listener?.needsUpdate) {
        listener();
      }
      clearContext(listener);
    }
  }
  function throttledEffect(fn, throttleTime) {
    if (effectStack.findIndex((f) => fn == f) !== -1) {
      throw new Error("Recursive update() call", { cause: fn });
    }
    effectStack.push(fn);
    let connectedSignal = signals.get(fn);
    if (!connectedSignal) {
      connectedSignal = signal({
        current: null
      });
      signals.set(fn, connectedSignal);
    }
    let throttled = false;
    let hasChange = true;
    const computeEffect = function computeEffect2() {
      if (signalStack.findIndex((s) => s == connectedSignal) !== -1) {
        throw new Error("Cyclical dependency in update() call", { cause: fn });
      }
      if (throttled && throttled > Date.now()) {
        hasChange = true;
        return;
      }
      clearListeners(computeEffect2);
      computeStack.push(computeEffect2);
      signalStack.push(connectedSignal);
      let result;
      try {
        result = fn(computeEffect2, computeStack, signalStack);
      } finally {
        hasChange = false;
        computeStack.pop();
        signalStack.pop();
        if (result instanceof Promise) {
          result.then((result2) => {
            connectedSignal.current = result2;
          });
        } else {
          connectedSignal.current = result;
        }
      }
      throttled = Date.now() + throttleTime;
      globalThis.setTimeout(() => {
        if (hasChange) {
          computeEffect2();
        }
      }, throttleTime);
    };
    computeEffect();
    return connectedSignal;
  }
  function clockEffect(fn, clock) {
    let connectedSignal = signals.get(fn);
    if (!connectedSignal) {
      connectedSignal = signal({
        current: null
      });
      signals.set(fn, connectedSignal);
    }
    let lastTick = -1;
    let hasChanged = true;
    const computeEffect = function computeEffect2() {
      if (lastTick < clock.time) {
        if (hasChanged) {
          clearListeners(computeEffect2);
          computeStack.push(computeEffect2);
          lastTick = clock.time;
          let result;
          try {
            result = fn(computeEffect2, computeStack);
          } finally {
            computeStack.pop();
            if (result instanceof Promise) {
              result.then((result2) => {
                connectedSignal.current = result2;
              });
            } else {
              connectedSignal.current = result;
            }
            hasChanged = false;
          }
        } else {
          lastTick = clock.time;
        }
      } else {
        hasChanged = true;
      }
    };
    computeEffect();
    return connectedSignal;
  }
  function untracked(fn) {
    const remember = computeStack.slice();
    computeStack = [];
    try {
      return fn();
    } finally {
      computeStack = remember;
    }
  }

  // node_modules/simplyview/src/bind.mjs
  var SimplyBind = class {
    constructor(options) {
      this.bindings = /* @__PURE__ */ new Map();
      const defaultOptions = {
        container: document.body,
        attribute: "data-bind",
        transformers: [],
        defaultTransformers: [defaultTransformer]
      };
      if (!options?.root) {
        throw new Error("bind needs at least options.root set");
      }
      this.options = Object.assign({}, defaultOptions, options);
      const attribute = this.options.attribute;
      const render = (el) => {
        this.bindings.set(el, throttledEffect(() => {
          const context = {
            templates: el.querySelectorAll(":scope > template"),
            path: this.getBindingPath(el)
          };
          context.value = getValueByPath(this.options.root, context.path);
          context.element = el;
          runTransformers(context);
        }, 100));
      };
      const runTransformers = (context) => {
        let transformers2 = this.options.defaultTransformers || [];
        if (context.element.dataset.transform) {
          context.element.dataset.transform.split(" ").filter(Boolean).forEach((t6) => {
            if (this.options.transformers[t6]) {
              transformers2.push(this.options.transformers[t6]);
            } else {
              console.warn("No transformer with name " + t6 + " configured", { cause: context.element });
            }
          });
        }
        let next;
        for (let transformer of transformers2) {
          next = /* @__PURE__ */ ((next2, transformer2) => {
            return (context2) => {
              return transformer2.call(this, context2, next2);
            };
          })(next, transformer);
        }
        next(context);
      };
      const applyBindings = (bindings2) => {
        for (let bindingEl of bindings2) {
          render(bindingEl);
        }
      };
      const updateBindings = (changes) => {
        for (const change of changes) {
          if (change.type == "childList" && change.addedNodes) {
            for (let node of change.addedNodes) {
              if (node instanceof HTMLElement) {
                let bindings2 = Array.from(node.querySelectorAll(`[${attribute}]`));
                if (node.matches(`[${attribute}]`)) {
                  bindings2.unshift(node);
                }
                if (bindings2.length) {
                  applyBindings(bindings2);
                }
              }
            }
          }
        }
      };
      this.observer = new MutationObserver((changes) => {
        updateBindings(changes);
      });
      this.observer.observe(options.container, {
        subtree: true,
        childList: true
      });
      const bindings = this.options.container.querySelectorAll("[" + this.options.attribute + "]:not(template)");
      if (bindings.length) {
        applyBindings(bindings);
      }
    }
    /**
     * Finds the first matching template and creates a new DocumentFragment
     * with the correct data bind attributes in it (prepends the current path)
     */
    applyTemplate(context) {
      const path = context.path;
      const templates = context.templates;
      const list = context.list;
      const index = context.index;
      const parent = context.parent;
      const value = list ? list[index] : context.value;
      let template = this.findTemplate(templates, value);
      if (!template) {
        let result = new DocumentFragment();
        result.innerHTML = "<!-- no matching template -->";
        return result;
      }
      let clone2 = template.content.cloneNode(true);
      if (!clone2.children?.length) {
        throw new Error("template must contain a single html element", { cause: template });
      }
      if (clone2.children.length > 1) {
        throw new Error("template must contain a single root node", { cause: template });
      }
      const bindings = clone2.querySelectorAll("[" + this.options.attribute + "]");
      const attribute = this.options.attribute;
      for (let binding of bindings) {
        const bind2 = binding.getAttribute(attribute);
        if (bind2.substring(0, "#root.".length) == "#root.") {
          binding.setAttribute(attribute, bind2.substring("#root.".length));
        } else if (bind2 == "#value" && index != null) {
          binding.setAttribute(attribute, path + "." + index);
        } else if (index != null) {
          binding.setAttribute(attribute, path + "." + index + "." + bind2);
        } else {
          binding.setAttribute(attribute, parent + "." + bind2);
        }
      }
      if (typeof index !== "undefined") {
        clone2.children[0].setAttribute(attribute + "-key", index);
      }
      clone2.children[0].$bindTemplate = template;
      return clone2;
    }
    getBindingPath(el) {
      return el.getAttribute(this.options.attribute);
    }
    /**
     * Finds the first template from an array of templates that
     * matches the given value. 
     */
    findTemplate(templates, value) {
      const templateMatches = (t6) => {
        let path = this.getBindingPath(t6);
        let currentItem;
        if (path) {
          if (path.substr(0, 6) == "#root.") {
            currentItem = getValueByPath(this.options.root, path);
          } else {
            currentItem = getValueByPath(value, path);
          }
        } else {
          currentItem = value;
        }
        const strItem = "" + currentItem;
        let matches = t6.getAttribute(this.options.attribute + "-match");
        if (matches) {
          if (matches === "#empty" && !currentItem) {
            return t6;
          } else if (matches === "#notempty" && currentItem) {
            return t6;
          }
          if (strItem.match(matches)) {
            return t6;
          }
        }
        if (!matches) {
          if (currentItem) {
            return t6;
          }
        }
      };
      let template = Array.from(templates).find(templateMatches);
      let rel = template?.getAttribute("rel");
      if (rel) {
        let replacement = document.querySelector("template#" + rel);
        if (!replacement) {
          throw new Error("Could not find template with id " + rel);
        }
        template = replacement;
      }
      return template;
    }
    destroy() {
      this.bindings.forEach((binding) => {
        destroy(binding);
      });
      this.bindings = /* @__PURE__ */ new Map();
      this.observer.disconnect();
    }
  };
  function bind(options) {
    return new SimplyBind(options);
  }
  function matchValue(a, b) {
    if (a == "#empty" && !b) {
      return true;
    }
    if (b == "#empty" && !a) {
      return true;
    }
    if ("" + a == "" + b) {
      return true;
    }
    return false;
  }
  function getValueByPath(root, path) {
    let parts = path.split(".");
    let curr = root;
    let part, prevPart;
    while (parts.length && curr) {
      part = parts.shift();
      if (part == "#key") {
        return prevPart;
      } else if (part == "#value") {
        return curr;
      } else if (part == "#root") {
        curr = root;
      } else {
        part = decodeURIComponent(part);
        curr = curr[part];
        prevPart = part;
      }
    }
    return curr;
  }
  function defaultTransformer(context) {
    const el = context.element;
    const templates = context.templates;
    const templatesCount = templates.length;
    const path = context.path;
    const value = context.value;
    const attribute = this.options.attribute;
    if (Array.isArray(value) && templates?.length) {
      transformArrayByTemplates.call(this, context);
    } else if (typeof value == "object" && templates?.length) {
      transformObjectByTemplates.call(this, context);
    } else if (templates?.length) {
      transformLiteralByTemplates.call(this, context);
    } else if (el.tagName == "INPUT") {
      transformInput.call(this, context);
    } else if (el.tagName == "BUTTON") {
      transformButton.call(this, context);
    } else if (el.tagName == "SELECT") {
      transformSelect.call(this, context);
    } else if (el.tagName == "A") {
      transformAnchor.call(this, context);
    } else {
      transformElement.call(this, context);
    }
    return context;
  }
  function transformArrayByTemplates(context) {
    const el = context.element;
    const templates = context.templates;
    const templatesCount = templates.length;
    const path = context.path;
    const value = context.value;
    const attribute = this.options.attribute;
    let items = el.querySelectorAll(":scope > [" + attribute + "-key]");
    let lastKey = 0;
    let skipped = 0;
    context.list = value;
    for (let item of items) {
      let currentKey = parseInt(item.getAttribute(attribute + "-key"));
      if (currentKey > lastKey) {
        context.index = lastKey;
        el.insertBefore(this.applyTemplate(context), item);
      } else if (currentKey < lastKey) {
        item.remove();
      } else {
        let bindings = Array.from(item.querySelectorAll(`[${attribute}]`));
        if (item.matches(`[${attribute}]`)) {
          bindings.unshift(item);
        }
        let needsReplacement = bindings.find((b) => {
          let databind = b.getAttribute(attribute);
          return databind.substr(0, 5) !== "#root" && databind.substr(0, path.length) !== path;
        });
        if (!needsReplacement) {
          if (item.$bindTemplate) {
            let newTemplate = this.findTemplate(templates, value[lastKey]);
            if (newTemplate != item.$bindTemplate) {
              needsReplacement = true;
              if (!newTemplate) {
                skipped++;
              }
            }
          }
        }
        if (needsReplacement) {
          context.index = lastKey;
          el.replaceChild(this.applyTemplate(context), item);
        }
      }
      lastKey++;
      if (lastKey >= value.length) {
        break;
      }
    }
    items = el.querySelectorAll(":scope > [" + attribute + "-key]");
    let length = items.length + skipped;
    if (length > value.length) {
      while (length > value.length) {
        let child = el.querySelectorAll(":scope > :not(template)")?.[length - 1];
        child?.remove();
        length--;
      }
    } else if (length < value.length) {
      while (length < value.length) {
        context.index = length;
        el.appendChild(this.applyTemplate(context));
        length++;
      }
    }
  }
  function transformObjectByTemplates(context) {
    const el = context.element;
    const templates = context.templates;
    const templatesCount = templates.length;
    const path = context.path;
    const value = context.value;
    const attribute = this.options.attribute;
    context.list = value;
    let list = Object.entries(value);
    let items = el.querySelectorAll(":scope > [" + attribute + "-key]");
    let current = 0;
    let skipped = 0;
    for (let item of items) {
      if (current >= list.length) {
        break;
      }
      let key = list[current][0];
      current++;
      let keypath = path + "." + key;
      let needsReplacement;
      const databind = item.getAttribute(attribute);
      if (databind && databind.substr(0, keypath.length) != keypath) {
        needsReplacement = true;
      } else {
        let bindings = Array.from(item.querySelectorAll(`[${attribute}]`));
        needsReplacement = bindings.find((b) => {
          const db = b.getAttribute(attribute);
          return db.substr(0, 5) !== "#root" && db.substr(0, keypath.length) !== keypath;
        });
        if (!needsReplacement) {
          if (item.$bindTemplate) {
            let newTemplate = this.findTemplate(templates, value[key]);
            if (newTemplate != item.$bindTemplate) {
              needsReplacement = true;
              if (!newTemplate) {
                skipped++;
              }
            }
          }
        }
      }
      if (needsReplacement) {
        context.index = key;
        let clone2 = this.applyTemplate(context);
        el.replaceChild(clone2, item);
      }
    }
    items = el.querySelectorAll(":scope > [" + attribute + "-key]");
    let length = items.length + skipped;
    if (length > list.length) {
      while (length > list.length) {
        let child = el.querySelectorAll(":scope > :not(template)")?.[length - 1];
        child?.remove();
        length--;
      }
    } else if (length < list.length) {
      while (length < list.length) {
        context.index = list[length][0];
        el.appendChild(this.applyTemplate(context));
        length++;
      }
    }
  }
  function transformLiteralByTemplates(context) {
    const el = context.element;
    const templates = context.templates;
    const value = context.value;
    const attribute = this.options.attribute;
    const rendered = el.querySelector(":scope > :not(template)");
    const template = this.findTemplate(templates, value);
    context.parent = el.parentElement?.closest(`[${attribute}]`)?.getAttribute(attribute) || "#root";
    if (rendered) {
      if (template) {
        if (rendered?.$bindTemplate != template) {
          const clone2 = this.applyTemplate(context);
          el.replaceChild(clone2, rendered);
        }
      } else {
        el.removeChild(rendered);
      }
    } else if (template) {
      const clone2 = this.applyTemplate(context);
      el.appendChild(clone2);
    }
  }
  function transformInput(context) {
    const el = context.element;
    const value = context.value;
    if (el.type == "checkbox" || el.type == "radio") {
      if (matchValue(el.value, value)) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    } else if (!matchValue(el.value, value)) {
      el.value = "" + value;
    }
  }
  function transformButton(context) {
    const el = context.element;
    const value = context.value;
    if (!matchValue(el.value, value)) {
      el.value = "" + value;
    }
  }
  function transformSelect(context) {
    const el = context.element;
    const value = context.value;
    if (el.multiple) {
      if (Array.isArray(value)) {
        for (let option of el.options) {
          if (value.indexOf(option.value) === false) {
            option.selected = false;
          } else {
            option.selected = true;
          }
        }
      }
    } else {
      let option = el.options.find((o) => matchValue(o.value, value));
      if (option) {
        option.selected = true;
      }
    }
  }
  function transformAnchor(context) {
    const el = context.element;
    const value = context.value;
    if (value?.innerHTML && !matchValue(el.innerHTML, value.innerHTML)) {
      el.innerHTML = "" + value.innerHTML;
    }
    if (value?.href && !matchValue(el.href, value.href)) {
      el.href = "" + value.href;
    }
  }
  function transformElement(context) {
    const el = context.element;
    const value = context.value;
    if (!matchValue(el.innerHTML, value)) {
      el.innerHTML = "" + value;
    }
  }

  // node_modules/simplyview/src/app.mjs
  var SimplyApp = class {
    constructor(options = {}) {
      this.container = options.container || document.body;
      if (!options.state) {
        options.state = {};
      }
      this.state = signal(options.state);
      if (options.commands) {
        this.commands = commands({ app: this, container: this.container, commands: options.commands });
      }
      if (options.keys) {
        this.keys = keys({ app: this, keys: options.keys });
      }
      if (options.routes) {
        this.routes = routes({ app: this, routes: options.routes });
      }
      if (options.actions) {
        this.actions = actions({ app: this, actions: options.actions });
      }
      let bindOptions = { container: this.container, root: this.state };
      if (options.defaultTransformers) {
        bindOptions.defaultTransformers = options.defaultTransformers;
      }
      if (options.transformers) {
        bindOptions.transformers = options.transformers;
      }
      this.bind = bind(bindOptions);
    }
  };
  function app(options = {}) {
    return new SimplyApp(options);
  }

  // node_modules/simplyview/src/include.mjs
  function throttle(callbackFunction, intervalTime) {
    let eventId = 0;
    return () => {
      const myArguments = arguments;
      if (eventId) {
        return;
      } else {
        eventId = globalThis.setTimeout(() => {
          callbackFunction.apply(this, myArguments);
          eventId = 0;
        }, intervalTime);
      }
    };
  }
  var runWhenIdle = (() => {
    if (globalThis.requestIdleCallback) {
      return (callback) => {
        globalThis.requestIdleCallback(callback, { timeout: 500 });
      };
    }
    return globalThis.requestAnimationFrame;
  })();
  function rebaseHref(relative, base) {
    let url = new URL(relative, base);
    if (include.cacheBuster) {
      url.searchParams.set("cb", include.cacheBuster);
    }
    return url.href;
  }
  var observer2;
  var loaded = {};
  var head = globalThis.document.querySelector("head");
  var currentScript = globalThis.document.currentScript;
  var getScriptURL;
  var currentScriptURL;
  if (!currentScript) {
    getScriptURL = (() => {
      var scripts = document.getElementsByTagName("script");
      var index = scripts.length - 1;
      var myScript = scripts[index];
      return () => myScript.src;
    })();
    currentScriptURL = getScriptURL();
  } else {
    currentScriptURL = currentScript.src;
  }
  var waitForPreviousScripts = async () => {
    return new Promise(function(resolve) {
      var next = globalThis.document.createElement("script");
      next.src = rebaseHref("simply.include.next.js", currentScriptURL);
      next.async = false;
      globalThis.document.addEventListener("simply-include-next", () => {
        head.removeChild(next);
        resolve();
      }, { once: true, passive: true });
      head.appendChild(next);
    });
  };
  var scriptLocations = [];
  var include = {
    cacheBuster: null,
    scripts: (scripts, base) => {
      let arr = scripts.slice();
      const importScript = () => {
        const script = arr.shift();
        if (!script) {
          return;
        }
        const attrs = [].map.call(script.attributes, (attr) => {
          return attr.name;
        });
        let clone2 = globalThis.document.createElement("script");
        for (const attr of attrs) {
          clone2.setAttribute(attr, script.getAttribute(attr));
        }
        clone2.removeAttribute("data-simply-location");
        if (!clone2.src) {
          clone2.innerHTML = script.innerHTML;
          waitForPreviousScripts().then(() => {
            const node = scriptLocations[script.dataset.simplyLocation];
            node.parentNode.insertBefore(clone2, node);
            node.parentNode.removeChild(node);
            importScript();
          });
        } else {
          clone2.src = rebaseHref(clone2.src, base);
          if (!clone2.hasAttribute("async") && !clone2.hasAttribute("defer")) {
            clone2.async = false;
          }
          const node = scriptLocations[script.dataset.simplyLocation];
          node.parentNode.insertBefore(clone2, node);
          node.parentNode.removeChild(node);
          loaded[clone2.src] = true;
          importScript();
        }
      };
      if (arr.length) {
        importScript();
      }
    },
    html: (html, link) => {
      let fragment = globalThis.document.createRange().createContextualFragment(html);
      const stylesheets = fragment.querySelectorAll('link[rel="stylesheet"],style');
      for (let stylesheet of stylesheets) {
        if (stylesheet.href) {
          stylesheet.href = rebaseHref(stylesheet.href, link.href);
        }
        head.appendChild(stylesheet);
      }
      let scriptsFragment = globalThis.document.createDocumentFragment();
      const scripts = fragment.querySelectorAll("script");
      for (let script of scripts) {
        let placeholder = globalThis.document.createComment(script.src || "inline script");
        script.parentNode.insertBefore(placeholder, script);
        script.dataset.simplyLocation = scriptLocations.length;
        scriptLocations.push(placeholder);
        scriptsFragment.appendChild(script);
      }
      link.parentNode.insertBefore(fragment, link ? link : null);
      globalThis.setTimeout(function() {
        include.scripts(scriptsFragment.childNodes, link ? link.href : globalThis.location.href);
      }, 10);
    }
  };
  var included = {};
  var includeLinks = async (links) => {
    let remainingLinks = [].reduce.call(links, (remainder, link) => {
      if (link.rel == "simply-include-once" && included[link.href]) {
        link.parentNode.removeChild(link);
      } else {
        included[link.href] = true;
        link.rel = "simply-include-loading";
        remainder.push(link);
      }
      return remainder;
    }, []);
    for (let link of remainingLinks) {
      if (!link.href) {
        return;
      }
      const response = await fetch(link.href);
      if (!response.ok) {
        console.log("simply-include: failed to load " + link.href);
        continue;
      }
      console.log("simply-include: loaded " + link.href);
      const html = await response.text();
      include.html(html, link);
      link.parentNode.removeChild(link);
    }
  };
  var handleChanges2 = throttle(() => {
    runWhenIdle(() => {
      var links = globalThis.document.querySelectorAll('link[rel="simply-include"],link[rel="simply-include-once"]');
      if (links.length) {
        includeLinks(links);
      }
    });
  });
  var observe = () => {
    observer2 = new MutationObserver(handleChanges2);
    observer2.observe(globalThis.document, {
      subtree: true,
      childList: true
    });
  };
  observe();
  handleChanges2();

  // node_modules/simplyview/src/model.mjs
  var model_exports = {};
  __export(model_exports, {
    columns: () => columns,
    filter: () => filter,
    model: () => model,
    paging: () => paging,
    sort: () => sort
  });
  var SimplyModel = class {
    /**
     * Creates a new datamodel, with a state property that contains
     * all the data passed to this constructor
     * @param state	Object with all the data for this model
     */
    constructor(state) {
      this.state = signal(state);
      if (!this.state.options) {
        this.state.options = {};
      }
      this.effects = [{ current: state.data }];
      this.view = signal(state.data);
    }
    /**
     * Adds an effect to run whenever a signal it depends on
     * changes. this.state is the usual signal.
     * The `fn` function param is not itself an effect, but must return
     * and effect function. `fn` takes one param, which is the data signal.
     * This signal will always have at least a `current` property.
     * The result of the effect function is pushed on to the this.effects
     * list. And the last effect added is set as this.view
     */
    addEffect(fn) {
      const dataSignal = this.effects[this.effects.length - 1];
      this.view = fn.call(this, dataSignal);
      this.effects.push(this.view);
    }
  };
  function model(options) {
    return new SimplyModel(options);
  }
  function sort(options = {}) {
    return function(data) {
      this.state.options.sort = Object.assign({
        direction: "asc",
        sortBy: null,
        sortFn: (a, b) => {
          const sort2 = this.state.options.sort;
          const sortBy = sort2.sortBy;
          if (!sort2.sortBy) {
            return 0;
          }
          const larger = sort2.direction == "asc" ? 1 : -1;
          const smaller = sort2.direction == "asc" ? -1 : 1;
          if (typeof a?.[sortBy] === "undefined") {
            if (typeof b?.[sortBy] === "undefined") {
              return 0;
            }
            return larger;
          }
          if (typeof b?.[sortBy] === "undefined") {
            return smaller;
          }
          if (a[sortBy] < b[sortBy]) {
            return smaller;
          } else if (a[sortBy] > b[sortBy]) {
            return larger;
          } else {
            return 0;
          }
        }
      }, options);
      return effect(() => {
        const sort2 = this.state.options.sort;
        if (sort2?.sortBy && sort2?.direction) {
          return data.current.toSorted(sort2?.sortFn);
        }
        return data.current;
      });
    };
  }
  function paging(options = {}) {
    return function(data) {
      this.state.options.paging = Object.assign({
        page: 1,
        pageSize: 20,
        max: 1
      }, options);
      return effect(() => {
        return batch(() => {
          const paging2 = this.state.options.paging;
          if (!paging2.pageSize) {
            paging2.pageSize = 20;
          }
          paging2.max = Math.ceil(this.state.data.length / paging2.pageSize);
          paging2.page = Math.max(1, Math.min(paging2.max, paging2.page));
          const start = (paging2.page - 1) * paging2.pageSize;
          const end = start + paging2.pageSize;
          return data.current.slice(start, end);
        });
      });
    };
  }
  function filter(options) {
    if (!options?.name || typeof options.name !== "string") {
      throw new Error("filter requires options.name to be a string");
    }
    if (!options.matches || typeof options.matches !== "function") {
      throw new Error("filter requires options.matches to be a function");
    }
    return function(data) {
      this.state.options[options.name] = options;
      return effect(() => {
        if (this.state.options[options.name].enabled) {
          return data.filter(this.state.options.matches);
        }
      });
    };
  }
  function columns(options = {}) {
    if (!options || typeof options !== "object" || Object.keys(options).length === 0) {
      throw new Error("columns requires options to be an object with at least one property");
    }
    return function(data) {
      this.state.options.columns = options;
      return effect(() => {
        return data.current.map((input) => {
          let result = {};
          for (let key of Object.keys(this.state.options.columns)) {
            if (!this.state.options.columns[key].hidden) {
              result[key] = input[key];
            }
          }
          return result;
        });
      });
    };
  }

  // node_modules/simplyview/src/everything.mjs
  var simply = {
    activate,
    action: action_exports,
    app,
    bind,
    command: command_exports,
    include,
    key: key_exports,
    model: model_exports,
    route: route_exports,
    state: state_exports
  };
  window.simply = simply;
  var everything_default = simply;

  // src/app.mjs
  var zett = everything_default.app({
    routes: {},
    keys: {
      default: {
        ...appui.keys.default,
        "Control+ ": function(evt) {
          this.menu.showPopover();
          this.menu.querySelector("a").focus();
        }
      }
    },
    commands: {
      ...appui.commands,
      openLink: async function(el, value) {
        const buttonPos = getOffset(el);
        try {
          const file = await this.actions.openLink(el.href);
          if (!file) {
            return;
          }
          this.state.worksheets[0].files[zett.state.file].position = {
            x: buttonPos.left,
            y: buttonPos.top
          };
        } catch (error) {
          alert(error.message);
        }
      },
      addFile: async function(form, values) {
        this.actions.uiCloseDialog(this.dialogs.addFile);
        try {
          const file = await this.actions.addFile(values.url);
          window.setTimeout(() => {
            document.querySelector(".zett-entity").classList.remove("zett-pre-entity");
            document.querySelector('.zett-entity [name="value"]').focus();
          }, 100);
        } catch (error) {
          this.state.fetchUrl = values.url;
          this.actions.uiOpenModalDialog(this.dialogs.setIssuer);
        }
      },
      zettMenu: async function(el, value) {
        this.menu.togglePopover();
      },
      zettAddFileDialog: async function(el, value) {
        this.menu.hidePopover();
        this.actions.uiOpenModalDialog(this.dialogs.addFile);
      }
    },
    actions: {
      ...appui.actions,
      openLink: async function(url) {
        url = new URL(url);
        const file = await this.actions.addFile(url);
        if (!file) {
          return;
        }
        if (url.hash) {
        }
        return file;
      },
      addFile: async function(url) {
        const file = await solidApi.fetch(url, this.state.login);
        const data = solidApi.mergeSubjects(file.data, url, file.prefixes);
        if (!this.state.worksheetIndex) {
          this.state.worksheetIndex = 0;
        }
        const wsi = this.state.worksheetIndex;
        if (!this.state.worksheets[wsi]) {
          this.state.worksheets[wsi] = {
            name: "new worksheet",
            files: []
          };
        }
        const worksheet = this.state.worksheets[wsi];
        worksheet.files.push({
          name: url.href.split("/").pop(),
          url,
          data,
          prefixes: file.prefixes
        });
        this.state.file = worksheet.files.lenght - 1;
        return file;
      }
    },
    transformers,
    state: {
      ...appui.state,
      test: "1",
      test2: "foo",
      worksheets: [
        {
          title: "A worksheet",
          files: []
        }
      ]
    }
  });
  console.log("worksheets", zett.state.worksheets);
  zett.dialogs = {
    addFile: document.getElementById("zettAddFileDialog"),
    setIssuer: document.getElementById("zettSetIssuerDialog")
  };
  zett.menu = document.getElementById("zett-menu");
  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }
  window.zett = zett;
})();
/*! Bundled license information:

@inrupt/oidc-client/lib/oidc-client.min.js:
  (*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
   *)
  (*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
   *)
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <http://feross.org>
   * @license  MIT
   *)
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

@muze-nl/oldm/dist/oldm.mjs:
  (*! Bundled license information:
  
  queue-microtask/index.js:
    (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  
  safe-buffer/index.js:
    (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  *)
*/
//# sourceMappingURL=app.bundle.js.map
