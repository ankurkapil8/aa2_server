const { async } = require("q");
const connection = require("../config");
const TableName = "rd_applications";
const moment = require('moment');
const AccountDepositedModel = require("./AccountDepositedModel");
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
          console.log(filter);
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
      let depositPayload = [];
      let accountNumber = generateAccountNumber(userData[0].created_at, id);
        let qry=connection.query(`UPDATE ${TableName} SET is_approved=?, account_number=? WHERE id=?`,[actionType, accountNumber, id], async(err, result) => {
          let accountDetails = userData[0];
          accountDetails.account_number = accountNumber;
          if(actionType==1){
            let depositDates = AccountDepositedModel.calculateDepositDate(accountDetails);
            depositDates.map(dd=>{
              depositPayload.push(
                [
                      accountNumber,
                      agent_id,
                      userData[0].rd_amount,
                      new Date(dd),
                      0,
                      0
                ]
              )
            });
            if(userData[0].initial_deposited_amount && userData[0].initial_deposited_amount!=0){
              depositPayload[0][5] = 1;
            }
            let depositResponse = await AccountDepositedModel.save(depositPayload);

          }
          console.log(depositPayload);
        if (err) reject(err);
      resolve(`Account has been ${actionType==1?"approved":"rejected"}!`);
      })
    })
  }
  function generateAccountNumber(date,id) {
    return `RD${moment().format("DDMMYYYY")}${id}`;
  }
module.exports = { save:save, getAll:getAll, deleteAccount:deleteAccount, approveAccount,approveAccount}