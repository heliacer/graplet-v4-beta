export interface Action {
  type: string
  fields: (string | number)[]
  children?: Action[]
}