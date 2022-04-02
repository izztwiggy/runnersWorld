const express = require("express");
const router = express.Router();
const User = require('../models/users')
const Route = require('../models/routes');
const Profile = require('../models/profile')

// app.use('/routes', routesController)

// see all routes: auth required 
router.get('/', async(req,res,next) => {
    try{
        const allRoutes = await Route.find({})
        return allRoutes ?
        res.status(200).json(allRoutes) :
        res.status(500).json({error: error.message})
    }catch(err){
        next(err)
    }
})

router.get('/search', async(req,res,next) => {
    
    try{
        const { searchQuery, tags, author} = req.query;
        if(req.query){
            const name = new RegExp(searchQuery, "i")
            const createdBy = await Profile.findOne({firstName: author})
            const routes = await Route.find({$or:[{name},{user: createdBy.id},{ tags: { $in: tags.split(',') } }]})
            return routes ? res.status(200).json({routes}) : res.status(404).json({error: error.message})
        }
        const allRoutes = await Route.find({})
        return allRoutes ?
        res.status(200).json(allRoutes) :
        res.status(500).json({error: error.message})
    }catch(err){
        next(err)
    }
})

// post new route to all routes 
router.post('/', async(req,res,next) => {
    try{
        if(!req.user) return res.status(404).json({message: "No User Found"})
        const {name, distance} = req.body
        console.log('hello new route')
        if(!name || !distance) return res.status(404).json({message: "Missing Required Name or Distance"})
        const routeData = {
            ...req.body, 
            user: req.user.id
        }
        const newRoute = await Route.create(routeData)
        newRoute.save()
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

// delete route
router.delete('/:routeId', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        if(route.user._id.toString() === req.user.id){
            await route.remove()
            return res.status(204).json({message: "Deleted Route"})
        }else {
            return res.status(404).json({message: "Unauthorized Request"})
        }
    }catch(err){
        next(err)
    }
})


// edit route
router.put('/:routeId', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        route && console.log(route.user._id.toString(), req.user.id)
        if(route.user._id.toString() === req.user.id){
            const editRoute = await Route.findByIdAndUpdate(req.params.routeId, req.body, {new:true})
            return editRoute ? 
            res.status(200).json(editRoute) : 
            res.status(500).json({error: error.message})
        }
        return res.status(500).json({message: "Unauthorized Request"})
       
    }catch(err){
        next(err)
    }
})


router.put('/:routeId/likes', async(req,res,next) => {
    try{
        const route = await Route.findById(req.params.routeId)
        const alreadyLiked = await route.likes.findIndex((id) => id === (req.user.id).toString())
        if(alreadLiked === -1){
            route.likes.push(req.user.id)
        }else{
             route.likes = route.likes.filter((id) => id !== (req.user.id).toString())
        }       
        route.save()
        route ? 
        res.status(200).json(route) : 
        res.status(500).json({message : error.message})
    }catch(err){
        next(err)
    }
})                                                                                                                                      

module.exports = router