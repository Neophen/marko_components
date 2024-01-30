const TRANSITION_ADD = 'marko-transition-add'
const TRANSITION_DELETE = 'marko-transition-delete'
const TRANSITION_END = 'marko-transition-end'

// eslint-disable-next-line no-use-before-define
type TransitionEvent = CustomEvent<{ target: Transition }>

declare global {
  interface HTMLElementEventMap {
    [TRANSITION_ADD]: TransitionEvent
    [TRANSITION_DELETE]: TransitionEvent
    [TRANSITION_END]: TransitionEvent
  }
}

const makeAbortablePromise = (controller: AbortController) => (promise: Promise<void>) =>
  Promise.race([promise, new Promise<void>((resolve) => (controller.signal.onabort = () => resolve()))])

export class Transition {
  private enter!: string[]
  private enterFrom!: string[]
  private enterTo!: string[]
  private leave!: string[]
  private leaveFrom!: string[]
  private leaveTo!: string[]
  private childrenCount!: number
  private el!: HTMLElement
  private enterAbort?: AbortController
  private leaveAbort?: AbortController

  constructor(el: HTMLElement) {
    this.el = el
    const attr = (name: string, fallback: string) =>
      (this.el.getAttribute(name) ?? this.el.getAttribute(fallback) ?? '').split(' ').filter(Boolean)

    this.enter = attr('enter', 'with')
    this.enterFrom = attr('enter-from', 'hide')
    this.enterTo = attr('enter-to', 'show')
    this.leave = attr('leave', 'with')
    this.leaveFrom = attr('leave-from', 'show')
    this.leaveTo = attr('leave-to', 'hide')

    // count children using events
    this.childrenCount = 0

    this.el.addEventListener(TRANSITION_ADD, this.addChild)

    this.el.addEventListener(TRANSITION_DELETE, this.removeChild)

    this.dispatchEvent(TRANSITION_ADD)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.init()
  }

  dispatchEvent(name: string) {
    this.el.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail: { target: this },
      }),
    )
  }

  disconnectedCallback() {
    this.dispatchEvent(TRANSITION_DELETE)

    this.el.removeEventListener(TRANSITION_ADD, this.addChild)

    this.el.removeEventListener(TRANSITION_DELETE, this.removeChild)
  }

  sameGroup(e: TransitionEvent): boolean {
    return this.key === e.detail.target.key
  }

  addChild = (e: TransitionEvent): void => {
    if (this.sameGroup(e)) {
      this.childrenCount++
    }
  }

  removeChild = (e: TransitionEvent): void => {
    if (this.sameGroup(e)) {
      this.childrenCount--
    }
  }

  async init(): Promise<void> {
    await this.nextFrame()

    if (this.open) {
      this.el.style.display = ''
    } else {
      this.el.style.display = 'none'
    }
  }

  get key() {
    return this.el.getAttribute('key')
  }

  get open() {
    return this.el.hasAttribute('open')
  }

  set open(val) {
    const dialog = this.el instanceof HTMLDialogElement ? this.el : undefined
    if (val) {
      if (dialog) {
        dialog.showModal()

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.onEnter()
                .then(() => {})
                .catch(() => {})
            })
          })
        })
      } else {
        this.el.setAttribute('open', '')
        this.onEnter()
          .then(() => {})
          .catch(() => {})
      }
    } else {
      if (!dialog) {
        this.el.removeAttribute('open')
      }

      this.onLeave()
        .then(() => dialog && dialog.close())
        .catch(() => {})
    }
  }

  async onEnter() {
    if (this.leaveAbort) {
      this.leaveAbort.abort()
    }

    this.enterAbort = new AbortController()
    const abortablePromise = makeAbortablePromise(this.enterAbort)

    this.el.style.display = ''

    const completed = this.completed(this.enterAbort)

    this.addClasses(this.enter)
    this.addClasses(this.enterFrom)

    await abortablePromise(this.nextFrame())

    const transitioned = this.transitioned(this.enter, this.enterAbort)

    this.removeClasses(this.enterFrom)
    this.addClasses(this.enterTo)

    await abortablePromise(transitioned)

    this.removeClasses(this.enter)
    this.removeClasses(this.enterTo)
    this.dispatchEvent(TRANSITION_END)

    await abortablePromise(completed)
    this.enterAbort = undefined
  }

  async onLeave() {
    if (this.enterAbort) {
      this.enterAbort.abort()
    }

    await this.nextFrame()

    this.leaveAbort = new AbortController()
    const abortablePromise = makeAbortablePromise(this.leaveAbort)

    const completed = this.completed(this.leaveAbort)

    this.addClasses(this.leave)
    this.addClasses(this.leaveFrom)

    await abortablePromise(this.nextFrame())

    const transitioned = this.transitioned(this.leave, this.leaveAbort)

    this.removeClasses(this.leaveFrom)
    this.addClasses(this.leaveTo)

    await abortablePromise(transitioned)

    this.removeClasses(this.leave)
    this.removeClasses(this.leaveTo)

    this.dispatchEvent(TRANSITION_END)

    await abortablePromise(completed)

    this.el.style.display = 'none'
    this.leaveAbort = undefined
  }

  addClasses(val: string[]) {
    this.el.classList.add(...val)
  }

  removeClasses(val: string[]) {
    this.el.classList.remove(...val)
  }

  nextFrame() {
    return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  }

  transitioned(transition: string[], abortController: AbortController) {
    // if no transition, resolve immediately
    return transition.length
      ? new Promise<void>((resolve) =>
          this.el.addEventListener(
            'transitionend',
            (e) => {
              e.stopPropagation()
              resolve()
            },
            { once: true, signal: abortController.signal },
          ),
        )
      : Promise.resolve()
  }

  completed(abortController: AbortController) {
    // wait for completion of children via event count
    return new Promise<void>((resolve) => {
      let count = this.childrenCount

      const handler = (e: TransitionEvent) => {
        if (this.sameGroup(e)) {
          if (--count === 0) {
            this.el.removeEventListener(TRANSITION_END, handler)
            resolve()
          }
        }
      }

      this.el.addEventListener(TRANSITION_END, handler, {
        signal: abortController.signal,
      })
    })
  }
}
