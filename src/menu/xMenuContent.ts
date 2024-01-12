import { XMenuTransitionChild } from './xMenuChild'
import { XMenu } from './xMenu'

export class XMenuContent extends XMenuTransitionChild {
  onOpenChange(open: boolean): void {
    super.onOpenChange(open)
    if (open) {
      requestAnimationFrame(() => {
        document.addEventListener('click', this.onDocumentClick)
      })
    } else {
      document.removeEventListener('click', this.onDocumentClick)
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('click', this.onDocumentClick)
  }

  onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement
    if (this.contains(target)) {
      return
    }

    this.dispatchEvent(
      this.xMenu.createEvent({
        action: XMenu.getActionAttribute(target, 'x-click-outside') ?? 'close',
      }),
    )
  }
}
