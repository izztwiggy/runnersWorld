const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Profile = require('../models/profile') //buddy = profile, training = trainProfile
const Route = require('../models/routes')
const Match = require('../models/match')
const MatchRequest = require('../models/matchRequest');
const Schedule = require("../models/schedule");

// get dash Scheduler for cur user
router.get('/', async(req,res,next) => {
    try{
        const schedules = await Schedule.find({ $or:[{userA: req.user.id}, {userB: req.user.id}]}).populate('route').sort({createdAt: 'descending'})
        schedules.length > 0 ?
        res.status(200).json(schedules) :
        res.status(400).json({message: "No Scheduled Events"})
        
    }catch(err){
        next(err)
    }
})

router.post('/', async(req,res,next) => {
    try{
        let {month, date,year, route, userB} = req.body
        let data = {
            month: month, 
            date: date,
            year: year, 
            route: route,
            matchA: req.user.id,
            matchB:userB
        }
        const createSchedule = await Schedule.create(data)
        createSchedule.save()
        createSchedule ?
        res.status(200).json(createSchedule) :
        res.status(400).json({error: error.message})
    }catch(err){
        next(err)
    }
})

router.delete('/:eventId', async(req,res,next) => {
    try{
        const event = await Schedule.findByIdAndDelete(req.params.eventId)
        event ? 
        res.status(200).json({message:"Successfully Deleted"}) :
        res.status(400).json({error: error.message})
    }catch(err){
        next(err)
    }
})

router.put('/:eventId', async(req,res,next) => {
    try{
        const event = await Schedule.findByIdAndUpdate(req.params.eventId, req.body, {new:true})
        event.save()
        event ? 
        res.status(200).json(event) :
        res.status(400).json({error: error.message})
    }catch(err){
        next(err)
    }
})


module.exports = router