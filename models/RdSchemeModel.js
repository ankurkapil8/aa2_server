const { async } = require("q");
const Connection = require("../util/connectionService");
const TableName = "rd_scheme";

function save(data) {
  connection = Connection.getConnection();

    return new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
        if (err) reject(err);
  
        resolve("data saved successfully!");
      })
    })
  }

  function getAll(){
    connection = Connection.getConnection();

    return new Promise(function (resolve, reject) {
        connection.query(`SELECT * from ${TableName} ORDER BY id DESC`, (err, result) => {
        if (err) reject(err);
      resolve(result);
      })
    })

  }

  function deleteScheme(id){
    connection = Connection.getConnection();

    return new Promise(function (resolve, reject) {
        var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
        if (err) reject(err);
      resolve(` Scheme has been deleted!`);
      })
    })

  }

module.exports = { save:save,getAll:getAll,deleteScheme:deleteScheme }