var express = require("express");
var app = express();
const router = express.Router();
const db = require("../config");
const UserModel = require("../models/UserModel");
const InqueryModel = require("../models/InqueryModel");
var sendObj = require("../util/sendMail")

const Joi = require('@hapi/joi');
var jwt = require('jsonwebtoken');
const { async } = require("q");
app.set('superSecret', "kanbafood");

router.post("/registration", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      username: Joi.required(),
      password: Joi.required(),
      name: Joi.required(),
      role: Joi.required(),
      password: Joi.required().messages({
        'any.required': `"password" is a required field`
      }),
    });
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    var newUser = {
      created_at: new Date().getTime(),
      status: 0,
      ...req.body
    }
    try {
      let response = await UserModel.save(newUser);
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

})

router.post("/login", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      username: Joi.required(),
      password: Joi.required().messages({
        'any.required': `"password" is a required field`
      }),
    });
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try{
      let response = [];
      let token = "";
       response = await UserModel.findOne(req.body);
      if(response.length>0){
         token = jwt.sign({username:response.username,password:response.password,role:response.role}, app.get('superSecret'), { expiresIn: '2h' }); //set jwt token
      }
          return res.status(200).json({
            message: response.length>0?"User login successfully!":"Username or password wrong!",
            jwtToken: token,
            record: response
          });

    }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }


    // UserModel.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
    //   if (err) {
    //     return res.status(500).json({
    //       message: err
    //     });
    //   } else {
    //     if (user == null) {
    //       return res.status(500).json({
    //         message: "Invalid email id or password."
    //       });
    //     } else {
    //       const userObj = {
    //         isAdmin: user.isAdmin,
    //         isPrimeMember: user.isPrimeMember,
    //         phone: user.phone,
    //         email: user.email,
    //         password: user.password
    //       }
    //       var token = jwt.sign(userObj, app.get('superSecret'), { expiresIn: '2h' }); //set jwt token
    //       return res.status(200).json({
    //         message: "user login successfully",
    //         jwtToken: token,
    //         record: user
    //       });
    //     }

    //   }
    // })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})
router.post("/submitInquery", (req, res, next) => {
  try {
    var inqueryModel = new InqueryModel(req.body);
    inqueryModel.save(function (err) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      } else {
        sendObj.sendMail(req.body, "inquery").then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })

        return res.status(200).json({
          message: "Data submited successfully"
        });
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})
router.get("/userList", (req, res, next) => {
  try {
    UserModel.find({}, function (err, users) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      } else {
        return res.status(200).json({
          record: users
        });
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

router.put("/makeOrRemovePrimeMember", (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      email: Joi.string().required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    UserModel.updateOne({ email: req.body.email }, req.body, function (err) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      } else {
        return res.status(200).json({
          record: "user updated successfully."
        });
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;