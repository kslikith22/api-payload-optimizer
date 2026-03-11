import { Unpackr } from 'msgpackr';

/**
 * Performs an optimized fetch, requesting compressed MessagePack payloads and transparently deserializing them.
 * Native fetch in browsers and Node.js (18+) automatically handles Brotli decompression transparently.
 *
 * @param {string | URL | Request} url - The URL to fetch.
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @returns {Promise<{ data: any, compression: { compressedBytes: number | null } }>}
 */
export async function fetchOptimized(url, options = {}) {
    const headers = new Headers(options.headers || {});

    // Signal server that we accept messagepack
    headers.set('Accept', 'application/x-msgpack, application/json');

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    // Try to inspect the Content-Length header to determine network size, 
    // since decompressed streams mask network payloads in browsers.
    const contentLength = response.headers.get('content-length');
    const compressedBytes = contentLength ? parseInt(contentLength, 10) : null;

    if (contentType.includes('application/x-msgpack')) {
        const arrayBuffer = await response.arrayBuffer();
        const size = arrayBuffer.byteLength;



        // Both Browser and Node.js native fetch handle decompression transparently.
        // The browser removes "Content-Encoding: br" header and passes decompressed buffer.
        const unpackr = new Unpackr({ useRecords: false });
        return {
            data: unpackr.unpack(new Uint8Array(arrayBuffer)),
            compression: { compressedBytes }
        };
    }

    // Fallback if the server sent normal JSON
    const text = await response.text();

    return {
        data: JSON.parse(text),
        compression: { compressedBytes }
    };
}
