import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { upload } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()
router.put('/experts/availability', authenticateUser, expertCtlr.updateAvailability)

router.post('/experts', authenticateUser, upload.fields([{name : 'profilePic', maxCount : 1}, { name : 'documents', maxCount : 3}]), expertCtlr.create)
router.get('/experts', authenticateUser, authorizeUser(['admin']), expertCtlr.getAllExperts)
router.get('/experts/myservices', authenticateUser, expertCtlr.getMyServices)
router.get('/experts/unverified', authenticateUser, authorizeUser(['admin']), expertCtlr.unVerifiedExperts)
router.put('/experts/verify/:id', authenticateUser, authorizeUser(['admin']), expertCtlr.verify)
router.get('/experts/:id', expertCtlr.getProfile)
router.get('/experts/:id/categories', expertCtlr.expertCategoriesBySkills)
router.put('/experts/:id', authenticateUser, expertCtlr.updateProfile)
router.put('/experts/:id/profilePic', authenticateUser, authorizeUser('expert'), upload.fields([{name : 'profilePic', maxCount : 1}]), expertCtlr.changeProfilePic)
// router.get('/experts/:id/revenue', authenticateUser, authorizeUser(['expert']), expertCtlr.expertRevenue)

export default router