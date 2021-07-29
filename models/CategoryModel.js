var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: { type: String, required: true },
	createdAt : { type: Date},
});

// on every save, add the date
CategorySchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if last_modified doesn't exist, add to that field
  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
});

var CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
