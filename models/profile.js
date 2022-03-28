const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')

const today = new Date()
const year = today.getFullYear()

const profileSchema = new mongoose.Schema({ 
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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
    prefrences: {
        // either True - or false if want training buddy
        training: { type: Boolean, default: false}, 
        filterGender: {type: Boolean, default: false}, //to filter by gender if false -> will skip looking at genderFilter.
        // if gender - true, then will look at these. will all default as false, if filtering, ones to be shown will be selected as true
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
        // location is based on city 
        location: {type: String, lowercase: true}, 
        // miles from city center
        milesRange: {type: Number, default: 5, min: 0}
    },
    training: {
        // distanceMax - max miles per run at any given time
        distanceMax: Number,
        raceDistance : Number, 
        raceMeasurement : String
    },
    routes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    }],
    profilePicture:{
        url: String, 
        filename: String
    } 
}, {timestamps : true})


profileSchema.statics.findByName = function(firstName){
    return this.where({firstName : new RegExp(firstName, "i")})
}

const Profile = mongoose.model('Profile', profileSchema)




module.exports = Profile