require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('./models/users')

app.set('port', process.env.PORT || 4600)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    cors({
      origin: process.env.PRODUCTION ? process.env.FRONT_END_URL : "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
);
// const SESSION_SECRET = process.env.SESSION_SECRET
const sessionsController = require('./controllers/sessions')
const usersController = require('./controllers/users')
const routesController = require('./controllers/routes')
const matchesController = require('./controllers/matches')

// middleware
const routeHit = async (req, res, next) => {
    console.log("A new route was just hit");
    next();
};

const authRequired = async(req,res,next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token from header : headers.authroization, split into array, [0] is bearer, [1] is actual token
            token = req.headers.authorization.split(' ')[1]
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // get user 
            req.user = await User.findById(decoded.id).select('-password')
            next()
        }catch(err){
            console.error(err)
            res.status(401).json({message: "Not Authorized"})
        }
    }
    if(!token) res.status(401).json({message: "Not Authorized, no token"})

}

const errHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message, 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}


app.use(errHandler)
app.use(routeHit)
app.use('/sessions', sessionsController)
app.use('/routes', authRequired, routesController)
app.use('/matches',  authRequired, matchesController)
app.use('/user', authRequired, usersController)


app.get('/', (req,res) => {
    res.send('Hello')
})


app.listen(app.get('port'), () => {
    console.log(`port: ${app.get('port')}`)
})