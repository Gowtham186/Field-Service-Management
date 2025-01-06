import express from 'express'
import skillCtlr from '../controllers/skillCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { authorizeUser } from '../middlewares/authorize.js'
import { checkSchema } from 'express-validator'
import skillValidation from '../validators/skill-validation.js'

const router = express.Router()

router.post('/', authenticateUser, authorizeUser(['expert', 'admin']), checkSchema(skillValidation), skillCtlr.create)
router.get('/', skillCtlr.getAllSkills)

export default router