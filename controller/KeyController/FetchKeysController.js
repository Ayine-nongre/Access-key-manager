import { Key } from "../../model/Keys.js"
import { User } from "../../model/User.js"

export const allKeys = async (req, res) => {
    // check to see if user exists
    const user = await User.findOne({ email: req.user.email }).catch((err => catchErr(res, 500)))
    if (!user) return catchErr(res, 'This user doesn\'t exist', 400)

    if (req.user.role === 'admin') {
        // Retrieve all keys from database
        const allKeys = await Key.find({}).catch((err => catchErr(res, 500)))
        console.log("hello")
        return res.status(200).json({
            status: "success",
            message: "Keys retrieved successfully",
            keys: allKeys
        })
    }

    // Retrieve all keys from database belonging to user
    const Keys = await user.populate({ path: 'key'}).catch((err => catchErr(res, 500)))
    
    return res.status(200).json({
        status: "success",
        message: "Keys retrieved successfully",
        keys: Keys.key
    })
}

// export const keyDetails = async (req, res) {
//     // check to see if user exists
//     const user = await User.findOne({ email: req.user.email }).catch((err => catchErr(res, 500)))
//     if (!user) return catchErr(res, 'This user doesn\'t exist', 400)


// }