import { useNavigate } from 'react-router-dom'

const Entry = ({ socket, username, setUsername, roomId, setRoomId }) => {
    const navigate = useNavigate()

    const join = (e) => {
        e.preventDefault()
        socket.emit('join_room', { username, roomId })
        navigate(`/rooms/${roomId}`)
    }

    return (
        <div>
            <form onSubmit={join}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder="Room ID" onChange={(e) => setRoomId(e.target.value)} />
                <button type="submit">Join</button>
            </form>
        </div>
    )
}

export default Entry