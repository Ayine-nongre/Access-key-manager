import { catchErr } from "../../middleware/ErrorHandler.js";
import { User } from "../../model/User.js";

export const verifyAccount = async (req, res) => {
    const { token } = req.query
    
    // check if token was added to url
    if (!token) return catchErr(res, 'No token found', 404)

    // check if user with token exists
    const user = await User.findOne({ activation_token: token }).catch((err) => catchErr(res, 500))
    if (!user) return catchErr(res, 'User with this token doesn\'t exist', 404)

    // update user account to active
    user.updateOne({ status: 'active'}, { activation_token: 'null' }).catch((err) => catchErr(res, 500))
    return res.status(200).json({
        status: "success",
        message: "Account activated successfully"
    })
}