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
  // Control Flow
  | 'main'
  | 'runseq'
  | 'if'
  | 'repeat'
  | 'wait'

  // Effects
  | 'setfunc'
  | 'setvar'
  | 'changevar'

  // Values
  | 'literal' // Value (string, number, boolean ...)
  | 'func'
  | 'var'
  | 'call'

  // Operators
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

  // Statements
  | 'setposxyz'
  | 'translatexyz'
  | 'setscalexyz'
  | 'setroteulerxyz'
  | 'rotatexyz'
