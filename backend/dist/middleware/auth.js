"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const header = req.header("Authorization");
    if (!header)
        return res.status(401).json({ message: "No token" });
    const token = header.replace("Bearer ", "");
    try {
        const secret = process.env.JWT_SECRET || "changeme";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = { id: payload.id, role: payload.role };
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.auth = auth;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Not authenticated" });
        if (req.user.role !== role)
            return res.status(403).json({ message: "Forbidden" });
        return next();
    };
};
exports.requireRole = requireRole;
