"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../user/dto/user.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || '');
            req.user = yield user_model_1.default.findById(decode.sub).select("-password");
            if (!req.user || req.user == null) {
                res.status(404);
                throw new Error("user is not found");
            }
            next();
        }
        catch (error) {
            console.log(error);
            res.status(403).json({ message: "Not Authorized,token expire" });
        }
    }
    if (!token) {
        res.status(403);
        throw new Error("Not authorized, no token");
    }
}));
exports.protect = protect;
const admin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user && req.user.isAdmin == false || req.user.isAdmin == true) {
        next();
    }
    else {
        res.status(403);
        throw new Error("User is not authenticated");
    }
}));
exports.admin = admin;
