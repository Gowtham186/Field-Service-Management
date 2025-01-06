import express from 'express'
import customerCtlr from '../controllers/customerCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/', authenticateUser, customerCtlr.create)
router.put('/:id', authenticateUser, customerCtlr.update)

export default router