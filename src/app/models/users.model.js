const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    role: String,
    avtImage: String,


    isConfirmed: Boolean,
    isActive: Boolean,
    isLocked: Boolean,

    
    emailConfirmed: Boolean,
    token: String,
    startTime: Number,
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;