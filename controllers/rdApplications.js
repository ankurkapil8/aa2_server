var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var RdApplicationModel = require('../models/RdApplicationModel');
const { async } = require("q");

app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        account_holder_name: Joi.required(),
        rd_amount:Joi.required(),
        period:Joi.required(),
        tenure:Joi.required(),
        agent_id:Joi.required(),
      }).unknown(true); 

      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      
      try{
        let response = await RdApplicationModel.save(req.body);
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

  app.get("/entry/:agent_id", async(req, res, next) => {
    try{
        let queryParam = "1=1";
        if(req.params.agent_id!="all"){
            queryParam=`agent_id = ${req.params.agent_id}`
        }
        let response = await RdApplicationModel.getAll(queryParam);
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
        let response = await RdApplicationModel.deleteAccount(req.params.id);
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