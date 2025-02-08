import express from 'express'
import authenticateUser from '../middlewares/authenticateUser.js'
import serviceRequestCtlr from '../controllers/service-request.ctlr.js'
import { upload } from '../utils.js/multer-cloudinary.js'
import { authorizeUser } from '../middlewares/authorize.js'

const router = express.Router()

router.post('/service-requests', authenticateUser, upload.array("serviceImages", 6), serviceRequestCtlr.create)
router.get('/service-requests', authenticateUser, authorizeUser(['admin', 'expert']), serviceRequestCtlr.getAllServiceRequests)
router.put('/service-requests/:id', authenticateUser, authorizeUser(['customer']), upload.array("serviceImages", 6), serviceRequestCtlr.editServiceRequest)
router.get('/service-requests/:id', authenticateUser, serviceRequestCtlr.getServiceRequest)

router.put('/service-requests/:id/status', authenticateUser, authorizeUser(['expert']), serviceRequestCtlr.updateStatus)
router.get('/service-requests/customer/:customerId', authenticateUser, serviceRequestCtlr.getByCustomer)
router.get('/service-requests/expert/:expertId', authenticateUser, serviceRequestCtlr.getByExpert)

export default router