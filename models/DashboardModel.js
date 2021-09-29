const { async } = require("q");
const connection = require("../config");

  function getSumProcessingFee(){
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`SELECT * FROM processing_fee ORDER BY id DESC`, (err, result) => {
        console.log(qry.sql);
          if (err) reject(err);
        resolve(result);
      })
    })
  }
  function getSumPaidEmis(){
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`SELECT * FROM EMIs where isPaid=1 ORDER BY id DESC`, (err, result) => {
        console.log(qry.sql);
          if (err) reject(err);
        resolve(result);
      })
    })
  }

  function getSumExpense(){
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`SELECT * FROM expenses ORDER BY id DESC`, (err, result) => {
        console.log(qry.sql);
          if (err) reject(err);
        resolve(result);
      })
    })
  }

  function getSumDisbursedLoan(){
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`SELECT loan.*,member.*,village.village_name,village.week,village.day from loan_applications as loan 
        INNER JOIN member_details as member 
        ON (loan.member_id=member.member_id )
        LEFT JOIN village 
        ON(loan.village_id = village.id) 
        WHERE loan.is_disbursed=1 ORDER BY id DESC`, (err, result) => {
        console.log(qry.sql);
          if (err) reject(err);
        resolve(result);
      })
    })
  }
  module.exports = {getSumProcessingFee:getSumProcessingFee, getSumPaidEmis:getSumPaidEmis, getSumExpense:getSumExpense, getSumDisbursedLoan:getSumDisbursedLoan};
