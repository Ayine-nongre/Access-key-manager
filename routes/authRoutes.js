import express from 'express';
import { login, signup, verifyAccount } from '../controller/AuthenticationController.js';
import { verifyToken } from '../middleware/tokenizer.js';

export const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get('/activate-account', verifyAccount)