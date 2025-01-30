import express from 'express'
import authenticateUser from '../middlewares/authenticateUser.js'
import { authorizeUser } from '../middlewares/authorize.js'
import serviceCtlr from '../controllers/serviceCtlr.js'

const router = express.Router()

router.delete('/services/:serviceId', authenticateUser, authorizeUser(['admin']), serviceCtlr.deleteService)
router.delete('/services', authenticateUser, authorizeUser(['admin']), serviceCtlr.deleteManyServices)
export default router