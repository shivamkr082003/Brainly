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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const userMiddleware_1 = require("./middlewares/userMiddleware");
const schema_1 = require("./models/schema");
const db_1 = require("./utils/db");
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000', // local frontend
    'https://brainly-liart.vercel.app', // deployed frontend
    'https://your-frontend-url.vercel.app', // deployed frontend (example)
    // Add more allowed origins as needed
];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        // Allow all Vercel domains
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }
        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow all for now, you can restrict later
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Handle preflight requests
app.options('*', (0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({ message: "Brainly API is running" });
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        name: zod_1.z.string().min(2),
    });
    const parsed = requireBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid input",
            error: parsed.error,
        });
        return;
    }
    const { email, password, name } = parsed.data; // ✅ FIX
    try {
        const existingUser = yield schema_1.UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists. Please sign in.",
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield schema_1.UserModel.create({
            email,
            password: hashedPassword,
            name,
        });
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (e) {
        console.error("Signup error:", e); // 🔥 VERY IMPORTANT
        res.status(500).json({
            message: "Error creating user",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    });
    const parseDataWithSuccess = requireBody.safeParse(req.body);
    if (!parseDataWithSuccess.success) {
        res.status(400).json({
            message: "Invalid input",
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = yield schema_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "User not found. Please sign up.",
            });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({
                message: "Invalid credentials",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
            message: "Signed in successfully",
        });
    }
    catch (e) {
        console.error("🔥 SIGNUP ERROR FULL 👉", e);
        res.status(500).json({
            message: "Error creating user",
            error: String(e),
        });
    }
}));
app.post("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield schema_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield schema_1.ContentModel.find({
        userId: userId
    }).populate("userId", "name email");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield schema_1.ContentModel.deleteMany({
        _id: contentId,
        userId: req.userId
    });
    res.json({
        message: "Message as been Deleted",
    });
}));
app.post("/api/v1/brain/share", userMiddleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    try {
        if (share) {
            const existingLink = yield schema_1.LinkModel.findOne({
                userId: req.userId
            });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                });
                return;
            }
            const hash = crypto_1.default.randomBytes(10).toString("hex");
            yield schema_1.LinkModel.create({
                userId: req.userId,
                hash: hash
            });
            res.json({
                hash: hash
            });
        }
        else {
            yield schema_1.LinkModel.deleteOne({
                userId: req.userId,
            });
            res.json({
                message: "Share link removed"
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Error creating share link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield schema_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    const content = yield schema_1.ContentModel.find({
        userId: link.userId
    });
    const user = yield schema_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "User not found"
        });
        return;
    }
    res.json({
        name: user.name,
        email: user.email,
        content: content
    });
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
    (0, db_1.connectDb)();
});
