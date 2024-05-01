import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { signup } from './controller/AuthenticationController.js';
import { authRouter } from './routes/authRoutes.js';

const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/multiTenant");

var set = mongoose.connection;
set.on('error', console.error.bind(console, 'connection error:'));
set.once('open', function() {
    console.log('Db connected successfully')
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', authRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})