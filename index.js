import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import configureDb from './app/config.js/db.js'
import userRoutes from './app/routes.js/user.js'
import customerRoutes from './app/routes.js/customer-routes.js'
import expertRoutes from './app/routes.js/expert-routes.js'
import skillRoutes from './app/routes.js/skill-routes.js'
const app = express()
dotenv.config()
configureDb()

app.use(express.json())
app.use(cors())



app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/experts', expertRoutes)
app.use('/api/skills', skillRoutes)



app.listen(process.env.PORT, ()=> console.log('server is running'))