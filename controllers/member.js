var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");


app.get("/entry/:member_id", async(req, res, next) => {
    try{ 
      let filter = "1=1";
      console.log(req.params)
      if(req.params.member_id!="all"){
        filter = `member_id= ${req.params.member_id}`
      }
        let response = await MemberModel.getAll(filter);
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
  app.delete("/entry/:member_id", async(req, res, next) => {
    try{
        const joiSchema = Joi.object({
          member_id: Joi.required(),
          }).unknown(true);  
          const validationResult = joiSchema.validate(req.params, { abortEarly: false });
          if(validationResult.error){
            return res.status(500).json({
              message: validationResult.error.details
            });        
          }
    
        let response = await MemberModel.deleteMember(req.params.member_id);
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