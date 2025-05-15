"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(411).json({
            msg: "Invalid Token"
        });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, "secret");
        if (payload) {
            //@ts-ignore
            req.id = payload.id;
            next();
        }
    }
    catch (error) {
        throw new Error("You are not Logged In ");
    }
}
