"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "1h";
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
// REGISTER
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ message: "Missing fields" });
    const existing = await user_model_1.default.findOne({ email });
    if (existing)
        return res.status(409).json({ message: "Email already exists" });
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.default.create({
        name,
        email,
        passwordHash: hash,
        role,
    });
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.status(201).json({
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        token,
    });
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.json({
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
    });
};
exports.login = login;
// ME
const me = async (req, res) => {
    const header = req.header("Authorization");
    if (!header)
        return res.status(401).json({ message: "No token" });
    const token = header.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_model_1.default.findById(payload.id).select("-passwordHash");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.me = me;
