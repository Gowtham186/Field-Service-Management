import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { upload } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()

router.post('/experts', authenticateUser, upload.array("documents", 5), expertCtlr.create)
router.get('/experts', authenticateUser, authorizeUser(['admin']), expertCtlr.getAllExperts)
router.get('/experts', authenticateUser, authorizeUser(['admin']), expertCtlr.unVerifiedExperts)
router.put('/experts/verify/:id', authenticateUser, authorizeUser(['admin']), expertCtlr.verify)
router.get('/experts/:id', authenticateUser, expertCtlr.getProfile)
router.put('/experts', authenticateUser, expertCtlr.profileUpdate)
router.get('/experts/availability', authenticateUser, expertCtlr.availability)

export default router