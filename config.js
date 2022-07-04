var Q = require('q');
var mysql = require('mysql');
var Connection = require("./util/connectionService")
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
// var connection = mysql.createConnection({
//   host     : 'database-1.cghjxv5prf93.ap-south-1.rds.amazonaws.com',
//   user     : 'admin',
//   password : 'JxtIHMlWKJPDawlnjnqs',
//   database: 'mydb'
// });
var connection;
 const db_config = {
  host     : 'bom1plzcpnl493816.prod.bom1.secureserver.net',
  user     : 'stf2sgxuaulh',
  password : '+@B<-?T.<w85&',
  database: 'aa2_dev'
};
// var connection = mysql.createConnection({
//   host     : 'sg2plzcpnl479109.prod.sin2.secureserver.net',
//   user     : 'aa2_admin',
//   password : 'JxtIHMlWKJPDawlnjnqs',
//   database: 'aa2_dev'
// });
// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('mysql connected as id ' + connection.threadId);
// });

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }else{
      Connection.setConnection(connection);
      console.log('mysql connected as id ' + connection.threadId);
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  
}

handleDisconnect();
module.exports = connection;
