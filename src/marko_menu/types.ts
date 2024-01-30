export type CeMenuComponentToggleAction = 'open' | 'close' | 'toggle'

export type CeMenuComponentToggleActionProps = {
  target?: HTMLButtonElement
  action?: CeMenuComponentToggleAction
}

export type CeMenuComponentToggleActionEvent = CustomEvent<CeMenuComponentToggleActionProps>
