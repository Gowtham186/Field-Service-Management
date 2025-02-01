import express from 'express'
import authenticateUser from '../middlewares/authenticateUser.js'
import skillCtlr from '../controllers/skillCtlr.js'
const router = express.Router()

router.post('/skills', skillCtlr.create)
router.get('/skills', skillCtlr.getAllSkills)

export default router