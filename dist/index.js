// src/encoder.js
import { Packr } from "msgpackr";
import { promisify } from "util";
import zlib from "zlib";
var compress = promisify(zlib.brotliCompress);
var packr = new Packr({ useRecords: false });
async function encodeData(data) {
  const packed = packr.pack(data);
  const size = packed.byteLength;
  if (size < 5 * 1024) {
    return {
      payload: JSON.stringify(data),
      type: "application/json",
      encoding: null
    };
  }
  if (size <= 50 * 1024) {
    return {
      payload: packed,
      type: "application/x-msgpack",
      encoding: null
    };
  }
  const compressed = await compress(packed, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
      // Quality 4 is the optimal balance of speed and size for API responses
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC
    }
  });
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
export {
  optimizedMiddleware,
  sendOptimized
};
