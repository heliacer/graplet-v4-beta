import { Frame, ProgramState, Thread } from '../../ast'
import { pushFrame, pushValue } from './utils'

export function handleLiteral(frame: Frame, thread: Thread) {
  const value = frame.expression.value
  if (value === undefined) throw Error('Literal value is undefined')
  pushValue(thread, value)
}

export function handleVar(frame: Frame, thread: Thread, state: ProgramState) {
  const name = String(frame.expression.value)
  const value = state.variables.get(name)
  if (value === undefined) throw new Error(`Variable ${name} not found`)
  pushValue(thread, value)
}

export function handleCall(frame: Frame, thread: Thread, state: ProgramState) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('Function name is undefined')

  const func = state.functions.get(String(value))
  if (func === undefined)
    throw Error(
      `Function "${value}" not found. Maybe you forgot to register it?`
    )

  const { stack } = thread

  /** setting parameters here (now stores them with the setvar globally, need to use a local VarEnv or something */
  if (stage < args.length) {
    stack.push({ ...frame, stage: stage + 1 })
    pushFrame(thread, args[stage])
    return
  }

  if (stage === args.length) {
    const nextStage = stage + 1
    stack.push({ ...frame, stage: nextStage })

    const { children = [] } = func
    for (let i = children.length - 1; i >= 0; i--) {
      pushFrame(thread, children[i])
    }
    return
  }

  if (stage === args.length + 1) {
    if (func.args && func.args.length > 0) {
      stack.push({ ...frame, stage: stage + 1 })
      pushFrame(thread, func.args[0])
      return
    }
    return
  }

  if (stage === args.length + 2) return

  throw Error(`Invalid stage for "call": ${stage}`)
}
