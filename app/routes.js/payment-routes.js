import express from "express"
import paymentCtlr from "../controllers/paymentCtlr.js"


const router = express.Router()

router.post('/bookingfee', paymentCtlr.payBookingFee)
router.post('/servicefee', paymentCtlr.payServiceFee)
router.get('/payment/details', paymentCtlr.getPaymentDetails)

export default router