import { Unpackr } from 'msgpackr';
import { promisify } from 'util';
import zlib from 'zlib';

const decompress = promisify(zlib.brotliDecompress);
const unpackr = new Unpackr({ useRecords: false });

/**
 * Decodes a buffer conditionally.
 * If Brotli encoding is detected, it decompresses first before decoding MessagePack.
 *
 * @param {Buffer} buffer
 * @param {string} encoding
 * @returns {Promise<any>}
 */
export async function decodeBuffer(buffer, encoding) {
    if (encoding && encoding.includes('br')) {
        buffer = await decompress(buffer);
    }
    return unpackr.unpack(buffer);
}
