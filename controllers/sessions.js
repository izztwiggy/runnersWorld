const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/users')
const Profile = require('../models/profile');
const Prefrences = require("../models/prefrences");
const sendEmail = require('../utils/sendEmail')



// generate jwt token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const refreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })
}

// token length > 500 is google auth, < 500 is here

const CLIENT_URL = process.env.NODE_ENV === 'production' ? process.env.FRONT_END_URL : 'http://localhost:3000'
const DB_URL = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URL : 'http://localhost:4600'

// const getResetPasswordToken = async(id) => {
//     try{
//         const resetToken = crypto.randomBytes(20).toString('hex')
//         // create token hash
//         const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
//         // 10 mins to reset pw
//         let resetPasswordExpire = Date.now() + 10 * 60 * 1000
//         let user = await User.findByIdAndUpdate(id, {resetToken: resetPasswordToken, resetTokenExpire: resetPasswordExpire})
//         return resetToken
//     }catch(err){
//        console.error(err)
//     }

// }



// <---------------router post REGISTER ---------->
router.post('/register', async(req,res,next) => {
     try{
        let { email, password , username, verifyPassword } = req.body
        if(!email || !password ||!username || !verifyPassword){
            return res.status(505).json({message: "All Fields Must be Filled In"})
        }
        if(password === verifyPassword){
            const user = await User.findOne({$or:[{username:username},{email:email}]})
            if(user){
                return res.status(400).json({message: "User Already Exists"})
            }else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const createdUser = await User.create({
                    email: email,
                    username: username,
                    password: hashedPassword
                })
                const userProfile = await Profile.create({user: createdUser}) 
                const userPrefs = await Prefrences.create({user: createdUser})
                await userProfile.save()
                await userPrefs.save()

                createdUser && userProfile && userPrefs ? 
                res.status(201).json({
                    _id: createdUser.id, 
                    email: createdUser.email, 
                    profile: userProfile,
                    prefrences:userPrefs,
                    token: generateToken(createdUser._id)
                }) :
                res.status(404).json({message: "Invalid User Data"})
            }
        }else{
            return res.status(405).json({message : "Passwords Must Match"})
        }
        
    }catch(err){    
        next(err)
    }
})


// <---------------router post LOGIN ---------->
router.post('/login', async(req,res,next) => {
     try{
        const { email, password } = req.body
        if(!email || !password) return res.status(505).json({message: "Must include Both Email and Password"})
        let loginUser = await User.findOne({email: email})
        if(loginUser){
            const validPassword = await bcrypt.compare(password, loginUser.password)
            if(validPassword){
                let newRefreshToken = await refreshToken(loginUser.id)
                // if no cookies with the jwt, foundUser refreshToken is what we made, if there is a cookie with the token remove token
                // const newRefreshTokenArr = 
                // !cookies?.jwt ?  
                // loginUser.refreshToken :
                // loginUser.refreshToken.filter(refTok => refTok !== refreshToken)

                // if received a cookie in authentication, delete it here
                // if(cookies?.jwt) res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})

                // save current refreshToken with users refreshtokens
                // loginUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
                // save new refresh token to the users profile
                // await loginUser.save()
                const profile = await Profile.findOne({user: loginUser.id})
                const prefrences = await Prefrences.findOne({user:loginUser.id})
                // console.log(loginUser)
                res.cookie('jwt', newRefreshToken,{httpOnly: true,sameSite: 'None',maxAge: 24 * 60 * 60 * 1000})
                return res.status(200).json({
                    _id: loginUser.id,
                    email: loginUser.email,
                    profile: profile,
                    prefrences: prefrences,
                    token: generateToken(loginUser._id),
                    // refreshToken: refreshToken(loginUser.id)
                })
            }else{
                console.log('Invalid Username or password')
                return res.status(500).json({message: "Incorrect Username or Password"})
            }
        }else{
            return res.status(500).json({message: "Incorrect Username or Password"})
        }
    }catch(err){
        next(err)
    }
})



// <---------------router get logout  ---------->
router.get('/logout', async(req,res,next) => {
     try{
        // req.logout()
        const cookies = req.cookies
        if(!cookies?.jwt) return res.status(204).json({message:"Log Out Successful"})
        const refreshToken = cookies.jwt
        // is refreshtoken in db?
        const user = await User.findOne({refreshToken}).exec()
        if(!user){
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})
            return res.status(204).json({message:"Cookie Cleared, User Logged Out"})
        }
        // delete from the db
        // user.refreshToken = user.refreshToken.filter(refreshT => refreshT !== refreshToken)
        // await user.save()

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true})
        return res.status(204).json({message:"Cookie Cleared, User Logged Out"})

    }catch(err){
        next(err)
    }
})


// router.post('/resetPassword', async(req,res,next) => {
//     try{
//         const {email} = req.body
//         const user = await User.findOne({email: email})

//         if(!user) return res.status(404).json({message: "Email Could not be sent"})

//         const resetToken = getResetPasswordToken(user.id)

//         const resetUrl = `${process.env.FRONT_END_URL}/sessions/resetPassword/${resetToken}`
//         const message = `
//         <h1>You have requested a password reset</h1>
//         <p>Please go to this link to reset your password</p>
//         <a href=${resetUrl} clicktracking="off">${resetUrl}</a>
//         `
//         try{
//             await sendEmail({
//                 to: user.email, 
//                 subject: "Password Reset Request",
//                 text: message
//             })
//             res.status(200).json({success: true, data: "Email Sent"}) 
//         }catch(err){
//             user.resetPasswordToken = undefined
//             user.resetPasswordExpire = undefined
//             await user.save()
//             return res.status(500).json({message: "Email Could not be sent"})
//         }
//     }catch(err){
//         next(err)
//     }
// })

// // reset password
// router.put('/resetPassword/:resetToken', async(req,res,next) => {
//     let resetToken = crypto.createHash("sha256").update(req.params.resetToken).digest('hex')
//     try{
//         const user = await User.findOne({
//             resetPasswordToken: resetToken, 
//             resetPasswordExpire: {$gt: Date.now()}
//         })
//         if(!user) return res.status(404).json({message:"Invalid Reset Token"}) 

//         let newHashedPassword =  await bcrypt.hash(req.body.password, salt)
//         user.password = newHashedPassword
//         user.resetPasswordToken = undefined
//         user.resetTokenExpire = undefined
//         await user.save()
//         return res.status(201).json({success: true, message: "ReLog In to "})
        
        // const resetToken = req.params.resetToken
        // const {newPassword, verifyNewPassword} = req.body
        // const user = await User.findOne({email})

        // if(!user) return res.status(404).json({message: "Email Could not be sent"})

        // const resetToken = getResetPasswordToken(user.id)

        // const resetUrl = `http://localhost:4600/sessions/resetPassword/${resetToken}`
        // const message = `
        // <h1>You have requested a password reset</h1>
        // <p>Please go to this link to reset your password</p>
        // <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        // `
        // let send = await sendEmail({
        //     to: user.email, 
        //     subject: "Password Reset Request",
        //     text: message
        // })
        // console.log(send)
        // send && res.status(200).json({success: true, data: "Email Sent"}) 

        // if(!send){
        //     user.resetPasswordToken = undefined
        //     user.resetPasswordExpire = undefined
        //     await user.save()
        //     return res.status(500).json({message: "Email Could not be sent"})
        // }
        
//     }catch(err){
//         next(err)
//     }
// })


module.exports = router



//  console.log('reset password route')
// if(!newPassword || !verifyNewPassword) return res.status(404).json({message:"Must include all fields"})

// if(newPassword === verifyNewPassword){
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(newPassword, salt)
//     const user = await findByIdAndUpdate(req.user.id, {password: hashedPassword})
//     user ? 
//     res.status(200).json({message: "Updated Password"}) : 
//     res.status(400).json({errror:error.message})
// }




// router.get('/refresh', async(req,res,next) => {
//     try{
        
//         const cookies = req.cookies
//         if(!cookies?.jwt) return res.status(401).json({message: "Unauthorized"})
//         console.log(cookies.jwt)
//         const refreshToken = cookies.jwt

//         // res.clearCookie('jwt', {httpOnly:true, sameSite: 'none', secure: true})
//         // find refresh token in the array of refresh tokens
//         const user = await User.findOne({refreshToken}).exec()
//         if(!user) return res.status(403).json({message: "Forbidden"})
//         // if we cant find a user = forbidden
//         // We got a cookie and Cant Find User , but did get a refresh token - indicative of account hacked 
//         await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//             if(err || foundUser.id !== decoded.id) return res.status(403).json({message:"Forbidden"})
//             const accessToken = generateToken(foundUser.id)
//             res.status(200).json({accessToken})
//         })


        // // if the token is expired - forbidden need to reauthenticate
        // if(!decoded)return res.status(403).json({message:"Refresh token was expired. Please make a new signin request"})
        // // if a valid token, we know that they have been hacked, and we want to remove all the refresh tokens 
        // if(decoded){
        //     console.log('User has been hacked')
        //     const hackedUser = await User.findOne({id: decoded.id}).exec()
        //     hackedUser.refreshToken = []
        //     return await hackedUser.save()
        // }
        
        // const newRefreshTokenArr = user.refreshToken.filter(refreshT => refreshT !== refreshToken)

        // // evaluate the valid refresh token
        // const validRefresh = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        // if(!validRefresh || user.id !== validRefresh.id) return res.status(403).json({message: "Forbidden, please reAuthenticate user"})
        // // if expired:
        // if(validRefresh.exp){
        //     console.log('expired jwt refresh token')
        //     user.refreshToken = [...newRefreshTokenArr]
        //     return await user.save()
        // }
        //  // refresh token is valid
        // const accessToken = generateToken(user.id)
        // const newRefreshToken = refreshToken(user.id)
        // user.refreshToken = [...refreshToken, newRefreshToken]
        // await user.save()
        // await res.cookie('jwt', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000})

//     }catch(err){
//         next(err)
//     }
// })
