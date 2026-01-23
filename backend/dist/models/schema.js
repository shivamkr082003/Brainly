"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_2.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
});
exports.UserModel = (0, mongoose_2.model)("User", userSchema);
const ContentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    tag: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    type: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', require: true }
});
exports.ContentModel = (0, mongoose_2.model)("Content", ContentSchema);
const LinkSchema = new mongoose_2.Schema(({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
}));
exports.LinkModel = (0, mongoose_2.model)("Links", LinkSchema);
