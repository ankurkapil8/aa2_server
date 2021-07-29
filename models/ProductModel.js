var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ProductSchema = new Schema({
    category: { type: String, required: true },
    description: {type: String},
    imageUrl: {type: String},
    price: {type: String, required:true},
    title: {type: String, required:true},
	createdAt : { type: Date},
});

// on every save, add the date
ProductSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if last_modified doesn't exist, add to that field
  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
});

var ProductModel = mongoose.model('Products', ProductSchema);

module.exports = ProductModel;
