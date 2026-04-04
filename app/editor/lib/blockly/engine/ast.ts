import { Object3D } from 'three'

export type VarEnv = Map<string, Value> // all variables are global for some reason (blockly)
/** @todo make a local var lookup table later which is checked first */
export type FuncEnv = Map<string, Expression>

export interface ProgramState {
  objects: Map<string, Object3D>
  variables: VarEnv
  functions: FuncEnv
}

export type Thread = {
  stack: Frame[]
  valueStack: Value[]
  waitingUntil?: number
  done: boolean
}

export type Frame = {
  expr: Expression
  stage: number
}

export type Handler = (
  frame: Frame,
  thread: Thread,
  state: ProgramState
) => void

export type Value = string | number | boolean // More in future, such as Mesh, Vector3, etc...

export interface Expression {
  type: ExpressionT
  args?: Expression[]
  value?: Value
  children?: Expression[]
}

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
