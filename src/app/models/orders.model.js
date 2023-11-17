const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: String,
    productId: String
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;