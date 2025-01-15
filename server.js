import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/db.js'

import userRoute from './routes/userRoute.js'
import imageRoute from "./routes/imageRoute.js";

const PORT = process.env.PORT || 2222
const app = express()

app.use(express.json())
app.use(cors())

connectDb()
app.use('/api/user',userRoute)
app.use('/api/image',imageRoute)

app.listen(PORT,()=> console.log('server is running'))