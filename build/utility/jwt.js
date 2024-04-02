"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (id) => {
    const payload = { sub: id };
    const options = {
        expiresIn: "7d",
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY || "", options);
};
exports.default = generateToken;
