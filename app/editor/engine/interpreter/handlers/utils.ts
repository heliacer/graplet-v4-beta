import { Expression, Thread, Value } from '../../ast'

export function pushFrame(thread: Thread, expr: Expression, stage = 0) {
  thread.stack.push({ expression: expr, stage })
}

export function popValue(thread: Thread): Value {
  const value = thread.valueStack.pop()
  if (value === undefined) throw new Error('Value stack underflow')
  return value
}

export function pushValue(thread: Thread, v: Value) {
  thread.valueStack.push(v)
}