type ColorType =
  | 'red'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
type ColorShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
export type Color =
  | `${ColorType}-${ColorShade}`
  | 'transparent'
  | 'white'
  | 'black'
