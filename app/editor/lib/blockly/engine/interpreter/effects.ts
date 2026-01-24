import { Expression, ProgramState, Value } from '../ast'
import { evaluateExpression } from '.'

export function interpSetfunc(expression: Expression, state: ProgramState) {
  const { args, value, children } = expression
  const { functions } = state

  if (!value) throw Error('Function name is undefined')
  const funcExpr: Expression = {
    type: 'func',
    children,
    args
  }
  functions.set(String(value), funcExpr)
  return
}

export async function interpSetvar(
  expression: Expression,
  state: ProgramState
) {
  const { args, value } = expression
  const { variables } = state

  if (!value) throw Error('Variable name is undefined')
  if (!args || args.length === 0) throw Error('No value provided for setvar')
  const varValue = await evaluateExpression(args[0], state)
  variables.set(String(value), varValue as Value)
  return
}

export async function interpChangevar(
  expression: Expression,
  state: ProgramState
) {
  const { args, value } = expression
  const { variables } = state

  if (!value) throw Error('Variable name is undefined')
  if (!args || args.length === 0) throw Error('No delta provided for changevar')
  const delta = Number(await evaluateExpression(args[0], state))
  const currentValue = Number(variables.get(String(value))) || 0
  variables.set(String(value), currentValue + delta)
  return
}
