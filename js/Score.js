export default class Score {
  #scoreEl
  #value
  constructor(selector, scoreNumber) {
    this.#scoreEl = document.querySelector(selector)
    scoreNumber = scoreNumber || 0
    this.#value = +scoreNumber
    this.#scoreEl.textContent = this.#value
  }
  get value() { return this.#value }
  set value(nv) {
    if (nv == null) { nv = 0 }
    this.#value = nv
    this.#scoreEl.textContent = nv
  }
  // TODO: save and load use Score
  load() {

  }
  save() {
    const setting = this.load()
    setting.score = this.#value
    setting.time = new Date().toString()

    localStorage.setItem('game-2048-setting')
  }
}