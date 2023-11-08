const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    barcodeImg: String,
    importPrice: String,
    retailPrice: String,
    category: String, 
    creationDate: {
        type: Date,
        default: Date.now
    }, 
    beenPurchased: Boolean,
    image: String,
});

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;