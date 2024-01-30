import './style.css'
import './ce_menu'
import { BaseCustomElement } from './base/base_custom_element'

export class CeTrackMouse extends BaseCustomElement {
  onConnected() {
    this.addEventListener('click', this.onDocumentClick)
  }

  onDisconnected() {
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

CeTrackMouse.define()
