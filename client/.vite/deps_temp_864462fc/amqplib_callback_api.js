import {
  __commonJS
} from "./chunk-LQ2VYIYD.js";

// node_modules/requires-port/index.js
var require_requires_port = __commonJS({
  "node_modules/requires-port/index.js"(exports, module) {
    "use strict";
    module.exports = function required(port, protocol) {
      protocol = protocol.split(":")[0];
      port = +port;
      if (!port)
        return false;
      switch (protocol) {
        case "http":
        case "ws":
          return port !== 80;
        case "https":
        case "wss":
          return port !== 443;
        case "ftp":
          return port !== 21;
        case "gopher":
          return port !== 70;
        case "file":
          return false;
      }
      return port !== 0;
    };
  }
});

// node_modules/querystringify/index.js
var require_querystringify = __commonJS({
  "node_modules/querystringify/index.js"(exports) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var undef;
    function decode(input) {
      try {
        return decodeURIComponent(input.replace(/\+/g, " "));
      } catch (e) {
        return null;
      }
    }
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }
    function querystring(query) {
      var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
      while (part = parser.exec(query)) {
        var key = decode(part[1]), value = decode(part[2]);
        if (key === null || value === null || key in result)
          continue;
        result[key] = value;
      }
      return result;
    }
    function querystringify(obj, prefix) {
      prefix = prefix || "";
      var pairs = [], value, key;
      if ("string" !== typeof prefix)
        prefix = "?";
      for (key in obj) {
        if (has.call(obj, key)) {
          value = obj[key];
          if (!value && (value === null || value === undef || isNaN(value))) {
            value = "";
          }
          key = encode(key);
          value = encode(value);
          if (key === null || value === null)
            continue;
          pairs.push(key + "=" + value);
        }
      }
      return pairs.length ? prefix + pairs.join("&") : "";
    }
    exports.stringify = querystringify;
    exports.parse = querystring;
  }
});

// node_modules/url-parse/index.js
var require_url_parse = __commonJS({
  "node_modules/url-parse/index.js"(exports, module) {
    "use strict";
    var required = require_requires_port();
    var qs = require_querystringify();
    var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
    var CRHTLF = /[\n\r\t]/g;
    var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
    var port = /:\d+$/;
    var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
    var windowsDriveLetter = /^[a-zA-Z]:/;
    function trimLeft(str) {
      return (str ? str : "").toString().replace(controlOrWhitespace, "");
    }
    var rules = [
      ["#", "hash"],
      // Extract from the back.
      ["?", "query"],
      // Extract from the back.
      function sanitize(address, url) {
        return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
      },
      ["/", "pathname"],
      // Extract from the back.
      ["@", "auth", 1],
      // Extract from the front.
      [NaN, "host", void 0, 1, 1],
      // Set left over value.
      [/:(\d*)$/, "port", void 0, 1],
      // RegExp the back.
      [NaN, "hostname", void 0, 1, 1]
      // Set left over.
    ];
    var ignore = { hash: 1, query: 1 };
    function lolcation(loc) {
      var globalVar;
      if (typeof window !== "undefined")
        globalVar = window;
      else if (typeof global !== "undefined")
        globalVar = global;
      else if (typeof self !== "undefined")
        globalVar = self;
      else
        globalVar = {};
      var location = globalVar.location || {};
      loc = loc || location;
      var finaldestination = {}, type = typeof loc, key;
      if ("blob:" === loc.protocol) {
        finaldestination = new Url(unescape(loc.pathname), {});
      } else if ("string" === type) {
        finaldestination = new Url(loc, {});
        for (key in ignore)
          delete finaldestination[key];
      } else if ("object" === type) {
        for (key in loc) {
          if (key in ignore)
            continue;
          finaldestination[key] = loc[key];
        }
        if (finaldestination.slashes === void 0) {
          finaldestination.slashes = slashes.test(loc.href);
        }
      }
      return finaldestination;
    }
    function isSpecial(scheme) {
      return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
    }
    function extractProtocol(address, location) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      location = location || {};
      var match = protocolre.exec(address);
      var protocol = match[1] ? match[1].toLowerCase() : "";
      var forwardSlashes = !!match[2];
      var otherSlashes = !!match[3];
      var slashesCount = 0;
      var rest;
      if (forwardSlashes) {
        if (otherSlashes) {
          rest = match[2] + match[3] + match[4];
          slashesCount = match[2].length + match[3].length;
        } else {
          rest = match[2] + match[4];
          slashesCount = match[2].length;
        }
      } else {
        if (otherSlashes) {
          rest = match[3] + match[4];
          slashesCount = match[3].length;
        } else {
          rest = match[4];
        }
      }
      if (protocol === "file:") {
        if (slashesCount >= 2) {
          rest = rest.slice(2);
        }
      } else if (isSpecial(protocol)) {
        rest = match[4];
      } else if (protocol) {
        if (forwardSlashes) {
          rest = rest.slice(2);
        }
      } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
      }
      return {
        protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount,
        rest
      };
    }
    function resolve(relative, base) {
      if (relative === "")
        return base;
      var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
      while (i--) {
        if (path[i] === ".") {
          path.splice(i, 1);
        } else if (path[i] === "..") {
          path.splice(i, 1);
          up++;
        } else if (up) {
          if (i === 0)
            unshift = true;
          path.splice(i, 1);
          up--;
        }
      }
      if (unshift)
        path.unshift("");
      if (last === "." || last === "..")
        path.push("");
      return path.join("/");
    }
    function Url(address, location, parser) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      if (!(this instanceof Url)) {
        return new Url(address, location, parser);
      }
      var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
      if ("object" !== type && "string" !== type) {
        parser = location;
        location = null;
      }
      if (parser && "function" !== typeof parser)
        parser = qs.parse;
      location = lolcation(location);
      extracted = extractProtocol(address || "", location);
      relative = !extracted.protocol && !extracted.slashes;
      url.slashes = extracted.slashes || relative && location.slashes;
      url.protocol = extracted.protocol || location.protocol || "";
      address = extracted.rest;
      if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
        instructions[3] = [/(.*)/, "pathname"];
      }
      for (; i < instructions.length; i++) {
        instruction = instructions[i];
        if (typeof instruction === "function") {
          address = instruction(address, url);
          continue;
        }
        parse = instruction[0];
        key = instruction[1];
        if (parse !== parse) {
          url[key] = address;
        } else if ("string" === typeof parse) {
          index = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
          if (~index) {
            if ("number" === typeof instruction[2]) {
              url[key] = address.slice(0, index);
              address = address.slice(index + instruction[2]);
            } else {
              url[key] = address.slice(index);
              address = address.slice(0, index);
            }
          }
        } else if (index = parse.exec(address)) {
          url[key] = index[1];
          address = address.slice(0, index.index);
        }
        url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
        if (instruction[4])
          url[key] = url[key].toLowerCase();
      }
      if (parser)
        url.query = parser(url.query);
      if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
        url.pathname = resolve(url.pathname, location.pathname);
      }
      if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
        url.pathname = "/" + url.pathname;
      }
      if (!required(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = "";
      }
      url.username = url.password = "";
      if (url.auth) {
        index = url.auth.indexOf(":");
        if (~index) {
          url.username = url.auth.slice(0, index);
          url.username = encodeURIComponent(decodeURIComponent(url.username));
          url.password = url.auth.slice(index + 1);
          url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
          url.username = encodeURIComponent(decodeURIComponent(url.auth));
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
      }
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
    }
    function set(part, value, fn) {
      var url = this;
      switch (part) {
        case "query":
          if ("string" === typeof value && value.length) {
            value = (fn || qs.parse)(value);
          }
          url[part] = value;
          break;
        case "port":
          url[part] = value;
          if (!required(value, url.protocol)) {
            url.host = url.hostname;
            url[part] = "";
          } else if (value) {
            url.host = url.hostname + ":" + value;
          }
          break;
        case "hostname":
          url[part] = value;
          if (url.port)
            value += ":" + url.port;
          url.host = value;
          break;
        case "host":
          url[part] = value;
          if (port.test(value)) {
            value = value.split(":");
            url.port = value.pop();
            url.hostname = value.join(":");
          } else {
            url.hostname = value;
            url.port = "";
          }
          break;
        case "protocol":
          url.protocol = value.toLowerCase();
          url.slashes = !fn;
          break;
        case "pathname":
        case "hash":
          if (value) {
            var char = part === "pathname" ? "/" : "#";
            url[part] = value.charAt(0) !== char ? char + value : value;
          } else {
            url[part] = value;
          }
          break;
        case "username":
        case "password":
          url[part] = encodeURIComponent(value);
          break;
        case "auth":
          var index = value.indexOf(":");
          if (~index) {
            url.username = value.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = value.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(value));
          }
      }
      for (var i = 0; i < rules.length; i++) {
        var ins = rules[i];
        if (ins[4])
          url[ins[1]] = url[ins[1]].toLowerCase();
      }
      url.auth = url.password ? url.username + ":" + url.password : url.username;
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
      return url;
    }
    function toString(stringify) {
      if (!stringify || "function" !== typeof stringify)
        stringify = qs.stringify;
      var query, url = this, host = url.host, protocol = url.protocol;
      if (protocol && protocol.charAt(protocol.length - 1) !== ":")
        protocol += ":";
      var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
      if (url.username) {
        result += url.username;
        if (url.password)
          result += ":" + url.password;
        result += "@";
      } else if (url.password) {
        result += ":" + url.password;
        result += "@";
      } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
        result += "@";
      }
      if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
        host += ":";
      }
      result += host + url.pathname;
      query = "object" === typeof url.query ? stringify(url.query) : url.query;
      if (query)
        result += "?" !== query.charAt(0) ? "?" + query : query;
      if (url.hash)
        result += url.hash;
      return result;
    }
    Url.prototype = { set, toString };
    Url.extractProtocol = extractProtocol;
    Url.location = lolcation;
    Url.trimLeft = trimLeft;
    Url.qs = qs;
    module.exports = Url;
  }
});

// browser-external:querystring
var require_querystring = __commonJS({
  "browser-external:querystring"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "querystring" has been externalized for browser compatibility. Cannot access "querystring.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/buffer-more-ints/buffer-more-ints.js
var require_buffer_more_ints = __commonJS({
  "node_modules/buffer-more-ints/buffer-more-ints.js"(exports, module) {
    "use strict";
    var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
    var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
    var MAX_INT = 9007199254740991;
    function isContiguousInt(val) {
      return val <= MAX_INT && val >= -MAX_INT;
    }
    function assertContiguousInt(val) {
      if (!isContiguousInt(val)) {
        throw new TypeError("number cannot be represented as a contiguous integer");
      }
    }
    module.exports.isContiguousInt = isContiguousInt;
    module.exports.assertContiguousInt = assertContiguousInt;
    ["UInt", "Int"].forEach(function(sign) {
      var suffix = sign + "8";
      module.exports["read" + suffix] = Buffer.prototype["read" + suffix].call;
      module.exports["write" + suffix] = Buffer.prototype["write" + suffix].call;
      ["16", "32"].forEach(function(size) {
        ["LE", "BE"].forEach(function(endian) {
          var suffix2 = sign + size + endian;
          var read = Buffer.prototype["read" + suffix2];
          module.exports["read" + suffix2] = function(buf, offset) {
            return read.call(buf, offset);
          };
          var write = Buffer.prototype["write" + suffix2];
          module.exports["write" + suffix2] = function(buf, val, offset) {
            return write.call(buf, val, offset);
          };
        });
      });
    });
    function check_value(val, min, max) {
      val = +val;
      if (typeof val != "number" || val < min || val > max || Math.floor(val) !== val) {
        throw new TypeError('"value" argument is out of bounds');
      }
      return val;
    }
    function check_bounds(buf, offset, len) {
      if (offset < 0 || offset + len > buf.length) {
        throw new RangeError("Index out of range");
      }
    }
    function readUInt24BE(buf, offset) {
      return buf.readUInt8(offset) << 16 | buf.readUInt16BE(offset + 1);
    }
    module.exports.readUInt24BE = readUInt24BE;
    function writeUInt24BE(buf, val, offset) {
      val = check_value(val, 0, 16777215);
      check_bounds(buf, offset, 3);
      buf.writeUInt8(val >>> 16, offset);
      buf.writeUInt16BE(val & 65535, offset + 1);
    }
    module.exports.writeUInt24BE = writeUInt24BE;
    function readUInt40BE(buf, offset) {
      return (buf.readUInt8(offset) || 0) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 1);
    }
    module.exports.readUInt40BE = readUInt40BE;
    function writeUInt40BE(buf, val, offset) {
      val = check_value(val, 0, 1099511627775);
      check_bounds(buf, offset, 5);
      buf.writeUInt8(Math.floor(val * SHIFT_RIGHT_32), offset);
      buf.writeInt32BE(val & -1, offset + 1);
    }
    module.exports.writeUInt40BE = writeUInt40BE;
    function readUInt48BE(buf, offset) {
      return buf.readUInt16BE(offset) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 2);
    }
    module.exports.readUInt48BE = readUInt48BE;
    function writeUInt48BE(buf, val, offset) {
      val = check_value(val, 0, 281474976710655);
      check_bounds(buf, offset, 6);
      buf.writeUInt16BE(Math.floor(val * SHIFT_RIGHT_32), offset);
      buf.writeInt32BE(val & -1, offset + 2);
    }
    module.exports.writeUInt48BE = writeUInt48BE;
    function readUInt56BE(buf, offset) {
      return ((buf.readUInt8(offset) || 0) << 16 | buf.readUInt16BE(offset + 1)) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 3);
    }
    module.exports.readUInt56BE = readUInt56BE;
    function writeUInt56BE(buf, val, offset) {
      val = check_value(val, 0, 72057594037927940);
      check_bounds(buf, offset, 7);
      if (val < 72057594037927940) {
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt8(hi >>> 16, offset);
        buf.writeUInt16BE(hi & 65535, offset + 1);
        buf.writeInt32BE(val & -1, offset + 3);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
      }
    }
    module.exports.writeUInt56BE = writeUInt56BE;
    function readUInt64BE(buf, offset) {
      return buf.readUInt32BE(offset) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 4);
    }
    module.exports.readUInt64BE = readUInt64BE;
    function writeUInt64BE(buf, val, offset) {
      val = check_value(val, 0, 18446744073709552e3);
      check_bounds(buf, offset, 8);
      if (val < 18446744073709552e3) {
        buf.writeUInt32BE(Math.floor(val * SHIFT_RIGHT_32), offset);
        buf.writeInt32BE(val & -1, offset + 4);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
        buf[offset + 7] = 255;
      }
    }
    module.exports.writeUInt64BE = writeUInt64BE;
    function readUInt24LE(buf, offset) {
      return buf.readUInt8(offset + 2) << 16 | buf.readUInt16LE(offset);
    }
    module.exports.readUInt24LE = readUInt24LE;
    function writeUInt24LE(buf, val, offset) {
      val = check_value(val, 0, 16777215);
      check_bounds(buf, offset, 3);
      buf.writeUInt16LE(val & 65535, offset);
      buf.writeUInt8(val >>> 16, offset + 2);
    }
    module.exports.writeUInt24LE = writeUInt24LE;
    function readUInt40LE(buf, offset) {
      return (buf.readUInt8(offset + 4) || 0) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readUInt40LE = readUInt40LE;
    function writeUInt40LE(buf, val, offset) {
      val = check_value(val, 0, 1099511627775);
      check_bounds(buf, offset, 5);
      buf.writeInt32LE(val & -1, offset);
      buf.writeUInt8(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
    }
    module.exports.writeUInt40LE = writeUInt40LE;
    function readUInt48LE(buf, offset) {
      return buf.readUInt16LE(offset + 4) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readUInt48LE = readUInt48LE;
    function writeUInt48LE(buf, val, offset) {
      val = check_value(val, 0, 281474976710655);
      check_bounds(buf, offset, 6);
      buf.writeInt32LE(val & -1, offset);
      buf.writeUInt16LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
    }
    module.exports.writeUInt48LE = writeUInt48LE;
    function readUInt56LE(buf, offset) {
      return ((buf.readUInt8(offset + 6) || 0) << 16 | buf.readUInt16LE(offset + 4)) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readUInt56LE = readUInt56LE;
    function writeUInt56LE(buf, val, offset) {
      val = check_value(val, 0, 72057594037927940);
      check_bounds(buf, offset, 7);
      if (val < 72057594037927940) {
        buf.writeInt32LE(val & -1, offset);
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt16LE(hi & 65535, offset + 4);
        buf.writeUInt8(hi >>> 16, offset + 6);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
      }
    }
    module.exports.writeUInt56LE = writeUInt56LE;
    function readUInt64LE(buf, offset) {
      return buf.readUInt32LE(offset + 4) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readUInt64LE = readUInt64LE;
    function writeUInt64LE(buf, val, offset) {
      val = check_value(val, 0, 18446744073709552e3);
      check_bounds(buf, offset, 8);
      if (val < 18446744073709552e3) {
        buf.writeInt32LE(val & -1, offset);
        buf.writeUInt32LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
        buf[offset + 7] = 255;
      }
    }
    module.exports.writeUInt64LE = writeUInt64LE;
    function readInt24BE(buf, offset) {
      return (buf.readInt8(offset) << 16) + buf.readUInt16BE(offset + 1);
    }
    module.exports.readInt24BE = readInt24BE;
    function writeInt24BE(buf, val, offset) {
      val = check_value(val, -8388608, 8388607);
      check_bounds(buf, offset, 3);
      buf.writeInt8(val >> 16, offset);
      buf.writeUInt16BE(val & 65535, offset + 1);
    }
    module.exports.writeInt24BE = writeInt24BE;
    function readInt40BE(buf, offset) {
      return (buf.readInt8(offset) || 0) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 1);
    }
    module.exports.readInt40BE = readInt40BE;
    function writeInt40BE(buf, val, offset) {
      val = check_value(val, -549755813888, 549755813887);
      check_bounds(buf, offset, 5);
      buf.writeInt8(Math.floor(val * SHIFT_RIGHT_32), offset);
      buf.writeInt32BE(val & -1, offset + 1);
    }
    module.exports.writeInt40BE = writeInt40BE;
    function readInt48BE(buf, offset) {
      return buf.readInt16BE(offset) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 2);
    }
    module.exports.readInt48BE = readInt48BE;
    function writeInt48BE(buf, val, offset) {
      val = check_value(val, -140737488355328, 140737488355327);
      check_bounds(buf, offset, 6);
      buf.writeInt16BE(Math.floor(val * SHIFT_RIGHT_32), offset);
      buf.writeInt32BE(val & -1, offset + 2);
    }
    module.exports.writeInt48BE = writeInt48BE;
    function readInt56BE(buf, offset) {
      return (((buf.readInt8(offset) || 0) << 16) + buf.readUInt16BE(offset + 1)) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 3);
    }
    module.exports.readInt56BE = readInt56BE;
    function writeInt56BE(buf, val, offset) {
      val = check_value(val, -576460752303423500, 36028797018963970);
      check_bounds(buf, offset, 7);
      if (val < 36028797018963970) {
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeInt8(hi >> 16, offset);
        buf.writeUInt16BE(hi & 65535, offset + 1);
        buf.writeInt32BE(val & -1, offset + 3);
      } else {
        buf[offset] = 127;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
      }
    }
    module.exports.writeInt56BE = writeInt56BE;
    function readInt64BE(buf, offset) {
      return buf.readInt32BE(offset) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 4);
    }
    module.exports.readInt64BE = readInt64BE;
    function writeInt64BE(buf, val, offset) {
      val = check_value(val, -23611832414348226e5, 9223372036854776e3);
      check_bounds(buf, offset, 8);
      if (val < 9223372036854776e3) {
        buf.writeInt32BE(Math.floor(val * SHIFT_RIGHT_32), offset);
        buf.writeInt32BE(val & -1, offset + 4);
      } else {
        buf[offset] = 127;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
        buf[offset + 7] = 255;
      }
    }
    module.exports.writeInt64BE = writeInt64BE;
    function readInt24LE(buf, offset) {
      return (buf.readInt8(offset + 2) << 16) + buf.readUInt16LE(offset);
    }
    module.exports.readInt24LE = readInt24LE;
    function writeInt24LE(buf, val, offset) {
      val = check_value(val, -8388608, 8388607);
      check_bounds(buf, offset, 3);
      buf.writeUInt16LE(val & 65535, offset);
      buf.writeInt8(val >> 16, offset + 2);
    }
    module.exports.writeInt24LE = writeInt24LE;
    function readInt40LE(buf, offset) {
      return (buf.readInt8(offset + 4) || 0) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readInt40LE = readInt40LE;
    function writeInt40LE(buf, val, offset) {
      val = check_value(val, -549755813888, 549755813887);
      check_bounds(buf, offset, 5);
      buf.writeInt32LE(val & -1, offset);
      buf.writeInt8(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
    }
    module.exports.writeInt40LE = writeInt40LE;
    function readInt48LE(buf, offset) {
      return buf.readInt16LE(offset + 4) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readInt48LE = readInt48LE;
    function writeInt48LE(buf, val, offset) {
      val = check_value(val, -140737488355328, 140737488355327);
      check_bounds(buf, offset, 6);
      buf.writeInt32LE(val & -1, offset);
      buf.writeInt16LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
    }
    module.exports.writeInt48LE = writeInt48LE;
    function readInt56LE(buf, offset) {
      return (((buf.readInt8(offset + 6) || 0) << 16) + buf.readUInt16LE(offset + 4)) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readInt56LE = readInt56LE;
    function writeInt56LE(buf, val, offset) {
      val = check_value(val, -36028797018963970, 36028797018963970);
      check_bounds(buf, offset, 7);
      if (val < 36028797018963970) {
        buf.writeInt32LE(val & -1, offset);
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt16LE(hi & 65535, offset + 4);
        buf.writeInt8(hi >> 16, offset + 6);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 127;
      }
    }
    module.exports.writeInt56LE = writeInt56LE;
    function readInt64LE(buf, offset) {
      return buf.readInt32LE(offset + 4) * SHIFT_LEFT_32 + buf.readUInt32LE(offset);
    }
    module.exports.readInt64LE = readInt64LE;
    function writeInt64LE(buf, val, offset) {
      val = check_value(val, -9223372036854776e3, 9223372036854776e3);
      check_bounds(buf, offset, 8);
      if (val < 9223372036854776e3) {
        buf.writeInt32LE(val & -1, offset);
        buf.writeInt32LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4);
      } else {
        buf[offset] = 255;
        buf[offset + 1] = 255;
        buf[offset + 2] = 255;
        buf[offset + 3] = 255;
        buf[offset + 4] = 255;
        buf[offset + 5] = 255;
        buf[offset + 6] = 255;
        buf[offset + 7] = 127;
      }
    }
    module.exports.writeInt64LE = writeInt64LE;
  }
});

// node_modules/amqplib/lib/codec.js
var require_codec = __commonJS({
  "node_modules/amqplib/lib/codec.js"(exports, module) {
    "use strict";
    var ints = require_buffer_more_ints();
    function isFloatingPoint(n) {
      return n >= 9223372036854776e3 || Math.abs(n) < 1125899906842624 && Math.floor(n) !== n;
    }
    function encodeTable(buffer, val, offset) {
      var start = offset;
      offset += 4;
      for (var key in val) {
        if (val[key] !== void 0) {
          var len = Buffer.byteLength(key);
          buffer.writeUInt8(len, offset);
          offset++;
          buffer.write(key, offset, "utf8");
          offset += len;
          offset += encodeFieldValue(buffer, val[key], offset);
        }
      }
      var size = offset - start;
      buffer.writeUInt32BE(size - 4, start);
      return size;
    }
    function encodeArray(buffer, val, offset) {
      var start = offset;
      offset += 4;
      for (var i = 0, num = val.length; i < num; i++) {
        offset += encodeFieldValue(buffer, val[i], offset);
      }
      var size = offset - start;
      buffer.writeUInt32BE(size - 4, start);
      return size;
    }
    function encodeFieldValue(buffer, value, offset) {
      var start = offset;
      var type = typeof value, val = value;
      if (value && type === "object" && value.hasOwnProperty("!")) {
        val = value.value;
        type = value["!"];
      }
      if (type == "number") {
        if (isFloatingPoint(val)) {
          type = "double";
        } else {
          if (val < 128 && val >= -128) {
            type = "byte";
          } else if (val >= -32768 && val < 32768) {
            type = "short";
          } else if (val >= -2147483648 && val < 2147483648) {
            type = "int";
          } else {
            type = "long";
          }
        }
      }
      function tag(t) {
        buffer.write(t, offset);
        offset++;
      }
      switch (type) {
        case "string":
          var len = Buffer.byteLength(val, "utf8");
          tag("S");
          buffer.writeUInt32BE(len, offset);
          offset += 4;
          buffer.write(val, offset, "utf8");
          offset += len;
          break;
        case "object":
          if (val === null) {
            tag("V");
          } else if (Array.isArray(val)) {
            tag("A");
            offset += encodeArray(buffer, val, offset);
          } else if (Buffer.isBuffer(val)) {
            tag("x");
            buffer.writeUInt32BE(val.length, offset);
            offset += 4;
            val.copy(buffer, offset);
            offset += val.length;
          } else {
            tag("F");
            offset += encodeTable(buffer, val, offset);
          }
          break;
        case "boolean":
          tag("t");
          buffer.writeUInt8(val ? 1 : 0, offset);
          offset++;
          break;
        case "double":
        case "float64":
          tag("d");
          buffer.writeDoubleBE(val, offset);
          offset += 8;
          break;
        case "byte":
        case "int8":
          tag("b");
          buffer.writeInt8(val, offset);
          offset++;
          break;
        case "short":
        case "int16":
          tag("s");
          buffer.writeInt16BE(val, offset);
          offset += 2;
          break;
        case "int":
        case "int32":
          tag("I");
          buffer.writeInt32BE(val, offset);
          offset += 4;
          break;
        case "long":
        case "int64":
          tag("l");
          ints.writeInt64BE(buffer, val, offset);
          offset += 8;
          break;
        case "timestamp":
          tag("T");
          ints.writeUInt64BE(buffer, val, offset);
          offset += 8;
          break;
        case "float":
          tag("f");
          buffer.writeFloatBE(val, offset);
          offset += 4;
          break;
        case "decimal":
          tag("D");
          if (val.hasOwnProperty("places") && val.hasOwnProperty("digits") && val.places >= 0 && val.places < 256) {
            buffer[offset] = val.places;
            offset++;
            buffer.writeUInt32BE(val.digits, offset);
            offset += 4;
          } else
            throw new TypeError(
              "Decimal value must be {'places': 0..255, 'digits': uint32}, got " + JSON.stringify(val)
            );
          break;
        default:
          throw new TypeError("Unknown type to encode: " + type);
      }
      return offset - start;
    }
    function decodeFields(slice) {
      var fields = {}, offset = 0, size = slice.length;
      var len, key, val;
      function decodeFieldValue() {
        var tag = String.fromCharCode(slice[offset]);
        offset++;
        switch (tag) {
          case "b":
            val = slice.readInt8(offset);
            offset++;
            break;
          case "S":
            len = slice.readUInt32BE(offset);
            offset += 4;
            val = slice.toString("utf8", offset, offset + len);
            offset += len;
            break;
          case "I":
            val = slice.readInt32BE(offset);
            offset += 4;
            break;
          case "D":
            var places = slice[offset];
            offset++;
            var digits = slice.readUInt32BE(offset);
            offset += 4;
            val = { "!": "decimal", value: { places, digits } };
            break;
          case "T":
            val = ints.readUInt64BE(slice, offset);
            offset += 8;
            val = { "!": "timestamp", value: val };
            break;
          case "F":
            len = slice.readUInt32BE(offset);
            offset += 4;
            val = decodeFields(slice.subarray(offset, offset + len));
            offset += len;
            break;
          case "A":
            len = slice.readUInt32BE(offset);
            offset += 4;
            decodeArray(offset + len);
            break;
          case "d":
            val = slice.readDoubleBE(offset);
            offset += 8;
            break;
          case "f":
            val = slice.readFloatBE(offset);
            offset += 4;
            break;
          case "l":
            val = ints.readInt64BE(slice, offset);
            offset += 8;
            break;
          case "s":
            val = slice.readInt16BE(offset);
            offset += 2;
            break;
          case "t":
            val = slice[offset] != 0;
            offset++;
            break;
          case "V":
            val = null;
            break;
          case "x":
            len = slice.readUInt32BE(offset);
            offset += 4;
            val = slice.subarray(offset, offset + len);
            offset += len;
            break;
          default:
            throw new TypeError('Unexpected type tag "' + tag + '"');
        }
      }
      function decodeArray(until) {
        var vals = [];
        while (offset < until) {
          decodeFieldValue();
          vals.push(val);
        }
        val = vals;
      }
      while (offset < size) {
        len = slice.readUInt8(offset);
        offset++;
        key = slice.toString("utf8", offset, offset + len);
        offset += len;
        decodeFieldValue();
        fields[key] = val;
      }
      return fields;
    }
    module.exports.encodeTable = encodeTable;
    module.exports.decodeFields = decodeFields;
  }
});

// node_modules/amqplib/lib/defs.js
var require_defs = __commonJS({
  "node_modules/amqplib/lib/defs.js"(exports, module) {
    "use strict";
    function decodeBasicQos(buffer) {
      var val, offset = 0, fields = {
        prefetchSize: void 0,
        prefetchCount: void 0,
        global: void 0
      };
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.prefetchSize = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.prefetchCount = val;
      val = !!(1 & buffer[offset]);
      fields.global = val;
      return fields;
    }
    function encodeBasicQos(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(19);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932170, 7);
      offset = 11;
      val = fields.prefetchSize;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'prefetchSize' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      val = fields.prefetchCount;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'prefetchCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.global;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicQosOk(buffer) {
      return {};
    }
    function encodeBasicQosOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932171, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicConsume(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        consumerTag: void 0,
        noLocal: void 0,
        noAck: void 0,
        exclusive: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.consumerTag = val;
      val = !!(1 & buffer[offset]);
      fields.noLocal = val;
      val = !!(2 & buffer[offset]);
      fields.noAck = val;
      val = !!(4 & buffer[offset]);
      fields.exclusive = val;
      val = !!(8 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeBasicConsume(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      val = fields.consumerTag;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
      var consumerTag_len = Buffer.byteLength(val, "utf8");
      varyingSize += consumerTag_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932180, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.consumerTag;
      void 0 === val && (val = "");
      buffer[offset] = consumerTag_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += consumerTag_len;
      val = fields.noLocal;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.noAck;
      void 0 === val && (val = false);
      val && (bits += 2);
      val = fields.exclusive;
      void 0 === val && (val = false);
      val && (bits += 4);
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 8);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicConsumeOk(buffer) {
      var val, len, offset = 0, fields = {
        consumerTag: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.consumerTag = val;
      return fields;
    }
    function encodeBasicConsumeOk(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.consumerTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'consumerTag'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
      var consumerTag_len = Buffer.byteLength(val, "utf8");
      varyingSize += consumerTag_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932181, 7);
      offset = 11;
      val = fields.consumerTag;
      void 0 === val && (val = void 0);
      buffer[offset] = consumerTag_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += consumerTag_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicCancel(buffer) {
      var val, len, offset = 0, fields = {
        consumerTag: void 0,
        nowait: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.consumerTag = val;
      val = !!(1 & buffer[offset]);
      fields.nowait = val;
      return fields;
    }
    function encodeBasicCancel(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.consumerTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'consumerTag'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
      var consumerTag_len = Buffer.byteLength(val, "utf8");
      varyingSize += consumerTag_len;
      var buffer = Buffer.alloc(14 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932190, 7);
      offset = 11;
      val = fields.consumerTag;
      void 0 === val && (val = void 0);
      buffer[offset] = consumerTag_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += consumerTag_len;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicCancelOk(buffer) {
      var val, len, offset = 0, fields = {
        consumerTag: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.consumerTag = val;
      return fields;
    }
    function encodeBasicCancelOk(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.consumerTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'consumerTag'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
      var consumerTag_len = Buffer.byteLength(val, "utf8");
      varyingSize += consumerTag_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932191, 7);
      offset = 11;
      val = fields.consumerTag;
      void 0 === val && (val = void 0);
      buffer[offset] = consumerTag_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += consumerTag_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicPublish(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        exchange: void 0,
        routingKey: void 0,
        mandatory: void 0,
        immediate: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      val = !!(1 & buffer[offset]);
      fields.mandatory = val;
      val = !!(2 & buffer[offset]);
      fields.immediate = val;
      return fields;
    }
    function encodeBasicPublish(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.exchange;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932200, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.exchange;
      void 0 === val && (val = "");
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = "");
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      val = fields.mandatory;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.immediate;
      void 0 === val && (val = false);
      val && (bits += 2);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicReturn(buffer) {
      var val, len, offset = 0, fields = {
        replyCode: void 0,
        replyText: void 0,
        exchange: void 0,
        routingKey: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.replyCode = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.replyText = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      return fields;
    }
    function encodeBasicReturn(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.replyText;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
      var replyText_len = Buffer.byteLength(val, "utf8");
      varyingSize += replyText_len;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'routingKey'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932210, 7);
      offset = 11;
      val = fields.replyCode;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'replyCode'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.replyText;
      void 0 === val && (val = "");
      buffer[offset] = replyText_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += replyText_len;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = void 0);
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicDeliver(buffer) {
      var val, len, offset = 0, fields = {
        consumerTag: void 0,
        deliveryTag: void 0,
        redelivered: void 0,
        exchange: void 0,
        routingKey: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.consumerTag = val;
      val = ints.readUInt64BE(buffer, offset);
      offset += 8;
      fields.deliveryTag = val;
      val = !!(1 & buffer[offset]);
      fields.redelivered = val;
      offset++;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      return fields;
    }
    function encodeBasicDeliver(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.consumerTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'consumerTag'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
      var consumerTag_len = Buffer.byteLength(val, "utf8");
      varyingSize += consumerTag_len;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'routingKey'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      var buffer = Buffer.alloc(24 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932220, 7);
      offset = 11;
      val = fields.consumerTag;
      void 0 === val && (val = void 0);
      buffer[offset] = consumerTag_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += consumerTag_len;
      val = fields.deliveryTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'deliveryTag'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      val = fields.redelivered;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = void 0);
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicGet(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        noAck: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      val = !!(1 & buffer[offset]);
      fields.noAck = val;
      return fields;
    }
    function encodeBasicGet(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932230, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.noAck;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicGetOk(buffer) {
      var val, len, offset = 0, fields = {
        deliveryTag: void 0,
        redelivered: void 0,
        exchange: void 0,
        routingKey: void 0,
        messageCount: void 0
      };
      val = ints.readUInt64BE(buffer, offset);
      offset += 8;
      fields.deliveryTag = val;
      val = !!(1 & buffer[offset]);
      fields.redelivered = val;
      offset++;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.messageCount = val;
      return fields;
    }
    function encodeBasicGetOk(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'routingKey'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      var buffer = Buffer.alloc(27 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932231, 7);
      offset = 11;
      val = fields.deliveryTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'deliveryTag'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      val = fields.redelivered;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = void 0);
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      val = fields.messageCount;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'messageCount'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicGetEmpty(buffer) {
      var val, len, offset = 0, fields = {
        clusterId: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.clusterId = val;
      return fields;
    }
    function encodeBasicGetEmpty(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.clusterId;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'clusterId' is the wrong type; must be a string (up to 255 chars)");
      var clusterId_len = Buffer.byteLength(val, "utf8");
      varyingSize += clusterId_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932232, 7);
      offset = 11;
      val = fields.clusterId;
      void 0 === val && (val = "");
      buffer[offset] = clusterId_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += clusterId_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicAck(buffer) {
      var val, offset = 0, fields = {
        deliveryTag: void 0,
        multiple: void 0
      };
      val = ints.readUInt64BE(buffer, offset);
      offset += 8;
      fields.deliveryTag = val;
      val = !!(1 & buffer[offset]);
      fields.multiple = val;
      return fields;
    }
    function encodeBasicAck(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(21);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932240, 7);
      offset = 11;
      val = fields.deliveryTag;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      val = fields.multiple;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicReject(buffer) {
      var val, offset = 0, fields = {
        deliveryTag: void 0,
        requeue: void 0
      };
      val = ints.readUInt64BE(buffer, offset);
      offset += 8;
      fields.deliveryTag = val;
      val = !!(1 & buffer[offset]);
      fields.requeue = val;
      return fields;
    }
    function encodeBasicReject(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(21);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932250, 7);
      offset = 11;
      val = fields.deliveryTag;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'deliveryTag'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      val = fields.requeue;
      void 0 === val && (val = true);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicRecoverAsync(buffer) {
      var val, fields = {
        requeue: void 0
      };
      val = !!(1 & buffer[0]);
      fields.requeue = val;
      return fields;
    }
    function encodeBasicRecoverAsync(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(13);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932260, 7);
      offset = 11;
      val = fields.requeue;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicRecover(buffer) {
      var val, fields = {
        requeue: void 0
      };
      val = !!(1 & buffer[0]);
      fields.requeue = val;
      return fields;
    }
    function encodeBasicRecover(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(13);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932270, 7);
      offset = 11;
      val = fields.requeue;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicRecoverOk(buffer) {
      return {};
    }
    function encodeBasicRecoverOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932271, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeBasicNack(buffer) {
      var val, offset = 0, fields = {
        deliveryTag: void 0,
        multiple: void 0,
        requeue: void 0
      };
      val = ints.readUInt64BE(buffer, offset);
      offset += 8;
      fields.deliveryTag = val;
      val = !!(1 & buffer[offset]);
      fields.multiple = val;
      val = !!(2 & buffer[offset]);
      fields.requeue = val;
      return fields;
    }
    function encodeBasicNack(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(21);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932280, 7);
      offset = 11;
      val = fields.deliveryTag;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
      ints.writeUInt64BE(buffer, val, offset);
      offset += 8;
      val = fields.multiple;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.requeue;
      void 0 === val && (val = true);
      val && (bits += 2);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionStart(buffer) {
      var val, len, offset = 0, fields = {
        versionMajor: void 0,
        versionMinor: void 0,
        serverProperties: void 0,
        mechanisms: void 0,
        locales: void 0
      };
      val = buffer[offset];
      offset++;
      fields.versionMajor = val;
      val = buffer[offset];
      offset++;
      fields.versionMinor = val;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.serverProperties = val;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.mechanisms = val;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.locales = val;
      return fields;
    }
    function encodeConnectionStart(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
      val = fields.serverProperties;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'serverProperties'");
      if ("object" != typeof val)
        throw new TypeError("Field 'serverProperties' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var serverProperties_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += serverProperties_encoded.length;
      val = fields.mechanisms;
      if (void 0 === val)
        val = Buffer.from("PLAIN");
      else if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'mechanisms' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      val = fields.locales;
      if (void 0 === val)
        val = Buffer.from("en_US");
      else if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'locales' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      var buffer = Buffer.alloc(22 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655370, 7);
      offset = 11;
      val = fields.versionMajor;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'versionMajor' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt8(val, offset);
      offset++;
      val = fields.versionMinor;
      if (void 0 === val)
        val = 9;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'versionMinor' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt8(val, offset);
      offset++;
      offset += serverProperties_encoded.copy(buffer, offset);
      val = fields.mechanisms;
      void 0 === val && (val = Buffer.from("PLAIN"));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      val = fields.locales;
      void 0 === val && (val = Buffer.from("en_US"));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionStartOk(buffer) {
      var val, len, offset = 0, fields = {
        clientProperties: void 0,
        mechanism: void 0,
        response: void 0,
        locale: void 0
      };
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.clientProperties = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.mechanism = val;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.response = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.locale = val;
      return fields;
    }
    function encodeConnectionStartOk(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
      val = fields.clientProperties;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'clientProperties'");
      if ("object" != typeof val)
        throw new TypeError("Field 'clientProperties' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var clientProperties_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += clientProperties_encoded.length;
      val = fields.mechanism;
      if (void 0 === val)
        val = "PLAIN";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'mechanism' is the wrong type; must be a string (up to 255 chars)");
      var mechanism_len = Buffer.byteLength(val, "utf8");
      varyingSize += mechanism_len;
      val = fields.response;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'response'");
      if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'response' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      val = fields.locale;
      if (void 0 === val)
        val = "en_US";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'locale' is the wrong type; must be a string (up to 255 chars)");
      var locale_len = Buffer.byteLength(val, "utf8");
      varyingSize += locale_len;
      var buffer = Buffer.alloc(18 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655371, 7);
      offset = 11;
      offset += clientProperties_encoded.copy(buffer, offset);
      val = fields.mechanism;
      void 0 === val && (val = "PLAIN");
      buffer[offset] = mechanism_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += mechanism_len;
      val = fields.response;
      void 0 === val && (val = Buffer.from(void 0));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      val = fields.locale;
      void 0 === val && (val = "en_US");
      buffer[offset] = locale_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += locale_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionSecure(buffer) {
      var val, len, offset = 0, fields = {
        challenge: void 0
      };
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.challenge = val;
      return fields;
    }
    function encodeConnectionSecure(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0;
      val = fields.challenge;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'challenge'");
      if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'challenge' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655380, 7);
      offset = 11;
      val = fields.challenge;
      void 0 === val && (val = Buffer.from(void 0));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionSecureOk(buffer) {
      var val, len, offset = 0, fields = {
        response: void 0
      };
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.response = val;
      return fields;
    }
    function encodeConnectionSecureOk(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0;
      val = fields.response;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'response'");
      if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'response' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655381, 7);
      offset = 11;
      val = fields.response;
      void 0 === val && (val = Buffer.from(void 0));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionTune(buffer) {
      var val, offset = 0, fields = {
        channelMax: void 0,
        frameMax: void 0,
        heartbeat: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.channelMax = val;
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.frameMax = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.heartbeat = val;
      return fields;
    }
    function encodeConnectionTune(channel, fields) {
      var offset = 0, val = null, buffer = Buffer.alloc(20);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655390, 7);
      offset = 11;
      val = fields.channelMax;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'channelMax' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.frameMax;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'frameMax' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      val = fields.heartbeat;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'heartbeat' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionTuneOk(buffer) {
      var val, offset = 0, fields = {
        channelMax: void 0,
        frameMax: void 0,
        heartbeat: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.channelMax = val;
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.frameMax = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.heartbeat = val;
      return fields;
    }
    function encodeConnectionTuneOk(channel, fields) {
      var offset = 0, val = null, buffer = Buffer.alloc(20);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655391, 7);
      offset = 11;
      val = fields.channelMax;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'channelMax' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.frameMax;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'frameMax' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      val = fields.heartbeat;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'heartbeat' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionOpen(buffer) {
      var val, len, offset = 0, fields = {
        virtualHost: void 0,
        capabilities: void 0,
        insist: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.virtualHost = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.capabilities = val;
      val = !!(1 & buffer[offset]);
      fields.insist = val;
      return fields;
    }
    function encodeConnectionOpen(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.virtualHost;
      if (void 0 === val)
        val = "/";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'virtualHost' is the wrong type; must be a string (up to 255 chars)");
      var virtualHost_len = Buffer.byteLength(val, "utf8");
      varyingSize += virtualHost_len;
      val = fields.capabilities;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'capabilities' is the wrong type; must be a string (up to 255 chars)");
      var capabilities_len = Buffer.byteLength(val, "utf8");
      varyingSize += capabilities_len;
      var buffer = Buffer.alloc(15 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655400, 7);
      offset = 11;
      val = fields.virtualHost;
      void 0 === val && (val = "/");
      buffer[offset] = virtualHost_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += virtualHost_len;
      val = fields.capabilities;
      void 0 === val && (val = "");
      buffer[offset] = capabilities_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += capabilities_len;
      val = fields.insist;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionOpenOk(buffer) {
      var val, len, offset = 0, fields = {
        knownHosts: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.knownHosts = val;
      return fields;
    }
    function encodeConnectionOpenOk(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.knownHosts;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'knownHosts' is the wrong type; must be a string (up to 255 chars)");
      var knownHosts_len = Buffer.byteLength(val, "utf8");
      varyingSize += knownHosts_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655401, 7);
      offset = 11;
      val = fields.knownHosts;
      void 0 === val && (val = "");
      buffer[offset] = knownHosts_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += knownHosts_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionClose(buffer) {
      var val, len, offset = 0, fields = {
        replyCode: void 0,
        replyText: void 0,
        classId: void 0,
        methodId: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.replyCode = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.replyText = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.classId = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.methodId = val;
      return fields;
    }
    function encodeConnectionClose(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.replyText;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
      var replyText_len = Buffer.byteLength(val, "utf8");
      varyingSize += replyText_len;
      var buffer = Buffer.alloc(19 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655410, 7);
      offset = 11;
      val = fields.replyCode;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'replyCode'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.replyText;
      void 0 === val && (val = "");
      buffer[offset] = replyText_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += replyText_len;
      val = fields.classId;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'classId'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'classId' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.methodId;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'methodId'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'methodId' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionCloseOk(buffer) {
      return {};
    }
    function encodeConnectionCloseOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655411, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionBlocked(buffer) {
      var val, len, offset = 0, fields = {
        reason: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.reason = val;
      return fields;
    }
    function encodeConnectionBlocked(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.reason;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'reason' is the wrong type; must be a string (up to 255 chars)");
      var reason_len = Buffer.byteLength(val, "utf8");
      varyingSize += reason_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655420, 7);
      offset = 11;
      val = fields.reason;
      void 0 === val && (val = "");
      buffer[offset] = reason_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += reason_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionUnblocked(buffer) {
      return {};
    }
    function encodeConnectionUnblocked(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655421, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionUpdateSecret(buffer) {
      var val, len, offset = 0, fields = {
        newSecret: void 0,
        reason: void 0
      };
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.newSecret = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.reason = val;
      return fields;
    }
    function encodeConnectionUpdateSecret(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0;
      val = fields.newSecret;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'newSecret'");
      if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'newSecret' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      val = fields.reason;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'reason'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'reason' is the wrong type; must be a string (up to 255 chars)");
      var reason_len = Buffer.byteLength(val, "utf8");
      varyingSize += reason_len;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655430, 7);
      offset = 11;
      val = fields.newSecret;
      void 0 === val && (val = Buffer.from(void 0));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      val = fields.reason;
      void 0 === val && (val = void 0);
      buffer[offset] = reason_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += reason_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConnectionUpdateSecretOk(buffer) {
      return {};
    }
    function encodeConnectionUpdateSecretOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(655431, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelOpen(buffer) {
      var val, len, offset = 0, fields = {
        outOfBand: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.outOfBand = val;
      return fields;
    }
    function encodeChannelOpen(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.outOfBand;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'outOfBand' is the wrong type; must be a string (up to 255 chars)");
      var outOfBand_len = Buffer.byteLength(val, "utf8");
      varyingSize += outOfBand_len;
      var buffer = Buffer.alloc(13 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310730, 7);
      offset = 11;
      val = fields.outOfBand;
      void 0 === val && (val = "");
      buffer[offset] = outOfBand_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += outOfBand_len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelOpenOk(buffer) {
      var val, len, offset = 0, fields = {
        channelId: void 0
      };
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = buffer.subarray(offset, offset + len);
      offset += len;
      fields.channelId = val;
      return fields;
    }
    function encodeChannelOpenOk(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0;
      val = fields.channelId;
      if (void 0 === val)
        val = Buffer.from("");
      else if (!Buffer.isBuffer(val))
        throw new TypeError("Field 'channelId' is the wrong type; must be a Buffer");
      varyingSize += val.length;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310731, 7);
      offset = 11;
      val = fields.channelId;
      void 0 === val && (val = Buffer.from(""));
      len = val.length;
      buffer.writeUInt32BE(len, offset);
      offset += 4;
      val.copy(buffer, offset);
      offset += len;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelFlow(buffer) {
      var val, fields = {
        active: void 0
      };
      val = !!(1 & buffer[0]);
      fields.active = val;
      return fields;
    }
    function encodeChannelFlow(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(13);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310740, 7);
      offset = 11;
      val = fields.active;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'active'");
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelFlowOk(buffer) {
      var val, fields = {
        active: void 0
      };
      val = !!(1 & buffer[0]);
      fields.active = val;
      return fields;
    }
    function encodeChannelFlowOk(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(13);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310741, 7);
      offset = 11;
      val = fields.active;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'active'");
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelClose(buffer) {
      var val, len, offset = 0, fields = {
        replyCode: void 0,
        replyText: void 0,
        classId: void 0,
        methodId: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.replyCode = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.replyText = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.classId = val;
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.methodId = val;
      return fields;
    }
    function encodeChannelClose(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.replyText;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
      var replyText_len = Buffer.byteLength(val, "utf8");
      varyingSize += replyText_len;
      var buffer = Buffer.alloc(19 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310760, 7);
      offset = 11;
      val = fields.replyCode;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'replyCode'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.replyText;
      void 0 === val && (val = "");
      buffer[offset] = replyText_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += replyText_len;
      val = fields.classId;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'classId'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'classId' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.methodId;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'methodId'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'methodId' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeChannelCloseOk(buffer) {
      return {};
    }
    function encodeChannelCloseOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1310761, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeAccessRequest(buffer) {
      var val, len, offset = 0, fields = {
        realm: void 0,
        exclusive: void 0,
        passive: void 0,
        active: void 0,
        write: void 0,
        read: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.realm = val;
      val = !!(1 & buffer[offset]);
      fields.exclusive = val;
      val = !!(2 & buffer[offset]);
      fields.passive = val;
      val = !!(4 & buffer[offset]);
      fields.active = val;
      val = !!(8 & buffer[offset]);
      fields.write = val;
      val = !!(16 & buffer[offset]);
      fields.read = val;
      return fields;
    }
    function encodeAccessRequest(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.realm;
      if (void 0 === val)
        val = "/data";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'realm' is the wrong type; must be a string (up to 255 chars)");
      var realm_len = Buffer.byteLength(val, "utf8");
      varyingSize += realm_len;
      var buffer = Buffer.alloc(14 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1966090, 7);
      offset = 11;
      val = fields.realm;
      void 0 === val && (val = "/data");
      buffer[offset] = realm_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += realm_len;
      val = fields.exclusive;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.passive;
      void 0 === val && (val = true);
      val && (bits += 2);
      val = fields.active;
      void 0 === val && (val = true);
      val && (bits += 4);
      val = fields.write;
      void 0 === val && (val = true);
      val && (bits += 8);
      val = fields.read;
      void 0 === val && (val = true);
      val && (bits += 16);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeAccessRequestOk(buffer) {
      var val, offset = 0, fields = {
        ticket: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      return fields;
    }
    function encodeAccessRequestOk(channel, fields) {
      var offset = 0, val = null, buffer = Buffer.alloc(14);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(1966091, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 1;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeDeclare(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        exchange: void 0,
        type: void 0,
        passive: void 0,
        durable: void 0,
        autoDelete: void 0,
        internal: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.type = val;
      val = !!(1 & buffer[offset]);
      fields.passive = val;
      val = !!(2 & buffer[offset]);
      fields.durable = val;
      val = !!(4 & buffer[offset]);
      fields.autoDelete = val;
      val = !!(8 & buffer[offset]);
      fields.internal = val;
      val = !!(16 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeExchangeDeclare(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.type;
      if (void 0 === val)
        val = "direct";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'type' is the wrong type; must be a string (up to 255 chars)");
      var type_len = Buffer.byteLength(val, "utf8");
      varyingSize += type_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621450, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.type;
      void 0 === val && (val = "direct");
      buffer[offset] = type_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += type_len;
      val = fields.passive;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.durable;
      void 0 === val && (val = false);
      val && (bits += 2);
      val = fields.autoDelete;
      void 0 === val && (val = false);
      val && (bits += 4);
      val = fields.internal;
      void 0 === val && (val = false);
      val && (bits += 8);
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 16);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeDeclareOk(buffer) {
      return {};
    }
    function encodeExchangeDeclareOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621451, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeDelete(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        exchange: void 0,
        ifUnused: void 0,
        nowait: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      val = !!(1 & buffer[offset]);
      fields.ifUnused = val;
      val = !!(2 & buffer[offset]);
      fields.nowait = val;
      return fields;
    }
    function encodeExchangeDelete(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621460, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.ifUnused;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 2);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeDeleteOk(buffer) {
      return {};
    }
    function encodeExchangeDeleteOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621461, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeBind(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        destination: void 0,
        source: void 0,
        routingKey: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.destination = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.source = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      val = !!(1 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeExchangeBind(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.destination;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'destination'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'destination' is the wrong type; must be a string (up to 255 chars)");
      var destination_len = Buffer.byteLength(val, "utf8");
      varyingSize += destination_len;
      val = fields.source;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'source'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'source' is the wrong type; must be a string (up to 255 chars)");
      var source_len = Buffer.byteLength(val, "utf8");
      varyingSize += source_len;
      val = fields.routingKey;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(18 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621470, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.destination;
      void 0 === val && (val = void 0);
      buffer[offset] = destination_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += destination_len;
      val = fields.source;
      void 0 === val && (val = void 0);
      buffer[offset] = source_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += source_len;
      val = fields.routingKey;
      void 0 === val && (val = "");
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeBindOk(buffer) {
      return {};
    }
    function encodeExchangeBindOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621471, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeUnbind(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        destination: void 0,
        source: void 0,
        routingKey: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.destination = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.source = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      val = !!(1 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeExchangeUnbind(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.destination;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'destination'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'destination' is the wrong type; must be a string (up to 255 chars)");
      var destination_len = Buffer.byteLength(val, "utf8");
      varyingSize += destination_len;
      val = fields.source;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'source'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'source' is the wrong type; must be a string (up to 255 chars)");
      var source_len = Buffer.byteLength(val, "utf8");
      varyingSize += source_len;
      val = fields.routingKey;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(18 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621480, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.destination;
      void 0 === val && (val = void 0);
      buffer[offset] = destination_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += destination_len;
      val = fields.source;
      void 0 === val && (val = void 0);
      buffer[offset] = source_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += source_len;
      val = fields.routingKey;
      void 0 === val && (val = "");
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeExchangeUnbindOk(buffer) {
      return {};
    }
    function encodeExchangeUnbindOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(2621491, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueDeclare(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        passive: void 0,
        durable: void 0,
        exclusive: void 0,
        autoDelete: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      val = !!(1 & buffer[offset]);
      fields.passive = val;
      val = !!(2 & buffer[offset]);
      fields.durable = val;
      val = !!(4 & buffer[offset]);
      fields.exclusive = val;
      val = !!(8 & buffer[offset]);
      fields.autoDelete = val;
      val = !!(16 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeQueueDeclare(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276810, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.passive;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.durable;
      void 0 === val && (val = false);
      val && (bits += 2);
      val = fields.exclusive;
      void 0 === val && (val = false);
      val && (bits += 4);
      val = fields.autoDelete;
      void 0 === val && (val = false);
      val && (bits += 8);
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 16);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueDeclareOk(buffer) {
      var val, len, offset = 0, fields = {
        queue: void 0,
        messageCount: void 0,
        consumerCount: void 0
      };
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.messageCount = val;
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.consumerCount = val;
      return fields;
    }
    function encodeQueueDeclareOk(channel, fields) {
      var offset = 0, val = null, varyingSize = 0;
      val = fields.queue;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'queue'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      var buffer = Buffer.alloc(21 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276811, 7);
      offset = 11;
      val = fields.queue;
      void 0 === val && (val = void 0);
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.messageCount;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'messageCount'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      val = fields.consumerCount;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'consumerCount'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'consumerCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueBind(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        exchange: void 0,
        routingKey: void 0,
        nowait: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      val = !!(1 & buffer[offset]);
      fields.nowait = val;
      offset++;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeQueueBind(channel, fields) {
      var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(18 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276820, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = "");
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      bits = 0;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueBindOk(buffer) {
      return {};
    }
    function encodeQueueBindOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276821, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueuePurge(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        nowait: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      val = !!(1 & buffer[offset]);
      fields.nowait = val;
      return fields;
    }
    function encodeQueuePurge(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276830, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueuePurgeOk(buffer) {
      var val, offset = 0, fields = {
        messageCount: void 0
      };
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.messageCount = val;
      return fields;
    }
    function encodeQueuePurgeOk(channel, fields) {
      var offset = 0, val = null, buffer = Buffer.alloc(16);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276831, 7);
      offset = 11;
      val = fields.messageCount;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'messageCount'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueDelete(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        ifUnused: void 0,
        ifEmpty: void 0,
        nowait: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      val = !!(1 & buffer[offset]);
      fields.ifUnused = val;
      val = !!(2 & buffer[offset]);
      fields.ifEmpty = val;
      val = !!(4 & buffer[offset]);
      fields.nowait = val;
      return fields;
    }
    function encodeQueueDelete(channel, fields) {
      var offset = 0, val = null, bits = 0, varyingSize = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      var buffer = Buffer.alloc(16 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276840, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.ifUnused;
      void 0 === val && (val = false);
      val && (bits += 1);
      val = fields.ifEmpty;
      void 0 === val && (val = false);
      val && (bits += 2);
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 4);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueDeleteOk(buffer) {
      var val, offset = 0, fields = {
        messageCount: void 0
      };
      val = buffer.readUInt32BE(offset);
      offset += 4;
      fields.messageCount = val;
      return fields;
    }
    function encodeQueueDeleteOk(channel, fields) {
      var offset = 0, val = null, buffer = Buffer.alloc(16);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276841, 7);
      offset = 11;
      val = fields.messageCount;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'messageCount'");
      if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt32BE(val, offset);
      offset += 4;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueUnbind(buffer) {
      var val, len, offset = 0, fields = {
        ticket: void 0,
        queue: void 0,
        exchange: void 0,
        routingKey: void 0,
        arguments: void 0
      };
      val = buffer.readUInt16BE(offset);
      offset += 2;
      fields.ticket = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.queue = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.exchange = val;
      len = buffer.readUInt8(offset);
      offset++;
      val = buffer.toString("utf8", offset, offset + len);
      offset += len;
      fields.routingKey = val;
      len = buffer.readUInt32BE(offset);
      offset += 4;
      val = decodeFields(buffer.subarray(offset, offset + len));
      offset += len;
      fields.arguments = val;
      return fields;
    }
    function encodeQueueUnbind(channel, fields) {
      var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
      val = fields.queue;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
      var queue_len = Buffer.byteLength(val, "utf8");
      varyingSize += queue_len;
      val = fields.exchange;
      if (void 0 === val)
        throw new Error("Missing value for mandatory field 'exchange'");
      if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
      var exchange_len = Buffer.byteLength(val, "utf8");
      varyingSize += exchange_len;
      val = fields.routingKey;
      if (void 0 === val)
        val = "";
      else if (!("string" == typeof val && Buffer.byteLength(val) < 256))
        throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
      var routingKey_len = Buffer.byteLength(val, "utf8");
      varyingSize += routingKey_len;
      val = fields.arguments;
      if (void 0 === val)
        val = {};
      else if ("object" != typeof val)
        throw new TypeError("Field 'arguments' is the wrong type; must be an object");
      len = encodeTable(SCRATCH, val, scratchOffset);
      var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
      scratchOffset += len;
      varyingSize += arguments_encoded.length;
      var buffer = Buffer.alloc(17 + varyingSize);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276850, 7);
      offset = 11;
      val = fields.ticket;
      if (void 0 === val)
        val = 0;
      else if ("number" != typeof val || isNaN(val))
        throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
      buffer.writeUInt16BE(val, offset);
      offset += 2;
      val = fields.queue;
      void 0 === val && (val = "");
      buffer[offset] = queue_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += queue_len;
      val = fields.exchange;
      void 0 === val && (val = void 0);
      buffer[offset] = exchange_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += exchange_len;
      val = fields.routingKey;
      void 0 === val && (val = "");
      buffer[offset] = routingKey_len;
      offset++;
      buffer.write(val, offset, "utf8");
      offset += routingKey_len;
      offset += arguments_encoded.copy(buffer, offset);
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeQueueUnbindOk(buffer) {
      return {};
    }
    function encodeQueueUnbindOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3276851, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxSelect(buffer) {
      return {};
    }
    function encodeTxSelect(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898250, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxSelectOk(buffer) {
      return {};
    }
    function encodeTxSelectOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898251, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxCommit(buffer) {
      return {};
    }
    function encodeTxCommit(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898260, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxCommitOk(buffer) {
      return {};
    }
    function encodeTxCommitOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898261, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxRollback(buffer) {
      return {};
    }
    function encodeTxRollback(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898270, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeTxRollbackOk(buffer) {
      return {};
    }
    function encodeTxRollbackOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5898271, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConfirmSelect(buffer) {
      var val, fields = {
        nowait: void 0
      };
      val = !!(1 & buffer[0]);
      fields.nowait = val;
      return fields;
    }
    function encodeConfirmSelect(channel, fields) {
      var offset = 0, val = null, bits = 0, buffer = Buffer.alloc(13);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5570570, 7);
      offset = 11;
      val = fields.nowait;
      void 0 === val && (val = false);
      val && (bits += 1);
      buffer[offset] = bits;
      offset++;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function decodeConfirmSelectOk(buffer) {
      return {};
    }
    function encodeConfirmSelectOk(channel, fields) {
      var offset = 0, buffer = Buffer.alloc(12);
      buffer[0] = 1;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(5570571, 7);
      offset = 11;
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      return buffer;
    }
    function encodeBasicProperties(channel, size, fields) {
      var val, len, offset = 0, flags = 0, scratchOffset = 0, varyingSize = 0;
      val = fields.contentType;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'contentType' is the wrong type; must be a string (up to 255 chars)");
        var contentType_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += contentType_len;
      }
      val = fields.contentEncoding;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'contentEncoding' is the wrong type; must be a string (up to 255 chars)");
        var contentEncoding_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += contentEncoding_len;
      }
      val = fields.headers;
      if (void 0 != val) {
        if ("object" != typeof val)
          throw new TypeError("Field 'headers' is the wrong type; must be an object");
        len = encodeTable(SCRATCH, val, scratchOffset);
        var headers_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
        scratchOffset += len;
        varyingSize += headers_encoded.length;
      }
      val = fields.deliveryMode;
      if (void 0 != val) {
        if ("number" != typeof val || isNaN(val))
          throw new TypeError("Field 'deliveryMode' is the wrong type; must be a number (but not NaN)");
        varyingSize += 1;
      }
      val = fields.priority;
      if (void 0 != val) {
        if ("number" != typeof val || isNaN(val))
          throw new TypeError("Field 'priority' is the wrong type; must be a number (but not NaN)");
        varyingSize += 1;
      }
      val = fields.correlationId;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'correlationId' is the wrong type; must be a string (up to 255 chars)");
        var correlationId_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += correlationId_len;
      }
      val = fields.replyTo;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'replyTo' is the wrong type; must be a string (up to 255 chars)");
        var replyTo_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += replyTo_len;
      }
      val = fields.expiration;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'expiration' is the wrong type; must be a string (up to 255 chars)");
        var expiration_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += expiration_len;
      }
      val = fields.messageId;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'messageId' is the wrong type; must be a string (up to 255 chars)");
        var messageId_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += messageId_len;
      }
      val = fields.timestamp;
      if (void 0 != val) {
        if ("number" != typeof val || isNaN(val))
          throw new TypeError("Field 'timestamp' is the wrong type; must be a number (but not NaN)");
        varyingSize += 8;
      }
      val = fields.type;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'type' is the wrong type; must be a string (up to 255 chars)");
        var type_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += type_len;
      }
      val = fields.userId;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'userId' is the wrong type; must be a string (up to 255 chars)");
        var userId_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += userId_len;
      }
      val = fields.appId;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'appId' is the wrong type; must be a string (up to 255 chars)");
        var appId_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += appId_len;
      }
      val = fields.clusterId;
      if (void 0 != val) {
        if (!("string" == typeof val && Buffer.byteLength(val) < 256))
          throw new TypeError("Field 'clusterId' is the wrong type; must be a string (up to 255 chars)");
        var clusterId_len = Buffer.byteLength(val, "utf8");
        varyingSize += 1;
        varyingSize += clusterId_len;
      }
      var buffer = Buffer.alloc(22 + varyingSize);
      buffer[0] = 2;
      buffer.writeUInt16BE(channel, 1);
      buffer.writeUInt32BE(3932160, 7);
      ints.writeUInt64BE(buffer, size, 11);
      flags = 0;
      offset = 21;
      val = fields.contentType;
      if (void 0 != val) {
        flags += 32768;
        buffer[offset] = contentType_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += contentType_len;
      }
      val = fields.contentEncoding;
      if (void 0 != val) {
        flags += 16384;
        buffer[offset] = contentEncoding_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += contentEncoding_len;
      }
      val = fields.headers;
      if (void 0 != val) {
        flags += 8192;
        offset += headers_encoded.copy(buffer, offset);
      }
      val = fields.deliveryMode;
      if (void 0 != val) {
        flags += 4096;
        buffer.writeUInt8(val, offset);
        offset++;
      }
      val = fields.priority;
      if (void 0 != val) {
        flags += 2048;
        buffer.writeUInt8(val, offset);
        offset++;
      }
      val = fields.correlationId;
      if (void 0 != val) {
        flags += 1024;
        buffer[offset] = correlationId_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += correlationId_len;
      }
      val = fields.replyTo;
      if (void 0 != val) {
        flags += 512;
        buffer[offset] = replyTo_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += replyTo_len;
      }
      val = fields.expiration;
      if (void 0 != val) {
        flags += 256;
        buffer[offset] = expiration_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += expiration_len;
      }
      val = fields.messageId;
      if (void 0 != val) {
        flags += 128;
        buffer[offset] = messageId_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += messageId_len;
      }
      val = fields.timestamp;
      if (void 0 != val) {
        flags += 64;
        ints.writeUInt64BE(buffer, val, offset);
        offset += 8;
      }
      val = fields.type;
      if (void 0 != val) {
        flags += 32;
        buffer[offset] = type_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += type_len;
      }
      val = fields.userId;
      if (void 0 != val) {
        flags += 16;
        buffer[offset] = userId_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += userId_len;
      }
      val = fields.appId;
      if (void 0 != val) {
        flags += 8;
        buffer[offset] = appId_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += appId_len;
      }
      val = fields.clusterId;
      if (void 0 != val) {
        flags += 4;
        buffer[offset] = clusterId_len;
        offset++;
        buffer.write(val, offset, "utf8");
        offset += clusterId_len;
      }
      buffer[offset] = 206;
      buffer.writeUInt32BE(offset - 7, 3);
      buffer.writeUInt16BE(flags, 19);
      return buffer.subarray(0, offset + 1);
    }
    function decodeBasicProperties(buffer) {
      var flags, val, len, offset = 2;
      flags = buffer.readUInt16BE(0);
      if (0 === flags)
        return {};
      var fields = {
        contentType: void 0,
        contentEncoding: void 0,
        headers: void 0,
        deliveryMode: void 0,
        priority: void 0,
        correlationId: void 0,
        replyTo: void 0,
        expiration: void 0,
        messageId: void 0,
        timestamp: void 0,
        type: void 0,
        userId: void 0,
        appId: void 0,
        clusterId: void 0
      };
      if (32768 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.contentType = val;
      }
      if (16384 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.contentEncoding = val;
      }
      if (8192 & flags) {
        len = buffer.readUInt32BE(offset);
        offset += 4;
        val = decodeFields(buffer.subarray(offset, offset + len));
        offset += len;
        fields.headers = val;
      }
      if (4096 & flags) {
        val = buffer[offset];
        offset++;
        fields.deliveryMode = val;
      }
      if (2048 & flags) {
        val = buffer[offset];
        offset++;
        fields.priority = val;
      }
      if (1024 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.correlationId = val;
      }
      if (512 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.replyTo = val;
      }
      if (256 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.expiration = val;
      }
      if (128 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.messageId = val;
      }
      if (64 & flags) {
        val = ints.readUInt64BE(buffer, offset);
        offset += 8;
        fields.timestamp = val;
      }
      if (32 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.type = val;
      }
      if (16 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.userId = val;
      }
      if (8 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.appId = val;
      }
      if (4 & flags) {
        len = buffer.readUInt8(offset);
        offset++;
        val = buffer.toString("utf8", offset, offset + len);
        offset += len;
        fields.clusterId = val;
      }
      return fields;
    }
    var codec = require_codec();
    var ints = require_buffer_more_ints();
    var encodeTable = codec.encodeTable;
    var decodeFields = codec.decodeFields;
    var SCRATCH = Buffer.alloc(65536);
    var EMPTY_OBJECT = Object.freeze({});
    module.exports.constants = {
      FRAME_METHOD: 1,
      FRAME_HEADER: 2,
      FRAME_BODY: 3,
      FRAME_HEARTBEAT: 8,
      FRAME_MIN_SIZE: 4096,
      FRAME_END: 206,
      REPLY_SUCCESS: 200,
      CONTENT_TOO_LARGE: 311,
      NO_ROUTE: 312,
      NO_CONSUMERS: 313,
      ACCESS_REFUSED: 403,
      NOT_FOUND: 404,
      RESOURCE_LOCKED: 405,
      PRECONDITION_FAILED: 406,
      CONNECTION_FORCED: 320,
      INVALID_PATH: 402,
      FRAME_ERROR: 501,
      SYNTAX_ERROR: 502,
      COMMAND_INVALID: 503,
      CHANNEL_ERROR: 504,
      UNEXPECTED_FRAME: 505,
      RESOURCE_ERROR: 506,
      NOT_ALLOWED: 530,
      NOT_IMPLEMENTED: 540,
      INTERNAL_ERROR: 541
    };
    module.exports.constant_strs = {
      "1": "FRAME-METHOD",
      "2": "FRAME-HEADER",
      "3": "FRAME-BODY",
      "8": "FRAME-HEARTBEAT",
      "200": "REPLY-SUCCESS",
      "206": "FRAME-END",
      "311": "CONTENT-TOO-LARGE",
      "312": "NO-ROUTE",
      "313": "NO-CONSUMERS",
      "320": "CONNECTION-FORCED",
      "402": "INVALID-PATH",
      "403": "ACCESS-REFUSED",
      "404": "NOT-FOUND",
      "405": "RESOURCE-LOCKED",
      "406": "PRECONDITION-FAILED",
      "501": "FRAME-ERROR",
      "502": "SYNTAX-ERROR",
      "503": "COMMAND-INVALID",
      "504": "CHANNEL-ERROR",
      "505": "UNEXPECTED-FRAME",
      "506": "RESOURCE-ERROR",
      "530": "NOT-ALLOWED",
      "540": "NOT-IMPLEMENTED",
      "541": "INTERNAL-ERROR",
      "4096": "FRAME-MIN-SIZE"
    };
    module.exports.FRAME_OVERHEAD = 8;
    module.exports.decode = function(id, buf) {
      switch (id) {
        case 3932170:
          return decodeBasicQos(buf);
        case 3932171:
          return decodeBasicQosOk(buf);
        case 3932180:
          return decodeBasicConsume(buf);
        case 3932181:
          return decodeBasicConsumeOk(buf);
        case 3932190:
          return decodeBasicCancel(buf);
        case 3932191:
          return decodeBasicCancelOk(buf);
        case 3932200:
          return decodeBasicPublish(buf);
        case 3932210:
          return decodeBasicReturn(buf);
        case 3932220:
          return decodeBasicDeliver(buf);
        case 3932230:
          return decodeBasicGet(buf);
        case 3932231:
          return decodeBasicGetOk(buf);
        case 3932232:
          return decodeBasicGetEmpty(buf);
        case 3932240:
          return decodeBasicAck(buf);
        case 3932250:
          return decodeBasicReject(buf);
        case 3932260:
          return decodeBasicRecoverAsync(buf);
        case 3932270:
          return decodeBasicRecover(buf);
        case 3932271:
          return decodeBasicRecoverOk(buf);
        case 3932280:
          return decodeBasicNack(buf);
        case 655370:
          return decodeConnectionStart(buf);
        case 655371:
          return decodeConnectionStartOk(buf);
        case 655380:
          return decodeConnectionSecure(buf);
        case 655381:
          return decodeConnectionSecureOk(buf);
        case 655390:
          return decodeConnectionTune(buf);
        case 655391:
          return decodeConnectionTuneOk(buf);
        case 655400:
          return decodeConnectionOpen(buf);
        case 655401:
          return decodeConnectionOpenOk(buf);
        case 655410:
          return decodeConnectionClose(buf);
        case 655411:
          return decodeConnectionCloseOk(buf);
        case 655420:
          return decodeConnectionBlocked(buf);
        case 655421:
          return decodeConnectionUnblocked(buf);
        case 655430:
          return decodeConnectionUpdateSecret(buf);
        case 655431:
          return decodeConnectionUpdateSecretOk(buf);
        case 1310730:
          return decodeChannelOpen(buf);
        case 1310731:
          return decodeChannelOpenOk(buf);
        case 1310740:
          return decodeChannelFlow(buf);
        case 1310741:
          return decodeChannelFlowOk(buf);
        case 1310760:
          return decodeChannelClose(buf);
        case 1310761:
          return decodeChannelCloseOk(buf);
        case 1966090:
          return decodeAccessRequest(buf);
        case 1966091:
          return decodeAccessRequestOk(buf);
        case 2621450:
          return decodeExchangeDeclare(buf);
        case 2621451:
          return decodeExchangeDeclareOk(buf);
        case 2621460:
          return decodeExchangeDelete(buf);
        case 2621461:
          return decodeExchangeDeleteOk(buf);
        case 2621470:
          return decodeExchangeBind(buf);
        case 2621471:
          return decodeExchangeBindOk(buf);
        case 2621480:
          return decodeExchangeUnbind(buf);
        case 2621491:
          return decodeExchangeUnbindOk(buf);
        case 3276810:
          return decodeQueueDeclare(buf);
        case 3276811:
          return decodeQueueDeclareOk(buf);
        case 3276820:
          return decodeQueueBind(buf);
        case 3276821:
          return decodeQueueBindOk(buf);
        case 3276830:
          return decodeQueuePurge(buf);
        case 3276831:
          return decodeQueuePurgeOk(buf);
        case 3276840:
          return decodeQueueDelete(buf);
        case 3276841:
          return decodeQueueDeleteOk(buf);
        case 3276850:
          return decodeQueueUnbind(buf);
        case 3276851:
          return decodeQueueUnbindOk(buf);
        case 5898250:
          return decodeTxSelect(buf);
        case 5898251:
          return decodeTxSelectOk(buf);
        case 5898260:
          return decodeTxCommit(buf);
        case 5898261:
          return decodeTxCommitOk(buf);
        case 5898270:
          return decodeTxRollback(buf);
        case 5898271:
          return decodeTxRollbackOk(buf);
        case 5570570:
          return decodeConfirmSelect(buf);
        case 5570571:
          return decodeConfirmSelectOk(buf);
        case 60:
          return decodeBasicProperties(buf);
        default:
          throw new Error("Unknown class/method ID");
      }
    };
    module.exports.encodeMethod = function(id, channel, fields) {
      switch (id) {
        case 3932170:
          return encodeBasicQos(channel, fields);
        case 3932171:
          return encodeBasicQosOk(channel, fields);
        case 3932180:
          return encodeBasicConsume(channel, fields);
        case 3932181:
          return encodeBasicConsumeOk(channel, fields);
        case 3932190:
          return encodeBasicCancel(channel, fields);
        case 3932191:
          return encodeBasicCancelOk(channel, fields);
        case 3932200:
          return encodeBasicPublish(channel, fields);
        case 3932210:
          return encodeBasicReturn(channel, fields);
        case 3932220:
          return encodeBasicDeliver(channel, fields);
        case 3932230:
          return encodeBasicGet(channel, fields);
        case 3932231:
          return encodeBasicGetOk(channel, fields);
        case 3932232:
          return encodeBasicGetEmpty(channel, fields);
        case 3932240:
          return encodeBasicAck(channel, fields);
        case 3932250:
          return encodeBasicReject(channel, fields);
        case 3932260:
          return encodeBasicRecoverAsync(channel, fields);
        case 3932270:
          return encodeBasicRecover(channel, fields);
        case 3932271:
          return encodeBasicRecoverOk(channel, fields);
        case 3932280:
          return encodeBasicNack(channel, fields);
        case 655370:
          return encodeConnectionStart(channel, fields);
        case 655371:
          return encodeConnectionStartOk(channel, fields);
        case 655380:
          return encodeConnectionSecure(channel, fields);
        case 655381:
          return encodeConnectionSecureOk(channel, fields);
        case 655390:
          return encodeConnectionTune(channel, fields);
        case 655391:
          return encodeConnectionTuneOk(channel, fields);
        case 655400:
          return encodeConnectionOpen(channel, fields);
        case 655401:
          return encodeConnectionOpenOk(channel, fields);
        case 655410:
          return encodeConnectionClose(channel, fields);
        case 655411:
          return encodeConnectionCloseOk(channel, fields);
        case 655420:
          return encodeConnectionBlocked(channel, fields);
        case 655421:
          return encodeConnectionUnblocked(channel, fields);
        case 655430:
          return encodeConnectionUpdateSecret(channel, fields);
        case 655431:
          return encodeConnectionUpdateSecretOk(channel, fields);
        case 1310730:
          return encodeChannelOpen(channel, fields);
        case 1310731:
          return encodeChannelOpenOk(channel, fields);
        case 1310740:
          return encodeChannelFlow(channel, fields);
        case 1310741:
          return encodeChannelFlowOk(channel, fields);
        case 1310760:
          return encodeChannelClose(channel, fields);
        case 1310761:
          return encodeChannelCloseOk(channel, fields);
        case 1966090:
          return encodeAccessRequest(channel, fields);
        case 1966091:
          return encodeAccessRequestOk(channel, fields);
        case 2621450:
          return encodeExchangeDeclare(channel, fields);
        case 2621451:
          return encodeExchangeDeclareOk(channel, fields);
        case 2621460:
          return encodeExchangeDelete(channel, fields);
        case 2621461:
          return encodeExchangeDeleteOk(channel, fields);
        case 2621470:
          return encodeExchangeBind(channel, fields);
        case 2621471:
          return encodeExchangeBindOk(channel, fields);
        case 2621480:
          return encodeExchangeUnbind(channel, fields);
        case 2621491:
          return encodeExchangeUnbindOk(channel, fields);
        case 3276810:
          return encodeQueueDeclare(channel, fields);
        case 3276811:
          return encodeQueueDeclareOk(channel, fields);
        case 3276820:
          return encodeQueueBind(channel, fields);
        case 3276821:
          return encodeQueueBindOk(channel, fields);
        case 3276830:
          return encodeQueuePurge(channel, fields);
        case 3276831:
          return encodeQueuePurgeOk(channel, fields);
        case 3276840:
          return encodeQueueDelete(channel, fields);
        case 3276841:
          return encodeQueueDeleteOk(channel, fields);
        case 3276850:
          return encodeQueueUnbind(channel, fields);
        case 3276851:
          return encodeQueueUnbindOk(channel, fields);
        case 5898250:
          return encodeTxSelect(channel, fields);
        case 5898251:
          return encodeTxSelectOk(channel, fields);
        case 5898260:
          return encodeTxCommit(channel, fields);
        case 5898261:
          return encodeTxCommitOk(channel, fields);
        case 5898270:
          return encodeTxRollback(channel, fields);
        case 5898271:
          return encodeTxRollbackOk(channel, fields);
        case 5570570:
          return encodeConfirmSelect(channel, fields);
        case 5570571:
          return encodeConfirmSelectOk(channel, fields);
        default:
          throw new Error("Unknown class/method ID");
      }
    };
    module.exports.encodeProperties = function(id, channel, size, fields) {
      switch (id) {
        case 60:
          return encodeBasicProperties(channel, size, fields);
        default:
          throw new Error("Unknown class/properties ID");
      }
    };
    module.exports.info = function(id) {
      switch (id) {
        case 3932170:
          return methodInfoBasicQos;
        case 3932171:
          return methodInfoBasicQosOk;
        case 3932180:
          return methodInfoBasicConsume;
        case 3932181:
          return methodInfoBasicConsumeOk;
        case 3932190:
          return methodInfoBasicCancel;
        case 3932191:
          return methodInfoBasicCancelOk;
        case 3932200:
          return methodInfoBasicPublish;
        case 3932210:
          return methodInfoBasicReturn;
        case 3932220:
          return methodInfoBasicDeliver;
        case 3932230:
          return methodInfoBasicGet;
        case 3932231:
          return methodInfoBasicGetOk;
        case 3932232:
          return methodInfoBasicGetEmpty;
        case 3932240:
          return methodInfoBasicAck;
        case 3932250:
          return methodInfoBasicReject;
        case 3932260:
          return methodInfoBasicRecoverAsync;
        case 3932270:
          return methodInfoBasicRecover;
        case 3932271:
          return methodInfoBasicRecoverOk;
        case 3932280:
          return methodInfoBasicNack;
        case 655370:
          return methodInfoConnectionStart;
        case 655371:
          return methodInfoConnectionStartOk;
        case 655380:
          return methodInfoConnectionSecure;
        case 655381:
          return methodInfoConnectionSecureOk;
        case 655390:
          return methodInfoConnectionTune;
        case 655391:
          return methodInfoConnectionTuneOk;
        case 655400:
          return methodInfoConnectionOpen;
        case 655401:
          return methodInfoConnectionOpenOk;
        case 655410:
          return methodInfoConnectionClose;
        case 655411:
          return methodInfoConnectionCloseOk;
        case 655420:
          return methodInfoConnectionBlocked;
        case 655421:
          return methodInfoConnectionUnblocked;
        case 655430:
          return methodInfoConnectionUpdateSecret;
        case 655431:
          return methodInfoConnectionUpdateSecretOk;
        case 1310730:
          return methodInfoChannelOpen;
        case 1310731:
          return methodInfoChannelOpenOk;
        case 1310740:
          return methodInfoChannelFlow;
        case 1310741:
          return methodInfoChannelFlowOk;
        case 1310760:
          return methodInfoChannelClose;
        case 1310761:
          return methodInfoChannelCloseOk;
        case 1966090:
          return methodInfoAccessRequest;
        case 1966091:
          return methodInfoAccessRequestOk;
        case 2621450:
          return methodInfoExchangeDeclare;
        case 2621451:
          return methodInfoExchangeDeclareOk;
        case 2621460:
          return methodInfoExchangeDelete;
        case 2621461:
          return methodInfoExchangeDeleteOk;
        case 2621470:
          return methodInfoExchangeBind;
        case 2621471:
          return methodInfoExchangeBindOk;
        case 2621480:
          return methodInfoExchangeUnbind;
        case 2621491:
          return methodInfoExchangeUnbindOk;
        case 3276810:
          return methodInfoQueueDeclare;
        case 3276811:
          return methodInfoQueueDeclareOk;
        case 3276820:
          return methodInfoQueueBind;
        case 3276821:
          return methodInfoQueueBindOk;
        case 3276830:
          return methodInfoQueuePurge;
        case 3276831:
          return methodInfoQueuePurgeOk;
        case 3276840:
          return methodInfoQueueDelete;
        case 3276841:
          return methodInfoQueueDeleteOk;
        case 3276850:
          return methodInfoQueueUnbind;
        case 3276851:
          return methodInfoQueueUnbindOk;
        case 5898250:
          return methodInfoTxSelect;
        case 5898251:
          return methodInfoTxSelectOk;
        case 5898260:
          return methodInfoTxCommit;
        case 5898261:
          return methodInfoTxCommitOk;
        case 5898270:
          return methodInfoTxRollback;
        case 5898271:
          return methodInfoTxRollbackOk;
        case 5570570:
          return methodInfoConfirmSelect;
        case 5570571:
          return methodInfoConfirmSelectOk;
        case 60:
          return propertiesInfoBasicProperties;
        default:
          throw new Error("Unknown class/method ID");
      }
    };
    module.exports.BasicQos = 3932170;
    var methodInfoBasicQos = module.exports.methodInfoBasicQos = {
      id: 3932170,
      classId: 60,
      methodId: 10,
      name: "BasicQos",
      args: [{
        type: "long",
        name: "prefetchSize",
        default: 0
      }, {
        type: "short",
        name: "prefetchCount",
        default: 0
      }, {
        type: "bit",
        name: "global",
        default: false
      }]
    };
    module.exports.BasicQosOk = 3932171;
    var methodInfoBasicQosOk = module.exports.methodInfoBasicQosOk = {
      id: 3932171,
      classId: 60,
      methodId: 11,
      name: "BasicQosOk",
      args: []
    };
    module.exports.BasicConsume = 3932180;
    var methodInfoBasicConsume = module.exports.methodInfoBasicConsume = {
      id: 3932180,
      classId: 60,
      methodId: 20,
      name: "BasicConsume",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "shortstr",
        name: "consumerTag",
        default: ""
      }, {
        type: "bit",
        name: "noLocal",
        default: false
      }, {
        type: "bit",
        name: "noAck",
        default: false
      }, {
        type: "bit",
        name: "exclusive",
        default: false
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.BasicConsumeOk = 3932181;
    var methodInfoBasicConsumeOk = module.exports.methodInfoBasicConsumeOk = {
      id: 3932181,
      classId: 60,
      methodId: 21,
      name: "BasicConsumeOk",
      args: [{
        type: "shortstr",
        name: "consumerTag"
      }]
    };
    module.exports.BasicCancel = 3932190;
    var methodInfoBasicCancel = module.exports.methodInfoBasicCancel = {
      id: 3932190,
      classId: 60,
      methodId: 30,
      name: "BasicCancel",
      args: [{
        type: "shortstr",
        name: "consumerTag"
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }]
    };
    module.exports.BasicCancelOk = 3932191;
    var methodInfoBasicCancelOk = module.exports.methodInfoBasicCancelOk = {
      id: 3932191,
      classId: 60,
      methodId: 31,
      name: "BasicCancelOk",
      args: [{
        type: "shortstr",
        name: "consumerTag"
      }]
    };
    module.exports.BasicPublish = 3932200;
    var methodInfoBasicPublish = module.exports.methodInfoBasicPublish = {
      id: 3932200,
      classId: 60,
      methodId: 40,
      name: "BasicPublish",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "exchange",
        default: ""
      }, {
        type: "shortstr",
        name: "routingKey",
        default: ""
      }, {
        type: "bit",
        name: "mandatory",
        default: false
      }, {
        type: "bit",
        name: "immediate",
        default: false
      }]
    };
    module.exports.BasicReturn = 3932210;
    var methodInfoBasicReturn = module.exports.methodInfoBasicReturn = {
      id: 3932210,
      classId: 60,
      methodId: 50,
      name: "BasicReturn",
      args: [{
        type: "short",
        name: "replyCode"
      }, {
        type: "shortstr",
        name: "replyText",
        default: ""
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "routingKey"
      }]
    };
    module.exports.BasicDeliver = 3932220;
    var methodInfoBasicDeliver = module.exports.methodInfoBasicDeliver = {
      id: 3932220,
      classId: 60,
      methodId: 60,
      name: "BasicDeliver",
      args: [{
        type: "shortstr",
        name: "consumerTag"
      }, {
        type: "longlong",
        name: "deliveryTag"
      }, {
        type: "bit",
        name: "redelivered",
        default: false
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "routingKey"
      }]
    };
    module.exports.BasicGet = 3932230;
    var methodInfoBasicGet = module.exports.methodInfoBasicGet = {
      id: 3932230,
      classId: 60,
      methodId: 70,
      name: "BasicGet",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "bit",
        name: "noAck",
        default: false
      }]
    };
    module.exports.BasicGetOk = 3932231;
    var methodInfoBasicGetOk = module.exports.methodInfoBasicGetOk = {
      id: 3932231,
      classId: 60,
      methodId: 71,
      name: "BasicGetOk",
      args: [{
        type: "longlong",
        name: "deliveryTag"
      }, {
        type: "bit",
        name: "redelivered",
        default: false
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "routingKey"
      }, {
        type: "long",
        name: "messageCount"
      }]
    };
    module.exports.BasicGetEmpty = 3932232;
    var methodInfoBasicGetEmpty = module.exports.methodInfoBasicGetEmpty = {
      id: 3932232,
      classId: 60,
      methodId: 72,
      name: "BasicGetEmpty",
      args: [{
        type: "shortstr",
        name: "clusterId",
        default: ""
      }]
    };
    module.exports.BasicAck = 3932240;
    var methodInfoBasicAck = module.exports.methodInfoBasicAck = {
      id: 3932240,
      classId: 60,
      methodId: 80,
      name: "BasicAck",
      args: [{
        type: "longlong",
        name: "deliveryTag",
        default: 0
      }, {
        type: "bit",
        name: "multiple",
        default: false
      }]
    };
    module.exports.BasicReject = 3932250;
    var methodInfoBasicReject = module.exports.methodInfoBasicReject = {
      id: 3932250,
      classId: 60,
      methodId: 90,
      name: "BasicReject",
      args: [{
        type: "longlong",
        name: "deliveryTag"
      }, {
        type: "bit",
        name: "requeue",
        default: true
      }]
    };
    module.exports.BasicRecoverAsync = 3932260;
    var methodInfoBasicRecoverAsync = module.exports.methodInfoBasicRecoverAsync = {
      id: 3932260,
      classId: 60,
      methodId: 100,
      name: "BasicRecoverAsync",
      args: [{
        type: "bit",
        name: "requeue",
        default: false
      }]
    };
    module.exports.BasicRecover = 3932270;
    var methodInfoBasicRecover = module.exports.methodInfoBasicRecover = {
      id: 3932270,
      classId: 60,
      methodId: 110,
      name: "BasicRecover",
      args: [{
        type: "bit",
        name: "requeue",
        default: false
      }]
    };
    module.exports.BasicRecoverOk = 3932271;
    var methodInfoBasicRecoverOk = module.exports.methodInfoBasicRecoverOk = {
      id: 3932271,
      classId: 60,
      methodId: 111,
      name: "BasicRecoverOk",
      args: []
    };
    module.exports.BasicNack = 3932280;
    var methodInfoBasicNack = module.exports.methodInfoBasicNack = {
      id: 3932280,
      classId: 60,
      methodId: 120,
      name: "BasicNack",
      args: [{
        type: "longlong",
        name: "deliveryTag",
        default: 0
      }, {
        type: "bit",
        name: "multiple",
        default: false
      }, {
        type: "bit",
        name: "requeue",
        default: true
      }]
    };
    module.exports.ConnectionStart = 655370;
    var methodInfoConnectionStart = module.exports.methodInfoConnectionStart = {
      id: 655370,
      classId: 10,
      methodId: 10,
      name: "ConnectionStart",
      args: [{
        type: "octet",
        name: "versionMajor",
        default: 0
      }, {
        type: "octet",
        name: "versionMinor",
        default: 9
      }, {
        type: "table",
        name: "serverProperties"
      }, {
        type: "longstr",
        name: "mechanisms",
        default: "PLAIN"
      }, {
        type: "longstr",
        name: "locales",
        default: "en_US"
      }]
    };
    module.exports.ConnectionStartOk = 655371;
    var methodInfoConnectionStartOk = module.exports.methodInfoConnectionStartOk = {
      id: 655371,
      classId: 10,
      methodId: 11,
      name: "ConnectionStartOk",
      args: [{
        type: "table",
        name: "clientProperties"
      }, {
        type: "shortstr",
        name: "mechanism",
        default: "PLAIN"
      }, {
        type: "longstr",
        name: "response"
      }, {
        type: "shortstr",
        name: "locale",
        default: "en_US"
      }]
    };
    module.exports.ConnectionSecure = 655380;
    var methodInfoConnectionSecure = module.exports.methodInfoConnectionSecure = {
      id: 655380,
      classId: 10,
      methodId: 20,
      name: "ConnectionSecure",
      args: [{
        type: "longstr",
        name: "challenge"
      }]
    };
    module.exports.ConnectionSecureOk = 655381;
    var methodInfoConnectionSecureOk = module.exports.methodInfoConnectionSecureOk = {
      id: 655381,
      classId: 10,
      methodId: 21,
      name: "ConnectionSecureOk",
      args: [{
        type: "longstr",
        name: "response"
      }]
    };
    module.exports.ConnectionTune = 655390;
    var methodInfoConnectionTune = module.exports.methodInfoConnectionTune = {
      id: 655390,
      classId: 10,
      methodId: 30,
      name: "ConnectionTune",
      args: [{
        type: "short",
        name: "channelMax",
        default: 0
      }, {
        type: "long",
        name: "frameMax",
        default: 0
      }, {
        type: "short",
        name: "heartbeat",
        default: 0
      }]
    };
    module.exports.ConnectionTuneOk = 655391;
    var methodInfoConnectionTuneOk = module.exports.methodInfoConnectionTuneOk = {
      id: 655391,
      classId: 10,
      methodId: 31,
      name: "ConnectionTuneOk",
      args: [{
        type: "short",
        name: "channelMax",
        default: 0
      }, {
        type: "long",
        name: "frameMax",
        default: 0
      }, {
        type: "short",
        name: "heartbeat",
        default: 0
      }]
    };
    module.exports.ConnectionOpen = 655400;
    var methodInfoConnectionOpen = module.exports.methodInfoConnectionOpen = {
      id: 655400,
      classId: 10,
      methodId: 40,
      name: "ConnectionOpen",
      args: [{
        type: "shortstr",
        name: "virtualHost",
        default: "/"
      }, {
        type: "shortstr",
        name: "capabilities",
        default: ""
      }, {
        type: "bit",
        name: "insist",
        default: false
      }]
    };
    module.exports.ConnectionOpenOk = 655401;
    var methodInfoConnectionOpenOk = module.exports.methodInfoConnectionOpenOk = {
      id: 655401,
      classId: 10,
      methodId: 41,
      name: "ConnectionOpenOk",
      args: [{
        type: "shortstr",
        name: "knownHosts",
        default: ""
      }]
    };
    module.exports.ConnectionClose = 655410;
    var methodInfoConnectionClose = module.exports.methodInfoConnectionClose = {
      id: 655410,
      classId: 10,
      methodId: 50,
      name: "ConnectionClose",
      args: [{
        type: "short",
        name: "replyCode"
      }, {
        type: "shortstr",
        name: "replyText",
        default: ""
      }, {
        type: "short",
        name: "classId"
      }, {
        type: "short",
        name: "methodId"
      }]
    };
    module.exports.ConnectionCloseOk = 655411;
    var methodInfoConnectionCloseOk = module.exports.methodInfoConnectionCloseOk = {
      id: 655411,
      classId: 10,
      methodId: 51,
      name: "ConnectionCloseOk",
      args: []
    };
    module.exports.ConnectionBlocked = 655420;
    var methodInfoConnectionBlocked = module.exports.methodInfoConnectionBlocked = {
      id: 655420,
      classId: 10,
      methodId: 60,
      name: "ConnectionBlocked",
      args: [{
        type: "shortstr",
        name: "reason",
        default: ""
      }]
    };
    module.exports.ConnectionUnblocked = 655421;
    var methodInfoConnectionUnblocked = module.exports.methodInfoConnectionUnblocked = {
      id: 655421,
      classId: 10,
      methodId: 61,
      name: "ConnectionUnblocked",
      args: []
    };
    module.exports.ConnectionUpdateSecret = 655430;
    var methodInfoConnectionUpdateSecret = module.exports.methodInfoConnectionUpdateSecret = {
      id: 655430,
      classId: 10,
      methodId: 70,
      name: "ConnectionUpdateSecret",
      args: [{
        type: "longstr",
        name: "newSecret"
      }, {
        type: "shortstr",
        name: "reason"
      }]
    };
    module.exports.ConnectionUpdateSecretOk = 655431;
    var methodInfoConnectionUpdateSecretOk = module.exports.methodInfoConnectionUpdateSecretOk = {
      id: 655431,
      classId: 10,
      methodId: 71,
      name: "ConnectionUpdateSecretOk",
      args: []
    };
    module.exports.ChannelOpen = 1310730;
    var methodInfoChannelOpen = module.exports.methodInfoChannelOpen = {
      id: 1310730,
      classId: 20,
      methodId: 10,
      name: "ChannelOpen",
      args: [{
        type: "shortstr",
        name: "outOfBand",
        default: ""
      }]
    };
    module.exports.ChannelOpenOk = 1310731;
    var methodInfoChannelOpenOk = module.exports.methodInfoChannelOpenOk = {
      id: 1310731,
      classId: 20,
      methodId: 11,
      name: "ChannelOpenOk",
      args: [{
        type: "longstr",
        name: "channelId",
        default: ""
      }]
    };
    module.exports.ChannelFlow = 1310740;
    var methodInfoChannelFlow = module.exports.methodInfoChannelFlow = {
      id: 1310740,
      classId: 20,
      methodId: 20,
      name: "ChannelFlow",
      args: [{
        type: "bit",
        name: "active"
      }]
    };
    module.exports.ChannelFlowOk = 1310741;
    var methodInfoChannelFlowOk = module.exports.methodInfoChannelFlowOk = {
      id: 1310741,
      classId: 20,
      methodId: 21,
      name: "ChannelFlowOk",
      args: [{
        type: "bit",
        name: "active"
      }]
    };
    module.exports.ChannelClose = 1310760;
    var methodInfoChannelClose = module.exports.methodInfoChannelClose = {
      id: 1310760,
      classId: 20,
      methodId: 40,
      name: "ChannelClose",
      args: [{
        type: "short",
        name: "replyCode"
      }, {
        type: "shortstr",
        name: "replyText",
        default: ""
      }, {
        type: "short",
        name: "classId"
      }, {
        type: "short",
        name: "methodId"
      }]
    };
    module.exports.ChannelCloseOk = 1310761;
    var methodInfoChannelCloseOk = module.exports.methodInfoChannelCloseOk = {
      id: 1310761,
      classId: 20,
      methodId: 41,
      name: "ChannelCloseOk",
      args: []
    };
    module.exports.AccessRequest = 1966090;
    var methodInfoAccessRequest = module.exports.methodInfoAccessRequest = {
      id: 1966090,
      classId: 30,
      methodId: 10,
      name: "AccessRequest",
      args: [{
        type: "shortstr",
        name: "realm",
        default: "/data"
      }, {
        type: "bit",
        name: "exclusive",
        default: false
      }, {
        type: "bit",
        name: "passive",
        default: true
      }, {
        type: "bit",
        name: "active",
        default: true
      }, {
        type: "bit",
        name: "write",
        default: true
      }, {
        type: "bit",
        name: "read",
        default: true
      }]
    };
    module.exports.AccessRequestOk = 1966091;
    var methodInfoAccessRequestOk = module.exports.methodInfoAccessRequestOk = {
      id: 1966091,
      classId: 30,
      methodId: 11,
      name: "AccessRequestOk",
      args: [{
        type: "short",
        name: "ticket",
        default: 1
      }]
    };
    module.exports.ExchangeDeclare = 2621450;
    var methodInfoExchangeDeclare = module.exports.methodInfoExchangeDeclare = {
      id: 2621450,
      classId: 40,
      methodId: 10,
      name: "ExchangeDeclare",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "type",
        default: "direct"
      }, {
        type: "bit",
        name: "passive",
        default: false
      }, {
        type: "bit",
        name: "durable",
        default: false
      }, {
        type: "bit",
        name: "autoDelete",
        default: false
      }, {
        type: "bit",
        name: "internal",
        default: false
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.ExchangeDeclareOk = 2621451;
    var methodInfoExchangeDeclareOk = module.exports.methodInfoExchangeDeclareOk = {
      id: 2621451,
      classId: 40,
      methodId: 11,
      name: "ExchangeDeclareOk",
      args: []
    };
    module.exports.ExchangeDelete = 2621460;
    var methodInfoExchangeDelete = module.exports.methodInfoExchangeDelete = {
      id: 2621460,
      classId: 40,
      methodId: 20,
      name: "ExchangeDelete",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "bit",
        name: "ifUnused",
        default: false
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }]
    };
    module.exports.ExchangeDeleteOk = 2621461;
    var methodInfoExchangeDeleteOk = module.exports.methodInfoExchangeDeleteOk = {
      id: 2621461,
      classId: 40,
      methodId: 21,
      name: "ExchangeDeleteOk",
      args: []
    };
    module.exports.ExchangeBind = 2621470;
    var methodInfoExchangeBind = module.exports.methodInfoExchangeBind = {
      id: 2621470,
      classId: 40,
      methodId: 30,
      name: "ExchangeBind",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "destination"
      }, {
        type: "shortstr",
        name: "source"
      }, {
        type: "shortstr",
        name: "routingKey",
        default: ""
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.ExchangeBindOk = 2621471;
    var methodInfoExchangeBindOk = module.exports.methodInfoExchangeBindOk = {
      id: 2621471,
      classId: 40,
      methodId: 31,
      name: "ExchangeBindOk",
      args: []
    };
    module.exports.ExchangeUnbind = 2621480;
    var methodInfoExchangeUnbind = module.exports.methodInfoExchangeUnbind = {
      id: 2621480,
      classId: 40,
      methodId: 40,
      name: "ExchangeUnbind",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "destination"
      }, {
        type: "shortstr",
        name: "source"
      }, {
        type: "shortstr",
        name: "routingKey",
        default: ""
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.ExchangeUnbindOk = 2621491;
    var methodInfoExchangeUnbindOk = module.exports.methodInfoExchangeUnbindOk = {
      id: 2621491,
      classId: 40,
      methodId: 51,
      name: "ExchangeUnbindOk",
      args: []
    };
    module.exports.QueueDeclare = 3276810;
    var methodInfoQueueDeclare = module.exports.methodInfoQueueDeclare = {
      id: 3276810,
      classId: 50,
      methodId: 10,
      name: "QueueDeclare",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "bit",
        name: "passive",
        default: false
      }, {
        type: "bit",
        name: "durable",
        default: false
      }, {
        type: "bit",
        name: "exclusive",
        default: false
      }, {
        type: "bit",
        name: "autoDelete",
        default: false
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.QueueDeclareOk = 3276811;
    var methodInfoQueueDeclareOk = module.exports.methodInfoQueueDeclareOk = {
      id: 3276811,
      classId: 50,
      methodId: 11,
      name: "QueueDeclareOk",
      args: [{
        type: "shortstr",
        name: "queue"
      }, {
        type: "long",
        name: "messageCount"
      }, {
        type: "long",
        name: "consumerCount"
      }]
    };
    module.exports.QueueBind = 3276820;
    var methodInfoQueueBind = module.exports.methodInfoQueueBind = {
      id: 3276820,
      classId: 50,
      methodId: 20,
      name: "QueueBind",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "routingKey",
        default: ""
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.QueueBindOk = 3276821;
    var methodInfoQueueBindOk = module.exports.methodInfoQueueBindOk = {
      id: 3276821,
      classId: 50,
      methodId: 21,
      name: "QueueBindOk",
      args: []
    };
    module.exports.QueuePurge = 3276830;
    var methodInfoQueuePurge = module.exports.methodInfoQueuePurge = {
      id: 3276830,
      classId: 50,
      methodId: 30,
      name: "QueuePurge",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }]
    };
    module.exports.QueuePurgeOk = 3276831;
    var methodInfoQueuePurgeOk = module.exports.methodInfoQueuePurgeOk = {
      id: 3276831,
      classId: 50,
      methodId: 31,
      name: "QueuePurgeOk",
      args: [{
        type: "long",
        name: "messageCount"
      }]
    };
    module.exports.QueueDelete = 3276840;
    var methodInfoQueueDelete = module.exports.methodInfoQueueDelete = {
      id: 3276840,
      classId: 50,
      methodId: 40,
      name: "QueueDelete",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "bit",
        name: "ifUnused",
        default: false
      }, {
        type: "bit",
        name: "ifEmpty",
        default: false
      }, {
        type: "bit",
        name: "nowait",
        default: false
      }]
    };
    module.exports.QueueDeleteOk = 3276841;
    var methodInfoQueueDeleteOk = module.exports.methodInfoQueueDeleteOk = {
      id: 3276841,
      classId: 50,
      methodId: 41,
      name: "QueueDeleteOk",
      args: [{
        type: "long",
        name: "messageCount"
      }]
    };
    module.exports.QueueUnbind = 3276850;
    var methodInfoQueueUnbind = module.exports.methodInfoQueueUnbind = {
      id: 3276850,
      classId: 50,
      methodId: 50,
      name: "QueueUnbind",
      args: [{
        type: "short",
        name: "ticket",
        default: 0
      }, {
        type: "shortstr",
        name: "queue",
        default: ""
      }, {
        type: "shortstr",
        name: "exchange"
      }, {
        type: "shortstr",
        name: "routingKey",
        default: ""
      }, {
        type: "table",
        name: "arguments",
        default: {}
      }]
    };
    module.exports.QueueUnbindOk = 3276851;
    var methodInfoQueueUnbindOk = module.exports.methodInfoQueueUnbindOk = {
      id: 3276851,
      classId: 50,
      methodId: 51,
      name: "QueueUnbindOk",
      args: []
    };
    module.exports.TxSelect = 5898250;
    var methodInfoTxSelect = module.exports.methodInfoTxSelect = {
      id: 5898250,
      classId: 90,
      methodId: 10,
      name: "TxSelect",
      args: []
    };
    module.exports.TxSelectOk = 5898251;
    var methodInfoTxSelectOk = module.exports.methodInfoTxSelectOk = {
      id: 5898251,
      classId: 90,
      methodId: 11,
      name: "TxSelectOk",
      args: []
    };
    module.exports.TxCommit = 5898260;
    var methodInfoTxCommit = module.exports.methodInfoTxCommit = {
      id: 5898260,
      classId: 90,
      methodId: 20,
      name: "TxCommit",
      args: []
    };
    module.exports.TxCommitOk = 5898261;
    var methodInfoTxCommitOk = module.exports.methodInfoTxCommitOk = {
      id: 5898261,
      classId: 90,
      methodId: 21,
      name: "TxCommitOk",
      args: []
    };
    module.exports.TxRollback = 5898270;
    var methodInfoTxRollback = module.exports.methodInfoTxRollback = {
      id: 5898270,
      classId: 90,
      methodId: 30,
      name: "TxRollback",
      args: []
    };
    module.exports.TxRollbackOk = 5898271;
    var methodInfoTxRollbackOk = module.exports.methodInfoTxRollbackOk = {
      id: 5898271,
      classId: 90,
      methodId: 31,
      name: "TxRollbackOk",
      args: []
    };
    module.exports.ConfirmSelect = 5570570;
    var methodInfoConfirmSelect = module.exports.methodInfoConfirmSelect = {
      id: 5570570,
      classId: 85,
      methodId: 10,
      name: "ConfirmSelect",
      args: [{
        type: "bit",
        name: "nowait",
        default: false
      }]
    };
    module.exports.ConfirmSelectOk = 5570571;
    var methodInfoConfirmSelectOk = module.exports.methodInfoConfirmSelectOk = {
      id: 5570571,
      classId: 85,
      methodId: 11,
      name: "ConfirmSelectOk",
      args: []
    };
    module.exports.BasicProperties = 60;
    var propertiesInfoBasicProperties = module.exports.propertiesInfoBasicProperties = {
      id: 60,
      name: "BasicProperties",
      args: [{
        type: "shortstr",
        name: "contentType"
      }, {
        type: "shortstr",
        name: "contentEncoding"
      }, {
        type: "table",
        name: "headers"
      }, {
        type: "octet",
        name: "deliveryMode"
      }, {
        type: "octet",
        name: "priority"
      }, {
        type: "shortstr",
        name: "correlationId"
      }, {
        type: "shortstr",
        name: "replyTo"
      }, {
        type: "shortstr",
        name: "expiration"
      }, {
        type: "shortstr",
        name: "messageId"
      }, {
        type: "timestamp",
        name: "timestamp"
      }, {
        type: "shortstr",
        name: "type"
      }, {
        type: "shortstr",
        name: "userId"
      }, {
        type: "shortstr",
        name: "appId"
      }, {
        type: "shortstr",
        name: "clusterId"
      }]
    };
  }
});

// node_modules/@acuminous/bitsyntax/lib/pattern.js
var require_pattern = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/pattern.js"(exports, module) {
    "use strict";
    function set(values) {
      var s = {};
      for (var i in values) {
        if (!Object.prototype.hasOwnProperty.call(values, i))
          continue;
        s[values[i]] = 1;
      }
      return s;
    }
    function variable(name, size, specifiers0) {
      var specifiers = set(specifiers0);
      var segment = { name };
      segment.type = type_in(specifiers);
      specs(segment, segment.type, specifiers);
      segment.size = size_of(segment, segment.type, size, segment.unit);
      return segment;
    }
    module.exports.variable = variable;
    module.exports.rest = function() {
      return variable("_", true, ["binary"]);
    };
    function value(val, size, specifiers0) {
      var specifiers = set(specifiers0);
      var segment = { value: val };
      segment.type = type_in(specifiers);
      specs(segment, segment.type, specifiers);
      segment.size = size_of(segment, segment.type, size, segment.unit);
      return segment;
    }
    module.exports.value = value;
    function string(val) {
      return { value: val, type: "string" };
    }
    module.exports.string = string;
    var TYPES = { "integer": 1, "binary": 1, "float": 1 };
    function type_in(specifiers) {
      for (var t in specifiers) {
        if (!Object.prototype.hasOwnProperty.call(specifiers, t))
          continue;
        if (TYPES[t]) {
          return t;
        }
      }
      return "integer";
    }
    function specs(segment, type, specifiers) {
      switch (type) {
        case "integer":
          segment.signed = signed_in(specifiers);
        case "float":
          segment.bigendian = endian_in(specifiers);
        default:
          segment.unit = unit_in(specifiers, segment.type);
      }
      return segment;
    }
    function endian_in(specifiers) {
      return !specifiers["little"];
    }
    function signed_in(specifiers) {
      return specifiers["signed"];
    }
    function unit_in(specifiers, type) {
      for (var s in specifiers) {
        if (!Object.prototype.hasOwnProperty.call(specifiers, s))
          continue;
        if (s.substr(0, 5) == "unit:") {
          var unit = parseInt(s.substr(5));
          return unit;
        }
      }
      switch (type) {
        case "binary":
          return 8;
        case "integer":
        case "float":
          return 1;
      }
    }
    function size_of(segment, type, size, unit) {
      if (size !== void 0 && size !== "") {
        return size;
      } else {
        switch (type) {
          case "integer":
            return 8;
          case "float":
            return 64;
          case "binary":
            return true;
        }
      }
    }
  }
});

// node_modules/@acuminous/bitsyntax/lib/parser.js
var require_parser = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/parser.js"(exports, module) {
    module.exports = function() {
      function quote(s) {
        return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
      }
      var result = {
        /*
         * Parses the input with a generated parser. If the parsing is successfull,
         * returns a value explicitly or implicitly specified by the grammar from
         * which the parser was generated (see |PEG.buildParser|). If the parsing is
         * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
         */
        parse: function(input, startRule) {
          var parseFunctions = {
            "start": parse_start,
            "segmentTail": parse_segmentTail,
            "segment": parse_segment,
            "string": parse_string,
            "chars": parse_chars,
            "char": parse_char,
            "hexDigit": parse_hexDigit,
            "identifier": parse_identifier,
            "number": parse_number,
            "size": parse_size,
            "specifierList": parse_specifierList,
            "specifierTail": parse_specifierTail,
            "specifier": parse_specifier,
            "unit": parse_unit,
            "ws": parse_ws
          };
          if (startRule !== void 0) {
            if (parseFunctions[startRule] === void 0) {
              throw new Error("Invalid rule name: " + quote(startRule) + ".");
            }
          } else {
            startRule = "start";
          }
          var pos = 0;
          var reportFailures = 0;
          var rightmostFailuresPos = 0;
          var rightmostFailuresExpected = [];
          function padLeft(input2, padding, length) {
            var result3 = input2;
            var padLength = length - input2.length;
            for (var i = 0; i < padLength; i++) {
              result3 = padding + result3;
            }
            return result3;
          }
          function escape2(ch) {
            var charCode = ch.charCodeAt(0);
            var escapeChar;
            var length;
            if (charCode <= 255) {
              escapeChar = "x";
              length = 2;
            } else {
              escapeChar = "u";
              length = 4;
            }
            return "\\" + escapeChar + padLeft(charCode.toString(16).toUpperCase(), "0", length);
          }
          function matchFailed(failure) {
            if (pos < rightmostFailuresPos) {
              return;
            }
            if (pos > rightmostFailuresPos) {
              rightmostFailuresPos = pos;
              rightmostFailuresExpected = [];
            }
            rightmostFailuresExpected.push(failure);
          }
          function parse_start() {
            var result0, result1, result22, result3;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            result0 = parse_ws();
            if (result0 !== null) {
              result1 = parse_segment();
              if (result1 !== null) {
                result22 = [];
                result3 = parse_segmentTail();
                while (result3 !== null) {
                  result22.push(result3);
                  result3 = parse_segmentTail();
                }
                if (result22 !== null) {
                  result0 = [result0, result1, result22];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = function(offset2, head, tail) {
                tail.unshift(head);
                return tail;
              }(pos0, result0[1], result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_segmentTail() {
            var result0, result1, result22, result3;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            result0 = parse_ws();
            if (result0 !== null) {
              if (input.charCodeAt(pos) === 44) {
                result1 = ",";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed('","');
                }
              }
              if (result1 !== null) {
                result22 = parse_ws();
                if (result22 !== null) {
                  result3 = parse_segment();
                  if (result3 !== null) {
                    result0 = [result0, result1, result22, result3];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2, seg) {
                return seg;
              }(pos0, result0[3]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_segment() {
            var result0, result1, result22;
            var pos0, pos1;
            pos0 = pos;
            result0 = parse_string();
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2, str) {
                return { string: str };
              }(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse_identifier();
              if (result0 !== null) {
                result1 = parse_size();
                result1 = result1 !== null ? result1 : "";
                if (result1 !== null) {
                  result22 = parse_specifierList();
                  result22 = result22 !== null ? result22 : "";
                  if (result22 !== null) {
                    result0 = [result0, result1, result22];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = /* @__PURE__ */ function(offset2, v, size, specs) {
                  return { name: v, size, specifiers: specs };
                }(pos0, result0[0], result0[1], result0[2]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_number();
                if (result0 !== null) {
                  result1 = parse_size();
                  result1 = result1 !== null ? result1 : "";
                  if (result1 !== null) {
                    result22 = parse_specifierList();
                    result22 = result22 !== null ? result22 : "";
                    if (result22 !== null) {
                      result0 = [result0, result1, result22];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = /* @__PURE__ */ function(offset2, v, size, specs) {
                    return { value: v, size, specifiers: specs };
                  }(pos0, result0[0], result0[1], result0[2]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
            }
            return result0;
          }
          function parse_string() {
            var result0, result1, result22;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 34) {
              result0 = '"';
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"\\""');
              }
            }
            if (result0 !== null) {
              if (input.charCodeAt(pos) === 34) {
                result1 = '"';
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed('"\\""');
                }
              }
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2) {
                return "";
              }(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              if (input.charCodeAt(pos) === 34) {
                result0 = '"';
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('"\\""');
                }
              }
              if (result0 !== null) {
                result1 = parse_chars();
                if (result1 !== null) {
                  if (input.charCodeAt(pos) === 34) {
                    result22 = '"';
                    pos++;
                  } else {
                    result22 = null;
                    if (reportFailures === 0) {
                      matchFailed('"\\""');
                    }
                  }
                  if (result22 !== null) {
                    result0 = [result0, result1, result22];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = /* @__PURE__ */ function(offset2, chars) {
                  return chars;
                }(pos0, result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
            return result0;
          }
          function parse_chars() {
            var result0, result1;
            var pos0;
            pos0 = pos;
            result1 = parse_char();
            if (result1 !== null) {
              result0 = [];
              while (result1 !== null) {
                result0.push(result1);
                result1 = parse_char();
              }
            } else {
              result0 = null;
            }
            if (result0 !== null) {
              result0 = function(offset2, chars) {
                return chars.join("");
              }(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_char() {
            var result0, result1, result22, result3, result4;
            var pos0, pos1;
            if (/^[^"\\\0-\x1F]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('[^"\\\\\\0-\\x1F]');
              }
            }
            if (result0 === null) {
              pos0 = pos;
              if (input.substr(pos, 2) === '\\"') {
                result0 = '\\"';
                pos += 2;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('"\\\\\\""');
                }
              }
              if (result0 !== null) {
                result0 = /* @__PURE__ */ function(offset2) {
                  return '"';
                }(pos0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                if (input.substr(pos, 2) === "\\\\") {
                  result0 = "\\\\";
                  pos += 2;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed('"\\\\\\\\"');
                  }
                }
                if (result0 !== null) {
                  result0 = /* @__PURE__ */ function(offset2) {
                    return "\\";
                  }(pos0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  if (input.substr(pos, 2) === "\\/") {
                    result0 = "\\/";
                    pos += 2;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed('"\\\\/"');
                    }
                  }
                  if (result0 !== null) {
                    result0 = /* @__PURE__ */ function(offset2) {
                      return "/";
                    }(pos0);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    if (input.substr(pos, 2) === "\\b") {
                      result0 = "\\b";
                      pos += 2;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed('"\\\\b"');
                      }
                    }
                    if (result0 !== null) {
                      result0 = /* @__PURE__ */ function(offset2) {
                        return "\b";
                      }(pos0);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                    if (result0 === null) {
                      pos0 = pos;
                      if (input.substr(pos, 2) === "\\f") {
                        result0 = "\\f";
                        pos += 2;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed('"\\\\f"');
                        }
                      }
                      if (result0 !== null) {
                        result0 = /* @__PURE__ */ function(offset2) {
                          return "\f";
                        }(pos0);
                      }
                      if (result0 === null) {
                        pos = pos0;
                      }
                      if (result0 === null) {
                        pos0 = pos;
                        if (input.substr(pos, 2) === "\\n") {
                          result0 = "\\n";
                          pos += 2;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed('"\\\\n"');
                          }
                        }
                        if (result0 !== null) {
                          result0 = /* @__PURE__ */ function(offset2) {
                            return "\n";
                          }(pos0);
                        }
                        if (result0 === null) {
                          pos = pos0;
                        }
                        if (result0 === null) {
                          pos0 = pos;
                          if (input.substr(pos, 2) === "\\r") {
                            result0 = "\\r";
                            pos += 2;
                          } else {
                            result0 = null;
                            if (reportFailures === 0) {
                              matchFailed('"\\\\r"');
                            }
                          }
                          if (result0 !== null) {
                            result0 = /* @__PURE__ */ function(offset2) {
                              return "\r";
                            }(pos0);
                          }
                          if (result0 === null) {
                            pos = pos0;
                          }
                          if (result0 === null) {
                            pos0 = pos;
                            if (input.substr(pos, 2) === "\\t") {
                              result0 = "\\t";
                              pos += 2;
                            } else {
                              result0 = null;
                              if (reportFailures === 0) {
                                matchFailed('"\\\\t"');
                              }
                            }
                            if (result0 !== null) {
                              result0 = /* @__PURE__ */ function(offset2) {
                                return "	";
                              }(pos0);
                            }
                            if (result0 === null) {
                              pos = pos0;
                            }
                            if (result0 === null) {
                              pos0 = pos;
                              pos1 = pos;
                              if (input.substr(pos, 2) === "\\u") {
                                result0 = "\\u";
                                pos += 2;
                              } else {
                                result0 = null;
                                if (reportFailures === 0) {
                                  matchFailed('"\\\\u"');
                                }
                              }
                              if (result0 !== null) {
                                result1 = parse_hexDigit();
                                if (result1 !== null) {
                                  result22 = parse_hexDigit();
                                  if (result22 !== null) {
                                    result3 = parse_hexDigit();
                                    if (result3 !== null) {
                                      result4 = parse_hexDigit();
                                      if (result4 !== null) {
                                        result0 = [result0, result1, result22, result3, result4];
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                              if (result0 !== null) {
                                result0 = function(offset2, h1, h2, h3, h4) {
                                  return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
                                }(pos0, result0[1], result0[2], result0[3], result0[4]);
                              }
                              if (result0 === null) {
                                pos = pos0;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            return result0;
          }
          function parse_hexDigit() {
            var result0;
            if (/^[0-9a-fA-F]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("[0-9a-fA-F]");
              }
            }
            return result0;
          }
          function parse_identifier() {
            var result0, result1, result22;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (/^[_a-zA-Z]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("[_a-zA-Z]");
              }
            }
            if (result0 !== null) {
              result1 = [];
              if (/^[_a-zA-Z0-9]/.test(input.charAt(pos))) {
                result22 = input.charAt(pos);
                pos++;
              } else {
                result22 = null;
                if (reportFailures === 0) {
                  matchFailed("[_a-zA-Z0-9]");
                }
              }
              while (result22 !== null) {
                result1.push(result22);
                if (/^[_a-zA-Z0-9]/.test(input.charAt(pos))) {
                  result22 = input.charAt(pos);
                  pos++;
                } else {
                  result22 = null;
                  if (reportFailures === 0) {
                    matchFailed("[_a-zA-Z0-9]");
                  }
                }
              }
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = function(offset2, head, tail) {
                return head + tail.join("");
              }(pos0, result0[0], result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_number() {
            var result0, result1, result22;
            var pos0, pos1;
            pos0 = pos;
            if (input.charCodeAt(pos) === 48) {
              result0 = "0";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"0"');
              }
            }
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2) {
                return 0;
              }(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              if (/^[1-9]/.test(input.charAt(pos))) {
                result0 = input.charAt(pos);
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("[1-9]");
                }
              }
              if (result0 !== null) {
                result1 = [];
                if (/^[0-9]/.test(input.charAt(pos))) {
                  result22 = input.charAt(pos);
                  pos++;
                } else {
                  result22 = null;
                  if (reportFailures === 0) {
                    matchFailed("[0-9]");
                  }
                }
                while (result22 !== null) {
                  result1.push(result22);
                  if (/^[0-9]/.test(input.charAt(pos))) {
                    result22 = input.charAt(pos);
                    pos++;
                  } else {
                    result22 = null;
                    if (reportFailures === 0) {
                      matchFailed("[0-9]");
                    }
                  }
                }
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = function(offset2, head, tail) {
                  return parseInt(head + tail.join(""));
                }(pos0, result0[0], result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
            return result0;
          }
          function parse_size() {
            var result0, result1;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 58) {
              result0 = ":";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('":"');
              }
            }
            if (result0 !== null) {
              result1 = parse_number();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2, num) {
                return num;
              }(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              if (input.charCodeAt(pos) === 58) {
                result0 = ":";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('":"');
                }
              }
              if (result0 !== null) {
                result1 = parse_identifier();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = /* @__PURE__ */ function(offset2, id) {
                  return id;
                }(pos0, result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
            return result0;
          }
          function parse_specifierList() {
            var result0, result1, result22, result3;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 47) {
              result0 = "/";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"/"');
              }
            }
            if (result0 !== null) {
              result1 = parse_specifier();
              if (result1 !== null) {
                result22 = [];
                result3 = parse_specifierTail();
                while (result3 !== null) {
                  result22.push(result3);
                  result3 = parse_specifierTail();
                }
                if (result22 !== null) {
                  result0 = [result0, result1, result22];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = function(offset2, head, tail) {
                tail.unshift(head);
                return tail;
              }(pos0, result0[1], result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_specifierTail() {
            var result0, result1;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 45) {
              result0 = "-";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"-"');
              }
            }
            if (result0 !== null) {
              result1 = parse_specifier();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = /* @__PURE__ */ function(offset2, spec) {
                return spec;
              }(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_specifier() {
            var result0;
            if (input.substr(pos, 6) === "little") {
              result0 = "little";
              pos += 6;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"little"');
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 3) === "big") {
                result0 = "big";
                pos += 3;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('"big"');
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 6) === "signed") {
                  result0 = "signed";
                  pos += 6;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed('"signed"');
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 8) === "unsigned") {
                    result0 = "unsigned";
                    pos += 8;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed('"unsigned"');
                    }
                  }
                  if (result0 === null) {
                    if (input.substr(pos, 7) === "integer") {
                      result0 = "integer";
                      pos += 7;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed('"integer"');
                      }
                    }
                    if (result0 === null) {
                      if (input.substr(pos, 6) === "binary") {
                        result0 = "binary";
                        pos += 6;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed('"binary"');
                        }
                      }
                      if (result0 === null) {
                        if (input.substr(pos, 5) === "float") {
                          result0 = "float";
                          pos += 5;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed('"float"');
                          }
                        }
                        if (result0 === null) {
                          result0 = parse_unit();
                        }
                      }
                    }
                  }
                }
              }
            }
            return result0;
          }
          function parse_unit() {
            var result0, result1;
            var pos0, pos1;
            pos0 = pos;
            pos1 = pos;
            if (input.substr(pos, 5) === "unit:") {
              result0 = "unit:";
              pos += 5;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed('"unit:"');
              }
            }
            if (result0 !== null) {
              result1 = parse_number();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = function(offset2, num) {
                return "unit:" + num;
              }(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            return result0;
          }
          function parse_ws() {
            var result0, result1;
            result0 = [];
            if (/^[ \t\n]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[ \\t\\n]");
              }
            }
            while (result1 !== null) {
              result0.push(result1);
              if (/^[ \t\n]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[ \\t\\n]");
                }
              }
            }
            return result0;
          }
          function cleanupExpected(expected) {
            expected.sort();
            var lastExpected = null;
            var cleanExpected = [];
            for (var i = 0; i < expected.length; i++) {
              if (expected[i] !== lastExpected) {
                cleanExpected.push(expected[i]);
                lastExpected = expected[i];
              }
            }
            return cleanExpected;
          }
          function computeErrorPosition() {
            var line = 1;
            var column = 1;
            var seenCR = false;
            for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
              var ch = input.charAt(i);
              if (ch === "\n") {
                if (!seenCR) {
                  line++;
                }
                column = 1;
                seenCR = false;
              } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                line++;
                column = 1;
                seenCR = true;
              } else {
                column++;
                seenCR = false;
              }
            }
            return { line, column };
          }
          var result2 = parseFunctions[startRule]();
          if (result2 === null || pos !== input.length) {
            var offset = Math.max(pos, rightmostFailuresPos);
            var found = offset < input.length ? input.charAt(offset) : null;
            var errorPosition = computeErrorPosition();
            throw new this.SyntaxError(
              cleanupExpected(rightmostFailuresExpected),
              found,
              offset,
              errorPosition.line,
              errorPosition.column
            );
          }
          return result2;
        },
        /* Returns the parser source code. */
        toSource: function() {
          return this._source;
        }
      };
      result.SyntaxError = function(expected, found, offset, line, column) {
        function buildMessage(expected2, found2) {
          var expectedHumanized, foundHumanized;
          switch (expected2.length) {
            case 0:
              expectedHumanized = "end of input";
              break;
            case 1:
              expectedHumanized = expected2[0];
              break;
            default:
              expectedHumanized = expected2.slice(0, expected2.length - 1).join(", ") + " or " + expected2[expected2.length - 1];
          }
          foundHumanized = found2 ? quote(found2) : "end of input";
          return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
        }
        this.name = "SyntaxError";
        this.expected = expected;
        this.found = found;
        this.message = buildMessage(expected, found);
        this.offset = offset;
        this.line = line;
        this.column = column;
      };
      result.SyntaxError.prototype = Error.prototype;
      return result;
    }();
  }
});

// node_modules/@acuminous/bitsyntax/lib/parse.js
var require_parse = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/parse.js"(exports, module) {
    "use strict";
    var ast = require_pattern();
    var parser = require_parser();
    function parse_pattern(string) {
      var segments = parser.parse(string);
      for (var i = 0, len = segments.length; i < len; i++) {
        var s = segments[i];
        if (s.string != void 0) {
          segments[i] = ast.string(s.string);
        } else if (s.value != void 0) {
          segments[i] = ast.value(s.value, s.size, s.specifiers);
        } else if (s.name != void 0) {
          segments[i] = ast.variable(s.name, s.size, s.specifiers);
        } else {
          throw "Unknown segment " + s;
        }
      }
      return segments;
    }
    module.exports.parse = function() {
      var str = [].join.call(arguments, ",");
      return parse_pattern(str);
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/@acuminous/bitsyntax/lib/interp.js
var require_interp = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/interp.js"(exports, module) {
    "use strict";
    var ints = require_buffer_more_ints();
    var debug = require_browser()("bitsyntax-Interpreter");
    function parse_int(bin, off, sizeInBytes, bigendian, signed) {
      switch (sizeInBytes) {
        case 1:
          return signed ? bin.readInt8(off) : bin.readUInt8(off);
        case 2:
          return bigendian ? signed ? bin.readInt16BE(off) : bin.readUInt16BE(off) : signed ? bin.readInt16LE(off) : bin.readUInt16LE(off);
        case 4:
          return bigendian ? signed ? bin.readInt32BE(off) : bin.readUInt32BE(off) : signed ? bin.readInt32LE(off) : bin.readUInt32LE(off);
        case 8:
          return bigendian ? (signed ? ints.readInt64BE : ints.readUInt64BE)(bin, off) : (signed ? ints.readInt64LE : ints.readUInt64LE)(bin, off);
        default:
          throw "Integers must be 8-, 16-, 32- or 64-bit";
      }
    }
    function parse_float(bin, off, sizeInBytes, bigendian) {
      switch (sizeInBytes) {
        case 4:
          return bigendian ? bin.readFloatBE(off) : bin.readFloatLE(off);
        case 8:
          return bigendian ? bin.readDoubleBE(off) : bin.readDoubleLE(off);
        default:
          throw "Floats must be 32- or 64-bit";
      }
    }
    function size_of(segment, bound) {
      var size = segment.size;
      if (typeof size === "string") {
        return bound[size];
      } else {
        return size;
      }
    }
    function new_scope(env) {
      function scope() {
      }
      ;
      scope.prototype = env;
      return new scope();
    }
    function bindings(scope) {
      var s = {};
      for (var k in scope) {
        if (scope.hasOwnProperty(k)) {
          s[k] = scope[k];
        }
      }
      return s;
    }
    function match(pattern, binary, boundvars) {
      var offset = 0, vars = new_scope(boundvars);
      var binsize = binary.length * 8;
      function skip_bits(segment2) {
        debug("skip bits");
        debug(segment2);
        var size = size_of(segment2, vars);
        if (size === true) {
          if (offset % 8 === 0) {
            offset = binsize;
            return true;
          } else {
            return false;
          }
        }
        var bits = segment2.unit * size;
        if (offset + bits > binsize) {
          return false;
        } else {
          offset += bits;
        }
      }
      function get_integer(segment2) {
        debug("get_integer");
        debug(segment2);
        var unit = segment2.unit, size = size_of(segment2, vars);
        var bitsize = size * unit;
        var byteoffset = offset / 8;
        offset += bitsize;
        if (bitsize % 8 > 0 || offset > binsize) {
          return false;
        } else {
          return parse_int(
            binary,
            byteoffset,
            bitsize / 8,
            segment2.bigendian,
            segment2.signed
          );
        }
      }
      function get_float(segment2) {
        debug("get_float");
        debug(segment2);
        var unit = segment2.unit;
        var size = size_of(segment2, vars);
        var bitsize = size * unit;
        var byteoffset = offset / 8;
        offset += bitsize;
        if (offset > binsize) {
          return false;
        } else {
          return parse_float(
            binary,
            byteoffset,
            bitsize / 8,
            segment2.bigendian
          );
        }
      }
      function get_binary(segment2) {
        debug("get_binary");
        debug(segment2);
        var unit = segment2.unit, size = size_of(segment2, vars);
        var byteoffset = offset / 8;
        if (size === true) {
          offset = binsize;
          return binary.slice(byteoffset);
        } else {
          var bitsize = size * unit;
          if (bitsize % 8 > 0 || offset + bitsize > binsize) {
            return false;
          } else {
            offset += bitsize;
            return binary.slice(byteoffset, byteoffset + bitsize / 8);
          }
        }
      }
      function get_string(segment2) {
        debug("get_string");
        debug(segment2);
        var len = segment2.value.length;
        var byteoffset = offset / 8;
        offset += len * 8;
        if (offset > binsize) {
          return false;
        }
        return binary.slice(byteoffset, byteoffset + len).toString("utf8");
      }
      var patternlen = pattern.length;
      for (var i = 0; i < patternlen; i++) {
        var segment = pattern[i];
        var result = false;
        if (segment.name === "_") {
          result = skip_bits(segment);
        } else {
          switch (segment.type) {
            case "string":
              result = get_string(segment);
              break;
            case "integer":
              result = get_integer(segment);
              break;
            case "float":
              result = get_float(segment);
              break;
            case "binary":
              result = get_binary(segment);
              break;
          }
          if (result === false) {
            return false;
          } else if (segment.name) {
            vars[segment.name] = result;
          } else if (segment.value != result) {
            return false;
          }
        }
      }
      if (offset == binsize) {
        return bindings(vars);
      } else {
        return false;
      }
    }
    module.exports.match = match;
    module.exports.parse_int = parse_int;
    module.exports.parse_float = parse_float;
  }
});

// node_modules/base64-js/index.js
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

// node_modules/ieee754/index.js
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

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        var arr = new Uint8Array(1);
        var proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      var buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
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
    Buffer2.poolSize = 8192;
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
      var valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      var b = fromObject(value);
      if (b)
        return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(
          value[Symbol.toPrimitive]("string"),
          encodingOrOffset,
          length
        );
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
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
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      var length = byteLength(string, encoding) | 0;
      var buf = createBuffer(length);
      var actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      var buf = createBuffer(length);
      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        var copy = new Uint8Array(arrayView);
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
      var buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
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
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array))
        a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array))
        b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
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
    Buffer2.isEncoding = function isEncoding(encoding) {
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
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer2.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            Buffer2.from(buf).copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer2.isBuffer(string)) {
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
      var len = string.length;
      var mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0)
        return 0;
      var loweredCase = false;
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
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      var loweredCase = false;
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
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      var length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect2() {
      var str = "";
      var max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max)
        str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
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
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);
      for (var i = 0; i < len; ++i) {
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
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
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
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;
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
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      var i;
      if (dir) {
        var foundIndex = -1;
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
          var found = true;
          for (var j = 0; j < valLength; j++) {
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
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      var strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string, offset, length, encoding) {
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
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
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
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
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
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      var res = "";
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      var len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      var out = "";
      for (var i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = "";
      for (var i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      var len = this.length;
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
      var newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
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
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
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
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
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
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
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
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target))
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
      var len = end - start;
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
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
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
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
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
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        var len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
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
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      for (var i = 0; i < length; ++i) {
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
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
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
      for (var i = 0; i < length; ++i) {
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
      var alphabet = "0123456789abcdef";
      var table = new Array(256);
      for (var i = 0; i < 16; ++i) {
        var i16 = i * 16;
        for (var j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = require_buffer();
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/@acuminous/bitsyntax/lib/constructor.js
var require_constructor = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/constructor.js"(exports, module) {
    "use strict";
    var ints = require_buffer_more_ints();
    var Buffer2 = require_safe_buffer().Buffer;
    function write(buf, offset, pattern, bindings) {
      for (var i = 0, len = pattern.length; i < len; i++) {
        var segment = pattern[i];
        switch (segment.type) {
          case "string":
            offset += buf.write(segment.value, offset, "utf8");
            break;
          case "binary":
            offset += writeBinary(segment, buf, offset, bindings);
            break;
          case "integer":
            offset += writeInteger(segment, buf, offset, bindings);
            break;
          case "float":
            offset += writeFloat(segment, buf, offset, bindings);
            break;
        }
      }
      return offset;
    }
    function build(pattern, bindings) {
      var bufsize = size_of(pattern, bindings);
      var buf = Buffer2.alloc(bufsize);
      write(buf, 0, pattern, bindings);
      return buf;
    }
    function size_of_segment(segment, bindings) {
      if (typeof segment.size === "string") {
        return bindings[segment.size] * segment.unit / 8;
      }
      if (segment.type === "string") {
        return Buffer2.byteLength(segment.value, "utf8");
      }
      if (segment.type === "binary" && segment.size === true) {
        var val = bindings[segment.name];
        return val.length;
      }
      return segment.size * segment.unit / 8;
    }
    function size_of(segments, bindings) {
      var size = 0;
      for (var i = 0, len = segments.length; i < len; i++) {
        size += size_of_segment(segments[i], bindings);
      }
      return size;
    }
    function writeBinary(segment, buf, offset, bindings) {
      var bin = bindings[segment.name];
      var size = size_of_segment(segment, bindings);
      bin.copy(buf, offset, 0, size);
      return size;
    }
    function writeInteger(segment, buf, offset, bindings) {
      var value = segment.name ? bindings[segment.name] : segment.value;
      var size = size_of_segment(segment, bindings);
      return write_int(buf, value, offset, size, segment.bigendian);
    }
    function write_int(buf, value, offset, size, bigendian) {
      switch (size) {
        case 1:
          buf.writeUInt8(value, offset);
          break;
        case 2:
          bigendian ? buf.writeUInt16BE(value, offset) : buf.writeUInt16LE(value, offset);
          break;
        case 4:
          bigendian ? buf.writeUInt32BE(value, offset) : buf.writeUInt32LE(value, offset);
          break;
        case 8:
          bigendian ? ints.writeUInt64BE(buf, value, offset) : ints.writeUInt64LE(buf, value, offset);
          break;
        default:
          throw new Error("integer size * unit must be 8, 16, 32 or 64");
      }
      return size;
    }
    function writeFloat(segment, buf, offset, bindings) {
      var value = segment.name ? bindings[segment.name] : segment.value;
      var size = size_of_segment(segment, bindings);
      return write_float(buf, value, offset, size, segment.bigendian);
    }
    function write_float(buf, value, offset, size, bigendian) {
      if (size === 4) {
        bigendian ? buf.writeFloatBE(value, offset) : buf.writeFloatLE(value, offset);
      } else if (size === 8) {
        bigendian ? buf.writeDoubleBE(value, offset) : buf.writeDoubleLE(value, offset);
      } else {
        throw new Error("float size * unit must be 32 or 64");
      }
      return size;
    }
    var parse = require_parse().parse;
    module.exports.write = write;
    module.exports.build = build;
    module.exports.write_int = write_int;
    module.exports.write_float = write_float;
    module.exports.builder = function(pstr) {
      pstr = arguments.length > 1 ? [].join.call(arguments, ",") : pstr;
      var pattern = parse(pstr);
      return function(vars) {
        return build(pattern, vars);
      };
    };
  }
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    module.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (sym in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS({
  "node_modules/has-tostringtag/shams.js"(exports, module) {
    "use strict";
    var hasSymbols = require_shams();
    module.exports = function hasToStringTagShams() {
      return hasSymbols() && !!Symbol.toStringTag;
    };
  }
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    module.exports = Error;
  }
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    module.exports = EvalError;
  }
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  "node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    module.exports = RangeError;
  }
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    module.exports = ReferenceError;
  }
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    module.exports = SyntaxError;
  }
});

// node_modules/es-errors/type.js
var require_type = __commonJS({
  "node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    module.exports = TypeError;
  }
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    module.exports = URIError;
  }
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// node_modules/has-proto/index.js
var require_has_proto = __commonJS({
  "node_modules/has-proto/index.js"(exports, module) {
    "use strict";
    var test = {
      __proto__: null,
      foo: {}
    };
    var $Object = Object;
    module.exports = function hasProto() {
      return { __proto__: test }.foo === test.foo && !(test instanceof $Object);
    };
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  "node_modules/hasown/index.js"(exports, module) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    var undefined2;
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
      try {
        $gOPD({}, "");
      } catch (e) {
        $gOPD = null;
      }
    }
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var hasProto = require_has_proto()();
    var getProto = Object.getPrototypeOf || (hasProto ? function(x) {
      return x.__proto__;
    } : null);
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": Object,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call(Function.call, Array.prototype.concat);
    var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
    var $replace = bind.call(Function.call, String.prototype.replace);
    var $strSlice = bind.call(Function.call, String.prototype.slice);
    var $exec = bind.call(Function.call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
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
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void 0;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
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
  }
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var $defineProperty = GetIntrinsic("%Object.defineProperty%", true) || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  "node_modules/gopd/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// node_modules/define-data-property/index.js
var require_define_data_property = __commonJS({
  "node_modules/define-data-property/index.js"(exports, module) {
    "use strict";
    var $defineProperty = require_es_define_property();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var gopd = require_gopd();
    module.exports = function defineDataProperty(obj, property, value) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new $TypeError("`obj` must be an object or a function`");
      }
      if (typeof property !== "string" && typeof property !== "symbol") {
        throw new $TypeError("`property` must be a string or a symbol`");
      }
      if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
        throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
        throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
        throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
        throw new $TypeError("`loose`, if provided, must be a boolean");
      }
      var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
      var nonWritable = arguments.length > 4 ? arguments[4] : null;
      var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
      var loose = arguments.length > 6 ? arguments[6] : false;
      var desc = !!gopd && gopd(obj, property);
      if ($defineProperty) {
        $defineProperty(obj, property, {
          configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
          enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
          value,
          writable: nonWritable === null && desc ? desc.writable : !nonWritable
        });
      } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
        obj[property] = value;
      } else {
        throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
      }
    };
  }
});

// node_modules/has-property-descriptors/index.js
var require_has_property_descriptors = __commonJS({
  "node_modules/has-property-descriptors/index.js"(exports, module) {
    "use strict";
    var $defineProperty = require_es_define_property();
    var hasPropertyDescriptors = function hasPropertyDescriptors2() {
      return !!$defineProperty;
    };
    hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
      if (!$defineProperty) {
        return null;
      }
      try {
        return $defineProperty([], "length", { value: 1 }).length !== 1;
      } catch (e) {
        return true;
      }
    };
    module.exports = hasPropertyDescriptors;
  }
});

// node_modules/set-function-length/index.js
var require_set_function_length = __commonJS({
  "node_modules/set-function-length/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var define = require_define_data_property();
    var hasDescriptors = require_has_property_descriptors()();
    var gOPD = require_gopd();
    var $TypeError = require_type();
    var $floor = GetIntrinsic("%Math.floor%");
    module.exports = function setFunctionLength(fn, length) {
      if (typeof fn !== "function") {
        throw new $TypeError("`fn` is not a function");
      }
      if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
        throw new $TypeError("`length` must be a positive 32-bit integer");
      }
      var loose = arguments.length > 2 && !!arguments[2];
      var functionLengthIsConfigurable = true;
      var functionLengthIsWritable = true;
      if ("length" in fn && gOPD) {
        var desc = gOPD(fn, "length");
        if (desc && !desc.configurable) {
          functionLengthIsConfigurable = false;
        }
        if (desc && !desc.writable) {
          functionLengthIsWritable = false;
        }
      }
      if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
        if (hasDescriptors) {
          define(
            /** @type {Parameters<define>[0]} */
            fn,
            "length",
            length,
            true,
            true
          );
        } else {
          define(
            /** @type {Parameters<define>[0]} */
            fn,
            "length",
            length
          );
        }
      }
      return fn;
    };
  }
});

// node_modules/call-bind/index.js
var require_call_bind = __commonJS({
  "node_modules/call-bind/index.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    var GetIntrinsic = require_get_intrinsic();
    var setFunctionLength = require_set_function_length();
    var $TypeError = require_type();
    var $apply = GetIntrinsic("%Function.prototype.apply%");
    var $call = GetIntrinsic("%Function.prototype.call%");
    var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
    var $defineProperty = require_es_define_property();
    var $max = GetIntrinsic("%Math.max%");
    module.exports = function callBind(originalFunction) {
      if (typeof originalFunction !== "function") {
        throw new $TypeError("a function is required");
      }
      var func = $reflectApply(bind, $call, arguments);
      return setFunctionLength(
        func,
        1 + $max(0, originalFunction.length - (arguments.length - 1)),
        true
      );
    };
    var applyBind = function applyBind2() {
      return $reflectApply(bind, $apply, arguments);
    };
    if ($defineProperty) {
      $defineProperty(module.exports, "apply", { value: applyBind });
    } else {
      module.exports.apply = applyBind;
    }
  }
});

// node_modules/call-bind/callBound.js
var require_callBound = __commonJS({
  "node_modules/call-bind/callBound.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBind = require_call_bind();
    var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
    module.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = GetIntrinsic(name, !!allowMissing);
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBind(intrinsic);
      }
      return intrinsic;
    };
  }
});

// node_modules/is-arguments/index.js
var require_is_arguments = __commonJS({
  "node_modules/is-arguments/index.js"(exports, module) {
    "use strict";
    var hasToStringTag = require_shams2()();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var isStandardArguments = function isArguments(value) {
      if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
        return false;
      }
      return $toString(value) === "[object Arguments]";
    };
    var isLegacyArguments = function isArguments(value) {
      if (isStandardArguments(value)) {
        return true;
      }
      return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
    };
    var supportsStandardArguments = function() {
      return isStandardArguments(arguments);
    }();
    isStandardArguments.isLegacyArguments = isLegacyArguments;
    module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
  }
});

// node_modules/is-generator-function/index.js
var require_is_generator_function = __commonJS({
  "node_modules/is-generator-function/index.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    var fnToStr = Function.prototype.toString;
    var isFnRegex = /^\s*(?:function)?\*/;
    var hasToStringTag = require_shams2()();
    var getProto = Object.getPrototypeOf;
    var getGeneratorFunc = function() {
      if (!hasToStringTag) {
        return false;
      }
      try {
        return Function("return function*() {}")();
      } catch (e) {
      }
    };
    var GeneratorFunction;
    module.exports = function isGeneratorFunction(fn) {
      if (typeof fn !== "function") {
        return false;
      }
      if (isFnRegex.test(fnToStr.call(fn))) {
        return true;
      }
      if (!hasToStringTag) {
        var str = toStr.call(fn);
        return str === "[object GeneratorFunction]";
      }
      if (!getProto) {
        return false;
      }
      if (typeof GeneratorFunction === "undefined") {
        var generatorFunc = getGeneratorFunc();
        GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
      }
      return getProto(fn) === GeneratorFunction;
    };
  }
});

// node_modules/is-callable/index.js
var require_is_callable = __commonJS({
  "node_modules/is-callable/index.js"(exports, module) {
    "use strict";
    var fnToStr = Function.prototype.toString;
    var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
    var badArrayLike;
    var isCallableMarker;
    if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
      try {
        badArrayLike = Object.defineProperty({}, "length", {
          get: function() {
            throw isCallableMarker;
          }
        });
        isCallableMarker = {};
        reflectApply(function() {
          throw 42;
        }, null, badArrayLike);
      } catch (_) {
        if (_ !== isCallableMarker) {
          reflectApply = null;
        }
      }
    } else {
      reflectApply = null;
    }
    var constructorRegex = /^\s*class\b/;
    var isES6ClassFn = function isES6ClassFunction(value) {
      try {
        var fnStr = fnToStr.call(value);
        return constructorRegex.test(fnStr);
      } catch (e) {
        return false;
      }
    };
    var tryFunctionObject = function tryFunctionToStr(value) {
      try {
        if (isES6ClassFn(value)) {
          return false;
        }
        fnToStr.call(value);
        return true;
      } catch (e) {
        return false;
      }
    };
    var toStr = Object.prototype.toString;
    var objectClass = "[object Object]";
    var fnClass = "[object Function]";
    var genClass = "[object GeneratorFunction]";
    var ddaClass = "[object HTMLAllCollection]";
    var ddaClass2 = "[object HTML document.all class]";
    var ddaClass3 = "[object HTMLCollection]";
    var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
    var isIE68 = !(0 in [,]);
    var isDDA = function isDocumentDotAll() {
      return false;
    };
    if (typeof document === "object") {
      all = document.all;
      if (toStr.call(all) === toStr.call(document.all)) {
        isDDA = function isDocumentDotAll(value) {
          if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
            try {
              var str = toStr.call(value);
              return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
            } catch (e) {
            }
          }
          return false;
        };
      }
    }
    var all;
    module.exports = reflectApply ? function isCallable(value) {
      if (isDDA(value)) {
        return true;
      }
      if (!value) {
        return false;
      }
      if (typeof value !== "function" && typeof value !== "object") {
        return false;
      }
      try {
        reflectApply(value, null, badArrayLike);
      } catch (e) {
        if (e !== isCallableMarker) {
          return false;
        }
      }
      return !isES6ClassFn(value) && tryFunctionObject(value);
    } : function isCallable(value) {
      if (isDDA(value)) {
        return true;
      }
      if (!value) {
        return false;
      }
      if (typeof value !== "function" && typeof value !== "object") {
        return false;
      }
      if (hasToStringTag) {
        return tryFunctionObject(value);
      }
      if (isES6ClassFn(value)) {
        return false;
      }
      var strClass = toStr.call(value);
      if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
        return false;
      }
      return tryFunctionObject(value);
    };
  }
});

// node_modules/for-each/index.js
var require_for_each = __commonJS({
  "node_modules/for-each/index.js"(exports, module) {
    "use strict";
    var isCallable = require_is_callable();
    var toStr = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var forEachArray = function forEachArray2(array, iterator, receiver) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
          if (receiver == null) {
            iterator(array[i], i, array);
          } else {
            iterator.call(receiver, array[i], i, array);
          }
        }
      }
    };
    var forEachString = function forEachString2(string, iterator, receiver) {
      for (var i = 0, len = string.length; i < len; i++) {
        if (receiver == null) {
          iterator(string.charAt(i), i, string);
        } else {
          iterator.call(receiver, string.charAt(i), i, string);
        }
      }
    };
    var forEachObject = function forEachObject2(object, iterator, receiver) {
      for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
          if (receiver == null) {
            iterator(object[k], k, object);
          } else {
            iterator.call(receiver, object[k], k, object);
          }
        }
      }
    };
    var forEach = function forEach2(list, iterator, thisArg) {
      if (!isCallable(iterator)) {
        throw new TypeError("iterator must be a function");
      }
      var receiver;
      if (arguments.length >= 3) {
        receiver = thisArg;
      }
      if (toStr.call(list) === "[object Array]") {
        forEachArray(list, iterator, receiver);
      } else if (typeof list === "string") {
        forEachString(list, iterator, receiver);
      } else {
        forEachObject(list, iterator, receiver);
      }
    };
    module.exports = forEach;
  }
});

// node_modules/possible-typed-array-names/index.js
var require_possible_typed_array_names = __commonJS({
  "node_modules/possible-typed-array-names/index.js"(exports, module) {
    "use strict";
    module.exports = [
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array"
    ];
  }
});

// node_modules/available-typed-arrays/index.js
var require_available_typed_arrays = __commonJS({
  "node_modules/available-typed-arrays/index.js"(exports, module) {
    "use strict";
    var possibleNames = require_possible_typed_array_names();
    var g = typeof globalThis === "undefined" ? global : globalThis;
    module.exports = function availableTypedArrays() {
      var out = [];
      for (var i = 0; i < possibleNames.length; i++) {
        if (typeof g[possibleNames[i]] === "function") {
          out[out.length] = possibleNames[i];
        }
      }
      return out;
    };
  }
});

// node_modules/which-typed-array/index.js
var require_which_typed_array = __commonJS({
  "node_modules/which-typed-array/index.js"(exports, module) {
    "use strict";
    var forEach = require_for_each();
    var availableTypedArrays = require_available_typed_arrays();
    var callBind = require_call_bind();
    var callBound = require_callBound();
    var gOPD = require_gopd();
    var $toString = callBound("Object.prototype.toString");
    var hasToStringTag = require_shams2()();
    var g = typeof globalThis === "undefined" ? global : globalThis;
    var typedArrays = availableTypedArrays();
    var $slice = callBound("String.prototype.slice");
    var getPrototypeOf = Object.getPrototypeOf;
    var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i] === value) {
          return i;
        }
      }
      return -1;
    };
    var cache = { __proto__: null };
    if (hasToStringTag && gOPD && getPrototypeOf) {
      forEach(typedArrays, function(typedArray) {
        var arr = new g[typedArray]();
        if (Symbol.toStringTag in arr) {
          var proto = getPrototypeOf(arr);
          var descriptor = gOPD(proto, Symbol.toStringTag);
          if (!descriptor) {
            var superProto = getPrototypeOf(proto);
            descriptor = gOPD(superProto, Symbol.toStringTag);
          }
          cache["$" + typedArray] = callBind(descriptor.get);
        }
      });
    } else {
      forEach(typedArrays, function(typedArray) {
        var arr = new g[typedArray]();
        var fn = arr.slice || arr.set;
        if (fn) {
          cache["$" + typedArray] = callBind(fn);
        }
      });
    }
    var tryTypedArrays = function tryAllTypedArrays(value) {
      var found = false;
      forEach(
        // eslint-disable-next-line no-extra-parens
        /** @type {Record<`\$${TypedArrayName}`, Getter>} */
        /** @type {any} */
        cache,
        /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
        function(getter, typedArray) {
          if (!found) {
            try {
              if ("$" + getter(value) === typedArray) {
                found = $slice(typedArray, 1);
              }
            } catch (e) {
            }
          }
        }
      );
      return found;
    };
    var trySlices = function tryAllSlices(value) {
      var found = false;
      forEach(
        // eslint-disable-next-line no-extra-parens
        /** @type {Record<`\$${TypedArrayName}`, Getter>} */
        /** @type {any} */
        cache,
        /** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */
        function(getter, name) {
          if (!found) {
            try {
              getter(value);
              found = $slice(name, 1);
            } catch (e) {
            }
          }
        }
      );
      return found;
    };
    module.exports = function whichTypedArray(value) {
      if (!value || typeof value !== "object") {
        return false;
      }
      if (!hasToStringTag) {
        var tag = $slice($toString(value), 8, -1);
        if ($indexOf(typedArrays, tag) > -1) {
          return tag;
        }
        if (tag !== "Object") {
          return false;
        }
        return trySlices(value);
      }
      if (!gOPD) {
        return null;
      }
      return tryTypedArrays(value);
    };
  }
});

// node_modules/is-typed-array/index.js
var require_is_typed_array = __commonJS({
  "node_modules/is-typed-array/index.js"(exports, module) {
    "use strict";
    var whichTypedArray = require_which_typed_array();
    module.exports = function isTypedArray(value) {
      return !!whichTypedArray(value);
    };
  }
});

// node_modules/util/support/types.js
var require_types = __commonJS({
  "node_modules/util/support/types.js"(exports) {
    "use strict";
    var isArgumentsObject = require_is_arguments();
    var isGeneratorFunction = require_is_generator_function();
    var whichTypedArray = require_which_typed_array();
    var isTypedArray = require_is_typed_array();
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    var BigIntSupported = typeof BigInt !== "undefined";
    var SymbolSupported = typeof Symbol !== "undefined";
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    if (BigIntSupported) {
      bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    var bigIntValue;
    if (SymbolSupported) {
      symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    var symbolValue;
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== "object") {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch (e) {
        return false;
      }
    }
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction;
    exports.isTypedArray = isTypedArray;
    function isPromise(input) {
      return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
    }
    exports.isPromise = isPromise;
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
      return isTypedArray(value) || isDataView(value);
    }
    exports.isArrayBufferView = isArrayBufferView;
    function isUint8Array(value) {
      return whichTypedArray(value) === "Uint8Array";
    }
    exports.isUint8Array = isUint8Array;
    function isUint8ClampedArray(value) {
      return whichTypedArray(value) === "Uint8ClampedArray";
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    function isUint16Array(value) {
      return whichTypedArray(value) === "Uint16Array";
    }
    exports.isUint16Array = isUint16Array;
    function isUint32Array(value) {
      return whichTypedArray(value) === "Uint32Array";
    }
    exports.isUint32Array = isUint32Array;
    function isInt8Array(value) {
      return whichTypedArray(value) === "Int8Array";
    }
    exports.isInt8Array = isInt8Array;
    function isInt16Array(value) {
      return whichTypedArray(value) === "Int16Array";
    }
    exports.isInt16Array = isInt16Array;
    function isInt32Array(value) {
      return whichTypedArray(value) === "Int32Array";
    }
    exports.isInt32Array = isInt32Array;
    function isFloat32Array(value) {
      return whichTypedArray(value) === "Float32Array";
    }
    exports.isFloat32Array = isFloat32Array;
    function isFloat64Array(value) {
      return whichTypedArray(value) === "Float64Array";
    }
    exports.isFloat64Array = isFloat64Array;
    function isBigInt64Array(value) {
      return whichTypedArray(value) === "BigInt64Array";
    }
    exports.isBigInt64Array = isBigInt64Array;
    function isBigUint64Array(value) {
      return whichTypedArray(value) === "BigUint64Array";
    }
    exports.isBigUint64Array = isBigUint64Array;
    function isMapToString(value) {
      return ObjectToString(value) === "[object Map]";
    }
    isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
    function isMap(value) {
      if (typeof Map === "undefined") {
        return false;
      }
      return isMapToString.working ? isMapToString(value) : value instanceof Map;
    }
    exports.isMap = isMap;
    function isSetToString(value) {
      return ObjectToString(value) === "[object Set]";
    }
    isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
    function isSet(value) {
      if (typeof Set === "undefined") {
        return false;
      }
      return isSetToString.working ? isSetToString(value) : value instanceof Set;
    }
    exports.isSet = isSet;
    function isWeakMapToString(value) {
      return ObjectToString(value) === "[object WeakMap]";
    }
    isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
    function isWeakMap(value) {
      if (typeof WeakMap === "undefined") {
        return false;
      }
      return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    function isWeakSetToString(value) {
      return ObjectToString(value) === "[object WeakSet]";
    }
    isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    function isArrayBufferToString(value) {
      return ObjectToString(value) === "[object ArrayBuffer]";
    }
    isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    function isDataViewToString(value) {
      return ObjectToString(value) === "[object DataView]";
    }
    isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
    function isDataView(value) {
      if (typeof DataView === "undefined") {
        return false;
      }
      return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === "[object SharedArrayBuffer]";
    }
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBufferCopy === "undefined") {
        return false;
      }
      if (typeof isSharedArrayBufferToString.working === "undefined") {
        isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
      }
      return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    function isAsyncFunction(value) {
      return ObjectToString(value) === "[object AsyncFunction]";
    }
    exports.isAsyncFunction = isAsyncFunction;
    function isMapIterator(value) {
      return ObjectToString(value) === "[object Map Iterator]";
    }
    exports.isMapIterator = isMapIterator;
    function isSetIterator(value) {
      return ObjectToString(value) === "[object Set Iterator]";
    }
    exports.isSetIterator = isSetIterator;
    function isGeneratorObject(value) {
      return ObjectToString(value) === "[object Generator]";
    }
    exports.isGeneratorObject = isGeneratorObject;
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === "[object WebAssembly.Module]";
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
      return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    function isAnyArrayBuffer(value) {
      return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function() {
          throw new Error(method + " is not supported in userland");
        }
      });
    });
  }
});

// node_modules/util/support/isBufferBrowser.js
var require_isBufferBrowser = __commonJS({
  "node_modules/util/support/isBufferBrowser.js"(exports, module) {
    module.exports = function isBuffer(arg) {
      return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
    };
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/util/util.js
var require_util = __commonJS({
  "node_modules/util/util.js"(exports) {
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
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
          objects.push(inspect2(arguments[i]));
        }
        return objects.join(" ");
      }
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x2) {
        if (x2 === "%%")
          return "%";
        if (i >= len)
          return x2;
        switch (x2) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x2;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += " " + x;
        } else {
          str += " " + inspect2(x);
        }
      }
      return str;
    };
    exports.deprecate = function(fn, msg) {
      if (typeof process !== "undefined" && process.noDeprecation === true) {
        return fn;
      }
      if (typeof process === "undefined") {
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
      debugEnv = process.env.NODE_DEBUG;
      debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
      debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
    }
    var debugEnv;
    exports.debuglog = function(set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function() {
          };
        }
      }
      return debugs[set];
    };
    function inspect2(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      if (arguments.length >= 3)
        ctx.depth = arguments[2];
      if (arguments.length >= 4)
        ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined(ctx.showHidden))
        ctx.showHidden = false;
      if (isUndefined(ctx.depth))
        ctx.depth = 2;
      if (isUndefined(ctx.colors))
        ctx.colors = false;
      if (isUndefined(ctx.customInspect))
        ctx.customInspect = true;
      if (ctx.colors)
        ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect2;
    inspect2.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect2.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      // "name": intentionally not styling
      "regexp": "red"
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect2.styles[styleType];
      if (style) {
        return "\x1B[" + inspect2.colors[style][0] + "m" + str + "\x1B[" + inspect2.colors[style][1] + "m";
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
      if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction(value)) {
        var n = value.name ? ": " + value.name : "";
        base = " [Function" + n + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
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
        return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value))
        return ctx.stylize("" + value, "number");
      if (isBoolean(value))
        return ctx.stylize("" + value, "boolean");
      if (isNull(value))
        return ctx.stylize("null", "null");
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            String(i),
            true
          ));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            true
          ));
        }
      });
      return output;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").slice(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.slice(1, -1);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf("\n") >= 0)
          numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    exports.types = require_types();
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
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
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    function isError(e) {
      return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
    }
    exports.isError = isError;
    exports.types.isNativeError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require_isBufferBrowser();
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    function pad(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function timestamp() {
      var d = /* @__PURE__ */ new Date();
      var time = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())
      ].join(":");
      return [d.getDate(), months[d.getMonth()], time].join(" ");
    }
    exports.log = function() {
      console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
    };
    exports.inherits = require_inherits_browser();
    exports._extend = function(origin, add) {
      if (!add || !isObject(add))
        return origin;
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
    var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
    exports.promisify = function promisify(original) {
      if (typeof original !== "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return fn;
      }
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function(err, value) {
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
      if (kCustomPromisifiedSymbol)
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    };
    exports.promisify.custom = kCustomPromisifiedSymbol;
    function callbackifyOnRejected(reason, cb) {
      if (!reason) {
        var newReason = new Error("Promise was rejected with a falsy value");
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    function callbackify(original) {
      if (typeof original !== "function") {
        throw new TypeError('The "original" argument must be of type Function');
      }
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var maybeCb = args.pop();
        if (typeof maybeCb !== "function") {
          throw new TypeError("The last argument must be of type Function");
        }
        var self2 = this;
        var cb = function() {
          return maybeCb.apply(self2, arguments);
        };
        original.apply(this, args).then(
          function(ret) {
            process.nextTick(cb.bind(null, null, ret));
          },
          function(rej) {
            process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
          }
        );
      }
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(
        callbackified,
        getOwnPropertyDescriptors(original)
      );
      return callbackified;
    }
    exports.callbackify = callbackify;
  }
});

// node_modules/@acuminous/bitsyntax/lib/compile.js
var require_compile = __commonJS({
  "node_modules/@acuminous/bitsyntax/lib/compile.js"(exports, module) {
    "use strict";
    require_buffer_more_ints();
    var $ = require_util().format;
    var parse = require_parse().parse;
    var interp = require_interp();
    var parse_int = interp.parse_int;
    var parse_float = interp.parse_float;
    var construct = require_constructor();
    var write_int = construct.write_int;
    var write_float = construct.write_float;
    var Buffer2 = require_safe_buffer().Buffer;
    var lines = [];
    function $start() {
      lines = [];
    }
    function $line() {
      lines.push($.apply(null, arguments));
    }
    function $result() {
      return lines.join("\n");
    }
    function bits_expr(segment) {
      if (typeof segment.size === "string") {
        return $("%s * %d", var_name(segment.size), segment.unit);
      } else {
        return (segment.size * segment.unit).toString();
      }
    }
    function get_number(segment) {
      $line("bits = %s;\n", bits_expr(segment));
      var parser = segment.type === "integer" ? "parse_int" : "parse_float";
      var be = segment.bigendian, sg = segment.signed;
      $line("byteoffset = offset / 8; offset += bits");
      $line("if (offset > binsize) { return false; }");
      $line(
        "else { result = %s(bin, byteoffset, bits / 8, %s, %s); }",
        parser,
        be,
        sg
      );
    }
    function get_binary(segment) {
      $line("byteoffset = offset / 8;");
      if (segment.size === true) {
        $line("offset = binsize;");
        $line("result = bin.slice(byteoffset);");
      } else {
        $line("bits = %s;", bits_expr(segment));
        $line("offset += bits;");
        $line("if (offset > binsize) { return false; }");
        $line(
          "else { result = bin.slice(byteoffset,",
          "byteoffset + bits / 8); }"
        );
      }
    }
    function get_string(segment) {
      $line("byteoffset = offset / 8;");
      var strlen = segment.value.length;
      var strlenbits = strlen * 8;
      $line("offset += %d;", strlenbits);
      $line("if (offset > binsize) { return false; }");
      $line(
        "else { result = bin.toString(byteoffset,",
        $("byteoffset + %d); }", strlen)
      );
    }
    function skip_bits(segment) {
      if (typeof segment.size === "string") {
        $line(
          "var skipbits = %s * %d;",
          var_name(segment.size),
          segment.unit
        );
        $line("if (offset + skipbits > binsize) { return false; }");
        $line("else { offset += skipbits; }");
      } else if (segment.size === true) {
        $line("if (offset % 8 === 0) { offset = binsize; }");
        $line("else { return false; }");
      } else {
        var bits = segment.unit * segment.size;
        $line("if (offset + %d > binsize) { return false; }", bits);
        $line("else { offset += %d; }", bits);
      }
    }
    function match_seg(segment) {
      if (segment.name === "_") {
        skip_bits(segment);
      } else {
        var assign_result;
        switch (segment.type) {
          case "integer":
          case "float":
            get_number(segment);
            break;
          case "binary":
            get_binary(segment);
            break;
          case "string":
            get_string(segment);
            break;
        }
        $line("if (result === false) return false;");
        if (segment.name) {
          $line("else if (%s !== undefined) {", var_name(segment.name));
          $line(
            "if (%s != result) return false;",
            var_name(segment.name)
          );
          $line("}");
          $line("else %s = result;", var_name(segment.name));
        } else {
          var repr = JSON.stringify(segment.value);
          $line("else if (result != %s) return false;", repr);
        }
      }
    }
    function var_name(name) {
      return "var_" + name;
    }
    function variables(segments) {
      var names = {};
      for (var i = 0; i < segments.length; i++) {
        var name = segments[i].name;
        if (name && name !== "_") {
          names[name] = true;
        }
        name = segments[i].size;
        if (typeof name === "string") {
          names[name] = true;
        }
      }
      return Object.keys(names);
    }
    function compile_pattern(segments) {
      $start();
      $line("return function(binary, env) {");
      $line("'use strict';");
      $line("var bin = binary, env = env || {};");
      $line("var offset = 0, binsize = bin.length * 8;");
      $line("var bits, result, byteoffset;");
      var varnames = variables(segments);
      for (var v = 0; v < varnames.length; v++) {
        var name = varnames[v];
        $line("var %s = env['%s'];", var_name(name), name);
      }
      var len = segments.length;
      for (var i = 0; i < len; i++) {
        var segment = segments[i];
        $line("// " + JSON.stringify(segment));
        match_seg(segment);
      }
      $line("if (offset == binsize) {");
      $line("return {");
      for (var v = 0; v < varnames.length; v++) {
        var name = varnames[v];
        $line("%s: %s,", name, var_name(name));
      }
      $line("};");
      $line("}");
      $line("else return false;");
      $line("}");
      var fn = new Function("parse_int", "parse_float", $result());
      return fn(parse_int, parse_float);
    }
    function write_seg(segment) {
      switch (segment.type) {
        case "string":
          $line(
            "offset += buf.write(%s, offset, 'utf8');",
            JSON.stringify(segment.value)
          );
          break;
        case "binary":
          $line("val = bindings['%s'];", segment.name);
          if (segment.size === true) {
            $line("size = val.length;");
          } else if (typeof segment.size === "string") {
            $line(
              "size = (bindings['%s'] * %d) / 8;",
              segment.size,
              segment.unit
            );
          } else {
            $line("size = %d;", segment.size * segment.unit / 8);
          }
          $line("val.copy(buf, offset, 0, size);");
          $line("offset += size;");
          break;
        case "integer":
        case "float":
          write_number(segment);
          break;
      }
    }
    function write_number(segment) {
      if (segment.name) {
        $line("val = bindings['%s'];", segment.name);
      } else {
        $line("val = %d", segment.value);
      }
      var writer = segment.type === "integer" ? "write_int" : "write_float";
      if (typeof segment.size === "string") {
        $line(
          "size = (bindings['%s'] * %d) / 8;",
          segment.size,
          segment.unit
        );
      } else {
        $line("size = %d;", segment.size * segment.unit / 8);
      }
      $line(
        "%s(buf, val, offset, size, %s);",
        writer,
        segment.bigendian
      );
      $line("offset += size;");
    }
    function size_of(segments) {
      var variable = [];
      var fixed = 0;
      for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        if (typeof segment.size === "string" || segment.size === true) {
          variable.push(segment);
        } else if (segment.type === "string") {
          fixed += Buffer2.byteLength(segment.value);
        } else {
          fixed += segment.size * segment.unit / 8;
        }
      }
      $line("var buffersize = %d;", fixed);
      if (variable.length > 0) {
        for (var j = 0; j < variable.length; j++) {
          var segment = variable[j];
          if (segment.size === true) {
            $line("buffersize += bindings['%s'].length;", segment.name);
          } else {
            $line(
              "buffersize += (bindings['%s'] * %d) / 8;",
              segment.size,
              segment.unit
            );
          }
        }
      }
    }
    function emit_write(segments) {
      $line("var val, size;");
      var len = segments.length;
      for (var i = 0; i < len; i++) {
        var segment = segments[i];
        $line("// %s", JSON.stringify(segment));
        write_seg(segment);
      }
    }
    function compile_ctor(segments) {
      $start();
      $line("return function(bindings) {");
      $line("'use strict';");
      size_of(segments);
      $line("var buf = Buffer.alloc(buffersize);");
      $line("var offset = 0;");
      emit_write(segments);
      $line("return buf;");
      $line("}");
      return new Function(
        "write_int",
        "write_float",
        "Buffer",
        $result()
      )(write_int, write_float, Buffer2);
    }
    module.exports.compile_pattern = compile_pattern;
    module.exports.compile = function() {
      var str = [].join.call(arguments, ",");
      var p = parse(str);
      return compile_pattern(p);
    };
    module.exports.compile_builder = function() {
      var str = [].join.call(arguments, ",");
      var p = parse(str);
      return compile_ctor(p);
    };
  }
});

// node_modules/@acuminous/bitsyntax/index.js
var require_bitsyntax = __commonJS({
  "node_modules/@acuminous/bitsyntax/index.js"(exports, module) {
    "use strict";
    module.exports.parse = require_parse().parse;
    module.exports.match = require_interp().match;
    module.exports.build = require_constructor().build;
    module.exports.write = require_constructor().write;
    module.exports.matcher = module.exports.compile = require_compile().compile;
    module.exports.builder = require_compile().compile_builder;
  }
});

// node_modules/amqplib/lib/frame.js
var require_frame = __commonJS({
  "node_modules/amqplib/lib/frame.js"(exports, module) {
    "use strict";
    var defs = require_defs();
    var constants = defs.constants;
    var decode = defs.decode;
    var Bits = require_bitsyntax();
    module.exports.PROTOCOL_HEADER = "AMQP" + String.fromCharCode(0, 0, 9, 1);
    var FRAME_METHOD = constants.FRAME_METHOD;
    var FRAME_HEARTBEAT = constants.FRAME_HEARTBEAT;
    var FRAME_HEADER = constants.FRAME_HEADER;
    var FRAME_BODY = constants.FRAME_BODY;
    var FRAME_END = constants.FRAME_END;
    var bodyCons = Bits.builder(
      FRAME_BODY,
      "channel:16, size:32, payload:size/binary",
      FRAME_END
    );
    module.exports.makeBodyFrame = function(channel, payload) {
      return bodyCons({ channel, size: payload.length, payload });
    };
    var frameHeaderPattern = Bits.matcher(
      "type:8",
      "channel:16",
      "size:32",
      "rest/binary"
    );
    function parseFrame(bin, max) {
      var fh = frameHeaderPattern(bin);
      if (fh) {
        var size = fh.size, rest = fh.rest;
        if (size > max) {
          throw new Error("Frame size exceeds frame max");
        } else if (rest.length > size) {
          if (rest[size] !== FRAME_END)
            throw new Error("Invalid frame");
          return {
            type: fh.type,
            channel: fh.channel,
            size,
            payload: rest.slice(0, size),
            rest: rest.slice(size + 1)
          };
        }
      }
      return false;
    }
    module.exports.parseFrame = parseFrame;
    var headerPattern = Bits.matcher(
      "class:16",
      "_weight:16",
      "size:64",
      "flagsAndfields/binary"
    );
    var methodPattern = Bits.matcher("id:32, args/binary");
    var HEARTBEAT = { channel: 0 };
    module.exports.decodeFrame = function(frame) {
      var payload = frame.payload;
      switch (frame.type) {
        case FRAME_METHOD:
          var idAndArgs = methodPattern(payload);
          var id = idAndArgs.id;
          var fields = decode(id, idAndArgs.args);
          return { id, channel: frame.channel, fields };
        case FRAME_HEADER:
          var parts = headerPattern(payload);
          var id = parts["class"];
          var fields = decode(id, parts.flagsAndfields);
          return {
            id,
            channel: frame.channel,
            size: parts.size,
            fields
          };
        case FRAME_BODY:
          return { channel: frame.channel, content: frame.payload };
        case FRAME_HEARTBEAT:
          return HEARTBEAT;
        default:
          throw new Error("Unknown frame type " + frame.type);
      }
    };
    module.exports.HEARTBEAT_BUF = Buffer.from([
      constants.FRAME_HEARTBEAT,
      0,
      0,
      0,
      0,
      // size = 0
      0,
      0,
      // channel = 0
      constants.FRAME_END
    ]);
    module.exports.HEARTBEAT = HEARTBEAT;
  }
});

// node_modules/assert/build/internal/errors.js
var require_errors = __commonJS({
  "node_modules/assert/build/internal/errors.js"(exports, module) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      Object.defineProperty(subClass, "prototype", { writable: false });
      if (superClass)
        _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
      };
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e) {
        return false;
      }
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    var codes = {};
    var assert;
    var util;
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      var NodeError = function(_Base) {
        _inherits(NodeError2, _Base);
        var _super = _createSuper(NodeError2);
        function NodeError2(arg1, arg2, arg3) {
          var _this;
          _classCallCheck(this, NodeError2);
          _this = _super.call(this, getMessage(arg1, arg2, arg3));
          _this.code = code;
          return _this;
        }
        return _createClass(NodeError2);
      }(Base);
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        var len = expected.length;
        expected = expected.map(function(i) {
          return String(i);
        });
        if (len > 2) {
          return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
        } else if (len === 2) {
          return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
        } else {
          return "of ".concat(thing, " ").concat(expected[0]);
        }
      } else {
        return "of ".concat(thing, " ").concat(String(expected));
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      if (assert === void 0)
        assert = require_assert();
      assert(typeof name === "string", "'name' must be a string");
      var determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      var msg;
      if (endsWith(name, " argument")) {
        msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      } else {
        var type = includes(name, ".") ? "property" : "argument";
        msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      }
      msg += ". Received type ".concat(_typeof(actual));
      return msg;
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_VALUE", function(name, value) {
      var reason = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
      if (util === void 0)
        util = require_util();
      var inspected = util.inspect(value);
      if (inspected.length > 128) {
        inspected = "".concat(inspected.slice(0, 128), "...");
      }
      return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
    }, TypeError, RangeError);
    createErrorType("ERR_INVALID_RETURN_VALUE", function(input, name, value) {
      var type;
      if (value && value.constructor && value.constructor.name) {
        type = "instance of ".concat(value.constructor.name);
      } else {
        type = "type ".concat(_typeof(value));
      }
      return "Expected ".concat(input, ' to be returned from the "').concat(name, '"') + " function but got ".concat(type, ".");
    }, TypeError);
    createErrorType("ERR_MISSING_ARGS", function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (assert === void 0)
        assert = require_assert();
      assert(args.length > 0, "At least one arg needs to be specified");
      var msg = "The ";
      var len = args.length;
      args = args.map(function(a) {
        return '"'.concat(a, '"');
      });
      switch (len) {
        case 1:
          msg += "".concat(args[0], " argument");
          break;
        case 2:
          msg += "".concat(args[0], " and ").concat(args[1], " arguments");
          break;
        default:
          msg += args.slice(0, len - 1).join(", ");
          msg += ", and ".concat(args[len - 1], " arguments");
          break;
      }
      return "".concat(msg, " must be specified");
    }, TypeError);
    module.exports.codes = codes;
  }
});

// node_modules/assert/build/internal/assert/assertion_error.js
var require_assertion_error = __commonJS({
  "node_modules/assert/build/internal/assert/assertion_error.js"(exports, module) {
    "use strict";
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
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
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      Object.defineProperty(subClass, "prototype", { writable: false });
      if (superClass)
        _setPrototypeOf(subClass, superClass);
    }
    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
      };
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2))
          return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2))
            return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct.bind();
      } else {
        _construct = function _construct2(Parent2, args2, Class2) {
          var a = [null];
          a.push.apply(a, args2);
          var Constructor = Function.bind.apply(Parent2, a);
          var instance = new Constructor();
          if (Class2)
            _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e) {
        return false;
      }
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    var _require = require_util();
    var inspect2 = _require.inspect;
    var _require2 = require_errors();
    var ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE;
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function repeat(str, count) {
      count = Math.floor(count);
      if (str.length == 0 || count == 0)
        return "";
      var maxCount = str.length * count;
      count = Math.floor(Math.log(count) / Math.log(2));
      while (count) {
        str += str;
        count--;
      }
      str += str.substring(0, maxCount - str.length);
      return str;
    }
    var blue = "";
    var green = "";
    var red = "";
    var white = "";
    var kReadableOperator = {
      deepStrictEqual: "Expected values to be strictly deep-equal:",
      strictEqual: "Expected values to be strictly equal:",
      strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
      deepEqual: "Expected values to be loosely deep-equal:",
      equal: "Expected values to be loosely equal:",
      notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
      notStrictEqual: 'Expected "actual" to be strictly unequal to:',
      notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
      notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
      notEqual: 'Expected "actual" to be loosely unequal to:',
      notIdentical: "Values identical but not reference-equal:"
    };
    var kMaxShortLength = 10;
    function copyError(source) {
      var keys = Object.keys(source);
      var target = Object.create(Object.getPrototypeOf(source));
      keys.forEach(function(key) {
        target[key] = source[key];
      });
      Object.defineProperty(target, "message", {
        value: source.message
      });
      return target;
    }
    function inspectValue(val) {
      return inspect2(val, {
        compact: false,
        customInspect: false,
        depth: 1e3,
        maxArrayLength: Infinity,
        // Assert compares only enumerable properties (with a few exceptions).
        showHidden: false,
        // Having a long line as error is better than wrapping the line for
        // comparison for now.
        // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
        // have meta information about the inspected properties (i.e., know where
        // in what line the property starts and ends).
        breakLength: Infinity,
        // Assert does not detect proxies currently.
        showProxy: false,
        sorted: true,
        // Inspect getters as we also check them when comparing entries.
        getters: true
      });
    }
    function createErrDiff(actual, expected, operator) {
      var other = "";
      var res = "";
      var lastPos = 0;
      var end = "";
      var skipped = false;
      var actualInspected = inspectValue(actual);
      var actualLines = actualInspected.split("\n");
      var expectedLines = inspectValue(expected).split("\n");
      var i = 0;
      var indicator = "";
      if (operator === "strictEqual" && _typeof(actual) === "object" && _typeof(expected) === "object" && actual !== null && expected !== null) {
        operator = "strictEqualObject";
      }
      if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
        var inputLength = actualLines[0].length + expectedLines[0].length;
        if (inputLength <= kMaxShortLength) {
          if ((_typeof(actual) !== "object" || actual === null) && (_typeof(expected) !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
            return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
          }
        } else if (operator !== "strictEqualObject") {
          var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;
          if (inputLength < maxLength) {
            while (actualLines[0][i] === expectedLines[0][i]) {
              i++;
            }
            if (i > 2) {
              indicator = "\n  ".concat(repeat(" ", i), "^");
              i = 0;
            }
          }
        }
      }
      var a = actualLines[actualLines.length - 1];
      var b = expectedLines[expectedLines.length - 1];
      while (a === b) {
        if (i++ < 2) {
          end = "\n  ".concat(a).concat(end);
        } else {
          other = a;
        }
        actualLines.pop();
        expectedLines.pop();
        if (actualLines.length === 0 || expectedLines.length === 0)
          break;
        a = actualLines[actualLines.length - 1];
        b = expectedLines[expectedLines.length - 1];
      }
      var maxLines = Math.max(actualLines.length, expectedLines.length);
      if (maxLines === 0) {
        var _actualLines = actualInspected.split("\n");
        if (_actualLines.length > 30) {
          _actualLines[26] = "".concat(blue, "...").concat(white);
          while (_actualLines.length > 27) {
            _actualLines.pop();
          }
        }
        return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join("\n"), "\n");
      }
      if (i > 3) {
        end = "\n".concat(blue, "...").concat(white).concat(end);
        skipped = true;
      }
      if (other !== "") {
        end = "\n  ".concat(other).concat(end);
        other = "";
      }
      var printedLines = 0;
      var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
      var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
      for (i = 0; i < maxLines; i++) {
        var cur = i - lastPos;
        if (actualLines.length < i + 1) {
          if (cur > 1 && i > 2) {
            if (cur > 4) {
              res += "\n".concat(blue, "...").concat(white);
              skipped = true;
            } else if (cur > 3) {
              res += "\n  ".concat(expectedLines[i - 2]);
              printedLines++;
            }
            res += "\n  ".concat(expectedLines[i - 1]);
            printedLines++;
          }
          lastPos = i;
          other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
          printedLines++;
        } else if (expectedLines.length < i + 1) {
          if (cur > 1 && i > 2) {
            if (cur > 4) {
              res += "\n".concat(blue, "...").concat(white);
              skipped = true;
            } else if (cur > 3) {
              res += "\n  ".concat(actualLines[i - 2]);
              printedLines++;
            }
            res += "\n  ".concat(actualLines[i - 1]);
            printedLines++;
          }
          lastPos = i;
          res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
          printedLines++;
        } else {
          var expectedLine = expectedLines[i];
          var actualLine = actualLines[i];
          var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ",") || actualLine.slice(0, -1) !== expectedLine);
          if (divergingLines && endsWith(expectedLine, ",") && expectedLine.slice(0, -1) === actualLine) {
            divergingLines = false;
            actualLine += ",";
          }
          if (divergingLines) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(actualLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(actualLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
            printedLines += 2;
          } else {
            res += other;
            other = "";
            if (cur === 1 || i === 0) {
              res += "\n  ".concat(actualLine);
              printedLines++;
            }
          }
        }
        if (printedLines > 20 && i < maxLines - 2) {
          return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
        }
      }
      return "".concat(msg).concat(skipped ? skippedMsg : "", "\n").concat(res).concat(other).concat(end).concat(indicator);
    }
    var AssertionError = function(_Error, _inspect$custom) {
      _inherits(AssertionError2, _Error);
      var _super = _createSuper(AssertionError2);
      function AssertionError2(options) {
        var _this;
        _classCallCheck(this, AssertionError2);
        if (_typeof(options) !== "object" || options === null) {
          throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
        }
        var message = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
        var actual = options.actual, expected = options.expected;
        var limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        if (message != null) {
          _this = _super.call(this, String(message));
        } else {
          if (process.stderr && process.stderr.isTTY) {
            if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
              blue = "\x1B[34m";
              green = "\x1B[32m";
              white = "\x1B[39m";
              red = "\x1B[31m";
            } else {
              blue = "";
              green = "";
              white = "";
              red = "";
            }
          }
          if (_typeof(actual) === "object" && actual !== null && _typeof(expected) === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
            actual = copyError(actual);
            expected = copyError(expected);
          }
          if (operator === "deepStrictEqual" || operator === "strictEqual") {
            _this = _super.call(this, createErrDiff(actual, expected, operator));
          } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
            var base = kReadableOperator[operator];
            var res = inspectValue(actual).split("\n");
            if (operator === "notStrictEqual" && _typeof(actual) === "object" && actual !== null) {
              base = kReadableOperator.notStrictEqualObject;
            }
            if (res.length > 30) {
              res[26] = "".concat(blue, "...").concat(white);
              while (res.length > 27) {
                res.pop();
              }
            }
            if (res.length === 1) {
              _this = _super.call(this, "".concat(base, " ").concat(res[0]));
            } else {
              _this = _super.call(this, "".concat(base, "\n\n").concat(res.join("\n"), "\n"));
            }
          } else {
            var _res = inspectValue(actual);
            var other = "";
            var knownOperators = kReadableOperator[operator];
            if (operator === "notDeepEqual" || operator === "notEqual") {
              _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
              if (_res.length > 1024) {
                _res = "".concat(_res.slice(0, 1021), "...");
              }
            } else {
              other = "".concat(inspectValue(expected));
              if (_res.length > 512) {
                _res = "".concat(_res.slice(0, 509), "...");
              }
              if (other.length > 512) {
                other = "".concat(other.slice(0, 509), "...");
              }
              if (operator === "deepEqual" || operator === "equal") {
                _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
              } else {
                other = " ".concat(operator, " ").concat(other);
              }
            }
            _this = _super.call(this, "".concat(_res).concat(other));
          }
        }
        Error.stackTraceLimit = limit;
        _this.generatedMessage = !message;
        Object.defineProperty(_assertThisInitialized(_this), "name", {
          value: "AssertionError [ERR_ASSERTION]",
          enumerable: false,
          writable: true,
          configurable: true
        });
        _this.code = "ERR_ASSERTION";
        _this.actual = actual;
        _this.expected = expected;
        _this.operator = operator;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
        }
        _this.stack;
        _this.name = "AssertionError";
        return _possibleConstructorReturn(_this);
      }
      _createClass(AssertionError2, [{
        key: "toString",
        value: function toString() {
          return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
        }
      }, {
        key: _inspect$custom,
        value: function value(recurseTimes, ctx) {
          return inspect2(this, _objectSpread(_objectSpread({}, ctx), {}, {
            customInspect: false,
            depth: 0
          }));
        }
      }]);
      return AssertionError2;
    }(_wrapNativeSuper(Error), inspect2.custom);
    module.exports = AssertionError;
  }
});

// node_modules/object-keys/isArguments.js
var require_isArguments = __commonJS({
  "node_modules/object-keys/isArguments.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    module.exports = function isArguments(value) {
      var str = toStr.call(value);
      var isArgs = str === "[object Arguments]";
      if (!isArgs) {
        isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
      }
      return isArgs;
    };
  }
});

// node_modules/object-keys/implementation.js
var require_implementation2 = __commonJS({
  "node_modules/object-keys/implementation.js"(exports, module) {
    "use strict";
    var keysShim;
    if (!Object.keys) {
      has = Object.prototype.hasOwnProperty;
      toStr = Object.prototype.toString;
      isArgs = require_isArguments();
      isEnumerable = Object.prototype.propertyIsEnumerable;
      hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
      hasProtoEnumBug = isEnumerable.call(function() {
      }, "prototype");
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor"
      ];
      equalsConstructorPrototype = function(o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
      };
      excludedKeys = {
        $applicationCache: true,
        $console: true,
        $external: true,
        $frame: true,
        $frameElement: true,
        $frames: true,
        $innerHeight: true,
        $innerWidth: true,
        $onmozfullscreenchange: true,
        $onmozfullscreenerror: true,
        $outerHeight: true,
        $outerWidth: true,
        $pageXOffset: true,
        $pageYOffset: true,
        $parent: true,
        $scrollLeft: true,
        $scrollTop: true,
        $scrollX: true,
        $scrollY: true,
        $self: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $window: true
      };
      hasAutomationEqualityBug = function() {
        if (typeof window === "undefined") {
          return false;
        }
        for (var k in window) {
          try {
            if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
              try {
                equalsConstructorPrototype(window[k]);
              } catch (e) {
                return true;
              }
            }
          } catch (e) {
            return true;
          }
        }
        return false;
      }();
      equalsConstructorPrototypeIfNotBuggy = function(o) {
        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
          return equalsConstructorPrototype(o);
        }
        try {
          return equalsConstructorPrototype(o);
        } catch (e) {
          return false;
        }
      };
      keysShim = function keys(object) {
        var isObject = object !== null && typeof object === "object";
        var isFunction = toStr.call(object) === "[object Function]";
        var isArguments = isArgs(object);
        var isString = isObject && toStr.call(object) === "[object String]";
        var theKeys = [];
        if (!isObject && !isFunction && !isArguments) {
          throw new TypeError("Object.keys called on a non-object");
        }
        var skipProto = hasProtoEnumBug && isFunction;
        if (isString && object.length > 0 && !has.call(object, 0)) {
          for (var i = 0; i < object.length; ++i) {
            theKeys.push(String(i));
          }
        }
        if (isArguments && object.length > 0) {
          for (var j = 0; j < object.length; ++j) {
            theKeys.push(String(j));
          }
        } else {
          for (var name in object) {
            if (!(skipProto && name === "prototype") && has.call(object, name)) {
              theKeys.push(String(name));
            }
          }
        }
        if (hasDontEnumBug) {
          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
          for (var k = 0; k < dontEnums.length; ++k) {
            if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
              theKeys.push(dontEnums[k]);
            }
          }
        }
        return theKeys;
      };
    }
    var has;
    var toStr;
    var isArgs;
    var isEnumerable;
    var hasDontEnumBug;
    var hasProtoEnumBug;
    var dontEnums;
    var equalsConstructorPrototype;
    var excludedKeys;
    var hasAutomationEqualityBug;
    var equalsConstructorPrototypeIfNotBuggy;
    module.exports = keysShim;
  }
});

// node_modules/object-keys/index.js
var require_object_keys = __commonJS({
  "node_modules/object-keys/index.js"(exports, module) {
    "use strict";
    var slice = Array.prototype.slice;
    var isArgs = require_isArguments();
    var origKeys = Object.keys;
    var keysShim = origKeys ? function keys(o) {
      return origKeys(o);
    } : require_implementation2();
    var originalKeys = Object.keys;
    keysShim.shim = function shimObjectKeys() {
      if (Object.keys) {
        var keysWorksWithArguments = function() {
          var args = Object.keys(arguments);
          return args && args.length === arguments.length;
        }(1, 2);
        if (!keysWorksWithArguments) {
          Object.keys = function keys(object) {
            if (isArgs(object)) {
              return originalKeys(slice.call(object));
            }
            return originalKeys(object);
          };
        }
      } else {
        Object.keys = keysShim;
      }
      return Object.keys || keysShim;
    };
    module.exports = keysShim;
  }
});

// node_modules/object.assign/implementation.js
var require_implementation3 = __commonJS({
  "node_modules/object.assign/implementation.js"(exports, module) {
    "use strict";
    var objectKeys = require_object_keys();
    var hasSymbols = require_shams()();
    var callBound = require_callBound();
    var toObject = Object;
    var $push = callBound("Array.prototype.push");
    var $propIsEnumerable = callBound("Object.prototype.propertyIsEnumerable");
    var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;
    module.exports = function assign(target, source1) {
      if (target == null) {
        throw new TypeError("target must be an object");
      }
      var to = toObject(target);
      if (arguments.length === 1) {
        return to;
      }
      for (var s = 1; s < arguments.length; ++s) {
        var from = toObject(arguments[s]);
        var keys = objectKeys(from);
        var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
        if (getSymbols) {
          var syms = getSymbols(from);
          for (var j = 0; j < syms.length; ++j) {
            var key = syms[j];
            if ($propIsEnumerable(from, key)) {
              $push(keys, key);
            }
          }
        }
        for (var i = 0; i < keys.length; ++i) {
          var nextKey = keys[i];
          if ($propIsEnumerable(from, nextKey)) {
            var propValue = from[nextKey];
            to[nextKey] = propValue;
          }
        }
      }
      return to;
    };
  }
});

// node_modules/object.assign/polyfill.js
var require_polyfill = __commonJS({
  "node_modules/object.assign/polyfill.js"(exports, module) {
    "use strict";
    var implementation = require_implementation3();
    var lacksProperEnumerationOrder = function() {
      if (!Object.assign) {
        return false;
      }
      var str = "abcdefghijklmnopqrst";
      var letters = str.split("");
      var map = {};
      for (var i = 0; i < letters.length; ++i) {
        map[letters[i]] = letters[i];
      }
      var obj = Object.assign({}, map);
      var actual = "";
      for (var k in obj) {
        actual += k;
      }
      return str !== actual;
    };
    var assignHasPendingExceptions = function() {
      if (!Object.assign || !Object.preventExtensions) {
        return false;
      }
      var thrower = Object.preventExtensions({ 1: 2 });
      try {
        Object.assign(thrower, "xy");
      } catch (e) {
        return thrower[1] === "y";
      }
      return false;
    };
    module.exports = function getPolyfill() {
      if (!Object.assign) {
        return implementation;
      }
      if (lacksProperEnumerationOrder()) {
        return implementation;
      }
      if (assignHasPendingExceptions()) {
        return implementation;
      }
      return Object.assign;
    };
  }
});

// node_modules/object-is/implementation.js
var require_implementation4 = __commonJS({
  "node_modules/object-is/implementation.js"(exports, module) {
    "use strict";
    var numberIsNaN = function(value) {
      return value !== value;
    };
    module.exports = function is(a, b) {
      if (a === 0 && b === 0) {
        return 1 / a === 1 / b;
      }
      if (a === b) {
        return true;
      }
      if (numberIsNaN(a) && numberIsNaN(b)) {
        return true;
      }
      return false;
    };
  }
});

// node_modules/object-is/polyfill.js
var require_polyfill2 = __commonJS({
  "node_modules/object-is/polyfill.js"(exports, module) {
    "use strict";
    var implementation = require_implementation4();
    module.exports = function getPolyfill() {
      return typeof Object.is === "function" ? Object.is : implementation;
    };
  }
});

// node_modules/define-properties/index.js
var require_define_properties = __commonJS({
  "node_modules/define-properties/index.js"(exports, module) {
    "use strict";
    var keys = require_object_keys();
    var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
    var toStr = Object.prototype.toString;
    var concat = Array.prototype.concat;
    var defineDataProperty = require_define_data_property();
    var isFunction = function(fn) {
      return typeof fn === "function" && toStr.call(fn) === "[object Function]";
    };
    var supportsDescriptors = require_has_property_descriptors()();
    var defineProperty = function(object, name, value, predicate) {
      if (name in object) {
        if (predicate === true) {
          if (object[name] === value) {
            return;
          }
        } else if (!isFunction(predicate) || !predicate()) {
          return;
        }
      }
      if (supportsDescriptors) {
        defineDataProperty(object, name, value, true);
      } else {
        defineDataProperty(object, name, value);
      }
    };
    var defineProperties = function(object, map) {
      var predicates = arguments.length > 2 ? arguments[2] : {};
      var props = keys(map);
      if (hasSymbols) {
        props = concat.call(props, Object.getOwnPropertySymbols(map));
      }
      for (var i = 0; i < props.length; i += 1) {
        defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
      }
    };
    defineProperties.supportsDescriptors = !!supportsDescriptors;
    module.exports = defineProperties;
  }
});

// node_modules/object-is/shim.js
var require_shim = __commonJS({
  "node_modules/object-is/shim.js"(exports, module) {
    "use strict";
    var getPolyfill = require_polyfill2();
    var define = require_define_properties();
    module.exports = function shimObjectIs() {
      var polyfill = getPolyfill();
      define(Object, { is: polyfill }, {
        is: function testObjectIs() {
          return Object.is !== polyfill;
        }
      });
      return polyfill;
    };
  }
});

// node_modules/object-is/index.js
var require_object_is = __commonJS({
  "node_modules/object-is/index.js"(exports, module) {
    "use strict";
    var define = require_define_properties();
    var callBind = require_call_bind();
    var implementation = require_implementation4();
    var getPolyfill = require_polyfill2();
    var shim = require_shim();
    var polyfill = callBind(getPolyfill(), Object);
    define(polyfill, {
      getPolyfill,
      implementation,
      shim
    });
    module.exports = polyfill;
  }
});

// node_modules/is-nan/implementation.js
var require_implementation5 = __commonJS({
  "node_modules/is-nan/implementation.js"(exports, module) {
    "use strict";
    module.exports = function isNaN2(value) {
      return value !== value;
    };
  }
});

// node_modules/is-nan/polyfill.js
var require_polyfill3 = __commonJS({
  "node_modules/is-nan/polyfill.js"(exports, module) {
    "use strict";
    var implementation = require_implementation5();
    module.exports = function getPolyfill() {
      if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a")) {
        return Number.isNaN;
      }
      return implementation;
    };
  }
});

// node_modules/is-nan/shim.js
var require_shim2 = __commonJS({
  "node_modules/is-nan/shim.js"(exports, module) {
    "use strict";
    var define = require_define_properties();
    var getPolyfill = require_polyfill3();
    module.exports = function shimNumberIsNaN() {
      var polyfill = getPolyfill();
      define(Number, { isNaN: polyfill }, {
        isNaN: function testIsNaN() {
          return Number.isNaN !== polyfill;
        }
      });
      return polyfill;
    };
  }
});

// node_modules/is-nan/index.js
var require_is_nan = __commonJS({
  "node_modules/is-nan/index.js"(exports, module) {
    "use strict";
    var callBind = require_call_bind();
    var define = require_define_properties();
    var implementation = require_implementation5();
    var getPolyfill = require_polyfill3();
    var shim = require_shim2();
    var polyfill = callBind(getPolyfill(), Number);
    define(polyfill, {
      getPolyfill,
      implementation,
      shim
    });
    module.exports = polyfill;
  }
});

// node_modules/assert/build/internal/util/comparisons.js
var require_comparisons = __commonJS({
  "node_modules/assert/build/internal/util/comparisons.js"(exports, module) {
    "use strict";
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    function _iterableToArrayLimit(r, l) {
      var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (null != t) {
        var e, n, i, u, a = [], f = true, o = false;
        try {
          if (i = (t = t.call(r)).next, 0 === l) {
            if (Object(t) !== t)
              return;
            f = false;
          } else
            for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
              ;
        } catch (r2) {
          o = true, n = r2;
        } finally {
          try {
            if (!f && null != t.return && (u = t.return(), Object(u) !== u))
              return;
          } finally {
            if (o)
              throw n;
          }
        }
        return a;
      }
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    var regexFlagsSupported = /a/g.flags !== void 0;
    var arrayFromSet = function arrayFromSet2(set) {
      var array = [];
      set.forEach(function(value) {
        return array.push(value);
      });
      return array;
    };
    var arrayFromMap = function arrayFromMap2(map) {
      var array = [];
      map.forEach(function(value, key) {
        return array.push([key, value]);
      });
      return array;
    };
    var objectIs = Object.is ? Object.is : require_object_is();
    var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
      return [];
    };
    var numberIsNaN = Number.isNaN ? Number.isNaN : require_is_nan();
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
    var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
    var objectToString = uncurryThis(Object.prototype.toString);
    var _require$types = require_util().types;
    var isAnyArrayBuffer = _require$types.isAnyArrayBuffer;
    var isArrayBufferView = _require$types.isArrayBufferView;
    var isDate = _require$types.isDate;
    var isMap = _require$types.isMap;
    var isRegExp = _require$types.isRegExp;
    var isSet = _require$types.isSet;
    var isNativeError = _require$types.isNativeError;
    var isBoxedPrimitive = _require$types.isBoxedPrimitive;
    var isNumberObject = _require$types.isNumberObject;
    var isStringObject = _require$types.isStringObject;
    var isBooleanObject = _require$types.isBooleanObject;
    var isBigIntObject = _require$types.isBigIntObject;
    var isSymbolObject = _require$types.isSymbolObject;
    var isFloat32Array = _require$types.isFloat32Array;
    var isFloat64Array = _require$types.isFloat64Array;
    function isNonIndex(key) {
      if (key.length === 0 || key.length > 10)
        return true;
      for (var i = 0; i < key.length; i++) {
        var code = key.charCodeAt(i);
        if (code < 48 || code > 57)
          return true;
      }
      return key.length === 10 && key >= Math.pow(2, 32);
    }
    function getOwnNonIndexProperties(value) {
      return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
    }
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
    var ONLY_ENUMERABLE = void 0;
    var kStrict = true;
    var kLoose = false;
    var kNoIterator = 0;
    var kIsArray = 1;
    var kIsSet = 2;
    var kIsMap = 3;
    function areSimilarRegExps(a, b) {
      return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
    }
    function areSimilarFloatArrays(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      for (var offset = 0; offset < a.byteLength; offset++) {
        if (a[offset] !== b[offset]) {
          return false;
        }
      }
      return true;
    }
    function areSimilarTypedArrays(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
    }
    function areEqualArrayBuffers(buf1, buf2) {
      return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
    }
    function isEqualBoxedPrimitive(val1, val2) {
      if (isNumberObject(val1)) {
        return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
      }
      if (isStringObject(val1)) {
        return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
      }
      if (isBooleanObject(val1)) {
        return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
      }
      if (isBigIntObject(val1)) {
        return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
      }
      return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
    }
    function innerDeepEqual(val1, val2, strict, memos) {
      if (val1 === val2) {
        if (val1 !== 0)
          return true;
        return strict ? objectIs(val1, val2) : true;
      }
      if (strict) {
        if (_typeof(val1) !== "object") {
          return typeof val1 === "number" && numberIsNaN(val1) && numberIsNaN(val2);
        }
        if (_typeof(val2) !== "object" || val1 === null || val2 === null) {
          return false;
        }
        if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
          return false;
        }
      } else {
        if (val1 === null || _typeof(val1) !== "object") {
          if (val2 === null || _typeof(val2) !== "object") {
            return val1 == val2;
          }
          return false;
        }
        if (val2 === null || _typeof(val2) !== "object") {
          return false;
        }
      }
      var val1Tag = objectToString(val1);
      var val2Tag = objectToString(val2);
      if (val1Tag !== val2Tag) {
        return false;
      }
      if (Array.isArray(val1)) {
        if (val1.length !== val2.length) {
          return false;
        }
        var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
        var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
        if (keys1.length !== keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
      }
      if (val1Tag === "[object Object]") {
        if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
          return false;
        }
      }
      if (isDate(val1)) {
        if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
          return false;
        }
      } else if (isRegExp(val1)) {
        if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
          return false;
        }
      } else if (isNativeError(val1) || val1 instanceof Error) {
        if (val1.message !== val2.message || val1.name !== val2.name) {
          return false;
        }
      } else if (isArrayBufferView(val1)) {
        if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
          if (!areSimilarFloatArrays(val1, val2)) {
            return false;
          }
        } else if (!areSimilarTypedArrays(val1, val2)) {
          return false;
        }
        var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
        var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
        if (_keys.length !== _keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
      } else if (isSet(val1)) {
        if (!isSet(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsSet);
      } else if (isMap(val1)) {
        if (!isMap(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsMap);
      } else if (isAnyArrayBuffer(val1)) {
        if (!areEqualArrayBuffers(val1, val2)) {
          return false;
        }
      } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
        return false;
      }
      return keyCheck(val1, val2, strict, memos, kNoIterator);
    }
    function getEnumerables(val, keys) {
      return keys.filter(function(k) {
        return propertyIsEnumerable(val, k);
      });
    }
    function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
      if (arguments.length === 5) {
        aKeys = Object.keys(val1);
        var bKeys = Object.keys(val2);
        if (aKeys.length !== bKeys.length) {
          return false;
        }
      }
      var i = 0;
      for (; i < aKeys.length; i++) {
        if (!hasOwnProperty(val2, aKeys[i])) {
          return false;
        }
      }
      if (strict && arguments.length === 5) {
        var symbolKeysA = objectGetOwnPropertySymbols(val1);
        if (symbolKeysA.length !== 0) {
          var count = 0;
          for (i = 0; i < symbolKeysA.length; i++) {
            var key = symbolKeysA[i];
            if (propertyIsEnumerable(val1, key)) {
              if (!propertyIsEnumerable(val2, key)) {
                return false;
              }
              aKeys.push(key);
              count++;
            } else if (propertyIsEnumerable(val2, key)) {
              return false;
            }
          }
          var symbolKeysB = objectGetOwnPropertySymbols(val2);
          if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
            return false;
          }
        } else {
          var _symbolKeysB = objectGetOwnPropertySymbols(val2);
          if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
            return false;
          }
        }
      }
      if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
        return true;
      }
      if (memos === void 0) {
        memos = {
          val1: /* @__PURE__ */ new Map(),
          val2: /* @__PURE__ */ new Map(),
          position: 0
        };
      } else {
        var val2MemoA = memos.val1.get(val1);
        if (val2MemoA !== void 0) {
          var val2MemoB = memos.val2.get(val2);
          if (val2MemoB !== void 0) {
            return val2MemoA === val2MemoB;
          }
        }
        memos.position++;
      }
      memos.val1.set(val1, memos.position);
      memos.val2.set(val2, memos.position);
      var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
      memos.val1.delete(val1);
      memos.val2.delete(val2);
      return areEq;
    }
    function setHasEqualElement(set, val1, strict, memo) {
      var setValues = arrayFromSet(set);
      for (var i = 0; i < setValues.length; i++) {
        var val2 = setValues[i];
        if (innerDeepEqual(val1, val2, strict, memo)) {
          set.delete(val2);
          return true;
        }
      }
      return false;
    }
    function findLooseMatchingPrimitives(prim) {
      switch (_typeof(prim)) {
        case "undefined":
          return null;
        case "object":
          return void 0;
        case "symbol":
          return false;
        case "string":
          prim = +prim;
        case "number":
          if (numberIsNaN(prim)) {
            return false;
          }
      }
      return true;
    }
    function setMightHaveLoosePrim(a, b, prim) {
      var altValue = findLooseMatchingPrimitives(prim);
      if (altValue != null)
        return altValue;
      return b.has(altValue) && !a.has(altValue);
    }
    function mapMightHaveLoosePrim(a, b, prim, item, memo) {
      var altValue = findLooseMatchingPrimitives(prim);
      if (altValue != null) {
        return altValue;
      }
      var curB = b.get(altValue);
      if (curB === void 0 && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
        return false;
      }
      return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
    }
    function setEquiv(a, b, strict, memo) {
      var set = null;
      var aValues = arrayFromSet(a);
      for (var i = 0; i < aValues.length; i++) {
        var val = aValues[i];
        if (_typeof(val) === "object" && val !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(val);
        } else if (!b.has(val)) {
          if (strict)
            return false;
          if (!setMightHaveLoosePrim(a, b, val)) {
            return false;
          }
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(val);
        }
      }
      if (set !== null) {
        var bValues = arrayFromSet(b);
        for (var _i = 0; _i < bValues.length; _i++) {
          var _val = bValues[_i];
          if (_typeof(_val) === "object" && _val !== null) {
            if (!setHasEqualElement(set, _val, strict, memo))
              return false;
          } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
            return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
      var setValues = arrayFromSet(set);
      for (var i = 0; i < setValues.length; i++) {
        var key2 = setValues[i];
        if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
          set.delete(key2);
          return true;
        }
      }
      return false;
    }
    function mapEquiv(a, b, strict, memo) {
      var set = null;
      var aEntries = arrayFromMap(a);
      for (var i = 0; i < aEntries.length; i++) {
        var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
        if (_typeof(key) === "object" && key !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(key);
        } else {
          var item2 = b.get(key);
          if (item2 === void 0 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
            if (strict)
              return false;
            if (!mapMightHaveLoosePrim(a, b, key, item1, memo))
              return false;
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(key);
          }
        }
      }
      if (set !== null) {
        var bEntries = arrayFromMap(b);
        for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
          var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), _key = _bEntries$_i[0], item = _bEntries$_i[1];
          if (_typeof(_key) === "object" && _key !== null) {
            if (!mapHasEqualEntry(set, a, _key, item, strict, memo))
              return false;
          } else if (!strict && (!a.has(_key) || !innerDeepEqual(a.get(_key), item, false, memo)) && !mapHasEqualEntry(set, a, _key, item, false, memo)) {
            return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    function objEquiv(a, b, strict, keys, memos, iterationType) {
      var i = 0;
      if (iterationType === kIsSet) {
        if (!setEquiv(a, b, strict, memos)) {
          return false;
        }
      } else if (iterationType === kIsMap) {
        if (!mapEquiv(a, b, strict, memos)) {
          return false;
        }
      } else if (iterationType === kIsArray) {
        for (; i < a.length; i++) {
          if (hasOwnProperty(a, i)) {
            if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
              return false;
            }
          } else if (hasOwnProperty(b, i)) {
            return false;
          } else {
            var keysA = Object.keys(a);
            for (; i < keysA.length; i++) {
              var key = keysA[i];
              if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
                return false;
              }
            }
            if (keysA.length !== Object.keys(b).length) {
              return false;
            }
            return true;
          }
        }
      }
      for (i = 0; i < keys.length; i++) {
        var _key2 = keys[i];
        if (!innerDeepEqual(a[_key2], b[_key2], strict, memos)) {
          return false;
        }
      }
      return true;
    }
    function isDeepEqual(val1, val2) {
      return innerDeepEqual(val1, val2, kLoose);
    }
    function isDeepStrictEqual(val1, val2) {
      return innerDeepEqual(val1, val2, kStrict);
    }
    module.exports = {
      isDeepEqual,
      isDeepStrictEqual
    };
  }
});

// node_modules/assert/build/assert.js
var require_assert = __commonJS({
  "node_modules/assert/build/assert.js"(exports, module) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return _typeof(key) === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (_typeof(input) !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object")
          return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var _require = require_errors();
    var _require$codes = _require.codes;
    var ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE;
    var ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var AssertionError = require_assertion_error();
    var _require2 = require_util();
    var inspect2 = _require2.inspect;
    var _require$types = require_util().types;
    var isPromise = _require$types.isPromise;
    var isRegExp = _require$types.isRegExp;
    var objectAssign = require_polyfill()();
    var objectIs = require_polyfill2()();
    var RegExpPrototypeTest = require_callBound()("RegExp.prototype.test");
    var isDeepEqual;
    var isDeepStrictEqual;
    function lazyLoadComparison() {
      var comparison = require_comparisons();
      isDeepEqual = comparison.isDeepEqual;
      isDeepStrictEqual = comparison.isDeepStrictEqual;
    }
    var warned = false;
    var assert = module.exports = ok;
    var NO_EXCEPTION_SENTINEL = {};
    function innerFail(obj) {
      if (obj.message instanceof Error)
        throw obj.message;
      throw new AssertionError(obj);
    }
    function fail(actual, expected, message, operator, stackStartFn) {
      var argsLen = arguments.length;
      var internalMessage;
      if (argsLen === 0) {
        internalMessage = "Failed";
      } else if (argsLen === 1) {
        message = actual;
        actual = void 0;
      } else {
        if (warned === false) {
          warned = true;
          var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
          warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
        }
        if (argsLen === 2)
          operator = "!=";
      }
      if (message instanceof Error)
        throw message;
      var errArgs = {
        actual,
        expected,
        operator: operator === void 0 ? "fail" : operator,
        stackStartFn: stackStartFn || fail
      };
      if (message !== void 0) {
        errArgs.message = message;
      }
      var err = new AssertionError(errArgs);
      if (internalMessage) {
        err.message = internalMessage;
        err.generatedMessage = true;
      }
      throw err;
    }
    assert.fail = fail;
    assert.AssertionError = AssertionError;
    function innerOk(fn, argLen, value, message) {
      if (!value) {
        var generatedMessage = false;
        if (argLen === 0) {
          generatedMessage = true;
          message = "No value argument passed to `assert.ok()`";
        } else if (message instanceof Error) {
          throw message;
        }
        var err = new AssertionError({
          actual: value,
          expected: true,
          message,
          operator: "==",
          stackStartFn: fn
        });
        err.generatedMessage = generatedMessage;
        throw err;
      }
    }
    function ok() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      innerOk.apply(void 0, [ok, args.length].concat(args));
    }
    assert.ok = ok;
    assert.equal = function equal(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (actual != expected) {
        innerFail({
          actual,
          expected,
          message,
          operator: "==",
          stackStartFn: equal
        });
      }
    };
    assert.notEqual = function notEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (actual == expected) {
        innerFail({
          actual,
          expected,
          message,
          operator: "!=",
          stackStartFn: notEqual
        });
      }
    };
    assert.deepEqual = function deepEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0)
        lazyLoadComparison();
      if (!isDeepEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "deepEqual",
          stackStartFn: deepEqual
        });
      }
    };
    assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0)
        lazyLoadComparison();
      if (isDeepEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "notDeepEqual",
          stackStartFn: notDeepEqual
        });
      }
    };
    assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0)
        lazyLoadComparison();
      if (!isDeepStrictEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "deepStrictEqual",
          stackStartFn: deepStrictEqual
        });
      }
    };
    assert.notDeepStrictEqual = notDeepStrictEqual;
    function notDeepStrictEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0)
        lazyLoadComparison();
      if (isDeepStrictEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "notDeepStrictEqual",
          stackStartFn: notDeepStrictEqual
        });
      }
    }
    assert.strictEqual = function strictEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (!objectIs(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "strictEqual",
          stackStartFn: strictEqual
        });
      }
    };
    assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (objectIs(actual, expected)) {
        innerFail({
          actual,
          expected,
          message,
          operator: "notStrictEqual",
          stackStartFn: notStrictEqual
        });
      }
    };
    var Comparison = _createClass(function Comparison2(obj, keys, actual) {
      var _this = this;
      _classCallCheck(this, Comparison2);
      keys.forEach(function(key) {
        if (key in obj) {
          if (actual !== void 0 && typeof actual[key] === "string" && isRegExp(obj[key]) && RegExpPrototypeTest(obj[key], actual[key])) {
            _this[key] = actual[key];
          } else {
            _this[key] = obj[key];
          }
        }
      });
    });
    function compareExceptionKey(actual, expected, key, message, keys, fn) {
      if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
        if (!message) {
          var a = new Comparison(actual, keys);
          var b = new Comparison(expected, keys, actual);
          var err = new AssertionError({
            actual: a,
            expected: b,
            operator: "deepStrictEqual",
            stackStartFn: fn
          });
          err.actual = actual;
          err.expected = expected;
          err.operator = fn.name;
          throw err;
        }
        innerFail({
          actual,
          expected,
          message,
          operator: fn.name,
          stackStartFn: fn
        });
      }
    }
    function expectedException(actual, expected, msg, fn) {
      if (typeof expected !== "function") {
        if (isRegExp(expected))
          return RegExpPrototypeTest(expected, actual);
        if (arguments.length === 2) {
          throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], expected);
        }
        if (_typeof(actual) !== "object" || actual === null) {
          var err = new AssertionError({
            actual,
            expected,
            message: msg,
            operator: "deepStrictEqual",
            stackStartFn: fn
          });
          err.operator = fn.name;
          throw err;
        }
        var keys = Object.keys(expected);
        if (expected instanceof Error) {
          keys.push("name", "message");
        } else if (keys.length === 0) {
          throw new ERR_INVALID_ARG_VALUE("error", expected, "may not be an empty object");
        }
        if (isDeepEqual === void 0)
          lazyLoadComparison();
        keys.forEach(function(key) {
          if (typeof actual[key] === "string" && isRegExp(expected[key]) && RegExpPrototypeTest(expected[key], actual[key])) {
            return;
          }
          compareExceptionKey(actual, expected, key, msg, keys, fn);
        });
        return true;
      }
      if (expected.prototype !== void 0 && actual instanceof expected) {
        return true;
      }
      if (Error.isPrototypeOf(expected)) {
        return false;
      }
      return expected.call({}, actual) === true;
    }
    function getActual(fn) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", "Function", fn);
      }
      try {
        fn();
      } catch (e) {
        return e;
      }
      return NO_EXCEPTION_SENTINEL;
    }
    function checkIsPromise(obj) {
      return isPromise(obj) || obj !== null && _typeof(obj) === "object" && typeof obj.then === "function" && typeof obj.catch === "function";
    }
    function waitForActual(promiseFn) {
      return Promise.resolve().then(function() {
        var resultPromise;
        if (typeof promiseFn === "function") {
          resultPromise = promiseFn();
          if (!checkIsPromise(resultPromise)) {
            throw new ERR_INVALID_RETURN_VALUE("instance of Promise", "promiseFn", resultPromise);
          }
        } else if (checkIsPromise(promiseFn)) {
          resultPromise = promiseFn;
        } else {
          throw new ERR_INVALID_ARG_TYPE("promiseFn", ["Function", "Promise"], promiseFn);
        }
        return Promise.resolve().then(function() {
          return resultPromise;
        }).then(function() {
          return NO_EXCEPTION_SENTINEL;
        }).catch(function(e) {
          return e;
        });
      });
    }
    function expectsError(stackStartFn, actual, error, message) {
      if (typeof error === "string") {
        if (arguments.length === 4) {
          throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
        }
        if (_typeof(actual) === "object" && actual !== null) {
          if (actual.message === error) {
            throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error message "'.concat(actual.message, '" is identical to the message.'));
          }
        } else if (actual === error) {
          throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error "'.concat(actual, '" is identical to the message.'));
        }
        message = error;
        error = void 0;
      } else if (error != null && _typeof(error) !== "object" && typeof error !== "function") {
        throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
      }
      if (actual === NO_EXCEPTION_SENTINEL) {
        var details = "";
        if (error && error.name) {
          details += " (".concat(error.name, ")");
        }
        details += message ? ": ".concat(message) : ".";
        var fnType = stackStartFn.name === "rejects" ? "rejection" : "exception";
        innerFail({
          actual: void 0,
          expected: error,
          operator: stackStartFn.name,
          message: "Missing expected ".concat(fnType).concat(details),
          stackStartFn
        });
      }
      if (error && !expectedException(actual, error, message, stackStartFn)) {
        throw actual;
      }
    }
    function expectsNoError(stackStartFn, actual, error, message) {
      if (actual === NO_EXCEPTION_SENTINEL)
        return;
      if (typeof error === "string") {
        message = error;
        error = void 0;
      }
      if (!error || expectedException(actual, error)) {
        var details = message ? ": ".concat(message) : ".";
        var fnType = stackStartFn.name === "doesNotReject" ? "rejection" : "exception";
        innerFail({
          actual,
          expected: error,
          operator: stackStartFn.name,
          message: "Got unwanted ".concat(fnType).concat(details, "\n") + 'Actual message: "'.concat(actual && actual.message, '"'),
          stackStartFn
        });
      }
      throw actual;
    }
    assert.throws = function throws(promiseFn) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
    };
    assert.rejects = function rejects(promiseFn) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return waitForActual(promiseFn).then(function(result) {
        return expectsError.apply(void 0, [rejects, result].concat(args));
      });
    };
    assert.doesNotThrow = function doesNotThrow(fn) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
    };
    assert.doesNotReject = function doesNotReject(fn) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }
      return waitForActual(fn).then(function(result) {
        return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
      });
    };
    assert.ifError = function ifError(err) {
      if (err !== null && err !== void 0) {
        var message = "ifError got unwanted exception: ";
        if (_typeof(err) === "object" && typeof err.message === "string") {
          if (err.message.length === 0 && err.constructor) {
            message += err.constructor.name;
          } else {
            message += err.message;
          }
        } else {
          message += inspect2(err);
        }
        var newErr = new AssertionError({
          actual: err,
          expected: null,
          operator: "ifError",
          message,
          stackStartFn: ifError
        });
        var origStack = err.stack;
        if (typeof origStack === "string") {
          var tmp2 = origStack.split("\n");
          tmp2.shift();
          var tmp1 = newErr.stack.split("\n");
          for (var i = 0; i < tmp2.length; i++) {
            var pos = tmp1.indexOf(tmp2[i]);
            if (pos !== -1) {
              tmp1 = tmp1.slice(0, pos);
              break;
            }
          }
          newErr.stack = "".concat(tmp1.join("\n"), "\n").concat(tmp2.join("\n"));
        }
        throw newErr;
      }
    };
    function internalMatch(string, regexp, message, fn, fnName) {
      if (!isRegExp(regexp)) {
        throw new ERR_INVALID_ARG_TYPE("regexp", "RegExp", regexp);
      }
      var match = fnName === "match";
      if (typeof string !== "string" || RegExpPrototypeTest(regexp, string) !== match) {
        if (message instanceof Error) {
          throw message;
        }
        var generatedMessage = !message;
        message = message || (typeof string !== "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(_typeof(string), " (").concat(inspect2(string), ")") : (match ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(inspect2(regexp), ". Input:\n\n").concat(inspect2(string), "\n"));
        var err = new AssertionError({
          actual: string,
          expected: regexp,
          message,
          operator: fnName,
          stackStartFn: fn
        });
        err.generatedMessage = generatedMessage;
        throw err;
      }
    }
    assert.match = function match(string, regexp, message) {
      internalMatch(string, regexp, message, match, "match");
    };
    assert.doesNotMatch = function doesNotMatch(string, regexp, message) {
      internalMatch(string, regexp, message, doesNotMatch, "doesNotMatch");
    };
    function strict() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      innerOk.apply(void 0, [strict, args.length].concat(args));
    }
    assert.strict = objectAssign(strict, assert, {
      equal: assert.strictEqual,
      deepEqual: assert.deepStrictEqual,
      notEqual: assert.notStrictEqual,
      notDeepEqual: assert.notDeepStrictEqual
    });
    assert.strict.strict = assert.strict;
  }
});

// node_modules/amqplib/lib/mux.js
var require_mux = __commonJS({
  "node_modules/amqplib/lib/mux.js"(exports, module) {
    "use strict";
    var assert = require_assert();
    var schedule = typeof setImmediate === "function" ? setImmediate : process.nextTick;
    var Mux = class {
      constructor(downstream) {
        this.newStreams = [];
        this.oldStreams = [];
        this.blocked = false;
        this.scheduledRead = false;
        this.out = downstream;
        var self2 = this;
        downstream.on("drain", function() {
          self2.blocked = false;
          self2._readIncoming();
        });
      }
      // There are 2 states we can be in:
      // - waiting for outbound capacity, which will be signalled by a
      // - 'drain' event on the downstream; or,
      // - no packets to send, waiting for an inbound buffer to have
      //   packets, which will be signalled by a 'readable' event
      // If we write all packets available whenever there is outbound
      // capacity, we will either run out of outbound capacity (`#write`
      // returns false), or run out of packets (all calls to an
      // `inbound.read()` have returned null).
      _readIncoming() {
        if (this.blocked)
          return;
        var accepting = true;
        var out = this.out;
        function roundrobin(streams) {
          var s;
          while (accepting && (s = streams.shift())) {
            var chunk = s.read();
            if (chunk !== null) {
              accepting = out.write(chunk);
              streams.push(s);
            }
          }
        }
        roundrobin(this.newStreams);
        if (accepting) {
          assert.equal(0, this.newStreams.length);
          roundrobin(this.oldStreams);
        } else {
          assert(this.newStreams.length > 0, "Expect some new streams to remain");
          Array.prototype.push.apply(this.oldStreams, this.newStreams);
          this.newStreams = [];
        }
        this.blocked = !accepting;
      }
      _scheduleRead() {
        var self2 = this;
        if (!self2.scheduledRead) {
          schedule(function() {
            self2.scheduledRead = false;
            self2._readIncoming();
          });
          self2.scheduledRead = true;
        }
      }
      pipeFrom(readable) {
        var self2 = this;
        function enqueue() {
          self2.newStreams.push(readable);
          self2._scheduleRead();
        }
        function cleanup() {
          readable.removeListener("readable", enqueue);
          readable.removeListener("error", cleanup);
          readable.removeListener("end", cleanup);
          readable.removeListener("unpipeFrom", cleanupIfMe);
        }
        function cleanupIfMe(dest) {
          if (dest === self2)
            cleanup();
        }
        readable.on("unpipeFrom", cleanupIfMe);
        readable.on("end", cleanup);
        readable.on("error", cleanup);
        readable.on("readable", enqueue);
      }
      unpipeFrom(readable) {
        readable.emit("unpipeFrom", this);
      }
    };
    module.exports.Mux = Mux;
  }
});

// browser-external:stream
var require_stream = __commonJS({
  "browser-external:stream"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "stream" has been externalized for browser compatibility. Cannot access "stream.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/core-util-is/lib/util.js
var require_util2 = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
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
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require_buffer().Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/readable-stream/node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/readable-stream/node_modules/isarray/index.js"(exports, module) {
    module.exports = Array.isArray || function(arr) {
      return Object.prototype.toString.call(arr) == "[object Array]";
    };
  }
});

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

// browser-external:util
var require_util3 = __commonJS({
  "browser-external:util"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "util" has been externalized for browser compatibility. Cannot access "util.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/string_decoder/index.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/index.js"(exports) {
    var Buffer2 = require_buffer().Buffer;
    var isBufferEncoding = Buffer2.isEncoding || function(encoding) {
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
    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error("Unknown encoding: " + encoding);
      }
    }
    var StringDecoder = exports.StringDecoder = function(encoding) {
      this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
      assertEncoding(encoding);
      switch (this.encoding) {
        case "utf8":
          this.surrogateSize = 3;
          break;
        case "ucs2":
        case "utf16le":
          this.surrogateSize = 2;
          this.detectIncompleteChar = utf16DetectIncompleteChar;
          break;
        case "base64":
          this.surrogateSize = 3;
          this.detectIncompleteChar = base64DetectIncompleteChar;
          break;
        default:
          this.write = passThroughWrite;
          return;
      }
      this.charBuffer = new Buffer2(6);
      this.charReceived = 0;
      this.charLength = 0;
    };
    StringDecoder.prototype.write = function(buffer) {
      var charStr = "";
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) {
          return "";
        }
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = "";
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      var i = buffer.length >= 3 ? 3 : buffer.length;
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];
        if (i == 1 && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      if (buffer && buffer.length)
        res = this.write(buffer);
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }
    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }
    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    module.exports = Readable;
    var isArray = require_isarray();
    var Buffer2 = require_buffer().Buffer;
    Readable.ReadableState = ReadableState;
    var EE = require_events().EventEmitter;
    if (!EE.listenerCount)
      EE.listenerCount = function(emitter, type) {
        return emitter.listeners(type).length;
      };
    var Stream = require_stream();
    var util = require_util2();
    util.inherits = require_inherits_browser();
    var StringDecoder;
    var debug = require_util3();
    if (debug && debug.debuglog) {
      debug = debug.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    util.inherits(Readable, Stream);
    function ReadableState(options, stream) {
      var Duplex = require_stream_duplex();
      options = options || {};
      var hwm = options.highWaterMark;
      var defaultHwm = options.objectMode ? 16 : 16 * 1024;
      this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
      this.highWaterMark = ~~this.highWaterMark;
      this.buffer = [];
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.objectMode = !!options.objectMode;
      if (stream instanceof Duplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.ranOut = false;
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      var Duplex = require_stream_duplex();
      if (!(this instanceof Readable))
        return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      Stream.call(this);
    }
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      if (util.isString(chunk) && !state.objectMode) {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = new Buffer2(chunk, encoding);
          encoding = "";
        }
      }
      return readableAddChunk(this, state, chunk, encoding, false);
    };
    Readable.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, "", true);
    };
    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
      var er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit("error", er);
      } else if (util.isNullOrUndefined(chunk)) {
        state.reading = false;
        if (!state.ended)
          onEofChunk(stream, state);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (state.ended && !addToFront) {
          var e = new Error("stream.push() after EOF");
          stream.emit("error", e);
        } else if (state.endEmitted && addToFront) {
          var e = new Error("stream.unshift() after end event");
          stream.emit("error", e);
        } else {
          if (state.decoder && !addToFront && !encoding)
            chunk = state.decoder.write(chunk);
          if (!addToFront)
            state.reading = false;
          if (state.flowing && state.length === 0 && !state.sync) {
            stream.emit("data", chunk);
            stream.read(0);
          } else {
            state.length += state.objectMode ? 1 : chunk.length;
            if (addToFront)
              state.buffer.unshift(chunk);
            else
              state.buffer.push(chunk);
            if (state.needReadable)
              emitReadable(stream);
          }
          maybeReadMore(stream, state);
        }
      } else if (!addToFront) {
        state.reading = false;
      }
      return needMoreData(state);
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function roundUpToNextPowerOf2(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        for (var p = 1; p < 32; p <<= 1)
          n |= n >> p;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return n === 0 ? 0 : 1;
      if (isNaN(n) || util.isNull(n)) {
        if (state.flowing && state.buffer.length)
          return state.buffer[0].length;
        else
          return state.length;
      }
      if (n <= 0)
        return 0;
      if (n > state.highWaterMark)
        state.highWaterMark = roundUpToNextPowerOf2(n);
      if (n > state.length) {
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        } else
          return state.length;
      }
      return n;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      var state = this._readableState;
      var nOrig = n;
      if (!util.isNumber(n) || n > 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
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
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      }
      if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
      }
      if (doRead && !state.reading)
        n = howMuchToRead(nOrig, state);
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (util.isNull(ret)) {
        state.needReadable = true;
        n = 0;
      }
      state.length -= n;
      if (state.length === 0 && !state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended && state.length === 0)
        endReadable(this);
      if (!util.isNull(ret))
        this.emit("data", ret);
      return ret;
    };
    function chunkInvalid(state, chunk) {
      var er = null;
      if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function onEofChunk(stream, state) {
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync)
          process.nextTick(function() {
            emitReadable_(stream);
          });
        else
          emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(function() {
          maybeReadMore_(stream, state);
        });
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : cleanup;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable) {
        debug("onunpipe");
        if (readable === src) {
          cleanup();
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", cleanup);
        src.removeListener("data", ondata);
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        if (false === ret) {
          debug(
            "false write response, pause",
            src._readableState.awaitDrain
          );
          src._readableState.awaitDrain++;
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EE.listenerCount(dest, "error") === 0)
          dest.emit("error", er);
      }
      if (!dest._events || !dest._events.error)
        dest.on("error", onerror);
      else if (isArray(dest._events.error))
        dest._events.error.unshift(onerror);
      else
        dest._events.error = [onerror, dest._events.error];
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
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EE.listenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++)
          dests[i].emit("unpipe", this);
        return this;
      }
      var i = indexOf(state.pipes, dest);
      if (i === -1)
        return this;
      state.pipes.splice(i, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data" && false !== this._readableState.flowing) {
        this.resume();
      }
      if (ev === "readable" && this.readable) {
        var state = this._readableState;
        if (!state.readableListening) {
          state.readableListening = true;
          state.emittedReadable = false;
          state.needReadable = true;
          if (!state.reading) {
            var self2 = this;
            process.nextTick(function() {
              debug("readable nexttick read 0");
              self2.read(0);
            });
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        if (!state.reading) {
          debug("resume read 0");
          this.read(0);
        }
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(function() {
          resume_(stream, state);
        });
      }
    }
    function resume_(stream, state) {
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      if (state.flowing) {
        do {
          var chunk = stream.read();
        } while (null !== chunk && state.flowing);
      }
    }
    Readable.prototype.wrap = function(stream) {
      var state = this._readableState;
      var paused = false;
      var self2 = this;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self2.push(chunk);
        }
        self2.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (!chunk || !state.objectMode && !chunk.length)
          return;
        var ret = self2.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
          this[i] = /* @__PURE__ */ function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      var events = ["error", "close", "destroy", "pause", "resume"];
      forEach(events, function(ev) {
        stream.on(ev, self2.emit.bind(self2, ev));
      });
      self2._read = function(n) {
        debug("wrapped _read", n);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return self2;
    };
    Readable._fromList = fromList;
    function fromList(n, state) {
      var list = state.buffer;
      var length = state.length;
      var stringMode = !!state.decoder;
      var objectMode = !!state.objectMode;
      var ret;
      if (list.length === 0)
        return null;
      if (length === 0)
        ret = null;
      else if (objectMode)
        ret = list.shift();
      else if (!n || n >= length) {
        if (stringMode)
          ret = list.join("");
        else
          ret = Buffer2.concat(list, length);
        list.length = 0;
      } else {
        if (n < list[0].length) {
          var buf = list[0];
          ret = buf.slice(0, n);
          list[0] = buf.slice(n);
        } else if (n === list[0].length) {
          ret = list.shift();
        } else {
          if (stringMode)
            ret = "";
          else
            ret = new Buffer2(n);
          var c = 0;
          for (var i = 0, l = list.length; i < l && c < n; i++) {
            var buf = list[0];
            var cpy = Math.min(n - c, buf.length);
            if (stringMode)
              ret += buf.slice(0, cpy);
            else
              buf.copy(ret, c, 0, cpy);
            if (cpy < buf.length)
              list[0] = buf.slice(cpy);
            else
              list.shift();
            c += cpy;
          }
        }
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error("endReadable called on non-empty stream");
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(function() {
          if (!state.endEmitted && state.length === 0) {
            state.endEmitted = true;
            stream.readable = false;
            stream.emit("end");
          }
        });
      }
    }
    function forEach(xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    module.exports = Writable;
    var Buffer2 = require_buffer().Buffer;
    Writable.WritableState = WritableState;
    var util = require_util2();
    util.inherits = require_inherits_browser();
    var Stream = require_stream();
    util.inherits(Writable, Stream);
    function WriteReq(chunk, encoding, cb) {
      this.chunk = chunk;
      this.encoding = encoding;
      this.callback = cb;
    }
    function WritableState(options, stream) {
      var Duplex = require_stream_duplex();
      options = options || {};
      var hwm = options.highWaterMark;
      var defaultHwm = options.objectMode ? 16 : 16 * 1024;
      this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
      this.objectMode = !!options.objectMode;
      if (stream instanceof Duplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = ~~this.highWaterMark;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.buffer = [];
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
    }
    function Writable(options) {
      var Duplex = require_stream_duplex();
      if (!(this instanceof Writable) && !(this instanceof Duplex))
        return new Writable(options);
      this._writableState = new WritableState(options, this);
      this.writable = true;
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe. Not readable."));
    };
    function writeAfterEnd(stream, state, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      process.nextTick(function() {
        cb(er);
      });
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
        var er = new TypeError("Invalid non-string/buffer chunk");
        stream.emit("error", er);
        process.nextTick(function() {
          cb(er);
        });
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      if (util.isFunction(encoding)) {
        cb = encoding;
        encoding = null;
      }
      if (util.isBuffer(chunk))
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (!util.isFunction(cb))
        cb = function() {
        };
      if (state.ended)
        writeAfterEnd(this, state, cb);
      else if (validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.buffer.length)
          clearBuffer(this, state);
      }
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && util.isString(chunk)) {
        chunk = new Buffer2(chunk, encoding);
      }
      return chunk;
    }
    function writeOrBuffer(stream, state, chunk, encoding, cb) {
      chunk = decodeChunk(state, chunk, encoding);
      if (util.isBuffer(chunk))
        encoding = "buffer";
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked)
        state.buffer.push(new WriteReq(chunk, encoding, cb));
      else
        doWrite(stream, state, false, len, chunk, encoding, cb);
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      if (sync)
        process.nextTick(function() {
          state.pendingcb--;
          cb(er);
        });
      else {
        state.pendingcb--;
        cb(er);
      }
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(stream, state);
        if (!finished && !state.corked && !state.bufferProcessing && state.buffer.length) {
          clearBuffer(stream, state);
        }
        if (sync) {
          process.nextTick(function() {
            afterWrite(stream, state, finished, cb);
          });
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      if (stream._writev && state.buffer.length > 1) {
        var cbs = [];
        for (var c = 0; c < state.buffer.length; c++)
          cbs.push(state.buffer[c].callback);
        state.pendingcb++;
        doWrite(stream, state, true, state.length, state.buffer, "", function(err) {
          for (var i = 0; i < cbs.length; i++) {
            state.pendingcb--;
            cbs[i](err);
          }
        });
        state.buffer = [];
      } else {
        for (var c = 0; c < state.buffer.length; c++) {
          var entry = state.buffer[c];
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          if (state.writing) {
            c++;
            break;
          }
        }
        if (c < state.buffer.length)
          state.buffer = state.buffer.slice(c);
        else
          state.buffer.length = 0;
      }
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (util.isFunction(chunk)) {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (util.isFunction(encoding)) {
        cb = encoding;
        encoding = null;
      }
      if (!util.isNullOrUndefined(chunk))
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
    function needFinish(stream, state) {
      return state.ending && state.length === 0 && !state.finished && !state.writing;
    }
    function prefinish(stream, state) {
      if (!state.prefinished) {
        state.prefinished = true;
        stream.emit("prefinish");
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(stream, state);
      if (need) {
        if (state.pendingcb === 0) {
          prefinish(stream, state);
          state.finished = true;
          stream.emit("finish");
        } else
          prefinish(stream, state);
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
    }
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    module.exports = Duplex;
    var objectKeys = Object.keys || function(obj) {
      var keys = [];
      for (var key in obj)
        keys.push(key);
      return keys;
    };
    var util = require_util2();
    util.inherits = require_inherits_browser();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    forEach(objectKeys(Writable.prototype), function(method) {
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    });
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once("end", onend);
    }
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      process.nextTick(this.end.bind(this));
    }
    function forEach(xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }
  }
});

// node_modules/readable-stream/duplex.js
var require_duplex = __commonJS({
  "node_modules/readable-stream/duplex.js"(exports, module) {
    module.exports = require_stream_duplex();
  }
});

// node_modules/amqplib/lib/heartbeat.js
var require_heartbeat = __commonJS({
  "node_modules/amqplib/lib/heartbeat.js"(exports, module) {
    "use strict";
    var EventEmitter = require_events();
    module.exports.UNITS_TO_MS = 1e3;
    var Heart = class extends EventEmitter {
      constructor(interval, checkSend, checkRecv) {
        super();
        this.interval = interval;
        var intervalMs = interval * module.exports.UNITS_TO_MS;
        var beat = this.emit.bind(this, "beat");
        var timeout = this.emit.bind(this, "timeout");
        this.sendTimer = setInterval(
          this.runHeartbeat.bind(this, checkSend, beat),
          intervalMs / 2
        );
        var recvMissed = 0;
        function missedTwo() {
          if (!checkRecv())
            return ++recvMissed < 2;
          else {
            recvMissed = 0;
            return true;
          }
        }
        this.recvTimer = setInterval(
          this.runHeartbeat.bind(this, missedTwo, timeout),
          intervalMs
        );
      }
      clear() {
        clearInterval(this.sendTimer);
        clearInterval(this.recvTimer);
      }
      runHeartbeat(check, fail) {
        if (!check())
          fail();
      }
    };
    module.exports.Heart = Heart;
  }
});

// node_modules/amqplib/lib/format.js
var require_format = __commonJS({
  "node_modules/amqplib/lib/format.js"(exports, module) {
    "use strict";
    var defs = require_defs();
    var format = require_util().format;
    var HEARTBEAT = require_frame().HEARTBEAT;
    module.exports.closeMessage = function(close) {
      var code = close.fields.replyCode;
      return format(
        '%d (%s) with message "%s"',
        code,
        defs.constant_strs[code],
        close.fields.replyText
      );
    };
    module.exports.methodName = function(id) {
      return defs.info(id).name;
    };
    module.exports.inspect = function(frame, showFields) {
      if (frame === HEARTBEAT) {
        return "<Heartbeat>";
      } else if (!frame.id) {
        return format(
          "<Content channel:%d size:%d>",
          frame.channel,
          frame.size
        );
      } else {
        var info = defs.info(frame.id);
        return format(
          "<%s channel:%d%s>",
          info.name,
          frame.channel,
          showFields ? " " + JSON.stringify(frame.fields, void 0, 2) : ""
        );
      }
    };
  }
});

// node_modules/amqplib/lib/bitset.js
var require_bitset = __commonJS({
  "node_modules/amqplib/lib/bitset.js"(exports, module) {
    "use strict";
    var BitSet = class {
      /**
       * @param {number} [size]
       */
      constructor(size) {
        if (size) {
          const numWords = Math.ceil(size / 32);
          this.words = new Array(numWords);
        } else {
          this.words = [];
        }
        this.wordsInUse = 0;
      }
      /**
       * @param {number} numWords
       */
      ensureSize(numWords) {
        const wordsPresent = this.words.length;
        if (wordsPresent < numWords) {
          this.words = this.words.concat(new Array(numWords - wordsPresent));
        }
      }
      /**
       * @param {number} bitIndex
       */
      set(bitIndex) {
        const w = wordIndex(bitIndex);
        if (w >= this.wordsInUse) {
          this.ensureSize(w + 1);
          this.wordsInUse = w + 1;
        }
        const bit = 1 << bitIndex;
        this.words[w] |= bit;
      }
      /**
       * @param {number} bitIndex
       */
      clear(bitIndex) {
        const w = wordIndex(bitIndex);
        if (w >= this.wordsInUse)
          return;
        const mask = ~(1 << bitIndex);
        this.words[w] &= mask;
      }
      /**
       * @param {number} bitIndex
       */
      get(bitIndex) {
        const w = wordIndex(bitIndex);
        if (w >= this.wordsInUse)
          return false;
        const bit = 1 << bitIndex;
        return !!(this.words[w] & bit);
      }
      /**
       * Give the next bit that is set on or after fromIndex, or -1 if no such bit
       *
       * @param {number} fromIndex
       */
      nextSetBit(fromIndex) {
        let w = wordIndex(fromIndex);
        if (w >= this.wordsInUse)
          return -1;
        let word = this.words[w] & 4294967295 << fromIndex;
        while (true) {
          if (word)
            return w * 32 + trailingZeros(word);
          w++;
          if (w === this.wordsInUse)
            return -1;
          word = this.words[w];
        }
      }
      /**
       * @param {number} fromIndex
       */
      nextClearBit(fromIndex) {
        let w = wordIndex(fromIndex);
        if (w >= this.wordsInUse)
          return fromIndex;
        let word = ~this.words[w] & 4294967295 << fromIndex;
        while (true) {
          if (word)
            return w * 32 + trailingZeros(word);
          w++;
          if (w == this.wordsInUse)
            return w * 32;
          word = ~this.words[w];
        }
      }
    };
    function wordIndex(bitIndex) {
      return Math.floor(bitIndex / 32);
    }
    function trailingZeros(i) {
      if (i === 0)
        return 32;
      let y, n = 31;
      y = i << 16;
      if (y != 0) {
        n = n - 16;
        i = y;
      }
      y = i << 8;
      if (y != 0) {
        n = n - 8;
        i = y;
      }
      y = i << 4;
      if (y != 0) {
        n = n - 4;
        i = y;
      }
      y = i << 2;
      if (y != 0) {
        n = n - 2;
        i = y;
      }
      return n - (i << 1 >>> 31);
    }
    module.exports.BitSet = BitSet;
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    module.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = require_util2();
    util.inherits = require_inherits_browser();
    util.inherits(Transform, Duplex);
    function TransformState(options, stream) {
      this.afterTransform = function(er, data) {
        return afterTransform(stream, er, data);
      };
      this.needTransform = false;
      this.transforming = false;
      this.writecb = null;
      this.writechunk = null;
    }
    function afterTransform(stream, er, data) {
      var ts = stream._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb)
        return stream.emit("error", new Error("no writecb in Transform class"));
      ts.writechunk = null;
      ts.writecb = null;
      if (!util.isNullOrUndefined(data))
        stream.push(data);
      if (cb)
        cb(er);
      var rs = stream._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        stream._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = new TransformState(options, this);
      var stream = this;
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      this.once("prefinish", function() {
        if (util.isFunction(this._flush))
          this._flush(function(er) {
            done(stream, er);
          });
        else
          done(stream);
      });
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    function done(stream, er) {
      if (er)
        return stream.emit("error", er);
      var ws = stream._writableState;
      var ts = stream._transformState;
      if (ws.length)
        throw new Error("calling transform done when ws.length != 0");
      if (ts.transforming)
        throw new Error("calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = require_util2();
    util.inherits = require_inherits_browser();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/passthrough.js
var require_passthrough = __commonJS({
  "node_modules/readable-stream/passthrough.js"(exports, module) {
    module.exports = require_stream_passthrough();
  }
});

// node_modules/amqplib/lib/error.js
var require_error = __commonJS({
  "node_modules/amqplib/lib/error.js"(exports, module) {
    var inherits = require_util().inherits;
    function trimStack(stack, num) {
      return stack && stack.split("\n").slice(num).join("\n");
    }
    function IllegalOperationError(msg, stack) {
      var tmp = new Error();
      this.message = msg;
      this.stack = this.toString() + "\n" + trimStack(tmp.stack, 2);
      this.stackAtStateChange = stack;
    }
    inherits(IllegalOperationError, Error);
    IllegalOperationError.prototype.name = "IllegalOperationError";
    function stackCapture(reason) {
      var e = new Error();
      return "Stack capture: " + reason + "\n" + trimStack(e.stack, 2);
    }
    module.exports.IllegalOperationError = IllegalOperationError;
    module.exports.stackCapture = stackCapture;
  }
});

// node_modules/amqplib/lib/connection.js
var require_connection = __commonJS({
  "node_modules/amqplib/lib/connection.js"(exports, module) {
    "use strict";
    var defs = require_defs();
    var constants = defs.constants;
    var frame = require_frame();
    var HEARTBEAT = frame.HEARTBEAT;
    var Mux = require_mux().Mux;
    var Duplex = require_stream().Duplex || require_duplex();
    var EventEmitter = require_events();
    var Heart = require_heartbeat().Heart;
    var methodName = require_format().methodName;
    var closeMsg = require_format().closeMessage;
    var inspect2 = require_format().inspect;
    var BitSet = require_bitset().BitSet;
    var fmt = require_util().format;
    var PassThrough = require_stream().PassThrough || require_passthrough();
    var IllegalOperationError = require_error().IllegalOperationError;
    var stackCapture = require_error().stackCapture;
    var DEFAULT_WRITE_HWM = 1024;
    var SINGLE_CHUNK_THRESHOLD = 2048;
    var Connection = class extends EventEmitter {
      constructor(underlying) {
        super();
        var stream = this.stream = wrapStream(underlying);
        this.muxer = new Mux(stream);
        this.rest = Buffer.alloc(0);
        this.frameMax = constants.FRAME_MIN_SIZE;
        this.sentSinceLastCheck = false;
        this.recvSinceLastCheck = false;
        this.expectSocketClose = false;
        this.freeChannels = new BitSet();
        this.channels = [{
          channel: { accept: channel0(this) },
          buffer: underlying
        }];
      }
      // This changed between versions, as did the codec, methods, etc. AMQP
      // 0-9-1 is fairly similar to 0.8, but better, and nothing implements
      // 0.8 that doesn't implement 0-9-1. In other words, it doesn't make
      // much sense to generalise here.
      sendProtocolHeader() {
        this.sendBytes(frame.PROTOCOL_HEADER);
      }
      /*
          The frighteningly complicated opening protocol (spec section 2.2.4):
      
             Client -> Server
      
               protocol header ->
                 <- start
               start-ok ->
             .. next two zero or more times ..
                 <- secure
               secure-ok ->
                 <- tune
               tune-ok ->
               open ->
                 <- open-ok
      
        If I'm only supporting SASL's PLAIN mechanism (which I am for the time
        being), it gets a bit easier since the server won't in general send
        back a `secure`, it'll just send `tune` after the `start-ok`.
        (SASL PLAIN: http://tools.ietf.org/html/rfc4616)
      
        */
      open(allFields, openCallback0) {
        var self2 = this;
        var openCallback = openCallback0 || function() {
        };
        var tunedOptions = Object.create(allFields);
        function wait(k) {
          self2.step(function(err, frame2) {
            if (err !== null)
              bail(err);
            else if (frame2.channel !== 0) {
              bail(new Error(
                fmt(
                  "Frame on channel != 0 during handshake: %s",
                  inspect2(frame2, false)
                )
              ));
            } else
              k(frame2);
          });
        }
        function expect(Method, k) {
          wait(function(frame2) {
            if (frame2.id === Method)
              k(frame2);
            else {
              bail(new Error(
                fmt(
                  "Expected %s; got %s",
                  methodName(Method),
                  inspect2(frame2, false)
                )
              ));
            }
          });
        }
        function bail(err) {
          openCallback(err);
        }
        function send(Method) {
          self2.sendMethod(0, Method, tunedOptions);
        }
        function negotiate(server, desired) {
          if (server === 0 || desired === 0) {
            return Math.max(server, desired);
          } else {
            return Math.min(server, desired);
          }
        }
        function onStart(start) {
          var mechanisms = start.fields.mechanisms.toString().split(" ");
          if (mechanisms.indexOf(allFields.mechanism) < 0) {
            bail(new Error(fmt(
              "SASL mechanism %s is not provided by the server",
              allFields.mechanism
            )));
            return;
          }
          self2.serverProperties = start.fields.serverProperties;
          try {
            send(defs.ConnectionStartOk);
          } catch (err) {
            bail(err);
            return;
          }
          wait(afterStartOk);
        }
        function afterStartOk(reply) {
          switch (reply.id) {
            case defs.ConnectionSecure:
              bail(new Error(
                "Wasn't expecting to have to go through secure"
              ));
              break;
            case defs.ConnectionClose:
              bail(new Error(fmt(
                "Handshake terminated by server: %s",
                closeMsg(reply)
              )));
              break;
            case defs.ConnectionTune:
              var fields = reply.fields;
              tunedOptions.frameMax = negotiate(fields.frameMax, allFields.frameMax);
              tunedOptions.channelMax = negotiate(fields.channelMax, allFields.channelMax);
              tunedOptions.heartbeat = negotiate(fields.heartbeat, allFields.heartbeat);
              try {
                send(defs.ConnectionTuneOk);
                send(defs.ConnectionOpen);
              } catch (err) {
                bail(err);
                return;
              }
              expect(defs.ConnectionOpenOk, onOpenOk);
              break;
            default:
              bail(new Error(
                fmt(
                  "Expected connection.secure, connection.close, or connection.tune during handshake; got %s",
                  inspect2(reply, false)
                )
              ));
              break;
          }
        }
        function onOpenOk(openOk) {
          self2.channelMax = tunedOptions.channelMax || 65535;
          self2.frameMax = tunedOptions.frameMax || 4294967295;
          self2.heartbeat = tunedOptions.heartbeat;
          self2.heartbeater = self2.startHeartbeater();
          self2.accept = mainAccept;
          succeed(openOk);
        }
        function endWhileOpening(err) {
          bail(err || new Error("Socket closed abruptly during opening handshake"));
        }
        this.stream.on("end", endWhileOpening);
        this.stream.on("error", endWhileOpening);
        function succeed(ok) {
          self2.stream.removeListener("end", endWhileOpening);
          self2.stream.removeListener("error", endWhileOpening);
          self2.stream.on("error", self2.onSocketError.bind(self2));
          self2.stream.on("end", self2.onSocketError.bind(
            self2,
            new Error("Unexpected close")
          ));
          self2.on("frameError", self2.onSocketError.bind(self2));
          self2.acceptLoop();
          openCallback(null, ok);
        }
        this.sendProtocolHeader();
        expect(defs.ConnectionStart, onStart);
      }
      // Closing things: AMQP has a closing handshake that applies to
      // closing both connects and channels. As the initiating party, I send
      // Close, then ignore all frames until I see either CloseOK --
      // which signifies that the other party has seen the Close and shut
      // the connection or channel down, so it's fine to free resources; or
      // Close, which means the other party also wanted to close the
      // whatever, and I should send CloseOk so it can free resources,
      // then go back to waiting for the CloseOk. If I receive a Close
      // out of the blue, I should throw away any unsent frames (they will
      // be ignored anyway) and send CloseOk, then clean up resources. In
      // general, Close out of the blue signals an error (or a forced
      // closure, which may as well be an error).
      //
      //  RUNNING [1] --- send Close ---> Closing [2] ---> recv Close --+
      //     |                               |                         [3]
      //     |                               +------ send CloseOk ------+
      //  recv Close                   recv CloseOk
      //     |                               |
      //     V                               V
      //  Ended [4] ---- send CloseOk ---> Closed [5]
      //
      // [1] All frames accepted; getting a Close frame from the server
      // moves to Ended; client may initiate a close by sending Close
      // itself.
      // [2] Client has initiated a close; only CloseOk or (simulataneously
      // sent) Close is accepted.
      // [3] Simultaneous close
      // [4] Server won't send any more frames; accept no more frames, send
      // CloseOk.
      // [5] Fully closed, client will send no more, server will send no
      // more. Signal 'close' or 'error'.
      //
      // There are two signalling mechanisms used in the API. The first is
      // that calling `close` will return a promise, that will either
      // resolve once the connection or channel is cleanly shut down, or
      // will reject if the shutdown times out.
      //
      // The second is the 'close' and 'error' events. These are
      // emitted as above. The events will fire *before* promises are
      // resolved.
      // Close the connection without even giving a reason. Typical.
      close(closeCallback) {
        var k = closeCallback && function() {
          closeCallback(null);
        };
        this.closeBecause("Cheers, thanks", constants.REPLY_SUCCESS, k);
      }
      // Close with a reason and a 'code'. I'm pretty sure RabbitMQ totally
      // ignores these; maybe it logs them. The continuation will be invoked
      // when the CloseOk has been received, and before the 'close' event.
      closeBecause(reason, code, k) {
        this.sendMethod(0, defs.ConnectionClose, {
          replyText: reason,
          replyCode: code,
          methodId: 0,
          classId: 0
        });
        var s = stackCapture("closeBecause called: " + reason);
        this.toClosing(s, k);
      }
      closeWithError(reason, code, error) {
        this.emit("error", error);
        this.closeBecause(reason, code);
      }
      onSocketError(err) {
        if (!this.expectSocketClose) {
          this.expectSocketClose = true;
          this.emit("error", err);
          var s = stackCapture("Socket error");
          this.toClosed(s, err);
        }
      }
      // A close has been initiated. Repeat: a close has been initiated.
      // This means we should not send more frames, anyway they will be
      // ignored. We also have to shut down all the channels.
      toClosing(capturedStack, k) {
        var send = this.sendMethod.bind(this);
        this.accept = function(f) {
          if (f.id === defs.ConnectionCloseOk) {
            if (k)
              k();
            var s = stackCapture("ConnectionCloseOk received");
            this.toClosed(s, void 0);
          } else if (f.id === defs.ConnectionClose) {
            send(0, defs.ConnectionCloseOk, {});
          }
        };
        invalidateSend(this, "Connection closing", capturedStack);
      }
      _closeChannels(capturedStack) {
        for (var i = 1; i < this.channels.length; i++) {
          var ch = this.channels[i];
          if (ch !== null) {
            ch.channel.toClosed(capturedStack);
          }
        }
      }
      // A close has been confirmed. Cease all communication.
      toClosed(capturedStack, maybeErr) {
        this._closeChannels(capturedStack);
        var info = fmt(
          "Connection closed (%s)",
          maybeErr ? maybeErr.toString() : "by client"
        );
        invalidateSend(this, info, capturedStack);
        this.accept = invalidOp(info, capturedStack);
        this.close = function(cb) {
          cb && cb(new IllegalOperationError(info, capturedStack));
        };
        if (this.heartbeater)
          this.heartbeater.clear();
        this.expectSocketClose = true;
        this.stream.end();
        this.emit("close", maybeErr);
      }
      _updateSecret(newSecret, reason, cb) {
        this.sendMethod(0, defs.ConnectionUpdateSecret, {
          newSecret,
          reason
        });
        this.once("update-secret-ok", cb);
      }
      // ===
      startHeartbeater() {
        if (this.heartbeat === 0)
          return null;
        else {
          var self2 = this;
          var hb = new Heart(
            this.heartbeat,
            this.checkSend.bind(this),
            this.checkRecv.bind(this)
          );
          hb.on("timeout", function() {
            var hberr = new Error("Heartbeat timeout");
            self2.emit("error", hberr);
            var s = stackCapture("Heartbeat timeout");
            self2.toClosed(s, hberr);
          });
          hb.on("beat", function() {
            self2.sendHeartbeat();
          });
          return hb;
        }
      }
      // I use an array to keep track of the channels, rather than an
      // object. The channel identifiers are numbers, and allocated by the
      // connection. If I try to allocate low numbers when they are
      // available (which I do, by looking from the start of the bitset),
      // this ought to keep the array small, and out of 'sparse array
      // storage'. I also set entries to null, rather than deleting them, in
      // the expectation that the next channel allocation will fill the slot
      // again rather than growing the array. See
      // http://www.html5rocks.com/en/tutorials/speed/v8/
      freshChannel(channel, options) {
        var next = this.freeChannels.nextClearBit(1);
        if (next < 0 || next > this.channelMax)
          throw new Error("No channels left to allocate");
        this.freeChannels.set(next);
        var hwm = options && options.highWaterMark || DEFAULT_WRITE_HWM;
        var writeBuffer = new PassThrough({
          objectMode: true,
          highWaterMark: hwm
        });
        this.channels[next] = { channel, buffer: writeBuffer };
        writeBuffer.on("drain", function() {
          channel.onBufferDrain();
        });
        this.muxer.pipeFrom(writeBuffer);
        return next;
      }
      releaseChannel(channel) {
        this.freeChannels.clear(channel);
        var buffer = this.channels[channel].buffer;
        buffer.end();
        this.channels[channel] = null;
      }
      acceptLoop() {
        var self2 = this;
        function go() {
          try {
            var f;
            while (f = self2.recvFrame())
              self2.accept(f);
          } catch (e) {
            self2.emit("frameError", e);
          }
        }
        self2.stream.on("readable", go);
        go();
      }
      step(cb) {
        var self2 = this;
        function recv() {
          var f;
          try {
            f = self2.recvFrame();
          } catch (e) {
            cb(e, null);
            return;
          }
          if (f)
            cb(null, f);
          else
            self2.stream.once("readable", recv);
        }
        recv();
      }
      checkSend() {
        var check = this.sentSinceLastCheck;
        this.sentSinceLastCheck = false;
        return check;
      }
      checkRecv() {
        var check = this.recvSinceLastCheck;
        this.recvSinceLastCheck = false;
        return check;
      }
      sendBytes(bytes) {
        this.sentSinceLastCheck = true;
        this.stream.write(bytes);
      }
      sendHeartbeat() {
        return this.sendBytes(frame.HEARTBEAT_BUF);
      }
      sendMethod(channel, Method, fields) {
        var frame2 = encodeMethod(Method, channel, fields);
        this.sentSinceLastCheck = true;
        var buffer = this.channels[channel].buffer;
        return buffer.write(frame2);
      }
      sendMessage(channel, Method, fields, Properties, props, content) {
        if (!Buffer.isBuffer(content))
          throw new TypeError("content is not a buffer");
        var mframe = encodeMethod(Method, channel, fields);
        var pframe = encodeProperties(
          Properties,
          channel,
          content.length,
          props
        );
        var buffer = this.channels[channel].buffer;
        this.sentSinceLastCheck = true;
        var methodHeaderLen = mframe.length + pframe.length;
        var bodyLen = content.length > 0 ? content.length + FRAME_OVERHEAD : 0;
        var allLen = methodHeaderLen + bodyLen;
        if (allLen < SINGLE_CHUNK_THRESHOLD) {
          var all = Buffer.allocUnsafe(allLen);
          var offset = mframe.copy(all, 0);
          offset += pframe.copy(all, offset);
          if (bodyLen > 0)
            makeBodyFrame(channel, content).copy(all, offset);
          return buffer.write(all);
        } else {
          if (methodHeaderLen < SINGLE_CHUNK_THRESHOLD) {
            var both = Buffer.allocUnsafe(methodHeaderLen);
            var offset = mframe.copy(both, 0);
            pframe.copy(both, offset);
            buffer.write(both);
          } else {
            buffer.write(mframe);
            buffer.write(pframe);
          }
          return this.sendContent(channel, content);
        }
      }
      sendContent(channel, body) {
        if (!Buffer.isBuffer(body)) {
          throw new TypeError(fmt("Expected buffer; got %s", body));
        }
        var writeResult = true;
        var buffer = this.channels[channel].buffer;
        var maxBody = this.frameMax - FRAME_OVERHEAD;
        for (var offset = 0; offset < body.length; offset += maxBody) {
          var end = offset + maxBody;
          var slice = end > body.length ? body.subarray(offset) : body.subarray(offset, end);
          var bodyFrame = makeBodyFrame(channel, slice);
          writeResult = buffer.write(bodyFrame);
        }
        this.sentSinceLastCheck = true;
        return writeResult;
      }
      recvFrame() {
        var frame2 = parseFrame(this.rest, this.frameMax);
        if (!frame2) {
          var incoming = this.stream.read();
          if (incoming === null) {
            return false;
          } else {
            this.recvSinceLastCheck = true;
            this.rest = Buffer.concat([this.rest, incoming]);
            return this.recvFrame();
          }
        } else {
          this.rest = frame2.rest;
          return decodeFrame(frame2);
        }
      }
    };
    function mainAccept(frame2) {
      var rec = this.channels[frame2.channel];
      if (rec) {
        return rec.channel.accept(frame2);
      } else
        this.closeWithError(
          fmt("Frame on unknown channel %d", frame2.channel),
          constants.CHANNEL_ERROR,
          new Error(fmt(
            "Frame on unknown channel: %s",
            inspect2(frame2, false)
          ))
        );
    }
    function channel0(connection) {
      return function(f) {
        if (f === HEARTBEAT)
          ;
        else if (f.id === defs.ConnectionClose) {
          connection.sendMethod(0, defs.ConnectionCloseOk, {});
          var emsg = fmt("Connection closed: %s", closeMsg(f));
          var s = stackCapture(emsg);
          var e = new Error(emsg);
          e.code = f.fields.replyCode;
          if (isFatalError(e)) {
            connection.emit("error", e);
          }
          connection.toClosed(s, e);
        } else if (f.id === defs.ConnectionBlocked) {
          connection.emit("blocked", f.fields.reason);
        } else if (f.id === defs.ConnectionUnblocked) {
          connection.emit("unblocked");
        } else if (f.id === defs.ConnectionUpdateSecretOk) {
          connection.emit("update-secret-ok");
        } else {
          connection.closeWithError(
            fmt("Unexpected frame on channel 0"),
            constants.UNEXPECTED_FRAME,
            new Error(fmt(
              "Unexpected frame on channel 0: %s",
              inspect2(f, false)
            ))
          );
        }
      };
    }
    function invalidOp(msg, stack) {
      return function() {
        throw new IllegalOperationError(msg, stack);
      };
    }
    function invalidateSend(conn, msg, stack) {
      conn.sendMethod = conn.sendContent = conn.sendMessage = invalidOp(msg, stack);
    }
    var encodeMethod = defs.encodeMethod;
    var encodeProperties = defs.encodeProperties;
    var FRAME_OVERHEAD = defs.FRAME_OVERHEAD;
    var makeBodyFrame = frame.makeBodyFrame;
    var parseFrame = frame.parseFrame;
    var decodeFrame = frame.decodeFrame;
    function wrapStream(s) {
      if (s instanceof Duplex)
        return s;
      else {
        var ws = new Duplex();
        ws.wrap(s);
        ws._write = function(chunk, encoding, callback) {
          return s.write(chunk, encoding, callback);
        };
        return ws;
      }
    }
    function isFatalError(error) {
      switch (error && error.code) {
        case defs.constants.CONNECTION_FORCED:
        case defs.constants.REPLY_SUCCESS:
          return false;
        default:
          return true;
      }
    }
    module.exports.Connection = Connection;
    module.exports.isFatalError = isFatalError;
  }
});

// node_modules/amqplib/lib/credentials.js
var require_credentials = __commonJS({
  "node_modules/amqplib/lib/credentials.js"(exports, module) {
    var codec = require_codec();
    module.exports.plain = function(user, passwd) {
      return {
        mechanism: "PLAIN",
        response: function() {
          return Buffer.from(["", user, passwd].join(String.fromCharCode(0)));
        },
        username: user,
        password: passwd
      };
    };
    module.exports.amqplain = function(user, passwd) {
      return {
        mechanism: "AMQPLAIN",
        response: function() {
          const buffer = Buffer.alloc(16384);
          const size = codec.encodeTable(buffer, { LOGIN: user, PASSWORD: passwd }, 0);
          return buffer.subarray(4, size);
        },
        username: user,
        password: passwd
      };
    };
    module.exports.external = function() {
      return {
        mechanism: "EXTERNAL",
        response: function() {
          return Buffer.from("");
        }
      };
    };
  }
});

// node_modules/amqplib/package.json
var require_package = __commonJS({
  "node_modules/amqplib/package.json"(exports, module) {
    module.exports = {
      name: "amqplib",
      homepage: "http://amqp-node.github.io/amqplib/",
      main: "./channel_api.js",
      version: "0.10.4",
      description: "An AMQP 0-9-1 (e.g., RabbitMQ) library and client.",
      repository: {
        type: "git",
        url: "https://github.com/amqp-node/amqplib.git"
      },
      engines: {
        node: ">=10"
      },
      dependencies: {
        "@acuminous/bitsyntax": "^0.1.2",
        "buffer-more-ints": "~1.0.0",
        "readable-stream": "1.x >=1.1.9",
        "url-parse": "~1.5.10"
      },
      devDependencies: {
        claire: "0.4.1",
        mocha: "^9.2.2",
        nyc: "^15.1.0",
        "uglify-js": "2.8.x"
      },
      scripts: {
        test: "make test",
        prepare: "make"
      },
      keywords: [
        "AMQP",
        "AMQP 0-9-1",
        "RabbitMQ"
      ],
      author: "Michael Bridgen <mikeb@squaremobius.net>",
      license: "MIT"
    };
  }
});

// browser-external:net
var require_net = __commonJS({
  "browser-external:net"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "net" has been externalized for browser compatibility. Cannot access "net.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:tls
var require_tls = __commonJS({
  "browser-external:tls"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "tls" has been externalized for browser compatibility. Cannot access "tls.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/amqplib/lib/connect.js
var require_connect = __commonJS({
  "node_modules/amqplib/lib/connect.js"(exports, module) {
    "use strict";
    var URL = require_url_parse();
    var QS = require_querystring();
    var Connection = require_connection().Connection;
    var fmt = require_util().format;
    var credentials = require_credentials();
    function copyInto(obj, target) {
      var keys = Object.keys(obj);
      var i = keys.length;
      while (i--) {
        var k = keys[i];
        target[k] = obj[k];
      }
      return target;
    }
    function clone(obj) {
      return copyInto(obj, {});
    }
    var CLIENT_PROPERTIES = {
      "product": "amqplib",
      "version": require_package().version,
      "platform": fmt("Node.JS %s", process.version),
      "information": "http://squaremo.github.io/amqp.node",
      "capabilities": {
        "publisher_confirms": true,
        "exchange_exchange_bindings": true,
        "basic.nack": true,
        "consumer_cancel_notify": true,
        "connection.blocked": true,
        "authentication_failure_close": true
      }
    };
    function openFrames(vhost, query, credentials2, extraClientProperties) {
      if (!vhost)
        vhost = "/";
      else
        vhost = QS.unescape(vhost);
      var query = query || {};
      function intOrDefault(val, def) {
        return val === void 0 ? def : parseInt(val);
      }
      var clientProperties = Object.create(CLIENT_PROPERTIES);
      return {
        // start-ok
        "clientProperties": copyInto(extraClientProperties, clientProperties),
        "mechanism": credentials2.mechanism,
        "response": credentials2.response(),
        "locale": query.locale || "en_US",
        // tune-ok
        "channelMax": intOrDefault(query.channelMax, 0),
        "frameMax": intOrDefault(query.frameMax, 4096),
        "heartbeat": intOrDefault(query.heartbeat, 0),
        // open
        "virtualHost": vhost,
        "capabilities": "",
        "insist": 0
      };
    }
    function credentialsFromUrl(parts) {
      var user = "guest", passwd = "guest";
      if (parts.username != "" || parts.password != "") {
        user = parts.username ? unescape(parts.username) : "";
        passwd = parts.password ? unescape(parts.password) : "";
      }
      return credentials.plain(user, passwd);
    }
    function connect(url, socketOptions, openCallback) {
      var sockopts = clone(socketOptions || {});
      url = url || "amqp://localhost";
      var noDelay = !!sockopts.noDelay;
      var timeout = sockopts.timeout;
      var keepAlive = !!sockopts.keepAlive;
      var keepAliveDelay = sockopts.keepAliveDelay || 0;
      var extraClientProperties = sockopts.clientProperties || {};
      var protocol, fields;
      if (typeof url === "object") {
        protocol = (url.protocol || "amqp") + ":";
        sockopts.host = url.hostname;
        sockopts.servername = sockopts.servername || url.hostname;
        sockopts.port = url.port || (protocol === "amqp:" ? 5672 : 5671);
        var user, pass;
        if (url.username == void 0 && url.password == void 0) {
          user = "guest";
          pass = "guest";
        } else {
          user = url.username || "";
          pass = url.password || "";
        }
        var config = {
          locale: url.locale,
          channelMax: url.channelMax,
          frameMax: url.frameMax,
          heartbeat: url.heartbeat
        };
        fields = openFrames(url.vhost, config, sockopts.credentials || credentials.plain(user, pass), extraClientProperties);
      } else {
        var parts = URL(url, true);
        protocol = parts.protocol;
        sockopts.host = parts.hostname;
        sockopts.servername = sockopts.servername || parts.hostname;
        sockopts.port = parseInt(parts.port) || (protocol === "amqp:" ? 5672 : 5671);
        var vhost = parts.pathname ? parts.pathname.substr(1) : null;
        fields = openFrames(vhost, parts.query, sockopts.credentials || credentialsFromUrl(parts), extraClientProperties);
      }
      var sockok = false;
      var sock;
      function onConnect() {
        sockok = true;
        sock.setNoDelay(noDelay);
        if (keepAlive)
          sock.setKeepAlive(keepAlive, keepAliveDelay);
        var c = new Connection(sock);
        c.open(fields, function(err, ok) {
          if (timeout)
            sock.setTimeout(0);
          if (err === null) {
            openCallback(null, c);
          } else {
            sock.end();
            sock.destroy();
            openCallback(err);
          }
        });
      }
      if (protocol === "amqp:") {
        sock = require_net().connect(sockopts, onConnect);
      } else if (protocol === "amqps:") {
        sock = require_tls().connect(sockopts, onConnect);
      } else {
        throw new Error("Expected amqp: or amqps: as the protocol; got " + protocol);
      }
      if (timeout) {
        sock.setTimeout(timeout, function() {
          sock.end();
          sock.destroy();
          openCallback(new Error("connect ETIMEDOUT"));
        });
      }
      sock.once("error", function(err) {
        if (!sockok)
          openCallback(err);
      });
    }
    module.exports.connect = connect;
    module.exports.credentialsFromUrl = credentialsFromUrl;
  }
});

// node_modules/amqplib/lib/channel.js
var require_channel = __commonJS({
  "node_modules/amqplib/lib/channel.js"(exports, module) {
    "use strict";
    var defs = require_defs();
    var closeMsg = require_format().closeMessage;
    var inspect2 = require_format().inspect;
    var methodName = require_format().methodName;
    var assert = require_assert();
    var EventEmitter = require_events();
    var fmt = require_util().format;
    var IllegalOperationError = require_error().IllegalOperationError;
    var stackCapture = require_error().stackCapture;
    var Channel = class extends EventEmitter {
      constructor(connection) {
        super();
        this.connection = connection;
        this.reply = null;
        this.pending = [];
        this.lwm = 1;
        this.unconfirmed = [];
        this.on("ack", this.handleConfirm.bind(this, function(cb) {
          if (cb)
            cb(null);
        }));
        this.on("nack", this.handleConfirm.bind(this, function(cb) {
          if (cb)
            cb(new Error("message nacked"));
        }));
        this.on("close", function() {
          var cb;
          while (cb = this.unconfirmed.shift()) {
            if (cb)
              cb(new Error("channel closed"));
          }
        });
        this.handleMessage = acceptDeliveryOrReturn;
      }
      allocate() {
        this.ch = this.connection.freshChannel(this);
        return this;
      }
      // Incoming frames are either notifications of e.g., message delivery,
      // or replies to something we've sent. In general I deal with the
      // former by emitting an event, and with the latter by keeping a track
      // of what's expecting a reply.
      //
      // The AMQP specification implies that RPCs can't be pipelined; that
      // is, you can have only one outstanding RPC on a channel at a
      // time. Certainly that's what RabbitMQ and its clients assume. For
      // this reason, I buffer RPCs if the channel is already waiting for a
      // reply.
      // Just send the damn frame.
      sendImmediately(method, fields) {
        return this.connection.sendMethod(this.ch, method, fields);
      }
      // Invariant: !this.reply -> pending.length == 0. That is, whenever we
      // clear a reply, we must send another RPC (and thereby fill
      // this.reply) if there is one waiting. The invariant relevant here
      // and in `accept`.
      sendOrEnqueue(method, fields, reply) {
        if (!this.reply) {
          assert(this.pending.length === 0);
          this.reply = reply;
          this.sendImmediately(method, fields);
        } else {
          this.pending.push({
            method,
            fields,
            reply
          });
        }
      }
      sendMessage(fields, properties, content) {
        return this.connection.sendMessage(
          this.ch,
          defs.BasicPublish,
          fields,
          defs.BasicProperties,
          properties,
          content
        );
      }
      // Internal, synchronously resolved RPC; the return value is resolved
      // with the whole frame.
      _rpc(method, fields, expect, cb) {
        var self2 = this;
        function reply(err, f) {
          if (err === null) {
            if (f.id === expect) {
              return cb(null, f);
            } else {
              var expectedName = methodName(expect);
              var e = new Error(fmt(
                "Expected %s; got %s",
                expectedName,
                inspect2(f, false)
              ));
              self2.closeWithError(
                f.id,
                fmt(
                  "Expected %s; got %s",
                  expectedName,
                  methodName(f.id)
                ),
                defs.constants.UNEXPECTED_FRAME,
                e
              );
              return cb(e);
            }
          } else if (err instanceof Error)
            return cb(err);
          else {
            var closeReason = (err.fields.classId << 16) + err.fields.methodId;
            var e = method === closeReason ? fmt(
              "Operation failed: %s; %s",
              methodName(method),
              closeMsg(err)
            ) : fmt("Channel closed by server: %s", closeMsg(err));
            var closeFrameError = new Error(e);
            closeFrameError.code = err.fields.replyCode;
            closeFrameError.classId = err.fields.classId;
            closeFrameError.methodId = err.fields.methodId;
            return cb(closeFrameError);
          }
        }
        this.sendOrEnqueue(method, fields, reply);
      }
      // Move to entirely closed state.
      toClosed(capturedStack) {
        this._rejectPending();
        invalidateSend(this, "Channel closed", capturedStack);
        this.accept = invalidOp("Channel closed", capturedStack);
        this.connection.releaseChannel(this.ch);
        this.emit("close");
      }
      // Stop being able to send and receive methods and content. Used when
      // we close the channel. Invokes the continuation once the server has
      // acknowledged the close, but before the channel is moved to the
      // closed state.
      toClosing(capturedStack, k) {
        var send = this.sendImmediately.bind(this);
        invalidateSend(this, "Channel closing", capturedStack);
        this.accept = function(f) {
          if (f.id === defs.ChannelCloseOk) {
            if (k)
              k();
            var s = stackCapture("ChannelCloseOk frame received");
            this.toClosed(s);
          } else if (f.id === defs.ChannelClose) {
            send(defs.ChannelCloseOk, {});
          }
        };
      }
      _rejectPending() {
        function rej(r) {
          r(new Error("Channel ended, no reply will be forthcoming"));
        }
        if (this.reply !== null)
          rej(this.reply);
        this.reply = null;
        var discard;
        while (discard = this.pending.shift())
          rej(discard.reply);
        this.pending = null;
      }
      closeBecause(reason, code, k) {
        this.sendImmediately(defs.ChannelClose, {
          replyText: reason,
          replyCode: code,
          methodId: 0,
          classId: 0
        });
        var s = stackCapture("closeBecause called: " + reason);
        this.toClosing(s, k);
      }
      // If we close because there's been an error, we need to distinguish
      // between what we tell the server (`reason`) and what we report as
      // the cause in the client (`error`).
      closeWithError(id, reason, code, error) {
        var self2 = this;
        this.closeBecause(reason, code, function() {
          error.code = code;
          if (id) {
            error.classId = defs.info(id).classId;
            error.methodId = defs.info(id).methodId;
          }
          self2.emit("error", error);
        });
      }
      // A trampolining state machine for message frames on a channel. A
      // message arrives in at least two frames: first, a method announcing
      // the message (either a BasicDeliver or BasicGetOk); then, a message
      // header with the message properties; then, zero or more content
      // frames.
      // Keep the try/catch localised, in an attempt to avoid disabling
      // optimisation
      acceptMessageFrame(f) {
        try {
          this.handleMessage = this.handleMessage(f);
        } catch (msg) {
          if (typeof msg === "string") {
            this.closeWithError(
              f.id,
              msg,
              defs.constants.UNEXPECTED_FRAME,
              new Error(msg)
            );
          } else if (msg instanceof Error) {
            this.closeWithError(
              f.id,
              "Error while processing message",
              defs.constants.INTERNAL_ERROR,
              msg
            );
          } else {
            this.closeWithError(
              f.id,
              "Internal error while processing message",
              defs.constants.INTERNAL_ERROR,
              new Error(msg.toString())
            );
          }
        }
      }
      handleConfirm(handle, f) {
        var tag = f.deliveryTag;
        var multi = f.multiple;
        if (multi) {
          var confirmed = this.unconfirmed.splice(0, tag - this.lwm + 1);
          this.lwm = tag + 1;
          confirmed.forEach(handle);
        } else {
          var c;
          if (tag === this.lwm) {
            c = this.unconfirmed.shift();
            this.lwm++;
            while (this.unconfirmed[0] === null) {
              this.unconfirmed.shift();
              this.lwm++;
            }
          } else {
            c = this.unconfirmed[tag - this.lwm];
            this.unconfirmed[tag - this.lwm] = null;
          }
          handle(c);
        }
      }
      pushConfirmCallback(cb) {
        this.unconfirmed.push(cb || false);
      }
      onBufferDrain() {
        this.emit("drain");
      }
      accept(f) {
        switch (f.id) {
          case void 0:
          case defs.BasicDeliver:
          case defs.BasicReturn:
          case defs.BasicProperties:
            return this.acceptMessageFrame(f);
          case defs.BasicAck:
            return this.emit("ack", f.fields);
          case defs.BasicNack:
            return this.emit("nack", f.fields);
          case defs.BasicCancel:
            return this.emit("cancel", f.fields);
          case defs.ChannelClose:
            if (this.reply) {
              var reply = this.reply;
              this.reply = null;
              reply(f);
            }
            var emsg = "Channel closed by server: " + closeMsg(f);
            this.sendImmediately(defs.ChannelCloseOk, {});
            var error = new Error(emsg);
            error.code = f.fields.replyCode;
            error.classId = f.fields.classId;
            error.methodId = f.fields.methodId;
            this.emit("error", error);
            var s = stackCapture(emsg);
            this.toClosed(s);
            return;
          case defs.BasicFlow:
            return this.closeWithError(
              f.id,
              "Flow not implemented",
              defs.constants.NOT_IMPLEMENTED,
              new Error("Flow not implemented")
            );
          default:
            var reply = this.reply;
            this.reply = null;
            if (this.pending.length > 0) {
              var send = this.pending.shift();
              this.reply = send.reply;
              this.sendImmediately(send.method, send.fields);
            }
            return reply(null, f);
        }
      }
    };
    function invalidOp(msg, stack) {
      return function() {
        throw new IllegalOperationError(msg, stack);
      };
    }
    function invalidateSend(ch, msg, stack) {
      ch.sendImmediately = ch.sendOrEnqueue = ch.sendMessage = invalidOp(msg, stack);
    }
    function acceptDeliveryOrReturn(f) {
      var event;
      if (f.id === defs.BasicDeliver)
        event = "delivery";
      else if (f.id === defs.BasicReturn)
        event = "return";
      else
        throw fmt(
          "Expected BasicDeliver or BasicReturn; got %s",
          inspect2(f)
        );
      var self2 = this;
      var fields = f.fields;
      return acceptMessage(function(message) {
        message.fields = fields;
        self2.emit(event, message);
      });
    }
    function acceptMessage(continuation) {
      var totalSize = 0, remaining = 0;
      var buffers = null;
      var message = {
        fields: null,
        properties: null,
        content: null
      };
      return headers;
      function headers(f) {
        if (f.id === defs.BasicProperties) {
          message.properties = f.fields;
          totalSize = remaining = f.size;
          if (totalSize === 0) {
            message.content = Buffer.alloc(0);
            continuation(message);
            return acceptDeliveryOrReturn;
          } else {
            return content;
          }
        } else {
          throw "Expected headers frame after delivery";
        }
      }
      function content(f) {
        if (f.content) {
          var size = f.content.length;
          remaining -= size;
          if (remaining === 0) {
            if (buffers !== null) {
              buffers.push(f.content);
              message.content = Buffer.concat(buffers);
            } else {
              message.content = f.content;
            }
            continuation(message);
            return acceptDeliveryOrReturn;
          } else if (remaining < 0) {
            throw fmt(
              "Too much content sent! Expected %d bytes",
              totalSize
            );
          } else {
            if (buffers !== null)
              buffers.push(f.content);
            else
              buffers = [f.content];
            return content;
          }
        } else
          throw "Expected content frame after headers";
      }
    }
    var BaseChannel = class extends Channel {
      constructor(connection) {
        super(connection);
        this.consumers = /* @__PURE__ */ new Map();
      }
      // Not sure I like the ff, it's going to be changing hidden classes
      // all over the place. On the other hand, whaddya do.
      registerConsumer(tag, callback) {
        this.consumers.set(tag, callback);
      }
      unregisterConsumer(tag) {
        this.consumers.delete(tag);
      }
      dispatchMessage(fields, message) {
        var consumerTag = fields.consumerTag;
        var consumer = this.consumers.get(consumerTag);
        if (consumer) {
          return consumer(message);
        } else {
          throw new Error("Unknown consumer: " + consumerTag);
        }
      }
      handleDelivery(message) {
        return this.dispatchMessage(message.fields, message);
      }
      handleCancel(fields) {
        var result = this.dispatchMessage(fields, null);
        this.unregisterConsumer(fields.consumerTag);
        return result;
      }
    };
    module.exports.acceptMessage = acceptMessage;
    module.exports.BaseChannel = BaseChannel;
    module.exports.Channel = Channel;
  }
});

// node_modules/amqplib/lib/api_args.js
var require_api_args = __commonJS({
  "node_modules/amqplib/lib/api_args.js"(exports, module) {
    "use strict";
    function setIfDefined(obj, prop, value) {
      if (value != void 0)
        obj[prop] = value;
    }
    var EMPTY_OPTIONS = Object.freeze({});
    var Args = {};
    Args.assertQueue = function(queue, options) {
      queue = queue || "";
      options = options || EMPTY_OPTIONS;
      var argt = Object.create(options.arguments || null);
      setIfDefined(argt, "x-expires", options.expires);
      setIfDefined(argt, "x-message-ttl", options.messageTtl);
      setIfDefined(
        argt,
        "x-dead-letter-exchange",
        options.deadLetterExchange
      );
      setIfDefined(
        argt,
        "x-dead-letter-routing-key",
        options.deadLetterRoutingKey
      );
      setIfDefined(argt, "x-max-length", options.maxLength);
      setIfDefined(argt, "x-max-priority", options.maxPriority);
      setIfDefined(argt, "x-overflow", options.overflow);
      setIfDefined(argt, "x-queue-mode", options.queueMode);
      return {
        queue,
        exclusive: !!options.exclusive,
        durable: options.durable === void 0 ? true : options.durable,
        autoDelete: !!options.autoDelete,
        arguments: argt,
        passive: false,
        // deprecated but we have to include it
        ticket: 0,
        nowait: false
      };
    };
    Args.checkQueue = function(queue) {
      return {
        queue,
        passive: true,
        // switch to "completely different" mode
        nowait: false,
        durable: true,
        autoDelete: false,
        exclusive: false,
        // ignored
        ticket: 0
      };
    };
    Args.deleteQueue = function(queue, options) {
      options = options || EMPTY_OPTIONS;
      return {
        queue,
        ifUnused: !!options.ifUnused,
        ifEmpty: !!options.ifEmpty,
        ticket: 0,
        nowait: false
      };
    };
    Args.purgeQueue = function(queue) {
      return {
        queue,
        ticket: 0,
        nowait: false
      };
    };
    Args.bindQueue = function(queue, source, pattern, argt) {
      return {
        queue,
        exchange: source,
        routingKey: pattern,
        arguments: argt,
        ticket: 0,
        nowait: false
      };
    };
    Args.unbindQueue = function(queue, source, pattern, argt) {
      return {
        queue,
        exchange: source,
        routingKey: pattern,
        arguments: argt,
        ticket: 0,
        nowait: false
      };
    };
    Args.assertExchange = function(exchange, type, options) {
      options = options || EMPTY_OPTIONS;
      var argt = Object.create(options.arguments || null);
      setIfDefined(argt, "alternate-exchange", options.alternateExchange);
      return {
        exchange,
        ticket: 0,
        type,
        passive: false,
        durable: options.durable === void 0 ? true : options.durable,
        autoDelete: !!options.autoDelete,
        internal: !!options.internal,
        nowait: false,
        arguments: argt
      };
    };
    Args.checkExchange = function(exchange) {
      return {
        exchange,
        passive: true,
        // switch to 'may as well be another method' mode
        nowait: false,
        // ff are ignored
        durable: true,
        internal: false,
        type: "",
        autoDelete: false,
        ticket: 0
      };
    };
    Args.deleteExchange = function(exchange, options) {
      options = options || EMPTY_OPTIONS;
      return {
        exchange,
        ifUnused: !!options.ifUnused,
        ticket: 0,
        nowait: false
      };
    };
    Args.bindExchange = function(dest, source, pattern, argt) {
      return {
        source,
        destination: dest,
        routingKey: pattern,
        arguments: argt,
        ticket: 0,
        nowait: false
      };
    };
    Args.unbindExchange = function(dest, source, pattern, argt) {
      return {
        source,
        destination: dest,
        routingKey: pattern,
        arguments: argt,
        ticket: 0,
        nowait: false
      };
    };
    Args.publish = function(exchange, routingKey, options) {
      options = options || EMPTY_OPTIONS;
      function convertCC(cc) {
        if (cc === void 0) {
          return void 0;
        } else if (Array.isArray(cc)) {
          return cc.map(String);
        } else
          return [String(cc)];
      }
      var headers = Object.create(options.headers || null);
      setIfDefined(headers, "CC", convertCC(options.CC));
      setIfDefined(headers, "BCC", convertCC(options.BCC));
      var deliveryMode;
      if (options.persistent !== void 0)
        deliveryMode = options.persistent ? 2 : 1;
      else if (typeof options.deliveryMode === "number")
        deliveryMode = options.deliveryMode;
      else if (options.deliveryMode)
        deliveryMode = 2;
      var expiration = options.expiration;
      if (expiration !== void 0)
        expiration = expiration.toString();
      return {
        // method fields
        exchange,
        routingKey,
        mandatory: !!options.mandatory,
        immediate: false,
        // RabbitMQ doesn't implement this any more
        ticket: void 0,
        // properties
        contentType: options.contentType,
        contentEncoding: options.contentEncoding,
        headers,
        deliveryMode,
        priority: options.priority,
        correlationId: options.correlationId,
        replyTo: options.replyTo,
        expiration,
        messageId: options.messageId,
        timestamp: options.timestamp,
        type: options.type,
        userId: options.userId,
        appId: options.appId,
        clusterId: void 0
      };
    };
    Args.consume = function(queue, options) {
      options = options || EMPTY_OPTIONS;
      var argt = Object.create(options.arguments || null);
      setIfDefined(argt, "x-priority", options.priority);
      return {
        ticket: 0,
        queue,
        consumerTag: options.consumerTag || "",
        noLocal: !!options.noLocal,
        noAck: !!options.noAck,
        exclusive: !!options.exclusive,
        nowait: false,
        arguments: argt
      };
    };
    Args.cancel = function(consumerTag) {
      return {
        consumerTag,
        nowait: false
      };
    };
    Args.get = function(queue, options) {
      options = options || EMPTY_OPTIONS;
      return {
        ticket: 0,
        queue,
        noAck: !!options.noAck
      };
    };
    Args.ack = function(tag, allUpTo) {
      return {
        deliveryTag: tag,
        multiple: !!allUpTo
      };
    };
    Args.nack = function(tag, allUpTo, requeue) {
      return {
        deliveryTag: tag,
        multiple: !!allUpTo,
        requeue: requeue === void 0 ? true : requeue
      };
    };
    Args.reject = function(tag, requeue) {
      return {
        deliveryTag: tag,
        requeue: requeue === void 0 ? true : requeue
      };
    };
    Args.prefetch = function(count, global2) {
      return {
        prefetchCount: count || 0,
        prefetchSize: 0,
        global: !!global2
      };
    };
    Args.recover = function() {
      return { requeue: true };
    };
    module.exports = Object.freeze(Args);
  }
});

// node_modules/amqplib/lib/callback_model.js
var require_callback_model = __commonJS({
  "node_modules/amqplib/lib/callback_model.js"(exports, module) {
    "use strict";
    var defs = require_defs();
    var EventEmitter = require_events();
    var BaseChannel = require_channel().BaseChannel;
    var acceptMessage = require_channel().acceptMessage;
    var Args = require_api_args();
    var CallbackModel = class extends EventEmitter {
      constructor(connection) {
        super();
        this.connection = connection;
        var self2 = this;
        ["error", "close", "blocked", "unblocked"].forEach(function(ev) {
          connection.on(ev, self2.emit.bind(self2, ev));
        });
      }
      close(cb) {
        this.connection.close(cb);
      }
      updateSecret(newSecret, reason, cb) {
        this.connection._updateSecret(newSecret, reason, cb);
      }
      createChannel(cb) {
        var ch = new Channel(this.connection);
        ch.open(function(err, ok) {
          if (err === null)
            cb && cb(null, ch);
          else
            cb && cb(err);
        });
        return ch;
      }
      createConfirmChannel(cb) {
        var ch = new ConfirmChannel(this.connection);
        ch.open(function(err) {
          if (err !== null)
            return cb && cb(err);
          else {
            ch.rpc(
              defs.ConfirmSelect,
              { nowait: false },
              defs.ConfirmSelectOk,
              function(err2, _ok) {
                if (err2 !== null)
                  return cb && cb(err2);
                else
                  cb && cb(null, ch);
              }
            );
          }
        });
        return ch;
      }
    };
    var Channel = class extends BaseChannel {
      constructor(connection) {
        super(connection);
        this.on("delivery", this.handleDelivery.bind(this));
        this.on("cancel", this.handleCancel.bind(this));
      }
      // This encodes straight-forward RPC: no side-effects and return the
      // fields from the server response. It wraps the callback given it, so
      // the calling method argument can be passed as-is. For anything that
      // needs to have side-effects, or needs to change the server response,
      // use `#_rpc(...)` and remember to dereference `.fields` of the
      // server response.
      rpc(method, fields, expect, cb0) {
        var cb = callbackWrapper(this, cb0);
        this._rpc(method, fields, expect, function(err, ok) {
          cb(err, ok && ok.fields);
        });
        return this;
      }
      // === Public API ===
      open(cb) {
        try {
          this.allocate();
        } catch (e) {
          return cb(e);
        }
        return this.rpc(
          defs.ChannelOpen,
          { outOfBand: "" },
          defs.ChannelOpenOk,
          cb
        );
      }
      close(cb) {
        return this.closeBecause(
          "Goodbye",
          defs.constants.REPLY_SUCCESS,
          function() {
            cb && cb(null);
          }
        );
      }
      assertQueue(queue, options, cb) {
        return this.rpc(
          defs.QueueDeclare,
          Args.assertQueue(queue, options),
          defs.QueueDeclareOk,
          cb
        );
      }
      checkQueue(queue, cb) {
        return this.rpc(
          defs.QueueDeclare,
          Args.checkQueue(queue),
          defs.QueueDeclareOk,
          cb
        );
      }
      deleteQueue(queue, options, cb) {
        return this.rpc(
          defs.QueueDelete,
          Args.deleteQueue(queue, options),
          defs.QueueDeleteOk,
          cb
        );
      }
      purgeQueue(queue, cb) {
        return this.rpc(
          defs.QueuePurge,
          Args.purgeQueue(queue),
          defs.QueuePurgeOk,
          cb
        );
      }
      bindQueue(queue, source, pattern, argt, cb) {
        return this.rpc(
          defs.QueueBind,
          Args.bindQueue(queue, source, pattern, argt),
          defs.QueueBindOk,
          cb
        );
      }
      unbindQueue(queue, source, pattern, argt, cb) {
        return this.rpc(
          defs.QueueUnbind,
          Args.unbindQueue(queue, source, pattern, argt),
          defs.QueueUnbindOk,
          cb
        );
      }
      assertExchange(ex, type, options, cb0) {
        var cb = callbackWrapper(this, cb0);
        this._rpc(
          defs.ExchangeDeclare,
          Args.assertExchange(ex, type, options),
          defs.ExchangeDeclareOk,
          function(e, _) {
            cb(e, { exchange: ex });
          }
        );
        return this;
      }
      checkExchange(exchange, cb) {
        return this.rpc(
          defs.ExchangeDeclare,
          Args.checkExchange(exchange),
          defs.ExchangeDeclareOk,
          cb
        );
      }
      deleteExchange(exchange, options, cb) {
        return this.rpc(
          defs.ExchangeDelete,
          Args.deleteExchange(exchange, options),
          defs.ExchangeDeleteOk,
          cb
        );
      }
      bindExchange(dest, source, pattern, argt, cb) {
        return this.rpc(
          defs.ExchangeBind,
          Args.bindExchange(dest, source, pattern, argt),
          defs.ExchangeBindOk,
          cb
        );
      }
      unbindExchange(dest, source, pattern, argt, cb) {
        return this.rpc(
          defs.ExchangeUnbind,
          Args.unbindExchange(dest, source, pattern, argt),
          defs.ExchangeUnbindOk,
          cb
        );
      }
      publish(exchange, routingKey, content, options) {
        var fieldsAndProps = Args.publish(exchange, routingKey, options);
        return this.sendMessage(fieldsAndProps, fieldsAndProps, content);
      }
      sendToQueue(queue, content, options) {
        return this.publish("", queue, content, options);
      }
      consume(queue, callback, options, cb0) {
        var cb = callbackWrapper(this, cb0);
        var fields = Args.consume(queue, options);
        var self2 = this;
        this._rpc(
          defs.BasicConsume,
          fields,
          defs.BasicConsumeOk,
          function(err, ok) {
            if (err === null) {
              self2.registerConsumer(ok.fields.consumerTag, callback);
              cb(null, ok.fields);
            } else
              cb(err);
          }
        );
        return this;
      }
      cancel(consumerTag, cb0) {
        var cb = callbackWrapper(this, cb0);
        var self2 = this;
        this._rpc(
          defs.BasicCancel,
          Args.cancel(consumerTag),
          defs.BasicCancelOk,
          function(err, ok) {
            if (err === null) {
              self2.unregisterConsumer(consumerTag);
              cb(null, ok.fields);
            } else
              cb(err);
          }
        );
        return this;
      }
      get(queue, options, cb0) {
        var self2 = this;
        var fields = Args.get(queue, options);
        var cb = callbackWrapper(this, cb0);
        this.sendOrEnqueue(defs.BasicGet, fields, function(err, f) {
          if (err === null) {
            if (f.id === defs.BasicGetEmpty) {
              cb(null, false);
            } else if (f.id === defs.BasicGetOk) {
              self2.handleMessage = acceptMessage(function(m) {
                m.fields = f.fields;
                cb(null, m);
              });
            } else {
              cb(new Error("Unexpected response to BasicGet: " + inspect(f)));
            }
          }
        });
        return this;
      }
      ack(message, allUpTo) {
        this.sendImmediately(
          defs.BasicAck,
          Args.ack(message.fields.deliveryTag, allUpTo)
        );
        return this;
      }
      ackAll() {
        this.sendImmediately(defs.BasicAck, Args.ack(0, true));
        return this;
      }
      nack(message, allUpTo, requeue) {
        this.sendImmediately(
          defs.BasicNack,
          Args.nack(message.fields.deliveryTag, allUpTo, requeue)
        );
        return this;
      }
      nackAll(requeue) {
        this.sendImmediately(
          defs.BasicNack,
          Args.nack(0, true, requeue)
        );
        return this;
      }
      reject(message, requeue) {
        this.sendImmediately(
          defs.BasicReject,
          Args.reject(message.fields.deliveryTag, requeue)
        );
        return this;
      }
      prefetch(count, global2, cb) {
        return this.rpc(
          defs.BasicQos,
          Args.prefetch(count, global2),
          defs.BasicQosOk,
          cb
        );
      }
      recover(cb) {
        return this.rpc(
          defs.BasicRecover,
          Args.recover(),
          defs.BasicRecoverOk,
          cb
        );
      }
    };
    function callbackWrapper(ch, cb) {
      return cb ? function(err, ok) {
        if (err === null) {
          cb(null, ok);
        } else
          cb(err);
      } : function() {
      };
    }
    var ConfirmChannel = class extends Channel {
      publish(exchange, routingKey, content, options, cb) {
        this.pushConfirmCallback(cb);
        return Channel.prototype.publish.call(
          this,
          exchange,
          routingKey,
          content,
          options
        );
      }
      sendToQueue(queue, content, options, cb) {
        return this.publish("", queue, content, options, cb);
      }
      waitForConfirms(k) {
        var awaiting = [];
        var unconfirmed = this.unconfirmed;
        unconfirmed.forEach(function(val, index) {
          if (val === null)
            ;
          else {
            var confirmed = new Promise(function(resolve, reject) {
              unconfirmed[index] = function(err) {
                if (val)
                  val(err);
                if (err === null)
                  resolve();
                else
                  reject(err);
              };
            });
            awaiting.push(confirmed);
          }
        });
        return Promise.all(awaiting).then(
          function() {
            k();
          },
          function(err) {
            k(err);
          }
        );
      }
    };
    module.exports.CallbackModel = CallbackModel;
    module.exports.Channel = Channel;
    module.exports.ConfirmChannel = ConfirmChannel;
  }
});

// node_modules/amqplib/callback_api.js
var require_callback_api = __commonJS({
  "node_modules/amqplib/callback_api.js"(exports, module) {
    var raw_connect = require_connect().connect;
    var CallbackModel = require_callback_model().CallbackModel;
    function connect(url, options, cb) {
      if (typeof url === "function")
        cb = url, url = false, options = false;
      else if (typeof options === "function")
        cb = options, options = false;
      raw_connect(url, options, function(err, c) {
        if (err === null)
          cb(null, new CallbackModel(c));
        else
          cb(err);
      });
    }
    module.exports.connect = connect;
    module.exports.credentials = require_credentials();
    module.exports.IllegalOperationError = require_error().IllegalOperationError;
  }
});
export default require_callback_api();
/*! Bundled license information:

amqplib/lib/defs.js:
  (** @preserve This file is generated by the script
   * ../bin/generate-defs.js, which is not in general included in a
   * distribution, but is available in the source repository e.g. at
   * https://github.com/squaremo/amqp.node/
   *)

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

assert/build/internal/util/comparisons.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=amqplib_callback_api.js.map
