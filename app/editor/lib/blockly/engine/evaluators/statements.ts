import { Expression, ProgramState, Value } from '../ast'
import { evaluateExpression } from '../interpreter'

export async function interpSetposxyz(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args } = expression
  const { scene } = state

  if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
  const objectId = Number(await evaluateExpression(args[0], state))
  const x = Number(await evaluateExpression(args[1], state))
  const y = Number(await evaluateExpression(args[2], state))
  const z = Number(await evaluateExpression(args[3], state))

  const object = scene.getObjectById(objectId)
  if (!object) throw Error(`object with id "${objectId}" does not exist.`)
  object.position.set(x, y, z)
  return
}

export async function interpSetscalexyz(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args } = expression
  const { scene } = state

  if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
  const objectId = Number(await evaluateExpression(args[0], state))
  const x = Number(await evaluateExpression(args[1], state))
  const y = Number(await evaluateExpression(args[2], state))
  const z = Number(await evaluateExpression(args[3], state))

  const object = scene.getObjectById(objectId)
  if (!object) throw Error(`object with id "${objectId}" does not exist.`)
  object.scale.set(x, y, z)
  return
}

export async function interpSetroteulerxyz(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args } = expression
  const { scene } = state

  if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
  const objectId = Number(await evaluateExpression(args[0], state))
  const x = Number(await evaluateExpression(args[1], state))
  const y = Number(await evaluateExpression(args[2], state))
  const z = Number(await evaluateExpression(args[3], state))

  const object = scene.getObjectById(objectId)
  if (!object) throw Error(`object with id "${objectId}" does not exist.`)
  object.rotation.set(x, y, z)
  return
}

export async function interpRotatexyz(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args } = expression
  const { scene } = state

  if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
  const objectId = Number(await evaluateExpression(args[0], state))
  const axis = String(await evaluateExpression(args[1], state))
  const angle = Number(await evaluateExpression(args[2], state))

  const object = scene.getObjectById(objectId)
  if (!object) throw Error(`object with id "${objectId}" does not exist.`)

  const rad = (angle * Math.PI) / 180
  switch (axis) {
    case 'X':
      object.rotateX(rad)
      break
    case 'Y':
      object.rotateY(rad)
      break
    case 'Z':
      object.rotateZ(rad)
      break
  }
  return
}

export async function interpTranslatexyz(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args } = expression
  const { scene } = state

  if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
  const objectId = Number(await evaluateExpression(args[0], state))
  const axis = String(await evaluateExpression(args[1], state))
  let distance = Number(await evaluateExpression(args[2], state))

  if (args.length >= 4) {
    const direction = Number(await evaluateExpression(args[3], state))
    distance = distance * direction
  }

  const object = scene.getObjectById(objectId)
  if (!object) throw Error(`object with id "${objectId}" does not exist.`)

  switch (axis) {
    case 'X':
      object.translateX(distance)
      break
    case 'Y':
      object.translateY(distance)
      break
    case 'Z':
      object.translateZ(distance)
      break
  }
  return
}
