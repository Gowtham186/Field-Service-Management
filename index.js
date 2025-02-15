import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import configureDb from './app/config.js/db.js'
import userRoutes from './app/routes.js/user.js'
import customerRoutes from './app/routes.js/customer-routes.js'
import expertRoutes from './app/routes.js/expert-routes.js'
import categoryRoutes from './app/routes.js/category-routes.js'
import serviceRoutes from './app/routes.js/service-routes.js'
import serviceRequestRoutes from './app/routes.js/serviceRequest-routes.js'
import reviewRoutes from './app/routes.js/review-routes.js'
import skillRoutes from './app/routes.js/skill-routes.js'
import queryRoutes from './app/routes.js/query-routes.js'
import paymentRoutes from './app/routes.js/payment-routes.js'
import { Server } from 'socket.io'
import http from 'http'
import trackLocation from './app/sockets/trackLocation.js'
import Location from './app/models/location-model.js'
import { socketHandler } from './app/sockets/socketIndex.js'
import './app/utils.js/cronJobs.js'
import './app/utils.js/expertAvailabilityCron.js'

const app = express()
dotenv.config()
configureDb()

//socket code 
const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin : 'http://localhost:3000',
        methods : ['GET', 'POST'],
    },
})

socketHandler(io)

app.use(express.json())
app.use(cors())


app.use('/api', userRoutes)
app.use('/api', customerRoutes)
app.use('/api', expertRoutes)
app.use('/api', skillRoutes)
app.use('/api', categoryRoutes)
app.use('/api', serviceRoutes)
app.use('/api', serviceRequestRoutes)
app.use('/api', reviewRoutes)
app.use('/api', queryRoutes)
app.use('/api', paymentRoutes)

//export { io }

//server
server.listen(4500, () => {
    console.log('server is running');
    //console.log('WebSocket server is running on ws://localhost:4500');
});