import express from "express";
import { connectDb } from "./utils/db";
import { UserModel, ContentModel } from "./models/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userMiddleware } from "./middlewares/userMiddleware";
import cors from "cors";
import { signupSchema, signinSchema } from "./utils/zodValidation";
import { z } from "zod";
import contentMiddleware from "./middlewares/contentMiddleware";

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      username: string;
    }
  }
}

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://brainly-pas5.vercel.app", // Vercel frontend
      
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies or JWT tokens)
  })
);

app.use(express.json());

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

app.post("/api/v1/signup", async (req, res) => {
  try {
    // Validate the request body using Zod
    const { username, email, password } = signupSchema.parse(req.body);

    const existingUsername = await UserModel.findOne({ username });

    if (existingUsername) {
      res.status(403).json({
        message: "Username already taken, try other username",
        username: existingUsername,
      });
    } else {
      const existingUser = await UserModel.findOne({ email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
          username,
          email,
          password: hashedPassword,
        });

        res.status(201).json({
          message: "User signed up successfully!",
          username,
        });
      } else {
        res.status(403).json({
          message: "Account already exists",
          username: existingUser.username,
        });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        message: "Validation error",
        errors: error.errors, // Contains detailed validation errors
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (isMatch) {
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign(
          { id: existingUser._id, username: existingUser.username },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          message: "user signed in",
          token,
          username: existingUser.username,
        });
      } else {
        res.status(401).json({
          message: "invalid credential",
        });
      }
    } else {
      res.status(400).json({
        message: "Account Doesn't exist.",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        message: "Validation error",
        errors: error.errors, // Contains detailed validation errors
      });
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
});

app.post(
  "/api/v1/content",
  userMiddleware,
  contentMiddleware,
  async (req, res) => {
    try {
      const { link, type, title } = req.body;

      const existLink = await ContentModel.find({
        link,
        userId: req.userId,
      });

      if (existLink.length > 0) {
        res.status(409).json({
          message: "Content already exists",
        });
      } else {
        await ContentModel.create({
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
    } catch (error) {
      res.status(500).json({
        message: "something went wrong",
        error,
      });
      console.log(error);
    }
  }
);

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { filter } = req.query;

    const contents = await ContentModel.find({
      userId,
    }).populate("userId", "username");

    if (contents) {
      if (filter == "all") {
        res.status(200).json({
          contents,
        });
      } else if (filter == "youtube") {
        const youtubeContents = contents.filter(
          (content) => content.type === "youtube"
        );
        res.status(200).json({
          contents: youtubeContents,
        });
      } else if (filter == "tweet") {
        const tweetContents = contents.filter(
          (content) => content.type === "tweet"
        );
        res.status(200).json({
          contents: tweetContents,
        });
      } else {
        res.status(400).json({
          message: "No content created by the user | Wrong filter",
          filter,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { contentId } = req.body;

    const deleteContent = await ContentModel.deleteMany({
      _id: contentId,
      userId: req.userId,
    });

    if (deleteContent.deletedCount > 0) {
      res.status(200).json({
        message: "Content Deleted!",
      });
    } else {
      res.status(400).json({
        message: "No Content Found!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wRONG",
    });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  try {
    const { share } = req.body;

    if (share) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { isPublic: share },
        { new: true }
      );

      res.status(200).json({
        message: "set to public",
      });
    } else {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { isPublic: share },
        { new: true }
      );

      res.status(200).json({
        message: "set to private",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error,
    });
  }
});

app.get("/api/v1/brain/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userinfo = await UserModel.findOne({ username });

    if (userinfo) {
      if (userinfo.isPublic === true) {
        const contents = await ContentModel.find({ username });

        res.status(200).json({
          contents,
          message: "Contents fetched successfully 🎉",
        });
      } else {
        res.status(200).json({
          contents: [],
          message: "User Brain is Private 🤐",
        });
      }
    } else {
      res.status(204).json({
        contents: [],
        message: "No users found with this username 💀",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      contents: [],
      message: "Something went wrong | server error",
    });
  }
});

app.get("/api/v1/getuserinfo", userMiddleware, async (req, res) => {
  try {
    const userInfo = await UserModel.findOne({ _id: req.userId }).select(
      "username isPublic"
    );

    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User Details Found",
      userInfo,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});

