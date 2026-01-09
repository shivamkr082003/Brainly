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
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const schema_1 = require("./models/schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userMiddleware_1 = require("./middlewares/userMiddleware");
const cors_1 = __importDefault(require("cors"));
const zodValidation_1 = require("./utils/zodValidation");
const zod_1 = require("zod");
const contentMiddleware_1 = __importDefault(require("./middlewares/contentMiddleware"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://brainly-pas5.vercel.app", // Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies or JWT tokens)
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to Brainly API | Backend Server is up and running.",
    });
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is healthy and running on Render!",
        uptime: process.uptime(), // Time the server has been running in seconds
        timestamp: new Date().toISOString(), // Current server time
    });
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body using Zod
        const { username, email, password } = zodValidation_1.signupSchema.parse(req.body);
        const existingUsername = yield schema_1.UserModel.findOne({ username });
        if (existingUsername) {
            res.status(403).json({
                message: "Username already taken, try other username",
                username: existingUsername,
            });
        }
        else {
            const existingUser = yield schema_1.UserModel.findOne({ email });
            if (!existingUser) {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                yield schema_1.UserModel.create({
                    username,
                    email,
                    password: hashedPassword,
                });
                res.status(201).json({
                    message: "User signed up successfully!",
                    username,
                });
            }
            else {
                res.status(403).json({
                    message: "Account already exists",
                    username: existingUser.username,
                });
            }
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Handle validation errors
            res.status(400).json({
                message: "Validation error",
                errors: error.errors, // Contains detailed validation errors
            });
        }
        else {
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield schema_1.UserModel.findOne({ email });
        if (existingUser) {
            const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
            if (isMatch) {
                if (!process.env.JWT_SECRET) {
                    throw new Error("JWT_SECRET is not defined");
                }
                const token = jsonwebtoken_1.default.sign({ id: existingUser._id, username: existingUser.username }, process.env.JWT_SECRET);
                res.status(200).json({
                    message: "user signed in",
                    token,
                    username: existingUser.username,
                });
            }
            else {
                res.status(401).json({
                    message: "invalid credential",
                });
            }
        }
        else {
            res.status(400).json({
                message: "Account Doesn't exist.",
            });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Handle validation errors
            res.status(400).json({
                message: "Validation error",
                errors: error.errors, // Contains detailed validation errors
            });
        }
        else {
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }
}));
app.post("/api/v1/content", userMiddleware_1.userMiddleware, contentMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title } = req.body;
        const existLink = yield schema_1.ContentModel.find({
            link,
            userId: req.userId,
        });
        if (existLink.length > 0) {
            res.status(409).json({
                message: "Content already exists",
            });
        }
        else {
            yield schema_1.ContentModel.create({
                link,
                type,
                title,
                userId: req.userId,
                username: req.username,
            });
            res.status(200).json({
                message: "Content Added",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error,
        });
        console.log(error);
    }
}));
app.get("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const { filter } = req.query;
        const contents = yield schema_1.ContentModel.find({
            userId,
        }).populate("userId", "username");
        if (contents) {
            if (filter == "all") {
                res.status(200).json({
                    contents,
                });
            }
            else if (filter == "youtube") {
                const youtubeContents = contents.filter((content) => content.type === "youtube");
                res.status(200).json({
                    contents: youtubeContents,
                });
            }
            else if (filter == "tweet") {
                const tweetContents = contents.filter((content) => content.type === "tweet");
                res.status(200).json({
                    contents: tweetContents,
                });
            }
            else {
                res.status(400).json({
                    message: "No content created by the user | Wrong filter",
                    filter,
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
}));
app.delete("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.body;
        const deleteContent = yield schema_1.ContentModel.deleteMany({
            _id: contentId,
            userId: req.userId,
        });
        if (deleteContent.deletedCount > 0) {
            res.status(200).json({
                message: "Content Deleted!",
            });
        }
        else {
            res.status(400).json({
                message: "No Content Found!",
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Something went wRONG",
        });
    }
}));
app.post("/api/v1/brain/share", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        if (share) {
            const updatedUser = yield schema_1.UserModel.findByIdAndUpdate(req.userId, { isPublic: share }, { new: true });
            res.status(200).json({
                message: "set to public",
            });
        }
        else {
            const updatedUser = yield schema_1.UserModel.findByIdAndUpdate(req.userId, { isPublic: share }, { new: true });
            res.status(200).json({
                message: "set to private",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            error,
        });
    }
}));
app.get("/api/v1/brain/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const userinfo = yield schema_1.UserModel.findOne({ username });
        if (userinfo) {
            if (userinfo.isPublic === true) {
                const contents = yield schema_1.ContentModel.find({ username });
                res.status(200).json({
                    contents,
                    message: "Contents fetched successfully 🎉",
                });
            }
            else {
                res.status(200).json({
                    contents: [],
                    message: "User Brain is Private 🤐",
                });
            }
        }
        else {
            res.status(204).json({
                contents: [],
                message: "No users found with this username 💀",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            contents: [],
            message: "Something went wrong | server error",
        });
    }
}));
app.get("/api/v1/getuserinfo", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield schema_1.UserModel.findOne({ _id: req.userId }).select("username isPublic");
        if (!userInfo) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User Details Found",
            userInfo,
        });
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.listen(3000, () => {
    console.log("server running succesfull");
    (0, db_1.connectDb)();
});
