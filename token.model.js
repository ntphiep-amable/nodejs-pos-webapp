const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema({
    token: { type: String, required: true },
    userEmail: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model('Token', TokenSchema);