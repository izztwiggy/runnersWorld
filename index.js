require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')

app.set('port', process.env.PORT || 4600)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    cors({
      origin: process.env.PRODUCTION ? process.env.FRONT_END_URL : "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
);

const sessionsController = require('./controllers/sessions')
const usersController = require('./controllers/users')
const routesController = require('./controllers/routes')
const matchesController = require('./controllers/matches')

const routeHit = async (req, res, next) => {
    console.log("A new route was just hit");
    next();
};

app.use(routeHit)
app.use('/sessions', sessionsController)
app.use('/routes', routesController)
app.use('/matches', matchesController)
app.use('/user', usersController)


app.get('/', (req,res) => {
    res.send('Hello')
})


app.listen(app.get('port'), () => {
    console.log(`port: ${app.get('port')}`)
})