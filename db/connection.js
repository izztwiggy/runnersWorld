const mongoose = require('mongoose')

const mongoURI = process.env.NODE_ENV === 'production' ?
process.env.MONGODB_URL : 
process.env.MONGODB_URI

mongoose.connect(mongoURI, {
    useNewURLParser: true, 
    useUnifiedTopology: true
})
.then(instance => console.log(instance.connections[0].name))
.catch(err => console.error(err))

module.exports = mongoose 