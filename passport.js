const User = require('./models/auth')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// facebook passport setup
passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/api/auth/facebook/callback', 
        passReqToCallback : true,
        profileFields: ['id', 'displayName', 'photos', 'email'],
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log('facebook: ', profile.emails[0])
        User.findOne({facebookID: profile.id})
        .then((currentUser) =>{
            if(currentUser){
                // if user is already saved
                return done(null, currentUser)
            }else{
                // if user is not saved
                new User({
                    firstName: profile.name.givenName,
                    otherName: profile.name.familyName,
                    googleID: profile.id,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                })
                .save()
                .then((savedUser) => {
                    // console.log(savedUser)
                    return done(null, savedUser)
                })
            }
        }).catch((err) => {
            console.log('User not found!', err)
        })
    })
)

// google setup
passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback', 
    passReqToCallback: true, 
}, (req, accessToken, refreshToken, profile, done) => {
    // console.log(profile)
    User.findOne({googleID: profile.id})
        .then((currentUser) =>{
            if(currentUser){
                // if user is already saved
                return done(null, currentUser)
            }else{
                // if user is not saved
                new User({
                    firstName: profile.name.givenName,
                    otherName: profile.name.familyName,
                    googleID: profile.id,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                })
                .save()
                .then((savedUser) => {
                    // console.log(savedUser)
                    return done(null, savedUser)
                })
            }
        }).catch((err) => {
            console.log('User not found!', err)
        })
}))

passport.serializeUser((user, cb)=>{
    console.log('users: ', user)
    return cb(null, user.id)
})


passport.deserializeUser(async(id, cb) =>{
    console.log('id: ' , id)
    const user = User.findOne({where: {_id: id}})
    .then((user)=>{
        cb(null, user)
    })
    .catch((err)=>{
        console.log(err)
        cb(err, null)
    })
})