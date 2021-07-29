const { string } = require('@hapi/joi');
var mongoose = require('mongoose');
var moment = require('moment'); // require

Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userId: { type: String },
    items:{type:Array,required:true},
    shipping:{type:Object,required:true},
    datePlaced : { type: String},
    isDiscountApplied:{type:Boolean,default:false},
    totalBillAmount:{type:String},
    paymentMode:{type:String,required:true},
    razorpay_order_id:{type:String},
});

// on every save, add the date
OrderSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // if last_modified doesn't exist, add to that field
  if (!this.datePlaced)
    this.datePlaced = currentDate;
  next();
});
OrderSchema.post('init', function (doc) {
  //console.log(doc);
  doc.datePlaced = moment(doc.datePlaced).format('DD/MM/YYYY, h:mm:ss a');
  // Transform doc as needed here.  "this" is also the doc.
});

var OrderModel = mongoose.model('Orders', OrderSchema);

module.exports = OrderModel;
