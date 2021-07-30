const { async } = require("q");
const connection = require("../config");
const TableName = "expenses";

function save(data) {
  console.log(data);
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

  function deleteExpense(id){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(` Expense has been deleted!`);
      })
    })

  }

module.exports = {save:save,getAll:getAll,deleteExpense:deleteExpense}