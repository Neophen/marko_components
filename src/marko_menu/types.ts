export type MarkoMenuToggleAction = 'open' | 'close' | 'toggle'

export type MarkoMenuToggleActionProps = {
  target?: HTMLButtonElement
  action?: MarkoMenuToggleAction
}

export type MarkoMenuToggleActionEvent = CustomEvent<MarkoMenuToggleActionProps>
