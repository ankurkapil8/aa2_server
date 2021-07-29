var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Form16Schema = new Schema({
    filePath:{type:String},
    phone:{type:String},
    createdAt: { type: Date },
    razorpay_order_id:{type:String}
});

// on every save, add the date
Form16Schema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // if last_modified doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var Form16Model = mongoose.model('Form16', Form16Schema);

module.exports = Form16Model;
