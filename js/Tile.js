
export default class Tile {
  #tileEl
  #x
  #y
  #value
  constructor(tileContainer, value = randomInitValue()) {
    this.#tileEl = document.createElement('div')
    this.#tileEl.classList.add('tile')
    tileContainer.append(this.#tileEl)
    this.value = value
  }
  get x() {
    return this.#x
  }
  get y() {
    return this.#y
  }
  get value() {
    return this.#value
  }
  set x(nv) {
    this.#x = nv
    this.#tileEl.style.setProperty('--x', nv)
  }
  set y(nv) {
    this.#y = nv
    this.#tileEl.style.setProperty('--y', nv)
  }
  set value(nv) {
    this.#value = nv
    this.#tileEl.textContent = nv
    const power = Math.log2(nv)
    const bgcLightness = 100 - power * 9
    const cLightness = bgcLightness <= 50 ? 90 : 10
    this.#tileEl.style.setProperty('--bgc-lightness', `${bgcLightness}%`)
    this.#tileEl.style.setProperty('--c-lightness', `${cLightness}%`)
  }
  remove() {
    this.#tileEl.remove()
  }
  waitTransition(isAnimation) {
    return new Promise(resolve => {
      this.#tileEl.addEventListener(isAnimation
        ? 'animationend' : 'transitionend',
        resolve,
        { once: true }
      )
    })
  }
}

function randomInitValue() {
  return Math.random() > 0.5 ? 4 : 2
}