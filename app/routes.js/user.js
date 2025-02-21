import express from 'express'
import userCtlr from '../controllers/userCtlr.js'
import { adminLoginValidation, expertRegisterValidation } from '../validators/user-Validation.js'
import { checkSchema } from 'express-validator'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/users/register', checkSchema(expertRegisterValidation) ,userCtlr.register)
router.post('/users/login', userCtlr.login)
router.post('/users/verifyOtp', userCtlr.verifyOtp)
router.get('/users/profile', authenticateUser, userCtlr.profile)
router.put('/users', authenticateUser, userCtlr.updateUser)
router.post("/users/resetPassword",userCtlr.resetPassword)

//optional if admin login has different route in frontend
router.post('/users/admin', checkSchema(adminLoginValidation), userCtlr.adminLogin)

export default router