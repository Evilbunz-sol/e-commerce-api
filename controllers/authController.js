const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const { attachCookiesToResponse, createTokenUser } = require("../utils");


const register = async (req, res) => {
    const {name, email, password} = req.body

    const user = await User.create({name, email, password})
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new CustomError.BadRequestError("Email and Password are required")
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new CustomError.UnauthenticatedError("No user with the email exists")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.OK).json({user: tokenUser})
}

const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: "logged out"})
}

module.exports = {
    register,
    login,
    logout
}