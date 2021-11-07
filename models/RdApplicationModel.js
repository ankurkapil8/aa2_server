const { async } = require("q");
const connection = require("../config");
const TableName = "rd_applications";

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
        connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY id DESC`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

  function deleteAccount(id){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(`Account has been deleted!`);
      })
    })

  }
  function approveAccount(id, actionType){
    return new Promise(function (resolve, reject) {
        let qry=connection.query(`UPDATE ${TableName} SET is_approved=? WHERE id=?`,[actionType, id], (err, result) => {
       console.log(qry.sql);
        if (err) reject(err);
      resolve("Account has been approved!");
      })
    })
  }

module.exports = { save:save, getAll:getAll, deleteAccount:deleteAccount, approveAccount,approveAccount}