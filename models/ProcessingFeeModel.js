const { async } = require("q");
const connection = require("../config");
const TableName = "processing_fee";

function save(data) {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }

  function getAll(){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName}`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

module.exports = {save:save,getAll:getAll}