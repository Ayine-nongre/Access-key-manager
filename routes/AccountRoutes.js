import express from 'express';
import { adminSignUp, signup } from '../controller/AccountController/SignupController.js'
import { login } from '../controller/AccountController/LoginController.js';
import { verifyAccount } from '../controller/AccountController/ActivationController.js'
import { resetPassword, sendOTP, verifyOTP } from '../controller/AccountController/ResetController.js';

export const AccountRouter = express.Router()

// define routes for account activities
AccountRouter.post('/signup', signup)
AccountRouter.post('/admin/signup', adminSignUp)
AccountRouter.post('/login', login)
AccountRouter.get('/activate-account', verifyAccount)
AccountRouter.post('/send-reset-otp', sendOTP)
AccountRouter.post('/verify-otp', verifyOTP)
AccountRouter.post('/reset-password', resetPassword)