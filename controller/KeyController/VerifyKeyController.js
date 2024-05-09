import { catchErr } from "../../middleware/ErrorHandler.js"
import { Key } from "../../model/Keys.js"
import { User } from "../../model/User.js"

export const verifyKey = async (req, res) => {
    // Retrieve key from frontend
    const { email } = req.body
    if (!email) return catchErr(res, 'Key not provided for verification', 404)

    // check to see if user exists
    const user = await User.findOne({ email: email }).catch((err => catchErr(res, 500)))
    if (!user) return catchErr(res, 'This user doesn\'t exist', 404)

    // check to see if an active access key already exists
    const activeKeys = await user.populate({ path: 'key', match: { status: 'active' }, select: 'keys'}).catch((err => catchErr(res, 'Internal server error', 500)))
    if ((activeKeys.key).length < 1) return catchErr(res, 'No active keys available', 404)
    const id = (activeKeys.key[0]._id).toString()

    const key = await Key.findOne({ _id: id }).catch((err => catchErr(res, 'Internal server error', 500)))

    return res.status(200).json({
        status: 'Success',
        message: 'Active key retrieved successfully',
        key: key
    })
}