const express = require('express')

const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('public'))

const userRotes = require('./routes/UserRoutes')

app.use('/users', userRotes)


app.listen(5555)