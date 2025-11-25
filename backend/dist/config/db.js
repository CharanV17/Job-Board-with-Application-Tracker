"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/jobboard";
    console.log(`Attempting to connect to MongoDB at ${uri.split('@').pop()}...`); // Log URI (hidden credentials)
    try {
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Fail fast after 5 seconds
        });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
