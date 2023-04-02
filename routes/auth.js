const passport = require('passport')
const express = require('express')
const router = express.Router()

const {
    login,
    register, 
    updateUser, 
    logout, 
    loginSuccess, 
    loginFailure, 
} = require('../controllers/auth')

const authenticateUser = require('../middleware/auth')

router.route('/login').post(login)
router.route('/signup').post(register)
router.route('/update-user').patch(authenticateUser, updateUser)


// passport auth routes:
router.route('/logout').get(logout)
router.route('/login/success').get(loginSuccess)
router.route('/login/failed').get(loginFailure)

const REDIRECT_URL = process.env.SERVER === 'production'? 'https://runor.org': 'http://localhost:3000/'

// facebook-passport routes
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}))

router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login/failed',
    }), (req, res)=>{
        res.redirect(REDIRECT_URL)
    }
)

// google-passport routes
router.get('/google', passport.authenticate('google', {session: false ,scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google',  {
        failureRedirect: '/login/failed',
        failureMessage: 'Login with Google failed! Try again.', 
        // session: false
    }), (req, res)=>{
        // res.set('jwt', req.user.getJWT())
        res.redirect(REDIRECT_URL)
    }
)


module.exports = router