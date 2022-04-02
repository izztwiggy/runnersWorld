require("dotenv").config();
const express = require('express')
const app = express()
const session = require("express-session");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const passport = require("passport");
const User = require('./models/users')
const authRequired = require('./utils/authRequired')

const recsController = require('./controllers/recs')
const usersController = require('./controllers/users')
const routesController = require('./controllers/routes')
const matchesController = require('./controllers/matches')
const sessionsController = require('./controllers/sessions')
const dashboardController = require('./controllers/dashboard')
const passportAuthController = require("./controllers/passport");

app.set('port', process.env.PORT || 4600)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
)
app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? process.env.FRONT_END_URL :  "http://localhost:3000" , // <-- location of the react app were connecting to
      credentials: true,
    })
);

app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', passportAuthController)
app.use('/sessions', sessionsController)
app.use('/dashboard', authRequired, dashboardController)
app.use('/matches',  authRequired, matchesController)
app.use('/routes', authRequired, routesController)
app.use('/user', authRequired, usersController)
app.use('/recs', authRequired, recsController)



app.listen(app.get('port'), () => {
    console.log(`port: ${app.get('port')}`)
})