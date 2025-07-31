import { RefObject } from "react"
import { Action, IR } from "../types"
import { Mesh } from "three"

export async function interpret(ir: IR, boxRef: RefObject<Mesh>) {
  for (const script of ir.scripts) {
    if (script.trigger.type === 'onclickrun') {
      await executeActions(script.actions, boxRef)
    }
  }
}

export async function executeActions(actions: Action[], boxRef: RefObject<Mesh>) {
  for (const action of actions) {
    switch (action.type) {
      case 'wait': {
        const [ms] = action.fields as [number]
        await new Promise(res => setTimeout(res, ms))
        break
      }
      case 'repeat': {
        const [times] = action.fields as [number]
        for (let i = 0; i < times; i++) {
          console.log(`Repeat iteration ${i + 1}/${times}`)
          if (action.children) {
            await executeActions(action.children, boxRef)
          }
        }
        break
      }
      case 'setposxyz': {
        const [x, y, z] = action.fields as [number, number, number]
        boxRef.current.position.set(x, y, z)
        console.log(`Set position to: ${x}, ${y}, ${z}`)
        break
      }
      case 'setscalexyz': {
        const [x, y, z] = action.fields as [number, number, number]
        boxRef.current.scale.set(x, y, z)
        console.log(`Set scale to: ${x}, ${y}, ${z}`)
        break
      }
      case 'setroteulerxyz': {
        const [x, y, z] = action.fields as [number, number, number]
        boxRef.current.rotation.set(x, y, z)
        console.log(`Set rotation to euler: ${x}, ${y}, ${z}`)
        break
      }
      case 'rotatexyz': {
        const [axis, angle] = action.fields as [string, number]
        const rad = angle * Math.PI / 180
        switch (axis){
          case 'X':
            boxRef.current.rotateX(rad)
            break
          case 'Y':
            boxRef.current.rotateY(rad)
            break
          case 'Z':
            boxRef.current.rotateZ(rad)
            break
        }
        console.log(`Rotated cube around ${axis} by ${angle}° (${rad} radians)`)
        break
      }
      case 'translatexyz': {
        const [axis, distance] = action.fields as [string, number]
        switch (axis){
          case 'X':
            boxRef.current.translateX(distance)
            break
          case 'Y':
            boxRef.current.translateY(distance)
            break
          case 'Z':
            boxRef.current.translateZ(distance)
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
