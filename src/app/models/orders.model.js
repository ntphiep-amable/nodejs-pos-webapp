const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: {
        type: String,
        ref: 'customer'
    },

    products: [{
        productId: {
            type: String,
            ref: 'product'
        },
        quantity: Number,
    }],
    
    orderDate: {
        type: Date,
        default: Date.now
    }, 
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;