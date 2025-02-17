import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import { authorizeUser } from "../middlewares/authorize.js"
import statsCtlr from "../controllers/statsCtlr.js"

const router = express.Router()

router.get('/stats/total-revenue', authenticateUser, authorizeUser(['admin']), statsCtlr.totalRevenue)
// stats route for expert revenue
router.get('/stats/experts/:id/revenue', authenticateUser, authorizeUser(['expert']), statsCtlr.expertRevenue);
router.get('/stats/experts/:id/bookings', authenticateUser, authorizeUser(['expert']), statsCtlr.expertBookingsAnalytics)

export default router