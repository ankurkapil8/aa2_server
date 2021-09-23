const { async } = require("q");
const connection = require("../config");
const TableName = "member_group";

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
        connection.query(`SELECT member_group.*,
          count(users.member_group_id) AS member_count
          FROM member_group 
          LEFT JOIN member_details AS users ON users.member_group_id = member_group.group_code
          GROUP BY member_group.group_code order by member_group.created_at DESC`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

  function deleteGroup(group_code){
    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE group_code = ?`,[group_code], (err, result) => {
        if (err) reject(err);
      resolve(`Group code ${group_code} has been deleted!`);
      })
    })

  }
  function getMemberListByGroup(group_code){
    return new Promise(function (resolve, reject) {
      connection.query(`SELECT * from member_details WHERE member_group_id=? ORDER BY created_at DESC`,[group_code], (err, result) => {
      if (err) reject(err);
      resolve(result);
      })
    })

  }
module.exports = {save:save, getAll:getAll, deleteGroup:deleteGroup,getMemberListByGroup:getMemberListByGroup};


