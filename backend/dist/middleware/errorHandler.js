"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, req, res, next) {
    console.error("🔥 Global Error:", err);
    if (res.headersSent)
        return next(err);
    const status = err.statusCode || err.status || 500;
    res.status(status).json({
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
}
