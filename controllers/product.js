var express = require("express");
const app = express.Router();
const db = require("../config");
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");
const Joi = require('@hapi/joi');
app.post("/products", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            title: Joi.string().required(),
            category:Joi.string().required()
        }).unknown(true);
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        var productObj = {
            category : req.body.category !=""?req.body.category:"",
            description : req.body.description !=""?req.body.description:"",
            imageUrl : req.body.imageUrl !=""?req.body.imageUrl:"",
            price : req.body.price !=""?req.body.price:"",
            title : req.body.title !=""?req.body.title:"",
      
        }
        newProduct = new ProductModel(productObj);
        newProduct.save(function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    message: "product created successfully"
                });
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
app.get("/products", (req, res, next) => {
    try {
        let query = {};
        if(req.query.category !="" && req.query.category !=undefined){
            query = {category:req.query.category};
        }
        ProductModel.find(query,function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: products
                });
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

app.delete("/products", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            title: Joi.string().required(),
        });
        const validationResult = joiSchema.validate(req.query, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        ProductModel.deleteOne({title:req.query.title},function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: "Product deleted successfully."
                });
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

app.put("/products", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            _id:Joi.string().required()
        }).unknown(true);;
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        ProductModel.updateOne({_id:req.body._id},req.body,function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: "Product updated successfully."
                });
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

module.exports = app;