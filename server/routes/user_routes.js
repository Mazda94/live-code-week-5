const express = require('express')
const route = express.Router()
const { User } = require('../models/index')
const { comparePassword, generateJwt } = require('../helper/helper')

route.post('/register', (req, res, next) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    User
        .findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                return 'Email already registered'
            } else {
                return User.create(newUser)
            }
        }).then(user => {
            if (typeof user === 'string') {
                res.status(401).json({ message: 'Email already registered' })
            } else {
                res.status(201).json({ message: 'Successfully registered new account' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' })
        })
})

route.post('/login', (req, res, next) => {
    User
        .findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (user) {
                if (comparePassword(req.body.password, user.password)) {
                    const payload = {
                        id: user.id,
                    }
                    res.status(200).json({ token: generateJwt(payload) })
                }
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' })
        })
})

module.exports = route