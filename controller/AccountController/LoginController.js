import { createToken } from "../../middleware/tokenizer.js";
import { User } from "../../model/User.js";
import bcrypt from 'bcrypt';


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