import React, { useEffect, useState } from 'react'
import './board.css'
import { useParams } from 'react-router-dom'

const Board = ({ socket }) => {
  const { id: roomId } = useParams()
  const [cells, setCells] = useState([])
  const [isWin, setIsWin] = useState(false)
  const [currentTurn, setCurrentTurn] = useState(null)
  const [users, setUsers] = useState([])
  const [myId, setMyId] = useState(socket.id)
   // Generate random 5x5 board
  useEffect(() => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1)
    for (let i = numbers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }
    const newBoard = Array.from({ length: 5 }, (_, i) => numbers.slice(i * 5, i * 5 + 5))
    setCells(newBoard)
  }, [])

  // Check for win condition
  const checkWin = (board) => {
    const isWinRow = (row) => board[row].every(cell => cell === 'X')
    const isWinCol = (col) => board.every(row => row[col] === 'X')
    const isWinDiag1 = board.every((row, i) => row[i] === 'X')
    const isWinDiag2 = board.every((row, i) => row[4 - i] === 'X')

    let winLines = 0
    for (let i = 0; i < 5; i++) {
      if (isWinRow(i)) winLines++
      if (isWinCol(i)) winLines++
    }
    if (isWinDiag1) winLines++
    if (isWinDiag2) winLines++

    if (winLines >= 5) setIsWin(true)
  }

  
  socket.emit('isWin', isWin)

  const strikeCell = (rowIndex, colIndex) => {
    if (currentTurn === myId) {
      const numberToStrike = cells[rowIndex][colIndex]
      socket.emit('strike_cell', { roomId, numberToStrike })
    }
  }

  useEffect(() => {
    socket.on('cell_striked', ({ numberToStrike }) => {
      setCells(prevCells => {
        const newCells = prevCells.map(row => row.map(cell => (cell === numberToStrike ? 'X' : cell)))
        checkWin(newCells)
        return newCells
      })
    })

    socket.on('turn', (turnId) => {
      setCurrentTurn(turnId)
    })

    socket.on('users', (updatedUsers) => {
      setUsers(updatedUsers)
    })

    return () => {
      socket.off('cell_striked')
      socket.off('turn')
      socket.off('users')
    }
  }, [socket])

  const opponent = users.find(user => user.id !== myId)

  return (
    <div>
      <p>{isWin ? "You Won!" : ""}</p>
      <p>
        {currentTurn === myId
          ? "Your Turn"
          : `Opponent's Turn (${opponent ? opponent.username : 'Waiting for opponent'})`}
      </p>
      <div className="board">
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell === 'X' ? 'striked' : ''}`}
              onClick={() => strikeCell(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Board
