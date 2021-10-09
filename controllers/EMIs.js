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
      return res.status(200).json({
        message: calculateEMIFlat(req.body.loan_amount, req.body.tenure, req.body.interest_rate, req.body.EMI_payout, new Date(req.body.loanStartDate), req.body.week, req.body.day)
      });
    }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
  function calculateFirstEmiVillage(week,day,application_date = moment()){
    let currentMonthArrayByDay = {"sunday":[],"monday":[],"tuesday":[],"wednesday":[],"thrusday":[],"friday":[],"saturday":[]};
    let nextMonthArrayByDay = {"sunday":[],"monday":[],"tuesday":[],"wednesday":[],"thrusday":[],"friday":[],"saturday":[]};
    let firstEmiDate = "";
    let monthStartDate = moment(application_date).startOf('month');
    let monthEndDate = moment(application_date).endOf('month');

    let nextMonthStartDate = moment(application_date).add(1, 'month').startOf('month');
    let nextMonthEndDate = moment(application_date).add(1, 'month').endOf('month');
    let dayByNumber = {0:"sunday",1:"monday",2:"tuesday",3:"wednesday",4:"thrusday",5:"friday",6:"saturday"}; 
    
    for(let i=monthStartDate;i<=monthEndDate;i=moment(i).add(1, 'day')){ //list date by day for current month
      currentMonthArrayByDay[dayByNumber[moment(i).day()]].push(i);
    }
    for(let i=nextMonthStartDate;i<=nextMonthEndDate;i=moment(i).add(1, 'day')){ //list date by day for next month
      nextMonthArrayByDay[dayByNumber[moment(i).day()]].push(i);
    }
    let i = (week-1);
    while(i<currentMonthArrayByDay[day].length){ //check in current month
      if(currentMonthArrayByDay[day][i] > application_date){  // Emi can not start from application date, so we are using > operator
        firstEmiDate = currentMonthArrayByDay[day][i];
        break;
      }
      i = i+2;
    }

    if( firstEmiDate == ""){ //because emi date is not available in current month
      i = (week-1);
      while(i<nextMonthArrayByDay[day].length){ // check in next month
        if(nextMonthArrayByDay[day][i] > application_date){  // Emi can not start from application date, so we are using > operator
          firstEmiDate = nextMonthArrayByDay[day][i];
          break;
        }
        i = i+2;
      }
  
    }

    return firstEmiDate;
  }
 function calculateEMIFlat(totalLoan, tenure, interest_rate, EMI_payout, loanDate, week=0, day=""){
   try{
      
  let result = [];
  let totalIntAmount = Math.ceil(totalLoan*interest_rate/100);
  let intPerTenure =  Math.ceil(totalIntAmount/tenure);
  let principalPerTenure = Math.ceil(totalLoan/tenure);
  let outstanding = totalLoan;
  //let currentEMI = 0;
  let totalAmount = totalLoan+totalIntAmount;
  let EMIPerTenure = totalAmount/tenure;
  let firstEmiDate = "";
  if(EMI_payout == "village"){
    firstEmiDate = calculateFirstEmiVillage(week, day, loanDate);
  }
  console.log("firstEmiDate ",firstEmiDate);
  let w = 0
  for(let i=1;i<=tenure;i++){
    if(EMI_payout=="monthly"){
      nextEMIDate = new Date(loanDate.setMonth(loanDate.getMonth()+1))
    }else if(EMI_payout=="weekly"){
      nextEMIDate = new Date(loanDate.setDate(loanDate.getDate() + 1 * 7));
    }else if(EMI_payout=="fortnight"){
      nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+15))
    }else if(EMI_payout=="village"){
      nextEMIDate = moment(firstEmiDate).add(w, 'weeks');
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
        w = w+2;
  }
  return result;
  }catch(error){
    console.log(error);
  }
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