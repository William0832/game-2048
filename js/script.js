import Grid from "./Grid.js"
import Tile from "./Tile.js"
import Score from './Score.js'
let score = 0
const scoreBox = new Score('#score')
const gameZone = document.getElementById('game-zone')
const grid = new Grid(gameZone)

initGame()

function setupInput() {
  window.addEventListener('keydown', handelInput, { once: true })
}
async function handelInput(e) {
  const { key } = e
  let groups
  switch (key) {
    case 'ArrowUp':
    case 'w':
      groups = grid.columnGroupList
      if (!canMove(groups)) {
        setupInput()
        return
      }
      await slideTiles(groups)
      setupInput()
      break
    case 'ArrowLeft':
    case 'a':
      groups = grid.rowGroupList
      if (!canMove(groups)) {
        setupInput()
        return
      }
      await slideTiles(groups)
      setupInput()
      break
    case 'ArrowDown':
    case 's':
      groups = grid.columnGroupList
        .map(group => [...group].reverse())
      if (!canMove(groups)) {
        setupInput()
        return
      }
      await slideTiles(groups)
      setupInput()
      break
    case 'ArrowRight':
    case 'd':
      groups = grid.rowGroupList
        .map(group => [...group].reverse())
      if (!canMove(groups)) {
        setupInput()
        return
      }
      await slideTiles(groups)
      setupInput()
      break
    default:
      setupInput()
      break
  }
  grid.cells.forEach(cell => cell.mergeTiles())
  const newTile = new Tile(gameZone)
  grid.randomEmptyCell().tile = newTile
  if (isGameOver()) {
    await newTile.waitTransition(true)
    storeScore(score)
    gameOver()
    return
  }
  setupInput()
}
function canMove(groups) {
  return groups.some(group =>
    group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const movetoCell = group[index - 1]
      return movetoCell.canMove(cell.tile)
    })
  )
}
function slideTiles(groups) {
  return Promise.all(
    groups.flatMap(group => {
      let addValue = 0
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastMoveCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canMove(cell.tile)) break
          lastMoveCell = moveToCell
        }
        if (lastMoveCell != null) {
          promises.push(cell.tile.waitTransition())
          if (lastMoveCell.tile != null) {
            lastMoveCell.mergeTile = cell.tile
            addValue += lastMoveCell.mergeTile.value * 2
          } else {
            lastMoveCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      if (addValue) {
        let oldScore = score
        score += addValue

        showScore(score, addValue)
      }
      return promises
    }))
}
function isGameOver() {
  const groups = {
    up: grid.columnGroupList,
    down: grid.columnGroupList.map(g => [...g].reverse()),
    left: grid.rowGroupList,
    right: grid.rowGroupList.map(g => [...g].reverse())
  }
  if (!canMove(groups.up) && !canMove(groups.down) &&
    !canMove(groups.right) && !canMove(groups.left)) {
    return true
  }
  return false
}
function gameOver() {
  alert('Game Over')
  initGame()
}
function initGame() {
  score = 0
  showHistoryScore()
  showScore(score)
  grid.init()
  grid.randomEmptyCell().tile = new Tile(gameZone)
  grid.randomEmptyCell().tile = new Tile(gameZone)
  setupInput()
}
function storeScore(score) {
  const oldScore = localStorage.getItem('game-score')
  if (!oldScore || +oldScore < score) {
    localStorage.setItem('game-score', score)
  }
}
function showScore(newScore, addScore) {
  document.getElementById('score').textContent = newScore
}
function showHistoryScore() {
  const historyScore = +localStorage.getItem('game-score')
  document.getElementById('history').textContent = historyScore
}