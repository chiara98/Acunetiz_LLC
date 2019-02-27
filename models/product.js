const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
  name: String,
  price: String,
  description: String,
  comapny: { type: Schema.Types.ObjectId, ref: 'company' },

});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
