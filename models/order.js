const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
  name: String,
  comapny: { type: Schema.Types.ObjectId, ref: 'company' },


});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
