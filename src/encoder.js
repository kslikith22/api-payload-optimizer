import { Packr } from 'msgpackr';
import { promisify } from 'util';
import zlib from 'zlib';

const compress = promisify(zlib.brotliCompress);
const packr = new Packr({ useRecords: false });

/**
 * Encodes and conditionally compresses the payload.
 *
 * Optimization rules:
 * - response < 5 KB -> literal JSON (returns string)
 * - response 5–50 KB -> MessagePack only (returns buffer)
 * - response > 50 KB -> MessagePack + Brotli (returns buffer)
 *
 * @param {any} data
 * @returns {Promise<{ payload: Buffer | string, type: string, encoding: string | null }>}
 */
export async function encodeData(data) {
    const jsonStr = JSON.stringify(data);
    const size = Buffer.byteLength(jsonStr, 'utf8');

    // response < 5 KB -> normal JSON
    if (size < 5 * 1024) {
        return {
            payload: jsonStr,
            type: 'application/json',
            encoding: null
        };
    }

    const packed = packr.pack(data);

    // response 5–50 KB -> MessagePack only
    if (size <= 50 * 1024) {
        return {
            payload: packed,
            type: 'application/x-msgpack',
            encoding: null
        };
    }

    // response > 50 KB -> MessagePack + Brotli
    const compressed = await compress(packed);
    return {
        payload: compressed,
        type: 'application/x-msgpack',
        encoding: 'br'
    };
}
