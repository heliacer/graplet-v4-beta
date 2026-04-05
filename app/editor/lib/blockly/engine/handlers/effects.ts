import { Frame, ProgramState, Thread } from '../ast'
import { popValue, pushFrame } from './utils'

export function handleSetvar(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('Variable name is undefined')
  if (args.length < 1) throw Error('No value provided for "setvar"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  const { variables } = state
  const varValue = popValue(thread)
  variables.set(String(value), varValue)
}

export function handleChangevar(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('Variable name is undefined')
  if (args.length < 1) throw Error('No delta provided for "changevar"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  const { variables } = state
  const delta = Number(popValue(thread))
  const currentValue = Number(variables.get(String(value))) || 0
  variables.set(String(value), currentValue + delta)
  return
}
