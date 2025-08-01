import { RefObject } from "react"
import { Mesh } from "three"

export interface Action {
  type: string
  fields?: Value[]
  values?: ValueWrapper[]
  resolvers?: Array<(v: Value) => Value>
  children?: Action[]
}

export interface ValueWrapper {
  id?: string,
  content?: Value,
}

export interface ActionScript {
  trigger: Action
  actions: Action[]
}

export interface IR {
  scripts: ActionScript[]
}

export interface Context {
  box: RefObject<Mesh>
  variables: VariableManager
}

export type Value = string | number // More in future, such as Mesh, Vector3, etc...

export class VariableManager {
  private variables: Map<string, Value> = new Map()

  set(varId: string, value: Value) {
    const numValue = Number(value)
    this.variables.set(varId, Number.isNaN(numValue) ? value : numValue)
  }

  get(varId: string): Value {
    return this.variables.get(varId) ?? 0
  }

  change(varId: string, delta: number) {
    const value = this.get(varId)
    this.set(varId, (typeof value === 'number' ? value : 0) + delta)
  }
}
