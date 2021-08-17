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

  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY created_at DESC`, (err, result) => {
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
  function update(record, id){
    return new Promise(function (resolve, reject) {
      connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
          if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
          }
          return txt;
        }.bind(this));
      };    
      let qry=connection.query(`UPDATE ${TableName} SET expense_type=:expense_type, amount=:amount, date_of_expense=:date_of_expense WHERE id=${id}`,record, (err, result) => {
     console.log(qry.sql);
      if (err) reject(err);
    resolve("Expense has been updated!");
    })
  })
  }
  
module.exports = {save:save,getAll:getAll,deleteExpense:deleteExpense,update:update}