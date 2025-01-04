import express from 'express'
import customerCtlr from '../controllers/customerCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/', authenticateUser, customerCtlr.create)

export default router