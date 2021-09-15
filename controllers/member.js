var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");
var GroupLoanModel = require('../models/GroupLoanModel');


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

  app.put("/entry/:member_id", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        member_id: Joi.required(),
        }).unknown(true);  
        const validationResult = joiSchema.validate(req.params, { abortEarly: false });
        if(validationResult.error){
          return res.status(500).json({
            message: validationResult.error.details
          });        
        }
      try{
        // let updateField = "";
        
        // for (const key of Object.keys(req.body)) {
        //   updateField = updateField+` "${key}"="${req.body[key]}",`;
        // }
        // console.log(updateField);        
        let response = await MemberModel.update(req.body, req.params.member_id);
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

  app.get("/loanByMember/:member_id", async(req, res, next) => {
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
        let filter = `loan.member_id=${req.params.member_id}`
        let response = await GroupLoanModel.getAll(filter);
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