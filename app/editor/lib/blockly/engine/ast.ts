import { Object3D } from 'three'

export type VarEnv = Map<string, Value> // all variables are global
export type FuncEnv = Map<string, Expression>
export type StackEnv = Map<string, Value>[] // only for function calls

export interface ProgramState {
  objects: Map<string, Object3D>
  variables: VarEnv
  functions: FuncEnv
  /** @todo Add functions stack */
  stack?: StackEnv
  runState: React.RefObject<RunState>
}

export interface RunState {
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
