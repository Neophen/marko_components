import { CeMenuChildComponent } from './ce_menu_child_component'
import { CeMenuComponent } from './ce_menu_component'
import { Transition } from './transition'
import { Placement, computePosition, flip, shift, offset } from '@floating-ui/dom'
import type { ObservedAttribute } from '../base/types'

export class CeMenuContentComponent extends CeMenuChildComponent {
  initClickEvents = false
  transition!: Transition
  dialog!: HTMLDialogElement
  template = `<dialog></dialog>`
  placement: Placement = 'bottom'
  anchor?: string
  offset = 0
  padding = 0

  onConnected(): void {
    super.onConnected()
    this.anchor = this.getAttribute('anchor') ?? undefined
    this.populate()
  }

  onDisconnected(): void {
    super.onDisconnected()
    this.transition.disconnectedCallback()
    document.removeEventListener('click', this.onDocumentClick)
    this.dialog.removeEventListener('close', this.onDialogClose)
  }

  placementObserver({ newValue }: ObservedAttribute): void {
    this.placement = newValue as Placement
  }

  anchorObserver({ newValue }: ObservedAttribute): void {
    this.anchor = newValue
    this.maybeAnchorDialog()
  }

  offsetObserver({ newValue }: ObservedAttribute): void {
    this.offset = parseInt(newValue)
  }

  paddingObserver({ newValue }: ObservedAttribute): void {
    this.padding = parseInt(newValue)
  }

  onOpenChange(open: boolean) {
    this.transition.open = open

    if (open) {
      this.maybeAnchorDialog()
      requestAnimationFrame(() => {
        this.addClickEvents()
        document.addEventListener('click', this.onDocumentClick)
      })
    } else {
      this.removeClickEvents()
      document.removeEventListener('click', this.onDocumentClick)
    }
  }

  maybeAnchorDialog(): void {
    if (!this.anchor || !this.isConnected) {
      return
    }

    const anchor = document.getElementById(this.anchor)

    if (!anchor) {
      return
    }

    computePosition(anchor, this.dialog, {
      placement: this.placement,
      middleware: [offset(this.offset), flip(), shift({ padding: this.padding })],
    }).then(({ x, y }) => {
      Object.assign(this.dialog.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    })
  }

  populate(): void {
    var template = document.createElement('template')
    template.innerHTML = this.template.trim()
    this.dialog = template.content.querySelector('dialog') as HTMLDialogElement

    this.dialog.innerHTML = this.innerHTML

    Array.from(this.attributes).forEach((attribute) => {
      if (CeMenuContentComponent.observedAttributes.includes(attribute.name)) {
        return
      }
      this.dialog.setAttribute(attribute.name, attribute.value)
      this.removeAttribute(attribute.name)
    })

    this.replaceChildren(template.content)
    this.dialog.addEventListener('close', this.onDialogClose)
    this.transition = new Transition(this.dialog)
  }

  onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement
    if (this.contains(target)) {
      return
    }

    this.dispatchEvent(
      this.menu.createEvent({
        action: CeMenuComponent.getActionAttribute(target, 'x-click-outside') ?? 'close',
      }),
    )
  }

  onDialogClose = (): void => {
    this.dispatchEvent(
      this.menu.createEvent({
        action: 'close',
      }),
    )
  }
}
