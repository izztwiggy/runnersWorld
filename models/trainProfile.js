const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')

const trainProfileSchema = new mongoose.Schema({ 

    training: {
        // distanceMax - max miles per run at any given time
        distanceMax: {type: Number, min: 0},
        raceDistance : {type: Number, min: 0}, 
        raceMeasurement : {type: String, default: 'mi'}
    },
    
}, {timestamps : true})

const TrainProfile = mongoose.model('TrainProfile', trainProfileSchema)




module.exports = TrainProfile