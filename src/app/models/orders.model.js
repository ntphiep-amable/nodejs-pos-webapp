const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: {
        type: String,
        ref: 'customer'
    },

    products: 
    [
        {
            productId: {
                type: String,
                ref: 'product'
            },
            productName: String,
            quantity: Number,
            totalOne: Number,
        }
    ],

    totalAll: Number,
    
    orderDate: {
        type: Date,
        default: Date.now
    }, 
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;