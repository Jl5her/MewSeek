import http from 'http'
import dotenv from 'dotenv'
import { Server, Socket } from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import mewseek from './mewseek' 

dotenv.config({ path: '../.env' })
const { PORT } = process.env // CLIENT_ID, CLIENT_SECRET, REDIRECT_URI 

const app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: '*'
  }
})

mewseek.loadMusic()

io.on('connection', (socket: Socket) => mewseek.connection(io, socket))

server.listen(PORT, () => {
  console.log(`🚀 Express server listening on port :${PORT}`)
})