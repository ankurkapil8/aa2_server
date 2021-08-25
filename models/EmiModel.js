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

  module.exports = {save:save};
