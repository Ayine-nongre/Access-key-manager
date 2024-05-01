import nodemailer from'nodemailer'
import dotenv  from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.PASSWORD,
    },
})