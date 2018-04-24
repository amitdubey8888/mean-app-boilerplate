var mongoose = require('mongoose');

// Token Schema
var TokenSchema = mongoose.Schema({
    token: { type: String },
    userId: { type: String, ref: 'User' }
}, {
        timestamps: true,
        collection: "Token"
    });


var Token = module.exports = mongoose.model('Token', TokenSchema);
