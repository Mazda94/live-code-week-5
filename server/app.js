const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors')
const userRoutes = require('./routes/user_routes')
const comicRoutes = require('./routes/comic_routes')
const { authentication } = require('./helper/helper')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', userRoutes)
app.use(authentication)
app.use('/comic', comicRoutes)

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))