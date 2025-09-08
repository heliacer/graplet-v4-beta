import { Action, Context, IR, Value, ValueWrapper } from "../types"

export async function interpret(ir: IR, context: Context) {
  // TODO filter functions, register them - review trigger stuff.
  const functions = ir.scripts
    .filter(script => script.trigger.type === 'procedures_defreturn' || 'procedures_defnoreturn')
    .map(script => console.log(script))

  const promises = ir.scripts
    .filter(script => script.trigger.type === 'onclickrun')
    .map(script => executeActions(script.actions, context))
  await Promise.all(promises)
}

export async function executeActions(actions: Action[], context: Context) {
  for (const action of actions) {
    const fields = [...(action.fields) || []]

    action.values?.forEach((value, i) => {
      const resolver = action.resolvers?.[i]
      const raw = resolveValueWrapper(value, context)
      if (raw === undefined) throw Error(`Fields or Values are missing on Action ${action.type}`)
      const resolved = resolver ? resolver(raw) : raw
      fields.push(resolved)
    })

    const { objects, variables, functions } = context

    switch (action.type) {
      case 'setvar': {
        const [varId, value] = fields as [string, Value]
        console.log(`set variable ${varId} to ${value}`)
        const numValue = Number(value)
        variables.set(varId, Number.isNaN(numValue) ? value : numValue)
        break
      }
      case 'changevar': {
        const [varId, delta] = fields as [string, number]
        console.log(`changed variable ${varId} by ${delta}`)
        const value = variables.get(varId)
        variables.set(varId, (typeof value === 'number' ? value : 0) + delta)
        break
      }
      case 'wait': {
        const [ms] = fields as [number]
        await new Promise(res => setTimeout(res, ms))
        break
      }
      case 'repeat': {
        const [times] = fields as [number]
        for (let i = 0; i < times; i++) {
          console.log(`Repeat iteration ${i + 1}/${times}`)
          if (action.actionsList && action.actionsList[0]) {
            await executeActions(action.actionsList[0], context)
          }
        }
        break
      }
      case 'if': {
        const [condition, ...restConditions] = fields as [boolean, ...boolean[]]
        const [ifActions, ...restActions] = action.actionsList || []

        if (condition && ifActions) {
          await executeActions(ifActions, context)
        } else {
          for (let i = 0; i < restConditions.length; i++) {
            if (restConditions[i] && restActions[i]) {
              await executeActions(restActions[i], context)
              return
            }
          }
          const elseActions = restActions[restConditions.length]
          if (elseActions) {
            await executeActions(elseActions, context)
          }
        }
        break
      }
      case 'setposxyz': {
        const [objectId, x, y, z] = fields as [string, number, number, number]
        const object = objects.get(objectId)
        if (object) {
          object.position.set(x, y, z)
          console.log(`Set position to: ${x}, ${y}, ${z}`)
        } else {
          console.log(`${objectId} does not exist.`)
        }
        break
      }
      case 'setscalexyz': {
        const [objectId, x, y, z] = fields as [string, number, number, number]
        const object = objects.get(objectId)
        if (object) {
          object.scale.set(x, y, z)
          console.log(`Set scale to: ${x}, ${y}, ${z}`)
        } else {
          console.log(`${objectId} does not exist.`)
        }
        break
      }
      case 'setroteulerxyz': {
        const [objectId, x, y, z] = fields as [string, number, number, number]
        const object = objects.get(objectId)
        if (object) {
          object.rotation.set(x, y, z)
          console.log(`Set rotation to euler: ${x}, ${y}, ${z}`)
        } else {
          console.log(`${objectId} does not exist.`)
        }
        break
      }
      case 'rotatexyz': {
        const [objectId, axis, angle] = fields as [string, string, number]
        const object = objects.get(objectId)
        if (object) {
          const rad = angle * Math.PI / 180
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
          console.log(`Rotated cube around ${axis} by ${angle}° (${rad} radians)`)
        } else {
          console.log(`${objectId} does not exist.`)
        }
        break
      }
      case 'translatexyz': {
        const [objectId, axis, direction, distance] = fields as [string, string, number, number]
        const object = objects.get(objectId)
        if (object) {
          switch (axis) {
            case 'X':
              object.translateX(distance * direction)
              break
            case 'Y':
              object.translateY(distance * direction)
              break
            case 'Z':
              object.translateZ(distance * direction)
              break
          }
          console.log(`Translated ${object.name} around ${axis} by ${distance * direction} units`)
        } else {
          console.log(`${objectId} does not exist.`)
        }
        break
      }
      default:
        console.warn(`Unknown action type: ${action.type}`)
    }
  }
}

function resolveValueWrapper(wrapper: ValueWrapper, context: Context): Value {
  const { nestedValues, compute, content, id} = wrapper
  const { variables } = context

  // variable reference
  if (id !== undefined) return variables.get(id) || 0

  // resolve nested values
  if (nestedValues && nestedValues.length > 0 && compute) {
    const resolvedValues = nestedValues.map(nestedValue =>
      resolveValueWrapper(nestedValue, context)
    )
    return compute(...resolvedValues)
  }

  if (content === undefined) throw new Error('Invalid ValueWrapper: No id, content, or compute function found')
  return content
}
