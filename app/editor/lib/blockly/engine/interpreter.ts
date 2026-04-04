import { Expression, ExpressionT, Handler, ProgramState, Thread } from './ast'
import { handleRunseq } from './handlers/control'

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
        stack: [{ expr, stage: 0 }],
        valueStack: [],
        done: false
      })
    }
  }

  return threads
}

export function step(thread: Thread, state: ProgramState) {
  if (thread.done) return

  if (thread.waitingUntil && Date.now() < thread.waitingUntil) return

  const frame = thread.stack.pop()
  if (!frame) {
    thread.done = true
    return
  }

  handlers[frame.expr.type](frame, thread, state)
}

/** @todo revamp all old interps to the new handler system */
const handlers: Record<ExpressionT, Handler> = {
  runseq: handleRunseq,
  if: () => {},
  repeat: () => {},
  wait: () => {},
  setvar: () => {},
  changevar: () => {},
  literal: () => {},
  var: () => {},
  call: () => {},
  andor: () => {},
  neg: () => {},
  compare: () => {},
  arithmetic: () => {},
  map: () => {},
  trig: () => {},
  htrig: () => {},
  round: () => {},
  single: () => {},
  atan2: () => {},
  modulo: () => {},
  constrain: () => {},
  randomfloat: () => {},
  randomint: () => {},
  setposxyz: () => {},
  translatexyz: () => {},
  setscalexyz: () => {},
  setroteulerxyz: () => {},
  rotatexyz: () => {}
}
