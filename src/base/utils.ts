export function methodToKebabCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function attributeToCamelCase(value: string) {
  return value.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
}
