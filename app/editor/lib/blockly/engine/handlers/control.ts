import { Frame, ProgramState, Thread, Value } from '../ast'

function pushFrame(thread: Thread, expr: Frame['expr'], stage = 0) {
  thread.stack.push({ expr, stage })
}

function popValue(thread: Thread): Value {
  const value = thread.valueStack.pop()
  if (value === undefined) {
    throw new Error('Expected value on thread.valueStack')
  }
  return value
}

export function handleRunseq(
  frame: Frame,
  thread: Thread,
  _state: ProgramState
) {
  if (frame.stage !== 0) {
    throw new Error('runseq only supports stage 0')
  }

  const children = frame.expr.children ?? []
  for (let i = children.length - 1; i >= 0; i--) {
    pushFrame(thread, children[i])
  }
}

export function handleWait(frame: Frame, thread: Thread, _state: ProgramState) {
  const { expr, stage } = frame
  const args = expr.args ?? []

  if (args.length < 1) throw new Error('Invalid args for "wait"')

  if (stage === 0) {
    thread.stack.push({ expr, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const ms = Number(popValue(thread))
    thread.waitingUntil = Date.now() + ms
    return
  }

  throw new Error(`Invalid stage ${stage} for "wait"`)
}

export function handleRepeat(
  frame: Frame,
  thread: Thread,
  _state: ProgramState
) {
  const { expr, stage } = frame
  const args = expr.args ?? []
  const children = expr.children ?? []

  if (args.length < 1) throw new Error('Invalid args for "repeat"')

  if (stage === 0) {
    thread.stack.push({ expr, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const times = Math.max(0, Math.floor(Number(popValue(thread))))

    for (let i = 0; i < times; i++) {
      for (let j = children.length - 1; j >= 0; j--) {
        pushFrame(thread, children[j])
      }
    }
    return
  }

  throw new Error(`Invalid stage ${stage} for "repeat"`)
}

export function handleIf(frame: Frame, thread: Thread, _state: ProgramState) {
  const { expr, stage } = frame
  const args = expr.args ?? []
  const children = expr.children ?? []

  if (args.length < 1) throw new Error('Invalid args for "if"')

  if (stage === 0) {
    thread.stack.push({ expr, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const condition = Boolean(popValue(thread))

    if (condition) {
      if (children[0]) pushFrame(thread, children[0])
    } else {
      if (children[1]) pushFrame(thread, children[1])
    }
    return
  }

  throw new Error(`Invalid stage ${stage} for "if"`)
}
