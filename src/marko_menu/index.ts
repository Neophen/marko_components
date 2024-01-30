import { CeMenuComponent } from './marko_menu_component'
import { CeMenuTransitionChildComponent, CeMenuChildComponent } from './marko_menu_child_component'
import { CeMenuContentComponent } from './marko_menu_content_component'
import { CeMenuFocusTrapComponent } from './marko_menu_focus_trap_component'

class CeMenuTriggerComponent extends CeMenuChildComponent {}
class CeMenuOverlayComponent extends CeMenuTransitionChildComponent {}

CeMenuComponent.define()
CeMenuTriggerComponent.define()
CeMenuOverlayComponent.define()
CeMenuContentComponent.define()
CeMenuFocusTrapComponent.define()
