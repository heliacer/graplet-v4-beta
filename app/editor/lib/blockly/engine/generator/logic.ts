import { Block } from 'blockly'
import { ExpressionGenerator, generateExprsFromInput } from '.'
import { Expression } from '../ast'

export function repeatGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const valueExpr = generator.getInputValue(block, 'TIMES', 0)
  const exprs: Expression[] = generateExprsFromInput(
    block.getInput('ACTIONS'),
    generator
  )

  return {
    type: 'repeat',
    args: [valueExpr],
    children: exprs
  }
}

export function controlsIfGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const branches: Expression[] = []
  const conditions: Expression[] = []

  let i = 0
  while (block.getInput('IF' + i)) {
    const conditionExpr = generator.getInputValue(block, 'IF' + i, false)
    conditions.push(conditionExpr)
    const doExprs: Expression[] = generateExprsFromInput(
      block.getInput('DO' + i),
      generator
    )
    branches.push({
      type: 'runseq',
      children: doExprs
    })
    i++
  }

  const elseExprs: Expression[] = generateExprsFromInput(
    block.getInput('ELSE'),
    generator
  )
  branches.push({
    type: 'runseq',
    children: elseExprs
  })

  return {
    type: 'if',
    args: conditions,
    children: branches // {[doExprs]} , {[elseExprs]}
  }
}

export function controlsIfElseGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const condition = generator.getInputValue(block, 'IF0', false)
  const doExprs: Expression[] = generateExprsFromInput(
    block.getInput('DO0'),
    generator
  )
  const elseExprs: Expression[] = generateExprsFromInput(
    block.getInput('ELSE'),
    generator
  )

  return {
    type: 'if',
    args: [condition],
    children: [
      { type: 'runseq', children: doExprs },
      { type: 'runseq', children: elseExprs }
    ]
  }
}

export function waitGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const msExpr = generator.getInputValue(block, 'MS', 0)
  return {
    type: 'wait',
    args: [msExpr]
  }
}

export function logicBooleanGen(block: Block): Expression {
  const bool = block.getFieldValue('BOOL') as 'TRUE' | 'FALSE'
  return {
    type: 'literal',
    value: bool === 'TRUE' ? true : false
  }
}

export function logicOperationGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const operator = block.getFieldValue('OP')
  const aExpr = generator.getInputValue(block, 'A', false)
  const bExpr = generator.getInputValue(block, 'B', false)

  return {
    type: 'andor',
    value: operator,
    args: [aExpr, bExpr]
  }
}

export function logicNegateGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const boolExpr = generator.getInputValue(block, 'BOOL', false)
  return {
    type: 'neg',
    args: [boolExpr]
  }
}

export function logicCompareGen(
  block: Block,
  generator: ExpressionGenerator
): Expression {
  const operator = block.getFieldValue('OP')
  const aExpr = generator.getInputValue(block, 'A', 0)
  const bExpr = generator.getInputValue(block, 'B', 0)

  return {
    type: 'compare',
    value: operator,
    args: [aExpr, bExpr]
  }
}
