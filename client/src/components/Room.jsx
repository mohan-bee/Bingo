import React from 'react'
import { useParams } from 'react-router-dom'

const Room = ({ data, users }) => {
  const { id } = useParams()
  
  return (
    <div>
      <h1>Room ID: {id}</h1>
      <div>
        <h2>Messages:</h2>
        {data.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div>
        <h2>Users:</h2>
        {users.map((user, index) => (
          <p key={index}>{user}</p>
        ))}
      </div>
    </div>
  )
}

export default Room