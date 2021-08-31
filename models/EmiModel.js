const { async } = require("q");
const connection = require("../config");
const TableName = "EMIs";

function save(data) {
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`INSERT INTO ${TableName} (loan_account_no, int_amount, principal, EMI_amount, outstanding, EMI_date, remain_EMI) values ?`, [data], (err, result) => {
        if (err) reject(err);
        resolve("EMIs has been created!");
      })
    })
  }
  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
      let query=connection.query(`SELECT emi.*,loan.*,member.*,emi.id as emi_id, emi.EMI_amount as EMI_amount from EMIs as emi INNER JOIN loan_applications as loan INNER JOIN member_details as member on (emi.loan_account_no = loan.loan_account_no AND member.member_id=loan.member_id) WHERE ${filter}`, (err, result) => {
        console.log(query.sql);
      if (err) reject(err);
      resolve(result);
    })
    })
  }
  function update(id){
    return new Promise(function (resolve, reject) {   
      let qry=connection.query(`UPDATE ${TableName} SET isPaid=1 WHERE id=${id}`, (err, result) => {
      console.log(qry.sql);
      if (err) reject(err);
      resolve("payment has been recorded!");
      })
    })
  }
  function getEmiData(filter){
    return new Promise(function (resolve, reject) {
      let query=connection.query(`SELECT * FROM ${TableName} WHERE ${filter}`, (err, result) => {
        console.log(query.sql);
      if (err) reject(err);
      resolve(result);
    })
    })
  }
  module.exports = {save:save, getAll:getAll, update:update, getEmiData:getEmiData};
