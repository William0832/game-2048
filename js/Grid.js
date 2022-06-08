const SET = {
  gridSize: 5,
  cellSize: '12vmin',
  cellGap: '1.5vmin'
}


export default class Grid {
  #cells
  constructor(gridEl) {
    initStyleVar(gridEl)
    const { gridSize } = SET
    this.#cells = createCellElement(gridEl).map((cellEl, index) => {
      const x = index % gridSize
      const y = Math.floor(index / gridSize)
      return new Cell(cellEl, x, y)
    })
  }
  get cells() {
    return this.#cells
  }
  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }
  get emptyLength() {
    return this.#cells.filter(cell => cell.tile == null).length
  }
  get columnGroupList() {
    return this.#cells.reduce((groups, cell) => {
      const { x } = cell
      groups[x]
        ? groups[x].push(cell)
        : groups.push([cell])
      return groups
    }, [])
  }
  get rowGroupList() {
    return this.#cells.reduce((groups, cell) => {
      const { y } = cell
      groups[y]
        ? groups[y].push(cell)
        : groups.push([cell])
      return groups
    }, [])
  }
  randomEmptyCell() {
    const emptyLength = this.#emptyCells.length
    const randomIndex = Math.floor(Math.random() * emptyLength)
    return this.#emptyCells[randomIndex]
  }
  init() {
    this.#cells.forEach(cell => {
      if (cell.tile) {
        cell.tile.remove()
        cell.tile = null
      }
    })
  }
}

class Cell {
  #cellEl
  #x
  #y
  #tile
  #mergeTile
  constructor(cellEl, x, y) {
    this.#cellEl = cellEl
    this.#x = x
    this.#y = y
  }
  get x() {
    return this.#x
  }
  get y() {
    return this.#y
  }
  get tile() {
    return this.#tile
  }
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }
  get mergeTile() {
    return this.#mergeTile
  }
  set mergeTile(nv) {
    this.#mergeTile = nv
    if (nv == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }
  canMove(tile) {
    return this.tile == null || (
      this.mergeTile == null &&
      this.#tile.value === tile.value
    )
  }
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value * 2
    this.mergeTile.remove()
    this.mergeTile = null
  }
}
function initStyleVar(el) {
  el.style.setProperty('--grid-size', SET.gridSize)
  el.style.setProperty('--cell-size', SET.cellSize)
  el.style.setProperty('--cell-gap', SET.cellGap)
}
function createCellElement(el) {
  const { gridSize } = SET
  const cells = []
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cells.push(cell)
    el.append(cell)
  }
  return cells
}
