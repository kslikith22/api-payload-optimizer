var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var index_exports = {};
__export(index_exports, {
  optimizedMiddleware: () => optimizedMiddleware,
  sendOptimized: () => sendOptimized
});
module.exports = __toCommonJS(index_exports);

// src/encoder.js
var import_msgpackr = require("msgpackr");
var import_util = require("util");
var import_zlib = __toESM(require("zlib"), 1);
var compress = (0, import_util.promisify)(import_zlib.default.brotliCompress);
var packr = new import_msgpackr.Packr({ useRecords: false });
async function encodeData(data) {
  const jsonStr = JSON.stringify(data);
  const size = Buffer.byteLength(jsonStr, "utf8");
  if (size < 5 * 1024) {
    return {
      payload: jsonStr,
      type: "application/json",
      encoding: null
    };
  }
  const packed = packr.pack(data);
  if (size <= 50 * 1024) {
    return {
      payload: packed,
      type: "application/x-msgpack",
      encoding: null
    };
  }
  const compressed = await compress(packed);
  return {
    payload: compressed,
    type: "application/x-msgpack",
    encoding: "br"
  };
}

// src/server.js
async function sendOptimized(res, data) {
  try {
    const { payload, type, encoding } = await encodeData(data);
    res.setHeader("Content-Type", type);
    if (encoding) {
      res.setHeader("Content-Encoding", encoding);
    }
    if (typeof res.send === "function") {
      res.send(payload);
    } else {
      res.end(payload);
    }
  } catch (error) {
    if (typeof res.status === "function") {
      res.status(500).json({ error: "Failed to optimize response" });
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Failed to optimize response" }));
    }
  }
}

// src/middleware.js
function optimizedMiddleware(req, res, next) {
  res.sendOptimized = function(data) {
    return sendOptimized(res, data);
  };
  next();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  optimizedMiddleware,
  sendOptimized
});
