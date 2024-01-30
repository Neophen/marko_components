import { CeMenuChildComponent } from './marko_menu_child_component'

const MAX_TRIES = 10

export class CeMenuFocusTrapComponent extends CeMenuChildComponent {
  previousActiveElement: HTMLElement | null = null
  tries = 0

  onOpenChange(open: boolean): void {
    super.onOpenChange(open)
    if (open) {
      this.previousActiveElement = document.activeElement as HTMLElement
      this.focusFirstElement()

      this.addEventListener('keydown', this.maybeTrapFocus)
      document.addEventListener('keydown', this.maybeCloseMenu)
    } else {
      this.previousActiveElement?.focus?.()
      this.removeEventListener('keydown', this.maybeTrapFocus)
      document.removeEventListener('keydown', this.maybeCloseMenu)
    }
  }

  maybeTrapFocus = (event: KeyboardEvent): void => {
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
    }
  }

  maybeCloseMenu = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.dispatchEvent(this.menu.createEvent({ action: 'close' }))
    }
  }

  focusFirstElement = (): void => {
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

    console.warn('No focusable elements found in <marko-menu-content-focus-trap>.')
  }

  getFocusableElements = () => {
    return this.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
  }
}
