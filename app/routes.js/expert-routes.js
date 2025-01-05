import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { uploadMiddleware } from '../utils.js/multer-cloudinary.js'

const router = express.Router()

router.post('/', authenticateUser, uploadMiddleware, expertCtlr.create)

export default router