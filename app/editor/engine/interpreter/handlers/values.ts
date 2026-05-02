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

export function handleParam(frame: Frame, thread: Thread) {
  const { expression } = frame
  const expr = thread.locals[String(expression.value)]
  pushFrame(thread, expr || { type: 'literal', value: null })
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

  if (stage < args.length) {
    stack.push({ ...frame, stage: stage + 1 })
    pushFrame(thread, args[stage])
    return
  }

  if (stage === args.length) {
    stack.push({ ...frame, stage: stage + 1 })

    const { children = [] } = func
    for (let i = children.length - 1; i >= 0; i--) {
      pushFrame(thread, children[i])
    }
    return
  }

  if (stage === args.length + 1) {
    if (func.args === undefined) return
    console.log('locals to clear:', thread.locals)
    for (let i = 0; i < func.args.length; i++) {
      console.log('clearing', func.args[i])
    }
    return
  }

  throw Error(`Invalid stage for "call": ${stage}`)
}
