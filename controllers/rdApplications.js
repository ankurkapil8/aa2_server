var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var RdApplicationModel = require('../models/RdApplicationModel');
var AccountDepositedModel = require('../models/AccountDepositedModel');

const { async } = require("q");
const calculateMaturity = require("../util/calculateMaturity");

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
        let formatedRes = response.map(account=>{
          let maturity = calculateMaturity.maturity(account);
          account["maturity_amount"] = maturity;
          return account;
        })
        return res.status(200).json({
            message: formatedRes
          });
      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  app.get("/entryById/:id", async(req, res, next) => {
    try{
        let queryParam=`id = ${req.params.id}`
        let response = await RdApplicationModel.getAll(queryParam);
          if(response[0]){
            let maturity = calculateMaturity.maturity(response[0]);
            response[0]["maturity_amount"] = maturity;
          }
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

  app.post("/approveAccount", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
        actionType:Joi.required(),
        agent_id:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await RdApplicationModel.approveAccount(req.body.id, req.body.actionType, req.body.agent_id);

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

  app.get("/calculateCloseAmount/:accountId", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        accountId: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body.params, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let queryParam=`id = ${req.params.accountId}`
        let response = await RdApplicationModel.getAll(queryParam);
        let totalMatureAmount = 0;
          if(response[0]){
            let qyeryWhere = `account_number="${response[0].account_number}" AND is_deposited=1`; 
            let depositedDetails = await AccountDepositedModel.getAll(qyeryWhere);
            depositedDetails.map(data=>{
              let payload = {
                ...response[0],
                "deposited_date":data.deposited_date
              }
              totalMatureAmount +=calculateMaturity.calculatCloseAmount(payload);
            })
          }


        return res.status(200).json({
            message: totalMatureAmount
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