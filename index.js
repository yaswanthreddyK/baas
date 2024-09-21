import 'dotenv/config';
import express from 'express';
import CORS from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './src/db/dbConnect.js';
import { Apiresponse } from './src/utils.js';
import authRouter from './src/routes/auth.route.js'
import projectRouter from './src/routes/project.route.js';
import connectionRouter from './src/routes/connection.route.js';
import emailRouter from './src/routes/email.route.js';

const app = express()

dbConnect()

app.use(CORS({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.get('/',(req, res) => {
    res.send('hi')
})

app.use('/auth', authRouter)
app.use('/project',projectRouter)
app.use('/connection',connectionRouter)
app.use('/email', emailRouter)

app.use((err,req, res, next) => {
    console.log('fire in the hole:',err)
    res.status(500).json(new Apiresponse('Fire in the hole'))
})

app.listen(4040, () => console.log('Server running on port 4040'))