import { Object3D, Object3DEventMap, Scene } from "three"

export interface Action {
  type: string
  fields?: Value[]
  values?: ValueWrapper[]
  resolvers?: Array<((v: Value) => Value) | undefined>
  children?: Action[]
}

export interface ValueWrapper {
  id?: string,
  content?: Value,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  compute?: Function
  nestedValues?: ValueWrapper[]
  resolvers?: Array<((v: Value) => Value) | undefined>
}

export interface ActionScript {
  trigger: Action
  actions: Action[]
}

export interface IR {
  scripts: ActionScript[]
}

export type ObjectsRecord = Map<string, Object3D<Object3DEventMap>>

export interface Context {
  scene: Scene
  objects: ObjectsRecord
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
