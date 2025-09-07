import express from 'express'
import HomeRoute from '../src/routes/home.js'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/', HomeRoute)


app.listen(3000)
