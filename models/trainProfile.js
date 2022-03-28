const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')

const today = new Date()
const year = today.getFullYear()

const trainProfileSchema = new mongoose.Schema({ 
    firstName: String,
    lastName: String,
    birthDate: {
        // will save here as 1 - 12, though indexed need to remember is 0 - 11
        month: {type: Number, min: 1, max: 12},
        day: {type: Number, min: 1, max: 31},
        year: {type: Number, max: year - 18}
    },
    genderIdentity: String, 
    location: {type: String, lowercase: true},
    zipCode: String,
    matchMe: {type: Boolean, default: true},
    training: {
        // distanceMax - max miles per run at any given time
        distanceMax: {type: Number, min: 0},
        raceDistance : {type: Number, min: 0}, 
        raceMeasurement : {type: String, default: 'mi'}
    },
    prefrences: {
        filterGender: {type: Boolean, default: false},
        genderToFilter: { 
            tranF: {type: Boolean, default: false},
            tranM: {type: Boolean, default: false},
            nb:  {type: Boolean, default: false},
            f:  {type: Boolean, default: false},
            m:  {type: Boolean, default: false},
        },
        ageRange: {
            min: {type: Number, min: 18},
            max: {type: Number, max: 100}
        }, 
        location: {type: String, lowercase: true}, 
        milesRange: {type: Number, default: 5, min: 0}
    },
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    } 
}, {timestamps : true})


trainProfileSchema.statics.findByName = function(firstName){
    return this.where({firstName : new RegExp(firstName, "i")})
}

const TrainProfile = mongoose.model('TrainProfile', trainProfileSchema)




module.exports = TrainProfile