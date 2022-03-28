const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes');

// app.use('/routes', routesController)

// see all routes: auth required 
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

router.post('/', async(req,res,next) => {
    try{
        const routeData = {
            ...req.body, 
            user: req.user
        }
        const newRoute = await Route.create(routeData)
        newRoute ?
        res.status(202).json(newRoute) : 
        res.status(404).json({error: error.message})
    }catch(err){
        next(err)
    }
})

// get specific route
router.get('/:routeId', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        route ? 
        res.status(200).json(route) :
        res.status(401).json({message: "No Route Found"})
    }catch(err){
        next(err)
    }
})

// edit route
router.put('/:routeId', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        if(!route) return res.status(401).json({message: "No Route Found"})
        const user = await User.findById(req.user.id)
        if(!user) return res.status(401).json({message: "No User Found, Unauthorized Request"})
        if(route.user.toString() !== user.id) return res.status(401).json({message: "User Not Authorized"})

        const editRoute = await Route.findByIdAndUpdate(req.params.routeId, req.body, {new:true})
        editRoute ? 
        res.status(200).json(editRoute) : 
        res.status(500).json({message : error.message})
    }catch(err){
        next(err)
    }
})

// delete route
router.delete('/:routeId', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        if(!route) return res.status(401).json({message: "No Route Found"})
        const user = await User.findById(req.user.id)
        if(!user) return res.status(401).json({message:"No User Found, Unauthorized Request"})
        if(route.user.toString() !== user.id) return res.status(401).json({message: "User Not Authorized"})

        await route.remove()
        res.status(200).json({id: req.params.routeId})
    }catch(err){
        next(err)
    }
})

module.exports = router