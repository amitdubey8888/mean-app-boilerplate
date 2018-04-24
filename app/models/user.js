var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    image: { type: String },
    accountType: { type: String, default: 'user' },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: String, default: false },
    isActivate: { type: Boolean, default: true }
}, {
        timestamps: true,
        collection: 'User'
    }));