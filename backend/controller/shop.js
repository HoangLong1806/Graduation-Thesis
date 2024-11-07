const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultis/sendMail");
const sendToken = require("../ultis/jwtToken");
const Shop = require( "../model/shop")
const {  isSeller, isAuthenticated } = require("../middleware/auth");
const { promiseHooks } = require("v8");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../ultis/ErrorHandler");
const sendShopToken = require("../ultis/shopToken");
//create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    // Lấy email và chuyển về chữ thường, loại bỏ khoảng trắng
    const email = req.body.email.trim().toLowerCase();
    const { name, password, phoneNumber, zipCode, address } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Người dùng đã tồn tại, vui lòng đăng nhập thay vì tạo tài khoản mới.",
      });
    }

    // Xử lý địa chỉ nếu nó là mảng
    let shopAddress = address;
    if (Array.isArray(shopAddress)) {
      shopAddress = shopAddress.join(", ");
    }

    // Tiếp tục tạo shop
    const filename = req.file.filename;
    const fileUrl = path.join("/uploads", filename);
    const public_id = filename;

    const seller = {
      name,
      email,
      password,
      avatar: {
        url: fileUrl,
        public_id,
      },
      address: shopAddress,
      phoneNumber,
      zipCode,
    };

    const activationToken = createActivationToken(seller);
    // const activationUrl = `http://localhost:3001/seller/activation/${activationToken}`;
    const isProduction = process.env.NODE_ENV === "production";
    const activationUrl = isProduction
      ? `https://graduation-thesis-chi.vercel.app/seller/activation/${activationToken}`
      : `http://localhost:3001/seller/activation/${activationToken}`;

    // Gửi email kích hoạt
    await sendMail({
      email: seller.email,
      subject: "Activate your account",
      message: `Hello ${seller.name}, please click on the link to activate your account: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Vui lòng kiểm tra email của bạn: ${seller.email} để kích hoạt shop!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// router.post("/create-shop", upload.single("file"), async (req, res, next) => {
//     try{
//          const{email} = req.body;
//          const sellerEmail = await Shop.findOne({email});
//          if (sellerEmail) {
//             const filename = req.file.filename;
//             const filePath = `uploads/${filename}`;
//             fs.unlink(filePath, (err) => {
//               if (err) {
//                 console.log(err);
//                 return res.status(500).json({ message: "Error deleting file" });
//               }
//             });
//             return next(new ErrorHandler("User already exists", 400));
//           }
//            // Kiểm tra nếu địa chỉ chưa được cung cấp
//         if (!address) {
//           return res.status(400).json({ message: "Địa chỉ không được xác định" });
//       }
//     // Chuyển đổi địa chỉ thành chuỗi nếu nó là mảng
//     let shopAddress = address;
//     if (Array.isArray(shopAddress)) {
//         shopAddress = shopAddress.join(", "); // Nối các phần tử của mảng thành một chuỗi
//     }
//           // If email doesn't exist, create a new user
//     const filename = req.file.filename;
//     const fileUrl = path.join("/uploads", filename);

//     const public_id = filename;

//     const seller = {
//       name: req.body.name,
//       email: email,
//       password: req.body.password,
//       avatar: {
//         url: fileUrl,
//         public_id,
//       },
//       address: shopAddress,
//       phoneNumber: req.body.phoneNumber,
//         zipCode: req.body.zipCode,
//     };
//     const activationToken = createActivationToken(seller);

//     const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

//      try {
//       await sendMail({
//         email: seller.email,
//         subject: "Activate your account",
//         message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
//       });
//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${seller.email} to activate your shop !`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }

//     }catch(error){
//         return next(new ErrorHandler(error.message, 400));
//     }
// });

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      // Verify the activation token
      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Token không hợp lệ", 400));
      }

      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      // Check if the user already exists before activation
      let seller = await Shop.findOne({ email: email });

      if (seller) {
        return next(new ErrorHandler("Người dùng đã tồn tại", 400));
      }

      // Create a new shop after activation
      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      // Send token after successful activation
      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login shop

router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id); // Sử dụng req.seller

      if (!seller) {
        return next(new ErrorHandler("seller doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out shop
router.get(
  "/logout",
  
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Logged out",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
