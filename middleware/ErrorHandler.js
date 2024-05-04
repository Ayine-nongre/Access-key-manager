export const catchErr = (res, msg = 'Internal server error', statusCode = 500) => {
    return res.status(statusCode).json({
        status: "Failed",
        message: msg
    })
}