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
            rooms[roomId] = { users: [], currentTurn: 0 }
        }
        rooms[roomId].users.push({ id: socket.id, username })
        socket.join(roomId)
        const msg = `${username} Joined in ${roomId}`
        console.log(`Room ID: ${roomId}, Message: ${msg}`)
        io.to(roomId).emit('message', msg)
        io.to(roomId).emit('users', rooms[roomId].users)
        io.to(roomId).emit('turn', rooms[roomId].users[rooms[roomId].currentTurn].id)
    })
    
    socket.on('strike_cell', ({ roomId, numberToStrike }) => {
        const room = rooms[roomId]
        if (room && room.users[room.currentTurn].id === socket.id) {
            io.to(roomId).emit('cell_striked', { numberToStrike })
            room.currentTurn = (room.currentTurn + 1) % room.users.length
            io.to(roomId).emit('turn', room.users[room.currentTurn].id)
        }
    })
    
    socket.on("isWin", (isWin) =>{
        if(isWin){
            socket.emit("isGameOver", true)
        }
    })
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
        
        for (const roomId in rooms) {
            rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socket.id);
            
            if (rooms[roomId].users.length === 0) {
                delete rooms[roomId];
                continue;
            }
    
            rooms[roomId].currentTurn %= rooms[roomId].users.length;
            
            io.to(roomId).emit('users', rooms[roomId].users);
            io.to(roomId).emit('turn', rooms[roomId].users[rooms[roomId].currentTurn].id);
        }
    });
    
})

server.listen(3000, () => console.log("Server is Running at 3000"))