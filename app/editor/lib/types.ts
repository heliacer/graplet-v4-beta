import { Object3D, Object3DEventMap, Scene } from "three"

export interface Action {
  type: string
  fields?: Value[]
  values?: ValueWrapper[]
  resolvers?: Array<((v: Value) => Value) | undefined>
  actionsList?: Array<Action[]>
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

export type ObjectsEnv = Map<string, Object3D<Object3DEventMap>>
export type VariableEnv = Map<string, Value>
export type FunctionsEnv = Map<string, Action[]>

export interface Context {
  scene: Scene
  objects: ObjectsEnv
  variables: VariableEnv
  functions: FunctionsEnv
}

export type Value = string | number | boolean // More in future, such as Mesh, Vector3, etc...S