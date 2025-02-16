(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@muze-nl/metro/src/metro.mjs
  var metro_exports = {};
  __export(metro_exports, {
    client: () => client,
    formdata: () => formdata,
    metroError: () => metroError,
    request: () => request,
    response: () => response,
    trace: () => trace,
    url: () => url
  });
  var metroURL = "https://metro.muze.nl/details/";
  if (!Symbol.metroProxy) {
    Symbol.metroProxy = Symbol("isProxy");
  }
  if (!Symbol.metroSource) {
    Symbol.metroSource = Symbol("source");
  }
  var Client = class _Client {
    #options = {
      url: typeof window != "undefined" ? window.location : "https://localhost"
    };
    #verbs = ["get", "post", "put", "delete", "patch", "head", "options", "query"];
    static tracers = {};
    /**
     * @typedef {Object} ClientOptions
     * @property {Array} middlewares - list of middleware functions
     * @property {string|URL} url - default url of the client
     * @property {[string]} verbs - a list of verb methods to expose, e.g. ['get','post']
     * 
     * Constructs a new metro client. Can have any number of params.
     * @params {ClientOptions|URL|Function|Client}
     * @returns {Client} - A metro client object with given or default verb methods
     */
    constructor(...options) {
      for (let option of options) {
        if (typeof option == "string" || option instanceof String) {
          this.#options.url = "" + option;
        } else if (option instanceof _Client) {
          Object.assign(this.#options, option.#options);
        } else if (option instanceof Function) {
          this.#addMiddlewares([option]);
        } else if (option && typeof option == "object") {
          for (let param in option) {
            if (param == "middlewares") {
              this.#addMiddlewares(option[param]);
            } else if (typeof option[param] == "function") {
              this.#options[param] = option[param](this.#options[param], this.#options);
            } else {
              this.#options[param] = option[param];
            }
          }
        }
      }
      if (this.#options.verbs) {
        this.#verbs = this.#options.verbs;
        delete this.#options.verbs;
      }
      for (const verb of this.#verbs) {
        this[verb] = async function(...options2) {
          return this.fetch(request(
            this.#options,
            ...options2,
            { method: verb.toUpperCase() }
          ));
        };
      }
      Object.freeze(this);
    }
    #addMiddlewares(middlewares) {
      if (typeof middlewares == "function") {
        middlewares = [middlewares];
      }
      let index = middlewares.findIndex((m) => typeof m != "function");
      if (index >= 0) {
        throw metroError("metro.client: middlewares must be a function or an array of functions " + metroURL + "client/invalid-middlewares/", middlewares[index]);
      }
      if (!Array.isArray(this.#options.middlewares)) {
        this.#options.middlewares = [];
      }
      this.#options.middlewares = this.#options.middlewares.concat(middlewares);
    }
    /**
     * Mimics the standard browser fetch method, but uses any middleware installed through
     * the constructor.
     * @param {Request|string|Object} - Required. The URL or Request object, accepts all types that are accepted by metro.request
     * @param {Object} - Optional. Any object that is accepted by metro.request
     * @return {Promise<Response|*>} - The metro.response to this request, or any other result as changed by any included middleware.
     */
    fetch(req, options) {
      req = request(req, options);
      if (!req.url) {
        throw metroError("metro.client." + req.method.toLowerCase() + ": Missing url parameter " + metroURL + "client/fetch-missing-url/", req);
      }
      if (!options) {
        options = {};
      }
      if (!(typeof options === "object") || options instanceof String) {
        throw metroError("metro.client.fetch: Invalid options parameter " + metroURL + "client/fetch-invalid-options/", options);
      }
      const metrofetch = async function browserFetch(req2) {
        if (req2[Symbol.metroProxy]) {
          req2 = req2[Symbol.metroSource];
        }
        const res = await fetch(req2);
        return response(res);
      };
      let middlewares = [metrofetch].concat(this.#options?.middlewares?.slice() || []);
      options = Object.assign({}, this.#options, options);
      let next;
      for (let middleware of middlewares) {
        next = /* @__PURE__ */ function(next2, middleware2) {
          return async function(req2) {
            let res;
            let tracers = Object.values(_Client.tracers);
            for (let tracer of tracers) {
              if (tracer.request) {
                tracer.request.call(tracer, req2, middleware2);
              }
            }
            res = await middleware2(req2, next2);
            for (let tracer of tracers) {
              if (tracer.response) {
                tracer.response.call(tracer, res, middleware2);
              }
            }
            return res;
          };
        }(next, middleware);
      }
      return next(req);
    }
    with(...options) {
      return new _Client(this, ...options);
    }
  };
  function client(...options) {
    return new Client(...options);
  }
  function getRequestParams(req, current) {
    let params2 = current || {};
    if (!params2.url && current.url) {
      params2.url = current.url;
    }
    for (let prop of [
      "method",
      "headers",
      "body",
      "mode",
      "credentials",
      "cache",
      "redirect",
      "referrer",
      "referrerPolicy",
      "integrity",
      "keepalive",
      "signal",
      "priority",
      "url"
    ]) {
      let value = req[prop];
      if (typeof value == "undefined" || value == null) {
        continue;
      }
      if (value?.[Symbol.metroProxy]) {
        value = value[Symbol.metroSource];
      }
      if (typeof value == "function") {
        params2[prop] = value(params2[prop], params2);
      } else {
        if (prop == "url") {
          params2.url = url(params2.url, value);
        } else if (prop == "headers") {
          params2.headers = new Headers(current.headers);
          if (!(value instanceof Headers)) {
            value = new Headers(req.headers);
          }
          for (let [key, val] of value.entries()) {
            params2.headers.set(key, val);
          }
        } else {
          params2[prop] = value;
        }
      }
    }
    if (req instanceof Request && req.data) {
      params2.body = req.data;
    }
    return params2;
  }
  function request(...options) {
    let requestParams = {
      url: typeof window != "undefined" ? window.location : "https://localhost/",
      duplex: "half"
      // required when setting body to ReadableStream, just set it here by default already
    };
    for (let option of options) {
      if (typeof option == "string" || option instanceof URL || option instanceof URLSearchParams) {
        requestParams.url = url(requestParams.url, option);
      } else if (option && (option instanceof FormData || option instanceof ReadableStream || option instanceof Blob || option instanceof ArrayBuffer || option instanceof DataView)) {
        requestParams.body = option;
      } else if (option && typeof option == "object") {
        Object.assign(requestParams, getRequestParams(option, requestParams));
      }
    }
    let r = new Request(requestParams.url, requestParams);
    let data = requestParams.body;
    if (data) {
      if (typeof data == "object" && !(data instanceof String) && !(data instanceof ReadableStream) && !(data instanceof Blob) && !(data instanceof ArrayBuffer) && !(data instanceof DataView) && !(data instanceof FormData) && !(data instanceof URLSearchParams) && (typeof TypedArray == "undefined" || !(data instanceof TypedArray))) {
        if (typeof data.toString == "function") {
          requestParams.body = data.toString({ headers: r.headers });
          r = new Request(requestParams.url, requestParams);
        }
      }
    }
    Object.freeze(r);
    return new Proxy(r, {
      get(target, prop, receiver) {
        switch (prop) {
          case Symbol.metroSource:
            return target;
            break;
          case Symbol.metroProxy:
            return true;
            break;
          case "with":
            return function(...options2) {
              if (data) {
                options2.unshift({ body: data });
              }
              return request(target, ...options2);
            };
            break;
          case "data":
            return data;
            break;
        }
        if (target[prop] instanceof Function) {
          if (prop === "clone") {
          }
          return target[prop].bind(target);
        }
        return target[prop];
      }
    });
  }
  function getResponseParams(res, current) {
    let params2 = current || {};
    if (!params2.url && current.url) {
      params2.url = current.url;
    }
    for (let prop of ["status", "statusText", "headers", "body", "url", "type", "redirected"]) {
      let value = res[prop];
      if (typeof value == "undefined" || value == null) {
        continue;
      }
      if (value?.[Symbol.metroProxy]) {
        value = value[Symbol.metroSource];
      }
      if (typeof value == "function") {
        params2[prop] = value(params2[prop], params2);
      } else {
        if (prop == "url") {
          params2.url = new URL(value, params2.url || "https://localhost/");
        } else {
          params2[prop] = value;
        }
      }
    }
    if (res instanceof Response && res.data) {
      params2.body = res.data;
    }
    return params2;
  }
  function response(...options) {
    let responseParams = {};
    for (let option of options) {
      if (typeof option == "string") {
        responseParams.body = option;
      } else if (option instanceof Response) {
        Object.assign(responseParams, getResponseParams(option, responseParams));
      } else if (option && typeof option == "object") {
        if (option instanceof FormData || option instanceof Blob || option instanceof ArrayBuffer || option instanceof DataView || option instanceof ReadableStream || option instanceof URLSearchParams || option instanceof String || typeof TypedArray != "undefined" && option instanceof TypedArray) {
          responseParams.body = option;
        } else {
          Object.assign(responseParams, getResponseParams(option, responseParams));
        }
      }
    }
    let data = void 0;
    if (responseParams.body) {
      data = responseParams.body;
    }
    if ([101, 204, 205, 304].includes(responseParams.status)) {
      responseParams.body = null;
    }
    let r = new Response(responseParams.body, responseParams);
    Object.freeze(r);
    return new Proxy(r, {
      get(target, prop, receiver) {
        switch (prop) {
          case Symbol.metroProxy:
            return true;
            break;
          case Symbol.metroSource:
            return target;
            break;
          case "with":
            return function(...options2) {
              return response(target, ...options2);
            };
            break;
          case "data":
            return data;
            break;
          case "ok":
            return target.status >= 200 && target.status < 400;
            break;
        }
        if (typeof target[prop] == "function") {
          return target[prop].bind(target);
        }
        return target[prop];
      }
    });
  }
  function appendSearchParams(url2, params2) {
    if (typeof params2 == "function") {
      params2(url2.searchParams, url2);
    } else {
      params2 = new URLSearchParams(params2);
      params2.forEach((value, key) => {
        url2.searchParams.append(key, value);
      });
    }
  }
  function url(...options) {
    let validParams = [
      "hash",
      "host",
      "hostname",
      "href",
      "password",
      "pathname",
      "port",
      "protocol",
      "username",
      "search",
      "searchParams"
    ];
    let u = new URL("https://localhost/");
    for (let option of options) {
      if (typeof option == "string" || option instanceof String) {
        u = new URL(option, u);
      } else if (option instanceof URL || typeof Location != "undefined" && option instanceof Location) {
        u = new URL(option);
      } else if (option instanceof URLSearchParams) {
        appendSearchParams(u, option);
      } else if (option && typeof option == "object") {
        for (let param in option) {
          switch (param) {
            case "search":
              if (typeof option.search == "function") {
                option.search(u.search, u);
              } else {
                u.search = new URLSearchParams(option.search);
              }
              break;
            case "searchParams":
              appendSearchParams(u, option.searchParams);
              break;
            default:
              if (!validParams.includes(param)) {
                throw metroError("metro.url: unknown url parameter " + metroURL + "url/unknown-param-name/", param);
              }
              if (typeof option[param] == "function") {
                option[param](u[param], u);
              } else if (typeof option[param] == "string" || option[param] instanceof String || typeof option[param] == "number" || option[param] instanceof Number || typeof option[param] == "boolean" || option[param] instanceof Boolean) {
                u[param] = "" + option[param];
              } else if (typeof option[param] == "object" && option[param].toString) {
                u[param] = option[param].toString();
              } else {
                throw metroError("metro.url: unsupported value for " + param + " " + metroURL + "url/unsupported-param-value/", options[param]);
              }
              break;
          }
        }
      } else {
        throw metroError("metro.url: unsupported option value " + metroURL + "url/unsupported-option-value/", option);
      }
    }
    Object.freeze(u);
    return new Proxy(u, {
      get(target, prop, receiver) {
        switch (prop) {
          case Symbol.metroProxy:
            return true;
            break;
          case Symbol.metroSource:
            return target;
            break;
          case "with":
            return function(...options2) {
              return url(target, ...options2);
            };
            break;
          case "filename":
            return target.pathname.split("/").pop();
            break;
          case "folderpath":
            return target.pathname.substring(0, target.pathname.lastIndexOf("\\") + 1);
            break;
        }
        if (target[prop] instanceof Function) {
          return target[prop].bind(target);
        }
        return target[prop];
      }
    });
  }
  function formdata(...options) {
    var params2 = new FormData();
    for (let option of options) {
      if (option instanceof HTMLFormElement) {
        option = new FormData(option);
      }
      if (option instanceof FormData) {
        for (let entry of option.entries()) {
          params2.append(entry[0], entry[1]);
        }
      } else if (option && typeof option == "object") {
        for (let entry of Object.entries(option)) {
          if (Array.isArray(entry[1])) {
            for (let value of entry[1]) {
              params2.append(entry[0], value);
            }
          } else {
            params2.append(entry[0], entry[1]);
          }
        }
      } else {
        throw new metroError("metro.formdata: unknown option type " + metroURL + "formdata/unknown-option-value/", option);
      }
    }
    Object.freeze(params2);
    return new Proxy(params2, {
      get: (target, prop, receiver) => {
        switch (prop) {
          case Symbol.metroProxy:
            return true;
            break;
          case Symbol.metroSource:
            return target;
            break;
          //TODO: add toString() that can check
          //headers param: toString({headers:request.headers})
          //for the content-type
          case "with":
            return function(...options2) {
              return formdata(target, ...options2);
            };
            break;
        }
        if (target[prop] instanceof Function) {
          return target[prop].bind(target);
        }
        return target[prop];
      }
    });
  }
  var metroConsole = {
    error: (message, ...details) => {
      console.error("\u24C2\uFE0F  ", message, ...details);
    },
    info: (message, ...details) => {
      console.info("\u24C2\uFE0F  ", message, ...details);
    },
    group: (name) => {
      console.group("\u24C2\uFE0F  " + name);
    },
    groupEnd: (name) => {
      console.groupEnd("\u24C2\uFE0F  " + name);
    }
  };
  function metroError(message, ...details) {
    metroConsole.error(message, ...details);
    return new Error(message, ...details);
  }
  var trace = {
    /**
     * Adds a named tracer function
     * @param {string} name - the name of the tracer
     * @param {Function} tracer - the tracer function to call
     */
    add(name, tracer) {
      Client.tracers[name] = tracer;
    },
    /**
     * Removes a named tracer function
     * @param {string} name
     */
    delete(name) {
      delete Client.tracers[name];
    },
    /**
     * Removes all tracer functions
     */
    clear() {
      Client.tracers = {};
    },
    /**
     * Returns a set of request and response tracer functions that use the
     * console.group feature to shows nested request/response pairs, with
     * most commonly needed information for debugging
     */
    group() {
      let group = 0;
      return {
        request: (req, middleware) => {
          group++;
          metroConsole.group(group);
          metroConsole.info(req?.url, req, middleware);
        },
        response: (res, middleware) => {
          metroConsole.info(res?.body ? res.body[Symbol.metroSource] : null, res, middleware);
          metroConsole.groupEnd(group);
          group--;
        }
      };
    }
  };

  // node_modules/@muze-nl/metro/src/mw/thrower.mjs
  function thrower(options) {
    return async (req, next) => {
      let res = await next(req);
      if (!res.ok) {
        if (options && typeof options[res.status] == "function") {
          res = options[res.status].apply(res, req);
        } else {
          throw new Error(res.status + ": " + res.statusText, {
            cause: res
          });
        }
      }
      return res;
    };
  }

  // node_modules/@muze-nl/metro/src/mw/json.mjs
  function jsonmw(options) {
    options = Object.assign({
      mimetype: "application/json",
      reviver: null,
      replacer: null,
      space: ""
    }, options);
    return async (req, next) => {
      if (!isJSON(req.headers.get("Accept"))) {
        req = req.with({
          headers: {
            "Accept": options.mimetype
          }
        });
      }
      if (["POST", "PUT", "PATCH", "QUERY"].includes(req.method)) {
        if (req.data && typeof req.data == "object" && !(req.data instanceof ReadableStream)) {
          if (!isJSON(req.headers.get("content-type"))) {
            req = req.with({
              headers: {
                "Content-Type": options.mimetype
              }
            });
          }
          req = req.with({
            body: JSON.stringify(req.data, options.replacer, options.space)
          });
        }
      }
      let res = await next(req);
      if (isJSON(res.headers.get("content-type"))) {
        let tempRes = res.clone();
        let body = await tempRes.text();
        try {
          let json = JSON.parse(body, options.reviver);
          return res.with({
            body: json
          });
        } catch (e) {
        }
      }
      return res;
    };
  }
  var jsonRE = /^application\/([a-zA-Z0-9\-_]+\+)?json\b/;
  function isJSON(contentType) {
    return jsonRE.exec(contentType);
  }

  // node_modules/@muze-nl/metro/src/everything.mjs
  var metro = Object.assign({}, metro_exports, {
    mw: {
      jsonmw,
      thrower
    }
  });
  if (!globalThis.metro) {
    globalThis.metro = metro;
  }
  var everything_default = metro;

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mjs
  var oauth2_exports = {};
  __export(oauth2_exports, {
    base64url_encode: () => base64url_encode,
    createState: () => createState,
    default: () => oauth2mw,
    generateCodeChallenge: () => generateCodeChallenge,
    generateCodeVerifier: () => generateCodeVerifier,
    getExpires: () => getExpires,
    isAuthorized: () => isAuthorized,
    isExpired: () => isExpired,
    isRedirected: () => isRedirected
  });

  // node_modules/@muze-nl/assert/src/assert.mjs
  globalThis.assertEnabled = false;
  function assert(source, test) {
    if (globalThis.assertEnabled) {
      let problems = fails(source, test);
      if (problems) {
        console.error("\u{1F170}\uFE0F  Assertions failed because of:", problems, "in this source:", source);
        throw new Error("Assertions failed", {
          cause: { problems, source }
        });
      }
    }
  }
  function Optional(pattern) {
    return function _Optional(data, root, path) {
      if (typeof data != "undefined" && data != null && typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      }
    };
  }
  function Required(pattern) {
    return function _Required(data, root, path) {
      if (data == null || typeof data == "undefined") {
        return error2("data is required", data, pattern || "any value", path);
      } else if (typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      } else {
        return false;
      }
    };
  }
  function Recommended(pattern) {
    return function _Recommended(data, root, path) {
      if (data == null || typeof data == "undefined") {
        console.warn("data does not contain recommended value", data, pattern, path);
        return false;
      } else {
        return fails(data, pattern, root, path);
      }
    };
  }
  function oneOf(...patterns) {
    return function _oneOf(data, root, path) {
      for (let pattern of patterns) {
        if (!fails(data, pattern, root, path)) {
          return false;
        }
      }
      return error2("data does not match oneOf patterns", data, patterns, path);
    };
  }
  function anyOf(...patterns) {
    return function _anyOf(data, root, path) {
      if (!Array.isArray(data)) {
        return error2("data is not an array", data, "anyOf", path);
      }
      for (let value of data) {
        if (oneOf(...patterns)(value)) {
          return error2("data does not match anyOf patterns", value, patterns, path);
        }
      }
      return false;
    };
  }
  function allOf(...patterns) {
    return function _allOf(data, root, path) {
      let problems = [];
      for (let pattern of patterns) {
        problems = problems.concat(fails(data, pattern, root, path));
      }
      problems = problems.filter(Boolean);
      if (problems.length) {
        return error2("data does not match all given patterns", data, patterns, path, problems);
      }
    };
  }
  function validURL(data, root, path) {
    try {
      if (data instanceof URL) {
        data = data.href;
      }
      let url2 = new URL(data);
      if (url2.href != data) {
        if (!(url2.href + "/" == data || url2.href == data + "/")) {
          return error2("data is not a valid url", data, "validURL", path);
        }
      }
    } catch (e) {
      return error2("data is not a valid url", data, "validURL", path);
    }
  }
  function validEmail(data, root, path) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
      return error2("data is not a valid email", data, "validEmail", path);
    }
  }
  function instanceOf(constructor) {
    return function _instanceOf(data, root, path) {
      if (!(data instanceof constructor)) {
        return error2("data is not an instanceof pattern", data, constructor, path);
      }
    };
  }
  function not(pattern) {
    return function _not(data, root, path) {
      if (!fails(data, pattern, root, path)) {
        return error2("data matches pattern, when required not to", data, pattern, path);
      }
    };
  }
  function fails(data, pattern, root, path = "") {
    if (!root) {
      root = data;
    }
    let problems = [];
    if (pattern === Boolean) {
      if (typeof data != "boolean" && !(data instanceof Boolean)) {
        problems.push(error2("data is not a boolean", data, pattern, path));
      }
    } else if (pattern === Number) {
      if (typeof data != "number" && !(data instanceof Number)) {
        problems.push(error2("data is not a number", data, pattern, path));
      }
    } else if (pattern === String) {
      if (typeof data != "string" && !(data instanceof String)) {
        problems.push(error2("data is not a string", data, pattern, path));
      }
      if (data == "") {
        problems.push(error2("data is an empty string, which is not allowed", data, pattern, path));
      }
    } else if (pattern instanceof RegExp) {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, path + "[" + index2 + "]"));
        if (index > -1) {
          problems.push(error2("data[" + index + "] does not match pattern", data[index], pattern, path + "[" + index + "]"));
        }
      } else if (typeof data == "undefined") {
        problems.push(error2("data is undefined, should match pattern", data, pattern, path));
      } else if (!pattern.test(data)) {
        problems.push(error2("data does not match pattern", data, pattern, path));
      }
    } else if (pattern instanceof Function) {
      let problem = pattern(data, root, path);
      if (problem) {
        if (Array.isArray(problem)) {
          problems = problems.concat(problem);
        } else {
          problems.push(problem);
        }
      }
    } else if (Array.isArray(pattern)) {
      if (!Array.isArray(data)) {
        problems.push(error2("data is not an array", data, [], path));
      }
      for (let p of pattern) {
        for (let index of data.keys()) {
          let problem = fails(data[index], p, root, path + "[" + index + "]");
          if (Array.isArray(problem)) {
            problems = problems.concat(problem);
          } else if (problem) {
            problems.push(problem);
          }
        }
      }
    } else if (pattern && typeof pattern == "object") {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, path + "[" + index2 + "]"));
        if (index > -1) {
          problems.push(error2("data[" + index + "] does not match pattern", data[index], pattern, path + "[" + index + "]"));
        }
      } else if (!data || typeof data != "object") {
        problems.push(error2("data is not an object, pattern is", data, pattern, path));
      } else {
        if (data instanceof URLSearchParams) {
          data = Object.fromEntries(data);
        }
        if (pattern instanceof Function) {
          let result2 = fails(data, pattern, root, path);
          if (result2) {
            problems = problems.concat(result2);
          }
        } else {
          for (const [wKey, wVal] of Object.entries(pattern)) {
            let result2 = fails(data[wKey], wVal, root, path + "." + wKey);
            if (result2) {
              problems = problems.concat(result2);
            }
          }
        }
      }
    } else {
      if (pattern != data) {
        problems.push(error2("data and pattern are not equal", data, pattern, path));
      }
    }
    if (problems.length) {
      return problems;
    }
    return false;
  }
  function error2(message, found, expected, path, problems) {
    let result2 = {
      message,
      found,
      expected,
      path
    };
    if (problems) {
      result2.problems = problems;
    }
    return result2;
  }

  // node_modules/@muze-nl/metro-oauth2/src/tokenstore.mjs
  function tokenStore(site) {
    let localState, localTokens;
    if (typeof localStorage !== "undefined") {
      localState = {
        get: () => localStorage.getItem("metro/state:" + site),
        set: (value) => localStorage.setItem("metro/state:" + site, value),
        has: () => localStorage.getItem("metro/state:" + site) !== null
      };
      localTokens = {
        get: (name) => JSON.parse(localStorage.getItem(site + ":" + name)),
        set: (name, value) => localStorage.setItem(site + ":" + name, JSON.stringify(value)),
        has: (name) => localStorage.getItem(site + ":" + name) !== null
      };
    } else {
      let stateMap = /* @__PURE__ */ new Map();
      localState = {
        get: () => stateMap.get("metro/state:" + site),
        set: (value) => stateMap.set("metro/state:" + site, value),
        has: () => stateMap.has("metro/state:" + site)
      };
      localTokens = /* @__PURE__ */ new Map();
    }
    return {
      state: localState,
      tokens: localTokens
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mjs
  function oauth2mw(options) {
    const defaultOptions = {
      client: client(),
      force_authorization: false,
      site: "default",
      oauth2_configuration: {
        authorization_endpoint: "/authorize",
        token_endpoint: "/token",
        redirect_uri: globalThis.document?.location.href,
        grant_type: "authorization_code",
        code_verifier: generateCodeVerifier(64)
      },
      authorize_callback: async (url2) => {
        if (window.location.href != url2.href) {
          window.location.replace(url2.href);
        }
        return false;
      }
    };
    assert(options, {});
    const oauth22 = Object.assign({}, defaultOptions.oauth2_configuration, options?.oauth2_configuration);
    options = Object.assign({}, defaultOptions, options);
    options.oauth2_configuration = oauth22;
    const store = tokenStore(options.site);
    if (!options.tokens) {
      options.tokens = store.tokens;
    }
    if (!options.state) {
      options.state = store.state;
    }
    assert(options, {
      oauth2_configuration: {
        client_id: Required(/.+/),
        grant_type: "authorization_code",
        authorization_endpoint: Required(validURL),
        token_endpoint: Required(validURL),
        redirect_uri: Required(validURL)
      }
    });
    for (let option in oauth22) {
      switch (option) {
        case "access_token":
        case "authorization_code":
        case "refresh_token":
          options.tokens.set(option, oauth22[option]);
          break;
      }
    }
    return async function(req, next) {
      if (options.force_authorization) {
        return oauth2authorized(req, next);
      }
      let res;
      try {
        res = await next(req);
        if (res.ok) {
          return res;
        }
      } catch (err) {
        switch (res.status) {
          case 400:
          // Oauth2.1 RFC 3.2.4
          case 401:
            return oauth2authorized(req, next);
            break;
        }
        throw err;
      }
      if (!res.ok) {
        switch (res.status) {
          case 400:
          // Oauth2.1 RFC 3.2.4
          case 401:
            return oauth2authorized(req, next);
            break;
        }
      }
      return res;
    };
    async function oauth2authorized(req, next) {
      getTokensFromLocation();
      let accessToken = options.tokens.get("access_token");
      if (!accessToken) {
        try {
          let token = await fetchAccessToken();
          if (!token) {
            return response("false");
          }
        } catch (e) {
          throw e;
        }
        return oauth2authorized(req, next);
      } else if (isExpired(accessToken)) {
        try {
          let token = await fetchRefreshToken();
          if (!token) {
            return response("false");
          }
        } catch (e) {
          throw e;
        }
        return oauth2authorized(req, next);
      } else {
        req = request(req, {
          headers: {
            Authorization: accessToken.type + " " + accessToken.value
          }
        });
        return next(req);
      }
    }
    function getTokensFromLocation() {
      if (typeof window !== "undefined" && window?.location) {
        let url2 = url(window.location);
        let code, state, params2;
        if (url2.searchParams.has("code")) {
          params2 = url2.searchParams;
          url2 = url2.with({ search: "" });
          history.pushState({}, "", url2.href);
        } else if (url2.hash) {
          let query = url2.hash.substr(1);
          params2 = new URLSearchParams("?" + query);
          url2 = url2.with({ hash: "" });
          history.pushState({}, "", url2.href);
        }
        if (params2) {
          code = params2.get("code");
          state = params2.get("state");
          let storedState = options.state.get("metro/state");
          if (!state || state !== storedState) {
            return;
          }
          if (code) {
            options.tokens.set("authorization_code", code);
          }
        }
      }
    }
    async function fetchAccessToken() {
      if (oauth22.grant_type === "authorization_code" && !options.tokens.has("authorization_code")) {
        let authReqURL = await getAuthorizationCodeURL();
        if (!options.authorize_callback || typeof options.authorize_callback !== "function") {
          throw metroError("oauth2mw: oauth2 with grant_type:authorization_code requires a callback function in client options.authorize_callback");
        }
        let token = await options.authorize_callback(authReqURL);
        if (token) {
          options.tokens.set("authorization_code", token);
        } else {
          return false;
        }
      }
      let tokenReq = getAccessTokenRequest();
      let response2 = await options.client.post(tokenReq);
      if (!response2.ok) {
        let msg = await response2.text();
        throw metroError("OAuth2mw: fetch access_token: " + response2.status + ": " + response2.statusText, { cause: tokenReq });
      }
      let data = await response2.json();
      options.tokens.set("access_token", {
        value: data.access_token,
        expires: getExpires(data.expires_in),
        type: data.token_type,
        scope: data.scope
      });
      if (data.refresh_token) {
        let token = {
          value: data.refresh_token
        };
        options.tokens.set("refresh_token", token);
      }
      return data;
    }
    async function fetchRefreshToken() {
      let refreshTokenReq = getAccessTokenRequest("refresh_token");
      let response2 = await options.client.post(refreshTokenReq);
      if (!response2.ok) {
        throw metroError("OAuth2mw: refresh access_token: " + response2.status + ": " + response2.statusText, { cause: refreshTokenReq });
      }
      let data = await response2.json();
      options.tokens.set("access_token", {
        value: data.access_token,
        expires: getExpires(data.expires_in),
        type: data.token_type,
        scope: data.scope
      });
      if (data.refresh_token) {
        let token = {
          value: data.refresh_token
        };
        options.tokens.set("refresh_token", token);
      } else {
        return false;
      }
      return data;
    }
    async function getAuthorizationCodeURL() {
      if (!oauth22.authorization_endpoint) {
        throw metroError("oauth2mw: Missing options.oauth2_configuration.authorization_endpoint");
      }
      let url2 = url(oauth22.authorization_endpoint, { hash: "" });
      assert(oauth22, {
        client_id: /.+/,
        redirect_uri: /.+/,
        scope: /.*/
      });
      let search = {
        response_type: "code",
        // implicit flow uses 'token' here, but is not considered safe, so not supported
        client_id: oauth22.client_id,
        redirect_uri: oauth22.redirect_uri,
        state: oauth22.state || createState(40)
        // OAuth2.1 RFC says optional, but its a good idea to always add/check it
      };
      if (oauth22.response_type) {
        search.response_type = oauth22.response_type;
      }
      if (oauth22.response_mode) {
        search.response_mode = oauth22.response_mode;
      }
      options.state.set(search.state);
      if (oauth22.client_secret) {
        search.client_secret = oauth22.client_secret;
      }
      if (oauth22.code_verifier) {
        search.code_challenge = await generateCodeChallenge(oauth22.code_verifier);
        search.code_challenge_method = "S256";
      }
      if (oauth22.scope) {
        search.scope = oauth22.scope;
      }
      if (oauth22.prompt) {
        search.prompt = oauth22.prompt;
      }
      return url(url2, { search });
    }
    function getAccessTokenRequest(grant_type = null) {
      assert(oauth22, {
        client_id: /.+/,
        redirect_uri: /.+/
      });
      if (!oauth22.token_endpoint) {
        throw metroError("oauth2mw: Missing options.endpoints.token url");
      }
      let url2 = url(oauth22.token_endpoint, { hash: "" });
      let params2 = {
        grant_type: grant_type || oauth22.grant_type,
        client_id: oauth22.client_id
      };
      if (oauth22.code_verifier) {
        params2.code_verifier = oauth22.code_verifier;
      }
      if (oauth22.client_secret) {
        params2.client_secret = oauth22.client_secret;
      }
      if (oauth22.scope) {
        params2.scope = oauth22.scope;
      }
      switch (oauth22.grant_type) {
        case "authorization_code":
          params2.redirect_uri = oauth22.redirect_uri;
          params2.code = options.tokens.get("authorization_code");
          break;
        case "client_credentials":
          break;
        case "refresh_token":
          params2.refresh_token = oauth22.refresh_token;
          break;
        default:
          throw new Error("Unknown grant_type: ".oauth2.grant_type);
          break;
      }
      return request(url2, { method: "POST", body: new URLSearchParams(params2) });
    }
  }
  function isExpired(token) {
    if (!token) {
      return true;
    }
    let expires = new Date(token.expires);
    let now = /* @__PURE__ */ new Date();
    return now.getTime() > expires.getTime();
  }
  function getExpires(duration) {
    if (duration instanceof Date) {
      return new Date(duration.getTime());
    }
    if (typeof duration === "number") {
      let date = /* @__PURE__ */ new Date();
      date.setSeconds(date.getSeconds() + duration);
      return date;
    }
    throw new TypeError("Unknown expires type " + duration);
  }
  function generateCodeVerifier(size = 64) {
    const code_verifier = new Uint8Array(size);
    globalThis.crypto.getRandomValues(code_verifier);
    return base64url_encode(code_verifier);
  }
  async function generateCodeChallenge(code_verifier) {
    const encoder2 = new TextEncoder();
    const data = encoder2.encode(code_verifier);
    const challenge = await globalThis.crypto.subtle.digest("SHA-256", data);
    return base64url_encode(challenge);
  }
  function base64url_encode(buffer) {
    const byteString = Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join("");
    return btoa(byteString).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function createState(length) {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomState = "";
    let counter = 0;
    while (counter < length) {
      randomState += validChars.charAt(Math.floor(Math.random() * validChars.length));
      counter++;
    }
    return randomState;
  }
  function isRedirected() {
    let url2 = new URL(document.location.href);
    if (!url2.searchParams.has("code")) {
      if (url2.hash) {
        let query = url2.hash.substr(1);
        params = new URLSearchParams("?" + query);
        if (params.has("code")) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  function isAuthorized(tokens) {
    if (typeof tokens == "string") {
      tokens = tokenStore(tokens).tokens;
    }
    let accessToken = tokens.get("access_token");
    if (accessToken && !isExpired(accessToken)) {
      return true;
    }
    let refreshToken = tokens.get("refresh_token");
    if (refreshToken) {
      return true;
    }
    return false;
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mockserver.mjs
  var oauth2_mockserver_exports = {};
  __export(oauth2_mockserver_exports, {
    default: () => oauth2mockserver
  });
  var baseResponse = {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json"
    }
  };
  var badRequest = (error4) => {
    return {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "invalid_request",
        error_description: error4
      })
    };
  };
  var error3;
  var pkce = {};
  function oauth2mockserver(options = {}) {
    const defaultOptions = {
      "PKCE": false,
      "DPoP": false
    };
    options = Object.assign({}, defaultOptions, options);
    return async (req, next) => {
      let url2 = everything_default.url(req.url);
      switch (url2.pathname) {
        case "/authorize/":
          if (error3 = fails(url2.searchParams, {
            response_type: "code",
            client_id: "mockClientId",
            state: Optional(/.*/)
          })) {
            return everything_default.response(badRequest(error3));
          }
          if (url2.searchParams.has("code_challenge")) {
            if (!url2.searchParams.has("code_challenge_method")) {
              return everything_default.response(badRequest("missing code_challenge_method"));
            }
            pkce.code_challenge = url2.searchParams.get("code_challenge");
            pkce.code_challenge_method = url2.searchParams.get("code_challenge_method");
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              code: "mockAuthorizeToken",
              state: url2.searchParams.get("state")
            })
          });
          break;
        case "/token/":
          if (req.data instanceof URLSearchParams) {
            let body = {};
            req.data.forEach((value, key) => body[key] = value);
            req = req.with({ body });
          }
          if (error3 = fails(req, {
            method: "POST",
            data: {
              grant_type: oneOf("refresh_token", "authorization_code")
            }
          })) {
            return everything_default.response(badRequest(error3));
          }
          switch (req.data.grant_type) {
            case "refresh_token":
              if (error3 = fails(req.data, oneOf({
                refresh_token: "mockRefreshToken",
                client_id: "mockClientId",
                client_secret: "mockClientSecret"
              }, {
                refresh_token: "mockRefreshToken",
                client_id: "mockClientId",
                code_verifier: /.+/
              }))) {
                return everything_default.response(badRequest(error3));
              }
              break;
            case "access_token":
              if (error3 = fails(req.data, oneOf({
                client_id: "mockClientId",
                client_secret: "mockClientSecret"
              }, {
                client_id: "mockClientId",
                code_challenge: /.*/,
                //FIXME: check that this matches code_verifier
                code_challenge_method: "S256"
              }))) {
                return everything_default.response(badRequest(error3));
              }
              break;
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              access_token: "mockAccessToken",
              token_type: "mockExample",
              expires_in: 3600,
              refresh_token: "mockRefreshToken",
              example_parameter: "mockExampleValue"
            })
          });
          break;
        case "/protected/":
          let auth = req.headers.get("Authorization");
          let [type, token] = auth ? auth.split(" ") : [];
          if (!token || token !== "mockAccessToken") {
            return everything_default.response({
              status: 401,
              statusText: "Forbidden",
              body: "401 Forbidden"
            });
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              result: "Success"
            })
          });
          break;
        case "/public/":
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              result: "Success"
            })
          });
          break;
        default:
          return everything_default.response({
            status: 404,
            statusText: "not found",
            body: "404 Not Found " + url2
          });
          break;
      }
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.discovery.mjs
  var oauth2_discovery_exports = {};
  __export(oauth2_discovery_exports, {
    default: () => makeClient
  });
  var validAlgorithms = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  var validAuthMethods = [
    "client_secret_post",
    "client_secret_base",
    "client_secret_jwt",
    "private_key_jwt"
  ];
  var oauth_authorization_server_metadata = {
    issuer: Required(validURL),
    authorization_endpoint: Required(validURL),
    token_endpoint: Required(validURL),
    jwks_uri: Optional(validURL),
    registration_endpoint: Optional(validURL),
    scopes_supported: Recommended([]),
    response_types_supported: Required(anyOf("code", "token")),
    response_modes_supported: Optional([]),
    grant_types_supported: Optional([]),
    token_endpoint_auth_methods_supported: Optional([]),
    token_endpoint_auth_signing_alg_values_supported: Optional([]),
    service_documentation: Optional(validURL),
    ui_locales_supported: Optional([]),
    op_policy_uri: Optional(validURL),
    op_tos_uri: Optional(validURL),
    revocation_endpoint: Optional(validURL),
    revocation_endpoint_auth_methods_supported: Optional(validAuthMethods),
    revocation_endpoint_auth_signing_alg_values_supported: Optional(validAlgorithms),
    introspection_endpoint: Optional(validURL),
    introspection_endpoint_auth_methods_supported: Optional(validAuthMethods),
    introspection_endpoint_auth_signing_alg_values_supported: Optional(validAlgorithms),
    code_challendge_methods_supported: Optional([])
  };
  function makeClient(options = {}) {
    const defaultOptions = {
      client: everything_default.client()
    };
    options = Object.assign({}, defaultOptions, options);
    assert(options, {
      issuer: Required(validURL)
    });
    const oauth_authorization_server_configuration = fetchWellknownOauthAuthorizationServer(options.issuer);
    let client2 = options.client.with(options.issuer);
  }
  async function fetchWellknownOauthAuthorizationServer(issuer, client2) {
    let res = client2.get(everything_default.url(issuer, ".wellknown/oauth_authorization_server"));
    if (res.ok) {
      assert(res.headers.get("Content-Type"), /application\/json.*/);
      let configuration = await res.json();
      assert(configuration, oauth_authorization_server_metadata);
      return configuration;
    }
    throw everything_default.metroError("metro.oidcmw: Error while fetching " + issuer + ".wellknown/oauth_authorization_server", res);
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.popup.mjs
  function handleRedirect() {
    let params2 = new URLSearchParams(window.location.search);
    if (!params2.has("code") && window.location.hash) {
      let query = window.location.hash.substr(1);
      params2 = new URLSearchParams("?" + query);
    }
    let parent = window.parent ? window.parent : window.opener;
    if (params2.has("code")) {
      parent.postMessage({
        authorization_code: params2.get("code")
      }, window.location.origin);
    } else if (params2.has("error")) {
      parent.postMessage({
        error
      }, window.location.origin);
    } else {
      parent.postMessage({
        error: "Could not find an authorization_code"
      }, window.location.origin);
    }
  }
  function authorizePopup(authorizationCodeURL) {
    return new Promise((resolve, reject) => {
      addEventListener("message", (evt) => {
        if (event.data.authorization_code) {
          resolve(event.data.authorization_code);
        } else if (event.data.error) {
          reject(event.data.error);
        } else {
          reject("Unknown authorization error");
        }
      }, { once: true });
      window.open(authorizationCodeURL);
    });
  }

  // node_modules/@muze-nl/metro-oauth2/src/keysstore.mjs
  function keysStore() {
    return new Promise((resolve, reject) => {
      const request2 = globalThis.indexedDB.open("metro", 1);
      request2.onupgradeneeded = () => request2.result.createObjectStore("keyPairs", { keyPath: "domain" });
      request2.onerror = (event2) => {
        reject(event2);
      };
      request2.onsuccess = (event2) => {
        const db = event2.target.result;
        resolve({
          set: function(value, key) {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readwrite", { durability: "strict" });
              const objectStore = tx.objectStore("keyPairs");
              tx.oncomplete = () => {
                resolve2();
              };
              tx.onerror = reject2;
              objectStore.put(value, key);
            });
          },
          get: function(key) {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readonly");
              const objectStore = tx.objectStore("keyPairs");
              const request3 = objectStore.get(key);
              request3.onsuccess = () => {
                resolve2(request3.result);
              };
              request3.onerror = reject2;
              tx.onerror = reject2;
            });
          },
          clear: function() {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readwrite");
              const objectStore = tx.objectStore("keyPairs");
              const request3 = objectStore.clear();
              request3.onsuccess = () => {
                resolve2();
              };
              request3.onerror = reject2;
              tx.onerror = reject2;
            });
          }
        });
      };
    });
  }

  // node_modules/dpop/build/index.js
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  function buf(input) {
    if (typeof input === "string") {
      return encoder.encode(input);
    }
    return decoder.decode(input);
  }
  function checkRsaKeyAlgorithm(algorithm) {
    if (typeof algorithm.modulusLength !== "number" || algorithm.modulusLength < 2048) {
      throw new OperationProcessingError(`${algorithm.name} modulusLength must be at least 2048 bits`);
    }
  }
  function subtleAlgorithm(key) {
    switch (key.algorithm.name) {
      case "ECDSA":
        return { name: key.algorithm.name, hash: "SHA-256" };
      case "RSA-PSS":
        checkRsaKeyAlgorithm(key.algorithm);
        return {
          name: key.algorithm.name,
          saltLength: 256 >> 3
        };
      case "RSASSA-PKCS1-v1_5":
        checkRsaKeyAlgorithm(key.algorithm);
        return { name: key.algorithm.name };
      case "Ed25519":
        return { name: key.algorithm.name };
    }
    throw new UnsupportedOperationError();
  }
  async function jwt(header, claimsSet, key) {
    if (key.usages.includes("sign") === false) {
      throw new TypeError('private CryptoKey instances used for signing assertions must include "sign" in their "usages"');
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(claimsSet)))}`;
    const signature = b64u(await crypto.subtle.sign(subtleAlgorithm(key), key, buf(input)));
    return `${input}.${signature}`;
  }
  var CHUNK_SIZE = 32768;
  function encodeBase64Url(input) {
    if (input instanceof ArrayBuffer) {
      input = new Uint8Array(input);
    }
    const arr = [];
    for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
      arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function b64u(input) {
    return encodeBase64Url(input);
  }
  function randomBytes() {
    return b64u(crypto.getRandomValues(new Uint8Array(32)));
  }
  var UnsupportedOperationError = class extends Error {
    constructor(message) {
      super(message ?? "operation not supported");
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  var OperationProcessingError = class extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  function psAlg(key) {
    switch (key.algorithm.hash.name) {
      case "SHA-256":
        return "PS256";
      default:
        throw new UnsupportedOperationError("unsupported RsaHashedKeyAlgorithm hash name");
    }
  }
  function rsAlg(key) {
    switch (key.algorithm.hash.name) {
      case "SHA-256":
        return "RS256";
      default:
        throw new UnsupportedOperationError("unsupported RsaHashedKeyAlgorithm hash name");
    }
  }
  function esAlg(key) {
    switch (key.algorithm.namedCurve) {
      case "P-256":
        return "ES256";
      default:
        throw new UnsupportedOperationError("unsupported EcKeyAlgorithm namedCurve");
    }
  }
  function determineJWSAlgorithm(key) {
    switch (key.algorithm.name) {
      case "RSA-PSS":
        return psAlg(key);
      case "RSASSA-PKCS1-v1_5":
        return rsAlg(key);
      case "ECDSA":
        return esAlg(key);
      case "Ed25519":
        return "EdDSA";
      default:
        throw new UnsupportedOperationError("unsupported CryptoKey algorithm name");
    }
  }
  function isCryptoKey(key) {
    return key instanceof CryptoKey;
  }
  function isPrivateKey(key) {
    return isCryptoKey(key) && key.type === "private";
  }
  function isPublicKey(key) {
    return isCryptoKey(key) && key.type === "public";
  }
  function epochTime() {
    return Math.floor(Date.now() / 1e3);
  }
  async function DPoP(keypair, htu, htm, nonce, accessToken, additional) {
    const privateKey = keypair?.privateKey;
    const publicKey = keypair?.publicKey;
    if (!isPrivateKey(privateKey)) {
      throw new TypeError('"keypair.privateKey" must be a private CryptoKey');
    }
    if (!isPublicKey(publicKey)) {
      throw new TypeError('"keypair.publicKey" must be a public CryptoKey');
    }
    if (publicKey.extractable !== true) {
      throw new TypeError('"keypair.publicKey.extractable" must be true');
    }
    if (typeof htu !== "string") {
      throw new TypeError('"htu" must be a string');
    }
    if (typeof htm !== "string") {
      throw new TypeError('"htm" must be a string');
    }
    if (nonce !== void 0 && typeof nonce !== "string") {
      throw new TypeError('"nonce" must be a string or undefined');
    }
    if (accessToken !== void 0 && typeof accessToken !== "string") {
      throw new TypeError('"accessToken" must be a string or undefined');
    }
    if (additional !== void 0 && (typeof additional !== "object" || additional === null || Array.isArray(additional))) {
      throw new TypeError('"additional" must be an object');
    }
    return jwt({
      alg: determineJWSAlgorithm(privateKey),
      typ: "dpop+jwt",
      jwk: await publicJwk(publicKey)
    }, {
      ...additional,
      iat: epochTime(),
      jti: randomBytes(),
      htm,
      nonce,
      htu,
      ath: accessToken ? b64u(await crypto.subtle.digest("SHA-256", buf(accessToken))) : void 0
    }, privateKey);
  }
  async function publicJwk(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey("jwk", key);
    return { kty, crv, e, n, x, y };
  }
  async function generateKeyPair(alg, options) {
    let algorithm;
    if (typeof alg !== "string" || alg.length === 0) {
      throw new TypeError('"alg" must be a non-empty string');
    }
    switch (alg) {
      case "PS256":
        algorithm = {
          name: "RSA-PSS",
          hash: "SHA-256",
          modulusLength: options?.modulusLength ?? 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "RS256":
        algorithm = {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
          modulusLength: options?.modulusLength ?? 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "ES256":
        algorithm = { name: "ECDSA", namedCurve: "P-256" };
        break;
      case "EdDSA":
        algorithm = { name: "Ed25519" };
        break;
      default:
        throw new UnsupportedOperationError();
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, ["sign", "verify"]);
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.dpop.mjs
  function dpopmw(options) {
    assert(options, {
      site: Required(validURL),
      authorization_endpoint: Required(validURL),
      token_endpoint: Required(validURL),
      dpop_signing_alg_values_supported: Optional([])
      // this property is unfortunately rarely supported
    });
    return async (req, next) => {
      const keys = await keysStore();
      let keyInfo = await keys.get(options.site);
      if (!keyInfo) {
        let keyPair = await generateKeyPair("ES256");
        keyInfo = { domain: options.site, keyPair };
        await keys.set(keyInfo);
      }
      const url2 = everything_default.url(req.url);
      if (req.url.startsWith(options.authorization_endpoint)) {
        let params2 = req.body;
        if (params2 instanceof URLSearchParams || params2 instanceof FormData) {
          params2.set("dpop_jkt", keyInfo.keyPair.publicKey);
        } else {
          params2.dpop_jkt = keyInfo.keyPair.publicKey;
        }
      } else if (req.url.startsWith(options.token_endpoint)) {
        const dpopHeader = await DPoP(keyInfo.keyPair, req.url, req.method);
        req = req.with({
          headers: {
            "DPoP": dpopHeader
          }
        });
      } else if (req.headers.has("Authorization")) {
        const nonce = localStorage.getItem(url2.host + ":nonce") || void 0;
        const accessToken = req.headers.get("Authorization").split(" ")[1];
        const dpopHeader = await DPoP(keyInfo.keyPair, req.url, req.method, nonce, accessToken);
        req = req.with({
          headers: {
            "Authorization": "DPoP " + accessToken,
            "DPoP": dpopHeader
          }
        });
      }
      let response2 = await next(req);
      if (response2.headers.get("DPoP-Nonce")) {
        localStorage.setItem(url2.host + ":nonce", response2.headers.get("DPoP-Nonce"));
      }
      return response2;
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/browser.mjs
  var oauth2 = Object.assign(oauth2_exports, {
    oauth2mw,
    mockserver: oauth2_mockserver_exports,
    discover: oauth2_discovery_exports,
    tokenstore: tokenStore,
    dpopmw,
    keysstore: keysStore,
    authorizePopup,
    popupHandleRedirect: handleRedirect
  });
  if (!globalThis.metro.oauth2) {
    globalThis.metro.oauth2 = oauth2;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.util.mjs
  var MustHave = (...options) => (value, root) => {
    if (options.filter((o) => root.hasOwnKey(o)).length > 0) {
      return false;
    }
    return error2("root data must have all of", root, options);
  };
  var MustInclude = (...options) => (value) => {
    if (Array.isArray(value) && options.filter((o) => !value.includes(o)).length == 0) {
      return false;
    } else {
      return error2("data must be an array which includes", value, options);
    }
  };
  var validJWA = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  var validAuthMethods2 = [
    "client_secret_post",
    "client_secret_basic",
    "client_secret_jwt",
    "private_key_jwt"
  ];

  // node_modules/@muze-nl/metro-oidc/src/oidc.discovery.mjs
  async function oidcDiscovery(options = {}) {
    assert(options, {
      client: Optional(instanceOf(everything_default.client().constructor)),
      issuer: Required(validURL)
    });
    const defaultOptions = {
      client: everything_default.client().with(thrower()).with(jsonmw()),
      requireDynamicRegistration: false
    };
    options = Object.assign({}, defaultOptions, options);
    const TestSucceeded = false;
    function MustUseHTTPS(url2) {
      return TestSucceeded;
    }
    const openid_provider_metadata = {
      issuer: Required(allOf(options.issuer, MustUseHTTPS)),
      authorization_endpoint: Required(validURL),
      token_endpoint: Required(validURL),
      userinfo_endpoint: Recommended(validURL),
      // todo: test for https protocol
      jwks_uri: Required(validURL),
      registration_endpoint: options.requireDynamicRegistration ? Required(validURL) : Recommended(validURL),
      scopes_supported: Recommended(MustInclude("openid")),
      response_types_supported: options.requireDynamicRegistration ? Required(MustInclude("code", "id_token", "id_token token")) : Required([]),
      response_modes_supported: Optional([]),
      grant_types_supported: options.requireDynamicRegistration ? Optional(MustInclude("authorization_code")) : Optional([]),
      acr_values_supported: Optional([]),
      subject_types_supported: Required([]),
      id_token_signing_alg_values_supported: Required(MustInclude("RS256")),
      id_token_encryption_alg_values_supported: Optional([]),
      id_token_encryption_enc_values_supported: Optional([]),
      userinfo_signing_alg_values_supported: Optional([]),
      userinfo_encryption_alg_values_supported: Optional([]),
      userinfo_encryption_enc_values_supported: Optional([]),
      request_object_signing_alg_values_supported: Optional(MustInclude("RS256")),
      // not testing for 'none'
      request_object_encryption_alg_values_supported: Optional([]),
      request_object_encryption_enc_values_supported: Optional([]),
      token_endpoint_auth_methods_supported: Optional(anyOf(...validAuthMethods2)),
      token_endpoint_auth_signing_alg_values_supported: Optional(MustInclude("RS256"), not(MustInclude("none"))),
      display_values_supported: Optional(anyOf("page", "popup", "touch", "wap")),
      claim_types_supported: Optional(anyOf("normal", "aggregated", "distributed")),
      claims_supported: Recommended([]),
      service_documentation: Optional(validURL),
      claims_locales_supported: Optional([]),
      ui_locales_supported: Optional([]),
      claims_parameter_supported: Optional(Boolean),
      request_parameter_supported: Optional(Boolean),
      request_uri_parameter_supported: Optional(Boolean),
      op_policy_uri: Optional(validURL),
      op_tos_uri: Optional(validURL)
    };
    const configURL = everything_default.url(options.issuer, ".well-known/openid-configuration");
    const response2 = await options.client.get(
      // https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfigurationRequest
      // note: this allows path components in the options.issuer url
      configURL
    );
    const openid_config = response2.data;
    assert(openid_config, openid_provider_metadata);
    assert(openid_config.issuer, options.issuer);
    return openid_config;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.register.mjs
  async function register(options) {
    const openid_client_metadata = {
      redirect_uris: Required([validURL]),
      response_types: Optional([]),
      grant_types: Optional(anyOf("authorization_code", "refresh_token")),
      //TODO: match response_types with grant_types
      application_type: Optional(oneOf("native", "web")),
      contacts: Optional([validEmail]),
      client_name: Optional(String),
      logo_uri: Optional(validURL),
      client_uri: Optional(validURL),
      policy_uri: Optional(validURL),
      tos_uri: Optional(validURL),
      jwks_uri: Optional(validURL, not(MustHave("jwks"))),
      jwks: Optional(validURL, not(MustHave("jwks_uri"))),
      sector_identifier_uri: Optional(validURL),
      subject_type: Optional(String),
      id_token_signed_response_alg: Optional(oneOf(...validJWA)),
      id_token_encrypted_response_alg: Optional(oneOf(...validJWA)),
      id_token_encrypted_response_enc: Optional(oneOf(...validJWA), MustHave("id_token_encrypted_response_alg")),
      userinfo_signed_response_alg: Optional(oneOf(...validJWA)),
      userinfo_encrypted_response_alg: Optional(oneOf(...validJWA)),
      userinfo_encrypted_response_enc: Optional(oneOf(...validJWA), MustHave("userinfo_encrypted_response_alg")),
      request_object_signing_alg: Optional(oneOf(...validJWA)),
      request_object_encryption_alg: Optional(oneOf(...validJWA)),
      request_object_encryption_enc: Optional(oneOf(...validJWA)),
      token_endpoint_auth_method: Optional(oneOf(...validAuthMethods2)),
      token_endpoint_auth_signing_alg: Optional(oneOf(...validJWA)),
      default_max_age: Optional(Number),
      require_auth_time: Optional(Boolean),
      default_acr_values: Optional([String]),
      initiate_login_uri: Optional([validURL]),
      request_uris: Optional([validURL])
    };
    assert(options, {
      client: Optional(instanceOf(everything_default.client().constructor)),
      registration_endpoint: validURL,
      client_info: openid_client_metadata
    });
    const defaultOptions = {
      client: everything_default.client().with(thrower()).with(jsonmw())
    };
    options = Object.assign({}, defaultOptions, options);
    let response2 = await options.client.post(options.registration_endpoint, {
      body: options.client_info
    });
    let info = response2.data;
    if (!info.client_id || !info.client_secret) {
      throw everything_default.metroError("metro.oidc: Error: dynamic registration of client failed, no client_id or client_secret returned", response2);
    }
    options.client_info = Object.assign(options.client_info, info);
    return options.client_info;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.store.mjs
  function oidcStore(site) {
    let store;
    if (typeof localStorage !== "undefined") {
      store = {
        get: (name) => JSON.parse(localStorage.getItem("metro/oidc:" + site + ":" + name)),
        set: (name, value) => localStorage.setItem("metro/oidc:" + site + ":" + name, JSON.stringify(value)),
        has: (name) => localStorage.getItem("metro/oidc:" + site + ":" + name) !== null
      };
    } else {
      let storeMap = /* @__PURE__ */ new Map();
      store = {
        get: (name) => JSON.parse(storeMap.get("metro/oidc:" + site + ":" + name) || null),
        set: (name, value) => storeMap.set("metro/oidc:" + site + ":" + name, JSON.stringify(value)),
        has: (name) => storeMap.has("metro/oidc:" + site + ":" + name)
      };
    }
    return store;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidcmw.mjs
  function oidcmw(options = {}) {
    const defaultOptions = {
      client: client(),
      force_authorization: false,
      use_dpop: true,
      authorize_callback: async (url2) => {
        if (window.location.href != url2.href) {
          window.location.replace(url2.href);
        }
        return false;
      }
    };
    options = Object.assign({}, defaultOptions, options);
    assert(options, {
      client: Required(instanceOf(client().constructor)),
      // required because it is set in defaultOptions
      client_info: Required(),
      issuer: Required(validURL),
      oauth2: Optional({}),
      openid_configuration: Optional()
    });
    if (!options.store) {
      options.store = oidcStore(options.issuer);
    }
    if (!options.openid_configuration && options.store.has("openid_configuration")) {
      options.openid_configuration = options.store.get("openid_configuration");
    }
    if (!options.client_info.client_id && options.store.has("client_info")) {
      options.client_info = options.store.get("client_info");
    }
    return async (req, next) => {
      let res;
      if (!options.force_authorization) {
        try {
          res = await next(req);
        } catch (err) {
          if (res.status != 401 && res.status != 403) {
            throw err;
          }
        }
        if (res.ok || res.status != 401 && res.status != 403) {
          return res;
        }
      }
      if (!options.openid_configuration) {
        options.openid_configuration = await oidcDiscovery({
          issuer: options.issuer
        });
        options.store.set("openid_configuration", options.openid_configuration);
      }
      if (!options.client_info?.client_id) {
        assert(options.client_info?.client_name, Required());
        if (!options.openid_configuration.registration_endpoint) {
          throw metroError("metro.oidcmw: Error: issuer " + options.issuer + " does not support dynamic client registration, but you haven't specified a client_id");
        }
        options.client_info = await register({
          registration_endpoint: options.openid_configuration.registration_endpoint,
          client_info: options.client_info
        });
        options.store.set("client_info", options.client_info);
      }
      const scope = options.scope || "openid";
      const oauth2Options = Object.assign(
        {
          site: options.issuer,
          client: options.client,
          force_authorization: true,
          authorize_callback: options.authorize_callback,
          oauth2_configuration: {
            client_id: options.client_info.client_id,
            client_secret: options.client_info.client_secret,
            grant_type: "authorization_code",
            response_type: "code",
            response_mode: "query",
            authorization_endpoint: options.openid_configuration.authorization_endpoint,
            token_endpoint: options.openid_configuration.token_endpoint,
            scope,
            //FIXME: should only use scopes supported by server
            redirect_uri: options.client_info.redirect_uris[0]
            //FIXME: find the best match?
          }
        }
        //...
      );
      const storeIdToken = async (req2, next2) => {
        const res2 = await next2(req2);
        const contentType = res2.headers.get("content-type");
        if (contentType?.startsWith("application/json")) {
          let id_token = res2.data?.id_token;
          if (!id_token) {
            const res22 = res2.clone();
            try {
              let data = await res22.json();
              if (data && data.id_token) {
                id_token = data.id_token;
              }
            } catch (e) {
            }
          }
          if (id_token) {
            options.store.set("id_token", id_token);
          }
        }
        return res2;
      };
      let oauth2client = options.client.with(options.issuer).with(storeIdToken);
      if (options.use_dpop) {
        const dpopOptions = {
          site: options.issuer,
          authorization_endpoint: options.openid_configuration.authorization_endpoint,
          token_endpoint: options.openid_configuration.token_endpoint,
          dpop_signing_alg_values_supported: options.openid_configuration.dpop_signing_alg_values_supported
        };
        oauth2client = oauth2client.with(dpopmw(dpopOptions));
        oauth2Options.client = oauth2client;
      }
      oauth2client = oauth2client.with(oauth2mw(oauth2Options));
      res = await oauth2client.fetch(req);
      return res;
    };
  }
  function isRedirected2() {
    return isRedirected();
  }
  function idToken(options) {
    if (!options.store) {
      if (!options.issuer) {
        throw metroError("Must supply options.issuer or options.store to get the id_token");
      }
      options.store = oidcStore(options.issuer);
    }
    return options.store.get("id_token");
  }

  // node_modules/@muze-nl/metro-oidc/src/browser.mjs
  var oidc = {
    oidcmw,
    discover: oidcDiscovery,
    register,
    isRedirected: isRedirected2,
    idToken
  };
  if (!globalThis.metro.oidc) {
    globalThis.metro.oidc = oidc;
  }
  var browser_default2 = oidc;

  // node_modules/@muze-nl/oldm/dist/oldm.mjs
  var __create = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1)
          validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this))
            return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this))
            return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf2 = new Uint8Array(length);
        Object.setPrototypeOf(buf2, Buffer3.prototype);
        return buf2;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b)
          return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf2 = createBuffer(length);
        const actual = buf2.write(string, encoding);
        if (actual !== length) {
          buf2 = buf2.slice(0, actual);
        }
        return buf2;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf2 = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf2[i] = array[i] & 255;
        }
        return buf2;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf2;
        if (byteOffset === void 0 && length === void 0) {
          buf2 = new Uint8Array(array);
        } else if (length === void 0) {
          buf2 = new Uint8Array(array, byteOffset);
        } else {
          buf2 = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf2, Buffer3.prototype);
        return buf2;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf2 = createBuffer(len);
          if (buf2.length === 0) {
            return buf2;
          }
          obj.copy(buf2, 0, 0, len);
          return buf2;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array))
          a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array))
          b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b)
          return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
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
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf2 = list[i];
          if (isInstance(buf2, Uint8Array)) {
            if (pos + buf2.length > buffer.length) {
              if (!Buffer3.isBuffer(buf2))
                buf2 = Buffer3.from(buf2);
              buf2.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf2,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf2)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf2.copy(buffer, pos);
          }
          pos += buf2.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0)
          return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding)
          encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0)
          return "";
        if (arguments.length === 0)
          return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b))
          throw new TypeError("Argument must be a Buffer");
        if (this === b)
          return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max)
          str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target)
          return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0)
          return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0)
          byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir)
            return -1;
          else
            byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir)
            byteOffset = 0;
          else
            return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf2, i2) {
          if (indexSize === 1) {
            return buf2[i2];
          } else {
            return buf2.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1)
                foundIndex = i;
              if (i - foundIndex + 1 === valLength)
                return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1)
                i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength)
            byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found)
              return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf2, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf2.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed))
            return i;
          buf2[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf2, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf2.length - offset), buf2, offset, length);
      }
      function asciiWrite(buf2, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf2, offset, length);
      }
      function base64Write(buf2, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf2, offset, length);
      }
      function ucs2Write(buf2, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf2.length - offset), buf2, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0)
              encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining)
          length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding)
          encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf2, start, end) {
        if (start === 0 && end === buf2.length) {
          return base64.fromByteArray(buf2);
        } else {
          return base64.fromByteArray(buf2.slice(start, end));
        }
      }
      function utf8Slice(buf2, start, end) {
        end = Math.min(buf2.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf2[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf2[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf2[i + 1];
                thirdByte = buf2[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf2[i + 1];
                thirdByte = buf2[i + 2];
                fourthByte = buf2[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf2, start, end) {
        let ret = "";
        end = Math.min(buf2.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf2[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf2, start, end) {
        let ret = "";
        end = Math.min(buf2.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf2[i]);
        }
        return ret;
      }
      function hexSlice(buf2, start, end) {
        const len = buf2.length;
        if (!start || start < 0)
          start = 0;
        if (!end || end < 0 || end > len)
          end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf2[i]];
        }
        return out;
      }
      function utf16leSlice(buf2, start, end) {
        const bytes = buf2.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0)
            start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0)
            end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start)
          end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0)
          throw new RangeError("offset is not uint");
        if (offset + ext > length)
          throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128))
          return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf2, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf2))
          throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min)
          throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf2.length)
          throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf2, value, offset, min, max) {
        checkIntBI(value, min, max, buf2, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf2, value, offset, min, max) {
        checkIntBI(value, min, max, buf2, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf2[offset + 7] = lo;
        lo = lo >> 8;
        buf2[offset + 6] = lo;
        lo = lo >> 8;
        buf2[offset + 5] = lo;
        lo = lo >> 8;
        buf2[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf2[offset + 3] = hi;
        hi = hi >> 8;
        buf2[offset + 2] = hi;
        hi = hi >> 8;
        buf2[offset + 1] = hi;
        hi = hi >> 8;
        buf2[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 127, -128);
        if (value < 0)
          value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0)
          value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf2, value, offset, ext, max, min) {
        if (offset + ext > buf2.length)
          throw new RangeError("Index out of range");
        if (offset < 0)
          throw new RangeError("Index out of range");
      }
      function writeFloat(buf2, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf2, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf2, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf2, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf2, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf2, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target))
          throw new TypeError("argument should be a Buffer");
        if (!start)
          start = 0;
        if (!end && end !== 0)
          end = this.length;
        if (targetStart >= target.length)
          targetStart = target.length;
        if (!targetStart)
          targetStart = 0;
        if (end > 0 && end < start)
          end = start;
        if (end === start)
          return 0;
        if (target.length === 0 || this.length === 0)
          return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length)
          throw new RangeError("Index out of range");
        if (end < 0)
          throw new RangeError("sourceEnd out of bounds");
        if (end > this.length)
          end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val)
          val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf2, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf2[offset] === void 0 || buf2[offset + byteLength2] === void 0) {
          boundsError(offset, buf2.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf2, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf2, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2)
          return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0)
              break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0)
              break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0)
              break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0)
              break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0)
            break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length)
            break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });
  var require_queue_microtask = __commonJS({
    "node_modules/queue-microtask/index.js"(exports, module) {
      var promise;
      module.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
        throw err;
      }, 0));
    }
  });
  var require_primordials = __commonJS({
    "node_modules/readable-stream/lib/ours/primordials.js"(exports, module) {
      "use strict";
      var AggregateError = class extends Error {
        constructor(errors) {
          if (!Array.isArray(errors)) {
            throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
          }
          let message = "";
          for (let i = 0; i < errors.length; i++) {
            message += `    ${errors[i].stack}
`;
          }
          super(message);
          this.name = "AggregateError";
          this.errors = errors;
        }
      };
      module.exports = {
        AggregateError,
        ArrayIsArray(self2) {
          return Array.isArray(self2);
        },
        ArrayPrototypeIncludes(self2, el) {
          return self2.includes(el);
        },
        ArrayPrototypeIndexOf(self2, el) {
          return self2.indexOf(el);
        },
        ArrayPrototypeJoin(self2, sep) {
          return self2.join(sep);
        },
        ArrayPrototypeMap(self2, fn) {
          return self2.map(fn);
        },
        ArrayPrototypePop(self2, el) {
          return self2.pop(el);
        },
        ArrayPrototypePush(self2, el) {
          return self2.push(el);
        },
        ArrayPrototypeSlice(self2, start, end) {
          return self2.slice(start, end);
        },
        Error,
        FunctionPrototypeCall(fn, thisArgs, ...args) {
          return fn.call(thisArgs, ...args);
        },
        FunctionPrototypeSymbolHasInstance(self2, instance) {
          return Function.prototype[Symbol.hasInstance].call(self2, instance);
        },
        MathFloor: Math.floor,
        Number,
        NumberIsInteger: Number.isInteger,
        NumberIsNaN: Number.isNaN,
        NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
        NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
        NumberParseInt: Number.parseInt,
        ObjectDefineProperties(self2, props) {
          return Object.defineProperties(self2, props);
        },
        ObjectDefineProperty(self2, name, prop) {
          return Object.defineProperty(self2, name, prop);
        },
        ObjectGetOwnPropertyDescriptor(self2, name) {
          return Object.getOwnPropertyDescriptor(self2, name);
        },
        ObjectKeys(obj) {
          return Object.keys(obj);
        },
        ObjectSetPrototypeOf(target, proto) {
          return Object.setPrototypeOf(target, proto);
        },
        Promise,
        PromisePrototypeCatch(self2, fn) {
          return self2.catch(fn);
        },
        PromisePrototypeThen(self2, thenFn, catchFn) {
          return self2.then(thenFn, catchFn);
        },
        PromiseReject(err) {
          return Promise.reject(err);
        },
        PromiseResolve(val) {
          return Promise.resolve(val);
        },
        ReflectApply: Reflect.apply,
        RegExpPrototypeTest(self2, value) {
          return self2.test(value);
        },
        SafeSet: Set,
        String,
        StringPrototypeSlice(self2, start, end) {
          return self2.slice(start, end);
        },
        StringPrototypeToLowerCase(self2) {
          return self2.toLowerCase();
        },
        StringPrototypeToUpperCase(self2) {
          return self2.toUpperCase();
        },
        StringPrototypeTrim(self2) {
          return self2.trim();
        },
        Symbol,
        SymbolFor: Symbol.for,
        SymbolAsyncIterator: Symbol.asyncIterator,
        SymbolHasInstance: Symbol.hasInstance,
        SymbolIterator: Symbol.iterator,
        SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
        SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
        TypedArrayPrototypeSet(self2, buf2, len) {
          return self2.set(buf2, len);
        },
        Boolean,
        Uint8Array
      };
    }
  });
  var require_inspect = __commonJS({
    "node_modules/readable-stream/lib/ours/util/inspect.js"(exports, module) {
      "use strict";
      module.exports = {
        format(format, ...args) {
          return format.replace(/%([sdifj])/g, function(...[_unused, type]) {
            const replacement = args.shift();
            if (type === "f") {
              return replacement.toFixed(6);
            } else if (type === "j") {
              return JSON.stringify(replacement);
            } else if (type === "s" && typeof replacement === "object") {
              const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
              return `${ctor} {}`.trim();
            } else {
              return replacement.toString();
            }
          });
        },
        inspect(value) {
          switch (typeof value) {
            case "string":
              if (value.includes("'")) {
                if (!value.includes('"')) {
                  return `"${value}"`;
                } else if (!value.includes("`") && !value.includes("${")) {
                  return `\`${value}\``;
                }
              }
              return `'${value}'`;
            case "number":
              if (isNaN(value)) {
                return "NaN";
              } else if (Object.is(value, -0)) {
                return String(value);
              }
              return value;
            case "bigint":
              return `${String(value)}n`;
            case "boolean":
            case "undefined":
              return String(value);
            case "object":
              return "{}";
          }
        }
      };
    }
  });
  var require_errors = __commonJS({
    "node_modules/readable-stream/lib/ours/errors.js"(exports, module) {
      "use strict";
      var { format, inspect } = require_inspect();
      var { AggregateError: CustomAggregateError } = require_primordials();
      var AggregateError = globalThis.AggregateError || CustomAggregateError;
      var kIsNodeError = Symbol("kIsNodeError");
      var kTypes = [
        "string",
        "function",
        "number",
        "object",
        // Accept 'Function' and 'Object' as alternative to the lower cased version.
        "Function",
        "Object",
        "boolean",
        "bigint",
        "symbol"
      ];
      var classRegExp = /^([A-Z][a-z0-9]*)+$/;
      var nodeInternalPrefix = "__node_internal_";
      var codes = {};
      function assert2(value, message) {
        if (!value) {
          throw new codes.ERR_INTERNAL_ASSERTION(message);
        }
      }
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function getMessage(key, msg, args) {
        if (typeof msg === "function") {
          assert2(
            msg.length <= args.length,
            // Default options do not count.
            `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
          );
          return msg(...args);
        }
        const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
        assert2(
          expectedLength === args.length,
          `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
        );
        if (args.length === 0) {
          return msg;
        }
        return format(msg, ...args);
      }
      function E(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        class NodeError extends Base {
          constructor(...args) {
            super(getMessage(code, message, args));
          }
          toString() {
            return `${this.name} [${code}]: ${this.message}`;
          }
        }
        Object.defineProperties(NodeError.prototype, {
          name: {
            value: Base.name,
            writable: true,
            enumerable: false,
            configurable: true
          },
          toString: {
            value() {
              return `${this.name} [${code}]: ${this.message}`;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        NodeError.prototype.code = code;
        NodeError.prototype[kIsNodeError] = true;
        codes[code] = NodeError;
      }
      function hideStackFrames(fn) {
        const hidden = nodeInternalPrefix + fn.name;
        Object.defineProperty(fn, "name", {
          value: hidden
        });
        return fn;
      }
      function aggregateTwoErrors(innerError, outerError) {
        if (innerError && outerError && innerError !== outerError) {
          if (Array.isArray(outerError.errors)) {
            outerError.errors.push(innerError);
            return outerError;
          }
          const err = new AggregateError([outerError, innerError], outerError.message);
          err.code = outerError.code;
          return err;
        }
        return innerError || outerError;
      }
      var AbortError = class extends Error {
        constructor(message = "The operation was aborted", options = void 0) {
          if (options !== void 0 && typeof options !== "object") {
            throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
          }
          super(message, options);
          this.code = "ABORT_ERR";
          this.name = "AbortError";
        }
      };
      E("ERR_ASSERTION", "%s", Error);
      E(
        "ERR_INVALID_ARG_TYPE",
        (name, expected, actual) => {
          assert2(typeof name === "string", "'name' must be a string");
          if (!Array.isArray(expected)) {
            expected = [expected];
          }
          let msg = "The ";
          if (name.endsWith(" argument")) {
            msg += `${name} `;
          } else {
            msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
          }
          msg += "must be ";
          const types = [];
          const instances = [];
          const other = [];
          for (const value of expected) {
            assert2(typeof value === "string", "All expected entries have to be of type string");
            if (kTypes.includes(value)) {
              types.push(value.toLowerCase());
            } else if (classRegExp.test(value)) {
              instances.push(value);
            } else {
              assert2(value !== "object", 'The value "object" should be written as "Object"');
              other.push(value);
            }
          }
          if (instances.length > 0) {
            const pos = types.indexOf("object");
            if (pos !== -1) {
              types.splice(types, pos, 1);
              instances.push("Object");
            }
          }
          if (types.length > 0) {
            switch (types.length) {
              case 1:
                msg += `of type ${types[0]}`;
                break;
              case 2:
                msg += `one of type ${types[0]} or ${types[1]}`;
                break;
              default: {
                const last = types.pop();
                msg += `one of type ${types.join(", ")}, or ${last}`;
              }
            }
            if (instances.length > 0 || other.length > 0) {
              msg += " or ";
            }
          }
          if (instances.length > 0) {
            switch (instances.length) {
              case 1:
                msg += `an instance of ${instances[0]}`;
                break;
              case 2:
                msg += `an instance of ${instances[0]} or ${instances[1]}`;
                break;
              default: {
                const last = instances.pop();
                msg += `an instance of ${instances.join(", ")}, or ${last}`;
              }
            }
            if (other.length > 0) {
              msg += " or ";
            }
          }
          switch (other.length) {
            case 0:
              break;
            case 1:
              if (other[0].toLowerCase() !== other[0]) {
                msg += "an ";
              }
              msg += `${other[0]}`;
              break;
            case 2:
              msg += `one of ${other[0]} or ${other[1]}`;
              break;
            default: {
              const last = other.pop();
              msg += `one of ${other.join(", ")}, or ${last}`;
            }
          }
          if (actual == null) {
            msg += `. Received ${actual}`;
          } else if (typeof actual === "function" && actual.name) {
            msg += `. Received function ${actual.name}`;
          } else if (typeof actual === "object") {
            var _actual$constructor;
            if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== void 0 && _actual$constructor.name) {
              msg += `. Received an instance of ${actual.constructor.name}`;
            } else {
              const inspected = inspect(actual, {
                depth: -1
              });
              msg += `. Received ${inspected}`;
            }
          } else {
            let inspected = inspect(actual, {
              colors: false
            });
            if (inspected.length > 25) {
              inspected = `${inspected.slice(0, 25)}...`;
            }
            msg += `. Received type ${typeof actual} (${inspected})`;
          }
          return msg;
        },
        TypeError
      );
      E(
        "ERR_INVALID_ARG_VALUE",
        (name, value, reason = "is invalid") => {
          let inspected = inspect(value);
          if (inspected.length > 128) {
            inspected = inspected.slice(0, 128) + "...";
          }
          const type = name.includes(".") ? "property" : "argument";
          return `The ${type} '${name}' ${reason}. Received ${inspected}`;
        },
        TypeError
      );
      E(
        "ERR_INVALID_RETURN_VALUE",
        (input, name, value) => {
          var _value$constructor;
          const type = value !== null && value !== void 0 && (_value$constructor = value.constructor) !== null && _value$constructor !== void 0 && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
          return `Expected ${input} to be returned from the "${name}" function but got ${type}.`;
        },
        TypeError
      );
      E(
        "ERR_MISSING_ARGS",
        (...args) => {
          assert2(args.length > 0, "At least one arg needs to be specified");
          let msg;
          const len = args.length;
          args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
          switch (len) {
            case 1:
              msg += `The ${args[0]} argument`;
              break;
            case 2:
              msg += `The ${args[0]} and ${args[1]} arguments`;
              break;
            default:
              {
                const last = args.pop();
                msg += `The ${args.join(", ")}, and ${last} arguments`;
              }
              break;
          }
          return `${msg} must be specified`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        (str, range, input) => {
          assert2(range, 'Missing "range" argument');
          let received;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            const limit = BigInt(2) ** BigInt(32);
            if (input > limit || input < -limit) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          } else {
            received = inspect(input);
          }
          return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
        },
        RangeError
      );
      E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
      E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
      E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
      E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
      E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
      E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
      E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
      E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
      E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
      E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
      E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
      module.exports = {
        AbortError,
        aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
        hideStackFrames,
        codes
      };
    }
  });
  var require_browser = __commonJS({
    "node_modules/abort-controller/browser.js"(exports, module) {
      "use strict";
      var { AbortController, AbortSignal } = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : (
        /* otherwise */
        void 0
      );
      module.exports = AbortController;
      module.exports.AbortSignal = AbortSignal;
      module.exports.default = AbortController;
    }
  });
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
      function EventEmitter() {
        EventEmitter.init.call(this);
      }
      module.exports = EventEmitter;
      module.exports.once = once;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = void 0;
      EventEmitter.prototype._eventsCount = 0;
      EventEmitter.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter, "defaultMaxListeners", {
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
      EventEmitter.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter.prototype.emit = function emit(type) {
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
      EventEmitter.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.prependListener = function prependListener(type, listener) {
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
      EventEmitter.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.removeListener = function removeListener(type, listener) {
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
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
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
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
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
      EventEmitter.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter.prototype.listenerCount = listenerCount;
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
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
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
  var require_util = __commonJS({
    "node_modules/readable-stream/lib/ours/util.js"(exports, module) {
      "use strict";
      var bufferModule = require_buffer();
      var { format, inspect } = require_inspect();
      var {
        codes: { ERR_INVALID_ARG_TYPE }
      } = require_errors();
      var { kResistStopPropagation, AggregateError, SymbolDispose } = require_primordials();
      var AbortSignal = globalThis.AbortSignal || require_browser().AbortSignal;
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var AsyncFunction = Object.getPrototypeOf(async function() {
      }).constructor;
      var Blob2 = globalThis.Blob || bufferModule.Blob;
      var isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
        return b instanceof Blob2;
      } : function isBlob2(b) {
        return false;
      };
      var validateAbortSignal = (signal, name) => {
        if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
          throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
        }
      };
      var validateFunction = (value, name) => {
        if (typeof value !== "function") {
          throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
        }
      };
      module.exports = {
        AggregateError,
        kEmptyObject: Object.freeze({}),
        once(callback) {
          let called = false;
          return function(...args) {
            if (called) {
              return;
            }
            called = true;
            callback.apply(this, args);
          };
        },
        createDeferredPromise: function() {
          let resolve;
          let reject;
          const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
          });
          return {
            promise,
            resolve,
            reject
          };
        },
        promisify(fn) {
          return new Promise((resolve, reject) => {
            fn((err, ...args) => {
              if (err) {
                return reject(err);
              }
              return resolve(...args);
            });
          });
        },
        debuglog() {
          return function() {
          };
        },
        format,
        inspect,
        types: {
          isAsyncFunction(fn) {
            return fn instanceof AsyncFunction;
          },
          isArrayBufferView(arr) {
            return ArrayBuffer.isView(arr);
          }
        },
        isBlob,
        deprecate(fn, message) {
          return fn;
        },
        addAbortListener: require_events().addAbortListener || function addAbortListener(signal, listener) {
          if (signal === void 0) {
            throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
          }
          validateAbortSignal(signal, "signal");
          validateFunction(listener, "listener");
          let removeEventListener;
          if (signal.aborted) {
            queueMicrotask(() => listener());
          } else {
            signal.addEventListener("abort", listener, {
              __proto__: null,
              once: true,
              [kResistStopPropagation]: true
            });
            removeEventListener = () => {
              signal.removeEventListener("abort", listener);
            };
          }
          return {
            __proto__: null,
            [SymbolDispose]() {
              var _removeEventListener;
              (_removeEventListener = removeEventListener) === null || _removeEventListener === void 0 ? void 0 : _removeEventListener();
            }
          };
        },
        AbortSignalAny: AbortSignal.any || function AbortSignalAny(signals) {
          if (signals.length === 1) {
            return signals[0];
          }
          const ac = new AbortController();
          const abort = () => ac.abort();
          signals.forEach((signal) => {
            validateAbortSignal(signal, "signals");
            signal.addEventListener("abort", abort, {
              once: true
            });
          });
          ac.signal.addEventListener(
            "abort",
            () => {
              signals.forEach((signal) => signal.removeEventListener("abort", abort));
            },
            {
              once: true
            }
          );
          return ac.signal;
        }
      };
      module.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
    }
  });
  var require_validators = __commonJS({
    "node_modules/readable-stream/lib/internal/validators.js"(exports, module) {
      "use strict";
      var {
        ArrayIsArray,
        ArrayPrototypeIncludes,
        ArrayPrototypeJoin,
        ArrayPrototypeMap,
        NumberIsInteger,
        NumberIsNaN,
        NumberMAX_SAFE_INTEGER,
        NumberMIN_SAFE_INTEGER,
        NumberParseInt,
        ObjectPrototypeHasOwnProperty,
        RegExpPrototypeExec,
        String: String2,
        StringPrototypeToUpperCase,
        StringPrototypeTrim
      } = require_primordials();
      var {
        hideStackFrames,
        codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
      } = require_errors();
      var { normalizeEncoding } = require_util();
      var { isAsyncFunction, isArrayBufferView } = require_util().types;
      var signals = {};
      function isInt32(value) {
        return value === (value | 0);
      }
      function isUint32(value) {
        return value === value >>> 0;
      }
      var octalReg = /^[0-7]+$/;
      var modeDesc = "must be a 32-bit unsigned integer or an octal string";
      function parseFileMode(value, name, def) {
        if (typeof value === "undefined") {
          value = def;
        }
        if (typeof value === "string") {
          if (RegExpPrototypeExec(octalReg, value) === null) {
            throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
          }
          value = NumberParseInt(value, 8);
        }
        validateUint32(value, name);
        return value;
      }
      var validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
        if (typeof value !== "number")
          throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        if (!NumberIsInteger(value))
          throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        if (value < min || value > max)
          throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      });
      var validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
        if (typeof value !== "number") {
          throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        }
        if (!NumberIsInteger(value)) {
          throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        if (value < min || value > max) {
          throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
        }
      });
      var validateUint32 = hideStackFrames((value, name, positive = false) => {
        if (typeof value !== "number") {
          throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        }
        if (!NumberIsInteger(value)) {
          throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        const min = positive ? 1 : 0;
        const max = 4294967295;
        if (value < min || value > max) {
          throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
        }
      });
      function validateString(value, name) {
        if (typeof value !== "string")
          throw new ERR_INVALID_ARG_TYPE(name, "string", value);
      }
      function validateNumber(value, name, min = void 0, max) {
        if (typeof value !== "number")
          throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
          throw new ERR_OUT_OF_RANGE(
            name,
            `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`,
            value
          );
        }
      }
      var validateOneOf = hideStackFrames((value, name, oneOf2) => {
        if (!ArrayPrototypeIncludes(oneOf2, value)) {
          const allowed = ArrayPrototypeJoin(
            ArrayPrototypeMap(oneOf2, (v) => typeof v === "string" ? `'${v}'` : String2(v)),
            ", "
          );
          const reason = "must be one of: " + allowed;
          throw new ERR_INVALID_ARG_VALUE(name, value, reason);
        }
      });
      function validateBoolean(value, name) {
        if (typeof value !== "boolean")
          throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
      }
      function getOwnPropertyValueOrDefault(options, key, defaultValue) {
        return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
      }
      var validateObject = hideStackFrames((value, name, options = null) => {
        const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
        const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
        const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
        if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
          throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
        }
      });
      var validateDictionary = hideStackFrames((value, name) => {
        if (value != null && typeof value !== "object" && typeof value !== "function") {
          throw new ERR_INVALID_ARG_TYPE(name, "a dictionary", value);
        }
      });
      var validateArray = hideStackFrames((value, name, minLength = 0) => {
        if (!ArrayIsArray(value)) {
          throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
        }
        if (value.length < minLength) {
          const reason = `must be longer than ${minLength}`;
          throw new ERR_INVALID_ARG_VALUE(name, value, reason);
        }
      });
      function validateStringArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          validateString(value[i], `${name}[${i}]`);
        }
      }
      function validateBooleanArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          validateBoolean(value[i], `${name}[${i}]`);
        }
      }
      function validateAbortSignalArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          const signal = value[i];
          const indexedName = `${name}[${i}]`;
          if (signal == null) {
            throw new ERR_INVALID_ARG_TYPE(indexedName, "AbortSignal", signal);
          }
          validateAbortSignal(signal, indexedName);
        }
      }
      function validateSignalName(signal, name = "signal") {
        validateString(signal, name);
        if (signals[signal] === void 0) {
          if (signals[StringPrototypeToUpperCase(signal)] !== void 0) {
            throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
          }
          throw new ERR_UNKNOWN_SIGNAL(signal);
        }
      }
      var validateBuffer = hideStackFrames((buffer, name = "buffer") => {
        if (!isArrayBufferView(buffer)) {
          throw new ERR_INVALID_ARG_TYPE(name, ["Buffer", "TypedArray", "DataView"], buffer);
        }
      });
      function validateEncoding(data, encoding) {
        const normalizedEncoding = normalizeEncoding(encoding);
        const length = data.length;
        if (normalizedEncoding === "hex" && length % 2 !== 0) {
          throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
        }
      }
      function validatePort(port, name = "Port", allowZero = true) {
        if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
          throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
        }
        return port | 0;
      }
      var validateAbortSignal = hideStackFrames((signal, name) => {
        if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
          throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
        }
      });
      var validateFunction = hideStackFrames((value, name) => {
        if (typeof value !== "function")
          throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
      });
      var validatePlainFunction = hideStackFrames((value, name) => {
        if (typeof value !== "function" || isAsyncFunction(value))
          throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
      });
      var validateUndefined = hideStackFrames((value, name) => {
        if (value !== void 0)
          throw new ERR_INVALID_ARG_TYPE(name, "undefined", value);
      });
      function validateUnion(value, name, union) {
        if (!ArrayPrototypeIncludes(union, value)) {
          throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
        }
      }
      var linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
      function validateLinkHeaderFormat(value, name) {
        if (typeof value === "undefined" || !RegExpPrototypeExec(linkValueRegExp, value)) {
          throw new ERR_INVALID_ARG_VALUE(
            name,
            value,
            'must be an array or string of format "</styles.css>; rel=preload; as=style"'
          );
        }
      }
      function validateLinkHeaderValue(hints) {
        if (typeof hints === "string") {
          validateLinkHeaderFormat(hints, "hints");
          return hints;
        } else if (ArrayIsArray(hints)) {
          const hintsLength = hints.length;
          let result2 = "";
          if (hintsLength === 0) {
            return result2;
          }
          for (let i = 0; i < hintsLength; i++) {
            const link = hints[i];
            validateLinkHeaderFormat(link, "hints");
            result2 += link;
            if (i !== hintsLength - 1) {
              result2 += ", ";
            }
          }
          return result2;
        }
        throw new ERR_INVALID_ARG_VALUE(
          "hints",
          hints,
          'must be an array or string of format "</styles.css>; rel=preload; as=style"'
        );
      }
      module.exports = {
        isInt32,
        isUint32,
        parseFileMode,
        validateArray,
        validateStringArray,
        validateBooleanArray,
        validateAbortSignalArray,
        validateBoolean,
        validateBuffer,
        validateDictionary,
        validateEncoding,
        validateFunction,
        validateInt32,
        validateInteger,
        validateNumber,
        validateObject,
        validateOneOf,
        validatePlainFunction,
        validatePort,
        validateSignalName,
        validateString,
        validateUint32,
        validateUndefined,
        validateUnion,
        validateAbortSignal,
        validateLinkHeaderValue
      };
    }
  });
  var require_browser2 = __commonJS({
    "node_modules/process/browser.js"(exports, module) {
      var process = module.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      (function() {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e2) {
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
        while (len) {
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
      process.nextTick = function(fun) {
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
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = "";
      process.versions = {};
      function noop2() {
      }
      process.on = noop2;
      process.addListener = noop2;
      process.once = noop2;
      process.off = noop2;
      process.removeListener = noop2;
      process.removeAllListeners = noop2;
      process.emit = noop2;
      process.prependListener = noop2;
      process.prependOnceListener = noop2;
      process.listeners = function(name) {
        return [];
      };
      process.binding = function(name) {
        throw new Error("process.binding is not supported");
      };
      process.cwd = function() {
        return "/";
      };
      process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
      };
      process.umask = function() {
        return 0;
      };
    }
  });
  var require_utils = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/utils.js"(exports, module) {
      "use strict";
      var { SymbolAsyncIterator, SymbolIterator, SymbolFor } = require_primordials();
      var kIsDestroyed = SymbolFor("nodejs.stream.destroyed");
      var kIsErrored = SymbolFor("nodejs.stream.errored");
      var kIsReadable = SymbolFor("nodejs.stream.readable");
      var kIsWritable = SymbolFor("nodejs.stream.writable");
      var kIsDisturbed = SymbolFor("nodejs.stream.disturbed");
      var kIsClosedPromise = SymbolFor("nodejs.webstream.isClosedPromise");
      var kControllerErrorFunction = SymbolFor("nodejs.webstream.controllerErrorFunction");
      function isReadableNodeStream(obj, strict = false) {
        var _obj$_readableState;
        return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === void 0 ? void 0 : _obj$_readableState.readable) !== false) && // Duplex
        (!obj._writableState || obj._readableState));
      }
      function isWritableNodeStream(obj) {
        var _obj$_writableState;
        return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === void 0 ? void 0 : _obj$_writableState.writable) !== false));
      }
      function isDuplexNodeStream(obj) {
        return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
      }
      function isNodeStream(obj) {
        return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
      }
      function isReadableStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.pipeThrough === "function" && typeof obj.getReader === "function" && typeof obj.cancel === "function");
      }
      function isWritableStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === "function" && typeof obj.abort === "function");
      }
      function isTransformStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.readable === "object" && typeof obj.writable === "object");
      }
      function isWebStream(obj) {
        return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj);
      }
      function isIterable(obj, isAsync) {
        if (obj == null)
          return false;
        if (isAsync === true)
          return typeof obj[SymbolAsyncIterator] === "function";
        if (isAsync === false)
          return typeof obj[SymbolIterator] === "function";
        return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
      }
      function isDestroyed(stream) {
        if (!isNodeStream(stream))
          return null;
        const wState = stream._writableState;
        const rState = stream._readableState;
        const state = wState || rState;
        return !!(stream.destroyed || stream[kIsDestroyed] || state !== null && state !== void 0 && state.destroyed);
      }
      function isWritableEnded(stream) {
        if (!isWritableNodeStream(stream))
          return null;
        if (stream.writableEnded === true)
          return true;
        const wState = stream._writableState;
        if (wState !== null && wState !== void 0 && wState.errored)
          return false;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.ended) !== "boolean")
          return null;
        return wState.ended;
      }
      function isWritableFinished(stream, strict) {
        if (!isWritableNodeStream(stream))
          return null;
        if (stream.writableFinished === true)
          return true;
        const wState = stream._writableState;
        if (wState !== null && wState !== void 0 && wState.errored)
          return false;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.finished) !== "boolean")
          return null;
        return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
      }
      function isReadableEnded(stream) {
        if (!isReadableNodeStream(stream))
          return null;
        if (stream.readableEnded === true)
          return true;
        const rState = stream._readableState;
        if (!rState || rState.errored)
          return false;
        if (typeof (rState === null || rState === void 0 ? void 0 : rState.ended) !== "boolean")
          return null;
        return rState.ended;
      }
      function isReadableFinished(stream, strict) {
        if (!isReadableNodeStream(stream))
          return null;
        const rState = stream._readableState;
        if (rState !== null && rState !== void 0 && rState.errored)
          return false;
        if (typeof (rState === null || rState === void 0 ? void 0 : rState.endEmitted) !== "boolean")
          return null;
        return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
      }
      function isReadable(stream) {
        if (stream && stream[kIsReadable] != null)
          return stream[kIsReadable];
        if (typeof (stream === null || stream === void 0 ? void 0 : stream.readable) !== "boolean")
          return null;
        if (isDestroyed(stream))
          return false;
        return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream);
      }
      function isWritable(stream) {
        if (stream && stream[kIsWritable] != null)
          return stream[kIsWritable];
        if (typeof (stream === null || stream === void 0 ? void 0 : stream.writable) !== "boolean")
          return null;
        if (isDestroyed(stream))
          return false;
        return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream);
      }
      function isFinished(stream, opts) {
        if (!isNodeStream(stream)) {
          return null;
        }
        if (isDestroyed(stream)) {
          return true;
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.readable) !== false && isReadable(stream)) {
          return false;
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.writable) !== false && isWritable(stream)) {
          return false;
        }
        return true;
      }
      function isWritableErrored(stream) {
        var _stream$_writableStat, _stream$_writableStat2;
        if (!isNodeStream(stream)) {
          return null;
        }
        if (stream.writableErrored) {
          return stream.writableErrored;
        }
        return (_stream$_writableStat = (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === void 0 ? void 0 : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== void 0 ? _stream$_writableStat : null;
      }
      function isReadableErrored(stream) {
        var _stream$_readableStat, _stream$_readableStat2;
        if (!isNodeStream(stream)) {
          return null;
        }
        if (stream.readableErrored) {
          return stream.readableErrored;
        }
        return (_stream$_readableStat = (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === void 0 ? void 0 : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== void 0 ? _stream$_readableStat : null;
      }
      function isClosed(stream) {
        if (!isNodeStream(stream)) {
          return null;
        }
        if (typeof stream.closed === "boolean") {
          return stream.closed;
        }
        const wState = stream._writableState;
        const rState = stream._readableState;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.closed) === "boolean" || typeof (rState === null || rState === void 0 ? void 0 : rState.closed) === "boolean") {
          return (wState === null || wState === void 0 ? void 0 : wState.closed) || (rState === null || rState === void 0 ? void 0 : rState.closed);
        }
        if (typeof stream._closed === "boolean" && isOutgoingMessage(stream)) {
          return stream._closed;
        }
        return null;
      }
      function isOutgoingMessage(stream) {
        return typeof stream._closed === "boolean" && typeof stream._defaultKeepAlive === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean";
      }
      function isServerResponse(stream) {
        return typeof stream._sent100 === "boolean" && isOutgoingMessage(stream);
      }
      function isServerRequest(stream) {
        var _stream$req;
        return typeof stream._consuming === "boolean" && typeof stream._dumped === "boolean" && ((_stream$req = stream.req) === null || _stream$req === void 0 ? void 0 : _stream$req.upgradeOrConnect) === void 0;
      }
      function willEmitClose(stream) {
        if (!isNodeStream(stream))
          return null;
        const wState = stream._writableState;
        const rState = stream._readableState;
        const state = wState || rState;
        return !state && isServerResponse(stream) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
      }
      function isDisturbed(stream) {
        var _stream$kIsDisturbed;
        return !!(stream && ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== void 0 ? _stream$kIsDisturbed : stream.readableDidRead || stream.readableAborted));
      }
      function isErrored(stream) {
        var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
        return !!(stream && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== void 0 ? _stream$kIsErrored : stream.readableErrored) !== null && _ref5 !== void 0 ? _ref5 : stream.writableErrored) !== null && _ref4 !== void 0 ? _ref4 : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === void 0 ? void 0 : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== void 0 ? _ref3 : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === void 0 ? void 0 : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== void 0 ? _ref2 : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === void 0 ? void 0 : _stream$_readableStat4.errored) !== null && _ref !== void 0 ? _ref : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === void 0 ? void 0 : _stream$_writableStat4.errored));
      }
      module.exports = {
        isDestroyed,
        kIsDestroyed,
        isDisturbed,
        kIsDisturbed,
        isErrored,
        kIsErrored,
        isReadable,
        kIsReadable,
        kIsClosedPromise,
        kControllerErrorFunction,
        kIsWritable,
        isClosed,
        isDuplexNodeStream,
        isFinished,
        isIterable,
        isReadableNodeStream,
        isReadableStream,
        isReadableEnded,
        isReadableFinished,
        isReadableErrored,
        isNodeStream,
        isWebStream,
        isWritable,
        isWritableNodeStream,
        isWritableStream,
        isWritableEnded,
        isWritableFinished,
        isWritableErrored,
        isServerRequest,
        isServerResponse,
        willEmitClose,
        isTransformStream
      };
    }
  });
  var require_end_of_stream = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var { AbortError, codes } = require_errors();
      var { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
      var { kEmptyObject, once } = require_util();
      var { validateAbortSignal, validateFunction, validateObject, validateBoolean } = require_validators();
      var { Promise: Promise2, PromisePrototypeThen, SymbolDispose } = require_primordials();
      var {
        isClosed,
        isReadable,
        isReadableNodeStream,
        isReadableStream,
        isReadableFinished,
        isReadableErrored,
        isWritable,
        isWritableNodeStream,
        isWritableStream,
        isWritableFinished,
        isWritableErrored,
        isNodeStream,
        willEmitClose: _willEmitClose,
        kIsClosedPromise
      } = require_utils();
      var addAbortListener;
      function isRequest(stream) {
        return stream.setHeader && typeof stream.abort === "function";
      }
      var nop = () => {
      };
      function eos(stream, options, callback) {
        var _options$readable, _options$writable;
        if (arguments.length === 2) {
          callback = options;
          options = kEmptyObject;
        } else if (options == null) {
          options = kEmptyObject;
        } else {
          validateObject(options, "options");
        }
        validateFunction(callback, "callback");
        validateAbortSignal(options.signal, "options.signal");
        callback = once(callback);
        if (isReadableStream(stream) || isWritableStream(stream)) {
          return eosWeb(stream, options, callback);
        }
        if (!isNodeStream(stream)) {
          throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
        }
        const readable = (_options$readable = options.readable) !== null && _options$readable !== void 0 ? _options$readable : isReadableNodeStream(stream);
        const writable = (_options$writable = options.writable) !== null && _options$writable !== void 0 ? _options$writable : isWritableNodeStream(stream);
        const wState = stream._writableState;
        const rState = stream._readableState;
        const onlegacyfinish = () => {
          if (!stream.writable) {
            onfinish();
          }
        };
        let willEmitClose = _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
        let writableFinished = isWritableFinished(stream, false);
        const onfinish = () => {
          writableFinished = true;
          if (stream.destroyed) {
            willEmitClose = false;
          }
          if (willEmitClose && (!stream.readable || readable)) {
            return;
          }
          if (!readable || readableFinished) {
            callback.call(stream);
          }
        };
        let readableFinished = isReadableFinished(stream, false);
        const onend = () => {
          readableFinished = true;
          if (stream.destroyed) {
            willEmitClose = false;
          }
          if (willEmitClose && (!stream.writable || writable)) {
            return;
          }
          if (!writable || writableFinished) {
            callback.call(stream);
          }
        };
        const onerror = (err) => {
          callback.call(stream, err);
        };
        let closed = isClosed(stream);
        const onclose = () => {
          closed = true;
          const errored = isWritableErrored(stream) || isReadableErrored(stream);
          if (errored && typeof errored !== "boolean") {
            return callback.call(stream, errored);
          }
          if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
            if (!isReadableFinished(stream, false))
              return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
          }
          if (writable && !writableFinished) {
            if (!isWritableFinished(stream, false))
              return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
          }
          callback.call(stream);
        };
        const onclosed = () => {
          closed = true;
          const errored = isWritableErrored(stream) || isReadableErrored(stream);
          if (errored && typeof errored !== "boolean") {
            return callback.call(stream, errored);
          }
          callback.call(stream);
        };
        const onrequest = () => {
          stream.req.on("finish", onfinish);
        };
        if (isRequest(stream)) {
          stream.on("complete", onfinish);
          if (!willEmitClose) {
            stream.on("abort", onclose);
          }
          if (stream.req) {
            onrequest();
          } else {
            stream.on("request", onrequest);
          }
        } else if (writable && !wState) {
          stream.on("end", onlegacyfinish);
          stream.on("close", onlegacyfinish);
        }
        if (!willEmitClose && typeof stream.aborted === "boolean") {
          stream.on("aborted", onclose);
        }
        stream.on("end", onend);
        stream.on("finish", onfinish);
        if (options.error !== false) {
          stream.on("error", onerror);
        }
        stream.on("close", onclose);
        if (closed) {
          process.nextTick(onclose);
        } else if (wState !== null && wState !== void 0 && wState.errorEmitted || rState !== null && rState !== void 0 && rState.errorEmitted) {
          if (!willEmitClose) {
            process.nextTick(onclosed);
          }
        } else if (!readable && (!willEmitClose || isReadable(stream)) && (writableFinished || isWritable(stream) === false)) {
          process.nextTick(onclosed);
        } else if (!writable && (!willEmitClose || isWritable(stream)) && (readableFinished || isReadable(stream) === false)) {
          process.nextTick(onclosed);
        } else if (rState && stream.req && stream.aborted) {
          process.nextTick(onclosed);
        }
        const cleanup = () => {
          callback = nop;
          stream.removeListener("aborted", onclose);
          stream.removeListener("complete", onfinish);
          stream.removeListener("abort", onclose);
          stream.removeListener("request", onrequest);
          if (stream.req)
            stream.req.removeListener("finish", onfinish);
          stream.removeListener("end", onlegacyfinish);
          stream.removeListener("close", onlegacyfinish);
          stream.removeListener("finish", onfinish);
          stream.removeListener("end", onend);
          stream.removeListener("error", onerror);
          stream.removeListener("close", onclose);
        };
        if (options.signal && !closed) {
          const abort = () => {
            const endCallback = callback;
            cleanup();
            endCallback.call(
              stream,
              new AbortError(void 0, {
                cause: options.signal.reason
              })
            );
          };
          if (options.signal.aborted) {
            process.nextTick(abort);
          } else {
            addAbortListener = addAbortListener || require_util().addAbortListener;
            const disposable = addAbortListener(options.signal, abort);
            const originalCallback = callback;
            callback = once((...args) => {
              disposable[SymbolDispose]();
              originalCallback.apply(stream, args);
            });
          }
        }
        return cleanup;
      }
      function eosWeb(stream, options, callback) {
        let isAborted = false;
        let abort = nop;
        if (options.signal) {
          abort = () => {
            isAborted = true;
            callback.call(
              stream,
              new AbortError(void 0, {
                cause: options.signal.reason
              })
            );
          };
          if (options.signal.aborted) {
            process.nextTick(abort);
          } else {
            addAbortListener = addAbortListener || require_util().addAbortListener;
            const disposable = addAbortListener(options.signal, abort);
            const originalCallback = callback;
            callback = once((...args) => {
              disposable[SymbolDispose]();
              originalCallback.apply(stream, args);
            });
          }
        }
        const resolverFn = (...args) => {
          if (!isAborted) {
            process.nextTick(() => callback.apply(stream, args));
          }
        };
        PromisePrototypeThen(stream[kIsClosedPromise].promise, resolverFn, resolverFn);
        return nop;
      }
      function finished(stream, opts) {
        var _opts;
        let autoCleanup = false;
        if (opts === null) {
          opts = kEmptyObject;
        }
        if ((_opts = opts) !== null && _opts !== void 0 && _opts.cleanup) {
          validateBoolean(opts.cleanup, "cleanup");
          autoCleanup = opts.cleanup;
        }
        return new Promise2((resolve, reject) => {
          const cleanup = eos(stream, opts, (err) => {
            if (autoCleanup) {
              cleanup();
            }
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
      module.exports = eos;
      module.exports.finished = finished;
    }
  });
  var require_destroy = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var {
        aggregateTwoErrors,
        codes: { ERR_MULTIPLE_CALLBACK },
        AbortError
      } = require_errors();
      var { Symbol: Symbol2 } = require_primordials();
      var { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = require_utils();
      var kDestroy = Symbol2("kDestroy");
      var kConstruct = Symbol2("kConstruct");
      function checkError(err, w, r) {
        if (err) {
          err.stack;
          if (w && !w.errored) {
            w.errored = err;
          }
          if (r && !r.errored) {
            r.errored = err;
          }
        }
      }
      function destroy(err, cb) {
        const r = this._readableState;
        const w = this._writableState;
        const s = w || r;
        if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
          if (typeof cb === "function") {
            cb();
          }
          return this;
        }
        checkError(err, w, r);
        if (w) {
          w.destroyed = true;
        }
        if (r) {
          r.destroyed = true;
        }
        if (!s.constructed) {
          this.once(kDestroy, function(er) {
            _destroy(this, aggregateTwoErrors(er, err), cb);
          });
        } else {
          _destroy(this, err, cb);
        }
        return this;
      }
      function _destroy(self2, err, cb) {
        let called = false;
        function onDestroy(err2) {
          if (called) {
            return;
          }
          called = true;
          const r = self2._readableState;
          const w = self2._writableState;
          checkError(err2, w, r);
          if (w) {
            w.closed = true;
          }
          if (r) {
            r.closed = true;
          }
          if (typeof cb === "function") {
            cb(err2);
          }
          if (err2) {
            process.nextTick(emitErrorCloseNT, self2, err2);
          } else {
            process.nextTick(emitCloseNT, self2);
          }
        }
        try {
          self2._destroy(err || null, onDestroy);
        } catch (err2) {
          onDestroy(err2);
        }
      }
      function emitErrorCloseNT(self2, err) {
        emitErrorNT(self2, err);
        emitCloseNT(self2);
      }
      function emitCloseNT(self2) {
        const r = self2._readableState;
        const w = self2._writableState;
        if (w) {
          w.closeEmitted = true;
        }
        if (r) {
          r.closeEmitted = true;
        }
        if (w !== null && w !== void 0 && w.emitClose || r !== null && r !== void 0 && r.emitClose) {
          self2.emit("close");
        }
      }
      function emitErrorNT(self2, err) {
        const r = self2._readableState;
        const w = self2._writableState;
        if (w !== null && w !== void 0 && w.errorEmitted || r !== null && r !== void 0 && r.errorEmitted) {
          return;
        }
        if (w) {
          w.errorEmitted = true;
        }
        if (r) {
          r.errorEmitted = true;
        }
        self2.emit("error", err);
      }
      function undestroy() {
        const r = this._readableState;
        const w = this._writableState;
        if (r) {
          r.constructed = true;
          r.closed = false;
          r.closeEmitted = false;
          r.destroyed = false;
          r.errored = null;
          r.errorEmitted = false;
          r.reading = false;
          r.ended = r.readable === false;
          r.endEmitted = r.readable === false;
        }
        if (w) {
          w.constructed = true;
          w.destroyed = false;
          w.closed = false;
          w.closeEmitted = false;
          w.errored = null;
          w.errorEmitted = false;
          w.finalCalled = false;
          w.prefinished = false;
          w.ended = w.writable === false;
          w.ending = w.writable === false;
          w.finished = w.writable === false;
        }
      }
      function errorOrDestroy(stream, err, sync) {
        const r = stream._readableState;
        const w = stream._writableState;
        if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
          return this;
        }
        if (r !== null && r !== void 0 && r.autoDestroy || w !== null && w !== void 0 && w.autoDestroy)
          stream.destroy(err);
        else if (err) {
          err.stack;
          if (w && !w.errored) {
            w.errored = err;
          }
          if (r && !r.errored) {
            r.errored = err;
          }
          if (sync) {
            process.nextTick(emitErrorNT, stream, err);
          } else {
            emitErrorNT(stream, err);
          }
        }
      }
      function construct(stream, cb) {
        if (typeof stream._construct !== "function") {
          return;
        }
        const r = stream._readableState;
        const w = stream._writableState;
        if (r) {
          r.constructed = false;
        }
        if (w) {
          w.constructed = false;
        }
        stream.once(kConstruct, cb);
        if (stream.listenerCount(kConstruct) > 1) {
          return;
        }
        process.nextTick(constructNT, stream);
      }
      function constructNT(stream) {
        let called = false;
        function onConstruct(err) {
          if (called) {
            errorOrDestroy(stream, err !== null && err !== void 0 ? err : new ERR_MULTIPLE_CALLBACK());
            return;
          }
          called = true;
          const r = stream._readableState;
          const w = stream._writableState;
          const s = w || r;
          if (r) {
            r.constructed = true;
          }
          if (w) {
            w.constructed = true;
          }
          if (s.destroyed) {
            stream.emit(kDestroy, err);
          } else if (err) {
            errorOrDestroy(stream, err, true);
          } else {
            process.nextTick(emitConstructNT, stream);
          }
        }
        try {
          stream._construct((err) => {
            process.nextTick(onConstruct, err);
          });
        } catch (err) {
          process.nextTick(onConstruct, err);
        }
      }
      function emitConstructNT(stream) {
        stream.emit(kConstruct);
      }
      function isRequest(stream) {
        return (stream === null || stream === void 0 ? void 0 : stream.setHeader) && typeof stream.abort === "function";
      }
      function emitCloseLegacy(stream) {
        stream.emit("close");
      }
      function emitErrorCloseLegacy(stream, err) {
        stream.emit("error", err);
        process.nextTick(emitCloseLegacy, stream);
      }
      function destroyer(stream, err) {
        if (!stream || isDestroyed(stream)) {
          return;
        }
        if (!err && !isFinished(stream)) {
          err = new AbortError();
        }
        if (isServerRequest(stream)) {
          stream.socket = null;
          stream.destroy(err);
        } else if (isRequest(stream)) {
          stream.abort();
        } else if (isRequest(stream.req)) {
          stream.req.abort();
        } else if (typeof stream.destroy === "function") {
          stream.destroy(err);
        } else if (typeof stream.close === "function") {
          stream.close();
        } else if (err) {
          process.nextTick(emitErrorCloseLegacy, stream, err);
        } else {
          process.nextTick(emitCloseLegacy, stream);
        }
        if (!stream.destroyed) {
          stream[kIsDestroyed] = true;
        }
      }
      module.exports = {
        construct,
        destroyer,
        destroy,
        undestroy,
        errorOrDestroy
      };
    }
  });
  var require_legacy = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/legacy.js"(exports, module) {
      "use strict";
      var { ArrayIsArray, ObjectSetPrototypeOf } = require_primordials();
      var { EventEmitter: EE } = require_events();
      function Stream(opts) {
        EE.call(this, opts);
      }
      ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
      ObjectSetPrototypeOf(Stream, EE);
      Stream.prototype.pipe = function(dest, options) {
        const source = this;
        function ondata(chunk) {
          if (dest.writable && dest.write(chunk) === false && source.pause) {
            source.pause();
          }
        }
        source.on("data", ondata);
        function ondrain() {
          if (source.readable && source.resume) {
            source.resume();
          }
        }
        dest.on("drain", ondrain);
        if (!dest._isStdio && (!options || options.end !== false)) {
          source.on("end", onend);
          source.on("close", onclose);
        }
        let didOnEnd = false;
        function onend() {
          if (didOnEnd)
            return;
          didOnEnd = true;
          dest.end();
        }
        function onclose() {
          if (didOnEnd)
            return;
          didOnEnd = true;
          if (typeof dest.destroy === "function")
            dest.destroy();
        }
        function onerror(er) {
          cleanup();
          if (EE.listenerCount(this, "error") === 0) {
            this.emit("error", er);
          }
        }
        prependListener(source, "error", onerror);
        prependListener(dest, "error", onerror);
        function cleanup() {
          source.removeListener("data", ondata);
          dest.removeListener("drain", ondrain);
          source.removeListener("end", onend);
          source.removeListener("close", onclose);
          source.removeListener("error", onerror);
          dest.removeListener("error", onerror);
          source.removeListener("end", cleanup);
          source.removeListener("close", cleanup);
          dest.removeListener("close", cleanup);
        }
        source.on("end", cleanup);
        source.on("close", cleanup);
        dest.on("close", cleanup);
        dest.emit("pipe", source);
        return dest;
      };
      function prependListener(emitter, event2, fn) {
        if (typeof emitter.prependListener === "function")
          return emitter.prependListener(event2, fn);
        if (!emitter._events || !emitter._events[event2])
          emitter.on(event2, fn);
        else if (ArrayIsArray(emitter._events[event2]))
          emitter._events[event2].unshift(fn);
        else
          emitter._events[event2] = [fn, emitter._events[event2]];
      }
      module.exports = {
        Stream,
        prependListener
      };
    }
  });
  var require_add_abort_signal = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/add-abort-signal.js"(exports, module) {
      "use strict";
      var { SymbolDispose } = require_primordials();
      var { AbortError, codes } = require_errors();
      var { isNodeStream, isWebStream, kControllerErrorFunction } = require_utils();
      var eos = require_end_of_stream();
      var { ERR_INVALID_ARG_TYPE } = codes;
      var addAbortListener;
      var validateAbortSignal = (signal, name) => {
        if (typeof signal !== "object" || !("aborted" in signal)) {
          throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
        }
      };
      module.exports.addAbortSignal = function addAbortSignal(signal, stream) {
        validateAbortSignal(signal, "signal");
        if (!isNodeStream(stream) && !isWebStream(stream)) {
          throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
        }
        return module.exports.addAbortSignalNoValidate(signal, stream);
      };
      module.exports.addAbortSignalNoValidate = function(signal, stream) {
        if (typeof signal !== "object" || !("aborted" in signal)) {
          return stream;
        }
        const onAbort = isNodeStream(stream) ? () => {
          stream.destroy(
            new AbortError(void 0, {
              cause: signal.reason
            })
          );
        } : () => {
          stream[kControllerErrorFunction](
            new AbortError(void 0, {
              cause: signal.reason
            })
          );
        };
        if (signal.aborted) {
          onAbort();
        } else {
          addAbortListener = addAbortListener || require_util().addAbortListener;
          const disposable = addAbortListener(signal, onAbort);
          eos(stream, disposable[SymbolDispose]);
        }
        return stream;
      };
    }
  });
  var require_buffer_list = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
      "use strict";
      var { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = require_primordials();
      var { Buffer: Buffer3 } = require_buffer();
      var { inspect } = require_util();
      module.exports = class BufferList {
        constructor() {
          this.head = null;
          this.tail = null;
          this.length = 0;
        }
        push(v) {
          const entry = {
            data: v,
            next: null
          };
          if (this.length > 0)
            this.tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
          ++this.length;
        }
        unshift(v) {
          const entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0)
            this.tail = entry;
          this.head = entry;
          ++this.length;
        }
        shift() {
          if (this.length === 0)
            return;
          const ret = this.head.data;
          if (this.length === 1)
            this.head = this.tail = null;
          else
            this.head = this.head.next;
          --this.length;
          return ret;
        }
        clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
        join(s) {
          if (this.length === 0)
            return "";
          let p = this.head;
          let ret = "" + p.data;
          while ((p = p.next) !== null)
            ret += s + p.data;
          return ret;
        }
        concat(n) {
          if (this.length === 0)
            return Buffer3.alloc(0);
          const ret = Buffer3.allocUnsafe(n >>> 0);
          let p = this.head;
          let i = 0;
          while (p) {
            TypedArrayPrototypeSet(ret, p.data, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
        consume(n, hasStrings) {
          const data = this.head.data;
          if (n < data.length) {
            const slice = data.slice(0, n);
            this.head.data = data.slice(n);
            return slice;
          }
          if (n === data.length) {
            return this.shift();
          }
          return hasStrings ? this._getString(n) : this._getBuffer(n);
        }
        first() {
          return this.head.data;
        }
        *[SymbolIterator]() {
          for (let p = this.head; p; p = p.next) {
            yield p.data;
          }
        }
        // Consumes a specified amount of characters from the buffered data.
        _getString(n) {
          let ret = "";
          let p = this.head;
          let c = 0;
          do {
            const str = p.data;
            if (n > str.length) {
              ret += str;
              n -= str.length;
            } else {
              if (n === str.length) {
                ret += str;
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                ret += StringPrototypeSlice(str, 0, n);
                this.head = p;
                p.data = StringPrototypeSlice(str, n);
              }
              break;
            }
            ++c;
          } while ((p = p.next) !== null);
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
        _getBuffer(n) {
          const ret = Buffer3.allocUnsafe(n);
          const retLen = n;
          let p = this.head;
          let c = 0;
          do {
            const buf2 = p.data;
            if (n > buf2.length) {
              TypedArrayPrototypeSet(ret, buf2, retLen - n);
              n -= buf2.length;
            } else {
              if (n === buf2.length) {
                TypedArrayPrototypeSet(ret, buf2, retLen - n);
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                TypedArrayPrototypeSet(ret, new Uint8Array2(buf2.buffer, buf2.byteOffset, n), retLen - n);
                this.head = p;
                p.data = buf2.slice(n);
              }
              break;
            }
            ++c;
          } while ((p = p.next) !== null);
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
        [Symbol.for("nodejs.util.inspect.custom")](_, options) {
          return inspect(this, {
            ...options,
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          });
        }
      };
    }
  });
  var require_state = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
      "use strict";
      var { MathFloor, NumberIsInteger } = require_primordials();
      var { validateInteger } = require_validators();
      var { ERR_INVALID_ARG_VALUE } = require_errors().codes;
      var defaultHighWaterMarkBytes = 16 * 1024;
      var defaultHighWaterMarkObjectMode = 16;
      function highWaterMarkFrom(options, isDuplex, duplexKey) {
        return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
      }
      function getDefaultHighWaterMark(objectMode) {
        return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes;
      }
      function setDefaultHighWaterMark(objectMode, value) {
        validateInteger(value, "value", 0);
        if (objectMode) {
          defaultHighWaterMarkObjectMode = value;
        } else {
          defaultHighWaterMarkBytes = value;
        }
      }
      function getHighWaterMark(state, options, duplexKey, isDuplex) {
        const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
        if (hwm != null) {
          if (!NumberIsInteger(hwm) || hwm < 0) {
            const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
            throw new ERR_INVALID_ARG_VALUE(name, hwm);
          }
          return MathFloor(hwm);
        }
        return getDefaultHighWaterMark(state.objectMode);
      }
      module.exports = {
        getHighWaterMark,
        getDefaultHighWaterMark,
        setDefaultHighWaterMark
      };
    }
  });
  var require_safe_buffer = __commonJS({
    "node_modules/safe-buffer/index.js"(exports, module) {
      var buffer = require_buffer();
      var Buffer3 = buffer.Buffer;
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key];
        }
      }
      if (Buffer3.from && Buffer3.alloc && Buffer3.allocUnsafe && Buffer3.allocUnsafeSlow) {
        module.exports = buffer;
      } else {
        copyProps(buffer, exports);
        exports.Buffer = SafeBuffer;
      }
      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer3(arg, encodingOrOffset, length);
      }
      SafeBuffer.prototype = Object.create(Buffer3.prototype);
      copyProps(Buffer3, SafeBuffer);
      SafeBuffer.from = function(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          throw new TypeError("Argument must not be a number");
        }
        return Buffer3(arg, encodingOrOffset, length);
      };
      SafeBuffer.alloc = function(size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        var buf2 = Buffer3(size);
        if (fill !== void 0) {
          if (typeof encoding === "string") {
            buf2.fill(fill, encoding);
          } else {
            buf2.fill(fill);
          }
        } else {
          buf2.fill(0);
        }
        return buf2;
      };
      SafeBuffer.allocUnsafe = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return Buffer3(size);
      };
      SafeBuffer.allocUnsafeSlow = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return buffer.SlowBuffer(size);
      };
    }
  });
  var require_string_decoder = __commonJS({
    "node_modules/string_decoder/lib/string_decoder.js"(exports) {
      "use strict";
      var Buffer3 = require_safe_buffer().Buffer;
      var isEncoding = Buffer3.isEncoding || function(encoding) {
        encoding = "" + encoding;
        switch (encoding && encoding.toLowerCase()) {
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
      function _normalizeEncoding(enc) {
        if (!enc)
          return "utf8";
        var retried;
        while (true) {
          switch (enc) {
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
              return enc;
            default:
              if (retried)
                return;
              enc = ("" + enc).toLowerCase();
              retried = true;
          }
        }
      }
      function normalizeEncoding(enc) {
        var nenc = _normalizeEncoding(enc);
        if (typeof nenc !== "string" && (Buffer3.isEncoding === isEncoding || !isEncoding(enc)))
          throw new Error("Unknown encoding: " + enc);
        return nenc || enc;
      }
      exports.StringDecoder = StringDecoder;
      function StringDecoder(encoding) {
        this.encoding = normalizeEncoding(encoding);
        var nb;
        switch (this.encoding) {
          case "utf16le":
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
          case "utf8":
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
          case "base64":
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
          default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
        }
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer3.allocUnsafe(nb);
      }
      StringDecoder.prototype.write = function(buf2) {
        if (buf2.length === 0)
          return "";
        var r;
        var i;
        if (this.lastNeed) {
          r = this.fillLast(buf2);
          if (r === void 0)
            return "";
          i = this.lastNeed;
          this.lastNeed = 0;
        } else {
          i = 0;
        }
        if (i < buf2.length)
          return r ? r + this.text(buf2, i) : this.text(buf2, i);
        return r || "";
      };
      StringDecoder.prototype.end = utf8End;
      StringDecoder.prototype.text = utf8Text;
      StringDecoder.prototype.fillLast = function(buf2) {
        if (this.lastNeed <= buf2.length) {
          buf2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf2.length);
        this.lastNeed -= buf2.length;
      };
      function utf8CheckByte(byte) {
        if (byte <= 127)
          return 0;
        else if (byte >> 5 === 6)
          return 2;
        else if (byte >> 4 === 14)
          return 3;
        else if (byte >> 3 === 30)
          return 4;
        return byte >> 6 === 2 ? -1 : -2;
      }
      function utf8CheckIncomplete(self2, buf2, i) {
        var j = buf2.length - 1;
        if (j < i)
          return 0;
        var nb = utf8CheckByte(buf2[j]);
        if (nb >= 0) {
          if (nb > 0)
            self2.lastNeed = nb - 1;
          return nb;
        }
        if (--j < i || nb === -2)
          return 0;
        nb = utf8CheckByte(buf2[j]);
        if (nb >= 0) {
          if (nb > 0)
            self2.lastNeed = nb - 2;
          return nb;
        }
        if (--j < i || nb === -2)
          return 0;
        nb = utf8CheckByte(buf2[j]);
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2)
              nb = 0;
            else
              self2.lastNeed = nb - 3;
          }
          return nb;
        }
        return 0;
      }
      function utf8CheckExtraBytes(self2, buf2, p) {
        if ((buf2[0] & 192) !== 128) {
          self2.lastNeed = 0;
          return "\uFFFD";
        }
        if (self2.lastNeed > 1 && buf2.length > 1) {
          if ((buf2[1] & 192) !== 128) {
            self2.lastNeed = 1;
            return "\uFFFD";
          }
          if (self2.lastNeed > 2 && buf2.length > 2) {
            if ((buf2[2] & 192) !== 128) {
              self2.lastNeed = 2;
              return "\uFFFD";
            }
          }
        }
      }
      function utf8FillLast(buf2) {
        var p = this.lastTotal - this.lastNeed;
        var r = utf8CheckExtraBytes(this, buf2, p);
        if (r !== void 0)
          return r;
        if (this.lastNeed <= buf2.length) {
          buf2.copy(this.lastChar, p, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf2.copy(this.lastChar, p, 0, buf2.length);
        this.lastNeed -= buf2.length;
      }
      function utf8Text(buf2, i) {
        var total = utf8CheckIncomplete(this, buf2, i);
        if (!this.lastNeed)
          return buf2.toString("utf8", i);
        this.lastTotal = total;
        var end = buf2.length - (total - this.lastNeed);
        buf2.copy(this.lastChar, 0, end);
        return buf2.toString("utf8", i, end);
      }
      function utf8End(buf2) {
        var r = buf2 && buf2.length ? this.write(buf2) : "";
        if (this.lastNeed)
          return r + "\uFFFD";
        return r;
      }
      function utf16Text(buf2, i) {
        if ((buf2.length - i) % 2 === 0) {
          var r = buf2.toString("utf16le", i);
          if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 55296 && c <= 56319) {
              this.lastNeed = 2;
              this.lastTotal = 4;
              this.lastChar[0] = buf2[buf2.length - 2];
              this.lastChar[1] = buf2[buf2.length - 1];
              return r.slice(0, -1);
            }
          }
          return r;
        }
        this.lastNeed = 1;
        this.lastTotal = 2;
        this.lastChar[0] = buf2[buf2.length - 1];
        return buf2.toString("utf16le", i, buf2.length - 1);
      }
      function utf16End(buf2) {
        var r = buf2 && buf2.length ? this.write(buf2) : "";
        if (this.lastNeed) {
          var end = this.lastTotal - this.lastNeed;
          return r + this.lastChar.toString("utf16le", 0, end);
        }
        return r;
      }
      function base64Text(buf2, i) {
        var n = (buf2.length - i) % 3;
        if (n === 0)
          return buf2.toString("base64", i);
        this.lastNeed = 3 - n;
        this.lastTotal = 3;
        if (n === 1) {
          this.lastChar[0] = buf2[buf2.length - 1];
        } else {
          this.lastChar[0] = buf2[buf2.length - 2];
          this.lastChar[1] = buf2[buf2.length - 1];
        }
        return buf2.toString("base64", i, buf2.length - n);
      }
      function base64End(buf2) {
        var r = buf2 && buf2.length ? this.write(buf2) : "";
        if (this.lastNeed)
          return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
        return r;
      }
      function simpleWrite(buf2) {
        return buf2.toString(this.encoding);
      }
      function simpleEnd(buf2) {
        return buf2 && buf2.length ? this.write(buf2) : "";
      }
    }
  });
  var require_from = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/from.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = require_primordials();
      var { Buffer: Buffer3 } = require_buffer();
      var { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = require_errors().codes;
      function from(Readable2, iterable, opts) {
        let iterator;
        if (typeof iterable === "string" || iterable instanceof Buffer3) {
          return new Readable2({
            objectMode: true,
            ...opts,
            read() {
              this.push(iterable);
              this.push(null);
            }
          });
        }
        let isAsync;
        if (iterable && iterable[SymbolAsyncIterator]) {
          isAsync = true;
          iterator = iterable[SymbolAsyncIterator]();
        } else if (iterable && iterable[SymbolIterator]) {
          isAsync = false;
          iterator = iterable[SymbolIterator]();
        } else {
          throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
        }
        const readable = new Readable2({
          objectMode: true,
          highWaterMark: 1,
          // TODO(ronag): What options should be allowed?
          ...opts
        });
        let reading = false;
        readable._read = function() {
          if (!reading) {
            reading = true;
            next();
          }
        };
        readable._destroy = function(error4, cb) {
          PromisePrototypeThen(
            close(error4),
            () => process.nextTick(cb, error4),
            // nextTick is here in case cb throws
            (e) => process.nextTick(cb, e || error4)
          );
        };
        async function close(error4) {
          const hadError = error4 !== void 0 && error4 !== null;
          const hasThrow = typeof iterator.throw === "function";
          if (hadError && hasThrow) {
            const { value, done } = await iterator.throw(error4);
            await value;
            if (done) {
              return;
            }
          }
          if (typeof iterator.return === "function") {
            const { value } = await iterator.return();
            await value;
          }
        }
        async function next() {
          for (; ; ) {
            try {
              const { value, done } = isAsync ? await iterator.next() : iterator.next();
              if (done) {
                readable.push(null);
              } else {
                const res = value && typeof value.then === "function" ? await value : value;
                if (res === null) {
                  reading = false;
                  throw new ERR_STREAM_NULL_VALUES();
                } else if (readable.push(res)) {
                  continue;
                } else {
                  reading = false;
                }
              }
            } catch (err) {
              readable.destroy(err);
            }
            break;
          }
        }
        return readable;
      }
      module.exports = from;
    }
  });
  var require_readable = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/readable.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var {
        ArrayPrototypeIndexOf,
        NumberIsInteger,
        NumberIsNaN,
        NumberParseInt,
        ObjectDefineProperties,
        ObjectKeys,
        ObjectSetPrototypeOf,
        Promise: Promise2,
        SafeSet,
        SymbolAsyncDispose,
        SymbolAsyncIterator,
        Symbol: Symbol2
      } = require_primordials();
      module.exports = Readable2;
      Readable2.ReadableState = ReadableState;
      var { EventEmitter: EE } = require_events();
      var { Stream, prependListener } = require_legacy();
      var { Buffer: Buffer3 } = require_buffer();
      var { addAbortSignal } = require_add_abort_signal();
      var eos = require_end_of_stream();
      var debug = require_util().debuglog("stream", (fn) => {
        debug = fn;
      });
      var BufferList = require_buffer_list();
      var destroyImpl = require_destroy();
      var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
      var {
        aggregateTwoErrors,
        codes: {
          ERR_INVALID_ARG_TYPE,
          ERR_METHOD_NOT_IMPLEMENTED,
          ERR_OUT_OF_RANGE,
          ERR_STREAM_PUSH_AFTER_EOF,
          ERR_STREAM_UNSHIFT_AFTER_END_EVENT
        },
        AbortError
      } = require_errors();
      var { validateObject } = require_validators();
      var kPaused = Symbol2("kPaused");
      var { StringDecoder } = require_string_decoder();
      var from = require_from();
      ObjectSetPrototypeOf(Readable2.prototype, Stream.prototype);
      ObjectSetPrototypeOf(Readable2, Stream);
      var nop = () => {
      };
      var { errorOrDestroy } = destroyImpl;
      var kObjectMode = 1 << 0;
      var kEnded = 1 << 1;
      var kEndEmitted = 1 << 2;
      var kReading = 1 << 3;
      var kConstructed = 1 << 4;
      var kSync = 1 << 5;
      var kNeedReadable = 1 << 6;
      var kEmittedReadable = 1 << 7;
      var kReadableListening = 1 << 8;
      var kResumeScheduled = 1 << 9;
      var kErrorEmitted = 1 << 10;
      var kEmitClose = 1 << 11;
      var kAutoDestroy = 1 << 12;
      var kDestroyed = 1 << 13;
      var kClosed = 1 << 14;
      var kCloseEmitted = 1 << 15;
      var kMultiAwaitDrain = 1 << 16;
      var kReadingMore = 1 << 17;
      var kDataEmitted = 1 << 18;
      function makeBitMapDescriptor(bit) {
        return {
          enumerable: false,
          get() {
            return (this.state & bit) !== 0;
          },
          set(value) {
            if (value)
              this.state |= bit;
            else
              this.state &= ~bit;
          }
        };
      }
      ObjectDefineProperties(ReadableState.prototype, {
        objectMode: makeBitMapDescriptor(kObjectMode),
        ended: makeBitMapDescriptor(kEnded),
        endEmitted: makeBitMapDescriptor(kEndEmitted),
        reading: makeBitMapDescriptor(kReading),
        // Stream is still being constructed and cannot be
        // destroyed until construction finished or failed.
        // Async construction is opt in, therefore we start as
        // constructed.
        constructed: makeBitMapDescriptor(kConstructed),
        // A flag to be able to tell if the event 'readable'/'data' is emitted
        // immediately, or on a later tick.  We set this to true at first, because
        // any actions that shouldn't happen until "later" should generally also
        // not happen before the first read call.
        sync: makeBitMapDescriptor(kSync),
        // Whenever we return null, then we set a flag to say
        // that we're awaiting a 'readable' event emission.
        needReadable: makeBitMapDescriptor(kNeedReadable),
        emittedReadable: makeBitMapDescriptor(kEmittedReadable),
        readableListening: makeBitMapDescriptor(kReadableListening),
        resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
        // True if the error was already emitted and should not be thrown again.
        errorEmitted: makeBitMapDescriptor(kErrorEmitted),
        emitClose: makeBitMapDescriptor(kEmitClose),
        autoDestroy: makeBitMapDescriptor(kAutoDestroy),
        // Has it been destroyed.
        destroyed: makeBitMapDescriptor(kDestroyed),
        // Indicates whether the stream has finished destroying.
        closed: makeBitMapDescriptor(kClosed),
        // True if close has been emitted or would have been emitted
        // depending on emitClose.
        closeEmitted: makeBitMapDescriptor(kCloseEmitted),
        multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
        // If true, a maybeReadMore has been scheduled.
        readingMore: makeBitMapDescriptor(kReadingMore),
        dataEmitted: makeBitMapDescriptor(kDataEmitted)
      });
      function ReadableState(options, stream, isDuplex) {
        if (typeof isDuplex !== "boolean")
          isDuplex = stream instanceof require_duplex();
        this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
        if (options && options.objectMode)
          this.state |= kObjectMode;
        if (isDuplex && options && options.readableObjectMode)
          this.state |= kObjectMode;
        this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = [];
        this.flowing = null;
        this[kPaused] = null;
        if (options && options.emitClose === false)
          this.state &= ~kEmitClose;
        if (options && options.autoDestroy === false)
          this.state &= ~kAutoDestroy;
        this.errored = null;
        this.defaultEncoding = options && options.defaultEncoding || "utf8";
        this.awaitDrainWriters = null;
        this.decoder = null;
        this.encoding = null;
        if (options && options.encoding) {
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }
      function Readable2(options) {
        if (!(this instanceof Readable2))
          return new Readable2(options);
        const isDuplex = this instanceof require_duplex();
        this._readableState = new ReadableState(options, this, isDuplex);
        if (options) {
          if (typeof options.read === "function")
            this._read = options.read;
          if (typeof options.destroy === "function")
            this._destroy = options.destroy;
          if (typeof options.construct === "function")
            this._construct = options.construct;
          if (options.signal && !isDuplex)
            addAbortSignal(options.signal, this);
        }
        Stream.call(this, options);
        destroyImpl.construct(this, () => {
          if (this._readableState.needReadable) {
            maybeReadMore(this, this._readableState);
          }
        });
      }
      Readable2.prototype.destroy = destroyImpl.destroy;
      Readable2.prototype._undestroy = destroyImpl.undestroy;
      Readable2.prototype._destroy = function(err, cb) {
        cb(err);
      };
      Readable2.prototype[EE.captureRejectionSymbol] = function(err) {
        this.destroy(err);
      };
      Readable2.prototype[SymbolAsyncDispose] = function() {
        let error4;
        if (!this.destroyed) {
          error4 = this.readableEnded ? null : new AbortError();
          this.destroy(error4);
        }
        return new Promise2((resolve, reject) => eos(this, (err) => err && err !== error4 ? reject(err) : resolve(null)));
      };
      Readable2.prototype.push = function(chunk, encoding) {
        return readableAddChunk(this, chunk, encoding, false);
      };
      Readable2.prototype.unshift = function(chunk, encoding) {
        return readableAddChunk(this, chunk, encoding, true);
      };
      function readableAddChunk(stream, chunk, encoding, addToFront) {
        debug("readableAddChunk", chunk);
        const state = stream._readableState;
        let err;
        if ((state.state & kObjectMode) === 0) {
          if (typeof chunk === "string") {
            encoding = encoding || state.defaultEncoding;
            if (state.encoding !== encoding) {
              if (addToFront && state.encoding) {
                chunk = Buffer3.from(chunk, encoding).toString(state.encoding);
              } else {
                chunk = Buffer3.from(chunk, encoding);
                encoding = "";
              }
            }
          } else if (chunk instanceof Buffer3) {
            encoding = "";
          } else if (Stream._isUint8Array(chunk)) {
            chunk = Stream._uint8ArrayToBuffer(chunk);
            encoding = "";
          } else if (chunk != null) {
            err = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
          }
        }
        if (err) {
          errorOrDestroy(stream, err);
        } else if (chunk === null) {
          state.state &= ~kReading;
          onEofChunk(stream, state);
        } else if ((state.state & kObjectMode) !== 0 || chunk && chunk.length > 0) {
          if (addToFront) {
            if ((state.state & kEndEmitted) !== 0)
              errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else if (state.destroyed || state.errored)
              return false;
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed || state.errored) {
            return false;
          } else {
            state.state &= ~kReading;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.state &= ~kReading;
          maybeReadMore(stream, state);
        }
        return !state.ended && (state.length < state.highWaterMark || state.length === 0);
      }
      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
          if ((state.state & kMultiAwaitDrain) !== 0) {
            state.awaitDrainWriters.clear();
          } else {
            state.awaitDrainWriters = null;
          }
          state.dataEmitted = true;
          stream.emit("data", chunk);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront)
            state.buffer.unshift(chunk);
          else
            state.buffer.push(chunk);
          if ((state.state & kNeedReadable) !== 0)
            emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }
      Readable2.prototype.isPaused = function() {
        const state = this._readableState;
        return state[kPaused] === true || state.flowing === false;
      };
      Readable2.prototype.setEncoding = function(enc) {
        const decoder2 = new StringDecoder(enc);
        this._readableState.decoder = decoder2;
        this._readableState.encoding = this._readableState.decoder.encoding;
        const buffer = this._readableState.buffer;
        let content = "";
        for (const data of buffer) {
          content += decoder2.write(data);
        }
        buffer.clear();
        if (content !== "")
          buffer.push(content);
        this._readableState.length = content.length;
        return this;
      };
      var MAX_HWM = 1073741824;
      function computeNewHighWaterMark(n) {
        if (n > MAX_HWM) {
          throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
        } else {
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }
      function howMuchToRead(n, state) {
        if (n <= 0 || state.length === 0 && state.ended)
          return 0;
        if ((state.state & kObjectMode) !== 0)
          return 1;
        if (NumberIsNaN(n)) {
          if (state.flowing && state.length)
            return state.buffer.first().length;
          return state.length;
        }
        if (n <= state.length)
          return n;
        return state.ended ? state.length : 0;
      }
      Readable2.prototype.read = function(n) {
        debug("read", n);
        if (n === void 0) {
          n = NaN;
        } else if (!NumberIsInteger(n)) {
          n = NumberParseInt(n, 10);
        }
        const state = this._readableState;
        const nOrig = n;
        if (n > state.highWaterMark)
          state.highWaterMark = computeNewHighWaterMark(n);
        if (n !== 0)
          state.state &= ~kEmittedReadable;
        if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
          debug("read: emitReadable", state.length, state.ended);
          if (state.length === 0 && state.ended)
            endReadable(this);
          else
            emitReadable(this);
          return null;
        }
        n = howMuchToRead(n, state);
        if (n === 0 && state.ended) {
          if (state.length === 0)
            endReadable(this);
          return null;
        }
        let doRead = (state.state & kNeedReadable) !== 0;
        debug("need readable", doRead);
        if (state.length === 0 || state.length - n < state.highWaterMark) {
          doRead = true;
          debug("length less than watermark", doRead);
        }
        if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
          doRead = false;
          debug("reading, ended or constructing", doRead);
        } else if (doRead) {
          debug("do read");
          state.state |= kReading | kSync;
          if (state.length === 0)
            state.state |= kNeedReadable;
          try {
            this._read(state.highWaterMark);
          } catch (err) {
            errorOrDestroy(this, err);
          }
          state.state &= ~kSync;
          if (!state.reading)
            n = howMuchToRead(nOrig, state);
        }
        let ret;
        if (n > 0)
          ret = fromList(n, state);
        else
          ret = null;
        if (ret === null) {
          state.needReadable = state.length <= state.highWaterMark;
          n = 0;
        } else {
          state.length -= n;
          if (state.multiAwaitDrain) {
            state.awaitDrainWriters.clear();
          } else {
            state.awaitDrainWriters = null;
          }
        }
        if (state.length === 0) {
          if (!state.ended)
            state.needReadable = true;
          if (nOrig !== n && state.ended)
            endReadable(this);
        }
        if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
          state.dataEmitted = true;
          this.emit("data", ret);
        }
        return ret;
      };
      function onEofChunk(stream, state) {
        debug("onEofChunk");
        if (state.ended)
          return;
        if (state.decoder) {
          const chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;
        if (state.sync) {
          emitReadable(stream);
        } else {
          state.needReadable = false;
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
      function emitReadable(stream) {
        const state = stream._readableState;
        debug("emitReadable", state.needReadable, state.emittedReadable);
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug("emitReadable", state.flowing);
          state.emittedReadable = true;
          process.nextTick(emitReadable_, stream);
        }
      }
      function emitReadable_(stream) {
        const state = stream._readableState;
        debug("emitReadable_", state.destroyed, state.length, state.ended);
        if (!state.destroyed && !state.errored && (state.length || state.ended)) {
          stream.emit("readable");
          state.emittedReadable = false;
        }
        state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
        flow(stream);
      }
      function maybeReadMore(stream, state) {
        if (!state.readingMore && state.constructed) {
          state.readingMore = true;
          process.nextTick(maybeReadMore_, stream, state);
        }
      }
      function maybeReadMore_(stream, state) {
        while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
          const len = state.length;
          debug("maybeReadMore read 0");
          stream.read(0);
          if (len === state.length)
            break;
        }
        state.readingMore = false;
      }
      Readable2.prototype._read = function(n) {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
      };
      Readable2.prototype.pipe = function(dest, pipeOpts) {
        const src = this;
        const state = this._readableState;
        if (state.pipes.length === 1) {
          if (!state.multiAwaitDrain) {
            state.multiAwaitDrain = true;
            state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
          }
        }
        state.pipes.push(dest);
        debug("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
        const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
        const endFn = doEnd ? onend : unpipe;
        if (state.endEmitted)
          process.nextTick(endFn);
        else
          src.once("end", endFn);
        dest.on("unpipe", onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug("onunpipe");
          if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
              unpipeInfo.hasUnpiped = true;
              cleanup();
            }
          }
        }
        function onend() {
          debug("onend");
          dest.end();
        }
        let ondrain;
        let cleanedUp = false;
        function cleanup() {
          debug("cleanup");
          dest.removeListener("close", onclose);
          dest.removeListener("finish", onfinish);
          if (ondrain) {
            dest.removeListener("drain", ondrain);
          }
          dest.removeListener("error", onerror);
          dest.removeListener("unpipe", onunpipe);
          src.removeListener("end", onend);
          src.removeListener("end", unpipe);
          src.removeListener("data", ondata);
          cleanedUp = true;
          if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain))
            ondrain();
        }
        function pause() {
          if (!cleanedUp) {
            if (state.pipes.length === 1 && state.pipes[0] === dest) {
              debug("false write response, pause", 0);
              state.awaitDrainWriters = dest;
              state.multiAwaitDrain = false;
            } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
              debug("false write response, pause", state.awaitDrainWriters.size);
              state.awaitDrainWriters.add(dest);
            }
            src.pause();
          }
          if (!ondrain) {
            ondrain = pipeOnDrain(src, dest);
            dest.on("drain", ondrain);
          }
        }
        src.on("data", ondata);
        function ondata(chunk) {
          debug("ondata");
          const ret = dest.write(chunk);
          debug("dest.write", ret);
          if (ret === false) {
            pause();
          }
        }
        function onerror(er) {
          debug("onerror", er);
          unpipe();
          dest.removeListener("error", onerror);
          if (dest.listenerCount("error") === 0) {
            const s = dest._writableState || dest._readableState;
            if (s && !s.errorEmitted) {
              errorOrDestroy(dest, er);
            } else {
              dest.emit("error", er);
            }
          }
        }
        prependListener(dest, "error", onerror);
        function onclose() {
          dest.removeListener("finish", onfinish);
          unpipe();
        }
        dest.once("close", onclose);
        function onfinish() {
          debug("onfinish");
          dest.removeListener("close", onclose);
          unpipe();
        }
        dest.once("finish", onfinish);
        function unpipe() {
          debug("unpipe");
          src.unpipe(dest);
        }
        dest.emit("pipe", src);
        if (dest.writableNeedDrain === true) {
          pause();
        } else if (!state.flowing) {
          debug("pipe resume");
          src.resume();
        }
        return dest;
      };
      function pipeOnDrain(src, dest) {
        return function pipeOnDrainFunctionResult() {
          const state = src._readableState;
          if (state.awaitDrainWriters === dest) {
            debug("pipeOnDrain", 1);
            state.awaitDrainWriters = null;
          } else if (state.multiAwaitDrain) {
            debug("pipeOnDrain", state.awaitDrainWriters.size);
            state.awaitDrainWriters.delete(dest);
          }
          if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount("data")) {
            src.resume();
          }
        };
      }
      Readable2.prototype.unpipe = function(dest) {
        const state = this._readableState;
        const unpipeInfo = {
          hasUnpiped: false
        };
        if (state.pipes.length === 0)
          return this;
        if (!dest) {
          const dests = state.pipes;
          state.pipes = [];
          this.pause();
          for (let i = 0; i < dests.length; i++)
            dests[i].emit("unpipe", this, {
              hasUnpiped: false
            });
          return this;
        }
        const index = ArrayPrototypeIndexOf(state.pipes, dest);
        if (index === -1)
          return this;
        state.pipes.splice(index, 1);
        if (state.pipes.length === 0)
          this.pause();
        dest.emit("unpipe", this, unpipeInfo);
        return this;
      };
      Readable2.prototype.on = function(ev, fn) {
        const res = Stream.prototype.on.call(this, ev, fn);
        const state = this._readableState;
        if (ev === "data") {
          state.readableListening = this.listenerCount("readable") > 0;
          if (state.flowing !== false)
            this.resume();
        } else if (ev === "readable") {
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.flowing = false;
            state.emittedReadable = false;
            debug("on readable", state.length, state.reading);
            if (state.length) {
              emitReadable(this);
            } else if (!state.reading) {
              process.nextTick(nReadingNextTick, this);
            }
          }
        }
        return res;
      };
      Readable2.prototype.addListener = Readable2.prototype.on;
      Readable2.prototype.removeListener = function(ev, fn) {
        const res = Stream.prototype.removeListener.call(this, ev, fn);
        if (ev === "readable") {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      Readable2.prototype.off = Readable2.prototype.removeListener;
      Readable2.prototype.removeAllListeners = function(ev) {
        const res = Stream.prototype.removeAllListeners.apply(this, arguments);
        if (ev === "readable" || ev === void 0) {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      function updateReadableListening(self2) {
        const state = self2._readableState;
        state.readableListening = self2.listenerCount("readable") > 0;
        if (state.resumeScheduled && state[kPaused] === false) {
          state.flowing = true;
        } else if (self2.listenerCount("data") > 0) {
          self2.resume();
        } else if (!state.readableListening) {
          state.flowing = null;
        }
      }
      function nReadingNextTick(self2) {
        debug("readable nexttick read 0");
        self2.read(0);
      }
      Readable2.prototype.resume = function() {
        const state = this._readableState;
        if (!state.flowing) {
          debug("resume");
          state.flowing = !state.readableListening;
          resume(this, state);
        }
        state[kPaused] = false;
        return this;
      };
      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          process.nextTick(resume_, stream, state);
        }
      }
      function resume_(stream, state) {
        debug("resume", state.reading);
        if (!state.reading) {
          stream.read(0);
        }
        state.resumeScheduled = false;
        stream.emit("resume");
        flow(stream);
        if (state.flowing && !state.reading)
          stream.read(0);
      }
      Readable2.prototype.pause = function() {
        debug("call pause flowing=%j", this._readableState.flowing);
        if (this._readableState.flowing !== false) {
          debug("pause");
          this._readableState.flowing = false;
          this.emit("pause");
        }
        this._readableState[kPaused] = true;
        return this;
      };
      function flow(stream) {
        const state = stream._readableState;
        debug("flow", state.flowing);
        while (state.flowing && stream.read() !== null)
          ;
      }
      Readable2.prototype.wrap = function(stream) {
        let paused = false;
        stream.on("data", (chunk) => {
          if (!this.push(chunk) && stream.pause) {
            paused = true;
            stream.pause();
          }
        });
        stream.on("end", () => {
          this.push(null);
        });
        stream.on("error", (err) => {
          errorOrDestroy(this, err);
        });
        stream.on("close", () => {
          this.destroy();
        });
        stream.on("destroy", () => {
          this.destroy();
        });
        this._read = () => {
          if (paused && stream.resume) {
            paused = false;
            stream.resume();
          }
        };
        const streamKeys = ObjectKeys(stream);
        for (let j = 1; j < streamKeys.length; j++) {
          const i = streamKeys[j];
          if (this[i] === void 0 && typeof stream[i] === "function") {
            this[i] = stream[i].bind(stream);
          }
        }
        return this;
      };
      Readable2.prototype[SymbolAsyncIterator] = function() {
        return streamToAsyncIterator(this);
      };
      Readable2.prototype.iterator = function(options) {
        if (options !== void 0) {
          validateObject(options, "options");
        }
        return streamToAsyncIterator(this, options);
      };
      function streamToAsyncIterator(stream, options) {
        if (typeof stream.read !== "function") {
          stream = Readable2.wrap(stream, {
            objectMode: true
          });
        }
        const iter = createAsyncIterator(stream, options);
        iter.stream = stream;
        return iter;
      }
      async function* createAsyncIterator(stream, options) {
        let callback = nop;
        function next(resolve) {
          if (this === stream) {
            callback();
            callback = nop;
          } else {
            callback = resolve;
          }
        }
        stream.on("readable", next);
        let error4;
        const cleanup = eos(
          stream,
          {
            writable: false
          },
          (err) => {
            error4 = err ? aggregateTwoErrors(error4, err) : null;
            callback();
            callback = nop;
          }
        );
        try {
          while (true) {
            const chunk = stream.destroyed ? null : stream.read();
            if (chunk !== null) {
              yield chunk;
            } else if (error4) {
              throw error4;
            } else if (error4 === null) {
              return;
            } else {
              await new Promise2(next);
            }
          }
        } catch (err) {
          error4 = aggregateTwoErrors(error4, err);
          throw error4;
        } finally {
          if ((error4 || (options === null || options === void 0 ? void 0 : options.destroyOnReturn) !== false) && (error4 === void 0 || stream._readableState.autoDestroy)) {
            destroyImpl.destroyer(stream, null);
          } else {
            stream.off("readable", next);
            cleanup();
          }
        }
      }
      ObjectDefineProperties(Readable2.prototype, {
        readable: {
          __proto__: null,
          get() {
            const r = this._readableState;
            return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
          },
          set(val) {
            if (this._readableState) {
              this._readableState.readable = !!val;
            }
          }
        },
        readableDidRead: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return this._readableState.dataEmitted;
          }
        },
        readableAborted: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
          }
        },
        readableHighWaterMark: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return this._readableState.highWaterMark;
          }
        },
        readableBuffer: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return this._readableState && this._readableState.buffer;
          }
        },
        readableFlowing: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return this._readableState.flowing;
          },
          set: function(state) {
            if (this._readableState) {
              this._readableState.flowing = state;
            }
          }
        },
        readableLength: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState.length;
          }
        },
        readableObjectMode: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState ? this._readableState.objectMode : false;
          }
        },
        readableEncoding: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState ? this._readableState.encoding : null;
          }
        },
        errored: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState ? this._readableState.errored : null;
          }
        },
        closed: {
          __proto__: null,
          get() {
            return this._readableState ? this._readableState.closed : false;
          }
        },
        destroyed: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState ? this._readableState.destroyed : false;
          },
          set(value) {
            if (!this._readableState) {
              return;
            }
            this._readableState.destroyed = value;
          }
        },
        readableEnded: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._readableState ? this._readableState.endEmitted : false;
          }
        }
      });
      ObjectDefineProperties(ReadableState.prototype, {
        // Legacy getter for `pipesCount`.
        pipesCount: {
          __proto__: null,
          get() {
            return this.pipes.length;
          }
        },
        // Legacy property for `paused`.
        paused: {
          __proto__: null,
          get() {
            return this[kPaused] !== false;
          },
          set(value) {
            this[kPaused] = !!value;
          }
        }
      });
      Readable2._fromList = fromList;
      function fromList(n, state) {
        if (state.length === 0)
          return null;
        let ret;
        if (state.objectMode)
          ret = state.buffer.shift();
        else if (!n || n >= state.length) {
          if (state.decoder)
            ret = state.buffer.join("");
          else if (state.buffer.length === 1)
            ret = state.buffer.first();
          else
            ret = state.buffer.concat(state.length);
          state.buffer.clear();
        } else {
          ret = state.buffer.consume(n, state.decoder);
        }
        return ret;
      }
      function endReadable(stream) {
        const state = stream._readableState;
        debug("endReadable", state.endEmitted);
        if (!state.endEmitted) {
          state.ended = true;
          process.nextTick(endReadableNT, state, stream);
        }
      }
      function endReadableNT(state, stream) {
        debug("endReadableNT", state.endEmitted, state.length);
        if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
          state.endEmitted = true;
          stream.emit("end");
          if (stream.writable && stream.allowHalfOpen === false) {
            process.nextTick(endWritableNT, stream);
          } else if (state.autoDestroy) {
            const wState = stream._writableState;
            const autoDestroy = !wState || wState.autoDestroy && // We don't expect the writable to ever 'finish'
            // if writable is explicitly set to false.
            (wState.finished || wState.writable === false);
            if (autoDestroy) {
              stream.destroy();
            }
          }
        }
      }
      function endWritableNT(stream) {
        const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
        if (writable) {
          stream.end();
        }
      }
      Readable2.from = function(iterable, opts) {
        return from(Readable2, iterable, opts);
      };
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0)
          webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      Readable2.fromWeb = function(readableStream, options) {
        return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
      };
      Readable2.toWeb = function(streamReadable, options) {
        return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
      };
      Readable2.wrap = function(src, options) {
        var _ref, _src$readableObjectMo;
        return new Readable2({
          objectMode: (_ref = (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== void 0 ? _src$readableObjectMo : src.objectMode) !== null && _ref !== void 0 ? _ref : true,
          ...options,
          destroy(err, callback) {
            destroyImpl.destroyer(src, err);
            callback(err);
          }
        }).wrap(src);
      };
    }
  });
  var require_writable = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/writable.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var {
        ArrayPrototypeSlice,
        Error: Error2,
        FunctionPrototypeSymbolHasInstance,
        ObjectDefineProperty,
        ObjectDefineProperties,
        ObjectSetPrototypeOf,
        StringPrototypeToLowerCase,
        Symbol: Symbol2,
        SymbolHasInstance
      } = require_primordials();
      module.exports = Writable;
      Writable.WritableState = WritableState;
      var { EventEmitter: EE } = require_events();
      var Stream = require_legacy().Stream;
      var { Buffer: Buffer3 } = require_buffer();
      var destroyImpl = require_destroy();
      var { addAbortSignal } = require_add_abort_signal();
      var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
      var {
        ERR_INVALID_ARG_TYPE,
        ERR_METHOD_NOT_IMPLEMENTED,
        ERR_MULTIPLE_CALLBACK,
        ERR_STREAM_CANNOT_PIPE,
        ERR_STREAM_DESTROYED,
        ERR_STREAM_ALREADY_FINISHED,
        ERR_STREAM_NULL_VALUES,
        ERR_STREAM_WRITE_AFTER_END,
        ERR_UNKNOWN_ENCODING
      } = require_errors().codes;
      var { errorOrDestroy } = destroyImpl;
      ObjectSetPrototypeOf(Writable.prototype, Stream.prototype);
      ObjectSetPrototypeOf(Writable, Stream);
      function nop() {
      }
      var kOnFinished = Symbol2("kOnFinished");
      function WritableState(options, stream, isDuplex) {
        if (typeof isDuplex !== "boolean")
          isDuplex = stream instanceof require_duplex();
        this.objectMode = !!(options && options.objectMode);
        if (isDuplex)
          this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
        this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
        this.finalCalled = false;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        const noDecode = !!(options && options.decodeStrings === false);
        this.decodeStrings = !noDecode;
        this.defaultEncoding = options && options.defaultEncoding || "utf8";
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.onwrite = onwrite.bind(void 0, stream);
        this.writecb = null;
        this.writelen = 0;
        this.afterWriteTickInfo = null;
        resetBuffer(this);
        this.pendingcb = 0;
        this.constructed = true;
        this.prefinished = false;
        this.errorEmitted = false;
        this.emitClose = !options || options.emitClose !== false;
        this.autoDestroy = !options || options.autoDestroy !== false;
        this.errored = null;
        this.closed = false;
        this.closeEmitted = false;
        this[kOnFinished] = [];
      }
      function resetBuffer(state) {
        state.buffered = [];
        state.bufferedIndex = 0;
        state.allBuffers = true;
        state.allNoop = true;
      }
      WritableState.prototype.getBuffer = function getBuffer() {
        return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
      };
      ObjectDefineProperty(WritableState.prototype, "bufferedRequestCount", {
        __proto__: null,
        get() {
          return this.buffered.length - this.bufferedIndex;
        }
      });
      function Writable(options) {
        const isDuplex = this instanceof require_duplex();
        if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable, this))
          return new Writable(options);
        this._writableState = new WritableState(options, this, isDuplex);
        if (options) {
          if (typeof options.write === "function")
            this._write = options.write;
          if (typeof options.writev === "function")
            this._writev = options.writev;
          if (typeof options.destroy === "function")
            this._destroy = options.destroy;
          if (typeof options.final === "function")
            this._final = options.final;
          if (typeof options.construct === "function")
            this._construct = options.construct;
          if (options.signal)
            addAbortSignal(options.signal, this);
        }
        Stream.call(this, options);
        destroyImpl.construct(this, () => {
          const state = this._writableState;
          if (!state.writing) {
            clearBuffer(this, state);
          }
          finishMaybe(this, state);
        });
      }
      ObjectDefineProperty(Writable, SymbolHasInstance, {
        __proto__: null,
        value: function(object) {
          if (FunctionPrototypeSymbolHasInstance(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
      Writable.prototype.pipe = function() {
        errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
      };
      function _write(stream, chunk, encoding, cb) {
        const state = stream._writableState;
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = state.defaultEncoding;
        } else {
          if (!encoding)
            encoding = state.defaultEncoding;
          else if (encoding !== "buffer" && !Buffer3.isEncoding(encoding))
            throw new ERR_UNKNOWN_ENCODING(encoding);
          if (typeof cb !== "function")
            cb = nop;
        }
        if (chunk === null) {
          throw new ERR_STREAM_NULL_VALUES();
        } else if (!state.objectMode) {
          if (typeof chunk === "string") {
            if (state.decodeStrings !== false) {
              chunk = Buffer3.from(chunk, encoding);
              encoding = "buffer";
            }
          } else if (chunk instanceof Buffer3) {
            encoding = "buffer";
          } else if (Stream._isUint8Array(chunk)) {
            chunk = Stream._uint8ArrayToBuffer(chunk);
            encoding = "buffer";
          } else {
            throw new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
          }
        }
        let err;
        if (state.ending) {
          err = new ERR_STREAM_WRITE_AFTER_END();
        } else if (state.destroyed) {
          err = new ERR_STREAM_DESTROYED("write");
        }
        if (err) {
          process.nextTick(cb, err);
          errorOrDestroy(stream, err, true);
          return err;
        }
        state.pendingcb++;
        return writeOrBuffer(stream, state, chunk, encoding, cb);
      }
      Writable.prototype.write = function(chunk, encoding, cb) {
        return _write(this, chunk, encoding, cb) === true;
      };
      Writable.prototype.cork = function() {
        this._writableState.corked++;
      };
      Writable.prototype.uncork = function() {
        const state = this._writableState;
        if (state.corked) {
          state.corked--;
          if (!state.writing)
            clearBuffer(this, state);
        }
      };
      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
        if (typeof encoding === "string")
          encoding = StringPrototypeToLowerCase(encoding);
        if (!Buffer3.isEncoding(encoding))
          throw new ERR_UNKNOWN_ENCODING(encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      };
      function writeOrBuffer(stream, state, chunk, encoding, callback) {
        const len = state.objectMode ? 1 : chunk.length;
        state.length += len;
        const ret = state.length < state.highWaterMark;
        if (!ret)
          state.needDrain = true;
        if (state.writing || state.corked || state.errored || !state.constructed) {
          state.buffered.push({
            chunk,
            encoding,
            callback
          });
          if (state.allBuffers && encoding !== "buffer") {
            state.allBuffers = false;
          }
          if (state.allNoop && callback !== nop) {
            state.allNoop = false;
          }
        } else {
          state.writelen = len;
          state.writecb = callback;
          state.writing = true;
          state.sync = true;
          stream._write(chunk, encoding, state.onwrite);
          state.sync = false;
        }
        return ret && !state.errored && !state.destroyed;
      }
      function doWrite(stream, state, writev, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        if (state.destroyed)
          state.onwrite(new ERR_STREAM_DESTROYED("write"));
        else if (writev)
          stream._writev(chunk, state.onwrite);
        else
          stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      function onwriteError(stream, state, er, cb) {
        --state.pendingcb;
        cb(er);
        errorBuffer(state);
        errorOrDestroy(stream, er);
      }
      function onwrite(stream, er) {
        const state = stream._writableState;
        const sync = state.sync;
        const cb = state.writecb;
        if (typeof cb !== "function") {
          errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK());
          return;
        }
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
        if (er) {
          er.stack;
          if (!state.errored) {
            state.errored = er;
          }
          if (stream._readableState && !stream._readableState.errored) {
            stream._readableState.errored = er;
          }
          if (sync) {
            process.nextTick(onwriteError, stream, state, er, cb);
          } else {
            onwriteError(stream, state, er, cb);
          }
        } else {
          if (state.buffered.length > state.bufferedIndex) {
            clearBuffer(stream, state);
          }
          if (sync) {
            if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
              state.afterWriteTickInfo.count++;
            } else {
              state.afterWriteTickInfo = {
                count: 1,
                cb,
                stream,
                state
              };
              process.nextTick(afterWriteTick, state.afterWriteTickInfo);
            }
          } else {
            afterWrite(stream, state, 1, cb);
          }
        }
      }
      function afterWriteTick({ stream, state, count, cb }) {
        state.afterWriteTickInfo = null;
        return afterWrite(stream, state, count, cb);
      }
      function afterWrite(stream, state, count, cb) {
        const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
        if (needDrain) {
          state.needDrain = false;
          stream.emit("drain");
        }
        while (count-- > 0) {
          state.pendingcb--;
          cb();
        }
        if (state.destroyed) {
          errorBuffer(state);
        }
        finishMaybe(stream, state);
      }
      function errorBuffer(state) {
        if (state.writing) {
          return;
        }
        for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
          var _state$errored;
          const { chunk, callback } = state.buffered[n];
          const len = state.objectMode ? 1 : chunk.length;
          state.length -= len;
          callback(
            (_state$errored = state.errored) !== null && _state$errored !== void 0 ? _state$errored : new ERR_STREAM_DESTROYED("write")
          );
        }
        const onfinishCallbacks = state[kOnFinished].splice(0);
        for (let i = 0; i < onfinishCallbacks.length; i++) {
          var _state$errored2;
          onfinishCallbacks[i](
            (_state$errored2 = state.errored) !== null && _state$errored2 !== void 0 ? _state$errored2 : new ERR_STREAM_DESTROYED("end")
          );
        }
        resetBuffer(state);
      }
      function clearBuffer(stream, state) {
        if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
          return;
        }
        const { buffered, bufferedIndex, objectMode } = state;
        const bufferedLength = buffered.length - bufferedIndex;
        if (!bufferedLength) {
          return;
        }
        let i = bufferedIndex;
        state.bufferProcessing = true;
        if (bufferedLength > 1 && stream._writev) {
          state.pendingcb -= bufferedLength - 1;
          const callback = state.allNoop ? nop : (err) => {
            for (let n = i; n < buffered.length; ++n) {
              buffered[n].callback(err);
            }
          };
          const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
          chunks.allBuffers = state.allBuffers;
          doWrite(stream, state, true, state.length, chunks, "", callback);
          resetBuffer(state);
        } else {
          do {
            const { chunk, encoding, callback } = buffered[i];
            buffered[i++] = null;
            const len = objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, callback);
          } while (i < buffered.length && !state.writing);
          if (i === buffered.length) {
            resetBuffer(state);
          } else if (i > 256) {
            buffered.splice(0, i);
            state.bufferedIndex = 0;
          } else {
            state.bufferedIndex = i;
          }
        }
        state.bufferProcessing = false;
      }
      Writable.prototype._write = function(chunk, encoding, cb) {
        if (this._writev) {
          this._writev(
            [
              {
                chunk,
                encoding
              }
            ],
            cb
          );
        } else {
          throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
        }
      };
      Writable.prototype._writev = null;
      Writable.prototype.end = function(chunk, encoding, cb) {
        const state = this._writableState;
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if (typeof encoding === "function") {
          cb = encoding;
          encoding = null;
        }
        let err;
        if (chunk !== null && chunk !== void 0) {
          const ret = _write(this, chunk, encoding);
          if (ret instanceof Error2) {
            err = ret;
          }
        }
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }
        if (err) {
        } else if (!state.errored && !state.ending) {
          state.ending = true;
          finishMaybe(this, state, true);
          state.ended = true;
        } else if (state.finished) {
          err = new ERR_STREAM_ALREADY_FINISHED("end");
        } else if (state.destroyed) {
          err = new ERR_STREAM_DESTROYED("end");
        }
        if (typeof cb === "function") {
          if (err || state.finished) {
            process.nextTick(cb, err);
          } else {
            state[kOnFinished].push(cb);
          }
        }
        return this;
      };
      function needFinish(state) {
        return state.ending && !state.destroyed && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
      }
      function callFinal(stream, state) {
        let called = false;
        function onFinish(err) {
          if (called) {
            errorOrDestroy(stream, err !== null && err !== void 0 ? err : ERR_MULTIPLE_CALLBACK());
            return;
          }
          called = true;
          state.pendingcb--;
          if (err) {
            const onfinishCallbacks = state[kOnFinished].splice(0);
            for (let i = 0; i < onfinishCallbacks.length; i++) {
              onfinishCallbacks[i](err);
            }
            errorOrDestroy(stream, err, state.sync);
          } else if (needFinish(state)) {
            state.prefinished = true;
            stream.emit("prefinish");
            state.pendingcb++;
            process.nextTick(finish, stream, state);
          }
        }
        state.sync = true;
        state.pendingcb++;
        try {
          stream._final(onFinish);
        } catch (err) {
          onFinish(err);
        }
        state.sync = false;
      }
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) {
          if (typeof stream._final === "function" && !state.destroyed) {
            state.finalCalled = true;
            callFinal(stream, state);
          } else {
            state.prefinished = true;
            stream.emit("prefinish");
          }
        }
      }
      function finishMaybe(stream, state, sync) {
        if (needFinish(state)) {
          prefinish(stream, state);
          if (state.pendingcb === 0) {
            if (sync) {
              state.pendingcb++;
              process.nextTick(
                (stream2, state2) => {
                  if (needFinish(state2)) {
                    finish(stream2, state2);
                  } else {
                    state2.pendingcb--;
                  }
                },
                stream,
                state
              );
            } else if (needFinish(state)) {
              state.pendingcb++;
              finish(stream, state);
            }
          }
        }
      }
      function finish(stream, state) {
        state.pendingcb--;
        state.finished = true;
        const onfinishCallbacks = state[kOnFinished].splice(0);
        for (let i = 0; i < onfinishCallbacks.length; i++) {
          onfinishCallbacks[i]();
        }
        stream.emit("finish");
        if (state.autoDestroy) {
          const rState = stream._readableState;
          const autoDestroy = !rState || rState.autoDestroy && // We don't expect the readable to ever 'end'
          // if readable is explicitly set to false.
          (rState.endEmitted || rState.readable === false);
          if (autoDestroy) {
            stream.destroy();
          }
        }
      }
      ObjectDefineProperties(Writable.prototype, {
        closed: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.closed : false;
          }
        },
        destroyed: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.destroyed : false;
          },
          set(value) {
            if (this._writableState) {
              this._writableState.destroyed = value;
            }
          }
        },
        writable: {
          __proto__: null,
          get() {
            const w = this._writableState;
            return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
          },
          set(val) {
            if (this._writableState) {
              this._writableState.writable = !!val;
            }
          }
        },
        writableFinished: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.finished : false;
          }
        },
        writableObjectMode: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.objectMode : false;
          }
        },
        writableBuffer: {
          __proto__: null,
          get() {
            return this._writableState && this._writableState.getBuffer();
          }
        },
        writableEnded: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.ending : false;
          }
        },
        writableNeedDrain: {
          __proto__: null,
          get() {
            const wState = this._writableState;
            if (!wState)
              return false;
            return !wState.destroyed && !wState.ending && wState.needDrain;
          }
        },
        writableHighWaterMark: {
          __proto__: null,
          get() {
            return this._writableState && this._writableState.highWaterMark;
          }
        },
        writableCorked: {
          __proto__: null,
          get() {
            return this._writableState ? this._writableState.corked : 0;
          }
        },
        writableLength: {
          __proto__: null,
          get() {
            return this._writableState && this._writableState.length;
          }
        },
        errored: {
          __proto__: null,
          enumerable: false,
          get() {
            return this._writableState ? this._writableState.errored : null;
          }
        },
        writableAborted: {
          __proto__: null,
          enumerable: false,
          get: function() {
            return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
          }
        }
      });
      var destroy = destroyImpl.destroy;
      Writable.prototype.destroy = function(err, cb) {
        const state = this._writableState;
        if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
          process.nextTick(errorBuffer, state);
        }
        destroy.call(this, err, cb);
        return this;
      };
      Writable.prototype._undestroy = destroyImpl.undestroy;
      Writable.prototype._destroy = function(err, cb) {
        cb(err);
      };
      Writable.prototype[EE.captureRejectionSymbol] = function(err) {
        this.destroy(err);
      };
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0)
          webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      Writable.fromWeb = function(writableStream, options) {
        return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
      };
      Writable.toWeb = function(streamWritable) {
        return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
      };
    }
  });
  var require_duplexify = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/duplexify.js"(exports, module) {
      var process = require_browser2();
      var bufferModule = require_buffer();
      var {
        isReadable,
        isWritable,
        isIterable,
        isNodeStream,
        isReadableNodeStream,
        isWritableNodeStream,
        isDuplexNodeStream,
        isReadableStream,
        isWritableStream
      } = require_utils();
      var eos = require_end_of_stream();
      var {
        AbortError,
        codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
      } = require_errors();
      var { destroyer } = require_destroy();
      var Duplex = require_duplex();
      var Readable2 = require_readable();
      var Writable = require_writable();
      var { createDeferredPromise } = require_util();
      var from = require_from();
      var Blob2 = globalThis.Blob || bufferModule.Blob;
      var isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
        return b instanceof Blob2;
      } : function isBlob2(b) {
        return false;
      };
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var { FunctionPrototypeCall } = require_primordials();
      var Duplexify = class extends Duplex {
        constructor(options) {
          super(options);
          if ((options === null || options === void 0 ? void 0 : options.readable) === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
          }
          if ((options === null || options === void 0 ? void 0 : options.writable) === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
          }
        }
      };
      module.exports = function duplexify(body, name) {
        if (isDuplexNodeStream(body)) {
          return body;
        }
        if (isReadableNodeStream(body)) {
          return _duplexify({
            readable: body
          });
        }
        if (isWritableNodeStream(body)) {
          return _duplexify({
            writable: body
          });
        }
        if (isNodeStream(body)) {
          return _duplexify({
            writable: false,
            readable: false
          });
        }
        if (isReadableStream(body)) {
          return _duplexify({
            readable: Readable2.fromWeb(body)
          });
        }
        if (isWritableStream(body)) {
          return _duplexify({
            writable: Writable.fromWeb(body)
          });
        }
        if (typeof body === "function") {
          const { value, write, final, destroy } = fromAsyncGen(body);
          if (isIterable(value)) {
            return from(Duplexify, value, {
              // TODO (ronag): highWaterMark?
              objectMode: true,
              write,
              final,
              destroy
            });
          }
          const then2 = value === null || value === void 0 ? void 0 : value.then;
          if (typeof then2 === "function") {
            let d;
            const promise = FunctionPrototypeCall(
              then2,
              value,
              (val) => {
                if (val != null) {
                  throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
                }
              },
              (err) => {
                destroyer(d, err);
              }
            );
            return d = new Duplexify({
              // TODO (ronag): highWaterMark?
              objectMode: true,
              readable: false,
              write,
              final(cb) {
                final(async () => {
                  try {
                    await promise;
                    process.nextTick(cb, null);
                  } catch (err) {
                    process.nextTick(cb, err);
                  }
                });
              },
              destroy
            });
          }
          throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
        }
        if (isBlob(body)) {
          return duplexify(body.arrayBuffer());
        }
        if (isIterable(body)) {
          return from(Duplexify, body, {
            // TODO (ronag): highWaterMark?
            objectMode: true,
            writable: false
          });
        }
        if (isReadableStream(body === null || body === void 0 ? void 0 : body.readable) && isWritableStream(body === null || body === void 0 ? void 0 : body.writable)) {
          return Duplexify.fromWeb(body);
        }
        if (typeof (body === null || body === void 0 ? void 0 : body.writable) === "object" || typeof (body === null || body === void 0 ? void 0 : body.readable) === "object") {
          const readable = body !== null && body !== void 0 && body.readable ? isReadableNodeStream(body === null || body === void 0 ? void 0 : body.readable) ? body === null || body === void 0 ? void 0 : body.readable : duplexify(body.readable) : void 0;
          const writable = body !== null && body !== void 0 && body.writable ? isWritableNodeStream(body === null || body === void 0 ? void 0 : body.writable) ? body === null || body === void 0 ? void 0 : body.writable : duplexify(body.writable) : void 0;
          return _duplexify({
            readable,
            writable
          });
        }
        const then = body === null || body === void 0 ? void 0 : body.then;
        if (typeof then === "function") {
          let d;
          FunctionPrototypeCall(
            then,
            body,
            (val) => {
              if (val != null) {
                d.push(val);
              }
              d.push(null);
            },
            (err) => {
              destroyer(d, err);
            }
          );
          return d = new Duplexify({
            objectMode: true,
            writable: false,
            read() {
            }
          });
        }
        throw new ERR_INVALID_ARG_TYPE(
          name,
          [
            "Blob",
            "ReadableStream",
            "WritableStream",
            "Stream",
            "Iterable",
            "AsyncIterable",
            "Function",
            "{ readable, writable } pair",
            "Promise"
          ],
          body
        );
      };
      function fromAsyncGen(fn) {
        let { promise, resolve } = createDeferredPromise();
        const ac = new AbortController();
        const signal = ac.signal;
        const value = fn(
          async function* () {
            while (true) {
              const _promise = promise;
              promise = null;
              const { chunk, done, cb } = await _promise;
              process.nextTick(cb);
              if (done)
                return;
              if (signal.aborted)
                throw new AbortError(void 0, {
                  cause: signal.reason
                });
              ({ promise, resolve } = createDeferredPromise());
              yield chunk;
            }
          }(),
          {
            signal
          }
        );
        return {
          value,
          write(chunk, encoding, cb) {
            const _resolve = resolve;
            resolve = null;
            _resolve({
              chunk,
              done: false,
              cb
            });
          },
          final(cb) {
            const _resolve = resolve;
            resolve = null;
            _resolve({
              done: true,
              cb
            });
          },
          destroy(err, cb) {
            ac.abort();
            cb(err);
          }
        };
      }
      function _duplexify(pair) {
        const r = pair.readable && typeof pair.readable.read !== "function" ? Readable2.wrap(pair.readable) : pair.readable;
        const w = pair.writable;
        let readable = !!isReadable(r);
        let writable = !!isWritable(w);
        let ondrain;
        let onfinish;
        let onreadable;
        let onclose;
        let d;
        function onfinished(err) {
          const cb = onclose;
          onclose = null;
          if (cb) {
            cb(err);
          } else if (err) {
            d.destroy(err);
          }
        }
        d = new Duplexify({
          // TODO (ronag): highWaterMark?
          readableObjectMode: !!(r !== null && r !== void 0 && r.readableObjectMode),
          writableObjectMode: !!(w !== null && w !== void 0 && w.writableObjectMode),
          readable,
          writable
        });
        if (writable) {
          eos(w, (err) => {
            writable = false;
            if (err) {
              destroyer(r, err);
            }
            onfinished(err);
          });
          d._write = function(chunk, encoding, callback) {
            if (w.write(chunk, encoding)) {
              callback();
            } else {
              ondrain = callback;
            }
          };
          d._final = function(callback) {
            w.end();
            onfinish = callback;
          };
          w.on("drain", function() {
            if (ondrain) {
              const cb = ondrain;
              ondrain = null;
              cb();
            }
          });
          w.on("finish", function() {
            if (onfinish) {
              const cb = onfinish;
              onfinish = null;
              cb();
            }
          });
        }
        if (readable) {
          eos(r, (err) => {
            readable = false;
            if (err) {
              destroyer(r, err);
            }
            onfinished(err);
          });
          r.on("readable", function() {
            if (onreadable) {
              const cb = onreadable;
              onreadable = null;
              cb();
            }
          });
          r.on("end", function() {
            d.push(null);
          });
          d._read = function() {
            while (true) {
              const buf2 = r.read();
              if (buf2 === null) {
                onreadable = d._read;
                return;
              }
              if (!d.push(buf2)) {
                return;
              }
            }
          };
        }
        d._destroy = function(err, callback) {
          if (!err && onclose !== null) {
            err = new AbortError();
          }
          onreadable = null;
          ondrain = null;
          onfinish = null;
          if (onclose === null) {
            callback(err);
          } else {
            onclose = callback;
            destroyer(w, err);
            destroyer(r, err);
          }
        };
        return d;
      }
    }
  });
  var require_duplex = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/duplex.js"(exports, module) {
      "use strict";
      var {
        ObjectDefineProperties,
        ObjectGetOwnPropertyDescriptor,
        ObjectKeys,
        ObjectSetPrototypeOf
      } = require_primordials();
      module.exports = Duplex;
      var Readable2 = require_readable();
      var Writable = require_writable();
      ObjectSetPrototypeOf(Duplex.prototype, Readable2.prototype);
      ObjectSetPrototypeOf(Duplex, Readable2);
      {
        const keys = ObjectKeys(Writable.prototype);
        for (let i = 0; i < keys.length; i++) {
          const method = keys[i];
          if (!Duplex.prototype[method])
            Duplex.prototype[method] = Writable.prototype[method];
        }
      }
      function Duplex(options) {
        if (!(this instanceof Duplex))
          return new Duplex(options);
        Readable2.call(this, options);
        Writable.call(this, options);
        if (options) {
          this.allowHalfOpen = options.allowHalfOpen !== false;
          if (options.readable === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
          }
          if (options.writable === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
          }
        } else {
          this.allowHalfOpen = true;
        }
      }
      ObjectDefineProperties(Duplex.prototype, {
        writable: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writable")
        },
        writableHighWaterMark: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableHighWaterMark")
        },
        writableObjectMode: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableObjectMode")
        },
        writableBuffer: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableBuffer")
        },
        writableLength: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableLength")
        },
        writableFinished: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableFinished")
        },
        writableCorked: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableCorked")
        },
        writableEnded: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableEnded")
        },
        writableNeedDrain: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableNeedDrain")
        },
        destroyed: {
          __proto__: null,
          get() {
            if (this._readableState === void 0 || this._writableState === void 0) {
              return false;
            }
            return this._readableState.destroyed && this._writableState.destroyed;
          },
          set(value) {
            if (this._readableState && this._writableState) {
              this._readableState.destroyed = value;
              this._writableState.destroyed = value;
            }
          }
        }
      });
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0)
          webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      Duplex.fromWeb = function(pair, options) {
        return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
      };
      Duplex.toWeb = function(duplex) {
        return lazyWebStreams().newReadableWritablePairFromDuplex(duplex);
      };
      var duplexify;
      Duplex.from = function(body) {
        if (!duplexify) {
          duplexify = require_duplexify();
        }
        return duplexify(body, "body");
      };
    }
  });
  var require_transform = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/transform.js"(exports, module) {
      "use strict";
      var { ObjectSetPrototypeOf, Symbol: Symbol2 } = require_primordials();
      module.exports = Transform3;
      var { ERR_METHOD_NOT_IMPLEMENTED } = require_errors().codes;
      var Duplex = require_duplex();
      var { getHighWaterMark } = require_state();
      ObjectSetPrototypeOf(Transform3.prototype, Duplex.prototype);
      ObjectSetPrototypeOf(Transform3, Duplex);
      var kCallback = Symbol2("kCallback");
      function Transform3(options) {
        if (!(this instanceof Transform3))
          return new Transform3(options);
        const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
        if (readableHighWaterMark === 0) {
          options = {
            ...options,
            highWaterMark: null,
            readableHighWaterMark,
            // TODO (ronag): 0 is not optimal since we have
            // a "bug" where we check needDrain before calling _write and not after.
            // Refs: https://github.com/nodejs/node/pull/32887
            // Refs: https://github.com/nodejs/node/pull/35941
            writableHighWaterMark: options.writableHighWaterMark || 0
          };
        }
        Duplex.call(this, options);
        this._readableState.sync = false;
        this[kCallback] = null;
        if (options) {
          if (typeof options.transform === "function")
            this._transform = options.transform;
          if (typeof options.flush === "function")
            this._flush = options.flush;
        }
        this.on("prefinish", prefinish);
      }
      function final(cb) {
        if (typeof this._flush === "function" && !this.destroyed) {
          this._flush((er, data) => {
            if (er) {
              if (cb) {
                cb(er);
              } else {
                this.destroy(er);
              }
              return;
            }
            if (data != null) {
              this.push(data);
            }
            this.push(null);
            if (cb) {
              cb();
            }
          });
        } else {
          this.push(null);
          if (cb) {
            cb();
          }
        }
      }
      function prefinish() {
        if (this._final !== final) {
          final.call(this);
        }
      }
      Transform3.prototype._final = final;
      Transform3.prototype._transform = function(chunk, encoding, callback) {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
      };
      Transform3.prototype._write = function(chunk, encoding, callback) {
        const rState = this._readableState;
        const wState = this._writableState;
        const length = rState.length;
        this._transform(chunk, encoding, (err, val) => {
          if (err) {
            callback(err);
            return;
          }
          if (val != null) {
            this.push(val);
          }
          if (wState.ended || // Backwards compat.
          length === rState.length || // Backwards compat.
          rState.length < rState.highWaterMark) {
            callback();
          } else {
            this[kCallback] = callback;
          }
        });
      };
      Transform3.prototype._read = function() {
        if (this[kCallback]) {
          const callback = this[kCallback];
          this[kCallback] = null;
          callback();
        }
      };
    }
  });
  var require_passthrough = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/passthrough.js"(exports, module) {
      "use strict";
      var { ObjectSetPrototypeOf } = require_primordials();
      module.exports = PassThrough;
      var Transform3 = require_transform();
      ObjectSetPrototypeOf(PassThrough.prototype, Transform3.prototype);
      ObjectSetPrototypeOf(PassThrough, Transform3);
      function PassThrough(options) {
        if (!(this instanceof PassThrough))
          return new PassThrough(options);
        Transform3.call(this, options);
      }
      PassThrough.prototype._transform = function(chunk, encoding, cb) {
        cb(null, chunk);
      };
    }
  });
  var require_pipeline = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
      var process = require_browser2();
      var { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator, SymbolDispose } = require_primordials();
      var eos = require_end_of_stream();
      var { once } = require_util();
      var destroyImpl = require_destroy();
      var Duplex = require_duplex();
      var {
        aggregateTwoErrors,
        codes: {
          ERR_INVALID_ARG_TYPE,
          ERR_INVALID_RETURN_VALUE,
          ERR_MISSING_ARGS,
          ERR_STREAM_DESTROYED,
          ERR_STREAM_PREMATURE_CLOSE
        },
        AbortError
      } = require_errors();
      var { validateFunction, validateAbortSignal } = require_validators();
      var {
        isIterable,
        isReadable,
        isReadableNodeStream,
        isNodeStream,
        isTransformStream,
        isWebStream,
        isReadableStream,
        isReadableFinished
      } = require_utils();
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var PassThrough;
      var Readable2;
      var addAbortListener;
      function destroyer(stream, reading, writing) {
        let finished = false;
        stream.on("close", () => {
          finished = true;
        });
        const cleanup = eos(
          stream,
          {
            readable: reading,
            writable: writing
          },
          (err) => {
            finished = !err;
          }
        );
        return {
          destroy: (err) => {
            if (finished)
              return;
            finished = true;
            destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED("pipe"));
          },
          cleanup
        };
      }
      function popCallback(streams) {
        validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
        return streams.pop();
      }
      function makeAsyncIterable(val) {
        if (isIterable(val)) {
          return val;
        } else if (isReadableNodeStream(val)) {
          return fromReadable(val);
        }
        throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], val);
      }
      async function* fromReadable(val) {
        if (!Readable2) {
          Readable2 = require_readable();
        }
        yield* Readable2.prototype[SymbolAsyncIterator].call(val);
      }
      async function pumpToNode(iterable, writable, finish, { end }) {
        let error4;
        let onresolve = null;
        const resume = (err) => {
          if (err) {
            error4 = err;
          }
          if (onresolve) {
            const callback = onresolve;
            onresolve = null;
            callback();
          }
        };
        const wait = () => new Promise2((resolve, reject) => {
          if (error4) {
            reject(error4);
          } else {
            onresolve = () => {
              if (error4) {
                reject(error4);
              } else {
                resolve();
              }
            };
          }
        });
        writable.on("drain", resume);
        const cleanup = eos(
          writable,
          {
            readable: false
          },
          resume
        );
        try {
          if (writable.writableNeedDrain) {
            await wait();
          }
          for await (const chunk of iterable) {
            if (!writable.write(chunk)) {
              await wait();
            }
          }
          if (end) {
            writable.end();
            await wait();
          }
          finish();
        } catch (err) {
          finish(error4 !== err ? aggregateTwoErrors(error4, err) : err);
        } finally {
          cleanup();
          writable.off("drain", resume);
        }
      }
      async function pumpToWeb(readable, writable, finish, { end }) {
        if (isTransformStream(writable)) {
          writable = writable.writable;
        }
        const writer = writable.getWriter();
        try {
          for await (const chunk of readable) {
            await writer.ready;
            writer.write(chunk).catch(() => {
            });
          }
          await writer.ready;
          if (end) {
            await writer.close();
          }
          finish();
        } catch (err) {
          try {
            await writer.abort(err);
            finish(err);
          } catch (err2) {
            finish(err2);
          }
        }
      }
      function pipeline(...streams) {
        return pipelineImpl(streams, once(popCallback(streams)));
      }
      function pipelineImpl(streams, callback, opts) {
        if (streams.length === 1 && ArrayIsArray(streams[0])) {
          streams = streams[0];
        }
        if (streams.length < 2) {
          throw new ERR_MISSING_ARGS("streams");
        }
        const ac = new AbortController();
        const signal = ac.signal;
        const outerSignal = opts === null || opts === void 0 ? void 0 : opts.signal;
        const lastStreamCleanup = [];
        validateAbortSignal(outerSignal, "options.signal");
        function abort() {
          finishImpl(new AbortError());
        }
        addAbortListener = addAbortListener || require_util().addAbortListener;
        let disposable;
        if (outerSignal) {
          disposable = addAbortListener(outerSignal, abort);
        }
        let error4;
        let value;
        const destroys = [];
        let finishCount = 0;
        function finish(err) {
          finishImpl(err, --finishCount === 0);
        }
        function finishImpl(err, final) {
          var _disposable;
          if (err && (!error4 || error4.code === "ERR_STREAM_PREMATURE_CLOSE")) {
            error4 = err;
          }
          if (!error4 && !final) {
            return;
          }
          while (destroys.length) {
            destroys.shift()(error4);
          }
          ;
          (_disposable = disposable) === null || _disposable === void 0 ? void 0 : _disposable[SymbolDispose]();
          ac.abort();
          if (final) {
            if (!error4) {
              lastStreamCleanup.forEach((fn) => fn());
            }
            process.nextTick(callback, error4, value);
          }
        }
        let ret;
        for (let i = 0; i < streams.length; i++) {
          const stream = streams[i];
          const reading = i < streams.length - 1;
          const writing = i > 0;
          const end = reading || (opts === null || opts === void 0 ? void 0 : opts.end) !== false;
          const isLastStream = i === streams.length - 1;
          if (isNodeStream(stream)) {
            let onError2 = function(err) {
              if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                finish(err);
              }
            };
            var onError = onError2;
            if (end) {
              const { destroy, cleanup } = destroyer(stream, reading, writing);
              destroys.push(destroy);
              if (isReadable(stream) && isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            }
            stream.on("error", onError2);
            if (isReadable(stream) && isLastStream) {
              lastStreamCleanup.push(() => {
                stream.removeListener("error", onError2);
              });
            }
          }
          if (i === 0) {
            if (typeof stream === "function") {
              ret = stream({
                signal
              });
              if (!isIterable(ret)) {
                throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
              }
            } else if (isIterable(stream) || isReadableNodeStream(stream) || isTransformStream(stream)) {
              ret = stream;
            } else {
              ret = Duplex.from(stream);
            }
          } else if (typeof stream === "function") {
            if (isTransformStream(ret)) {
              var _ret;
              ret = makeAsyncIterable((_ret = ret) === null || _ret === void 0 ? void 0 : _ret.readable);
            } else {
              ret = makeAsyncIterable(ret);
            }
            ret = stream(ret, {
              signal
            });
            if (reading) {
              if (!isIterable(ret, true)) {
                throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
              }
            } else {
              var _ret2;
              if (!PassThrough) {
                PassThrough = require_passthrough();
              }
              const pt = new PassThrough({
                objectMode: true
              });
              const then = (_ret2 = ret) === null || _ret2 === void 0 ? void 0 : _ret2.then;
              if (typeof then === "function") {
                finishCount++;
                then.call(
                  ret,
                  (val) => {
                    value = val;
                    if (val != null) {
                      pt.write(val);
                    }
                    if (end) {
                      pt.end();
                    }
                    process.nextTick(finish);
                  },
                  (err) => {
                    pt.destroy(err);
                    process.nextTick(finish, err);
                  }
                );
              } else if (isIterable(ret, true)) {
                finishCount++;
                pumpToNode(ret, pt, finish, {
                  end
                });
              } else if (isReadableStream(ret) || isTransformStream(ret)) {
                const toRead = ret.readable || ret;
                finishCount++;
                pumpToNode(toRead, pt, finish, {
                  end
                });
              } else {
                throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
              }
              ret = pt;
              const { destroy, cleanup } = destroyer(ret, false, true);
              destroys.push(destroy);
              if (isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            }
          } else if (isNodeStream(stream)) {
            if (isReadableNodeStream(ret)) {
              finishCount += 2;
              const cleanup = pipe(ret, stream, finish, {
                end
              });
              if (isReadable(stream) && isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            } else if (isTransformStream(ret) || isReadableStream(ret)) {
              const toRead = ret.readable || ret;
              finishCount++;
              pumpToNode(toRead, stream, finish, {
                end
              });
            } else if (isIterable(ret)) {
              finishCount++;
              pumpToNode(ret, stream, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_ARG_TYPE(
                "val",
                ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
                ret
              );
            }
            ret = stream;
          } else if (isWebStream(stream)) {
            if (isReadableNodeStream(ret)) {
              finishCount++;
              pumpToWeb(makeAsyncIterable(ret), stream, finish, {
                end
              });
            } else if (isReadableStream(ret) || isIterable(ret)) {
              finishCount++;
              pumpToWeb(ret, stream, finish, {
                end
              });
            } else if (isTransformStream(ret)) {
              finishCount++;
              pumpToWeb(ret.readable, stream, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_ARG_TYPE(
                "val",
                ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
                ret
              );
            }
            ret = stream;
          } else {
            ret = Duplex.from(stream);
          }
        }
        if (signal !== null && signal !== void 0 && signal.aborted || outerSignal !== null && outerSignal !== void 0 && outerSignal.aborted) {
          process.nextTick(abort);
        }
        return ret;
      }
      function pipe(src, dst, finish, { end }) {
        let ended = false;
        dst.on("close", () => {
          if (!ended) {
            finish(new ERR_STREAM_PREMATURE_CLOSE());
          }
        });
        src.pipe(dst, {
          end: false
        });
        if (end) {
          let endFn2 = function() {
            ended = true;
            dst.end();
          };
          var endFn = endFn2;
          if (isReadableFinished(src)) {
            process.nextTick(endFn2);
          } else {
            src.once("end", endFn2);
          }
        } else {
          finish();
        }
        eos(
          src,
          {
            readable: true,
            writable: false
          },
          (err) => {
            const rState = src._readableState;
            if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
              src.once("end", finish).once("error", finish);
            } else {
              finish(err);
            }
          }
        );
        return eos(
          dst,
          {
            readable: false,
            writable: true
          },
          finish
        );
      }
      module.exports = {
        pipelineImpl,
        pipeline
      };
    }
  });
  var require_compose = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/compose.js"(exports, module) {
      "use strict";
      var { pipeline } = require_pipeline();
      var Duplex = require_duplex();
      var { destroyer } = require_destroy();
      var {
        isNodeStream,
        isReadable,
        isWritable,
        isWebStream,
        isTransformStream,
        isWritableStream,
        isReadableStream
      } = require_utils();
      var {
        AbortError,
        codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
      } = require_errors();
      var eos = require_end_of_stream();
      module.exports = function compose(...streams) {
        if (streams.length === 0) {
          throw new ERR_MISSING_ARGS("streams");
        }
        if (streams.length === 1) {
          return Duplex.from(streams[0]);
        }
        const orgStreams = [...streams];
        if (typeof streams[0] === "function") {
          streams[0] = Duplex.from(streams[0]);
        }
        if (typeof streams[streams.length - 1] === "function") {
          const idx = streams.length - 1;
          streams[idx] = Duplex.from(streams[idx]);
        }
        for (let n = 0; n < streams.length; ++n) {
          if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
            continue;
          }
          if (n < streams.length - 1 && !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
          }
          if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
          }
        }
        let ondrain;
        let onfinish;
        let onreadable;
        let onclose;
        let d;
        function onfinished(err) {
          const cb = onclose;
          onclose = null;
          if (cb) {
            cb(err);
          } else if (err) {
            d.destroy(err);
          } else if (!readable && !writable) {
            d.destroy();
          }
        }
        const head = streams[0];
        const tail = pipeline(streams, onfinished);
        const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
        const readable = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail));
        d = new Duplex({
          // TODO (ronag): highWaterMark?
          writableObjectMode: !!(head !== null && head !== void 0 && head.writableObjectMode),
          readableObjectMode: !!(tail !== null && tail !== void 0 && tail.readableObjectMode),
          writable,
          readable
        });
        if (writable) {
          if (isNodeStream(head)) {
            d._write = function(chunk, encoding, callback) {
              if (head.write(chunk, encoding)) {
                callback();
              } else {
                ondrain = callback;
              }
            };
            d._final = function(callback) {
              head.end();
              onfinish = callback;
            };
            head.on("drain", function() {
              if (ondrain) {
                const cb = ondrain;
                ondrain = null;
                cb();
              }
            });
          } else if (isWebStream(head)) {
            const writable2 = isTransformStream(head) ? head.writable : head;
            const writer = writable2.getWriter();
            d._write = async function(chunk, encoding, callback) {
              try {
                await writer.ready;
                writer.write(chunk).catch(() => {
                });
                callback();
              } catch (err) {
                callback(err);
              }
            };
            d._final = async function(callback) {
              try {
                await writer.ready;
                writer.close().catch(() => {
                });
                onfinish = callback;
              } catch (err) {
                callback(err);
              }
            };
          }
          const toRead = isTransformStream(tail) ? tail.readable : tail;
          eos(toRead, () => {
            if (onfinish) {
              const cb = onfinish;
              onfinish = null;
              cb();
            }
          });
        }
        if (readable) {
          if (isNodeStream(tail)) {
            tail.on("readable", function() {
              if (onreadable) {
                const cb = onreadable;
                onreadable = null;
                cb();
              }
            });
            tail.on("end", function() {
              d.push(null);
            });
            d._read = function() {
              while (true) {
                const buf2 = tail.read();
                if (buf2 === null) {
                  onreadable = d._read;
                  return;
                }
                if (!d.push(buf2)) {
                  return;
                }
              }
            };
          } else if (isWebStream(tail)) {
            const readable2 = isTransformStream(tail) ? tail.readable : tail;
            const reader = readable2.getReader();
            d._read = async function() {
              while (true) {
                try {
                  const { value, done } = await reader.read();
                  if (!d.push(value)) {
                    return;
                  }
                  if (done) {
                    d.push(null);
                    return;
                  }
                } catch {
                  return;
                }
              }
            };
          }
        }
        d._destroy = function(err, callback) {
          if (!err && onclose !== null) {
            err = new AbortError();
          }
          onreadable = null;
          ondrain = null;
          onfinish = null;
          if (onclose === null) {
            callback(err);
          } else {
            onclose = callback;
            if (isNodeStream(tail)) {
              destroyer(tail, err);
            }
          }
        };
        return d;
      };
    }
  });
  var require_operators = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/operators.js"(exports, module) {
      "use strict";
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var {
        codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
        AbortError
      } = require_errors();
      var { validateAbortSignal, validateInteger, validateObject } = require_validators();
      var kWeakHandler = require_primordials().Symbol("kWeak");
      var kResistStopPropagation = require_primordials().Symbol("kResistStopPropagation");
      var { finished } = require_end_of_stream();
      var staticCompose = require_compose();
      var { addAbortSignalNoValidate } = require_add_abort_signal();
      var { isWritable, isNodeStream } = require_utils();
      var { deprecate } = require_util();
      var {
        ArrayPrototypePush,
        Boolean: Boolean2,
        MathFloor,
        Number: Number2,
        NumberIsNaN,
        Promise: Promise2,
        PromiseReject,
        PromiseResolve,
        PromisePrototypeThen,
        Symbol: Symbol2
      } = require_primordials();
      var kEmpty = Symbol2("kEmpty");
      var kEof = Symbol2("kEof");
      function compose(stream, options) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        if (isNodeStream(stream) && !isWritable(stream)) {
          throw new ERR_INVALID_ARG_VALUE("stream", stream, "must be writable");
        }
        const composedStream = staticCompose(this, stream);
        if (options !== null && options !== void 0 && options.signal) {
          addAbortSignalNoValidate(options.signal, composedStream);
        }
        return composedStream;
      }
      function map(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
        }
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        let concurrency = 1;
        if ((options === null || options === void 0 ? void 0 : options.concurrency) != null) {
          concurrency = MathFloor(options.concurrency);
        }
        let highWaterMark = concurrency - 1;
        if ((options === null || options === void 0 ? void 0 : options.highWaterMark) != null) {
          highWaterMark = MathFloor(options.highWaterMark);
        }
        validateInteger(concurrency, "options.concurrency", 1);
        validateInteger(highWaterMark, "options.highWaterMark", 0);
        highWaterMark += concurrency;
        return async function* map2() {
          const signal = require_util().AbortSignalAny(
            [options === null || options === void 0 ? void 0 : options.signal].filter(Boolean2)
          );
          const stream = this;
          const queue = [];
          const signalOpt = {
            signal
          };
          let next;
          let resume;
          let done = false;
          let cnt = 0;
          function onCatch() {
            done = true;
            afterItemProcessed();
          }
          function afterItemProcessed() {
            cnt -= 1;
            maybeResume();
          }
          function maybeResume() {
            if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
              resume();
              resume = null;
            }
          }
          async function pump() {
            try {
              for await (let val of stream) {
                if (done) {
                  return;
                }
                if (signal.aborted) {
                  throw new AbortError();
                }
                try {
                  val = fn(val, signalOpt);
                  if (val === kEmpty) {
                    continue;
                  }
                  val = PromiseResolve(val);
                } catch (err) {
                  val = PromiseReject(err);
                }
                cnt += 1;
                PromisePrototypeThen(val, afterItemProcessed, onCatch);
                queue.push(val);
                if (next) {
                  next();
                  next = null;
                }
                if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
                  await new Promise2((resolve) => {
                    resume = resolve;
                  });
                }
              }
              queue.push(kEof);
            } catch (err) {
              const val = PromiseReject(err);
              PromisePrototypeThen(val, afterItemProcessed, onCatch);
              queue.push(val);
            } finally {
              done = true;
              if (next) {
                next();
                next = null;
              }
            }
          }
          pump();
          try {
            while (true) {
              while (queue.length > 0) {
                const val = await queue[0];
                if (val === kEof) {
                  return;
                }
                if (signal.aborted) {
                  throw new AbortError();
                }
                if (val !== kEmpty) {
                  yield val;
                }
                queue.shift();
                maybeResume();
              }
              await new Promise2((resolve) => {
                next = resolve;
              });
            }
          } finally {
            done = true;
            if (resume) {
              resume();
              resume = null;
            }
          }
        }.call(this);
      }
      function asIndexedPairs(options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        return async function* asIndexedPairs2() {
          let index = 0;
          for await (const val of this) {
            var _options$signal;
            if (options !== null && options !== void 0 && (_options$signal = options.signal) !== null && _options$signal !== void 0 && _options$signal.aborted) {
              throw new AbortError({
                cause: options.signal.reason
              });
            }
            yield [index++, val];
          }
        }.call(this);
      }
      async function some(fn, options = void 0) {
        for await (const unused of filter.call(this, fn, options)) {
          return true;
        }
        return false;
      }
      async function every(fn, options = void 0) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
        }
        return !await some.call(
          this,
          async (...args) => {
            return !await fn(...args);
          },
          options
        );
      }
      async function find(fn, options) {
        for await (const result2 of filter.call(this, fn, options)) {
          return result2;
        }
        return void 0;
      }
      async function forEach(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
        }
        async function forEachFn(value, options2) {
          await fn(value, options2);
          return kEmpty;
        }
        for await (const unused of map.call(this, forEachFn, options))
          ;
      }
      function filter(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
        }
        async function filterFn(value, options2) {
          if (await fn(value, options2)) {
            return value;
          }
          return kEmpty;
        }
        return map.call(this, filterFn, options);
      }
      var ReduceAwareErrMissingArgs = class extends ERR_MISSING_ARGS {
        constructor() {
          super("reduce");
          this.message = "Reduce of an empty stream requires an initial value";
        }
      };
      async function reduce(reducer, initialValue, options) {
        var _options$signal2;
        if (typeof reducer !== "function") {
          throw new ERR_INVALID_ARG_TYPE("reducer", ["Function", "AsyncFunction"], reducer);
        }
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        let hasInitialValue = arguments.length > 1;
        if (options !== null && options !== void 0 && (_options$signal2 = options.signal) !== null && _options$signal2 !== void 0 && _options$signal2.aborted) {
          const err = new AbortError(void 0, {
            cause: options.signal.reason
          });
          this.once("error", () => {
          });
          await finished(this.destroy(err));
          throw err;
        }
        const ac = new AbortController();
        const signal = ac.signal;
        if (options !== null && options !== void 0 && options.signal) {
          const opts = {
            once: true,
            [kWeakHandler]: this,
            [kResistStopPropagation]: true
          };
          options.signal.addEventListener("abort", () => ac.abort(), opts);
        }
        let gotAnyItemFromStream = false;
        try {
          for await (const value of this) {
            var _options$signal3;
            gotAnyItemFromStream = true;
            if (options !== null && options !== void 0 && (_options$signal3 = options.signal) !== null && _options$signal3 !== void 0 && _options$signal3.aborted) {
              throw new AbortError();
            }
            if (!hasInitialValue) {
              initialValue = value;
              hasInitialValue = true;
            } else {
              initialValue = await reducer(initialValue, value, {
                signal
              });
            }
          }
          if (!gotAnyItemFromStream && !hasInitialValue) {
            throw new ReduceAwareErrMissingArgs();
          }
        } finally {
          ac.abort();
        }
        return initialValue;
      }
      async function toArray(options) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        const result2 = [];
        for await (const val of this) {
          var _options$signal4;
          if (options !== null && options !== void 0 && (_options$signal4 = options.signal) !== null && _options$signal4 !== void 0 && _options$signal4.aborted) {
            throw new AbortError(void 0, {
              cause: options.signal.reason
            });
          }
          ArrayPrototypePush(result2, val);
        }
        return result2;
      }
      function flatMap(fn, options) {
        const values = map.call(this, fn, options);
        return async function* flatMap2() {
          for await (const val of values) {
            yield* val;
          }
        }.call(this);
      }
      function toIntegerOrInfinity(number) {
        number = Number2(number);
        if (NumberIsNaN(number)) {
          return 0;
        }
        if (number < 0) {
          throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
        }
        return number;
      }
      function drop(number, options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        number = toIntegerOrInfinity(number);
        return async function* drop2() {
          var _options$signal5;
          if (options !== null && options !== void 0 && (_options$signal5 = options.signal) !== null && _options$signal5 !== void 0 && _options$signal5.aborted) {
            throw new AbortError();
          }
          for await (const val of this) {
            var _options$signal6;
            if (options !== null && options !== void 0 && (_options$signal6 = options.signal) !== null && _options$signal6 !== void 0 && _options$signal6.aborted) {
              throw new AbortError();
            }
            if (number-- <= 0) {
              yield val;
            }
          }
        }.call(this);
      }
      function take(number, options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        number = toIntegerOrInfinity(number);
        return async function* take2() {
          var _options$signal7;
          if (options !== null && options !== void 0 && (_options$signal7 = options.signal) !== null && _options$signal7 !== void 0 && _options$signal7.aborted) {
            throw new AbortError();
          }
          for await (const val of this) {
            var _options$signal8;
            if (options !== null && options !== void 0 && (_options$signal8 = options.signal) !== null && _options$signal8 !== void 0 && _options$signal8.aborted) {
              throw new AbortError();
            }
            if (number-- > 0) {
              yield val;
            }
            if (number <= 0) {
              return;
            }
          }
        }.call(this);
      }
      module.exports.streamReturningOperators = {
        asIndexedPairs: deprecate(asIndexedPairs, "readable.asIndexedPairs will be removed in a future version."),
        drop,
        filter,
        flatMap,
        map,
        take,
        compose
      };
      module.exports.promiseReturningOperators = {
        every,
        forEach,
        reduce,
        toArray,
        some,
        find
      };
    }
  });
  var require_promises = __commonJS({
    "node_modules/readable-stream/lib/stream/promises.js"(exports, module) {
      "use strict";
      var { ArrayPrototypePop, Promise: Promise2 } = require_primordials();
      var { isIterable, isNodeStream, isWebStream } = require_utils();
      var { pipelineImpl: pl } = require_pipeline();
      var { finished } = require_end_of_stream();
      require_stream();
      function pipeline(...streams) {
        return new Promise2((resolve, reject) => {
          let signal;
          let end;
          const lastArg = streams[streams.length - 1];
          if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg) && !isWebStream(lastArg)) {
            const options = ArrayPrototypePop(streams);
            signal = options.signal;
            end = options.end;
          }
          pl(
            streams,
            (err, value) => {
              if (err) {
                reject(err);
              } else {
                resolve(value);
              }
            },
            {
              signal,
              end
            }
          );
        });
      }
      module.exports = {
        finished,
        pipeline
      };
    }
  });
  var require_stream = __commonJS({
    "node_modules/readable-stream/lib/stream.js"(exports, module) {
      "use strict";
      var { Buffer: Buffer3 } = require_buffer();
      var { ObjectDefineProperty, ObjectKeys, ReflectApply } = require_primordials();
      var {
        promisify: { custom: customPromisify }
      } = require_util();
      var { streamReturningOperators, promiseReturningOperators } = require_operators();
      var {
        codes: { ERR_ILLEGAL_CONSTRUCTOR }
      } = require_errors();
      var compose = require_compose();
      var { setDefaultHighWaterMark, getDefaultHighWaterMark } = require_state();
      var { pipeline } = require_pipeline();
      var { destroyer } = require_destroy();
      var eos = require_end_of_stream();
      var promises = require_promises();
      var utils = require_utils();
      var Stream = module.exports = require_legacy().Stream;
      Stream.isDestroyed = utils.isDestroyed;
      Stream.isDisturbed = utils.isDisturbed;
      Stream.isErrored = utils.isErrored;
      Stream.isReadable = utils.isReadable;
      Stream.isWritable = utils.isWritable;
      Stream.Readable = require_readable();
      for (const key of ObjectKeys(streamReturningOperators)) {
        let fn = function(...args) {
          if (new.target) {
            throw ERR_ILLEGAL_CONSTRUCTOR();
          }
          return Stream.Readable.from(ReflectApply(op, this, args));
        };
        const op = streamReturningOperators[key];
        ObjectDefineProperty(fn, "name", {
          __proto__: null,
          value: op.name
        });
        ObjectDefineProperty(fn, "length", {
          __proto__: null,
          value: op.length
        });
        ObjectDefineProperty(Stream.Readable.prototype, key, {
          __proto__: null,
          value: fn,
          enumerable: false,
          configurable: true,
          writable: true
        });
      }
      for (const key of ObjectKeys(promiseReturningOperators)) {
        let fn = function(...args) {
          if (new.target) {
            throw ERR_ILLEGAL_CONSTRUCTOR();
          }
          return ReflectApply(op, this, args);
        };
        const op = promiseReturningOperators[key];
        ObjectDefineProperty(fn, "name", {
          __proto__: null,
          value: op.name
        });
        ObjectDefineProperty(fn, "length", {
          __proto__: null,
          value: op.length
        });
        ObjectDefineProperty(Stream.Readable.prototype, key, {
          __proto__: null,
          value: fn,
          enumerable: false,
          configurable: true,
          writable: true
        });
      }
      Stream.Writable = require_writable();
      Stream.Duplex = require_duplex();
      Stream.Transform = require_transform();
      Stream.PassThrough = require_passthrough();
      Stream.pipeline = pipeline;
      var { addAbortSignal } = require_add_abort_signal();
      Stream.addAbortSignal = addAbortSignal;
      Stream.finished = eos;
      Stream.destroy = destroyer;
      Stream.compose = compose;
      Stream.setDefaultHighWaterMark = setDefaultHighWaterMark;
      Stream.getDefaultHighWaterMark = getDefaultHighWaterMark;
      ObjectDefineProperty(Stream, "promises", {
        __proto__: null,
        configurable: true,
        enumerable: true,
        get() {
          return promises;
        }
      });
      ObjectDefineProperty(pipeline, customPromisify, {
        __proto__: null,
        enumerable: true,
        get() {
          return promises.pipeline;
        }
      });
      ObjectDefineProperty(eos, customPromisify, {
        __proto__: null,
        enumerable: true,
        get() {
          return promises.finished;
        }
      });
      Stream.Stream = Stream;
      Stream._isUint8Array = function isUint8Array(value) {
        return value instanceof Uint8Array;
      };
      Stream._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
        return Buffer3.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      };
    }
  });
  var require_browser3 = __commonJS({
    "node_modules/readable-stream/lib/ours/browser.js"(exports, module) {
      "use strict";
      var CustomStream = require_stream();
      var promises = require_promises();
      var originalDestroy = CustomStream.Readable.destroy;
      module.exports = CustomStream.Readable;
      module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
      module.exports._isUint8Array = CustomStream._isUint8Array;
      module.exports.isDisturbed = CustomStream.isDisturbed;
      module.exports.isErrored = CustomStream.isErrored;
      module.exports.isReadable = CustomStream.isReadable;
      module.exports.Readable = CustomStream.Readable;
      module.exports.Writable = CustomStream.Writable;
      module.exports.Duplex = CustomStream.Duplex;
      module.exports.Transform = CustomStream.Transform;
      module.exports.PassThrough = CustomStream.PassThrough;
      module.exports.addAbortSignal = CustomStream.addAbortSignal;
      module.exports.finished = CustomStream.finished;
      module.exports.destroy = CustomStream.destroy;
      module.exports.destroy = originalDestroy;
      module.exports.pipeline = CustomStream.pipeline;
      module.exports.compose = CustomStream.compose;
      Object.defineProperty(CustomStream, "promises", {
        configurable: true,
        enumerable: true,
        get() {
          return promises;
        }
      });
      module.exports.Stream = CustomStream.Stream;
      module.exports.default = module.exports;
    }
  });
  function oldm(options) {
    return new Context(options);
  }
  var rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  var prefixes = {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    solid: "http://www.w3.org/ns/solid/terms#",
    schema: "http://schema.org/",
    vcard: "http://www.w3.org/2006/vcard/ns#"
  };
  var Context = class {
    constructor(options) {
      this.prefixes = { ...prefixes, ...options?.prefixes };
      if (!this.prefixes["xsd"]) {
        this.prefixes["xsd"] = "http://www.w3.org/2001/XMLSchema#";
      }
      this.parser = options?.parser;
      this.writer = options?.writer;
      this.sources = /* @__PURE__ */ Object.create(null);
      this.separator = options?.separator ?? "$";
    }
    parse(input, url2, type) {
      const { quads, prefixes: prefixes3 } = this.parser(input, url2, type);
      if (prefixes3) {
        for (let prefix2 in prefixes3) {
          let prefixURL = new URL(prefixes3[prefix2], url2).href;
          if (!this.prefixes[prefix2]) {
            this.prefixes[prefix2] = prefixURL;
          }
        }
      }
      this.sources[url2] = new Graph(quads, url2, type, prefixes3, this);
      return this.sources[url2];
    }
    setType(literal2, shortType) {
      if (!shortType) {
        return literal2;
      }
      if (typeof literal2 == "string") {
        literal2 = new String(literal2);
      } else if (typeof result == "number") {
        literal2 = new Number(literal2);
      }
      if (typeof literal2 !== "object") {
        throw new Error("cannot set type on ", literal2, shortType);
      }
      literal2.type = shortType;
      return literal2;
    }
    getType(literal2) {
      if (literal2 && typeof literal2 == "object") {
        return literal2.type;
      }
      return null;
    }
  };
  var Graph = class {
    #blankNodes = /* @__PURE__ */ Object.create(null);
    constructor(quads, url2, mimetype, prefixes3, context) {
      this.mimetype = mimetype;
      this.url = url2;
      this.prefixes = prefixes3;
      this.context = context;
      this.subjects = /* @__PURE__ */ Object.create(null);
      for (let quad2 of quads) {
        let subject;
        if (quad2.subject.termType == "BlankNode") {
          let shortPred = this.shortURI(quad2.predicate.id, ":");
          switch (shortPred) {
            case "rdf:first":
              subject = this.addCollection(quad2.subject.id);
              let shortObj = this.shortURI(quad2.object.id, ":");
              if (shortObj != "rdf:nil") {
                const value = this.getValue(quad2.object);
                if (value) {
                  subject.push(value);
                }
              }
              continue;
              break;
            case "rdf:rest":
              this.#blankNodes[quad2.object.id] = this.#blankNodes[quad2.subject.id];
              continue;
              break;
            default:
              subject = this.addBlankNode(quad2.subject.id);
              break;
          }
        } else {
          subject = this.addNamedNode(quad2.subject.id);
        }
        subject.addPredicate(quad2.predicate.id, quad2.object);
      }
      if (this.subjects[url2]) {
        this.primary = this.subjects[url2];
      } else {
        this.primary = null;
      }
      Object.defineProperty(this, "data", {
        get() {
          return Object.values(this.subjects);
        }
      });
    }
    addNamedNode(uri) {
      let absURI = new URL(uri, this.url).href;
      if (!this.subjects[absURI]) {
        this.subjects[absURI] = new NamedNode(absURI, this);
      }
      return this.subjects[absURI];
    }
    addBlankNode(id2) {
      if (!this.#blankNodes[id2]) {
        this.#blankNodes[id2] = new BlankNode(this);
      }
      return this.#blankNodes[id2];
    }
    addCollection(id2) {
      if (!this.#blankNodes[id2]) {
        this.#blankNodes[id2] = new Collection(this);
      }
      return this.#blankNodes[id2];
    }
    write() {
      return this.context.writer(this);
    }
    get(shortID) {
      return this.subjects[this.fullURI(shortID)];
    }
    fullURI(shortURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      const [prefix2, path] = shortURI.split(separator);
      if (path) {
        return this.prefixes[prefix2] + path;
      }
      return shortURI;
    }
    shortURI(fullURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      for (let prefix2 in this.context.prefixes) {
        if (fullURI.startsWith(this.context.prefixes[prefix2])) {
          return prefix2 + separator + fullURI.substring(this.context.prefixes[prefix2].length);
        }
      }
      if (this.url && fullURI.startsWith(this.url)) {
        return fullURI.substring(this.url.length);
      }
      return fullURI;
    }
    /**
     * This sets the type of a literal, usually one of the xsd types
     */
    setType(literal2, type) {
      const shortType = this.shortURI(type);
      return this.context.setType(literal2, shortType);
    }
    /**
     * This returns the type of a literal, or null
     */
    getType(literal2) {
      return this.context.getType(literal2);
    }
    setLanguage(literal2, language) {
      if (typeof literal2 == "string") {
        literal2 = new String(literal2);
      } else if (typeof result == "number") {
        literal2 = new Number(literal2);
      }
      if (typeof literal2 !== "object") {
        throw new Error("cannot set language on ", literal2);
      }
      literal2.language = language;
      return literal2;
    }
    getValue(object) {
      let result2;
      if (object.termType == "Literal") {
        result2 = object.value;
        let datatype = object.datatype?.id;
        if (datatype) {
          result2 = this.setType(result2, datatype);
        }
        let language = object.language;
        if (language) {
          result2 = this.setLanguage(result2, language);
        }
      } else if (object.termType == "BlankNode") {
        result2 = this.addBlankNode(object.id);
      } else {
        result2 = this.addNamedNode(object.id);
      }
      return result2;
    }
  };
  var BlankNode = class {
    constructor(graph) {
      Object.defineProperty(this, "graph", {
        value: graph,
        writable: false,
        enumerable: false
      });
    }
    addPredicate(predicate, object) {
      if (predicate.id) {
        predicate = predicate.id;
      }
      if (predicate == rdfType) {
        let type = this.graph.shortURI(object.id);
        this.addType(type);
      } else {
        const value = this.graph.getValue(object);
        predicate = this.graph.shortURI(predicate);
        if (!this[predicate]) {
          this[predicate] = value;
        } else if (Array.isArray(this[predicate])) {
          this[predicate].push(value);
        } else {
          this[predicate] = [this[predicate], value];
        }
      }
    }
    /**
     * Adds a rdfType value, stored in this.a
     * Subjects can have more than one type (or class), unlike literals
     * The type value can be any URI, xsdTypes are unexpected here
     */
    addType(type) {
      if (!this.a) {
        this.a = type;
      } else {
        if (!Array.isArray(this.a)) {
          this.a = [this.a];
        }
        this.a.push(type);
      }
    }
  };
  var NamedNode = class extends BlankNode {
    constructor(id2, graph) {
      super(graph);
      Object.defineProperty(this, "a", {
        writable: true,
        enumerable: false
      });
      Object.defineProperty(this, "id", {
        value: id2,
        writable: false,
        enumerable: false
      });
    }
  };
  var Collection = class extends Array {
    constructor(id2, graph) {
      super();
      Object.defineProperty(this, "graph", {
        value: graph,
        writable: false,
        enumerable: false
      });
    }
  };
  var import_buffer = __toESM(require_buffer());
  var import_queue_microtask = __toESM(require_queue_microtask());
  var RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  var XSD = "http://www.w3.org/2001/XMLSchema#";
  var SWAP = "http://www.w3.org/2000/10/swap/";
  var IRIs_default = {
    xsd: {
      decimal: `${XSD}decimal`,
      boolean: `${XSD}boolean`,
      double: `${XSD}double`,
      integer: `${XSD}integer`,
      string: `${XSD}string`
    },
    rdf: {
      type: `${RDF}type`,
      nil: `${RDF}nil`,
      first: `${RDF}first`,
      rest: `${RDF}rest`,
      langString: `${RDF}langString`
    },
    owl: {
      sameAs: "http://www.w3.org/2002/07/owl#sameAs"
    },
    r: {
      forSome: `${SWAP}reify#forSome`,
      forAll: `${SWAP}reify#forAll`
    },
    log: {
      implies: `${SWAP}log#implies`
    }
  };
  var { xsd } = IRIs_default;
  var escapeSequence = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g;
  var escapeReplacements = {
    "\\": "\\",
    "'": "'",
    '"': '"',
    "n": "\n",
    "r": "\r",
    "t": "	",
    "f": "\f",
    "b": "\b",
    "_": "_",
    "~": "~",
    ".": ".",
    "-": "-",
    "!": "!",
    "$": "$",
    "&": "&",
    "(": "(",
    ")": ")",
    "*": "*",
    "+": "+",
    ",": ",",
    ";": ";",
    "=": "=",
    "/": "/",
    "?": "?",
    "#": "#",
    "@": "@",
    "%": "%"
  };
  var illegalIriChars = /[\x00-\x20<>\\"\{\}\|\^\`]/;
  var lineModeRegExps = {
    _iri: true,
    _unescapedIri: true,
    _simpleQuotedString: true,
    _langcode: true,
    _blank: true,
    _newline: true,
    _comment: true,
    _whitespace: true,
    _endOfFile: true
  };
  var invalidRegExp = /$0^/;
  var N3Lexer = class {
    constructor(options) {
      this._iri = /^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/;
      this._unescapedIri = /^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/;
      this._simpleQuotedString = /^"([^"\\\r\n]*)"(?=[^"])/;
      this._simpleApostropheString = /^'([^'\\\r\n]*)'(?=[^'])/;
      this._langcode = /^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9\-])/i;
      this._prefix = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/;
      this._prefixed = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/;
      this._variable = /^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/;
      this._blank = /^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/;
      this._number = /^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/;
      this._boolean = /^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/;
      this._keyword = /^@[a-z]+(?=[\s#<:])/i;
      this._sparqlKeyword = /^(?:PREFIX|BASE|GRAPH)(?=[\s#<])/i;
      this._shortPredicates = /^a(?=[\s#()\[\]\{\}"'<>])/;
      this._newline = /^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/;
      this._comment = /#([^\n\r]*)/;
      this._whitespace = /^[ \t]+/;
      this._endOfFile = /^(?:#[^\n\r]*)?$/;
      options = options || {};
      if (this._lineMode = !!options.lineMode) {
        this._n3Mode = false;
        for (const key in this) {
          if (!(key in lineModeRegExps) && this[key] instanceof RegExp)
            this[key] = invalidRegExp;
        }
      } else {
        this._n3Mode = options.n3 !== false;
      }
      this.comments = !!options.comments;
      this._literalClosingPos = 0;
    }
    // ## Private methods
    // ### `_tokenizeToEnd` tokenizes as for as possible, emitting tokens through the callback
    _tokenizeToEnd(callback, inputFinished) {
      let input = this._input;
      let currentLineLength = input.length;
      while (true) {
        let whiteSpaceMatch, comment;
        while (whiteSpaceMatch = this._newline.exec(input)) {
          if (this.comments && (comment = this._comment.exec(whiteSpaceMatch[0])))
            emitToken("comment", comment[1], "", this._line, whiteSpaceMatch[0].length);
          input = input.substr(whiteSpaceMatch[0].length, input.length);
          currentLineLength = input.length;
          this._line++;
        }
        if (!whiteSpaceMatch && (whiteSpaceMatch = this._whitespace.exec(input)))
          input = input.substr(whiteSpaceMatch[0].length, input.length);
        if (this._endOfFile.test(input)) {
          if (inputFinished) {
            if (this.comments && (comment = this._comment.exec(input)))
              emitToken("comment", comment[1], "", this._line, input.length);
            input = null;
            emitToken("eof", "", "", this._line, 0);
          }
          return this._input = input;
        }
        const line = this._line, firstChar = input[0];
        let type = "", value = "", prefix2 = "", match = null, matchLength = 0, inconclusive = false;
        switch (firstChar) {
          case "^":
            if (input.length < 3)
              break;
            else if (input[1] === "^") {
              this._previousMarker = "^^";
              input = input.substr(2);
              if (input[0] !== "<") {
                inconclusive = true;
                break;
              }
            } else {
              if (this._n3Mode) {
                matchLength = 1;
                type = "^";
              }
              break;
            }
          case "<":
            if (match = this._unescapedIri.exec(input))
              type = "IRI", value = match[1];
            else if (match = this._iri.exec(input)) {
              value = this._unescape(match[1]);
              if (value === null || illegalIriChars.test(value))
                return reportSyntaxError(this);
              type = "IRI";
            } else if (input.length > 1 && input[1] === "<")
              type = "<<", matchLength = 2;
            else if (this._n3Mode && input.length > 1 && input[1] === "=")
              type = "inverse", matchLength = 2, value = ">";
            break;
          case ">":
            if (input.length > 1 && input[1] === ">")
              type = ">>", matchLength = 2;
            break;
          case "_":
            if ((match = this._blank.exec(input)) || inputFinished && (match = this._blank.exec(`${input} `)))
              type = "blank", prefix2 = "_", value = match[1];
            break;
          case '"':
            if (match = this._simpleQuotedString.exec(input))
              value = match[1];
            else {
              ({ value, matchLength } = this._parseLiteral(input));
              if (value === null)
                return reportSyntaxError(this);
            }
            if (match !== null || matchLength !== 0) {
              type = "literal";
              this._literalClosingPos = 0;
            }
            break;
          case "'":
            if (!this._lineMode) {
              if (match = this._simpleApostropheString.exec(input))
                value = match[1];
              else {
                ({ value, matchLength } = this._parseLiteral(input));
                if (value === null)
                  return reportSyntaxError(this);
              }
              if (match !== null || matchLength !== 0) {
                type = "literal";
                this._literalClosingPos = 0;
              }
            }
            break;
          case "?":
            if (this._n3Mode && (match = this._variable.exec(input)))
              type = "var", value = match[0];
            break;
          case "@":
            if (this._previousMarker === "literal" && (match = this._langcode.exec(input)))
              type = "langcode", value = match[1];
            else if (match = this._keyword.exec(input))
              type = match[0];
            break;
          case ".":
            if (input.length === 1 ? inputFinished : input[1] < "0" || input[1] > "9") {
              type = ".";
              matchLength = 1;
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
            if (match = this._number.exec(input) || inputFinished && (match = this._number.exec(`${input} `))) {
              type = "literal", value = match[0];
              prefix2 = typeof match[1] === "string" ? xsd.double : typeof match[2] === "string" ? xsd.decimal : xsd.integer;
            }
            break;
          case "B":
          case "b":
          case "p":
          case "P":
          case "G":
          case "g":
            if (match = this._sparqlKeyword.exec(input))
              type = match[0].toUpperCase();
            else
              inconclusive = true;
            break;
          case "f":
          case "t":
            if (match = this._boolean.exec(input))
              type = "literal", value = match[0], prefix2 = xsd.boolean;
            else
              inconclusive = true;
            break;
          case "a":
            if (match = this._shortPredicates.exec(input))
              type = "abbreviation", value = "a";
            else
              inconclusive = true;
            break;
          case "=":
            if (this._n3Mode && input.length > 1) {
              type = "abbreviation";
              if (input[1] !== ">")
                matchLength = 1, value = "=";
              else
                matchLength = 2, value = ">";
            }
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
            if (!this._lineMode) {
              matchLength = 1;
              type = firstChar;
            }
            break;
          case "{":
            if (!this._lineMode && input.length >= 2) {
              if (input[1] === "|")
                type = "{|", matchLength = 2;
              else
                type = firstChar, matchLength = 1;
            }
            break;
          case "|":
            if (input.length >= 2 && input[1] === "}")
              type = "|}", matchLength = 2;
            break;
          default:
            inconclusive = true;
        }
        if (inconclusive) {
          if ((this._previousMarker === "@prefix" || this._previousMarker === "PREFIX") && (match = this._prefix.exec(input)))
            type = "prefix", value = match[1] || "";
          else if ((match = this._prefixed.exec(input)) || inputFinished && (match = this._prefixed.exec(`${input} `)))
            type = "prefixed", prefix2 = match[1] || "", value = this._unescape(match[2]);
        }
        if (this._previousMarker === "^^") {
          switch (type) {
            case "prefixed":
              type = "type";
              break;
            case "IRI":
              type = "typeIRI";
              break;
            default:
              type = "";
          }
        }
        if (!type) {
          if (inputFinished || !/^'''|^"""/.test(input) && /\n|\r/.test(input))
            return reportSyntaxError(this);
          else
            return this._input = input;
        }
        const length = matchLength || match[0].length;
        const token = emitToken(type, value, prefix2, line, length);
        this.previousToken = token;
        this._previousMarker = type;
        input = input.substr(length, input.length);
      }
      function emitToken(type, value, prefix2, line, length) {
        const start = input ? currentLineLength - input.length : currentLineLength;
        const end = start + length;
        const token = { type, value, prefix: prefix2, line, start, end };
        callback(null, token);
        return token;
      }
      function reportSyntaxError(self2) {
        callback(self2._syntaxError(/^\S*/.exec(input)[0]));
      }
    }
    // ### `_unescape` replaces N3 escape codes by their corresponding characters
    _unescape(item) {
      let invalid = false;
      const replaced = item.replace(escapeSequence, (sequence, unicode4, unicode8, escapedChar) => {
        if (typeof unicode4 === "string")
          return String.fromCharCode(Number.parseInt(unicode4, 16));
        if (typeof unicode8 === "string") {
          let charCode = Number.parseInt(unicode8, 16);
          return charCode <= 65535 ? String.fromCharCode(Number.parseInt(unicode8, 16)) : String.fromCharCode(55296 + ((charCode -= 65536) >> 10), 56320 + (charCode & 1023));
        }
        if (escapedChar in escapeReplacements)
          return escapeReplacements[escapedChar];
        invalid = true;
        return "";
      });
      return invalid ? null : replaced;
    }
    // ### `_parseLiteral` parses a literal into an unescaped value
    _parseLiteral(input) {
      if (input.length >= 3) {
        const opening = input.match(/^(?:"""|"|'''|'|)/)[0];
        const openingLength = opening.length;
        let closingPos = Math.max(this._literalClosingPos, openingLength);
        while ((closingPos = input.indexOf(opening, closingPos)) > 0) {
          let backslashCount = 0;
          while (input[closingPos - backslashCount - 1] === "\\")
            backslashCount++;
          if (backslashCount % 2 === 0) {
            const raw = input.substring(openingLength, closingPos);
            const lines = raw.split(/\r\n|\r|\n/).length - 1;
            const matchLength = closingPos + openingLength;
            if (openingLength === 1 && lines !== 0 || openingLength === 3 && this._lineMode)
              break;
            this._line += lines;
            return { value: this._unescape(raw), matchLength };
          }
          closingPos++;
        }
        this._literalClosingPos = input.length - openingLength + 1;
      }
      return { value: "", matchLength: 0 };
    }
    // ### `_syntaxError` creates a syntax error for the given issue
    _syntaxError(issue) {
      this._input = null;
      const err = new Error(`Unexpected "${issue}" on line ${this._line}.`);
      err.context = {
        token: void 0,
        line: this._line,
        previousToken: this.previousToken
      };
      return err;
    }
    // ### Strips off any starting UTF BOM mark.
    _readStartingBom(input) {
      return input.startsWith("\uFEFF") ? input.substr(1) : input;
    }
    // ## Public methods
    // ### `tokenize` starts the transformation of an N3 document into an array of tokens.
    // The input can be a string or a stream.
    tokenize(input, callback) {
      this._line = 1;
      if (typeof input === "string") {
        this._input = this._readStartingBom(input);
        if (typeof callback === "function")
          (0, import_queue_microtask.default)(() => this._tokenizeToEnd(callback, true));
        else {
          const tokens = [];
          let error4;
          this._tokenizeToEnd((e, t) => e ? error4 = e : tokens.push(t), true);
          if (error4)
            throw error4;
          return tokens;
        }
      } else {
        this._pendingBuffer = null;
        if (typeof input.setEncoding === "function")
          input.setEncoding("utf8");
        input.on("data", (data) => {
          if (this._input !== null && data.length !== 0) {
            if (this._pendingBuffer) {
              data = import_buffer.Buffer.concat([this._pendingBuffer, data]);
              this._pendingBuffer = null;
            }
            if (data[data.length - 1] & 128) {
              this._pendingBuffer = data;
            } else {
              if (typeof this._input === "undefined")
                this._input = this._readStartingBom(typeof data === "string" ? data : data.toString());
              else
                this._input += data;
              this._tokenizeToEnd(callback, false);
            }
          }
        });
        input.on("end", () => {
          if (typeof this._input === "string")
            this._tokenizeToEnd(callback, true);
        });
        input.on("error", callback);
      }
    }
  };
  var { rdf, xsd: xsd2 } = IRIs_default;
  var DEFAULTGRAPH;
  var _blankNodeCounter = 0;
  var DataFactory = {
    namedNode,
    blankNode,
    variable,
    literal,
    defaultGraph,
    quad,
    triple: quad,
    fromTerm,
    fromQuad
  };
  var N3DataFactory_default = DataFactory;
  var Term = class _Term {
    constructor(id2) {
      this.id = id2;
    }
    // ### The value of this term
    get value() {
      return this.id;
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      if (other instanceof _Term)
        return this.id === other.id;
      return !!other && this.termType === other.termType && this.value === other.value;
    }
    // ### Implement hashCode for Immutable.js, since we implement `equals`
    // https://immutable-js.com/docs/v4.0.0/ValueObject/#hashCode()
    hashCode() {
      return 0;
    }
    // ### Returns a plain object representation of this term
    toJSON() {
      return {
        termType: this.termType,
        value: this.value
      };
    }
  };
  var NamedNode2 = class extends Term {
    // ### The term type of this term
    get termType() {
      return "NamedNode";
    }
  };
  var Literal = class _Literal extends Term {
    // ### The term type of this term
    get termType() {
      return "Literal";
    }
    // ### The text value of this literal
    get value() {
      return this.id.substring(1, this.id.lastIndexOf('"'));
    }
    // ### The language of this literal
    get language() {
      const id2 = this.id;
      let atPos = id2.lastIndexOf('"') + 1;
      return atPos < id2.length && id2[atPos++] === "@" ? id2.substr(atPos).toLowerCase() : "";
    }
    // ### The datatype IRI of this literal
    get datatype() {
      return new NamedNode2(this.datatypeString);
    }
    // ### The datatype string of this literal
    get datatypeString() {
      const id2 = this.id, dtPos = id2.lastIndexOf('"') + 1;
      const char = dtPos < id2.length ? id2[dtPos] : "";
      return char === "^" ? id2.substr(dtPos + 2) : (
        // If "@" follows, return rdf:langString; xsd:string otherwise
        char !== "@" ? xsd2.string : rdf.langString
      );
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      if (other instanceof _Literal)
        return this.id === other.id;
      return !!other && !!other.datatype && this.termType === other.termType && this.value === other.value && this.language === other.language && this.datatype.value === other.datatype.value;
    }
    toJSON() {
      return {
        termType: this.termType,
        value: this.value,
        language: this.language,
        datatype: { termType: "NamedNode", value: this.datatypeString }
      };
    }
  };
  var BlankNode2 = class extends Term {
    constructor(name) {
      super(`_:${name}`);
    }
    // ### The term type of this term
    get termType() {
      return "BlankNode";
    }
    // ### The name of this blank node
    get value() {
      return this.id.substr(2);
    }
  };
  var Variable = class extends Term {
    constructor(name) {
      super(`?${name}`);
    }
    // ### The term type of this term
    get termType() {
      return "Variable";
    }
    // ### The name of this variable
    get value() {
      return this.id.substr(1);
    }
  };
  var DefaultGraph = class extends Term {
    constructor() {
      super("");
      return DEFAULTGRAPH || this;
    }
    // ### The term type of this term
    get termType() {
      return "DefaultGraph";
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      return this === other || !!other && this.termType === other.termType;
    }
  };
  DEFAULTGRAPH = new DefaultGraph();
  function termFromId(id2, factory, nested) {
    factory = factory || DataFactory;
    if (!id2)
      return factory.defaultGraph();
    switch (id2[0]) {
      case "?":
        return factory.variable(id2.substr(1));
      case "_":
        return factory.blankNode(id2.substr(2));
      case '"':
        if (factory === DataFactory)
          return new Literal(id2);
        if (id2[id2.length - 1] === '"')
          return factory.literal(id2.substr(1, id2.length - 2));
        const endPos = id2.lastIndexOf('"', id2.length - 1);
        return factory.literal(
          id2.substr(1, endPos - 1),
          id2[endPos + 1] === "@" ? id2.substr(endPos + 2) : factory.namedNode(id2.substr(endPos + 3))
        );
      case "[":
        id2 = JSON.parse(id2);
        break;
      default:
        if (!nested || !Array.isArray(id2)) {
          return factory.namedNode(id2);
        }
    }
    return factory.quad(
      termFromId(id2[0], factory, true),
      termFromId(id2[1], factory, true),
      termFromId(id2[2], factory, true),
      id2[3] && termFromId(id2[3], factory, true)
    );
  }
  function termToId(term, nested) {
    if (typeof term === "string")
      return term;
    if (term instanceof Term && term.termType !== "Quad")
      return term.id;
    if (!term)
      return DEFAULTGRAPH.id;
    switch (term.termType) {
      case "NamedNode":
        return term.value;
      case "BlankNode":
        return `_:${term.value}`;
      case "Variable":
        return `?${term.value}`;
      case "DefaultGraph":
        return "";
      case "Literal":
        return `"${term.value}"${term.language ? `@${term.language}` : term.datatype && term.datatype.value !== xsd2.string ? `^^${term.datatype.value}` : ""}`;
      case "Quad":
        const res = [
          termToId(term.subject, true),
          termToId(term.predicate, true),
          termToId(term.object, true)
        ];
        if (term.graph && term.graph.termType !== "DefaultGraph") {
          res.push(termToId(term.graph, true));
        }
        return nested ? res : JSON.stringify(res);
      default:
        throw new Error(`Unexpected termType: ${term.termType}`);
    }
  }
  var Quad = class extends Term {
    constructor(subject, predicate, object, graph) {
      super("");
      this._subject = subject;
      this._predicate = predicate;
      this._object = object;
      this._graph = graph || DEFAULTGRAPH;
    }
    // ### The term type of this term
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
    // ### Returns a plain object representation of this quad
    toJSON() {
      return {
        termType: this.termType,
        subject: this._subject.toJSON(),
        predicate: this._predicate.toJSON(),
        object: this._object.toJSON(),
        graph: this._graph.toJSON()
      };
    }
    // ### Returns whether this object represents the same quad as the other
    equals(other) {
      return !!other && this._subject.equals(other.subject) && this._predicate.equals(other.predicate) && this._object.equals(other.object) && this._graph.equals(other.graph);
    }
  };
  function namedNode(iri) {
    return new NamedNode2(iri);
  }
  function blankNode(name) {
    return new BlankNode2(name || `n3-${_blankNodeCounter++}`);
  }
  function literal(value, languageOrDataType) {
    if (typeof languageOrDataType === "string")
      return new Literal(`"${value}"@${languageOrDataType.toLowerCase()}`);
    let datatype = languageOrDataType ? languageOrDataType.value : "";
    if (datatype === "") {
      if (typeof value === "boolean")
        datatype = xsd2.boolean;
      else if (typeof value === "number") {
        if (Number.isFinite(value))
          datatype = Number.isInteger(value) ? xsd2.integer : xsd2.double;
        else {
          datatype = xsd2.double;
          if (!Number.isNaN(value))
            value = value > 0 ? "INF" : "-INF";
        }
      }
    }
    return datatype === "" || datatype === xsd2.string ? new Literal(`"${value}"`) : new Literal(`"${value}"^^${datatype}`);
  }
  function variable(name) {
    return new Variable(name);
  }
  function defaultGraph() {
    return DEFAULTGRAPH;
  }
  function quad(subject, predicate, object, graph) {
    return new Quad(subject, predicate, object, graph);
  }
  function fromTerm(term) {
    if (term instanceof Term)
      return term;
    switch (term.termType) {
      case "NamedNode":
        return namedNode(term.value);
      case "BlankNode":
        return blankNode(term.value);
      case "Variable":
        return variable(term.value);
      case "DefaultGraph":
        return DEFAULTGRAPH;
      case "Literal":
        return literal(term.value, term.language || term.datatype);
      case "Quad":
        return fromQuad(term);
      default:
        throw new Error(`Unexpected termType: ${term.termType}`);
    }
  }
  function fromQuad(inQuad) {
    if (inQuad instanceof Quad)
      return inQuad;
    if (inQuad.termType !== "Quad")
      throw new Error(`Unexpected termType: ${inQuad.termType}`);
    return quad(fromTerm(inQuad.subject), fromTerm(inQuad.predicate), fromTerm(inQuad.object), fromTerm(inQuad.graph));
  }
  var blankNodePrefix = 0;
  var N3Parser = class {
    constructor(options) {
      this._contextStack = [];
      this._graph = null;
      options = options || {};
      this._setBase(options.baseIRI);
      options.factory && initDataFactory(this, options.factory);
      const format = typeof options.format === "string" ? options.format.match(/\w*$/)[0].toLowerCase() : "", isTurtle = /turtle/.test(format), isTriG = /trig/.test(format), isNTriples = /triple/.test(format), isNQuads = /quad/.test(format), isN3 = this._n3Mode = /n3/.test(format), isLineMode = isNTriples || isNQuads;
      if (!(this._supportsNamedGraphs = !(isTurtle || isN3)))
        this._readPredicateOrNamedGraph = this._readPredicate;
      this._supportsQuads = !(isTurtle || isTriG || isNTriples || isN3);
      this._supportsRDFStar = format === "" || /star|\*$/.test(format);
      if (isLineMode)
        this._resolveRelativeIRI = (iri) => {
          return null;
        };
      this._blankNodePrefix = typeof options.blankNodePrefix !== "string" ? "" : options.blankNodePrefix.replace(/^(?!_:)/, "_:");
      this._lexer = options.lexer || new N3Lexer({ lineMode: isLineMode, n3: isN3 });
      this._explicitQuantifiers = !!options.explicitQuantifiers;
    }
    // ## Static class methods
    // ### `_resetBlankNodePrefix` restarts blank node prefix identification
    static _resetBlankNodePrefix() {
      blankNodePrefix = 0;
    }
    // ## Private methods
    // ### `_setBase` sets the base IRI to resolve relative IRIs
    _setBase(baseIRI) {
      if (!baseIRI) {
        this._base = "";
        this._basePath = "";
      } else {
        const fragmentPos = baseIRI.indexOf("#");
        if (fragmentPos >= 0)
          baseIRI = baseIRI.substr(0, fragmentPos);
        this._base = baseIRI;
        this._basePath = baseIRI.indexOf("/") < 0 ? baseIRI : baseIRI.replace(/[^\/?]*(?:\?.*)?$/, "");
        baseIRI = baseIRI.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i);
        this._baseRoot = baseIRI[0];
        this._baseScheme = baseIRI[1];
      }
    }
    // ### `_saveContext` stores the current parsing context
    // when entering a new scope (list, blank node, formula)
    _saveContext(type, graph, subject, predicate, object) {
      const n3Mode = this._n3Mode;
      this._contextStack.push({
        type,
        subject,
        predicate,
        object,
        graph,
        inverse: n3Mode ? this._inversePredicate : false,
        blankPrefix: n3Mode ? this._prefixes._ : "",
        quantified: n3Mode ? this._quantified : null
      });
      if (n3Mode) {
        this._inversePredicate = false;
        this._prefixes._ = this._graph ? `${this._graph.value}.` : ".";
        this._quantified = Object.create(this._quantified);
      }
    }
    // ### `_restoreContext` restores the parent context
    // when leaving a scope (list, blank node, formula)
    _restoreContext(type, token) {
      const context = this._contextStack.pop();
      if (!context || context.type !== type)
        return this._error(`Unexpected ${token.type}`, token);
      this._subject = context.subject;
      this._predicate = context.predicate;
      this._object = context.object;
      this._graph = context.graph;
      if (this._n3Mode) {
        this._inversePredicate = context.inverse;
        this._prefixes._ = context.blankPrefix;
        this._quantified = context.quantified;
      }
    }
    // ### `_readInTopContext` reads a token when in the top context
    _readInTopContext(token) {
      switch (token.type) {
        case "eof":
          if (this._graph !== null)
            return this._error("Unclosed graph", token);
          delete this._prefixes._;
          return this._callback(null, null, this._prefixes);
        case "PREFIX":
          this._sparqlStyle = true;
        case "@prefix":
          return this._readPrefix;
        case "BASE":
          this._sparqlStyle = true;
        case "@base":
          return this._readBaseIRI;
        case "{":
          if (this._supportsNamedGraphs) {
            this._graph = "";
            this._subject = null;
            return this._readSubject;
          }
        case "GRAPH":
          if (this._supportsNamedGraphs)
            return this._readNamedGraphLabel;
        default:
          return this._readSubject(token);
      }
    }
    // ### `_readEntity` reads an IRI, prefixed name, blank node, or variable
    _readEntity(token, quantifier) {
      let value;
      switch (token.type) {
        case "IRI":
        case "typeIRI":
          const iri = this._resolveIRI(token.value);
          if (iri === null)
            return this._error("Invalid IRI", token);
          value = this._factory.namedNode(iri);
          break;
        case "type":
        case "prefixed":
          const prefix2 = this._prefixes[token.prefix];
          if (prefix2 === void 0)
            return this._error(`Undefined prefix "${token.prefix}:"`, token);
          value = this._factory.namedNode(prefix2 + token.value);
          break;
        case "blank":
          value = this._factory.blankNode(this._prefixes[token.prefix] + token.value);
          break;
        case "var":
          value = this._factory.variable(token.value.substr(1));
          break;
        default:
          return this._error(`Expected entity but got ${token.type}`, token);
      }
      if (!quantifier && this._n3Mode && value.id in this._quantified)
        value = this._quantified[value.id];
      return value;
    }
    // ### `_readSubject` reads a quad's subject
    _readSubject(token) {
      this._predicate = null;
      switch (token.type) {
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            this._subject = this._factory.blankNode(),
            null,
            null
          );
          return this._readBlankNodeHead;
        case "(":
          this._saveContext("list", this._graph, this.RDF_NIL, null, null);
          this._subject = null;
          return this._readListItem;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._graph = this._factory.blankNode(),
            null,
            null
          );
          return this._readSubject;
        case "}":
          return this._readPunctuation(token);
        case "@forSome":
          if (!this._n3Mode)
            return this._error('Unexpected "@forSome"', token);
          this._subject = null;
          this._predicate = this.N3_FORSOME;
          this._quantifier = "blankNode";
          return this._readQuantifierList;
        case "@forAll":
          if (!this._n3Mode)
            return this._error('Unexpected "@forAll"', token);
          this._subject = null;
          this._predicate = this.N3_FORALL;
          this._quantifier = "variable";
          return this._readQuantifierList;
        case "literal":
          if (!this._n3Mode)
            return this._error("Unexpected literal", token);
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            return this._completeSubjectLiteral;
          } else
            this._subject = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
          break;
        case "<<":
          if (!this._supportsRDFStar)
            return this._error("Unexpected RDF-star syntax", token);
          this._saveContext("<<", this._graph, null, null, null);
          this._graph = null;
          return this._readSubject;
        default:
          if ((this._subject = this._readEntity(token)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._readPredicateOrNamedGraph);
      }
      return this._readPredicateOrNamedGraph;
    }
    // ### `_readPredicate` reads a quad's predicate
    _readPredicate(token) {
      const type = token.type;
      switch (type) {
        case "inverse":
          this._inversePredicate = true;
        case "abbreviation":
          this._predicate = this.ABBREVIATIONS[token.value];
          break;
        case ".":
        case "]":
        case "}":
          if (this._predicate === null)
            return this._error(`Unexpected ${type}`, token);
          this._subject = null;
          return type === "]" ? this._readBlankNodeTail(token) : this._readPunctuation(token);
        case ";":
          return this._predicate !== null ? this._readPredicate : this._error("Expected predicate but got ;", token);
        case "[":
          if (this._n3Mode) {
            this._saveContext(
              "blank",
              this._graph,
              this._subject,
              this._subject = this._factory.blankNode(),
              null
            );
            return this._readBlankNodeHead;
          }
        case "blank":
          if (!this._n3Mode)
            return this._error("Disallowed blank node as predicate", token);
        default:
          if ((this._predicate = this._readEntity(token)) === void 0)
            return;
      }
      return this._readObject;
    }
    // ### `_readObject` reads a quad's object
    _readObject(token) {
      switch (token.type) {
        case "literal":
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            return this._readDataTypeOrLang;
          } else
            this._object = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
          break;
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            this._subject,
            this._predicate,
            this._subject = this._factory.blankNode()
          );
          return this._readBlankNodeHead;
        case "(":
          this._saveContext("list", this._graph, this._subject, this._predicate, this.RDF_NIL);
          this._subject = null;
          return this._readListItem;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._subject,
            this._predicate,
            this._graph = this._factory.blankNode()
          );
          return this._readSubject;
        case "<<":
          if (!this._supportsRDFStar)
            return this._error("Unexpected RDF-star syntax", token);
          this._saveContext("<<", this._graph, this._subject, this._predicate, null);
          this._graph = null;
          return this._readSubject;
        default:
          if ((this._object = this._readEntity(token)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._getContextEndReader());
      }
      return this._getContextEndReader();
    }
    // ### `_readPredicateOrNamedGraph` reads a quad's predicate, or a named graph
    _readPredicateOrNamedGraph(token) {
      return token.type === "{" ? this._readGraph(token) : this._readPredicate(token);
    }
    // ### `_readGraph` reads a graph
    _readGraph(token) {
      if (token.type !== "{")
        return this._error(`Expected graph but got ${token.type}`, token);
      this._graph = this._subject, this._subject = null;
      return this._readSubject;
    }
    // ### `_readBlankNodeHead` reads the head of a blank node
    _readBlankNodeHead(token) {
      if (token.type === "]") {
        this._subject = null;
        return this._readBlankNodeTail(token);
      } else {
        this._predicate = null;
        return this._readPredicate(token);
      }
    }
    // ### `_readBlankNodeTail` reads the end of a blank node
    _readBlankNodeTail(token) {
      if (token.type !== "]")
        return this._readBlankNodePunctuation(token);
      if (this._subject !== null)
        this._emit(this._subject, this._predicate, this._object, this._graph);
      const empty = this._predicate === null;
      this._restoreContext("blank", token);
      if (this._object !== null)
        return this._getContextEndReader();
      else if (this._predicate !== null)
        return this._readObject;
      else
        return empty ? this._readPredicateOrNamedGraph : this._readPredicateAfterBlank;
    }
    // ### `_readPredicateAfterBlank` reads a predicate after an anonymous blank node
    _readPredicateAfterBlank(token) {
      switch (token.type) {
        case ".":
        case "}":
          this._subject = null;
          return this._readPunctuation(token);
        default:
          return this._readPredicate(token);
      }
    }
    // ### `_readListItem` reads items from a list
    _readListItem(token) {
      let item = null, list = null, next = this._readListItem;
      const previousList = this._subject, stack = this._contextStack, parent = stack[stack.length - 1];
      switch (token.type) {
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            list = this._factory.blankNode(),
            this.RDF_FIRST,
            this._subject = item = this._factory.blankNode()
          );
          next = this._readBlankNodeHead;
          break;
        case "(":
          this._saveContext(
            "list",
            this._graph,
            list = this._factory.blankNode(),
            this.RDF_FIRST,
            this.RDF_NIL
          );
          this._subject = null;
          break;
        case ")":
          this._restoreContext("list", token);
          if (stack.length !== 0 && stack[stack.length - 1].type === "list")
            this._emit(this._subject, this._predicate, this._object, this._graph);
          if (this._predicate === null) {
            next = this._readPredicate;
            if (this._subject === this.RDF_NIL)
              return next;
          } else {
            next = this._getContextEndReader();
            if (this._object === this.RDF_NIL)
              return next;
          }
          list = this.RDF_NIL;
          break;
        case "literal":
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            next = this._readListItemDataTypeOrLang;
          } else {
            item = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
            next = this._getContextEndReader();
          }
          break;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._subject,
            this._predicate,
            this._graph = this._factory.blankNode()
          );
          return this._readSubject;
        default:
          if ((item = this._readEntity(token)) === void 0)
            return;
      }
      if (list === null)
        this._subject = list = this._factory.blankNode();
      if (previousList === null) {
        if (parent.predicate === null)
          parent.subject = list;
        else
          parent.object = list;
      } else {
        this._emit(previousList, this.RDF_REST, list, this._graph);
      }
      if (item !== null) {
        if (this._n3Mode && (token.type === "IRI" || token.type === "prefixed")) {
          this._saveContext("item", this._graph, list, this.RDF_FIRST, item);
          this._subject = item, this._predicate = null;
          return this._getPathReader(this._readListItem);
        }
        this._emit(list, this.RDF_FIRST, item, this._graph);
      }
      return next;
    }
    // ### `_readDataTypeOrLang` reads an _optional_ datatype or language
    _readDataTypeOrLang(token) {
      return this._completeObjectLiteral(token, false);
    }
    // ### `_readListItemDataTypeOrLang` reads an _optional_ datatype or language in a list
    _readListItemDataTypeOrLang(token) {
      return this._completeObjectLiteral(token, true);
    }
    // ### `_completeLiteral` completes a literal with an optional datatype or language
    _completeLiteral(token) {
      let literal2 = this._factory.literal(this._literalValue);
      switch (token.type) {
        case "type":
        case "typeIRI":
          const datatype = this._readEntity(token);
          if (datatype === void 0)
            return;
          literal2 = this._factory.literal(this._literalValue, datatype);
          token = null;
          break;
        case "langcode":
          literal2 = this._factory.literal(this._literalValue, token.value);
          token = null;
          break;
      }
      return { token, literal: literal2 };
    }
    // Completes a literal in subject position
    _completeSubjectLiteral(token) {
      this._subject = this._completeLiteral(token).literal;
      return this._readPredicateOrNamedGraph;
    }
    // Completes a literal in object position
    _completeObjectLiteral(token, listItem) {
      const completed = this._completeLiteral(token);
      if (!completed)
        return;
      this._object = completed.literal;
      if (listItem)
        this._emit(this._subject, this.RDF_FIRST, this._object, this._graph);
      if (completed.token === null)
        return this._getContextEndReader();
      else {
        this._readCallback = this._getContextEndReader();
        return this._readCallback(completed.token);
      }
    }
    // ### `_readFormulaTail` reads the end of a formula
    _readFormulaTail(token) {
      if (token.type !== "}")
        return this._readPunctuation(token);
      if (this._subject !== null)
        this._emit(this._subject, this._predicate, this._object, this._graph);
      this._restoreContext("formula", token);
      return this._object === null ? this._readPredicate : this._getContextEndReader();
    }
    // ### `_readPunctuation` reads punctuation between quads or quad parts
    _readPunctuation(token) {
      let next, graph = this._graph;
      const subject = this._subject, inversePredicate = this._inversePredicate;
      switch (token.type) {
        case "}":
          if (this._graph === null)
            return this._error("Unexpected graph closing", token);
          if (this._n3Mode)
            return this._readFormulaTail(token);
          this._graph = null;
        case ".":
          this._subject = null;
          next = this._contextStack.length ? this._readSubject : this._readInTopContext;
          if (inversePredicate)
            this._inversePredicate = false;
          break;
        case ";":
          next = this._readPredicate;
          break;
        case ",":
          next = this._readObject;
          break;
        case "{|":
          if (!this._supportsRDFStar)
            return this._error("Unexpected RDF-star syntax", token);
          const predicate = this._predicate, object = this._object;
          this._subject = this._factory.quad(subject, predicate, object, this.DEFAULTGRAPH);
          next = this._readPredicate;
          break;
        case "|}":
          if (this._subject.termType !== "Quad")
            return this._error("Unexpected asserted triple closing", token);
          this._subject = null;
          next = this._readPunctuation;
          break;
        default:
          if (this._supportsQuads && this._graph === null && (graph = this._readEntity(token)) !== void 0) {
            next = this._readQuadPunctuation;
            break;
          }
          return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
      }
      if (subject !== null) {
        const predicate = this._predicate, object = this._object;
        if (!inversePredicate)
          this._emit(subject, predicate, object, graph);
        else
          this._emit(object, predicate, subject, graph);
      }
      return next;
    }
    // ### `_readBlankNodePunctuation` reads punctuation in a blank node
    _readBlankNodePunctuation(token) {
      let next;
      switch (token.type) {
        case ";":
          next = this._readPredicate;
          break;
        case ",":
          next = this._readObject;
          break;
        default:
          return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
      }
      this._emit(this._subject, this._predicate, this._object, this._graph);
      return next;
    }
    // ### `_readQuadPunctuation` reads punctuation after a quad
    _readQuadPunctuation(token) {
      if (token.type !== ".")
        return this._error("Expected dot to follow quad", token);
      return this._readInTopContext;
    }
    // ### `_readPrefix` reads the prefix of a prefix declaration
    _readPrefix(token) {
      if (token.type !== "prefix")
        return this._error("Expected prefix to follow @prefix", token);
      this._prefix = token.value;
      return this._readPrefixIRI;
    }
    // ### `_readPrefixIRI` reads the IRI of a prefix declaration
    _readPrefixIRI(token) {
      if (token.type !== "IRI")
        return this._error(`Expected IRI to follow prefix "${this._prefix}:"`, token);
      const prefixNode = this._readEntity(token);
      this._prefixes[this._prefix] = prefixNode.value;
      this._prefixCallback(this._prefix, prefixNode);
      return this._readDeclarationPunctuation;
    }
    // ### `_readBaseIRI` reads the IRI of a base declaration
    _readBaseIRI(token) {
      const iri = token.type === "IRI" && this._resolveIRI(token.value);
      if (!iri)
        return this._error("Expected valid IRI to follow base declaration", token);
      this._setBase(iri);
      return this._readDeclarationPunctuation;
    }
    // ### `_readNamedGraphLabel` reads the label of a named graph
    _readNamedGraphLabel(token) {
      switch (token.type) {
        case "IRI":
        case "blank":
        case "prefixed":
          return this._readSubject(token), this._readGraph;
        case "[":
          return this._readNamedGraphBlankLabel;
        default:
          return this._error("Invalid graph label", token);
      }
    }
    // ### `_readNamedGraphLabel` reads a blank node label of a named graph
    _readNamedGraphBlankLabel(token) {
      if (token.type !== "]")
        return this._error("Invalid graph label", token);
      this._subject = this._factory.blankNode();
      return this._readGraph;
    }
    // ### `_readDeclarationPunctuation` reads the punctuation of a declaration
    _readDeclarationPunctuation(token) {
      if (this._sparqlStyle) {
        this._sparqlStyle = false;
        return this._readInTopContext(token);
      }
      if (token.type !== ".")
        return this._error("Expected declaration to end with a dot", token);
      return this._readInTopContext;
    }
    // Reads a list of quantified symbols from a @forSome or @forAll statement
    _readQuantifierList(token) {
      let entity;
      switch (token.type) {
        case "IRI":
        case "prefixed":
          if ((entity = this._readEntity(token, true)) !== void 0)
            break;
        default:
          return this._error(`Unexpected ${token.type}`, token);
      }
      if (!this._explicitQuantifiers)
        this._quantified[entity.id] = this._factory[this._quantifier](this._factory.blankNode().value);
      else {
        if (this._subject === null)
          this._emit(
            this._graph || this.DEFAULTGRAPH,
            this._predicate,
            this._subject = this._factory.blankNode(),
            this.QUANTIFIERS_GRAPH
          );
        else
          this._emit(
            this._subject,
            this.RDF_REST,
            this._subject = this._factory.blankNode(),
            this.QUANTIFIERS_GRAPH
          );
        this._emit(this._subject, this.RDF_FIRST, entity, this.QUANTIFIERS_GRAPH);
      }
      return this._readQuantifierPunctuation;
    }
    // Reads punctuation from a @forSome or @forAll statement
    _readQuantifierPunctuation(token) {
      if (token.type === ",")
        return this._readQuantifierList;
      else {
        if (this._explicitQuantifiers) {
          this._emit(this._subject, this.RDF_REST, this.RDF_NIL, this.QUANTIFIERS_GRAPH);
          this._subject = null;
        }
        this._readCallback = this._getContextEndReader();
        return this._readCallback(token);
      }
    }
    // ### `_getPathReader` reads a potential path and then resumes with the given function
    _getPathReader(afterPath) {
      this._afterPath = afterPath;
      return this._readPath;
    }
    // ### `_readPath` reads a potential path
    _readPath(token) {
      switch (token.type) {
        case "!":
          return this._readForwardPath;
        case "^":
          return this._readBackwardPath;
        default:
          const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
          if (parent && parent.type === "item") {
            const item = this._subject;
            this._restoreContext("item", token);
            this._emit(this._subject, this.RDF_FIRST, item, this._graph);
          }
          return this._afterPath(token);
      }
    }
    // ### `_readForwardPath` reads a '!' path
    _readForwardPath(token) {
      let subject, predicate;
      const object = this._factory.blankNode();
      if ((predicate = this._readEntity(token)) === void 0)
        return;
      if (this._predicate === null)
        subject = this._subject, this._subject = object;
      else
        subject = this._object, this._object = object;
      this._emit(subject, predicate, object, this._graph);
      return this._readPath;
    }
    // ### `_readBackwardPath` reads a '^' path
    _readBackwardPath(token) {
      const subject = this._factory.blankNode();
      let predicate, object;
      if ((predicate = this._readEntity(token)) === void 0)
        return;
      if (this._predicate === null)
        object = this._subject, this._subject = subject;
      else
        object = this._object, this._object = subject;
      this._emit(subject, predicate, object, this._graph);
      return this._readPath;
    }
    // ### `_readRDFStarTailOrGraph` reads the graph of a nested RDF-star quad or the end of a nested RDF-star triple
    _readRDFStarTailOrGraph(token) {
      if (token.type !== ">>") {
        if (this._supportsQuads && this._graph === null && (this._graph = this._readEntity(token)) !== void 0)
          return this._readRDFStarTail;
        return this._error(`Expected >> to follow "${this._object.id}"`, token);
      }
      return this._readRDFStarTail(token);
    }
    // ### `_readRDFStarTail` reads the end of a nested RDF-star triple
    _readRDFStarTail(token) {
      if (token.type !== ">>")
        return this._error(`Expected >> but got ${token.type}`, token);
      const quad2 = this._factory.quad(
        this._subject,
        this._predicate,
        this._object,
        this._graph || this.DEFAULTGRAPH
      );
      this._restoreContext("<<", token);
      if (this._subject === null) {
        this._subject = quad2;
        return this._readPredicate;
      } else {
        this._object = quad2;
        return this._getContextEndReader();
      }
    }
    // ### `_getContextEndReader` gets the next reader function at the end of a context
    _getContextEndReader() {
      const contextStack = this._contextStack;
      if (!contextStack.length)
        return this._readPunctuation;
      switch (contextStack[contextStack.length - 1].type) {
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
    // ### `_emit` sends a quad through the callback
    _emit(subject, predicate, object, graph) {
      this._callback(null, this._factory.quad(subject, predicate, object, graph || this.DEFAULTGRAPH));
    }
    // ### `_error` emits an error message through the callback
    _error(message, token) {
      const err = new Error(`${message} on line ${token.line}.`);
      err.context = {
        token,
        line: token.line,
        previousToken: this._lexer.previousToken
      };
      this._callback(err);
      this._callback = noop;
    }
    // ### `_resolveIRI` resolves an IRI against the base path
    _resolveIRI(iri) {
      return /^[a-z][a-z0-9+.-]*:/i.test(iri) ? iri : this._resolveRelativeIRI(iri);
    }
    // ### `_resolveRelativeIRI` resolves an IRI against the base path,
    // assuming that a base path has been set and that the IRI is indeed relative
    _resolveRelativeIRI(iri) {
      if (!iri.length)
        return this._base;
      switch (iri[0]) {
        case "#":
          return this._base + iri;
        case "?":
          return this._base.replace(/(?:\?.*)?$/, iri);
        case "/":
          return (iri[1] === "/" ? this._baseScheme : this._baseRoot) + this._removeDotSegments(iri);
        default:
          return /^[^/:]*:/.test(iri) ? null : this._removeDotSegments(this._basePath + iri);
      }
    }
    // ### `_removeDotSegments` resolves './' and '../' path segments in an IRI as per RFC3986
    _removeDotSegments(iri) {
      if (!/(^|\/)\.\.?($|[/#?])/.test(iri))
        return iri;
      const length = iri.length;
      let result2 = "", i = -1, pathStart = -1, segmentStart = 0, next = "/";
      while (i < length) {
        switch (next) {
          case ":":
            if (pathStart < 0) {
              if (iri[++i] === "/" && iri[++i] === "/")
                while ((pathStart = i + 1) < length && iri[pathStart] !== "/")
                  i = pathStart;
            }
            break;
          case "?":
          case "#":
            i = length;
            break;
          case "/":
            if (iri[i + 1] === ".") {
              next = iri[++i + 1];
              switch (next) {
                case "/":
                  result2 += iri.substring(segmentStart, i - 1);
                  segmentStart = i + 1;
                  break;
                case void 0:
                case "?":
                case "#":
                  return result2 + iri.substring(segmentStart, i) + iri.substr(i + 1);
                case ".":
                  next = iri[++i + 1];
                  if (next === void 0 || next === "/" || next === "?" || next === "#") {
                    result2 += iri.substring(segmentStart, i - 2);
                    if ((segmentStart = result2.lastIndexOf("/")) >= pathStart)
                      result2 = result2.substr(0, segmentStart);
                    if (next !== "/")
                      return `${result2}/${iri.substr(i + 1)}`;
                    segmentStart = i + 1;
                  }
              }
            }
        }
        next = iri[++i];
      }
      return result2 + iri.substring(segmentStart);
    }
    // ## Public methods
    // ### `parse` parses the N3 input and emits each parsed quad through the onQuad callback.
    parse(input, quadCallback, prefixCallback) {
      let onQuad, onPrefix, onComment;
      if (quadCallback && (quadCallback.onQuad || quadCallback.onPrefix || quadCallback.onComment)) {
        onQuad = quadCallback.onQuad;
        onPrefix = quadCallback.onPrefix;
        onComment = quadCallback.onComment;
      } else {
        onQuad = quadCallback;
        onPrefix = prefixCallback;
      }
      this._readCallback = this._readInTopContext;
      this._sparqlStyle = false;
      this._prefixes = /* @__PURE__ */ Object.create(null);
      this._prefixes._ = this._blankNodePrefix ? this._blankNodePrefix.substr(2) : `b${blankNodePrefix++}_`;
      this._prefixCallback = onPrefix || noop;
      this._inversePredicate = false;
      this._quantified = /* @__PURE__ */ Object.create(null);
      if (!onQuad) {
        const quads = [];
        let error4;
        this._callback = (e, t) => {
          e ? error4 = e : t && quads.push(t);
        };
        this._lexer.tokenize(input).every((token) => {
          return this._readCallback = this._readCallback(token);
        });
        if (error4)
          throw error4;
        return quads;
      }
      let processNextToken = (error4, token) => {
        if (error4 !== null)
          this._callback(error4), this._callback = noop;
        else if (this._readCallback)
          this._readCallback = this._readCallback(token);
      };
      if (onComment) {
        this._lexer.comments = true;
        processNextToken = (error4, token) => {
          if (error4 !== null)
            this._callback(error4), this._callback = noop;
          else if (this._readCallback) {
            if (token.type === "comment")
              onComment(token.value);
            else
              this._readCallback = this._readCallback(token);
          }
        };
      }
      this._callback = onQuad;
      this._lexer.tokenize(input, processNextToken);
    }
  };
  function noop() {
  }
  function initDataFactory(parser, factory) {
    parser._factory = factory;
    parser.DEFAULTGRAPH = factory.defaultGraph();
    parser.RDF_FIRST = factory.namedNode(IRIs_default.rdf.first);
    parser.RDF_REST = factory.namedNode(IRIs_default.rdf.rest);
    parser.RDF_NIL = factory.namedNode(IRIs_default.rdf.nil);
    parser.N3_FORALL = factory.namedNode(IRIs_default.r.forAll);
    parser.N3_FORSOME = factory.namedNode(IRIs_default.r.forSome);
    parser.ABBREVIATIONS = {
      "a": factory.namedNode(IRIs_default.rdf.type),
      "=": factory.namedNode(IRIs_default.owl.sameAs),
      ">": factory.namedNode(IRIs_default.log.implies)
    };
    parser.QUANTIFIERS_GRAPH = factory.namedNode("urn:n3:quantifiers");
  }
  initDataFactory(N3Parser.prototype, N3DataFactory_default);
  var N3Util_exports = {};
  __export2(N3Util_exports, {
    inDefaultGraph: () => inDefaultGraph,
    isBlankNode: () => isBlankNode,
    isDefaultGraph: () => isDefaultGraph,
    isLiteral: () => isLiteral,
    isNamedNode: () => isNamedNode,
    isVariable: () => isVariable,
    prefix: () => prefix,
    prefixes: () => prefixes2
  });
  function isNamedNode(term) {
    return !!term && term.termType === "NamedNode";
  }
  function isBlankNode(term) {
    return !!term && term.termType === "BlankNode";
  }
  function isLiteral(term) {
    return !!term && term.termType === "Literal";
  }
  function isVariable(term) {
    return !!term && term.termType === "Variable";
  }
  function isDefaultGraph(term) {
    return !!term && term.termType === "DefaultGraph";
  }
  function inDefaultGraph(quad2) {
    return isDefaultGraph(quad2.graph);
  }
  function prefix(iri, factory) {
    return prefixes2({ "": iri.value || iri }, factory)("");
  }
  function prefixes2(defaultPrefixes, factory) {
    const prefixes3 = /* @__PURE__ */ Object.create(null);
    for (const prefix2 in defaultPrefixes)
      processPrefix(prefix2, defaultPrefixes[prefix2]);
    factory = factory || N3DataFactory_default;
    function processPrefix(prefix2, iri) {
      if (typeof iri === "string") {
        const cache = /* @__PURE__ */ Object.create(null);
        prefixes3[prefix2] = (local) => {
          return cache[local] || (cache[local] = factory.namedNode(iri + local));
        };
      } else if (!(prefix2 in prefixes3)) {
        throw new Error(`Unknown prefix: ${prefix2}`);
      }
      return prefixes3[prefix2];
    }
    return processPrefix;
  }
  var DEFAULTGRAPH2 = N3DataFactory_default.defaultGraph();
  var { rdf: rdf2, xsd: xsd3 } = IRIs_default;
  var escape = /["\\\t\n\r\b\f\u0000-\u0019\ud800-\udbff]/;
  var escapeAll = /["\\\t\n\r\b\f\u0000-\u0019]|[\ud800-\udbff][\udc00-\udfff]/g;
  var escapedCharacters = {
    "\\": "\\\\",
    '"': '\\"',
    "	": "\\t",
    "\n": "\\n",
    "\r": "\\r",
    "\b": "\\b",
    "\f": "\\f"
  };
  var SerializedTerm = class extends Term {
    // Pretty-printed nodes are not equal to any other node
    // (e.g., [] does not equal [])
    equals(other) {
      return other === this;
    }
  };
  var N3Writer = class {
    constructor(outputStream, options) {
      this._prefixRegex = /$0^/;
      if (outputStream && typeof outputStream.write !== "function")
        options = outputStream, outputStream = null;
      options = options || {};
      this._lists = options.lists;
      if (!outputStream) {
        let output = "";
        this._outputStream = {
          write(chunk, encoding, done) {
            output += chunk;
            done && done();
          },
          end: (done) => {
            done && done(null, output);
          }
        };
        this._endStream = true;
      } else {
        this._outputStream = outputStream;
        this._endStream = options.end === void 0 ? true : !!options.end;
      }
      this._subject = null;
      if (!/triple|quad/i.test(options.format)) {
        this._lineMode = false;
        this._graph = DEFAULTGRAPH2;
        this._prefixIRIs = /* @__PURE__ */ Object.create(null);
        options.prefixes && this.addPrefixes(options.prefixes);
        if (options.baseIRI) {
          this._baseMatcher = new RegExp(`^${escapeRegex(options.baseIRI)}${options.baseIRI.endsWith("/") ? "" : "[#?]"}`);
          this._baseLength = options.baseIRI.length;
        }
      } else {
        this._lineMode = true;
        this._writeQuad = this._writeQuadLine;
      }
    }
    // ## Private methods
    // ### Whether the current graph is the default graph
    get _inDefaultGraph() {
      return DEFAULTGRAPH2.equals(this._graph);
    }
    // ### `_write` writes the argument to the output stream
    _write(string, callback) {
      this._outputStream.write(string, "utf8", callback);
    }
    // ### `_writeQuad` writes the quad to the output stream
    _writeQuad(subject, predicate, object, graph, done) {
      try {
        if (!graph.equals(this._graph)) {
          this._write((this._subject === null ? "" : this._inDefaultGraph ? ".\n" : "\n}\n") + (DEFAULTGRAPH2.equals(graph) ? "" : `${this._encodeIriOrBlank(graph)} {
`));
          this._graph = graph;
          this._subject = null;
        }
        if (subject.equals(this._subject)) {
          if (predicate.equals(this._predicate))
            this._write(`, ${this._encodeObject(object)}`, done);
          else
            this._write(`;
    ${this._encodePredicate(this._predicate = predicate)} ${this._encodeObject(object)}`, done);
        } else
          this._write(`${(this._subject === null ? "" : ".\n") + this._encodeSubject(this._subject = subject)} ${this._encodePredicate(this._predicate = predicate)} ${this._encodeObject(object)}`, done);
      } catch (error4) {
        done && done(error4);
      }
    }
    // ### `_writeQuadLine` writes the quad to the output stream as a single line
    _writeQuadLine(subject, predicate, object, graph, done) {
      delete this._prefixMatch;
      this._write(this.quadToString(subject, predicate, object, graph), done);
    }
    // ### `quadToString` serializes a quad as a string
    quadToString(subject, predicate, object, graph) {
      return `${this._encodeSubject(subject)} ${this._encodeIriOrBlank(predicate)} ${this._encodeObject(object)}${graph && graph.value ? ` ${this._encodeIriOrBlank(graph)} .
` : " .\n"}`;
    }
    // ### `quadsToString` serializes an array of quads as a string
    quadsToString(quads) {
      let quadsString = "";
      for (const quad2 of quads)
        quadsString += this.quadToString(quad2.subject, quad2.predicate, quad2.object, quad2.graph);
      return quadsString;
    }
    // ### `_encodeSubject` represents a subject
    _encodeSubject(entity) {
      return entity.termType === "Quad" ? this._encodeQuad(entity) : this._encodeIriOrBlank(entity);
    }
    // ### `_encodeIriOrBlank` represents an IRI or blank node
    _encodeIriOrBlank(entity) {
      if (entity.termType !== "NamedNode") {
        if (this._lists && entity.value in this._lists)
          entity = this.list(this._lists[entity.value]);
        return "id" in entity ? entity.id : `_:${entity.value}`;
      }
      let iri = entity.value;
      if (this._baseMatcher && this._baseMatcher.test(iri))
        iri = iri.substr(this._baseLength);
      if (escape.test(iri))
        iri = iri.replace(escapeAll, characterReplacer);
      const prefixMatch = this._prefixRegex.exec(iri);
      return !prefixMatch ? `<${iri}>` : !prefixMatch[1] ? iri : this._prefixIRIs[prefixMatch[1]] + prefixMatch[2];
    }
    // ### `_encodeLiteral` represents a literal
    _encodeLiteral(literal2) {
      let value = literal2.value;
      if (escape.test(value))
        value = value.replace(escapeAll, characterReplacer);
      if (literal2.language)
        return `"${value}"@${literal2.language}`;
      if (this._lineMode) {
        if (literal2.datatype.value === xsd3.string)
          return `"${value}"`;
      } else {
        switch (literal2.datatype.value) {
          case xsd3.string:
            return `"${value}"`;
          case xsd3.boolean:
            if (value === "true" || value === "false")
              return value;
            break;
          case xsd3.integer:
            if (/^[+-]?\d+$/.test(value))
              return value;
            break;
          case xsd3.decimal:
            if (/^[+-]?\d*\.\d+$/.test(value))
              return value;
            break;
          case xsd3.double:
            if (/^[+-]?(?:\d+\.\d*|\.?\d+)[eE][+-]?\d+$/.test(value))
              return value;
            break;
        }
      }
      return `"${value}"^^${this._encodeIriOrBlank(literal2.datatype)}`;
    }
    // ### `_encodePredicate` represents a predicate
    _encodePredicate(predicate) {
      return predicate.value === rdf2.type ? "a" : this._encodeIriOrBlank(predicate);
    }
    // ### `_encodeObject` represents an object
    _encodeObject(object) {
      switch (object.termType) {
        case "Quad":
          return this._encodeQuad(object);
        case "Literal":
          return this._encodeLiteral(object);
        default:
          return this._encodeIriOrBlank(object);
      }
    }
    // ### `_encodeQuad` encodes an RDF-star quad
    _encodeQuad({ subject, predicate, object, graph }) {
      return `<<${this._encodeSubject(subject)} ${this._encodePredicate(predicate)} ${this._encodeObject(object)}${isDefaultGraph(graph) ? "" : ` ${this._encodeIriOrBlank(graph)}`}>>`;
    }
    // ### `_blockedWrite` replaces `_write` after the writer has been closed
    _blockedWrite() {
      throw new Error("Cannot write because the writer has been closed.");
    }
    // ### `addQuad` adds the quad to the output stream
    addQuad(subject, predicate, object, graph, done) {
      if (object === void 0)
        this._writeQuad(subject.subject, subject.predicate, subject.object, subject.graph, predicate);
      else if (typeof graph === "function")
        this._writeQuad(subject, predicate, object, DEFAULTGRAPH2, graph);
      else
        this._writeQuad(subject, predicate, object, graph || DEFAULTGRAPH2, done);
    }
    // ### `addQuads` adds the quads to the output stream
    addQuads(quads) {
      for (let i = 0; i < quads.length; i++)
        this.addQuad(quads[i]);
    }
    // ### `addPrefix` adds the prefix to the output stream
    addPrefix(prefix2, iri, done) {
      const prefixes3 = {};
      prefixes3[prefix2] = iri;
      this.addPrefixes(prefixes3, done);
    }
    // ### `addPrefixes` adds the prefixes to the output stream
    addPrefixes(prefixes3, done) {
      if (!this._prefixIRIs)
        return done && done();
      let hasPrefixes = false;
      for (let prefix2 in prefixes3) {
        let iri = prefixes3[prefix2];
        if (typeof iri !== "string")
          iri = iri.value;
        hasPrefixes = true;
        if (this._subject !== null) {
          this._write(this._inDefaultGraph ? ".\n" : "\n}\n");
          this._subject = null, this._graph = "";
        }
        this._prefixIRIs[iri] = prefix2 += ":";
        this._write(`@prefix ${prefix2} <${iri}>.
`);
      }
      if (hasPrefixes) {
        let IRIlist = "", prefixList = "";
        for (const prefixIRI in this._prefixIRIs) {
          IRIlist += IRIlist ? `|${prefixIRI}` : prefixIRI;
          prefixList += (prefixList ? "|" : "") + this._prefixIRIs[prefixIRI];
        }
        IRIlist = escapeRegex(IRIlist, /[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&");
        this._prefixRegex = new RegExp(`^(?:${prefixList})[^/]*$|^(${IRIlist})([_a-zA-Z0-9][\\-_a-zA-Z0-9]*)$`);
      }
      this._write(hasPrefixes ? "\n" : "", done);
    }
    // ### `blank` creates a blank node with the given content
    blank(predicate, object) {
      let children = predicate, child, length;
      if (predicate === void 0)
        children = [];
      else if (predicate.termType)
        children = [{ predicate, object }];
      else if (!("length" in predicate))
        children = [predicate];
      switch (length = children.length) {
        case 0:
          return new SerializedTerm("[]");
        case 1:
          child = children[0];
          if (!(child.object instanceof SerializedTerm))
            return new SerializedTerm(`[ ${this._encodePredicate(child.predicate)} ${this._encodeObject(child.object)} ]`);
        default:
          let contents = "[";
          for (let i = 0; i < length; i++) {
            child = children[i];
            if (child.predicate.equals(predicate))
              contents += `, ${this._encodeObject(child.object)}`;
            else {
              contents += `${(i ? ";\n  " : "\n  ") + this._encodePredicate(child.predicate)} ${this._encodeObject(child.object)}`;
              predicate = child.predicate;
            }
          }
          return new SerializedTerm(`${contents}
]`);
      }
    }
    // ### `list` creates a list node with the given content
    list(elements) {
      const length = elements && elements.length || 0, contents = new Array(length);
      for (let i = 0; i < length; i++)
        contents[i] = this._encodeObject(elements[i]);
      return new SerializedTerm(`(${contents.join(" ")})`);
    }
    // ### `end` signals the end of the output stream
    end(done) {
      if (this._subject !== null) {
        this._write(this._inDefaultGraph ? ".\n" : "\n}\n");
        this._subject = null;
      }
      this._write = this._blockedWrite;
      let singleDone = done && ((error4, result2) => {
        singleDone = null, done(error4, result2);
      });
      if (this._endStream) {
        try {
          return this._outputStream.end(singleDone);
        } catch (error4) {
        }
      }
      singleDone && singleDone();
    }
  };
  function characterReplacer(character) {
    let result2 = escapedCharacters[character];
    if (result2 === void 0) {
      if (character.length === 1) {
        result2 = character.charCodeAt(0).toString(16);
        result2 = "\\u0000".substr(0, 6 - result2.length) + result2;
      } else {
        result2 = ((character.charCodeAt(0) - 55296) * 1024 + character.charCodeAt(1) + 9216).toString(16);
        result2 = "\\U00000000".substr(0, 10 - result2.length) + result2;
      }
    }
    return result2;
  }
  function escapeRegex(regex) {
    return regex.replace(/[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&");
  }
  var import_readable_stream = __toESM(require_browser3());
  var ITERATOR = Symbol("iter");
  function merge(target, source, depth = 4) {
    if (depth === 0)
      return Object.assign(target, source);
    for (const key in source)
      target[key] = merge(target[key] || /* @__PURE__ */ Object.create(null), source[key], depth - 1);
    return target;
  }
  function intersect(s1, s2, depth = 4) {
    let target = false;
    for (const key in s1) {
      if (key in s2) {
        const intersection = depth === 0 ? null : intersect(s1[key], s2[key], depth - 1);
        if (intersection !== false) {
          target = target || /* @__PURE__ */ Object.create(null);
          target[key] = intersection;
        } else if (depth === 3) {
          return false;
        }
      }
    }
    return target;
  }
  function difference(s1, s2, depth = 4) {
    let target = false;
    for (const key in s1) {
      if (!(key in s2)) {
        target = target || /* @__PURE__ */ Object.create(null);
        target[key] = depth === 0 ? null : merge({}, s1[key], depth - 1);
      } else if (depth !== 0) {
        const diff = difference(s1[key], s2[key], depth - 1);
        if (diff !== false) {
          target = target || /* @__PURE__ */ Object.create(null);
          target[key] = diff;
        } else if (depth === 3) {
          return false;
        }
      }
    }
    return target;
  }
  var N3EntityIndex = class {
    constructor(options = {}) {
      this._id = 1;
      this._ids = /* @__PURE__ */ Object.create(null);
      this._ids[""] = 1;
      this._entities = /* @__PURE__ */ Object.create(null);
      this._entities[1] = "";
      this._blankNodeIndex = 0;
      this._factory = options.factory || N3DataFactory_default;
    }
    _termFromId(id2) {
      if (id2[0] === ".") {
        const entities = this._entities;
        const terms = id2.split(".");
        const q = this._factory.quad(
          this._termFromId(entities[terms[1]]),
          this._termFromId(entities[terms[2]]),
          this._termFromId(entities[terms[3]]),
          terms[4] && this._termFromId(entities[terms[4]])
        );
        return q;
      }
      return termFromId(id2, this._factory);
    }
    _termToNumericId(term) {
      if (term.termType === "Quad") {
        const s = this._termToNumericId(term.subject), p = this._termToNumericId(term.predicate), o = this._termToNumericId(term.object);
        let g;
        return s && p && o && (isDefaultGraph(term.graph) || (g = this._termToNumericId(term.graph))) && this._ids[g ? `.${s}.${p}.${o}.${g}` : `.${s}.${p}.${o}`];
      }
      return this._ids[termToId(term)];
    }
    _termToNewNumericId(term) {
      const str = term && term.termType === "Quad" ? `.${this._termToNewNumericId(term.subject)}.${this._termToNewNumericId(term.predicate)}.${this._termToNewNumericId(term.object)}${isDefaultGraph(term.graph) ? "" : `.${this._termToNewNumericId(term.graph)}`}` : termToId(term);
      return this._ids[str] || (this._ids[this._entities[++this._id] = str] = this._id);
    }
    createBlankNode(suggestedName) {
      let name, index;
      if (suggestedName) {
        name = suggestedName = `_:${suggestedName}`, index = 1;
        while (this._ids[name])
          name = suggestedName + index++;
      } else {
        do {
          name = `_:b${this._blankNodeIndex++}`;
        } while (this._ids[name]);
      }
      this._ids[name] = ++this._id;
      this._entities[this._id] = name;
      return this._factory.blankNode(name.substr(2));
    }
  };
  var N3Store = class _N3Store {
    constructor(quads, options) {
      this._size = 0;
      this._graphs = /* @__PURE__ */ Object.create(null);
      if (!options && quads && !quads[0])
        options = quads, quads = null;
      options = options || {};
      this._factory = options.factory || N3DataFactory_default;
      this._entityIndex = options.entityIndex || new N3EntityIndex({ factory: this._factory });
      this._entities = this._entityIndex._entities;
      this._termFromId = this._entityIndex._termFromId.bind(this._entityIndex);
      this._termToNumericId = this._entityIndex._termToNumericId.bind(this._entityIndex);
      this._termToNewNumericId = this._entityIndex._termToNewNumericId.bind(this._entityIndex);
      if (quads)
        this.addQuads(quads);
    }
    // ## Public properties
    // ### `size` returns the number of quads in the store
    get size() {
      let size = this._size;
      if (size !== null)
        return size;
      size = 0;
      const graphs = this._graphs;
      let subjects, subject;
      for (const graphKey in graphs)
        for (const subjectKey in subjects = graphs[graphKey].subjects)
          for (const predicateKey in subject = subjects[subjectKey])
            size += Object.keys(subject[predicateKey]).length;
      return this._size = size;
    }
    // ## Private methods
    // ### `_addToIndex` adds a quad to a three-layered index.
    // Returns if the index has changed, if the entry did not already exist.
    _addToIndex(index0, key0, key1, key2) {
      const index1 = index0[key0] || (index0[key0] = {});
      const index2 = index1[key1] || (index1[key1] = {});
      const existed = key2 in index2;
      if (!existed)
        index2[key2] = null;
      return !existed;
    }
    // ### `_removeFromIndex` removes a quad from a three-layered index
    _removeFromIndex(index0, key0, key1, key2) {
      const index1 = index0[key0], index2 = index1[key1];
      delete index2[key2];
      for (const key in index2)
        return;
      delete index1[key1];
      for (const key in index1)
        return;
      delete index0[key0];
    }
    // ### `_findInIndex` finds a set of quads in a three-layered index.
    // The index base is `index0` and the keys at each level are `key0`, `key1`, and `key2`.
    // Any of these keys can be undefined, which is interpreted as a wildcard.
    // `name0`, `name1`, and `name2` are the names of the keys at each level,
    // used when reconstructing the resulting quad
    // (for instance: _subject_, _predicate_, and _object_).
    // Finally, `graphId` will be the graph of the created quads.
    *_findInIndex(index0, key0, key1, key2, name0, name1, name2, graphId) {
      let tmp, index1, index2;
      const entityKeys = this._entities;
      const graph = this._termFromId(entityKeys[graphId]);
      const parts = { subject: null, predicate: null, object: null };
      if (key0)
        (tmp = index0, index0 = {})[key0] = tmp[key0];
      for (const value0 in index0) {
        if (index1 = index0[value0]) {
          parts[name0] = this._termFromId(entityKeys[value0]);
          if (key1)
            (tmp = index1, index1 = {})[key1] = tmp[key1];
          for (const value1 in index1) {
            if (index2 = index1[value1]) {
              parts[name1] = this._termFromId(entityKeys[value1]);
              const values = key2 ? key2 in index2 ? [key2] : [] : Object.keys(index2);
              for (let l = 0; l < values.length; l++) {
                parts[name2] = this._termFromId(entityKeys[values[l]]);
                yield this._factory.quad(parts.subject, parts.predicate, parts.object, graph);
              }
            }
          }
        }
      }
    }
    // ### `_loop` executes the callback on all keys of index 0
    _loop(index0, callback) {
      for (const key0 in index0)
        callback(key0);
    }
    // ### `_loopByKey0` executes the callback on all keys of a certain entry in index 0
    _loopByKey0(index0, key0, callback) {
      let index1, key1;
      if (index1 = index0[key0]) {
        for (key1 in index1)
          callback(key1);
      }
    }
    // ### `_loopByKey1` executes the callback on given keys of all entries in index 0
    _loopByKey1(index0, key1, callback) {
      let key0, index1;
      for (key0 in index0) {
        index1 = index0[key0];
        if (index1[key1])
          callback(key0);
      }
    }
    // ### `_loopBy2Keys` executes the callback on given keys of certain entries in index 2
    _loopBy2Keys(index0, key0, key1, callback) {
      let index1, index2, key2;
      if ((index1 = index0[key0]) && (index2 = index1[key1])) {
        for (key2 in index2)
          callback(key2);
      }
    }
    // ### `_countInIndex` counts matching quads in a three-layered index.
    // The index base is `index0` and the keys at each level are `key0`, `key1`, and `key2`.
    // Any of these keys can be undefined, which is interpreted as a wildcard.
    _countInIndex(index0, key0, key1, key2) {
      let count = 0, tmp, index1, index2;
      if (key0)
        (tmp = index0, index0 = {})[key0] = tmp[key0];
      for (const value0 in index0) {
        if (index1 = index0[value0]) {
          if (key1)
            (tmp = index1, index1 = {})[key1] = tmp[key1];
          for (const value1 in index1) {
            if (index2 = index1[value1]) {
              if (key2)
                key2 in index2 && count++;
              else
                count += Object.keys(index2).length;
            }
          }
        }
      }
      return count;
    }
    // ### `_getGraphs` returns an array with the given graph,
    // or all graphs if the argument is null or undefined.
    _getGraphs(graph) {
      graph = graph === "" ? 1 : graph && (this._termToNumericId(graph) || -1);
      return typeof graph !== "number" ? this._graphs : { [graph]: this._graphs[graph] };
    }
    // ### `_uniqueEntities` returns a function that accepts an entity ID
    // and passes the corresponding entity to callback if it hasn't occurred before.
    _uniqueEntities(callback) {
      const uniqueIds = /* @__PURE__ */ Object.create(null);
      return (id2) => {
        if (!(id2 in uniqueIds)) {
          uniqueIds[id2] = true;
          callback(this._termFromId(this._entities[id2], this._factory));
        }
      };
    }
    // ## Public methods
    // ### `add` adds the specified quad to the dataset.
    // Returns the dataset instance it was called on.
    // Existing quads, as defined in Quad.equals, will be ignored.
    add(quad2) {
      this.addQuad(quad2);
      return this;
    }
    // ### `addQuad` adds a new quad to the store.
    // Returns if the quad index has changed, if the quad did not already exist.
    addQuad(subject, predicate, object, graph) {
      if (!predicate)
        graph = subject.graph, object = subject.object, predicate = subject.predicate, subject = subject.subject;
      graph = graph ? this._termToNewNumericId(graph) : 1;
      let graphItem = this._graphs[graph];
      if (!graphItem) {
        graphItem = this._graphs[graph] = { subjects: {}, predicates: {}, objects: {} };
        Object.freeze(graphItem);
      }
      subject = this._termToNewNumericId(subject);
      predicate = this._termToNewNumericId(predicate);
      object = this._termToNewNumericId(object);
      if (!this._addToIndex(graphItem.subjects, subject, predicate, object))
        return false;
      this._addToIndex(graphItem.predicates, predicate, object, subject);
      this._addToIndex(graphItem.objects, object, subject, predicate);
      this._size = null;
      return true;
    }
    // ### `addQuads` adds multiple quads to the store
    addQuads(quads) {
      for (let i = 0; i < quads.length; i++)
        this.addQuad(quads[i]);
    }
    // ### `delete` removes the specified quad from the dataset.
    // Returns the dataset instance it was called on.
    delete(quad2) {
      this.removeQuad(quad2);
      return this;
    }
    // ### `has` determines whether a dataset includes a certain quad or quad pattern.
    has(subjectOrQuad, predicate, object, graph) {
      if (subjectOrQuad && subjectOrQuad.subject)
        ({ subject: subjectOrQuad, predicate, object, graph } = subjectOrQuad);
      return !this.readQuads(subjectOrQuad, predicate, object, graph).next().done;
    }
    // ### `import` adds a stream of quads to the store
    import(stream) {
      stream.on("data", (quad2) => {
        this.addQuad(quad2);
      });
      return stream;
    }
    // ### `removeQuad` removes a quad from the store if it exists
    removeQuad(subject, predicate, object, graph) {
      if (!predicate)
        ({ subject, predicate, object, graph } = subject);
      graph = graph ? this._termToNumericId(graph) : 1;
      const graphs = this._graphs;
      let graphItem, subjects, predicates;
      if (!(subject = subject && this._termToNumericId(subject)) || !(predicate = predicate && this._termToNumericId(predicate)) || !(object = object && this._termToNumericId(object)) || !(graphItem = graphs[graph]) || !(subjects = graphItem.subjects[subject]) || !(predicates = subjects[predicate]) || !(object in predicates))
        return false;
      this._removeFromIndex(graphItem.subjects, subject, predicate, object);
      this._removeFromIndex(graphItem.predicates, predicate, object, subject);
      this._removeFromIndex(graphItem.objects, object, subject, predicate);
      if (this._size !== null)
        this._size--;
      for (subject in graphItem.subjects)
        return true;
      delete graphs[graph];
      return true;
    }
    // ### `removeQuads` removes multiple quads from the store
    removeQuads(quads) {
      for (let i = 0; i < quads.length; i++)
        this.removeQuad(quads[i]);
    }
    // ### `remove` removes a stream of quads from the store
    remove(stream) {
      stream.on("data", (quad2) => {
        this.removeQuad(quad2);
      });
      return stream;
    }
    // ### `removeMatches` removes all matching quads from the store
    // Setting any field to `undefined` or `null` indicates a wildcard.
    removeMatches(subject, predicate, object, graph) {
      const stream = new import_readable_stream.Readable({ objectMode: true });
      const iterable = this.readQuads(subject, predicate, object, graph);
      stream._read = (size) => {
        while (--size >= 0) {
          const { done, value } = iterable.next();
          if (done) {
            stream.push(null);
            return;
          }
          stream.push(value);
        }
      };
      return this.remove(stream);
    }
    // ### `deleteGraph` removes all triples with the given graph from the store
    deleteGraph(graph) {
      return this.removeMatches(null, null, null, graph);
    }
    // ### `getQuads` returns an array of quads matching a pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    getQuads(subject, predicate, object, graph) {
      return [...this.readQuads(subject, predicate, object, graph)];
    }
    /**
     * `readQuads` returns a generator of quads matching a pattern.
     * Setting any field to `undefined` or `null` indicates a wildcard.
     * @deprecated Use `match` instead.
     */
    *readQuads(subject, predicate, object, graph) {
      const graphs = this._getGraphs(graph);
      let content, subjectId, predicateId, objectId;
      if (subject && !(subjectId = this._termToNumericId(subject)) || predicate && !(predicateId = this._termToNumericId(predicate)) || object && !(objectId = this._termToNumericId(object)))
        return;
      for (const graphId in graphs) {
        if (content = graphs[graphId]) {
          if (subjectId) {
            if (objectId)
              yield* this._findInIndex(
                content.objects,
                objectId,
                subjectId,
                predicateId,
                "object",
                "subject",
                "predicate",
                graphId
              );
            else
              yield* this._findInIndex(
                content.subjects,
                subjectId,
                predicateId,
                null,
                "subject",
                "predicate",
                "object",
                graphId
              );
          } else if (predicateId)
            yield* this._findInIndex(
              content.predicates,
              predicateId,
              objectId,
              null,
              "predicate",
              "object",
              "subject",
              graphId
            );
          else if (objectId)
            yield* this._findInIndex(
              content.objects,
              objectId,
              null,
              null,
              "object",
              "subject",
              "predicate",
              graphId
            );
          else
            yield* this._findInIndex(
              content.subjects,
              null,
              null,
              null,
              "subject",
              "predicate",
              "object",
              graphId
            );
        }
      }
    }
    // ### `match` returns a new dataset that is comprised of all quads in the current instance matching the given arguments.
    // The logic described in Quad Matching is applied for each quad in this dataset to check if it should be included in the output dataset.
    // Note: This method always returns a new DatasetCore, even if that dataset contains no quads.
    // Note: Since a DatasetCore is an unordered set, the order of the quads within the returned sequence is arbitrary.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    // For backwards compatibility, the object return also implements the Readable stream interface.
    match(subject, predicate, object, graph) {
      return new DatasetCoreAndReadableStream(this, subject, predicate, object, graph, { entityIndex: this._entityIndex });
    }
    // ### `countQuads` returns the number of quads matching a pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    countQuads(subject, predicate, object, graph) {
      const graphs = this._getGraphs(graph);
      let count = 0, content, subjectId, predicateId, objectId;
      if (subject && !(subjectId = this._termToNumericId(subject)) || predicate && !(predicateId = this._termToNumericId(predicate)) || object && !(objectId = this._termToNumericId(object)))
        return 0;
      for (const graphId in graphs) {
        if (content = graphs[graphId]) {
          if (subject) {
            if (object)
              count += this._countInIndex(content.objects, objectId, subjectId, predicateId);
            else
              count += this._countInIndex(content.subjects, subjectId, predicateId, objectId);
          } else if (predicate) {
            count += this._countInIndex(content.predicates, predicateId, objectId, subjectId);
          } else {
            count += this._countInIndex(content.objects, objectId, subjectId, predicateId);
          }
        }
      }
      return count;
    }
    // ### `forEach` executes the callback on all quads.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    forEach(callback, subject, predicate, object, graph) {
      this.some((quad2) => {
        callback(quad2, this);
        return false;
      }, subject, predicate, object, graph);
    }
    // ### `every` executes the callback on all quads,
    // and returns `true` if it returns truthy for all them.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    every(callback, subject, predicate, object, graph) {
      return !this.some((quad2) => !callback(quad2, this), subject, predicate, object, graph);
    }
    // ### `some` executes the callback on all quads,
    // and returns `true` if it returns truthy for any of them.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    some(callback, subject, predicate, object, graph) {
      for (const quad2 of this.readQuads(subject, predicate, object, graph))
        if (callback(quad2))
          return true;
      return false;
    }
    // ### `getSubjects` returns all subjects that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    getSubjects(predicate, object, graph) {
      const results = [];
      this.forSubjects((s) => {
        results.push(s);
      }, predicate, object, graph);
      return results;
    }
    // ### `forSubjects` executes the callback on all subjects that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    forSubjects(callback, predicate, object, graph) {
      const graphs = this._getGraphs(graph);
      let content, predicateId, objectId;
      callback = this._uniqueEntities(callback);
      if (predicate && !(predicateId = this._termToNumericId(predicate)) || object && !(objectId = this._termToNumericId(object)))
        return;
      for (graph in graphs) {
        if (content = graphs[graph]) {
          if (predicateId) {
            if (objectId)
              this._loopBy2Keys(content.predicates, predicateId, objectId, callback);
            else
              this._loopByKey1(content.subjects, predicateId, callback);
          } else if (objectId)
            this._loopByKey0(content.objects, objectId, callback);
          else
            this._loop(content.subjects, callback);
        }
      }
    }
    // ### `getPredicates` returns all predicates that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    getPredicates(subject, object, graph) {
      const results = [];
      this.forPredicates((p) => {
        results.push(p);
      }, subject, object, graph);
      return results;
    }
    // ### `forPredicates` executes the callback on all predicates that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    forPredicates(callback, subject, object, graph) {
      const graphs = this._getGraphs(graph);
      let content, subjectId, objectId;
      callback = this._uniqueEntities(callback);
      if (subject && !(subjectId = this._termToNumericId(subject)) || object && !(objectId = this._termToNumericId(object)))
        return;
      for (graph in graphs) {
        if (content = graphs[graph]) {
          if (subjectId) {
            if (objectId)
              this._loopBy2Keys(content.objects, objectId, subjectId, callback);
            else
              this._loopByKey0(content.subjects, subjectId, callback);
          } else if (objectId)
            this._loopByKey1(content.predicates, objectId, callback);
          else
            this._loop(content.predicates, callback);
        }
      }
    }
    // ### `getObjects` returns all objects that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    getObjects(subject, predicate, graph) {
      const results = [];
      this.forObjects((o) => {
        results.push(o);
      }, subject, predicate, graph);
      return results;
    }
    // ### `forObjects` executes the callback on all objects that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    forObjects(callback, subject, predicate, graph) {
      const graphs = this._getGraphs(graph);
      let content, subjectId, predicateId;
      callback = this._uniqueEntities(callback);
      if (subject && !(subjectId = this._termToNumericId(subject)) || predicate && !(predicateId = this._termToNumericId(predicate)))
        return;
      for (graph in graphs) {
        if (content = graphs[graph]) {
          if (subjectId) {
            if (predicateId)
              this._loopBy2Keys(content.subjects, subjectId, predicateId, callback);
            else
              this._loopByKey1(content.objects, subjectId, callback);
          } else if (predicateId)
            this._loopByKey0(content.predicates, predicateId, callback);
          else
            this._loop(content.objects, callback);
        }
      }
    }
    // ### `getGraphs` returns all graphs that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    getGraphs(subject, predicate, object) {
      const results = [];
      this.forGraphs((g) => {
        results.push(g);
      }, subject, predicate, object);
      return results;
    }
    // ### `forGraphs` executes the callback on all graphs that match the pattern.
    // Setting any field to `undefined` or `null` indicates a wildcard.
    forGraphs(callback, subject, predicate, object) {
      for (const graph in this._graphs) {
        this.some((quad2) => {
          callback(quad2.graph);
          return true;
        }, subject, predicate, object, this._termFromId(this._entities[graph]));
      }
    }
    // ### `createBlankNode` creates a new blank node, returning its name
    createBlankNode(suggestedName) {
      return this._entityIndex.createBlankNode(suggestedName);
    }
    // ### `extractLists` finds and removes all list triples
    // and returns the items per list.
    extractLists({ remove = false, ignoreErrors = false } = {}) {
      const lists = {};
      const onError = ignoreErrors ? () => true : (node, message) => {
        throw new Error(`${node.value} ${message}`);
      };
      const tails = this.getQuads(null, IRIs_default.rdf.rest, IRIs_default.rdf.nil, null);
      const toRemove = remove ? [...tails] : [];
      tails.forEach((tailQuad) => {
        const items = [];
        let malformed = false;
        let head;
        let headPos;
        const graph = tailQuad.graph;
        let current = tailQuad.subject;
        while (current && !malformed) {
          const objectQuads = this.getQuads(null, null, current, null);
          const subjectQuads = this.getQuads(current, null, null, null);
          let quad2, first = null, rest = null, parent = null;
          for (let i = 0; i < subjectQuads.length && !malformed; i++) {
            quad2 = subjectQuads[i];
            if (!quad2.graph.equals(graph))
              malformed = onError(current, "not confined to single graph");
            else if (head)
              malformed = onError(current, "has non-list arcs out");
            else if (quad2.predicate.value === IRIs_default.rdf.first) {
              if (first)
                malformed = onError(current, "has multiple rdf:first arcs");
              else
                toRemove.push(first = quad2);
            } else if (quad2.predicate.value === IRIs_default.rdf.rest) {
              if (rest)
                malformed = onError(current, "has multiple rdf:rest arcs");
              else
                toRemove.push(rest = quad2);
            } else if (objectQuads.length)
              malformed = onError(current, "can't be subject and object");
            else {
              head = quad2;
              headPos = "subject";
            }
          }
          for (let i = 0; i < objectQuads.length && !malformed; ++i) {
            quad2 = objectQuads[i];
            if (head)
              malformed = onError(current, "can't have coreferences");
            else if (quad2.predicate.value === IRIs_default.rdf.rest) {
              if (parent)
                malformed = onError(current, "has incoming rdf:rest arcs");
              else
                parent = quad2;
            } else {
              head = quad2;
              headPos = "object";
            }
          }
          if (!first)
            malformed = onError(current, "has no list head");
          else
            items.unshift(first.object);
          current = parent && parent.subject;
        }
        if (malformed)
          remove = false;
        else if (head)
          lists[head[headPos].value] = items;
      });
      if (remove)
        this.removeQuads(toRemove);
      return lists;
    }
    /**
     * Returns `true` if the current dataset is a superset of the given dataset; in other words, returns `true` if
     * the given dataset is a subset of, i.e., is contained within, the current dataset.
     *
     * Blank Nodes will be normalized.
     */
    addAll(quads) {
      if (quads instanceof DatasetCoreAndReadableStream)
        quads = quads.filtered;
      if (Array.isArray(quads))
        this.addQuads(quads);
      else if (quads instanceof _N3Store && quads._entityIndex === this._entityIndex) {
        if (quads._size !== 0) {
          this._graphs = merge(this._graphs, quads._graphs);
          this._size = null;
        }
      } else {
        for (const quad2 of quads)
          this.add(quad2);
      }
      return this;
    }
    /**
     * Returns `true` if the current dataset is a superset of the given dataset; in other words, returns `true` if
     * the given dataset is a subset of, i.e., is contained within, the current dataset.
     *
     * Blank Nodes will be normalized.
     */
    contains(other) {
      if (other instanceof DatasetCoreAndReadableStream)
        other = other.filtered;
      if (other === this)
        return true;
      if (!(other instanceof _N3Store) || this._entityIndex !== other._entityIndex)
        return other.every((quad2) => this.has(quad2));
      const g1 = this._graphs, g2 = other._graphs;
      let s1, s2, p1, p2, o1;
      for (const graph in g2) {
        if (!(s1 = g1[graph]))
          return false;
        s1 = s1.subjects;
        for (const subject in s2 = g2[graph].subjects) {
          if (!(p1 = s1[subject]))
            return false;
          for (const predicate in p2 = s2[subject]) {
            if (!(o1 = p1[predicate]))
              return false;
            for (const object in p2[predicate])
              if (!(object in o1))
                return false;
          }
        }
      }
      return true;
    }
    /**
     * This method removes the quads in the current dataset that match the given arguments.
     *
     * The logic described in {@link https://rdf.js.org/dataset-spec/#quad-matching|Quad Matching} is applied for each
     * quad in this dataset, to select the quads which will be deleted.
     *
     * @param subject   The optional exact subject to match.
     * @param predicate The optional exact predicate to match.
     * @param object    The optional exact object to match.
     * @param graph     The optional exact graph to match.
     */
    deleteMatches(subject, predicate, object, graph) {
      for (const quad2 of this.match(subject, predicate, object, graph))
        this.removeQuad(quad2);
      return this;
    }
    /**
     * Returns a new dataset that contains all quads from the current dataset that are not included in the given dataset.
     */
    difference(other) {
      if (other && other instanceof DatasetCoreAndReadableStream)
        other = other.filtered;
      if (other === this)
        return new _N3Store({ entityIndex: this._entityIndex });
      if (other instanceof _N3Store && other._entityIndex === this._entityIndex) {
        const store = new _N3Store({ entityIndex: this._entityIndex });
        const graphs = difference(this._graphs, other._graphs);
        if (graphs) {
          store._graphs = graphs;
          store._size = null;
        }
        return store;
      }
      return this.filter((quad2) => !other.has(quad2));
    }
    /**
     * Returns true if the current dataset contains the same graph structure as the given dataset.
     *
     * Blank Nodes will be normalized.
     */
    equals(other) {
      if (other instanceof DatasetCoreAndReadableStream)
        other = other.filtered;
      return other === this || this.size === other.size && this.contains(other);
    }
    /**
     * Creates a new dataset with all the quads that pass the test implemented by the provided `iteratee`.
     *
     * This method is aligned with Array.prototype.filter() in ECMAScript-262.
     */
    filter(iteratee) {
      const store = new _N3Store({ entityIndex: this._entityIndex });
      for (const quad2 of this)
        if (iteratee(quad2, this))
          store.add(quad2);
      return store;
    }
    /**
     * Returns a new dataset containing all quads from the current dataset that are also included in the given dataset.
     */
    intersection(other) {
      if (other instanceof DatasetCoreAndReadableStream)
        other = other.filtered;
      if (other === this) {
        const store = new _N3Store({ entityIndex: this._entityIndex });
        store._graphs = merge(/* @__PURE__ */ Object.create(null), this._graphs);
        store._size = this._size;
        return store;
      } else if (other instanceof _N3Store && this._entityIndex === other._entityIndex) {
        const store = new _N3Store({ entityIndex: this._entityIndex });
        const graphs = intersect(other._graphs, this._graphs);
        if (graphs) {
          store._graphs = graphs;
          store._size = null;
        }
        return store;
      }
      return this.filter((quad2) => other.has(quad2));
    }
    /**
     * Returns a new dataset containing all quads returned by applying `iteratee` to each quad in the current dataset.
     */
    map(iteratee) {
      const store = new _N3Store({ entityIndex: this._entityIndex });
      for (const quad2 of this)
        store.add(iteratee(quad2, this));
      return store;
    }
    /**
     * This method calls the `iteratee` method on each `quad` of the `Dataset`. The first time the `iteratee` method
     * is called, the `accumulator` value is the `initialValue`, or, if not given, equals the first quad of the `Dataset`.
     * The return value of each call to the `iteratee` method is used as the `accumulator` value for the next call.
     *
     * This method returns the return value of the last `iteratee` call.
     *
     * This method is aligned with `Array.prototype.reduce()` in ECMAScript-262.
     */
    reduce(callback, initialValue) {
      const iter = this.readQuads();
      let accumulator = initialValue === void 0 ? iter.next().value : initialValue;
      for (const quad2 of iter)
        accumulator = callback(accumulator, quad2, this);
      return accumulator;
    }
    /**
     * Returns the set of quads within the dataset as a host-language-native sequence, for example an `Array` in
     * ECMAScript-262.
     *
     * Since a `Dataset` is an unordered set, the order of the quads within the returned sequence is arbitrary.
     */
    toArray() {
      return this.getQuads();
    }
    /**
     * Returns an N-Quads string representation of the dataset, preprocessed with the
     * {@link https://json-ld.github.io/normalization/spec/|RDF Dataset Normalization} algorithm.
     */
    toCanonical() {
      throw new Error("not implemented");
    }
    /**
     * Returns a stream that contains all quads of the dataset.
     */
    toStream() {
      return this.match();
    }
    /**
     * Returns an N-Quads string representation of the dataset.
     *
     * No prior normalization is required, therefore the results for the same quads may vary depending on the `Dataset`
     * implementation.
     */
    toString() {
      return new N3Writer().quadsToString(this);
    }
    /**
     * Returns a new `Dataset` that is a concatenation of this dataset and the quads given as an argument.
     */
    union(quads) {
      const store = new _N3Store({ entityIndex: this._entityIndex });
      store._graphs = merge(/* @__PURE__ */ Object.create(null), this._graphs);
      store._size = this._size;
      store.addAll(quads);
      return store;
    }
    // ### Store is an iterable.
    // Can be used where iterables are expected: for...of loops, array spread operator,
    // `yield*`, and destructuring assignment (order is not guaranteed).
    *[Symbol.iterator]() {
      yield* this.readQuads();
    }
  };
  function indexMatch(index, ids, depth = 0) {
    const ind = ids[depth];
    if (ind && !(ind in index))
      return false;
    let target = false;
    for (const key in ind ? { [ind]: index[ind] } : index) {
      const result2 = depth === 2 ? null : indexMatch(index[key], ids, depth + 1);
      if (result2 !== false) {
        target = target || /* @__PURE__ */ Object.create(null);
        target[key] = result2;
      }
    }
    return target;
  }
  var DatasetCoreAndReadableStream = class _DatasetCoreAndReadableStream extends import_readable_stream.Readable {
    constructor(n3Store, subject, predicate, object, graph, options) {
      super({ objectMode: true });
      Object.assign(this, { n3Store, subject, predicate, object, graph, options });
    }
    get filtered() {
      if (!this._filtered) {
        const { n3Store, graph, object, predicate, subject } = this;
        const newStore = this._filtered = new N3Store({ factory: n3Store._factory, entityIndex: this.options.entityIndex });
        let subjectId, predicateId, objectId;
        if (subject && !(subjectId = newStore._termToNumericId(subject)) || predicate && !(predicateId = newStore._termToNumericId(predicate)) || object && !(objectId = newStore._termToNumericId(object)))
          return newStore;
        const graphs = n3Store._getGraphs(graph);
        for (const graphKey in graphs) {
          let subjects, predicates, objects;
          if (!subjectId && predicateId) {
            if (predicates = indexMatch(graphs[graphKey].predicates, [predicateId, objectId, subjectId])) {
              subjects = indexMatch(graphs[graphKey].subjects, [subjectId, predicateId, objectId]);
              objects = indexMatch(graphs[graphKey].objects, [objectId, subjectId, predicateId]);
            }
          } else if (objectId) {
            if (objects = indexMatch(graphs[graphKey].objects, [objectId, subjectId, predicateId])) {
              subjects = indexMatch(graphs[graphKey].subjects, [subjectId, predicateId, objectId]);
              predicates = indexMatch(graphs[graphKey].predicates, [predicateId, objectId, subjectId]);
            }
          } else if (subjects = indexMatch(graphs[graphKey].subjects, [subjectId, predicateId, objectId])) {
            predicates = indexMatch(graphs[graphKey].predicates, [predicateId, objectId, subjectId]);
            objects = indexMatch(graphs[graphKey].objects, [objectId, subjectId, predicateId]);
          }
          if (subjects)
            newStore._graphs[graphKey] = { subjects, predicates, objects };
        }
        newStore._size = null;
      }
      return this._filtered;
    }
    get size() {
      return this.filtered.size;
    }
    _read(size) {
      if (size > 0 && !this[ITERATOR])
        this[ITERATOR] = this[Symbol.iterator]();
      const iterable = this[ITERATOR];
      while (--size >= 0) {
        const { done, value } = iterable.next();
        if (done) {
          this.push(null);
          return;
        }
        this.push(value);
      }
    }
    addAll(quads) {
      return this.filtered.addAll(quads);
    }
    contains(other) {
      return this.filtered.contains(other);
    }
    deleteMatches(subject, predicate, object, graph) {
      return this.filtered.deleteMatches(subject, predicate, object, graph);
    }
    difference(other) {
      return this.filtered.difference(other);
    }
    equals(other) {
      return this.filtered.equals(other);
    }
    every(callback, subject, predicate, object, graph) {
      return this.filtered.every(callback, subject, predicate, object, graph);
    }
    filter(iteratee) {
      return this.filtered.filter(iteratee);
    }
    forEach(callback, subject, predicate, object, graph) {
      return this.filtered.forEach(callback, subject, predicate, object, graph);
    }
    import(stream) {
      return this.filtered.import(stream);
    }
    intersection(other) {
      return this.filtered.intersection(other);
    }
    map(iteratee) {
      return this.filtered.map(iteratee);
    }
    some(callback, subject, predicate, object, graph) {
      return this.filtered.some(callback, subject, predicate, object, graph);
    }
    toCanonical() {
      return this.filtered.toCanonical();
    }
    toStream() {
      return this._filtered ? this._filtered.toStream() : this.n3Store.match(this.subject, this.predicate, this.object, this.graph);
    }
    union(quads) {
      return this._filtered ? this._filtered.union(quads) : this.n3Store.match(this.subject, this.predicate, this.object, this.graph).addAll(quads);
    }
    toArray() {
      return this._filtered ? this._filtered.toArray() : this.n3Store.getQuads(this.subject, this.predicate, this.object, this.graph);
    }
    reduce(callback, initialValue) {
      return this.filtered.reduce(callback, initialValue);
    }
    toString() {
      return new N3Writer().quadsToString(this);
    }
    add(quad2) {
      return this.filtered.add(quad2);
    }
    delete(quad2) {
      return this.filtered.delete(quad2);
    }
    has(quad2) {
      return this.filtered.has(quad2);
    }
    match(subject, predicate, object, graph) {
      return new _DatasetCoreAndReadableStream(this.filtered, subject, predicate, object, graph, this.options);
    }
    *[Symbol.iterator]() {
      yield* this._filtered || this.n3Store.readQuads(this.subject, this.predicate, this.object, this.graph);
    }
  };
  var N3DatasetCoreFactory = class {
    dataset(quads) {
      return new N3Store(quads);
    }
  };
  function getRulesFromDataset(dataset) {
    const rules = [];
    for (const { subject, object } of dataset.match(null, N3DataFactory_default.namedNode("http://www.w3.org/2000/10/swap/log#implies"), null, N3DataFactory_default.defaultGraph())) {
      const premise = [...dataset.match(null, null, null, subject)];
      const conclusion = [...dataset.match(null, null, null, object)];
      rules.push({ premise, conclusion });
    }
    return rules;
  }
  var N3Reasoner = class {
    constructor(store) {
      this._store = store;
    }
    _add(subject, predicate, object, graphItem, cb) {
      if (!this._store._addToIndex(graphItem.subjects, subject, predicate, object))
        return;
      this._store._addToIndex(graphItem.predicates, predicate, object, subject);
      this._store._addToIndex(graphItem.objects, object, subject, predicate);
      cb();
    }
    // eslint-disable-next-line no-warning-comments
    _evaluatePremise(rule, content, cb, i = 0) {
      let v1, v2, value, index1, index2;
      const [val0, val1, val2] = rule.premise[i].value, index = content[rule.premise[i].content];
      const v0 = !(value = val0.value);
      for (value in v0 ? index : { [value]: index[value] }) {
        if (index1 = index[value]) {
          if (v0)
            val0.value = Number(value);
          v1 = !(value = val1.value);
          for (value in v1 ? index1 : { [value]: index1[value] }) {
            if (index2 = index1[value]) {
              if (v1)
                val1.value = Number(value);
              v2 = !(value = val2.value);
              for (value in v2 ? index2 : { [value]: index2[value] }) {
                if (v2)
                  val2.value = Number(value);
                if (i === rule.premise.length - 1)
                  rule.conclusion.forEach((c) => {
                    this._add(c.subject.value, c.predicate.value, c.object.value, content, () => {
                      cb(c);
                    });
                  });
                else
                  this._evaluatePremise(rule, content, cb, i + 1);
              }
              if (v2)
                val2.value = null;
            }
          }
          if (v1)
            val1.value = null;
        }
      }
      if (v0)
        val0.value = null;
    }
    _evaluateRules(rules, content, cb) {
      for (let i = 0; i < rules.length; i++) {
        this._evaluatePremise(rules[i], content, cb);
      }
    }
    // A naive reasoning algorithm where rules are just applied by repeatedly applying rules
    // until no more evaluations are made
    _reasonGraphNaive(rules, content) {
      const newRules = [];
      function addRule(conclusion) {
        if (conclusion.next)
          conclusion.next.forEach((rule) => {
            newRules.push([conclusion.subject.value, conclusion.predicate.value, conclusion.object.value, rule]);
          });
      }
      const addConclusions = (conclusion) => {
        conclusion.forEach((c) => {
          this._add(c.subject.value, c.predicate.value, c.object.value, content, () => {
            addRule(c);
          });
        });
      };
      this._evaluateRules(rules, content, addRule);
      let r;
      while ((r = newRules.pop()) !== void 0) {
        const [subject, predicate, object, rule] = r;
        const v1 = rule.basePremise.subject.value;
        if (!v1)
          rule.basePremise.subject.value = subject;
        const v2 = rule.basePremise.predicate.value;
        if (!v2)
          rule.basePremise.predicate.value = predicate;
        const v3 = rule.basePremise.object.value;
        if (!v3)
          rule.basePremise.object.value = object;
        if (rule.premise.length === 0) {
          addConclusions(rule.conclusion);
        } else {
          this._evaluatePremise(rule, content, addRule);
        }
        if (!v1)
          rule.basePremise.subject.value = null;
        if (!v2)
          rule.basePremise.predicate.value = null;
        if (!v3)
          rule.basePremise.object.value = null;
      }
    }
    _createRule({ premise, conclusion }) {
      const varMapping = {};
      const toId = (value) => value.termType === "Variable" ? (
        // If the term is a variable, then create an empty object that values can be placed into
        varMapping[value.value] = varMapping[value.value] || {}
      ) : (
        // If the term is not a variable, then set the ID value
        { value: this._store._termToNewNumericId(value) }
      );
      const t = (term) => ({ subject: toId(term.subject), predicate: toId(term.predicate), object: toId(term.object) });
      return {
        premise: premise.map((p) => t(p)),
        conclusion: conclusion.map((p) => t(p)),
        variables: Object.values(varMapping)
      };
    }
    reason(rules) {
      if (!Array.isArray(rules)) {
        rules = getRulesFromDataset(rules);
      }
      rules = rules.map((rule) => this._createRule(rule));
      for (const r1 of rules) {
        for (const r2 of rules) {
          for (let i = 0; i < r2.premise.length; i++) {
            const p = r2.premise[i];
            for (const c of r1.conclusion) {
              if (termEq(p.subject, c.subject) && termEq(p.predicate, c.predicate) && termEq(p.object, c.object)) {
                const set = /* @__PURE__ */ new Set();
                const premise = [];
                p.subject.value = p.subject.value || 1;
                p.object.value = p.object.value || 1;
                p.predicate.value = p.predicate.value || 1;
                for (let j = 0; j < r2.premise.length; j++) {
                  if (j !== i) {
                    premise.push(getIndex(r2.premise[j], set));
                  }
                }
                (c.next = c.next || []).push({
                  premise,
                  conclusion: r2.conclusion,
                  // This is a single premise of the form { subject, predicate, object },
                  // which we can use to instantiate the rule using the new data that was emitted
                  basePremise: p
                });
              }
              r2.variables.forEach((v) => {
                v.value = null;
              });
            }
          }
        }
      }
      for (const rule of rules) {
        const set = /* @__PURE__ */ new Set();
        rule.premise = rule.premise.map((p) => getIndex(p, set));
      }
      const graphs = this._store._getGraphs();
      for (const graphId in graphs) {
        this._reasonGraphNaive(rules, graphs[graphId]);
      }
      this._store._size = null;
    }
  };
  function getIndex({ subject, predicate, object }, set) {
    const s = subject.value || set.has(subject) || (set.add(subject), false);
    const p = predicate.value || set.has(predicate) || (set.add(predicate), false);
    const o = object.value || set.has(object) || (set.add(object), false);
    return !s && p ? { content: "predicates", value: [predicate, object, subject] } : o ? { content: "objects", value: [object, subject, predicate] } : { content: "subjects", value: [subject, predicate, object] };
  }
  function termEq(t1, t2) {
    if (t1.value === null) {
      t1.value = t2.value;
    }
    return t1.value === t2.value;
  }
  var import_readable_stream2 = __toESM(require_browser3());
  var N3StreamParser = class extends import_readable_stream2.Transform {
    constructor(options) {
      super({ decodeStrings: true });
      this._readableState.objectMode = true;
      const parser = new N3Parser(options);
      let onData, onEnd;
      const callbacks = {
        // Handle quads by pushing them down the pipeline
        onQuad: (error4, quad2) => {
          error4 && this.emit("error", error4) || quad2 && this.push(quad2);
        },
        // Emit prefixes through the `prefix` event
        onPrefix: (prefix2, uri) => {
          this.emit("prefix", prefix2, uri);
        }
      };
      if (options && options.comments)
        callbacks.onComment = (comment) => {
          this.emit("comment", comment);
        };
      parser.parse({
        on: (event2, callback) => {
          switch (event2) {
            case "data":
              onData = callback;
              break;
            case "end":
              onEnd = callback;
              break;
          }
        }
      }, callbacks);
      this._transform = (chunk, encoding, done) => {
        onData(chunk);
        done();
      };
      this._flush = (done) => {
        onEnd();
        done();
      };
    }
    // ### Parses a stream of strings
    import(stream) {
      stream.on("data", (chunk) => {
        this.write(chunk);
      });
      stream.on("end", () => {
        this.end();
      });
      stream.on("error", (error4) => {
        this.emit("error", error4);
      });
      return this;
    }
  };
  var import_readable_stream3 = __toESM(require_browser3());
  var N3StreamWriter = class extends import_readable_stream3.Transform {
    constructor(options) {
      super({ encoding: "utf8", writableObjectMode: true });
      const writer = this._writer = new N3Writer({
        write: (quad2, encoding, callback) => {
          this.push(quad2);
          callback && callback();
        },
        end: (callback) => {
          this.push(null);
          callback && callback();
        }
      }, options);
      this._transform = (quad2, encoding, done) => {
        writer.addQuad(quad2, done);
      };
      this._flush = (done) => {
        writer.end(done);
      };
    }
    // ### Serializes a stream of quads
    import(stream) {
      stream.on("data", (quad2) => {
        this.write(quad2);
      });
      stream.on("end", () => {
        this.end();
      });
      stream.on("error", (error4) => {
        this.emit("error", error4);
      });
      stream.on("prefix", (prefix2, iri) => {
        this._writer.addPrefix(prefix2, iri);
      });
      return this;
    }
  };
  var src_default = {
    Lexer: N3Lexer,
    Parser: N3Parser,
    Writer: N3Writer,
    Store: N3Store,
    StoreFactory: N3DatasetCoreFactory,
    EntityIndex: N3EntityIndex,
    StreamParser: N3StreamParser,
    StreamWriter: N3StreamWriter,
    Util: N3Util_exports,
    Reasoner: N3Reasoner,
    DataFactory: N3DataFactory_default,
    Term,
    NamedNode: NamedNode2,
    Literal,
    BlankNode: BlankNode2,
    Variable,
    DefaultGraph,
    Quad,
    Triple: Quad,
    termFromId,
    termToId
  };
  var n3Parser = (input, uri, type) => {
    const parser = new src_default.Parser({
      blankNodePrefix: "",
      format: type
    });
    let prefixes3 = /* @__PURE__ */ Object.create(null);
    const quads = parser.parse(input, null, (prefix2, url2) => {
      prefixes3[prefix2] = url2.id;
    });
    return { quads, prefixes: prefixes3 };
  };
  var n3Writer = (source) => {
    return new Promise((resolve, reject) => {
      const writer = new src_default.Writer({
        format: source.type,
        prefixes: { ...source.prefixes }
      });
      const rdf3 = source.context.prefixes.rdf;
      const xsd4 = source.prefixes.xsd;
      const { quad: quad2, namedNode: namedNode2, literal: literal2, blankNode: blankNode2 } = src_default.DataFactory;
      const writeClassNames = (id2, subject) => {
        let classNames = subject.a;
        if (!Array.isArray(classNames)) {
          classNames = [classNames];
        }
        if (classNames?.length) {
          for (let name of classNames) {
            name = source.fullURI(name);
            writer.addQuad(quad2(
              namedNode2(id2),
              namedNode2(rdfType),
              namedNode2(name)
            ));
          }
        }
      };
      const writeProperties = (id2, subject) => {
        if (!subject) {
          return;
        }
        let preds = getPredicates(subject);
        for (let pred of preds) {
          if (!Array.isArray(pred.object)) {
            pred.object = [pred.object];
          }
          for (let o of pred.object) {
            writer.addQuad(quad2(
              namedNode2(id2),
              pred.predicate,
              o
            ));
          }
        }
      };
      const getPredicates = (object) => {
        let preds = [];
        Object.entries(object).forEach((entry) => {
          const predicate = entry[0];
          let object2 = entry[1];
          const fullPred = source.fullURI(predicate);
          let pred = {
            predicate: namedNode2(fullPred)
          };
          if (object2 instanceof Collection) {
            pred.object = getCollection(object2);
          } else if (Array.isArray(object2)) {
            pred.object = getArray(object2);
          } else if (object2 instanceof NamedNode) {
            pred.object = namedNode2(object2.id);
          } else if (object2 instanceof BlankNode) {
            pred.object = getBlankNode(object2);
          } else if (isLiteral2(object2)) {
            pred.object = getLiteral(object2);
          } else {
            console.log("weird object", object2, id, predicate);
          }
          preds.push(pred);
        });
        return preds;
      };
      const getLiteral = (object) => {
        let type = source.getType(object) || null;
        if (type) {
          if (type == xsd4 + source.context.separator + "string" || type == xsd4 + source.context.separator + "number") {
            type = null;
          } else {
            type = source.fullURI(type);
          }
          type = namedNode2(type);
        } else {
          let language = object?.language;
          if (language) {
            type = language;
          }
        }
        if (object instanceof String) {
          object = "" + object;
        } else if (object instanceof Number) {
          object = +object;
        }
        return literal2(object, type);
      };
      const isLiteral2 = (value) => {
        return value instanceof String || value instanceof Number || typeof value == "boolean" || typeof value == "string" || typeof value == "number";
      };
      const getCollection = (object) => {
        let list = [];
        for (let value of object) {
          if (isLiteral2(value)) {
            list.push(getLiteral(value));
          } else if (value.id) {
            list.push(namedNode2(value.id));
          } else {
            list.push(getBlankNode(value));
          }
        }
        return writer.list(list);
      };
      const getBlankNode = (object) => {
        return writer.blank(getPredicates(object));
      };
      const getArray = (id2, object) => {
        let list = [];
        for (const o of object) {
          if (isLiteral2(o)) {
            list.push(getLiteral(o));
          } else if (o instanceof NamedNode) {
            list.push(namedNode2(o.id));
          } else if (o instanceof BlankNode) {
            list.push(getBlankNode(o));
          } else if (o instanceof Collection) {
            list.push(getCollection(o));
          }
        }
        return list;
      };
      Object.entries(source.subjects).forEach(([id2, subject]) => {
        id2 = source.shortURI(id2, ":");
        writeClassNames(id2, subject);
        writeProperties(id2, subject);
      });
      writer.end((error4, result2) => {
        if (result2) {
          resolve(result2);
        } else {
          reject(error4);
        }
      });
    });
  };
  var oldm2 = oldm;
  oldm2.n3Parser = n3Parser;
  oldm2.n3Writer = n3Writer;
  window.oldm = oldm2;

  // src/solid-api.mjs
  function getClient(loginInfo, prefixes3) {
    let client2 = client({
      mode: "cors",
      headers: {
        "Accept": "application/*"
      }
    });
    if (loginInfo && loginInfo.username && loginInfo.password) {
      client2 = client2.with({
        headers: {
          Authorization: "Basic " + btoa(loginInfo.username + ":" + loginInfo.password)
        }
      });
    } else if (loginInfo && loginInfo.oidcIssuer) {
      let oidcOptions = {
        authorize_callback: globalThis.metro.oauth2.authorizePopup,
        force_authorization: loginInfo.force_authorization || false,
        client_info: {
          client_name: "Zett",
          redirect_uris: [
            loginInfo.redirect_uri
          ]
        },
        issuer: loginInfo.oidcIssuer
      };
      client2 = client2.with(browser_default2(oidcOptions));
    }
    return client2.with(thrower()).with(oldmmw(prefixes3));
  }
  function oldmmw(prefixes3) {
    return async (req, next) => {
      if (req.data && req.data.write) {
        req = req.with({
          headers: {
            "Content-Type": req.data.type
          },
          body: await req.data.write()
        });
      }
      let res = await next(req);
      if (res.ok) {
        if (!res.data) {
          const body = await solidApi.context.parse(await res.text(), res.url);
          res = res.with({ body });
        }
      }
      return res;
    };
  }
  var solidApi = {
    prefixes: {
      solid: "http://www.w3.org/ns/solid/terms#",
      pim: "http://www.w3.org/ns/pim/space#"
    },
    fetch: async function(url2, loginInfo = null) {
      let cleanUrl = url(url2).with({ hash: "" });
      const client2 = getClient(loginInfo, solidApi.prefixes);
      return client2.get(cleanUrl);
    },
    getIssuer: async function(webIdUrl) {
      const response2 = await solidApi.fetch(webIdUrl);
      return response2.data.primary["solid:oidcIssuer"];
    },
    getStorageUrls: async function(webIdUrl) {
      const response2 = await solidApi.fetch(webIdUrl);
      return response2.data.primary["pim:storage"]?.map((u) => u.endsWith("/") ? u : u + "/");
    },
    redirectPopup: globalThis.metro.oauth2.redirectPopup
  };
  solidApi.context = oldm2({
    parser: oldm2.n3Parser,
    writer: oldm2.n3Writer,
    prefixes: solidApi.prefixes,
    separator: ":"
  });
})();
/*! Bundled license information:

@muze-nl/oldm/dist/oldm.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  
  queue-microtask/index.js:
    (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  safe-buffer/index.js:
    (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  *)
*/
//# sourceMappingURL=solid-api.js.map
