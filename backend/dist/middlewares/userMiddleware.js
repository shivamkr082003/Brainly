"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (token) {
            const decodedId = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.userId = decodedId.id;
            req.username = decodedId.username;
            next();
        }
        else {
            res.status(401).json({
                message: "Please SignIn first to add your Brain",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something went Wrong",
            error
        });
    }
};
exports.userMiddleware = userMiddleware;
