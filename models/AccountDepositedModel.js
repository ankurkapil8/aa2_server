const { async } = require("q");
const connection = require("../config");
const TableName = "account_deposited";
const moment = require("moment");
// function save(data) {
//     return new Promise(function (resolve, reject) {
//         connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
//         if (err) reject(err);
  
//         resolve("data saved successfully!");
//       })
//     })
//   }
function save(data) {
  return new Promise(function (resolve, reject) {
      let qry = connection.query(`INSERT INTO ${TableName} (account_number, agent_id, deposited_amount, deposited_date, is_deposited, is_account_open_amount) values ?`, [data], (err, result) => {
      console.log(qry.sql);
        if (err) reject(err);
      resolve("Data saved!");
    })
  })
}

  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
      let qry =connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY id DESC`, (err, result) => {
        console.log(qry.sql);
        if (err) reject(err);
      resolve(result);
      })
    })

  }
  function update(payload){
    return new Promise(function (resolve, reject) {   
      let qry=connection.query(`UPDATE ${TableName} SET is_deposited=1 WHERE account_number="${payload.account_number}" AND deposited_date="${payload.deposited_date}"`, (err, result) => {
      console.log(qry.sql);
      if (err) reject(err);
      resolve("payment has been recorded!");
      })
    })
  }

  function deleteDeposit(id){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(` Scheme has been deleted!`);
      })
    })

  }
  function calculateDepositDate(accountDetails){
    let created_at = accountDetails.created_at;
    let depositDates = [];
    let count = 0;
    if(accountDetails.tenure=="monthly"){
      count = accountDetails.period;
    }
    if(accountDetails.tenure=="daily"){
      var createdAt = accountDetails.createdAt;
      createdAt = moment(createdAt);
      var lastDepositDate = moment(createdAt).add(accountDetails.period,"months");
      count =lastDepositDate.diff(moment(createdAt),"days");
    }
    for(let i=0;i<count;i++){
      if(accountDetails.tenure=="monthly"){
        depositDates.push(moment(created_at).add(i,"months"));
      }
      if(accountDetails.tenure=="daily"){
        depositDates.push(moment(created_at).add(i,"days"));
      }

    }
    return depositDates;
  }
module.exports = { save:save, getAll:getAll, deleteDeposit:deleteDeposit, calculateDepositDate:calculateDepositDate, update:update }