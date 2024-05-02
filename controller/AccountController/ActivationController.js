import { User } from "../../model/User.js";

export const verifyAccount = async (req, res) => {
    const { token } = req.query
    
    // check if token was added to url
    if (!token) return res.status(500).json({
        status: "Failed",
        message: "No token found"
    })

    // check if user with token exists
    const user = await User.findOne({ activation_token: token }).catch((err) => console.log(err))
    if (!user) {
        return res.status(500).json({
            status: 'Failed',
            message: 'User with this token doesn\'t exist'
        })
    }

    // update user account to active
    user.updateOne({ status: 'active'}, { activation_token: 'null' }).catch((err) => console.log(err))
    return res.status(200).json({
        status: "success",
        message: "Account activated successfully"
    })
}