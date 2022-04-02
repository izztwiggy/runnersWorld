const mongoose = require('../db/connection')
const User = require('./users')

const matchRequestSchema = new mongoose.Schema({ 
    // matchA is the initiator
    matchA:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // matchB is the acceptor or denier
    matchB: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accepted: {type: Boolean, default: false}
}, {timestamps: true})

const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema)

module.exports = MatchRequest