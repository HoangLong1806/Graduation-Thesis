const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../ultis/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");



//create coupoun code
router.post("/create-coupoun-code", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const isCoupounCodeExists = await CoupounCode.find({ name: req.body.name });
        
        if (isCoupounCodeExists) {
            return next(new ErrorHandler("Coupoun code already exists", 400));

        }
        const coupounCode = await CoupounCode.create(req.body);
        res.status(201).json({
            success: true,
            coupounCode,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }



}));