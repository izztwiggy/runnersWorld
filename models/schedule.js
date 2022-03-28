const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')

const date = new Date()
const thisYear = date.getFullYear()

const scheduleSchema = new mongoose.Schema({ 
    month:{type: Number, min: 0, max: 11, required: true},
    day:{type: Number,min: 1, max: 31, required: true},
    year:{type: Number,min: thisYear - 1, max:thisYear + 1, required: true},
    userA:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userB:{
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    }
    
}, {timestamps: true})

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = Schedule