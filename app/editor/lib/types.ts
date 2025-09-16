import { Object3D, Object3DEventMap, Scene } from 'three'

export type ObjectsEnv = Map<string, Object3D<Object3DEventMap>>
export type VariableEnv = Map<string, Value>
export type FunctionsEnv = Map<string, Expression> // Func -> Expression

export interface ProgramState {
  scene: Scene
  objects: ObjectsEnv
  variables: VariableEnv
  functions: FunctionsEnv
  runState: React.RefObject<RunState>
}

export interface RunState {
  shouldRun: boolean
  shouldPause: boolean
  shouldStop: boolean
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

export class Program {
  private shouldStop = false
  private shouldPause = false

  stop() {}

  pause() {}

  resume() {}

  async execute() {}
}
