import { Frame, Thread } from '../ast'
import { popValue, pushFrame, pushValue } from './utils'

export function handleAndor(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No value was given to "andor"')
  if (args.length !== 2) throw Error('Invalid args for "andor"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const a = Boolean(popValue(thread))
    if (a && value === 'OR') {
      pushValue(thread, true)
      return
    }
    if (!a && value === 'AND') {
      pushValue(thread, false)
      return
    }
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const b = Boolean(popValue(thread))
    pushValue(thread, b)
    return
  }

  throw Error(`Invalid stage for "andor": ${stage}`)
}

export function handleNeg(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 1) throw Error('Invalid args for "neg"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const bool = Boolean(popValue(thread))
    pushValue(thread, !bool)
    return
  }

  throw Error(`Invalid stage for "neg": ${stage}`)
}

export function handleCompare(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No operator was given to "compare"')
  if (args.length !== 2) throw Error('Invalid args for "compare"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const b = popValue(thread)
    const a = popValue(thread)

    switch (value) {
      case 'EQ':
        pushValue(thread, a == b)
        return
      case 'NEQ':
        pushValue(thread, a != b)
        return
      case 'LT':
        pushValue(thread, Number(a) < Number(b))
        return
      case 'LTE':
        pushValue(thread, Number(a) <= Number(b))
        return
      case 'GT':
        pushValue(thread, Number(a) > Number(b))
        return
      case 'GTE':
        pushValue(thread, Number(a) >= Number(b))
        return
      default:
        throw Error(`Unknown compare operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "compare": ${stage}`)
}

export function handleArithmetic(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No value was given to "arithmetic"')
  if (args.length !== 2) throw Error('Invalid args for "arithmetic"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const b = Number(popValue(thread))
    const a = Number(popValue(thread))

    switch (value) {
      case 'ADD':
        pushValue(thread, a + b)
        return
      case 'MINUS':
        pushValue(thread, a - b)
        return
      case 'MULTIPLY':
        pushValue(thread, a * b)
        return
      case 'DIVIDE':
        pushValue(thread, a / b)
        return
      case 'POWER':
        pushValue(thread, a ** b)
        return
      default:
        throw Error(`Unknown arithmetic operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "arithmetic": ${stage}`)
}

export function handleMap(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 5) throw Error('Invalid args for "map"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    stack.push({ ...frame, stage: 3 })
    pushFrame(thread, args[2])
    return
  }

  if (stage === 3) {
    stack.push({ ...frame, stage: 4 })
    pushFrame(thread, args[3])
    return
  }

  if (stage === 4) {
    stack.push({ ...frame, stage: 5 })
    pushFrame(thread, args[4])
    return
  }

  if (stage === 5) {
    const toMax = Number(popValue(thread))
    const toMin = Number(popValue(thread))
    const fromMax = Number(popValue(thread))
    const fromMin = Number(popValue(thread))
    const x = Number(popValue(thread))

    pushValue(
      thread,
      ((x - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
    )
    return
  }

  throw Error(`Invalid stage for "map": ${stage}`)
}

export function handleTrig(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No operator was given to "trig"')
  if (args.length !== 1) throw Error('Invalid args for "trig"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const x = Number(popValue(thread))

    switch (value) {
      case 'SIN':
        pushValue(thread, Math.sin(x))
        return
      case 'COS':
        pushValue(thread, Math.cos(x))
        return
      case 'TAN':
        pushValue(thread, Math.tan(x))
        return
      case 'ASIN':
        pushValue(thread, Math.asin(x))
        return
      case 'ACOS':
        pushValue(thread, Math.acos(x))
        return
      case 'ATAN':
        pushValue(thread, Math.atan(x))
        return
      default:
        throw Error(`Unknown trig operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "trig": ${stage}`)
}

export function handleHtrig(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No operator was given to "htrig"')
  if (args.length !== 1) throw Error('Invalid args for "htrig"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const x = Number(popValue(thread))

    switch (value) {
      case 'SINH':
        pushValue(thread, Math.sinh(x))
        return
      case 'COSH':
        pushValue(thread, Math.cosh(x))
        return
      case 'TANH':
        pushValue(thread, Math.tanh(x))
        return
      case 'ASINH':
        pushValue(thread, Math.asinh(x))
        return
      case 'ACOSH':
        pushValue(thread, Math.acosh(x))
        return
      case 'ATANH':
        pushValue(thread, Math.atanh(x))
        return
      default:
        throw Error(`Unknown htrig operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "htrig": ${stage}`)
}

export function handleRound(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No operator was given to "round"')
  if (args.length !== 1) throw Error('Invalid args for "round"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const x = Number(popValue(thread))

    switch (value) {
      case 'ROUND':
        pushValue(thread, Math.round(x))
        return
      case 'ROUNDUP':
        pushValue(thread, Math.ceil(x))
        return
      case 'ROUNDDOWN':
        pushValue(thread, Math.floor(x))
        return
      default:
        throw Error(`Unknown round operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "round": ${stage}`)
}

export function handleSingle(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { value, args = [] } = expression

  if (value === undefined) throw Error('No operator was given to "single"')
  if (args.length !== 1) throw Error('Invalid args for "single"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    const x = Number(popValue(thread))

    switch (value) {
      case 'ROOT':
        pushValue(thread, Math.sqrt(x))
        return
      case 'ABS':
        pushValue(thread, Math.abs(x))
        return
      case 'NEG':
        pushValue(thread, -x)
        return
      case 'LN':
        pushValue(thread, Math.log(x))
        return
      case 'LOG10':
        pushValue(thread, Math.log10(x))
        return
      case 'EXP':
        pushValue(thread, Math.E ** x)
        return
      case 'POW10':
        pushValue(thread, 10 ** x)
        return
      default:
        throw Error(`Unknown single operator: ${value}`)
    }
  }

  throw Error(`Invalid stage for "single": ${stage}`)
}

export function handleAtan2(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 2) throw Error('Invalid args for "atan2"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const y = Number(popValue(thread))
    const x = Number(popValue(thread))
    pushValue(thread, Math.atan2(y, x))
    return
  }

  throw Error(`Invalid stage for "atan2": ${stage}`)
}

export function handleModulo(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 2) throw Error('Invalid args for "modulo"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const divisor = Number(popValue(thread))
    const dividend = Number(popValue(thread))
    pushValue(thread, dividend % divisor)
    return
  }

  throw Error(`Invalid stage for "modulo": ${stage}`)
}

export function handleConstrain(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 3) throw Error('Invalid args for "constrain"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    stack.push({ ...frame, stage: 3 })
    pushFrame(thread, args[2])
    return
  }

  if (stage === 3) {
    const high = Number(popValue(thread))
    const low = Number(popValue(thread))
    const val = Number(popValue(thread))
    pushValue(thread, Math.min(Math.max(val, low), high))
    return
  }

  throw Error(`Invalid stage for "constrain": ${stage}`)
}

export function handleRandomfloat(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 0) throw Error('Invalid args for "randomfloat"')

  if (stage === 0) {
    pushValue(thread, Math.random())
    return
  }

  throw Error(`Invalid stage for "randomfloat": ${stage}`)
}

export function handleRandomint(frame: Frame, thread: Thread) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 2) throw Error('Invalid args for "randomint"')

  const { stack } = thread
  if (stage === 0) {
    stack.push({ ...frame, stage: 1 })
    pushFrame(thread, args[0])
    return
  }

  if (stage === 1) {
    stack.push({ ...frame, stage: 2 })
    pushFrame(thread, args[1])
    return
  }

  if (stage === 2) {
    const to = Number(popValue(thread))
    const from = Number(popValue(thread))
    const min = Math.min(from, to)
    const max = Math.max(from, to)
    pushValue(thread, Math.floor(Math.random() * (max - min + 1)) + min)
    return
  }

  throw Error(`Invalid stage for "randomint": ${stage}`)
}
