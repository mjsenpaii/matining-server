const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: false
    },
}, { collection: 'tbl_users' });

const userProfile = mongoose.model('userProfile', userSchema);

module.exports = userProfile;

