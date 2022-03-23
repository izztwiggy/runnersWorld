const mongoose = require('../db/connection')
const User = require('./users')
const Route = require('./routes')


const matchSchema = new mongoose.Schema({ 
    matchA:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accepted_A: Boolean,
    matchB: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accepted_B: Boolean
}, {timestamps: true})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match
