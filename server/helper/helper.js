const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const encryptPassword = (plain) => {
    return bcrypt.hashSync(plain, bcrypt.genSaltSync(10))
}

const comparePassword = (plain, encrypted) => {
    return bcrypt.compareSync(plain, encrypted)
}

const generateJwt = (payload) => {
    return jwt.sign(payload, 'rahasia donk')
}

const authentication = (req, res, next) => {
    try {
        const token = req.headers.token
        const user = jwt.verify(token, 'rahasia donk')
        req.user_id = user.id
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { encryptPassword, comparePassword, generateJwt, authentication }