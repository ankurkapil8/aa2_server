var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var EmiModel = require('../models/EmiModel');
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
        message: calculateEMIFlat(req.body.loan_amount, req.body.tenure, req.body.interest_rate, req.body.EMI_payout, new Date(req.body.loanStartDate))
      });
    }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
 function calculateEMIFlat(totalLoan, tenure, interest_rate, EMI_payout, loanDate){
  let result = [];
  let totalIntAmount = Math.ceil(totalLoan*interest_rate/100);
  let intPerTenure =  Math.ceil(totalIntAmount/tenure);
  let principalPerTenure = Math.ceil(totalLoan/tenure);
  let outstanding = totalLoan;
  //let currentEMI = 0;
  let totalAmount = totalLoan+totalIntAmount;
  let EMIPerTenure = totalAmount/tenure;
  console.log("totalAmount "+totalAmount);
  console.log("totalIntAmount "+totalIntAmount);

  for(let i=1;i<=tenure;i++){
    if(EMI_payout=="monthly"){
      nextEMIDate = new Date(loanDate.setMonth(loanDate.getMonth()+1))
    }else if(EMI_payout=="weekly"){
        nextEMIDate = new Date(loanDate.setDate(loanDate.getDate() + 1 * 7));
    }else if(EMI_payout=="fortnight"){
        nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+15))
    }
    outstanding = outstanding-principalPerTenure;
     let emi = {
         "date":moment(nextEMIDate).format("DD-MM-YYYY"),
         "int_amount":intPerTenure,
         "principal":i!=tenure?principalPerTenure:principalPerTenure+outstanding,
         "EMI":EMIPerTenure,
         "outstanding":i!=tenure?outstanding:0,
         "remain_EMI":tenure-i
        }
        result.push(emi);
  }
  return result;
}
app.get("/dueEMIs/:dueDate", async(req, res, next) => {
  try {

      let dueDate = req.params.dueDate?req.params.dueDate:new Date();
      let filter = `EMI_date = "${dueDate}" AND isPaid=0`;
      let response = await EmiModel.getAll(filter);
      return res.status(200).json({
          message: response
        });
  }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
app.put("/entry", async(req, res, next) => {
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
      let response = await EmiModel.update(req.body.id);
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
app.get("/entry/:loanAccountNo", async(req, res, next) => {
  try {
    const joiSchema = Joi.object({
      loanAccountNo: Joi.required(),
    }).unknown(true);  
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if(validationResult.error){
      return res.status(500).json({
        message: validationResult.error.details
      });        
    }

      let filter = `loan_account_no = "${req.params.loanAccountNo}" AND isPaid=1`;
      let response = await EmiModel.getEmiData(filter);
      return res.status(200).json({
          message: response
        });
  }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
app.get("/allEmis/:dueDate", async(req, res, next) => {
  try {

      let dueDate = req.params.dueDate?req.params.dueDate:new Date();
      let filter = `EMI_date = "${dueDate}"`;
      let paidCount = 0;
      let notPaidCount = 0;
      let response = await EmiModel.getAll(filter);
      response.map((res)=>{
        if(res.isPaid==1){
          paidCount = paidCount+1;
        }else{
          notPaidCount = notPaidCount+1;
        }
      });

      return res.status(200).json({
          message: response,
          paidCount:paidCount,
          notPaidCount:notPaidCount
        });
  }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})

app.calculateEMIFlat = calculateEMIFlat;
module.exports = app;