const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [{
        productId: {
            type: String,
            ref: 'product'
        },
        quantity: Number,
        unitPrice: Number,
    }],

    creationDate: {
        type: Date,
        default: Date.now,
    },
    
    totalPrice: {
        type: Number,
        default: 0,
    },
});

const cartModel = mongoose.model('cart', cartSchema);
module.exports = cartModel;