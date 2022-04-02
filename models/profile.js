const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')

const today = new Date()
const year = today.getFullYear()


const profileSchema = new mongoose.Schema({ 
    firstName: String,
    lastName: String,
    birthDate: {
        month: {type: Number, min: 1, max: 12},
        day: {type: Number, min: 1, max: 31},
        year: {type: Number, max: year - 18}
    },
    genderIdentity: String, 
    location: {type: String, lowercase: true},
    zipCode: String,
    matchMe: {type: Boolean, default: true},
    training: {
        distanceMax: Number,
        raceDistance : Number, 
        raceMeasurement : String
    },
    routes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
        }
    ],
    profilePicture:{
        url: String, 
        filename: String
    },
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps : true})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile