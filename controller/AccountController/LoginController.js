import { catchErr } from "../../middleware/ErrorHandler.js";
import { createToken } from "../../middleware/tokenizer.js";
import { User } from "../../model/User.js";
import bcrypt from 'bcrypt';


export const login = async (req, res) => {
    const { email, password } = req.body

    // this code checks to ensure all fields were filled
    if (!email || !password) return catchErr(res, 'Incomplete form data', 500)

    // check to see if email exists
    const user = await User.findOne({ email: email }).catch((err) => catchErr(res, 500))
    if (!user) return catchErr(res, 'Incorrect email or password', 404)

    // check to see if user's account is verified
    if (user.status !== active) return catchErr(res, 'User\s account has not been verified', 500)

    // check to see password is correct
    const isAuthorized = await bcrypt.compare(password, user.password).catch((err) => catchErr(res, 500))
    if (!isAuthorized) return catchErr(res, 'Incorrect email or password', 404)

    // check to see if user account has been activated
    if (user.status !== 'active') return catchErr(res, 'Your account has not been activated', 500) 

    createToken(user, res, 200)
}