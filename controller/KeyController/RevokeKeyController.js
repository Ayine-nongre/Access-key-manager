import { catchErr } from "../../middleware/ErrorHandler.js"
import { Key } from "../../model/Keys.js"
import { User } from "../../model/User.js"

export const revokeKey = async (req, res) => {
    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => catchErr(res, 500)))
    if (!user) return catchErr(res, 'This user doesn\'t exist', 404)

    // check to see if user has permission to access this route
    if (req.user.role !== 'admin') return catchErr(res, 'User does not have access to this page', 401)

    // check if access key was sent in url
    if (!req.query.access_key) return catchErr(res, 'Access key not found', 404)

    // check if access key exists and update it's status to revoked
    const accessKey = await Key.findOne({ accessKey: req.query.access_key }).catch((err => catchErr(res, 500)))
    if (!accessKey) return catchErr(res, 'Access key doesn\'t exist', 404)

    accessKey.status = 'revoked'
    await accessKey.save().catch((err => catchErr(res, 500)))

    return res.status(200).json({
        status: "Success",
        message: "Access key revoked successfully",
        key: accessKey
    })
}