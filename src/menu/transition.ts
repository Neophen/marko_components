type TransitionEvent = CustomEvent<{ target: Transition }>;

const TRANSITION_ADD = "marko-transition-add";
const TRANSITION_DELETE = "marko-transition-delete";
const TRANSITION_END = "marko-transition-end";

const makeAbortablePromise =
	(controller: AbortController) => (promise: Promise<any>) =>
		Promise.race([
			promise,
			new Promise<void>(
				(resolve) => (controller.signal.onabort = () => resolve())
			),
		]);

export class Transition {
	private enter!: string[];
	private enterFrom!: string[];
	private enterTo!: string[];
	private leave!: string[];
	private leaveFrom!: string[];
	private leaveTo!: string[];
	private childrenCount!: number;
	private el!: HTMLElement;
	private enterAbort?: AbortController;
	private leaveAbort?: AbortController;

	constructor(el: HTMLElement) {
		this.addChild = this.addChild.bind(this);
		this.removeChild = this.removeChild.bind(this);

		this.el = el;
		const attr = (name: string, fallback: string) =>
			(this.el.getAttribute(name) ?? this.el.getAttribute(fallback) ?? "")
				.split(" ")
				.filter(Boolean);

		this.enter = attr("enter", "with");
		this.enterFrom = attr("enter-from", "hide");
		this.enterTo = attr("enter-to", "show");
		this.leave = attr("leave", "with");
		this.leaveFrom = attr("leave-from", "show");
		this.leaveTo = attr("leave-to", "hide");

		// count children using events
		this.childrenCount = 0;
		this.el.addEventListener(TRANSITION_ADD, this.addChild as EventListener);
		this.el.addEventListener(
			TRANSITION_DELETE,
			this.removeChild as EventListener
		);

		this.dispatchEvent(TRANSITION_ADD);

		this.init();
	}

	dispatchEvent(name: string) {
		this.el.dispatchEvent(
			new CustomEvent(name, {
				bubbles: true,
				composed: true,
				detail: { target: this },
			})
		);
	}

	disconnectedCallback() {
		this.dispatchEvent(TRANSITION_DELETE);
		this.el.removeEventListener(TRANSITION_ADD, this.addChild as EventListener);
		this.el.removeEventListener(
			TRANSITION_DELETE,
			this.removeChild as EventListener
		);
	}

	sameGroup(e: TransitionEvent) {
		return this.key === e.detail.target.key;
	}

	addChild(e: TransitionEvent) {
		if (this.sameGroup(e)) {
			this.childrenCount++;
		}
	}

	removeChild(e: TransitionEvent) {
		if (this.sameGroup(e)) {
			this.childrenCount--;
		}
	}

	async init() {
		await this.nextFrame();

		if (this.open) {
			this.el.style.display = "";
		} else {
			this.el.style.display = "none";
		}
	}

	get key() {
		return this.el.getAttribute("key");
	}

	get open() {
		return this.el.hasAttribute("open");
	}

	set open(val) {
		if (val) {
			this.el.setAttribute("open", "");
			this.onEnter();
		} else {
			this.el.removeAttribute("open");
			this.onLeave();
		}
	}

	async onEnter() {
		if (this.leaveAbort) {
			this.leaveAbort.abort();
		}

		this.enterAbort = new AbortController();
		const abortablePromise = makeAbortablePromise(this.enterAbort);

		this.el.style.display = "";

		const completed = this.completed(this.enterAbort);

		this.addClasses(this.enter);
		this.addClasses(this.enterFrom);

		await abortablePromise(this.nextFrame());

		const transitioned = this.transitioned(this.enter, this.enterAbort);

		this.removeClasses(this.enterFrom);
		this.addClasses(this.enterTo);

		await abortablePromise(transitioned);

		this.removeClasses(this.enter);
		this.removeClasses(this.enterTo);
		this.dispatchEvent(TRANSITION_END);

		await abortablePromise(completed);
		this.enterAbort = undefined;
	}

	async onLeave() {
		if (this.enterAbort) {
			this.enterAbort.abort();
		}

		await this.nextFrame();

		this.leaveAbort = new AbortController();
		const abortablePromise = makeAbortablePromise(this.leaveAbort);

		const completed = this.completed(this.leaveAbort);

		this.addClasses(this.leave);
		this.addClasses(this.leaveFrom);

		await abortablePromise(this.nextFrame());

		const transitioned = this.transitioned(this.leave, this.leaveAbort);

		this.removeClasses(this.leaveFrom);
		this.addClasses(this.leaveTo);

		await abortablePromise(transitioned);

		this.removeClasses(this.leave);
		this.removeClasses(this.leaveTo);

		this.dispatchEvent(TRANSITION_END);

		await abortablePromise(completed);

		this.el.style.display = "none";
		this.leaveAbort = undefined;
	}

	addClasses(val: string[]) {
		this.el.classList.add(...val);
	}

	removeClasses(val: string[]) {
		this.el.classList.remove(...val);
	}

	nextFrame() {
		return new Promise((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(resolve))
		);
	}

	transitioned(transition: string[], abortController: AbortController) {
		// if no transition, resolve immediately
		return transition.length
			? new Promise<void>((resolve) =>
					this.el.addEventListener(
						"transitionend",
						(e) => {
							e.stopPropagation();
							resolve();
						},
						{ once: true, signal: abortController.signal }
					)
			  )
			: Promise.resolve();
	}

	completed(abortController: AbortController) {
		// wait for completion of children via event count
		return new Promise<void>((resolve) => {
			let count = this.childrenCount;

			const handler = (e: TransitionEvent) => {
				if (this.sameGroup(e)) {
					if (--count === 0) {
						this.el.removeEventListener(
							TRANSITION_END,
							handler as EventListener
						);
						resolve();
					}
				}
			};

			this.el.addEventListener(TRANSITION_END, handler as EventListener, {
				signal: abortController.signal,
			});
		});
	}
}
