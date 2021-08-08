var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var GroupLoanModel = require('../models/GroupLoanModel');
const { async } = require("q");
var moment = require('moment');
app.post("/calculateEMI", async(req, res, next) => {
    try {
    const joiSchema = Joi.object({
        loan_amount: Joi.required(),
        interest_rate:Joi.required(),
        tenure:Joi.required(),
        loanStartDate:Joi.required(),
        EMI_payout:Joi.required(),
        EMI_type:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      console.log(req.body.loanStartDate);
      return res.status(200).json({
        message: calculateEMIFlat(req.body.loan_amount, req.body.loan_amount, req.body.tenure, req.body.interest_rate, req.body.EMI_payout, new Date(req.body.loanStartDate))
      });
    }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
function calculateEMIFlat(totalLoan,loan_amount,tenure,interest_rate,EMI_payout,loanDate, result=[]){
    if(loan_amount == 0){
        return result;
    }
    let principal = totalLoan/tenure;
    let int_Amount =  (totalLoan*interest_rate)/100;
    let nextEMIDate  = "";
    if(EMI_payout=="monthly"){
        nextEMIDate = new Date(loanDate.setMonth(loanDate.getMonth()+1))
    }else if(EMI_payout=="weekly"){
        nextEMIDate = new Date(loanDate.setDate(loanDate.getDate() + 1 * 7));
    }else{
        nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+1))
    }
     let emi = {
         "date":moment(nextEMIDate).format("DD-MM-YYYY"),
         "int_amount":int_Amount,
         "principal":principal,
         "EMI":int_Amount+principal,
         "outstanding":loan_amount-principal,
         "remain_EMI":tenure-1-result.length
        }
        result.push(emi);
        calculateEMIFlat(totalLoan, loan_amount-principal, tenure, interest_rate, EMI_payout, loanDate, result);
     return result;
}
module.exports = app;