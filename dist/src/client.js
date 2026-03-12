// src/client.js
import { Unpackr } from "msgpackr";
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
    const unpackr = new Unpackr({ useRecords: false });
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
export {
  fetchOptimized
};
