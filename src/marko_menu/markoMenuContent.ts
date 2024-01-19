import { MarkoMenuChild } from './markoMenuChild'
import { MarkoMenu } from './markoMenu'
import { Transition } from './transition'
import { Placement, computePosition, flip, shift, offset } from '@floating-ui/dom'

export class MarkoMenuContent extends MarkoMenuChild {
  initClickEvents = false
  transition!: Transition
  dialog!: HTMLDialogElement
  template = `<dialog></dialog>`
  placement: Placement = 'bottom'
  anchor?: string
  isConnected: boolean = false
  offset = 0
  padding = 0

  static get observedAttributes() {
    return ['placement', 'anchor', 'offset', 'padding']
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    switch (name) {
      case 'placement':
        this.placement = newValue as Placement
        break
      case 'anchor':
        this.anchor = newValue
        this.maybeAnchorDialog()
        break
      case 'offset':
        this.offset = parseInt(newValue)
        break
      case 'padding':
        this.padding = parseInt(newValue)
        break
    }
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.anchor = this.getAttribute('anchor') ?? undefined
    this.populate()
    this.isConnected = true
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

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.transition.disconnectedCallback()
    document.removeEventListener('click', this.onDocumentClick)
    this.dialog.removeEventListener('close', this.onDialogClose)
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
      strategy: 'fixed',
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
      if (MarkoMenuContent.observedAttributes.includes(attribute.name)) {
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
      this.markoMenu.createEvent({
        action: MarkoMenu.getActionAttribute(target, 'x-click-outside') ?? 'close',
      }),
    )
  }

  onDialogClose = (): void => {
    this.dispatchEvent(
      this.markoMenu.createEvent({
        action: 'close',
      }),
    )
  }
}
