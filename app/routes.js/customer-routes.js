import express from 'express'
import customerCtlr from '../controllers/customerCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/customers', authenticateUser, customerCtlr.create)
router.get('/customers/:id', authenticateUser, customerCtlr.profile)
router.put('/customers/:id', authenticateUser, customerCtlr.update)

export default router