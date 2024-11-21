const Conversation = require("../model/conversation");
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../ultis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Messages = require("../model/messages");
// create new message
router.post(
    "/create-new-message", upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const messageData = req.body;
            if (!req.files) {
                const files = req.files;
                const imageUrls = files.map((file) => `${file.fileName}`);
                messageData.images = imageUrls;
            }
            messageData.conversationId = req.params.conversationId;
            messageData.sender = req.body.sender;
            const message = new Messages({
                conversationId: messageData.conversationId,
                sender: messageData.sender,
                images: messageData.images ? messageData.images : undefined,
            });
            await message.save();
            res.status(201).json({
                success: true,
                message
            });
        } catch (error) {
            return next(new ErrorHandler(error.message), 500);
        }
    })
);




module.exports = router;