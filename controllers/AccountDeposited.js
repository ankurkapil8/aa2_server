var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
const SmsApi = require("../util/SmsApi");
var AccountDepositedModel = require('../models/AccountDepositedModel.js');
var RdApplicationModel = require('../models/RdApplicationModel.js');

const { async } = require("q");
const moment = require("moment"); 
app.post("/entry", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        account_number: Joi.required(),
        agent_id:Joi.required(),
        deposited_amount:Joi.required(),
        deposited_date:Joi.required(),
        is_deposited:Joi.required(),
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
        let accountDetails = await RdApplicationModel.getAll(`account_number="${req.body.account_number}"`);
        if(accountDetails[0].phone){
          let payload = {
            "messageVar":`${accountDetails[0].account_holder_name}|${accountDetails[0].account_number}|${req.body.deposited_amount}|${moment().format("DD-MM-YYYY").toString()}|${accountDetails[0].totalDeposited}`,
            "phone":accountDetails[0].phone
          }
          console.log(payload);
          SmsApi.sendAccountDeposit(payload);
        }
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

  app.get("/entry/:id", async(req, res, next) => {
    try{
      let queryParam = "1=1";
      if(req.params.agent_id!="all"){
          queryParam=`dp.agent_id = ${req.params.agent_id}`
      }
        let response = await AccountDepositedModel.getAll(queryParam);
        return res.status(200).json({
            message: response
          });
      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })
  app.get("/entryByDate/:agent_id/:deposited_date", async(req, res, next) => {
    try{
      let queryParam = "1=1";
      if(req.params.agent_id!="all" && req.params.deposited_date!="all"){
        queryParam=`dp.agent_id = ${req.params.agent_id} && dp.deposited_date = "${req.params.deposited_date}"`
      }
      else if(req.params.deposited_date!="all"){
        queryParam=`dp.deposited_date = "${req.params.deposited_date}"`
      }else if(req.params.agent_id!="all"){
        queryParam=`dp.agent_id = ${req.params.agent_id}`
      }
      console.log(queryParam);
      let response = await AccountDepositedModel.getAll(queryParam);
      let formatedData = response.map(data=>{
        data.deposited_date = moment(data.deposited_date).format("DD-MM-YYYY");
        return data;
      });
        return res.status(200).json({
            message: formatedData
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
          let payload = `dp.account_number="${req.params.account_number}"`;
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
  app.get("/entryGroupBy/:agent_id/:deposited_date", async(req, res, next) => {
    try{
      let queryParam = "is_deposited=1";
      if(req.params.agent_id!="all" && req.params.deposited_date!="all"){
        queryParam=`is_deposited=1 && agent_id = ${req.params.agent_id} && deposited_date = "${req.params.deposited_date}"`
      }
      else if(req.params.deposited_date!="all"){
        queryParam=`is_deposited=1 && deposited_date = "${req.params.deposited_date}"`
      }else if(req.params.agent_id!="all"){
        queryParam=`is_deposited=1 && agent_id = ${req.params.agent_id}`
      }
      console.log(queryParam);
      let response = await AccountDepositedModel.getAllGroupBy(queryParam);
      // let formatedData = response.map(data=>{
      //   data.deposited_date = moment(data.deposited_date).format("DD-MM-YYYY");
      //   return data;
      // });
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