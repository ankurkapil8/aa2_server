var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var GroupLoanModel = require('../models/GroupLoanModel');
var EmiModel = require('../models/EmiModel');
const { async } = require("q");
var EMIs = require("./EMIs");
const { date } = require("@hapi/joi");
var moment = require('moment');

// add loan application
app.post("/applyGroupLoan", async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        application_date: Joi.required(),
        member_id:Joi.required(),
        scheme_id:Joi.required(),
        interest_rate:Joi.required(),
        loan_amount:Joi.required(),
        // EMI_amount:Joi.required(),
        EMI_payout:Joi.required(),
        tenure:Joi.required(),
        village:Joi.alternatives().conditional('EMI_payout', {is:"village", then:Joi.required()}),
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
        actionType:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let response = await GroupLoanModel.approveLoan(req.body.id, req.body.actionType);
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
        actionType:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let EMIsDates = [];
        let formatedEmis = [];
        let response = await GroupLoanModel.disburseLoan(req.body.id, req.body.actionType);
        console.log(response);
        if(req.body.actionType == 1){
          console.log("in action");
            EMIsDates = EMIs.calculateEMIFlat(
              response[0][0].loan_amount,
              response[0][0].Tenure,
              response[0][0].interest_rate,
              response[0][0].EMI_payout,
              response[0][0].application_date,
              response[0][0].week,
              response[0][0].day,
              );
            EMIsDates.map(emi=>{
              let loanDate = emi.date;
              loanDate = loanDate.split("-");
              loanDate = new Date(`${loanDate[2]}-${loanDate[1]}-${loanDate[0]}`);
              formatedEmis.push([
                response[0][0].loan_account_no,
                emi.int_amount,
                emi.principal,
                emi.EMI,
                emi.outstanding,
                loanDate,
                emi.remain_EMI,
              ]);
            });
            console.log(formatedEmis);
            let emiResponse = await EmiModel.save(formatedEmis);
  
        }
        return res.status(200).json({
          message: req.body.actionType==1?"Loan has been disbused!":"Loan has been rejected!"
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
  app.get("/entry/:filter", async(req, res, next) => {
    try{
      console.log(typeof parseInt(req.params.filter));
      let filter = "";
        switch (req.params.filter) {
          case "pendingApproval":
            filter = "is_approved=0";
            break;
            case "pendingDisburse":
              filter = "is_approved=1 AND is_disbursed=0";
              break;
              case "all":
                filter = "1=1"
                break;
            default:
              filter = `loan.id=${req.params.filter}`;
            break;
        }
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