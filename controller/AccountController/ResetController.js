import bcrypt from 'bcrypt'
import { transporter } from '../../config/MailService.js'
import { User } from '../../model/User.js'


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

    if (!email) return res.json({ status: "Failed", message: "No data received"})
    

    const user = await User.findOne({ email: email })
    if (!user) return res.status(500).json({ status: "Failed", message: "This email is not registered to Micro-Focus inc"})

    const OTP = generateOTP()

    // send OTP to user mail
    await transporter.sendMail({
        from: '"Micro-Focus Inc" <eugeneatinbire@gmail.com>',
        to: ' <' + email + '>',
        subject: "Reset Password",
        html: "<div><p>Hi,</p><p>Your OTP is: " + OTP +"</p></div>"
    }).catch(err => console.log(err))

    // encrypt OTP and store it in database
    const hashedOTP = await bcrypt.hash(OTP, 10)
    if (!hashedOTP) return res.status(500).json({ message: "Internal server error"})

    user.updateOne({ reset_OTP: hashedOTP }).catch((err) => {
        console.log(err)
        return next(res.status(500).json({
            status: "Failed",
            message: "Failed to store OTP in db"
        }))
    })

    res.status(200).json({
        email: email,
        message: "OTP delivered",
        status: "success"
    })
}

export const verifyOTP = async (req, res, next) => {
    const { OTP, email } = req.body
    if (!OTP || !email) return res.json({ status: "Failed", message: "No data received"})

    // check if user with email exists
    const user = await User.findOne({ email: email })
    if (!user) return res.status(404).json({ message: "This email is not registered to foodDash" })

    // var date = new Date(userOTP.createdAt);
    // var expiry = date.getTime() + 300000 //5 minutes in milliseconds is 300000
    
    // if (Date.now() >= expiry){
    //     await userOTP.destroy().catch(err => console.log(err))
    //     return res.status(401).json({ message: "The OTP has expired" })
    // }

    // Verify if OTP is valid
    const isAuthorised = await bcrypt.compare(OTP, user.reset_OTP)
    if (!isAuthorised) return res.status(401).json({ status: "Failed", message: "Incorrect OTP" })

    // remove otp after verifying it
    await user.updateOne({ reset_OTP: 'null' }).catch((err) => {
        console.log(err)
        return next(res.status(500).json({
            status: "Failed",
            message: "Failed to remove used OTP"
        }))
    })

    return res.status(200).json({
        message: "OTP succesful verified",
        status: "Success"
    })
}

export const resetPassword = async (req, res, next) => {
    const { password, confirmPassword, email } = req.body
    if (!password || !confirmPassword) return res.json({ status: "Failed", message: "No data received from frontend" })

    // check if passwords match
    if (password != confirmPassword) return res.json({ status: "Failed", message: "Passwords do not match" })

    // check if user with email exists
    const user = await User.findOne({ email: email })
    if (!user) return res.status(404).json({ status: "Failed", message: "Internal server error" })

    // check if the new password is same as old/already in use one
    const usedPassword = await bcrypt.compare(password, user.password).catch((err) => {
        console.log(err)
        return next(res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        }))
    })

    if (usedPassword) return res.status(400).json({
        status: "Failed",
        message: "Password is already being used by this account"
    })

    // encrypt new password and update user details in db with new password
    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) return res.status(500).json({ status: "Failed", message: "Internal server error"})

    await user.updateOne({ password: hashedPassword }).catch(err => console.log(err))
    await user.save().catch(err => console.log(err))

    res.status(200).json({
        message: "Password resetted succesful",
        status: "Success"
    })
}