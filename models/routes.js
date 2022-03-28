const mongoose = require('../db/connection')
const User = require('./users')

// user in route 

const routeSchema = new mongoose.Schema({ 
    name: {type: String, required: true}, 
    distance: {type: Number, required: true}, 
    notes: [String], 
    location: String,
    startZip: String,
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    images:{
        url: String, 
        filename: String
    } 
})

const Route = mongoose.model('Route', routeSchema)

module.exports = Route
