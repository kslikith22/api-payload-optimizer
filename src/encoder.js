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
    // 1. Pack immediately. msgpackr is exponentially faster than JSON.stringify for large objects.
    const packed = packr.pack(data);
    const size = packed.byteLength;

    // response < 5 KB -> normal JSON (lazy evaluate stringify only when needed)
    if (size < 5 * 1024) {
        return {
            payload: JSON.stringify(data),
            type: 'application/json',
            encoding: null
        };
    }

    // response 5–50 KB -> MessagePack only
    if (size <= 50 * 1024) {
        return {
            payload: packed,
            type: 'application/x-msgpack',
            encoding: null
        };
    }

    // response > 50 KB -> MessagePack + Brotli
    // Tune Brotli to favor execution speed (default is max compression 11, which takes several seconds on MBs of bytes)
    const compressed = await compress(packed, {
        params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // Quality 4 is the optimal balance of speed and size for API responses
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC
        }
    });

    return {
        payload: compressed,
        type: 'application/x-msgpack',
        encoding: 'br'
    };
}
