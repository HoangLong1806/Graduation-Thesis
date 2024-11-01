const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../ultis/ErrorHandler");

//create Product
router.post("/create-product",upload.array("images"),catchAsyncErrors(async (req, res,next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop id is invalid", 404));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.fileName}`);
        const productDate = req.body;
        productDate.images = imageUrls;
        productDate.shop = shop;

        const product = await Product.create(productDate);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


module.exports = router; 