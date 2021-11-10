const { async } = require("q");
const connection = require("../config");
const TableName = "application_version";

function save(data) {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }

  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY id DESC LIMIT 0,1`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

  function deleteDeposit(id){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(` Scheme has been deleted!`);
      })
    })

  }

module.exports = { save:save, getAll:getAll, deleteDeposit:deleteDeposit }