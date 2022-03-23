const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes')
const Match = require('../models/match')
// app.use('/routes', routesController)

// see all routes:
router.get('/', async(req,res,next) => {
    try{
        const allRoutes = await Route.find({})
        allRoutes ?
        res.status(200).json(allRoutes) :
        res.status(500).json({error: error.message})
    }catch(err){
        next(err)
    }
})

// get specific route
router.get('/:routeID', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeID)
        route ? 
        res.status(200).json(route) :
        res.status(500).json({error: error.message})
    }catch(err){
        next(err)
    }
})

// edit route
router.put('/:routeID', async(req,res,next) => {
    try{
        const editRoute = await Route.findByIdAndUpdate(req.params.routeID, req.body, {new:true})
        editRoute ? 
        res.status(200).json(editRoute) : 
        res.status(500).json({message : error.message})
    }catch(err){
        next(err)
    }
})

// delete route
router.delete('/:routeID', async(req,res,next) => {
    try{
        const deleteRoute = await Route.findByIdAndDelete(req.params.routeID)
        deleteRoute ? 
        res.status(200).json({message: "Delete Successful"}) : 
        res.status(404).json({message : error.message})

    }catch(err){
        next(err)
    }
})

module.exports = router