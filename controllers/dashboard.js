var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var DashboardModel = require('../models/DashboardModel.js');
const { async } = require("q");
var moment = require('moment');

app.get("/totalReceivedAmount", async(req, res, next) => {
    try {
        let formatedResponse = {};
        let total = 0;
        let processingFeeData = await DashboardModel.getSumProcessingFee();

        total = processingFeeData.reduce(function (previous, current) {
            return previous + parseFloat(current.amount);
        }, 0);

        let emiData = await DashboardModel.getSumPaidEmis();

        total = emiData.reduce(function (previous, current) {
            return previous + parseFloat(current.EMI_amount);
        }, total);

        formatedResponse["total"] = total;
        formatedResponse["processingFee"] = processingFeeData;
        formatedResponse["emis"] = emiData;
        return res.status(200).json({
            message: formatedResponse
        });
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    } 
  })
  app.get("/totalPaidAmount", async(req, res, next) => {
    try {
        let formatedResponse = {};
        let total = 0;
        let sumExpense = await DashboardModel.getSumExpense();
        total = sumExpense.reduce(function (previous, current) {
            return previous + parseFloat(current.amount);
        }, 0);

        let sumPaidLoan = await DashboardModel.getSumDisbursedLoan();
        total = sumPaidLoan.reduce(function (previous, current) {
            return previous + parseFloat(current.loan_amount);
        }, total);
        formatedResponse["total"] = total;
        formatedResponse["expenses"] = sumExpense;
        formatedResponse["loan"] = sumPaidLoan;

        return res.status(200).json({
            message: formatedResponse
        });
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    } 
  })

  app.get("/rdLadger", async(req, res, next) => {
    try {
        let rdDetails = await DashboardModel.getSumRdAmount();
        return res.status(200).json({
            message: rdDetails
        });
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    } 
  })
  module.exports = app;