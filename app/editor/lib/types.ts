import { Object3D, Object3DEventMap, Scene } from 'three'

/**
 * @deprecated This is the old Action Expression
 */
export interface Action {
  type: string
  fields?: Value[]
  values?: ValueWrapper[]
  resolvers?: Array<((v: Value) => Value) | undefined>
  actionsList?: Array<Action[]>
}

/**
 * @deprecated This is the old Value Expression
 */
export interface ValueWrapper {
  varId?: string
  funcName?: string
  content?: Value
  compute?: Function
  nestedValues?: ValueWrapper[]
  resolvers?: Array<((v: Value) => Value) | undefined>
}

/**
 * @deprecated this is the old entry type
 */
export type ScriptType =
  | 'procedures_defreturn'
  | 'procedures_defnoreturn'
  | 'onclickrun'

/**
 * @deprecated this is the old entry (ActionScript)
 */
export interface ActionScript {
  type: ScriptType
  name?: string
  returns?: ValueWrapper
  actions: Action[]
}

/**
 * @deprecated this is the old main representation
 */
export interface IR {
  scripts: ActionScript[]
}

/**
 * @deprecated This is the old Function Expression
 */
export interface Func {
  actions: Action[]
  returns: ValueWrapper | undefined
}

export type ObjectsEnv = Map<string, Object3D<Object3DEventMap>>
export type VariableEnv = Map<string, Value>
export type FunctionsEnv = Map<string, Expression> // Func -> Expression

export interface ProgramState {
  scene: Scene
  objects: ObjectsEnv
  variables: VariableEnv
  functions: FunctionsEnv
}

export interface Expression {
  type: ExpressionT
  args?: Expression[]
  value?: Value
  children?: Expression[]
}

export type Value = string | number | boolean // More in future, such as Mesh, Vector3, etc...

export type ExpressionT =
  // Entry Point
  | 'main'

  // Value Expressions
  | 'literal' // Value (string, number, boolean ...)
  | 'var'
  | 'call'

  // Effect Expressions
  | 'setvar'
  | 'setfunc'

  // Statement Expressions
  | 'runseq'
  | 'runsync'

  | 'setposxyz'
  | 'translatexyz'
  | 'setscalexyz'
  | 'setroteulerxyz'
  | 'rotatexyz'

  | 'repeat'
  | 'if'
