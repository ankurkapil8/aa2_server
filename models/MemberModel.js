const { async } = require("q");
const connection = require("../config");
const TableName = "member_details";

function save(data) {
    return new Promise(function (resolve, reject) {
        let query = connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
          console.log(query.sql);
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }
  function getAll(filter = "1=1"){
    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY created_at DESC`, (err, result) => {
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

function update(record, member_id){
  return new Promise(function (resolve, reject) {
    connection.config.queryFormat = function (query, values) {
      if (!values) return query;
      return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key]);
        }
        return txt;
      }.bind(this));
    };    
    let qry=connection.query(`UPDATE ${TableName} SET bank_account_holder=:bank_account_holder, bank_ifsc_code=:bank_ifsc_code, bank_account=:bank_account, ration_card_number=:ration_card_number, voter_id_number=:voter_id_number, driving_license_number=:driving_license_number, pan_card_number=:pan_card_number, aadhar_number=:aadhar_number, member_group_id=:member_group_id, email_id=:email_id, mobile_number=:mobile_number, marital_status=:marital_status, age=:age, gender=:gender, enrollment_date=:enrollment_date, date_of_birth=:date_of_birth, member_name=:member_name WHERE member_id=${member_id}`,record, (err, result) => {
   console.log(qry.sql);
    if (err) reject(err);
  resolve("Member has been updated!");
  })
})
}
module.exports = {getAll:getAll,save:save,deleteMember:deleteMember,update:update};


