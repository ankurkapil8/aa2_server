var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var ProcessingFeeModel = require('../models/ProcessingFeeModel');
const { async } = require("q");

app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        amount: Joi.required(),
        date_of_processing: Joi.required(),

      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      //const groupCode = `${req.body.group_name}_${new Date().getTime()}`;
      const created_at = new Date().getTime();
      var formatedData = {
        // created_at:created_at,
        status:0,
        ...req.body
      }
      try{
        let response = await ProcessingFeeModel.save(formatedData);
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }
  
  });

  app.get("/entry", async(req, res, next) => {
    try{
        let response = await ProcessingFeeModel.getAll();
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })
  module.exports = app;