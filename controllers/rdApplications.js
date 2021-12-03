var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var RdApplicationModel = require('../models/RdApplicationModel');
var AccountDepositedModel = require('../models/AccountDepositedModel');
const SmsApi = require("../util/SmsApi");
const moment = require("moment"); 

const { async } = require("q");
const calculateMaturity = require("../util/calculateMaturity");

app.post("/entry", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      account_holder_name: Joi.required(),
      // rd_amount:Joi.required(),
      // period:Joi.required(),
      // tenure:Joi.required(),
      agent_id: Joi.required(),
    }).unknown(true);

    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }

    try {
      let response = await RdApplicationModel.save(req.body);
      return res.status(200).json({
        message: response
      });

    } catch (error) {
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

app.get("/entry/:agent_id", async (req, res, next) => {
  try {
    let queryParam = "1=1";
    let formatedRes = [];
    if (req.params.agent_id != "all") {
      queryParam = `agent_id = ${req.params.agent_id}`
    }
    let response = await RdApplicationModel.getAll(queryParam);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})
app.get("/entryPaid/:agent_id", async (req, res, next) => {
  try {
    let queryParam = "1=1";
    let formatedRes = [];
    if (req.params.agent_id != "all") {
      queryParam = `dp.agent_id = ${req.params.agent_id}`
    }
    let response = await RdApplicationModel.getAllPaid(queryParam);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.get("/entryByAccountNumber/:account_number", async (req, res, next) => {
  try {
    let queryParam = `account_number="${req.params.account_number}"`;
    let response = await RdApplicationModel.getByAccountNumber(queryParam);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.get("/entryById/:id", async (req, res, next) => {
  try {
    let queryParam = `id = ${req.params.id}`
    let response = await RdApplicationModel.getAll(queryParam);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.delete("/entry/:id", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    let response = await RdApplicationModel.deleteAccount(req.params.id);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.post("/approveAccount", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      id: Joi.required(),
      actionType: Joi.required(),
      agent_id: Joi.required()
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try {
      
      let response = await RdApplicationModel.approveAccount(req.body.id, req.body.actionType, req.body.agent_id);

      return res.status(200).json({
        message: response
      });
    } catch (error) {
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
app.post("/requestCloseAccount", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      account_number: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try {
      let accountDetails = await RdApplicationModel.getByAccountNumber(`account_number="${req.body.account_number}"`);
      let response = await RdApplicationModel.closeAccount(2,req.body.account_number);
      if(accountDetails[0].phone){
        let payload = {
          "messageVar":`${accountDetails[0].account_holder_name}|${accountDetails[0].account_number}|${moment().format("DD-MM-YYYY").toString()}`,
          "phone":accountDetails[0].phone
        }
        SmsApi.accountCloseRequest(payload);

      }

      return res.status(200).json({
        message: response
      });
    } catch (error) {
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
app.post("/closeAccount", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      account_number: Joi.required(),
      agent_id: Joi.required()
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try {
      let accountDetails = await RdApplicationModel.getByAccountNumber(`account_number="${req.body.account_number}"`);
      let queryParam = `dp.account_number = "${req.body.account_number}" AND dp.is_deposited=1`
      let deposites = await AccountDepositedModel.getAll(queryParam);
      let totalMatureAmount = 0;
      deposites.map(data => {
          totalMatureAmount += calculateMaturity.maturity(data);
        })
        let debitPayload = {
          "account_number" : req.body.account_number,
          "agent_id":req.body.agent_id,
          "debited_amount":totalMatureAmount,
          "deposited_date":moment().format("YYYY-MM-DD"),
          "is_deposited":0
        }
      await AccountDepositedModel.save(debitPayload);
      let response = await RdApplicationModel.closeAccountMaturityCredit(1,req.body.account_number,totalMatureAmount);

      if(accountDetails[0].phone){
        let payload = {
          "messageVar":`${accountDetails[0].account_holder_name}|${accountDetails[0].account_number}|complete amount`,
          "phone":accountDetails[0].phone
        }
        SmsApi.accountClosed(payload);

      }

      return res.status(200).json({
        message: response
      });
    } catch (error) {
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

app.get("/calculateCloseAmount/:account_number", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      account_number: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
      let queryParam = `dp.account_number = "${req.params.account_number}" AND dp.is_deposited=1`
      let response = await AccountDepositedModel.getAll(queryParam);
      let totalMatureAmount = 0;
      response.map(data => {
          totalMatureAmount += calculateMaturity.maturity(data);
        })
      return res.status(200).json({
        message: totalMatureAmount
      });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});
module.exports = app;