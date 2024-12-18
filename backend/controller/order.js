const express = require('express');
const router = express.Router();
const ErrorHandler = require('../ultis/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { isAuthenticated, isSeller, isAdmin } = require('../middleware/auth');
const Order = require('../model/order');
const Shop = require('../model/shop');
const Product = require('../model/product');

// create new order
router.post(
  '/create-order',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });

        // Update stock and sold_out for each product
        for (const item of items) {
          const product = await Product.findById(item._id); // Ensure you use _id, not productId

          // Check if the product exists
          if (!product) {
            return next(
              new ErrorHandler('Không tìm thấy ID đơn hàng: ' + item._id, 404)
            );
          }

          // Check if there's enough stock
          if (product.stock >= item.qty) {
            // Decrease stock and increase sold_out
            product.stock -= item.qty;
            product.sold_out += item.qty;

            await product.save();
          } else {
            // If stock is not enough, throw an error
            return next(
              new ErrorHandler(
                'Not enough stock for product: ' + product.name,
                400
              )
            );
          }
        }

        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// //create new order
// router.post(
//   '/create-order',
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

//       //   group cart items by shopId
//       const shopItemsMap = new Map();

//       for (const item of cart) {
//         const shopId = item.shopId;
//         if (!shopItemsMap.has(shopId)) {
//           shopItemsMap.set(shopId, []);
//         }
//         shopItemsMap.get(shopId).push(item);
//       }

//       // create an order for each shop
//       const orders = [];

//       for (const [shopId, items] of shopItemsMap) {
//         const order = await Order.create({
//           cart: items,
//           shippingAddress,
//           user,
//           totalPrice,
//           paymentInfo,
//         });
//         orders.push(order);
//       }

//       res.status(201).json({
//         success: true,
//         orders,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// get all orders of user
router.get(
  '/get-all-orders/:userId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ 'user._id': req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  '/get-seller-all-orders/:shopId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        'cart.shopId': req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  '/update-order-status/:id',
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng có ID này', 400));
      }
      if (req.body.status === 'Đã chuyển cho đối tác giao hàng') {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === 'Đã giao hàng') {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = 'Thành Công';
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance += amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  '/order-refund/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng có ID này', 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: 'Yêu cầu hoàn tiền đơn hàng đã thành công!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  '/order-refund-success/:id',
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng có ID này', 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Hoàn tiền đơn hàng thành công!',
      });

      if (req.body.status === 'Đã hoàn tiền') {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  '/admin-all-orders',
  isAuthenticated,
  isAdmin('Admin'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
