import { XMenuChild } from './xMenuChild'

const MAX_TRIES = 10

export class XMenuFocusTrap extends XMenuChild {
  previousActiveElement: HTMLElement | null = null
  tries = 0

  constructor() {
    super()
    this.maybeCloseMenu = this.maybeCloseMenu.bind(this)
    this.maybeTrapFocus = this.maybeTrapFocus.bind(this)
  }

  onOpenChange(open: boolean): void {
    super.onOpenChange(open)
    if (open) {
      // capture current focus
      this.previousActiveElement = document.activeElement as HTMLElement
      this.focusFirstElement()
      // trap focus
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.addEventListener('keydown', this.maybeTrapFocus)
      document.addEventListener('keydown', this.maybeCloseMenu)
    } else {
      // release focus
      this.previousActiveElement?.focus?.()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.removeEventListener('keydown', this.maybeTrapFocus)
      document.removeEventListener('keydown', this.maybeCloseMenu)
    }
  }

  maybeTrapFocus(event: KeyboardEvent): void {
    const focusableEls = this.getFocusableElements()
    const firstFocusableEl = focusableEls[0] as HTMLElement
    const lastFocusableEl = focusableEls[focusableEls.length - 1] as HTMLElement

    if (document.activeElement === lastFocusableEl && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusableEl.focus()
      return
    }

    if (document.activeElement === firstFocusableEl && event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusableEl.focus()
      return
    }
  }

  maybeCloseMenu(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.dispatchEvent(this.xMenu.createEvent({ action: 'close' }))
    }
  }

  focusFirstElement(): void {
    const firstElement = this.getFocusableElements()[0]
    if (firstElement instanceof HTMLElement) {
      this.tries = 0
      firstElement.focus()
      return
    }

    if (this.tries < MAX_TRIES) {
      this.tries++
      requestAnimationFrame(() => {
        this.focusFirstElement()
      })
      return
    }

    console.warn('No focusable elements found in <x-menu-content-focus-trap>.')
  }

  getFocusableElements() {
    return this.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
  }
}
