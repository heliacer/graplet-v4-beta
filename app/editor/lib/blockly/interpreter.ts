import { Action, Context, IR, Value } from "../types"

export async function interpret(ir: IR, context: Context) {
  for (const script of ir.scripts) {
    if (script.trigger.type === 'onclickrun') {
      await executeActions(script.actions, context)
    }
  }
}

export async function executeActions(actions: Action[], context: Context) {
  for (const action of actions) {
    console.log(context.variables)
    const fields = action.fields || []
    action.values?.forEach((value, i) => {
      const resolver = action.resolvers?.[i]
      const raw = value.id
        ? context.variables.get(value.id)
        : value.content
      if (raw === undefined) throw Error(`Fields or Values are missing on Action ${action.type}`)
      const resolved = resolver ? resolver(raw) : raw
      fields.push(resolved)
    })

    const { box } = context

    switch (action.type) {
      case 'setvar': {
        const [varId, value] = fields as [string, Value]
        console.log(varId, value)
        context.variables.set(varId, value)
        break
      }
      case 'changevar': {
        const [varId, delta] = fields as [string, number]
        console.log(varId, delta)
        context.variables.change(varId, delta)
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
          if (action.children) {
            await executeActions(action.children, context)
          }
        }
        break
      }
      case 'setposxyz': {
        const [x, y, z] = fields as [number, number, number]
        box.current.position.set(x, y, z)
        console.log(`Set position to: ${x}, ${y}, ${z}`)
        break
      }
      case 'setscalexyz': {
        const [x, y, z] = fields as [number, number, number]
        box.current.scale.set(x, y, z)
        console.log(`Set scale to: ${x}, ${y}, ${z}`)
        break
      }
      case 'setroteulerxyz': {
        const [x, y, z] = fields as [number, number, number]
        box.current.rotation.set(x, y, z)
        console.log(`Set rotation to euler: ${x}, ${y}, ${z}`)
        break
      }
      case 'rotatexyz': {
        const [axis, angle] = fields as [string, number]
        const rad = angle * Math.PI / 180
        switch (axis) {
          case 'X':
            box.current.rotateX(rad)
            break
          case 'Y':
            box.current.rotateY(rad)
            break
          case 'Z':
            box.current.rotateZ(rad)
            break
        }
        console.log(`Rotated cube around ${axis} by ${angle}° (${rad} radians)`)
        break
      }
      case 'translatexyz': {
        const [axis, direction, distance] = fields as [string, number, number]
        switch (axis) {
          case 'X':
            box.current.translateX(distance * direction)
            break
          case 'Y':
            box.current.translateY(distance * direction)
            break
          case 'Z':
            box.current.translateZ(distance * direction)
            break
        }
        console.log(`Translated cube around ${axis} by ${distance} units`)
        break
      }
      default:
        console.warn(`Unknown action type: ${action.type}`)
    }
  }
}
