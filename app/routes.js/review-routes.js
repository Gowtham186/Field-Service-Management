import express from 'express'
import authenticateUser from '../middlewares/authenticateUser.js'
import reviewCtlr from '../controllers/reviewCtlr.js'

const router = express.Router()

router.post('/reviews', authenticateUser, reviewCtlr.create)
router.get('/reviews/:id', reviewCtlr.getReviews)


export default router