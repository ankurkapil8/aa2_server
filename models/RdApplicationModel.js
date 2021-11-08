const { async } = require("q");
const connection = require("../config");
const TableName = "rd_applications";
const moment = require('moment');
function save(data) {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
          console.log(result);
          approveAccount(result.insertId, 1,data.agent_id);
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
   function approveAccount(id, actionType,agent_id){
    return new Promise(async function (resolve, reject) {
      let userData = await getAll("id="+id);
      let accountNumber = generateAccountNumber(userData[0].created_at, id);
        let qry=connection.query(`UPDATE ${TableName} SET is_approved=?, account_number=? WHERE id=?`,[actionType, accountNumber, id], (err, result) => {

          if(userData[0].initial_deposited_amount && userData[0].initial_deposited_amount!=0 && actionType==1){
            let formatDepositPayload = {
              "account_number":accountNumber,
              "agent_id":agent_id,
              "deposited_amount":userData[0].initial_deposited_amount,
              "deposited_date":new Date(),
              "is_account_open_amount":1
            }
            connection.query(`INSERT INTO account_deposited SET ?`, formatDepositPayload, (err, result) => {
              if (err) reject(err);
            })
          }
          console.log(qry.sql);
        if (err) reject(err);
      resolve(`Account has been ${actionType==1?"approved":"rejected"}!`);
      })
    })
  }
  function generateAccountNumber(date,id) {
    return `RD${moment().format("DDMMYYYY")}${id}`;
  }
module.exports = { save:save, getAll:getAll, deleteAccount:deleteAccount, approveAccount,approveAccount}