import express from 'express'
import customerCtlr from '../controllers/customerCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
const router = express.Router()

router.post('/customers', authenticateUser, customerCtlr.create)
router.get('/customers/:id', authenticateUser, customerCtlr.profile)
router.put('/customers/:id', authenticateUser, customerCtlr.update)
router.post('/customers/:id/save-bookings', authenticateUser, customerCtlr.saveBookings)


router.get('/customer/my-bookings', authenticateUser, customerCtlr.myBookings)

export default router