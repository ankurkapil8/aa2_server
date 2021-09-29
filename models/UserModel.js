const { async } = require("q");
const connection = require("../config");
const TableName = "user";
const { decrypt} = require('../util/crypto'); 

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
        var qe = connection.query(`SELECT * from ${TableName} WHERE username = ?`,[data.username], (err, result,fields) => {
        if (err) reject(err);

        if(result[0] !=undefined){
          if(decrypt(result[0].password)!=data.password)
            result = [];
        }
      resolve(result);
      })
    })

  }

  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} WHERE ${filter}`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })
  }
  function deleteUser(id){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(`User has been deleted!`);
      })
    })

  }

  function changePassword(newPassword,id){
    return new Promise(function (resolve, reject) {
      var query=connection.query(`UPDATE ${TableName} SET password = ? WHERE id = ?`,[newPassword, id], (err, result) => {
      if (err) reject(err);
      resolve(`Password has been changed!`);
    })
    })
  }
  function changeRole(role,id){
    return new Promise(function (resolve, reject) {
      var query=connection.query(`UPDATE ${TableName} SET role = ? WHERE id = ?`,[role, id], (err, result) => {
      if (err) reject(err);
      resolve(`Role has been changed!`);
    })
    })
  }

  module.exports = { save:save,findOne:findOne, getAll:getAll, deleteUser:deleteUser, changePassword:changePassword, changeRole:changeRole}