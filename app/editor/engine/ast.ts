import { Object3D } from 'three'

export type VarEnv = Map<string, Value> // all variables are global for some reason (blockly)
/**
 * @todo (#14) Graplet Procedures
 * make a local var lookup table
 */
export type FuncEnv = Map<string, Expression>

export interface ProgramState {
  objects: Map<string, Object3D>
  variables: VarEnv
  functions: FuncEnv
}

export type Thread = {
  stack: Frame[]
  valueStack: Value[]
  locals: Record<string, Expression>,
  waitingUntil?: number
  done: boolean
}

export type Frame = {
  expression: Expression
  stage: number
}

export type Handler = (
  frame: Frame,
  thread: Thread,
  state: ProgramState
) => void

export type Value = string | number | boolean | null // More in future, such as Mesh, Vector3, etc...

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
  | 'setparam'

  // Values
  | 'literal' // Value (string, number, boolean ...)
  | 'func'
  | 'var'
  | 'call'
  | 'param'
  | 'objectvec3prop'

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
