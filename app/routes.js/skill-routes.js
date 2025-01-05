import express from 'express'
import skillCtlr from '../controllers/skillCtlr.js'

const router = express.Router()

router.post('/', skillCtlr.create)
router.get('/', skillCtlr.getAllSkills)

export default router