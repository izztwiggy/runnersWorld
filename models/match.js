const mongoose = require('../db/connection')
const User = require('./users')

const matchSchema = new mongoose.Schema({ 
    matchA:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    matchB: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match
