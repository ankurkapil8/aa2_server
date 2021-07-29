var express = require("express");
const app = express();
const router = express.Router();
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");
const PaymentModel = require("../models/PaymentModel");
const Joi = require('@hapi/joi');
var Razorpay = require("razorpay");
var config = require('./../env.json')[process.env.NODE_ENV || 'development'];

//import {KEY_ID, KEY_SECRET} from '../config-payment'
router.post("/food-create-order-no", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            amount: Joi.number().required(),
            orderForService:Joi.string().required(),
        }).unknown(true);
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
    
        var instance = new Razorpay({ key_id: config.RAZORPAY_KEY_ID, key_secret: config.RAZORPAY_KEY_SECRET })
        var options = {
          amount: req.body.amount*100,  // amount in the smallest currency unit
          currency: "INR",
          receipt: `order_rcptid_${Date.now()}_${req.body.amount}`
        };
        instance.orders.create(options, function(err, order) {
            if(err){
                return res.status(500).json({
                    message:err
                });
    
            }else{
                var paymentObj = new PaymentModel({amount:req.body.amount,razorpay_order_id:order.id,orderForService:req.body.orderForService});
                paymentObj.save(function (err) {
                    if (err) {
                      return res.status(500).json({
                        message: err
                      });
                    } else {
                      return res.status(200).json({
                        record: order
                      });
                    }
                })
            }
        });
            
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
        
    }
  
})
router.post("/updatePaymentStatus", (req, res, next) => {
    const joiSchema = Joi.object({
        razorpay_order_id: Joi.string().required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
        return res.status(500).json({
            message: validationResult.error.details
        });
    }
    PaymentModel.updateOne({razorpay_order_id:req.body.razorpay_order_id},req.body,function (err) {
        if (err) {
            return res.status(500).json({
                message: err
            });
        } else {
            return res.status(200).json({
                record: "Payment status updated successfully."
            });
        }
    })



})
    module.exports = router;