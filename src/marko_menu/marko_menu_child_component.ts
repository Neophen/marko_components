import { Transition } from './transition'
import { HasAttributeObserver } from './has_attribute_observer'

import { CeMenuComponent } from './marko_menu_component'
import { BaseCustomElement } from '../base/base_custom_element'

type ClickableElement = HTMLButtonElement | HTMLAnchorElement

const CLICKABLE_ELEMENT_SELECTOR = 'button[ce-menu-toggle]:not([disabled]), a[ce-menu-toggle]:not([disabled])'

export class CeMenuChildComponent extends BaseCustomElement {
  menu!: CeMenuComponent
  CeMenuComponentObserver!: HasAttributeObserver
  initClickEvents = true

  onConnected() {
    const menu = this.closest(CeMenuComponent.tagName)
    if (!menu) {
      throw new Error(`<${this.tagName} /> must be nested within ${CeMenuComponent.tagName} component.`)
    }

    this.menu = menu as CeMenuComponent

    this.CeMenuComponentObserver = new HasAttributeObserver(this, this.menu, 'open', this.onOpenChange.bind(this))

    if (this.initClickEvents) {
      this.addClickEvents()
    }
  }

  onDisconnected() {
    this.CeMenuComponentObserver.disconnect()
    this.removeClickEvents()
  }

  protected onOpenChange(open: boolean) {
    this.toggleAttribute('open', open)
  }

  protected addClickEvents() {
    this.querySelectorAll<ClickableElement>(CLICKABLE_ELEMENT_SELECTOR).forEach((element) => {
      element.addEventListener('click', this.onToggle)
    })
  }

  protected removeClickEvents() {
    this.querySelectorAll<ClickableElement>(CLICKABLE_ELEMENT_SELECTOR).forEach((element) => {
      element.removeEventListener('click', this.onToggle)
    })
  }

  private onToggle = (event: Event) => {
    this.dispatchEvent(this.menu.createEvent({ target: event.target as HTMLButtonElement }))
  }
}

export class CeMenuTransitionChildComponent extends CeMenuChildComponent {
  transition!: Transition

  onConnected() {
    super.onConnected()
    this.transition = new Transition(this)
  }

  onDisconnected() {
    super.onDisconnected()
    this.transition.disconnectedCallback()
  }

  onOpenChange(open: boolean) {
    this.transition.open = open
  }
}
