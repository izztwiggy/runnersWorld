const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes')
const Match = require('../models/match')
// app.use('/user', usersController)

//<--------  user profile: ----->

//----------------->router post: create User - user prefrences user profile
router.post('/:id/profile', async(req,res,next) => {
     try{
        const user = req.params.id

        
    }catch(err){
        
    }
})

//-----------------> router get </:id> : user Profile & settings
router.get('/:id/profile', async(req,res,next) => {
     try{
        const user = req.params.id

    }catch(err){
        
    }
})

// -----------------> router put : update user profile and settings
router.put('/:id', async(req,res,next) => {
     try{
        const user = req.params.id
        
    }catch(err){
        
    }
})


//-----------------> router delete: delete user 
router.delete('/:id', async(req,res,next) => {
     try{
        const user = req.params.id
        
    }catch(err){
        
    }
})

//<-------- user dashboard: ------> 

// get dashboard --------->
router.get('/:id/dashboard', async(req,res,next) => {
     try{
        const user = req.params.id
        
    }catch(err){
        
    }
})

//<-------- get user Routes --------->
router.get('/:id/routes', async(req,res,next) => {
     try{
        const user = req.params.id
        
    }catch(err){
        
    }
})

//<-------- get user Existing Matches --------->
router.get('/:id/matches', async(req,res,next) => {
     try{
        const user = req.params.id
        
    }catch(err){
        
    }
}) 


module.exports = router