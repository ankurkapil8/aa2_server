var Q = require('q');
var mysql = require('mysql');
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '36879ae31b19f55300e670a368e42e8644c30f2cf7c77442',
  database: 'aa2microfinance'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('mysql connected as id ' + connection.threadId);
});
module.exports = connection;
//require('./models/CategoryModel');
//require('./models/UserModel');
//require('./models/FinanceModel');
//require('./models/OrderModel');
//require('./models/ProductModel');
//require('./models/ShoppingCartModel');
//add other models here.
