import { Expression, ExpressionT, Handler, ProgramState, Thread } from '../ast'
import {
  handleIf,
  handleRepeat,
  handleRunseq,
  handleWait
} from './handlers/control'
import {
  handleChangevar,
  handleSetParam,
  handleSetvar
} from './handlers/effects'
import {
  handleAndor,
  handleArithmetic,
  handleAtan2,
  handleCompare,
  handleConstrain,
  handleHtrig,
  handleMap,
  handleModulo,
  handleNeg,
  handleRandomfloat,
  handleRandomint,
  handleRound,
  handleSingle,
  handleTrig
} from './handlers/operators'
import {
  handleRotatexyz,
  handleSetposxyz,
  handleSetroteulerxyz,
  handleSetscalexyz,
  handleTranslatexyz
} from './handlers/statements'
import {
  handleCall,
  handleLiteral,
  handleObjectvec3prop,
  handleParam,
  handleVar
} from './handlers/values'
import {
  handleNotification
} from './handlers/other'

function setFunction(expression: Expression, state: ProgramState) {
  const { args, value, children } = expression
  const { functions } = state

  if (value === undefined) throw Error('Function name is undefined')
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
        stack: [{ expression: expr, stage: 0 }],
        valueStack: [],
        locals: {},
        done: false
      })
    }
  }

  return threads
}

export function threadStep(thread: Thread, state: ProgramState) {
  if (thread.done) return

  if (thread.waitingUntil && Date.now() < thread.waitingUntil) return

  const frame = thread.stack.pop()
  if (!frame) {
    thread.done = true
    return
  }

  const type = frame.expression.type
  if (!(type in handlers)) throw Error(`Non-runtime expression: ${type}`)
  handlers[type as RegularExpressionT](frame, thread, state)
}

type RegularExpressionT = Exclude<ExpressionT, 'main' | 'setfunc' | 'func'>

const handlers: Record<RegularExpressionT, Handler> = {
  runseq: handleRunseq,
  if: handleIf,
  repeat: handleRepeat,
  wait: handleWait,
  setvar: handleSetvar,
  changevar: handleChangevar,
  objectvec3prop: handleObjectvec3prop,
  literal: handleLiteral,
  var: handleVar,
  param: handleParam,
  call: handleCall,
  setparam: handleSetParam,
  andor: handleAndor,
  neg: handleNeg,
  compare: handleCompare,
  arithmetic: handleArithmetic,
  map: handleMap,
  trig: handleTrig,
  htrig: handleHtrig,
  round: handleRound,
  single: handleSingle,
  atan2: handleAtan2,
  modulo: handleModulo,
  constrain: handleConstrain,
  randomfloat: handleRandomfloat,
  randomint: handleRandomint,
  setposxyz: handleSetposxyz,
  translatexyz: handleTranslatexyz,
  setscalexyz: handleSetscalexyz,
  setroteulerxyz: handleSetroteulerxyz,
  rotatexyz: handleRotatexyz,
  send_notification: handleNotification
}
