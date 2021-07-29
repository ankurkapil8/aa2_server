var express = require("express");
const app = express.Router();
const db = require("../config");
const CategoryModel = require("../models/CategoryModel");
const Joi = require('@hapi/joi');

app.post("/category", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            name: Joi.string().required(),
        });
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        newCat = new CategoryModel({ name: req.body.name });
        newCat.save(function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    message: "Category created successfully"
                });
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
app.get("/category", (req, res, next) => {
    try {
        CategoryModel.find({},function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: category
                });
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

app.delete("/category", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            name: Joi.string().required(),
        });
        const validationResult = joiSchema.validate(req.query, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        CategoryModel.deleteOne({name:req.query.name},function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: "Category deleted successfully."
                });
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

app.put("/category", (req, res, next) => {
    try {
        const joiSchema = Joi.object({
            name: Joi.string().required(),
            _id:Joi.string().required()
        });
        const validationResult = joiSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(500).json({
                message: validationResult.error.details
            });
        }
        CategoryModel.updateOne({_id:req.body._id},{name:req.body.name},function (err) {
            if (err) {
                return res.status(500).json({
                    message: err
                });
            } else {
                return res.status(200).json({
                    record: "Category updated successfully."
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