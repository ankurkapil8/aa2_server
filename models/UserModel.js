const { async } = require("q");
const connection = require("../config");
const TableName = "user";

function save(data) {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }
  function findOne(data){
    return new Promise(function (resolve, reject) {
        var qe = connection.query(`SELECT * from ${TableName} WHERE username = ? and password = ?`,[data.username,data.password], (err, result,fields) => {
        if (err) reject(err);
        console.log(result[0]);

      resolve(result);
      })
    })

  }

  module.exports = {save:save,findOne:findOne}