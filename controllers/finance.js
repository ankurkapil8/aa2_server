var express = require("express");
const app = express.Router();
const appE = express();
const db = require("../config");
const FinanceModel = require("../models/FinanceModel");
const Form16Model = require("../models/Form16Model");
const Joi = require('@hapi/joi');
const fileUpload = require('express-fileupload');
var sendObj = require("../util/sendMail")

app.use(fileUpload())
app.post("/fill-itr", (req, res, next) => {
    try {
      const joiSchema = Joi.object({
        email: Joi.string().email().required(),
        aadhar: Joi.required(),
        phone:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      var obj = {
        aadhar: req.body.aadhar,
        address: req.body.address != ""?req.body.address:"",
        business: req.body.address != ""?req.body.address:"",
        email: req.body.email,
        firstName: req.body.firstName !=""?req.body.firstName:"",
        lastName: req.body.lastName !=""?req.body.lastName:"",
        phone: req.body.phone,
        pan: req.body.pan !=""?req.body.pan:"",
        service: req.body.service !=""?req.body.service:"",
        zip:req.body.zip !=""?req.body.zip:"",
        razorpay_order_id:req.body.razorpay_order_id

      } 
      var newFinance = new FinanceModel(obj)       ;
      newFinance.save(function (err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        } else {
          sendObj.sendMail(obj,"ITR").then(res=>{
            console.log(res);
          }).catch(err=>{
            console.log(err);
          })            
        return res.status(200).json({
            message: "record successfully"
          });
        }
      }) 
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }
  
  });
  app.get("/fill-itr",(req,res,next)=>{
    try {
      FinanceModel.find({},function (err, financeData) {
          if (err) {
              return res.status(500).json({
                  message: err
              });
          } else {
              return res.status(200).json({
                  record: financeData
              });
          }
      })

  } catch (error) {
      return res.status(500).json({
          message: error.message
      });
  }
  })
  app.post('/form16Upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    } 
    // console.log(req.files);
    // console.log(req.body.razorpay_order_id);
    // console.log(req.body.phone);
    var basePath = process.cwd();
    let myFile = req.files.myFile;
    let filename = Date.now()+req.files.myFile.name;
    // Use the mv() method to place the file somewhere on your server
    myFile.mv(`${basePath}/Form16_pdfs/${filename}`, function(err) {
      if (err)
        return res.status(500).send(err);
  
      var form16Model = new Form16Model({
        filePath:`${basePath}/Form16_pdfs/${filename}`,
        phone:req.body.phone,
        razorpay_order_id:req.body.razorpay_order_id
      });
      form16Model.save(function (err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        } else {
          sendObj.sendMail({phone:req.body.phone},"form16").then(res=>{
            console.log(res);
          }).catch(err=>{
            console.log(err);
          })            

          return res.status(200).json({
            message: "Form16 uploaded successfully"
          });
        }
      }) 
    });    
  });
  
  app.get('/form16Upload', function(req, res) {
    try {
      Form16Model.find({},function (err, financeData) {
          if (err) {
              return res.status(500).json({
                  message: err
              });
          } else {
              return res.status(200).json({
                  record: financeData
              });
          }
      })

  } catch (error) {
      return res.status(500).json({
          message: error.message
      });
  }

  })  
  
  module.exports = app;