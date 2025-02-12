import express from "express"
import paymentCtlr from "../controllers/paymentCtlr.js"


const router = express.Router()

router.post('/bookingfee', paymentCtlr.payBookingFee)

export default router