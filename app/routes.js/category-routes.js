import express from 'express'
import categoryCtlr from '../controllers/categoryCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { authorizeUser } from '../middlewares/authorize.js'
import { checkSchema } from 'express-validator'
import categoryValidation from '../validators/category-validation.js'

const router = express.Router()

router.post('/categories', authenticateUser, authorizeUser(['expert', 'admin']), checkSchema(categoryValidation), categoryCtlr.create)
router.get('/categories', categoryCtlr.getAllCategory)

export default router