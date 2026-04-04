import { Expression, ExpressionT, Handler, ProgramState, Thread } from './ast'

function setFunction(expression: Expression, state: ProgramState) {
  const { args, value, children } = expression
  const { functions } = state

  if (!value) throw Error('Function name is undefined')
  const funcExpr: Expression = {
    type: 'func',
    children,
    args
  }
  functions.set(String(value), funcExpr)
}

export function initProgram(
  expression: Expression,
  state: ProgramState
): Thread[] {
  const threads: Thread[] = []
  const { children } = expression

  if (!children) return []
  for (const expr of children) {
    if (expr.type === 'setfunc') setFunction(expr, state)
    if (expr.type === 'runseq') {
      threads.push({
        stack: [expr],
        done: false
      })
    }
  }

  return threads
}

export function stepThread(thread: Thread, state: ProgramState) {
  if (thread.done) return

  if (thread.waitingUntil && Date.now() < thread.waitingUntil) return

  const expr = thread.stack.pop()
  if (!expr) {
    thread.done = true
    return
  }

  const handler = handlers[expr.type as RuntimeExpressionT]
  if (!handler) throw new Error(`Unknown type ${expr.type}`)

  handler(thread, state, expr)
}

type RuntimeExpressionT = Exclude<ExpressionT, 'main' | 'setfunc'>

const handlers: Record<RuntimeExpressionT, Handler> = {
  func: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  runseq: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  if: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  repeat: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  wait: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  setvar: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  changevar: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  literal: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  var: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  call: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  andor: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  neg: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  compare: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  arithmetic: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  map: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  trig: function (thread: Thread, state: ProgramState, expr: Expression): void {
    throw new Error('Function not implemented.')
  },
  htrig: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  round: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  single: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  atan2: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  modulo: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  constrain: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  randomfloat: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  randomint: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  setposxyz: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  translatexyz: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  setscalexyz: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  setroteulerxyz: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  },
  rotatexyz: function (
    thread: Thread,
    state: ProgramState,
    expr: Expression
  ): void {
    throw new Error('Function not implemented.')
  }
}
