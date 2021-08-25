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
// function calculateEMIFlat(totalLoan,loan_amount,tenure,interest_rate,EMI_payout,loanDate, result=[]){
//   let nextEMIDate  = "";
//   if(EMI_payout=="monthly"){
//       nextEMIDate = new Date(loanDate.setMonth(loanDate.getMonth()+1))
//   }else if(EMI_payout=="weekly"){
//       nextEMIDate = new Date(loanDate.setDate(loanDate.getDate() + 1 * 7));
//   }else{
//       nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+1))
//   }
//   let principal = Math.floor(totalLoan/tenure);
//   let int_Amount =  Math.floor((totalLoan*interest_rate)/100);

//   if((tenure-1-result.length) == 0){ //if remaining emi is 0
//     let emi = {
//       "date":moment(nextEMIDate).format("DD-MM-YYYY"),
//       "int_amount":int_Amount,
//       "principal":loan_amount,
//       "EMI":int_Amount+loan_amount,
//       "outstanding":0,                        //because remaining outstading is very less so adjusted in principal.
//       "remain_EMI":tenure-1-result.length
//      }
//      result.push(emi);
//            return result;
//     }
//      let emi = {
//          "date":moment(nextEMIDate).format("DD-MM-YYYY"),
//          "int_amount":int_Amount,
//          "principal":principal,
//          "EMI":int_Amount+principal,
//          "outstanding":loan_amount-principal,
//          "remain_EMI":tenure-1-result.length
//         }
//         result.push(emi);
//         calculateEMIFlat(totalLoan, loan_amount-principal, tenure, interest_rate, EMI_payout, loanDate, result);
//      return result;
// }
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
      let filter = `EMI_date = "${dueDate}"`;
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
app.calculateEMIFlat = calculateEMIFlat;
module.exports = app;