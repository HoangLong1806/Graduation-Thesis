const Conversation = require("../model/conversation");
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../ultis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller } = require("../middleware/auth");

router.post(
    "/create-new-conversation",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { groupTitle, userId, sellerId } = req.body;
  
        const isConversationExist = await Conversation.findOne({ groupTitle });
  
        if (isConversationExist) {
          const conversation = isConversationExist;
          res.status(201).json({
            success: true,
            conversation,
          });
        } else {
          const conversation = await Conversation.create({
            members: [userId, sellerId],
            groupTitle: groupTitle,
          });
  
          res.status(201).json({
            success: true,
            conversation,
          });
        }
      } catch (error) {
        return next(new ErrorHandler(error.response.message), 500);
      }
    })
);

// get seller conversations
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;