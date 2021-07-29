var mongoose = require('mongoose');
var Q = require('q');
Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var config = require('./env.json')[process.env.NODE_ENV || 'development'];

//var ruckus_db_uri = 'mongodb://'+property_config.userId+':'+property_config.password+'@'+ property_config.host +':'+property_config.port+'/'+ property_config.database;
//var ruckus_db_uri = 'mongodb://ruckus:ruckus@localhost:27017/ruckus';
//var kanbaDB = 'mongodb+srv://new_user1:qcQUpeKNpa3qTFii@cluster0.pp3gr.mongodb.net/KANBAFOOD?retryWrites=true&w=majority';

// var options = {
//     // useMongoClient: true,
//     autoIndex: false, // Don't build indexes
//     reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//     reconnectInterval: 500, // Reconnect every 500ms
//     poolSize: 5, // Maintain up to 10 socket connections
//     // If not connected, return errors immediately rather than waiting for reconnect
//     bufferMaxEntries: 0,
//     useNewUrlParser:true
// };
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.Promise = require('q').Promise;

var cpromise = mongoose.connect(config.MONGO_URI,connectionParams, function(error){
    if(error){
        console.error("Database connection failed:"+error);
		process.exit();
    } else {
        console.log("Connected to database successfully");
    }
});

require('./models/CategoryModel');
require('./models/UserModel');
require('./models/FinanceModel');
require('./models/OrderModel');
require('./models/ProductModel');
require('./models/ShoppingCartModel');
//add other models here.
