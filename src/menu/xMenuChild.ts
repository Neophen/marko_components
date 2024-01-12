import { Transition } from "./transition";
import { HasAttributeObserver } from "./hasAttributeObserver";

import type { XMenu } from "./xMenu";

export class XMenuChild extends HTMLElement {
	xMenu!: XMenu;
	xMenuObserver!: HasAttributeObserver;

	connectedCallback() {
		this.onButtonClick = this.onButtonClick.bind(this);
		const xMenu = this.closest("x-menu");
		if (!xMenu) {
			const tag = this.tagName.toLocaleLowerCase().replace(/_/g, "-");
			throw new Error(`<${tag}> has to be nested within <x-menu> component.`);
		}

		this.xMenu = xMenu as XMenu;

		this.xMenuObserver = new HasAttributeObserver(
			this,
			this.xMenu,
			"open",
			this.onOpenChange.bind(this)
		);

		this.querySelectorAll<HTMLButtonElement>("button[x-menu-toggle]").forEach(
			(button) => {
				button.addEventListener("click", this.onButtonClick);
			}
		);
	}

	disconnectedCallback() {
		this.xMenuObserver.disconnect();
		this.querySelectorAll<HTMLButtonElement>("button[x-menu-toggle]").forEach(
			(button) => {
				button.removeEventListener("click", this.onButtonClick);
			}
		);
	}

	onOpenChange(open: boolean) {
		this.toggleAttribute("open", open);
	}

	onButtonClick(event: MouseEvent) {
		this.dispatchEvent(
			this.xMenu.createEvent({ target: event.target as HTMLButtonElement })
		);
	}
}

export class XMenuTransitionChild extends XMenuChild {
	transition!: Transition;

	connectedCallback() {
		super.connectedCallback();
		this.transition = new Transition(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.transition.disconnectedCallback();
	}

	onOpenChange(open: boolean) {
		this.transition.open = open;
	}
}
