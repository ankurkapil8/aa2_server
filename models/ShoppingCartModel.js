var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ShoppingCartSchema = new Schema({
    items: { type: Array },
	createdAt : { type: Date},
});

// on every save, add the date
ShoppingCartSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if last_modified doesn't exist, add to that field
  if (!this.createdAt)
    this.createdAt = currentDate;

  next();
});

var ShoppingCartModel = mongoose.model('ShoppingCarts', ShoppingCartSchema);

module.exports = ShoppingCartModel;
