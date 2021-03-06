const mongoose = require('../db/connection')
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')
const { uuid } = require('uuidv4');

const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        unique:true,
        lowercase: true, 
        required: true,
        trim:true
    },
    username:{type: String, lowercase: true}, 
    password:{type: String, required: true},
    googleId: String,
    facebookId:String,
    refreshToken:[String],
    resetToken: String,
    resetTokenExpire: Date
}, {timestamps : true})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

// userSchema.statics.createToken = async function(){
//     let expiredAt = new Date();
//     expiredAt.setSeconds(
//         expiredAt.getSeconds() + 86400
//     );
//     let _token = uuid()
//     console.log
//     let _object = new this.refreshToken({
//         token : _token, 
//         expiryDate: expiredAt.getTime()
//     })
//     console.log(_object)
//     let refreshToken = await _object.save()
//     return refreshToken.token
// }
// userSchema.statics.verifyExpiration = (token) => {
//     return token.expiraryDate.getTime() < newDate().getTime()
// }

const User = mongoose.model('User', userSchema)

module.exports = User
