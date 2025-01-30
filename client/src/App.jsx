import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Entry from './components/Entry'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Room from './components/Room'
const socket = io('http://localhost:3000')

const App = () => {
  const [data, setData] = useState([])
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [users, setUsers] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  
  useEffect(() => {
    socket.on('message', (data) => {
      setData(prev => [prev,data])
      localStorage.setItem("messages")
    })
    socket.on('users', (users) => {
      setUsers(users)
    })
    socket.on('isGameOver', (data) =>{
      setIsGameOver(data)
    })
    return () => {
      socket.off('message')
      socket.off('users')
    }
  }, [])

  return (
    <BrowserRouter>
    <Routes>
        <Route index element={<Entry socket={socket} username={username} roomId={roomId} setUsername={setUsername} setRoomId={setRoomId} />} />
        <Route path='/rooms/:id' element={<Room isGameOver={isGameOver} socket={socket} data={data} users={users}/>} />
    </Routes>
        
    </BrowserRouter>
  )
}

export default App