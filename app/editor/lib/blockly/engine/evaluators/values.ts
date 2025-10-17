import { Expression, ProgramState } from '../ast'
import { checkPoint, evaluateExpression } from '../interpreter'

export function interpLiteral(expression: Expression) {
  const { value } = expression
  if (value === undefined) throw Error('Literal value is undefined')
  return Number.isNaN(Number(value)) ? value : Number(value)
}

export function interpVar(expression: Expression, state: ProgramState) {
  const { value } = expression
  const { variables } = state
  if (!value) throw Error('Variable name is undefined')
  const variable = variables.get(String(value))
  if (variable === undefined) throw Error(`Variable "${value}" not found`)
  return variable
}

export async function interpCall(expression: Expression, state: ProgramState) {
  const { args, value } = expression
  const { functions, runState } = state

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
      if (!(await checkPoint(runState))) return
      const res = await evaluateExpression(expr, state)
      if (res !== undefined) return res
    }
  }
  if (func.args) {
    return await evaluateExpression(func.args[0], state)
  }
  return
}
