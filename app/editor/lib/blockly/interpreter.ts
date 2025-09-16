import { ProgramState, Value, Expression } from '../types'

export async function evaluateExpression(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args, value, children } = expression
  const { objects, variables, functions, runState } = state

  // Runstate control
  if (runState.current.shouldStop) return
  while (runState.current.shouldPause) {
    if (runState.current.shouldStop) return
    if (runState.current.shouldStep) {
      runState.current.shouldStep = false
      break
    }
    await new Promise((res) => setTimeout(res, 50))
  }

  switch (type) {
    case 'main': {
      if (!children) return
      const runExprs: Expression[] = []
      for (const expr of children) {
        switch (expr.type) {
          case 'runseq':
            runExprs.push(expr)
            break
          case 'setfunc':
            await evaluateExpression(expr, state)
            break
        }
      }
      const promises = runExprs.map((expr) => evaluateExpression(expr, state))
      await Promise.all(promises)
      return
    }

    case 'runseq': {
      if (!children) return
      for (const expr of children) {
        await evaluateExpression(expr, state)
      }
      return
    }

    case 'literal': {
      if (value === undefined) throw Error('Literal value is undefined')
      return Number.isNaN(Number(value)) ? value : Number(value)
    }

    case 'var': {
      if (!value) throw Error('Variable name is undefined')
      const variable = variables.get(String(value))
      if (variable === undefined) throw Error(`Variable "${value}" not found`)
      return variable
    }

    case 'setvar': {
      if (!value) throw Error('Variable name is undefined')
      if (!args || args.length === 0)
        throw Error('No value provided for setvar')
      const varValue = await evaluateExpression(args[0], state)
      variables.set(String(value), varValue as Value)
      console.log(`Set variable "${value}" to ${varValue}`)
      return
    }

    case 'changevar': {
      if (!value) throw Error('Variable name is undefined')
      if (!args || args.length === 0)
        throw Error('No delta provided for changevar')
      const delta = Number(await evaluateExpression(args[0], state))
      const currentValue = Number(variables.get(String(value))) || 0
      variables.set(String(value), currentValue + delta)
      console.log(`Changed variable "${value}" by ${delta}`)
      return
    }

    case 'setfunc': {
      if (!value) throw Error('Function name is undefined')
      const funcExpr: Expression = {
        type: 'func',
        children,
        args
      }
      functions.set(String(value), funcExpr)
      console.log(`Registered function "${value}"`)
      return
    }

    case 'call': {
      if (!value) throw Error('Function name is undefined')
      const func = functions.get(String(value))
      if (func === undefined)
        throw Error(
          `Function "${value}" not found. Maybe you forgot to register it?`
        )
      if (args) {
        for (const expr of args) {
          if (expr.type !== 'setvar')
            throw Error(
              `Expected Expression of type setvar but got "${expr.type}" instead`
            )
          await evaluateExpression(expr, state)
        }
      }
      if (func.children) {
        for (const expr of func.children) {
          const res = await evaluateExpression(expr, state)
          if (res !== undefined) return res
        }
      }
      if (func.args) {
        return await evaluateExpression(func.args[0], state)
      }
      return
    }

    case 'andor': {
      if (!args) throw Error(`No args were given to "${type}"`)
      if (!value) throw Error(`No value was given to "${type}"`)

      const [aExpr, bExpr] = args
      const a = Boolean(await evaluateExpression(aExpr, state))
      const b = Boolean(await evaluateExpression(bExpr, state))

      switch (value) {
        case 'AND':
          return a && b
        case 'OR':
          return a || b
        default:
          throw Error(`Unknown andor operator: "${value}"`)
      }
    }

    case 'neg': {
      if (!args) throw Error(`No args were given to "${type}"`)
      const [boolExpr] = args
      const bool = Boolean(await evaluateExpression(boolExpr, state))
      return !bool
    }

    case 'compare': {
      if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
      if (!value) throw Error(`No operator provided for "${type}"`)

      const [aExpr, bExpr] = args
      const a = await evaluateExpression(aExpr, state)
      const b = await evaluateExpression(bExpr, state)

      switch (value) {
        case 'EQ':
          return a == b
        case 'NEQ':
          return a != b
        case 'LT':
          return Number(a) < Number(b)
        case 'LTE':
          return Number(a) <= Number(b)
        case 'GT':
          return Number(a) > Number(b)
        case 'GTE':
          return Number(a) >= Number(b)
        default:
          throw Error(`Unknown compare operator: "${value}"`)
      }
    }

    case 'arithmetic': {
      if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
      if (!value) throw Error(`No operator provided for "${type}"`)

      const [aExpr, bExpr] = args
      const a = Number(await evaluateExpression(aExpr, state))
      const b = Number(await evaluateExpression(bExpr, state))

      switch (value) {
        case 'ADD':
          return a + b
        case 'MINUS':
          return a - b
        case 'MULTIPLY':
          return a * b
        case 'DIVIDE':
          return a / b
        case 'POWER':
          return a ** b
        default:
          throw Error(`Unknown arithmetic operator: "${value}"`)
      }
    }

    case 'map': {
      if (!args || args.length < 5) throw Error(`Invalid args for "${type}"`)
      const [xExpr, fromMinExpr, fromMaxExpr, toMinExpr, toMaxExpr] = args
      const x = Number(await evaluateExpression(xExpr, state))
      const fromMin = Number(await evaluateExpression(fromMinExpr, state))
      const fromMax = Number(await evaluateExpression(fromMaxExpr, state))
      const toMin = Number(await evaluateExpression(toMinExpr, state))
      const toMax = Number(await evaluateExpression(toMaxExpr, state))

      return ((x - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
    }

    case 'trig': {
      if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
      if (!value) throw Error(`No operator provided for "${type}"`)

      const x = Number(await evaluateExpression(args[0], state))

      switch (value) {
        case 'SIN':
          return Math.sin(x)
        case 'COS':
          return Math.cos(x)
        case 'TAN':
          return Math.tan(x)
        case 'ASIN':
          return Math.asin(x)
        case 'ACOS':
          return Math.acos(x)
        case 'ATAN':
          return Math.atan(x)
        default:
          throw Error(`Unknown trig operator: "${value}"`)
      }
    }

    case 'htrig': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)

      const x = Number(await evaluateExpression(args[0], state))

      switch (value) {
        case 'SINH':
          return Math.sinh(x)
        case 'COSH':
          return Math.cosh(x)
        case 'TANH':
          return Math.tanh(x)
        case 'ASINH':
          return Math.asinh(x)
        case 'ACOSH':
          return Math.acosh(x)
        case 'ATANH':
          return Math.atanh(x)
        default:
          throw Error(`Unknown htrig operator: "${value}"`)
      }
    }

    case 'round': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)

      const x = Number(await evaluateExpression(args[0], state))

      switch (value) {
        case 'ROUND':
          return Math.round(x)
        case 'ROUNDUP':
          return Math.ceil(x)
        case 'ROUNDDOWN':
          return Math.floor(x)
        default:
          throw Error(`Unknown round operator: "${value}"`)
      }
    }

    case 'single': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for "${type}"`)

      const x = Number(await evaluateExpression(args[0], state))

      switch (value) {
        case 'ROOT':
          return Math.sqrt(x)
        case 'ABS':
          return Math.abs(x)
        case 'NEG':
          return -x
        case 'LN':
          return Math.log(x)
        case 'LOG10':
          return Math.log10(x)
        case 'EXP':
          return Math.E ** x
        case 'POW10':
          return x ** 10
        default:
          throw Error(`Unknown single operator: "${value}"`)
      }
    }

    case 'atan2': {
      if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
      const x = Number(await evaluateExpression(args[0], state))
      const y = Number(await evaluateExpression(args[1], state))
      return Math.atan2(x, y)
    }

    case 'modulo': {
      if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
      const dividend = Number(await evaluateExpression(args[0], state))
      const divisor = Number(await evaluateExpression(args[1], state))
      return dividend % divisor
    }

    case 'constrain': {
      if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
      const val = Number(await evaluateExpression(args[0], state))
      const low = Number(await evaluateExpression(args[1], state))
      const high = Number(await evaluateExpression(args[2], state))
      return Math.min(Math.max(val, low), high)
    }

    case 'randomfloat': {
      return Math.random()
    }

    case 'randomint': {
      if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
      const from = Number(await evaluateExpression(args[0], state))
      const to = Number(await evaluateExpression(args[1], state))
      const min = Math.min(from, to)
      const max = Math.max(from, to)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    case 'wait': {
      if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
      const ms = Number(await evaluateExpression(args[0], state))
      console.log(`Waiting for ${ms} ms`)
      await new Promise((res) => setTimeout(res, ms))
      return
    }

    case 'repeat': {
      if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
      const times = Number(await evaluateExpression(args[0], state))
      if (children) {
        for (let i = 0; i < times; i++) {
          console.log(`Repeat iteration ${i + 1}/${times}`)
          for (const expr of children) {
            await evaluateExpression(expr, state)
          }
        }
      }
      return
    }

    case 'if': {
      if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
      if (!children) return

      const conditions: boolean[] = []
      for (const condExpr of args) {
        conditions.push(Boolean(await evaluateExpression(condExpr, state)))
      }

      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i] && children[i]) {
          await evaluateExpression(children[i], state)
          return
        }
      }

      const elseBranch = children[conditions.length]
      if (elseBranch) {
        await evaluateExpression(elseBranch, state)
      }
      return
    }

    case 'setposxyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
      const objectId = String(await evaluateExpression(args[0], state))
      const x = Number(await evaluateExpression(args[1], state))
      const y = Number(await evaluateExpression(args[2], state))
      const z = Number(await evaluateExpression(args[3], state))

      const object = objects.get(objectId)
      if (object) {
        object.position.set(x, y, z)
        console.log(`Set position to: ${x}, ${y}, ${z}`)
      } else {
        console.log(`object with id "${objectId}" does not exist.`)
      }
      return
    }

    case 'setscalexyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
      const objectId = String(await evaluateExpression(args[0], state))
      const x = Number(await evaluateExpression(args[1], state))
      const y = Number(await evaluateExpression(args[2], state))
      const z = Number(await evaluateExpression(args[3], state))

      const object = objects.get(objectId)
      if (object) {
        object.scale.set(x, y, z)
        console.log(`Set scale to: ${x}, ${y}, ${z}`)
      } else {
        console.log(`object with id "${objectId}" does not exist.`)
      }
      return
    }

    case 'setroteulerxyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for "${type}"`)
      const objectId = String(await evaluateExpression(args[0], state))
      const x = Number(await evaluateExpression(args[1], state))
      const y = Number(await evaluateExpression(args[2], state))
      const z = Number(await evaluateExpression(args[3], state))

      const object = objects.get(objectId)
      if (object) {
        object.rotation.set(x, y, z)
        console.log(`Set rotation to euler: ${x}, ${y}, ${z}`)
      } else {
        console.log(`object with id "${objectId}" does not exist.`)
      }
      return
    }

    case 'rotatexyz': {
      if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
      const objectId = String(await evaluateExpression(args[0], state))
      const axis = String(await evaluateExpression(args[1], state))
      const angle = Number(await evaluateExpression(args[2], state))

      const object = objects.get(objectId)
      if (object) {
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
        console.log(
          `Rotated object around ${axis} by ${angle}° (${rad} radians)`
        )
      } else {
        console.log(`object with id "${objectId}" does not exist.`)
      }
      return
    }

    case 'translatexyz': {
      if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
      const objectId = String(await evaluateExpression(args[0], state))
      const axis = String(await evaluateExpression(args[1], state))
      let distance = Number(await evaluateExpression(args[2], state))

      if (args.length >= 4) {
        const direction = Number(await evaluateExpression(args[3], state))
        distance = distance * direction
      }

      const object = objects.get(objectId)
      if (object) {
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
        console.log(
          `Translated ${object.name} around ${axis} by ${distance} units`
        )
      } else {
        console.log(`object with id "${objectId}" does not exist.`)
      }
      return
    }

    default: {
      throw new Error(`Unknown expression type: "${type}"`)
    }
  }
}
