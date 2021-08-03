var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");


app.get("/entry", async(req, res, next) => {
    try{
        let response = await MemberModel.getAll();
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