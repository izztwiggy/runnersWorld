const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require('../models/users')
const Profile = require('../models/profile')
const jwt = 'jsonwebtoken'
const findOrCreate = require('mongoose-findorcreate')
const passportLocalMongoose = require('passport-local-mongoose')

const GoogleStrategy = require('passport-google-oauth20').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy
// const localStrategy = require("passport-local").Strategy

const CLIENT_URL = 'http://localhost:4600/'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleAuth = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token, 
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    console.log(`User ${payload.name} verified`)
    const {givenName, familyName, email, picture } = payload
    const userId = sub
    return { userId, email, givenName, familyName, picture}
}

router.post('/google', (req,res) => {
    googleAuth()
})

// router.post('/google', (req,res) => {
//     const {token} = req.body
//     client.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID
//     }).then(res => {
//         const { givenName, familyName, email, picture} = res.payload
//         //console.log('res.payload',res.payload)
//         console.log(givenName, familyName, email, picture)
//         if(email){
//             User.findOne({email}).exec((err, user) => {
//                 if(err) return res.status(400).json({message: "Something went wrong"})
//                 if(user){
                
//                     const {_id, email} = user
//                     return res.json({
//                         token: jwt.sign(user._id, process.env.JWT_SECRET, {
//                             expiresIn: process.env.JWT_EXPIRES_IN
//                         }),
//                         user : { _id, email }
//                     })
//                 }else {
//                     let newUser
//                     let password = (email + process.env.REFRESH_TOKEN_SECRET)
//                     newUser = User.create({email, password})
//                     newUser.save(err,user => {
//                         if(err) return res.status(404).json({message:"Error"})
//                         if(user){
//                             if( givenName && familyName){
//                                 let profile = Profile.create({
//                                     user: user,
//                                     firstName:givenName,
//                                     lastName:familyName
//                                 })
//                                 profile.save((err, prof)=> {
//                                     if(err) res.status(400).json({message: "Error in Creating Profile"})
//                                     if(prof) console.log('created Profile')
//                                 })
//                             }else {

//                                 res.status(200).json({
//                                     user: data,
//                                     token: jwt.sign(data._id, process.env.JWT_SECRET, {
//                                         expiresIn: process.env.JWT_EXPIRES_IN
//                                     }),
//                                     profile
//                                 })
//                             } 
//                         }
                        
//                     })
//                 }
//             })                
//         }
//     })

// })

module.exports = router

// const authCheck = (req,res,next) => {
//     if(req.user) next()
//     res.status(401).send('You must login')
// }

// passport.use(User.createStrategy())

// passport.serializeUser(function(user,done){
//     done(null, user.id)
// })

// passport.deserializeUser(function(id,done){
//     User.findById(id, function(err,user){
//         done(err, user)
//     })
// })


// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.NODE_ENV === 'prodocution' ? process.env.FRONTEND_URL : 'http://localhost:4600'}/auth/google/callback`,
//     passReqToCallback: true,
// },
//     async (req, accessToken, refreshToken, profile, cb) => {
//         console.log(profile)
//         try{
//             // see if user exists:
//             let user = await User.findOne({googleId : profile.id})
//             if(user){
//                 res.status(200).json({user})
//                 done(null, user)
//             }else {
//                 user = await User.create(createUser)
//                 let profile = await Profile.create({ user: user.id})
//                 user && profile ? 
//                 res.status(200).json({user: user, profile: profile}) : 
//                 res.status(400).json({message:"Error"})
//                 done(null, user)
//             }
//         }catch{
//             if(err){
//                 console.log(err)
//             }
//         }
//         const user = await User.findOrCreate(createUser).catch((err) => {
//         console.log("Error signing up", err);
//         cb(err, null);
//         });
//         if (user) return cb(null, user && user[0]);
//         }
//         )
//     )

// router.post('/google', async(req,res,next) => {
//     try{
//         const {token} = req.body
//         let check = await passport.authenticate(req.body)
//         console.log(check)

//     }catch(err){
//         next(err)
//     }
// })
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:4600/auth/facebook/callback",
//     profileFields: ['id','displayName','email'],
//     passReqToCallback: true,
//   },
//   async function (accessToken, refreshToken, profile, cb) {
//     console.log(profile)
//     let newUser = await User.findOrCreate({facebookId: profile.id}, function(err,user){
//         return cb(err, user)
//     })
//     newUser ?
//     res.status(200).json(newUser) :
//     res.status(404).json({error:error.message})
//   }
// ));

// router.post('/googleauth',
//     passport.authenticate('google', {    
//         successRedirect: `${CLIENT_URL}login/success`,
//         failureRedirect: `${CLIENT_URL}login/failed`
//     }),
//     function(req, res) {
//         console.log('success')
//         // Successful authentication, redirect home.
//         console.log(req.body, req.user)
//         res.status(200).json({})
//     }
// )

// router.post('/auth/googlelogin', async(req,res,next) => {
//     try{
//         passport.authenticate('google', {failureRedirect : '/login'}), 
//         function(req,res){
//             res.redirect('/secrets')
//         }
//     }catch(err){
//         next(err)
//     }
// }



// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//       successRedirect: `${DB_URL}login/success`,
//       failureRedirect: `${DB_URL}login/failed`,
//     }),
//     (req, res) => {
//       console.log("User: ", req.user);
//       res.status(200).json({user: req.user.id})
//     }
//   );


// router.get('/auth/facebook',
//     passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] }));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {    
//     successRedirect: `${CLIENT_URL}login/success`,
//     failureRedirect: `${CLIENT_URL}login/failed`
// }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.status(200).json({})
// });

// router.get('/auth/facebook', 
//     passport.authenticate('facebook')
// )

// router.get('/auth/facebook/callback', 
//     passport.authenticate('facebook', {failureRedirect: '/sessions/login'}), 
//     function(req,res){
//         console.log(req.user)
//         res.status(200).json({user: req.user})
//     }
// )  

// router.get("/login/success", async(req, res, next) => {
//     try{
//         if (req.user) {
//             res.status(200).json({
//                 success: true,
//                 message: "successfull",
//                 user: req.user,
//                 cookies: req.cookies,
//             });
//         }
//     }catch(err){
//         next(err)
//     }
//   });
  
//   router.get("/login/failed", (req, res) => {
//     res.status(401).json({
//       success: false,
//       message: "failure",
//     });
//   });
  









// FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });

// function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//       statusChangeCallback(response);
//     });
// }

// FB.login(function(response) {
//     // handle the response
  
// }, {scope: 'public_profile,email'});

// FB.login(function(response) {
//     if (response.status === 'connected') {
//       // Logged into your webpage and Facebook.
//     } else {
//       // The person is not logged into your webpage or we are unable to tell. 
//     }
// });

// FB.logout(function(response) {
//     // Person is now logged out
// });


// 
