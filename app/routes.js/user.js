import express from 'express'
import userCtlr from '../controllers/userCtlr.js'
import { adminLoginValidation, registerValidation } from '../validators/user-Validation.js'
import { checkSchema } from 'express-validator'
const router = express.Router()

router.post('/users/register', userCtlr.register)
router.post('/users/login', userCtlr.login)
router.post('/users/verifyOtp', userCtlr.verifyOtp)
router.post('/users/admin', checkSchema(adminLoginValidation), userCtlr.adminLogin)

export default router