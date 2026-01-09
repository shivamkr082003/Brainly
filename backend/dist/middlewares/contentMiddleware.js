"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contentMiddleware = (req, res, next) => {
    const { link, type } = req.body;
    try {
        if (type === "youtube") {
            // Validate and extract videoId for YouTube URLs
            let videoId = null;
            try {
                const url = new URL(link);
                if (url.hostname === "youtu.be") {
                    // For share links: https://youtu.be/VIDEO_ID
                    videoId = url.pathname.slice(1);
                }
                else if (url.hostname === "www.youtube.com" ||
                    url.hostname === "youtube.com") {
                    // For watch links: https://www.youtube.com/watch?v=VIDEO_ID
                    if (url.pathname.startsWith("/watch")) {
                        videoId = url.searchParams.get("v");
                    }
                    // For Shorts links: https://www.youtube.com/shorts/VIDEO_ID
                    else if (url.pathname.startsWith("/shorts")) {
                        videoId = url.pathname.split("/")[2]; // Extract the ID from the path
                    }
                }
                // Check if videoId is valid
                if (!videoId || videoId.length !== 11) {
                    res.status(400).json({
                        message: "Invalid YouTube link",
                    });
                    return;
                }
                // Update the link to the embed URL
                req.body.link = `https://www.youtube.com/embed/${videoId}`;
            }
            catch (error) {
                res.status(400).json({
                    message: "Invalid YouTube link format",
                });
                return;
            }
        }
        else if (type === "tweet") {
            // Validate Twitter or X links
            try {
                let url = new URL(link);
                if (url.hostname === "x.com") {
                    // Replace x.com with twitter.com
                    url.hostname = "twitter.com";
                    req.body.link = url.toString();
                }
                // Ensure the link is a valid Twitter or X URL
                if (!["twitter.com"].includes(url.hostname)) {
                    res.status(400).json({
                        message: "Invalid Twitter/X link",
                    });
                    return;
                }
            }
            catch (error) {
                res.status(400).json({
                    message: "Invalid Twitter/X link format",
                });
                return;
            }
        }
        else {
            // If type is neither "youtube" nor "tweet"
            res.status(400).json({
                message: `Invalid content type: ${type}`,
            });
            return;
        }
        next(); // Proceed to the route handler if validation passes
    }
    catch (error) {
        console.error("Error in content validation middleware:", error);
        res.status(400).json({
            message: "Invalid link format",
        });
        return;
    }
};
exports.default = contentMiddleware;
