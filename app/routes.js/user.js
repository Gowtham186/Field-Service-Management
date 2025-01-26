import express from 'express'
import userCtlr from '../controllers/userCtlr.js'
import { adminLoginValidation } from '../validators/user-Validation.js'
import { checkSchema } from 'express-validator'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/users/register', userCtlr.register)
router.post('/users/login', userCtlr.login)
router.post('/users/verifyOtp', userCtlr.verifyOtp)
router.get('/users/profile', authenticateUser, userCtlr.profile)
router.post('/users/admin', checkSchema(adminLoginValidation), userCtlr.adminLogin)

export default router