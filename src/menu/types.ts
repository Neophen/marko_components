export type XMenuToggleAction = 'open' | 'close' | 'toggle'

export type XMenuToggleActionProps = {
  target?: HTMLButtonElement
  action?: XMenuToggleAction
}

export type XMenuToggleActionEvent = CustomEvent<XMenuToggleActionProps>
