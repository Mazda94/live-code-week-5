const express = require('express')
const route = express.Router()
const { Comic } = require('../models/index')

route.get('/', (req, res, next) => {
    Comic
        .findAll()
        .then(comics => {
            res.status(200).json(comics)
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' })
        })
})

route.put('/', (req, res, next) => {
    const data = {
        title: req.body.title,
        author: req.body.author,
        imgUrl: req.body.imgUrl
    }
    console.log(data)
    Comic
        .update(data, { where: { id: req.body.id } })
        .then(comics => {
            res.status(200).json(comics)
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' })
        })
})

module.exports = route