const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const Profile = require('../models/profile')

// app.use('/sessions', sessionsController)

// generate jwt token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '15m'
    })
}

const refreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}


// <---------------router post REGISTER ---------->
router.post('/register', async(req,res,next) => {
     try{
        //  make sure all fields are filled 
        let { email, password , verifyPassword } = req.body
        if(!email || !password || !verifyPassword){
            return res.status(400).json({message: "All Fields Must be Filled In"})
        }
        if(password === verifyPassword){
            // check for existing user
            const user = await User.findOne({email: email})
            if(user){
                return res.status(400).json({message: "User Already Exists"})
            }else {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const createdUser = await User.create({
                    email: email,
                    password: hashedPassword
                })
                const userProfile = await Profile.create({
                    user: createdUser
                })
                createdUser && userProfile ? 
                res.status(200).json({_id: createdUser.id, email: createdUser.email, token: generateToken(createdUser._id)}) : 
                res.status(400).json({message: "Invalid User Data"})
            }
        }else{
            return res.status(404).json({message : "Passwords Must Match"})
        }
        
    }catch(err){
        next(err)
    }
})

// <---------------router post LOGIN ---------->
router.post('/login', async(req,res,next) => {
     try{
        const { email, password } = req.body
        if(!email || !password) return res.status(500).json({message: "Must include Both Email and Password"})
        let loginUser = await User.findOne({email: email})
        if(loginUser){
            const validPassword = await bcrypt.compare(password, loginUser.password)
            if(validPassword){
                res.status(200).json({
                    _id: loginUser.id,
                    email: loginUser.email,
                    token: generateToken(loginUser._id)
                })
                console.log('Logged in user')
            }else{
                console.log('Invalid Username or password')
                res.status(500).json({message: "Incorrect Username or Password"})
            }
        }else{
            res.status(500).json({message: "Incorrect Username or Password"})
        }
        

    }catch(err){
        next(err)
    }
})

// <---------------router get logout  ---------->
router.get('/logout', async(req,res,next) => {
     try{
        console.log('logout')
        res.status(200).json({message: "Successfully logged out"})
    }catch(err){
        next(err)
    }
})

module.exports = router