const mongoose = require('mongoose');
const { Schema } = mongoose;


const imageSchema = new Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    }
});

const imageModel = mongoose.model('image', imageSchema);
module.exports = imageModel;