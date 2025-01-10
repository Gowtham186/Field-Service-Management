import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { uploadMiddleware } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()

router.post('/experts', authenticateUser, uploadMiddleware, expertCtlr.create)
router.get('/experts/:id', authenticateUser, expertCtlr.getProfile)
router.put('/experts/:id', authenticateUser, expertCtlr.profileUpdate)
router.put('/experts/verify/:id', authenticateUser, authorizeUser(['admin']), expertCtlr.verify)

export default router