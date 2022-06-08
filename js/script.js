import Game from './Game.js'
import Grid from "./Grid.js"
import Tile from "./Tile.js"
let scoreList = []
const DOMs = {
  score: document.getElementById('score'),
  history: document.getElementById('history'),
  gameZone: document.getElementById('game-zone')
}
const gameController = new Game(DOMs.score, DOMs.history)
const grid = new Grid(DOMs.gameZone)

initGame()

function initGame() {
  gameController.load()
  gameController.score = 0
  grid.init()
  grid.randomEmptyCell().tile = new Tile(DOMs.gameZone)
  grid.randomEmptyCell().tile = new Tile(DOMs.gameZone)
  setupInput()
}
function gameOver() {
  alert('Game Over')
  initGame()
}
function setupInput() {
  window.addEventListener('keydown', handelInput, { once: true })
  DOMs.gameZone.addEventListener('pointerdown', handelPhoneInput, { once: true })
}
async function handelPhoneInput(e) {
  const { pointerType, x, y } = e
  if (pointerType === 'mouse') return
  DOMs.gameZone.addEventListener('pointermove', (e) => {
    const { x: newX, y: newY } = e
    const diffX = newX - x
    const diffY = newY - y
    if (diffX === 0 && diffY === 0) {
      setupInput()
      return
    }
    // X
    if (Math.abs(diffX) > Math.abs(diffY)) {
      switch (diffX > 0) {
        case true:
          handelInput({ key: 'd' })
          break
        default:
          handelInput({ key: 'a' })
          return
      }
      return
    }
    // Y
    switch (diffY > 0) {
      case true:
        handelInput({ key: 's' })
        break
      default:
        handelInput({ key: 'w' })
        return
    }
  }, { once: true })
  setupInput()
}
async function handelInput(e) {
  const { key } = e
  let groups, score
  switch (key) {
    case 'ArrowUp':
    case 'w':
      groups = grid.columnGroupList
      if (!canMove(groups)) {
        setupInput()
        return
      }
      await slideTiles(groups)
      score = scoreList.reduce((sum, curr) => sum + curr, 0)
      gameController.addScore(score)
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
      score = scoreList.reduce((sum, curr) => sum + curr, 0)
      gameController.addScore(score)
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
      score = scoreList.reduce((sum, curr) => sum + curr, 0)
      gameController.addScore(score)
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
      score = scoreList.reduce((sum, curr) => sum + curr, 0)
      gameController.addScore(score)
      setupInput()
      break
    default:
      setupInput()
      return
  }
  grid.cells.forEach(cell => cell.mergeTiles())
  const newTile = new Tile(DOMs.gameZone)
  grid.randomEmptyCell().tile = newTile
  if (isGameOver()) {
    await newTile.waitTransition(true)
    gameController.save()
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
  scoreList = []
  return Promise.all(
    groups.flatMap(group => {
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
            scoreList.push(lastMoveCell.mergeTile.value * 2)
          } else {
            lastMoveCell.tile = cell.tile
          }
          cell.tile = null
        }
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