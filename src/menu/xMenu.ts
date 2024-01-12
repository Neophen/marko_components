import type {
	XMenuToggleActionEvent,
	XMenuToggleAction,
	XMenuToggleActionProps,
} from "./types";

export class XMenu extends HTMLElement {
	connectedCallback() {
		this.addEventListener("x-menu-toggle", this.onXMenuToggle as EventListener);

		if (this.querySelectorAll("x-menu-content-focus-trap").length > 1) {
			throw new Error(
				"<x-menu>: Only one `<x-menu-content-focus-trap>` element is allowed."
			);
		}
	}

	disconnectedCallback() {
		this.removeEventListener(
			"x-menu-toggle",
			this.onXMenuToggle as EventListener
		);
	}

	onXMenuToggle({ detail: { target, action } }: XMenuToggleActionEvent) {
		const toggleAction: XMenuToggleAction =
			action ?? XMenu.getActionAttribute(target) ?? "toggle";
		switch (toggleAction) {
			case "open":
				this.toggleAttribute("open", true);
				break;
			case "close":
				this.toggleAttribute("open", false);
				break;
			case "toggle":
				this.toggleAttribute("open");
				break;
			default:
				this.toggleAttribute("open");
				break;
		}
	}

	createEvent(detail: XMenuToggleActionProps) {
		return new CustomEvent("x-menu-toggle", {
			bubbles: true,
			composed: true,
			detail,
		});
	}

	static getActionAttribute(
		target?: Element,
		attributeName = "x-menu-toggle"
	): XMenuToggleAction | null {
		return (
			(target?.getAttribute(attributeName) as XMenuToggleAction | null) ?? null
		);
	}
}
