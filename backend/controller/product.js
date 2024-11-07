const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../ultis/ErrorHandler");
const { isSeller } = require("../middleware/auth");

//create Product
router.post("/create-product", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Shop id is invalid", 404));
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
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
}));


// get all products
router.get("/get-all-products-shop/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));    


//delete product
router.delete("/delete-shop-product/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found with this id!", 500));

        }

        res.status(201).json({
            success: true,
            message: "Product is deleted",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))
module.exports = router;