var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');

//var SchemeModel = require('../models/SchemeModel');
const { async } = require("q");
 const smsClient = require("../util/smsApi");
// smsClient.sendVerificationMessage(user)

app.post("/entry", async(req, res, next) => {
    
    //   const joiSchema = Joi.object({
    //     scheme_name: Joi.required(),
    //     scheme_code: Joi.required(),
    //     max_amount: Joi.required(),
    //     interest_rate:Joi.required(),
    //     EMI_type:Joi.required()
    //   }).unknown(true); 

    //   const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    //   if(validationResult.error){
    //     return res.status(500).json({
    //       message: validationResult.error.details
    //     });        
    //   }
    //   const created_at = new Date().getTime();
    //   var formatedData = {
    //     created_at:created_at,
    //     status:0,
    //     ...req.body
    //   }
      try{
        //let response = await SchemeModel.save(formatedData);
        console.log(smsClient);
        smsClient.sendPartnerWelcomeMessage({"phone":"8285737478","name":"ankur"})
        //smsClient.sendVerificationMessage({"phone":"8285737478","name":"ankur"})
        return res.status(200).json({
            message: "response"
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
    
  });



  module.exports = app;