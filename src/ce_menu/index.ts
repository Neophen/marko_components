import { CeMenuComponent } from './ce_menu_component'
import { CeMenuTransitionChildComponent, CeMenuChildComponent } from './ce_menu_child_component'
import { CeMenuContentComponent } from './ce_menu_content_component'
import { CeMenuFocusTrapComponent } from './ce_menu_focus_trap_component'

class CeMenuTriggerComponent extends CeMenuChildComponent {}
class CeMenuOverlayComponent extends CeMenuTransitionChildComponent {}

CeMenuComponent.define()
CeMenuTriggerComponent.define()
CeMenuOverlayComponent.define()
CeMenuContentComponent.define()
CeMenuFocusTrapComponent.define()
