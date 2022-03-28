const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes')
const Match = require('../models/match')
const MatchRequest = require('../models/matchRequest')
const Schedule = require('../models/schedule');
const Profile = require("../models/profile");
// app.use('/user', usersController)

//<--------  user profile: -----> auth required on all routes
// GET the current user with JWT 
router.get('/', async(req,res,next) => {
    try{
        const {_id, email} = await User.findById(req.user.id)
        res.status(200).json({
            id: _id,
            email
        })
    }catch(err){
        next(err)
    }
})

//----------------->router put: create user prefrences user profile & edit user profile / prefrences: since one schema (maybe should be 2??)
router.put('/', async(req,res,next) => {
     try{
        const userProfile = await Profile.findOneAndUpdate({user:req.user.id}, req.body, {new:true})
        userProfile ?
        res.status(200).json(userProfile) : 
        res.status(404).json({error: error.message})
    }catch(err){
        next(err)
    }
})

//-----------------> router delete: delete user: 
router.delete('/', async(req,res,next) => {
     try{
        const deleteUserRoutes = await Route.deleteMany({user: req.user.id})
        const deleteUserProfile = await Profile.findOneAndDelete({user:req.user.id})
        const deleteMatchRequestA = await MatchRequest.find({matchA : req.user.id})
        const deleteMatchRequestB = await MatchRequest.find({matchB : req.user.id})
        const deleteMatchesA = await Match.find({matchA : req.user.id})
        const deleteMatchesB = await Match.find({matchB : req.user.id})
        const userDelete = await User.findByIdAndDelete(req.user.id)
        deleteUserRoutes && deleteUserProfile && deleteMatchRequestA && deleteMatchRequestB && deleteMatchesA && deleteMatchesB && userDelete ?
        res.status(200).json({message: "Deleted User and User Routes"}) : 
        res.status(500).json({error : error.message})
    }catch(err){    
        next(err)
    }   
})

//<-------- user dashboard:aka the calendar schedule for their dash home ------> 

// get dashboard ---------> populate user to get "scheduled with" user 
router.get('/schedule', async(req,res,next) => {
     try{
        const userSchedule = await Schedule.find({user: req.user.id})
        userSchedule ?
        res.status(200).json(userSchedule) :
        res.status(400).json({message : "No Scehduled Events Yet"})
        
    }catch(err){    
        next(err)
    }
})


//<-------- get user Routes ~ viewable from user dashboard--------->
router.get('/routes', async(req,res,next) => {
     try{
        let userRoutes = await Route.find({user: req.user.id})
        userRoutes ? 
        res.status(200).json(userRoutes) : 
        res.status(500).json({error: error.message})
    }catch(err){    
        next(err)
    }
})

//<-------- get user Existing Matches --------->
router.get('/matches', async(req,res,next) => {
     try{
        let userMatchA = await Match.find({matchA : req.user.id}).populate("user")
        let userMatchB = await Match.find({matchB: req.user.id}).populate("user") 
        let allMatches = userMatchA + userMatchB
        allMatches.length > 0 ? 
        res.status(200).json(allMatches) : 
        res.status(400).json({message : "No User Matches"})
        
    }catch(err){
        next(err)
    }
}) 


module.exports = router