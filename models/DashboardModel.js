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
  
  // function getSumClosedRdAccount(){
  //   return new Promise(function (resolve, reject) {
  //       let qry = connection.query(`SELECT 
  //       SUM(dp.deposited_amount) as totalMatureAmount,
  //       rd.*
  //       FROM 
  //       account_deposited as dp inner join rd_applications as rd
  //       ON(dp.account_number=rd.account_number )
  //       where rd.is_account_closed=1 and dp.is_deposited=1
  //       group by dp.account_number 
  //       `, (err, result) => {
  //       console.log(qry.sql);
  //         if (err) reject(err);
  //       resolve(result);
  //     })
  //   })
  // }

  function getSumRdAmount(){
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`SELECT 
        dp.*,
        rd.*
        FROM 
        account_deposited as dp inner join rd_applications as rd
        ON(dp.account_number=rd.account_number )
        order by dp.deposited_date
        `, (err, result) => {
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
  module.exports = {
    getSumProcessingFee:getSumProcessingFee, 
    getSumPaidEmis:getSumPaidEmis, 
    getSumExpense:getSumExpense, 
    getSumDisbursedLoan:getSumDisbursedLoan,
    getSumRdAmount:getSumRdAmount
  };
