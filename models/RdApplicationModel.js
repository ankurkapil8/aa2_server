const { async } = require("q");
const connection = require("../config");
const TableName = "rd_applications";
const moment = require('moment');
const SmsApi = require("../util/SmsApi");

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
        connection.query(`SELECT *, (select SUM(deposited_amount) from account_deposited where account_number=${TableName}.account_number AND is_deposited=1)as totalDeposited from ${TableName}  WHERE ${filter} ORDER BY id DESC`, (err, result) => {
          console.log(filter);
        if (err) reject(err);
      resolve(result);
      })
    })
  }
  function getAllPaid(filter = "1=1"){
    return new Promise(function (resolve, reject) {
      connection.query(`
      SELECT rd.*, 
      dp.*,
      rd.id as rd_table_id,
      dp.id as dp_table_id,
      (select SUM(deposited_amount) from account_deposited where account_number=rd.account_number AND is_deposited=1)as totalDeposited 
      from 
      rd_applications as rd inner join account_deposited as dp 
      on(rd.account_number=dp.account_number) where ${filter} ORDER BY dp_table_id DESC`, (err, result) => {
        console.log(filter);
      if (err) reject(err);
      resolve(result);
      })
    })
  }
  function getByAccountNumber(account_number){
    return new Promise(function (resolve, reject) {
      connection.query(`SELECT * from ${TableName}  WHERE ${account_number} ORDER BY id DESC`, (err, result) => {
        console.log(account_number);
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
  function closeAccount(actionType,account_number){
    return new Promise(function (resolve, reject) {
      let qry=connection.query(`UPDATE ${TableName} SET is_account_closed=? WHERE account_number=?`,[actionType, account_number], async(err, result) => {
        if (err) reject(err);
      resolve(actionType==1?`Account number ${account_number} has been closed.`:`Account close request is in progress.`);
      })
    })
  }
  function closeAccountMaturityCredit(actionType, account_number, maturityAmount){
    return new Promise(function (resolve, reject) {
      let qry=connection.query(`UPDATE ${TableName} SET is_account_closed=?, account_close_amount=? WHERE account_number=?`,[actionType, maturityAmount, account_number], async(err, result) => {
        if (err) reject(err);
      resolve(`Account number ${account_number} has been closed. Rs. ${maturityAmount} will be debited from this account.`);
      })
    })
  }

    function approveAccount(id, actionType,agent_id){
    return new Promise(async function (resolve, reject) {
      let userData = await getAll("id="+id);
      //let depositPayload = [];
      let accountNumber = generateAccountNumber(userData[0].created_at, id);
        let qry=connection.query(`UPDATE ${TableName} SET is_approved=?, account_number=? WHERE id=?`,[actionType, accountNumber, id], async(err, result) => {
          let accountDetails = userData[0];
          accountDetails.account_number = accountNumber;
          if(actionType==1 && userData[0].rd_amount !=0){
              let depositPayload={
                      "account_number":accountNumber,
                      "agent_id":agent_id,
                      "deposited_amount":userData[0].rd_amount,
                      "deposited_date":moment().format("YYYY-MM-DD"),
                      "is_deposited":1,
                      "is_account_open_amount":1
              }
            let depositResponse = await AccountDepositedModel.save(depositPayload);

            if(userData[0].phone){
              let payload = {
                "messageVar":`${userData[0].account_holder_name}|${accountNumber}|${userData[0].rd_amount}|${moment().format("DD-MM-YYYY").toString()}|${userData[0].rd_amount}`,
                "phone":userData[0].phone
              }
              console.log(payload);
              SmsApi.sendAccountDeposit(payload);
            }
    
          }
        if (err) reject(err);
      resolve(`Account has been ${actionType==1?"approved":"rejected"}!`);
      })
    })
  }
  function generateAccountNumber(date,id) {
    return `RD${moment().format("DDMMYYYY")}${id}`;
  }
module.exports = { save:save, 
                  getAll:getAll, 
                  deleteAccount:deleteAccount, 
                  approveAccount,approveAccount, 
                  getByAccountNumber:getByAccountNumber,
                  closeAccount:closeAccount,
                  closeAccountMaturityCredit:closeAccountMaturityCredit,
                  getAllPaid:getAllPaid
                }