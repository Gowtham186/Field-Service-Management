import express from "express"
import paymentCtlr from "../controllers/paymentCtlr.js"


const router = express.Router()

router.post('/bookingfee', paymentCtlr.payBookingFee)
router.post('/servicefee', paymentCtlr.payServiceFee)
router.get('/payment/details', paymentCtlr.getPaymentDetails)
router.post('/webhooks', express.raw({ type : 'application/json'}), paymentCtlr.webhooks)

export default router