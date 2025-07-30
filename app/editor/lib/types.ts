export interface Action {
  type: string
  fields: (string | number)[]
  children?: Action[]
}

export interface ActionScript {
  trigger: Action
  actions: Action[]
}

export interface IR {
  scripts: ActionScript[]
}