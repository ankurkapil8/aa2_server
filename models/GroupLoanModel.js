const { async } = require("q");
const connection = require("../config");
const TableName = "loan_applications";

function save(data) {
    return new Promise(function (resolve, reject) {
        let qry = connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
            console.log(qry.sql);
        resolve("Loan Application has been created. Loan will show for approval!");
      })
    })
  }
  function getAll(filter){
    return new Promise(function (resolve, reject) {
        let query=connection.query(`SELECT loan.*,member.* from ${TableName} as loan LEFT JOIN member_details as member ON(loan.member_id=member.member_id) WHERE ${filter}`, (err, result) => {
        console.log(query.sql);
        if (err) reject(err);
      resolve(result);
      })
    })

  }

  function approveLoan(id, actionType){
    return new Promise(function (resolve, reject) {
        let qry=connection.query(`UPDATE ${TableName} SET is_approved=? WHERE id=?`,[actionType, id], (err, result) => {
       console.log(qry.sql);
        if (err) reject(err);
      resolve(actionType==1?"Loan has been approved. Loan will show for disburse!":"Loan has been rejected!");
      })
    })
  }

  function disburseLoan(id, actionType){
    return new Promise(function (resolve, reject) {
        let qry=connection.query(`UPDATE ${TableName} SET is_disbursed=? WHERE id=?`,[actionType, id], (err, result) => {
       console.log(qry.sql);
        if (err) reject(err);
      resolve(actionType==1?"Loan has been disbursed!":"Loan has been rejected!");
      })
    })
  }

//   function deleteLoan(id){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE group_code = ?`,[group_code], (err, result) => {
//         if (err) reject(err);
//       resolve(`Group code ${group_code} has been deleted!`);
//       })
//     })

//   }
module.exports = {save:save, getAll:getAll,approveLoan:approveLoan,disburseLoan:disburseLoan};


