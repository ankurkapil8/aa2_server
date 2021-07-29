var mongoose = require('mongoose');
Schema = mongoose.Schema;

var InquerySchema = new Schema({
    fullName: { type: String },
    email:{ type: String },
    business:{ type: String },
    bob : { type: Date },
    gender:{ type: String },
    service:{type:String},
    phone:{ type: String }
});

// on every save, add the date
InquerySchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if last_modified doesn't exist, add to that field
  if (!this.datePlaced)
    this.datePlaced = currentDate;

  next();
});

var InqueryModel = mongoose.model('Inqueries', InquerySchema);

module.exports = InqueryModel;
