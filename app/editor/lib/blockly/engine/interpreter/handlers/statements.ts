import { Frame, ProgramState, Thread } from '../../ast'
import { popValue, pushFrame } from './utils'

export function handleSetposxyz(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 4) throw Error('Invalid args for "setposxyz"')

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
    const z = Number(popValue(thread))
    const y = Number(popValue(thread))
    const x = Number(popValue(thread))
    const objectId = String(popValue(thread))

    const object = state.objects.get(objectId)
    if (!object) throw Error(`object with id "${objectId}" does not exist.`)

    object.position.set(x, y, z)
    return
  }

  throw Error(`Invalid stage for "setposxyz": ${stage}`)
}

export function handleSetscalexyz(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 4) throw Error('Invalid args for "setscalexyz"')

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
    const z = Number(popValue(thread))
    const y = Number(popValue(thread))
    const x = Number(popValue(thread))
    const objectId = String(popValue(thread))

    const object = state.objects.get(objectId)
    if (!object) throw Error(`object with id "${objectId}" does not exist.`)

    object.scale.set(x, y, z)
    return
  }

  throw Error(`Invalid stage for "setscalexyz": ${stage}`)
}

export function handleSetroteulerxyz(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 4) throw Error('Invalid args for "setroteulerxyz"')

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
    const z = Number(popValue(thread))
    const y = Number(popValue(thread))
    const x = Number(popValue(thread))
    const objectId = String(popValue(thread))

    const object = state.objects.get(objectId)
    if (!object) throw Error(`object with id "${objectId}" does not exist.`)

    object.rotation.set(x, y, z)
    return
  }

  throw Error(`Invalid stage for "setroteulerxyz": ${stage}`)
}

export function handleRotatexyz(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 3) throw Error('Invalid args for "rotatexyz"')

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
    const angle = Number(popValue(thread))
    const axis = String(popValue(thread))
    const objectId = String(popValue(thread))

    const object = state.objects.get(objectId)
    if (!object) throw Error(`object with id "${objectId}" does not exist.`)

    const rad = (angle * Math.PI) / 180

    switch (axis) {
      case 'X':
        object.rotateX(rad)
        return
      case 'Y':
        object.rotateY(rad)
        return
      case 'Z':
        object.rotateZ(rad)
        return
      default:
        throw Error(`Invalid axis "${axis}"`)
    }
  }

  throw Error(`Invalid stage for "rotatexyz": ${stage}`)
}

export function handleTranslatexyz(
  frame: Frame,
  thread: Thread,
  state: ProgramState
) {
  const { expression, stage } = frame
  const { args = [] } = expression

  if (args.length !== 3 && args.length !== 4)
    throw Error('Invalid args for "translatexyz"')

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
    if (args.length === 4) {
      stack.push({ ...frame, stage: 4 })
      pushFrame(thread, args[3])
      return
    }

    stack.push({ ...frame, stage: 4 })
    return
  }

  if (stage === 4) {
    let distance: number

    if (args.length === 4) {
      const direction = Number(popValue(thread))
      distance = Number(popValue(thread)) * direction
    } else {
      distance = Number(popValue(thread))
    }

    const axis = String(popValue(thread))
    const objectId = String(popValue(thread))

    const object = state.objects.get(objectId)
    if (!object) throw Error(`object with id "${objectId}" does not exist.`)

    switch (axis) {
      case 'X':
        object.translateX(distance)
        return
      case 'Y':
        object.translateY(distance)
        return
      case 'Z':
        object.translateZ(distance)
        return
      default:
        throw Error(`Invalid axis "${axis}"`)
    }
  }

  throw Error(`Invalid stage for "translatexyz": ${stage}`)
}
