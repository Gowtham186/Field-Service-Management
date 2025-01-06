import express from 'express'
import expertCtlr from '../controllers/expertCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { uploadMiddleware } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()

router.post('/', authenticateUser, uploadMiddleware, expertCtlr.create)
router.put('/:id', authenticateUser, expertCtlr.update)
router.put('/verify/:id', authenticateUser, authorizeUser(['admin']), expertCtlr.verify)

export default router