const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIo = require('socket.io')

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})

const rooms = {}

io.on('connection', (socket) => {
    console.log("User Connected Successfully ... ", socket.id)
    
    socket.on('join_room', (data) => {
        const { roomId, username } = data
        if (!rooms[roomId]) {
            rooms[roomId] = []
        }
        rooms[roomId].push(username)
        socket.join(roomId)
        const msg = `${username} Joined in ${roomId}`
        console.log(`Room ID: ${roomId}, Message: ${msg}`)
        io.to(roomId).emit('message', msg)
        io.to(roomId).emit('users', rooms[roomId])
    })
    
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id)
        // Handle user disconnection logic if needed
    })
})

server.listen(3000, () => console.log("Server is Running at 3000"))