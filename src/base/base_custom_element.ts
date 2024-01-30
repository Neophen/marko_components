import { Logger } from './logger'
import type { ObservedAttribute, ObserverMethod } from './types'
import { attributeToCamelCase, methodToKebabCase } from './utils'

/*
 * A base for autonomous custom elements that provides a few quality of life
 * improvements over building a custom element yourself.
 *
 * This element provides implementations for connectedCallback, attributeChangedCallback,
 * and disconnectedCallback (adoptedCallback is not defined as I have no idea when it is called
 * or what it is for and I have read the spec and I don't get it, but if you do, please reach out).
 * It also provides a static method named `define` that registers this element
 * with the CustomElementRegistry as returned by `customElements`.
 *
 * Features:
 *
 * * instead of implement attributeChangedCallback, you implement a method for each attribute
 *   you have specified in observedAttributes. You must declare observedAttributes in your class,
 *   but then provide `«attributeCamelCase»Observer`.  See attributeChangedCallback for details
 * * This class provides an attribute called `this.logger` to use in logging warnings.  By default,
 *   the warnings are not shown.  If your subclass as `show-warnings` in its `observedAttributes`
 *   then setting this value will show warnings in the console. The purpose of this is to allow a way
 *   to print to the console when an element isn't being used properly so when the element doesnt' do
 *   anything, you can figure out why in the console.  But, by default, nothing is printed because that's
 *   what elements do.
 * * Calls a method named `render` whenever needed. This method is implemented by you and is expected to
 *   do whatever is needed basd on the current state of the element.  For example, when an attribute is changed,
 *   that change presumably affects something inside your element, so `render` is called and you can update
 *   the element as needed.
 * * overrides disconnectedCallback to set a flag that the element is disconnected. This can be used
 *   to prevent taking actions that wouldn't make sense on a disconnected element.
 *
 *
 * Conventions:
 *
 * * A custom element has many different APIS:
 *   - The HTML attributes and their values
 *   - events they dispatch
 *   - internal state
 *   - methods called by the browser
 *   - private methods of this class that should not be called
 * * All HTML attributes' values are strings, but internal state doesn't have to store them that way
 * * Internal state should be implement as either attributes or via get
 * * APIs for setting internal state are discouraged - this should be done via attributes and events
 * * Methods called by the browser are implemented as defined (obviously—they have to be)
 * * Private methods or data of this class that should not be called start with two underscores. Do not access, call, or change these.
 *
 */
export class BaseCustomElement extends HTMLElement {
  logger: Logger
  __connected: boolean = false
  onDisconnected() {}
  onConnected() {}
  render() {}

  constructor() {
    super()
    this.logger = Logger.create()
  }

  static get tagName() {
    // replace the last Component with nothing, then replace all uppercase letters with a dash and the lowercase version of that letter
    // return this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    return this.name.replace(/Component$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  static define() {
    if (!this.tagName) {
      throw `To use BaseCustomElement, you must define the static member tagName to return your custom tag's name`
    }
    customElements.define(this.tagName, this)
  }

  static get observedAttributes() {
    return Object.getOwnPropertyNames(this.prototype)
      .filter((method) => method.endsWith('Observer'))
      .map((method) => methodToKebabCase(method.replace('Observer', '')))
  }

  showWarningsObserver({ newValue }: ObservedAttribute) {
    const prefix = newValue == '' ? this.id : newValue
    this.logger = Logger.create(prefix)
  }

  /*
   * When called by the browser, calls a method you define based on the name of the attribute.
   * Override this if you want to provide your own implementation, which you probably don't.
   *
   * Attribute names are assumed to be in kebab-case and are translated to camelCase to create a method name.
   * That method is `«attributeInCamelCase»Observer`, so if your attribute is `hex-code`,
   * a method named `hexCodeObserver` in invoked.  If no such method is defined, a
   * warning is logged in the console, regardless of the `show-warnings` attribute.
   *
   * The method is invoked with `{oldValue,newValue}` - i.e. an object and not positional parameters. This
   * means your implementation can omit any parameters it doesn't care about.
   *
   * The return value of the method is ignored.
   *
   * After your method is called, if there is a method named `render`, it is called with no arguments.
   *
   */
  attributeObserver(name: string, oldValue: string, newValue: string) {
    const data: ObservedAttribute = { newValue, oldValue }
    const callbackName = `${attributeToCamelCase(name)}Observer`

    if (typeof this[callbackName as keyof HTMLElement] === 'function') {
      ;(this[callbackName as keyof HTMLElement] as ObserverMethod)(data)
    } else {
      console.warn(`<${this.tagName}> Method ${callbackName} not found.`)
    }

    this.__render()
  }

  /** Sets a flag that the component was disconnected, clears the connected flag ,if set, and
   * calls `onDisconnected` if that method is defined.
   * Override this to opt-out of this behavior.
   */
  disconnectedCallback() {
    this.__connected = false
    this.onDisconnected()
  }

  /**
   * Sets a flag that the component has connected and clears the disconnected flag, if set.
   * If onConnected() is defined, that method is called.  If render() is defined, that method is called as well.
   */
  connectedCallback() {
    this.__connected = true

    this.onConnected()
    this.__render()
  }

  get isConnected() {
    return this.__connected
  }

  get isDisconnected() {
    return !this.__connected
  }

  __render() {
    if (this.isDisconnected) {
      return
    }

    this.render()
  }
}
