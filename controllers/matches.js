const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Profile = require('../models/profile') //buddy = profile, training = trainProfile
const TrainProfile = require('../models/trainProfile')
const Route = require('../models/routes')
const Match = require('../models/match')
const MatchRequest = require('../models/matchRequest');
const Schedule = require("../models/schedule");
// app.use('/matches', matchesController)

//  -------- user Get find all potential users and send to user ------> auth required
router.get('/', async(req,res,next) => {
    try{
        // this is getting all POTENTIAL matches to send to the user to "swipe" through : to get all of user matches : go through /user/matches in user route
        // we want to get all users, filter by: training/buddy -> user location prefrence ->  age prefrence =>  the gender prefrences : AS WELL AS THE OTHER USERS PREFRENCES : should have a training partner bucket and a buddy bucket : 
        if(req.user.id) res.status(200).json({message: "proceed"})
        // if user is a training : look in all trainingProfiles to filter, 
        // if user is a buddy, look in all profiles to filter 

        // const user = await User.findById(req.user.id)
        // const findMatchA = Match.find({matchA : user.id}).populate("user")
        // const findMatchB = Match.find({matchB : user.id}).populate("user")
        
    }catch(err){
        next(err)
    }
})

// --------- user "likes a pontial match" --------->
router.post('/:userB', async(req,res,next) => {
    try{
        //1. check to see if there is a match request sent from the other user first: if so => accept it, create a match and delete the match request : 

        // ***  the person who initally liked the other will always be in positionA, the 2nd likee is in positionB

        //2. if there is not a match request - create one to show up for the other user
    
        let checkLikeRequest = await MatchRequest.find({matchA: req.params.userB, matchB: req.user.id})

        if(!checkLikeRequest){
            let sendLike = await MatchRequest.create({
                matchA : req.user.id,
                matchB : req.params.userB
            })
            sendLike ?
            res.status(200).json(sendLike) : 
            res.status(400).json({error: error.message})
        }

        // if true: 'accept' the like : create a match and delete the request
        if(checkLikeRequest){
               // the person who initally liked the other will always be in positionA, the 2nd likee is in positionB
            let newMatch = await Match.create({
                matchA : req.params.userB, 
                matchB : req.user.id
            })
            await newMatch.save()
            await checkLikeRequest.remove()
            console.log('New Match Created')
            newMatch ?
            res.status(202).json(newMatch):
            res.status(400).json({error: error.message})            
        }
    
    }catch(err){
        next(err)
    }
})

// --------- user "dislike" a match -------------->
router.post('/:userB', async(req,res,next) => {
    try{
         //check if match request is there - if so: delete it
        //  add user to "DO NOT SEE" list ---- how to do??

    }catch(err){
        next(err)
    }
})

// post a scheduled meet for users calendars, initiate through whoever sent the click
router.post('/:userB/:routeId/schedule', async(req,res,next) => {
    try{
        let today = new Date()
        let year = today.getFullYear()
        let route = await Route.findById(req.params.routeId)
        let data = {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year || year, 
            route : route || null,
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



// month:{type: Number, min: 0, max: 11, required: true},
//     day:{type: Number,min: 1, max: 31, required: true},
//     year:{type: Number,min: thisYear - 1, max:thisYear + 1, required: true},
//     userA:{  
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     userB:{
//         type : mongoose.Schema.Types.ObjectId, 
//         ref: 'User'
//     },
//     route: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Route'
//     }


module.exports = router