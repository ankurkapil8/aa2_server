const { number } = require('@hapi/joi');
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    userEmail: { type: String },
    amount:{type:Number,required:true},
    razorpay_order_id:{type:String,required:true},
    datePlaced : { type: Date},
    paymentStatus:{type:String},
    paymentResponse:{type:Object},
    orderForService:{type:String}
});

// on every save, add the date
PaymentSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if last_modified doesn't exist, add to that field
  if (!this.datePlaced)
    this.datePlaced = currentDate;

  next();
});

var PaymentModel = mongoose.model('Payments', PaymentSchema);

module.exports = PaymentModel;
