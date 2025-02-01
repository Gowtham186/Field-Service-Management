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
// import { Server } from 'socket.io'
// import http from 'http'

const app = express()
dotenv.config()
configureDb()

//socket code 
/* const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin : '*',
        methods : ['GET', 'POST'],
    },
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
}); */



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

//export { io }

//server
app.listen(4500, () => {
    console.log('server is running');
    //console.log('WebSocket server is running on ws://localhost:4500');
});