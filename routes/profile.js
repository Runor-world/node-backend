const express = require('express')
const { 
    getAllProfiles,
    updateProfileInfo,
    updateProfilePhoto,
    updateProfileBackgroundPhoto,
    createUserServiceProfile,
    updateUserServiceProfile,
 } = require('../controllers/profile')
const authenticateUser = require('../middleware/auth')
const router = express.Router()

router.route('/').get(authenticateUser, getAllProfiles)
router.route('/profile-service').post(createUserServiceProfile)
router.route('/profile-service').patch(updateUserServiceProfile)
router.route('/personal').patch(authenticateUser, updateProfileInfo)
router.route('/photo').patch(authenticateUser, updateProfilePhoto)
router.route('/backgroundphoto').patch(authenticateUser, updateProfileBackgroundPhoto)

module.exports = router

