import { encodeData } from './encoder.js';

/**
 * Formats and sends a response utilizing payload optimization.
 *
 * @param {import('http').ServerResponse | import('express').Response} res
 * @param {any} data
 */
export async function sendOptimized(res, data) {
    try {
        const { payload, type, encoding } = await encodeData(data);

        res.setHeader('Content-Type', type);
        if (encoding) {
            res.setHeader('Content-Encoding', encoding);
        }

        // Support both Express.js and raw Node.js ServerResponse
        if (typeof res.send === 'function') {
            res.send(payload);
        } else {
            res.end(payload);
        }
    } catch (error) {
        if (typeof res.status === 'function') {
            res.status(500).json({ error: 'Failed to optimize response' });
        } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to optimize response' }));
        }
    }
}
