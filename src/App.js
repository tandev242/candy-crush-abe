import React, { useState, useEffect } from 'react'
import RedDynamite from './images/red.png'
import Red from './images/red-candy.png'
import Blue from './images/blue-candy.png'
import Green from './images/green-candy.png'
import Orange from './images/orange-candy.png'
import Purple from './images/purple-candy.png'
import Yellow from './images/yellow-candy.png'
import Blank from './images/blank.png'
import Logo from './images/logo.jpg'
import './App.css'



const candyColors = [Red, Blue, Green, Orange, Purple, Yellow]
const width = 8
const boardSize = width * width

export default function App() {
  const [currentBoard, setCurrentBoard] = useState([])
  const [draggedCandy, setDraggedCandy] = useState("")
  const [replacedCandy, setReplacedCandy] = useState("")
  const [score, setScore] = useState(0)


  useEffect(() => {
    createBoard()
  }, [])


  const createBoard = () => {
    const board = []
    for (let i = 0; i < boardSize; i++) {
      const randomIndexColor = Math.floor(Math.random() * candyColors.length)
      board.push(candyColors[randomIndexColor])
    }
    setCurrentBoard(board)
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i < boardSize - width * 3; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      if (columnOfFour.every(index => currentBoard[index] === currentBoard[i]) && currentBoard[i] !== Blank) {
        columnOfFour.forEach(col => currentBoard[col] = Blank)
        setScore(score => score + 400)
        return true;
      }
    }
  }
  const checkForRowOfThree = () => {
    for (let i = 0; i < boardSize; i++) {
      const notCheck = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]
      if (notCheck.includes(i)) {
        continue
      }
      const rowOfThree = [i, i + 1, i + 2]
      if (rowOfThree.every(index => currentBoard[index] === currentBoard[i])  && currentBoard[i] !== Blank) {
        rowOfThree.forEach(col => currentBoard[col] = Blank)
        setScore(score => score + 300)
        return true;
      }
    }
  }
  const checkForRowOfFour = () => {
    for (let i = 0; i < boardSize; i++) {
      const notCheck = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63]
      if (notCheck.includes(i)) {
        continue
      }
      const rowOfFour = [i, i + 1, i + 2]
      if (rowOfFour.every(index => currentBoard[index] === currentBoard[i]) && currentBoard[i] !== Blank ) {
        rowOfFour.forEach(col => currentBoard[col] = Blank)
        setScore(score => score + 400)
        return true;
      }
    }
  }
  const checkForColumnOfThree = () => {
    for (let i = 0; i < boardSize - width * 2; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      if (columnOfThree.every(index => currentBoard[index] === currentBoard[i]) && currentBoard[i] !== Blank) {
        columnOfThree.forEach(col => currentBoard[col] = Blank)
        setScore(score => score + 300)
        return true;
      }
    }
  }

  const fillCandyToBlank = () => {
    for (let i = 0; i < boardSize - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      if (firstRow.includes(i) && currentBoard[i] === Blank) {
        const randomIndexColor = Math.floor(Math.random() * candyColors.length)
        currentBoard[i] = candyColors[randomIndexColor]
      }
      if (currentBoard[i + width] === Blank) {
        currentBoard[i + width] = currentBoard[i]
        currentBoard[i] = Blank
      }
    }
  }

  const onDragStart = (e) => {
    const index = parseInt(e.target.getAttribute('data-id'))
    setDraggedCandy(index)
  }
  const onDragEnter = (e) => {
    const index = parseInt(e.target.getAttribute('data-id'))
    setReplacedCandy(index)
  }
  const onDragEnd = (e) => {
    const isValid = [draggedCandy - 1, draggedCandy + 1, draggedCandy + width, draggedCandy - width]
    if (isValid.includes(replacedCandy)) {
      const tmp = currentBoard[draggedCandy]
      currentBoard[draggedCandy] = currentBoard[replacedCandy]
      currentBoard[replacedCandy] = tmp
      if (checkForColumnOfThree() || checkForColumnOfFour() || checkForRowOfFour() || checkForRowOfThree()) {
        setReplacedCandy("")
        setDraggedCandy("")
      } else {
        currentBoard[replacedCandy] = currentBoard[draggedCandy]
        currentBoard[draggedCandy] = tmp;
        setCurrentBoard([...currentBoard])
      }
    }

  }

  useEffect(() => {
    const timer = setInterval(() => {
      checkForRowOfFour()
      checkForColumnOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      fillCandyToBlank()
      setCurrentBoard([...currentBoard])
    }, 100)
    return () => clearInterval(timer)
  }, [checkForRowOfFour, checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, fillCandyToBlank, currentBoard])

  return (
    <div className="App">
      <div className="wrapper-board">
        <div className="board">
          {currentBoard.map((candy, index) =>
            <img className="candy"
              src={candy}
              draggable="true"
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              data-id={index}
              key={index} />
          )}
        </div>
      </div>
      <div className="wrapper-score">
        <div className="score">
          <h1>Score : {score}</h1>
          <img src={Logo} />
        </div>
      </div>
    </div>
  )
}
