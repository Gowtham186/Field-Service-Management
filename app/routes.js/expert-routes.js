import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { upload } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()

router.post('/experts', authenticateUser, upload.fields([{name : 'profilePic', maxCount : 1}, { name : 'documents', maxCount : 3}]), expertCtlr.create)
router.get('/experts', authenticateUser, authorizeUser(['admin']), expertCtlr.getAllExperts)
//router.get('/experts', authenticateUser, authorizeUser(['admin']), expertCtlr.unVerifiedExperts)
router.put('/experts/verify/:id', authenticateUser, authorizeUser(['admin']), expertCtlr.verify)
router.get('/experts/:id', expertCtlr.getProfile)
router.put('/experts', authenticateUser, expertCtlr.profileUpdate)
//router.get('/experts/:id/availability', authenticateUser, expertCtlr.availability)
router.put('/experts/availability', authenticateUser, expertCtlr.updateAvailability)
router.get('/experts/:id/categories', expertCtlr.expertCategoriesBySkills)


export default router