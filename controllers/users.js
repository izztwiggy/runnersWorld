const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes')
const Match = require('../models/match')
const MatchRequest = require('../models/matchRequest')
const Schedule = require('../models/schedule');
const Profile = require("../models/profile");
const Prefrences = require('../models/prefrences')
// app.use('/user', usersController)

//<--------  user profile: -----> auth required on all routes
// GET the current user with JWT 
router.get('/', async(req,res,next) => {
    try{
        const userProfile = await Profile.findOne({user:req.user.id})
        const userPref = await Prefrences.findOne({user:req.user.id})
        userProfile && userPref ?
        res.status(200).json({user:req.user.id,profile: userProfile, prefrences: userPref}) :
        res.status(404).json({error: error.message})
    }catch(err){
        next(err)
    }
})

// view others profile
router.get('/:id', async(req,res,next) => {
    try{
        if(req.user.id !== req.params.id){
            const userProfile = await Profile.findOne({user:req.params.id})
        }
        userProfile ?
        res.status(200).json({user:req.params.id, profile: userProfile}) :
        res.status(404).json({error: error.message})
    }catch(err){
        next(err)
    }
})

//-----------------> router delete: delete user: 
router.delete('/', async(req,res,next) => {
    try{
       const deleteUserProfile = await Profile.findOneAndDelete({user:req.user.id})
       const deletePrefs = await Prefrences.findOneAndDelete({user: req.user.id})
       const deleteMatcheRequests = await MatchRequest.deleteMany($or[{matchA: req.user.id}, {matchB: req.user.id}])
       const deleteMatches = await Match.deleteMany($or[{matchA: req.user.id}, {matchB: req.user.id}])
       const deleteSchedule = await Schedule.deleteMany($or[{matchA: req.user.id},{matchB: req.user.id}])
       const userDelete = await User.findByIdAndDelete(req.user.id)
       // deleteMatchRequestA && deleteMatchRequestB && deleteMatchesA && deleteMatchesB && deleteUserRoutes
       deleteUserProfile && deleteMatcheRequests && deleteMatches && userDelete  && deleteSchedule ?
       res.status(200).json({message: "Deleted User and User Routes"}) : 
       res.status(500).json({error : error.message})
   }catch(err){    
       next(err)
   }   
})

//----------------->router put: create & edit user prefrences user profile 
router.put('/profile', async(req,res,next) => {
     try{
        const userProfile = await Profile.findOneAndUpdate({user:req.user.id}, req.body, {new:true})
        userProfile ?
        res.status(200).json(userProfile) : 
        res.status(404).json({error: error.message})
    }catch(err){
        next(err)
    }
})


router.put('/prefrences', async(req,res,next) => {
    try{
       const userPrefs = await Prefrences.findOneAndUpdate({user:req.user.id}, req.body, {new:true})
       userPrefs ?
       res.status(200).json(userPrefs) : 
       res.status(404).json({error: error.message})
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




module.exports = router