# Custom Elements

Simple web component for liveview



![image](https://github.com/Neophen/x_menu/assets/6092928/15cf5f58-26f4-4f55-bfbb-fa78694f42b2)

![image](https://github.com/Neophen/x_menu/assets/6092928/3be00524-67f3-40e0-a948-f7dcdceb247e)

Use at your own risk

Note that the design is responsive, also try keyboard navigation

Here's a demo [**Demo**](https://menu.themykolas.com/)

- All `<ce-menu*>` components will receive the `open` attribute when the menu is open
  - You can style based on this state `<ce-menu class="open:bg-red-500">`
- `ce-menu-toggle` attribute can be set to one of `open|close|toggle` default is `toggle`
  - This attribute has to be on a `<button>` or `<a>` tags
- `<ce-menu-content>` wraps contents within a dialog element, all the attributes will be transferred to the dialog element
- `<ce-menu-overlay>` and `<ce-menu-content>` can be animated by using attributes
  - | Transition | Attribute name         |
    | ---------- | ---------------------- |
    | enter      | 'enter' or 'with'      |
    | enterFrom  | 'enter-from' or 'hide' |
    | enterTo    | 'enter-to' or 'show'   |
    | leave      | 'leave' or 'with'      |
    | leaveFrom  | 'leave-from' or 'show' |
    | leaveTo    | 'leave-to' or 'hide'   |
- `<ce-menu-content-focus-trap>` will trap focus within this element when it's open
  - Will restore focus to previously active element on close
  - on `ESC` key will close the menu

```html
<ce-menu class="relative isolate z-20">
  <ce-menu-trigger class="shrink-0 grow-0">
    <button class="hidden sm:block" ce-menu-toggle>Menu</button>
    <button class="sm:hidden" ce-menu-toggle="open">Sidebar</button>
  </ce-menu-trigger>
  <ce-menu-overlay
    style="display: none"
    with="transition-opacity duration-300 ease-out"
    hide="opacity-0"
    show="opacity-100"
  >
    <div class="fixed inset-0 bg-black/80 sm:hidden"></div>
  </ce-menu-overlay>
  <ce-menu-content
    x-click-outside="close"
    with="transition-all duration-300 ease-in"
    hide="translate-x-full opacity-0 sm:translate-x-0"
    show="translate-x-0 sm:opacity-100"
  >
    <button type="button" ce-menu-toggle="close">Close</button>
    <ce-menu-content-focus-trap>
      <button>Menu item</button>
      <button>Menu item</button>
      <button>Menu item</button>
      <button>Menu item</button>
      <button>Menu item</button>
    </ce-menu-content-focus-trap>
  </ce-menu-content>
</ce-menu>
```
