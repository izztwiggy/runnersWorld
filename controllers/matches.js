const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Profile = require('../models/profile') //buddy = profile, training = trainProfile
const Route = require('../models/routes')
const Match = require('../models/match')
const MatchRequest = require('../models/matchRequest');
const Schedule = require("../models/schedule");
const Prefrences = require('../models/prefrences')
// app.use('/matches', matchesController)

// get all user Matches:
//<-------- get user Existing Matches --------->
router.get('/', async(req,res,next) => {
    try{
        const allMatches = await Match.find({ $or:[{matchA: req.user.id}, {matchB: req.user.id}]}).populate('user').sort({createdAt: 'descending'})
        allMatches && allMatches.length > 0 ? 
        res.status(200).json(allMatches) : 
        res.status(400).json({message : "No User Matches"})
       
    }catch(err){
        next(err)
    }
}) 

// post a scheduled meet for users calendars, initiate through whoever sent the click
router.post('/:userB/schedule', async(req,res,next) => {
    try{
        let today = new Date()
        let year = today.getFullYear()
        let data = {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year || year, 
            route : req.body.route || null,
            userA: req.user.id,
            userB: req.params.userB
        }
        const scheduled = await Schedule.create(data)
        scheduled ? 
        res.status(202).json(scheduled) : 
        res.status(400).json({error: error.message})
    }catch(err){
        next(err)
    }
})


router.delete('/:matchId', async(req,res,next) => {
    try{
        const deleteMatch = await Match.findByIdAndDelete(req.params.matchId)
        deleteMatch ?
        res.status(200).json({message:'Match deleted'}) : 
        res.status(400).json({error: error.message})

    }catch(err){
        next(err)
    }
})


module.exports = router