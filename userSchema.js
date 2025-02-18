const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    lastname: {
        type: String,
    },
    firstname: {
        type: String,
    },
    gender: {
        type: String,
    },
    birthday: {
        type: String,
    },
});

const userProfile = mongoose.model('userProfile', userSchema);

module.exports = userProfile;

