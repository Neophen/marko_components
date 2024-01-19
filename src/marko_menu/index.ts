import { MarkoMenu } from './markoMenu'
import { MarkoMenuTransitionChild, MarkoMenuChild } from './markoMenuChild'
import { MarkoMenuContent } from './markoMenuContent'
import { MarkoMenuFocusTrap } from './markoMenuFocusTrap'

class MarkoMenuTrigger extends MarkoMenuChild {}
class MarkoMenuOverlay extends MarkoMenuTransitionChild {}

customElements.define('marko-menu', MarkoMenu)
customElements.define('marko-menu-trigger', MarkoMenuTrigger)
customElements.define('marko-menu-overlay', MarkoMenuOverlay)
customElements.define('marko-menu-content', MarkoMenuContent)
customElements.define('marko-menu-content-focus-trap', MarkoMenuFocusTrap)
