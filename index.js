import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import configureDb from './app/config.js/db.js'
import userRoutes from './app/routes.js/user.js'
import customerRoutes from './app/routes.js/customer-routes.js'
const app = express()
dotenv.config()
configureDb()

app.use(express.json())
app.use(cors())



app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)



app.listen(process.env.PORT, ()=> console.log('server is running'))