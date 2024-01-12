import { XMenuChild } from "./XMenuChild";

const MAX_TRIES = 10;

export class XMenuFocusTrap extends XMenuChild {
	previousActiveElement: HTMLElement | null = null;
  tries = 0;

	onOpenChange(open: boolean): void {
		super.onOpenChange(open);
		if (open) {
			// capture current focus
			this.previousActiveElement = document.activeElement as HTMLElement;
			this.focusFirstElement();
			// trap focus
			this.addEventListener("keydown", this.onKeyDown);
		} else {
			// release focus
			this.previousActiveElement?.focus?.();
			this.removeEventListener("keydown", this.onKeyDown);
		}
	}

	onKeyDown(event: KeyboardEvent): void {
		if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
			event.preventDefault();
			this.focusNextElement();
		}

		if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
			event.preventDefault();
			this.focusPreviousElement();
		}

		if (event.key === "Escape") {
			this.dispatchEvent(this.xMenu.createEvent({ action: "close" }));
		}
	}

	focusFirstElement(): void {
		const focusableElements = this.getFocusableElements();
		if (focusableElements.length > 0) {
			focusableElements[0].focus();
			return;
		}

		if (this.tries < MAX_TRIES) {
			requestAnimationFrame(() => {
				this.focusFirstElement();
			});
			return;
		}

		console.warn("No focusable elements found in <x-menu-content-focus-trap>.");
	}

	getFocusableElements(): HTMLElement[] {
		return Array.from(
			this.querySelectorAll(
				"button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
			)
		);
	}

	focusNextElement(): void {
		const focusableElements = this.getFocusableElements();
		const activeElement = document.activeElement as HTMLElement;
		const activeElementIndex = focusableElements.indexOf(activeElement);
		const lastElementIndex = focusableElements.length - 1;
		const nextElementIndex = activeElementIndex + 1;
		const index = nextElementIndex > lastElementIndex ? 0 : nextElementIndex;
		focusableElements[index]?.focus?.();
	}

	focusPreviousElement(): void {
		const focusableElements = this.getFocusableElements();
		const activeElement = document.activeElement as HTMLElement;
		const activeElementIndex = focusableElements.indexOf(activeElement);
		const lastElementIndex = focusableElements.length - 1;
		const nextElementIndex = activeElementIndex - 1;
		const index = nextElementIndex < 0 ? lastElementIndex : nextElementIndex;
		focusableElements[index]?.focus?.();
	}
}
