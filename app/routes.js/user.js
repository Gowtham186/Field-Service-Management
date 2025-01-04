import express from 'express'
import userCtlr from '../controllers/userCtlr.js'
import { adminLoginValidation, registerValidation } from '../validators/user-Validation.js'
import { checkSchema } from 'express-validator'
const router = express.Router()

router.post('/register', checkSchema(registerValidation), userCtlr.register)
router.post('/login', userCtlr.login)
router.post('/verifyOtp', userCtlr.verifyOtp)
router.post('/admin', checkSchema(adminLoginValidation), userCtlr.adminLogin)

export default router