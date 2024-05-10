import { transporter } from "../../config/MailService.js";
import { catchErr } from "../../middleware/ErrorHandler.js";
import { createToken } from "../../middleware/tokenizer.js";
import { User } from "../../model/User.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto'

export const signup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    
    // this code checks to ensure all fields were filled
    if (!email || !password || !confirmPassword) return catchErr(res, 'Incomplete form data', 500)

    // check to see if email is not already in use
    const user = await User.findOne({ email: email }).catch((err) => console.log(err))
    if (user) return catchErr(res, 'User with email already exists', 500) 

    // check if passwords match
    if (password !== confirmPassword) return catchErr(res, 'Passwords do not match', 500)

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10).catch((err => catchErr(res, 500)))
    const token = crypto.randomBytes(16).toString('hex')
    const activation_url = `https://micro-accessmangager.onrender.com/api/activate-account?token=${token}`

    // send email to user for account verification
    await transporter.sendMail({
        from: '"Micro-Focus Inc." <eugeneatinbire@gmail.com',
        to: '<' + email + '>',
        subject: "Account verification",
        html: `<div><p>Hi,</p><p>Click <a href=${activation_url}>here</a> to activate your account.</p></div>`
    }).catch((err) => {
       return catchErr(res, 'Failed to send verification mail', 500)
    })

    // create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        activation_token: token
    })

    // save new user in database
    await newUser.save()
    .then((user) => createToken(user, res, 201))
    .catch((err => catchErr(res, 500)))
}

export const adminSignUp = async (req, res, ) => {
    const { email, password, confirmPassword } = req.body;
    
    // this code checks to ensure all fields were filled
    if (!email || !password || !confirmPassword) return catchErr(res, 'Incomplete form data', 500)

    // check to see if email is not already in use
    const user = await User.findOne({ email: email }).catch((err) => console.log(err))
    if (user) return catchErr(res, 'User with email already exists', 500) 

    // check if passwords match
    if (password !== confirmPassword) return catchErr(res, 'Passwords do not match', 500)

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10).catch((err => catchErr(res, 500)))
    const token = crypto.randomBytes(16).toString('hex')
    const activation_url = process.env.URL + `?token=${token}`

    // send email to user for account verification
    await transporter.sendMail({
        from: '"Micro-Focus Inc." <eugeneatinbire@gmail.com',
        to: '<' + email + '>',
        subject: "Account verification",
        html: `<div><p>Hi,</p><p>Click <a href=${activation_url}>here</a> to activate your account.</p></div>`
    }).catch((err) => {
       return catchErr(res, 'Failed to send verification mail', 500)
    })

    // create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        activation_token: token,
        role: 'admin'
    })

    // save new user in database
    await newUser.save()
    .then((user) => createToken(user, res, 201))
    .catch((err => catchErr(res, 500)))
}