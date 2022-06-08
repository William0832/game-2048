const STORAGE_KEY = 'game-2048-setting'
export default class Game {
  #score = 0
  // #addScoreList = []
  #history = 0
  #scoreEl
  #historyEl
  constructor(scoreEl, historyEl, scoreValue) {
    this.#scoreEl = scoreEl
    this.#historyEl = historyEl
    scoreValue = scoreValue || 0
    this.score = +scoreValue
    this.load()
  }
  get score() {
    return this.#score
  }
  set score(nv) {
    nv = +nv || 0
    this.#score = nv
    this.#scoreEl.textContent = nv
  }
  async addScore(addValue) {
    addValue = addValue || 0
    if (!addValue) return
    this.score += addValue
    return this.popupScore(addValue)
  }
  get history() {
    return this.#history
  }
  set history(nv) {
    this.#setHistory(nv)
  }
  #setHistory(nv) {
    nv = nv || 0
    this.#history = +nv
    this.#historyEl.textContent = nv
  }
  load() {
    const setting = localStorage.getItem(STORAGE_KEY)
    if (setting == null) {
      const settingString = JSON.stringify({ history: 0, time: new Date() })
      localStorage.setItem(STORAGE_KEY, settingString)
      this.#setHistory(0)
      return
    }
    this.#setHistory(JSON.parse(setting).history)
  }
  save() {
    if (this.#history > this.#score) return
    this.#setHistory(this.#score)

    const setting = { time: new Date(), history: this.#history }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setting))
  }
  popupScore(value) {
    return new Promise((resolve) => {
      const addScoreEl = document.createElement('div')
      addScoreEl.classList.add('add-score')
      addScoreEl.textContent = `+${value}`
      this.#scoreEl.append(addScoreEl)
      addScoreEl.addEventListener('animationend', (e) => resolve(value), { one: true })
    })
  }
}