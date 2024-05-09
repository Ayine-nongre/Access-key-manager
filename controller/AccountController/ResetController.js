import bcrypt from 'bcrypt'
import { transporter } from '../../config/MailService.js'
import { User } from '../../model/User.js'
import { catchErr } from '../../middleware/ErrorHandler.js'


// function to generate OTP
export function generateOTP (){
    const strings = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var OTP = ""

    for (let i = 0; i < 4; i++){
        OTP += strings[Math.floor(Math.random() * 10) % strings.length]
    }

    return OTP
} 

export const sendOTP = async (req, res, next) => {
    const { email } = req.body

    if (!email) return catchErr(res, 'No data received', 500)
    

    const user = await User.findOne({ email: email }).catch(err => catchErr(res, 500))
    if (!user) return catchErr(res, 'This email is not registered to Micro-Focus inc', 404)

    const OTP = generateOTP()

    // send OTP to user mail
    await transporter.sendMail({
        from: '"Micro-Focus Inc" <eugeneatinbire@gmail.com>',
        to: ' <' + email + '>',
        subject: "Reset Password",
        html: "<div><p>Hi,</p><p>Your OTP is: " + OTP +"</p></div>"
    }).catch(err => catchErr(res, 500))

    // encrypt OTP and store it in database
    const hashedOTP = await bcrypt.hash(OTP, 10).catch(err => catchErr(res, 500))
    if (!hashedOTP) return catchErr(res, 500)

    user.updateOne({ reset_OTP: hashedOTP }).catch(err => catchErr(res, 500))

    res.status(200).json({
        status: "success",
        message: "OTP delivered",
        email: email
    })
}

export const verifyOTP = async (req, res, next) => {
    const { OTP, email } = req.body
    if (!OTP || !email) return catchErr(res, 'No data received', 500)

    // check if user with email exists
    const user = await User.findOne({ email: email }).catch(err => catchErr(res, 500))
    if (!user) return catchErr(res, 'This email is not registered to Micro-Focus inc', 404)

    // var date = new Date(userOTP.createdAt);
    // var expiry = date.getTime() + 300000 //5 minutes in milliseconds is 300000
    
    // if (Date.now() >= expiry){
    //     await userOTP.destroy().catch(err => console.log(err))
    //     return res.status(401).json({ message: "The OTP has expired" })
    // }

    // Verify if OTP is valid
    const isAuthorised = await bcrypt.compare(OTP, user.reset_OTP)
    if (!isAuthorised) return catchErr(res, 'Incorrect OTP', 401)

    // remove otp after verifying it
    await user.updateOne({ reset_OTP: 'null' }).catch((err) => next(res, "Failed to remove used OTP", 500))

    return res.status(200).json({
        status: "Success",
        message: "OTP succesful verified"
    })
}

export const resetPassword = async (req, res, next) => {
    const { password, confirmPassword, email } = req.body
    if (!password || !confirmPassword) return catchErr(res, 'No data received from frontend', 404)

    // check if passwords match
    if (password != confirmPassword) return catchErr(res, 500)
    // check if user with email exists
    const user = await User.findOne({ email: email }).catch(err => catchErr(res, 500))
    if (!user) return catchErr(res, 'User with this email not found', 404)

    // check if the new password is same as old/already in use one
    const usedPassword = await bcrypt.compare(password, user.password).catch(err => catchErr(res, 500))

    if (usedPassword) return catchErr(res, 'Password is already being used by this account', 400)

    // encrypt new password and update user details in db with new password
    const hashedPassword = await bcrypt.hash(password, 10).catch(err => catchErr(res, 500))
    if (!hashedPassword) return catchErr(res, 500)

    await user.updateOne({ password: hashedPassword }).catch(err => catchErr(res, 500))
    await user.save().catch(err => catchErr(res, 500))

    res.status(200).json({
        status: "Success",
        message: "Password resetted succesful"
    })
}