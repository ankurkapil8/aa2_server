var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var SchemeModel = require('../models/RdSchemeModel');
const { async } = require("q");

app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        scheme_code: Joi.required(),
        interest_rate:Joi.required(),
      }).unknown(true); 

      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await SchemeModel.save(req.body);
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
        let response = await SchemeModel.getAll();
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
        let response = await SchemeModel.deleteScheme(req.params.id);
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