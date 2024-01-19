import type { MarkoMenuToggleActionEvent, MarkoMenuToggleAction, MarkoMenuToggleActionProps } from './types'

declare global {
  interface HTMLElementEventMap {
    'marko-menu-toggle': MarkoMenuToggleActionEvent
  }
}

export class MarkoMenu extends HTMLElement {
  connectedCallback() {
    this.addEventListener('marko-menu-toggle', this.onMarkoMenuToggle)

    if (this.querySelectorAll('marko-menu-content-focus-trap').length > 1) {
      throw new Error('<marko-menu>: Only one `<marko-menu-content-focus-trap>` element is allowed.')
    }
  }

  disconnectedCallback() {
    this.removeEventListener('marko-menu-toggle', this.onMarkoMenuToggle)
  }

  onMarkoMenuToggle = ({ detail: { target, action } }: MarkoMenuToggleActionEvent): void => {
    const toggleAction: MarkoMenuToggleAction = action ?? MarkoMenu.getActionAttribute(target) ?? 'toggle'
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

  createEvent(detail: MarkoMenuToggleActionProps) {
    return new CustomEvent('marko-menu-toggle', {
      bubbles: true,
      composed: true,
      detail,
    })
  }

  static getActionAttribute(target?: Element, attributeName = 'marko-menu-toggle'): MarkoMenuToggleAction | null {
    return (target?.getAttribute(attributeName) as MarkoMenuToggleAction | null) ?? null
  }
}
