const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customer'
    },

    products: 
    [
        {
            productId: {
                type: Schema.Types.ObjectId,
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
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;