import crypto from 'crypto'
import { Key } from '../../model/Keys.js'
import { User } from '../../model/User.js'
import { catchErr } from '../../middleware/ErrorHandler.js'

export const generateKey = async (req, res) => {
    // generate a 16 character access key
    const accessKey = crypto.randomBytes(16).toString('hex')

    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => catchErr(res, 500)))
    if (!user) return catchErr(res, 'This user doesn\'t exist', 400)

    // check to see if an active access key already exists
    const activeKeys = await user.populate({ path: 'key', match: { status: 'active' }, select: 'keys'}).catch((err => catchErr(res, 500)))
    if ((activeKeys.key).length > 0) return catchErr(res, 'Active key already exists', 400)

    // create a new access key
    const newKey = await Key.create({
        accessKey: accessKey,
        created_At: new Date(),
        expiry: new Date(),
        status: 'expired'
    }).catch((err => catchErr(res, 500)))

    // save access key
    await user.key.push(newKey)
    await user.save().catch((err => catchErr(res, 500)))

    res.status(201).json({
        status: "Success",
        message: "New access key created successfully",
        key: accessKey
    })
}