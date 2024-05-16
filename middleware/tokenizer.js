import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { catchErr } from './ErrorHandler.js'

dotenv.config()

// create a token to authenticate users
export const createToken = async (user, res, statusCode) => {
    // encode user id and role in token
    const token = jwt.sign({email: user.email, role: user.role, status: user.status }, process.env.PRIVATEKEY, { expiresIn: '1h' })

    if (statusCode === 200) {
         res.status(statusCode).json({
            status: "Success",
            message: "Login successful",
            token: token
        })
    } else {
        res.status(statusCode).json({
            status: "Success",
            message: "Signup successful",
            username: user.username,
            email: user.email,
            name: user.name
        })
    }
}

// verify user using token
export const verifyToken = (req, res, next) => {
    //Retrieves token from request header
    try {
        const token = req.headers['authorization'].split(' ')[1]

        //token is decrypted with private key to verify user
        const decoded = jwt.verify(token, process.env.PRIVATEKEY, (err, acc) => {
            if (err) return catchErr(res, 'User is not logged in', 401)

            //user is sent back through req if verified
            req.user = acc;
            next()
        })
    } catch (err) {
        catchErr(res, 'No token received', 401)
    }
    

    
}