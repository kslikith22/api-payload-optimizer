import { sendOptimized } from './server.js';

/**
 * Express middleware that attaches `res.sendOptimized(data)` to the response.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function optimizedMiddleware(req, res, next) {
    res.sendOptimized = function (data) {
        return sendOptimized(res, data);
    };
    next();
}
