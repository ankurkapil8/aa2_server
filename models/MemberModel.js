const { async } = require("q");
const connection = require("../config");
const TableName = "member_details";

function save(data) {
    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }
  function getAll(){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} ORDER BY created_at DESC`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

//   function deleteGroup(group_code){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE group_code = ?`,[group_code], (err, result) => {
//         if (err) reject(err);
//       resolve(`Group code ${group_code} has been deleted!`);
//       })
//     })

//   }
function deleteMember(member_id){
  return new Promise(function (resolve, reject) {
      var query=connection.query(`DELETE from ${TableName} WHERE member_id = ?`,[member_id], (err, result) => {
      console.log(query.sql);
        if (err) reject(err);
    resolve(`Member ID ${member_id} has been deleted!`);
    })
  })

}

module.exports = {getAll:getAll,save:save,deleteMember:deleteMember};


