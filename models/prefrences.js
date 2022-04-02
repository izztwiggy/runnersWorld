
const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')


// gender keys:
// let female = 0
// let nonBinary = 1
// let male = 2 
// let transFem = 3
// let transMasc = 4
// let twoSpirit = 5
// let selfIdentify = 6
// let undisclosed = 7

const prefrenceSchema = new mongoose.Schema({ 
    training: { type: Boolean, default: false}, 
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
        max: {type: Number, max: 110}
    }, 
    location: {type: String, lowercase: true}, 
    milesRange: {type: Number, default: 5, min: 0},
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps : true})

const Prefrences = mongoose.model('Prefrences', prefrenceSchema)

module.exports = Prefrences
