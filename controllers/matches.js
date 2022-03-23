const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes')
const Match = require('../models/match')
// app.use('/matches', matchesController)

//  -------- user Get all swipe for matches ------>
router.get('/:userID', async(req,res,next) => {
    try{
        const user = await User.findById(req.params.userID)
        const findMatchA = Match.find({matchA : user.id}).where({}).populate("user")
        const findMatchB = Match.find({matchB : user.id}).populate("user")
    }catch(err){
        next(err)
    }
})

// --------- user post a "like to match" --------->
router.post('/:userA/:userB', async(req,res,next) => {
    try{
        // send a request
        const currUser = await User.findById(req.params.userA)
        const userB = await User.findById(req.params.userB)


    }catch(err){
        next(err)
    }
})

// --------- user "dislike" a match -------------->
router.post('/:userA/:userB', async(req,res,next) => {
    try{

    }catch(err){
        next(err)
    }
})

// --------- post acceptance to match ------------>
router.post('/:userA/:userB', async(req,res,next) => {
    try{

    }catch(err){
        next(err)
    }
})




module.exports = router