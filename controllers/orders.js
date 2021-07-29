var express = require("express");
const app = express();
const router = express.Router();
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const UserModel = require("../models/UserModel");
var sendObj = require("../util/sendMail")
var jwt = require('jsonwebtoken');
app.set('superSecret', "kanbafood");
const Joi = require('@hapi/joi');
router.post("/place-order", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            items: Joi.required(),
            shipping:Joi.required(),

        }).unknown(true);
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        var decoded = {};
        if(req.headers.token){
          decoded = jwt.verify(req.headers.token, app.get('superSecret'));
        }
        var priceTotal = req.body.items.reduce(
          (prevValue, currentValue) => prevValue + (currentValue.quantity * parseInt(currentValue.perItemPrice)),
          0
        );
        if(decoded != {} && decoded.isPrimeMember){
          priceTotal -= (priceTotal*10)/100
        }
      var orderObj = { 
          userId: decoded!={}?decoded.email:"", 
          items: req.body.items, 
          shipping: req.body.shipping, 
          isDiscountApplied:decoded != {}? decoded.isPrimeMember:false,
          totalBillAmount:priceTotal,
          paymentMode:req.body.paymentMode,
          razorpay_order_id:req.body.razorpay_order_id
        }
        var orderUser = new OrderModel(orderObj);
        orderUser.save(function (err) {
          if (err) {
            return res.status(500).json({
              message: err
            });
          } else {
            sendObj.sendMail(orderObj).then(res=>{
              console.log(res);
            }).catch(err=>{
              console.log(err);
            })            
            return res.status(200).json({
              message: "order placed successfully."
            });
          }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

router.get("/get-order", (req, res, next) => {
    try {
        var decoded = jwt.verify(req.headers.token, app.get('superSecret'));
        OrderModel.find({ userId: decoded.email }, function (err, orders) {
            if (err) {
                return res.status(500).json({
                  message: err
                });
              } else {
                return res.status(200).json({
                  record: orders
                });
              }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})
router.get("/admin-order-list", (req, res, next) => {
    try {
        var page =0;
        var numberofrows = 10;
        var totalOrders = 0;
        if(req.query.page !="" || req.query.page !=undefined){
          page = req.query.page;
        }
        var decoded = jwt.verify(req.headers.token, app.get('superSecret'));
        let startindex = page > 0 ? ((page)*numberofrows) : 0;

        OrderModel.count({}, function(err, orderCount) {
          if (err) {
              return res.status(500).json({
                message: err
              });
            } else {
              OrderModel.find({}, function (err, orders) {
                if (err) {
                    return res.status(500).json({
                      message: err
                    });
                  } else {
                    return res.status(200).json({
                      record: orders,
                      totalOrders:orderCount
                    });
                  }
                }).skip(startindex).limit(numberofrows);
            }
          });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

module.exports = router;