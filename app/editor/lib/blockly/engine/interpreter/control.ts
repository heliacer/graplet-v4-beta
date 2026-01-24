import { Expression, ProgramState } from '../ast'
import { evaluateExpression, checkPoint } from '.'

export async function interpMain(expression: Expression, state: ProgramState) {
  const { children } = expression

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
  const promises = runExprs.map(expr => evaluateExpression(expr, state))
  await Promise.all(promises)
  return
}

export async function interpRunseq(
  expression: Expression,
  state: ProgramState
) {
  const { children } = expression
  const { runState } = state

  if (!children) return
  for (const expr of children) {
    if (!(await checkPoint(runState))) return
    await evaluateExpression(expr, state)
  }
  return
}

export async function interpIf(expression: Expression, state: ProgramState) {
  const { args, type, children } = expression
  const { runState } = state

  if (!(await checkPoint(runState))) return
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

export async function interpRepeat(
  expression: Expression,
  state: ProgramState
) {
  const { args, type, children } = expression
  const { runState } = state

  if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
  const times = Number(await evaluateExpression(args[0], state))
  if (children) {
    for (let i = 0; i < times; i++) {
      if (!(await checkPoint(runState))) return
      for (const expr of children) {
        if (!(await checkPoint(runState))) return
        await evaluateExpression(expr, state)
      }
    }
  }
  return
}

export async function interpWait(expression: Expression, state: ProgramState) {
  const { args, type } = expression
  const { runState } = state

  if (!(await checkPoint(runState))) return
  if (!args || args.length < 1) throw Error(`Invalid args for "${type}"`)
  const ms = Number(await evaluateExpression(args[0], state))
  await new Promise(res => setTimeout(res, ms))
  return
}
