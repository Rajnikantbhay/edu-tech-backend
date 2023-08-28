const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true , 'password is required']
    },
    img: {
        type: String
    }
})

module.exports = mongoose.model('User', UserSchema)