import express from 'express'
import queryCtlr from '../controllers/queryCtlr.js'

const router = express.Router()

router.get('/search', queryCtlr.search)
router.get('/getAddress', queryCtlr.getAddress)

export default router