"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        console.log("Need to login first to use this route");
    }
    next();
}
