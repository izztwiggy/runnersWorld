const mongoose = require('../db/connection')

const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        unique:true,
        lowercase: true, 
        required: true
    },
    password:{type: String, required: true},
    training: {type: Boolean, required: true}
}, {timestamps : true})

const User = mongoose.model('User', userSchema)

module.exports = User
