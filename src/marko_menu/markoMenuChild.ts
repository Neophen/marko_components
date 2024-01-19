import { Transition } from './transition'
import { HasAttributeObserver } from './hasAttributeObserver'

import type { MarkoMenu } from './markoMenu'

type ClickableElement = HTMLButtonElement | HTMLAnchorElement

const CLICKABLE_ELEMENT_SELECTOR = 'button[marko-menu-toggle]:not([disabled]), a[marko-menu-toggle]:not([disabled])'

export class MarkoMenuChild extends HTMLElement {
  markoMenu!: MarkoMenu
  markoMenuObserver!: HasAttributeObserver
  initClickEvents = true

  get tag() {
    return this.tagName.toLocaleLowerCase().replace(/_/g, '-')
  }

  connectedCallback() {
    const markoMenu = this.closest('marko-menu')
    if (!markoMenu) {
      throw new Error(`<${this.tag}> has to be nested within <marko-menu> component.`)
    }

    this.markoMenu = markoMenu as MarkoMenu

    this.markoMenuObserver = new HasAttributeObserver(this, this.markoMenu, 'open', this.onOpenChange.bind(this))

    if (this.initClickEvents) {
      this.addClickEvents()
    }
  }

  disconnectedCallback() {
    this.markoMenuObserver.disconnect()
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
    this.dispatchEvent(this.markoMenu.createEvent({ target: event.target as HTMLButtonElement }))
  }
}

export class MarkoMenuTransitionChild extends MarkoMenuChild {
  transition!: Transition

  connectedCallback() {
    super.connectedCallback()
    this.transition = new Transition(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.transition.disconnectedCallback()
  }

  onOpenChange(open: boolean) {
    this.transition.open = open
  }
}
