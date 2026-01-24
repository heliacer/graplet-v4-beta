import { Expression, ProgramState, Value } from '../ast'
import { evaluateExpression } from '.'

export async function interpAndor(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, value, args } = expression

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

export async function interpNeg(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args) throw Error(`No args were given to "${type}"`)
  const [boolExpr] = args
  const bool = Boolean(await evaluateExpression(boolExpr, state))
  return !bool
}

export async function interpCompare(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

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

export async function interpArithmetic(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

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

export async function interpMap(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args || args.length < 5) throw Error(`Invalid args for "${type}"`)
  const [xExpr, fromMinExpr, fromMaxExpr, toMinExpr, toMaxExpr] = args
  const x = Number(await evaluateExpression(xExpr, state))
  const fromMin = Number(await evaluateExpression(fromMinExpr, state))
  const fromMax = Number(await evaluateExpression(fromMaxExpr, state))
  const toMin = Number(await evaluateExpression(toMinExpr, state))
  const toMax = Number(await evaluateExpression(toMaxExpr, state))

  return ((x - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
}

export async function interpTrig(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

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

export async function interpHtrig(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

  if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
  if (!value) throw Error(`No operator provided for "${type}"`)

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

export async function interpRound(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

  if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
  if (!value) throw Error(`No operator provided for "${type}"`)

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

export async function interpSingle(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args, value } = expression

  if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
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

export async function interpAtan2(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
  const x = Number(await evaluateExpression(args[0], state))
  const y = Number(await evaluateExpression(args[1], state))
  return Math.atan2(x, y)
}

export async function interpModulo(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
  const dividend = Number(await evaluateExpression(args[0], state))
  const divisor = Number(await evaluateExpression(args[1], state))
  return dividend % divisor
}

export async function interpConstrain(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args || args.length < 3) throw Error(`Invalid args for "${type}"`)
  const val = Number(await evaluateExpression(args[0], state))
  const low = Number(await evaluateExpression(args[1], state))
  const high = Number(await evaluateExpression(args[2], state))
  return Math.min(Math.max(val, low), high)
}

export function interpRandomfloat(): Value {
  return Math.random()
}

export async function interpRandomint(
  expression: Expression,
  state: ProgramState
): Promise<Value> {
  const { type, args } = expression

  if (!args || args.length < 2) throw Error(`Invalid args for "${type}"`)
  const from = Number(await evaluateExpression(args[0], state))
  const to = Number(await evaluateExpression(args[1], state))
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
