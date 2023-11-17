const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;