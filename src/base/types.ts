export type ObservedAttribute = {
  newValue: string
  oldValue: string
}

export type ObserverMethod = (data: ObservedAttribute) => void
