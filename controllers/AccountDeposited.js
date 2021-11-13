var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var AccountDepositedModel = require('../models/AccountDepositedModel.js');
const { async } = require("q");

app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        account_number: Joi.required(),
        agent_id:Joi.required(),
        deposited_amount:Joi.required(),
        deposited_date:Joi.required(),
        is_account_open_amount:Joi.required()
      }).unknown(true); 

      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await AccountDepositedModel.save(req.body);
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
  app.put("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        account_number: Joi.required(),
        deposited_date: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await AccountDepositedModel.update(req.body);
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
        let response = await AccountDepositedModel.getAll();
        return res.status(200).json({
            message: response
          });
      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })
  app.get("/entryByAccount/:account_number", async(req, res, next) => {
    try{
        const joiSchema = Joi.object({
            account_number: Joi.required(),
          }).unknown(true);  
          const validationResult = joiSchema.validate(req.params, { abortEarly: false });
          if(validationResult.error){
            return res.status(500).json({
              message: validationResult.error.details
            });        
          }
          let payload = `account_number="${req.params.account_number}"`;
        let response = await AccountDepositedModel.getAll(payload);
        return res.status(200).json({
            message: response
          });
      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  app.delete("/entry/:id", async(req, res, next) => {
    try{
        const joiSchema = Joi.object({
            id: Joi.required(),
          }).unknown(true);  
          const validationResult = joiSchema.validate(req.params, { abortEarly: false });
          if(validationResult.error){
            return res.status(500).json({
              message: validationResult.error.details
            });        
          }
        let response = await AccountDepositedModel.deleteDeposit(req.params.id);
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