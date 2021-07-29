var mongoose = require('mongoose');
Schema = mongoose.Schema;

var FinanceSchema = new Schema({
    aadhar: { type: String, required: true },
    address: { type: String },
    business: { type: String},
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    pan: { type: String },
    service: { type: String },
    zip: { type: String },
    createdAt: { type: Date },
    razorpay_order_id:{type:String}
});

// on every save, add the date
FinanceSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // if last_modified doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var FinanceModel = mongoose.model('Finances', FinanceSchema);

module.exports = FinanceModel;
