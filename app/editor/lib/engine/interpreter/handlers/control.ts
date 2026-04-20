import { Frame, Thread } from '../../ast'
import { popValue, pushFrame } from './utils'

export function handleRunseq(frame: Frame, thread: Thread) {
  const { expression, stage } = frame

  if (stage !== 0) throw Error('runseq only supports stage 0')

  const { children = [] } = expression
  for (let i = children.length - 1; i >= 0; i--) {
    pushFrame(thread, children[i])
  }
}

export function handleWait(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length < 1) throw Error('Invalid args for "wait"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ expression, stage: 1 })
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

export function handleRepeat(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length < 1) throw Error('Invalid args for "repeat"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ expression, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  const { children = [] } = expression
  if (stage === 1) {
    const times = Math.max(0, Math.floor(Number(popValue(thread))))

    for (let i = 0; i < times; i++) {
      for (let j = children.length - 1; j >= 0; j--) {
        pushFrame(thread, children[j])
      }
    }
    return
  }

  throw Error(`Invalid stage ${stage} for "repeat"`)
}

export function handleIf(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length < 1) throw Error('Invalid args for "if"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ expression, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  const { children = [] } = expression
  if (stage === 1) {
    const condition = Boolean(popValue(thread))

    if (condition) {
      if (children[0]) pushFrame(thread, children[0])
    } else {
      if (children[1]) pushFrame(thread, children[1])
    }
    return
  }

  throw Error(`Invalid stage ${stage} for "if"`)
}
