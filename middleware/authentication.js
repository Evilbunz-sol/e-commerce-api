const CustomErr = require("../errors")
const {isTokenValid} = require("../utils")
const {createTokenUser} = require("../utils")

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        throw new CustomErr.UnauthenticatedError("Authentication Invalid")
    }

    try {
        const {name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new CustomErr.UnauthenticatedError("Authentication Invalid")
    }
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomErr.UnauthenticatedError("Forbidden Access")
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
}