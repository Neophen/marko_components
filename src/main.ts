import './style.css'
import './marko_menu'


export class MouseClickTrack extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.onDocumentClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onDocumentClick)
  }

  onDocumentClick = (event: MouseEvent) => {
    if (event.target === this) {
      const mouseX = event.clientX
      const mouseY = event.clientY
      this.style.setProperty('--mouse-x', `${mouseX}px`)
      this.style.setProperty('--mouse-y', `${mouseY}px`)
      return
    }
    // get the mouse position and set css variable --mouse-x and --mouse-y
  }
}


customElements.define('mouse-click-track', MouseClickTrack)
