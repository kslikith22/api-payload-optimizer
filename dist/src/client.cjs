var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.js
var client_exports = {};
__export(client_exports, {
  fetchOptimized: () => fetchOptimized
});
module.exports = __toCommonJS(client_exports);
var import_msgpackr = require("msgpackr");
async function fetchOptimized(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/x-msgpack, application/json");
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const contentLength = response.headers.get("content-length");
  const compressedBytes = contentLength ? parseInt(contentLength, 10) : null;
  if (contentType.includes("application/x-msgpack")) {
    const arrayBuffer = await response.arrayBuffer();
    const size = arrayBuffer.byteLength;
    const unpackr = new import_msgpackr.Unpackr({ useRecords: false });
    return {
      data: unpackr.unpack(new Uint8Array(arrayBuffer)),
      compression: { compressedBytes }
    };
  }
  const text = await response.text();
  return {
    data: JSON.parse(text),
    compression: { compressedBytes }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchOptimized
});
