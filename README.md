# x-menu

A simple web component for creating menus

![image](https://github.com/Neophen/x_menu/assets/6092928/15cf5f58-26f4-4f55-bfbb-fa78694f42b2)


![image](https://github.com/Neophen/x_menu/assets/6092928/3be00524-67f3-40e0-a948-f7dcdceb247e)


Use at your own risk

Note that the design is responsive, also try keyboard navigation

Here's a demo [**Demo**](https://menu.themykolas.com/)

```html
<x-menu class="relative isolate z-20">
  <x-menu-trigger class="shrink-0 grow-0">
    <div class="hidden sm:block">
      <button type="button" x-menu-toggle class="flex gap-4 rounded border p-2">
        <div class="h-8 w-8"></div>
        <div class="box-content grid h-8 w-8 place-items-center rounded-full border bg-slate-500 text-white">MM</div>
      </button>
    </div>
    <div class="rounded border p-2 sm:hidden">
      <button type="button" x-menu-toggle="open">Menu</button>
    </div>
  </x-menu-trigger>
  <x-menu-overlay with="transition-opacity duration-300 ease-out" hide="opacity-0" show="opacity-100">
    <div class="fixed inset-0 bg-black/80 sm:hidden"></div>
  </x-menu-overlay>
  <x-menu-content
    class="fixed  inset-0 z-10 ml-28 sm:absolute sm:inset-auto sm:right-0 sm:top-[calc(100%+8px)] sm:ml-0 sm:max-h-[560px] sm:w-80"
    x-click-outside="close"
    with="transition-all duration-300 ease-in"
    hide="translate-x-full opacity-0 sm:translate-x-0"
    show="translate-x-0 sm:opacity-100"
  >
    <div class="shadow-1 flex h-full flex-col border bg-white sm:h-auto">
      <div class="flex justify-end sm:hidden">
        <button type="button" x-menu-toggle="close">Close</button>
      </div>
      <x-menu-content-focus-trap>
        <div class="flex grow flex-col overflow-y-auto sm:py-6">
          <button type="button">Menu item</button>
          <button type="button">Menu item</button>
          <button type="button">Menu item</button>
          <button type="button">Menu item</button>
          <button type="button">Menu item</button>
        </div>
      </x-menu-content-focus-trap>
    </div>
  </x-menu-content>
</x-menu>
```
