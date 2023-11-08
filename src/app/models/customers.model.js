const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    fullname: String,
    address: String,
    phoneNumber: String,
});

const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;