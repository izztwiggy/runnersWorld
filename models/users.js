const mongoose = require('../db/connection')
const Route = require('./routes')

const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        lowercase: true, 
        required: true
    },
    password:{type: String, required: true},
    firstName: String,
    lastName: String,
    username: String,
    birthDate: String,
    genderIdentity: String, 
    location: {type: String, lowercase: true},
    zipCode: String,
    matchMe: Boolean,
    prefrences: {
        training: Boolean, 
        gender: [ String ], 
        ageRange: String, 
        location: {type: String, lowercase: true}, 
        milesRange: String
    },
    training: {
        "distanceMax": Number,
        "raceDistance" : Number, 
        "measurment": String
    },
    matches:[ 
        {  
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    routes: [
        {  
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route'
        }
    ],
    profilePicture:{
        url: String, 
        filename: String
    } 
}, {timestamps : true})


userSchema.statics.findByName = function(firstName){
    return this.where({firstName : new RegExp(firstName, "i")})
}

const User = mongoose.model('User', userSchema)




module.exports = User
