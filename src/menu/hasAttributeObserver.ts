export class HasAttributeObserver {
	observer: MutationObserver;

	static new(
		element: Element,
		parentElement: Element,
		attributeName: string,
		callback: (value: boolean) => void
	) {
		return new HasAttributeObserver(
			element,
			parentElement,
			attributeName,
			callback
		);
	}

	constructor(
		element: Element,
		parentElement: Element,
		attributeName: string,
		callback: (value: boolean) => void
	) {
		if (!(element instanceof Element) || !(parentElement instanceof Element)) {
			throw new Error(
				"Both 'element' and 'parentElement' must be valid DOM elements."
			);
		}
		const observerOptions = {
			attributes: true,
		};

		const attributeChangeCallback = (mutations: MutationRecord[]): void => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === attributeName
				) {
					callback(parentElement.hasAttribute(attributeName));
				}
			}
		};

		this.observer = new MutationObserver(attributeChangeCallback);
		this.observer.observe(parentElement, observerOptions);
	}

	disconnect() {
		this.observer.disconnect();
	}
}
