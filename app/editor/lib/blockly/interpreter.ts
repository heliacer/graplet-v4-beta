import {
  ProgramState,
  Value,
  Expression
} from '../types'

export async function evaluateExpression(
  expression: Expression,
  state: ProgramState
): Promise<Value | undefined> {
  const { type, args, value, children } = expression
  const { scene, objects, variables, functions } = state

  switch (type) {
    case 'main': {
      if (!children) return // -> empty program (stoopid)
      const runExprs: Expression[] = []
      for (const expr of children) {
        switch (expr.type) {
          // Add to run stack
          case 'runseq':
            runExprs.push(expr)
            break
          // Register Function
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
      // sequentially evaluate children expressions
      for (const expr of children) {
        await evaluateExpression(expr, state)
      }
      return
    }
    
    case 'literal': {
      if (value === undefined) throw Error('Literal value is undefined')
      return value
    }

    case 'var': {
      if (!value) throw Error('Variable name is undefined')
      const variable = variables.get(value as string)
      if (variable === undefined) throw Error(`Variable ${value} not found`)
      return variable
    }

    case 'setvar': {
      if (!value) throw Error('Variable name is undefined')
      if (!args || args.length === 0) throw Error('No value provided for setvar')
      const varValue = await evaluateExpression(args[0], state)
      variables.set(value as string, varValue as Value)
      console.log(`Set variable ${value} to ${varValue}`)
      return
    }

    case 'changevar': {
      if (!value) throw Error('Variable name is undefined')
      if (!args || args.length === 0) throw Error('No delta provided for changevar')
      const delta = await evaluateExpression(args[0], state) as number
      const currentValue = variables.get(value as string) as number || 0
      variables.set(value as string, currentValue + delta)
      console.log(`Changed variable ${value} by ${delta}`)
      return
    }

    case 'setfunc': {
      if (!value) throw Error('Function name is undefined')
      const funcExpr: Expression = {
        type: 'runseq',
        children,
        args, // return value if exists
        value: args && args.length > 0 ? await evaluateExpression(args[0], state) : undefined
      }
      functions.set(value as string, funcExpr)
      console.log(`Registered function ${value}`)
      return
    }

    case 'call': {
      if (!value) throw Error('Function name is undefined')
      const func = functions.get(value as string)
      if (func === undefined) throw Error(`Function ${value} not found`)
      if (args) {
        // set parameters as global variables, expecting them to be setvar
        for (const expr of args) {
          if (expr.type !== 'setvar')
            throw Error(
              `Expected Expression of type setvar but got ${expr.type} instead`
            )
          await evaluateExpression(expr, state)
        }
      }
      if (func.children) {
        // sequentially evaluate inner blocks
        for (const expr of func.children) {
          const res = await evaluateExpression(expr, state)
          if (res !== undefined) return res
        }
      }
      if (func.value !== undefined) {
        return func.value
      }
      return
    }

    case 'andor': {
      if (!args) throw Error(`No args were given to ${type}`)
      if (!value) throw Error(`No value was given to ${type}`)
      
      const [aExpr, bExpr] = args
      const a = await evaluateExpression(aExpr, state)
      const b = await evaluateExpression(bExpr, state)

      switch (value) {
        case 'AND': 
          return a && b
        case 'OR':
          return a || b
        default:
          throw Error(`Unknown andor operator: ${value}`)
      }
    }

    case 'neg': {
      if (!args) throw Error(`No args were given to ${type}`)
      const [boolExpr] = args
      const bool = await evaluateExpression(boolExpr, state)
      return !bool
    }

    case 'compare': {
      if (!args || args.length < 2) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const [aExpr, bExpr] = args
      const a = await evaluateExpression(aExpr, state)
      const b = await evaluateExpression(bExpr, state)

      switch (value) {
        case 'EQ': return a == b
        case 'NEQ': return a != b
        case 'LT': return (a as number) < (b as number)
        case 'LTE': return (a as number) <= (b as number)
        case 'GT': return (a as number) > (b as number)
        case 'GTE': return (a as number) >= (b as number)
        default: throw Error(`Unknown compare operator: ${value}`)
      }
    }

    case 'arithmetic': {
      if (!args || args.length < 2) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const [aExpr, bExpr] = args
      const a = await evaluateExpression(aExpr, state) as number
      const b = await evaluateExpression(bExpr, state) as number

      switch (value) {
        case 'ADD': return a + b
        case 'MINUS': return a - b
        case 'MULTIPLY': return a * b
        case 'DIVIDE': return a / b
        case 'POWER': return a ** b
        default: throw Error(`Unknown arithmetic operator: ${value}`)
      }
    }

    case 'map': {
      if (!args || args.length < 5) throw Error(`Invalid args for ${type}`)
      const [xExpr, fromMinExpr, fromMaxExpr, toMinExpr, toMaxExpr] = args
      const x = await evaluateExpression(xExpr, state) as number
      const fromMin = await evaluateExpression(fromMinExpr, state) as number
      const fromMax = await evaluateExpression(fromMaxExpr, state) as number
      const toMin = await evaluateExpression(toMinExpr, state) as number
      const toMax = await evaluateExpression(toMaxExpr, state) as number
      
      return ((x - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
    }

    case 'trig': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const x = await evaluateExpression(args[0], state) as number
      
      switch (value) {
        case 'SIN': return Math.sin(x)
        case 'COS': return Math.cos(x)
        case 'TAN': return Math.tan(x)
        case 'ASIN': return Math.asin(x)
        case 'ACOS': return Math.acos(x)
        case 'ATAN': return Math.atan(x)
        default: throw Error(`Unknown trig operator: ${value}`)
      }
    }

    case 'htrig': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const x = await evaluateExpression(args[0], state) as number
      
      switch (value) {
        case 'SINH': return Math.sinh(x)
        case 'COSH': return Math.cosh(x)
        case 'TANH': return Math.tanh(x)
        case 'ASINH': return Math.asinh(x)
        case 'ACOSH': return Math.acosh(x)
        case 'ATANH': return Math.atanh(x)
        default: throw Error(`Unknown htrig operator: ${value}`)
      }
    }

    case 'round': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const x = await evaluateExpression(args[0], state) as number
      
      switch (value) {
        case 'ROUND': return Math.round(x)
        case 'ROUNDUP': return Math.ceil(x)
        case 'ROUNDDOWN': return Math.floor(x)
        default: throw Error(`Unknown round operator: ${value}`)
      }
    }

    case 'single': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!value) throw Error(`No operator provided for ${type}`)
      
      const x = await evaluateExpression(args[0], state) as number
      
      switch (value) {
        case 'ROOT': return Math.sqrt(x)
        case 'ABS': return Math.abs(x)
        case 'NEG': return -x
        case 'LN': return Math.log(x)
        case 'LOG10': return Math.log10(x)
        case 'EXP': return Math.E ** x
        case 'POW10': return x ** 10
        default: throw Error(`Unknown single operator: ${value}`)
      }
    }

    case 'atan2': {
      if (!args || args.length < 2) throw Error(`Invalid args for ${type}`)
      const x = await evaluateExpression(args[0], state) as number
      const y = await evaluateExpression(args[1], state) as number
      return Math.atan2(x, y)
    }

    case 'modulo': {
      if (!args || args.length < 2) throw Error(`Invalid args for ${type}`)
      const dividend = await evaluateExpression(args[0], state) as number
      const divisor = await evaluateExpression(args[1], state) as number
      return dividend % divisor
    }

    case 'constrain': {
      if (!args || args.length < 3) throw Error(`Invalid args for ${type}`)
      const val = await evaluateExpression(args[0], state) as number
      const low = await evaluateExpression(args[1], state) as number
      const high = await evaluateExpression(args[2], state) as number
      return Math.min(Math.max(val, low), high)
    }

    case 'randomfloat': {
      return Math.random()
    }

    case 'randomint': {
      if (!args || args.length < 2) throw Error(`Invalid args for ${type}`)
      const from = await evaluateExpression(args[0], state) as number
      const to = await evaluateExpression(args[1], state) as number
      const min = Math.min(from, to)
      const max = Math.max(from, to)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    case 'wait': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      const ms = await evaluateExpression(args[0], state) as number
      console.log(`Waiting for ${ms} ms`)
      await new Promise((res) => setTimeout(res, ms))
      return
    }

    case 'repeat': {
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      const times = await evaluateExpression(args[0], state) as number
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
      if (!args || args.length < 1) throw Error(`Invalid args for ${type}`)
      if (!children) return
      
      // Evaluate conditions
      const conditions: boolean[] = []
      for (const condExpr of args) {
        conditions.push(await evaluateExpression(condExpr, state) as boolean)
      }
      
      // Find first true condition and execute corresponding branch
      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i] && children[i]) {
          await evaluateExpression(children[i], state)
          return
        }
      }
      
      // Execute else branch if exists
      const elseBranch = children[conditions.length]
      if (elseBranch) {
        await evaluateExpression(elseBranch, state)
      }
      return
    }

    case 'setposxyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for ${type}`)
      const objectId = await evaluateExpression(args[0], state) as string
      const x = await evaluateExpression(args[1], state) as number
      const y = await evaluateExpression(args[2], state) as number
      const z = await evaluateExpression(args[3], state) as number
      
      const object = objects.get(objectId)
      if (object) {
        object.position.set(x, y, z)
        console.log(`Set position to: ${x}, ${y}, ${z}`)
      } else {
        console.log(`${objectId} does not exist.`)
      }
      return
    }

    case 'setscalexyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for ${type}`)
      const objectId = await evaluateExpression(args[0], state) as string
      const x = await evaluateExpression(args[1], state) as number
      const y = await evaluateExpression(args[2], state) as number
      const z = await evaluateExpression(args[3], state) as number
      
      const object = objects.get(objectId)
      if (object) {
        object.scale.set(x, y, z)
        console.log(`Set scale to: ${x}, ${y}, ${z}`)
      } else {
        console.log(`${objectId} does not exist.`)
      }
      return
    }

    case 'setroteulerxyz': {
      if (!args || args.length < 4) throw Error(`Invalid args for ${type}`)
      const objectId = await evaluateExpression(args[0], state) as string
      const x = await evaluateExpression(args[1], state) as number
      const y = await evaluateExpression(args[2], state) as number
      const z = await evaluateExpression(args[3], state) as number
      
      const object = objects.get(objectId)
      if (object) {
        object.rotation.set(x, y, z)
        console.log(`Set rotation to euler: ${x}, ${y}, ${z}`)
      } else {
        console.log(`${objectId} does not exist.`)
      }
      return
    }

    case 'rotatexyz': {
      if (!args || args.length < 3) throw Error(`Invalid args for ${type}`)
      const objectId = await evaluateExpression(args[0], state) as string
      const axis = await evaluateExpression(args[1], state) as string
      const angle = await evaluateExpression(args[2], state) as number
      
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
        console.log(`Rotated object around ${axis} by ${angle}° (${rad} radians)`)
      } else {
        console.log(`${objectId} does not exist.`)
      }
      return
    }

    case 'translatexyz': {
      if (!args || args.length < 3) throw Error(`Invalid args for ${type}`)
      const objectId = await evaluateExpression(args[0], state) as string
      const axis = await evaluateExpression(args[1], state) as string
      let distance = await evaluateExpression(args[2], state) as number
      
      // Handle direction multiplier if present
      if (args.length >= 4) {
        const direction = await evaluateExpression(args[3], state) as number
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
        console.log(`Translated ${object.name} around ${axis} by ${distance} units`)
      } else {
        console.log(`${objectId} does not exist.`)
      }
      return
    }

    default: {
      throw new Error(`Unknown expression type: ${type}`)
    }
  }
}
