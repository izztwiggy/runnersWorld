const mongoose = require('../db/connection')
const { uuid } = require('uuidv4');

const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        unique:true,
        lowercase: true, 
        required: true,
        trim:true
    },
    password:{type: String, required: true},
    refreshToken:[String]
}, {timestamps : true})
// create a refresh token for user
userSchema.statics.createToken = async function(){
    let expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + 86400
    );
    let _token = uuid()
    console.log
    let _object = new this.refreshToken({
        token : _token, 
        expiryDate: expiredAt.getTime()
    })
    console.log(_object)
    let refreshToken = await _object.save()
    return refreshToken.token
}
userSchema.statics.verifyExpiration = (token) => {
    return token.expiraryDate.getTime() < newDate().getTime()
}

const User = mongoose.model('User', userSchema)

module.exports = User
