import { Object3D, Object3DEventMap, Scene } from 'three'

export type ObjectsEnv = Map<string, Object3D<Object3DEventMap>>
export type VarEnv = Map<string, Value>
export type FuncEnv = Map<string, Expression>

export interface ProgramState {
  scene: Scene
  objects: ObjectsEnv
  variables: VarEnv
  functions: FuncEnv
  runState: React.RefObject<RunState>
}

export interface RunState {
  shouldRun: boolean
  shouldPause: boolean
  shouldStop: boolean
  shouldStep: boolean
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

  // Function Expression
  | 'func'

  // Value Expressions
  | 'literal' // Value (string, number, boolean ...)
  | 'var'
  | 'call'

  // Operator Expressions
  | 'andor'
  | 'neg'
  | 'compare'
  | 'arithmetic'
  | 'map'
  | 'trig'
  | 'htrig'
  | 'round'
  | 'single'
  | 'atan2'
  | 'modulo'
  | 'constrain'
  | 'randomfloat'
  | 'randomint'

  // Effect Expressions
  | 'setvar'
  | 'changevar'
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
  | 'wait'
