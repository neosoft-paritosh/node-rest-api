const mongoose = require('mongoose');

const logoutSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: { type: String, required: true }
});

module.exports = mongoose.model('Logout', logoutSchema);