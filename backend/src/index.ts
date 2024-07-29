import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import fileRoutes from './routes/file.routes.js'

export const prisma = new PrismaClient()

const port = process.env.PORT;
const app = express()


// middlewares
app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}))
app.use(cookieParser())



app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes);
app.use('/api/file',fileRoutes);


app.listen(port,() => {
    console.log(`server running at http://localhost:${port}`)
});
