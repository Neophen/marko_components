import { BaseCustomElement } from '../base/base_custom_element'
import type { CeMenuComponentToggleActionEvent, CeMenuComponentToggleAction, CeMenuComponentToggleActionProps } from './types'

declare global {
  interface HTMLElementEventMap {
    'ce-menu-toggle': CeMenuComponentToggleActionEvent
  }
}

export class CeMenuComponent extends BaseCustomElement {
  onConnected() {
    this.addEventListener('ce-menu-toggle', this.onCeMenuComponentToggle)

    if (this.querySelectorAll('marko-menu-content-focus-trap').length > 1) {
      throw new Error('<marko-menu>: Only one `<marko-menu-content-focus-trap>` element is allowed.')
    }
  }

  onDisconnected() {
    this.removeEventListener('ce-menu-toggle', this.onCeMenuComponentToggle)
  }

  onCeMenuComponentToggle = ({ detail: { target, action } }: CeMenuComponentToggleActionEvent): void => {
    const toggleAction: CeMenuComponentToggleAction = action ?? CeMenuComponent.getActionAttribute(target) ?? 'toggle'
    switch (toggleAction) {
      case 'open':
        this.toggleAttribute('open', true)
        break
      case 'close':
        this.toggleAttribute('open', false)
        break
      case 'toggle':
        this.toggleAttribute('open')
        break
      default:
        this.toggleAttribute('open')
        break
    }
  }

  createEvent(detail: CeMenuComponentToggleActionProps) {
    return new CustomEvent('ce-menu-toggle', {
      bubbles: true,
      composed: true,
      detail,
    })
  }

  static getActionAttribute(target?: Element, attributeName = 'ce-menu-toggle'): CeMenuComponentToggleAction | null {
    return (target?.getAttribute(attributeName) as CeMenuComponentToggleAction | null) ?? null
  }
}
