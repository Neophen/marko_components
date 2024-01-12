import { XMenuChild, XMenuTransitionChild } from "./XMenuChild";
import { XMenu } from "./xMenu";
import { XMenuContent } from "./xMenuContent";
import { XMenuFocusTrap } from "./xMenuFocusTrap";

class XMenuTrigger extends XMenuChild {}
class XMenuOverlay extends XMenuTransitionChild {}

customElements.define("x-menu", XMenu);
customElements.define("x-menu-trigger", XMenuTrigger);
customElements.define("x-menu-overlay", XMenuOverlay);
customElements.define("x-menu-content", XMenuContent);
customElements.define("x-menu-content-focus-trap", XMenuFocusTrap);
