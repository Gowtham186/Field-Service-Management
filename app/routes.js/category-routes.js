import express from 'express'
import categoryCtlr from '../controllers/categoryCtlr.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { authorizeUser } from '../middlewares/authorize.js'
import { checkSchema } from 'express-validator'
import categoryValidation from '../validators/category-validation.js'
import serviceValidation from '../validators/service-validation.js'
import idValidation from '../validators/idValidation.js'

const router = express.Router()

router.post('/categories', authenticateUser, authorizeUser(['expert', 'admin']), checkSchema(categoryValidation), categoryCtlr.create)
router.get('/categories', categoryCtlr.getAllCategory)
router.get('/categories/withServices', authenticateUser, authorizeUser(['admin']), categoryCtlr.categoriesWithServices)
router.put('/categories/:id', authenticateUser, authorizeUser(['admin']), categoryCtlr.updateCategoryWithServices)
router.get('/categories/:id', checkSchema(idValidation), categoryCtlr.getCategory)
router.delete('/categories/:id', authenticateUser, authorizeUser(['admin']), checkSchema(idValidation), categoryCtlr.deleteCategoryAndServices)



router.post('/categories/:categoryId/services', authenticateUser, authorizeUser(['admin']), checkSchema(serviceValidation), categoryCtlr.addService)
router.get('/categories/:id/services', checkSchema(idValidation), categoryCtlr.getServicesByCategory)
router.get('/categories/:categoryId/services/:serviceId', checkSchema(idValidation), categoryCtlr.getSingleService)

export default router
