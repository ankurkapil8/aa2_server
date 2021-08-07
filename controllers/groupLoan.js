var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var GroupLoanModel = require('../models/GroupLoanModel');
const { async } = require("q");

// add loan application
app.post("/applyGroupLoan", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        application_date: Joi.required(),
        member_id:Joi.required(),
        scheme_id:Joi.required(),
        interest_rate:Joi.required(),
        loan_amount:Joi.required(),
        EMI_amount:Joi.required(),
        EMI_payout:Joi.required(),
        tenure:Joi.required(),

      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      var formatedData = {
        status:0,
        is_approved:0,
        is_disbursed:0,
        ...req.body
      }
      try{
        let response = await GroupLoanModel.save(formatedData);
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
  app.post("/approveLoan", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await GroupLoanModel.approveLoan(req.body.id);
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
  // disburse loan
  app.post("/disburseLoan", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await GroupLoanModel.disburseLoan(req.body.id);
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