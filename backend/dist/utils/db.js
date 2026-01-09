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
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //connect to database
            const mongoUrL = process.env.MONGO_URL;
            if (!mongoUrL) {
                throw new Error("MONGO_URL is not defined in the environment variables");
            }
            const connection = yield mongoose_1.default.connect(mongoUrL);
            mongoose_1.default.set('strictPopulate', false);
            if (connection) {
                console.log('Database connected succesfully.');
            }
        }
        catch (error) {
            console.log("Error connecting Database serverside.");
        }
    });
}
