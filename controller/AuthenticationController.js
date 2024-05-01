import { transporter } from "../config/MailService.js";
import { createToken } from "../middleware/tokenizer.js";
import { User } from "../model/User.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto'

export const signup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    
    // this code checks to ensure all fields were filled
    if (!email || !password || !confirmPassword) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Incomplete form data'
        })
    }

    // check to see if email is not already in use
    const user = await User.findOne({ email: email }).catch((err) => console.log(err))
    if (user) {
        return res.status(500).json({
            status: 'Failed',
            message: 'User with email already exists'
        })
    }

    // check if passwords match
    if (password !== confirmPassword) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Passwords do not match'
        })
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10).catch((err) => console.log(err))
    const token = crypto.randomBytes(16).toString('hex')
    const activation_url = `http://localhost:3000/api/activate-account?token=${token}`

    // send email to user for account verification
    await transporter.sendMail({
        from: '"Micro-Focus Inc." <eugeneatinbire@gmail.com',
        to: '<' + email + '>',
        subject: "Account verification",
        html: `<div><p>Hi,</p><p>Click <a href=${activation_url}>here</a> to activate your account.</p></div>`
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({
            status: 'Failed',
            message: 'Failed to send verification mail'
        })
    })

    // create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        activation_token: token
    })

    await newUser.save()
    .then((user) => createToken(user, res, 201))
    .catch((err) => console.log(err))
}

export const login = async (req, res) => {
    const { email, password } = req.body

    // this code checks to ensure all fields were filled
    if (!email || !password) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Incomplete form data'
        })
    }

    // check to see if email exists
    const user = await User.findOne({ email: email }).catch((err) => console.log(err))
    if (!user) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Incorrect email or password'
        })
    }

    // check to see password is correct
    const isAuthorized = await bcrypt.compare(password, user.password).catch((err) => console.log(err))
    if (!isAuthorized) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Incorrect email or password'
        })
    }

    if (user.status !== 'active') {
        return res.status(500).json({
            status: 'Failed',
            message: 'Your account has not been activated'
        })
    }

    createToken(user, res, 200)
}

export const verifyAccount = async (req, res) => {
    const { token } = req.query
    
    if (!token) return res.status(500).json({
        status: "Failed",
        message: "No token found"
    })

    const user = await User.findOne({ activation_token: token }).catch((err) => console.log(err))
    if (!user) {
        return res.status(500).json({
            status: 'Failed',
            message: 'User with this token doesn\'t exist'
        })
    }

    user.updateOne({ status: 'active'}, { activation_token: 'null' }).catch((err) => console.log(err))
}