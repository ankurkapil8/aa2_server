var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");


app.get("/entry", async(req, res, next) => {
    try{
        let response = await MemberModel.getAll();
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })
  app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        enrollment_date: Joi.required(),
        member_name:Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      var formatedData = {
        status:0,
        ...req.body
      }
      try{
        let response = await MemberModel.save(formatedData);
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

  module.exports = app;