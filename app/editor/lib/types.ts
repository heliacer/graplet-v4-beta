export interface Action {
  type: string
  fields: (string | number)[]
  values?: Value[]
  children?: Action[]
}

export interface Value {
  id?: string,
  content?: string | number
}

export interface ActionScript {
  trigger: Action
  actions: Action[]
}

export interface IR {
  scripts: ActionScript[]
}